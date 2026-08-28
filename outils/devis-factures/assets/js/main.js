const $=s=>document.querySelector(s);
let _scrollLockY=0;
function lockBodyScroll(){_scrollLockY=window.scrollY;document.body.style.position="fixed";document.body.style.top=-_scrollLockY+"px";document.body.style.left="0";document.body.style.right="0";document.body.style.width="100%"}
function unlockBodyScroll(){document.body.style.position="";document.body.style.top="";document.body.style.left="";document.body.style.right="";document.body.style.width="";window.scrollTo(0,_scrollLockY)}
const $$=s=>[...document.querySelectorAll(s)];
let docType="devis";
let selectedTemplate="classic";
let logoData="";
let invoiceStatus="a_payer";
let items=[
 {name:"Prestation principale",desc:"Description de la prestation principale",qty:1,unit:"forfait",price:950},
 {name:"Service complémentaire",desc:"Description du service complémentaire",qty:1,unit:"an",price:180}
];

const templates=[
 ["classic","Classique","Sobre et professionnel"],
 ["blue","Service Blue","Bleu & jaune"],
 ["minimal","Design Minimal","Élégant et fin"],
 ["orange","Marketing Orange","Créatif et visible"],
 ["pro","Pro Business","Structuré et complet"],
 ["soft","Soft Blue","Moderne et dynamique"]
];

function v(id){return $("#"+id)?.value.trim()||""}
function n(id){return parseFloat($("#"+id)?.value||0)||0}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1500)}
function fmt(value){
 const cur=$("#currency").value;
 const v=Number(value||0);
 if(cur==="€")return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(v);
 if(cur==="$")return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v);
 if(cur==="R$")return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
 return new Intl.NumberFormat("fr-CH",{style:"currency",currency:"CHF"}).format(v);
}
function dateFr(id){
 const x=v(id);if(!x)return "";
 return new Date(x+"T12:00:00").toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"});
}
function totals(){
 const subtotal=items.reduce((s,x)=>s+(Number(x.qty)||0)*(Number(x.price)||0),0);
 const discount=subtotal*(n("discount")/100);
 const after=subtotal-discount;
 const tax=after*(n("tax")/100);
 return {subtotal,discount,after,tax,total:after+tax};
}
function statusText(){
 return invoiceStatus==="payee"?"PAYÉE":invoiceStatus==="retard"?"EN RETARD":"À PAYER";
}
function statusColor(){
 return invoiceStatus==="payee"?"#198754":invoiceStatus==="retard"?"#b62f2f":"#c27a13";
}

