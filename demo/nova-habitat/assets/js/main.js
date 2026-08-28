const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

if(window.lucide)lucide.createIcons();

const properties = {
  1:{title:"Villa Azur",city:"Carry-le-Rouet",price:895000,image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=88",desc:"Villa contemporaine avec piscine, terrasse et vue dégagée.",beds:4,baths:3,size:"210 m²"},
  2:{title:"Appartement Prado",city:"Marseille 8e",price:465000,image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=88",desc:"Appartement lumineux, terrasse plein sud et résidence sécurisée.",beds:3,baths:2,size:"112 m²"},
  3:{title:"Maison des Étangs",city:"Martigues",price:395000,image:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=88",desc:"Maison familiale rénovée avec jardin et espace bureau indépendant.",beds:4,baths:2,size:"148 m²"},
  4:{title:"Villa Cézanne",city:"Aix-en-Provence",price:1250000,image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=88",desc:"Propriété d'architecte avec piscine et parc paysager.",beds:5,baths:4,size:"285 m²"},
  5:{title:"Loft Ferrières",city:"Martigues",price:279000,image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=88",desc:"Loft moderne avec grande pièce de vie et prestations soignées.",beds:2,baths:1,size:"86 m²"},
  6:{title:"Maison Borély",city:"Marseille",price:540000,image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=88",desc:"Maison avec jardin, garage et accès rapide aux écoles.",beds:4,baths:2,size:"165 m²"}
};

let favorites=JSON.parse(localStorage.getItem("nova-favorites")||"[]");
let currentProperty=1;

const money=v=>Number(v).toLocaleString("fr-FR")+" €";

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

function syncFavorites(){
  $("#favCount").textContent=favorites.length;
  $$(".fav-button").forEach(b=>{
    b.classList.toggle("active",favorites.includes(Number(b.dataset.fav)));
  });
  localStorage.setItem("nova-favorites",JSON.stringify(favorites));
}

$$(".fav-button").forEach(b=>b.onclick=e=>{
  e.stopPropagation();
  const id=Number(b.dataset.fav);
  favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
  syncFavorites();
  toast(favorites.includes(id)?"Ajouté aux favoris":"Retiré des favoris");
});
syncFavorites();

function renderFavoriteDrawer(){
  $("#favList").innerHTML=favorites.length
    ? favorites.map(id=>{
      const p=properties[id];
      return `<div class="fav-row">
        <img src="${p.image}" alt="">
        <div><b>${p.title}</b><span>${money(p.price)}</span></div>
        <button data-remove-fav="${id}">Retirer</button>
      </div>`;
    }).join("")
    : '<div class="no-results show"><b>Aucun favori.</b><span>Ajoutez des biens avec le cœur.</span></div>';

  $$("[data-remove-fav]").forEach(b=>b.onclick=()=>{
    favorites=favorites.filter(x=>x!==Number(b.dataset.removeFav));
    syncFavorites();
    renderFavoriteDrawer();
  });
}

$("#favOpen").onclick=()=>{renderFavoriteDrawer();$("#favDrawer").classList.add("open")};
$("#favClose").onclick=()=>$("#favDrawer").classList.remove("open");

function openDetails(id){
  currentProperty=id;
  const p=properties[id];
  $("#modalImage").src=p.image;
  $("#modalTitle").textContent=p.title;
  $("#modalCity").textContent=p.city;
  $("#modalDescription").textContent=p.desc;
  $("#modalPrice").textContent=money(p.price);
  $("#modalSpecs").innerHTML=`
    <span><i data-lucide="bed-double"></i> ${p.beds} chambres</span>
    <span><i data-lucide="bath"></i> ${p.baths} salles de bain</span>
    <span><i data-lucide="ruler"></i> ${p.size}</span>`;
  $("#propertyModal").classList.add("open");
  if(window.lucide)lucide.createIcons();
}

$$(".details-button").forEach(b=>b.onclick=()=>openDetails(Number(b.dataset.details)));
$("#propertyClose").onclick=()=>$("#propertyModal").classList.remove("open");

$("#visitOpen").onclick=()=>{
  $("#propertyModal").classList.remove("open");
  $("#visitModal").classList.add("open");
};
$("#visitClose").onclick=()=>$("#visitModal").classList.remove("open");
$("#visitForm").onsubmit=e=>{
  e.preventDefault();
  $("#visitStatus").textContent="✓ Visite démo confirmée pour "+properties[currentProperty].title+".";
  e.currentTarget.reset();
  setTimeout(()=>$("#visitModal").classList.remove("open"),1800);
};

function applyFilter(){
  const type=$(".filter-buttons .active")?.dataset.filter||"all";
  let visible=0;
  $$(".property-card").forEach(card=>{
    const show=type==="all"||card.dataset.type===type;
    card.classList.toggle("hide",!show);
    if(show) visible++;
  });
  $("#noResults").classList.toggle("show",visible===0);
}

$$("[data-filter]").forEach(b=>b.onclick=()=>{
  $$("[data-filter]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  applyFilter();
});

$("#sortSelect").onchange=e=>{
  const grid=$("#propertiesGrid");
  const cards=$$(".property-card");
  if(e.target.value==="default") return;
  cards.sort((a,b)=>{
    const pa=Number(a.dataset.price),pb=Number(b.dataset.price);
    return e.target.value==="asc"?pa-pb:pb-pa;
  }).forEach(c=>grid.appendChild(c));
};

$("#heroSearchButton").onclick=()=>{
  const loc=$("#heroLocation").value;
  const type=$("#heroType").value;
  const budget=Number($("#heroBudget").value);
  let visible=0;

  $$(".property-card").forEach(card=>{
    const cityOk=loc==="all"||card.dataset.city.includes(loc);
    const typeOk=type==="all"||card.dataset.type===type;
    const priceOk=Number(card.dataset.price)<=budget;
    const show=cityOk&&typeOk&&priceOk;
    card.classList.toggle("hide",!show);
    if(show) visible++;
  });

  $("#noResults").classList.toggle("show",visible===0);
  document.querySelector("#properties").scrollIntoView({behavior:"smooth"});
};

function calculateFinance(){
  const price=Number($("#financePrice").value)||0;
  const deposit=Number($("#financeDeposit").value)||0;
  const years=Number($("#financeYears").value)||20;
  const annual=Number($("#financeRate").value)||0;
  const principal=Math.max(0,price-deposit);
  const months=years*12;
  const r=annual/100/12;

  let monthly=0;
  if(principal>0){
    monthly=r===0?principal/months:principal*(r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1);
  }
  $("#monthlyResult").textContent=money(Math.round(monthly))+" / mois";
}

["#financePrice","#financeDeposit","#financeYears","#financeRate"].forEach(sel=>{
  $(sel).addEventListener("input",calculateFinance);
  $(sel).addEventListener("change",calculateFinance);
});
calculateFinance();

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

  $$("[data-reveal]").forEach(el=>{
    gsap.to(el,{opacity:1,y:0,duration:.65,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
  });

  $$("[data-stagger]").forEach(wrap=>{
    gsap.from(wrap.children,{y:20,opacity:0,stagger:.055,duration:.5,ease:"power2.out",scrollTrigger:{trigger:wrap,start:"top 88%",once:true}});
  });

  $$("[data-counter]").forEach(el=>{
    const end=Number(el.dataset.counter);
    const obj={v:0};
    gsap.to(obj,{v:end,duration:1.1,ease:"power1.out",scrollTrigger:{trigger:el,start:"top 90%",once:true},onUpdate:()=>el.textContent=Math.round(obj.v)});
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
