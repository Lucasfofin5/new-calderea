document.addEventListener('DOMContentLoaded', () => {

    // --- ESTADO DO JOGO (GAME STATE) ---
    // Agora centraliza os dados dos lotes do mapa
    const gameState = {
        resources: {
            cleanMoney: 15000, // Aumentado para permitir a primeira compra
            dirtyMoney: 0,
            influence: 10,
            heat: 0,
        },
        mapSlots: {
            'slot-hq': {
                id: 'slot-hq',
                owned: true,
                position: { top: '40%', left: '45%' },
                size: { width: '8%', height: '15%' },
                business: {
                    name: 'QG New Caldera',
                    type: 'legit',
                    level: 1,
                    income: 15, // $ por segundo
                    upgradeCost: 10000
                }
            },
            'slot-1': {
                id: 'slot-1',
                owned: false,
                position: { top: '60%', left: '30%' },
                size: { width: '10%', height: '10%' },
                purchaseCost: 12000
            },
            'slot-2': {
                id: 'slot-2',
                owned: false,
                position: { top: '25%', left: '65%' },
                size: { width: '10%', height: '10%' },
                purchaseCost: 15000
            }
        }
    };

    // --- REFERÊNCIAS AOS ELEMENTOS DA UI E MODAL ---
    const ui = {
        cleanMoney: document.getElementById('cleanMoney-display'),
        dirtyMoney: document.getElementById('dirtyMoney-display'),
        influence: document.getElementById('influence-display'),
        heat: document.getElementById('heat-display'),
        missionText: document.getElementById('mission-text'),
        mapContainer: document.getElementById('city-map')
    };

    const modal = {
        overlay: document.getElementById('modal-overlay'),
        title: document.getElementById('modal-title'),
        body: document.getElementById('modal-body'),
        actionBtn: document.getElementById('modal-action-btn'),
        closeBtn: document.getElementById('modal-close-btn')
    };

    // --- FUNÇÕES DO MODAL ---
    function showModal() { modal.overlay.classList.remove('hidden'); }
    function hideModal() { modal.overlay.classList.add('hidden'); }

    modal.closeBtn.addEventListener('click', hideModal);

    function openBuildingMenu(slotId) {
        const slot = gameState.mapSlots[slotId];
        const biz = slot.business;

        modal.title.textContent = biz.name;
        modal.body.innerHTML = `
            <p>Nível: ${biz.level}</p>
            <p>Renda (Limpa): $${biz.income}/s</p>
            <p>Custo do Upgrade: $${biz.upgradeCost.toLocaleString('pt-BR')}</p>
        `;
        modal.actionBtn.textContent = 'Fazer Upgrade';
        modal.actionBtn.onclick = () => {
            // Lógica do upgrade virá na Parte 3
            alert('Funcionalidade de Upgrade virá na próxima parte!');
        };
        showModal();
    }

    function openPurchaseMenu(slotId) {
        const slot = gameState.mapSlots[slotId];

        modal.title.textContent = 'Comprar Propriedade';
        modal.body.innerHTML = `<p>Este lote está à venda por $${slot.purchaseCost.toLocaleString('pt-BR')}.</p>`;
        modal.actionBtn.textContent = 'Comprar';
        modal.actionBtn.onclick = () => purchaseSlot(slotId);
        showModal();
    }

    // --- LÓGICA DE JOGO ---
    function purchaseSlot(slotId) {
        const slot = gameState.mapSlots[slotId];
        if (gameState.resources.cleanMoney >= slot.purchaseCost) {
            // Deduz o custo
            gameState.resources.cleanMoney -= slot.purchaseCost;
            
            // Atualiza o estado
            slot.owned = true;
            // Adiciona um negócio básico inicial
            slot.business = {
                name: 'Lavanderia (Fachada)',
                type: 'legit',
                level: 1,
                income: 5,
                upgradeCost: 2500
            };

            ui.missionText.textContent = `Nova aquisição! A Lavanderia no lote ${slotId} já está rendendo.`;

            hideModal();
            renderMap(); // Redesenha o mapa para atualizar o estilo do lote
            updateDisplay();
        } else {
            alert('Dinheiro Limpo insuficiente!');
        }
    }

    // --- RENDERIZAÇÃO E ATUALIZAÇÃO ---
    function renderMap() {
        ui.mapContainer.innerHTML = `<img src="https://storage.googleapis.com/gemini-prod/images/42f9b1f9-d81b-4299-813c-3965b35a3964" alt="Mapa da Cidade de New Caldera" class="city-image">`; // Limpa e recria a imagem base
        Object.values(gameState.mapSlots).forEach(slot => {
            const el = document.createElement('div');
            el.id = slot.id;
            el.className = slot.owned ? 'building-owned' : 'building-slot';
            el.style.top = slot.position.top;
            el.style.left = slot.position.left;
            el.style.width = slot.size.width;
            el.style.height = slot.size.height;
            
            el.addEventListener('click', () => {
                if (slot.owned) {
                    openBuildingMenu(slot.id);
                } else {
                    openPurchaseMenu(slot.id);
                }
            });

            ui.mapContainer.appendChild(el);
        });
    }

    function updateDisplay() {
        const res = gameState.resources;
        ui.cleanMoney.textContent = `$ ${Math.floor(res.cleanMoney).toLocaleString('pt-BR')}`;
        ui.dirtyMoney.textContent = `$ ${Math.floor(res.dirtyMoney).toLocaleString('pt-BR')}`;
        ui.influence.textContent = `👑 ${res.influence}`;
        ui.heat.textContent = `🔥 ${res.heat}%`;
    }

    function gameTick() {
        let totalIncome = 0;
        // Itera sobre os lotes, encontra os negócios e soma a renda
        Object.values(gameState.mapSlots).forEach(slot => {
            if (slot.owned && slot.business) {
                totalIncome += slot.business.income;
            }
        });
        
        gameState.resources.cleanMoney += totalIncome;
        updateDisplay();
    }

    // --- INICIALIZAÇÃO DO JOGO ---
    function init() {
        console.log("New Caldera: Parte 2 - Interatividade ativada.");
        renderMap();
        updateDisplay();
        setInterval(gameTick, 1000);
    }

    init();
});
