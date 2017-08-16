const robot = require('robotjs');
var pupil_remote = require("pupil-remote");
var gkm = require('gkm');
const screenSize = robot.getScreenSize();
const width = screenSize.width;
const height = screenSize.height;

var x=0;
var y=(height/2);
var a;
var aux = true;
var controle = true;
var repeticao = 200;
var linhas_passando = 30;

var receiver = new pupil_remote.MessageReceiver("127.0.0.1", 50020, 2);
var tempo_inicio_da_piscada;
var tempo;
var tempo_piscada = 0.8;


receiver.on('blinks', function (data) {

    if(data['topic'] == 'close'){
      tempo_inicio_da_piscada = String(data['timestamp']);
      linhas_passando = 200;
    }else if(data['topic']=='open'){
      tempo_inicio_da_piscada = 0;
      linhas_passando = 30;
    }

    if(data['topic'] == 'blink'){
      console.log('PISCOU KRAI');
      tempo = String(data['timestamp']) - tempo_inicio_da_piscada;
      console.log(tempo);

      if(tempo>tempo_piscada){
        a = 'A';
        linhas_passando = 30;
      }

    }else{
      console.log('PISCOU NAO');
    }

});

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

  setTimeout(movemouse, linhas_passando);
}
movemouse();
