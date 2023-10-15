import { useRouter as useNextRouter } from 'next/navigation';
import NProgress from 'nprogress';

export function useRouter() {
  const router = useNextRouter();
  const { push, refresh, back } = router;

  router.push = (href, options) => {
    NProgress.start();
    push(href, options);
  };

  router.refresh = () => {
    refresh();
  };

  router.back = () => {
    back();
  };

  return router;
}
