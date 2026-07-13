class Sistema{

constructor(){

this.paneles=[];

this.crearGrilla();

}

crearGrilla(){

let margen=25;

let w=(width-margen*4)/3;

let h=(height-margen*4)/3;

this.paneles=[

new Memoria(
margen,
margen,
w,
h
),

new Herencia(
margen*2+w,
margen,
w,
h
),

new Caducidad(
margen*3+w*2,
margen,
w,
h
),

new Identidad(
margen,
margen*2+h,
w,
h
),

new Empatia(
margen*2+w,
margen*2+h,
w,
h
),

new Colaboracion(
margen*3+w*2,
margen*2+h,
w,
h
),

new Incertidumbre(
margen,
margen*3+h*2,
w,
h
),

new Ansiedad(
margen*2+w,
margen*3+h*2,
w,
h
),

new Expectativa(
margen*3+w*2,
margen*3+h*2,
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