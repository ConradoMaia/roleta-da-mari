import { useState, useRef, useEffect } from "react";

const validPrizes = ["Tênis", "Massagem", "Sushi", "Plantas", "Presente Surpresa"];
const trollPrizes = ["Carro", "Casa", "Um milhão de beijos", "Perca a vez", "Viagem pra lua"];
const allPrizes = [...validPrizes, ...trollPrizes];

// Ícones para os prêmios
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
  const [speed, setSpeed] = useState(5);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [showPrizeAnimation, setShowPrizeAnimation] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  const prizeWidth = 180;

  useEffect(() => {
    if (rolling) {
      animationRef.current = requestAnimationFrame(scroll);
      
      // Aumenta a velocidade gradualmente para dar sensação de aceleração
      const speedInterval = setInterval(() => {
        setSpeed(prevSpeed => Math.min(prevSpeed + 1, 15));
      }, 500);
      
      return () => {
        cancelAnimationFrame(animationRef.current);
        clearInterval(speedInterval);
      };
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [rolling]);

  const scroll = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += speed;
      if (
        containerRef.current.scrollLeft >=
        containerRef.current.scrollWidth - containerRef.current.offsetWidth
      ) {
        containerRef.current.scrollLeft = 0;
      }
    }
    animationRef.current = requestAnimationFrame(scroll);
  };

  const stopRoll = () => {
    if (!rolling || count >= 5) return;

    // Desacelera gradualmente
    const slowDown = () => {
      setSpeed(prevSpeed => {
        if (prevSpeed <= 1) {
          cancelAnimationFrame(animationRef.current);
          setRolling(false);
          selectPrize();
          return 0;
        }
        setTimeout(slowDown, 100);
        return prevSpeed * 0.9;
      });
    };
    
    slowDown();
  };

  const selectPrize = () => {
    const prize = validPrizes[count];
    setSelectedPrize(prize);
    setShowPrizeAnimation(true);
    
    setTimeout(() => {
      setWonPrizes([...wonPrizes, prize]);
      setCount(count + 1);
      setShowPrizeAnimation(false);
      
      setTimeout(() => {
        if (count + 1 === 5) {
          onPrizeSelected([...wonPrizes, prize]);
        } else {
          setSpeed(5);
          setRolling(true);
        }
      }, 500);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {showPrizeAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div style={{
            animation: 'bounce 2s ease-in-out infinite',
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
          {/* Indicador de prêmio */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="w-[3px] h-[80px] bg-yellow-400 rounded-full" style={{ boxShadow: '0 0 10px rgba(250,204,21,0.7)' }} />
            <div className="w-6 h-6 bg-yellow-400 rounded-full -mt-3 ml-[-10px]" style={{ 
              boxShadow: '0 0 15px rgba(250,204,21,0.9)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
          </div>
          
          {/* Faixa de prêmios */}
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
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center w-[180px] h-[100px] text-lg font-bold border-r-2 border-gray-200 transition-all`}
                    style={{
                      background: isValid ? 
                        'linear-gradient(to bottom, #f472b6, #ec4899)' : 
                        'linear-gradient(to bottom, #c084fc, #a855f7)'
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
        {count < 5 && (
          <button
            onClick={stopRoll}
            disabled={!rolling}
            className={`px-8 py-3 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all ${!rolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: 'linear-gradient(to right, #fcd34d, #fbbf24)',
              color: '#be185d',
              animation: rolling ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
            }}
          >
            {rolling ? "Parar" : "Aguarde..."}
          </button>
        )}
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
