/* ═══ app-analytics.js — PostHog event tracking ═══════════════════════════
   Expone window.ph(event, props) y window.phIdentify(userId, email).
   Todo es no-op si PostHog no carga (adblocker, offline). La app no depende
   de este archivo para funcionar.
════════════════════════════════════════════════════════════════════════════ */

(function() {
  // PostHog snippet inline — se carga de forma asíncrona
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init('POSTHOG_API_KEY', {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    autocapture: false,
    session_recording: { maskAllInputs: true }
  });
})();

// ── API pública ───────────────────────────────────────────────────────────────

window.ph = function(event, props) {
  try {
    if (typeof posthog === 'undefined' || !posthog.capture) return;
    posthog.capture(event, props || {});
  } catch(e) { /* silencioso */ }
};

window.phIdentify = function(userId, email) {
  try {
    if (typeof posthog === 'undefined' || !posthog.identify) return;
    posthog.identify(userId, { email: email });
  } catch(e) { /* silencioso */ }
};
