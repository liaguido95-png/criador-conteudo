// Login opcional via Firebase Authentication (Etapa 6, ver CLAUDE.md R16).
// Só cuida de cadastro/login/logout/exclusão de conta — nunca lê ou grava
// nichos/pautas (isso é sempre responsabilidade de armazenamento.js, R9).
var Autenticacao = (function () {
  // Chaves públicas por design do Firebase: a segurança de verdade vem das
  // regras de segurança do Firestore, não do sigilo destas chaves (R16).
  var firebaseConfig = {
    apiKey: "AIzaSyBUUetG3rFGGSVzOc060SIwxv4RUkn7qmI",
    authDomain: "sala-de-ideias-e06d8.firebaseapp.com",
    projectId: "sala-de-ideias-e06d8",
    storageBucket: "sala-de-ideias-e06d8.firebasestorage.app",
    messagingSenderId: "625742790319",
    appId: "1:625742790319:web:f2e36f0f33807bab311e5a"
  };

  firebase.initializeApp(firebaseConfig);

  function traduzirErro(erro) {
    var mensagens = {
      "auth/email-already-in-use": "Esse e-mail já tem conta. Tente entrar em vez de criar.",
      "auth/invalid-email": "Digite um e-mail válido.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
      "auth/missing-password": "Digite uma senha.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/user-not-found": "Não existe conta com esse e-mail.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/too-many-requests": "Muitas tentativas seguidas. Espere um pouco e tente de novo.",
      "auth/requires-recent-login": "Por segurança, entre de novo antes de excluir a conta."
    };
    return mensagens[erro.code] || "Não deu pra completar agora. Tente de novo.";
  }

  function cadastrar(email, senha) {
    return firebase.auth().createUserWithEmailAndPassword(email, senha)
      .catch(function (erro) { throw new Error(traduzirErro(erro)); });
  }

  function entrar(email, senha) {
    return firebase.auth().signInWithEmailAndPassword(email, senha)
      .catch(function (erro) { throw new Error(traduzirErro(erro)); });
  }

  function sair() {
    return firebase.auth().signOut();
  }

  function excluirConta() {
    var usuario = firebase.auth().currentUser;
    if (!usuario) {
      return Promise.resolve();
    }
    return usuario.delete()
      .catch(function (erro) { throw new Error(traduzirErro(erro)); });
  }

  function aoMudarSessao(callback) {
    firebase.auth().onAuthStateChanged(callback);
  }

  return {
    cadastrar: cadastrar,
    entrar: entrar,
    sair: sair,
    excluirConta: excluirConta,
    aoMudarSessao: aoMudarSessao
  };
})();
