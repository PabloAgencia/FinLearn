// Comprehensive analyzer for app-data.js MODULES array
const fs = require('fs');

// Read and eval the file to get the MODULES array
const code = fs.readFileSync('E:/Escritorio/FINLEARN/app-data.js', 'utf8');

// We need to extract MODULES. The file uses const MODULES = [...].
// Let's eval it in a controlled way.
let MODULES;
try {
  // Replace const with var so we can access it, and wrap in a function
  const modified = code.replace('const MODULES', 'var MODULES');
  eval(modified);
} catch(e) {
  console.log('SYNTAX ERROR during eval:', e.message);
  console.log('Location hint:', e.stack.split('\n').slice(0,5).join('\n'));
}

if (!MODULES) {
  console.log('FATAL: Could not parse MODULES array');
  process.exit(1);
}

console.log(`Total modules found: ${MODULES.length}`);
console.log('='.repeat(80));

const issues = [];
const validTagC = ['green', 'blue', 'purple', 'orange', 'red'];
const requiredModuleFields = ['id', 'icon', 'title', 'desc', 'xp', 'tag', 'tagC', 'users', 'steps'];
const requiredContentFields = ['type', 'title']; // tag is optional per observation
const requiredQuizFieldsOldFormat = ['type', 'q', 'opts', 'ok', 'bad']; // old format with ok/bad
const requiredQuizFieldsNewFormat = ['type', 'q', 'opts', 'ans', 'exp']; // new format with ans/exp

// Helper: find approximate line number for a module
function findLineNumber(text, moduleId) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // Look for the id field definition
    if (lines[i].match(new RegExp(`\\bid\\s*:\\s*${moduleId}\\b`)) &&
        (lines[i].includes('icon') || lines[i-1]?.includes('{') || lines[i+1]?.includes('icon'))) {
      return i + 1;
    }
  }
  return '?';
}

// Get all line numbers for modules
const moduleLines = {};
const fileLines = code.split('\n');
for (let i = 0; i < fileLines.length; i++) {
  const match = fileLines[i].match(/\bid\s*:\s*(\d+)\s*,/);
  if (match) {
    const id = parseInt(match[1]);
    if (!moduleLines[id]) moduleLines[id] = [];
    moduleLines[id].push(i + 1);
  }
}

// ═══ CHECK 1: Duplicate IDs ═══
console.log('\n1. DUPLICATE MODULE IDs');
console.log('-'.repeat(40));
const idCounts = {};
MODULES.forEach((m, idx) => {
  if (m.id !== undefined) {
    if (!idCounts[m.id]) idCounts[m.id] = [];
    idCounts[m.id].push(idx);
  }
});
let dupFound = false;
Object.entries(idCounts).forEach(([id, indices]) => {
  if (indices.length > 1) {
    dupFound = true;
    const lines = moduleLines[id] || ['?'];
    console.log(`  DUPLICATE id:${id} appears ${indices.length} times at array indices [${indices.join(', ')}], lines: [${lines.join(', ')}]`);
    issues.push(`Duplicate id:${id}`);
  }
});
if (!dupFound) console.log('  No duplicates found.');

// ═══ CHECK 2: Missing required module fields ═══
console.log('\n2. MODULES WITH MISSING REQUIRED FIELDS');
console.log('-'.repeat(40));
let missingFound = false;
MODULES.forEach((m, idx) => {
  const missing = requiredModuleFields.filter(f => m[f] === undefined || m[f] === null);
  if (missing.length > 0) {
    missingFound = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (index ${idx}, ~line ${line}): missing [${missing.join(', ')}]`);
    issues.push(`Module id:${m.id} missing fields: ${missing.join(', ')}`);
  }
  // Check for empty strings
  const empties = requiredModuleFields.filter(f => m[f] === '');
  if (empties.length > 0) {
    missingFound = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (index ${idx}, ~line ${line}): EMPTY fields [${empties.join(', ')}]`);
    issues.push(`Module id:${m.id} empty fields: ${empties.join(', ')}`);
  }
});
if (!missingFound) console.log('  All modules have required fields.');

