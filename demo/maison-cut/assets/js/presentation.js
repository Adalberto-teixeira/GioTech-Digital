const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const frame=$("#demoFrame"),phone=$("#phone");
$$("[data-screen]").forEach(b=>b.onclick=()=>{$$("[data-screen]").forEach(x=>x.classList.remove("active"));b.classList.add("active");frame.src="barber.html#"+b.dataset.screen});
$$("[data-size]").forEach(b=>b.onclick=()=>{$$("[data-size]").forEach(x=>x.classList.remove("active"));b.classList.add("active");phone.style.setProperty("--w",b.dataset.size+"px")});