const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
if(window.lucide)lucide.createIcons();

const books={
1:{title:"L'Étranger",author:"Albert Camus",genre:"Classique · Poche",price:4.90,newprice:9.20,condition:"Très bon état",story:"Cet exemplaire a été lu une ou deux fois. Une légère marque sur la couverture, intérieur propre et sans annotations."},
2:{title:"L'Amant",author:"Marguerite Duras",genre:"Roman · Poche",price:7.90,newprice:11.40,condition:"Comme neuf",story:"Exemplaire très peu manipulé. Dos intact, pages propres, aucune annotation visible."},
3:{title:"1984",author:"George Orwell",genre:"Classique · Dystopie",price:5.40,newprice:10.10,condition:"Bon état",story:"Le dos porte une légère marque de lecture. Quelques traces d'usage sur les coins, intérieur très propre."},
4:{title:"Kafka sur le rivage",author:"Haruki Murakami",genre:"Roman · Contemporain",price:8.60,newprice:12.50,condition:"Très bon état",story:"Coins légèrement frottés, couverture souple encore très propre. Aucun surlignage."},
5:{title:"Sapiens",author:"Yuval Noah Harari",genre:"Essai · Histoire",price:10.90,newprice:18.00,condition:"Comme neuf",story:"Très peu lu, intérieur impeccable. Couverture presque intacte."},
6:{title:"Le Petit Prince",author:"Antoine de Saint-Exupéry",genre:"Jeunesse · Classique",price:3.90,newprice:7.90,condition:"Bon état",story:"Un livre qui a clairement été aimé : couverture patinée, pages en bon état, aucune page manquante."},
7:{title:"Bauhaus",author:"Collectif",genre:"Beau livre · Design",price:16.90,newprice:29.90,condition:"Très bon état",story:"Jaquette légèrement marquée. Pages intérieures propres et très belles."},
8:{title:"Les Vestiges du jour",author:"Kazuo Ishiguro",genre:"Roman · Littérature",price:6.50,newprice:10.50,condition:"Très bon état",story:"Pages propres, couverture en très bon état général. Quelques marques très légères."}
};

let cart=JSON.parse(localStorage.getItem("sl-cart")||"[]");
let wishes=JSON.parse(localStorage.getItem("sl-wishes")||"[]");
let currentQuick=1;
const money=v=>Number(v).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";

const mobile=$("#mobileMenu"); $("#menuOpen").onclick=()=>mobile.classList.add("open"); $("#menuClose").onclick=()=>mobile.classList.remove("open"); $$(".mobile-menu a").forEach(a=>a.onclick=()=>mobile.classList.remove("open"));

function toast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1500)}

function syncWish(){
 $("#wishCount").textContent=wishes.length;
 $$(".wish-btn").forEach(b=>b.classList.toggle("active",wishes.includes(Number(b.dataset.wish))));
 localStorage.setItem("sl-wishes",JSON.stringify(wishes));
}
$$("[data-wish]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.wish);wishes=wishes.includes(id)?wishes.filter(x=>x!==id):[...wishes,id];syncWish();toast(wishes.includes(id)?"Ajouté aux favoris":"Retiré des favoris")});
syncWish();

function renderWish(){
 $("#wishList").innerHTML=wishes.length?wishes.map(id=>`<div class="drawer-row"><div><b>${books[id].title}</b><span>${books[id].author} · ${money(books[id].price)}</span></div><button data-remove-wish="${id}">Retirer</button></div>`).join(""):'<div class="empty">Votre liste est vide.</div>';
 $$("[data-remove-wish]").forEach(b=>b.onclick=()=>{wishes=wishes.filter(x=>x!==Number(b.dataset.removeWish));syncWish();renderWish()});
}
$("#wishOpen").onclick=()=>{renderWish();$("#wishDrawer").classList.add("open")};$("#wishClose").onclick=()=>$("#wishDrawer").classList.remove("open");

function addToCart(id){
 const found=cart.find(x=>x.id===id);
 if(found) found.qty++;
 else cart.push({id,qty:1});
 localStorage.setItem("sl-cart",JSON.stringify(cart));renderCart();toast(books[id].title+" ajouté au panier");
}
$$("[data-add]").forEach(b=>b.onclick=()=>addToCart(Number(b.dataset.add)));
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+books[x.id].price*x.qty,0);
 $("#cartCount").textContent=count;$("#cartTotal").textContent=money(total);
 $("#cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="drawer-row"><div><b>${books[x.id].title}</b><span>${money(books[x.id].price)} · x${x.qty}</span></div><button data-remove-cart="${i}">Retirer</button></div>`).join(""):'<div class="empty">Votre panier est vide.</div>';
 $$("[data-remove-cart]").forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.removeCart),1);localStorage.setItem("sl-cart",JSON.stringify(cart));renderCart()});
}
renderCart();
$("#cartOpen").onclick=()=>$("#cartDrawer").classList.add("open");$("#cartClose").onclick=()=>$("#cartDrawer").classList.remove("open");

