import { useState, useRef, useEffect } from "react";

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [showPrizeAnimation, setShowPrizeAnimation] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [isSlowing, setIsSlowing] = useState(false);
  const [intervalTime, setIntervalTime] = useState(60); // velocidade inicial
  const intervalRef = useRef(null);
  const stopIndexRef = useRef(null);

  // Inicia o sorteio
  useEffect(() => {
    if (rolling) {
      let totalCycles = Math.floor(Math.random() * 3) + 4; // de 4 a 6 voltas completas
      let totalItems = allPrizes.length;
      let stopIndex = (Math.floor(Math.random() * validPrizes.length) + count) % totalItems;
      // Garante que vai parar em um prêmio válido ainda não sorteado
      let validIndexes = [];
      allPrizes.forEach((prize, idx) => {
        if (prize === validPrizes[count]) validIndexes.push(idx);
      });
      stopIndex = validIndexes[Math.floor(Math.random() * validIndexes.length)];
      stopIndexRef.current = stopIndex + totalCycles * totalItems;

      let currentIndex = highlightedIndex;
      let steps = 0;
      let time = intervalTime;

      function runRoulette() {
        setHighlightedIndex((prev) => (prev + 1) % totalItems);
        steps++;
        // Desacelera nos últimos 20 passos
        if (stopIndexRef.current - steps < 20) {
          time += 15;
        }
        if (steps < stopIndexRef.current) {
          intervalRef.current = setTimeout(runRoulette, time);
        } else {
          setRolling(false);
          setTimeout(() => {
            showPrize();
          }, 300);
        }
      }
      runRoulette();

      return () => clearTimeout(intervalRef.current);
    }
    // eslint-disable-next-line
  }, [rolling, count]);

  function showPrize() {
    const prize = allPrizes[highlightedIndex % allPrizes.length];
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
          setRolling(true);
          setIntervalTime(60);
        }
      }, 500);
    }, 2000);
  }

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
          <div className="flex flex-row justify-center items-center gap-2" style={{ minHeight: "100px" }}>
            {allPrizes.map((prize, idx) => {
              const isHighlighted = idx === (highlightedIndex % allPrizes.length);
              const isValid = validPrizes.includes(prize);
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center w-[120px] h-[100px] text-lg font-bold border-2 rounded-lg mx-1 transition-all duration-150
                    ${isHighlighted ? "border-yellow-400 scale-110 shadow-lg" : "border-transparent"}
                  `}
                  style={{
                    background: isValid
                      ? 'linear-gradient(to bottom, #f472b6, #ec4899)'
                      : 'linear-gradient(to bottom, #c084fc, #a855f7)',
                    opacity: isHighlighted ? 1 : 0.15,
                    filter: isHighlighted ? 'none' : 'blur(1.5px)',
                    transition: 'opacity 0.15s, filter 0.15s, transform 0.15s'
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