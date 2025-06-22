// --- O JOGO COMEÇA QUANDO A PÁGINA CARREGA ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ESTADO INICIAL DO JOGO (GAME STATE) ---
    // Um único objeto para guardar todas as informações importantes.
    const gameState = {
        resources: {
            cleanMoney: 5000,
            dirtyMoney: 0,
            influence: 10,
            heat: 0,
        },
        // O QG é o nosso primeiro "negócio"
        businesses: [
            {
                id: 'new-caldera-hq',
                name: 'QG New Caldera',
                type: 'legit',
                level: 1,
                // Ganhos por segundo (no loop do jogo)
                income: 10, // Gera $10 de dinheiro limpo por segundo
            }
        ]
    };

    // --- REFERÊNCIAS AOS ELEMENTOS DA UI ---
    // Guardamos os elementos em variáveis para não ter que buscá-los toda hora.
    const ui = {
        cleanMoney: document.getElementById('cleanMoney-display'),
        dirtyMoney: document.getElementById('dirtyMoney-display'),
        influence: document.getElementById('influence-display'),
        heat: document.getElementById('heat-display'),
        missionText: document.getElementById('mission-text')
    };

    // --- FUNÇÃO PARA ATUALIZAR A TELA ---
    // Pega os dados do `gameState` e exibe na tela.
    function updateDisplay() {
        const res = gameState.resources; // Atalho para os recursos
        ui.cleanMoney.textContent = `$ ${Math.floor(res.cleanMoney).toLocaleString('pt-BR')}`;
        ui.dirtyMoney.textContent = `$ ${Math.floor(res.dirtyMoney).toLocaleString('pt-BR')}`;
        ui.influence.textContent = `👑 ${res.influence}`;
        ui.heat.textContent = `🔥 ${res.heat}%`;
    }

    // --- O CORAÇÃO DO JOGO (GAME LOOP) ---
    // Uma função que roda repetidamente para fazer o jogo progredir.
    function gameTick() {
        // 1. Calcular Ganhos
        let totalIncome = 0;
        gameState.businesses.forEach(business => {
            if (business.type === 'legit') {
                totalIncome += business.income;
            }
        });
        
        // 2. Atualizar o Estado do Jogo
        gameState.resources.cleanMoney += totalIncome;

        // Futuramente, aqui também calcularemos o aumento do Calor,
        // a geração de dinheiro sujo, etc.

        // 3. Atualizar a Tela
        updateDisplay();
    }


    // --- INICIALIZAÇÃO DO JOGO ---
    console.log("New Caldera: Sombra e Poder - Jogo iniciado.");
    console.log("Estado Inicial:", gameState);
    
    // Mostra os valores iniciais na tela assim que o jogo carrega
    updateDisplay();
    
    // Inicia o Game Loop. A função gameTick será executada a cada 1000ms (1 segundo).
    setInterval(gameTick, 1000);

});
