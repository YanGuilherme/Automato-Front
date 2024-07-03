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
    let estados = [];
    let alfabeto_array = [];
    const transicoes = new Map();
    let estadoInicial = ''; 
    const estadosAceitacao = [];




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
                estados.push(`q${i}`);
                const estado_msg = document.createElement('p');
                estado_msg.textContent = `Estado ${i} inserido: q${i}.`;
                estados_container.appendChild(estado_msg);
            }
            console.log(estados);
    
        }else{
            alert("Por favor insira uma quantidade válida de estados.");
        }
    });

    botao_inserir_alfabeto.addEventListener('click', function(event){
        event.preventDefault();
        
        const alfabeto = input_alfabeto.value;
    
        if(alfabeto.trim() !== ''){
            alfabeto_array = alfabeto.trim().split(/\s+/);
    
            // Verificação se todos os símbolos têm apenas um caractere
            const invalidSymbols = alfabeto_array.filter(symbol => symbol.length !== 1);
    
            if (invalidSymbols.length > 0) {
                alert('Por favor, insira apenas caracteres únicos separados por espaços.');
            } else {
                console.log(`Alfabeto inserido ${alfabeto_array}`);
    
                // lógica para enviar o alfabeto para o backend aqui
    
                input_alfabeto.value = '';
    
                input_alfabeto.disabled = true;
                botao_inserir_alfabeto.disabled = true;
    
                botao_inserir_transicoes.disabled = false;
            
                for(const letra of alfabeto_array){
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

        const tipo_automato = select_tipo_automato.value;

        const transicoesInput = document.querySelectorAll('.transicao_input');
        let transicoesValidas = true;

        transicoesInput.forEach(input => {
            const [estadoAtual, simbolo] = input.name.split('_');
            const selected_options = Array.from(input.selectedOptions).map(option => option.value);
            if(tipo_automato === 'AFD'){
                if(selected_options.length === 0 || selected_options[0] === ''){
                    transicoesValidas = false;
                } else {
                    transicoes.set(`${estadoAtual}_${simbolo}`, selected_options[0]);
                }
            } else if(tipo_automato === 'AFN'){
                const chave = `${estadoAtual}_${simbolo}`;
                transicoes.set(chave, selected_options);
            }
        });

        if(!transicoesValidas && tipo_automato === 'AFD'){
            alert('Por favor, selecione um estado de destino para cada transição no AFD.');
        } else {
            console.log(transicoes);
            const transicao_msg = document.createElement('p');
            transicao_msg.textContent = 'Transições inseridas com sucesso.';
            form_transicoes_container.style.display = 'none';
            transicoes_container.appendChild(transicao_msg);
            

            botao_inserir_transicoes.disabled = true;
            gerarEstadoInicial();
            gerarEstadosAceitacao();

        }
    });

    function gerarFormularioTransicoes(){
        form_transicoes_container.innerHTML = '';

        const tipo_automato = select_tipo_automato.value;

        estados.forEach(estado =>{
            alfabeto_array.forEach(simbolo =>{
                const transicao_div = document.createElement('div');
                transicao_div.className = 'transicao';

                const label = document.createElement('label');
                label.textContent = `${estado} --${simbolo}--> `;

                const select = document.createElement('select');
                select.name = `${estado}_${simbolo}`;
                select.className = 'transicao_input';

                if(tipo_automato === 'AFN'){
                    select.multiple = true;
                }

                const option_vazia = document.createElement('option');
                option_vazia.value = '';
                option_vazia.textContent = 'Selecione o estado de destino';
                select.appendChild(option_vazia);

                estados.forEach(destino =>{
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



    function criarCheckboxes(container, label, estadoArray) {
        container.innerHTML = ''; // Limpa o conteúdo atual

        estadoArray.forEach(estado => {
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
        criarCheckboxes(estado_inicial_container, 'estado_inicial', estados);
    
        // Marca o primeiro checkbox como padrão e impede desmarcação
        const checkboxes = estado_inicial_container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            if (index === 0) {
                cb.checked = true;
                estadoInicial = cb.value;
            }
    
            cb.addEventListener('change', function(event) {
                if (event.target.checked) {
                    estadoInicial = event.target.value;
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
        criarCheckboxes(estados_aceitacao_container, 'estado_aceitacao', estados);
        
        estados_aceitacao_container.addEventListener('change', function(event) {
            const checkbox = event.target;
            const estado = checkbox.value;
        
            if (checkbox.checked) {
                estadosAceitacao.push(estado);
            } else {
                const index = estadosAceitacao.indexOf(estado);
                if (index !== -1) {
                    estadosAceitacao.splice(index, 1);
                }
            }
    
            // Verifica se há pelo menos um estado de aceitação selecionado
            if (estadosAceitacao.length > 0) {
                botao_salvar_automato.disabled = false;
            } else {
                botao_salvar_automato.disabled = true;
                alert('É necessário selecionar pelo menos um estado de aceitação.');
            }
        });
    }




    // Função para gerar a quíntupla do autômato em formato JSON
    function salvarAutomato(event) {
        event.preventDefault();
        const tipo_automato = select_tipo_automato.value;

        const automato = {
            estados: estados,
            alfabeto: alfabeto_array,
            transicoes: Object.fromEntries(transicoes),
            estado_inicial: estadoInicial,
            estados_aceitacao: estadosAceitacao,
            tipo_automato: tipo_automato
        };

        const automatoJSON = JSON.stringify(automato);
        console.log(automatoJSON);
        //enviar para o backend
        // Aqui você pode adicionar lógica para enviar esse JSON para o backend ou salvar localmente

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/api/automatos/create', true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(automatoJSON);


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

        buscarTodosAutomatos();

    }
    
    botao_salvar_automato.addEventListener('click', salvarAutomato);
    botao_adicionar_outro.addEventListener('click', function(){
        location.reload();
        botao_adicionar_outro.disabled = true;
    });

    
});


async function buscarTodosAutomatos(){
    try {
        const response = await fetch('http://localhost:8080/api/automatos/findAll');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const automatos = await response.json();
        console.log('Lista de autômatos: ', automatos);

        exibirAutomatos(automatos);
    } catch (error) {
        console.error('Erro ao buscar autômatos:', error);
    }
}

function exibirAutomatos(automatos){
    const container_exibicao = document.getElementById('container_exibicao');
    container_exibicao.innerHTML = ''; // Certifique-se de limpar o container antes de adicionar novos elementos

    automatos.forEach(automato => {
        const automato_container = document.createElement('div');
        automato_container.classList.add('automato');

        const id_automato = document.createElement('p');
        id_automato.textContent = `Automato ID: ${automato.id}`;

        const botao_detalhes = document.createElement('button');
        botao_detalhes.textContent = 'Exibir Detalhes';
        botao_detalhes.addEventListener('click', () => {
            toggleDetalhesAutomato(automato, automato_container, botao_detalhes);
        });

        automato_container.appendChild(id_automato);
        automato_container.appendChild(botao_detalhes);
        container_exibicao.appendChild(automato_container); // Adicionar o container do automato ao container de exibição
    });
}

function toggleDetalhesAutomato(automato, container, botao){
    const detalhes_container = container.querySelector('.detalhes');

    if (detalhes_container) {
        container.removeChild(detalhes_container);
        botao.textContent = 'Exibir Detalhes';
    } else {
        const new_detalhes_container = document.createElement('div');
        new_detalhes_container.classList.add('detalhes');

        const detalhes_automato = `
            <p>Tipo: ${automato.tipo_automato}</p>
            <p>Estado Inicial: ${automato.estado_inicial}</p>
            <p>Estados: ${automato.estados.join(', ')}</p>
            <p>Alfabeto: ${automato.alfabeto.join(', ')}</p>
            <p>Estados de Aceitação: ${automato.estados_aceitacao.join(', ')}</p>
            <p>Transições: ${JSON.stringify(automato.transicoes)}</p>
        `;
        new_detalhes_container.innerHTML = detalhes_automato;

        container.appendChild(new_detalhes_container);
        botao.textContent = 'Ocultar Detalhes';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    buscarTodosAutomatos();
});
