class Sistema{

constructor(){

this.paneles=[];

this.crearGrilla();

}

crearGrilla(){

let margen=25;
let rowGap=58;
let colGap=14;

let w=(width-margen*2-colGap*2)/3;
let h=(height-margen*2-rowGap*2)/3;

this.paneles=[

new Memoria(
margen,
margen,
w,
h
),

new Herencia(
margen+w+colGap,
margen,
w,
h
),

new Caducidad(
margen+(w+colGap)*2,
margen,
w,
h
),

new Identidad(
margen,
margen+h+rowGap,
w,
h
),

new Empatia(
margen+w+colGap,
margen+h+rowGap,
w,
h
),

new Colaboracion(
margen+(w+colGap)*2,
margen+h+rowGap,
w,
h
),

new Incertidumbre(
margen,
margen+(h+rowGap)*2,
w,
h
),

new Ansiedad(
margen+w+colGap,
margen+(h+rowGap)*2,
w,
h
),

new Expectativa(
margen+(w+colGap)*2,
margen+(h+rowGap)*2,
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