$("#checkoutOpen").onclick=()=>{
 if(!cart.length)return toast("Votre panier est vide");
 const total=cart.reduce((s,x)=>s+books[x.id].price*x.qty,0);
 $("#checkoutSummary").innerHTML=`${cart.reduce((s,x)=>s+x.qty,0)} livre(s)<br><b>Sous-total : ${money(total)}</b><br>Livraison : calculée ultérieurement`;
 $("#cartDrawer").classList.remove("open");$("#checkoutModal").classList.add("open");
};
$("#checkoutClose").onclick=()=>$("#checkoutModal").classList.remove("open");
$("#checkoutForm").onsubmit=e=>{e.preventDefault();cart=[];localStorage.setItem("sl-cart","[]");renderCart();$("#checkoutStatus").textContent="✓ Commande de démonstration confirmée. Aucun paiement réel.";setTimeout(()=>$("#checkoutModal").classList.remove("open"),2200)};

function openQuick(id){
 currentQuick=id;const b=books[id];
 $("#quickGenre").textContent=b.genre;$("#quickTitle").textContent=b.title;$("#quickAuthor").textContent=b.author;$("#quickCondition").textContent=b.condition;$("#quickStory").textContent=b.story;$("#quickPrice").textContent=money(b.price);$("#quickNewPrice").textContent=money(b.newprice)+" neuf";
 $("#quickModal").classList.add("open");
}
$$("[data-quick]").forEach(b=>b.onclick=()=>openQuick(Number(b.dataset.quick)));
$("#quickClose").onclick=()=>$("#quickModal").classList.remove("open");$("#quickAdd").onclick=()=>addToCart(currentQuick);

let activeGenre="all";
function applyFilters(){
 const cond=$("#conditionFilter").value;
 let visible=0;
 $$(".book-card").forEach(c=>{const okGenre=activeGenre==="all"||c.dataset.genre===activeGenre,okCond=cond==="all"||c.dataset.condition===cond,show=okGenre&&okCond;c.classList.toggle("hide",!show);if(show)visible++});
 $("#noResults").classList.toggle("show",visible===0);
}
$$("[data-genre]").forEach(b=>b.onclick=()=>{$$("[data-genre]").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeGenre=b.dataset.genre;applyFilters()});
$("#conditionFilter").onchange=applyFilters;
$("#sortSelect").onchange=e=>{
 if(e.target.value==="default")return;
 const cards=$$(".book-card");
 cards.sort((a,b)=>e.target.value==="asc"?+a.dataset.price-+b.dataset.price:e.target.value==="desc"?+b.dataset.price-+a.dataset.price:(1-(+a.dataset.price/+a.dataset.newprice))-(1-(+b.dataset.price/+b.dataset.newprice))).forEach(c=>$("#booksGrid").appendChild(c));
};

$("#searchOpen").onclick=()=>{$("#searchOverlay").classList.add("open");setTimeout(()=>$("#searchInput").focus(),100)};
$("#searchClose").onclick=()=>$("#searchOverlay").classList.remove("open");
$("#searchInput").oninput=e=>{
 const q=e.target.value.trim().toLowerCase();let visible=0;
 $$(".book-card").forEach(c=>{const id=Number(c.dataset.id),b=books[id],show=!q||`${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(q);c.classList.toggle("hide",!show);if(show)visible++});
 $("#noResults").classList.toggle("show",visible===0);
 if(q)document.querySelector("#catalogue").scrollIntoView({behavior:"smooth"});
};

$("#estimateButton").onclick=()=>{
 const price=Number($("#sellNewPrice").value),coef=Number($("#sellCondition").value);
 if(!$("#sellTitle").value.trim()||!price)return toast("Complétez le titre et le prix neuf");
 const estimate=Math.max(1.5,price*coef);
 $("#estimateResult b").textContent=money(estimate);
};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();toast("Inscription enregistrée dans cette démo");e.currentTarget.reset()};

const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,mobileView=matchMedia("(max-width:650px)").matches;
if(window.gsap&&window.ScrollTrigger&&!reduce){
 gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({limitCallbacks:true,ignoreMobileResize:true});
 $$("[data-reveal]").forEach(el=>gsap.to(el,{opacity:1,y:0,duration:.65,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
 $$("[data-stagger]").forEach(w=>gsap.from(w.children,{opacity:0,y:18,stagger:.04,duration:.5,ease:"power2.out",scrollTrigger:{trigger:w,start:"top 88%",once:true}}));
 $$("[data-counter]").forEach(el=>{const end=Number(el.dataset.counter),o={v:0};gsap.to(o,{v:end,duration:1.2,ease:"power1.out",scrollTrigger:{trigger:el,start:"top 90%",once:true},onUpdate:()=>el.textContent=Math.round(o.v)})});
 if(!mobileView){gsap.to(".book-stack",{y:-9,rotation:-1.5,duration:3,repeat:-1,yoyo:true,ease:"sine.inOut"});gsap.to(".hero-sticker",{rotation:14,duration:2.7,repeat:-1,yoyo:true,ease:"sine.inOut"})}
}else{
 $$("[data-reveal]").forEach(el=>{el.style.opacity=1;el.style.transform="none"});$$("[data-counter]").forEach(el=>el.textContent=el.dataset.counter);
}
if(window.lucide)lucide.createIcons();
