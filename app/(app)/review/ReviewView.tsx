'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import { postponeReviewSchedule } from './actions';
import ReviewCreateModal, { type ExistingReview } from './ReviewCreateModal';

type ReviewRow = {
  id: string;
  note_slug: string;
  note_title: string;
  subject_label: string | null;
  area_label: string | null;
  scheduled_at: string;
  end_at: string | null;
  all_day: boolean | null;
  description: string | null;
  color: string | null;
  location: string | null;
  reminders: number[] | null;
};

type NoteOption = {
  slug: string;
  title: string;
  subject_id: string | null;
  breadcrumb: string | null;
};

type Prefill = {
  note_slug: string;
  note_title: string;
  subject_label: string;
  area_label: string;
} | null;

type Props = {
  reviews: ReviewRow[];
  notes: NoteOption[];
  prefill: Prefill;
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const MESES_CURT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];
const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function timeLabel(iso: string, all_day: boolean | null): string {
  if (all_day) return 'Dia todo';
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function subtitleFor(row: ReviewRow, selectedDay: Date): string {
  const subj = row.subject_label ?? '';
  const d = new Date(row.scheduled_at);
  let when: string;
  if (isSameDay(d, startOfToday())) when = 'para hoje';
  else if (isSameDay(d, selectedDay)) when = `para ${d.getDate()} de ${MESES_CURT[d.getMonth()]}`;
  else when = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return [subj, when].filter(Boolean).join(' · ');
}

function metaFor(row: ReviewRow): string {
  const bits: string[] = [];
  if (row.area_label) bits.push(row.area_label);
  bits.push(timeLabel(row.scheduled_at, row.all_day));
  return bits.join(' · ');
}

export default function ReviewView({ reviews, notes, prefill }: Props) {
  const router = useRouter();
  const [pending, startTx] = useTransition();
  const [modalOpen, setModalOpen] = useState<boolean>(!!prefill);
  const [editing, setEditing] = useState<ExistingReview | null>(null);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);

  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const [calMonth, setCalMonth] = useState<{ y: number; m: number }>(() => {
    return { y: today.getFullYear(), m: today.getMonth() };
  });

  // Índice: dayKey → revisões daquele dia (abertas)
  const byDay = useMemo(() => {
    const map = new Map<string, ReviewRow[]>();
    for (const r of reviews) {
      const d = new Date(r.scheduled_at);
      const key = dayKey(d);
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    }
    return map;
  }, [reviews]);

  const selectedList = byDay.get(dayKey(selectedDay)) ?? [];
  const upcomingList = useMemo(() => {
    return reviews
      .filter((r) => {
        const d = new Date(r.scheduled_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime() > today.getTime();
      })
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  }, [reviews, today]);

  // Build calendar cells 6×7
  const cells = useMemo(() => {
    const first = new Date(calMonth.y, calMonth.m, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(calMonth.y, calMonth.m + 1, 0).getDate();
    const out: Array<{ date: Date; inMonth: boolean }> = [];
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(calMonth.y, calMonth.m, i - startWeekday + 1);
      out.push({ date: d, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ date: new Date(calMonth.y, calMonth.m, d), inMonth: true });
    }
    while (out.length < 42) {
      const last = out[out.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      out.push({ date: next, inMonth: false });
    }
    return out;
  }, [calMonth]);

  const selectedIsToday = isSameDay(selectedDay, today);
  const leftTitle = selectedIsToday
    ? 'Para revisar agora'
    : `Revisões de ${selectedDay.getDate()} de ${MESES_CURT[selectedDay.getMonth()]}`;
  const leftDateBadge = `${selectedDay.getDate()} de ${MESES_CURT[selectedDay.getMonth()]}`;

  function openNew(date?: Date) {
    setEditing(null);
    setInitialDate(date);
    setModalOpen(true);
  }
  function openEdit(row: ReviewRow) {
    setEditing({
      id: row.id,
      note_slug: row.note_slug,
      note_title: row.note_title,
      subject_label: row.subject_label,
      area_label: row.area_label,
      scheduled_at: row.scheduled_at,
      end_at: row.end_at,
      all_day: row.all_day ?? false,
      description: row.description,
      color: row.color,
      location: row.location,
      reminders: row.reminders,
    });
    setInitialDate(undefined);
    setModalOpen(true);
  }

  return (
    <Shell breadcrumb="Revisões">
      <section className="page active" id="page-review">
        {/* Hero preto */}
        <section
          className="card"
          style={{
            background: 'linear-gradient(135deg,#11151c,#172235)',
            color: '#fff',
            padding: '26px 30px',
            borderRadius: 20,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ color: '#e8cf8b', letterSpacing: '.14em', fontWeight: 900, fontSize: 11 }}>
              CONSOLIDAÇÃO NO MOMENTO CERTO
            </div>
            <h1 style={{ font: '500 36px Georgia,serif', margin: '6px 0 8px', color: '#fff' }}>
              Revisões
            </h1>
            <p style={{ color: '#c7d0dc', margin: 0, maxWidth: 620, lineHeight: 1.55 }}>
              A NeuroFix agenda a primeira revisão ao concluir a aula e ajusta as próximas datas
              conforme seu desempenho. Você também pode agendar uma revisão quando precisar.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{reviews.length}</div>
            <div style={{ fontSize: 12, color: '#c7d0dc', marginBottom: 12 }}>
              revisões pendentes
            </div>
            <button
              type="button"
              onClick={() => openNew()}
              style={{
                background: 'linear-gradient(135deg,#F3DF9B,#D4A853)',
                color: '#5A3F0A',
                border: 'none',
                borderRadius: 10,
                padding: '10px 16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(212,168,83,.35)',
              }}
            >
              + Agendar revisão
            </button>
          </div>
        </section>

        {/* 3 colunas: [ESQUERDA] Para revisar (dia selecionado) | [CENTRO] Calendário | [DIREITA] Próximas */}
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,340px) minmax(0,1fr)',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {/* ESQUERDA: revisões do dia selecionado */}
          <section className="card" style={{ padding: '18px 20px', borderRadius: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ font: '600 18px Georgia,serif', margin: 0 }}>{leftTitle}</h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: selectedIsToday ? '#0A0A0A' : '#FBF4E3',
                    color: selectedIsToday ? '#fff' : '#7a4f0c',
                    border: selectedIsToday ? '1px solid #0A0A0A' : '1px solid #E1C77F',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                  title="Dia selecionado no calendário"
                >
                  📅 {leftDateBadge}
                </span>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{selectedList.length}</span>
            </div>
            {selectedList.length === 0 ? (
              <p
                style={{
                  color: 'var(--muted)',
                  marginTop: 16,
                  fontSize: 14,
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                {selectedIsToday
                  ? 'Nada agendado para hoje. Você pode agendar uma nova revisão acima.'
                  : `Nenhuma revisão para ${leftDateBadge}. Clique em outro dia no calendário ou agende uma nova.`}
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                {selectedList.map((r) => (
                  <ReviewCard
                    key={r.id}
                    row={r}
                    pending={pending}
                    selectedDay={selectedDay}
                    onRevisar={() => router.push(`/notes/${r.note_slug}/start`)}
                    onAdiar={() =>
                      startTx(async () => {
                        await postponeReviewSchedule(r.id, 1);
                        router.refresh();
                      })
                    }
                    onEditar={() => openEdit(r)}
                  />
                ))}
              </ul>
            )}
          </section>

          {/* CENTRO: Calendário */}
          <section className="card" style={{ padding: '18px 18px', borderRadius: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const m = calMonth.m - 1;
                  if (m < 0) setCalMonth({ y: calMonth.y - 1, m: 11 });
                  else setCalMonth({ y: calMonth.y, m });
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #e5e0d7',
                  borderRadius: 8,
                  padding: '4px 8px',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
                aria-label="Mês anterior"
              >
                ‹
              </button>
              <div style={{ fontWeight: 800, fontSize: 14 }}>
                {MESES[calMonth.m]} {calMonth.y}
              </div>
              <button
                type="button"
                onClick={() => {
                  const m = calMonth.m + 1;
                  if (m > 11) setCalMonth({ y: calMonth.y + 1, m: 0 });
                  else setCalMonth({ y: calMonth.y, m });
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #e5e0d7',
                  borderRadius: 8,
                  padding: '4px 8px',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
                aria-label="Próximo mês"
              >
                ›
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {DIAS.map((d, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--muted)',
                    padding: 4,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map(({ date, inMonth }) => {
                const k = dayKey(date);
                const has = byDay.has(k);
                const isToday = isSameDay(date, today);
                const isSelected = isSameDay(date, selectedDay);
                return (
                  <button
                    key={k + (inMonth ? '' : '-out')}
                    type="button"
                    onClick={() => setSelectedDay(new Date(date))}
                    onDoubleClick={() => openNew(date)}
                    title={
                      has
                        ? `${byDay.get(k)?.length} revisão(ões) — clique para ver. Duplo clique agenda nova.`
                        : 'Clique pra selecionar; duplo clique agenda nova revisão.'
                    }
                    style={{
                      textAlign: 'center',
                      padding: '6px 0 4px',
                      borderRadius: 8,
                      fontSize: 13,
                      color: !inMonth ? '#c0bcaf' : isToday ? '#fff' : isSelected ? '#7a4f0c' : '#333',
                      background: isToday
                        ? '#0A0A0A'
                        : isSelected
                          ? '#FBF4E3'
                          : has
                            ? 'rgba(201,162,78,.10)'
                            : 'transparent',
                      border: isSelected && !isToday
                        ? '1px solid #C9A24E'
                        : has && !isToday && !isSelected
                          ? '1px solid #EBDBB2'
                          : '1px solid transparent',
                      fontWeight: isToday || has || isSelected ? 800 : 500,
                      cursor: 'pointer',
                      lineHeight: 1.1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {date.getDate()}
                    {has && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 999,
                          margin: '3px auto 0',
                          background: isToday ? '#C9A24E' : '#C9A24E',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 11,
                color: 'var(--muted)',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              Clique num dia pra ver as revisões dele à esquerda. Duplo clique agenda nova.
            </div>
            {!selectedIsToday && (
              <button
                type="button"
                onClick={() => setSelectedDay(today)}
                style={{
                  marginTop: 8,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e0d7',
                  background: '#fff',
                  color: '#333',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Voltar pra hoje
              </button>
            )}
          </section>

          {/* DIREITA: Próximas revisões (futuras) */}
          <section className="card" style={{ padding: '18px 20px', borderRadius: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 10,
              }}
            >
              <h3 style={{ font: '600 18px Georgia,serif', margin: 0 }}>Próximas revisões</h3>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{upcomingList.length}</span>
            </div>
            {upcomingList.length === 0 ? (
              <p
                style={{
                  color: 'var(--muted)',
                  marginTop: 16,
                  fontSize: 14,
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                Ainda não há revisões futuras. Clique em <b>+ Agendar revisão</b> pra criar uma.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                {upcomingList.map((r) => (
                  <ReviewCard
                    key={r.id}
                    row={r}
                    pending={pending}
                    selectedDay={selectedDay}
                    onRevisar={() => router.push(`/notes/${r.note_slug}/start`)}
                    onAdiar={() =>
                      startTx(async () => {
                        await postponeReviewSchedule(r.id, 1);
                        router.refresh();
                      })
                    }
                    onEditar={() => openEdit(r)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>

      <ReviewCreateModal
        open={modalOpen}
        initialDate={initialDate}
        editing={editing}
        notes={notes}
        prefill={editing ? null : prefill}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          if (prefill) router.replace('/review');
        }}
        onSaved={() => router.refresh()}
      />
    </Shell>
  );
}

function ReviewCard({
  row,
  pending,
  selectedDay,
  onRevisar,
  onAdiar,
  onEditar,
}: {
  row: ReviewRow;
  pending: boolean;
  selectedDay: Date;
  onRevisar: () => void;
  onAdiar: () => void;
  onEditar: () => void;
}) {
  const accent = row.color ?? '#286ED8';
  return (
    <li
      onClick={onEditar}
      style={{
        border: '1px solid #e5e0d7',
        borderLeft: `4px solid ${accent}`,
        borderRadius: 12,
        padding: '12px 14px',
        background: '#fff',
        display: 'grid',
        gap: 8,
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>{row.note_title}</div>
        <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 2 }}>
          {subtitleFor(row, selectedDay)}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{metaFor(row)}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onRevisar}
          style={{
            padding: '7px 12px',
            fontSize: 12,
            borderRadius: 8,
            border: 'none',
            background: '#0A0A0A',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Revisar agora
        </button>
        <button
          type="button"
          onClick={onAdiar}
          disabled={pending}
          style={{
            padding: '7px 12px',
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid #e5e0d7',
            background: '#fff',
            color: '#0F172A',
            fontWeight: 700,
            cursor: pending ? 'wait' : 'pointer',
          }}
        >
          Adiar 1 dia
        </button>
      </div>
    </li>
  );
}
