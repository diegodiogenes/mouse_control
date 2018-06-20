const robot = require('robotjs');
var pupil_remote = require("pupil-remote");
// var gkm = require('gkm');
const screenSize = robot.getScreenSize();
const width = screenSize.width;
const height = screenSize.height * 0.75;

var x=0;
var y=(height/2);
var a;
var aux = true;
var controle = true;
var repeticao = 200;
var linhas_passando = 10;

var receiver = new pupil_remote.MessageReceiver("127.0.0.1", 50020, 2);
var tempo_inicio_da_piscada;
var tempo;
var tempo_piscada = 1.2;
var fechado=0;

// worker.js
var zmq = require('zeromq')
  , sock = zmq.socket('pull');

sock.connect('tcp://127.0.0.1:3000');
console.log('Worker connected to port 3000');

sock.on('message', function(msg){
  console.log("aaaaaa")
  if(msg.toString()=='open'){
    linhas_passando = 10;
  }
  if(msg.toString() == 'blink'){
    a = 'A';
    linhas_passando = 10;
  }
});
// worker.js
// var zmq = require('zeromq')
//   , sock = zmq.socket('pull');
//
// sock.connect('tcp://127.0.0.1:3000');
// console.log('Worker connected to port 3000');
//
// sock.on('message', function(msg){
//   console.log('work: %s', msg.toString());
// });
receiver.on('blinks', function (data) {

    if(data['topic'] == 'close'){
      linhas_passando = 3000;

    }else if(data['topic']=='open'){
      linhas_passando = 10;
    }

    if(data['topic'] == 'blink'){
      a = 'A';
      linhas_passando = 10;

    }else{
      //console.log('PISCOU NAO');
    }
});

// gkm.events.on('key.*', function(data) {
//     a = data.toString()
//     if(a == 'A' || a =='B'){
//       console.log(a);
//     }
// });

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
  if(x<10){
    aux = true;
  }else if(x>=width){
    aux = false;
  }
}

function verifica_y(){
  if(y<10){
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
