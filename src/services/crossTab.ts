/**
 * Cross-tab communication service using BroadcastChannel for real-time demo sync
 */

const CHANNEL_NAME = 'sathi_broadcast_channel';

class CrossTabService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((event: { type: string; payload: any }) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (msg) => {
          this.listeners.forEach((l) => l(msg.data));
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or failed', e);
      }
    }
  }

  public broadcast(type: string, payload: any) {
    const message = { type, payload };
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('Failed to broadcast message', e);
      }
    }
    // Also trigger custom storage event for fallback
    try {
      localStorage.setItem('sathi_last_event', JSON.stringify({ ...message, timestamp: Date.now() }));
    } catch (e) {}
  }

  public subscribe(callback: (event: { type: string; payload: any }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}

export const crossTab = new CrossTabService();
