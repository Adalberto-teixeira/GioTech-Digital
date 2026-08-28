
if(window.lucide)lucide.createIcons();
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const searchToggle=$("#searchToggle"), searchPanel=$("#searchPanel"), searchInput=$("#siteSearch");
if(searchToggle) searchToggle.onclick=()=>{searchPanel.classList.toggle("open"); if(searchPanel.classList.contains("open")) setTimeout(()=>searchInput.focus(),50)};
if(searchInput) searchInput.oninput=e=>{
 const q=e.target.value.toLowerCase().trim();
 $$("[data-search]").forEach(el=>el.classList.toggle("hidden",q && !el.dataset.search.toLowerCase().includes(q)));
};
const menu=$("#mobileMenu");
$("#menuOpen")?.addEventListener("click",()=>menu.classList.add("open"));
$("#menuClose")?.addEventListener("click",()=>menu.classList.remove("open"));
$$(".mobile-menu a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));
$$("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());


// V4 — progressive reveal animation, intentionally lightweight
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const revealTargets = [
    ...document.querySelectorAll(
      ".section-heading, .article-card, .lead-story, .side-story, .topic-strip a, " +
      ".neide-intro, .neide-gallery a, .newsletter, .article-header, .article-cover, " +
      ".article-body h2, .article-body p, .article-body blockquote, .profile-content h2, " +
      ".profile-content p, .photo-wall a, .contact-panel"
    )
  ];

  revealTargets.forEach((el,i)=>{
    el.classList.add("reveal-ready");
    if(i%4===1) el.classList.add("reveal-delay-1");
    if(i%4===2) el.classList.add("reveal-delay-2");
    if(i%4===3) el.classList.add("reveal-delay-3");
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:"0px 0px -25px 0px"});

  revealTargets.forEach(el=>observer.observe(el));
}

// Ensure any failed image never shows a broken-image icon.
// The project now uses local images, but this is a final fallback.
document.querySelectorAll("img").forEach((img,i)=>{
  img.addEventListener("error",()=>{
    img.src=`assets/images/neide-${String((i%12)+1).padStart(2,"0")}.jpg`;
  },{once:true});
});
