'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LayoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/layout/dashboard'); 
  }, []);

  return null;
}
