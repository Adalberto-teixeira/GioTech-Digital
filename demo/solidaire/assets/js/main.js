const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

if(window.lucide)lucide.createIcons();

const menu=$("#mobileMenu");
$("#menuOpen").onclick=()=>menu.classList.add("open");
$("#menuClose").onclick=()=>menu.classList.remove("open");
$$(".mobile-menu a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));

function toast(text){
  const t=$("#toast");
  t.textContent=text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1500);
}

$("#volunteerOpen").onclick=()=>$("#volunteerModal").classList.add("open");
$$("[data-close-modal]").forEach(b=>b.onclick=()=>b.closest(".modal").classList.remove("open"));

$("#volunteerForm").onsubmit=e=>{
  e.preventDefault();
  $("#volunteerStatus").textContent="✓ Candidature bénévole enregistrée dans cette démonstration.";
  e.currentTarget.reset();
  setTimeout(()=>$("#volunteerModal").classList.remove("open"),1800);
};

$$(".event-button").forEach(b=>b.onclick=()=>{
  $("#eventTitle").textContent=b.dataset.event;
  $("#eventStatus").textContent="";
  $("#eventModal").classList.add("open");
});

$("#eventForm").onsubmit=e=>{
  e.preventDefault();
  $("#eventStatus").textContent="✓ Inscription enregistrée.";
  e.currentTarget.reset();
  setTimeout(()=>$("#eventModal").classList.remove("open"),1600);
};

let donationAmount=25;

function setDonation(amount){
  donationAmount=Number(amount)||0;
  $$(".donation-amounts button").forEach(b=>b.classList.toggle("active",Number(b.dataset.amount)===donationAmount));
  $("#customAmount").value="";
  const impact = donationAmount < 20
    ? "Votre don contribue aux frais d'une activité."
    : donationAmount < 50
    ? donationAmount+" € peuvent financer du matériel pour un atelier."
    : donationAmount < 100
    ? donationAmount+" € peuvent soutenir une journée d'action locale."
    : donationAmount+" € peuvent contribuer à plusieurs actions du mois.";
  $("#donationImpact").textContent=impact;
}

$$("[data-amount]").forEach(b=>b.onclick=()=>setDonation(b.dataset.amount));
setDonation(25);

$("#customAmount").oninput=e=>{
  donationAmount=Number(e.target.value)||0;
  $$(".donation-amounts button").forEach(b=>b.classList.remove("active"));
  $("#donationImpact").textContent=donationAmount
    ? `${donationAmount} € seront affectés aux actions prioritaires de l'association.`
    : "Entrez le montant de votre choix.";
};

$("#donateButton").onclick=()=>{
  if(donationAmount<=0) return toast("Choisissez un montant");
  $("#donationSummary").innerHTML=`Montant choisi : <b>${donationAmount.toLocaleString("fr-FR")} €</b><br>Aucun paiement réel n'est effectué dans cette démo.`;
  $("#donationStatus").textContent="";
  $("#donationModal").classList.add("open");
};

$("#fakePay").onclick=()=>{
  $("#donationStatus").textContent="✓ Don simulé avec succès. Merci !";
  setTimeout(()=>$("#donationModal").classList.remove("open"),1700);
};

$("#contactForm").onsubmit=e=>{
  e.preventDefault();
  $("#contactStatus").textContent="✓ Message enregistré dans cette démonstration.";
  e.currentTarget.reset();
};

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
    $$("[data-image-shift]").forEach(img=>{
      gsap.fromTo(img,{yPercent:-2},{yPercent:2,ease:"none",scrollTrigger:{trigger:img,start:"top bottom",end:"bottom top",scrub:.5}});
    });
  }
}else{
  $$("[data-reveal]").forEach(el=>{el.style.opacity=1;el.style.transform="none"});
  $$("[data-counter]").forEach(el=>el.textContent=el.dataset.counter);
}

if(window.lucide)lucide.createIcons();
