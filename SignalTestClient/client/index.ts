import * as signalR from "@microsoft/signalr";
import {ConnectionStatus} from "./connectionStatus";

updateConnectionStatus(ConnectionStatus.disconnected);
 
let sendButton = document.getElementById('msgSend') as HTMLButtonElement;
if (sendButton) {
    sendButton.addEventListener("click", sendButtonClickHandler);
}

let connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl('/hub/textMessage')
    .build();

connection.on("SendTextMessage", (message: string, connectionId: string) => {
    console.log(`Recieved Message from ${connectionId}: ${message}`);

    if (!message) {
        return;
    }

    showMessage(message);
});

connection.onclose((error: Error | undefined) => {
    console.log('Connection has been closed');
    updateConnectionStatus(ConnectionStatus.disconnected);
    
    setTimeout(()=>{
        startConnection();
    }, 1000);

});

connection.onreconnecting(() => {
    console.log('Connection attempting reconnect');
    updateConnectionStatus(ConnectionStatus.reconnecting);

})

connection.onreconnected((connectionId: string | undefined) => {
    console.log(`Reconnection Success: ${connectionId}`);
    updateConnectionStatus(ConnectionStatus.connected);
})

startConnection();

function showMessage(message: string): void {
    let msgDisplay: HTMLElement = document.getElementById('msgDisplay') as HTMLElement;

    let newMsgP = document.createElement('p');
    newMsgP.innerText = message;

    msgDisplay.appendChild(newMsgP);
}

function sendButtonClickHandler(ev: MouseEvent) {
    if (!ev || !connection) {
        return;
    }

    let msgBox = document.getElementById('msgComposeBox') as HTMLTextAreaElement;
    if (!msgBox) {
        return;
    }

    let message = msgBox.value;

    if (message) {
        connection.invoke('EchoTextMessage', message, connection.connectionId);
        msgBox.value = '';
    }

    ev.preventDefault();
}

function updateConnectionStatus(connectionStatus: ConnectionStatus) {
    let connectionStatusH2: HTMLElement = document.getElementById('connectionStatus') as HTMLElement;


    switch (connectionStatus) {

        case ConnectionStatus.disconnected:
            connectionStatusH2.innerText = 'Disconnected';
            break;

        case ConnectionStatus.connected:
            connectionStatusH2.innerText = 'Connected';
            break;

        case ConnectionStatus.reconnecting:
            connectionStatusH2.innerText = 'Reconnecting..';
            break;
    }
}

function startConnection(){
    connection.start().then(
        () => {
            console.log(`Started connection ${connection.connectionId}`);
            updateConnectionStatus(ConnectionStatus.connected);
        }
    ).catch(() => {
        console.log(`Connection failed`);
    })
}