function logo(size=85){
 if(logoData)return `<img src="${logoData}" alt="" style="width:${size}px;height:${Math.round(size*.7)}px;object-fit:contain">`;
 return `<div style="font:800 18px Manrope;color:#20252c">${esc(v("companyName"))}</div>`;
}
function infoBlocks(){
 const client=`<div><div class="doc-label">Client</div><div class="small" style="margin-top:7px"><b>${esc(v("clientName"))}</b><br>${esc(v("clientAddress"))}<br>${esc(v("clientPhone"))}<br>${esc(v("clientEmail"))}</div></div>`;
 const meta=`<div><div class="doc-label">${docType==="devis"?"Devis":"Facture"}</div><div class="small" style="margin-top:7px">N° ${esc(v("docNumber"))}<br>Émis le ${dateFr("issueDate")}${docType==="devis"?`<br>Validité : ${esc(v("validity"))}`:`<br>Échéance : ${dateFr("dueDate")}`}</div></div>`;
 return {client,meta};
}
function tableHtml(mode="standard"){
 const rows=items.map(x=>`<tr><td><b>${esc(x.name)}</b>${x.desc?`<div class="tiny" style="margin-top:3px">${esc(x.desc)}</div>`:""}</td><td>${esc(x.qty)}</td><td>${esc(x.unit)}</td><td>${fmt(x.price)}</td><td><b>${fmt((Number(x.qty)||0)*(Number(x.price)||0))}</b></td></tr>`).join("");
 return `<table><thead><tr><th>DESCRIPTION</th><th>QTÉ</th><th>UNITÉ</th><th>PRIX</th><th>TOTAL</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function totalsHtml(extraClass=""){
 const t=totals();
 return `<div class="totals ${extraClass}">
   <div class="totals-row"><span>Sous-total</span><b>${fmt(t.subtotal)}</b></div>
   ${t.discount>0?`<div class="totals-row"><span>Remise (${n("discount")}%)</span><b>- ${fmt(t.discount)}</b></div>`:""}
   <div class="totals-row"><span>TVA (${n("tax")}%)</span><b>${fmt(t.tax)}</b></div>
   <div class="totals-row grand"><span>TOTAL</span><span>${fmt(t.total)}</span></div>
 </div>`;
}
function footerHtml(){
 return `<div class="footer-grid">
   <div><div class="doc-label">Paiement</div><div class="tiny" style="margin-top:7px">${esc(v("paymentTerms")).replace(/\n/g,"<br>")}</div></div>
   <div><div class="doc-label">Coordonnées bancaires</div><div class="tiny" style="margin-top:7px">${esc(v("bankInfo")).replace(/\n/g,"<br>")}</div></div>
 </div>
 ${v("notes")?`<div style="margin-top:20px"><div class="doc-label">Observations</div><div class="tiny" style="margin-top:7px">${esc(v("notes")).replace(/\n/g,"<br>")}</div></div>`:""}`;
}
function companyFooter(){
 return `<div class="tiny" style="margin-top:28px">${esc(v("companyName"))} · ${esc(v("companyAddress"))}<br>${esc(v("companyPhone"))} · ${esc(v("companyEmail"))} · ${esc(v("companyWebsite"))}${v("companyId")?` · ${esc(v("companyId"))}`:""}</div>`;
}
function renderTemplate(t){
 const ib=infoBlocks(), title=docType==="devis"?"DEVIS":"FACTURE";
 const status=docType==="facture"?`<span class="status-stamp" style="background:${statusColor()}18;color:${statusColor()}">${statusText()}</span>`:"";
 if(t==="blue"){
   return `<div class="top-band"><div>${logo(95)}<div class="tiny" style="margin-top:8px;color:#fff">${esc(v("companyActivity"))}<br>${esc(v("companyPhone"))}<br>${esc(v("companyEmail"))}</div></div><div style="text-align:right"><div class="doc-label">${title}</div><div style="font:800 2.3rem Manrope;margin-top:4px">${esc(v("projectTitle"))}</div></div></div><div class="doc-inner"><div class="client-row">${ib.client}${ib.meta}</div>${status}<div style="margin-top:24px">${tableHtml()}</div>${totalsHtml()}${footerHtml()}${companyFooter()}</div>`;
 }
 if(t==="minimal"){
   return `<div class="logo-top">${logo(105)}<div class="tiny" style="color:white">${esc(v("companyActivity"))}</div></div><div class="doc-inner"><div style="display:flex;justify-content:space-between;gap:30px"><div><div class="section-title">${title} #${esc(v("docNumber"))}</div><div class="small" style="margin-top:8px">${dateFr("issueDate")}</div></div><div style="text-align:right">${status}</div></div><div class="client-row" style="display:grid;grid-template-columns:1fr 1fr;gap:35px;margin-top:28px">${ib.client}${ib.meta}</div>${tableHtml()}${totalsHtml()}${footerHtml()}${companyFooter()}</div>`;
 }
 if(t==="orange"){
   return `<div class="shape"></div><div class="doc-inner"><div class="title-block"><h1>${title}</h1><div style="background:#f6b53a;display:inline-block;padding:5px 10px;font-weight:800">${esc(v("projectTitle"))}</div><div class="small" style="margin-top:12px">${status}</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:35px;margin-top:36px">${ib.client}${ib.meta}</div>${tableHtml()}${totalsHtml()}<div class="payment-box"><b>Conditions de paiement</b><div class="tiny" style="margin-top:5px">${esc(v("paymentTerms"))}</div></div>${footerHtml()}${companyFooter()}</div>`;
 }
 if(t==="pro"){
   const tals=totals();
   const rows=items.map(x=>`<tr><td>${esc(x.name)}<div class="tiny">${esc(x.desc)}</div></td><td>${fmt((Number(x.qty)||0)*(Number(x.price)||0))}</td></tr>`).join("");
   return `<div class="doc-inner"><div class="head-flex"><div><h1>PROPOSITION<br>${title}</h1><div class="small" style="margin-top:10px">${esc(v("projectTitle"))}</div></div><div>${logo(105)}<div class="tiny" style="text-align:right">${esc(v("companyActivity"))}</div></div></div><div class="intro-box"><div class="doc-label">Client</div><div class="small" style="margin-top:5px">${esc(v("clientName"))} · ${esc(v("clientCity"))}</div></div><table><thead><tr><th>SERVICE / DESCRIPTION</th><th>TOTAL</th></tr></thead><tbody>${rows}<tr class="total-row"><td>TOTAL</td><td>${fmt(tals.total)}</td></tr></tbody></table><div style="margin-top:22px" class="small"><b>${docType==="devis"?"VALIDITÉ":"ÉCHÉANCE"}</b> ${docType==="devis"?esc(v("validity")):dateFr("dueDate")}<br><b>PAIEMENT</b> ${esc(v("paymentTerms"))}</div>${v("notes")?`<div style="margin-top:18px"><div class="doc-label">Observations</div><div class="tiny" style="margin-top:5px">${esc(v("notes"))}</div></div>`:""}<div class="bottom-bar"><div><b>${esc(v("companyName"))}</b><div class="tiny">${esc(v("companyActivity"))}</div></div><div class="tiny">${esc(v("companyPhone"))}<br>${esc(v("companyAddress"))}</div></div></div>`;
 }
 if(t==="soft"){
   return `<div class="curve-top"></div><div class="doc-inner"><div style="display:flex;justify-content:space-between;gap:25px"><div><div class="doc-label">${esc(v("companyName"))}</div><h1 style="margin-top:5px">${title} #${esc(v("docNumber"))}</h1><div class="small">${dateFr("issueDate")}</div></div><div>${logo(95)}</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:35px;margin-top:28px">${ib.client}${ib.meta}</div>${status}<div style="margin-top:20px">${tableHtml()}</div>${totalsHtml("soft-total")}${footerHtml()}${companyFooter()}</div><div class="curve-bottom"></div>`;
 }
 return `<div class="doc-inner"><div class="doc-header"><div class="brand-block">${logo(90)}<div><div class="doc-label">${esc(v("companyName"))}</div><div class="tiny">${esc(v("companyActivity"))}<br>${esc(v("companyEmail"))}<br>${esc(v("companyPhone"))}</div></div></div><div class="doc-title"><h1>${title}</h1><div class="small">#${esc(v("docNumber"))}<br>${dateFr("issueDate")}</div>${status}</div></div><div class="client-row">${ib.client}${ib.meta}</div>${tableHtml()}${totalsHtml()}${footerHtml()}${companyFooter()}</div>`;
}

