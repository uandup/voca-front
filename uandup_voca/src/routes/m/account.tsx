import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/m/account')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/account/MobileAccountPage'),
    'MobileAccountPage',
  ),
});
