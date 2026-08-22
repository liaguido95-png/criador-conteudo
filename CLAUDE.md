# CLAUDE.md — Sala de Ideias (roleta de pautas para criadores de conteúdo)

> Este arquivo é o contrato de trabalho entre a Lia e o Claude Code neste projeto.
> Leia-o por inteiro antes de qualquer ação. Ele tem prioridade sobre suposições.

---

## 1. Objetivo do projeto

Construir um site (web app) gratuito onde criadores de conteúdo recebem, por
sorteio, um **tema de pauta** para produzir conteúdo. O sorteio dispara um
método de trabalho cronometrado:

1. **Girar** → o app sorteia um tema dentro do que estiver ativo (categoria fixa
   e/ou nicho pessoal).
2. **Pensar, pesquisar e escrever · 10 min** → cronômetro regressivo de 10
   minutos para a pessoa pensar sobre o tema, pesquisar em fontes reais (livros,
   sites, vídeos, memória própria) **e escrever à mão**, no papel, suas
   anotações. O app não oferece campo de anotação nem editor de texto — a
   escrita acontece fora da tela, de propósito.
3. **Falar · 1 min** → cronômetro regressivo de 1 minuto para a pessoa gravar a si
   mesma falando sobre o tema, usando o app/câmera que ela já usa, a partir do
   que anotou no papel.

**A tese do produto:** combater a produção 100% terceirizada para IA e devolver o
hábito da pesquisa e da escrita à mão ao criador. A IA entra só para *provocar o
tema* (sortear um assunto, ou ajudar a montar a lista de temas de um nicho) —
nunca para escrever o roteiro, a fala ou o texto final, e nunca para substituir
o papel e a caneta nos 10 minutos. Qualquer proposta de feature que gere o
conteúdo pronto para o usuário, ou que digitalize a etapa de escrita (campo de
notas, editor de texto, bloco de rascunho dentro do app), vai contra a tese e
deve ser recusada ou questionada.

**Público:** não é só para o nicho pessoal da Lia. Ela atende clientes de vários
nichos diferentes, incluindo pessoas que não sabem criar conteúdo ou têm
dificuldade de falar na internet e estão começando agora. O produto precisa
servir os dois perfis.

**Modelo híbrido de temas (a diferença real em relação ao napauta.co):**
- **Categorias fixas e amplas**, que já vêm prontas no site, para quem não tem
  nicho definido: Moda, Beleza, Entretenimento, Cultura Pop, Música, Livros,
  Arte, Psicologia, Em Alta — e um grupo de **categorias de autoconhecimento**
  (Treino & Academia, Lifestyle, Alimentação, Profissão) que sorteiam uma
  instrução para a pessoa falar sobre a própria vivência, não sobre um assunto
  externo. Ver detalhe do formato logo abaixo.
