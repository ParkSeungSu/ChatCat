//Node.js 기본 내장 모듈 불러오기
const fs = require("fs");

//설치한 express 모듈 가져오기
const express= require("express");

//설치한socket.io 모듈 가져오기
const socket=require("socket.io");

//Node.js 기본 내장 모듈 불러오기
const http=require("http");

//express  객체 생성
const app = express();

app.use("/css",express.static("./static/css"));
app.use("/js",express.static("./static/js"));
//express http server create
const server = http.createServer(app);

//생성된 서버를 socket.io에 바인딩
const io = socket(server);

//get 방식으로 /경로에 접속하면 실행 됨
app.get('/',function(require,response){
    fs.readFile("static/index.html",function(err,data){
        if(err){
            response.send("Error!");
        }else{
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(data);
            response.end();
        }
    });
});

io.sockets.on("connection",function(socket){
    //새로운 유저 접속
    socket.on("newUser",function(name){
        console.log(`${name} is online!`);
        //소켓에 이름 저장하기
        socket.name=name;
        //모든 소켓에게 전송
        io.sockets.emit("update",{
            type: "connect",
            name:"SERVER",
            message:`😸${name} is online`
        });
    });
    
//전송한 메시지 받기
    socket.on("message",function(data){
        //받은 데이터에 누가 보냈는지 이름을 추가
        data.name=socket.name;
        console.log(data);
        //보낸사람을 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit("update",data);
    });
    //접속종료
    socket.on("disconnect",function(){
        console.log(`😿${socket.name} is disconnect`);
        //나간 사람을 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit("update",{
            type:"disconnect",
            name:"SERVER",
            message:`😿${socket.name} is disconnect`
        });
    });
});
//서버를 포트 8080포트로 listen
server.listen(8080,function() {
    console.log("서버 실행중...");
});