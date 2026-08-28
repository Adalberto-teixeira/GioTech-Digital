const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const menu=$("#mobileMenu");
$("#menuOpen").addEventListener("click",()=>menu.classList.add("is-open"));
$("#menuClose").addEventListener("click",()=>menu.classList.remove("is-open"));
$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("is-open")));

const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile=matchMedia("(max-width: 680px)").matches;
const isTablet=matchMedia("(max-width: 1050px)").matches;

if(typeof gsap!=="undefined" && typeof ScrollTrigger!=="undefined"){
  gsap.registerPlugin(ScrollTrigger);

  // Performance-oriented ScrollTrigger defaults
  ScrollTrigger.config({
    limitCallbacks:true,
    ignoreMobileResize:true
  });

  ScrollTrigger.defaults({
    toggleActions:"play none none none"
  });

  const triggerElement=$("[data-parallax-layers]");

  // Hero parallax: disable the heaviest effect on small mobile devices.
  if(triggerElement && !reduceMotion){
    if(!isMobile){
      const layers = [
        {layer:"1",yPercent:isTablet?24:36},
        {layer:"2",yPercent:isTablet?16:24},
        {layer:"3",yPercent:isTablet?8:12},
        {layer:"4",yPercent:isTablet?4:6}
      ];

      layers.forEach(o=>{
        gsap.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${o.layer}"]`),
          {
            yPercent:o.yPercent,
            ease:"none",
            force3D:true,
            scrollTrigger:{
              trigger:triggerElement,
              start:"top top",
              end:"bottom top",
              scrub:0.35,
              invalidateOnRefresh:true
            }
          }
        );
      });
    }else{
      // Keep a light, static cinematic effect on phones.
      gsap.set(triggerElement.querySelectorAll("[data-parallax-layer]"),{
        yPercent:0,
        force3D:true
      });
    }

    // Lenis only on larger screens, and with lighter settings.
    if(typeof Lenis!=="undefined" && !isMobile){
      const lenis=new Lenis({
        duration:0.75,
        smoothWheel:true,
        smoothTouch:false,
        wheelMultiplier:0.9
      });

      lenis.on("scroll",ScrollTrigger.update);

      const raf=(time)=>{
        lenis.raf(time*1000);
      };

      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(1000,16.7);
    }
  }

  if(!reduceMotion){
    // Reveals are one-shot animations, very cheap.
    $$("[data-reveal]").forEach(el=>{
      gsap.to(el,{
        y:0,
        opacity:1,
        duration:.65,
        ease:"power2.out",
        clearProps:"transform",
        scrollTrigger:{
          trigger:el,
          start:"top 88%",
          once:true
        }
      });
    });

    $$("[data-stagger]").forEach(wrap=>{
      gsap.from(wrap.children,{
        y:20,
        opacity:0,
        stagger:.055,
        duration:.52,
        ease:"power2.out",
        clearProps:"transform",
        scrollTrigger:{
          trigger:wrap,
          start:"top 88%",
          once:true
        }
      });
    });

    // Image parallax only on desktop. This was one of the main causes of jank.
    if(!isTablet){
      $$("[data-image-shift]").forEach(img=>{
        gsap.fromTo(img,
          {yPercent:-2.5,scale:1.025},
          {
            yPercent:2.5,
            scale:1,
            ease:"none",
            force3D:true,
            scrollTrigger:{
              trigger:img,
              start:"top bottom",
              end:"bottom top",
              scrub:0.6
            }
          }
        );
      });
    }else{
      $$("[data-image-shift]").forEach(img=>{
        gsap.set(img,{yPercent:0,scale:1});
      });
    }

    // Marquee uses transform only.
    const marquee=$("[data-marquee-track]");
    if(marquee){
      gsap.to(marquee,{
        xPercent:-50,
        repeat:-1,
        duration:38,
        ease:"none",
        force3D:true
      });
    }

    // Counters: one time only.
    $$("[data-counter]").forEach(el=>{
      const end=Number(el.dataset.counter||0);
      const obj={value:0};

      gsap.to(obj,{
        value:end,
        duration:1.1,
        ease:"power1.out",
        scrollTrigger:{
          trigger:el,
          start:"top 90%",
          once:true
        },
        onUpdate:()=>{
          el.textContent=Math.round(obj.value);
        }
      });
    });
  }else{
    $$("[data-reveal]").forEach(el=>{
      el.style.opacity="1";
      el.style.transform="none";
    });

    $$("[data-counter]").forEach(el=>{
      el.textContent=el.dataset.counter||"0";
    });
  }
}

// Demo form
$("#quoteForm").addEventListener("submit",e=>{
  e.preventDefault();
  $("#formStatus").textContent="✓ Demande enregistrée dans cette démonstration.";
  e.currentTarget.reset();
});

// Refresh once after images settle, instead of constantly recalculating.
window.addEventListener("load",()=>{
  if(typeof ScrollTrigger!=="undefined"){
    requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
},{once:true});
