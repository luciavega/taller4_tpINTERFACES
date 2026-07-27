class Sistema{

constructor(){

this.paneles=[];

this.crearGrilla();

}

crearGrilla(){

let margen=25;
let espacio=45;

let w=(width-margen*2-espacio*2)/3;
let h=(height-margen*2-espacio*2)/3;

this.paneles=[

new Memoria(
margen,
margen,
w,
h
),

new Herencia(
margen+w+espacio,
margen,
w,
h
),

new Caducidad(
margen+(w+espacio)*2,
margen,
w,
h
),

new Identidad(
margen,
margen+h+espacio,
w,
h
),

new Empatia(
margen+w+espacio,
margen+h+espacio,
w,
h
),

new Colaboracion(
margen+(w+espacio)*2,
margen+h+espacio,
w,
h
),

new Incertidumbre(
margen,
margen+(h+espacio)*2,
w,
h
),

new Ansiedad(
margen+w+espacio,
margen+(h+espacio)*2,
w,
h
),

new Expectativa(
margen+(w+espacio)*2,
margen+(h+espacio)*2,
w,
h
)

];

}

update(){

for(let p of this.paneles){

p.update();

}

}

draw(){

for(let p of this.paneles){

p.draw();

}

}

}