function paperClass(){
 return "paper template-"+selectedTemplate;
}
function render(){
 $("#paper").className=paperClass();
 $("#paper").innerHTML=renderTemplate(selectedTemplate);
 renderTemplates();
 requestAnimationFrame(checkPage);
}
function renderLarge(){
 $("#paperLarge").className=paperClass();
 $("#paperLarge").innerHTML=renderTemplate(selectedTemplate);
}
function checkPage(){
 const paper=$("#paper");
 const contentHeight=paper.scrollHeight;
 const tooLong=contentHeight>1123;
 $("#pageState").textContent=tooLong?"DÉPASSE A4":"A4 OK";
 $("#pageState").className="page-state "+(tooLong?"warn":"ok");
 $("#pageWarning").classList.toggle("hidden",!tooLong);
}
function renderItems(){
 $("#items").innerHTML=items.map((x,i)=>`<div class="item-row">
   <div class="item-top">
    <input data-i="${i}" data-k="name" value="${esc(x.name)}" placeholder="Service / Produit">
    <input data-i="${i}" data-k="qty" type="number" step="0.01" value="${x.qty}" placeholder="Qté">
    <input data-i="${i}" data-k="unit" value="${esc(x.unit)}" placeholder="Unité">
    <input data-i="${i}" data-k="price" type="number" step="0.01" value="${x.price}" placeholder="Prix">
    <button type="button" class="remove-item" data-remove="${i}">✕</button>
   </div>
   <textarea data-i="${i}" data-k="desc" placeholder="Description">${esc(x.desc)}</textarea>
 </div>`).join("");
 $$("[data-i]").forEach(el=>el.addEventListener("input",e=>{
   const i=+e.target.dataset.i,k=e.target.dataset.k;
   items[i][k]=(k==="qty"||k==="price")?(parseFloat(e.target.value)||0):e.target.value;
   render();
 }));
 $$("[data-remove]").forEach(b=>b.onclick=()=>{if(items.length>1){items.splice(+b.dataset.remove,1);renderItems();render()}});
}
function miniTemplate(t){
 const old=selectedTemplate;selectedTemplate=t;
 const html=`<div class="paper template-${t}" style="width:794px;min-height:1123px;transform:scale(.2645);transform-origin:top left">${renderTemplate(t)}</div>`;
 selectedTemplate=old;
 return `<div class="mini-paper">${html}</div>`;
}
function renderTemplates(){
 $("#templateGrid").innerHTML=templates.map(t=>`<button type="button" class="template-card ${selectedTemplate===t[0]?"active":""}" data-template="${t[0]}"><div class="template-thumb">${miniTemplate(t[0])}</div><div class="template-meta"><div><b>${t[1]}</b><small style="display:block;color:var(--muted);margin-top:2px">${t[2]}</small></div><span>GRATUIT</span></div></button>`).join("");
 $$("[data-template]").forEach(b=>b.onclick=()=>{selectedTemplate=b.dataset.template;render();toast("Modèle sélectionné")});
}
function setDoc(type){
 docType=type;
 $$(".doc-btn").forEach(b=>b.classList.toggle("active",b.dataset.doc===type));
 $("#validityLabel").classList.toggle("hidden",type!=="devis");
 $("#dueLabel").classList.toggle("hidden",type!=="facture");
 $$(".facture-only").forEach(x=>x.classList.toggle("hidden",type!=="facture"));
 if(type==="facture" && v("docNumber").startsWith("DEV-"))$("#docNumber").value=v("docNumber").replace("DEV-","FAC-");
 if(type==="devis" && v("docNumber").startsWith("FAC-"))$("#docNumber").value=v("docNumber").replace("FAC-","DEV-");
 render();
}
async function downloadPDF(source){
 if(typeof html2canvas==="undefined" || !window.jspdf){toast("Module PDF indisponible. Rechargez la page avec Internet.");return}
 const tooLong=source.scrollHeight>1123;
 if(tooLong && !confirm("Attention : le document dépasse une page A4. Voulez-vous tout de même continuer ?"))return;
 toast("Création du PDF...");
 const clone=source.cloneNode(true);
 clone.style.transform="none";clone.style.margin="0";clone.style.position="fixed";clone.style.left="-10000px";clone.style.top="0";
 clone.style.width="794px";clone.style.minHeight="1123px";clone.style.height="auto";clone.style.maxHeight="none";
 document.body.appendChild(clone);
 await new Promise(r=>setTimeout(r,80));
 const trueContentHeight=Math.max(clone.scrollHeight,1123);
 const canvas=await html2canvas(clone,{scale:2,useCORS:true,backgroundColor:"#ffffff",logging:false,height:trueContentHeight,windowHeight:trueContentHeight});
 clone.remove();
 const {jsPDF}=window.jspdf;
 const pdf=new jsPDF("p","mm","a4");
 const pageW=210,pageH=297;
 const imgData=canvas.toDataURL("image/jpeg",0.96);
 const imgH=canvas.height*pageW/canvas.width;
 const TOLERANCE_MM=4; // évite une 2e page quasi vide pour un débordement de quelques pixels
 if(imgH<=pageH+TOLERANCE_MM){
   pdf.addImage(imgData,"JPEG",0,0,pageW,Math.min(imgH,pageH));
 }else{
   let remaining=imgH, y=0, page=0;
   while(remaining>TOLERANCE_MM){
     if(page>0)pdf.addPage();
     pdf.addImage(imgData,"JPEG",0,-y,pageW,imgH);
     remaining-=pageH;y+=pageH;page++;
   }
 }
 pdf.save(`${docType}-${v("docNumber")||"document"}.pdf`);
 toast("PDF téléchargé");
}

