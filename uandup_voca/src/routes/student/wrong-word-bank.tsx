import { createFileRoute } from '@tanstack/react-router';
import { WrongWordBankPage } from '@/pages/student/wrong-word-bank/ui/WrongWordBankPage';

export const Route = createFileRoute('/student/wrong-word-bank')({
  component: WrongWordBankPage,
});
