/* Castro Intelligence — Consent Mode v2 */
(function(){
  "use strict";
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments);};
  var KEY="ci_consent_v2";
  var defaults={analytics:false,marketing:false};
  var current=defaults;
  function state(p){
    return {
      ad_storage:p.marketing?"granted":"denied",
      analytics_storage:p.analytics?"granted":"denied",
      ad_user_data:p.marketing?"granted":"denied",
      ad_personalization:p.marketing?"granted":"denied",
      personalization_storage:p.marketing?"granted":"denied",
      functionality_storage:"granted",
      security_storage:"granted"
    };
  }
  gtag("consent","default",Object.assign(state(defaults),{wait_for_update:500}));
  gtag("set","ads_data_redaction",true);
  gtag("set","url_passthrough",true);
  function read(){try{return JSON.parse(localStorage.getItem(KEY));}catch(e){return null;}}
  function save(p){localStorage.setItem(KEY,JSON.stringify(p));}
  function apply(p,persist){
    p={analytics:!!p.analytics,marketing:!!p.marketing};
    current=p;
    gtag("consent","update",state(p));
    if(persist) save(p);
    dataLayer.push({event:"consent_update",consent_analytics:p.analytics?"granted":"denied",consent_marketing:p.marketing?"granted":"denied"});
    if(typeof window.clarity==="function"){window.clarity("consentv2",{analytics_Storage:p.analytics?"granted":"denied",ad_Storage:p.marketing?"granted":"denied"});}
    var b=document.getElementById("ciConsent"); if(b) b.hidden=true;
  }
  var stored=read(); if(stored) apply(stored,false);
  function render(force){
    if(document.getElementById("ciConsent")) {document.getElementById("ciConsent").hidden=false;return;}
    if(stored && !force) return;
    var el=document.createElement("section"); el.id="ciConsent"; el.className="consent-panel"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); el.setAttribute("aria-labelledby","ciConsentTitle");
    el.innerHTML='<div class="consent-copy"><strong id="ciConsentTitle">Privacidade e mensuração</strong><p>Usamos cookies opcionais para medir desempenho e melhorar o site. Você pode aceitar, rejeitar ou permitir apenas analytics. <a href="/privacidade.html">Ver política</a>.</p></div><div class="consent-actions"><button type="button" class="btn btn-ghost" data-consent="reject">Rejeitar opcionais</button><button type="button" class="btn btn-ghost" data-consent="analytics">Só analytics</button><button type="button" class="btn btn-primary" data-consent="accept">Aceitar todos</button></div>';
    document.body.appendChild(el);
    el.addEventListener("click",function(e){var v=e.target.getAttribute("data-consent");if(!v)return;if(v==="accept")apply({analytics:true,marketing:true},true);if(v==="analytics")apply({analytics:true,marketing:false},true);if(v==="reject")apply({analytics:false,marketing:false},true);stored=read();});
  }
  document.addEventListener("DOMContentLoaded",function(){render(false);document.querySelectorAll("[data-consent-settings]").forEach(function(b){b.addEventListener("click",function(){render(true);});});});
  window.CIConsent={show:function(){render(true);},update:function(p){apply(p,true);},reset:function(){localStorage.removeItem(KEY);stored=null;render(true);},get:function(){return current;},replayClarity:function(){if(typeof window.clarity==="function"){window.clarity("consentv2",{analytics_Storage:current.analytics?"granted":"denied",ad_Storage:current.marketing?"granted":"denied"});}}};
})();
