/* Fű-Fa-Virág névnapkalendárium – V34.
   Forrás: https://www.nevinfo.hu/api – 3 napos magyar névnap API.
   Az adatokat a böngésző az adott napra gyorsítótárazza. */
(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  const todayName = byId('nd-today-name');
  const tomorrowName = byId('nd-tomorrow-name');
  if (!todayName || !tomorrowName) return;
  const zone = 'Europe/Budapest';
  const dateParts = new Intl.DateTimeFormat('en-CA', {timeZone:zone, year:'numeric',month:'2-digit',day:'2-digit'});
  const parts = Object.fromEntries(dateParts.formatToParts(new Date()).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  const dayKey = `${parts.year}-${parts.month}-${parts.day}`;
  const todayUTC = new Date(Date.UTC(+parts.year,+parts.month-1,+parts.day));
  const tomorrowUTC = new Date(todayUTC.getTime()+86400000);
  const fmt = new Intl.DateTimeFormat('hu-HU', {timeZone:'UTC',month:'long',day:'numeric'});
  byId('nd-today-date').textContent=fmt.format(todayUTC);
  byId('nd-tomorrow-date').textContent=fmt.format(tomorrowUTC);
  const status=byId('nd-status');
  const cacheKey='fufavirag-nevnap-v34-'+dayKey;
  const display=(data)=>{
    const names=key=>Array.isArray(data[key])?data[key].map(x=>typeof x==='string'?x:x&&x.name).filter(x=>typeof x==='string'&&x.trim()).slice(0,8).join(', '):'';
    const ma=names('ma'),holnap=names('holnap');
    if(!ma||!holnap)return false;
    todayName.textContent=ma;tomorrowName.textContent=holnap;
    if(status)status.textContent='';
    return true;
  };
  try {const cached=JSON.parse(sessionStorage.getItem(cacheKey)||'null');if(cached&&display(cached))return;}catch(_){}
  todayName.textContent='Betöltés…';tomorrowName.textContent='Betöltés…';
  fetch('https://www.nevinfo.hu/api/v1/3nap',{method:'GET',mode:'cors',credentials:'omit',cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('Névnapadat nem elérhető');return r.json();})
    .then(data=>{if(!display(data))throw new Error('Hiányos névnapadat');try{sessionStorage.setItem(cacheKey,JSON.stringify(data));}catch(_){}})
    .catch(()=>{todayName.textContent='Jelenleg nem elérhető';tomorrowName.textContent='Jelenleg nem elérhető';if(status)status.textContent='A névnapadatok átmenetileg nem tölthetők be.';});
})();
