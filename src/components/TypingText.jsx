import { useTypingEffect } from '../hooks/useTypingEffect';

export function TypingText({ 
  frases, 
  options = {},
  className = '',
  showCursor = true,
  cursorClassName = 'animate-pulse'
}) {
  const textoAnimado = useTypingEffect(frases, options);

  return (
    <span className={className}>
      {textoAnimado}
      {showCursor && <span className={cursorClassName}>|</span>}
    </span>
  );
}