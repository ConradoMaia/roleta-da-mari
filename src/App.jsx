import { useState } from "react";
import HorizontalRoulette from "./HorizontalRoulette";
import Hearts from "./Hearts";
import "./App.css";

export default function App() {
  const [finalPrizes, setFinalPrizes] = useState([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [startDisabled, setStartDisabled] = useState(false);

  const prizeIcons = {
    "Tênis": "👟",
    "Massagem": "💆‍♀️",
    "Sushi": "🍣",
    "Plantas": "🌱",
    "Presente Surpresa": "🎁"
  };

  const handlePrizeSelected = (prizes) => {
    setFinalPrizes(prizes);
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 1000);
  };

  const handleRestart = () => {
    setFinalPrizes([]);
    setShowFinalMessage(false);
    setShowInstructions(true);
    setStartDisabled(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center p-6"
         style={{ backgroundImage: "url('/teste.jpg')" }}>
      <Hearts />
      <div className="z-10 max-w-3xl w-full text-center p-4 sm:p-8 rounded-2xl shadow-2xl border border-pink-500/30"
           style={{ background: 'linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(88,28,135,0.8))', boxSizing: 'border-box' }}>
        <h1 className="text-4xl font-bold mb-6" 
            style={{ 
              background: 'linear-gradient(to right, #f472b6, #a855f7)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>🎁 Feliz Aniversário, Meu Solzinho! 🎉</h1>
        
        {showInstructions && !showFinalMessage && (
          <section className="mb-8 text-lg">
            <div style={{ background: 'rgba(236,72,153,0.2)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
              <p className="text-xl mb-3">
                Você ganhou <strong style={{ color: '#fcd34d' }}>5 presentes surpresa</strong>! 🥰
              </p>
              <p>
                Eles vão ser sorteados em uma roleta muito especial. A roleta vai girar e parar automaticamente para revelar cada presente! 💝
              </p>
            </div>
            <button
              onClick={() => { setShowInstructions(false); setStartDisabled(true); }}
              disabled={startDisabled}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 2rem',
                background: 'linear-gradient(to right, #ec4899, #a855f7)',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                borderRadius: '9999px',
                transition: 'all 0.3s',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                opacity: startDisabled ? 0.6 : 1,
                cursor: startDisabled ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Começar!
            </button>
          </section>
        )}

        {!showInstructions && !showFinalMessage && (
          <HorizontalRoulette onPrizeSelected={handlePrizeSelected} />
        )}

        {showFinalMessage && (
          <section className="space-y-6 text-lg animate-fade-in">
            <h2 className="text-3xl font-bold" 
                style={{ 
                  background: 'linear-gradient(to right, #f472b6, #a855f7)', 
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>✨ Meu Solzinho, seus prêmios são:</h2>
            <ul style={{ background: 'rgba(236,72,153,0.2)', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {finalPrizes.map((prize, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                  <span style={{ fontSize: '1.875rem' }}>{prizeIcons[prize]}</span>
                  <span style={{ fontWeight: 'bold', color: '#fcd34d' }}>{prize}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '0.75rem', background: 'rgba(88,28,135,0.3)' }}>
              <p className="italic text-xl">
                Espero que tenha gostado da surpresa... Agora é só me cobrar cada presentinho com muito amor 💘 Te amo! 💫
              </p>
            </div>
            <button 
              onClick={handleRestart}
              style={{
                marginTop: '1.5rem',
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(to right, #ec4899, #a855f7)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Jogar novamente
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
