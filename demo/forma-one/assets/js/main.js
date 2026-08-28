const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();

const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add("visible"),Number(e.target.dataset.delay||0));obs.unobserve(e.target)}}),{threshold:.1});
$$(".reveal").forEach(x=>obs.observe(x));

document.documentElement.dataset.theme=localStorage.getItem("forma-theme")||"dark";
$("#themeToggle").addEventListener("click",()=>{const n=document.documentElement.dataset.theme==="light"?"dark":"light";document.documentElement.dataset.theme=n;localStorage.setItem("forma-theme",n)});

if(typeof gsap!=="undefined"&&typeof ScrollTrigger!=="undefined"&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".topbar",{y:-90,autoAlpha:0,duration:.8,ease:"power3.out"});
  gsap.from(".hero-copy>*",{y:35,autoAlpha:0,stagger:.08,duration:.7,ease:"power3.out",delay:.2});
  gsap.from(".lab-window",{scale:.94,autoAlpha:0,duration:.85,ease:"power3.out",delay:.35});
  gsap.from(".floating-card",{scale:.7,autoAlpha:0,stagger:.12,duration:.5,delay:.75,ease:"back.out(1.8)"});
  gsap.to(".o1",{rotation:360,duration:28,repeat:-1,ease:"none"});
  gsap.to(".o2",{rotation:-360,duration:36,repeat:-1,ease:"none"});
  if(innerWidth>980){
    const track=$(".how-track");
    const dist=()=>Math.max(0,track.scrollWidth-innerWidth+innerWidth*.15);
    gsap.to(track,{x:()=>-dist(),ease:"none",scrollTrigger:{trigger:".how",start:"top top",end:()=>"+="+dist(),scrub:1,pin:true,anticipatePin:1,invalidateOnRefresh:true}});
  }
  gsap.to(".preview-window",{y:-25,rotation:-1,scrollTrigger:{trigger:".lab-section",start:"top bottom",end:"bottom top",scrub:1}});
  gsap.to(".final-word",{xPercent:8,scrollTrigger:{trigger:".final-cta",start:"top bottom",end:"bottom top",scrub:1}});
}

$$("[data-course-filter]").forEach(btn=>btn.addEventListener("click",()=>{$$("[data-course-filter]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.courseFilter;$$(".course-card").forEach(c=>c.classList.toggle("hide",f!=="all"&&c.dataset.cat!==f))}));
$("#courseSort").addEventListener("change",e=>{const grid=$("#courseGrid"),cards=$$(".course-card",grid);if(e.target.value==="short")cards.sort((a,b)=>+a.dataset.duration-+b.dataset.duration);if(e.target.value==="level")cards.sort((a,b)=>+a.dataset.level-+b.dataset.level);cards.forEach(c=>grid.appendChild(c))});

$$(".faq-item").forEach(b=>b.addEventListener("click",()=>{const open=b.classList.contains("open");$$(".faq-item").forEach(x=>x.classList.remove("open"));if(!open)b.classList.add("open")}));

const enroll=$("#enrollModal"),student=$("#studentPanel");
$$("[data-open-enroll]").forEach(b=>b.addEventListener("click",()=>enroll.classList.add("open")));
$("#closeEnroll").addEventListener("click",()=>enroll.classList.remove("open"));
enroll.addEventListener("click",e=>{if(e.target===enroll)enroll.classList.remove("open")});
$("#loginBtn").addEventListener("click",()=>student.classList.add("open"));
$("#closeStudent").addEventListener("click",()=>student.classList.remove("open"));
student.addEventListener("click",e=>{if(e.target===student)student.classList.remove("open")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){enroll.classList.remove("open");student.classList.remove("open")}});

$("#enrollForm").addEventListener("submit",e=>{e.preventDefault();localStorage.setItem("forma-enroll",JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));$("#enrollStatus").textContent="✓ Parcours démo créé localement. Bienvenue !";e.currentTarget.reset()});

const questions=[
 {q:"Quel langage structure le contenu d'une page web ?",opts:["CSS","HTML","Git","SQL"],correct:1},
 {q:"Quel outil sert à versionner son code ?",opts:["Git","Figma","Chrome","Canva"],correct:0},
 {q:"Que signifie UI ?",opts:["User Interface","Universal Internet","User Install","Unique Index"],correct:0}
];
let qi=0,score=0;
function renderQ(){const q=questions[qi];$("#qIndex").textContent=qi+1;$("#qText").textContent=q.q;$("#qOptions").innerHTML=q.opts.map((o,i)=>`<button data-idx="${i}">${o}</button>`).join("");$("#quizFeedback").textContent="";$$("#qOptions button").forEach(b=>b.onclick=()=>answer(+b.dataset.idx))}
function answer(i){const q=questions[qi];$$("#qOptions button").forEach((b,n)=>{b.disabled=true;if(n===q.correct)b.classList.add("correct");else if(n===i)b.classList.add("wrong")});if(i===q.correct){score+=100;$("#quizFeedback").textContent="✓ Bonne réponse · +100 XP"}else $("#quizFeedback").textContent="Pas tout à fait. La bonne réponse est indiquée.";$("#quizScore").textContent=score+" XP";setTimeout(()=>{qi++;if(qi<questions.length)renderQ();else{$("#qText").textContent=`Challenge terminé — ${score}/300 XP`;$("#qOptions").innerHTML='<button id="restartQuiz">Recommencer ↻</button>';$("#quizFeedback").textContent=score>=200?"Excellent résultat.":"Continuez à pratiquer.";$("#restartQuiz").onclick=()=>{qi=0;score=0;$("#quizScore").textContent="0 XP";renderQ()}}},900)}
renderQ();

const sections=["home","paths","courses","mentors","pricing"],nav=$$(".desktop-nav a,.mobile-dock a");
function syncNav(){let id="home";sections.forEach(s=>{const el=document.getElementById(s);if(el&&scrollY>=el.offsetTop-innerHeight*.38)id=s});nav.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id))}
addEventListener("scroll",syncNav,{passive:true});syncNav();
