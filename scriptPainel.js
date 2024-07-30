
async function buscarTodosAutomatos(){
    try {
        const response = await fetch('http://localhost:8080/api/automatos/findAll');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const automatos = await response.json();
        exibirAutomatos(automatos);
        return automatos;

    } catch (error) {
        console.error('Erro ao buscar autômatos:', error);
    }
}

function exibirAutomatos(automatos) {
    const afn_list = document.getElementById('afn_list');
    const afd_list = document.getElementById('afd_list');
    const minimized_list = document.getElementById('minimized_list');
    afn_list.innerHTML = afd_list.innerHTML = minimized_list.innerHTML = ''; // Limpar todas as listas

    automatos.forEach(automato => {
        const automato_container = document.createElement('div');
        automato_container.id = `${automato.id}`;
        automato_container.className = 'element_automato';

        const rotulo_automato = document.createElement('p');
        rotulo_automato.className = 'rotulo_automato';
        rotulo_automato.innerHTML = `${automato.nome}`;

        const botao_cadeia = document.createElement('button');
        botao_cadeia.textContent = 'Testar';
        botao_cadeia.addEventListener('click', () => {
            toggleTestarAutomato(automato, automato_container, botao_cadeia);
        });

        const botao_converter = document.createElement('button');
        botao_converter.textContent = 'Converter';
        botao_converter.addEventListener('click', () => {
            converterAutomato(automato);
        });

        const botao_minimizar = document.createElement('button');
        botao_minimizar.textContent = 'Minimizar';
        botao_minimizar.addEventListener('click', () => {
            minimizarAutomato(automato);
        });

        const botao_deletar = document.createElement('button');
        botao_deletar.textContent = 'Deletar';
        botao_deletar.addEventListener('click', () => {
            deletarAutomato(automato);
        });

        const botao_detalhes = document.createElement('button');
        botao_detalhes.textContent = 'Exibir Detalhes';
        botao_detalhes.addEventListener('click', () => {
            toggleDetalhesAutomato(automato, automato_container, botao_detalhes);
        });

        const botao_equivalencia = document.createElement('button');
        botao_equivalencia.textContent = 'Testar equivalência';
        botao_equivalencia.addEventListener('click', () => {
            modal_equivalencia(automato);
        });

        automato_container.appendChild(rotulo_automato);
        automato_container.appendChild(botao_cadeia);
        automato_container.appendChild(botao_detalhes);

        if (automato.tipo === 'AFN') {
            automato_container.appendChild(botao_converter);
            afn_list.appendChild(automato_container); // Adicionar o container do automato ao container de exibição
        } else if (automato.tipo === 'AFD') {
            if (!automato.minimized) {
                automato_container.appendChild(botao_minimizar);
            }
            
            if (automato.minimized) {
                minimized_list.appendChild(automato_container);
            } else {
                afd_list.appendChild(automato_container);
            }
        }

        automato_container.appendChild(botao_equivalencia);

        automato_container.appendChild(botao_deletar);
    });
}

async function testar_equivalencia(id1, id2){
    try {
        const response = await fetch(`http://localhost:8080/api/automatos/testarEquivalencia/${id1}/${id2}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resposta = await response.json();
        return resposta;

    } catch (error) {
        console.error('Erro ao testar equivalencia:', error);
    }
}

async function modal_equivalencia(automato) {

    let modal = document.getElementById("myModal");
    let container_resultado = document.getElementById("container_resultado");

    modal.style.display = "block";

    const lista_automatos = await buscarTodosAutomatos();

    let select = document.getElementById("automatoSelect");

    select.innerHTML = ''; // Limpar opções existentes
    container_resultado.innerHTML = '';

    lista_automatos.forEach(a => {
        if (a.id !== automato.id) {
            const option = document.createElement("option");
            option.value = a.id;
            option.text = `${a.nome} - Tipo: ${a.tipo}`;
            select.appendChild(option);
        }
    });
    let saveButton = document.getElementById("saveButton");

    if (saveButton) {
        saveButton.onclick = async function() {
            container_resultado.innerHTML = '';
            const select = document.getElementById("automatoSelect");
            const selectedId = select.value;
            const resposta_teste = await testar_equivalencia(automato.id, selectedId);

            const exibir_resposta = document.createElement("p");
            const exibir_resposta_final = document.createElement("p");

            let validacao_final = false;

            resposta_teste.forEach(resposta => {
                exibir_resposta.innerHTML += 
                `<strong>Tipo de teste: </strong> ${resposta.nome}<br>
                <strong>Resultado: </strong>${resposta.message}<br><br>
                `;
                validacao_final = resposta.sucesso;
                
            });        
            if(validacao_final){
                exibir_resposta_final.className = 'aceita_cadeia';
                exibir_resposta_final.textContent = 'Equivalentes';
            }else{
                exibir_resposta_final.className = 'rejeita_cadeia';
                exibir_resposta_final.textContent = 'Não equivalentes'
            }

            
            container_resultado.appendChild(exibir_resposta);
            container_resultado.appendChild(exibir_resposta_final);

        };

    }
    

}






// Fechar o modal quando o usuário clicar fora dele
window.onclick = function(event) {
    let modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
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
        const secao_automato = document.getElementById(`${id}`)

        let resposta = document.getElementById(`resposta-${id}`);
        
        if (!resposta) {
            resposta = document.createElement('p');
            resposta.id = `resposta-${id}`;
            secao_automato.appendChild(resposta);

        }
        if(jsonResponse.aceita){
            resposta.className = 'aceita_cadeia';
            resposta.textContent = 'Aceita';
        }else{
            resposta.className = 'rejeita_cadeia';
            resposta.textContent = 'Rejeita: ' + jsonResponse.message;
        }

        secao_automato.appendChild(resposta);


    } catch (error) {
        console.error('Erro ao executar autômato:', error);
    }

}

async function minimizarAutomato(automato) {
    const id = automato.id;

    try {
        const response = await fetch(`http://localhost:8080/api/automatos/minimizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })  // Enviando apenas o id
        });
        response.tipo = 'AFD_m';

        console.log('Automato minimizado com sucesso');

        await buscarTodosAutomatos();
    } catch (error) {
        console.error('Erro ao minimizar o automato', error);
    }
}

