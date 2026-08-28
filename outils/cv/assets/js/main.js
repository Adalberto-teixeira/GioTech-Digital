const $=s=>document.querySelector(s);
let _scrollLockY=0;
function lockBodyScroll(){_scrollLockY=window.scrollY;document.body.style.position="fixed";document.body.style.top=-_scrollLockY+"px";document.body.style.left="0";document.body.style.right="0";document.body.style.width="100%"}
function unlockBodyScroll(){document.body.style.position="";document.body.style.top="";document.body.style.left="";document.body.style.right="";document.body.style.width="";window.scrollTo(0,_scrollLockY)}
const templates=[
 {id:"executive",name:"Executive Or",cat:"professionnel",tag:"Cadre / Direction",desc:"Sobre, structuré et idéal pour les profils expérimentés."},
 {id:"legal",name:"Juridique Élégant",cat:"professionnel",tag:"Juridique",desc:"Classique et premium pour droit, conseil et professions libérales."},
 {id:"tech",name:"Tech Soft",cat:"tech",tag:"Informatique",desc:"Moderne, lisible et adapté aux métiers techniques et digitaux."},
 {id:"creative",name:"Créatif Orange",cat:"creatif",tag:"Créatif",desc:"Fort impact visuel pour design, communication et métiers créatifs."},
 {id:"admin",name:"Administratif Clair",cat:"professionnel",tag:"Administratif",desc:"Très lisible, rassurant et efficace pour les fonctions support."},
 {id:"marketing",name:"Marketing Blue",cat:"marketing",tag:"Marketing",desc:"Dynamique pour marketing digital, social media et communication."}
];
let state={
 template:null, photo:"",
 experiences:[
  {role:"Chargée de communication",company:"Studio Horizon",location:"Marseille, France",dates:"2023 — Aujourd’hui",desc:"Pilotage des contenus digitaux\nCoordination de campagnes\nSuivi des projets"},
  {role:"Assistante communication",company:"Maison Nova",location:"Aix-en-Provence, France",dates:"2020 — 2023",desc:"Création de supports\nRédaction\nOrganisation des actions de communication"}
 ],
 education:[{degree:"Master Communication digitale",school:"École Exemple",location:"Marseille, France",dates:"2018 — 2020"}],
 optional:{certifications:"Gestion de projet — 2024\nMarketing digital — 2023"}
};
let previewTemplateId=null;
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function nl2br(s){return esc(s).replace(/\r?\n/g,"<br>")}
function lineArray(s){return String(s||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}
function v(id){return $("#"+id)?.value||""}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1700)}
function genericPhoto(){return `<div class="avatar avatar-placeholder"></div>`}
function photo(){return state.photo?`<img class="avatar" src="${state.photo}" alt="">`:genericPhoto()}
function fullNameParts(name){const a=name.trim().split(/\s+/);return {first:a[0]||"",rest:a.slice(1).join(" ")}}

function common(){
 const skills=lineArray(v("skills"));
 const langs=lineArray(v("languages"));
 const interests=lineArray(v("interests"));
 return {
  name:esc((v("firstName")+" "+v("lastName")).trim()||"Camille Bernard"),
  role:esc(v("jobTitle")||"Chargée de communication"),
  email:esc(v("email")),phone:esc(v("phone")),city:esc(v("city")),address:esc(v("address")),website:esc(v("website")),
  profile:nl2br(v("profile")),skills,langs,interests,
  exps:state.experiences.map(x=>`<div class="exp"><b>${esc(x.role)}</b><small>${esc(x.company)}${x.location?" · "+esc(x.location):""}${x.dates?" · "+esc(x.dates):""}</small><p>${nl2br(x.desc)}</p></div>`).join(""),
  edus:state.education.map(x=>`<div class="exp"><b>${esc(x.degree)}</b><small>${esc(x.school)}${x.location?" · "+esc(x.location):""}${x.dates?" · "+esc(x.dates):""}</small></div>`).join("")
 };
}
function contact(c){return `<div class="meta">${c.phone}${c.phone?"<br>":""}${c.email}${c.email?"<br>":""}${c.address}${c.address?"<br>":""}${c.city}${c.city?"<br>":""}${c.website}</div>`}
function verticalList(arr,cls="plain-list"){return `<ul class="${cls}">${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`}
function interests(c){return c.interests.length?`<section class="interest-section"><h2>Centres d’intérêt</h2>${verticalList(c.interests,"interest-list")}</section>`:""}
function languages(c){return c.langs.length?verticalList(c.langs,"plain-list"):""}
function skills(c){return c.skills.length?verticalList(c.skills,"skill-list-vertical"):""}

