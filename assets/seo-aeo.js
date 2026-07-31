/* Castro Intelligence — SEO/AEO e contexto de mensuração */
(function(){
  "use strict";
  var root=document.documentElement;
  var base="https://castrointelligence.com.br";
  var path=window.location.pathname || "/";
  if(path==="/index.html") path="/";
  var canonical=base+path.replace(/\/+/g,"/");
  var link=document.querySelector('link[rel="canonical"]');
  if(link) link.href=canonical;
  var og=document.querySelector('meta[property="og:url"]');
  if(og) og.content=canonical;
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({
    event:"page_context",
    page_type:root.dataset.pageType||"content",
    page_name:root.dataset.pageName||path,
    product_name:root.dataset.product||undefined,
    funnel_stage:root.dataset.funnelStage||undefined,
    page_canonical:canonical,
    company:"Castro Intelligence"
  });
})();
