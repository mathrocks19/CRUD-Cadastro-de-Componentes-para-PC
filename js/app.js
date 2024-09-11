var tbody = document.querySelector("table>tbody");
var form = {
    id: null,
    nome: document.querySelector("#nome"),
    quantidade: document.getElementById("quantidade"),
    valor: document.getElementById("valor"),
    btnSalvar: document.getElementById("btn-salvar"),
    btnCancelar: document.getElementById("btn-cancelar"),
};

let produtos = []; 

// Evento de click no botão salvar
form.btnSalvar.addEventListener('click', () => {
    var produto = {
        nome: form.nome.value,
        quantidadeEstoque: parseInt(form.quantidade.value),
        valor: parseFloat(form.valor.value) 
    };

    if (!produto.nome || !produto.quantidadeEstoque || !produto.valor) {
        alert('Preencha todos os campos!');
        return;
    }

    if (form.id) {
        atualizarProdutoAPI(form.id, produto);
    } else {
        cadastrarProdutoAPI(produto);
    }
});

// Função de cadastrar produto
function cadastrarProdutoAPI(produto) {
    fetch("http://localhost:3000/produtos", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(produto => { 
        produtos.push(produto); 
        alert("Produto adicionado com sucesso!");
        preencherTabela(produtos); 
        limparFormulario();
        calcularTotal(produtos); 
    })
    .catch(erro => console.log(erro));
}

// Função de Atualizar Produto 
function atualizarProdutoAPI(id, produto) {
    fetch(`http://localhost:3000/produtos/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(produto => { 
        const index = produtos.findIndex(p => p.id === produto.id);
        if (index !== -1) {
            produtos[index] = produto;
        }
        alert("Produto atualizado com sucesso!");
        preencherTabela(produtos); 
        limparFormulario();
        calcularTotal(produtos); // Recalcula o total
    })
    .catch(erro => console.log(erro));
}

// (Get)
function obterProdutos() {
    fetch("http://localhost:3000/produtos")
        .then(response => response.json())
        .then(response => {
            produtos = response; 
            preencherTabela(produtos);
            calcularTotal(produtos); 
        })
        .catch(erro => console.log(erro));
}

// Função de Preencher Tabela
function preencherTabela(produtos) {
    tbody.innerHTML = ""; 

    produtos.forEach(produto => {
        var tr = document.createElement("tr");
        var tdId = document.createElement("td");
        var tdNome = document.createElement("td");
        var tdQuantidade = document.createElement("td");
        var tdValor = document.createElement("td");
        var tdAcoes = document.createElement("td");

        tdId.textContent = produto.id;
        tdNome.textContent = produto.nome;
        tdQuantidade.textContent = produto.quantidadeEstoque;
        tdValor.textContent = aplicarModeloFinanceiroComPrefixo(produto.valor * produto.quantidadeEstoque); // Calcula o valor total

        var btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn btn-warning btn-sm mr-2";
        btnEditar.addEventListener('click', () => abrirModalEdicao(produto));

        var btnDeletar = document.createElement("button");
        btnDeletar.textContent = "Deletar";
        btnDeletar.className = "btn btn-danger btn-sm";
        btnDeletar.addEventListener('click', () => deletarProduto(produto.id));

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnDeletar);
        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdQuantidade);
        tr.appendChild(tdValor);
        tr.appendChild(tdAcoes);
        tbody.appendChild(tr);
    });
}

// Função de abertura do modal para editar um Produto
function abrirModalEdicao(produto) {
    form.id = produto.id;
    form.nome.value = produto.nome;
    form.quantidade.value = produto.quantidadeEstoque;
    form.valor.value = produto.valor;

    $('#exampleModal').modal('show');
    document.getElementById('exampleModalLabel').textContent = 'Editar Produto';
}

// Função de Deletar Produto
function deletarProduto(id) {
    fetch(`http://localhost:3000/produtos/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Produto deletado com sucesso!");
        produtos = produtos.filter(p => p.id !== id);
        preencherTabela(produtos);
        calcularTotal(produtos);
    })
    .catch(erro => console.log(erro));
}

function limparFormulario() {
    form.id = null;
    form.nome.value = "";
    form.quantidade.value = "";
    form.valor.value = "";
}

// Função para calcular o total dos valores
function calcularTotal(produtos) {
    let total = 0;
    produtos.forEach(produto => {
        total += parseFloat(produto.valor) * parseFloat(produto.quantidadeEstoque);
    });
    document.getElementById("total-valor").textContent = `Total: ${aplicarModeloFinanceiroComPrefixo(total)}`;
}

obterProdutos(); 