const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();

const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add("visible"),Number(e.target.dataset.delay||0));obs.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(x=>obs.observe(x));

$$(".faq-item").forEach(btn=>btn.addEventListener("click",()=>{const was=btn.classList.contains("open");$$(".faq-item").forEach(x=>x.classList.remove("open"));if(!was)btn.classList.add("open")}));

const modal=$("#courseModal"), title=$("#modalTitle");
$$(".course-btn").forEach(btn=>btn.addEventListener("click",()=>{title.textContent=btn.dataset.course;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}));
const close=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""};
$(".modal-close").addEventListener("click",close);modal.addEventListener("click",e=>{if(e.target===modal)close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
$("#modalCta").addEventListener("click",close);

$("#contactForm").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));localStorage.setItem("nova-ai-demo-contact",JSON.stringify({...data,date:new Date().toISOString()}));$("#formStatus").textContent="✓ Démonstration : votre demande a été enregistrée localement.";e.currentTarget.reset()});

const ids=["home","formations","solutions","method","cases","contact"];const nav=$$(".mobile-nav a");
const sync=()=>{let id="home";ids.forEach(x=>{const el=document.getElementById(x);if(el&&scrollY>=el.offsetTop-innerHeight*.4)id=x});nav.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id))};addEventListener("scroll",sync,{passive:true});sync();

if(matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
 const visual=$(".hero-visual");document.addEventListener("mousemove",e=>{const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*8;visual.style.transform=`translate3d(${x}px,${y}px,0)`});
}
document.addEventListener("click",e=>{const a=e.target.closest('a[href="#"]');if(a)e.preventDefault()});
