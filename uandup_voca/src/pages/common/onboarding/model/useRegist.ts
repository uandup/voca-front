import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { registerProfile } from '@/entities/auth';
import type { buildProfileBody } from '../api/utils';

type ProfileBody = ReturnType<typeof buildProfileBody>;

export function useRegist() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: ProfileBody) => registerProfile(body),
    onSuccess: ({ data }) => {
      localStorage.setItem('accessToken', data.accessToken ?? '');
      navigate({ to: '/pending' });
    },
  });
}
