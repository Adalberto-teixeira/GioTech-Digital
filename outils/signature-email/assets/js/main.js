const $=s=>document.querySelector(s);
let selectedTemplate="classic";
let photoData="";
const templateNames={
 classic:"Classic",
 modern:"Modern",
 compact:"Compact",
 executive:"Executive",
 creative:"Creative",
 minimal:"Minimal"
};

function v(id){return $("#"+id)?.value.trim()||""}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}

function data(){
 return {
  name:esc(v("firstName")+" "+v("lastName")),
  job:esc(v("jobTitle")),
  company:esc(v("company")),
  email:esc(v("email")),
  phone:esc(v("phone")),
  website:esc(v("website")),
  address:esc(v("address")),
  linkedin:esc(v("linkedin")),
  instagram:esc(v("instagram")),
  facebook:esc(v("facebook")),
  whatsapp:esc(v("whatsapp")),
  accent:v("accent")||"#2459ef",
  text:v("textColor")||"#20252c",
  showCompany:$("#showCompany").checked,
  showAddress:$("#showAddress").checked,
  showSocials:$("#showSocials").checked
 }
}

function socialLinks(d){
 if(!d.showSocials)return "";
 const items=[];
 if(d.linkedin)items.push(`<a href="${d.linkedin.startsWith("http")?d.linkedin:"https://"+d.linkedin}" style="color:${d.accent};text-decoration:none;margin-right:9px;font-size:12px">LinkedIn</a>`);
 if(d.instagram)items.push(`<a href="${d.instagram.startsWith("http")?d.instagram:"https://"+d.instagram}" style="color:${d.accent};text-decoration:none;margin-right:9px;font-size:12px">Instagram</a>`);
 if(d.facebook)items.push(`<a href="${d.facebook.startsWith("http")?d.facebook:"https://"+d.facebook}" style="color:${d.accent};text-decoration:none;margin-right:9px;font-size:12px">Facebook</a>`);
 if(d.whatsapp)items.push(`<a href="https://wa.me/${d.whatsapp.replace(/\D/g,"")}" style="color:${d.accent};text-decoration:none;font-size:12px">WhatsApp</a>`);
 return items.join("");
}

function imageHtml(shape="circle",size=82){
 if(!photoData)return `<div style="width:${size}px;height:${size}px;border-radius:${shape==="circle"?"50%":"12px"};background:#e7ebef"></div>`;
 return `<img src="${photoData}" width="${size}" height="${size}" alt="" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:${shape==="circle"?"50%":"12px"};display:block">`;
}

function signatureHtml(template=selectedTemplate){
 const d=data(),company=d.showCompany&&d.company?`<div style="font-size:12px;color:${d.text};margin-top:2px">${d.company}</div>`:"";
 const address=d.showAddress&&d.address?`<div style="font-size:11px;color:#6b7280;margin-top:3px">${d.address}</div>`:"";
 const contact=`<div style="font-size:11px;line-height:1.7;color:#555;margin-top:8px"><a href="mailto:${d.email}" style="color:${d.text};text-decoration:none">${d.email}</a><br><a href="tel:${d.phone}" style="color:${d.text};text-decoration:none">${d.phone}</a>${d.website?`<br><a href="${d.website.startsWith("http")?d.website:"https://"+d.website}" style="color:${d.accent};text-decoration:none">${d.website}</a>`:""}</div>`;
 const socials=socialLinks(d);

 if(template==="modern"){
   return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;color:${d.text};max-width:560px"><tr><td style="padding-right:18px;vertical-align:middle">${imageHtml("circle",88)}</td><td style="border-left:4px solid ${d.accent};padding-left:18px"><div style="font-size:19px;font-weight:700;color:${d.text}">${d.name}</div><div style="font-size:12px;color:${d.accent};font-weight:700;margin-top:2px">${d.job}</div>${company}${contact}${address}<div style="margin-top:8px">${socials}</div></td></tr></table>`;
 }
 if(template==="compact"){
   return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;color:${d.text};max-width:600px"><tr><td style="vertical-align:middle;padding-right:12px">${imageHtml("circle",62)}</td><td><div style="font-size:16px;font-weight:700">${d.name}</div><div style="font-size:11px;color:${d.accent}">${d.job}${d.showCompany&&d.company?" · "+d.company:""}</div><div style="font-size:11px;color:#555;margin-top:5px">${d.email} · ${d.phone}${d.website?" · "+d.website:""}</div><div style="margin-top:5px">${socials}</div></td></tr></table>`;
 }
 if(template==="executive"){
   return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Georgia,serif;color:${d.text};max-width:600px"><tr><td colspan="2" style="border-bottom:1px solid #bbb;padding-bottom:10px"><div style="font-size:22px;font-weight:700">${d.name}</div><div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.3px;color:${d.accent};text-transform:uppercase;margin-top:3px">${d.job}</div></td></tr><tr><td style="padding-top:12px;padding-right:16px;vertical-align:top">${imageHtml("circle",72)}</td><td style="padding-top:12px;font-family:Arial,sans-serif">${company}${contact}${address}<div style="margin-top:8px">${socials}</div></td></tr></table>`;
 }
 if(template==="creative"){
   return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;max-width:600px"><tr><td style="background:${d.accent};padding:14px">${imageHtml("square",82)}</td><td style="padding:14px 18px;background:#f6f7f8;color:${d.text}"><div style="font-size:20px;font-weight:800">${d.name}</div><div style="font-size:12px;font-weight:700;margin-top:2px">${d.job}</div>${company}${contact}${address}<div style="margin-top:8px">${socials}</div></td></tr></table>`;
 }
 if(template==="minimal"){
   return `<div style="font-family:Arial,sans-serif;color:${d.text};max-width:560px;border-top:3px solid ${d.accent};padding-top:10px"><div style="font-size:17px;font-weight:700">${d.name}</div><div style="font-size:11px;color:#6b7280;margin-top:2px">${d.job}${d.showCompany&&d.company?" · "+d.company:""}</div><div style="font-size:11px;color:#555;margin-top:8px">${d.email} · ${d.phone}${d.website?" · "+d.website:""}${d.showAddress&&d.address?" · "+d.address:""}</div><div style="margin-top:7px">${socials}</div></div>`;
 }
 return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;color:${d.text};max-width:560px"><tr><td style="padding-right:16px;vertical-align:top">${imageHtml("circle",82)}</td><td style="vertical-align:top"><div style="font-size:18px;font-weight:700;color:${d.text}">${d.name}</div><div style="font-size:12px;color:${d.accent};font-weight:700;margin-top:2px">${d.job}</div>${company}${contact}${address}<div style="margin-top:8px">${socials}</div></td></tr></table>`;
}

