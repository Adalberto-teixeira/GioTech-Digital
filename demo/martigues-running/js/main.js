const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('#menuBtn'), links=$('#navLinks'); if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
const target=new Date('2027-05-16T08:00:00+02:00').getTime();
function tick(){const now=Date.now(),d=Math.max(0,target-now); const vals=[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60]; ['days','hours','mins','secs'].forEach((id,i)=>{const e=document.getElementById(id);if(e)e.textContent=String(vals[i]).padStart(2,'0')})} tick(); setInterval(tick,1000);
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12}); $$('.fade-up').forEach(e=>io.observe(e));
$$('[data-counter]').forEach(el=>{let done=false; const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!done){done=true;let v=0,t=+el.dataset.counter,step=Math.max(1,Math.ceil(t/40));let id=setInterval(()=>{v=Math.min(t,v+step);el.textContent=v.toLocaleString('fr-FR');if(v>=t)clearInterval(id)},35)}},{threshold:.4});obs.observe(el)});
