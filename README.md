# FlexFit Docs — Modelo de documentação

Este repositório é o **modelo base** para documentação de soluções FlexFit. Use-o como ponto de partida: copie a estrutura, substitua o conteúdo do módulo de exemplo (`RailWorks`) pelo da sua solução e publique no GitHub.

---

## Visão geral da estrutura

```
FlexFit_Docs/
├── CSS/                          # Estilos compartilhados (em geral, não editar)
├── modules/
│   └── RailWorks/                # Módulo da solução (renomeie para a sua)
│       ├── docs/
│       │   └── nav.html          # Menu da barra lateral
│       └── manual/
│           ├── *.html            # Páginas do manual
│           ├── Images/           # Imagens das páginas + logos
│           └── Tutorial/         # Tutoriais passo a passo
├── scripts/
│   └── build-docs.mjs            # Gera o site com sidebar
└── site/                         # Saída gerada (não versionar)
```

O conteúdo editável fica em `modules/<NomeDaSolucao>/`. O script de build injeta a barra lateral e gera a pasta `site/` para visualização local.

---

## 1. Adequando o módulo à sua solução

1. Renomeie a pasta `modules/RailWorks` para o nome da sua solução, por exemplo `modules/MinhaSolucao`.
2. Atualize os caminhos em:
   - `modules/<NomeDaSolucao>/docs/nav.html` (todos os `href`)
   - `scripts/build-docs.mjs` (caminhos `MANUAL_DIR`, `NAV_FILE`, `WELCOME_PATH` e referências a `RailWorks`)
3. Substitua os logos em `modules/<NomeDaSolucao>/manual/Images/`:
   - `logo_RW.svg` → logo da sua solução (mantenha o nome ou atualize a referência em `build-docs.mjs`)
   - `logo_FS.png` → logo FlexSim (pode manter)

---

## 2. Páginas do manual

As páginas ficam em:

```
modules/<NomeDaSolucao>/manual/
```

Arquivos na raiz de `manual/` (ex.: `WelcomeToRailWorks.html`, `3DObjects.html`) são as páginas principais.

### Como criar ou editar uma página

1. Copie uma página existente como modelo (ex.: `WelcomeToRailWorks.html`).
2. Renomeie o arquivo (evite espaços quando possível; use `PascalCase` ou hífens).
3. Ajuste o `<title>`, o `<h1>` e o conteúdo das `<section>`.
4. Mantenha o link do CSS relativo à profundidade do arquivo:

| Local do arquivo | Caminho do CSS |
|---|---|
| `manual/Pagina.html` | `../../../CSS/FlexsimHelpStandard.css` |
| `manual/Tutorial/.../Overview.html` | `../../../../../CSS/FlexsimHelpStandard.css` |
| `manual/Tutorial/.../1.1-Exemplo/Pagina.html` | `../../../../../../CSS/FlexsimHelpStandard.css` |

5. Inclua a nova página no `nav.html` (veja a seção 5).

### Estrutura recomendada de uma página

```html
<!DOCTYPE html>
<html>
<head>
  <title>Título da página</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="../../../CSS/FlexsimHelpStandard.css" />
</head>
<body style="text-align: justify">
  <header>
    <h1>Título visível</h1>
    <nav>
      <ul>
        <li><a href="#secao-1">Seção 1</a></li>
        <li><a href="#secao-2">Seção 2</a></li>
      </ul>
    </nav>
  </header>
  <section id="secao-1">
    <h2>Seção 1</h2>
    <p>Conteúdo...</p>
  </section>
</body>
</html>
```

---

## 3. Imagens

Há **dois locais** de imagens, conforme o tipo de conteúdo.

### Páginas do manual

Coloque as imagens em:

```
modules/<NomeDaSolucao>/manual/Images/
```

Organize por assunto em subpastas (ex.: `Images/objects/`, `Images/dashboards/`).

No HTML da página (na raiz de `manual/`), referencie assim:

