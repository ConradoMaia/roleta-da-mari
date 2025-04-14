import { useState } from "react";
import { motion } from "framer-motion";

const premios = ["Tênis", "Massagem", "Sushi", "Plantas", "Presente surpresa"];

export default function App() {
  const [girosRestantes, setGirosRestantes] = useState(5);
  const [girando, setGirando] = useState(false);
  const [premioAtual, setPremioAtual] = useState(null);
  const [premiosObtidos, setPremiosObtidos] = useState([]);

  const girarRoleta = () => {
    if (girando || girosRestantes === 0) return;
    setGirando(true);

    const indexPremio = Math.floor(Math.random() * premios.length);
    const premio = premios[indexPremio];

    setTimeout(() => {
      setPremioAtual(premio);
      setPremiosObtidos([...premiosObtidos, premio]);
      setGirosRestantes(girosRestantes - 1);
      setGirando(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-pink-700">Surpresinha da Mari 💖</h1>

      {girosRestantes > 0 ? (
        <>
          <motion.div
            animate={{ rotate: girando ? 1440 : 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="w-64 h-64 rounded-full border-8 border-pink-400 flex items-center justify-center text-white text-xl font-semibold bg-gradient-to-br from-pink-400 to-pink-600 shadow-xl mb-6"
          >
            {girando ? "Girando..." : premioAtual || "Clique para girar"}
          </motion.div>

          <button
            onClick={girarRoleta}
            disabled={girando}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-2xl shadow-md disabled:opacity-50"
          >
            Girar roleta ({girosRestantes} restantes)
          </button>
        </>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">🎉 Parabéns, Mari!</h2>
          <p className="text-gray-700 mb-2">
            Você girou a roleta do amor e ganhou mais que prêmios…
          </p>
          <p className="text-gray-700 mb-2">
            Ganhou um coração que gira de felicidade só por te ter por perto 💕
          </p>
          <p className="text-gray-700 mb-4">
            Cada surpresa é só um jeitinho diferente de dizer: <strong>eu amo você!</strong>
          </p>
          <p className="text-pink-500 font-semibold">Te amo demais! — Conrado 💌</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-pink-700">Seus prêmios:</h3>
            <ul className="mt-2 text-gray-800">
              {premiosObtidos.map((p, i) => (
                <li key={i}>🎁 {p}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
