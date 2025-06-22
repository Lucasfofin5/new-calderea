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
    const modal = {
        overlay: document.getElementById('modal-overlay'), title: document.getElementById('modal-title'), body: document.getElementById('modal-body'), businessChoice: document.getElementById('modal-business-choice'), choiceLegitBtn: document.getElementById('choice-legit-btn'), choiceIllegalBtn: document.getElementById('choice-illegal-btn'), actionBtn: document.getElementById('modal-action-btn'), closeBtn: document.getElementById('modal-close-btn')
    };

    // --- FUNÇÕES DE LÓGICA DE JOGO ---
    function hasSpecialist(id) { return gameState.hiredSpecialists.includes(id); }

    function hireSpecialist(id) {
        const blueprint = specialistBlueprints[id];
        if (!hasSpecialist(id) && gameState.resources.influence >= blueprint.cost) {
            gameState.resources.influence -= blueprint.cost;
            gameState.hiredSpecialists.push(id);
            ui.missionText.textContent = `Recrutamos: ${blueprint.name}.`;
            renderSpecialists();
            updateDisplay();
        } else {
            alert('Influência insuficiente ou especialista já contratado!');
        }
    }
    
    function launderMoney() {
        const amount = gameState.resources.dirtyMoney;
        if (amount <= 0) {
            alert("Você não tem dinheiro sujo para lavar.");
            return;
        }
        let fee = 0.3;
        // CORREÇÃO: Verifica se o especialista existe antes de aplicar o efeito
        if (hasSpecialist('accountant')) {
            fee = 0.3 * specialistBlueprints.accountant.effect.value; // Perda de 24% em vez de 20%
        }
        
        const launderedAmount = amount * (1 - fee);
        
        gameState.resources.dirtyMoney = 0;
        gameState.resources.cleanMoney += launderedAmount;
        gameState.resources.heat += 5;
        
        ui.missionText.textContent = `$${amount.toLocaleString('pt-BR')} lavados. Recuperamos $${launderedAmount.toLocaleString('pt-BR')}.`;
        hideModal();
    }

    function upgradeBusiness(slotId) {
        const biz = gameState.mapSlots[slotId]?.business;
        // CORREÇÃO: Verifica se o negócio e a planta existem
        if (!biz || !businessBlueprints[biz.id]) return;

        const blueprint = businessBlueprints[biz.id];
        const currentLevelData = blueprint.levels[biz.level - 1];

        if (biz.level < blueprint.maxLevel && gameState.resources.cleanMoney >= currentLevelData.upgradeCost) {
            gameState.resources.cleanMoney -= currentLevelData.upgradeCost;
            biz.level++;
            ui.missionText.textContent = `A "${biz.name}" foi melhorada para o nível ${biz.level}!`;
            openBuildingMenu(slotId);
            updateDisplay();
        } else {
            alert('Dinheiro insuficiente ou nível máximo atingido!');
        }
    }

    function createBusiness(slotId, blueprintId) {
        const slot = gameState.mapSlots[slotId];
        const blueprint = businessBlueprints[blueprintId];
        
        slot.owned = true;
        slot.business = { id: blueprintId, name: blueprint.name, type: blueprint.type, level: 1 };
        
        ui.missionText.textContent = `Operação iniciada: Uma nova "${blueprint.name}" no lote ${slotId}.`;
        hideModal();
        renderMap();
        updateDisplay();
    }

    function purchaseSlot(slotId) {
        const slot = gameState.mapSlots[slotId];
        if (gameState.resources.cleanMoney >= slot.purchaseCost) {
            gameState.resources.cleanMoney -= slot.purchaseCost;
            modal.actionBtn.classList.add('hidden');
            modal.businessChoice.classList.remove('hidden');
            modal.choiceLegitBtn.onclick = () => createBusiness(slotId, 'laundromat');
            modal.choiceIllegalBtn.onclick = () => createBusiness(slotId, 'gamblingDen');
            updateDisplay();
        } else {
            alert('Dinheiro Limpo insuficiente!');
        }
    }

    // --- SISTEMA DE EVENTOS ---
    function triggerEvent(event) {
        // CORREÇÃO: Verifica se o evento é válido
        if (!event) {
            console.error("Tentativa de acionar um evento inválido.");
            return;
        }
        showEventBanner(event.text, event.type);
        switch (event.effect.type) {
            case 'add_resource':
                gameState.resources[event.effect.resource] += event.effect.value;
                break;
            case 'shutdown_random_illegal':
                const illegalBusinesses = Object.values(gameState.mapSlots).filter(s => s.owned && s.business?.type === 'illegal' && !s.business?.isShutdown);
                if (illegalBusinesses.length > 0) {
                    const target = illegalBusinesses[Math.floor(Math.random() * illegalBusinesses.length)];
                    // CORREÇÃO: Garante que o objeto de negócio existe
                    if (target.business) {
                        target.business.isShutdown = true;
                        target.business.shutdownTimer = 60;
                        renderMap();
                    }
                }
                break;
            case 'temp_boost':
                gameState.activeBoosts[event.effect.boostType] = { value: event.effect.value, duration: event.effect.duration };
                break;
        }
    }
    
    function checkForEvents() {
        const heatRaidEvent = eventBlueprints.find(e => e.id === 'raid');
        if (gameState.resources.heat >= heatRaidEvent.trigger.value) {
            if (Math.random() < 0.03) { // 3% de chance por segundo com calor alto
                triggerEvent(heatRaidEvent);
                gameState.resources.heat -= 30;
            }
        }
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
                html += `<button class="hire-btn" data-id="${id}">Recrutar (👑 ${blueprint.cost})</button>`;
            }
            item.innerHTML = html;
            ui.specialistsList.appendChild(item);
        });
        // Adiciona os event listeners após criar os botões
        ui.specialistsList.querySelectorAll('.hire-btn').forEach(btn => {
            btn.addEventListener('click', (e) => hireSpecialist(e.target.dataset.id));
        });
    }
    
    function showEventBanner(text, type) {
        ui.eventBannerText.textContent = text;
        ui.eventBanner.className = `event-${type} visible`;
        setTimeout(() => { ui.eventBanner.classList.remove('visible'); }, 5000);
    }

    function renderMap() {
        ui.mapContainer.innerHTML = `<img src="https://storage.googleapis.com/gemini-prod/images/42f9b1f9-d81b-4299-813c-3965b35a3964" alt="Mapa da Cidade de New Caldera" class="city-image">`;
        Object.values(gameState.mapSlots).forEach(slot => {
            const el = document.createElement('div');
            el.id = slot.id;
            el.className = slot.owned ? 'building-owned' : 'building-slot';
            // CORREÇÃO: Adiciona a classe de shutdown de forma segura
            if (slot.business?.isShutdown) {
                el.classList.add('shutdown');
            }
            el.style.top = slot.position.top;
            el.style.left = slot.position.left;
            el.style.width = slot.size.width;
            el.style.height = slot.size.height;
            el.addEventListener('click', () => {
                if (slot.owned) { openBuildingMenu(slot.id); } else { openPurchaseMenu(slot.id); }
            });
            ui.mapContainer.appendChild(el);
        });
    }

    function openBuildingMenu(slotId) {
        const slot = gameState.mapSlots[slotId];
        const biz = slot?.business;
        // CORREÇÃO: Se não houver negócio, não abre o menu.
        if (!biz) return;
        
        modal.actionBtn.disabled = false;
        if (biz.type === 'hq') {
            modal.title.textContent = biz.name;
            modal.body.innerHTML = `<p>O centro do seu império.</p><p>Renda (Limpa): $${biz.income}/s</p>`;
            modal.actionBtn.textContent = 'Lavar Dinheiro';
            modal.actionBtn.onclick = () => launderMoney();
        } else {
            const blueprint = businessBlueprints[biz.id];
            const currentLevelData = blueprint.levels[biz.level - 1];
            modal.title.textContent = biz.name;
            let bodyHTML = `<p>Nível: ${biz.level}/${blueprint.maxLevel}</p>`;
            if (biz.isShutdown) {
                bodyHTML += `<p style="color: #f44336;">FECHADO PELA POLÍCIA!</p><p>Reabre em: ${biz.shutdownTimer}s</p>`;
            }
            if(currentLevelData.income) bodyHTML += `<p>Renda (Limpa): $${currentLevelData.income}/s</p>`;
            if(currentLevelData.dirtyIncome) bodyHTML += `<p>Renda (Suja): $${currentLevelData.dirtyIncome}/s</p>`;
            if(currentLevelData.heat) bodyHTML += `<p>Gera Calor: +${currentLevelData.heat.toFixed(2)}/s</p>`;
            
            if(biz.level < blueprint.maxLevel) {
                bodyHTML += `<p>Custo do Upgrade: $${currentLevelData.upgradeCost.toLocaleString('pt-BR')}</p>`;
                modal.actionBtn.textContent = 'Fazer Upgrade';
                modal.actionBtn.onclick = () => upgradeBusiness(slotId);
            } else {
                bodyHTML += `<p>Nível Máximo Atingido!</p>`;
                modal.actionBtn.textContent = 'Nível Máximo';
                modal.actionBtn.disabled = true;
            }
            modal.body.innerHTML = bodyHTML;
        }
        // CORREÇÃO: Esconde o menu de escolha de negócio ao abrir um prédio
        modal.businessChoice.classList.add('hidden');
        modal.actionBtn.classList.remove('hidden');
        showModal();
    }

    function openPurchaseMenu(slotId) {
        const slot = gameState.mapSlots[slotId];
        modal.title.textContent = 'Comprar Propriedade';
        modal.body.innerHTML = `<p>Este lote está à venda por $${slot.purchaseCost.toLocaleString('pt-BR')}.</p>`;
        modal.actionBtn.textContent = 'Confirmar Compra';
        modal.actionBtn.onclick = () => purchaseSlot(slotId);
        modal.actionBtn.classList.remove('hidden');
        modal.businessChoice.classList.add('hidden');
        showModal();
    }

    function showModal() { modal.overlay.classList.remove('hidden'); }
    function hideModal() { modal.overlay.classList.add('hidden'); }
    modal.closeBtn.addEventListener('click', hideModal);

    function updateDisplay() {
        const res = gameState.resources;
        ui.cleanMoney.textContent = `$ ${Math.floor(res.cleanMoney).toLocaleString('pt-BR')}`;
        ui.dirtyMoney.textContent = `$ ${Math.floor(res.dirtyMoney).toLocaleString('pt
