// ============================================================
// DevIA · La torre de control del desarrollo de software
// Scrollytelling (Martini Glass). SVG control-tower que ilumina
// 3 instrumentos: Estimar / Construir / Validar.
// ============================================================

const svg   = d3.select(".viz svg");
const shot  = document.getElementById("shot");
const shotImg = shot.querySelector("img");
const vlabel = document.getElementById("vlabel");

const C = {
  estimar:   "#36c5f0",
  construir: "#7ee787",
  validar:   "#ffb454",
  core:      "#2dd4bf",
  ink:       "#eaf2f9",
  muted:     "#8aa2b8",
  line:      "#27425e",
  dim:       "#1c3145"
};

const INSTR = [
  { key:"estimar",   label:"ESTIMAR",   sub:"IFPUG · COCOMO II", x:150, color:C.estimar },
  { key:"construir", label:"CONSTRUIR", sub:"Spec-Driven · agentes", x:380, color:C.construir },
  { key:"validar",   label:"VALIDAR",   sub:"% cumplimiento HU", x:610, color:C.validar }
];
const GY = 360, R = 78;

// ---------- skeleton ----------
const root = svg.append("g");

// connectors (the cycle) drawn first
const conn = root.append("g");
conn.append("line").attr("class","c-link").attr("x1",INSTR[0].x).attr("y1",GY).attr("x2",INSTR[1].x).attr("y2",GY);
conn.append("line").attr("class","c-link").attr("x1",INSTR[1].x).attr("y1",GY).attr("x2",INSTR[2].x).attr("y2",GY);
conn.selectAll("line").attr("stroke",C.line).attr("stroke-width",3);

// core
const core = root.append("g").attr("transform","translate(380,120)");
core.append("rect").attr("class","core-box").attr("x",-90).attr("y",-34).attr("width",180).attr("height",68)
  .attr("rx",14).attr("fill","#0c2233").attr("stroke",C.line).attr("stroke-width",2);
core.append("text").attr("text-anchor","middle").attr("y",-2).attr("fill",C.core)
  .attr("font-size",26).attr("font-weight",800).attr("letter-spacing","1px").text("DevIA");
core.append("text").attr("text-anchor","middle").attr("y",20).attr("fill",C.muted)
  .attr("font-size",12).attr("letter-spacing","1.5px").text("PLATAFORMA IA GENERATIVA");

// core -> instrument feeders
const feeders = root.append("g");
INSTR.forEach(d=>{
  feeders.append("path").attr("class","feed feed-"+d.key)
    .attr("d",`M380,154 C380,250 ${d.x},230 ${d.x},${GY-R}`)
    .attr("fill","none").attr("stroke",C.dim).attr("stroke-width",2.5);
});

const arc = d3.arc().innerRadius(R-12).outerRadius(R).startAngle(0).cornerRadius(6);

// instrument gauges
const gauges = {};
INSTR.forEach(d=>{
  const g = root.append("g").attr("transform",`translate(${d.x},${GY})`).attr("opacity",0.35);
  g.append("circle").attr("r",R).attr("fill","#0c2233").attr("stroke",C.line).attr("stroke-width",2);
  // track
  g.append("path").attr("d",arc({endAngle:2*Math.PI})).attr("fill",C.dim);
  // value arc
  const val = g.append("path").attr("class","val").attr("fill",d.color).datum(0)
    .attr("d",arc({endAngle:0}));
  // center readout
  const num = g.append("text").attr("class","num").attr("text-anchor","middle").attr("y",6)
    .attr("fill",C.ink).attr("font-size",30).attr("font-weight",800).text("");
  g.append("text").attr("text-anchor","middle").attr("y",R+26).attr("fill",d.color)
    .attr("font-size",15).attr("font-weight",750).attr("letter-spacing","1.5px").text(d.label);
  g.append("text").attr("class","sub").attr("text-anchor","middle").attr("y",R+44).attr("fill",C.muted)
    .attr("font-size",11).text(d.sub);
  gauges[d.key] = {g,val,num,color:d.color};
});

// agentic pipeline (hidden by default), under construir
const pipe = root.append("g").attr("opacity",0);
const steps = ["1 · Spec","2 · Agentes IA","3 · Humano valida","4 · Iterar"];
steps.forEach((s,i)=>{
  const px = 110 + i*150;
  const node = pipe.append("g").attr("transform",`translate(${px},505)`);
  node.append("rect").attr("x",-62).attr("y",-20).attr("width",124).attr("height",40).attr("rx",9)
    .attr("fill","#0c2233").attr("stroke",C.construir).attr("stroke-width",1.5).attr("opacity",.9);
  node.append("text").attr("text-anchor","middle").attr("y",5).attr("fill",C.construir)
    .attr("font-size",12.5).attr("font-weight",700).text(s);
  if(i<steps.length-1){
    pipe.append("line").attr("x1",px+62).attr("y1",505).attr("x2",px+88).attr("y2",505)
      .attr("stroke",C.construir).attr("stroke-width",2).attr("marker-end","url(#arrow)");
  }
});
// arrow marker
const defs = svg.append("defs");
defs.append("marker").attr("id","arrow").attr("viewBox","0 0 10 10").attr("refX",8).attr("refY",5)
  .attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse")
  .append("path").attr("d","M0,0 L10,5 L0,10 z").attr("fill",C.construir);

