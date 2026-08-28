const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

if(window.lucide)lucide.createIcons();

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

$("#printCv").onclick=()=>window.print();

$$("[data-project]").forEach(b=>b.onclick=()=>{
  $("#projectTitle").textContent=b.dataset.project;
  $("#projectModal").classList.add("open");
});
$("#projectClose").onclick=()=>$("#projectModal").classList.remove("open");

$("#contactForm").onsubmit=e=>{
  e.preventDefault();
  $("#contactStatus").textContent="✓ Message enregistré dans cette démonstration.";
  e.currentTarget.reset();
  toast("Message envoyé");
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

  $$("[data-stagger]").forEach(w=>{
    gsap.from(w.children,{opacity:0,y:20,stagger:.05,duration:.5,ease:"power2.out",scrollTrigger:{trigger:w,start:"top 88%",once:true}});
  });

  $$("[data-counter]").forEach(el=>{
    const end=Number(el.dataset.counter);
    const o={v:0};
    gsap.to(o,{v:end,duration:1.1,ease:"power1.out",scrollTrigger:{trigger:el,start:"top 90%",once:true},onUpdate:()=>el.textContent=Math.round(o.v)});
  });

  if(!mobile){
    gsap.to(".portrait-frame",{y:-7,duration:3.2,repeat:-1,yoyo:true,ease:"sine.inOut"});
    
  }
}else{
  $$("[data-reveal]").forEach(el=>{el.style.opacity=1;el.style.transform="none"});
  $$("[data-counter]").forEach(el=>el.textContent=el.dataset.counter);
}

if(window.lucide)lucide.createIcons();
