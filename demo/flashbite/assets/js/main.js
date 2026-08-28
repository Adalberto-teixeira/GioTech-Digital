const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

let cart=JSON.parse(localStorage.getItem("flashbite-cart")||"[]");

const menu=$("#mobileMenu");
$("#menuOpen").onclick=()=>menu.classList.add("open");
$("#menuClose").onclick=()=>menu.classList.remove("open");
$$(".mobile-menu a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));

function money(v){
  return Number(v).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
}

function saveCart(){
  localStorage.setItem("flashbite-cart",JSON.stringify(cart));
  renderCart();
}

function addItem(name,price){
  const found=cart.find(x=>x.name===name);
  if(found) found.qty++;
  else cart.push({name,price:Number(price),qty:1});
  saveCart();
  toast(name+" ajouté au panier");
}

$$(".add-product,.deal-add").forEach(b=>{
  b.onclick=()=>addItem(b.dataset.name,b.dataset.price);
});

function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);

  $("#cartCount").textContent=count;
  $("#cartTotal").textContent=money(total);

  $("#cartItems").innerHTML=cart.length
    ? cart.map((x,i)=>`
      <div class="cart-row">
        <div><b>${x.name}</b><small>${money(x.price)} · x${x.qty}</small></div>
        <strong>${money(x.price*x.qty)}</strong>
        <button data-remove="${i}">Retirer</button>
      </div>`).join("")
    : '<div class="empty-cart">Votre panier est vide.</div>';

  $$("[data-remove]").forEach(b=>b.onclick=()=>{
    cart.splice(Number(b.dataset.remove),1);
    saveCart();
  });
}
renderCart();

$("#cartOpen").onclick=()=>$("#cartDrawer").classList.add("open");
$("#cartClose").onclick=()=>$("#cartDrawer").classList.remove("open");

$("#checkoutOpen").onclick=()=>{
  if(!cart.length) return toast("Votre panier est vide");
  $("#cartDrawer").classList.remove("open");
  $("#checkoutModal").classList.add("open");
};

$("#checkoutClose").onclick=()=>$("#checkoutModal").classList.remove("open");

$("#checkoutForm").onsubmit=e=>{
  e.preventDefault();
  if(!cart.length) return;
  cart=[];
  saveCart();
  $("#checkoutStatus").textContent="✓ Commande démo confirmée. Aucun paiement réel n'a été effectué.";
  setTimeout(()=>$("#checkoutModal").classList.remove("open"),2200);
};

$$("[data-category]").forEach(b=>{
  b.onclick=()=>{
    $$("[data-category]").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    $$(".product-card").forEach(card=>{
      card.classList.toggle(
        "hide",
        b.dataset.category!=="all" && card.dataset.categoryCard!==b.dataset.category
      );
    });
  };
});

let trackState=68;
$("#trackingSimulate").onclick=()=>{
  trackState=trackState>=100?35:Math.min(100,trackState+16);
  $("#trackBar").style.width=trackState+"%";
  toast(trackState>=100?"Commande livrée ✓":"Statut mis à jour");
};

function toast(text){
  const t=$("#toast");
  t.textContent=text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1500);
}

const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile=matchMedia("(max-width:650px)").matches;

if(typeof gsap!=="undefined" && typeof ScrollTrigger!=="undefined" && !reduce){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({limitCallbacks:true,ignoreMobileResize:true});

  $$("[data-reveal]").forEach(el=>{
    gsap.to(el,{
      opacity:1,y:0,duration:.65,ease:"power2.out",
      scrollTrigger:{trigger:el,start:"top 88%",once:true}
    });
  });

  $$("[data-stagger]").forEach(wrap=>{
    gsap.from(wrap.children,{
      y:20,opacity:0,stagger:.05,duration:.5,ease:"power2.out",
      scrollTrigger:{trigger:wrap,start:"top 88%",once:true}
    });
  });

  if(!mobile){
    gsap.to(".hero-visual>img",{y:-12,rotation:1.5,duration:2.5,repeat:-1,yoyo:true,ease:"sine.inOut"});
    gsap.to(".orbit-a",{rotation:360,duration:36,repeat:-1,ease:"none"});
    gsap.to(".orbit-b",{rotation:-360,duration:48,repeat:-1,ease:"none"});

    $$("[data-image-shift]").forEach(img=>{
      gsap.fromTo(img,{yPercent:-2},{yPercent:2,ease:"none",scrollTrigger:{trigger:img,start:"top bottom",end:"bottom top",scrub:.5}});
    });
  }

  const marquee=$("[data-marquee-track]");
  if(marquee){
    gsap.to(marquee,{xPercent:-50,repeat:-1,duration:34,ease:"none"});
  }
}else{
  $$("[data-reveal]").forEach(el=>{
    el.style.opacity=1;
    el.style.transform="none";
  });
}
