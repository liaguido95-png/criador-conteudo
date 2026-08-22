# Sala de Ideias

Roleta de pautas para criadores de conteúdo. O site sorteia um tema e conduz
um método de trabalho cronometrado: **girar** → **pensar, pesquisar e
escrever à mão por 10 min** → **falar por 1 min**. A ideia é combater a
produção 100% terceirizada para IA e devolver o hábito da pesquisa e da
escrita à mão ao criador — a IA só ajuda a sortear/gerar a lista de temas,
nunca escreve o roteiro final.

🌐 **Site no ar:** https://liaguido95-png.github.io/criador-conteudo/

> Toda a definição de escopo, decisões e regras do projeto vivem em
> [`CLAUDE.md`](./CLAUDE.md). Este README é só o resumo prático de "como
> rodar" e "como editar". Para o passo a passo de **como publicar uma
> mudança no site**, veja [`COMO-ATUALIZAR-O-SITE.md`](./COMO-ATUALIZAR-O-SITE.md).

---

## O que tem no site

- **Categorias fixas**: Moda, Beleza, Entretenimento, Cultura Pop, Música,
  Livros, Arte, Psicologia, Em Alta (temas pra pesquisar) e Treino &
  Academia, Lifestyle, Alimentação, Profissão (temas de autoconhecimento,
  sobre a própria vivência).
- **Nicho pessoal**: a pessoa cria seu próprio assunto e usa uma IA
  gratuita externa (copiar prompt / colar resposta) pra povoar a lista de
  temas dele.
- **Cronômetros** de 10 min (pesquisar e escrever no papel) e 1 min
  (falar).
- **Conta opcional** (login por e-mail/senha via Firebase): guarda nichos e
  pautas salvas na nuvem, pra acessar de qualquer aparelho. Sem conta,
  tudo continua funcionando normalmente, só que salvo no navegador local.

## Como rodar localmente

É HTML + CSS + JavaScript puro — sem instalar nada, sem `npm`, sem build.
Duas formas de abrir:

- **Mais simples:** dar duplo clique em `index.html`. Funciona pra tudo,
  exceto pra testar o login (o Firebase Authentication não funciona bem
  em `file://`, só quando o site está publicado em `http(s)://`).
- **Pra testar o login também:** rodar um servidor local simples na pasta
  do projeto (peça ao Claude Code se precisar disso) e abrir
  `http://localhost:<porta>/index.html`.

## Como editar os temas

Os temas das categorias fixas ficam em `js/dados.js`, no objeto `TEMAS`:

```js
TEMAS.categoriasFixas.pesquisa["Moda"]           // array de temas soltos
TEMAS.categoriasFixas.autoconhecimento["Profissão"] // array de frases-instrução
```

- Categorias de **pesquisa** (Moda, Beleza, Entretenimento, Cultura Pop,
  Música, Livros, Arte, Psicologia, Em Alta): cada item é um assunto solto
  pra pesquisar (ex.: `"O new look de Christian Dior"`).
- Categorias de **autoconhecimento** (Treino & Academia, Lifestyle,
  Alimentação, Profissão): cada item precisa ser uma frase-instrução
  completa, no padrão "Descreva/Conte/Explique por [tempo]..." (ver regra
  R13 no `CLAUDE.md`) — nunca um nome solto.

Pra adicionar, remover ou corrigir um tema, é só editar o array
correspondente e salvar o arquivo — não precisa de nenhuma outra etapa.

## Estrutura dos arquivos

```
criador-conteudo/
├── index.html             ← página única
├── css/estilo.css         ← identidade visual
└── js/
    ├── dados.js           ← banco-semente de temas por categoria
    ├── autenticacao.js    ← login/cadastro/logout (Firebase Auth)
    ├── armazenamento.js   ← única porta de acesso a localStorage/Firestore
    ├── roleta.js          ← sorteio e anti-repetição
    ├── cronometro.js      ← contagem regressiva reutilizável
    └── app.js             ← orquestra a UI e os eventos
```

## Onde as coisas estão hospedadas

| Serviço | Pra quê | Custo |
|---|---|---|
| GitHub Pages | Hospeda o site (HTML/CSS/JS) | Gratuito |
| Firebase (Authentication + Firestore) | Login e dados de quem cria conta | Gratuito (plano Spark) |

Nenhum serviço pago está em uso — ver regra R10 no `CLAUDE.md`.

## Publicar uma mudança

Resumo (guia completo em [`COMO-ATUALIZAR-O-SITE.md`](./COMO-ATUALIZAR-O-SITE.md)):
editar os arquivos → conferir no navegador → pedir "sobe pro GitHub" → o
GitHub Pages atualiza o site sozinho em alguns minutos.
