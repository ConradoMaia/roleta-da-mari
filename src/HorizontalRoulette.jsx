import { useState, useRef, useEffect, useCallback } from "react";

const validPrizes = ["Tênis", "Massagem", "Sushi", "Plantas", "Presente Surpresa"];
const trollPrizes = ["Carro", "Casa", "Um milhão de beijos", "Perca a vez", "Viagem pra lua"];
const allPrizes = [...validPrizes, ...trollPrizes];

const prizeIcons = {
  "Tênis": "👟",
  "Massagem": "💆‍♀️",
  "Sushi": "🍣",
  "Plantas": "🌱",
  "Presente Surpresa": "🎁",
  "Carro": "🚗",
  "Casa": "🏠",
  "Um milhão de beijos": "💋",
  "Perca a vez": "❌",
  "Viagem pra lua": "🚀"
};

export default function HorizontalRoulette({ onPrizeSelected }) {
  const [rolling, setRolling] = useState(true);
  const [wonPrizes, setWonPrizes] = useState([]);
  const [count, setCount] = useState(0);
  const [speed, setSpeed] = useState(25); // velocidade inicial maior
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [showPrizeAnimation, setShowPrizeAnimation] = useState(false);
  const [slowing, setSlowing] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);

  // Calcula o índice do item central visível
  const getCenterIndex = () => {
    if (!containerRef.current) return 0;
    const scrollLeft = containerRef.current.scrollLeft;
    const itemWidth = 180; // igual ao w-[180px]
    return Math.round((scrollLeft + containerRef.current.offsetWidth / 2) / itemWidth) - 1;
  };

  // Função de rolagem
  const scroll = useCallback(() => {
    if (containerRef.current && rolling) {
      containerRef.current.scrollLeft += speed;
      if (
        containerRef.current.scrollLeft >=
        containerRef.current.scrollWidth - containerRef.current.offsetWidth
      ) {
        containerRef.current.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(scroll);
    }
  }, [speed, rolling]);

  // Função para desacelerar
  const slowDown = useCallback(() => {
    setSlowing(true);
  }, []);

  useEffect(() => {
    if (rolling) {
      animationRef.current = requestAnimationFrame(scroll);

      // Aumenta a velocidade gradualmente (opcional, pode remover se quiser sempre rápido)
      // const speedInterval = setInterval(() => {
      //   setSpeed(prev => Math.min(prev + 1, 30));
      // }, 500);

      const stopTime = Math.random() * 2000 + 3000;
      timerRef.current = setTimeout(() => {
        slowDown();
      }, stopTime);

      return () => {
        cancelAnimationFrame(animationRef.current);
        // clearInterval(speedInterval);
        clearTimeout(timerRef.current);
      };
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [rolling, scroll, slowDown]);

  useEffect(() => {
    if (slowing && speed > 1) {
      const timeout = setTimeout(() => {
        setSpeed(prevSpeed => prevSpeed * 0.9);
      }, 60); // desacelera mais rápido
      return () => clearTimeout(timeout);
    }
    if (slowing && speed <= 1) {
      setSpeed(0);
      setRolling(false);
      setSlowing(false);
      selectPrize();
    }
  }, [slowing, speed]);

  // Seleciona o prêmio
  const selectPrize = () => {
    const prize = validPrizes[count];
    setSelectedPrize(prize);
    setShowPrizeAnimation(true);

    setTimeout(() => {
      const newWonPrizes = [...wonPrizes, prize];
      setWonPrizes(newWonPrizes);
      setCount(count + 1);
      setShowPrizeAnimation(false);

      setTimeout(() => {
        if (count + 1 === 5) {
          onPrizeSelected(newWonPrizes);
        } else {
          setSpeed(25); // reinicia rápido
          setRolling(true);
        }
      }, 500);
    }, 2000);
  };

  // Calcula quais itens devem aparecer (3 próximos do centro)
  const centerIndex = getCenterIndex();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {showPrizeAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="animate-bounce"
            style={{
              background: 'linear-gradient(to right, #ec4899, #a855f7)',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}>
            <div className="text-6xl mb-4">{prizeIcons[selectedPrize]}</div>
            <h2 className="text-3xl font-bold text-white mb-2">Parabéns!</h2>
            <p className="text-2xl text-white">Você ganhou: <span className="font-bold">{selectedPrize}</span></p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 p-1">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="w-[3px] h-[80px] bg-yellow-400 rounded-full" style={{ boxShadow: '0 0 10px rgba(250,204,21,0.7)' }} />
            <div className="w-6 h-6 bg-yellow-400 rounded-full -mt-3 ml-[-10px] animate-pulse" style={{
              boxShadow: '0 0 15px rgba(250,204,21,0.9)'
            }} />
          </div>

          <div
            ref={containerRef}
            className="flex flex-row whitespace-nowrap overflow-hidden"
            style={{ height: "100px" }}
          >
            {Array(20)
              .fill(0)
              .flatMap(() => allPrizes)
              .map((prize, index) => {
                const isValid = validPrizes.includes(prize);
                // Só mostra opaco os 3 próximos do centro, o resto fica transparente
                const isVisible = Math.abs(index - centerIndex) <= 1;
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center w-[180px] h-[100px] text-lg font-bold border-r-2 border-gray-200 transition-all duration-200`}
                    style={{
                      background: isValid
                        ? 'linear-gradient(to bottom, #f472b6, #ec4899)'
                        : 'linear-gradient(to bottom, #c084fc, #a855f7)',
                      opacity: isVisible ? 1 : 0.15,
                      filter: isVisible ? 'none' : 'blur(1.5px)',
                      transition: 'opacity 0.2s, filter 0.2s'
                    }}
                  >
                    <div className="text-3xl mb-1">{prizeIcons[prize]}</div>
                    <div className="text-white text-center px-2">{prize}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        {count > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-white text-lg">Giros restantes: <span className="font-bold text-yellow-300">{5 - count}</span></p>
            {wonPrizes.length > 0 && (
              <div className="flex gap-1">
                {wonPrizes.map((prize, idx) => (
                  <span key={idx} className="text-2xl" title={prize}>{prizeIcons[prize]}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}