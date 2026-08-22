// Orquestra a tela inteira: roleta, cronômetros, nicho pessoal e persistência.

var dadosCarregados = Armazenamento.carregar();

var estadoApp = {
  nichos: dadosCarregados.nichos, // nome do nicho -> array de temas
  salvos: dadosCarregados.salvos, // array de { categoria, tema }
  categoriaSelecionada: null, // null = "Tudo"; senão, o nome de uma categoria/nicho só
  historico: [], // itens já sorteados nesta seleção
  animando: false,
  audioCtx: null
};

function persistirDados() {
  Armazenamento.salvar({ nichos: estadoApp.nichos, salvos: estadoApp.salvos });
}

var estadoCronometro = {
  instancia: null,
  pausado: false
};

function mostrarErroConta(mensagem) {
  var erro = document.getElementById("erro-conta");
  erro.textContent = mensagem;
  erro.hidden = false;
}

function limparErroConta() {
  document.getElementById("erro-conta").hidden = true;
}

function atualizarUIConta(usuario) {
  document.getElementById("bloco-conta-deslogada").hidden = !!usuario;
  document.getElementById("bloco-conta-logada").hidden = !usuario;
  if (usuario) {
    document.getElementById("texto-usuario-logado").textContent = "Logada como " + usuario.email;
  }
}

// Depois do login, junta o que já existia sem conta com o que a conta já
// tinha guardado (Armazenamento.sincronizarComNuvem cuida da mesclagem) e
// atualiza a tela inteira com o resultado.
function hidratarComNuvem(uid) {
  Armazenamento.sincronizarComNuvem(uid).then(function (dados) {
    estadoApp.nichos = dados.nichos;
    estadoApp.salvos = dados.salvos;
    renderizarChipsCategorias();
    renderizarNichosSalvos();
    renderizarSalvos();
    atualizarPoolERoleta();
  }).catch(function () {
    // Sem rede ou regras do Firestore ainda não configuradas: o app segue
    // funcionando só com os dados locais, sem travar a tela por isso.
  });
}

function aoClicarEntrar() {
  limparErroConta();
  var email = document.getElementById("input-email").value.trim();
  var senha = document.getElementById("input-senha").value;
  Autenticacao.entrar(email, senha).catch(function (erro) {
    mostrarErroConta(erro.message);
  });
}

function aoClicarCriarConta() {
  limparErroConta();
  var email = document.getElementById("input-email").value.trim();
  var senha = document.getElementById("input-senha").value;
  Autenticacao.cadastrar(email, senha).catch(function (erro) {
    mostrarErroConta(erro.message);
  });
}

function aoClicarSair() {
  Autenticacao.sair();
}

function aoClicarExcluirConta() {
  var confirmou = window.confirm(
    "Isso apaga sua conta e todos os dados salvos nela (nichos e pautas). " +
    "Não dá pra desfazer. Quer continuar?"
  );
  if (!confirmou) {
    return;
  }

  var usuario = firebase.auth().currentUser;
  Armazenamento.excluirDadosNuvem(usuario.uid)
    .then(function () { return Autenticacao.excluirConta(); })
    .catch(function (erro) {
      mostrarErroConta(erro.message);
    });
}

function listaCompletaCategorias() {
  var todas = [];

  ["pesquisa", "autoconhecimento"].forEach(function (grupo) {
    var categorias = TEMAS.categoriasFixas[grupo];
    Object.keys(categorias).forEach(function (nome) {
      todas.push({ nome: nome, tipo: grupo, temas: categorias[nome] });
    });
  });

  Object.keys(estadoApp.nichos).forEach(function (nome) {
    todas.push({ nome: nome, tipo: "nicho", temas: estadoApp.nichos[nome] });
  });

  return todas;
}

function montarPoolAtivo() {
  var todas = listaCompletaCategorias();
  var selecionadas = estadoApp.categoriaSelecionada === null
    ? todas
    : todas.filter(function (c) { return c.nome === estadoApp.categoriaSelecionada; });

  var pool = [];
  selecionadas.forEach(function (categoria) {
    categoria.temas.forEach(function (tema) {
      pool.push({ categoria: categoria.nome, tipo: categoria.tipo, tema: tema });
    });
  });
  return pool;
}

