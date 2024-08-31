const host = 'http://192.168.3.4:8080';
//const host = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', function(){

    const input_nome = document.getElementById('entrada_nome');
    const botao_escolher_nome = document.getElementById('btn_inserir_nome');
    const container_nome = document.getElementById('container_nome');

    const select_tipo_automato = document.getElementById('select_tipo');

    const input_quantidade = document.getElementById('quantidade_estados');
    const botao_inserir_estados = document.getElementById('btn_inserir_estados'); //variaveis estados
    const estados_container = document.getElementById('container_estados');

    const input_alfabeto = document.getElementById('entrada_alfabeto');
    const botao_inserir_alfabeto = document.getElementById('btn_inserir_alfabeto'); 
    const alfabeto_container = document.getElementById('container_alfabeto');// variaveis alfabeto


    const transicoes_container = document.getElementById('transicoes_container');
    const form_transicoes_container = document.getElementById('transicoes_form_container');
    const botao_inserir_transicoes = document.getElementById('btn_inserir_transicoes'); //variaveis transicoes

    const botao_reset = document.getElementById('btn_reset'); //botao reset para limpar as entradas


    const estado_inicial_container = document.getElementById('container_estado_inicial');
    const estados_aceitacao_container = document.getElementById('container_estados_aceitacao');

    const botao_salvar_automato = document.getElementById('concluir_automato');
    const container_conclusao = document.getElementById('container_concluido');

    const botao_adicionar_outro = document.getElementById('outro_automato');





    //variaveis que serao a 5-upla do automato
    let automatoForm = {
        nome: '',
        tipo : '',
        estados : [],
        alfabeto_array : [],
        transicoes : new Map(),
        estadoInicial : '',
        estadosAceitacao : []
    }


    botao_reset.addEventListener('click', function(){
        location.reload(); //recarrega a page
        botao_reset.disabled = true; //desabilita o botao
    });

    botao_escolher_nome.addEventListener('click', function(event){
        event.preventDefault();
        const nome_entrada = input_nome.value;
        if(nome_entrada != ''){
            automatoForm.nome = nome_entrada;
            select_tipo_automato.disabled = false;
            input_quantidade.disabled = false;
            botao_inserir_estados.disabled = false;
            input_nome.disabled = true;
            botao_escolher_nome.disabled = true;
            botao_reset.disabled = false;
            container_nome.innerHTML = `Nome escolhido: <strong>${nome}</strong>`;

        }else{
            select_tipo_automato.disabled = true;
            input_quantidade.disabled = true;
            botao_inserir_estados.disabled = true;
            alert("Por favor insira um nome válido.");

        }
    });


    botao_inserir_estados.addEventListener('click', function(event){
        event.preventDefault();


        const quantidade_estados = input_quantidade.value;

        if(quantidade_estados > 0){

            input_quantidade.disabled = true;
            botao_inserir_estados.disabled = true;

            input_alfabeto.disabled = false;
            botao_inserir_alfabeto.disabled = false;
            select_tipo_automato.disabled = true;

            estados_container.innerHTML = '';
            alfabeto_container.innerHTML = '';
            
    

            for(let i = 0 ; i < quantidade_estados ; i++){
                automatoForm.estados.push(`q${i}`);
                const estado_msg = document.createElement('p');
                estado_msg.innerHTML += `Estado ${i+1} inserido: <strong>q${i}</strong>.`;
                estados_container.appendChild(estado_msg);
            }
            console.log(automatoForm.estados);
    
        }else{
            alert("Por favor insira uma quantidade válida de estados.");
        }
    });

    botao_inserir_alfabeto.addEventListener('click', function(event){
        event.preventDefault();
        
        const alfabeto = input_alfabeto.value;
        automatoForm.tipo = select_tipo_automato.value;

    
        if(alfabeto.trim() !== ''){
            automatoForm.alfabeto_array = alfabeto.trim().split(/\s+/);
    
            const invalidSymbols = automatoForm.alfabeto_array.filter(symbol => symbol.length !== 1);
    
            if (invalidSymbols.length > 0) {
                alert('Por favor, insira apenas caracteres únicos separados por espaços.');
            } else {
                console.log(`<strong>Alfabeto inserido ${automatoForm.alfabeto_array}</strong>`);
    
                input_alfabeto.value = '';
    
                input_alfabeto.disabled = true;
                botao_inserir_alfabeto.disabled = true;
    
                botao_inserir_transicoes.disabled = false;
            
                for(const letra of automatoForm.alfabeto_array){
                    const alfabeto_msg = document.createElement('p');
                    alfabeto_msg.innerHTML = `Símbolo adicionado: <strong>${letra}</strong>`;
                    alfabeto_container.appendChild(alfabeto_msg);
                }
    
                transicoes_container.style.display = 'block';
                gerarFormularioTransicoes();
            }
        }else{
            alert('Por favor, insira um alfabeto válido.');
        }
    });
    
    botao_inserir_transicoes.addEventListener('click', function(event){
        event.preventDefault();

        automatoForm.tipo = select_tipo_automato.value;

        const transicoesInput = document.querySelectorAll('.transicao_input');

        transicoesInput.forEach(input => {
            const [estadoAtual, simbolo] = input.name.split('_');
            const selected_options = Array.from(input.selectedOptions).map(option => option.value);
            if(automatoForm.tipo === 'AFD'){
                if(selected_options.length === 0 || selected_options[0] === ''){
                    transicoesValidas = false;
                } else {
                    automatoForm.transicoes.set(`${estadoAtual}_${simbolo}`, selected_options[0]);
                }
            } else if(automatoForm.tipo === 'AFN'){
                const chave = `${estadoAtual}_${simbolo}`;
                automatoForm.transicoes.set(chave, selected_options);
            }

        });

        console.log(mapTransicoes())
        const transicao_msg = document.createElement('p');
        transicao_msg.innerHTML = '<strong>Transições inseridas com sucesso.</strong>';
        form_transicoes_container.style.display = 'none';
        transicoes_container.appendChild(transicao_msg);
        
        botao_inserir_transicoes.disabled = true;
        gerarEstadoInicial();
        gerarEstadosAceitacao();



    });
    function mapTransicoes() {
        const transicoes_formatadas = {};
    
        // Itera sobre as transições formatadas
        automatoForm.transicoes.forEach((estadosDestino, transicao) => {
            const [estadoOrigem, simbolo] = transicao.split("_");
            
            // Se o estado de origem não existe no objeto, cria ele
            if (!transicoes_formatadas[estadoOrigem]) {
                transicoes_formatadas[estadoOrigem] = {};
            }
    
            // Atribui os valores no formato correto
            transicoes_formatadas[estadoOrigem][simbolo] = getEstadosDestino(estadosDestino);
        });
    
        return transicoes_formatadas;
    }

    function getEstadosDestino(estadosDestino){
        if(Array.isArray(estadosDestino))
        return estadosDestino.filter((it) =>{
            return it.length > 0;
        });
        return estadosDestino;       
    }   

    function gerarFormularioTransicoes() {
        form_transicoes_container.innerHTML = '';
    
        automatoForm.tipo = select_tipo_automato.value;
    
        automatoForm.estados.forEach(estado => {
            automatoForm.alfabeto_array.forEach(simbolo => {
                criarTransicao(estado, simbolo);
            });
    
            // Adiciona transição para cadeia vazia (ε) apenas se o tipo for AFN
            if (automatoForm.tipo === 'AFN') {
                criarTransicao(estado, 'ε');
            }
        });
    }
    
    function criarTransicao(estado, simbolo) {
        const transicao_div = document.createElement('div');
        transicao_div.className = 'transicao';
    
        // Parágrafo combinado para "Origem:" e "Símbolo:"
        const origem_simbolo_paragrafo = document.createElement('p');
        origem_simbolo_paragrafo.innerHTML = `<strong>Origem:</strong> ${estado} <br> <strong>Símbolo:</strong> ${simbolo}`;
        transicao_div.appendChild(origem_simbolo_paragrafo);
    
        // Select para escolha do estado de destino
        const select = document.createElement('select');
        select.name = `${estado}_${simbolo}`;
        select.className = 'transicao_input';
    
        if (automatoForm.tipo === 'AFN') {
            select.multiple = true;
        }
    
        // Opção vazia para seleção do estado de destino
        const option_vazia = document.createElement('option');
        option_vazia.value = '';
        option_vazia.textContent = 'Selecione o estado de destino';
        select.appendChild(option_vazia);
    
        // Opções para todos os estados como destino
        automatoForm.estados.forEach(destino => {
            const option = document.createElement('option');
            option.value = destino;
            option.textContent = destino;
            select.appendChild(option);
        });
    
        transicao_div.appendChild(select);
    
        // Adiciona a div de transição ao container principal
        form_transicoes_container.appendChild(transicao_div);
    }
    select_tipo_automato.addEventListener('change', gerarFormularioTransicoes);



    function criarCheckboxes(container, label) {
        container.innerHTML = ''; // Limpa o conteúdo atual

        automatoForm.estados.forEach(estado => {
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

    function gerarEstadoInicial() {
        criarCheckboxes(estado_inicial_container, 'estado_inicial');
    
        const checkboxes = estado_inicial_container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            if (index === 0) {
                cb.checked = true;
                automatoForm.estadoInicial = cb.value;
            }
    
            cb.addEventListener('change', function(event) {
                if (event.target.checked) {
                    automatoForm.estadoInicial = event.target.value;
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

    function gerarEstadosAceitacao() {
        criarCheckboxes(estados_aceitacao_container, 'estado_aceitacao');
        
        estados_aceitacao_container.addEventListener('change', function(event) {
            const checkbox = event.target;
            const estado = checkbox.value;
        
            if (checkbox.checked) {
                automatoForm.estadosAceitacao.push(estado);
            } else {
                const index = automatoForm.estadosAceitacao.indexOf(estado);
                if (index !== -1) {
                    automatoForm.estadosAceitacao.splice(index, 1);
                }
            }
    
            if (automatoForm.estadosAceitacao.length > 0) {
                botao_salvar_automato.disabled = false;
            } else {
                botao_salvar_automato.disabled = true;
                alert('É necessário selecionar pelo menos um estado de aceitação.');
            }
        });
    }

    function gerarJSON(){
        const transicoes_formatadas = mapTransicoes();
        const automato = {
            "nome": automatoForm.nome,
            "tipo": automatoForm.tipo,
            "estadoInicial": automatoForm.estadoInicial,
            "estadosAceitacao": automatoForm.estadosAceitacao,
            "transicoes": transicoes_formatadas
            
        };
    
    
        const automatoJSON = JSON.stringify(automato);
        console.log(automatoJSON);

        return automatoJSON;

    }




    async function salvarAutomato(event) {
        event.preventDefault();
        const automato_enviar = gerarJSON();
        

        try {
            const response = await fetch(`${host}/api/automatos/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: automato_enviar
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const msg_salvo = document.createElement('p');
            msg_salvo.textContent = 'Automato salvo com sucesso!';
    
            botao_salvar_automato.disabled = true;
    
            container_conclusao.appendChild(msg_salvo);
    
            botao_adicionar_outro.disabled = false;
    
            const initialCheckboxes = estado_inicial_container.querySelectorAll('input[type="checkbox"]');
            initialCheckboxes.forEach(cb => cb.disabled = true);
    
            const acceptanceCheckboxes = estados_aceitacao_container.querySelectorAll('input[type="checkbox"]');
            acceptanceCheckboxes.forEach(cb => cb.disabled = true);
            
            // Chama a função para buscar e exibir todos os autômatos após a criação
            await buscarTodosAutomatos();
    
        } catch (error) {
            console.error('Erro ao salvar autômato:', error);
        }
    }
    botao_salvar_automato.addEventListener('click', salvarAutomato);
    botao_adicionar_outro.addEventListener('click', function(){
        location.reload();
        botao_adicionar_outro.disabled = true;
    });

    
});