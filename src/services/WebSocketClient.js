import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


export function connectWebSocket(onMessageReceived){
    const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('connected');
            client.subscribe('/topic/notification', (message) => {
                onMessageReceived(message.body);
                console.log(message);
            })
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
        onDisconnect: () => {
            console.log('Client disconnected!');
        }
    });

    client.activate();

    return client;
}