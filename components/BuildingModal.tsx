
import React from 'react';
import { Building } from '../types';
import { COLORS } from '../constants';

interface BuildingModalProps {
  building: Building;
  onClose: () => void;
  onUpgrade: () => void;
  dinheiroLimpo: number;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({
  building,
  onClose,
  onUpgrade,
  dinheiroLimpo,
}) => {
  const canAffordUpgrade = building.upgradeCost && dinheiroLimpo >= building.upgradeCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className={`${COLORS.modalBg} p-6 rounded-xl shadow-2xl w-full max-w-md border-2 ${COLORS.borderNeonCyan} ${COLORS.shadowNeonCyan}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${COLORS.textNeonCyan}`}>
            {building.name} - Nível {building.level}
          </h2>
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-white transition-colors text-2xl`}
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 text-sm text-gray-300 mb-6">
          {building.incomeDirty !== undefined && (
            <p>Renda (Suja): <span className={`font-semibold text-${COLORS.neonGold}`}>$ {building.incomeDirty.toLocaleString('pt-BR')}/s</span></p>
          )}
          {building.heatGeneration !== undefined && (
            <p>Gera Calor: <span className={`font-semibold text-${COLORS.neonRed}`}>+ {building.heatGeneration.toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}/s</span></p>
          )}
        </div>

        {building.upgradeCost !== undefined && (
          <button
            onClick={onUpgrade}
            disabled={!canAffordUpgrade}
            className={`w-full font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md
              ${canAffordUpgrade 
                ? `bg-${COLORS.neonGold} text-slate-900 hover:bg-yellow-300` 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
          >
            UPGRADE ($ {building.upgradeCost.toLocaleString('pt-BR')})
          </button>
        )}
      </div>
    </div>
  );
};
