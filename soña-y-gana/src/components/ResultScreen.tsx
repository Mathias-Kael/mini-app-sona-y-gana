import React from 'react';
import type { Dream } from '../types';

interface ResultScreenProps {
  dream: Dream;
  onTryAnother: () => void;
  onSimulate: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ dream, onTryAnother, onSimulate }) => {
  return (
    <div className="text-center flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-primary dark:text-accent">{dream.palabra}</h2>
      <div className="my-6">
        <p className="text-9xl font-bold text-gray-800 dark:text-gray-100 tracking-tighter" style={{fontVariantNumeric: 'tabular-nums'}}>
          {dream.numero}
        </p>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
        En la tabla de los sueños populares, soñar con <span className="font-semibold">{dream.palabra}</span> es el <span className="font-semibold">{dream.numero}</span>.
      </p>

      {dream.descripcion && (
         <blockquote className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 border-l-4 border-accent dark:border-primary rounded-r-lg max-w-md">
          <p className="italic text-gray-600 dark:text-gray-300 text-left">
            "{dream.descripcion}"
          </p>
        </blockquote>
      )}
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button
          onClick={onSimulate}
          className="w-full bg-primary dark:bg-accent text-white dark:text-dark-card font-bold py-3 px-6 rounded-full hover:bg-primary-dark dark:hover:bg-accent-dark transition-transform transform hover:scale-105 shadow-lg"
        >
          🎯 Simular apuesta
        </button>
        <button
          onClick={onTryAnother}
          className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-transform transform hover:scale-105"
        >
          Probar otro
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
