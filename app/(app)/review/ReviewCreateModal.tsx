'use client';

import { useEffect, useMemo, useState } from 'react';
import { createReviewSchedule, updateReviewSchedule, deleteReviewSchedule } from './actions';

type NoteOption = {
  slug: string;
  title: string;
  subject_id: string | null;
  breadcrumb: string | null;
};

export type ExistingReview = {
  id: string;
  note_slug: string;
  note_title: string;
  subject_label: string | null;
  area_label: string | null;
  scheduled_at: string;
  end_at?: string | null;
  all_day?: boolean;
  description?: string | null;
  color?: string | null;
  location?: string | null;
  reminders?: number[] | null;
};

type Prefill = {
  note_slug: string;
  note_title: string;
  subject_label: string;
  area_label: string;
} | null;

type Props = {
  open: boolean;
  initialDate?: Date;
  editing?: ExistingReview | null;
  notes: NoteOption[];
  prefill?: Prefill;
  onClose: () => void;
  onSaved: () => void;
};

const CORES = ['#C9A24E', '#286ED8', '#0A0A0A', '#2D8A63', '#B94A48', '#7B61C9'];

const REMINDER_OPTS = [
  { min: 0, label: 'No horário' },
  { min: 10, label: '10 min antes' },
  { min: 30, label: '30 min antes' },
  { min: 60, label: '1 hora antes' },
  { min: 1440, label: '1 dia antes' },
];

const TIPOS = [
  { value: 'revisao', label: 'Revisão' },
  { value: 'estudo', label: 'Estudo' },
  { value: 'prova', label: 'Prova' },
];

