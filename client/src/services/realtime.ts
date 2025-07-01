
import { io, Socket } from 'socket.io-client';

class RealTimeService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to real-time server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from real-time server');
    });

    // Set up event forwarding
    this.socket.onAny((event, ...args) => {
      const eventListeners = this.listeners.get(event) || [];
      eventListeners.forEach(listener => listener(...args));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event) || [];
    const index = eventListeners.indexOf(callback);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  }

  // Emit events
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Join specific rooms
  joinOrderRoom(orderId: number) {
    this.emit('join-order-room', orderId);
  }

  joinTailorRoom(tailorId: number) {
    this.emit('join-tailor-room', tailorId);
  }

  // Specific event emitters
  updateMeasurement(measurementData: any) {
    this.emit('measurement-update', measurementData);
  }

  updateOrderStatus(orderId: number, status: string) {
    this.emit('order-status-update', { orderId, status });
  }
}

export const realTimeService = new RealTimeService();
