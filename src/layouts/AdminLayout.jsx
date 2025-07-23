// src/layouts/AdminLayout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export function getAdminSocket() {
  return socket;
}

export default function AdminLayout() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Admin socket connected:', socket.id);
    });

    socket.on('receive_message', (msg) => {
      console.log('📩 New message received (global admin listener):', msg);

      // OPTIONAL: store in state, play sound, show toast, etc.
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  return <Outlet />;
}