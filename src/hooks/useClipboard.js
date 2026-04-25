import { useState, useCallback } from 'react';

export function useClipboard() {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = useCallback(async (text, id) => {
    try {
      // Primary method: Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        return true;
      }
      throw new Error('Clipboard API not available');
    } catch (err) {
      // Fallback: textarea + execCommand
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (success) {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
          return true;
        }
        return false;
      } catch (fallbackErr) {
        console.error('Copy fallback failed:', fallbackErr);
        return false;
      }
    }
  }, []);

  return { copiedId, copyToClipboard };
}
