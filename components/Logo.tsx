import { CSSProperties } from 'react';

export function Logo({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 540 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="NeuroFix Med"
      role="img"
    >
      <defs>
        {/* Ouro quente — da esquerda para direita */}
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8A6020" />
          <stop offset="35%"  stopColor="#D4A84B" />
          <stop offset="65%"  stopColor="#F0CE78" />
          <stop offset="100%" stopColor="#C9A455" />
        </linearGradient>
        {/* Azul-aço — da esquerda para direita */}
        <linearGradient id="logoSteel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#4A7DA8" />
          <stop offset="60%"  stopColor="#7BBAD9" />
          <stop offset="100%" stopColor="#A8D4EE" />
        </linearGradient>
        {/* Ouro para o monograma NF */}
        <linearGradient id="monoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8A6020" />
          <stop offset="40%"  stopColor="#D4A84B" />
          <stop offset="70%"  stopColor="#F0CE78" />
          <stop offset="100%" stopColor="#C9A455" />
        </linearGradient>
        {/* Ouro para as linhas horizontais */}
        <linearGradient id="lineGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8A6020" />
          <stop offset="100%" stopColor="#C9A455" />
        </linearGradient>
      </defs>

      {/* ══ MONOGRAMA NF — traços finos geométricos ══ */}
      {/* N — vertical esquerdo */}
      <line x1="8"  y1="12" x2="8"  y2="84"
            stroke="url(#monoGold)" strokeWidth="2" strokeLinecap="butt" />
      {/* N — diagonal */}
      <line x1="8"  y1="12" x2="52" y2="84"
            stroke="url(#monoGold)" strokeWidth="2" strokeLinecap="butt" />
      {/* N/F — vertical direito compartilhado */}
      <line x1="52" y1="12" x2="52" y2="84"
            stroke="url(#monoGold)" strokeWidth="2" strokeLinecap="butt" />
      {/* F — horizontal superior */}
      <line x1="52" y1="12" x2="82" y2="12"
            stroke="url(#monoGold)" strokeWidth="2" strokeLinecap="butt" />
      {/* F — horizontal do meio */}
      <line x1="52" y1="46" x2="70" y2="46"
            stroke="url(#monoGold)" strokeWidth="2" strokeLinecap="butt" />

      {/* ══ DIVISOR VERTICAL ══ */}
      <line x1="98" y1="8" x2="98" y2="92"
            stroke="url(#lineGold)" strokeWidth="0.9" />

      {/* ══ NEURO — ouro, espaçamento largo ══ */}
      <text
        x="114"
        y="46"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="26"
        fontWeight="200"
        fill="url(#logoGold)"
        letterSpacing="8"
        dominantBaseline="middle"
      >
        NEURO
      </text>

      {/* ══ FIX — azul-aço, mesma linha que NEURO ══ */}
      {/* NEURO: 5 chars × ~15px + 4 × 8px spacing ≈ 107px → FIX começa em 114+107=221 */}
      <text
        x="272"
        y="46"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="26"
        fontWeight="200"
        fill="url(#logoSteel)"
        letterSpacing="8"
        dominantBaseline="middle"
      >
        FIX
      </text>

      {/* ══ LINHA OURO ESQUERDA ══ */}
      {/* NEUROFIX span: 114 a ~370. Centro: ~242. MED ~40px wide → linha até ~215 */}
      <line x1="114" y1="68" x2="214" y2="68"
            stroke="url(#lineGold)" strokeWidth="0.8" />

      {/* ══ MED — azul-aço, centralizado em NEUROFIX ══ */}
      <text
        x="242"
        y="80"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="12"
        fontWeight="200"
        fill="url(#logoSteel)"
        letterSpacing="8"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        MED
      </text>

      {/* ══ LINHA OURO DIREITA ══ */}
      <line x1="272" y1="68" x2="372" y2="68"
            stroke="url(#lineGold)" strokeWidth="0.8" />
    </svg>
  );
}
