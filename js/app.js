// Orquestra a tela inteira: roleta, cronômetros, nicho pessoal e persistência.

var dadosCarregados = Armazenamento.carregar();

var estadoApp = {
  nichos: dadosCarregados.nichos, // nome do nicho -> array de temas
  salvos: dadosCarregados.salvos, // array de { categoria, tema }
  categoriaSelecionada: null, // null = "Tudo"; senão, o nome de uma categoria/nicho só
  historico: [], // itens já sorteados nesta seleção
  animando: false,
  audioCtx: null,
  etapa: "pronto", // ponto do ciclo girar → pesquisar → falar (ver ETAPAS)
  reiniciado: false // ESC apertado durante um giro que ainda está rolando
};

function persistirDados() {
  Armazenamento.salvar({ nichos: estadoApp.nichos, salvos: estadoApp.salvos });
}

var estadoCronometro = {
  instancia: null,
  pausado: false,
  idFechamento: null
};

// Fluxo conduzido pela barra de espaço: girar → 10 min pesquisando →
// 1 min falando → volta pro começo. A etapa guarda em que ponto do ciclo
// a pessoa está, pra saber o que a próxima barra de espaço deve fazer.
var ETAPAS = {
  PRONTO: "pronto",
  SORTEADO: "sorteado",
  PARA_FALAR: "para_falar"
};

var DICAS = {};
DICAS[ETAPAS.PRONTO] = "<kbd>espaço</kbd> para girar";
DICAS[ETAPAS.SORTEADO] = "<kbd>espaço</kbd> para começar os 10 min de pesquisa · <kbd>esc</kbd> para recomeçar";
DICAS[ETAPAS.PARA_FALAR] = "<kbd>espaço</kbd> para gravar por 1 min · <kbd>esc</kbd> para recomeçar";

function atualizarDicaTeclado() {
  document.getElementById("dica-teclado").innerHTML = DICAS[estadoApp.etapa];
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
  // trocar a seleção recomeça o ciclo: não há mais tema sorteado pra cronometrar
  estadoApp.etapa = ETAPAS.PRONTO;
  atualizarDicaTeclado();
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

// Pedir pra tocar exatamente "agora" faz o som chegar atrasado: quando o
// navegador processa o pedido, esse instante já passou. Uma folga mínima à
// frente resolve, sem atraso perceptível pra quem ouve.
var FOLGA_AGENDAMENTO = 0.02;

// O navegador só libera áudio depois de um gesto da pessoa, e montar o
// contexto de áudio pela primeira vez custa alguns milissegundos. Se isso
// acontecesse no meio do primeiro giro, os primeiros tiques saíam atrasados
// ou nem saíam — e só a partir do segundo giro o som ficava certo. Por isso
// o áudio é preparado no primeiro toque/tecla da pessoa na página, bem antes
// de ser necessário.
function prepararAudio() {
  try {
    var ctx = obterAudioCtx();
    // Um som mudo de um único sample: alguns navegadores só destravam o áudio
    // de verdade depois que alguma coisa é de fato tocada dentro do gesto.
    var fonte = ctx.createBufferSource();
    fonte.buffer = ctx.createBuffer(1, 1, 22050);
    fonte.connect(ctx.destination);
    fonte.start(0);
  } catch (e) {
    // Sem Web Audio: o site funciona igual, só sem som.
  }
}

// Som curto de "tique", usado na animação de girar.
function tocarTique() {
  try {
    var ctx = obterAudioCtx();
    // Se o áudio ainda estiver destravando, é melhor perder este tique do que
    // enfileirar sons atrasados que sairiam todos juntos depois.
    if (ctx.state !== "running") {
      return;
    }

    var inicio = ctx.currentTime + FOLGA_AGENDAMENTO;
    var osc = ctx.createOscillator();
    var ganho = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 720;
    ganho.gain.setValueAtTime(0.06, inicio);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.06);
    osc.connect(ganho);
    ganho.connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + 0.06);
  } catch (e) {
    // Sem Web Audio disponível: o efeito visual continua, só sem som.
  }
}

