async function buscarTodasMaquinas() {
    try {
        const response = await fetch(`${host}/api/maquina/findAll`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const maquinas = await response.json();

        // Exibir as máquinas no console
        console.log('Lista de autômatos:', maquinas);

        // Exibir as máquinas na página
        exibirMaquinas(maquinas);

        return maquinas;

    } catch (error) {
        console.error('Erro ao buscar autômatos:', error);
    }
}

function exibirMaquinas(maquinas) {
    const maquinas_list = document.getElementById('maq_list');

    maquinas_list.innerHTML = ''; // Limpar todas as listas

    maquinas.forEach(maquina => {
        const maquina_container = document.createElement('div');
        maquina_container.id = `${maquina.id}`;
        maquina_container.className = 'element_maquina';

        const rotulo_maquina = document.createElement('p');
        rotulo_maquina.className = 'rotulo_maquina';
        rotulo_maquina.innerHTML = `${maquina.nome}`;

        const botao_teste = document.createElement('button');
        botao_teste.textContent = 'Testar';
        botao_teste.addEventListener('click', () => {
            toggleTestarMaquina(maquina, maquina_container, botao_teste);
        });

        const botao_deletar_mt = document.createElement('button');
        botao_deletar_mt.textContent = 'Deletar';
        botao_deletar_mt.addEventListener('click', () => {
            deletarMaquina(maquina);
        });

        const botao_detalhes_mt = document.createElement('button');
        botao_detalhes_mt.textContent = 'Exibir Detalhes';
        botao_detalhes_mt.addEventListener('click', () => {
            toggleDetalhesMaquina(maquina, maquina_container, botao_detalhes_mt);
        });

        maquina_container.appendChild(rotulo_maquina);
        maquina_container.appendChild(botao_teste);
        maquina_container.appendChild(botao_detalhes_mt);
        maquina_container.appendChild(botao_deletar_mt);

        maquinas_list.appendChild(maquina_container);
    });

    function testarMaquina(id) {
        const maquina_container = document.getElementById(`${id}`);
        
        if (!maquina_container) {
            console.error(`Elemento com ID maquina-${id} não encontrado.`);
            return;
        }
    
        const input_container_mt = document.createElement('div');
        input_container_mt.classList.add('input-container_mt');
    
        const input_cadeia_mt = document.createElement('input');
        input_cadeia_mt.setAttribute('type', 'text');
        input_cadeia_mt.setAttribute('placeholder', 'Digite a cadeia aqui');
        input_container_mt.appendChild(input_cadeia_mt);
    
        const botao_enviar_mt = document.createElement('button');
        botao_enviar_mt.textContent = 'Enviar';
        botao_enviar_mt.addEventListener('click', () => {
            const valorCadeia = input_cadeia_mt.value;
            processarCadeia_MT(id, valorCadeia);
        });
        input_container_mt.appendChild(botao_enviar_mt);
    
        maquina_container.appendChild(input_container_mt);
        return maquina_container;
    }
    
    

    function toggleTestarMaquina(maquina, container, botao) {
        const aba_teste_mt = container.querySelector('.input-container_mt');
        const resposta = document.getElementById(`resposta-${maquina.id}`);
    
        if (aba_teste_mt || resposta) {
            botao.textContent = 'Testar';
            if (aba_teste_mt) {
                container.removeChild(aba_teste_mt);
            }
            if (resposta) {
                container.removeChild(resposta);
            }
        }else {
            const conteudo_anterior = container.querySelector('.input-container_mt');
            const resposta_anterior = container.querySelector('.resposta');
            if (conteudo_anterior) {
                container.removeChild(conteudo_anterior);
            }
            if (resposta_anterior) {
                container.removeChild(resposta_anterior);
            }
    
            testarMaquina(maquina.id);
            botao.textContent = 'Ocultar Teste';
        }
    }

    async function processarCadeia_MT(id, valorCadeia){

        const execucao = {
            "id":id,
            "cadeia":valorCadeia
        }
    
        try {
            const response = await fetch(`${host}/api/maquina/testarCadeia`, {
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
            const secao_maquina = document.getElementById(`${id}`)
    
            let resposta = document.getElementById(`resposta-${id}`);
            
            if (!resposta) {
                resposta = document.createElement('p');
                resposta.id = `resposta-${id}`;
                secao_maquina.appendChild(resposta);
    
            }
            if(jsonResponse.aceita){
                resposta.className = 'aceita_cadeia';
                resposta.textContent = 'Aceita';
            }else{
                resposta.className = 'rejeita_cadeia';
                resposta.textContent = 'Rejeita: ' + jsonResponse.message;
            }
    
            secao_maquina.appendChild(resposta);
    
    
        } catch (error) {
            console.error('Erro ao executar autômato:', error);
        }
    
    }

    function formatarTransicoesComoTabela_MT(transicoes, automato) {
        const estados = Object.keys(transicoes); 
        const alfabeto = automato.alfabetoFita;
        const estadosDeAceitacao = automato.estadosAceitacao;
        const estadoInicial = automato.estadoInicial;
    
        let tabela_html = '<table border="1" class="tabela_transicoes"><thead><tr><th>δ</th>';
    
        alfabeto.forEach(simbolo => {
            tabela_html += `<th>${simbolo}</th>`;
        });
        tabela_html += '</tr></thead><tbody>';
    
        estados.forEach(estado => {
            tabela_html += '<tr>';
    
            if (estado === estadoInicial && estadosDeAceitacao.includes(estado)) {
                tabela_html += `<td>*->${estado}</td>`;
            } else if (estado === estadoInicial) {
                tabela_html += `<td>->${estado}</td>`;
            } else if (estadosDeAceitacao.includes(estado)) {
                tabela_html += `<td>*${estado}</td>`;
            } else {
                tabela_html += `<td>${estado}</td>`;
            }
    
            alfabeto.forEach(simbolo => {
                const transicao = transicoes[estado][simbolo];
                if (transicao) {
                    tabela_html += `<td>${transicao.estadoDestino}, ${transicao.simboloEscrito}, ${transicao.movimento}</td>`;
                } else {
                    tabela_html += '<td>-</td>'; 
                }
            });
    
            tabela_html += '</tr>';
        });
    
        tabela_html += '</tbody></table>';
        return tabela_html;
    }

    function toggleDetalhesMaquina(maquina, container, botao) {
        const detalhes_container = container.querySelector('.detalhes');
    
        if (detalhes_container) {
            container.removeChild(detalhes_container);
            botao.textContent = 'Exibir Detalhes';
        } else {
            const new_detalhes_container = document.createElement('div');
            new_detalhes_container.classList.add('detalhes');
    
            const detalhes_maquina = `
                <div id="maquina-container-${maquina.id}"></div>
                <pre><strong>Nome:</strong> ${maquina.nome}</pre>
                <pre><string>Tipo:</strong> ${maquina.tipo}</pre>
                <pre style="white-space: pre-wrap;"><strong>Estados <i>Q</i>:</strong> ${Object.keys(maquina.transicoes).join(', ')}</pre>
                <pre><strong>Alfabeto Σ:</strong> ${maquina.alfabetoFita.join(', ')}</pre>
                <pre><strong>Transições:</strong></pre>
                <pre>${formatarTransicoesComoTabela_MT(maquina.transicoes, maquina)}</pre>
                <pre><strong>Estado inicial:</strong> ${maquina.estadoInicial}</pre>
                <pre  style="white-space: pre-wrap;"><strong>Estados de aceitação:</strong> ${maquina.estadosAceitacao.join(', ')}</pre>
            `;
            new_detalhes_container.innerHTML = detalhes_maquina;
    
            container.appendChild(new_detalhes_container);
            botao.textContent = 'Ocultar Detalhes';
            renderMaquinas(maquina);
        }
    }

    async function renderMaquinas(maquina) {
        const container = document.getElementById(`maquina-container-${maquina.id}`);
        
        const maquinaContainer = document.createElement('div');
        maquinaContainer.id = `maquina-${maquina.id}`;
        maquinaContainer.className = 'maquina-container';
        container.innerHTML = '';
        container.appendChild(maquinaContainer);
    
        const dotCode = `
        digraph {
            // Definir nós
            ${Object.keys(maquina.transicoes).map(estado => `${estado} [label="${estado}"];`).join('\n')}
    
            // Definir estado inicial
            initial [shape=plaintext, label=""];
            initial -> ${maquina.estadoInicial};
    
            // Definir estados de aceitação
            ${maquina.estadosAceitacao.map(estado => `${estado} [shape=doublecircle];`).join('\n')}
    
            // Definir transições
            ${Object.keys(maquina.transicoes).map(origem => {
                const transicoes = maquina.transicoes[origem];
                return Object.keys(transicoes).map(simbolo => {
                    const transicao = transicoes[simbolo];
                    return `${origem} -> ${transicao.estadoDestino} [label="${simbolo} / ${transicao.simboloEscrito}, ${transicao.movimento}"];`;
                }).join('\n');
            }).join('\n')}
        }
        `;
    
        // Renderizar o gráfico usando viz.js
        const viz = new Viz();
        viz.renderSVGElement(dotCode)
            .then(svgElement => {
                maquinaContainer.appendChild(svgElement);
            })
            .catch(error => {
                // Tratar erros, se houver
                console.error(`Erro ao renderizar o gráfico para a máquina ${maquina.id}:`, error);
            });
    }

    async function deletarMaquina(maquina){
        if(confirm('Tem certeza que deseja deletar este autômato?')){
            await deletar(maquina);
        }
    }
    
    async function deletar(maquina){
        try {
            const response = await fetch(`${host}/api/maquina/delete/${maquina.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
                await buscarTodasMaquinas(); 
        } catch (error) {
            console.error('Erro ao deletar a máquina:', error);
        }
    }
    
    
    
    
}

document.addEventListener('DOMContentLoaded', (event) => {
    buscarTodasMaquinas();
});