// ═══ CHECK 3: Quiz steps where 'ans' is out of range ═══
console.log('\n3. QUIZ STEPS WITH ans OUT OF RANGE (new format)');
console.log('-'.repeat(40));
let ansIssueFound = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  m.steps.forEach((s, sIdx) => {
    if (s.type === 'quiz' && s.ans !== undefined) {
      if (s.opts && (s.ans < 0 || s.ans >= s.opts.length)) {
        ansIssueFound = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: ans=${s.ans} but opts has ${s.opts.length} items (valid: 0-${s.opts.length - 1})`);
        issues.push(`Module id:${m.id} step ${sIdx}: ans out of range`);
      }
    }
  });
});
if (!ansIssueFound) console.log('  No ans-out-of-range issues found.');

// Also check old format quizzes (with ok:true/false on opts)
console.log('\n3b. QUIZ STEPS (old format) - checking opts have exactly one ok:true');
console.log('-'.repeat(40));
let oldQuizIssue = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  m.steps.forEach((s, sIdx) => {
    if (s.type === 'quiz' && s.opts && s.ans === undefined) {
      // Old format - check ok:true count
      const trueCount = s.opts.filter(o => o.ok === true).length;
      if (trueCount !== 1) {
        oldQuizIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: has ${trueCount} correct answers (expected 1)`);
        issues.push(`Module id:${m.id} step ${sIdx}: ${trueCount} correct answers`);
      }
    }
  });
});
if (!oldQuizIssue) console.log('  All old-format quizzes have exactly 1 correct answer.');

// ═══ CHECK 4: Empty/missing content in content steps ═══
console.log('\n4. CONTENT STEPS WITH EMPTY/MISSING CONTENT');
console.log('-'.repeat(40));
let emptyContent = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  m.steps.forEach((s, sIdx) => {
    if (s.type === 'content') {
      if (!s.blocks || s.blocks.length === 0) {
        emptyContent = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: content step has NO blocks`);
        issues.push(`Module id:${m.id} step ${sIdx}: no blocks`);
      } else {
        s.blocks.forEach((b, bIdx) => {
          if (b.t === 'text' && (!b.p || b.p.trim() === '')) {
            emptyContent = true;
            const line = moduleLines[m.id]?.[0] || '?';
            console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}, block ${bIdx}: text block with empty/missing p`);
            issues.push(`Module id:${m.id} step ${sIdx} block ${bIdx}: empty text`);
          }
          if (b.t === 'hl' && (!b.p || b.p.trim() === '')) {
            emptyContent = true;
            const line = moduleLines[m.id]?.[0] || '?';
            console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}, block ${bIdx}: highlight block with empty/missing p`);
            issues.push(`Module id:${m.id} step ${sIdx} block ${bIdx}: empty highlight`);
          }
          if (b.t === 'stats' && (!b.items || b.items.length === 0)) {
            emptyContent = true;
            const line = moduleLines[m.id]?.[0] || '?';
            console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}, block ${bIdx}: stats block with no items`);
            issues.push(`Module id:${m.id} step ${sIdx} block ${bIdx}: empty stats`);
          }
        });
      }
      if (!s.title || s.title.trim() === '') {
        emptyContent = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: content step missing title`);
        issues.push(`Module id:${m.id} step ${sIdx}: missing title`);
      }
    }
  });
});
if (!emptyContent) console.log('  All content steps have content.');

// ═══ CHECK 5: Inconsistent tagC values ═══
console.log('\n5. INCONSISTENT tagC VALUES');
console.log('-'.repeat(40));
let tagCIssue = false;
const tagCUsage = {};
MODULES.forEach((m, idx) => {
  if (!tagCUsage[m.tagC]) tagCUsage[m.tagC] = [];
  tagCUsage[m.tagC].push(m.id);
  if (!validTagC.includes(m.tagC)) {
    tagCIssue = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (~line ${line}): tagC='${m.tagC}' is NOT in valid set [${validTagC.join(', ')}]`);
    issues.push(`Module id:${m.id}: invalid tagC '${m.tagC}'`);
  }
});
console.log('  tagC distribution:');
Object.entries(tagCUsage).sort().forEach(([tc, ids]) => {
  const valid = validTagC.includes(tc) ? 'OK' : 'INVALID';
  console.log(`    '${tc}': ${ids.length} modules [${valid}]`);
});
if (!tagCIssue) console.log('  All tagC values are valid.');