// Sininho de fim de tempo. Um sino real não é um tom puro: ele soa várias
// frequências ao mesmo tempo, que somem em velocidades diferentes. É isso
// que as camadas abaixo imitam — som suave, com cauda longa, batendo duas
// vezes de leve pra chamar atenção sem assustar.
function tocarSininho() {
  try {
    var ctx = obterAudioCtx();
    if (ctx.state !== "running") {
      return;
    }

    var fundamental = 880;
    var harmonicos = [
      { proporcao: 1, volume: 0.09, duracao: 1.8 },
      { proporcao: 2.02, volume: 0.05, duracao: 1.2 },
      { proporcao: 2.98, volume: 0.03, duracao: 0.8 },
      { proporcao: 4.15, volume: 0.015, duracao: 0.5 }
    ];

    [0, 0.62].forEach(function (atrasoBatida) {
      harmonicos.forEach(function (h) {
        var osc = ctx.createOscillator();
        var ganho = ctx.createGain();
        var inicio = ctx.currentTime + FOLGA_AGENDAMENTO + atrasoBatida;
        // a segunda batida sai um pouco mais baixa, como um sino de verdade
        var volume = atrasoBatida > 0 ? h.volume * 0.7 : h.volume;

        osc.type = "sine";
        osc.frequency.value = fundamental * h.proporcao;
        ganho.gain.setValueAtTime(0.0001, inicio);
        ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.008);
        ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + h.duracao);

        osc.connect(ganho);
        ganho.connect(ctx.destination);
        osc.start(inicio);
        osc.stop(inicio + h.duracao);
      });
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
  estadoApp.reiniciado = false;
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
      // se apertaram ESC no meio do giro, o ciclo fica no começo
      estadoApp.etapa = estadoApp.reiniciado ? ETAPAS.PRONTO : ETAPAS.SORTEADO;
      atualizarDicaTeclado();
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

// 339.29 = circunferência do círculo de raio 54 usado no SVG (2 × π × 54).
var CIRCUNFERENCIA_ANEL = 339.29;

function desenharAnel(fracaoDecorrida, semAnimacao) {
  var anel = document.getElementById("anel-progresso");
  if (semAnimacao) {
    // ao abrir o cronômetro o anel volta pro cheio de uma vez; sem isso ele
    // faria o caminho de volta animado, parecendo que está contando ao contrário
    anel.style.transition = "none";
  }
  anel.style.strokeDashoffset = (CIRCUNFERENCIA_ANEL * fracaoDecorrida).toFixed(2);
  if (semAnimacao) {
    void anel.getBoundingClientRect(); // obriga o navegador a aplicar agora
    anel.style.transition = "";
  }
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
  desenharAnel(0, true);

  if (estadoCronometro.instancia) {
    estadoCronometro.instancia.cancelar();
  }
  if (estadoCronometro.idFechamento) {
    clearTimeout(estadoCronometro.idFechamento);
    estadoCronometro.idFechamento = null;
  }
  estadoCronometro.pausado = false;

  estadoCronometro.instancia = Cronometro.criar({
    duracaoSegundos: duracaoSegundos,
    aoAtualizar: function (segundosRestantes, fracaoDecorrida) {
      document.getElementById("cronometro-tempo").textContent = formatarTempo(segundosRestantes);
      desenharAnel(fracaoDecorrida);
    },
    aoTerminar: function () {
      tocarSininho();
      var aviso = document.getElementById("cronometro-aviso");
      aviso.textContent = "⏰ Tempo esgotado!";
      aviso.hidden = false;
      document.getElementById("botao-pausar-cronometro").hidden = true;

      // Terminou a pesquisa? o próximo passo é gravar. Terminou a gravação?
      // o ciclo fecha e a próxima barra de espaço gira de novo.
      estadoApp.etapa = tipo === "pesquisa" ? ETAPAS.PARA_FALAR : ETAPAS.PRONTO;

      // fecha sozinho, mas com uma pausa pra dar tempo de ouvir o sino e ver o aviso
      estadoCronometro.idFechamento = setTimeout(fecharCronometro, 2600);
    }
  });

  estadoCronometro.instancia.iniciar();

  // Leva o foco pra dentro do overlay. Sem isso, o botão clicado continuaria
  // em foco atrás dele e a barra de espaço reabriria o cronômetro em vez de
  // pausar. De quebra, é o comportamento certo pra quem navega por teclado.
  document.getElementById("botao-pausar-cronometro").focus();
}

function fecharCronometro() {
  if (estadoCronometro.instancia) {
    estadoCronometro.instancia.cancelar();
    estadoCronometro.instancia = null;
  }
  if (estadoCronometro.idFechamento) {
    clearTimeout(estadoCronometro.idFechamento);
    estadoCronometro.idFechamento = null;
  }
  document.getElementById("overlay-cronometro").hidden = true;
  atualizarDicaTeclado();
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
  // em vez de uma aba na mesma janela — assim o Giro de Ideias não some.
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

// Elementos em que a barra de espaço já tem função própria: em campo de
// texto ela digita um espaço, e em botão/link/"Inserir meu nicho" o próprio
// navegador já aciona o item em foco. Nesses casos o atalho não entra.
var TAGS_QUE_USAM_ESPACO = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "SUMMARY"];

function avancarFluxo() {
  if (estadoApp.etapa === ETAPAS.SORTEADO) {
    abrirCronometro("pesquisa");
  } else if (estadoApp.etapa === ETAPAS.PARA_FALAR) {
    abrirCronometro("falar");
  } else {
    aoClicarGirar();
  }
}

// ESC volta o ciclo pro começo: cancela o cronômetro se estiver aberto e
// deixa a próxima barra de espaço girar de novo. Diferente do espaço, funciona
// de qualquer lugar (inclusive de dentro de um campo de texto), porque ESC não
// digita nada — é o "sair daqui" que todo mundo já espera dessa tecla.
function reiniciarFluxo() {
  if (!document.getElementById("overlay-cronometro").hidden) {
    fecharCronometro();
  }

  // Se um giro estiver acontecendo, ele termina de rodar, mas não avança mais
  // o ciclo — quem manda é o reinício.
  estadoApp.reiniciado = true;
  estadoApp.etapa = ETAPAS.PRONTO;
  atualizarDicaTeclado();

  // Tira o foco de onde estiver (ex.: o campo de nicho). Sem isso, a próxima
  // barra de espaço digitaria um espaço no campo em vez de girar a roleta.
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
}

function aoApertarTecla(evento) {
  if (evento.key === "Escape" || evento.key === "Esc") {
    reiniciarFluxo();
    return;
  }

  if (evento.code !== "Space" && evento.key !== " ") {
    return;
  }

  var alvo = evento.target;
  if (TAGS_QUE_USAM_ESPACO.indexOf(alvo.tagName) !== -1 || alvo.isContentEditable) {
    return;
  }

  evento.preventDefault(); // sem isso, a barra de espaço rola a página

  // Com o cronômetro na tela, espaço vira pausar/retomar — a mesma
  // convenção de player de vídeo.
  if (!document.getElementById("overlay-cronometro").hidden) {
    aoClicarPausarCronometro();
    return;
  }

  avancarFluxo();
}

function iniciar() {
  renderizarChipsCategorias();
  renderizarNichosSalvos();
  renderizarSalvos();
  atualizarPoolERoleta();
  configurarFechamentoAutomaticoNicho();

  atualizarDicaTeclado();
  document.addEventListener("keydown", aoApertarTecla);

  // Prepara o áudio no primeiro gesto da pessoa na página, qualquer que seja
  // (clicar num chip, no Girar, apertar espaço). Assim, quando o primeiro giro
  // acontecer, o som já está pronto pra tocar na hora certa.
  ["pointerdown", "keydown"].forEach(function (nomeEvento) {
    document.addEventListener(nomeEvento, prepararAudio, { once: true });
  });

  document.getElementById("botao-girar").addEventListener("click", function (evento) {
    // evento.detail é 0 quando o clique veio do teclado. No clique de mouse,
    // tiramos o foco do botão pra que a próxima barra de espaço siga o fluxo
    // (começar os 10 min) em vez de girar de novo.
    if (evento.detail > 0) {
      this.blur();
    }
    aoClicarGirar();
  });
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
