const host = 'http://192.168.3.4:8080';

document.addEventListener('DOMContentLoaded', function() {

    const input_nome_mt = document.getElementById('entrada_nome_MT');
    const botao_escolher_nome_mt = document.getElementById('btn_inserir_nome_MT');
    const container_nome_mt = document.getElementById('container_nome_MT');

    const input_quantidade_estados_mt = document.getElementById('input_quantidade_estados_MT');
    const botao_inserir_estados_mt = document.getElementById('btn_inserir_estados_MT');
    const container_quantidade_mt = document.getElementById('container_estados_MT');

    const alfabeto_mt = document.getElementById('entrada_alfabeto_MT');
    const botao_alfabeto_mt = document.getElementById('btn_inserir_alfabeto_MT');
    const container_alfabeto_mt = document.getElementById('container_alfabeto_MT');
    
    const transicoes_mt = document.getElementById('transicoes_form_container_MT');
    const botao_transicoes_mt = document.getElementById('btn_inserir_transicoes_MT');
    const container_transicoes_mt = document.getElementById('transicoes_container_MT');

    const container_estado_inicial_mt = document.getElementById('container_estado_inicial_MT');

    const estados_aceitacao_container_mt = document.getElementById('container_estados_aceitacao_MT');
    const container_mt_concluido = document.getElementById('container_concluido_mt');
    const botao_reset_mt = document.getElementById('btn_reset_MT');

    const botao_concluir_maquina = document.getElementById('concluir_maquina');
    const botao_adicionar_outra_maquina = document.getElementById('outra_maquina');

    // Variáveis que serão a 8-upla da máquina de Turing
    let maquinaForm = {
        nome_mt: '',
        tipo: 'MT',
        estados_mt: [],
        alfabeto_mt: [],
        alfabeto_fita_mt: [],
        x: 'x',
        y: 'y',
        transicoes_mt: new Map(),
        estadoInicial_mt: '',
        estadosAceitacao_mt: []
    };

    botao_reset_mt.addEventListener('click', function() {
        location.reload(); 
        botao_reset_mt.disabled = true; 
    });

    botao_escolher_nome_mt.addEventListener('click', function(event) {
        event.preventDefault();
        const nome_entrada_mt = input_nome_mt.value.trim();
        if (nome_entrada_mt !== '') {
            maquinaForm.nome_mt = nome_entrada_mt; 
            input_quantidade_estados_mt.disabled = false;
            botao_inserir_estados_mt.disabled = false;
            input_nome_mt.disabled = true;
            botao_escolher_nome_mt.disabled = true;
            botao_reset_mt.disabled = false;
            container_nome_mt.innerHTML = `Nome escolhido: <strong>${nome_entrada_mt}</strong>`;
        } else {
            input_quantidade_estados_mt.disabled = true;
            botao_quantidade_mt.disabled = true;
            alert("Por favor, insira um nome válido.");
        }
    });

    botao_inserir_estados_mt.addEventListener('click', function(event){
        event.preventDefault();


        const quantidade_estados_mt = input_quantidade_estados_mt.value;

        if(quantidade_estados_mt > 0){

            quantidade_estados_mt.disabled = true;
            botao_inserir_estados_mt.disabled = true;

            alfabeto_mt.disabled = false;
            botao_alfabeto_mt.disabled = false;

            container_quantidade_mt.innerHTML = '';
            container_alfabeto_mt.innerHTML = '';
            
    

            for(let i = 0 ; i < quantidade_estados_mt ; i++){
                maquinaForm.estados_mt.push(`q${i}`);
                const estado_msg_mt = document.createElement('p');
                estado_msg_mt.innerHTML += `Estado ${i+1} inserido: <strong>q${i}</strong>.`;
                container_quantidade_mt.appendChild(estado_msg_mt);
            }
    
        }else{
            alert("Por favor insira uma quantidade válida de estados.");
        }
    });

    botao_alfabeto_mt.addEventListener('click', function(event){
        event.preventDefault();
        
        const alfabeto_entrada = alfabeto_mt.value;
    
        if(alfabeto_entrada.trim() !== ''){
            maquinaForm.alfabeto_mt = alfabeto_entrada.trim().split(/\s+/);
    
            const invalidSymbols = maquinaForm.alfabeto_mt.filter(symbol => symbol.length !== 1);
    
            if (invalidSymbols.length > 0) {
                alert('Por favor, insira apenas caracteres únicos separados por espaços.');
            } else {

    
                alfabeto_entrada.value = '';
    
                alfabeto_entrada.disabled = true;
                botao_alfabeto_mt.disabled = true;
    
                botao_transicoes_mt.disabled = false;
            
                for(const letra of maquinaForm.alfabeto_mt){
                    maquinaForm.alfabeto_fita_mt.push(letra);
                    const alfabeto_msg_mt = document.createElement('p');
                    alfabeto_msg_mt.innerHTML = `Símbolo adicionado: <strong>${letra}</strong>`;
                    container_alfabeto_mt.appendChild(alfabeto_msg_mt);
                }

                maquinaForm.alfabeto_fita_mt.push(maquinaForm.x);
                maquinaForm.alfabeto_fita_mt.push(maquinaForm.y);
                maquinaForm.alfabeto_fita_mt.push('-');

                const fita_completa = document.createElement('p');
                fita_completa.innerHTML = `Alfabeto da fita: <strong>${maquinaForm.alfabeto_fita_mt.join(', ')}</strong>`;
                container_alfabeto_mt.appendChild(fita_completa);
    
                container_transicoes_mt.style.display = 'block';
                gerarFormularioTransicoesMT();
            }
        }else{
            alert('Por favor, insira um alfabeto válido.');
        }
    });

    function gerarFormularioTransicoesMT() {
        container_transicoes_mt.innerHTML = '';
    
        maquinaForm.estados_mt.forEach(estado => {
            maquinaForm.alfabeto_fita_mt.forEach(simbolo => {
                criarTransicao_MT(estado, simbolo);
            });
        });
    }

    function criarTransicao_MT(estado_mt, simbolo_mt) {
        const transicao_div_mt = document.createElement('div');
        transicao_div_mt.className = 'transicao_mt';
    
        const origem_simbolo_paragrafo_mt = document.createElement('p');
        origem_simbolo_paragrafo_mt.innerHTML = `<strong>Origem:</strong> ${estado_mt} <br> <strong>Símbolo:</strong> ${simbolo_mt}`;
        transicao_div_mt.appendChild(origem_simbolo_paragrafo_mt);
    
        const select_mt = document.createElement('select');
        select_mt.name = `${estado_mt}_${simbolo_mt}_destino`;
        select_mt.className = 'transicao_input_mt';
        //select_mt.multiple = true;
    
        const option_vazia_mt = document.createElement('option');
        option_vazia_mt.value = '';
        option_vazia_mt.textContent = 'Selecione o estado de destino';
        select_mt.appendChild(option_vazia_mt);
    
        maquinaForm.estados_mt.forEach(destino_mt => {
            const option_mt = document.createElement('option');
            option_mt.value = destino_mt;
            option_mt.textContent = destino_mt;
            select_mt.appendChild(option_mt);
        });
    
        transicao_div_mt.appendChild(select_mt);
    
        const novoSimboloInput_mt = document.createElement('input');
        novoSimboloInput_mt.type = 'text';
        novoSimboloInput_mt.name = `${estado_mt}_${simbolo_mt}_novoSimbolo`;
        novoSimboloInput_mt.placeholder = 'Novo símbolo';
        novoSimboloInput_mt.maxLength = 1;
        transicao_div_mt.appendChild(novoSimboloInput_mt);
    
        const movimentoSelect_mt = document.createElement('select');
        movimentoSelect_mt.name = `${estado_mt}_${simbolo_mt}_movimento`;
        movimentoSelect_mt.className = 'transicao_input_mt';
    
        const optionL_mt = document.createElement('option');
        optionL_mt.value = 'L';
        optionL_mt.textContent = 'Esquerda (L)';
        movimentoSelect_mt.appendChild(optionL_mt);
    
        const optionR_mt = document.createElement('option');
        optionR_mt.value = 'R';
        optionR_mt.textContent = 'Direita (R)';
        movimentoSelect_mt.appendChild(optionR_mt);
    
        const optionS_mt = document.createElement('option');
        optionS_mt.value = 'S';
        optionS_mt.textContent = 'Permanecer (S)';
        movimentoSelect_mt.appendChild(optionS_mt);
    
        transicao_div_mt.appendChild(movimentoSelect_mt);
    
        container_transicoes_mt.appendChild(transicao_div_mt);
    }

    botao_transicoes_mt.addEventListener('click', function(event){
        event.preventDefault();
    
        let transicoesValidas = true;
        const transicoesInput_mt = document.querySelectorAll('.transicao_input_mt');
    
        transicoesInput_mt.forEach(input => {
            const [estadoAtual, simbolo] = input.name.split('_');
            const estadoDestinoElem = document.querySelector(`select[name="${estadoAtual}_${simbolo}_destino"]`);
            const estadoDestino = estadoDestinoElem ? estadoDestinoElem.value : null;
            const simboloEscritoElem = document.querySelector(`input[name="${estadoAtual}_${simbolo}_novoSimbolo"]`);
            const simboloEscrito = simboloEscritoElem ? simboloEscritoElem.value : null;
            const movimentoElem = document.querySelector(`select[name="${estadoAtual}_${simbolo}_movimento"]`);
            const movimento = movimentoElem ? movimentoElem.value : null;
    
            if (estadoDestino && simboloEscrito && movimento) {
                const chave = `${estadoAtual}_${simbolo}`;
                maquinaForm.transicoes_mt.set(chave, {
                    estadoDestino,
                    simboloEscrito,
                    movimento
                });
            }
        });
    
        if (transicoesValidas) {
            const transicao_msg_mt = document.createElement('p');
            transicao_msg_mt.innerHTML = '<strong>Transições inseridas com sucesso.</strong>';
            transicoes_mt.style.display = 'none';
            container_transicoes_mt.appendChild(transicao_msg_mt);
    
            botao_transicoes_mt.disabled = true;
            gerarEstadoInicialMT();
            gerarEstadosAceitacaoMT();
        } else {
            alert('Por favor, preencha todas as transições corretamente.');
        }
    });
    
    function mapTransicoes() {
        const transicoes_formatadas_mt = {};
    
        maquinaForm.transicoes_mt.forEach((transicao, chave) => {
            const [estadoOrigem, simbolo] = chave.split("_");
            
            if (!transicoes_formatadas_mt[estadoOrigem]) {
                transicoes_formatadas_mt[estadoOrigem] = {};
            }
    
            transicoes_formatadas_mt[estadoOrigem][simbolo] = {
                estadoDestino: transicao.estadoDestino,
                simboloEscrito: transicao.simboloEscrito,
                movimento: transicao.movimento
            };
        });
    
        return transicoes_formatadas_mt;
    }


    function criarCheckboxes(container, label) {
        container.innerHTML = ''; // Limpa o conteúdo atual

        maquinaForm.estados_mt.forEach(estado => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = `${label}_${estado}`;
            checkbox.value = estado;

            const checkboxLabel = document.createElement('label');
            checkboxLabel.textContent = estado;
            checkboxLabel.appendChild(checkbox);

            container.appendChild(checkboxLabel);
        });
    }

    function gerarEstadoInicialMT() {
        criarCheckboxes(container_estado_inicial_mt, 'estado_inicial');
    
        const checkboxes = container_estado_inicial_mt.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            if (index === 0) {
                cb.checked = true;
                maquinaForm.estadoInicial_mt = cb.value;
            }
    
            cb.addEventListener('change', function(event) {
                if (event.target.checked) {
                    maquinaForm.estadoInicial_mt = event.target.value;
                    checkboxes.forEach(otherCb => {
                        if (otherCb !== event.target) {
                            otherCb.checked = false;
                        }
                    });
                } else {
                    event.target.checked = true;
                }
            });
        });
    }

    function gerarEstadosAceitacaoMT() {
        criarCheckboxes(estados_aceitacao_container_mt, 'estado_aceitacao');
        
        estados_aceitacao_container_mt.addEventListener('change', function(event) {
            const checkbox = event.target;
            const estado = checkbox.value;
        
            if (checkbox.checked) {
                maquinaForm.estadosAceitacao_mt.push(estado);
            } else {
                const index = maquinaForm.estadosAceitacao_mt.indexOf(estado);
                if (index !== -1) {
                    maquinaForm.estadosAceitacao_mt.splice(index, 1);
                }
            }
    
            if (maquinaForm.estadosAceitacao_mt.length > 0) {
                botao_concluir_maquina.disabled = false;
            } else {
                botao_concluir_maquina.disabled = true;
                alert('É necessário selecionar pelo menos um estado de aceitação.');
            }
        });
    }

    function gerarJSON_MT(){
        const transicoes_formatadas_mt = mapTransicoes();
        const maquinaTuring = {
            "nome": maquinaForm.nome_mt,
            "tipo": maquinaForm.tipo,
            "x":maquinaForm.x,
            "y":maquinaForm.y,
            "estadoInicial": maquinaForm.estadoInicial_mt,
            "estadosAceitacao": maquinaForm.estadosAceitacao_mt,
            "estados": maquinaForm.estados,
            "transicoes": transicoes_formatadas_mt
        };
    
    
        const maquintaTuringJSON = JSON.stringify(maquinaTuring);
        console.log(maquintaTuringJSON);

        return maquintaTuringJSON;

    }

    async function salvarMaquina(event) {
        event.preventDefault();
        

        try {
            const response = await fetch(`${host}/api/maquina/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: gerarJSON_MT()
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const msg_salvo = document.createElement('p');
            msg_salvo.textContent = 'Máquina salva com sucesso!';
    
            botao_concluir_maquina.disabled = true;
    
            container_mt_concluido.appendChild(msg_salvo);
    
            botao_adicionar_outra_maquina.disabled = false;
    
            const initialCheckboxes = container_estado_inicial_mt.querySelectorAll('input[type="checkbox"]');
            initialCheckboxes.forEach(cb => cb.disabled = true);
    
            const acceptanceCheckboxes = estados_aceitacao_container_mt.querySelectorAll('input[type="checkbox"]');
            acceptanceCheckboxes.forEach(cb => cb.disabled = true);
            
            await buscarTodasMaquinas();
    
        } catch (error) {
            console.error('Erro ao salvar a máquina:', error);
        }
    }
    botao_concluir_maquina.addEventListener('click', salvarMaquina);
    botao_adicionar_outra_maquina.addEventListener('click', function(){
        location.reload();
        botao_adicionar_outra_maquina.disabled = true;
    });

    


});
