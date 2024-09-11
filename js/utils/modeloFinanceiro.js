function aplicarModeloFinanceiroComPrefixo(valor) {
    if (isNaN(valor)) {
        return "R$ 0,00";
    }
    return Number(valor).toLocaleString("pt-br", { style: 'currency', currency: 'BRL' });
}

function calcularTotal(produtos) {
    let total = 0;
    produtos.forEach(produto => {
        total += parseFloat(produto.valor); 
    });
    document.getElementById("total-valor").textContent = `Total: ${aplicarModeloFinanceiroComPrefixo(total)}`;
}
