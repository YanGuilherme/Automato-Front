//digitar aq os scripts

document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('entrada_form');
    const input_quantidade = document.getElementById('quantidade_estados');
    const botao_inserir_estados = document.getElementById('btn_inserir_estados');
    const input_alfabeto = document.getElementById('entrada_alfabeto');
    const botao_inserir_alfabeto = document.getElementById('btn_inserir_alfabeto');

    const estados_container = document.getElementById('container_estados');



    form.addEventListener('submit', function(event){
        event.preventDefault();


        const quantidade_estados = input_quantidade.value;

        if(quantidade_estados > 0){
            input_quantidade.disabled = true;
            botao_inserir_estados.disabled = true;

            input_alfabeto.disabled = false;
            botao_inserir_alfabeto.disabled = false;

            estados_container.innerHTML = '';
    

            const estados = [];
            for(let i = 1 ; i <= quantidade_estados ; i++){
                estados.push(`q${i}`);
                const estado_msg = document.createElement('p');
                estado_msg.textContent = `Estado ${i} inserido: q${i}.`;
                estados_container.appendChild(estado_msg);
            }
            console.log(estados);
    
            form.appendChild(estados_container);
        }else{
            alert("Por favor insira uma quantidade válida de estados.");
        }

        

    });
});