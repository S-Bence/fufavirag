/* V41.2: Egyetlen, kategóriánként közös Lightbox a régi és új termékekhez. */
(function(){
'use strict';
const cards=Array.from(document.querySelectorAll('.v18-product')).filter(card=>!card.hidden);
if(!cards.length)return;
const photos=[],starts=new Map();
cards.forEach(card=>{
 const img=card.querySelector('.v20-product-media img');
 if(!img)return;
 const name=(card.querySelector('h3')?.textContent||img.alt||'Termékfotó').trim();
 let paths=[];
 try{const parsed=JSON.parse(img.dataset.extraImages||'[]');if(Array.isArray(parsed))paths=parsed.filter(p=>typeof p==='string'&&p);}catch(e){}
 if(!paths.length)paths=[img.dataset.lightboxSrc||img.getAttribute('src')];
 starts.set(card,photos.length);
 paths.forEach((src,i)=>photos.push({src,name,alt:i?name+' – '+(i+1)+'. kép':name}));
});
if(!photos.length)return;
const dialog=document.createElement('div');
dialog.className='v27-lightbox';dialog.hidden=true;
dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
dialog.setAttribute('aria-label','Termékfotók nagyított nézete');
dialog.innerHTML='<button type="button" class="v27-close" aria-label="Bezárás">×</button><button type="button" class="v27-prev" aria-label="Előző kép">‹</button><img class="v27-lightbox-image" alt=""><div class="v27-lightbox-caption" aria-live="polite"></div><div class="v27-lightbox-count" aria-live="polite"></div><button type="button" class="v27-next" aria-label="Következő kép">›</button>';
document.body.appendChild(dialog);
const picture=dialog.querySelector('.v27-lightbox-image'),caption=dialog.querySelector('.v27-lightbox-caption'),count=dialog.querySelector('.v27-lightbox-count'),close=dialog.querySelector('.v27-close');
let active=0,returnFocus=null,oldOverflow='',touchX=null;
function render(){const p=photos[active];picture.src=p.src;picture.alt=p.alt;caption.textContent=p.name;count.textContent=(active+1)+' / '+photos.length;}
function open(index){returnFocus=document.activeElement;active=index;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.hidden=false;render();close.focus();}
function dismiss(){if(dialog.hidden)return;dialog.hidden=true;picture.removeAttribute('src');document.body.style.overflow=oldOverflow;if(returnFocus?.isConnected&&typeof returnFocus.focus==='function')returnFocus.focus();}
function step(n){active=(active+n+photos.length)%photos.length;render();}
starts.forEach((index,card)=>{
 const media=card.querySelector('.v20-product-media');
 if(!media)return;
 media.setAttribute('role','button');media.setAttribute('tabindex','0');
 media.setAttribute('aria-label',(card.querySelector('h3')?.textContent||'Termékfotó').trim()+' – kép nagyítása');
 media.addEventListener('click',()=>open(index));
 media.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(index);}});
});
close.addEventListener('click',dismiss);
dialog.querySelector('.v27-prev').addEventListener('click',()=>step(-1));
dialog.querySelector('.v27-next').addEventListener('click',()=>step(1));
dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
document.addEventListener('keydown',e=>{
 if(dialog.hidden)return;
 if(e.key==='Escape'){e.preventDefault();dismiss();}
 else if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}
 else if(e.key==='ArrowRight'){e.preventDefault();step(1);}
 else if(e.key==='Tab'){
  const buttons=[close,dialog.querySelector('.v27-prev'),dialog.querySelector('.v27-next')],at=buttons.indexOf(document.activeElement);
  if(e.shiftKey&&at===0){e.preventDefault();buttons[2].focus();}
  else if(!e.shiftKey&&at===2){e.preventDefault();buttons[0].focus();}
 }
});
dialog.addEventListener('touchstart',e=>{touchX=e.changedTouches[0]?.screenX??null;},{passive:true});
dialog.addEventListener('touchend',e=>{if(touchX===null)return;const delta=(e.changedTouches[0]?.screenX??touchX)-touchX;if(Math.abs(delta)>55)step(delta<0?1:-1);touchX=null;},{passive:true});
})();
