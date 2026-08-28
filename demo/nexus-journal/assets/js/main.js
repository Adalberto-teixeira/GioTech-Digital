const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
$("#year")&&( $("#year").textContent=new Date().getFullYear() );

const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add("visible"),Number(e.target.dataset.delay||0));obs.unobserve(e.target)}}),{threshold:.11});
$$(".reveal").forEach(el=>obs.observe(el));

const root=document.documentElement;const saved=localStorage.getItem("nexus-theme");if(saved)root.dataset.theme=saved;
$("#themeToggle")?.addEventListener("click",()=>{const n=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=n;localStorage.setItem("nexus-theme",n)});

const panel=$("#searchPanel"),input=$("#searchInput"),results=$("#searchResults");
const openSearch=()=>{panel?.classList.add("open");setTimeout(()=>input?.focus(),80)};
$("#searchToggle")?.addEventListener("click",openSearch);$("#mobileSearch")?.addEventListener("click",openSearch);$("#searchClose")?.addEventListener("click",()=>panel.classList.remove("open"));
const data=[
 ["Le travail devient plus humain quand la technologie disparaît","Tech","article.html"],
 ["La ville devient une interface","Société","article.html"],
 ["Créer à l'ère des formats instantanés","Culture","article.html"],
 ["Le voyage lent change notre regard","Voyage","article.html"],
 ["Les objets pliables trouvent enfin une vraie raison d'exister","Tech","article.html"]
];
input?.addEventListener("input",()=>{const q=input.value.toLowerCase().trim();results.innerHTML=q?data.filter(x=>x.join(" ").toLowerCase().includes(q)).map(x=>`<a style="display:block;padding:6px 0" href="${x[2]}"><b>${x[0]}</b> · ${x[1]}</a>`).join("")||"Aucun résultat de démonstration.":""});

$("#newsletterForm")?.addEventListener("submit",e=>{e.preventDefault();localStorage.setItem("nexus-newsletter",e.currentTarget.querySelector("input").value);$("#newsletterStatus").textContent="✓ Inscription démo enregistrée localement.";e.currentTarget.reset()});

const progress=$("#progress");if(progress)addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${h?scrollY/h*100:0}%`},{passive:true});

const glow=$("#cursorGlow");if(glow&&matchMedia("(pointer:fine)").matches)addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"},{passive:true});

const params=new URLSearchParams(location.search);$("#categoryTitle")&&($("#categoryTitle").textContent=params.get("cat")||"Tech");
$$("[data-filter]").forEach(b=>b.addEventListener("click",()=>{$$("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;$$(".category-row").forEach(r=>r.classList.toggle("hide",f!=="all"&&r.dataset.type!==f))}));
$("#sort")?.addEventListener("change",e=>{if(e.target.value!=="popular")return;const list=$("#categoryList"),rows=$$(".category-row",list).sort((a,b)=>Number(b.dataset.pop)-Number(a.dataset.pop));rows.forEach(r=>list.appendChild(r))});
