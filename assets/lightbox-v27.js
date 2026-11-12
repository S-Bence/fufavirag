/* Shared category lightbox: delegated events and live, visible product image list. */
(()=>{
'use strict';
const grid=document.querySelector('.v18-products');
if(!grid)return;
const dialog=document.createElement('div');
dialog.className='v27-lightbox';
dialog.hidden=true;
dialog.setAttribute('role','dialog');
dialog.setAttribute('aria-modal','true');
dialog.setAttribute('aria-label','Termékfotók nagyított nézete');
dialog.innerHTML='<button type="button" class="v27-close" aria-label="Bezárás">×</button><button type="button" class="v27-prev" aria-label="Előző kép">‹</button><img class="v27-lightbox-image" alt=""><div class="v27-lightbox-caption" aria-live="polite"></div><div class="v27-lightbox-count" aria-live="polite"></div><button type="button" class="v27-next" aria-label="Következő kép">›</button>';
document.body.appendChild(dialog);
const picture=dialog.querySelector('.v27-lightbox-image'),caption=dialog.querySelector('.v27-lightbox-caption'),count=dialog.querySelector('.v27-lightbox-count'),close=dialog.querySelector('.v27-close');
let photos=[],active=0,returnFocus=null,oldOverflow='',touchX=null;
function visible(card){return !card.hidden && !card.closest('[hidden]') && getComputedStyle(card).display!=='none';}
function list(){
 const result=[],starts=new Map();
 grid.querySelectorAll('.v18-product').forEach(card=>{
  if(!visible(card))return;
  const img=card.querySelector('.v20-product-media img');
  if(!img)return;
  const name=(card.querySelector('h3')?.textContent||img.alt||'Termékfotó').trim();
  let paths=[];
  try{const a=JSON.parse(img.dataset.extraImages||'[]');if(Array.isArray(a))paths=a.filter(s=>typeof s==='string'&&s.trim());}catch(_){}
  const primary=img.dataset.lightboxSrc||img.getAttribute('src');
  if(!paths.length && primary)paths=[primary];
  if(primary && !paths.includes(primary))paths.unshift(primary);
  if(!paths.length)return;
  starts.set(card,result.length);
  paths.forEach((src,i)=>result.push({src,name,alt:i?name+' – '+(i+1)+'. kép':name}));
 });
 return {result,starts};
}
function render(){if(!photos.length){dismiss();return;}active=(active+photos.length)%photos.length;const p=photos[active];picture.src=p.src;picture.alt=p.alt;caption.textContent=p.name;count.textContent=(active+1)+' / '+photos.length;}
function open(card){
 const current=list();const index=current.starts.get(card);
 if(index===undefined)return;
 photos=current.result;active=index;returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';dialog.hidden=false;render();close.focus();
}
function dismiss(){if(dialog.hidden)return;dialog.hidden=true;picture.removeAttribute('src');document.body.style.overflow=oldOverflow;if(returnFocus?.isConnected&&typeof returnFocus.focus==='function')returnFocus.focus();}
function step(n){active+=n;render();}
function prepare(){
 grid.querySelectorAll('.v18-product .v20-product-media').forEach(media=>{
  media.setAttribute('role','button');media.setAttribute('tabindex','0');
  media.setAttribute('aria-label',(media.closest('.v18-product')?.querySelector('h3')?.textContent||'Termékfotó').trim()+' – kép nagyítása');
 });
}
prepare();
new MutationObserver(prepare).observe(grid,{childList:true,subtree:true});
grid.addEventListener('click',e=>{const media=e.target.closest('.v20-product-media');if(media&&grid.contains(media))open(media.closest('.v18-product'));});
grid.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const media=e.target.closest('.v20-product-media');if(media&&grid.contains(media)){e.preventDefault();open(media.closest('.v18-product'));}});
close.addEventListener('click',dismiss);
dialog.querySelector('.v27-prev').addEventListener('click',()=>step(-1));
dialog.querySelector('.v27-next').addEventListener('click',()=>step(1));
dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
document.addEventListener('keydown',e=>{if(dialog.hidden)return;if(e.key==='Escape'){e.preventDefault();dismiss();}else if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}else if(e.key==='ArrowRight'){e.preventDefault();step(1);}else if(e.key==='Tab'){const buttons=[close,dialog.querySelector('.v27-prev'),dialog.querySelector('.v27-next')],at=buttons.indexOf(document.activeElement);if(e.shiftKey&&at===0){e.preventDefault();buttons[2].focus();}else if(!e.shiftKey&&at===2){e.preventDefault();buttons[0].focus();}}});
dialog.addEventListener('touchstart',e=>{touchX=e.changedTouches[0]?.screenX??null;},{passive:true});
dialog.addEventListener('touchend',e=>{if(touchX===null)return;const delta=(e.changedTouches[0]?.screenX??touchX)-touchX;if(Math.abs(delta)>55)step(delta<0?1:-1);touchX=null;},{passive:true});
})();
