import { useState, useCallback } from 'react';

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export function useEmail() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = useCallback(async (payload: EmailPayload): Promise<boolean> => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  return { sendEmail, sending, error };
}