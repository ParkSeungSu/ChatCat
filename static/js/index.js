var socket = io();
//접속되었을 때 실행

socket.on("connect",function(){
    //이름을 입력받기
    var name=prompt("Hello!😽","");
    //이름이 없을때
    if(!name){
        name="🙀";
    }
    //서버에 새로운 유저를 알림
    socket.emit("newUser",name);
});
//서버로 부터 데이터 받은 경우
socket.on("update",function(data){
    var chat=document.getElementById("chat");

    var message=document.createElement("div");
    var node = document.createTextNode(`${data.name}:${data.message}`);
    var className="";
    //타입에 따라 적용할 클래스를 다르게 지정
    switch (data.type) {
        case "message":
            className="other";
            break;
        case "connect":
            className="connect";
            break;
        case "disconnect":
            className="disconnect"
            break;
    }
    message.classList.add(className);
    message.appendChild(node);
    chat.appendChild(message);
    console.log(`${data.name}: ${data.message}`)
});
// 메시지 전송 함수
function send() {
    //입력되어있는 데이터 가져오기
    var message= document.getElementById("test").value;

    //가져왔으니 데이터 빈칸으로 변경
    document.getElementById("test").value="";

    //내가 전송할 메시지 클라이언트에게 표시
    var chat=document.getElementById("chat");
    var msg = document.createElement("div");
    var node = document.createTextNode(message);
    msg.classList.add("me");
    msg.appendChild(node);
    chat.appendChild(msg);

    //서버로 message 이벤트 전달 + 데이터와 함께
    socket.emit("message",{type:"message",message: message});
}