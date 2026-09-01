# Giro de Ideias

Roleta de pautas para criadores de conteúdo. O site sorteia um tema e conduz
um método de trabalho cronometrado: **girar** → **pensar, pesquisar e
escrever à mão por 10 min** → **falar por 1 min**. A ideia é combater a
produção 100% terceirizada para IA e devolver o hábito da pesquisa e da
escrita à mão ao criador — a IA só ajuda a sortear/gerar a lista de temas,
nunca escreve o roteiro final.

🌐 **Site no ar:** https://girodeideias.liacreator.com

> Toda a definição de escopo, decisões e regras do projeto vivem em
> [`CLAUDE.md`](./CLAUDE.md). Este README é só o resumo prático de "como
> rodar" e "como editar". Para o passo a passo de **como publicar uma
> mudança no site**, veja [`COMO-ATUALIZAR-O-SITE.md`](./COMO-ATUALIZAR-O-SITE.md).

---

## O que tem no site

- **Categorias fixas**: Moda, Beleza, Entretenimento, Cultura Pop, Música,
  Livros, Arte, Psicologia, Em Alta, Marketing Digital, Criação de Conteúdo
  (grupo "pesquisa") e Treino & Academia, Lifestyle, Alimentação, Profissão
  (grupo "autoconhecimento") — todas em formato de pergunta.
- **Nicho pessoal**: a pessoa cria seu próprio assunto e usa uma IA
  gratuita externa (copiar prompt / colar resposta) pra povoar a lista de
  temas dele.
- **Cronômetros** de 10 min (pesquisar e escrever no papel) e 1 min
  (falar).
- **Sem conta, acesso livre**: tudo é salvo no `localStorage` do próprio
  navegador. Não existe login nem sincronização entre aparelhos.

## Como rodar localmente

É HTML + CSS + JavaScript puro — sem instalar nada, sem `npm`, sem build.
É só dar duplo clique em `index.html`. Funciona pra tudo, sem servidor
nenhum.

## Como editar os temas

Os temas das categorias fixas ficam em `js/dados.js`, no objeto `TEMAS`:

```js
TEMAS.categoriasFixas.pesquisa["Moda"]              // array de perguntas
TEMAS.categoriasFixas.autoconhecimento["Profissão"] // array de perguntas
```

Todas as categorias fixas (pesquisa e autoconhecimento) usam o mesmo
formato — uma pergunta por item (ex.: `"O que faz um look parecer caro?"`).
A separação `pesquisa`/`autoconhecimento` é só organização interna do
arquivo, não muda nada técnico nem visual.

Pra adicionar, remover ou corrigir um tema, é só editar o array
correspondente e salvar o arquivo — não precisa de nenhuma outra etapa.

## Estrutura dos arquivos

```
criador-conteudo/
├── index.html             ← página única
├── css/estilo.css         ← identidade visual
└── js/
    ├── dados.js           ← banco-semente de temas por categoria
    ├── armazenamento.js   ← única porta de acesso ao localStorage
    ├── roleta.js          ← sorteio e anti-repetição
    ├── cronometro.js      ← contagem regressiva reutilizável
    └── app.js             ← orquestra a UI e os eventos
```

## Onde as coisas estão hospedadas

| Serviço | Pra quê | Custo |
|---|---|---|
| GitHub Pages | Hospeda o site (HTML/CSS/JS) | Gratuito |

Nenhum serviço pago está em uso — ver regra R10 no `CLAUDE.md`.

## Publicar uma mudança

Resumo (guia completo em [`COMO-ATUALIZAR-O-SITE.md`](./COMO-ATUALIZAR-O-SITE.md)):
editar os arquivos → conferir no navegador → pedir "sobe pro GitHub" → o
GitHub Pages atualiza o site sozinho em alguns minutos.