// ═══ CHECK 6: Modules with no quiz steps ═══
console.log('\n6. MODULES WITH NO QUIZ STEPS');
console.log('-'.repeat(40));
let noQuizFound = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  const quizSteps = m.steps.filter(s => s.type === 'quiz');
  if (quizSteps.length === 0) {
    noQuizFound = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (~line ${line}): "${m.title}" — NO quiz steps`);
    issues.push(`Module id:${m.id}: no quiz steps`);
  }
});
if (!noQuizFound) console.log('  All modules have at least one quiz step.');

// ═══ CHECK 7: Modules with no content steps ═══
console.log('\n7. MODULES WITH NO CONTENT STEPS');
console.log('-'.repeat(40));
let noContentFound = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  const contentSteps = m.steps.filter(s => s.type === 'content');
  if (contentSteps.length === 0) {
    noContentFound = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (~line ${line}): "${m.title}" — NO content steps`);
    issues.push(`Module id:${m.id}: no content steps`);
  }
});
if (!noContentFound) console.log('  All modules have at least one content step.');

// ═══ CHECK 8: Syntax / malformed objects ═══
console.log('\n8. SYNTAX / MALFORMED OBJECT CHECKS');
console.log('-'.repeat(40));
let malformedFound = false;
MODULES.forEach((m, idx) => {
  // Check module is an object
  if (typeof m !== 'object' || m === null || Array.isArray(m)) {
    malformedFound = true;
    console.log(`  Index ${idx}: module is not a valid object (type: ${typeof m})`);
    issues.push(`Index ${idx}: not a valid object`);
    return;
  }
  // Check steps is an array
  if (m.steps && !Array.isArray(m.steps)) {
    malformedFound = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (~line ${line}): steps is not an array`);
    issues.push(`Module id:${m.id}: steps not an array`);
    return;
  }
  // Check each step is an object with a type
  if (m.steps) {
    m.steps.forEach((s, sIdx) => {
      if (typeof s !== 'object' || s === null) {
        malformedFound = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: step is not a valid object`);
        issues.push(`Module id:${m.id} step ${sIdx}: not a valid object`);
      }
      if (s && !s.type) {
        malformedFound = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: step has no 'type' field`);
        issues.push(`Module id:${m.id} step ${sIdx}: no type`);
      }
      if (s && s.type && !['content', 'quiz', 'final'].includes(s.type)) {
        malformedFound = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: unknown step type '${s.type}'`);
        issues.push(`Module id:${m.id} step ${sIdx}: unknown type '${s.type}'`);
      }
      // Check quiz opts are arrays
      if (s && s.type === 'quiz') {
        if (!s.opts || !Array.isArray(s.opts)) {
          malformedFound = true;
          const line = moduleLines[m.id]?.[0] || '?';
          console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz has no opts array`);
          issues.push(`Module id:${m.id} step ${sIdx}: no opts`);
        } else if (s.opts.length === 0) {
          malformedFound = true;
          const line = moduleLines[m.id]?.[0] || '?';
          console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz has empty opts array`);
          issues.push(`Module id:${m.id} step ${sIdx}: empty opts`);
        }
      }
    });
  }
  // Check xp is a number
  if (m.xp !== undefined && typeof m.xp !== 'number') {
    malformedFound = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (~line ${line}): xp is not a number (${typeof m.xp}: ${m.xp})`);
    issues.push(`Module id:${m.id}: xp not a number`);
  }
  // Check id is a number
  if (m.id !== undefined && typeof m.id !== 'number') {
    malformedFound = true;
    console.log(`  Index ${idx}: id is not a number (${typeof m.id}: ${m.id})`);
    issues.push(`Index ${idx}: id not a number`);
  }
});
if (!malformedFound) console.log('  No malformed objects found.');

// ═══ CHECK 9: Steps with missing required fields ═══
console.log('\n9. STEPS WITH MISSING REQUIRED FIELDS');
console.log('-'.repeat(40));
let stepFieldIssue = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  m.steps.forEach((s, sIdx) => {
    if (!s || !s.type) return; // already reported

    if (s.type === 'content') {
      // Required: type, title (tag is optional as seen in many modules)
      if (!s.title) {
        // already checked in #4, skip duplicate
      }
      // blocks should exist
      if (!s.blocks) {
        // already checked in #4
      }
    }

    if (s.type === 'quiz') {
      // Check for required quiz fields
      // Two formats exist: old (opts with ok:true/false, ok/bad strings) and new (ans index, exp)
      const hasAns = s.ans !== undefined;
      const hasExp = s.exp !== undefined;
      const hasOk = s.ok !== undefined;
      const hasBad = s.bad !== undefined;

      if (!s.q || (typeof s.q === 'string' && s.q.trim() === '')) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz missing 'q' (question)`);
        issues.push(`Module id:${m.id} step ${sIdx}: quiz missing q`);
      }

      // If new format, check ans and exp
      if (hasAns && !hasExp) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz has 'ans' but missing 'exp'`);
        issues.push(`Module id:${m.id} step ${sIdx}: has ans but no exp`);
      }

      // If old format, check ok and bad
      if (!hasAns && hasOk && !hasBad) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz has 'ok' but missing 'bad'`);
        issues.push(`Module id:${m.id} step ${sIdx}: has ok but no bad`);
      }
      if (!hasAns && !hasOk && hasBad) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz has 'bad' but missing 'ok'`);
        issues.push(`Module id:${m.id} step ${sIdx}: has bad but no ok`);
      }

      // Check if quiz has NEITHER format for feedback
      if (!hasAns && !hasOk && !hasExp) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: quiz has NO feedback mechanism (no ok/bad, no ans/exp)`);
        issues.push(`Module id:${m.id} step ${sIdx}: no feedback`);
      }
    }

    if (s.type === 'final') {
      if (s.xp === undefined) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: final step missing 'xp'`);
        issues.push(`Module id:${m.id} step ${sIdx}: final missing xp`);
      }
      if (!s.msg) {
        stepFieldIssue = true;
        const line = moduleLines[m.id]?.[0] || '?';
        console.log(`  Module id:${m.id} (~line ${line}), step ${sIdx}: final step missing 'msg'`);
        issues.push(`Module id:${m.id} step ${sIdx}: final missing msg`);
      }
    }
  });
});
if (!stepFieldIssue) console.log('  All steps have required fields.');

// ═══ CHECK 10: ID sequence ═══
console.log('\n10. ID SEQUENCE CHECK');
console.log('-'.repeat(40));
const allIds = MODULES.map(m => m.id).filter(id => id !== undefined).sort((a,b) => a-b);
const uniqueIds = [...new Set(allIds)];
console.log(`  ID range: ${uniqueIds[0]} to ${uniqueIds[uniqueIds.length - 1]}`);
console.log(`  Total unique IDs: ${uniqueIds.length}`);
console.log(`  Expected count (0 to ${uniqueIds[uniqueIds.length - 1]}): ${uniqueIds[uniqueIds.length - 1] + 1}`);

// Find gaps
const gaps = [];
for (let i = uniqueIds[0]; i <= uniqueIds[uniqueIds.length - 1]; i++) {
  if (!uniqueIds.includes(i)) {
    gaps.push(i);
    issues.push(`Missing id:${i} in sequence`);
  }
}
if (gaps.length > 0) {
  console.log(`  MISSING IDs in sequence: [${gaps.join(', ')}]`);
} else {
  console.log('  No gaps in ID sequence.');
}

// Check if IDs are in order in the array
let outOfOrder = [];
for (let i = 1; i < MODULES.length; i++) {
  if (MODULES[i].id <= MODULES[i-1].id) {
    outOfOrder.push({prev: MODULES[i-1].id, curr: MODULES[i].id, index: i});
  }
}
if (outOfOrder.length > 0) {
  console.log('  OUT OF ORDER modules:');
  outOfOrder.forEach(o => {
    console.log(`    Index ${o.index}: id:${o.curr} follows id:${o.prev}`);
  });
}

// ═══ ADDITIONAL CHECKS ═══
console.log('\n11. ADDITIONAL CHECKS');
console.log('-'.repeat(40));

// Check for modules with tag field missing on steps
let tagOnSteps = false;
MODULES.forEach((m) => {
  if (!m.steps) return;
  // Only the first content step typically has a tag
  const contentSteps = m.steps.filter(s => s.type === 'content');
  // Check quiz steps for missing 'tag' field (user asked about this)
  m.steps.forEach((s, sIdx) => {
    if (s.type === 'quiz' && s.tag !== undefined) {
      // Quiz with a tag - unusual but not necessarily wrong
    }
  });
});

// Check for final steps
let finalStepIssues = false;
MODULES.forEach((m, idx) => {
  if (!m.steps) return;
  const finals = m.steps.filter(s => s.type === 'final');
  if (finals.length === 0) {
    console.log(`  Module id:${m.id}: NO final step`);
    issues.push(`Module id:${m.id}: no final step`);
    finalStepIssues = true;
  } else if (finals.length > 1) {
    console.log(`  Module id:${m.id}: ${finals.length} final steps (expected 1)`);
    issues.push(`Module id:${m.id}: multiple final steps`);
    finalStepIssues = true;
  }
  // Check if final step is actually last
  if (m.steps.length > 0 && m.steps[m.steps.length - 1].type !== 'final') {
    console.log(`  Module id:${m.id}: last step is not 'final' (it's '${m.steps[m.steps.length-1].type}')`);
    issues.push(`Module id:${m.id}: last step not final`);
    finalStepIssues = true;
  }
});
if (!finalStepIssues) console.log('  All modules have exactly one final step at the end.');

