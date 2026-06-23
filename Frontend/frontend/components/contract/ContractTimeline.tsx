
import { TimelineEvent } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ContractTimelineProps {
  events: TimelineEvent[];
}

export default function ContractTimeline({ events }: ContractTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'effective':
        return CheckCircle2;
      case 'payment':
        return Clock;
      case 'renewal':
        return Calendar;
      case 'termination':
      case 'expiration':
        return AlertCircle;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'effective':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'payment':
        return 'text-blue-400 bg-blue-500/20';
      case 'renewal':
        return 'text-purple-400 bg-purple-500/20';
      case 'termination':
      case 'expiration':
        return 'text-rose-400 bg-rose-500/20';
      default:
        return 'text-zinc-400 bg-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const Icon = getEventIcon(event.type);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${getEventColor(
                  event.type
                )}`}
              >
                <Icon size={20} />
              </div>
              {index < events.length - 1 && (
                <div className="w-px flex-1 bg-zinc-700 mt-2" />
              )}
            </div>
            <div className="pb-8">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-semibold text-white">{event.title}</h4>
              </div>
              <p className="text-sm text-zinc-400 mb-1">
                {format(new Date(event.date), 'MMMM dd, yyyy')}
              </p>
              <p className="text-sm text-zinc-500">{event.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
