
import React from 'react';
import { Expert, ExpertStatus } from '../types';
import { COLORS } from '../constants';

interface ExpertsPanelProps {
  experts: Expert[];
}

export const ExpertsPanel: React.FC<ExpertsPanelProps> = ({ experts }) => {
  return (
    <div className="p-4 bg-slate-700 bg-opacity-50 rounded-lg shadow-xl">
      <h3 className={`text-xl font-bold mb-4 ${COLORS.textNeonCyan} tracking-wider`}>Especialistas</h3>
      <ul className="space-y-3">
        {experts.map((expert) => (
          <li key={expert.id} className="p-3 bg-slate-600 bg-opacity-70 rounded-md">
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${expert.status === ExpertStatus.CONTRATADO ? COLORS.textNeonCyan : 'text-gray-400'}`}>
                {expert.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  expert.status === ExpertStatus.CONTRATADO
                    ? `bg-${COLORS.neonCyan} text-slate-900`
                    : `bg-gray-500 text-gray-200`
                }`}
              >
                {expert.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{expert.description}</p>
            {expert.status === ExpertStatus.DISPONIVEL && expert.cost && (
               <button className={`mt-2 text-xs bg-${COLORS.neonGold} text-slate-900 px-3 py-1 rounded hover:bg-yellow-300 transition-colors`}>
                Contratar ($ {expert.cost.toLocaleString('pt-BR')})
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