function render(){
 $("#signaturePreview").innerHTML=signatureHtml();
}

function miniSignature(template){
 const old=selectedTemplate;
 selectedTemplate=template;
 const html=signatureHtml(template);
 selectedTemplate=old;
 return html;
}

function renderTemplates(){
 const list=["classic","modern","compact","executive","creative","minimal"];
 $("#templateGrid").innerHTML=list.map(t=>`
   <button class="template-card ${selectedTemplate===t?"active":""}" data-template="${t}">
     <div class="template-thumb"><div class="mini-sign">${miniSignature(t)}</div></div>
     <div class="template-meta"><b>${templateNames[t]}</b><span>GRATUIT</span></div>
   </button>`).join("");
 document.querySelectorAll("[data-template]").forEach(b=>b.onclick=()=>{selectedTemplate=b.dataset.template;renderTemplates();render();toast("Modèle sélectionné : "+templateNames[selectedTemplate])});
}

document.querySelectorAll("#form input").forEach(el=>el.addEventListener("input",()=>{render();renderTemplates()}));
document.querySelectorAll("#form input[type=checkbox]").forEach(el=>el.addEventListener("change",()=>{render();renderTemplates()}));

$("#photoInput").onchange=e=>{
 const file=e.target.files?.[0]; if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{photoData=reader.result;$("#photoPreview").src=photoData;render();renderTemplates()};
 reader.readAsDataURL(file);
};

$("#copyHtmlBtn").onclick=async()=>{
 try{await navigator.clipboard.writeText(signatureHtml());toast("HTML copié")}catch(e){toast("Copie impossible")}
};

$("#copyVisibleBtn").onclick=async()=>{
 const temp=document.createElement("div");temp.innerHTML=signatureHtml();document.body.appendChild(temp);
 const range=document.createRange();range.selectNodeContents(temp);
 const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
 try{document.execCommand("copy");toast("Signature copiée")}catch(e){toast("Copie impossible")}
 sel.removeAllRanges();temp.remove();
};

$("#downloadHtmlBtn").onclick=()=>{
 const content=`<!doctype html><html><head><meta charset="utf-8"><title>Signature e-mail</title></head><body style="padding:30px">${signatureHtml()}</body></html>`;
 const blob=new Blob([content],{type:"text/html"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="signature-email.html";a.click();
 URL.revokeObjectURL(url);toast("Fichier HTML téléchargé");
};

$("#saveBtn").onclick=()=>{
 const fields={};document.querySelectorAll("#form input:not([type=file])").forEach(el=>fields[el.id]=el.type==="checkbox"?el.checked:el.value);
 localStorage.setItem("signature-email-data",JSON.stringify({fields,selectedTemplate,photoData}));
 toast("Données enregistrées");
};

$("#resetBtn").onclick=()=>{
 if(confirm("Réinitialiser la signature ?")){localStorage.removeItem("signature-email-data");location.reload()}
};

if($("#themeBtn"))$("#themeBtn").onclick=()=>document.body.classList.toggle("dark");

try{
 const saved=JSON.parse(localStorage.getItem("signature-email-data")||"null");
 if(saved){
   Object.entries(saved.fields||{}).forEach(([id,val])=>{const el=$("#"+id);if(el){if(el.type==="checkbox")el.checked=val;else el.value=val}});
   selectedTemplate=saved.selectedTemplate||"classic";
   photoData=saved.photoData||"";
   if(photoData)$("#photoPreview").src=photoData;
 }
}catch(e){}

renderTemplates();
render();
