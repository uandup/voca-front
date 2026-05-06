import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { registerProfile } from '@/entities/auth';
import type { buildProfileBody } from '../api/utils';

type ProfileBody = ReturnType<typeof buildProfileBody>;

export function useRegist() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (body: ProfileBody) => {
    setIsSubmitting(true);
    try {
      const { data } = await registerProfile(body);
      localStorage.setItem('accessToken', data.accessToken ?? '');
      navigate({ to: '/pending' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submit };
}
