import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export function useWebSocket(username, onMessageReceived) {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const connect = useCallback(() => {
        if (clientRef.current?.active) {
            console.log('WebSocket already connected');
            return;
        }

        const socket = new SockJS(`wss://${API}/ws`, null, {
            transportOptions: {
                websocket: {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            }
        });
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
             connectHeaders: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
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

    const sendMessage = useCallback( async (chatId, formData) => {
        
        if (!clientRef.current?.active) {
            console.log('Reconnecting WebSocket...');
            connect();
            return;
        }

        if(formData.getAll('images') != null || formData.get('text').length > 0) {
            const response = await fetch(`${API}/chat/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            })
            
            if(response.ok) {
                console.log('Message sent successfully');
                const data = await response.json();
                clientRef.current.publish({
                    destination: `/app/chat.sendMessage`,
                    body: JSON.stringify(data)
                });
            }
        } else return;
        
    }, [username, connect]);

    return { connected, sendMessage };
}