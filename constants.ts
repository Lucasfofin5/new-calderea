
import { GameState, BuildingId, ExpertStatus } from './types';

export const MAP_IMAGE_URL = 'https://i.imgur.com/qWBlV12.jpeg';
export const MAFIOSO_PORTRAIT_URL = 'https://i.imgur.com/h7sd6gd.jpeg';

export const INITIAL_GAME_STATE: GameState = {
  resources: {
    dinheiroLimpo: 2450110,
    dinheiroSujo: 850300,
    influencia: 750,
    calor: 85,
  },
  hq: {
    id: BuildingId.QG,
    name: "New Caldera QG",
    level: 1,
    position: { top: '48%', left: '46%', width: '12%', height: '12%' }, // Adjusted for prominence
    isHQ: true,
  },
  buildings: [
    {
      id: BuildingId.CASA_APOSTAS_1,
      name: "Casa de Apostas",
      level: 4,
      position: { top: '30%', left: '25%', width: '8%', height: '8%' },
      incomeDirty: 270,
      heatGeneration: 1.1,
      upgradeCost: 50000,
      isSelected: true, 
    },
    {
      id: BuildingId.ARMAZEM_SECRETO_1,
      name: "Armazém Secreto",
      level: 2,
      position: { top: '60%', left: '60%', width: '7%', height: '7%' },
      incomeDirty: 150,
      heatGeneration: 0.8,
      upgradeCost: 30000,
    },
    {
      id: BuildingId.BOATE_FACHADA_1,
      name: "Boate de Fachada",
      level: 3,
      position: { top: '70%', left: '35%', width: '9%', height: '9%' },
      incomeDirty: 200,
      heatGeneration: 0.9,
      upgradeCost: 40000,
    },
  ],
  emptyLots: [
    { id: 'lot1', position: { top: '20%', left: '50%', width: '7%', height: '6%' }, purchaseCost: 100000 },
    { id: 'lot2', position: { top: '55%', left: '15%', width: '6%', height: '7%' }, purchaseCost: 120000 },
     { id: 'lot3', position: { top: '35%', left: '70%', width: '7%', height: '7%' }, purchaseCost: 150000 },
  ],
  experts: [
    { id: 'advogado', name: "Advogado Astuto", status: ExpertStatus.CONTRATADO, description: "Reduz o ganho de Calor em 10%." },
    { id: 'contador', name: "Contador Discreto", status: ExpertStatus.CONTRATADO, description: "Aumenta a eficiência da lavagem de dinheiro em 5%." },
    { id: 'capanga', name: "Capanga Leal", status: ExpertStatus.DISPONIVEL, description: "Aumenta a Influência passivamente.", cost: 50000 },
  ],
  currentMission: "A polícia está de olho em nós. Lave o dinheiro ou contrate um advogado.",
};

// Tailwind color class names for easy reference and consistency
export const COLORS = {
  neonCyan: 'cyan-400',
  neonGold: 'yellow-400',
  neonRed: 'red-500',
  borderNeonCyan: 'border-cyan-400',
  borderNeonGold: 'border-yellow-400',
  textNeonCyan: 'text-cyan-400',
  shadowNeonCyan: 'shadow-[0_0_15px_rgba(0,255,255,0.7)]',
  shadowNeonGold: 'shadow-[0_0_15px_rgba(255,215,0,0.7)]',
  panelBg: 'bg-slate-800 bg-opacity-75 backdrop-blur-sm', // Darker and more noir
  modalBg: 'bg-slate-900 bg-opacity-90 backdrop-blur-md',
};
