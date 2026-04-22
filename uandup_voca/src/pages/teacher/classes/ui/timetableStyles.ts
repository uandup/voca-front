export const cellCardStyles: Record<string, { card: string; text: string }> = {
  'class-active': {
    card: 'bg-primary-container/10 hover:bg-primary-container/20',
    text: 'text-primary font-headline font-bold text-sm',
  },
  'class-essay': {
    card: 'bg-surface-container-highest hover:bg-surface-container-high',
    text: 'text-on-surface font-headline font-bold text-sm',
  },
  'class-sat': {
    card: 'bg-surface-container-highest hover:bg-surface-container-high',
    text: 'text-on-surface font-headline font-extrabold text-sm tracking-widest',
  },
  'class-lit': {
    card: 'bg-tertiary-fixed/40 hover:bg-tertiary-fixed/60',
    text: 'text-tertiary font-headline font-bold text-sm',
  },
  'class-sl': {
    card: 'bg-primary-container/10 hover:bg-primary-container/20',
    text: 'text-primary font-headline font-bold text-sm',
  },
  'class-qa': {
    card: 'bg-secondary-container/30 hover:bg-secondary-container/50',
    text: 'text-on-secondary-fixed-variant font-headline font-bold text-sm',
  },
  empty: { card: '', text: '' },
};
