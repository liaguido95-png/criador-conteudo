// Única porta de acesso ao localStorage (ver CLAUDE.md R9) — nenhum outro
// arquivo deve chamar localStorage diretamente. Acesso livre, sem conta.
var Armazenamento = (function () {
  var CHAVE = "sala_de_ideias_dados";

  function padrao() {
    return { nichos: {}, salvos: [] };
  }

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        return padrao();
      }
      var dados = JSON.parse(bruto);
      return {
        nichos: dados.nichos || {},
        salvos: dados.salvos || []
      };
    } catch (e) {
      // JSON corrompido ou localStorage bloqueado: segue com os padrões,
      // sem quebrar o app. Tratamento mais completo chega numa etapa futura.
      return padrao();
    }
  }

  function salvar(dados) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
      return true;
    } catch (e) {
      // Provavelmente localStorage cheio ou desabilitado pelo navegador.
      return false;
    }
  }

  return {
    carregar: carregar,
    salvar: salvar
  };
})();
