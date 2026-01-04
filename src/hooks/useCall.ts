import { useState, useCallback } from 'react';
import { Call, User } from '@/types';
import { callService } from '@/services/call.service';

export const useCall = () => {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callParticipant, setCallParticipant] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initiateCall = useCallback(async (participant: User, type: 'audio' | 'video') => {
    setIsLoading(true);
    setCallParticipant(participant);
    const call = await callService.initiateCall(participant.id, type);
    setActiveCall(call);
    setIsLoading(false);
    
    // Simulate call being accepted after 3 seconds (mock)
    setTimeout(() => {
      setActiveCall((prev) => prev ? { ...prev, status: 'ringing' } : null);
    }, 1500);
    
    setTimeout(() => {
      setActiveCall((prev) => prev ? { ...prev, status: 'in_call' } : null);
    }, 3000);
    
    return call;
  }, []);

  const acceptCall = useCallback(async () => {
    if (!activeCall) return null;
    const call = await callService.acceptCall(activeCall.id);
    if (call) {
      setActiveCall(call);
    }
    return call;
  }, [activeCall]);

  const declineCall = useCallback(async () => {
    if (!activeCall) return;
    await callService.declineCall(activeCall.id);
    setActiveCall(null);
    setCallParticipant(null);
  }, [activeCall]);

  const endCall = useCallback(async () => {
    if (!activeCall) return null;
    const call = await callService.endCall(activeCall.id);
    if (call) {
      setActiveCall({ ...call, status: 'ended' });
      // Clear call after showing ended state
      setTimeout(() => {
        setActiveCall(null);
        setCallParticipant(null);
      }, 2000);
    }
    return call;
  }, [activeCall]);

  const clearCall = useCallback(() => {
    setActiveCall(null);
    setCallParticipant(null);
  }, []);

  // Simulate receiving an incoming call
  const simulateIncomingCall = useCallback((from: User, type: 'audio' | 'video') => {
    setCallParticipant(from);
    const call = callService.simulateIncomingCall(from, type);
    setActiveCall(call);
    return call;
  }, []);

  return {
    activeCall,
    callParticipant,
    isLoading,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
    clearCall,
    simulateIncomingCall,
  };
};
