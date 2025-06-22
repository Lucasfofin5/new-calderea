
import React from 'react';
import { Resources } from '../types';
import { ProgressBar } from './ProgressBar';
import { DollarIcon } from './icons/DollarIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { CrownIcon } from './icons/CrownIcon';
import { FireIcon } from './icons/FireIcon';
import { COLORS } from '../constants';

interface ResourcesPanelProps {
  resources: Resources;
}

const formatCurrency = (value: number) => `$ ${value.toLocaleString('pt-BR')}`;

export const ResourcesPanel: React.FC<ResourcesPanelProps> = ({ resources }) => {
  const resourceItems = [
    {
      name: "Dinheiro Limpo",
      value: formatCurrency(resources.dinheiroLimpo),
      Icon: DollarIcon,
      iconColor: 'text-green-400',
    },
    {
      name: "Dinheiro Sujo",
      value: formatCurrency(resources.dinheiroSujo),
      Icon: BriefcaseIcon,
      iconColor: `text-${COLORS.neonGold}`,
    },
    {
      name: "Influência",
      value: resources.influencia.toLocaleString('pt-BR'),
      Icon: CrownIcon,
      iconColor: `text-${COLORS.neonCyan}`,
    },
  ];

  return (
    <div className="mb-6 p-4 bg-slate-700 bg-opacity-50 rounded-lg shadow-xl">
      <h3 className={`text-xl font-bold mb-4 ${COLORS.textNeonCyan} tracking-wider`}>Recursos</h3>
      <div className="space-y-3">
        {resourceItems.map(({ name, value, Icon, iconColor }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
              <span className="text-sm text-gray-300">{name}:</span>
            </div>
            <span className={`text-sm font-semibold ${iconColor}`}>{value}</span>
          </div>
        ))}
        {/* Calor */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <FireIcon className={`w-5 h-5 mr-3 text-${COLORS.neonRed}`} />
            <span className="text-sm text-gray-300">Calor:</span>
          </div>
          <div className="w-1/2">
            <ProgressBar value={resources.calor} colorClass={`bg-${COLORS.neonRed}`} />
          </div>
          <span className={`text-sm font-semibold text-${COLORS.neonRed}`}>{resources.calor.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
