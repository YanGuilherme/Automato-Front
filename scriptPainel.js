async function buscarTodosAutomatos(){
    try {
        const response = await fetch('http://localhost:8080/api/automatos/findAll');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const automatos = await response.json();
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
        automato_container.id = `${automato.id}`;
        automato_container.className = 'element_automato';

        const id_automato = document.createElement('p');
        id_automato.textContent = 'Automato x';


        const botao_cadeia = document.createElement('button');
        botao_cadeia.textContent = 'Testar';
        botao_cadeia.addEventListener('click', ()=>{
            toggleTestarAutomato(automato, automato_container, botao_cadeia);
        });


        const botao_deletar = document.createElement('button');
        botao_deletar.textContent = 'Deletar';
        botao_deletar.addEventListener('click', ()=>{
            deletarAutomato(automato);
        });

        const botao_detalhes = document.createElement('button');
        botao_detalhes.textContent = 'Exibir Detalhes';
        botao_detalhes.addEventListener('click', () => {
            toggleDetalhesAutomato(automato, automato_container, botao_detalhes);
        });

        automato_container.appendChild(id_automato);
        automato_container.appendChild(botao_cadeia);
        automato_container.appendChild(botao_detalhes);
        automato_container.appendChild(botao_deletar);
        container_exibicao.appendChild(automato_container); // Adicionar o container do automato ao container de exibição
    });


}


async function processarCadeia(id, valorCadeia){

    const execucao = {
        "cadeia":valorCadeia,
        "automatoId":id
    }

    try {
        const response = await fetch('http://localhost:8080/api/automatos/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(execucao)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        const aba_teste = document.querySelector('.input-container');

        let resposta = document.getElementById(`resposta-${id}`);
        
        if (!resposta) {
            resposta = document.createElement('p');
            resposta.id = `resposta-${id}`;
            aba_teste.appendChild(resposta);

        }
        if(jsonResponse.aceita){
            resposta.className = 'aceita_cadeia';
            resposta.textContent = 'Aceita';
        }else{
            resposta.className = 'rejeita_cadeia';
            resposta.textContent = 'Rejeita';
        }

        aba_teste.appendChild(resposta);


    } catch (error) {
        console.error('Erro ao executar autômato:', error);
    }

}









// async function converterAutomato(automato){
//     try {
//         const response = await fetch(`http://localhost:8080/api/automatos/convert/${automato.id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(automato)
//         });


//         console.log('Automato convertido com sucesso.');
//         await buscarTodosAutomatos(); // Atualizar a lista de autômatos após a exclusão
//     } catch (error) {
//         console.error('Erro ao converter o automato:', error);
//     }

// }

function parsePairString(pairString) {
    const regex = /util\.Pair\{first=(.*)second=(.*)\}/;
    const matches = pairString.match(regex);
    if (matches) {
        return { first: matches[1], second: matches[2] };
    }
    return null;
}



function formatarTransicoesComoTabela(transicoes, automato) {
    const estados = automato.estados;
    const alfabeto = automato.alfabeto;
    const estadosDeAceitacao = automato.estadosAceitacao;

    let tabela_html = '<table border="1" class="tabela_transicoes"><thead><tr><th>δ</th>';
    alfabeto.forEach(simbolo => {
        tabela_html += `<th>${simbolo}</th>`;
    });
    tabela_html += '</tr></thead><tbody>';

    estados.forEach(estado => {
        tabela_html += '<tr>';
        if(estado === automato.estadoInicial && estadosDeAceitacao.includes(estado)) {
            tabela_html += `<td>*->${estado}</td>`;
        } else if (estado === automato.estadoInicial) {
            tabela_html += `<td>->${estado}</td>`;
        } else if(estadosDeAceitacao.includes(estado)){
            tabela_html += `<td>*${estado}</td>`;
        }
        else {
            tabela_html += `<td>${estado}</td>`;
        }
        alfabeto.forEach(simbolo => {
            const transicao = [transicoes[estado][simbolo]].flat();
            tabela_html += `<td>${transicao ? transicao.join(', ') : '-'}</td>`;
        });


        tabela_html += '</tr>';
    });

    tabela_html += '</tbody></table>';
    return tabela_html;
}

function testarAutomato(id) {
    const automato_container = document.getElementById(`${id}`);
    
    if (!automato_container) {
        console.error(`Elemento com ID automato-${id} não encontrado.`);
        return;
    }

    const input_container = document.createElement('div');
    input_container.classList.add('input-container');

    const input_cadeia = document.createElement('input');
    input_cadeia.setAttribute('type', 'text');
    input_cadeia.setAttribute('placeholder', 'Digite a cadeia aqui');
    input_container.appendChild(input_cadeia);

    const botao_enviar = document.createElement('button');
    botao_enviar.textContent = 'Enviar';
    botao_enviar.addEventListener('click', () => {
        const valorCadeia = input_cadeia.value;
        processarCadeia(id, valorCadeia);
    });
    input_container.appendChild(botao_enviar);

    automato_container.appendChild(input_container);
    return automato_container;
}


function toggleTestarAutomato(automato, container, botao) {
    const aba_teste = container.querySelector('.input-container');


    if (aba_teste) {
        container.removeChild(aba_teste);
        botao.textContent = 'Testar';
    } else {
        // Limpa campo de input anterior, se existir
        const conteudo_anterior = container.querySelector('.input-container');
        if (conteudo_anterior) {
            container.removeChild(conteudo_anterior);

        }

        // Adiciona novo campo de input
        testarAutomato(automato.id);

        botao.textContent = 'Ocultar Teste';
    }
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
            <pre><strong>Tipo:</strong> ${automato.tipo}</pre>
            <pre><strong>Estados <i>Q</i>:</strong> ${automato.estados.join(', ')}</pre>
            <pre><strong>Alfabeto Σ:</strong> ${automato.alfabeto.join(', ')}</pre>
            <pre><strong>Transições:</strong></pre>
            <pre>${formatarTransicoesComoTabela(automato.transicoes,automato)}</pre>
            <pre><strong>Estado inicial:</strong> ${automato.estadoInicial}</pre>
            <pre><strong>Estados de aceitação:</strong> ${automato.estadosAceitacao.join(', ')}</pre>
        `;
        new_detalhes_container.innerHTML = detalhes_automato;

        container.appendChild(new_detalhes_container);
        botao.textContent = 'Ocultar Detalhes';
    }
}

async function deletarAutomato(automato){
    if(confirm('Tem certeza que deseja deletar este autômato?')){
        await deletar(automato);
    }
}

async function deletar(automato){
    try {
        const response = await fetch(`http://localhost:8080/api/automatos/delete/${automato.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Automato deletado com sucesso.');
        await buscarTodosAutomatos(); // Atualizar a lista de autômatos após a exclusão
    } catch (error) {
        console.error('Erro ao deletar o automato:', error);
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    buscarTodosAutomatos();
});