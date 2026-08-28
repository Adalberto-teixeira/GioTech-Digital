const $=s=>document.querySelector(s);
let _scrollLockY=0;
function lockBodyScroll(){_scrollLockY=window.scrollY;document.body.style.position="fixed";document.body.style.top=-_scrollLockY+"px";document.body.style.left="0";document.body.style.right="0";document.body.style.width="100%"}
function unlockBodyScroll(){document.body.style.position="";document.body.style.top="";document.body.style.left="";document.body.style.right="";document.body.style.width="";window.scrollTo(0,_scrollLockY)}
let tone="professional";
function v(id){return $("#"+id)?.value.trim()||""}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\":"\\","\"":"&quot;","'":"&#039;"}[m]||m))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function getKeywords(text){
 const stop=new Set(["nous","vous","avec","pour","dans","une","des","les","est","sont","notre","votre","plus","sur","qui","que","aux","par","leur","ses","son","nos","vos","être","avoir","poste","profil","recherche","recherchons"]);
 const words=(text.toLowerCase().match(/[a-zà-ÿ]{5,}/g)||[]).filter(w=>!stop.has(w));
 const counts={};words.forEach(w=>counts[w]=(counts[w]||0)+1);
 return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,7).map(x=>x[0]);
}
function analyze(){
 const ks=getKeywords(v("offer"));
 $("#keywords").innerHTML=ks.map(k=>`<span>${k}</span>`).join("");
 $("#keywordCount").textContent=ks.length===1?"1 mot-clé détecté":`${ks.length} mots-clés détectés`;
 return ks;
}
function build(){
 const first=v("firstName"),last=v("lastName"),job=v("jobTitle"),company=v("company"),recruiter=v("recruiter");
 const exp=v("experience"),skills=v("skills"),mot=v("motivation"),ks=analyze();
 const keyText=ks.length?ks.slice(0,4).join(", "):"les compétences recherchées";
 let p1,p2,p3;
 if(tone==="warm"){
   p1=`C’est avec beaucoup d’intérêt que je vous adresse ma candidature au poste de ${job} au sein de ${company}. Votre offre a particulièrement retenu mon attention par les missions proposées et l’environnement professionnel qu’elle laisse entrevoir.`;
   p2=`Mon parcours m’a permis d’acquérir une expérience concrète : ${exp} J’ai également développé des compétences en ${skills}. Ces éléments correspondent à plusieurs attentes exprimées dans votre annonce, notamment autour de ${keyText}.`;
   p3=`Je serais ravie de mettre cette expérience au service de votre équipe. ${mot} Un échange me permettrait de vous présenter plus précisément ma motivation et la manière dont je pourrais contribuer à vos projets.`;
 }else if(tone==="direct"){
   p1=`Je souhaite rejoindre ${company} au poste de ${job}. Mon expérience et mes compétences correspondent directement aux besoins présentés dans votre offre.`;
   p2=`Mon expérience principale est la suivante : ${exp} Je maîtrise notamment ${skills}. Votre annonce met l’accent sur ${keyText}, des sujets sur lesquels je peux être rapidement opérationnelle.`;
   p3=`${mot} Je suis disponible pour un entretien afin d’échanger sur vos attentes et sur ma contribution possible au poste.`;
 }else{
   p1=`Je vous présente ma candidature au poste de ${job} au sein de ${company}. Votre offre a retenu mon attention car elle correspond à mon expérience ainsi qu’à la direction que je souhaite donner à mon parcours professionnel.`;
   p2=`Au cours de mon parcours, j’ai acquis l’expérience suivante : ${exp} J’ai également développé des compétences en ${skills}. Les éléments de votre annonce liés à ${keyText} correspondent particulièrement à mon profil.`;
   p3=`Sérieuse, impliquée et motivée, je souhaite aujourd’hui mettre ces compétences au service de ${company}. ${mot} Je serais heureuse de pouvoir vous exposer ma motivation plus en détail lors d’un entretien.`;
 }
 const sal=recruiter?`Madame, Monsieur ${recruiter},`:"Madame, Monsieur,";
 return `${sal}\n\n${p1}\n\n${p2}\n\n${p3}\n\nJe vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.\n\n${first} ${last}`;
}
function countWords(){const n=($("#editor").value.trim().match(/\S+/g)||[]).length;$("#wordCount").textContent=n}
function generate(){
 if(["firstName","lastName","jobTitle","company"].some(id=>!v(id))){toast("Complétez votre identité, le poste et l’entreprise.");return}
 $("#editor").value=build();$("#empty").classList.add("hidden");$("#result").classList.remove("hidden");$("#statusPill").textContent="GÉNÉRÉE";countWords();toast("Lettre générée");
}
function renderPaper(){
 const dateValue=v("date");
 const date=dateValue?new Date(dateValue+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
 $("#paper").innerHTML=`<div class="sender">${esc(v("firstName"))} ${esc(v("lastName"))}<br>${esc(v("city"))}<br>${esc(v("email"))}<br>${esc(v("phone"))}</div><div class="recipient">${esc(v("company"))}<br>${esc(v("recruiter"))||"Service recrutement"}<br>${esc(v("companyCity"))}</div><div class="date">À ${esc(v("city"))}, le ${date}</div><div class="subject">Objet : Candidature au poste de ${esc(v("jobTitle"))}</div><div class="body">${esc($("#editor").value)}</div>`;
}
document.querySelectorAll("[data-tone]").forEach(b=>b.onclick=()=>{tone=b.dataset.tone;document.querySelectorAll("[data-tone]").forEach(x=>x.classList.toggle("active",x===b))});
$("#analyzeBtn").onclick=analyze;
$("#generateBtn").onclick=generate;
$("#editor").addEventListener("input",countWords);
$("#previewBtn").onclick=()=>{renderPaper();$("#modal").classList.add("open");lockBodyScroll()};
$("#closeModal").onclick=()=>{$("#modal").classList.remove("open");unlockBodyScroll()};
$("#pdfBtn").onclick=()=>{renderPaper();window.print()};
$("#modalPdf").onclick=()=>window.print();
$("#copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText($("#editor").value);toast("Lettre copiée")}catch(e){toast("Copie impossible")}};
$("#saveBtn").onclick=()=>{const data={tone,fields:{}};document.querySelectorAll("#form input,#form textarea").forEach(el=>data.fields[el.id]=el.value);localStorage.setItem("lettre-pro",JSON.stringify(data));toast("Données enregistrées")};
$("#resetBtn").onclick=()=>{if(confirm("Effacer les données enregistrées ?")){localStorage.removeItem("lettre-pro");location.reload()}};
if($("#themeBtn"))$("#themeBtn").onclick=()=>document.body.classList.toggle("dark");
try{const d=JSON.parse(localStorage.getItem("lettre-pro")||"null");if(d){Object.entries(d.fields||{}).forEach(([id,val])=>{const el=$("#"+id);if(el)el.value=val});tone=d.tone||"professional";document.querySelectorAll("[data-tone]").forEach(x=>x.classList.toggle("active",x.dataset.tone===tone))}}catch(e){}
if(!$("#date").value)$("#date").value=new Date().toISOString().slice(0,10);
analyze();
