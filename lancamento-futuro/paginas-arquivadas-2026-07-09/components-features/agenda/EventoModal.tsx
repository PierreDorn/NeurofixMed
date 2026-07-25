'use client';

import { useState, useEffect } from 'react';
import {
  createEvent, updateEvent, deleteEvent,
  toggleEventConcluido, concluirRevisaoComDesempenho,
  type EventoInput,
} from '@/app/(app)/agenda/actions';

export interface EventoExistente {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  dia_todo: boolean;
  tipo: string;
  cor: string;
  local: string | null;
  origem?: string;
  referencia_id?: string | null;
  referencia_tipo?: string | null;
  concluido?: boolean;
}

interface Props {
  open: boolean;
  initialDate?: Date;
  editing?: EventoExistente | null;
  onClose: () => void;
  onSaved: () => void;
}

const TIPOS = [
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'estudo',  label: 'Estudo' },
  { value: 'revisao', label: 'Revisão' },
  { value: 'aula',    label: 'Aula' },
  { value: 'prova',   label: 'Prova' },
  { value: 'outro',   label: 'Outro' },
];

const CORES = ['#C9A84C', '#4AB3FF', '#4ADE80', '#A78BFA', '#ef4444', '#f59e0b'];

const REMINDER_OPTS = [
  { min: 0,    label: 'No horário' },
  { min: 5,    label: '5 min antes' },
  { min: 10,   label: '10 min antes' },
  { min: 15,   label: '15 min antes' },
  { min: 30,   label: '30 min antes' },
  { min: 60,   label: '1 hora antes' },
  { min: 1440, label: '1 dia antes' },
];

const FREQ_OPTS = [
  { value: '',              label: 'Não se repete' },
  { value: 'diario',        label: 'Todo dia' },
  { value: 'semanal',       label: 'Toda semana' },
  { value: 'mensal',        label: 'Todo mês' },
  { value: 'anual',         label: 'Todo ano' },
  { value: 'personalizado', label: 'Personalizado…' },
];

const DIAS_SEMANA = [
  { key: 'seg', label: 'Seg' },
  { key: 'ter', label: 'Ter' },
  { key: 'qua', label: 'Qua' },
  { key: 'qui', label: 'Qui' },
  { key: 'sex', label: 'Sex' },
  { key: 'sab', label: 'Sáb' },
  { key: 'dom', label: 'Dom' },
];