function sampleData(id){return {
 name:"Camille Bernard",role:id==="legal"?"Juriste d’entreprise":id==="tech"?"Développeuse web":id==="creative"?"Designer graphique":id==="admin"?"Assistante administrative":id==="marketing"?"Social Media Manager":"Responsable administratif",
 email:"camille@email.fr",phone:"+33 6 12 34 56 78",city:"Lyon, France",address:"10 rue des Lilas",website:"linkedin.com/in/camille",
 profile:"Professionnelle organisée, autonome et orientée résultats, avec une expérience solide et un excellent sens du travail en équipe.",
 skills:["Organisation","Communication","Gestion de projet","Analyse"],langs:["Français — Courant","Anglais — Intermédiaire"],interests:["Sport","Lecture","Voyages"],
 exps:`<div class="exp"><b>Responsable de projet</b><small>Entreprise Exemple · Marseille · 2022 — Aujourd’hui</small><p>Coordination des projets<br>Suivi des objectifs<br>Collaboration avec les équipes</p></div><div class="exp"><b>Assistante</b><small>Studio Exemple · Aix-en-Provence · 2019 — 2022</small><p>Organisation<br>Suivi administratif<br>Communication</p></div>`,
 edus:`<div class="exp"><b>Master professionnel</b><small>Université Exemple · Marseille · 2017 — 2019</small></div>`
}}

