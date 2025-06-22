
import React from 'react';
import { Building, EmptyLot } from '../types';
import { COLORS } from '../constants';

interface MapComponentProps {
  buildings: Building[];
  emptyLots: EmptyLot[];
  hq: Building;
  onSelectBuilding: (building: Building) => void;
  // onSelectLot: (lot: EmptyLot) => void; // Future functionality
  mapImageUrl: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  buildings,
  emptyLots,
  hq,
  onSelectBuilding,
  mapImageUrl,
}) => {
  const renderBuilding = (b: Building) => {
    const isSelected = b.isSelected;
    const isHQ = b.isHQ;
    let borderClass = `border-2 ${COLORS.borderNeonCyan}`;
    let shadowClass = '';

    if (isSelected && !isHQ) {
      borderClass = `border-4 ${COLORS.borderNeonCyan}`;
      shadowClass = COLORS.shadowNeonCyan;
    } else if (isHQ) {
      borderClass = `border-4 border-yellow-300`; // HQ distinct border
      shadowClass = COLORS.shadowNeonGold;
    }

    return (
      <div
        key={b.id}
        className={`absolute cursor-pointer ${borderClass} ${shadowClass} transition-all duration-200 ease-in-out hover:opacity-80 flex items-center justify-center bg-black bg-opacity-30`}
        style={{
          top: b.position.top,
          left: b.position.left,
          width: b.position.width,
          height: b.position.height,
        }}
        onClick={() => !isHQ && onSelectBuilding(b)} // HQ might not be selectable for modal
        title={b.name}
      >
        {isHQ && <span className="text-xs text-yellow-300 font-bold p-1">QG</span>}
      </div>
    );
  };

  return (
    <div
      className="w-full h-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${mapImageUrl})` }}
    >
      {/* Render HQ */}
      {renderBuilding(hq)}

      {/* Render Player Buildings */}
      {buildings.map(renderBuilding)}

      {/* Render Empty Lots */}
      {emptyLots.map((lot) => (
        <div
          key={lot.id}
          className={`absolute cursor-pointer border-2 ${COLORS.borderNeonGold} border-dashed opacity-70 hover:opacity-100 hover:bg-yellow-400 hover:bg-opacity-20 transition-all duration-200 ease-in-out`}
          style={{
            top: lot.position.top,
            left: lot.position.left,
            width: lot.position.width,
            height: lot.position.height,
          }}
          // onClick={() => onSelectLot(lot)} // For future purchase functionality
          title={`Lote Vazio (Custo: $${lot.purchaseCost.toLocaleString()})`}
        ></div>
      ))}
    </div>
  );
};
