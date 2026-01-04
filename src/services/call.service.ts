import { Call, User } from '@/types';
import { currentUser } from '@/data/mockData';

let activeCalls: Call[] = [];
let callHistory: Call[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const callService = {
  async initiateCall(receiverId: string, type: 'audio' | 'video'): Promise<Call> {
    await delay(200);
    const call: Call = {
      id: `call${Date.now()}`,
      type,
      callerId: currentUser.id,
      receiverId,
      status: 'calling',
      startedAt: new Date().toISOString(),
    };
    activeCalls.push(call);
    return call;
  },

  async acceptCall(callId: string): Promise<Call | null> {
    await delay(100);
    const call = activeCalls.find(c => c.id === callId);
    if (call) {
      call.status = 'in_call';
    }
    return call || null;
  },

  async declineCall(callId: string): Promise<void> {
    await delay(100);
    const call = activeCalls.find(c => c.id === callId);
    if (call) {
      call.status = 'declined';
      call.endedAt = new Date().toISOString();
      callHistory.push(call);
      activeCalls = activeCalls.filter(c => c.id !== callId);
    }
  },

  async endCall(callId: string): Promise<Call | null> {
    await delay(100);
    const call = activeCalls.find(c => c.id === callId);
    if (call) {
      call.status = 'ended';
      call.endedAt = new Date().toISOString();
      if (call.startedAt) {
        call.duration = Math.floor((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000);
      }
      callHistory.push(call);
      activeCalls = activeCalls.filter(c => c.id !== callId);
      return call;
    }
    return null;
  },

  async getActiveCall(): Promise<Call | null> {
    await delay(50);
    return activeCalls.find(c => c.callerId === currentUser.id || c.receiverId === currentUser.id) || null;
  },

  async getCallHistory(): Promise<Call[]> {
    await delay(200);
    return callHistory;
  },

  // Mock incoming call simulation
  simulateIncomingCall(from: User, type: 'audio' | 'video'): Call {
    const call: Call = {
      id: `call${Date.now()}`,
      type,
      callerId: from.id,
      receiverId: currentUser.id,
      status: 'ringing',
    };
    activeCalls.push(call);
    return call;
  },
};
