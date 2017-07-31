const robot = require('robotjs');
var gkm = require('gkm');
const screenSize = robot.getScreenSize();
const width = screenSize.width;
const height = screenSize.height;


var x=0;
var y=(height/2);
var a;
var aux = true;
var controle = true;

gkm.events.on('key.*', function(data) {
    a = data.toString()
    if(a == 'A' || a =='B'){
      console.log(a);
    }
});

function verifica_clique_x(){
  if(a=='A'){
    a = 'B';
    aux = true;
    controle = false;
  }
}

function verifica_clique_y(){
  if(a=='A'){
    a = 'B';
    aux = true;
    controle = true;
    robot.mouseClick();
  }
}


function verifica_x(){
  if(x==0){
    aux = true;
  }else if(x>=width){
    aux = false;
  }
}

function verifica_y(){
  if(y==0){
    aux = true;
  }else if(y>=height){
    aux = false;
  }
}

function movemouse_x(){
  robot.moveMouseSmooth(x,y);

  verifica_x();
  verifica_clique_x();

  if(aux){
    x+=5;
  }else{
    x-=5;
  }
}

function movemouse_y(data){
  robot.moveMouseSmooth(x,y);
  verifica_y();
  verifica_clique_y();

  if(aux){
    y+=5;
  }else{
    y-=5;
  }
}

var movemouse = function(){
  if(controle){
    movemouse_x();
  }else{
    movemouse_y();
  }

  setTimeout(movemouse, 30);
}
movemouse();
