const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

if(window.lucide)lucide.createIcons();

const projects = {
  1:{title:"Aurora Hotel",category:"WEB / HOSPITALITY",desc:"Un site premium pour hôtel boutique, pensé autour de l'immersion visuelle, de la réservation et de l'expérience mobile.",role:"Design + Front-end",year:"2026",stack:"HTML · CSS · JS"},
  2:{title:"Flow Finance",category:"UI / MOBILE",desc:"Une application mobile de gestion financière personnelle avec une interface claire, compacte et rassurante.",role:"UI / UX",year:"2026",stack:"Figma · Prototype"},
  3:{title:"Maison Ø",category:"BRANDING",desc:"Identité visuelle minimaliste pour une marque fictive d'intérieur et d'objets contemporains.",role:"Brand Direction",year:"2025",stack:"Branding · Web"},
  4:{title:"Kinetic Studio",category:"MOTION / WEB",desc:"Portfolio expérimental construit autour de transitions, mouvement, typographie et profondeur.",role:"Creative Dev",year:"2026",stack:"GSAP · JavaScript"},
  5:{title:"Mono Store",category:"WEB / E-COMMERCE",desc:"Boutique en ligne fictive avec une approche éditoriale et une navigation volontairement minimaliste.",role:"UI + Front-end",year:"2025",stack:"HTML · CSS · JS"},
  6:{title:"Control Panel",category:"UI / DASHBOARD",desc:"Dashboard opérationnel pour suivre indicateurs, tâches, équipes et activité.",role:"Product UI",year:"2026",stack:"UI · Data Viz"}
};

const menu=$("#mobileMenu");
$("#menuOpen").onclick=()=>menu.classList.add("open");
$("#menuClose").onclick=()=>menu.classList.remove("open");
$$(".mobile-menu a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));

$("#themeToggle").onclick=()=>{
  document.body.classList.toggle("light");
  $("#themeToggle").innerHTML=document.body.classList.contains("light")
    ? '<i data-lucide="moon"></i>'
    : '<i data-lucide="sun"></i>';
  if(window.lucide)lucide.createIcons();
};

$$("[data-filter]").forEach(b=>b.onclick=()=>{
  $$("[data-filter]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  const f=b.dataset.filter;
  $$(".project-card").forEach(card=>{
    card.classList.toggle("hide",f!=="all"&&card.dataset.category!==f);
  });
});

$$("[data-project-open]").forEach(b=>b.onclick=()=>{
  const p=projects[Number(b.dataset.projectOpen)];
  $("#modalTitle").textContent=p.title;
  $("#modalCategory").textContent=p.category;
  $("#modalDescription").textContent=p.desc;
  $("#modalRole").textContent=p.role;
  $("#modalYear").textContent=p.year;
  $("#modalStack").textContent=p.stack;
  $("#projectModal").classList.add("open");
});

$("#projectClose").onclick=()=>$("#projectModal").classList.remove("open");

$("#contactForm").onsubmit=e=>{
  e.preventDefault();
  $("#contactStatus").textContent="✓ Message enregistré dans cette démonstration.";
  e.currentTarget.reset();
  toast("Merci — message reçu");
};

function toast(text){
  const t=$("#toast");
  t.textContent=text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1500);
}

const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile=matchMedia("(max-width:650px)").matches;

if(typeof gsap!=="undefined"&&typeof ScrollTrigger!=="undefined"&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({limitCallbacks:true,ignoreMobileResize:true});

  $$("[data-reveal]").forEach(el=>{
    gsap.to(el,{opacity:1,y:0,duration:.65,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
  });

  $$("[data-stagger]").forEach(wrap=>{
    gsap.from(wrap.children,{opacity:0,y:20,stagger:.055,duration:.5,ease:"power2.out",scrollTrigger:{trigger:wrap,start:"top 88%",once:true}});
  });

  $$("[data-counter]").forEach(el=>{
    const end=Number(el.dataset.counter);
    const o={v:0};
    gsap.to(o,{v:end,duration:1.1,ease:"power1.out",scrollTrigger:{trigger:el,start:"top 90%",once:true},onUpdate:()=>el.textContent=Math.round(o.v)});
  });

  gsap.to("[data-marquee-track]",{xPercent:-50,repeat:-1,duration:34,ease:"none"});

  if(!mobile){
    gsap.to(".portrait-card",{y:-10,rotation:.6,duration:2.8,repeat:-1,yoyo:true,ease:"sine.inOut"});
    gsap.to(".fc-a",{y:-7,duration:2.1,repeat:-1,yoyo:true,ease:"sine.inOut"});
    gsap.to(".fc-b",{y:8,duration:2.6,repeat:-1,yoyo:true,ease:"sine.inOut"});
    gsap.to(".fc-c",{y:-6,duration:2.3,repeat:-1,yoyo:true,ease:"sine.inOut"});
    gsap.to(".r1",{rotation:360,duration:36,repeat:-1,ease:"none"});
    gsap.to(".r2",{rotation:-360,duration:44,repeat:-1,ease:"none"});
  }
}else{
  $$("[data-reveal]").forEach(el=>{el.style.opacity=1;el.style.transform="none"});
  $$("[data-counter]").forEach(el=>el.textContent=el.dataset.counter);
}

if(!mobile){
  document.addEventListener("pointermove",e=>{
    $("#cursorGlow").style.left=e.clientX+"px";
    $("#cursorGlow").style.top=e.clientY+"px";
  });
}

if(window.lucide)lucide.createIcons();
