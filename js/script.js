(function(){
  var $=function(id){return document.getElementById(id)};
  var WHATSAPP=""; // PENDIENTE: número de Elite en formato internacional, ej. 584141234567
  var PRICE=4;     // precio por bicicleta ($)
  var TOTAL=14;
  var DN=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"], MN=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  var KEY="elite-b-reservas";
  // Horario de ejemplo (PENDIENTE: horarios definitivos)
  var SLOTS=["6:00 AM","7:30 AM","9:00 AM","5:30 PM","7:00 PM"];
  var SLOT_MIN=[360,450,540,1050,1140];
  var ROWS_MAP=[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14]];
  var state={day:0,slot:-1,sel:[]};

  var fmt=function(n){return n+" $"};
  var days=[], d=new Date();
  while(days.length<5){ if(d.getDay()!==0&&d.getDay()!==6) days.push(new Date(d)); d.setDate(d.getDate()+1); }
  var dkey=function(x){return x.getFullYear()+"-"+(x.getMonth()+1)+"-"+x.getDate()};
  var dlabel=function(x){return DN[x.getDay()]+" "+x.getDate()+" "+MN[x.getMonth()]};
  function store(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
  function save(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}

  // Disponibilidad simulada (PENDIENTE: conectar con reservas reales)
  function taken(di,si){
    var seed=(di+1)*31+(si+1)*17, out=[], n=3+(seed%6), k=seed;
    while(out.length<n){k=(k*37+11)%997; var b=(k%TOTAL)+1; if(out.indexOf(b)<0) out.push(b);}
    (store()[dkey(days[di])+"|"+si]||[]).forEach(function(b){if(out.indexOf(b)<0) out.push(b)});
    return out;
  }
  var free=function(di,si){return TOTAL-taken(di,si).length};
  function isPast(di,si){
    var n=new Date();
    return days[di].toDateString()===n.toDateString() && n.getHours()*60+n.getMinutes()>=SLOT_MIN[si];
  }
  function firstSlot(di){
    for(var i=0;i<SLOTS.length;i++) if(!isPast(di,i)&&free(di,i)>0) return i;
    return -1;
  }

  /* ---- Día ---- */
  function renderDays(){
    var today=new Date().toDateString();
    $("days").innerHTML=days.map(function(x,i){
      return '<button type="button" class="day" data-i="'+i+'" aria-pressed="'+(i===state.day)+'" aria-label="'+dlabel(x)+'"><small>'+(x.toDateString()===today?"Hoy":DN[x.getDay()])+'</small><strong>'+x.getDate()+'</strong></button>';
    }).join("");
  }
  /* ---- Hora ---- */
  function renderSlots(){
    $("slots").innerHTML=SLOTS.map(function(s,i){
      if(isPast(state.day,i)) return "";
      var f=free(state.day,i), t=s.split(" ");
      return '<button type="button" class="slot" data-i="'+i+'" aria-pressed="'+(i===state.slot)+'"'+(f===0?" disabled":"")+'><b>'+t[0]+'<small>'+t[1]+'</small></b><span>'+(f===0?"Clase llena":f+(f===1?" bici libre":" bicis libres"))+'</span></button>';
    }).join("");
  }
  /* ---- Mapa de bicis ---- */
  function renderMap(){
    var none=state.slot<0;
    $("stBike").hidden=none; $("empty").hidden=!none; $("bar").hidden=none;
    if(none){ $("slots").innerHTML=""; return; }
    var t=taken(state.day,state.slot);
    $("rows").innerHTML=ROWS_MAP.map(function(r){
      return '<div class="mrow">'+r.map(function(num){
        var oc=t.indexOf(num)>-1, on=state.sel.indexOf(num)>-1;
        return '<button type="button" class="b" data-n="'+num+'" aria-pressed="'+on+'"'+(oc?" disabled":"")+' aria-label="Bici '+num+', '+(oc?"ocupada":on?"tuya":"libre")+'">'+num+'</button>';
      }).join("")+'</div>';
    }).join("");
    updatePick();
  }
  function updatePick(){
    var n=state.sel.length, sorted=state.sel.slice().sort(function(a,b){return a-b});
    $("picked").textContent = n===0 ? "Toca una bici libre." : "Tuya: "+sorted.join(", ");
    $("pTotal").textContent=fmt(n*PRICE);
    $("pNote").textContent=n===0?"Elige una bici":n+(n===1?" bici":" bicis")+" × "+fmt(PRICE);
    $("toForm").disabled=n===0;
  }
  function refresh(){ renderDays(); renderSlots(); renderMap(); }
  function setDay(i){ state.day=i; state.slot=firstSlot(i); state.sel=[]; refresh(); }

  $("days").addEventListener("click",function(e){var b=e.target.closest(".day"); if(!b) return; setDay(+b.dataset.i);});
  $("slots").addEventListener("click",function(e){var b=e.target.closest(".slot"); if(!b||b.disabled) return; state.slot=+b.dataset.i; state.sel=[]; renderSlots(); renderMap();});
  $("rows").addEventListener("click",function(e){
    var b=e.target.closest(".b"); if(!b||b.disabled) return;
    var n=+b.dataset.n, i=state.sel.indexOf(n);
    if(i>-1) state.sel.splice(i,1); else state.sel.push(n);
    b.setAttribute("aria-pressed",String(i<0));
    b.setAttribute("aria-label","Bici "+n+", "+(i<0?"tuya":"libre"));
    updatePick();
  });

  /* ---- Vistas: elegir, datos, listo ---- */
  var book=$("reservar");
  function view(v){
    $("stPick").hidden=(v!=="pick"); $("stForm").hidden=(v!=="form"); $("stDone").hidden=(v!=="done");
    book.scrollIntoView({block:"start"});
  }
  function when(){return dlabel(days[state.day])+" · "+SLOTS[state.slot]}
  $("toForm").addEventListener("click",function(){
    var n=state.sel.length, s2=state.sel.slice().sort(function(a,b){return a-b});
    $("recap").textContent=when()+" · "+(n===1?"bici ":"bicis ")+s2.join(", ")+" · "+fmt(n*PRICE);
    view("form"); $("stForm").name.focus({preventScroll:true});
  });
  $("back").addEventListener("click",function(){view("pick")});
  $("again").addEventListener("click",function(){state.sel=[]; refresh(); view("pick")});

  function bad(id,v){$(id).classList.toggle("bad",v)}
  $("stForm").addEventListener("submit",function(e){
    e.preventDefault();
    var f=e.target, name=f.name.value.trim(), wa=f.wa.value.trim();
    var okN=name.split(/\s+/).length>=2&&name.length>=5, okW=wa.replace(/\D/g,"").length>=7;
    bad("f-name",!okN); bad("f-wa",!okW);
    if(!(okN&&okW)){var el=f.querySelector(".bad input"); if(el) el.focus(); return;}
    var all=store(), k=dkey(days[state.day])+"|"+state.slot;
    all[k]=(all[k]||[]).concat(state.sel); save(all);
    var bikes=state.sel.slice().sort(function(a,b){return a-b}), w=when(), total=fmt(bikes.length*PRICE), lbl=(bikes.length>1?"bicis ":"bici ")+bikes.join(", ");
    var msg="Hola, reservé en Elite Spinning: "+w+", "+lbl+". Total "+total+". A nombre de "+name+".";
    $("doneMsg").textContent=w+" · "+lbl+" · "+total;
    $("waBtn").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(msg);
    state.sel=[]; f.reset(); view("done"); $("doneTitle").focus({preventScroll:true});
  });
  ["name","wa"].forEach(function(k){$("stForm")[k].addEventListener("input",function(){this.closest(".field").classList.remove("bad")})});

  $("yr").textContent=new Date().getFullYear();

  // Primer día con alguna clase disponible
  var start=0; while(start<days.length-1 && firstSlot(start)<0) start++;
  setDay(start);
})();
