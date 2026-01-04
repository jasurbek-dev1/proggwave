import React, { useState, useEffect, useCallback } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User, Call } from '@/types';
import { Avatar } from './Avatar';

interface CallModalProps {
  call: Call;
  participant: User;
  isOutgoing: boolean;
  onAccept?: () => void;
  onDecline: () => void;
  onEnd: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  call,
  participant,
  isOutgoing,
  onAccept,
  onDecline,
  onEnd,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(call.type === 'audio');
  const [callDuration, setCallDuration] = useState(0);

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (call.status === 'in_call') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [call.status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (call.status) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Ringing...';
      case 'in_call':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call Ended';
      case 'declined':
        return 'Call Declined';
      case 'missed':
        return 'Missed Call';
      default:
        return '';
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (call.status === 'in_call') {
          onEnd();
        } else {
          onDecline();
        }
      }
    },
    [call.status, onEnd, onDecline]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-between animate-fade-in">
      {/* Close button */}
      <button
        onClick={call.status === 'in_call' ? onEnd : onDecline}
        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* Video background (mock) */}
      {call.type === 'video' && call.status === 'in_call' && !isVideoOff && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-md bg-muted/30" />
          </div>
          {/* Self view */}
          <div className="absolute bottom-32 right-4 w-28 h-40 bg-card rounded-xl overflow-hidden border-2 border-border shadow-xl">
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">You</span>
            </div>
          </div>
        </div>
      )}

      {/* Participant info */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 z-10 px-4">
        {/* Animated ring for calling/ringing states */}
        <div className="relative">
          {(call.status === 'calling' || call.status === 'ringing') && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-[-8px] rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            </>
          )}
          <Avatar
            src={participant.avatar}
            alt={participant.displayName}
            size="xl"
            className="w-32 h-32 border-4 border-primary/30"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{participant.displayName}</h2>
          <p className="text-muted-foreground">@{participant.username}</p>
        </div>

        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full',
          call.status === 'in_call' ? 'bg-success/20 text-success' :
          call.status === 'ended' || call.status === 'declined' || call.status === 'missed' ? 'bg-destructive/20 text-destructive' :
          'bg-muted text-muted-foreground'
        )}>
          {call.type === 'video' ? <Video size={18} /> : <Phone size={18} />}
          <span className="font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="w-full max-w-md px-6 pb-12 z-10">
        {/* In-call controls */}
        {call.status === 'in_call' && (
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all',
                isMuted ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              )}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {call.type === 'video' && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center transition-all',
                  isVideoOff ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
                )}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            )}

            <button className="w-14 h-14 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-all">
              <Volume2 size={24} />
            </button>
          </div>
        )}

        {/* Accept/Decline for incoming calls */}
        {call.status === 'ringing' && !isOutgoing && (
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={onDecline}
              className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-all animate-pulse"
            >
              <PhoneOff size={28} />
            </button>
            <button
              onClick={onAccept}
              className="w-16 h-16 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-all animate-pulse"
            >
              <Phone size={28} />
            </button>
          </div>
        )}

        {/* Cancel for outgoing calls */}
        {(call.status === 'calling' || (call.status === 'ringing' && isOutgoing)) && (
          <div className="flex justify-center">
            <button
              onClick={onDecline}
              className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        )}

        {/* End call for in-call state */}
        {call.status === 'in_call' && (
          <div className="flex justify-center">
            <button
              onClick={onEnd}
              className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        )}

        {/* Call ended state */}
        {(call.status === 'ended' || call.status === 'declined' || call.status === 'missed') && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {call.duration ? `Duration: ${formatDuration(call.duration)}` : 'Call ended'}
            </p>
            <button
              onClick={onDecline}
              className="px-8 py-3 bg-muted text-foreground rounded-full font-medium hover:bg-muted/80 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;
