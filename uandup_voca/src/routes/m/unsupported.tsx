import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/m/unsupported')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/unsupported/MobileUnsupportedPage'),
    'MobileUnsupportedPage',
  ),
});