```html
<img src="Images/objects/MeuObjeto.png" alt="Descrição" />
```

### Tutoriais

Cada exercício tem sua própria pasta `Images/` ao lado do HTML:

```
Tutorial/Tutorial1-Basics/1.1-Exemplo/
├── Exemplo.html
└── Images/
    ├── Passo1.png
    └── Passo2.png
```

No HTML do exercício:

```html
<img class="tutorial-image" src="Images/Passo1.png" alt="Passo 1" />
```

Classes úteis já usadas no modelo:

- `tutorial-image` — capturas gerais (~75% da largura)
- `tutorial-pf-gui` — telas de Process Flow (~40% da largura)

### Logos da sidebar

Ficam em `manual/Images/` e são injetados pelo build:

- Logo da solução (topo da barra)
- Logo FlexSim (rodapé da barra)

---

## 4. Tutoriais

Os tutoriais ficam em:

```
modules/<NomeDaSolucao>/manual/Tutorial/
```

### Convenção de pastas

```
Tutorial/
└── Tutorial1-NomeDoTutorial/
    ├── Tutorial 1 Overview.html          # Visão geral + links das tarefas
    ├── 1.1-NomeDaTarefa/
    │   ├── NomeDaTarefa.html
    │   └── Images/
    └── 1.2-OutraTarefa/
        ├── OutraTarefa.html
        └── Images/
```

### Como adicionar um tutorial

1. Crie a pasta `TutorialN-NomeSemEspacos`.
2. Crie o HTML de overview (copie um overview existente).
3. Para cada exercício, crie a subpasta `N.M-NomeDaTarefa/` com o HTML e a pasta `Images/`.
4. No overview, linke as tarefas relativas:

```html
<a href="1.1-NomeDaTarefa/NomeDaTarefa.html">Nome da tarefa</a>
```

5. Cadastre overview e exercícios no `nav.html`.

### Removendo tutoriais do modelo

Se a sua solução não usar os tutoriais do RailWorks, apague as pastas em `Tutorial/` que não forem necessárias e remova os itens correspondentes do `nav.html`.

---

## 5. Barra de navegação lateral

O menu da sidebar é definido em:

```
modules/<NomeDaSolucao>/docs/nav.html
```

O build lê esse arquivo e injeta o menu em todas as páginas geradas.

### Estrutura do menu

```html
<ul class="topnav">
  <li class="has-children">
    <a href="#">NomeDaSolucao</a>
    <ul>
      <!-- Página simples -->
      <li>
        <a href="modules/NomeDaSolucao/manual/Welcome.html"
           data-topic-id="Welcome_NomeDaSolucao">Welcome / Quick Start</a>
      </li>

      <!-- Grupo com filhos -->
      <li class="has-children">
        <a href="#">Conteúdo</a>
        <ul>
          <li>
            <a href="modules/NomeDaSolucao/manual/Objetos.html"
               data-topic-id="Objetos_NomeDaSolucao">Objetos 3D</a>
          </li>
        </ul>
      </li>

      <!-- Tutoriais -->
      <li class="has-children">
        <a href="#">Tutorials</a>
        <ul>
          <li class="has-children">
            <a href="#">Tutorial 1 - Basics</a>
            <ul>
              <li>
                <a href="modules/NomeDaSolucao/manual/Tutorial/Tutorial1-Basics/Tutorial 1 Overview.html">
                  Tutorial 1 Overview
                </a>
              </li>
              <li>
                <a href="modules/NomeDaSolucao/manual/Tutorial/Tutorial1-Basics/1.1-Task/Task.html">
                  Tutorial 1.1 - Task
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

### Regras importantes

- Todo `href` de página real usa o caminho a partir da raiz do site, começando em `modules/...`.
- Itens só de agrupamento usam `href="#"`.
- Pastas expansíveis usam a classe `has-children` no `<li>`.
- Após criar, renomear ou remover páginas/tutoriais, **sempre atualize o `nav.html`**.

> O arquivo `docs/TOC.html` é um espelho legado do menu. O que o build usa de fato é o `nav.html`. Mantenha o `nav.html` como fonte da verdade.

---

## 6. Visualizando localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS)
- Dependência do build: `cheerio`

Na raiz do repositório:

```bash
npm install cheerio
```

### Gerar o site

```bash
node scripts/build-docs.mjs
```

Isso gera (ou atualiza) a pasta `site/` com todas as páginas + sidebar.

### Servir localmente

```bash
npx serve site
```

Abra no navegador o endereço indicado no terminal (geralmente `http://localhost:3000`).

