import React, { useState, useMemo, useCallback } from 'react';
import type { Dream, PaymentData, AnalysisLevel } from '../types';
import { BackArrowIcon, ShieldIcon, TrophyIcon, WhatsAppIcon } from './Icons';

interface SimulatorScreenProps {
  dream: Dream;
  payments: PaymentData;
  onBack: () => void;
}

// --- Helper Components ---

const LevelIndicator: React.FC<{ level: AnalysisLevel; type: 'Riesgo' | 'Recompensa' }> = ({ level, type }) => {
    const levelInfo = useMemo(() => {
        switch (level) {
            case 'Bajo': return { text: type === 'Recompensa' ? 'Baja' : 'Bajo', color: 'bg-green-500' };
            case 'Medio': return { text: type === 'Recompensa' ? 'Media' : 'Medio', color: 'bg-yellow-500' };
            case 'Alto': return { text: type === 'Recompensa' ? 'Alta' : 'Alto', color: 'bg-red-500' };
            default: return { text: 'N/A', color: 'bg-gray-400' };
        }
    }, [level, type]);

    const Icon = type === 'Riesgo' 
        ? <ShieldIcon className="h-5 w-5 mr-2 text-gray-400"/> 
        : <TrophyIcon className="h-5 w-5 mr-2 text-gray-400"/>;

    return (
        <div className="flex items-center">
            {Icon}
            <span className="font-semibold w-24">{type}:</span>
            <div className={`flex items-center justify-center text-white text-xs font-bold px-2 py-1 rounded-full ${levelInfo.color}`}>
                {levelInfo.text}
            </div>
        </div>
    );
};


const getStrategyTip = (risk: AnalysisLevel, reward: AnalysisLevel): { title: string, text: string } | null => {
    if (!risk || !reward) return null;

    if (risk === 'Alto') {
        return { title: "Estrategia Audaz", text: "Apuesta de alto riesgo, pero con la mayor recompensa. ¡Para buscar el gran golpe!" };
    }
    if (risk === 'Bajo') {
        return { title: "Estrategia Conservadora", text: "Más chances de ganar con un premio moderado. ¡Ideal para empezar!" };
    }
    if (risk === 'Medio') {
         return { title: "Estrategia Equilibrada", text: "Un buen balance entre el riesgo que tomás y el premio que podés ganar." };
    }
    return null;
}

// --- Main Component ---

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const betTypes = [
    { key: "1", label: "A la cabeza" },
    { key: "5", label: "A los 5" },
    { key: "10", label: "A los 10" },
    { key: "20", label: "A los 20" },
];

