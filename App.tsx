
import React, { useState, useCallback, useEffect } from 'react';
import { MapComponent } from './components/MapComponent';
import { UIPanelComponent } from './components/UIPanelComponent';
import { BuildingModal } from './components/BuildingModal';
import { INITIAL_GAME_STATE, MAP_IMAGE_URL, MAFIOSO_PORTRAIT_URL, COLORS } from './constants';
import { Building, GameState, BuildingId } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [selectedBuildingForModal, setSelectedBuildingForModal] = useState<Building | null>(
    INITIAL_GAME_STATE.buildings.find(b => b.id === BuildingId.CASA_APOSTAS_1) || null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Modal is initially open as per prompt

  const handleSelectBuilding = useCallback((building: Building) => {
    setGameState(prev => ({
      ...prev,
      buildings: prev.buildings.map(b => ({ ...b, isSelected: b.id === building.id }))
    }));
    setSelectedBuildingForModal(building);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Keep the visual selection on map until another building is selected or action taken
    // Or clear it:
    // setGameState(prev => ({
    //   ...prev,
    //   buildings: prev.buildings.map(b => ({ ...b, isSelected: false }))
    // }));
  }, []);

  const handleUpgradeBuilding = useCallback(() => {
    if (selectedBuildingForModal && selectedBuildingForModal.upgradeCost) {
      if (gameState.resources.dinheiroLimpo >= selectedBuildingForModal.upgradeCost) {
        setGameState(prev => {
          const cost = selectedBuildingForModal.upgradeCost!;
          const newDinheiroLimpo = prev.resources.dinheiroLimpo - cost;
          
          let newSelectedBuilding: Building | null = null;

          const updatedBuildings = prev.buildings.map(b => {
            if (b.id === selectedBuildingForModal.id) {
              const upgradedBuilding = {
                ...b,
                level: b.level + 1,
                incomeDirty: parseFloat(((b.incomeDirty || 0) * 1.2).toFixed(2)),
                heatGeneration: parseFloat(((b.heatGeneration || 0) * 1.1).toFixed(2)),
                upgradeCost: Math.floor((b.upgradeCost || 0) * 1.5),
              };
              newSelectedBuilding = upgradedBuilding;
              return upgradedBuilding;
            }
            return b;
          });
          
          setSelectedBuildingForModal(newSelectedBuilding);

          return {
            ...prev,
            resources: { ...prev.resources, dinheiroLimpo: newDinheiroLimpo },
            buildings: updatedBuildings,
          };
        });
        // Consider adding a subtle notification here
      } else {
        // alert("Dinheiro limpo insuficiente para o upgrade!"); // Replace with in-game notification
        console.warn("Dinheiro limpo insuficiente para o upgrade!");
      }
    }
  }, [selectedBuildingForModal, gameState.resources.dinheiroLimpo]);

  // Game loop for resource generation
  useEffect(() => {
    const gameTick = () => {
      setGameState(prev => {
        let newDinheiroSujo = prev.resources.dinheiroSujo;
        let newCalor = prev.resources.calor;

        prev.buildings.forEach(building => {
          if (building.incomeDirty) newDinheiroSujo += building.incomeDirty; // Per second
          if (building.heatGeneration) newCalor += building.heatGeneration; // Per second
        });
        
        newCalor = Math.min(100, Math.max(0, newCalor));

        // Basic "money laundering" simulation and influence decay - for example purposes
        let newDinheiroLimpo = prev.resources.dinheiroLimpo;
        if (newDinheiroSujo > 1000) { // Arbitrary laundering condition
            const toLaunder = newDinheiroSujo * 0.05; // Launder 5%
            newDinheiroLimpo += toLaunder * 0.7; // 70% efficiency
            newDinheiroSujo -= toLaunder;
        }

        return {
          ...prev,
          resources: {
            ...prev.resources,
            dinheiroLimpo: parseFloat(newDinheiroLimpo.toFixed(2)),
            dinheiroSujo: parseFloat(newDinheiroSujo.toFixed(2)),
            calor: parseFloat(newCalor.toFixed(2)),
          }
        };
      });
    };
    const intervalId = setInterval(gameTick, 1000); // Update resources every second
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  return (
    <div className="flex h-screen bg-slate-900 text-gray-200 font-mono overflow-hidden">
      {/* Left 2/3 for Map */}
      <div className="w-2/3 h-full relative">
        <MapComponent
          buildings={gameState.buildings}
          emptyLots={gameState.emptyLots}
          hq={gameState.hq}
          onSelectBuilding={handleSelectBuilding}
          mapImageUrl={MAP_IMAGE_URL}
        />
      </div>

      {/* Right 1/3 for UI Panel */}
      <div className={`w-1/3 h-full ${COLORS.panelBg} p-4 overflow-y-auto border-l-2 border-slate-700`}>
        <UIPanelComponent
          resources={gameState.resources}
          currentMission={gameState.currentMission}
          experts={gameState.experts}
          mafiosoPortraitUrl={MAFIOSO_PORTRAIT_URL}
        />
      </div>

      {isModalOpen && selectedBuildingForModal && (
        <BuildingModal
          building={selectedBuildingForModal}
          onClose={handleCloseModal}
          onUpgrade={handleUpgradeBuilding}
          dinheiroLimpo={gameState.resources.dinheiroLimpo}
        />
      )}
    </div>
  );
};

export default App;
