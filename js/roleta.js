// Sorteio com anti-repetição: embaralha o pool ativo e vai "puxando" itens
// dele sem repetir; só reembaralha (podendo repetir) quando o pool se esgota.
var Roleta = (function () {
  var bolsa = [];
  var poolAtual = [];

  function embaralhar(lista) {
    var copia = lista.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var trocaTemp = copia[i];
      copia[i] = copia[j];
      copia[j] = trocaTemp;
    }
    return copia;
  }

  function definirPool(novoPool) {
    poolAtual = novoPool;
    bolsa = embaralhar(poolAtual);
  }

  function sortear() {
    if (poolAtual.length === 0) {
      return null;
    }
    if (bolsa.length === 0) {
      bolsa = embaralhar(poolAtual);
    }
    return bolsa.pop();
  }

  function tamanhoPool() {
    return poolAtual.length;
  }

  return {
    definirPool: definirPool,
    sortear: sortear,
    tamanhoPool: tamanhoPool
  };
})();