function toDateInput(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
function toTimeInput(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function joinDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

function nowDate(): Date {
  return new Date();
}

function tomorrowDate(base?: Date): Date {
  const d = base ? new Date(base) : nowDate();
  d.setDate(d.getDate() + 1);
  return d;
}

export default function ReviewCreateModal({
  open,
  initialDate,
  editing,
  notes,
  prefill,
  onClose,
  onSaved,
}: Props) {
  const [slug, setSlug] = useState<string>('');
  const [titulo, setTitulo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [horaInicio, setHoraInicio] = useState<string>('09:00');
  const [dataFim, setDataFim] = useState<string>('');
  const [horaFim, setHoraFim] = useState<string>('10:00');
  const [diaTodo, setDiaTodo] = useState<boolean>(false);
  const [tipo, setTipo] = useState<string>('revisao');
  const [cor, setCor] = useState<string>(CORES[0]);
  const [local, setLocal] = useState<string>('');
  const [reminders, setReminders] = useState<number[]>([15]);
  const [subject, setSubject] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const selectedNote = useMemo(() => notes.find((n) => n.slug === slug), [notes, slug]);

  useEffect(() => {
    if (!open) return;

    if (editing) {
      setSlug(editing.note_slug);
      setTitulo(editing.note_title);
      setDescricao(editing.description ?? '');
      setDataInicio(toDateInput(editing.scheduled_at));
      setHoraInicio(toTimeInput(editing.scheduled_at));
      const end = editing.end_at
        ? editing.end_at
        : new Date(new Date(editing.scheduled_at).getTime() + 60 * 60 * 1000).toISOString();
      setDataFim(toDateInput(end));
      setHoraFim(toTimeInput(end));
      setDiaTodo(!!editing.all_day);
      setTipo('revisao');
      setCor(editing.color ?? CORES[0]);
      setLocal(editing.location ?? '');
      setReminders(editing.reminders ?? []);
      setSubject(editing.subject_label ?? '');
      setArea(editing.area_label ?? '');
    } else {
      const base = initialDate ?? tomorrowDate();
      const end = new Date(base.getTime() + 60 * 60 * 1000);
      setSlug(prefill?.note_slug ?? '');
      setTitulo(prefill?.note_title ?? '');
      setDescricao('');
      setDataInicio(toDateInput(base.toISOString()));
      setHoraInicio(toTimeInput(base.toISOString()));
      setDataFim(toDateInput(end.toISOString()));
      setHoraFim(toTimeInput(end.toISOString()));
      setDiaTodo(false);
      setTipo('revisao');
      setCor(CORES[0]);
      setLocal('');
      setReminders([15]);
      setSubject(prefill?.subject_label ?? '');
      setArea(prefill?.area_label ?? '');
    }
    setError(null);
    setConfirmDelete(false);
  }, [open, editing, initialDate, prefill]);

  // Quando muda a aula selecionada, preenche título/matéria/área automaticamente.
  useEffect(() => {
    if (!open) return;
    if (editing) return; // ao editar mantém o que veio do DB
    if (!selectedNote) return;
    setTitulo(selectedNote.title);
    const bc = selectedNote.breadcrumb ?? '';
    if (bc) {
      const parts = bc.split('·').map((s) => s.trim()).filter(Boolean);
      const subj = parts[0] ?? '';
      const areaParts = parts.slice(1).filter((p) => !/^aula\s/i.test(p));
      const ar = areaParts[areaParts.length - 1] ?? '';
      if (subj) setSubject(subj);
      if (ar) setArea(ar);
    }
  }, [selectedNote, editing, open]);

  if (!open) return null;

  const finalTitle = titulo.trim() || selectedNote?.title || '';
  const finalSlug = slug || selectedNote?.slug || '';

  async function handleSave() {
    setError(null);
    if (!finalTitle) {
      setError('Escolha uma aula ou digite um título.');
      return;
    }
    if (!finalSlug) {
      setError('Selecione a aula para vincular a revisão.');
      return;
    }
    const scheduled_at = diaTodo
      ? joinDateTime(dataInicio, '00:00')
      : joinDateTime(dataInicio, horaInicio);
    const end_at = diaTodo
      ? joinDateTime(dataFim || dataInicio, '23:59')
      : joinDateTime(dataFim || dataInicio, horaFim);
    if (new Date(end_at) < new Date(scheduled_at)) {
      setError('O término não pode ser antes do início.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        note_slug: finalSlug,
        note_title: finalTitle,
        subject_label: subject.trim() || null,
        area_label: area.trim() || null,
        scheduled_at,
        description: descricao.trim() || null,
        all_day: diaTodo,
        end_at,
        color: cor,
        location: local.trim() || null,
        reminders,
      };
      if (editing) {
        await updateReviewSchedule(editing.id, payload);
      } else {
        await createReviewSchedule(payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    setSaving(true);
    try {
      await deleteReviewSchedule(editing.id);
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  function toggleReminder(min: number) {
    setReminders((prev) => (prev.includes(min) ? prev.filter((m) => m !== min) : [...prev, min].sort((a, b) => a - b)));
  }

  const overlay: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,.55)',
    zIndex: 100,
    display: 'grid',
    placeItems: 'center',
    padding: 16,
  };
  const modal: React.CSSProperties = {
    background: '#fff',
    color: '#0F172A',
    borderRadius: 16,
    width: '100%',
    maxWidth: 640,
    maxHeight: 'calc(100vh - 32px)',
    overflowY: 'auto',
    boxShadow: '0 24px 60px rgba(0,0,0,.35)',
    border: '1px solid #E8E4DB',
  };
  const inp: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e0d7',
    background: '#fff',
    color: '#0F172A',
    fontSize: 14,
    colorScheme: 'light',
    fontFamily: 'inherit',
    width: '100%',
  };

  return (
    <div style={overlay} onClick={() => !saving && onClose()}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #E8E4DB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ color: '#8a6020', fontSize: 10, letterSpacing: '.14em', fontWeight: 900 }}>
              {editing ? 'EDITAR REVISÃO' : 'NOVA REVISÃO'}
            </div>
            <h2 style={{ font: '600 22px Georgia,serif', margin: '4px 0 0' }}>
              {editing ? editing.note_title : 'Agendar uma revisão'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              color: '#8a94a3',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 0,
              width: 32,
              height: 32,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 22px', display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Aula *</span>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} style={inp}>
              <option value="">— escolha uma aula —</option>
              {notes.map((n) => (
                <option key={n.slug} value={n.slug}>
                  {n.title}
                  {n.breadcrumb ? ` · ${n.breadcrumb}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Título</span>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Revisar etiologia"
              style={inp}
            />
          </label>

          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Descrição</span>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes ou o que quer priorizar nessa revisão (opcional)"
              style={{ ...inp, resize: 'vertical' }}
            />
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Dia todo</label>
            <button
              type="button"
              onClick={() => setDiaTodo((v) => !v)}
              aria-pressed={diaTodo}
              style={{
                width: 40,
                height: 22,
                borderRadius: 999,
                background: diaTodo ? '#0A0A0A' : '#e5e0d7',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: diaTodo ? 20 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: '#fff',
                  transition: '.15s',
                }}
              />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Início</span>
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={inp} />
              {!diaTodo && (
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  style={{ ...inp, marginTop: 6 }}
                />
              )}
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Término</span>
              <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} style={inp} />
              {!diaTodo && (
                <input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  style={{ ...inp, marginTop: 6 }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Tipo</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inp}>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Cor</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', height: 40 }}>
                {CORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCor(c)}
                    aria-label={`Cor ${c}`}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      background: c,
                      border: cor === c ? '3px solid #0A0A0A' : '1px solid #e5e0d7',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#555' }}>Local (opcional)</span>
            <input
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Ex.: Biblioteca da faculdade"
              style={inp}
            />
          </label>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#555', marginBottom: 6 }}>
              Alarmes / lembretes
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {REMINDER_OPTS.map((r) => {
                const on = reminders.includes(r.min);
                return (
                  <button
                    key={r.min}
                    type="button"
                    onClick={() => toggleReminder(r.min)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 999,
                      border: on ? '1px solid #C9A24E' : '1px solid #e5e0d7',
                      background: on ? '#FBF4E3' : '#fff',
                      color: on ? '#7a4f0c' : '#333',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🔔 {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: '#FFF0EF',
                border: '1px solid #f2c9c7',
                color: '#b94a48',
                fontSize: 13,
              }}
            >
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid #E8E4DB',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          {editing && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={saving}
              style={{
                padding: '9px 14px',
                borderRadius: 10,
                background: '#fff',
                border: '1px solid #e5c9c7',
                color: '#b94a48',
                fontWeight: 700,
                fontSize: 13,
                cursor: saving ? 'wait' : 'pointer',
              }}
            >
              🗑 Excluir
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              padding: '9px 14px',
              borderRadius: 10,
              background: '#fff',
              border: '1px solid #e5e0d7',
              color: '#333',
              fontWeight: 700,
              fontSize: 13,
              cursor: saving ? 'wait' : 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              background: '#0A0A0A',
              border: 'none',
              color: '#fff',
              fontWeight: 800,
              fontSize: 13,
              cursor: saving ? 'wait' : 'pointer',
            }}
          >
            {saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar revisão'}
          </button>
        </div>

        {confirmDelete && editing && (
          <div
            onClick={() => !saving && setConfirmDelete(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,.55)',
              display: 'grid',
              placeItems: 'center',
              zIndex: 110,
              padding: 16,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 24,
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 24px 60px rgba(0,0,0,.35)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>🗑</div>
              <h3 style={{ font: '600 20px Georgia,serif', margin: '0 0 6px' }}>Excluir revisão?</h3>
              <p style={{ color: '#555', margin: '0 0 16px', lineHeight: 1.4 }}>
                Tem certeza que quer excluir <b>“{editing.note_title}”</b>? A ação não pode ser desfeita.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={saving}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 10,
                    background: '#fff',
                    border: '1px solid #e5e0d7',
                    color: '#333',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: saving ? 'wait' : 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 10,
                    background: '#b94a48',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: saving ? 'wait' : 'pointer',
                  }}
                >
                  {saving ? 'Excluindo…' : 'Sim, excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
