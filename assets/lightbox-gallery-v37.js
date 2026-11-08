/* V37 – Galéria lightbox, a V27 megjelenésével; dinamikus CMS-képekhez is. */
(()=>{'use strict';
const gallery=document.getElementById('gallery-items');if(!gallery)return;
const images=()=>Array.from(gallery.querySelectorAll('img'));
const dialog=document.createElement('div');dialog.className='v27-lightbox';dialog.hidden=true;
dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Galéria képeinek nagyított nézete');
dialog.innerHTML='<button type="button" class="v27-close" aria-label="Bezárás">×</button><button type="button" class="v27-prev" aria-label="Előző kép">‹</button><img class="v27-lightbox-image" alt=""><div class="v27-lightbox-caption" aria-live="polite"></div><div class="v27-lightbox-count" aria-live="polite"></div><button type="button" class="v27-next" aria-label="Következő kép">›</button>';
document.body.appendChild(dialog);
const photo=dialog.querySelector('.v27-lightbox-image'),caption=dialog.querySelector('.v27-lightbox-caption'),count=dialog.querySelector('.v27-lightbox-count'),close=dialog.querySelector('.v27-close');
let index=0,returnFocus=null,oldOverflow='',touchX=null;
function render(){const imgs=images();if(!imgs.length){dismiss();return;}index=(index+imgs.length)%imgs.length;const img=imgs[index];photo.src=img.dataset.lightboxSrc||img.currentSrc||img.src;photo.alt=img.alt||'Virágfotó';caption.textContent=photo.alt;count.textContent=`${index+1} / ${imgs.length}`;}
function open(img){const imgs=images();index=imgs.indexOf(img);if(index<0)return;returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.hidden=false;render();close.focus();}
function dismiss(){if(dialog.hidden)return;dialog.hidden=true;photo.removeAttribute('src');document.body.style.overflow=oldOverflow;if(returnFocus?.isConnected&&typeof returnFocus.focus==='function')returnFocus.focus();}
function step(n){index+=n;render();}
function prepare(){images().forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',(img.alt||'Virágfotó')+' – kép nagyítása');});}
prepare();new MutationObserver(prepare).observe(gallery,{childList:true});
gallery.addEventListener('click',e=>{const img=e.target.closest('img');if(img&&gallery.contains(img))open(img);});
gallery.addEventListener('keydown',e=>{const img=e.target.closest('img');if(img&&gallery.contains(img)&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open(img);}});
close.addEventListener('click',dismiss);dialog.querySelector('.v27-prev').addEventListener('click',()=>step(-1));dialog.querySelector('.v27-next').addEventListener('click',()=>step(1));dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
document.addEventListener('keydown',e=>{if(dialog.hidden)return;if(e.key==='Escape'){e.preventDefault();dismiss();}else if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}else if(e.key==='ArrowRight'){e.preventDefault();step(1);}else if(e.key==='Tab'){const controls=[close,dialog.querySelector('.v27-prev'),dialog.querySelector('.v27-next')];const at=controls.indexOf(document.activeElement);if(e.shiftKey&&at===0){e.preventDefault();controls[2].focus();}else if(!e.shiftKey&&at===2){e.preventDefault();controls[0].focus();}}});
dialog.addEventListener('touchstart',e=>{touchX=e.changedTouches[0]?.screenX??null;},{passive:true});dialog.addEventListener('touchend',e=>{if(touchX===null)return;const delta=(e.changedTouches[0]?.screenX??touchX)-touchX;if(Math.abs(delta)>55)step(delta<0?1:-1);touchX=null;},{passive:true});
})();
