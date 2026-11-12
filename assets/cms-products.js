/* CMS-managed product additions. Existing static catalogue remains untouched. */
(()=>{'use strict';
const grid=document.querySelector('.v18-products');
if(!grid)return;
const category=location.pathname.split('/').pop().replace('.html','');
if(!['viragcsokrok','novenyek','dekoraciok'].includes(category))return;
const safe=s=>typeof s==='string'&&/^\/?images\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g)$/i.test(s)&&!s.includes('..');
const dateParam=new URLSearchParams(location.search).get('datum');
const date=dateParam&&/^\d{4}-\d{2}-\d{2}$/.test(dateParam)?new Date(dateParam+'T12:00:00'):new Date();
const day=String(date.getMonth()+1).padStart(2,'0')+'.'+String(date.getDate()).padStart(2,'0');
function mmdd(v){const m=String(v||'').match(/^(\d{2})-(\d{2})$/);return m?m[1]+'.'+m[2]:'';}
function shown(p){
 if(p.published!==true)return false;
 const a=mmdd(p.start),b=mmdd(p.end);
 if(!a||!b)return true;
 return a<=b?(day>=a&&day<=b):(day>=a||day<=b);
}
fetch('/content/products.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('products');return r.json();}).then(data=>{
 if(!Array.isArray(data.items))return;
 const frag=document.createDocumentFragment();
 data.items.map((p,i)=>({p,i})).sort((a,b)=>(Number(a.p.order)||100)-(Number(b.p.order)||100)||a.i-b.i).forEach(({p,i})=>{
  if(!p||p.category!==category||!shown(p)||!safe(p.image))return;
  const paths=[p.image,...(Array.isArray(p.extra_images)?p.extra_images:[]).filter(safe)];
  const card=document.createElement('article');card.className='v18-product';card.dataset.productId='CMS-'+i;
  const media=document.createElement('div');media.className='v20-product-media';
  const img=document.createElement('img');img.src=paths[0];img.alt=String(p.title||'Virágfotó');img.loading='lazy';img.decoding='async';
  img.dataset.extraImages=JSON.stringify(paths);media.appendChild(img);
  const copy=document.createElement('div');copy.className='v18-product-copy';
  const h=document.createElement('h3');h.textContent=String(p.title||'');const desc=document.createElement('p');desc.textContent=String(p.description||'');
  copy.append(h,desc);card.append(media,copy);frag.appendChild(card);
 });
 grid.appendChild(frag);
 const empty=grid.nextElementSibling;
 if(grid.querySelector('.v18-product:not([hidden])')&&empty?.classList.contains('v42-empty'))empty.remove();
}).catch(e=>console.warn('A CMS termékek nem tölthetők be:',e));
})();
