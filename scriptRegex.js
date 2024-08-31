document.addEventListener('DOMContentLoaded', function(){
    const entrada_regex = document.getElementById('regex');
    const botao_entrada = document.getElementById('botao_entrada_regex');

    botao_entrada.addEventListener('click', function(){
        const regex = entrada_regex.value;
        enviarER(regex);
    });


async function enviarER(regex){

    const expressao = {
        "expressao":regex
    }

    try {
        const response = await fetch(`${host}/api/automatos/regexToAfn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expressao)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }catch(error) {
        console.error('Erro ao gerar autômato:', error);
    }
}

});