
export enum BuildingId {
  CASA_APOSTAS_1 = 'casa_apostas_1',
  ARMAZEM_SECRETO_1 = 'armazem_secreto_1',
  BOATE_FACHADA_1 = 'boate_fachada_1',
  QG = 'qg_central',
}

export interface Building {
  id: BuildingId | string; // Allow string for potentially dynamic buildings
  name: string;
  level: number;
  position: { top: string; left: string; width: string; height: string };
  incomeDirty?: number;
  heatGeneration?: number;
  upgradeCost?: number;
  isSelected?: boolean;
  isHQ?: boolean;
}

export interface EmptyLot {
  id: string;
  position: { top:string; left: string; width: string; height: string };
  purchaseCost: number;
}

export interface Resources {
  dinheiroLimpo: number;
  dinheiroSujo: number;
  influencia: number;
  calor: number; // Percentage 0-100
}

export enum ExpertStatus {
  CONTRATADO = 'CONTRATADO',
  DISPONIVEL = 'DISPONÍVEL',
}

export interface Expert {
  id: string;
  name: string;
  status: ExpertStatus;
  description: string;
  cost?: number;
}

export interface GameState {
  resources: Resources;
  buildings: Building[];
  emptyLots: EmptyLot[];
  experts: Expert[];
  currentMission: string;
  hq: Building;
}