- **Nicho pessoal**, um campo onde a pessoa digita o próprio assunto (ex.: "RPG
  de mesa", "marketing digital", "nutrição") e a roleta passa a sortear dentro
  dali. Para popular esse nicho com ~150 temas, o site gera um **prompt pronto
  para copiar e colar em qualquer IA gratuita** (inclusive uma IA própria da
  Lia, se ela tiver um link de chat público) — a pessoa cola a resposta da IA
  de volta no site, que organiza a lista. Ver Etapa 1 e Regra R12.

**Dois formatos de tema dentro das categorias fixas** (decisão de 2026-08-12):
- **Tema de pesquisa externa** — um assunto solto para a pessoa buscar
  informação de fora (ex.: em Arte, "Mies van der Rohe"). Formato usado em:
  Moda, Beleza, Entretenimento, Cultura Pop, Música, Livros, Arte, Psicologia,
  Em Alta.
- **Tema de autoconhecimento** — uma frase-instrução que manda a pessoa olhar
  para a própria vivência, não para fora (ex.: em Profissão, "Descreva por 10
  minutos o que você faz no seu trabalho todos os dias"). Formato usado em:
  Treino & Academia, Lifestyle, Alimentação, Profissão. A pessoa ainda usa os 10
  minutos, mas para organizar ideias e lembranças próprias, não para pesquisar
  na internet.

Isso não muda nada técnico — é a mesma roleta e o mesmo cronômetro. A diferença
está só em como o texto do tema é escrito: nas categorias de autoconhecimento,
sempre uma frase-instrução completa (padrão "Descreva/Conte/Explique por [tempo]
..."), nunca um nome solto.

---

## 2. Contexto e histórico

- Projeto novo, do zero. A pasta estava vazia antes deste arquivo.
- Referência de produto e de fluxo: **napauta.co** (criado por @mamejunqueira,
  inspirado em @bitterbuilds). Referência analisada: front-end puro, sem backend,
  sem chamadas de API, base de temas embutida em JS, favoritos em `localStorage`,
  paleta escura com tipografia serifada.
- **Decisão revista em 2026-08-12 (Etapa 3):** a Lia pediu explicitamente para
  a estética seguir o **formato/layout** do Em Pauta (título grande serifado
  centralizado, categorias em formato de chip/pill, botão "Girar" grande e
  destacado, botões secundários com ícone, link discreto de "salvar pauta"),
  trocando só paleta, tipografia e nome — com crédito visível e link para
  @mamejunqueira. Isso substitui a proibição original de copiar a identidade
  visual; o que continua proibido é copiar o **texto, o código-fonte ou os
  ativos visuais literais** do napauta.co — a semelhança é de layout/formato,
  com autoria creditada.
- Nicho de exemplo da própria autora: RPG de mesa, videogame, jogos de tabuleiro,
  cultura nerd em geral. Esse nicho é só **um exemplo de uso do campo "nicho
  pessoal"**, não é mais o foco único do produto (decisão revista em 2026-08-12).
- **IA treinada da Lia (link atualizado em 2026-08-13):** GPT customizado da
  Lia de Criação de Conteúdo, em
  https://chatgpt.com/g/g-6a7ce22860dc8191b7021a3195fabc30-l-ia
  (link de chat público, não é API paga). É a opção **principal e recomendada**
  no fluxo de nicho pessoal (Etapa 1/3): depois de gerar e copiar o prompt,
  aparece um botão "🤖 Ir para a IA da Lia de Criação de Conteúdo" que abre
  esse link em nova aba, com o aviso "cole exatamente o prompt copiado — sem
  alterar nada". Outras IAs gratuitas continuam mencionadas como alternativa.
  **Decisão (2026-08-13):** o prompt gerado por `montarPromptNicho()` em
  `js/app.js` fica como está — a Lia decidiu não trocar o texto padrão, só o
  link da IA de destino.
- **Nome do produto: "Sala de Ideias"** (decidido em 2026-08-12).
- **Créditos visíveis no site (atualizado em 2026-08-13):**
  - No cabeçalho, logo abaixo do título: "criado por @liaachinellato", link
    para https://www.instagram.com/liaachinellato/.
  - No rodapé da página: "inspirado no modelo do Em Pauta, por
    @mamejunqueira", link para https://www.instagram.com/mamejunqueira.
  - Ambos abrem em nova aba, com `rel="noopener"`.
- **Paleta de cores (Etapa 3, 2026-08-12):**
  - Fundo: `#ffccdd`
  - Texto branco: `#ffffff`
  - Texto em destaque (ameixa escuro): `#502533`
  - Detalhe / cor secundária (verde-limão): `#c1ff72`
  - **Ajuste de aplicação (não muda os hex, só onde cada um é usado):** texto
    branco puro direto sobre o fundo rosa claro tem contraste baixo demais pra
    ler. Por isso: o ameixa escuro é o "texto principal" sempre que o fundo é
    rosa claro (título, corpo de texto); o branco é usado como texto sobre
    superfícies preenchidas com o ameixa escuro (chips inativos, botão Girar);
    o verde-limão marca o que está selecionado/em destaque (chip ativo).
  - **Exceção deliberada (2026-08-14):** a palavra sorteada (`.resultado-tema`)
    é a parte que a pessoa filma girando/gravando pelo celular, então precisa
    do máximo contraste — vai no ameixa escuro, bem grande (`clamp` entre
    ~2.6rem e 4.5rem). Já o rótulo da categoria acima dela (`.resultado-categoria`)
    é branco por pedido direto da Lia, mesmo com contraste baixo nesse par
    específico — leva uma sombra escura sutil só pra não sumir de vez; é uma
    exceção estética aceita conscientemente, não um esquecimento.
- **Tipografia (Etapa 3, 2026-08-12):**
  - Fonte principal: Aileron (Regular e Negrito/Bold) — para textos de
    interface, tags, corpo.
  - Fonte de destaque: Times New Roman MT Condensed — para o título e a
    palavra sorteada.
  - **Ressalva técnica/legal:** nenhuma das duas está disponível no Google
    Fonts (única exceção de fonte externa permitida pela R5). Aileron é uma
    fonte gratuita, mas precisa dos arquivos da fonte pra funcionar em
    qualquer visitante — por ora está como referência de fonte de sistema
    (só aparece certinho em quem já tem ela instalada). Times New Roman MT
    Condensed é uma fonte da Microsoft/Monotype, não licenciada pra
    distribuição num site público — por isso também fica só como referência
    de fonte de sistema (funciona no computador da Lia, que é Windows; a
    maioria dos visitantes vai ver a fonte alternativa, tipo Times New Roman
    ou Georgia). Se a Lia quiser fidelidade visual igual pra todo mundo, ela
    precisa: (a) providenciar os arquivos legítimos da Aileron pra hospedar
    no site, e (b) escolher uma fonte serifada condensada realmente gratuita
    no lugar da Times New Roman MT Condensed.
- **Categorias em formato de chip/pill** (Etapa 3, 2026-08-12): visual igual
  ao Em Pauta — botões arredondados numa fileira, maiúsculas. A seleção
  continua **multi-escolha** (diferente do Em Pauta, que é uma categoria por
  vez) porque já estava funcionando e é mais flexível — só o visual virou
  chip. Existe um chip "TUDO" que marca todas de uma vez.
- **"Meu nicho" virou um botão colapsável** (Etapa 3, 2026-08-12): em vez de
  aparecer sempre visível, fica escondido atrás de um botão que, ao clicar,
  revela as instruções (com emojis) e o formulário. Usa `<details>/<summary>`
  nativo do HTML — sem JavaScript extra pra isso.
- **Decisão (2026-08-21): contas de usuário via Firebase.** Reabre
  deliberadamente a linha "Contas" da tabela da Seção 3 (era "Sem login").
  Motivo da Lia: quer que cada pessoa tenha um login simples só pra controle
  e pra que os nichos/temas gerados fiquem gravados pra próxima sessão, em
  qualquer aparelho — não só no navegador onde ela criou. Isso **não** é uma
  reabertura da tese do produto (R12/R15 continuam intactas: a IA não gera
  conteúdo final, os 10 minutos continuam sem campo de escrita); é só a
  camada de "onde os dados moram".
  - **Escolha técnica: Firebase (Authentication + Firestore), plano Spark
    gratuito.** Comparado com Supabase, o Firestore guarda um documento
    JSON solto por usuária — encaixa quase 1:1 no formato que já existe em
    `localStorage` (`{ nichos, salvos }`), sem precisar desenhar schema
    relacional. Supabase foi descartado principalmente porque o projeto
    gratuito **pausa depois de dias sem uso**, o que é ruim pra um app que
    precisa estar sempre disponível pras clientes da Lia.
  - **Integração via `<script>` "compat"** do SDK do Firebase (não a versão
    modular/ES Modules), pra não violar a R4. Isso é uma **exceção nomeada**
    à R5 (ver Seção 4) — não abre precedente pra qualquer outra dependência
    externa, só pra este serviço, com esta finalidade.
  - **Login continua opcional.** Uso anônimo (sem conta) continua funcionando
    exatamente como hoje, gravando só em `localStorage` local. Criar conta é
    uma escolha da pessoa, não uma obrigação pra usar o app.
  - Ver R16 (segurança) e R17 (LGPD) na Seção 7, e a Etapa 6 revisada na
    Seção 6.
- **Onde paramos (2026-08-21):** Etapa 6 concluída e verificada de ponta a
  ponta no site publicado (ver detalhes na Etapa 6, Seção 6). Próximo
  trabalho combinado com a Lia: **correções de identidade visual e da tela
  de login** (ajustes finos, não uma etapa nova do roteiro) — a Lia vai
  descrever o que quer ajustar numa conversa futura, e as mudanças devem
  ser subidas ao GitHub só quando ela pedir explicitamente ("pode subir"),
  como já vem sendo feito.

---

## 3. Decisões já tomadas (não reabrir sem pedido explícito da Lia)

| Tema | Decisão | Consequência |
|---|---|---|
| Gravação | **Só cronômetro.** O app NÃO grava áudio nem vídeo. | Sem `MediaRecorder`, sem permissão de microfone/câmera, sem armazenamento de mídia. |
| Fonte dos temas | **Banco-semente pronto (categorias fixas amplas) + campo de nicho pessoal.** | Categorias fixas escritas por nós na Etapa 1. Nicho pessoal é povoado pela própria pessoa. |
| Geração de temas do nicho | **Prompt pronto para copiar/colar em IA gratuita externa** (não integrada ao site). | Sem API, sem chave, sem backend, sem custo. A pessoa cola a resposta da IA de volta numa caixa de texto no site. |
| Contas | **Login opcional via Firebase Authentication** (decisão revista em 2026-08-21). Sem conta, tudo continua em `localStorage` do navegador, como antes. | Com conta, dados sincronizam com Firestore — LGPD volta à mesa (e-mail é dado pessoal, ver R17). Perda de dados de quem usa sem conta continua mitigada por exportar/importar JSON (Etapa 7). |
| Stack | **HTML + CSS + JavaScript puro**, mais o SDK "compat" do Firebase via `<script>` (exceção nomeada à R5, ver Seção 4). | Sem framework, sem npm, sem build, sem Node.js necessário. A única dependência externa de código é o Firebase. |
| Custo | **Zero enquanto o uso couber no plano gratuito (Spark) do Firebase.** Não é mais uma garantia estrutural absoluta como antes — é um limite a monitorar (ver R10). | Hospedagem em GitHub Pages ou Netlify (plano free); autenticação/dados no plano Spark do Firebase. |

---

## 4. Tecnologias

**Permitido:**
- HTML5 semântico
- CSS3 puro (variáveis CSS, flexbox, grid, `transition`, `@media`)
- JavaScript ES6+ *sem módulos* (ver Regra R4)
- Google Fonts (via `<link>`, com fallback de fonte do sistema)
- `localStorage` para persistência (uso sem conta)
- **Firebase Authentication + Firestore**, via SDK "compat" (`<script src=...>`,
  nunca `type="module"`) — exceção nomeada autorizada em 2026-08-21, só para
  login e sincronização dos dados da própria pessoa (ver Seção 2 e R16/R17).
  Plano Spark (gratuito) apenas.
- Git + GitHub (versionamento e deploy)
- GitHub Pages ou Netlify free (hospedagem estática)

**Proibido neste projeto (sem autorização expressa da Lia):**
- Qualquer framework de front-end (React, Vue, Svelte, Next.js, Alpine.js…)
- Qualquer gerenciador de pacotes / `package.json` / `node_modules`
- Qualquer etapa de build, bundler ou transpilador
- Qualquer backend, banco de dados ou API externa **além do Firebase
  Auth/Firestore autorizado acima** (inclusive APIs de IA — continua valendo
  R14)
- Qualquer biblioteca via CDN **além do SDK compat do Firebase** (jQuery,
  Tailwind CDN, animações, ícones)
- Qualquer serviço pago ou com trial que vire cobrança, ou uso do Firebase
  além do plano gratuito Spark
- Analytics, cookies de rastreamento, pixel de terceiros

---

## 5. Estrutura de pastas (alvo)

```
criador-conteudo/
├── CLAUDE.md              ← este arquivo
├── README.md              ← criado na Etapa 8
├── index.html             ← página única
├── css/
│   └── estilo.css         ← todo o CSS, com variáveis no :root
└── js/
    ├── dados.js           ← banco-semente de temas por categoria
    ├── armazenamento.js   ← camada única de dados: localStorage e/ou Firestore
    ├── autenticacao.js    ← login/cadastro/logout via Firebase Auth (Etapa 6)
    ├── roleta.js          ← lógica de sorteio e anti-repetição
    ├── cronometro.js      ← componente de contagem regressiva reutilizável
    └── app.js             ← orquestra a UI e os eventos
```

Um arquivo = uma responsabilidade. Não inflar `app.js` com lógica que pertence
aos outros arquivos.

---

## 6. Etapas do projeto

> **REGRA MAIS IMPORTANTE DESTE ARQUIVO:** cada etapa é executada **isoladamente**.
> Ao terminar uma etapa, PARE, mostre o que foi feito, explique como verificar, e
> **aguarde a Lia autorizar** a próxima. Nunca emende duas etapas na mesma
> execução, mesmo que a próxima pareça óbvia, pequena ou "só um detalhe".
> Ver Seção 8 (Padrões de trabalho) para o protocolo completo.

### Etapa 0 — Planejamento ✅ CONCLUÍDA
Definição de escopo, arquitetura e este CLAUDE.md.
**Verificação:** este arquivo existe e a Lia aprovou o planejamento.

### Etapa 1 — Esqueleto, categorias fixas e fluxo de nicho pessoal
Criar a estrutura de pastas, `index.html` mínimo, e `js/dados.js` com:
- **Categorias fixas de pesquisa externa** (banco-semente escrito por nós):
  Moda, Beleza, Entretenimento, Cultura Pop, Música, Livros, Arte, Psicologia
  e Em Alta — cada uma com um bom volume de temas (referência: 60 a 100 por
  categoria). Temas são *assuntos soltos* para pesquisar (ex.: "Mies van der
  Rohe"), não frases-instrução. "Em Alta" é uma foto do momento em que
  escrevemos, **não é atualizada automaticamente** (o site é estático, sem
  servidor) — só é revisada se a Lia pedir um refresh manual numa etapa futura.
- **Categorias fixas de autoconhecimento** (banco-semente escrito por nós):
  Treino & Academia, Lifestyle, Alimentação, Profissão — mesmo volume de referência
  (60 a 100 por categoria). Aqui cada tema é uma **frase-instrução completa**
  que manda a pessoa falar sobre a própria vivência (ex.: "Descreva por 10
  minutos o que você faz no seu trabalho todos os dias"), no padrão
  "Descreva/Conte/Explique por [tempo]...". Nunca um nome solto.
- **Campo "Meu nicho"**: a pessoa digita um nicho livre (ex.: "RPG de mesa",
  "marketing digital"). Isso cria uma categoria nova, vazia, dentro do sistema.
- **Fluxo de geração assistida por IA externa**: ao criar o nicho, o site monta
  um texto pronto pedindo 150 sugestões de tema sobre aquele nicho, uma por
  linha, sem numeração. Botão **"Copiar prompt"** (usa a função de copiar do
  próprio navegador — não precisa de nenhuma IA integrada). Em seguida, um
  botão "🤖 Ir para a IA da Lia de Criação de Conteúdo" abre em nova aba a
  IA treinada da Lia (GPT customizado, link na Seção 2), com o aviso "cole
  exatamente o prompt copiado — sem alterar nada". Outras IAs gratuitas
  (ChatGPT, Gemini etc.) continuam citadas como alternativa.
- **Caixa "Colar temas gerados"**: a pessoa cola a resposta da IA ali; o site
  separa por linha e cria os temas dentro do nicho dela.
**Resultado esperado:** abrir `index.html` no navegador e ver a página carregar
sem erro no console; `console.log(TEMAS)` lista as categorias fixas; criar um
nicho novo, copiar o prompt, colar uma lista de teste na caixa e ver os temas
aparecerem dentro do nicho.
**Verificação:** abrir o DevTools (F12) → aba Console → nenhum erro vermelho;
digitar `Object.keys(TEMAS)` e conferir as categorias fixas; testar o fluxo
completo do nicho com uma lista de teste colada manualmente (não precisa gastar
uma consulta de IA de verdade só para testar).

### Etapa 2 — Lógica da roleta
`js/roleta.js`: sortear um tema respeitando as categorias ativas, com
**anti-repetição** (não repetir tema até esgotar a lista da sessão) e suporte ao
modo "Tudo". Ainda sem estilo bonito — foco em funcionar.
**Resultado esperado:** clicar em "Girar" troca o tema na tela; girar N vezes não
repete tema antes de esgotar o pool.
**Verificação:** girar 30 vezes seguidas em uma categoria pequena e confirmar no
console que não houve repetição prematura; testar o modo "Tudo".

### Etapa 3 — Identidade visual e layout ✅ CONCLUÍDA
`css/estilo.css` completo: paleta em variáveis CSS, tipografia, hierarquia,
efeito de "girar" com som e animação, estados de hover/foco. Nome do produto
definido ("Sala de Ideias"), créditos no cabeçalho e no rodapé, categorias em
chip, nicho pessoal como botão colapsável com link para a IA treinada da Lia.
**Verificado:** contraste de texto calculado manualmente (WCAG) para cada par
cor/fundo; fluxo de categoria única, animação de girar e link da IA testados
por clique real no navegador. **Pendência conhecida:** fontes Aileron e Times
New Roman MT Condensed só aparecem certinho em quem já tem elas instaladas
(ver Seção 2) — ajuste fino de visual pode continuar a qualquer momento, a
pedido da Lia.

### Etapa 4 — Cronômetros
`js/cronometro.js`: componente reutilizável de contagem regressiva. Overlay de
10 min ("Pense, pesquise e escreva à mão") e de 1 min ("Falar"), com pausar,
retomar, cancelar e aviso sonoro/visual no fim. O overlay de 10 min reforça em
texto que a anotação é no papel, não no app. Precisão baseada em timestamp (não
em acumular `setInterval`).
**Resultado esperado:** os dois cronômetros contam corretamente e continuam certos
mesmo se a aba ficar em segundo plano.
**Verificação:** rodar o de 1 min com cronômetro do celular ao lado (desvio < 1s);
minimizar a aba por 30s e conferir se voltou com o tempo certo; testar pausar/retomar.

### Etapa 5 — Personalização pelo usuário ✅ CONCLUÍDA
`js/armazenamento.js`: única porta de acesso ao `localStorage` (chave
`sala_de_ideias_dados`, guarda `{ nichos, salvos }`), com fallback silencioso
pra JSON corrompido ou `localStorage` indisponível (tratamento mais completo
de erro fica pra Etapa 6). Nichos pessoais agora persistem de verdade —
criar um nicho com o mesmo nome de outro já existente sobrescreve os temas
dele (é o jeito de "editar"). Cada nicho tem botão "🗑️ Remover" na seção
"Meus nichos". O botão "♡ Salvar pauta" ficou funcional: salva a categoria +
tema sorteados numa lista "Pautas salvas" (com botão de remover cada item),
tudo persistido.
**Verificado:** criar nicho → recarregar página → nicho e chip continuam lá;
salvar pauta → recarregar → continua na lista; remover nicho/pauta → some da
tela e do `localStorage` (conferido lendo `localStorage.getItem(...)` direto).

### Etapa 6 — Contas de usuário (login) e sincronização com Firebase ✅ CONCLUÍDA
`js/autenticacao.js`: cadastro e login por e-mail/senha via Firebase
Authentication (SDK compat), com logout. `js/armazenamento.js` passa a decidir
o destino da leitura/escrita: sem sessão ativa, continua gravando só em
`localStorage`, exatamente como hoje; com sessão ativa, sincroniza o mesmo
formato (`{ nichos, salvos }`) com um documento único por usuária no Firestore
(`usuarios/{uid}`). Regras de segurança do Firestore (configuradas no console,
fora do repositório) restringem cada conta a ler/escrever **só o próprio
documento** — ver R16. Interface mínima: formulário de entrar/criar conta,
indicação de quem está logada, botão de sair. Definir e implementar a
estratégia de mesclagem para quem já tinha nichos/pautas salvos sem conta e
cria uma depois (ex.: perguntar se quer levar os dados locais pra conta nova).
Inclui um aviso curto de privacidade no formulário de cadastro (ver R17).
**Resultado esperado:** criar conta em um navegador, girar/salvar pautas e
criar nichos, abrir o site logada com a mesma conta em outro navegador ou
aparelho e ver os mesmos dados. Continuar usando sem conta não muda em nada o
comportamento atual.
**Verificação:** criar conta → adicionar nicho e pauta salva → deslogar →
logar de novo (mesmo navegador) → dados continuam lá; repetir o login em outro
navegador/aparelho e conferir que os mesmos dados aparecem; tentar ler o
documento do Firestore de outra conta (via console do Firebase) e confirmar
que as regras de segurança bloqueiam; usar o app sem criar conta e confirmar
que nada mudou em relação ao comportamento de hoje.
**Verificado (2026-08-21), direto no site publicado:** cadastro/login por
e-mail e senha; nicho criado enquanto logada foi conferido gravado no
documento do Firestore; simulação de "outro aparelho" (localStorage limpo
+ recarregar) trouxe o nicho de volta da nuvem sozinho; exclusão de conta
apagou o documento no Firestore e encerrou a sessão; zero erros no console
em todo o fluxo. Regras de segurança do Firestore (R16) já coladas e
publicadas no console pela Lia. **Nota de teste:** logo após publicar uma
atualização, o navegador pode mostrar a versão antiga por causa de cache —
um Ctrl+Shift+R resolve (documentado no `COMO-ATUALIZAR-O-SITE.md`).

### Etapa 7 — Exportar / importar e resiliência
Botão de exportar tudo para um arquivo `.json` e importar de volta (backup e
troca de dispositivo — inclusive para quem prefere não criar conta).
Tratamento de `localStorage` cheio, JSON corrompido e primeiro acesso.
**Resultado esperado:** exportar num navegador e importar em outro reproduz o
mesmo estado.
**Verificação:** exportar no Chrome, importar no Edge/Firefox, conferir se os
dados batem; importar um arquivo inválido de propósito e conferir se o app mostra
erro amigável em vez de quebrar.

### Etapa 8 — Mobile, acessibilidade e QA
Responsividade (o uso real é no celular), navegação por teclado, `aria-live` para
o tema sorteado e para o cronômetro, `prefers-reduced-motion`, testes no Chrome,
Firefox, Safari/iOS e Android.
**Resultado esperado:** o app é confortável de usar com uma mão no celular.
**Verificação:** rodar o checklist de QA (criado nesta etapa) em pelo menos 2
navegadores e 1 celular real; Lighthouse com Acessibilidade ≥ 90.

### Etapa 9 — Deploy gratuito e documentação
`git init`, repositório no GitHub, publicação no GitHub Pages (ou Netlify),
`README.md` explicando o projeto e como editar os temas.
**Resultado esperado:** um link público funcionando que a Lia pode compartilhar.
**Verificação:** abrir o link em uma janela anônima e no celular, no 4G (fora do
Wi-Fi), e executar o fluxo completo: girar → pensar/pesquisar/escrever à mão por
10 min → falar 1 min → salvar.

### Etapa 10 — (Opcional, só se a Lia pedir) PWA
`manifest.json` + service worker para instalar na tela inicial e funcionar offline.
**Verificação:** instalar no celular e usar em modo avião.

---

## 7. Regras e restrições

- **R1 — Uma etapa por vez.** Nunca iniciar a etapa seguinte sem autorização
  explícita da Lia. "Aprovado", "pode ir", "próxima" = autorização. Silêncio,
  ausência de resposta ou uma pergunta sobre a etapa atual **não** são autorização.
- **R2 — Não inventar escopo.** Nada de features não listadas aqui. Se surgir uma
  ideia boa, escrever em `IDEIAS.md` (na Etapa em que surgir) e seguir o plano.
- **R3 — Não alterar arquivos fora do escopo da etapa atual.** Nunca mexer neste
  CLAUDE.md sem pedido explícito.
- **R4 — Sem ES Modules.** Usar `<script src="...">` clássico, sem `type="module"`
  e sem `import/export`. Motivo: a Lia precisa conseguir abrir o `index.html` com
  duplo clique (protocolo `file://`), e módulos ES quebram por CORS nesse modo.
  Cada arquivo JS expõe um objeto global nomeado (`Roleta`, `Cronometro`,
  `Armazenamento`, `TEMAS`).
- **R5 — Sem dependências externas.** Nenhum CDN, nenhum `npm install`. Única
  exceção autorizada: Google Fonts via `<link>`, sempre com `font-family` de
  fallback do sistema.
- **R6 — Código e interface em português do Brasil.** Nomes de variáveis, funções,
  comentários, textos de tela e mensagens de commit em pt-BR.
- **R7 — Comentários explicam o porquê, não o quê.** Código simples o suficiente
  para a Lia editar sozinha depois.
- **R8 — Sem código morto.** Não deixar funções "para o futuro", `console.log` de
  depuração ou CSS não usado.
- **R9 — Toda escrita em `localStorage` ou Firestore passa por
  `armazenamento.js`.** Nenhum outro arquivo chama `localStorage` ou o SDK do
  Firestore diretamente — inclusive `autenticacao.js` só cuida de login/logout,
  nunca lê ou grava os dados de nichos/pautas.
- **R10 — Custo zero é inegociável.** Se a única solução para um problema for paga,
  parar e apresentar as alternativas gratuitas para a Lia decidir.
- **R11 — Reportar honestamente.** Se algo não funcionou, não foi testado ou ficou
  pela metade, dizer isso explicitamente. Nunca declarar "pronto" o que não foi
  verificado.
- **R12 — Sem geração do conteúdo final por IA.** A IA pode ajudar a **povoar a
  lista de temas** de um nicho pessoal (fluxo de copiar prompt / colar resposta,
  ver Etapa 1), mas nunca gera o roteiro, a fala ou o texto final que a pessoa
  vai apresentar. Quem pesquisa e fala é o ser humano — isso é a tese do
  produto, não um detalhe técnico.
- **R13 — Categorias de autoconhecimento usam frase-instrução, sempre.** Temas
  de Treino & Academia, Lifestyle, Alimentação e Profissão devem ser escritos como
  instrução completa ("Descreva/Conte/Explique por [tempo]..."), nunca como
  nome solto. Motivo: a pessoa não vai pesquisar na internet nesses temas, ela
  vai organizar a própria vivência — o tema precisa guiar exatamente o ângulo.
- **R14 — Nenhuma IA integrada por API dentro do site.** Toda interação com IA é
  externa ao site (a pessoa copia um texto e cola em outro lugar). Ligar uma IA
  por API exigiria backend e provavelmente custo por uso — contra R5 e R10. Se
  isso for revisto no futuro, é decisão explícita da Lia, numa etapa própria.
- **R15 — Sem campo de escrita/anotação dentro do app.** Os 10 minutos são para
  pensar, pesquisar e escrever à mão, no papel. Nunca adicionar textarea, bloco
  de notas ou editor de texto para essa etapa, mesmo que pareça uma melhoria
  óbvia de UX. Motivo: é uma decisão de propósito da Lia, não uma lacuna a
  preencher — o app existe para afastar a pessoa da tela nesse momento, não
  para prender ela mais tempo nela.
- **R16 — Segurança das contas: cada usuária só acessa os próprios dados.**
  Nunca implementar autenticação própria (sem guardar senha em texto puro,
  sem hash caseiro) — usar sempre o Firebase Authentication, que já cuida
  disso. As chaves de configuração do Firebase (`apiKey` etc.) que ficam
  visíveis no código do site são públicas por design do Firebase — a
  segurança de verdade vem das **regras de segurança do Firestore**
  (configuradas no console, restringindo cada documento a ser lido/escrito
  só pelo `uid` dono dele), não do sigilo dessas chaves. Nunca desativar ou
  afrouxar essas regras para "testar mais rápido" sem repor antes de
  qualquer uso real. Motivo: uma regra maliciosamente permissiva (`allow
  read, write: if true`) exporia os dados de todas as usuárias a qualquer
  pessoa.
- **R17 — LGPD: coletar o mínimo, ser transparente, permitir apagar tudo.**
  Com contas, o app passa a tratar dado pessoal (e-mail, e indiretamente os
  nichos/pautas de cada pessoa). Por isso: (a) pedir só e-mail e senha no
  cadastro, nada de nome completo, telefone ou dados extras sem necessidade
  real; (b) ter um aviso curto e claro no formulário de cadastro dizendo o
  que é guardado (e-mail para login; nichos e pautas salvas, associados à
  conta) e que não é compartilhado com terceiros nem usado para outro fim;
  (c) a pessoa precisa conseguir **apagar a própria conta e os próprios
  dados** (documento no Firestore + conta no Firebase Auth) a partir do
  app, sem precisar pedir isso à Lia por fora; (d) nenhum dado de uma conta
  é usado para treinar, analisar ou divulgar nada — só existe para a própria
  dona ver de novo depois. Motivo: e-mail e conteúdo gerado pela pessoa são
  dados pessoais sob a LGPD; mesmo um app gratuito e simples precisa desse
  cuidado mínimo quando guarda dado pessoal em nuvem.

---

## 8. Padrões de trabalho

**Protocolo de cada etapa:**
1. Ao receber a autorização, reler este arquivo e confirmar em 1 linha qual etapa
   vai ser executada e o que ela entrega.
2. Executar **apenas** aquela etapa.
3. Ao terminar, entregar sempre este bloco:
   - **O que foi feito** (lista curta, com os arquivos tocados)
   - **Como verificar** (passo a passo que a Lia consegue seguir sozinha)
   - **O que ficou de fora / limitações conhecidas**
   - **Próxima etapa sugerida** — e a frase: *"Aguardando sua autorização para
     seguir."*
4. **Parar.** Não continuar, não "adiantar", não refatorar por conta própria.

**Modelo e esforço por etapa** (referência; a Lia decide na hora):

| Etapa | Modelo | Esforço |
|---|---|---|
| 1 — Esqueleto e temas | Sonnet 5 | normal |
| 2 — Roleta | Sonnet 5 | think |
| 3 — Visual | Opus 5 | think |
| 4 — Cronômetros | Sonnet 5 | think hard |
| 5 — Personalização | Opus 5 | think |
| 6 — Contas (login/Firebase) | Opus 5 | think hard |
| 7 — Exportar/importar | Sonnet 5 | think |
| 8 — Mobile e QA | Sonnet 5 | think |
| 9 — Deploy e README | Sonnet 5 | normal |

Subir para Opus 5 / `ultrathink` quando: um bug persistir depois de 2 tentativas,
uma decisão afetar a arquitetura, ou a Lia não estiver satisfeita com o resultado
visual.

**Versionamento:** commits pequenos, um por etapa concluída, mensagem em pt-BR no
formato `etapa N: descrição curta`. Nunca commitar sem a etapa estar aprovada.

---

## 9. Critérios de conclusão

O projeto está **concluído** quando todos os itens abaixo forem verdadeiros:

- [ ] Existe um link público, gratuito e estável, que abre em qualquer navegador.
- [ ] No primeiro acesso, o app já funciona com as categorias fixas (roleta não vem vazia).
- [ ] O usuário consegue criar seu próprio nicho, gerar temas via IA externa
      (copiar prompt / colar resposta) e escolher o que entra no sorteio.
- [ ] O sorteio não repete tema antes de esgotar o pool ativo.
- [ ] Os cronômetros de 10 min e 1 min funcionam com desvio menor que 1 segundo,
      inclusive com a aba em segundo plano.
- [ ] Os dados persistem após fechar e reabrir o navegador (com ou sem conta).
- [ ] Existe exportar/importar JSON funcionando entre navegadores diferentes.
- [ ] É possível criar conta, logar e ver os mesmos nichos/pautas em outro
      navegador ou aparelho; usar sem conta continua funcionando igual a antes.
- [ ] As regras de segurança do Firestore impedem uma conta de ler/escrever os
      dados de outra.
- [ ] Existe um jeito, dentro do app, de apagar a própria conta e os próprios
      dados (R17).
- [ ] O app é totalmente utilizável em um celular real, com uma mão.
- [ ] Lighthouse: Acessibilidade ≥ 90 e Performance ≥ 90.
- [ ] Console do navegador sem erros em nenhuma tela.
- [ ] `README.md` explica como rodar localmente e como editar os temas.
- [ ] Custo total do projeto: R$ 0,00 dentro do plano gratuito do Firebase.

**Fora de escopo da v1** (só entram em uma v2, se a Lia pedir): gravação de
áudio/vídeo no navegador, IA integrada por API dentro do site (o fluxo de IA
da v1 é externo, por copiar/colar), atualização automática da categoria "Em
Alta", compartilhamento social, histórico/estatísticas de uso, temas
colaborativos entre usuários, domínio próprio pago, login social (Google/Apple
etc. — a v1 de contas é só e-mail/senha).

---

## 10. Glossário

- **Pauta / tema:** o assunto sorteado pela roleta.
- **Categoria fixa:** agrupamento de temas que já vem pronto no app (ex.: "Moda").
- **Categoria de autoconhecimento:** categoria fixa (Treino & Academia, Lifestyle, Alimentação, Profissão) cujo tema é uma instrução para falar sobre a própria vivência, não um assunto para pesquisar fora.
- **Nicho pessoal:** agrupamento de temas criado pela própria pessoa (ex.: "RPG de Mesa", "Marketing Digital").
- **Pool ativo:** conjunto de temas elegíveis no sorteio, dado o que estiver ligado (categorias fixas e/ou nichos).
- **Banco-semente:** temas das categorias fixas, escritos por nós, para o primeiro acesso.
- **Prompt de geração:** texto pronto que o site monta para a pessoa copiar e colar numa IA gratuita, pedindo temas para o nicho dela.
- **Salvos:** pautas favoritadas pelo usuário.
- **Conta:** login opcional por e-mail/senha (Firebase Authentication) que permite os nichos e pautas salvas acompanharem a pessoa em qualquer navegador ou aparelho.
- **Firestore:** banco de dados do Firebase usado para guardar, por conta, o mesmo formato de dados que hoje vive no `localStorage`.
- **Regras de segurança (Firestore):** configuração no console do Firebase que restringe cada documento a ser lido/escrito só pela conta dona dele — é o que garante que uma usuária não acesse os dados de outra.