function renderPaper(id,sample=false){
 const c=sample?sampleData(id):common();
 const img=sample?`<div class="avatar avatar-placeholder"></div>`:photo();
 const n=fullNameParts(c.name.replace(/&amp;/g,"&"));

 if(id==="executive") return `<div class="cv-paper tpl-executive"><aside class="side">${img}<h2>Coordonnées</h2>${contact(c)}<h2>Compétences</h2>${skills(c)}<h2>Langues</h2>${languages(c)}${interests(c)}</aside><main class="main"><h1>${esc(n.first)} <span>${esc(n.rest)}</span></h1><div class="role">${c.role}</div><h2>Profil</h2><p>${c.profile}</p><h2>Expérience professionnelle</h2>${c.exps}<h2>Formation</h2>${c.edus}</main></div>`;

 if(id==="legal") return `<div class="cv-paper tpl-legal"><aside class="side">${img}<h2>Coordonnées</h2>${contact(c)}<h2>Compétences</h2>${skills(c)}<h2>Langues</h2>${languages(c)}${interests(c)}</aside><main class="main"><h1>${esc(n.first)} <span>${esc(n.rest)}</span></h1><div class="role">${c.role}</div><h2>Profil</h2><p>${c.profile}</p><h2>Expérience professionnelle</h2>${c.exps}<h2>Formation</h2>${c.edus}</main></div>`;

 if(id==="tech") return `<div class="cv-paper tpl-tech"><div class="top">${img}<div class="identity"><div class="hello">Bonjour, je suis</div><h1>${c.name}</h1><div class="role">${c.role}</div><div class="meta">${c.address}${c.address?" · ":""}${c.city}<br>${c.phone}${c.phone?"<br>":""}${c.email}<br>${c.website}</div></div></div><div class="tech-grid"><main class="tech-main"><section><h2>Profil</h2><p>${c.profile}</p></section><section><h2>Expérience professionnelle</h2>${c.exps}</section><section><h2>Formation</h2>${c.edus}</section></main><aside class="tech-side"><section class="box"><h2>Compétences</h2>${skills(c)}</section><section class="box"><h2>Langues</h2>${languages(c)}</section><section class="box"><h2>Centres d’intérêt</h2>${verticalList(c.interests,"plain-list")}</section></aside></div></div>`;

 if(id==="creative") return `<div class="cv-paper tpl-creative"><aside class="left">${img}<h1>${esc(n.first)} <span>${esc(n.rest)}</span></h1><div class="role">${c.role}</div><h2>Coordonnées</h2>${contact(c)}<h2>Compétences</h2>${skills(c)}<h2>Langues</h2>${languages(c)}${interests(c)}</aside><main class="right"><h2>Profil</h2><p>${c.profile}</p><h2>Expériences</h2>${c.exps}<h2>Formation</h2>${c.edus}</main></div>`;

 if(id==="admin") return `<div class="cv-paper tpl-admin"><aside class="left">${img}<h2>Coordonnées</h2>${contact(c)}<h2>Compétences</h2>${skills(c)}<h2>Langues</h2>${languages(c)}${interests(c)}</aside><main class="main"><h1>${c.name}</h1><div class="role">${c.role}</div><h2>Profil</h2><p>${c.profile}</p><h2>Expérience professionnelle</h2>${c.exps}<h2>Formation</h2>${c.edus}</main></div>`;

 return `<div class="cv-paper tpl-marketing"><div class="top"><div class="identity"><h1>${c.name}</h1><div class="role">${c.role}</div><div class="profile-under-name"><h2>Profil</h2><p>${c.profile}</p></div></div><div class="photo-contact">${img}<div class="meta">${c.address}${c.address?"<br>":""}${c.city}<br>${c.phone}<br>${c.email}<br>${c.website}</div></div></div><div class="content"><section class="left-col"><h2>Expériences</h2>${c.exps}<h2>Formation</h2>${c.edus}</section><section class="right-col"><div class="box skills-box"><h2>Compétences</h2>${skills(c)}</div><div class="box"><h2>Langues</h2>${languages(c)}</div><div class="box"><h2>Centres d’intérêt</h2>${verticalList(c.interests,"plain-list")}</div></section></div></div>`;
}

