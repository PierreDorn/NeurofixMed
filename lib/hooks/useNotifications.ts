'use client';

import { useCallback, useEffect, useState } from 'react';

type Status = NotificationPermission | 'unsupported';

interface SendOptions {
  body?: string;
  icon?: string;
  tag?: string;
  data?: unknown;
  som?: boolean;
}

let audioCtxCache: AudioContext | null = null;

/**
 * Toca um beep curto via Web Audio API (sem precisar de arquivo MP3).
 * Frequência 880Hz por 280ms com fade-out.
 */
export function playAlertBeep(volume = 0.18) {
  if (typeof window === 'undefined') return;
  try {
    audioCtxCache ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const ctx = audioCtxCache;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t0 = ctx.currentTime;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.linearRampToValueAtTime(volume * 0.85, t0 + 0.1);
    gain.gain.linearRampToValueAtTime(0, t0 + 0.28);

    osc.start(t0);
    osc.stop(t0 + 0.3);
  } catch {
    // silencioso
  }
}

export function useNotifications() {
  const [permission, setPermission] = useState<Status>('default');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) { setPermission('unsupported'); return; }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async (): Promise<Status> => {
    if (!('Notification' in window)) return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const sendNotification = useCallback(async (title: string, opts: SendOptions = {}) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      // Preferir o Service Worker (suporta ações + background)
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration('/sw-notifications.js');
        if (reg) {
          await reg.showNotification(title, {
            body: opts.body,
            icon: opts.icon ?? '/neurofix-logo.png',
            badge: opts.icon ?? '/neurofix-logo.png',
            tag: opts.tag,
            data: opts.data,
          });
        } else {
          new Notification(title, { body: opts.body, icon: opts.icon ?? '/neurofix-logo.png', tag: opts.tag });
        }
      } else {
        new Notification(title, { body: opts.body, icon: opts.icon ?? '/neurofix-logo.png', tag: opts.tag });
      }
    } catch {
      // fallback: nada
    }

    if (opts.som !== false) playAlertBeep();
  }, []);

  return { permission, requestPermission, sendNotification, playSound: playAlertBeep };
}
