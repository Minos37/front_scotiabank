/**
 * Logo oficial de Scotiabank.
 * Isotipo: Globo terráqueo rojo con la "S" estilizada en color blanco.
 */
export default function Logo({
  size = 44,
  wordmark = true,
  variant = 'dark',
  subtitle = 'FUERZA DE VENTAS',
}) {
  const textColor = variant === 'light' ? '#ffffff' : '#ec1c24'
  const subColor = variant === 'light' ? 'rgba(255,255,255,.85)' : '#4b5563'
  const nameSize = Math.round(size * 0.5)
  const subSize = Math.max(9, Math.round(size * 0.22))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Scotiabank" role="img" style={{ flexShrink: 0 }}>
        {/* Círculo fondo rojo oficial */}
        <circle cx="24" cy="24" r="23" fill="#ec1c24" />
        {/* Líneas sutiles del globo */}
        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M 6 24 L 42 24" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M 24 6 L 24 42" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M 9.5 13 C 15 17, 33 17, 38.5 13" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M 9.5 35 C 15 31, 33 31, 38.5 35" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {/* S estilizada oficial blanca */}
        <path d="M 31 16.5 C 31 16.5, 27.5 14, 23 14 C 17.5 14, 14.5 17, 14.5 20.5 C 14.5 27, 33.5 25.5, 33.5 30.5 C 33.5 34, 30 36.5, 23.5 36.5 C 18 36.5, 14.5 34.5, 14.5 34.5 L 15 30.5 C 15 30.5, 19.5 32.8, 23.5 32.8 C 28 32.8, 28.8 30.8, 28.8 29 C 28.8 23, 9.8 24.5, 9.8 19.5 C 9.8 15, 14.8 11.2, 23 11.2 C 28.5 11.2, 31.5 13, 31.5 13 Z" fill="#ffffff" />
      </svg>

      {wordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.04 }}>
          <span style={{ fontWeight: 800, fontSize: nameSize, color: textColor, letterSpacing: '-0.5px', fontFamily: '"Outfit", "Inter", sans-serif' }}>
            Scotiabank
          </span>
          {subtitle && (
            <span style={{ fontSize: subSize, fontWeight: 700, color: subColor, letterSpacing: '1.2px', fontFamily: '"Inter", sans-serif' }}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
