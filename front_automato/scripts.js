//digitar aq os scripts

document.addEventListener('DOMContentLoaded', function(){
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

    const select_tipo_automato = document.getElementById('select_tipo');


    let estados = [];
    let alfabeto_array = [];
    const transicoes = new Map();


    botao_reset.addEventListener('click', function(){
        location.reload();
        botao_reset.disabled = true;
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
            console.log(`Alfabeto inserido ${alfabeto_array}`);

            //logica para enviar o alfabeto para o backend aqui

            input_alfabeto.value = '';

            input_alfabeto.disabled = true;
            botao_inserir_alfabeto.disabled = true;
        
            for(const letra of alfabeto_array){
                const alfabeto_msg = document.createElement('p');
                alfabeto_msg.textContent = `Símbolo adicionado: ${letra}`;
                alfabeto_container.appendChild(alfabeto_msg);
            }

            transicoes_container.style.display = 'block';
            gerarFormularioTransicoes();
        }else{
            alert('Por favor, insira um alfabeto válido.');
        }
    });

    botao_inserir_transicoes.addEventListener('click', function(event){
        event.preventDefault();

        const tipo_automato = select_tipo_automato.value;

        const transicoesInput = document.querySelectorAll('.transicao_input');
        transicoesInput.forEach(input => {
            const [estadoAtual, simbolo] = input.name.split('_');
            const estadoDestino = input.value.trim();
            if(tipo_automato === 'AFD'){
                transicoes.set(`${estadoAtual}_${simbolo}`, estadoDestino);

            }else if(tipo_automato === 'AFN'){
                const chave = `${estadoAtual}_${simbolo}`;
                if(transicoes.has(chave)){
                    transicoes.get(chave).push(estadoDestino);
                }else{
                    transicoes.set(chave, [estadoDestino]);
                }
            }
        });

        console.log(transicoes);
        alert('Transicoes inseridas com sucesso!');
    });
    function gerarFormularioTransicoes(){
        form_transicoes_container.innerHTML = '';

        estados.forEach(estado =>{
            alfabeto_array.forEach(simbolo =>{
                const transicao_div = document.createElement('div');
                transicao_div.className = 'transicao';

                const label = document.createElement('label');
                label.textContent = `${estado} --${simbolo}--> `;

                const select = document.createElement('select');
                select.name = `${estado}_${simbolo}`;
                select.className = 'transicao_input';

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

            });
        });
    }
});