function renderCards(filter="all"){
 $("#modelGrid").innerHTML=templates.filter(t=>filter==="all"||t.cat===filter).map(t=>`<article class="model-card"><div class="model-thumb"><div class="thumb-scale">${renderPaper(t.id,true)}</div><div class="hover-actions"><button class="view" data-view="${t.id}">Voir</button><button class="choose" data-choose="${t.id}">Choisir</button></div></div><div class="model-info"><div class="top"><h3>${t.name}</h3><span>${t.tag}</span></div><p>${t.desc}</p></div></article>`).join("");
 document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>openModel(b.dataset.view));
 document.querySelectorAll("[data-choose]").forEach(b=>b.onclick=()=>chooseModel(b.dataset.choose));
}
function openModel(id){previewTemplateId=id;$("#modalModelName").textContent=templates.find(t=>t.id===id).name;$("#modelPaper").outerHTML=renderPaper(id,true).replace('class="cv-paper','id="modelPaper" class="cv-paper');$("#modelModal").classList.add("open");lockBodyScroll()}
function chooseModel(id){state.template=id;$("#selectedTitle").textContent="Modèle sélectionné : "+templates.find(t=>t.id===id).name;$("#creatorEmpty").classList.add("hidden");$("#creatorWorkspace").classList.remove("hidden");$("#changeModel").classList.remove("hidden");renderOptional();renderRepeats();renderLive();setTimeout(()=>$("#createur").scrollIntoView({behavior:"smooth"}),80)}
function renderOptional(){const box=$("#optionalFields");if(state.template==="legal")box.innerHTML=`<h3>Informations complémentaires</h3><label>Certifications / formations complémentaires<textarea id="optionalText">${esc(state.optional.certifications)}</textarea></label>`;else box.innerHTML=""}
function renderRepeats(){
 $("#experiences").innerHTML=state.experiences.map((x,i)=>`<div class="repeat-item"><div class="grid2"><label>Poste<input data-exp="${i}" data-k="role" value="${esc(x.role)}"></label><label>Entreprise<input data-exp="${i}" data-k="company" value="${esc(x.company)}"></label><label>Localisation<input data-exp="${i}" data-k="location" placeholder="Marseille, France" value="${esc(x.location||"")}"></label><label>Période<input data-exp="${i}" data-k="dates" value="${esc(x.dates)}"></label></div><label>Description <small>Appuyez sur Entrée pour créer une nouvelle ligne</small><textarea data-exp="${i}" data-k="desc">${esc(x.desc)}</textarea></label><button type="button" class="remove" data-remove-exp="${i}">Supprimer</button></div>`).join("");
 $("#education").innerHTML=state.education.map((x,i)=>`<div class="repeat-item"><div class="grid2"><label>Diplôme<input data-edu="${i}" data-k="degree" value="${esc(x.degree)}"></label><label>Établissement<input data-edu="${i}" data-k="school" value="${esc(x.school)}"></label><label>Localisation<input data-edu="${i}" data-k="location" placeholder="Marseille, France" value="${esc(x.location||"")}"></label><label>Période<input data-edu="${i}" data-k="dates" value="${esc(x.dates)}"></label></div><button type="button" class="remove" data-remove-edu="${i}">Supprimer</button></div>`).join("");
 document.querySelectorAll("[data-exp]").forEach(x=>x.oninput=e=>{state.experiences[+e.target.dataset.exp][e.target.dataset.k]=e.target.value;renderLive()});
 document.querySelectorAll("[data-edu]").forEach(x=>x.oninput=e=>{state.education[+e.target.dataset.edu][e.target.dataset.k]=e.target.value;renderLive()});
 document.querySelectorAll("[data-remove-exp]").forEach(x=>x.onclick=()=>{state.experiences.splice(+x.dataset.removeExp,1);renderRepeats();renderLive()});
 document.querySelectorAll("[data-remove-edu]").forEach(x=>x.onclick=()=>{state.education.splice(+x.dataset.removeEdu,1);renderRepeats();renderLive()});
}
function setPaper(el,id){el.outerHTML=renderPaper(id,false).replace('class="cv-paper',`id="${el.id}" class="cv-paper`)}
function renderLive(){if(!state.template)return;setPaper($("#livePaper"),state.template);requestAnimationFrame(updatePageWarning)}
function openPreview(){if(!state.template)return;setPaper($("#previewPaper"),state.template);$("#previewModal").classList.add("open");lockBodyScroll()}
function closePreview(){$("#previewModal").classList.remove("open");unlockBodyScroll()}

