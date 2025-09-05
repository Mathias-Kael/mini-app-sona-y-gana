import React, { useState, useCallback } from 'react';
import type { Dream, View, PaymentData } from './types';

// Import local data directly
import dreamsData from './data/suenos.json';
import paymentsData from './data/pagos.json';

// Import components
import SearchScreen from './components/SearchScreen';
import ResultScreen from './components/ResultScreen';
import SimulatorScreen from './components/SimulatorScreen';
import Modal from './components/Modal';
import { DreamCatcherIcon, InfoIcon, WhatsAppIcon } from './components/Icons';


const App: React.FC = () => {
  const [view, setView] = useState<View>('search');
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cast the imported JSON to the correct type
  const dreams = dreamsData as Dream[];
  const payments = paymentsData as PaymentData;

  const handleSearch = useCallback((dream: Dream) => {
    setSelectedDream(dream);
    setView('result');
  }, []);

  const handleTryAnother = useCallback(() => {
    setSelectedDream(null);
    setView('search');
  }, []);

  const handleSimulate = useCallback(() => {
    setView('simulator');
  }, []);

  const handleBackToResult = useCallback(() => {
    setView('result');
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'result':
        if (selectedDream) {
          return (
            <ResultScreen
              dream={selectedDream}
              onTryAnother={handleTryAnother}
              onSimulate={handleSimulate}
            />
          );
        }
        // Fallback to search if no dream is selected
        setView('search');
        return null;
      
      case 'simulator':
        if (selectedDream) {
           return (
             <SimulatorScreen
               dream={selectedDream}
               payments={payments}
               onBack={handleBackToResult}
             />
           )
        }
        // Fallback to search if no dream is selected
        setView('search');
        return null;

      case 'search':
      default:
        return <SearchScreen dreams={dreams} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark text-dark dark:text-light font-sans flex flex-col p-4 sm:p-6 md:p-8">
       <header className="flex flex-col items-center mb-8 animate-fade-in">
         <DreamCatcherIcon className="h-16 w-16 text-primary dark:text-accent mb-2"/>
         <h1 className="text-4xl font-bold tracking-tight text-primary dark:text-accent">Soñá y Ganá</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-1">Tu guía de sueños populares</p>
       </header>

       <main className="flex-grow flex items-start justify-center">
         <div className="w-full max-w-lg bg-white dark:bg-dark-card p-6 sm:p-8 rounded-2xl shadow-xl">
            {renderContent()}
         </div>
       </main>

       <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 hover:text-primary dark:hover:text-accent transition-colors">
            <InfoIcon className="h-4 w-4" />
            <span>¿Cómo funciona?</span>
          </button>
          <span className="hidden sm:inline">|</span>
          <a href="https://wa.me/543765006395" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary dark:hover:text-accent transition-colors">
             <WhatsAppIcon className="h-4 w-4" />
            <span>Apostar en SubAgencia 201-103</span>
          </a>
       </footer>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="¿Cómo funciona?">
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
                Buscá por palabra o número. Te mostramos la equivalencia según la tabla popular y el significado simbólico de tu sueño.
            </p>
            <p>
                La simulación estima posibles premios según multiplicadores de referencia para ayudarte a entender tus jugadas. ¡No es un valor oficial!
            </p>
             <p className="text-xs pt-2">
                <strong>Soñá y Ganá v1.0</strong>
            </p>
        </div>
      </Modal>

    </div>
  );
};

export default App;
