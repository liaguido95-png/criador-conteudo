# Guia simples: onde tudo mora e como atualizar o site

> Este arquivo explica, do jeitinho mais simples possível, onde o projeto
> "Giro de Ideias" está guardado e como fazer uma mudança aparecer no site
> de verdade, pro mundo ver. Não precisa saber programar pra entender isso.

---

## 1. Onde cada coisa mora

Pensa assim: o projeto existe em **três lugares diferentes**, e eles
precisam ficar "combinando" entre si.

| Lugar | O que é | Endereço |
|---|---|---|
| 💻 **Seu computador** | A pasta onde os arquivos do site ficam guardados, no seu PC. É aqui que as mudanças são feitas primeiro. | `C:\Users\lia.chinellato\desktop\criador-conteudo` |
| 🐙 **GitHub** | Um "cofre" na internet que guarda uma cópia de tudo, com o histórico de cada mudança. | https://github.com/liaguido95-png/criador-conteudo |
| 🌐 **O site no ar** | O endereço que qualquer pessoa acessa pra usar o app. Ele é gerado automaticamente a partir do que está no GitHub. | https://liaguido95-png.github.io/criador-conteudo/ |

**Regra de ouro:** mudar um arquivo no seu computador **não muda o site
sozinho**. É preciso "mandar" a mudança pro GitHub — só aí o site se
atualiza. É como escrever uma carta (computador) e depois precisar
colocá-la no correio (GitHub) pra ela chegar no destino (o site).

---

## 2. Como pedir uma mudança (identidade visual, tela de login, o que for)

Você não precisa escrever código. Você só precisa **descrever o que quer**
pro Claude Code, do jeito que você já vem fazendo nesta conversa. Por
exemplo:

> "Muda a cor do botão de Girar pra verde."
> "O layout no computador está apertado, aproveita melhor a tela."
> "O texto tal está com erro de português."

O Claude edita os arquivos direto na pasta do seu computador (item 💻 da
tabela acima). Até aqui, a mudança existe **só no seu computador** — o site
no ar ainda está do jeito antigo.

---

## 3. Como "publicar" a mudança (fazer o site atualizar)

Isso se chama, no jargão técnico, **"commitar e dar push"**. Mas você não
precisa decorar esses nomes — é só pedir:

> **"Sobe as alterações pro GitHub."**
> ou
> **"Comita e publica essas mudanças."**

O Claude vai:
1. Separar os arquivos que mudaram (**"commit"** = tirar uma foto do que
   mudou, com uma etiqueta explicando o que foi).
2. Mandar essa "foto" pro GitHub (**"push"** = enviar pelo correio).
3. O GitHub Pages (o serviço que hospeda o site) percebe sozinho que
   chegou coisa nova e **atualiza o site automaticamente** — sem você
   precisar fazer mais nada.

⏱️ **Isso não é instantâneo:** depois do "push", o site pode levar de
**1 a 5 minutos** pra mostrar a versão nova. Se você atualizar a página e
ainda estiver igual, espera um pouquinho e tenta de novo.

🔄 **Se mesmo depois de esperar continuar parecendo igual ao de antes:** é
quase sempre o navegador mostrando uma cópia antiga que ele mesmo guardou
("cache"), não o site de verdade. Aperte **Ctrl+Shift+R** (em vez do F5
normal) — isso força o navegador a esquecer a versão antiga e buscar tudo
de novo.

### Passo a passo de como pedir (resumo pra colar numa conversa nova)

1. Peça a correção que quiser (ex.: "ajusta a cor tal", "conserta a tela
   de login").
2. Depois que o Claude terminar e você conferir que ficou bom, diga:
   **"Pode subir pro GitHub."**
3. Espere a confirmação do Claude de que o "push" foi feito.
4. Abra https://liaguido95-png.github.io/criador-conteudo/ numa aba nova
   (ou aperte Ctrl+F5) depois de alguns minutos, pra ver a mudança no ar.

---

## 4. Perguntas que você provavelmente vai ter

**"Eu posso estragar o site pedindo uma mudança errada?"**
Não tem perigo de "quebrar pra sempre" — o GitHub guarda o histórico de
tudo. Se algo sair errado, dá pra voltar pra uma versão anterior. Mas só
peça pro Claude "subir pro GitHub" depois de conferir que a mudança ficou
do jeito que você queria, testando no navegador.

**"Preciso abrir o GitHub toda vez?"**
Não. No dia a dia, você só conversa com o Claude Code normalmente, como já
faz. Você só precisaria abrir o GitHub se quisesse ver o histórico de
mudanças.

**"E se eu quiser mudar de computador?"**
Como tudo fica guardado no GitHub (item 🐙 da tabela), dá pra continuar o
projeto de qualquer computador — é só uma questão de configurar o acesso
de novo naquele computador (isso é trabalho técnico único, não é algo que
você precisa fazer sozinha).

---

## 5. Resumo de uma frase

> Corrigir = pedir a mudança pro Claude → conferir no navegador → dizer
> **"pode subir pro GitHub"** → esperar alguns minutinhos → conferir o site
> no ar de novo.
