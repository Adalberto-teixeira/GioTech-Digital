const $=s=>document.querySelector(s);
let type="url", logoData="";
const schemas={
url:`<label>Adresse du site<input id="url" value="https://example.com" placeholder="https://..."></label>`,
text:`<label>Votre texte<textarea id="text" placeholder="Écrivez votre message...">Bonjour ! Merci d'avoir scanné ce QR Code.</textarea></label>`,
email:`<label>Adresse e-mail<input id="mail" value="contact@example.com"></label><label>Objet<input id="subject" value="Demande d'information"></label><label>Message<textarea id="message">Bonjour, je souhaiterais obtenir plus d'informations.</textarea></label>`,
phone:`<label>Numéro de téléphone<input id="tel" value="+33600000000"></label>`,
wifi:`<label>Nom du réseau (SSID)<input id="ssid" value="Mon WiFi"></label><label>Mot de passe<input id="password" value="motdepasse"></label><label>Sécurité<select id="security"><option>WPA</option><option>WEP</option><option value="nopass">Aucune</option></select></label>`,
contact:`<div class="grid2"><label>Prénom<input id="fn" value="Sophie"></label><label>Nom<input id="ln" value="Martin"></label><label>Téléphone<input id="ctel" value="+33600000000"></label><label>E-mail<input id="cmail" value="sophie.martin@example.com"></label><label>Entreprise<input id="org" value="Entreprise Exemple"></label><label>Site web<input id="web" value="https://example.com"></label></div>`
};
function val(id){return $("#"+id)?.value||""}
function content(){
 if(type==="text")return val("text");
 if(type==="email")return `mailto:${val("mail")}?subject=${encodeURIComponent(val("subject"))}&body=${encodeURIComponent(val("message"))}`;
 if(type==="phone")return `tel:${val("tel")}`;
 if(type==="wifi")return `WIFI:T:${val("security")};S:${val("ssid")};P:${val("password")};;`;
 if(type==="contact")return `BEGIN:VCARD\nVERSION:3.0\nN:${val("ln")};${val("fn")};;;\nFN:${val("fn")} ${val("ln")}\nORG:${val("org")}\nTEL:${val("ctel")}\nEMAIL:${val("cmail")}\nURL:${val("web")}\nEND:VCARD`;
 return val("url")||"https://example.com";
}
function renderFields(){ $("#fields").innerHTML=schemas[type]; $("#fields").querySelectorAll("input,textarea,select").forEach(x=>x.addEventListener("input",renderQR)); renderQR()}
function renderQR(){
 const box=$("#qrcode");box.innerHTML="";
 const size=240;
 if(typeof QRCode==="undefined"){box.innerHTML="<p style='font-size:.8rem;color:#a33;text-align:center;padding:1rem;'>Impossible de charger le générateur de QR Code (connexion internet requise). Rechargez la page.</p>";return}
 new QRCode(box,{text:content(),width:size,height:size,colorDark:$("#darkColor").value,colorLight:$("#lightColor").value,correctLevel:QRCode.CorrectLevel.H});
 setTimeout(addLogo,30);
 $("#scanText").style.display=$("#showFrame").checked?"block":"none";
}
function addLogo(){
 if(!logoData)return;
 const wrap=$("#qrcode"),canvas=wrap.querySelector("canvas"); if(!canvas)return;
 const ctx=canvas.getContext("2d"),img=new Image();
 img.onload=()=>{const s=canvas.width*.18,x=(canvas.width-s)/2,y=(canvas.height-s)/2;ctx.fillStyle="#fff";ctx.fillRect(x-5,y-5,s+10,s+10);ctx.drawImage(img,x,y,s,s)};
 img.src=logoData;
}
document.querySelectorAll(".type").forEach(b=>b.onclick=()=>{type=b.dataset.type;document.querySelectorAll(".type").forEach(x=>x.classList.toggle("active",x===b));renderFields()});
["darkColor","lightColor","size","showFrame"].forEach(id=>$("#"+id).addEventListener("input",renderQR));
$("#logo").onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{logoData=r.result;renderQR()};r.readAsDataURL(f)};
$("#resetBtn").onclick=()=>{logoData="";$("#darkColor").value="#10141c";$("#lightColor").value="#ffffff";$("#size").value="320";$("#showFrame").checked=true;renderFields()};
function download(name,href){const a=document.createElement("a");a.download=name;a.href=href;a.click()}
$("#pngBtn").onclick=()=>{const canvas=$("#qrcode canvas");if(canvas)download("qr-code.png",canvas.toDataURL("image/png"))};
$("#svgBtn").onclick=()=>{
 const canvas=$("#qrcode canvas");if(!canvas)return;
 const png=canvas.toDataURL("image/png"),s=Number($("#size").value);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><image href="${png}" width="${s}" height="${s}"/></svg>`;
 download("qr-code.svg",URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})));
};
renderFields();
