import { useState, useEffect } from 'react';

export function useTypingEffect(frases, opciones = {}) {
  const {
    velocidadEscritura = 100,
    velocidadBorrado = 50,
    pausaEntreFrames = 2000,
    fraseAleatoria = true
  } = opciones;

  const [fraseActual, setFraseActual] = useState("");
  const [indiceLetra, setIndiceLetra] = useState(0);
  const [indiceFrase, setIndiceFrase] = useState(0);
  const [escribiendo, setEscribiendo] = useState(true);

  // Seleccionar frase inicial (aleatoria o primera)
  useEffect(() => {
    if (fraseAleatoria) {
      const indiceAleatorio = Math.floor(Math.random() * frases.length);
      setIndiceFrase(indiceAleatorio);
    }
  }, [frases.length, fraseAleatoria]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (escribiendo) {
        // Escribiendo la frase
        if (indiceLetra < frases[indiceFrase].length) {
          setFraseActual(frases[indiceFrase].substring(0, indiceLetra + 1));
          setIndiceLetra(indiceLetra + 1);
        } else {
          // Termina de escribir, pausa y luego empieza a borrar
          setTimeout(() => {
            setEscribiendo(false);
          }, pausaEntreFrames);
        }
      } else {
        // Borrando la frase
        if (indiceLetra > 0) {
          setFraseActual(frases[indiceFrase].substring(0, indiceLetra - 1));
          setIndiceLetra(indiceLetra - 1);
        } else {
          // Termina de borrar, cambia a la siguiente frase
          const siguienteFrase = (indiceFrase + 1) % frases.length;
          setIndiceFrase(siguienteFrase);
          setEscribiendo(true);
        }
      }
    }, escribiendo ? velocidadEscritura : velocidadBorrado);

    return () => clearTimeout(timer);
  }, [indiceLetra, indiceFrase, escribiendo, frases, velocidadEscritura, velocidadBorrado, pausaEntreFrames]);

  return fraseActual;
}