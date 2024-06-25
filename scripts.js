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
                    item += `<li id="carroItem"> ID: ${element.id} <br/>Modelo: ${element.modelo} <br/> Preço: ${element.preco}
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

function update(event){
    event.preventDefault();

    const id = document.getElementById('entrada_edit1').value;
    const modelo = document.getElementById('entrada_edit2').value;
    const preco = document.getElementById('entrada_edit3').value;

    if(!id){
        alert("Por favor, forneça o ID do carro que deseja alterar.");
        return;
    }

    const dadosCarro = {};
    if(modelo){
        dadosCarro.modelo = modelo;
    }
    if(preco){
        dadosCarro.preco = preco;
    }

    if(Object.keys(dadosCarro).length === 0){
        alert('Por favor, forneça preencha pelo menos um capo para atualizar.');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT',`http://localhost:8080/update/${id}`,true);
    xhr.setRequestHeader('Content-Type','application/json');

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){ //requisicao pronta
            if(xhr.status == 200){ //retornando ok
                console.log("Carro atualizado.");
                listar(); // ja chama o metodo listar para ver como ficou a atualizacao
            }else{
                console.error('Erro ao atualizar o carro.', xhr.responseText);
                
            }
        }
    };


    xhr.send(JSON.stringify(dadosCarro));

    document.getElementById('entrada_edit1').value = '';
    document.getElementById('entrada_edit2').value = '';
    document.getElementById('entrada_edit3').value = '';

}

function deletar(event){
    event.preventDefault();
    const id = document.getElementById('id_delete').value;
    if(!id){
        alert("Por favor, forneça o ID do carro que deseja deletar.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:8080/delete/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 204){ // 204 no content
                console.log("Carro deletado com sucesso.");
                listar();
            }else{
                console.error("Erro ao deletar o carro.", xhr.responseText);
            }
        }
    };

    xhr.send();

    document.getElementById('id_delete').value = '';





}
