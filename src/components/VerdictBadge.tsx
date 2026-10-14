import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, MinusCircle, ShieldCheck } from 'lucide-react';
import { Verdict } from '../types/factCheck';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VERDICT_CONFIG: Record<
  Verdict,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  'TRUE': {
    label: 'VERIFIED_TRUE',
    bg: 'bg-emerald-950/50',
    text: 'text-emerald-400',
    border: 'border-emerald-500/60',
    icon: CheckCircle2,
    description: 'Empirical corroboration confirmed across multiple independent verified top-level domains.'
  },
  'MOSTLY TRUE': {
    label: 'MOSTLY_TRUE',
    bg: 'bg-teal-950/50',
    text: 'text-teal-300',
    border: 'border-teal-500/60',
    icon: ShieldCheck,
    description: 'Core assertion is supported by empirical records, though minor context nuances exist.'
  },
  'PARTIALLY TRUE': {
    label: 'PARTIALLY_TRUE',
    bg: 'bg-amber-950/50',
    text: 'text-amber-300',
    border: 'border-amber-500/60',
    icon: AlertTriangle,
    description: 'Some parts are accurate, while key details or quantitative figures deviate from reliable evidence.'
  },
  'MISLEADING': {
    label: 'MISLEADING',
    bg: 'bg-orange-950/50',
    text: 'text-orange-400',
    border: 'border-orange-500/60',
    icon: AlertTriangle,
    description: 'Omits vital context or frames accurate elements deceptively to imply an unfounded conclusion.'
  },
  'MIXED': {
    label: 'MIXED_SIGNALS',
    bg: 'bg-amber-950/50',
    text: 'text-amber-400',
    border: 'border-amber-500/60',
    icon: AlertTriangle,
    description: 'Conflicting or partial evidence detected across examined sources; significant qualifiers required.'
  },
  'MOSTLY FALSE': {
    label: 'MOSTLY_FALSE',
    bg: 'bg-orange-950/50',
    text: 'text-orange-400',
    border: 'border-orange-500/60',
    icon: MinusCircle,
    description: 'Contradicted by authoritative evidence; only distorted or context-deficient basis exists.'
  },
  'FALSE': {
    label: 'REFUTED_FALSE',
    bg: 'bg-rose-950/50',
    text: 'text-rose-400',
    border: 'border-rose-500/60',
    icon: XCircle,
    description: 'Empirically disproven and directly contradicted by authoritative primary source records.'
  },
  'UNVERIFIED': {
    label: 'INCONCLUSIVE',
    bg: 'bg-[#21262D]',
    text: 'text-[#8B949E]',
    border: 'border-[#30363D]',
    icon: HelpCircle,
    description: 'Available indexed sources did not meet the multi-domain verification threshold to substantiate or refute.'
  }
};

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  size = 'md',
  showIcon = true
}) => {
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG['UNVERIFIED'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-2 font-semibold',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-bold tracking-wider'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-5 h-5'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-sm`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
