const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){setTimeout(()=>entry.target.classList.add("visible"),Number(entry.target.dataset.delay||0));observer.unobserve(entry.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

const prices={home:49,office:65,deep:89,rental:59};
let quickFreq="once";
const qService=$("#quickService"),surface=$("#surfaceRange"),surfaceOut=$("#surfaceOutput"),quickPrice=$("#quickPrice");
function updateQuick(){
 const sqm=Number(surface.value);surfaceOut.value=`${sqm} m²`;
 let price=prices[qService.value]+Math.max(0,sqm-30)*.48;
 if(quickFreq==="weekly")price*=.84;
 quickPrice.textContent=`${Math.round(price)} €`;
}
surface.addEventListener("input",updateQuick);qService.addEventListener("change",updateQuick);
$$(".segment button").forEach(b=>b.addEventListener("click",()=>{$$(".segment button").forEach(x=>x.classList.remove("active"));b.classList.add("active");quickFreq=b.dataset.frequency;updateQuick()}));updateQuick();

const range=$("#compareRange"),before=$("#compareBefore"),line=$("#compareLine");
function updateCompare(){const v=range.value;before.style.width=`${v}%`;line.style.left=`${v}%`}
range.addEventListener("input",updateCompare);updateCompare();

$$(".faq-item").forEach(btn=>btn.addEventListener("click",()=>{const open=btn.classList.contains("open");$$(".faq-item").forEach(x=>x.classList.remove("open"));if(!open)btn.classList.add("open")}));

let service="home";
const quoteSurface=$("#quoteSurface"),quoteSurfaceOut=$("#quoteSurfaceOutput"),total=$("#estimateTotal");
function quoteCalc(){
 const sqm=Number(quoteSurface.value);quoteSurfaceOut.value=`${sqm} m²`;
 let val=prices[service]+Math.max(0,sqm-30)*.48;
 $$(".options input:checked").forEach(x=>val+=Number(x.value));
 total.textContent=`${Math.round(val)} €`;return Math.round(val)
}
$$(".choice").forEach(btn=>btn.addEventListener("click",()=>{$$(".choice").forEach(x=>x.classList.remove("active"));btn.classList.add("active");service=btn.dataset.service;quoteCalc()}));
quoteSurface.addEventListener("input",quoteCalc);$$(".options input").forEach(x=>x.addEventListener("change",quoteCalc));quoteCalc();

$("#quoteForm").addEventListener("submit",e=>{
 e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));data.service=service;data.surface=quoteSurface.value;data.estimate=quoteCalc();data.createdAt=new Date().toISOString();
 localStorage.setItem("lumea-clean-demo-quote",JSON.stringify(data));
 $("#quoteMessage").textContent=`✓ Estimation démo enregistrée : ${data.estimate} €. Aucun paiement n'a été effectué.`;
 const toast=$("#toast");toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3600);
});

const ids=["home","services","process","results","quote","contact"],dock=$$(".mobile-dock a");
function syncDock(){let id="home";ids.forEach(x=>{const el=document.getElementById(x);if(el&&scrollY>=el.offsetTop-innerHeight*.4)id=x});dock.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id))}
addEventListener("scroll",syncDock,{passive:true});syncDock();

document.addEventListener("click",e=>{const a=e.target.closest('a[href="#"]');if(a)e.preventDefault()});