### Fluxo de edição recomendado

1. Edite HTML, imagens ou `nav.html` em `modules/`.
2. Rode `node scripts/build-docs.mjs`.
3. Atualize a página no navegador.

Se o build avisar que não conseguiu substituir `site/` (pasta em uso pelo servidor), pare o `npx serve`, rode o build de novo e reinicie o servidor — ou use a pasta `.site-staging` conforme a mensagem do script.

---

## 7. Publicando no repositório (push)

Quando a documentação da sua solução estiver pronta:

### 7.1 Clone e branch

```bash
git clone https://github.com/FlexSim-Brasil/FlexFit_Docs.git
cd FlexFit_Docs
git checkout -b docs/nome-da-solucao
```

> Se você já estiver trabalhando em um fork ou cópia local do modelo, pule o clone e apenas crie a branch.

### 7.2 Confirme o que será enviado

Não versionamos a pasta gerada (`site/`, `.site-staging/`, `node_modules/`). Envie apenas o conteúdo-fonte:

- `modules/<NomeDaSolucao>/...`
- `scripts/build-docs.mjs` (se adaptado)
- `CSS/` (só se tiver alteração necessária)
- `README.md` (se pertinente)

```bash
git status
git diff
```

### 7.3 Commit

```bash
git add modules scripts
git commit -m "docs: adiciona documentação da solução NomeDaSolucao"
```

### 7.4 Push e Pull Request

```bash
git push -u origin docs/nome-da-solucao
```

Em seguida, abra um Pull Request no GitHub contra a branch principal do repositório e **solicite um revisor**. Isso avisa o responsável de que a documentação está pronta para deploy.

```bash
gh pr create --title "docs: NomeDaSolucao" --reviewer USUARIO_GITHUB --body "## Summary
- Documentação da solução NomeDaSolucao com base no modelo FlexFit Docs
- Pronta para review e deploy

## Test plan
- [ ] \`node scripts/build-docs.mjs\` conclui sem erro
- [ ] \`npx serve site\` exibe a home e a sidebar corretas
- [ ] Links do \`nav.html\` abrem as páginas esperadas
- [ ] Imagens e tutoriais carregam corretamente"
```

Substitua `USUARIO_GITHUB` pelo username do revisor no GitHub.

Ou crie o PR pela interface do GitHub após o push e, em **Reviewers**, adicione o usuário responsável pelo deploy.

Se o PR já existir sem revisor:

```bash
gh pr edit --add-reviewer USUARIO_GITHUB
```

---

## Checklist rápido

- [ ] Pasta do módulo renomeada para a solução
- [ ] Páginas HTML criadas/adaptadas em `manual/`
- [ ] Imagens em `manual/Images/` (páginas) e em `Images/` por exercício (tutoriais)
- [ ] Tutoriais organizados em `manual/Tutorial/`
- [ ] `docs/nav.html` atualizado com todos os links
- [ ] `scripts/build-docs.mjs` apontando para o novo módulo (se renomeou)
- [ ] Build local ok (`node scripts/build-docs.mjs`)
- [ ] Preview local ok (`npx serve site`)
- [ ] Commit e push na branch da solução
- [ ] Pull Request aberto com revisor solicitado (documentação pronta para deploy)