function toDateInput(iso: string): string { return iso.slice(0, 10); }
function toTimeInput(iso: string): string { return iso.slice(11, 16); }
function joinDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export default function EventoModal({ open, initialDate, editing, onClose, onSaved }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('10:00');
  const [diaTodo, setDiaTodo] = useState(false);
  const [tipo, setTipo] = useState<string>('pessoal');
  const [cor, setCor] = useState(CORES[0]);
  const [local, setLocal] = useState('');
  const [reminders, setReminders] = useState<number[]>([15]);
  const [freq, setFreq] = useState('');
  const [recIntervalo, setRecIntervalo] = useState(1);
  const [recDias, setRecDias] = useState<string[]>([]);
  const [recFim, setRecFim] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setTitulo(editing.titulo);
      setDescricao(editing.descricao ?? '');
      setDataInicio(toDateInput(editing.data_inicio));
      setHoraInicio(toTimeInput(editing.data_inicio));
      if (editing.data_fim) {
        setDataFim(toDateInput(editing.data_fim));
        setHoraFim(toTimeInput(editing.data_fim));
      } else {
        setDataFim(toDateInput(editing.data_inicio));
        setHoraFim(toTimeInput(editing.data_inicio));
      }
      setDiaTodo(editing.dia_todo);
      setTipo(editing.tipo);
      setCor(editing.cor);
      setLocal(editing.local ?? '');
      setReminders([15]);
      setFreq('');
      setRecIntervalo(1);
      setRecDias([]);
      setRecFim('');
    } else {
      const d = initialDate ?? new Date();
      const iso = d.toISOString();
      setTitulo('');
      setDescricao('');
      setDataInicio(iso.slice(0, 10));
      setHoraInicio('09:00');
      setDataFim(iso.slice(0, 10));
      setHoraFim('10:00');
      setDiaTodo(false);
      setTipo('pessoal');
      setCor(CORES[0]);
      setLocal('');
      setReminders([15]);
      setFreq('');
      setRecIntervalo(1);
      setRecDias([]);
      setRecFim('');
    }
    setError(null);
  }, [open, editing, initialDate]);

  if (!open) return null;

  async function handleSave() {
    setError(null);
    if (!titulo.trim()) { setError('Título é obrigatório'); return; }

    const data_inicio = diaTodo
      ? joinDateTime(dataInicio, '00:00')
      : joinDateTime(dataInicio, horaInicio);
    const data_fim = diaTodo
      ? joinDateTime(dataFim || dataInicio, '23:59')
      : joinDateTime(dataFim || dataInicio, horaFim);

    if (new Date(data_fim) < new Date(data_inicio)) {
      setError('Data de término deve ser depois do início');
      return;
    }

    if (freq === 'personalizado' && recDias.length === 0) {
      setError('Escolha pelo menos um dia da semana para repetir');
      return;
    }

    setSaving(true);
    const payload: EventoInput = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      data_inicio,
      data_fim,
      dia_todo: diaTodo,
      tipo: tipo as EventoInput['tipo'],
      cor,
      local: local.trim() || null,
      reminders,
      recurrence: freq ? {
        frequencia: freq as 'diario'|'semanal'|'mensal'|'anual'|'personalizado',
        intervalo: Math.max(1, recIntervalo),
        dias_semana: freq === 'personalizado' && recDias.length > 0 ? recDias : undefined,
        data_fim_recorrencia: recFim || null,
      } : null,
    };

    const res = editing
      ? await updateEvent(editing.id, payload)
      : await createEvent(payload);

    setSaving(false);
    if (!res.ok) { setError(res.error ?? 'Erro ao salvar'); return; }
    onSaved();
    onClose();
  }

  async function confirmDeleteNow() {
    if (!editing) return;
    setSaving(true);
    const res = await deleteEvent(editing.id);
    setSaving(false);
    setConfirmDelete(false);
    if (!res.ok) { setError(res.error ?? 'Erro ao excluir'); return; }
    onSaved();
    onClose();
  }

  /** Marca evento normal como concluído (sem desempenho). */
  async function handleConcluir() {
    if (!editing) return;
    setSaving(true);
    const res = await toggleEventConcluido(editing.id, true);
    setSaving(false);
    if (!res.ok) { setError(res.error ?? 'Erro ao concluir'); return; }
    onSaved();
    onClose();
  }

  /** Reabre um evento previamente concluído. */
  async function handleReabrir() {
    if (!editing) return;
    setSaving(true);
    const res = await toggleEventConcluido(editing.id, false);
    setSaving(false);
    if (!res.ok) { setError(res.error ?? 'Erro ao reabrir'); return; }
    onSaved();
    onClose();
  }

  /**
   * Conclui revisão automática aplicando desempenho.
   * Dispara o algoritmo adaptativo (errei/dificil/facil) no backend.
   */
  async function handleDesempenho(desempenho: 'errei' | 'dificil' | 'facil') {
    if (!editing) return;
    setSaving(true);
    const res = await concluirRevisaoComDesempenho(editing.id, desempenho);
    setSaving(false);
    if (!res.ok) { setError(res.error ?? 'Erro ao registrar desempenho'); return; }
    onSaved();
    onClose();
  }

  function toggleReminder(min: number) {
    setReminders(prev => prev.includes(min) ? prev.filter(m => m !== min) : [...prev, min].sort((a, b) => a - b));
  }

  const isRevisaoAuto = !!editing && editing.origem === 'revisao_automatica';
  const isConcluido = !!editing?.concluido;

  return (
    <div className="evt-overlay" onClick={() => !saving && onClose()}>
      <div className="evt-modal" onClick={e => e.stopPropagation()}>
        <div className="evt-modal-h">
          <div>
            <div className="evt-modal-kicker">{editing ? 'Editar evento' : 'Novo evento'}</div>
            <h2>{editing ? editing.titulo : 'Crie um compromisso ou rotina'}</h2>
          </div>
          <button type="button" className="evt-close" onClick={onClose} disabled={saving}>×</button>
        </div>

        <div className="evt-modal-body">
          <div className="evt-field">
            <label>Título *</label>
            <input
              className="evt-inp"
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Estudar Cardiologia"
              autoFocus
            />
          </div>

          <div className="evt-field">
            <label>Descrição</label>
            <textarea
              className="evt-inp"
              rows={2}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Detalhes do evento (opcional)"
            />
          </div>

          <div className="evt-toggle-row">
            <label>Dia todo</label>
            <button
              type="button"
              className={`evt-toggle${diaTodo ? ' on' : ''}`}
              onClick={() => setDiaTodo(!diaTodo)}
              aria-pressed={diaTodo}
            >
              <span className="evt-toggle-dot" />
            </button>
          </div>

          <div className="evt-grid2">
            <div className="evt-field">
              <label>Início</label>
              <input className="evt-inp" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
              {!diaTodo && (
                <input className="evt-inp" type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} style={{ marginTop: 6 }} />
              )}
            </div>
            <div className="evt-field">
              <label>Término</label>
              <input className="evt-inp" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
              {!diaTodo && (
                <input className="evt-inp" type="time" value={horaFim} onChange={e => setHoraFim(e.target.value)} style={{ marginTop: 6 }} />
              )}
            </div>
          </div>

          <div className="evt-grid2">
            <div className="evt-field">
              <label>Tipo</label>
              <select className="evt-inp" value={tipo} onChange={e => setTipo(e.target.value)}>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="evt-field">
              <label>Cor</label>
              <div className="evt-cor-row">
                {CORES.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`evt-cor${cor === c ? ' on' : ''}`}
                    style={{ background: c }}
                    onClick={() => setCor(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="evt-field">
            <label>Local</label>
            <input className="evt-inp" type="text" value={local} onChange={e => setLocal(e.target.value)} placeholder="Ex: Biblioteca da faculdade" />
          </div>

          <div className="evt-field">
            <label>Repetição</label>
            <select className="evt-inp" value={freq} onChange={e => setFreq(e.target.value)}>
              {FREQ_OPTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>

            {freq && (
              <div className="evt-rec-box">
                <div className="evt-rec-row">
                  <span>A cada</span>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={recIntervalo}
                    onChange={e => setRecIntervalo(parseInt(e.target.value) || 1)}
                    className="evt-inp evt-rec-num"
                  />
                  <span>
                    {freq === 'diario' && (recIntervalo === 1 ? 'dia' : 'dias')}
                    {freq === 'semanal' && (recIntervalo === 1 ? 'semana' : 'semanas')}
                    {freq === 'mensal' && (recIntervalo === 1 ? 'mês' : 'meses')}
                    {freq === 'anual' && (recIntervalo === 1 ? 'ano' : 'anos')}
                    {freq === 'personalizado' && (recIntervalo === 1 ? 'semana' : 'semanas')}
                  </span>
                </div>

                {freq === 'personalizado' && (
                  <div className="evt-rec-dias">
                    {DIAS_SEMANA.map(d => {
                      const ativo = recDias.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          type="button"
                          className={`evt-rec-dia${ativo ? ' on' : ''}`}
                          onClick={() => setRecDias(prev => ativo ? prev.filter(k => k !== d.key) : [...prev, d.key])}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="evt-rec-row">
                  <span>Termina em</span>
                  <input
                    type="date"
                    value={recFim}
                    onChange={e => setRecFim(e.target.value)}
                    className="evt-inp"
                    style={{ flex: 1 }}
                  />
                  {recFim && (
                    <button type="button" className="evt-rec-clear" onClick={() => setRecFim('')}>limpar</button>
                  )}
                </div>
                <small className="evt-rec-hint">Deixe em branco para repetir indefinidamente.</small>
              </div>
            )}
          </div>

          <div className="evt-field">
            <label>Alarmes / lembretes</label>
            <div className="evt-rem-row">
              {REMINDER_OPTS.map(r => (
                <button
                  key={r.min}
                  type="button"
                  className={`evt-rem${reminders.includes(r.min) ? ' on' : ''}`}
                  onClick={() => toggleReminder(r.min)}
                >
                  🔔 {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="evt-error">⚠️ {error}</div>}
        </div>

        {/* Bloco de desempenho SRS — só para revisão automática pendente */}
        {editing && isRevisaoAuto && !isConcluido && (
          <div className="evt-srs-box">
            <div className="evt-srs-h">
              🧠 Como foi essa revisão?
              <span>Seu feedback alimenta o motor adaptativo (curva do esquecimento).</span>
            </div>
            <div className="evt-srs-btns">
              <button
                type="button"
                className="evt-srs-btn errei"
                onClick={() => handleDesempenho('errei')}
                disabled={saving}
                title="Reforço extra em 50% do intervalo"
              >
                ❌ <strong>Errei</strong><small>+ revisão em ~30 min</small>
              </button>
              <button
                type="button"
                className="evt-srs-btn dificil"
                onClick={() => handleDesempenho('dificil')}
                disabled={saving}
                title="Mantém intervalo padrão"
              >
                ⏰ <strong>Difícil</strong><small>mantém ritmo</small>
              </button>
              <button
                type="button"
                className="evt-srs-btn facil"
                onClick={() => handleDesempenho('facil')}
                disabled={saving}
                title="Próxima revisão 1.5× maior — 3× fácil arquiva"
              >
                ✅ <strong>Fácil</strong><small>espalha 1.5×</small>
              </button>
            </div>
          </div>
        )}

        {/* Badge para revisão concluída */}
        {editing && isRevisaoAuto && isConcluido && (
          <div className="evt-srs-done">
            ✅ Revisão concluída. Continue assim!
          </div>
        )}

        <div className="evt-modal-footer">
          {editing && (
            <button type="button" className="evt-btn danger" onClick={() => setConfirmDelete(true)} disabled={saving}>
              🗑 Excluir
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button type="button" className="evt-btn ghost" onClick={onClose} disabled={saving}>Cancelar</button>

          {/* Botão "Concluir / Reabrir" só para eventos não-revisão */}
          {editing && !isRevisaoAuto && !isConcluido && (
            <button type="button" className="evt-btn success" onClick={handleConcluir} disabled={saving}>
              ✓ Marcar concluído
            </button>
          )}
          {editing && !isRevisaoAuto && isConcluido && (
            <button type="button" className="evt-btn ghost" onClick={handleReabrir} disabled={saving}>
              ↶ Reabrir
            </button>
          )}

          <button type="button" className="evt-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando…' : (editing ? 'Salvar alterações' : 'Criar evento')}
          </button>
        </div>

        {confirmDelete && editing && (
          <div className="evt-confirm-overlay" onClick={() => !saving && setConfirmDelete(false)}>
            <div className="evt-confirm-box" onClick={e => e.stopPropagation()}>
              <div className="evt-confirm-ic">🗑</div>
              <h3>Excluir evento?</h3>
              <p>Tem certeza que quer excluir <strong>“{editing.titulo}”</strong>? Essa ação não pode ser desfeita.</p>
              <div className="evt-confirm-actions">
                <button type="button" className="evt-btn ghost" onClick={() => setConfirmDelete(false)} disabled={saving}>Cancelar</button>
                <button type="button" className="evt-btn danger" onClick={confirmDeleteNow} disabled={saving}>
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
