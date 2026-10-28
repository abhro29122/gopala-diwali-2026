let products=[], activeCategory="All";
const grid=document.querySelector("#product-grid"), search=document.querySelector("#search"), empty=document.querySelector("#empty");
const moneySafe=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function render(){
 const q=search.value.trim().toLowerCase();
 const filtered=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&[p.title,p.code,p.category,p.desc].join(" ").toLowerCase().includes(q));
 grid.innerHTML=filtered.map((p,i)=>`<article class="product-card" tabindex="0" role="button" aria-label="View ${moneySafe(p.title)}" data-index="${products.indexOf(p)}">
 <div class="product-image"><img loading="lazy" src="assets/pages/page-${String(p.page).padStart(2,"0")}.jpg" alt="${moneySafe(p.title)} from the Gopala Diwali catalogue"><span class="product-code">CODE ${moneySafe(p.code)}</span></div>
 <div class="product-info"><span class="product-category">${moneySafe(p.category)}</span><h3>${moneySafe(p.title)}</h3><p>${moneySafe(p.desc)}</p><div class="product-bottom"><div><span class="price-label">MRP</span><span class="price">${moneySafe(p.price)}</span></div><span class="view-link">VIEW DETAILS ↗</span></div></div></article>`).join("");
 empty.hidden=filtered.length!==0;
}
function openProduct(p){
 document.querySelector("#modal-img").src=`assets/pages/page-${String(p.page).padStart(2,"0")}.jpg`;
 document.querySelector("#modal-img").alt=p.title;
 document.querySelector("#modal-category").textContent=p.category;
 document.querySelector("#modal-title").textContent=p.title;
 document.querySelector("#modal-desc").textContent=p.desc;
 document.querySelector("#modal-price").textContent=p.price;
 document.querySelector("#modal-code").textContent=`Code ${p.code}`;
 const msg=encodeURIComponent(`Hello Gopala, I'm interested in ${p.title} (Code ${p.code}), listed at ${p.price} in the Diwali 2026 catalogue.`);
 document.querySelector("#modal-whatsapp").href=`https://wa.me/917290031303?text=${msg}`;
 document.querySelector("#modal-page").href=`assets/Gopala_Diwali_2026_Catalogue.pdf#page=${p.page}`;
 const modal=document.querySelector("#modal");modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeModal(){const modal=document.querySelector("#modal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
fetch("assets/products.json").then(r=>r.json()).then(data=>{products=data;render()}).catch(()=>{grid.innerHTML="<p>Products could not be loaded. Please refresh the page.</p>"});
search.addEventListener("input",render);
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render()}));
grid.addEventListener("click",e=>{const card=e.target.closest(".product-card");if(card)openProduct(products[Number(card.dataset.index)])});
grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList.contains("product-card")){e.preventDefault();openProduct(products[Number(e.target.dataset.index)])}});
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
const menu=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav nav");
menu.addEventListener("click",()=>{const open=nav.classList.toggle("mobile-open");menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"×":"☰"});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("mobile-open")));
