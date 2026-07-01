/**
 * Expansão de eventos recorrentes.
 *
 * O banco guarda apenas a regra (event_recurrence) e a primeira instância
 * do evento (events.data_inicio). Para renderizar na agenda, geramos
 * instâncias virtuais dentro de uma janela.
 */

export type Frequencia = 'diario' | 'semanal' | 'mensal' | 'anual' | 'personalizado';

export interface RecurrenceRule {
  frequencia: Frequencia;
  intervalo: number;                       // a cada N (default 1)
  dias_semana?: string[] | null;           // ['seg','qua','sex'] (semanal/personalizado)
  data_fim_recorrencia?: string | null;    // 'YYYY-MM-DD'
}

const WEEKDAY_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

function clone(d: Date): Date { return new Date(d.getTime()); }

function dateBetween(d: Date, start: Date, end: Date): boolean {
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

function endLimit(rule: RecurrenceRule, hardCap: Date): Date {
  if (rule.data_fim_recorrencia) {
    const d = new Date(`${rule.data_fim_recorrencia}T23:59:59`);
    return d < hardCap ? d : hardCap;
  }
  return hardCap;
}

/**
 * Gera as datas em que um evento recorrente deve aparecer dentro de [windowStart, windowEnd].
 * Não duplica a primeira instância (essa já existe como linha em events).
 */
export function expandRecurrence(
  firstStart: Date,
  rule: RecurrenceRule,
  windowStart: Date,
  windowEnd: Date,
  maxInstances = 200,
): Date[] {
  const result: Date[] = [];
  const stop = endLimit(rule, windowEnd);
  const intervalo = Math.max(1, rule.intervalo || 1);

  if (rule.frequencia === 'diario') {
    const cursor = clone(firstStart);
    cursor.setDate(cursor.getDate() + intervalo);
    while (cursor <= stop && result.length < maxInstances) {
      if (dateBetween(cursor, windowStart, windowEnd)) result.push(clone(cursor));
      cursor.setDate(cursor.getDate() + intervalo);
    }
    return result;
  }

  if (rule.frequencia === 'semanal') {
    const cursor = clone(firstStart);
    cursor.setDate(cursor.getDate() + 7 * intervalo);
    while (cursor <= stop && result.length < maxInstances) {
      if (dateBetween(cursor, windowStart, windowEnd)) result.push(clone(cursor));
      cursor.setDate(cursor.getDate() + 7 * intervalo);
    }
    return result;
  }

  if (rule.frequencia === 'mensal') {
    const cursor = clone(firstStart);
    cursor.setMonth(cursor.getMonth() + intervalo);
    while (cursor <= stop && result.length < maxInstances) {
      if (dateBetween(cursor, windowStart, windowEnd)) result.push(clone(cursor));
      cursor.setMonth(cursor.getMonth() + intervalo);
    }
    return result;
  }

  if (rule.frequencia === 'anual') {
    const cursor = clone(firstStart);
    cursor.setFullYear(cursor.getFullYear() + intervalo);
    while (cursor <= stop && result.length < maxInstances) {
      if (dateBetween(cursor, windowStart, windowEnd)) result.push(clone(cursor));
      cursor.setFullYear(cursor.getFullYear() + intervalo);
    }
    return result;
  }

  // personalizado: dias_semana específicos + intervalo de N semanas
  if (rule.frequencia === 'personalizado') {
    const dias = (rule.dias_semana ?? []).map(k => WEEKDAY_KEYS.indexOf(k)).filter(i => i >= 0);
    if (dias.length === 0) return result;

    const cursor = clone(firstStart);
    cursor.setDate(cursor.getDate() + 1);
    let semanasContadas = 0;
    let lastWeekStart = startOfWeek(firstStart);

    while (cursor <= stop && result.length < maxInstances) {
      const thisWeek = startOfWeek(cursor);
      if (thisWeek.getTime() !== lastWeekStart.getTime()) {
        const diff = Math.round((thisWeek.getTime() - lastWeekStart.getTime()) / (7 * 86400000));
        semanasContadas += diff;
        lastWeekStart = thisWeek;
      }

      const semanaValida = semanasContadas % intervalo === 0;
      if (semanaValida && dias.includes(cursor.getDay()) && dateBetween(cursor, windowStart, windowEnd)) {
        const inst = clone(cursor);
        inst.setHours(firstStart.getHours(), firstStart.getMinutes(), firstStart.getSeconds(), 0);
        result.push(inst);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }

  return result;
}

function startOfWeek(d: Date): Date {
  const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  n.setDate(n.getDate() - n.getDay());
  return n;
}
