/* Fű-Fa-Virág GA4: consent-first analytics. No Google request before opt-in. */
(function(){
  'use strict';
  var MEASUREMENT_ID='G-QG1WYTXSSK';
  var STORAGE_KEY='ffv-analytics-consent-v1';
  var started=false;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{
    analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
    wait_for_update:500
  });
  function readChoice(){try{return localStorage.getItem(STORAGE_KEY);}catch(e){return null;}}
  function saveChoice(value){try{localStorage.setItem(STORAGE_KEY,value);}catch(e){/* storage blocked */}}
  function startAnalytics(){
    if(started)return;
    started=true;
    window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',MEASUREMENT_ID,{send_page_view:true});
    var script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }
  function ready(){
    var panel=document.createElement('section');
    panel.className='ffv-consent-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','Analitikai sütik beállítása');
    panel.hidden=true;
    panel.innerHTML='<h2>Adatvédelmi beállítások</h2><p>Az oldal működéséhez szükséges technológiák mellett, az Ön engedélyével Google Analytics segítségével anonim jellegű látogatottsági statisztikákat készítünk. Az analitikai mérés elutasítható, és a választás bármikor módosítható.</p><div class="ffv-consent-actions"><button type="button" class="ffv-reject">Elutasítom</button><button type="button" class="ffv-accept">Elfogadom</button></div>';
    var settings=document.createElement('button');
    settings.type='button';settings.className='ffv-consent-settings';settings.textContent='Sütibeállítások';
    settings.setAttribute('aria-label','Analitikai sütik beállításainak megnyitása');
    function choose(value){saveChoice(value);panel.hidden=true;if(value==='granted')startAnalytics();else window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}
    panel.querySelector('.ffv-accept').addEventListener('click',function(){choose('granted');});
    panel.querySelector('.ffv-reject').addEventListener('click',function(){choose('denied');});
    settings.addEventListener('click',function(){panel.hidden=false;});
    document.body.appendChild(panel);
    var footer=document.querySelector('footer');
    if(footer){
      var holder=document.createElement('div');holder.className='ffv-consent-footer';
      holder.appendChild(settings);footer.appendChild(holder);
    }else{document.body.appendChild(settings);}

    var choice=readChoice();
    if(choice==='granted')startAnalytics();else if(choice!=='denied')panel.hidden=false;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
