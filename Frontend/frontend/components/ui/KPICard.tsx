
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color: string;
  subtitle?: string;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  subtitle,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center`}
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon size={28} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-semibold ${
                trend >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-zinc-500 ml-2">vs last review</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
