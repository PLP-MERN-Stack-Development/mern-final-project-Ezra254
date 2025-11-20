import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const realtimeUrl = import.meta.env.VITE_SOCKET_URL ?? apiBase.replace(/\/api$/, '');
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

let socket: Socket | null = null;

const getSocket = () => {
  if (!socket) {
    socket = io(realtimeUrl, {
      withCredentials: true,
    });
  }
  return socket;
};

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isDemoMode) {
      return undefined;
    }
    const client = getSocket();
    const invalidateGoals = () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'summary', 'weekly'] });
    };
    const invalidatePlans = () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans', 'summary'] });
    };
    const invalidateWorkouts = () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['workouts', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'summary', 'weekly'] });
    };

    client.on('goals:changed', invalidateGoals);
    client.on('plans:changed', invalidatePlans);
    client.on('workouts:changed', invalidateWorkouts);

    return () => {
      client.off('goals:changed', invalidateGoals);
      client.off('plans:changed', invalidatePlans);
      client.off('workouts:changed', invalidateWorkouts);
    };
  }, [queryClient]);
};



