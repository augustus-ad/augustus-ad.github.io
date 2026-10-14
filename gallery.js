const dialog=document.querySelector('#figure-dialog');
document.querySelectorAll('.paper-zoom').forEach(button=>button.addEventListener('click',()=>{
  const image=button.querySelector('img');
  dialog.querySelector('img').src=image.src;
  dialog.querySelector('img').alt=image.alt;
  document.querySelector('#dialog-title').textContent=button.dataset.label||`Figure ${button.dataset.figure} · Panel ${Number(button.dataset.panel)+1}`;
  dialog.showModal();
}));
document.querySelector('#close-figure').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
const clips=[...document.querySelectorAll('img[data-preview]')];
const toggle=document.querySelector('#toggle-previews');
let previews=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const visible=new Set();
function show(img,play){const next=play?img.dataset.gif:img.dataset.still;if(img.getAttribute('src')!==next)img.src=next;}
function updateToggle(){toggle.textContent=previews?'Pause previews':'Play previews';toggle.setAttribute('aria-pressed',String(previews));}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const img=entry.target;
  if(entry.isIntersecting){visible.add(img);show(img,previews);}
  else{visible.delete(img);show(img,false);}
}),{threshold:.4});
clips.forEach(img=>observer.observe(img));
toggle.addEventListener('click',()=>{previews=!previews;updateToggle();clips.forEach(img=>show(img,previews&&visible.has(img)));});
updateToggle();
document.querySelector('#copy-citation').addEventListener('click',async()=>{
  const text=document.querySelector('#citation').textContent;let success=false;
  document.querySelector('#copy-citation').textContent='Copying…';
  try{await Promise.race([navigator.clipboard.writeText(text),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Clipboard unavailable')),1200))]);success=true;}
  catch{const field=document.createElement('textarea');field.value=text;document.body.append(field);field.select();success=document.execCommand('copy');field.remove();}
  document.querySelector('#copy-citation').textContent=success?'Copied ✓':'Select text to copy';
  document.querySelector('#copy-status').textContent=success?'Citation copied to clipboard.':'Select the citation text to copy it.';
});