// caption line at bottom
const caption = root.append("text").attr("x",380).attr("y",578).attr("text-anchor","middle")
  .attr("fill",C.muted).attr("font-size",13).text("");

// ---------- animation helpers ----------
function setGauge(key, fill, readout){
  const G = gauges[key];
  G.val.transition().duration(900).attrTween("d", function(){
    const cur = this._v || 0; const i = d3.interpolate(cur, fill); this._v = fill;
    return t => arc({endAngle: 2*Math.PI*i(t)});
  });
  if(readout!==undefined){
    G.num.transition().duration(900).tween("t",function(){
      const i = d3.interpolate(+this._n||0, readout); this._n = readout;
      return t => { d3.select(this).text(Math.round(i(t))+"%"); };
    });
  } else { G.num.text(""); }
}
function activeInstr(keys){
  INSTR.forEach(d=>{
    const on = keys.includes(d.key);
    gauges[d.key].g.transition().duration(500).attr("opacity", on?1:0.35);
    feeders.select(".feed-"+d.key).transition().duration(500)
      .attr("stroke", on?d.color:C.dim).attr("stroke-width", on?3:2.5);
  });
}

// ---------- scene states ----------
const STATES = {
  s0: ()=>{ swapToSvg("El problema"); activeInstr([]); setGauge("estimar",0); setGauge("construir",0); setGauge("validar",0);
            core.transition().duration(400).attr("opacity",.3); pipe.transition().attr("opacity",0); caption.text("Estimación a juicio experto · sin trazabilidad"); },
  s1: ()=>{ swapToSvg("El ciclo, sin instrumentar"); core.transition().attr("opacity",.3); activeInstr([]);
            setGauge("estimar",0); setGauge("construir",0); setGauge("validar",0); pipe.transition().attr("opacity",0);
            caption.text("Estimar → Construir → Validar · 3 saltos, 3 cajas negras"); },
  s2: ()=>{ swapToSvg("Torre de control · DevIA"); core.transition().duration(600).attr("opacity",1);
            activeInstr(["estimar","construir","validar"]); setGauge("estimar",.15); setGauge("construir",.15); setGauge("validar",.15);
            pipe.transition().attr("opacity",0); caption.text("3 microservicios sobre un mismo ciclo"); },
  s3: ()=> swapToShot("cu1_ifpug.png","Estimador IFPUG Fase III — PF + SNAP (captura DevIA)"),
  s4: ()=> swapToShot("cu2_cocomo.png","Estimador COCOMO II — esfuerzo · coste (captura DevIA)"),
  s5: ()=>{ swapToSvg("Construir · IA agéntica"); core.transition().attr("opacity",1);
            activeInstr(["construir"]); setGauge("construir",1,100); pipe.transition().duration(600).attr("opacity",1);
            caption.text("Spec-Driven Development · human-in-the-loop no negociable"); },
  s6: ()=> swapToShot("cu3_validador.png","Validador de código — % cumplimiento HU (captura DevIA)"),
  s7: ()=>{ swapToSvg("Panel completo · ciclo cerrado"); core.transition().attr("opacity",1); pipe.transition().attr("opacity",0);
            activeInstr(["estimar","construir","validar"]); setGauge("estimar",.92,92); setGauge("construir",1,100); setGauge("validar",.88,88);
            caption.text("Cada fase deja un dato objetivo y trazable"); },
  s8: ()=>{ swapToSvg("Punto de valor"); core.transition().attr("opacity",1); pipe.transition().attr("opacity",0);
            activeInstr(["estimar","construir","validar"]); setGauge("estimar",1,100); setGauge("construir",1,100); setGauge("validar",1,100);
            caption.text("Estimación objetiva · menos retrabajo · confianza en la entrega"); }
};

function swapToSvg(label){
  shot.style.display="none";
  svg.style("display","block");
  vlabel.textContent = label;
}
function swapToShot(file,label){
  svg.style("display","none");
  shot.style.display="flex";
  shotImg.src = "assets/"+file;
  vlabel.textContent = label;
}

// ---------- scroll driver ----------
const scenes = Array.from(document.querySelectorAll(".scene"));
let current = null;
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && e.intersectionRatio>=0.5){
      scenes.forEach(s=>s.classList.toggle("active", s===e.target));
      const id = e.target.id;
      if(id!==current && STATES[id]){ current=id; STATES[id](); }
    }
  });
},{ threshold:[0.5], rootMargin:"-10% 0px -40% 0px" });
scenes.forEach(s=>io.observe(s));

// initial
STATES.s0();
scenes[0].classList.add("active");
