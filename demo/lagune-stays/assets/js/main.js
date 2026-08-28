const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

if(window.lucide)lucide.createIcons();

const stays = {
  1:{title:"Appartement Canal Bleu",area:"L'Île · Martigues",price:118,rating:4.9,image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=88",desc:"Appartement lumineux au bord des canaux, idéal pour un séjour en couple.",guests:2,beds:1,extra:"Wi-Fi"},
  2:{title:"Hôtel des Étangs",area:"Ferrières",price:142,rating:4.7,image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=88",desc:"Chambre premium avec terrasse, parking et petit-déjeuner.",guests:2,beds:1,extra:"Petit-déjeuner"},
  3:{title:"Maison du Port",area:"Carro",price:176,rating:4.8,image:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=88",desc:"Maison de vacances proche du port et de la plage.",guests:4,beds:2,extra:"Mer à pied"},
  4:{title:"Villa Côte Bleue",area:"La Couronne",price:265,rating:5.0,image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=88",desc:"Villa avec piscine et jardin, parfaite pour une famille.",guests:6,beds:3,extra:"Piscine"},
  5:{title:"Studio Provence",area:"Jonquières",price:96,rating:4.6,image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=88",desc:"Studio rénové au centre de Martigues.",guests:3,beds:1,extra:"Climatisation"},
  6:{title:"Venise Provençale",area:"L'Île",price:158,rating:4.9,image:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=88",desc:"Maison d'hôtes intimiste avec vue sur l'eau.",guests:2,beds:1,extra:"Vue canal"}
};

let favorites=JSON.parse(localStorage.getItem("lagune-favorites")||"[]");
let currentStay=1;

const fmt=v=>Number(v).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
const nights=(a,b)=>{
  if(!a||!b) return 0;
  const d1=new Date(a+"T12:00"),d2=new Date(b+"T12:00");
  return Math.max(0,Math.round((d2-d1)/86400000));
};

const menu=$("#mobileMenu");
$("#menuOpen").onclick=()=>menu.classList.add("open");
$("#menuClose").onclick=()=>menu.classList.remove("open");
$$(".mobile-menu a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));

function toast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1500)}

function syncFav(){
  $("#favCount").textContent=favorites.length;
  $$(".fav-button").forEach(b=>b.classList.toggle("active",favorites.includes(Number(b.dataset.fav))));
  localStorage.setItem("lagune-favorites",JSON.stringify(favorites));
}
$$(".fav-button").forEach(b=>b.onclick=()=>{
  const id=Number(b.dataset.fav);
  favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
  syncFav();
  toast(favorites.includes(id)?"Ajouté aux favoris":"Retiré des favoris");
});
syncFav();

function renderFavs(){
  $("#favList").innerHTML=favorites.length?favorites.map(id=>{
    const s=stays[id];
    return `<div class="fav-row"><img src="${s.image}"><div><b>${s.title}</b><span>${fmt(s.price)} / nuit</span></div><button data-remove="${id}">Retirer</button></div>`;
  }).join(""):'<div class="no-results show"><b>Aucun favori.</b><span>Ajoutez un séjour avec le cœur.</span></div>';
  $$("[data-remove]").forEach(b=>b.onclick=()=>{favorites=favorites.filter(x=>x!==Number(b.dataset.remove));syncFav();renderFavs()});
}
$("#favOpen").onclick=()=>{renderFavs();$("#favDrawer").classList.add("open")};
$("#favClose").onclick=()=>$("#favDrawer").classList.remove("open");

function calcBooking(){
  const s=stays[currentStay];
  const a=$("#modalCheckin").value,b=$("#modalCheckout").value;
  const n=nights(a,b);
  const base=n*s.price;
  const cleaning=n?38:0;
  const tourism=n?Math.round(n*2.5*100)/100:0;
  const total=base+cleaning+tourism;
  $("#bookingBreakdown").innerHTML=n?`
    <div><span>${n} nuit${n>1?"s":""} × ${fmt(s.price)}</span><b>${fmt(base)}</b></div>
    <div><span>Frais de ménage</span><b>${fmt(cleaning)}</b></div>
    <div><span>Taxe de séjour estimée</span><b>${fmt(tourism)}</b></div>
    <div><span>Total</span><b>${fmt(total)}</b></div>`:
    '<div><span>Sélectionnez vos dates</span><b>—</b></div>';
  return {n,total,a,b,guests:$("#modalGuests").value};
}

function openStay(id){
  currentStay=id;
  const s=stays[id];
  $("#modalImage").src=s.image;
  $("#modalArea").textContent=s.area;
  $("#modalTitle").textContent=s.title;
  $("#modalRating").textContent="★ "+s.rating;
  $("#modalDesc").textContent=s.desc;
  $("#modalPrice").textContent=fmt(s.price);
  $("#modalSpecs").innerHTML=`<span><i data-lucide="users"></i> ${s.guests} voyageurs</span><span><i data-lucide="bed-double"></i> ${s.beds} chambre(s)</span><span><i data-lucide="sparkles"></i> ${s.extra}</span>`;
  $("#modalCheckin").value=$("#checkin").value||"";
  $("#modalCheckout").value=$("#checkout").value||"";
  $("#modalGuests").value=$("#guests").value||"2";
  calcBooking();
  $("#stayModal").classList.add("open");
  if(window.lucide)lucide.createIcons();
}
$$(".details-button").forEach(b=>b.onclick=()=>openStay(Number(b.dataset.details)));
$("#stayClose").onclick=()=>$("#stayModal").classList.remove("open");
["#modalCheckin","#modalCheckout","#modalGuests"].forEach(x=>$(x).addEventListener("change",calcBooking));

$("#bookOpen").onclick=()=>{
  const data=calcBooking();
  if(!data.n) return toast("Choisissez vos dates");
  const s=stays[currentStay];
  $("#checkoutSummary").innerHTML=`<b>${s.title}</b><br>${data.a} → ${data.b}<br>${data.n} nuit(s) · ${data.guests} voyageur(s)<br><strong>Total : ${fmt(data.total)}</strong>`;
  $("#stayModal").classList.remove("open");
  $("#checkoutModal").classList.add("open");
};
$("#checkoutClose").onclick=()=>$("#checkoutModal").classList.remove("open");
$("#bookingForm").onsubmit=e=>{
  e.preventDefault();
  $("#bookingStatus").textContent="✓ Réservation démo confirmée. Aucun paiement réel.";
  e.currentTarget.reset();
  setTimeout(()=>$("#checkoutModal").classList.remove("open"),2000);
};

$$("[data-type]").forEach(b=>b.onclick=()=>{
  $$("[data-type]").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  const t=b.dataset.type;let visible=0;
  $$(".stay-card").forEach(c=>{const show=t==="all"||c.dataset.type===t;c.classList.toggle("hide",!show);if(show)visible++});
  $("#noResults").classList.toggle("show",visible===0);
});

$("#sortSelect").onchange=e=>{
  const cards=$$(".stay-card");
  if(e.target.value==="default") return;
  cards.sort((a,b)=>{
    if(e.target.value==="rating") return Number(b.dataset.rating)-Number(a.dataset.rating);
    return e.target.value==="asc"?Number(a.dataset.price)-Number(b.dataset.price):Number(b.dataset.price)-Number(a.dataset.price);
  }).forEach(c=>$("#staysGrid").appendChild(c));
};

$("#searchForm").onsubmit=e=>{
  e.preventDefault();
  const area=$("#searchArea").value,guests=Number($("#guests").value),a=$("#checkin").value,b=$("#checkout").value;
  if(!a||!b||nights(a,b)<1) return toast("Vérifiez vos dates");
  let visible=0;
  $$(".stay-card").forEach(c=>{
    const areaOk=area==="all"||c.dataset.area.includes(area);
    const guestOk=Number(c.dataset.capacity)>=guests;
    const show=areaOk&&guestOk;
    c.classList.toggle("hide",!show);
    if(show)visible++;
  });
  $("#noResults").classList.toggle("show",visible===0);
  $("#stays").scrollIntoView({behavior:"smooth"});
};

$("#contactForm").onsubmit=e=>{
  e.preventDefault();
  $("#contactStatus").textContent="✓ Demande enregistrée dans cette démonstration.";
  e.currentTarget.reset();
};

const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile=matchMedia("(max-width:650px)").matches;
if(typeof gsap!=="undefined"&&typeof ScrollTrigger!=="undefined"&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({limitCallbacks:true,ignoreMobileResize:true});
  $$("[data-reveal]").forEach(el=>gsap.to(el,{opacity:1,y:0,duration:.65,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
  $$("[data-stagger]").forEach(w=>gsap.from(w.children,{opacity:0,y:20,stagger:.05,duration:.5,ease:"power2.out",scrollTrigger:{trigger:w,start:"top 88%",once:true}}));
  if(!mobile) $$("[data-image-shift]").forEach(img=>gsap.fromTo(img,{yPercent:-2},{yPercent:2,ease:"none",scrollTrigger:{trigger:img,start:"top bottom",end:"bottom top",scrub:.5}}));
}else{
  $$("[data-reveal]").forEach(el=>{el.style.opacity=1;el.style.transform="none"});
}
if(window.lucide)lucide.createIcons();
