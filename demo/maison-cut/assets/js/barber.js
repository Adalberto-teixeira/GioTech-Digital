const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let booking={service:"Skin Fade",price:28,duration:"45 min",barber:"Yanis",date:null,time:null},favs=get("barber-favs",[]);
const views=$$(".view");

function go(v){
  views.forEach(x=>x.classList.toggle("active",x.dataset.view===v));
  $$(".bottom-nav [data-nav]").forEach(x=>x.classList.toggle("active",x.dataset.nav===v));
  location.hash=v;scrollTo(0,0);$("#menuDrawer").classList.remove("open");
  if(v==="account")renderAppointments()
}
$$("[data-nav]").forEach(b=>b.onclick=e=>{e.preventDefault();go(b.dataset.nav)});
addEventListener("hashchange",()=>go(location.hash.slice(1)||"home"));
setTimeout(()=>go(location.hash.slice(1)||"home"),0);

$("#menuOpen").onclick=()=>$("#menuDrawer").classList.add("open");
$("#menuClose").onclick=()=>$("#menuDrawer").classList.remove("open");
$("#favOpen").onclick=()=>{renderFavs();$("#favDrawer").classList.add("open")};
$("#favClose").onclick=()=>$("#favDrawer").classList.remove("open");

function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1500)}

$$(".select-service").forEach(b=>b.onclick=()=>{
  booking.service=b.dataset.service;booking.price=+b.dataset.price;booking.duration=b.dataset.duration;
  const opt=[...$("#bookingService").options].find(o=>o.textContent.startsWith(b.dataset.service));
  if(opt)$("#bookingService").value=opt.value;
  syncSummary();go("booking")
});

$("#bookingService").onchange=e=>{
  const [price,name,duration]=e.target.value.split("|");
  booking={...booking,service:name,price:+price,duration};syncSummary()
};

$$("[data-barber]",$("#barberChoice")).forEach(b=>b.onclick=()=>{
  $$("[data-barber]",$("#barberChoice")).forEach(x=>x.classList.remove("active"));
  b.classList.add("active");booking.barber=b.dataset.barber;syncSummary()
});

$$(".book-barber").forEach(b=>b.onclick=()=>{
  booking.barber=b.dataset.barber;
  $$("[data-barber]",$("#barberChoice")).forEach(x=>x.classList.toggle("active",x.dataset.barber===booking.barber));
  syncSummary();go("booking")
});

const names=["DIM","LUN","MAR","MER","JEU","VEN","SAM"];
const slotsByDay=[
["09:00","10:00","11:30","14:00","16:00","17:30"],
["09:30","11:00","13:30","15:00","17:00","18:30"],
["09:00","10:30","12:00","14:30","16:30","18:00"],
["10:00","11:30","13:00","15:30","17:30","19:00"],
["09:30","11:00","14:00","15:30","17:00","18:30"],
["09:00","10:30","12:00","14:00","16:00","18:00"],
["10:00","11:30","13:00","15:00","16:30"]
];

function buildDates(){
  const strip=$("#dateStrip");strip.innerHTML="";
  const now=new Date();
  for(let i=0;i<7;i++){
    const d=new Date(now);d.setDate(now.getDate()+i);
    const iso=d.toISOString().slice(0,10);
    const b=document.createElement("button");b.className="date-btn";b.dataset.date=iso;b.dataset.idx=i;
    b.innerHTML=`<span>${names[d.getDay()]}</span><b>${d.getDate()}</b><small>${d.toLocaleString("fr-FR",{month:"short"}).replace(".","")}</small>`;
    b.onclick=()=>selectDate(b);strip.appendChild(b)
  }
  selectDate(strip.firstElementChild)
}
function selectDate(b){
  $$(".date-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  booking.date=b.dataset.date;booking.time=null;renderSlots(+b.dataset.idx);syncSummary()
}
function renderSlots(idx){
  const s=$("#slots"),base=slotsByDay[idx%slotsByDay.length];
  s.innerHTML=base.map((t,i)=>`<button class="${(i===1&&idx%2===0)||(i===4&&idx%3===0)?"disabled":""}" data-time="${t}">${t}</button>`).join("");
  $$("[data-time]",s).forEach(b=>b.onclick=()=>{$$("[data-time]",s).forEach(x=>x.classList.remove("active"));b.classList.add("active");booking.time=b.dataset.time;syncSummary()})
}
function syncSummary(){
  $("#summaryService").textContent=booking.service;$("#summaryBarber").textContent=booking.barber;$("#summaryPrice").textContent=booking.price+" €";
  $("#summaryDate").textContent=booking.date?new Date(booking.date+"T12:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}):"—";
  $("#summaryTime").textContent=booking.time||"—"
}
buildDates();syncSummary();

$("#continueBooking").onclick=()=>{
  if(!booking.date||!booking.time)return toast("Choisissez un créneau");
  $("#modalSummary").innerHTML=`<b>${booking.service}</b><br>Avec ${booking.barber}<br>${new Date(booking.date+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} · ${booking.time}<br>${booking.duration} · ${booking.price} €`;
  $("#bookingModal").classList.add("open")
};
$("#bookingClose").onclick=()=>$("#bookingModal").classList.remove("open");

$("#bookingForm").onsubmit=e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget));
  const arr=get("barber-appointments",[]);
  arr.push({...booking,...data,id:Date.now()});set("barber-appointments",arr);
  $("#bookingStatus").textContent="✓ Rendez-vous démo confirmé.";
  e.currentTarget.reset();
  setTimeout(()=>{$("#bookingModal").classList.remove("open");go("account")},1300)
};

function renderAppointments(){
  const arr=get("barber-appointments",[]),el=$("#appointmentList");
  el.innerHTML=arr.length?arr.map(a=>`<article class="appointment-card"><span>CONFIRMÉ · DÉMO</span><h2>${a.service}</h2><p>${new Date(a.date+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} · ${a.time}<br>Avec ${a.barber}</p><div><b>${a.price} €</b><button data-cancel="${a.id}">Annuler</button></div></article>`).join(""):'<div class="account-note"><span>AUCUN RENDEZ-VOUS</span><p>Réservez un créneau pour le voir apparaître ici.</p></div>';
  $$("[data-cancel]").forEach(b=>b.onclick=()=>{set("barber-appointments",arr.filter(a=>a.id!=b.dataset.cancel));renderAppointments()})
}

$$(".gallery-filter button").forEach(b=>b.onclick=()=>{
  $$(".gallery-filter button").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  $$("[data-style-card]").forEach(c=>c.classList.toggle("hide",b.dataset.style!=="all"&&c.dataset.styleCard!==b.dataset.style))
});

$$(".fav-style").forEach(b=>b.onclick=()=>{
  const name=$("span",b.closest("article")).textContent;
  if(favs.includes(name)){favs=favs.filter(x=>x!==name);b.classList.remove("active")}
  else{favs.push(name);b.classList.add("active")}
  set("barber-favs",favs);toast(favs.includes(name)?"Style enregistré":"Style retiré")
});
function renderFavs(){
  const el=$("#favList");
  el.innerHTML=favs.length?favs.map(x=>`<div class="fav-chip">${x}</div>`).join(""):"<p>Ajoutez un style depuis la galerie.</p>"
}