const SimulatorScreen: React.FC<SimulatorScreenProps> = ({ dream, payments, onBack }) => {
  const [amount, setAmount] = useState('100');
  const [betNumber, setBetNumber] = useState(dream.numero);
  const [selectedBetType, setSelectedBetType] = useState(betTypes[0].key);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      if (value.length <= 4) {
          setBetNumber(value);
      }
  };

  const { winnings, errorMessage, riskLevel, rewardLevel, isValidBet } = useMemo(() => {
    const betAmount = parseFloat(amount);
    let risk: AnalysisLevel = null;
    let reward: AnalysisLevel = null;

    if (isNaN(betAmount) || betAmount <= 0 || betNumber.length === 0) {
      return { winnings: 0, errorMessage: null, riskLevel: risk, rewardLevel: reward, isValidBet: false };
    }

    const numDigits = betNumber.length;
    const digitKey = `${numDigits}_cifra${numDigits > 1 ? 's' : ''}` as keyof typeof payments.coeficientes;
    
    const multipliers = payments.coeficientes[digitKey];
    if (!multipliers) {
        return { winnings: 0, errorMessage: `No hay pagos para ${numDigits} cifras.`, riskLevel: risk, rewardLevel: reward, isValidBet: false };
    }

    const multiplier = multipliers[selectedBetType];
    if (multiplier === undefined) {
         return { winnings: 0, errorMessage: `Apuesta no válida para esta cantidad de cifras.`, riskLevel: risk, rewardLevel: reward, isValidBet: false };
    }
    
    // Risk Analysis
    switch(selectedBetType) {
        case '1': risk = 'Alto'; break;
        case '5': risk = 'Medio'; break;
        case '10': risk = 'Medio'; break;
        case '20': risk = 'Bajo'; break;
    }

    // Reward Analysis
    if(multiplier >= 70) reward = 'Alto';
    else if (multiplier >= 10) reward = 'Medio';
    else reward = 'Bajo';

    return { winnings: betAmount * multiplier, errorMessage: null, riskLevel: risk, rewardLevel: reward, isValidBet: true };
  }, [amount, betNumber, selectedBetType, payments]);

  const strategyTip = getStrategyTip(riskLevel, rewardLevel);

  const whatsappUrl = useMemo(() => {
    if (!isValidBet) return '#';
    
    const betTypeLabel = betTypes.find(b => b.key === selectedBetType)?.label || 'Desconocido';
    const message = `¡Hola! Quiero hacer una apuesta desde "Soñá y Ganá":\n\n- Número: *${betNumber}*\n- Monto: *${formatCurrency(parseFloat(amount), payments.moneda)}*\n- Tipo: *${betTypeLabel}*`;

    return `https://wa.me/543765006395?text=${encodeURIComponent(message)}`;
  }, [isValidBet, betNumber, amount, selectedBetType, payments.moneda]);


  const getNumberOfDigitsText = useCallback(() => {
    const len = betNumber.length;
    if (len === 1) return '1 cifra';
    if (len > 1) return `${len} cifras`;
    return 'inválido';
  }, [betNumber]);

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="relative flex items-center justify-center mb-4">
        <button onClick={onBack} className="absolute left-0 text-gray-500 hover:text-primary dark:hover:text-accent transition-colors" aria-label="Volver">
            <BackArrowIcon className="h-6 w-6"/>
        </button>
        <h2 className="text-2xl font-bold text-primary dark:text-accent text-center">Simulador de Premios</h2>
      </div>

      <div className="w-full space-y-6 mt-4">
        <div>
          <label htmlFor="betNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Número a apostar ({getNumberOfDigitsText()})
          </label>
          <input
            type="text"
            id="betNumber"
            value={betNumber}
            onChange={handleNumberChange}
            className="mt-1 w-full pl-4 pr-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full bg-light dark:bg-dark focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent outline-none transition-all text-center"
            placeholder="00"
            inputMode="numeric"
            maxLength={4}
          />
        </div>
        <div>
          <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Monto a apostar
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">$</span>
            <input
              type="text"
              id="betAmount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-8 pr-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full bg-light dark:bg-dark focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent outline-none transition-all text-center"
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de jugada</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {betTypes.map(type => (
              <label key={type.key} className={`flex items-center justify-center px-3 py-3 text-sm font-medium rounded-full cursor-pointer transition-all ${selectedBetType === type.key ? 'bg-primary text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <input
                  type="radio"
                  name="betType"
                  value={type.key}
                  checked={selectedBetType === type.key}
                  onChange={(e) => setSelectedBetType(e.target.value)}
                  className="sr-only"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Premio Estimado</h3>
        {errorMessage ? (
            <p className="text-2xl font-bold text-red-500 mt-2">{errorMessage}</p>
        ) : (
            <>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2 font-mono tracking-tight">
                  {formatCurrency(winnings, payments.moneda)}
              </p>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-3">Análisis de la Jugada</h4>
                <div className="space-y-2 text-left text-sm text-gray-700 dark:text-gray-300 max-w-xs mx-auto">
                    <LevelIndicator level={riskLevel} type="Riesgo"/>
                    <LevelIndicator level={rewardLevel} type="Recompensa"/>
                </div>
                {strategyTip && (
                    <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
                        <p><span className="font-bold">{strategyTip.title}:</span> {strategyTip.text}</p>
                    </div>
                )}
              </div>
            </>
        )}
        
        {isValidBet && (
          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full max-w-xs bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
            >
              <WhatsAppIcon className="h-6 w-6 mr-3" />
              Apostar por WhatsApp
            </a>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {payments.nota}
        </p>
      </div>
    </div>
  );
};

export default SimulatorScreen;