function limparResultadoEHistorico() {
  estadoApp.historico = [];
  document.getElementById("lista-historico").innerHTML = "";
  document.getElementById("resultado-categoria").textContent = "";
  document.getElementById("resultado-tema").textContent = "Escolha uma categoria acima e clique em Girar.";
}

function atualizarPoolERoleta() {
  Roleta.definirPool(montarPoolAtivo());
  // O histórico é da seleção atual; muda a seleção, zera o histórico.
  limparResultadoEHistorico();
}

function renderizarChipsCategorias() {
  var todas = listaCompletaCategorias();
  var lista = document.getElementById("lista-chips-categorias");
  lista.innerHTML = "";

  todas.forEach(function (categoria) {
    var item = document.createElement("li");
    var chip = document.createElement("button");

    chip.type = "button";
    chip.className = "chip";
    chip.textContent = categoria.nome;
    chip.setAttribute("aria-pressed", estadoApp.categoriaSelecionada === categoria.nome);
    chip.addEventListener("click", function () {
      estadoApp.categoriaSelecionada = categoria.nome;
      renderizarChipsCategorias();
      atualizarPoolERoleta();
    });

    item.appendChild(chip);
    lista.appendChild(item);
  });

  document.getElementById("chip-tudo").setAttribute("aria-pressed", estadoApp.categoriaSelecionada === null);
}

function renderizarPainelSelecao() {
  renderizarChipsCategorias();
}

function adicionarAoHistorico(resultado) {
  estadoApp.historico.unshift(resultado);
  var lista = document.getElementById("lista-historico");
  var item = document.createElement("li");
  item.textContent = resultado.categoria + ": " + resultado.tema;
  lista.insertBefore(item, lista.firstChild);
}

// Todo som do site é sintetizado na hora com a Web Audio API — sem nenhum
// arquivo de áudio, então zero download e zero custo.
function obterAudioCtx() {
  if (!estadoApp.audioCtx) {
    var Contexto = window.AudioContext || window.webkitAudioContext;
    estadoApp.audioCtx = new Contexto();
  }
  if (estadoApp.audioCtx.state === "suspended") {
    estadoApp.audioCtx.resume();
  }
  return estadoApp.audioCtx;
}

// Som curto de "tique", usado na animação de girar.
function tocarTique() {
  try {
    var ctx = obterAudioCtx();
    var osc = ctx.createOscillator();
    var ganho = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 720;
    ganho.gain.setValueAtTime(0.06, ctx.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    osc.connect(ganho);
    ganho.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    // Sem Web Audio disponível: o efeito visual continua, só sem som.
  }
}

// Aviso sonoro de "tempo esgotado" do cronômetro: dois tons curtos, subindo.
function tocarAlarme() {
  try {
    var ctx = obterAudioCtx();
    [660, 880].forEach(function (frequencia, indice) {
      var osc = ctx.createOscillator();
      var ganho = ctx.createGain();
      var inicio = ctx.currentTime + indice * 0.18;
      osc.type = "sine";
      osc.frequency.value = frequencia;
      ganho.gain.setValueAtTime(0.0001, inicio);
      ganho.gain.exponentialRampToValueAtTime(0.14, inicio + 0.02);
      ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.32);
      osc.connect(ganho);
      ganho.connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.32);
    });
  } catch (e) {
    // Sem Web Audio disponível: o aviso visual continua, só sem som.
  }
}

// Efeito de "rolar": pisca temas aleatórios do pool antes de parar no
// resultado de verdade (que já veio sorteado do Roleta.sortear()).
function animarSorteio(resultadoFinal) {
  var elCategoria = document.getElementById("resultado-categoria");
  var elTema = document.getElementById("resultado-tema");
  var pool = Roleta.tamanhoPool() > 0 ? montarPoolAtivo() : [resultadoFinal];
  var passos = 16;
  var i = 0;

  estadoApp.animando = true;
  document.getElementById("botao-girar").disabled = true;

  function passo() {
    if (i < passos) {
      var aleatorio = pool[Math.floor(Math.random() * pool.length)];
      elCategoria.textContent = aleatorio.categoria;
      elTema.textContent = aleatorio.tema;
      tocarTique();
      i++;
      // desacelera conforme chega perto do fim, como um giro de verdade
      var atraso = 60 + i * i * 1.6;
      setTimeout(passo, atraso);
    } else {
      elCategoria.textContent = resultadoFinal.categoria;
      elTema.textContent = resultadoFinal.tema;
      adicionarAoHistorico(resultadoFinal);
      estadoApp.animando = false;
      document.getElementById("botao-girar").disabled = false;
    }
  }

  passo();
}

