// Única porta de acesso aos dados — localStorage e Firestore (ver CLAUDE.md
// R9): nenhum outro arquivo chama localStorage ou o SDK do Firestore direto.
var Armazenamento = (function () {
  var CHAVE = "sala_de_ideias_dados";
  var uidAtual = null;

  function padrao() {
    return { nichos: {}, salvos: [] };
  }

  function carregarLocal() {
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
      // sem quebrar o app. Tratamento mais completo chega na Etapa 7.
      return padrao();
    }
  }

  function salvarLocal(dados) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
      return true;
    } catch (e) {
      // Provavelmente localStorage cheio ou desabilitado pelo navegador.
      return false;
    }
  }

  function documentoNuvem(uid) {
    return firebase.firestore().collection("usuarios").doc(uid);
  }

  function carregarNuvem(uid) {
    return documentoNuvem(uid).get().then(function (doc) {
      if (!doc.exists) {
        return null;
      }
      var dados = doc.data();
      return {
        nichos: dados.nichos || {},
        salvos: dados.salvos || []
      };
    });
  }

  function salvarNuvem(uid, dados) {
    // Falha de rede na nuvem não pode travar o uso local do app — por isso
    // o erro é só engolido aqui; os dados continuam seguros em localStorage.
    return documentoNuvem(uid).set(dados).catch(function () {});
  }

  // Nichos: nome igual em local e nuvem, a versão da nuvem vence (é o que
  // outro aparelho já tinha salvo). Pautas salvas: união sem duplicar,
  // pra ninguém perder uma pauta favoritada em nenhum dos dois lados.
  function mesclarDados(local, remoto) {
    var nichos = {};
    Object.keys(local.nichos).forEach(function (nome) {
      nichos[nome] = local.nichos[nome];
    });
    Object.keys(remoto.nichos).forEach(function (nome) {
      nichos[nome] = remoto.nichos[nome];
    });

    var salvos = local.salvos.slice();
    remoto.salvos.forEach(function (item) {
      var jaExiste = salvos.some(function (s) {
        return s.categoria === item.categoria && s.tema === item.tema;
      });
      if (!jaExiste) {
        salvos.push(item);
      }
    });

    return { nichos: nichos, salvos: salvos };
  }

  function carregar() {
    return carregarLocal();
  }

  function salvar(dados) {
    var salvouLocal = salvarLocal(dados);
    if (uidAtual) {
      salvarNuvem(uidAtual, dados);
    }
    return salvouLocal;
  }

  function definirUsuario(uid) {
    uidAtual = uid;
  }

  function limparUsuario() {
    uidAtual = null;
  }

  // Roda uma vez, logo após o login: junta o que já existia sem conta com o
  // que a conta já tinha na nuvem, e deixa os dois lados iguais no final.
  function sincronizarComNuvem(uid) {
    return carregarNuvem(uid).then(function (remoto) {
      var local = carregarLocal();
      var mesclado = remoto ? mesclarDados(local, remoto) : local;
      salvarLocal(mesclado);
      return salvarNuvem(uid, mesclado).then(function () {
        return mesclado;
      });
    });
  }

  function excluirDadosNuvem(uid) {
    return documentoNuvem(uid).delete();
  }

  return {
    carregar: carregar,
    salvar: salvar,
    definirUsuario: definirUsuario,
    limparUsuario: limparUsuario,
    sincronizarComNuvem: sincronizarComNuvem,
    excluirDadosNuvem: excluirDadosNuvem
  };
})();
