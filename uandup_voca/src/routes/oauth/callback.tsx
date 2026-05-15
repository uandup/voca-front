import { createFileRoute } from '@tanstack/react-router';
import OAuthCallbackPage from '@/pages/common/oauth/OAuthCallbackPage';

export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallbackPage,
});
