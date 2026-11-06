/* Elite · efectos de interfaz (revelado, contadores, brillo, cabecera). Sin dependencias. */
(function(){
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  // Cabecera con fondo al hacer scroll
  var top=document.getElementById("top");
  function onScroll(){top.classList.toggle("scrolled",window.scrollY>40)}
  onScroll(); window.addEventListener("scroll",onScroll,{passive:true});

  // Datos de contacto (PENDIENTE: valores reales de Elite)
  var CONTACT={wa:"",ig:"elite.spinning",mail:"hola@elite.demo"};
  var wa="https://wa.me/"+CONTACT.wa, ig="https://instagram.com/"+CONTACT.ig, ml="mailto:"+CONTACT.mail;
  [["cWa","fWa",wa],["cIg","fIg",ig],["cMail","fMail",ml]].forEach(function(x){
    [x[0],x[1]].forEach(function(id){var a=document.getElementById(id); if(a) a.href=x[2]});
  });

  // Menú móvil
  var burger=document.getElementById("burger"), mnav=document.getElementById("mnav");
  function menu(open){
    mnav.hidden=!open; burger.setAttribute("aria-expanded",String(open));
    burger.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");
    document.body.classList.toggle("menu-open",open);
    Array.prototype.forEach.call(document.querySelectorAll("main,footer"),function(el){el.inert=open});
  }
  burger.addEventListener("click",function(){menu(mnav.hidden)});
  mnav.addEventListener("click",function(e){if(e.target.closest("a")) menu(false)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!mnav.hidden){menu(false);burger.focus()}});
  document.addEventListener("click",function(e){if(!mnav.hidden&&!mnav.contains(e.target)&&!burger.contains(e.target)) menu(false)});
  window.addEventListener("resize",function(){if(innerWidth>900&&!mnav.hidden) menu(false)});

  // Formulario de contacto (demo, sin servidor)
  var cf=document.getElementById("cForm");
  cf.addEventListener("submit",function(e){
    e.preventDefault();
    var f=cf.elements, ok=true;
    [["c-name","cname",2],["c-mail","cmail",5],["c-msg","cmsg",5]].forEach(function(x){
      var bad=f[x[1]].value.trim().length<x[2];
      document.getElementById(x[0]).classList.toggle("bad",bad);
      f[x[1]].setAttribute("aria-invalid",String(bad));
      if(bad&&ok){ok=false;f[x[1]].focus()}
    });
    if(!ok) return;
    cf.reset(); document.getElementById("cOk").hidden=false;
  });
  Array.prototype.forEach.call(cf.querySelectorAll("input,textarea"),function(i){
    i.addEventListener("input",function(){i.closest(".field").classList.remove("bad")});
  });

  // Contadores
  function count(el){
    var end=+el.dataset.count, t0=null, dur=1200;
    if(reduce){el.textContent=end;return}
    function step(t){
      if(t0===null) t0=t;
      var p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(end*e);
      if(p<1) requestAnimationFrame(step);
    }
    el.textContent="0"; requestAnimationFrame(step);
  }

  // Revelado al entrar en pantalla
  var items=$$(".rv"), counters=$$("[data-count]");
  // retardo escalonado entre hermanos
  $$(".bento,.details").forEach(function(g){$$(".rv",g).forEach(function(el,i){el.style.setProperty("--d",(i*0.08)+"s")})});
  if(!("IntersectionObserver" in window)||reduce){
    items.forEach(function(el){el.classList.add("in")});
    return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]",e.target).forEach(count);
      io.unobserve(e.target);
    });
  },{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  items.forEach(function(el){io.observe(el)});
  // contadores del hero (no están dentro de .rv)
  var co=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}});
  },{threshold:.6});
  counters.filter(function(el){return !el.closest(".rv")}).forEach(function(el){co.observe(el)});

  // Rebote del total al cambiar
  var tot=document.getElementById("pTotal"), last=tot&&tot.textContent;
  if(tot) new MutationObserver(function(){
    if(tot.textContent!==last){last=tot.textContent;tot.classList.remove("bump");void tot.offsetWidth;tot.classList.add("bump")}
  }).observe(tot,{childList:true,characterData:true,subtree:true});
})();
