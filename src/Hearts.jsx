import { useEffect, useState } from 'react';

export default function Hearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Criar corações iniciais
    const initialHearts = Array(15).fill(0).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 15 + 15}px`,
      duration: `${Math.random() * 3 + 4}s`,
      delay: `${Math.random() * 5}s`,
      type: Math.random() > 0.7 ? '💖' : '❤️'
    }));
    setHearts(initialHearts);

    // Adicionar novos corações periodicamente
    const interval = setInterval(() => {
      setHearts(prev => {
        // Remover alguns corações antigos para não sobrecarregar
        if (prev.length > 25) {
          return [...prev.slice(-20), {
            id: Date.now(),
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 15 + 15}px`,
            duration: `${Math.random() * 3 + 4}s`,
            delay: '0s',
            type: Math.random() > 0.8 ? '💕' : Math.random() > 0.5 ? '💖' : '❤️'
          }];
        }
        
        // Adicionar novos corações
        return [...prev, {
          id: Date.now(),
          left: `${Math.random() * 100}%`,
          size: `${Math.random() * 15 + 15}px`,
          duration: `${Math.random() * 3 + 4}s`,
          delay: '0s',
          type: Math.random() > 0.8 ? '💕' : Math.random() > 0.5 ? '💖' : '❤️'
        }];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          style={{
            position: 'absolute',
            left: heart.left,
            fontSize: heart.size,
            top: '-50px',
            opacity: 0.8,
            animation: `fall ${heart.duration} linear forwards ${heart.delay}`,
          }}
        >
          {heart.type}
        </div>
      ))}
    </div>
  );
}