async function converterAutomato(automato){
    const id = automato.id;
    try {
        await fetch(`http://localhost:8080/api/automatos/convertToAFD`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
            
        });
        console.log('Automato convertido com sucesso.');
        await buscarTodosAutomatos(); // Atualizar a lista de autômatos após a exclusão
    } catch (error) {
        console.error('Erro ao converter o automato:', error);
    }

}

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
    const resposta = document.getElementById(`resposta-${automato.id}`);

    if (aba_teste || resposta) {
        botao.textContent = 'Testar';
        if (aba_teste) {
            container.removeChild(aba_teste);
        }
        if (resposta) {
            container.removeChild(resposta);
        }
    }else {
        // Limpa campo de input anterior, se existir
        const conteudo_anterior = container.querySelector('.input-container');
        const resposta_anterior = container.querySelector('.resposta');
        if (conteudo_anterior) {
            container.removeChild(conteudo_anterior);
        }
        if (resposta_anterior) {
            container.removeChild(resposta_anterior);
        }

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
            <div id="automato-container-${automato.id}"></div>
            <pre><strong>Nome:</strong> ${automato.nome}</pre>
            <pre><strong>Tipo:</strong> ${automato.tipo}</pre>
            <pre style="white-space: pre-wrap;"><strong>Estados <i>Q</i>:</strong> ${automato.estados.join(', ')}</pre>
            <pre><strong>Alfabeto Σ:</strong> ${automato.alfabeto.join(', ')}</pre>
            <pre><strong>Transições:</strong></pre>
            <pre>${formatarTransicoesComoTabela(automato.transicoes,automato)}</pre>
            <pre><strong>Estado inicial:</strong> ${automato.estadoInicial}</pre>
            <pre  style="white-space: pre-wrap;"><strong>Estados de aceitação: </strong> ${automato.estadosAceitacao.join(', ')}</pre>
        `;
        new_detalhes_container.innerHTML = detalhes_automato;

        container.appendChild(new_detalhes_container);
        botao.textContent = 'Ocultar Detalhes';
        renderAutomatos(automato);
    }
}

async function renderAutomatos(automato) {
    const container = document.getElementById(`automato-container-${automato.id}`);
    
    const automatoContainer = document.createElement('div');
    automatoContainer.id = `automato-${automato.id}`;
    automatoContainer.className = 'automato-container';
    container.innerHTML = '';
    container.appendChild(automatoContainer);

    const dotCode = `
    digraph {
        // Definir nós
        ${automato.estados.map(estado => `${estado} [label="${estado}"];`).join('\n')}

        // Definir estado inicial
        initial [shape=plaintext, label=""];
        initial -> ${automato.estadoInicial};

        // Definir estados de aceitação
        ${automato.estadosAceitacao.map(estado => `${estado} [shape=doublecircle];`).join('\n')}

        // Definir transições
        ${Object.keys(automato.transicoes).map(origem => {
            const transicoes = automato.transicoes[origem];
            return Object.keys(transicoes).map(simbolo => {
                const destinos = [transicoes[simbolo]].flat();
                return destinos.filter(destino => destino).map(destino => `${origem} -> ${destino} [label="${simbolo}"];`).join('\n');
            }).join('\n');
        }).join('\n')}
    }
    `;

    // Renderizar o gráfico usando viz.js
    const viz = new Viz();
    viz.renderSVGElement(dotCode)
        .then(svgElement => {
            automatoContainer.appendChild(svgElement);
        })
        .catch(error => {
            // Tratar erros, se houver
            console.error(`Erro ao renderizar o gráfico para o automato ${automato.id}:`, error);
        });
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
        await buscarTodosAutomatos(); 
    } catch (error) {
        console.error('Erro ao deletar o automato:', error);
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    buscarTodosAutomatos();
});
