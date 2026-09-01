// Cronômetro regressivo reutilizável, baseado em timestamp (não em contar
// "tick" de setInterval) — por isso continua certo mesmo se a aba ficar em
// segundo plano e o navegador atrasar os intervalos.
var Cronometro = (function () {
  function criar(opcoes) {
    var duracaoMs = opcoes.duracaoSegundos * 1000;
    var aoAtualizar = opcoes.aoAtualizar || function () {};
    var aoTerminar = opcoes.aoTerminar || function () {};

    var fimEm = null;
    var restanteAoPausarMs = null;
    var idIntervalo = null;
    var pausado = false;
    var finalizado = false;

    function pararIntervalo() {
      if (idIntervalo !== null) {
        clearInterval(idIntervalo);
        idIntervalo = null;
      }
    }

    // aoAtualizar recebe dois valores: os segundos inteiros (pro relógio) e a
    // fração que já passou, de 0 a 1 (pro anel de progresso desenhar liso).
    function tick() {
      if (pausado || finalizado) {
        return;
      }
      var restanteMs = fimEm - Date.now();
      if (restanteMs <= 0) {
        finalizado = true;
        pararIntervalo();
        aoAtualizar(0, 1);
        aoTerminar();
        return;
      }
      aoAtualizar(Math.ceil(restanteMs / 1000), 1 - restanteMs / duracaoMs);
    }

    function iniciar() {
      fimEm = Date.now() + duracaoMs;
      pausado = false;
      finalizado = false;
      pararIntervalo();
      tick();
      idIntervalo = setInterval(tick, 250);
    }

    function pausar() {
      if (pausado || finalizado) {
        return;
      }
      pausado = true;
      restanteAoPausarMs = fimEm - Date.now();
      pararIntervalo();
    }

    function retomar() {
      if (!pausado || finalizado) {
        return;
      }
      fimEm = Date.now() + restanteAoPausarMs;
      pausado = false;
      tick();
      idIntervalo = setInterval(tick, 250);
    }

    function cancelar() {
      finalizado = true;
      pararIntervalo();
    }

    return {
      iniciar: iniciar,
      pausar: pausar,
      retomar: retomar,
      cancelar: cancelar
    };
  }

  return { criar: criar };
})();
