document.addEventListener('DOMContentLoaded', function(){

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


    botao_inserir_estados.addEventListener('click', function(event){
        event.preventDefault();


        const quantidade_estados = input_quantidade.value;

        if(quantidade_estados > 0){
            botao_reset.disabled = false;

            input_quantidade.disabled = true;
            botao_inserir_estados.disabled = true;

            input_alfabeto.disabled = false;
            botao_inserir_alfabeto.disabled = false;

            estados_container.innerHTML = '';
            alfabeto_container.innerHTML = '';
            
    

            for(let i = 1 ; i <= quantidade_estados ; i++){
                automatoForm.estados.push(`q${i}`);
                const estado_msg = document.createElement('p');
                estado_msg.textContent = `Estado ${i} inserido: q${i}.`;
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
    
        if(alfabeto.trim() !== ''){
            automatoForm.alfabeto_array = alfabeto.trim().split(/\s+/);
    
            // Verificação se todos os símbolos têm apenas um caractere
            const invalidSymbols = automatoForm.alfabeto_array.filter(symbol => symbol.length !== 1);
    
            if (invalidSymbols.length > 0) {
                alert('Por favor, insira apenas caracteres únicos separados por espaços.');
            } else {
                console.log(`Alfabeto inserido ${automatoForm.alfabeto_array}`);
    
                // lógica para enviar o alfabeto para o backend aqui
    
                input_alfabeto.value = '';
    
                input_alfabeto.disabled = true;
                botao_inserir_alfabeto.disabled = true;
    
                botao_inserir_transicoes.disabled = false;
            
                for(const letra of automatoForm.alfabeto_array){
                    const alfabeto_msg = document.createElement('p');
                    alfabeto_msg.textContent = `Símbolo adicionado: ${letra}`;
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
        let transicoesValidas = true;

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

        if(!transicoesValidas && automatoForm.tipo === 'AFD'){
            alert('Por favor, selecione um estado de destino para cada transição no AFD.');
        } else {
            console.log(mapTransicoes())
            const transicao_msg = document.createElement('p');
            transicao_msg.textContent = 'Transições inseridas com sucesso.';
            form_transicoes_container.style.display = 'none';
            transicoes_container.appendChild(transicao_msg);
            

            botao_inserir_transicoes.disabled = true;
            gerarEstadoInicial();
            gerarEstadosAceitacao();

        }
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

    function gerarFormularioTransicoes(){
        form_transicoes_container.innerHTML = '';

        automatoForm.tipo = select_tipo_automato.value;

        automatoForm.estados.forEach(estado =>{
            automatoForm.alfabeto_array.forEach(simbolo =>{
                const transicao_div = document.createElement('div');
                transicao_div.className = 'transicao';

                const label = document.createElement('label');
                label.textContent = `${estado} --${simbolo}--> `;

                const select = document.createElement('select');
                select.name = `${estado}_${simbolo}`;
                select.className = 'transicao_input';

                if(automatoForm.tipo === 'AFN'){
                    select.multiple = true;
                }

                const option_vazia = document.createElement('option');
                option_vazia.value = '';
                option_vazia.textContent = 'Selecione o estado de destino';
                select.appendChild(option_vazia);

                automatoForm.estados.forEach(destino =>{
                    const option = document.createElement('option');
                    option.value = destino;
                    option.textContent = destino;
                    select.appendChild(option);
                });
                transicao_div.appendChild(label);
                transicao_div.appendChild(select);
                form_transicoes_container.appendChild(transicao_div);
                const espaco = document.createElement('br');
                form_transicoes_container.appendChild(espaco);

            });
            document.createElement('br');

        });

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
    
        // Marca o primeiro checkbox como padrão e impede desmarcação
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
                    // Se o usuário tentar desmarcar o estado inicial, reverte a ação
                    event.target.checked = true;
                }
            });
        });
    }

    // Estados de Aceitação
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
    
            // Verifica se há pelo menos um estado de aceitação selecionado
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
            const response = await fetch('http://localhost:8080/api/automatos/save', {
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
            const br_temporario = document.getElementById('br_temporario');
            msg_salvo.textContent = 'Automato salvo com sucesso!';
    
            botao_salvar_automato.disabled = true;
            br_temporario.remove();
    
            container_conclusao.appendChild(msg_salvo);
    
            botao_adicionar_outro.disabled = false;
    
            const initialCheckboxes = estado_inicial_container.querySelectorAll('input[type="checkbox"]');
            initialCheckboxes.forEach(cb => cb.disabled = true);
    
            const acceptanceCheckboxes = estados_aceitacao_container.querySelectorAll('input[type="checkbox"]');
            acceptanceCheckboxes.forEach(cb => cb.disabled = true);
            
            // Chama a função para buscar e exibir todos os autômatos após a criação bem-sucedida
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