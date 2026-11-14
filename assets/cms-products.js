/* CMS product catalogue; retain static cards until data loads successfully. */
(()=>{'use strict';
const grid=document.querySelector('.v18-products');
if(!grid)return;
const category=location.pathname.split('/').pop().replace('.html','');
if(!['viragcsokrok','novenyek','dekoraciok','adventi-dekoraciok','pezsgok-borok','edessegek'].includes(category))return;
const safe=s=>typeof s==='string'&&/^\/?images\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g)$/i.test(s)&&!s.includes('..');
const dateParam=new URLSearchParams(location.search).get('datum');
const date=dateParam&&/^\d{4}-\d{2}-\d{2}$/.test(dateParam)?new Date(dateParam+'T12:00:00'):new Date();
const day=String(date.getMonth()+1).padStart(2,'0')+'.'+String(date.getDate()).padStart(2,'0');
const seasons={'Tavasz / húsvét':['03.01','05.15'],'Ősz':['09.01','11.15'],'Advent / karácsony':['11.15','12.26'],'Tavasz':['03.01','05.31'],'Nyár':['06.01','08.31'],'Tél':['12.01','02.28']};
function mmdd(v){const m=String(v||'').match(/^(\d{2})[.\-](\d{2})$/);return m?m[1]+'.'+m[2]:'';}
function inRange(a,b){return a<=b?(day>=a&&day<=b):(day>=a||day<=b);}
function shown(p){
 if(p.published!==true)return false;
 const a=mmdd(p.start),b=mmdd(p.end);
 if(a&&b)return inRange(a,b);
 const range=seasons[p.season];return !range||inRange(...range);
}
fetch('/content/products-'+category+'.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('products');return r.json();}).then(data=>{
 if(!Array.isArray(data.items))return;
 const frag=document.createDocumentFragment();
 data.items.map((p,i)=>({p,i})).filter(({p})=>shown(p)&&safe(p.image)).sort((a,b)=>(Number(b.p.order??0))-(Number(a.p.order??0))||b.i-a.i).forEach(({p,i})=>{
  const paths=[p.image,...(Array.isArray(p.extra_images)?p.extra_images:[]).filter(safe).filter(x=>x!==p.image)];
  const card=document.createElement('article');card.className='v18-product';card.dataset.productId=String(p.id||'CMS-'+i);
  const media=document.createElement('div');media.className='v20-product-media';
  const img=document.createElement('img');img.src=paths[0];img.alt=String(p.title||'Virágfotó');img.loading='lazy';img.decoding='async';
  img.dataset.extraImages=JSON.stringify(paths);media.appendChild(img);
  const copy=document.createElement('div');copy.className='v18-product-copy';
  const h=document.createElement('h3');h.textContent=String(p.title||'');copy.appendChild(h);
  if(p.description){const desc=document.createElement('p');desc.textContent=String(p.description);copy.appendChild(desc);}
  card.append(media,copy);frag.appendChild(card);
 });
 grid.replaceChildren(frag);
 const empty=grid.nextElementSibling;
 if(empty?.classList.contains('v42-empty'))empty.remove();
 if(!grid.children.length){const p=document.createElement('p');p.className='v42-empty';p.textContent='Jelenleg nincs megjeleníthető termék ebben a kategóriában.';grid.after(p);}
}).catch(e=>console.warn('CMS katalógus betöltési hiba, a régi kártyák megmaradnak:',e));
})();
