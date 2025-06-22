
import React from 'react';
import { COLORS } from '../constants';

interface CharacterPanelProps {
  currentMission: string;
  mafiosoPortraitUrl: string;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  currentMission,
  mafiosoPortraitUrl,
}) => {
  return (
    <div className="mb-6 p-4 bg-slate-700 bg-opacity-50 rounded-lg shadow-xl">
      <h3 className={`text-xl font-bold mb-4 ${COLORS.textNeonCyan} tracking-wider`}>Diário do Capo</h3>
      <div className="flex items-start space-x-4">
        <img
          src={mafiosoPortraitUrl}
          alt="Retrato do Capo"
          className="w-24 h-24 rounded-md border-2 border-slate-600 object-cover"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-300 italic p-3 bg-slate-600 bg-opacity-70 rounded-md">
            "{currentMission}"
          </p>
        </div>
      </div>
    </div>
  );
};