function cvOverflowInfo(el){
 if(!el)return {overflow:false,extra:0};
 const extra=Math.max(0,el.scrollHeight-1123);
 return {overflow:extra>3,extra};
}
function updatePageWarning(){
 const el=$("#livePaper"); if(!el)return;
 const info=cvOverflowInfo(el);
 let warn=$("#pageLimitWarning");
 if(!warn){warn=document.createElement("div");warn.id="pageLimitWarning";warn.className="page-limit-warning";const shell=document.querySelector(".mini-paper-shell");shell?.parentNode?.insertBefore(warn,shell)}
 warn.innerHTML=info.overflow?`⚠️ <b>Le contenu dépasse une page A4.</b> Réduisez le texte avant de télécharger pour éviter qu'une partie du CV soit coupée.`:`✓ Le contenu tient sur une page A4.`;
 warn.classList.toggle("danger",info.overflow);
}
async function downloadPdf(){
 if(!state.template)return;
 openPreview();
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const el=$("#previewPaper");
 const limit=cvOverflowInfo(el);
 if(limit.overflow){
   const ok=confirm("Attention : votre CV dépasse la limite d’une page A4. Une partie du texte risque d’être coupée dans le PDF.\n\nAppuyez sur Annuler pour revenir au formulaire et réduire le contenu, ou sur OK pour télécharger quand même.");
   if(!ok){closePreview();return;}
 }
 if(!window.html2canvas || !window.jspdf){toast("Module PDF indisponible — rechargez la page avec Internet.");return}
 const btn=$("#modalDownload");const old=btn.textContent;btn.disabled=true;btn.textContent="Création du PDF…";
 try{
   const canvas=await html2canvas(el,{scale:2,useCORS:true,backgroundColor:"#ffffff",logging:false,width:794,height:1123,windowWidth:794,windowHeight:1123});
   const img=canvas.toDataURL("image/jpeg",0.96);
   const {jsPDF}=window.jspdf;
   const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});
   pdf.addImage(img,"JPEG",0,0,210,297,undefined,"FAST");
   const filename=((v("firstName")+"-"+v("lastName")+"-CV").trim().replace(/\s+/g,"-").replace(/[^a-zA-Z0-9À-ÿ_-]/g,"")||"mon-cv")+".pdf";
   pdf.save(filename);
   toast("PDF téléchargé");
 }catch(err){console.error(err);toast("Impossible de créer le PDF")}
 finally{btn.disabled=false;btn.textContent=old}
}

$("#photoInput").onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.photo=r.result;$("#photoPreview").src=state.photo;renderLive()};r.readAsDataURL(f)};
$("#addExp").onclick=()=>{state.experiences.push({role:"Nouveau poste",company:"Entreprise",location:"",dates:"2024 — Aujourd’hui",desc:"Décrivez vos missions\nUne mission par ligne"});renderRepeats();renderLive()};
$("#addEdu").onclick=()=>{state.education.push({degree:"Nouvelle formation",school:"Établissement",location:"",dates:"2022 — 2024"});renderRepeats();renderLive()};
document.querySelectorAll("#cvForm input:not([type=file]),#cvForm textarea").forEach(el=>el.addEventListener("input",renderLive));
$("#refreshPreview").onclick=renderLive;$("#openPreview").onclick=openPreview;$("#previewLargeBtn").onclick=openPreview;$("#downloadPdf").onclick=downloadPdf;$("#modalDownload").onclick=downloadPdf;
$("#closePreviewModal").onclick=closePreview;$("#backPreviewModal").onclick=closePreview;
$("#closeModelModal").onclick=()=>{$("#modelModal").classList.remove("open");unlockBodyScroll()};
$("#chooseFromModal").onclick=()=>{const id=previewTemplateId;$("#modelModal").classList.remove("open");unlockBodyScroll();chooseModel(id)};
$("#changeModel").onclick=()=>$("#modeles").scrollIntoView({behavior:"smooth"});
$("#heroCta").onclick=()=>$("#modeles").scrollIntoView({behavior:"smooth"});if($("#topCta"))$("#topCta").onclick=()=>$("#modeles").scrollIntoView({behavior:"smooth"});
$("#saveBtn").onclick=()=>{const fields={};document.querySelectorAll("#cvForm input:not([type=file]),#cvForm textarea").forEach(el=>fields[el.id]=el.value);localStorage.setItem("giocv-data",JSON.stringify({state,fields}));toast("Données enregistrées")};
try{const saved=JSON.parse(localStorage.getItem("giocv-data")||"null");if(saved){state=saved.state||state;Object.entries(saved.fields||{}).forEach(([id,val])=>{const el=$("#"+id);if(el)el.value=val});if(state.photo)$("#photoPreview").src=state.photo;if(state.template)chooseModel(state.template)}}catch(e){}
$("#filters").querySelectorAll("button").forEach(b=>b.onclick=()=>{$("#filters").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));renderCards(b.dataset.filter)});
renderCards();
