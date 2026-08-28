const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

document.getElementById("year").textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const delay=Number(entry.target.dataset.delay||0);
      setTimeout(()=>entry.target.classList.add("visible"),delay);
      observer.unobserve(entry.target);
    }
  });
},{threshold:.13});
$$(".reveal").forEach(el=>observer.observe(el));

const sections=$$("main section[id]");
const desktopLinks=$$(".desktop-nav a");
const dockLinks=$$(".mobile-dock a");
const syncNav=()=>{
  let current="home";
  sections.forEach(sec=>{
    if(window.scrollY>=sec.offsetTop-window.innerHeight*.36) current=sec.id;
  });
  [...desktopLinks,...dockLinks].forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
};
window.addEventListener("scroll",syncNav,{passive:true});
syncNav();

const projects=[
  {title:"Maison Atelier",type:"Branding / Web",image:"assets/images/project-1.webp",text:"Une direction artistique sobre pour un studio créatif : hiérarchie éditoriale, grands espaces et interactions discrètes.",tags:["Web design","Responsive","HTML/CSS"]},
  {title:"Studio Écho",type:"UI / Direction artistique",image:"assets/images/project-2.webp",text:"Une vitrine visuelle pensée pour mettre l'image au premier plan tout en conservant une navigation simple et rapide.",tags:["UI/UX","Animation","JavaScript"]},
  {title:"Northline",type:"Produit / Front-end",image:"assets/images/project-3.webp",text:"Prototype d'interface produit avec composants modulaires, attention mobile et micro-interactions.",tags:["Front-end","Design system","Mobile-first"]}
];
const modal=$("#projectModal");
const closeModal=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""};
$$(".project-card").forEach(card=>card.addEventListener("click",()=>{
  const p=projects[Number(card.dataset.project)];
  $("#modalImage").src=p.image;$("#modalTitle").textContent=p.title;$("#modalType").textContent=p.type;$("#modalText").textContent=p.text;
  $("#modalTags").innerHTML=p.tags.map(t=>`<span>${t}</span>`).join("");
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}));
$(".modal-close").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

if(matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches){
  const card=$(".hero-card");
  document.addEventListener("mousemove",e=>{
    const x=(e.clientX/innerWidth-.5)*8,y=(e.clientY/innerHeight-.5)*8;
    card.style.transform=`translate3d(${x}px,${y}px,0) rotateX(${-y*.18}deg) rotateY(${x*.18}deg)`;
  });
}

document.addEventListener("click",e=>{
  const link=e.target.closest('a[href="#"]');
  if(link)e.preventDefault();
});