function aoClicarGirar() {
  if (estadoApp.animando) {
    return;
  }

  var resultado = Roleta.sortear();

  if (!resultado) {
    document.getElementById("resultado-categoria").textContent = "";
    document.getElementById("resultado-tema").textContent = "Selecione uma categoria para girar.";
    return;
  }

  animarSorteio(resultado);
}

function aoClicarChipTudo() {
  estadoApp.categoriaSelecionada = null;
  renderizarChipsCategorias();
  atualizarPoolERoleta();
}

function montarPromptNicho(nomeNicho) {
  return (
    "Gere 150 sugestões de temas de conteúdo sobre \"" + nomeNicho + "\", " +
    "para redes sociais. Regras: um tema por linha, sem numeração e sem " +
    "marcadores, temas específicos e concretos (não genéricos), sem repetir " +
    "ideias parecidas entre si."
  );
}

function aoClicarGerarPrompt() {
  var campoNicho = document.getElementById("input-nicho");
  var nomeNicho = campoNicho.value.trim();

  if (!nomeNicho) {
    campoNicho.focus();
    return;
  }

  var blocoPrompt = document.getElementById("bloco-prompt");
  var textoPrompt = document.getElementById("texto-prompt");
  textoPrompt.value = montarPromptNicho(nomeNicho);
  blocoPrompt.hidden = false;
}

function mostrarAvisoCopiado(mensagem) {
  var aviso = document.getElementById("aviso-copiado");
  aviso.textContent = mensagem;
  aviso.hidden = false;
  setTimeout(function () {
    aviso.hidden = true;
  }, 2500);
}

function aoClicarCopiarPrompt() {
  var textoPrompt = document.getElementById("texto-prompt");

  // navigator.clipboard exige contexto seguro; em file:// pode falhar,
  // por isso caímos para selecionar o texto e o navegador aceitar Ctrl+C.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textoPrompt.value).then(function () {
      mostrarAvisoCopiado("Copiado!");
    }, function () {
      textoPrompt.select();
      mostrarAvisoCopiado("Não copiou automático — texto selecionado, use Ctrl+C.");
    });
  } else {
    textoPrompt.select();
    mostrarAvisoCopiado("Texto selecionado — use Ctrl+C para copiar.");
  }
}

function aoClicarSalvarNicho() {
  var campoNicho = document.getElementById("input-nicho");
  var campoColar = document.getElementById("texto-colar");
  var erro = document.getElementById("erro-nicho");
  var nomeNicho = campoNicho.value.trim();

  erro.hidden = true;

  if (!nomeNicho) {
    erro.textContent = "Digite o nome do nicho antes de criar.";
    erro.hidden = false;
    return;
  }

  var linhas = campoColar.value
    .split("\n")
    .map(function (linha) { return linha.trim(); })
    .filter(function (linha) { return linha.length > 0; });

  if (linhas.length === 0) {
    erro.textContent = "Cole ao menos um tema, um por linha, antes de criar o nicho.";
    erro.hidden = false;
    return;
  }

  estadoApp.nichos[nomeNicho] = linhas;
  estadoApp.categoriaSelecionada = nomeNicho;
  persistirDados();

  renderizarChipsCategorias();
  renderizarNichosSalvos();
  atualizarPoolERoleta();

  campoColar.value = "";
  document.getElementById("bloco-prompt").hidden = true;
}

