import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/m/library')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/library/MobileLibraryPage'),
    'MobileLibraryPage',
  ),
});
