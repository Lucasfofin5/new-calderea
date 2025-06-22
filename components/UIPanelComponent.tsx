
import React from 'react';
import { Resources, Expert } from '../types';
import { ResourcesPanel } from './ResourcesPanel';
import { CharacterPanel } from './CharacterPanel';
import { ExpertsPanel } from './ExpertsPanel';

interface UIPanelComponentProps {
  resources: Resources;
  currentMission: string;
  experts: Expert[];
  mafiosoPortraitUrl: string;
}

export const UIPanelComponent: React.FC<UIPanelComponentProps> = ({
  resources,
  currentMission,
  experts,
  mafiosoPortraitUrl,
}) => {
  return (
    <div className="h-full flex flex-col space-y-4 font-mono">
      <ResourcesPanel resources={resources} />
      <CharacterPanel
        currentMission={currentMission}
        mafiosoPortraitUrl={mafiosoPortraitUrl}
      />
      <ExpertsPanel experts={experts} />
    </div>
  );
};