function renderizarNichosSalvos() {
  var lista = document.getElementById("lista-nichos-salvos");
  lista.innerHTML = "";
  var nomes = Object.keys(estadoApp.nichos);

  document.getElementById("aviso-sem-nichos-salvos").hidden = nomes.length > 0;

  nomes.forEach(function (nome) {
    var item = document.createElement("li");
    item.textContent = nome + " (" + estadoApp.nichos[nome].length + " temas) ";

    var botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "botao-remover";
    botaoRemover.textContent = "🗑️ Remover";
    botaoRemover.addEventListener("click", function () {
      delete estadoApp.nichos[nome];
      if (estadoApp.categoriaSelecionada === nome) {
        estadoApp.categoriaSelecionada = null;
      }
      persistirDados();
      renderizarChipsCategorias();
      renderizarNichosSalvos();
      atualizarPoolERoleta();
    });

    item.appendChild(botaoRemover);
    lista.appendChild(item);
  });
}

function formatarTempo(segundos) {
  var minutos = Math.floor(segundos / 60);
  var segsRestantes = segundos % 60;
  var minutosTexto = minutos < 10 ? "0" + minutos : String(minutos);
  var segundosTexto = segsRestantes < 10 ? "0" + segsRestantes : String(segsRestantes);
  return minutosTexto + ":" + segundosTexto;
}

function abrirCronometro(tipo) {
  var duracaoSegundos = tipo === "pesquisa" ? 600 : 60;
  var titulo = tipo === "pesquisa" ? "Pesquisar · 10 min" : "Falar · 1 min";
  var reforco = tipo === "pesquisa"
    ? "✍️ Pense, pesquise e escreva à mão, no papel. O app não guarda nenhuma anotação."
    : "🎙️ Grave-se falando a partir do que você escreveu no papel.";

  document.getElementById("cronometro-titulo").textContent = titulo;
  document.getElementById("cronometro-reforco").textContent = reforco;
  document.getElementById("cronometro-tempo").textContent = formatarTempo(duracaoSegundos);
  document.getElementById("cronometro-aviso").hidden = true;
  document.getElementById("botao-pausar-cronometro").hidden = false;
  document.getElementById("botao-pausar-cronometro").textContent = "⏸️ Pausar";
  document.getElementById("botao-cancelar-cronometro").textContent = "✖️ Cancelar";
  document.getElementById("overlay-cronometro").hidden = false;

  if (estadoCronometro.instancia) {
    estadoCronometro.instancia.cancelar();
  }
  estadoCronometro.pausado = false;

  estadoCronometro.instancia = Cronometro.criar({
    duracaoSegundos: duracaoSegundos,
    aoAtualizar: function (segundosRestantes) {
      document.getElementById("cronometro-tempo").textContent = formatarTempo(segundosRestantes);
    },
    aoTerminar: function () {
      tocarAlarme();
      var aviso = document.getElementById("cronometro-aviso");
      aviso.textContent = "⏰ Tempo esgotado!";
      aviso.hidden = false;
      document.getElementById("botao-pausar-cronometro").hidden = true;
      document.getElementById("botao-cancelar-cronometro").textContent = "Fechar";
    }
  });

  estadoCronometro.instancia.iniciar();
}

function fecharCronometro() {
  if (estadoCronometro.instancia) {
    estadoCronometro.instancia.cancelar();
    estadoCronometro.instancia = null;
  }
  document.getElementById("overlay-cronometro").hidden = true;
}

function aoClicarPausarCronometro() {
  if (!estadoCronometro.instancia) {
    return;
  }
  var botao = document.getElementById("botao-pausar-cronometro");
  if (estadoCronometro.pausado) {
    estadoCronometro.instancia.retomar();
    botao.textContent = "⏸️ Pausar";
  } else {
    estadoCronometro.instancia.pausar();
    botao.textContent = "▶️ Retomar";
  }
  estadoCronometro.pausado = !estadoCronometro.pausado;
}

var LINK_IA_LIA = "https://chatgpt.com/g/g-6a7ce22860dc8191b7021a3195fabc30-l-ia";

function aoClicarIrParaIA() {
  // Passar "width"/"height" pede pro navegador abrir uma JANELA separada,
  // em vez de uma aba na mesma janela — assim a Sala de Ideias não some.
  window.open(LINK_IA_LIA, "_blank", "noopener,noreferrer,width=480,height=850");
}