// Check xp consistency between module and final step
console.log('\n12. XP CONSISTENCY (module.xp vs final step.xp)');
console.log('-'.repeat(40));
let xpMismatch = false;
MODULES.forEach((m) => {
  if (!m.steps) return;
  const finalStep = m.steps.find(s => s.type === 'final');
  if (finalStep && finalStep.xp !== m.xp) {
    xpMismatch = true;
    const line = moduleLines[m.id]?.[0] || '?';
    console.log(`  Module id:${m.id} (~line ${line}): module.xp=${m.xp} but final.xp=${finalStep.xp}`);
    issues.push(`Module id:${m.id}: xp mismatch (module=${m.xp}, final=${finalStep.xp})`);
  }
});
if (!xpMismatch) console.log('  All module XP values match their final step XP.');

// Count quiz format usage
console.log('\n13. QUIZ FORMAT ANALYSIS');
console.log('-'.repeat(40));
let oldFormat = 0, newFormat = 0, mixedFormat = 0;
MODULES.forEach((m) => {
  if (!m.steps) return;
  m.steps.forEach((s) => {
    if (s.type === 'quiz') {
      const hasAns = s.ans !== undefined;
      const hasOk = s.ok !== undefined;
      if (hasAns && hasOk) mixedFormat++;
      else if (hasAns) newFormat++;
      else if (hasOk) oldFormat++;
    }
  });
});
console.log(`  Old format (ok/bad with opts.ok:true/false): ${oldFormat}`);
console.log(`  New format (ans index, exp): ${newFormat}`);
console.log(`  Mixed (both formats): ${mixedFormat}`);

// Check for 'tag' field consistency across modules
console.log('\n14. MODULE TAG VALUES');
console.log('-'.repeat(40));
const tagUsage = {};
MODULES.forEach((m) => {
  if (!tagUsage[m.tag]) tagUsage[m.tag] = [];
  tagUsage[m.tag].push(m.id);
});
Object.entries(tagUsage).sort().forEach(([tag, ids]) => {
  console.log(`  '${tag}': ${ids.length} modules`);
});

// ═══ SUMMARY ═══
console.log('\n' + '='.repeat(80));
console.log(`SUMMARY: ${issues.length} total issues found`);
console.log('='.repeat(80));
issues.forEach((issue, i) => {
  console.log(`  ${i+1}. ${issue}`);
});
