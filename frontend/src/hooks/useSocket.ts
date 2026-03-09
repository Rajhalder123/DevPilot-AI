'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('devpilot_token');
        if (!token) return;

        const newSocket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => setConnected(true));
        newSocket.on('disconnect', () => setConnected(false));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return { socket, connected };
}
