import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export function useWebSocket(username, onMessageReceived) {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);

    const connect = useCallback(() => {
        if (clientRef.current?.active) {
            console.log('WebSocket already connected');
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true);
                
                client.subscribe(`/topic/chat`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    onMessageReceived(newMessage);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setConnected(false);
            },
            onError: (error) => {
                console.error('WebSocket error:', error);
                setConnected(false);
            }
        });

        clientRef.current = client;
        client.activate();
    }, [onMessageReceived]);

    useEffect(() => {
        connect();

        return () => {
            if (clientRef.current?.active) {
                clientRef.current.deactivate();
            }
        };
    }, [username, connect]);

    const sendMessage = useCallback((chatId, content) => {
        if (!clientRef.current?.active) {
            console.log('Reconnecting WebSocket...');
            connect();
            // Delay sending message until connection is established
            setTimeout(() => {
                if (clientRef.current?.active) {
                    clientRef.current.publish({
                        destination: '/app/chat.sendMessage',
                        body: JSON.stringify({
                            chatId,
                            text: content,
                            sender: username,
                            timestamp: new Date().toISOString()
                        })
                    });
                }
            }, 1000);
            return;
        }

        console.log('Sending message:', content);
        clientRef.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify({
                chatId,
                text: content,
                sender: username,
                timestamp: new Date().toISOString()
            })
        });
    }, [username, connect]);

    return { connected, sendMessage };
}