$$(".doc-btn").forEach(b=>b.onclick=()=>setDoc(b.dataset.doc));
$$(".status-choice").forEach(b=>b.onclick=()=>{invoiceStatus=b.dataset.status;$$(".status-choice").forEach(x=>x.classList.toggle("active",x===b));render()});
$("#addItem").onclick=()=>{items.push({name:"Nouvelle prestation",desc:"",qty:1,unit:"forfait",price:0});renderItems();render()};
$("#logoInput").onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{logoData=r.result;$("#logoPreview").src=logoData;render()};r.readAsDataURL(f)};
$("#form").addEventListener("input",e=>{if(!e.target.dataset.i)render()});
$("#form").addEventListener("change",e=>{if(!e.target.dataset.i)render()});
$("#largePreviewBtn").onclick=()=>{renderLarge();$("#modal").classList.add("open");lockBodyScroll()};
$("#closeModal").onclick=()=>{$("#modal").classList.remove("open");unlockBodyScroll()};
$("#downloadBtn").onclick=()=>downloadPDF($("#paper"));
$("#modalDownload").onclick=()=>downloadPDF($("#paperLarge"));
if($("#themeBtn"))$("#themeBtn").onclick=()=>document.body.classList.toggle("dark");

function goToModels(){
  $("#modal").classList.remove("open");
  unlockBodyScroll();
  document.querySelector(".templates-section").scrollIntoView({behavior:"smooth",block:"start"});
  setTimeout(()=>toast("Choisissez un autre modèle — vos données sont conservées."),350);
}
$("#changeModelBtn").onclick=goToModels;
$("#modalChangeModel").onclick=goToModels;

$("#saveBtn").onclick=()=>{
 const fields={};$$('#form input:not([type=file]),#form textarea,#form select').forEach(el=>fields[el.id]=el.value);
 localStorage.setItem("df-company",JSON.stringify({fields,logoData}));
 toast("Informations enregistrées");
};
$("#resetBtn").onclick=()=>{if(confirm("Réinitialiser le générateur ?")){localStorage.removeItem("df-company");location.reload()}};

try{
 const saved=JSON.parse(localStorage.getItem("df-company")||"null");
 if(saved){
   Object.entries(saved.fields||{}).forEach(([id,val])=>{const el=$("#"+id);if(el)el.value=val});
   logoData=saved.logoData||"";
   if(logoData)$("#logoPreview").src=logoData;
 }
}catch(e){}

const today=new Date().toISOString().slice(0,10);
if(!$("#issueDate").value)$("#issueDate").value=today;
const due=new Date();due.setDate(due.getDate()+30);
if(!$("#dueDate").value)$("#dueDate").value=due.toISOString().slice(0,10);

renderItems();
setDoc("devis");