function renderizarSalvos() {
  var lista = document.getElementById("lista-salvos");
  lista.innerHTML = "";

  document.getElementById("aviso-sem-salvos").hidden = estadoApp.salvos.length > 0;

  estadoApp.salvos.forEach(function (item, indice) {
    var elemento = document.createElement("li");
    elemento.textContent = item.categoria + ": " + item.tema + " ";

    var botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "botao-remover";
    botaoRemover.textContent = "🗑️";
    botaoRemover.setAttribute("aria-label", "Remover pauta salva");
    botaoRemover.addEventListener("click", function () {
      estadoApp.salvos.splice(indice, 1);
      persistirDados();
      renderizarSalvos();
    });

    elemento.appendChild(botaoRemover);
    lista.appendChild(elemento);
  });
}

function aoClicarSalvarPauta() {
  var categoria = document.getElementById("resultado-categoria").textContent;
  var tema = document.getElementById("resultado-tema").textContent;
  var botao = document.getElementById("botao-salvar-pauta");

  if (!categoria || !tema) {
    return;
  }

  var jaSalvo = estadoApp.salvos.some(function (item) {
    return item.categoria === categoria && item.tema === tema;
  });

  if (!jaSalvo) {
    estadoApp.salvos.push({ categoria: categoria, tema: tema });
    persistirDados();
    renderizarSalvos();
  }

  botao.textContent = jaSalvo ? "♥ Já está salva" : "♥ Salva!";
  setTimeout(function () {
    botao.textContent = "♡ Salvar pauta";
  }, 1500);
}

// Se a pessoa abrir "Inserir meu nicho", não escrever nada e rolar a tela
// pra longe da seção, ela fecha sozinha — sem deixar o painel aberto à toa.
function configurarFechamentoAutomaticoNicho() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  var detalhes = document.querySelector(".details-nicho");
  var campoNicho = document.getElementById("input-nicho");

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!detalhes.open) {
        return;
      }
      if (campoNicho.value.trim() !== "") {
        return;
      }
      if (!entrada.isIntersecting) {
        detalhes.open = false;
      }
    });
  });

  observador.observe(detalhes);
}

function iniciar() {
  renderizarChipsCategorias();
  renderizarNichosSalvos();
  renderizarSalvos();
  atualizarPoolERoleta();
  configurarFechamentoAutomaticoNicho();

  Autenticacao.aoMudarSessao(function (usuario) {
    atualizarUIConta(usuario);
    if (usuario) {
      Armazenamento.definirUsuario(usuario.uid);
      hidratarComNuvem(usuario.uid);
    } else {
      Armazenamento.limparUsuario();
    }
  });

  document.getElementById("botao-entrar").addEventListener("click", aoClicarEntrar);
  document.getElementById("botao-criar-conta").addEventListener("click", aoClicarCriarConta);
  document.getElementById("botao-sair").addEventListener("click", aoClicarSair);
  document.getElementById("botao-excluir-conta").addEventListener("click", aoClicarExcluirConta);

  document.getElementById("botao-girar").addEventListener("click", aoClicarGirar);
  document.getElementById("chip-tudo").addEventListener("click", aoClicarChipTudo);
  document.getElementById("botao-salvar-pauta").addEventListener("click", aoClicarSalvarPauta);

  document.getElementById("botao-gerar-prompt").addEventListener("click", aoClicarGerarPrompt);
  document.getElementById("botao-copiar-prompt").addEventListener("click", aoClicarCopiarPrompt);
  document.getElementById("botao-ir-para-ia").addEventListener("click", aoClicarIrParaIA);
  document.getElementById("botao-salvar-nicho").addEventListener("click", aoClicarSalvarNicho);

  document.getElementById("botao-pesquisar").addEventListener("click", function () {
    abrirCronometro("pesquisa");
  });
  document.getElementById("botao-falar").addEventListener("click", function () {
    abrirCronometro("falar");
  });
  document.getElementById("botao-pausar-cronometro").addEventListener("click", aoClicarPausarCronometro);
  document.getElementById("botao-cancelar-cronometro").addEventListener("click", fecharCronometro);
}

iniciar();
