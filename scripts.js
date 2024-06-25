function enviarDados(event){
    event.preventDefault();
    const modelo = document.getElementById('entrada1').value; //colocando os dados em variaveis js
    const preco = document.getElementById('entrada2').value;
    const id = '';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/create', true); //metodo post no endpoit adicionarCarro
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            console.log(xhr.responseText); //verificando resposta
        }
    }
    let dadosCarro = {
        carro: [
            {
                modelo: modelo,
                preco: preco,
                id: id
            }
        ]
    };
    

    xhr.send(JSON.stringify(dadosCarro)); //enviando requisiçoes

    document.getElementById('entrada1').value = '';
    document.getElementById('entrada2').value = ''; //limpando entrada
}
function listar() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let response = JSON.parse(xhr.responseText);
            
            // Se a resposta é um array diretamente, atribua-a a 'carro'
            let carro = response; // essa porra de response ja é um array, nao precisa colocar response.carro, essa merda que tava bugando tudo

            // Verifique se 'carro' é realmente um array
            if (Array.isArray(carro)) {
                let item = '';

                for (const element of carro) {
                    item += `<li id="carroItem"> Modelo: ${element.modelo} <br/> Preço: ${element.preco}
                    </li><br/>`;
                }

                document.getElementById('carros-list').innerHTML = item;
            } else {
                console.error('Resposta não é um array:', carro);
            }
        }
    };
    xhr.open("GET", "http://localhost:8080/findAll", true);
    xhr.send();
}
