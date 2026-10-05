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
    label: 'TRUE',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    description: 'The claim is supported by reliable, authoritative empirical consensus from multiple independent sources.'
  },
  'MOSTLY TRUE': {
    label: 'MOSTLY TRUE',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    icon: ShieldCheck,
    description: 'The primary assertion is accurate, though minor nuances, qualifiers, or caveats exist.'
  },
  'MIXED': {
    label: 'MIXED',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: AlertTriangle,
    description: 'The claim contains both factual elements and conflicting assertions or significant missing context.'
  },
  'MOSTLY FALSE': {
    label: 'MOSTLY FALSE',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: MinusCircle,
    description: 'The assertion contains significant inaccuracies with minimal or distorted supporting basis.'
  },
  'FALSE': {
    label: 'FALSE',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: XCircle,
    description: 'The claim is directly contradicted by reliable, peer-reviewed scientific or verified archival evidence.'
  },
  'UNVERIFIED': {
    label: 'UNVERIFIED',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-300',
    icon: HelpCircle,
    description: 'No reliable, authoritative independent evidence could be retrieved to substantiate or refute this assertion.'
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
    lg: 'text-sm sm:text-base px-4 py-1.5 gap-2.5 font-bold tracking-tight'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-5 h-5'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
