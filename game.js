document.addEventListener('DOMContentLoaded', () => {

    // --- BLUEPRINTS (Plantas do Jogo) ---
    const businessBlueprints = {
        laundromat: { name: 'Lavanderia', type: 'legit', maxLevel: 5, levels: [ { level: 1, income: 8, upgradeCost: 3000 }, { level: 2, income: 15, upgradeCost: 7500 }, { level: 3, income: 25, upgradeCost: 18000 }, { level: 4, income: 40, upgradeCost: 40000 }, { level: 5, income: 60, upgradeCost: 0 } ] },
        gamblingDen: { name: 'Casa de Apostas', type: 'illegal', maxLevel: 5, levels: [ { level: 1, dirtyIncome: 60, heat: 0.2, upgradeCost: 5000 }, { level: 2, dirtyIncome: 110, heat: 0.4, upgradeCost: 12000 }, { level: 3, dirtyIncome: 180, heat: 0.7, upgradeCost: 25000 }, { level: 4, dirtyIncome: 270, heat: 1.1, upgradeCost: 50000 }, { level: 5, dirtyIncome: 400, heat: 1.6, upgradeCost: 0 } ] }
    };

    const specialistBlueprints = {
        lawyer: { name: 'Advogado Astuto', description: 'Reduz todo o acúmulo de Calor em 25%.', cost: 50, effect: { type: 'heat_modifier', value: 0.75 } },
        accountant: { name: 'Contador Discreto', description: 'Aumenta a eficiência da lavagem de dinheiro em 10% (menos perdas).', cost: 40, effect: { type: 'laundering_modifier', value: 0.8 } },
        enforcer: { name: 'Capanga Leal', description: 'Aumenta os lucros de operações ilegais em 10%.', cost: 70, effect: { type: 'illegal_income_modifier', value: 1.1 } }
    };

    const eventBlueprints = [
        { id: 'raid', text: 'BATIDA POLICIAL! Uma de suas operações foi fechada por 60 segundos!', type: 'bad', trigger: { type: 'heat_threshold', value: 90 }, effect: { type: 'shutdown_random_illegal' } },
        { id: 'extortion', text: 'Suas operações de "proteção" foram um sucesso! Ganhos inesperados.', type: 'good', trigger: { type: 'random', chance: 0.02 }, effect: { type: 'add_resource', resource: 'dirtyMoney', value: 7500 } },
        { id: 'economic_boom', text: 'A economia da cidade está em alta! Negócios legítimos lucram 50% a mais por 90 segundos.', type: 'good', trigger: { type: 'random', chance: 0.01 }, effect: { type: 'temp_boost', boostType: 'legit_income_modifier', value: 1.5, duration: 90 } },
        { id: 'informant', text: 'Um informante da polícia foi descoberto! Ganhamos 20 de Influência.', type: 'neutral', trigger: { type: 'random', chance: 0.015 }, effect: { type: 'add_resource', resource: 'influence', value: 20 } }
    ];

    // --- ESTADO INICIAL DO JOGO ---
    const gameState = {
        resources: { cleanMoney: 20000, dirtyMoney: 0, influence: 60, heat: 0 },
        mapSlots: {
            'slot-hq': { id: 'slot-hq', owned: true, position: { top: '40%', left: '45%' }, size: { width: '8%', height: '15%' }, business: { name: 'QG New Caldera', type: 'hq', level: 1, income: 20 } },
            'slot-1': { id: 'slot-1', owned: false, position: { top: '60%', left: '30%' }, size: { width: '10%', height: '10%' }, purchaseCost: 18000 },
            'slot-2': { id: 'slot-2', owned: false, position: { top: '25%', left: '65%' }, size: { width: '10%', height: '10%' }, purchaseCost: 22000 }
        },
        hiredSpecialists: [],
        activeBoosts: {},
    };

    // --- REFERÊNCIAS AOS ELEMENTOS DA UI ---
    const ui = {
        cleanMoney: document.getElementById('cleanMoney-display'), dirtyMoney: document.getElementById('dirtyMoney-display'), influence: document.getElementById('influence-display'), heat: document.getElementById('heat-display'), missionText: document.getElementById('mission-text'), mapContainer: document.getElementById('city-map'),
        specialistsList: document.getElementById('specialists-list'), eventBanner: document.getElementById('event-banner'), eventBannerText: document.getElementById('event-banner-text')
    };
    const modal = { /* ... como na parte 3, mas sem necessidade de recriar ... */ overlay: document.getElementById('modal-overlay'), title: document.getElementById('modal-title'), body: document.getElementById('modal-body'), businessChoice: document.getElementById('modal-business-choice'), choiceLegitBtn: document.getElementById('choice-legit-btn'), choiceIllegalBtn: document.getElementById('choice-illegal-btn'), actionBtn: document.getElementById('modal-action-btn'), closeBtn: document.getElementById('modal-close-btn') };

    // --- FUNÇÕES DE LÓGICA DE JOGO ---
    function hasSpecialist(id) { return gameState.hiredSpecialists.includes(id); }

    function hireSpecialist(id) {
        const blueprint = specialistBlueprints[id];
        if (!hasSpecialist(id) && gameState.resources.influence >= blueprint.cost) {
            gameState.resources.influence -= blueprint.cost;
            gameState.hiredSpecialists.push(id);
            ui.missionText.textContent = `Recrutamos um novo especialista: ${blueprint.name}.`;
            renderSpecialists();
            updateDisplay();
        } else {
            alert('Influência insuficiente ou especialista já contratado!');
        }
    }
    
    function launderMoney() {
        const amount = gameState.resources.dirtyMoney;
        if (amount <= 0) return alert("Nada para lavar.");
        let fee = 0.3; // 30% de perda
        if (hasSpecialist('accountant')) fee = 0.2; // Contador reduz a perda para 20%
        
        const laundered = amount * (1 - fee);
        gameState.resources.dirtyMoney = 0;
        gameState.resources.cleanMoney += laundered;
        gameState.resources.heat += 5;
        ui.missionText.textContent = `$${amount.toLocaleString('pt-BR')} lavados. Recuperamos $${laundered.toLocaleString('pt-BR')}.`;
        hideModal();
    }

    function upgradeBusiness(slotId) { /* ... como na parte 3 ... */ }
    function createBusiness(slotId, blueprintId) { /* ... como na parte 3 ... */ }
    function purchaseSlot(slotId) { /* ... como na parte 3 ... */ }

    // --- SISTEMA DE EVENTOS ---
    function triggerEvent(event) {
        showEventBanner(event.text, event.type);
        // Aplica o efeito do evento
        switch (event.effect.type) {
            case 'add_resource':
                gameState.resources[event.effect.resource] += event.effect.value;
                break;
            case 'shutdown_random_illegal':
                const illegalBusinesses = Object.values(gameState.mapSlots).filter(s => s.owned && s.business && s.business.type === 'illegal' && !s.business.isShutdown);
                if (illegalBusinesses.length > 0) {
                    const target = illegalBusinesses[Math.floor(Math.random() * illegalBusinesses.length)];
                    target.business.isShutdown = true;
                    target.business.shutdownTimer = 60; // 60 segundos
                    renderMap(); // Atualiza visual do prédio
                }
                break;
            case 'temp_boost':
                gameState.activeBoosts[event.effect.boostType] = { value: event.effect.value, duration: event.effect.duration };
                break;
        }
    }
    
    function checkForEvents() {
        // Eventos de Limite (threshold)
        if (gameState.resources.heat >= 90) {
            const raidEvent = eventBlueprints.find(e => e.id === 'raid');
            if (Math.random() < 0.05) { // 5% de chance por segundo com calor alto
                triggerEvent(raidEvent);
                gameState.resources.heat -= 30; // Alivia um pouco o calor após a batida
            }
        }

        // Eventos Aleatórios
        eventBlueprints.forEach(event => {
            if (event.trigger.type === 'random' && Math.random() < event.trigger.chance) {
                triggerEvent(event);
            }
        });
    }

    // --- RENDERIZAÇÃO E UI ---
    function renderSpecialists() {
        ui.specialistsList.innerHTML = '';
        Object.entries(specialistBlueprints).forEach(([id, blueprint]) => {
            const item = document.createElement('div');
            item.className = 'specialist-item';
            let html = `<p><strong>${blueprint.name}</strong><br>${blueprint.description}</p>`;
            if (hasSpecialist(id)) {
                html += `<span class="hired-tag">CONTRATADO</span>`;
            } else {
                const btn = document.createElement('button');
                btn.className = 'hire-btn';
                btn.textContent = `Recrutar (👑 ${blueprint.cost})`;
                btn.onclick = () => hireSpecialist(id);
                item.innerHTML = html;
                item.appendChild(btn);
            }
            item.innerHTML = html;
            ui.specialistsList.appendChild(item);
        });
    }
    
    function showEventBanner(text, type) {
        ui.eventBannerText.textContent = text;
        ui.eventBanner.className = `event-${type} visible`;
        setTimeout(() => {
            ui.eventBanner.classList.remove('visible');
        }, 5000); // Banner some após 5 segundos
    }

    // --- RENDERIZAÇÃO E MENUS (sem grandes mudanças, apenas adaptações) ---
    function renderMap() { /* ... adaptado para incluir a classe 'shutdown' ... */ }
    function openBuildingMenu(slotId) { /* ... adaptado para mostrar status 'Fechado' ... */ }
    function openPurchaseMenu(slotId) { /* ... como na parte 3 ... */ }
    function showModal() { /* ... como na parte 3 ... */ }
    function hideModal() { /* ... como na parte 3 ... */ }
    function updateDisplay() { /* ... como na parte 3 ... */ }

    // --- GAME LOOP (ATUALIZADO) ---
    function gameTick() {
        // 1. Processar boosts e timers
        Object.keys(gameState.activeBoosts).forEach(key => {
            gameState.activeBoosts[key].duration--;
            if (gameState.activeBoosts[key].duration <= 0) delete gameState.activeBoosts[key];
        });
        Object.values(gameState.mapSlots).forEach(slot => {
            if (slot.business?.isShutdown) {
                slot.business.shutdownTimer--;
                if (slot.business.shutdownTimer <= 0) {
                    slot.business.isShutdown = false;
                    renderMap(); // Atualiza o visual
                }
            }
        });

        // 2. Calcular Ganhos e Calor
        let cleanIncome = 0;
        let dirtyIncome = 0;
        let heatGeneration = 0;

        Object.values(gameState.mapSlots).forEach(slot => {
            if (slot.owned && slot.business && !slot.business.isShutdown) {
                // ... lógica de cálculo de renda como antes ...
            }
        });

        // 3. Aplicar Modificadores de Especialistas e Boosts
        let illegalIncomeModifier = hasSpecialist('enforcer') ? specialistBlueprints.enforcer.effect.value : 1;
        let legitIncomeModifier = gameState.activeBoosts.legit_income_modifier?.value || 1;
        let heatModifier = hasSpecialist('lawyer') ? specialistBlueprints.lawyer.effect.value : 1;
        
        dirtyIncome *= illegalIncomeModifier;
        cleanIncome *= legitIncomeModifier;
        heatGeneration *= heatModifier;

        // 4. Aplicar Ganhos e Dissipação de Calor
        const heatDecay = 0.1;
        gameState.resources.cleanMoney += cleanIncome;
        gameState.resources.dirtyMoney += dirtyIncome;
        gameState.resources.heat = Math.max(0, gameState.resources.heat - heatDecay + heatGeneration);
        gameState.resources.heat = Math.min(100, gameState.resources.heat);

        // 5. Checar por Novos Eventos
        checkForEvents();

        // 6. Atualizar a Tela
        updateDisplay();
    }

    // --- INICIALIZAÇÃO ---
    function init() {
        console.log("New Caldera: Parte 4 - Mundo Dinâmico ativado.");
        renderMap();
        renderSpecialists();
        updateDisplay();
        setInterval(gameTick, 1000);
    }

    // Funções omitidas para brevidade, pois a lógica interna não mudou drasticamente, apenas as chamadas.
    // O código completo deve ser colado diretamente.
    // ... colar aqui as funções completas da parte 3 para:
    // upgradeBusiness, createBusiness, purchaseSlot, renderMap, openBuildingMenu, etc.
    // As adaptações necessárias estão comentadas acima (ex: checar por `isShutdown`)

    init(); // Inicia o jogo
});

// Nota: Para o código acima funcionar, as funções que marquei como "sem grandes mudanças"
// devem ser copiadas da Parte 3. A lógica para renderizar o mapa, por exemplo,
// precisa apenas adicionar uma linha: `if (slot.business?.isShutdown) el.classList.add('shutdown');`
