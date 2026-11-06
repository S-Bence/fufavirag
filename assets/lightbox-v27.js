(function(){
  'use strict';
  const cards=Array.from(document.querySelectorAll('.v18-product'));
  const items=cards.map(card=>({
    img:card.querySelector('.v20-product-media img'),
    name:(card.querySelector('h3')?.textContent||'Termékfotó').trim(),
    media:card.querySelector('.v20-product-media')
  })).filter(item=>item.img&&item.media);
  if(!items.length)return;
  const dialog=document.createElement('div');
  dialog.className='v27-lightbox';dialog.hidden=true;
  dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
  dialog.setAttribute('aria-label','Termékfotók nagyított nézete');
  dialog.innerHTML='<button type="button" class="v27-close" aria-label="Bezárás">×</button><button type="button" class="v27-prev" aria-label="Előző kép">‹</button><img class="v27-lightbox-image" alt=""><div class="v27-lightbox-caption" aria-live="polite"></div><div class="v27-lightbox-count" aria-live="polite"></div><button type="button" class="v27-next" aria-label="Következő kép">›</button>';
  document.body.appendChild(dialog);
  const picture=dialog.querySelector('.v27-lightbox-image');
  const caption=dialog.querySelector('.v27-lightbox-caption');
  const count=dialog.querySelector('.v27-lightbox-count');
  const close=dialog.querySelector('.v27-close');
  let active=0,returnFocus=null,oldOverflow='',touchX=null;
  function render(){const item=items[active];picture.src=item.img.currentSrc||item.img.src;picture.alt=item.name;caption.textContent=item.name;count.textContent=(active+1)+' / '+items.length;}
  function open(index){returnFocus=document.activeElement;active=index;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.hidden=false;render();close.focus();}
  function dismiss(){dialog.hidden=true;picture.removeAttribute('src');document.body.style.overflow=oldOverflow;if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();}
  function step(delta){active=(active+delta+items.length)%items.length;render();}
  items.forEach((item,index)=>{item.media.setAttribute('role','button');item.media.setAttribute('tabindex','0');item.media.setAttribute('aria-label',item.name+' – kép nagyítása');item.media.addEventListener('click',()=>open(index));item.media.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(index);}});});
  close.addEventListener('click',dismiss);
  dialog.querySelector('.v27-prev').addEventListener('click',()=>step(-1));
  dialog.querySelector('.v27-next').addEventListener('click',()=>step(1));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dismiss();});
  document.addEventListener('keydown',event=>{if(dialog.hidden)return;if(event.key==='Escape'){event.preventDefault();dismiss();}else if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}else if(event.key==='ArrowRight'){event.preventDefault();step(1);}else if(event.key==='Tab'){const buttons=[close,dialog.querySelector('.v27-prev'),dialog.querySelector('.v27-next')];const at=buttons.indexOf(document.activeElement);if(event.shiftKey&&at===0){event.preventDefault();buttons[2].focus();}else if(!event.shiftKey&&at===2){event.preventDefault();buttons[0].focus();}}});
  dialog.addEventListener('touchstart',event=>{touchX=event.changedTouches[0]?.screenX??null;},{passive:true});
  dialog.addEventListener('touchend',event=>{if(touchX===null)return;const delta=(event.changedTouches[0]?.screenX??touchX)-touchX;if(Math.abs(delta)>55)step(delta<0?1:-1);touchX=null;},{passive:true});
})();