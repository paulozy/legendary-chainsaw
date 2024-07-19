import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const isClient = typeof window === 'object';

  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  });

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Atualiza o tamanho da tela na montagem

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient]);

  return windowSize;
};