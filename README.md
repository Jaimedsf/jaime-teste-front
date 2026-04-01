# React JWT Auth Frontend

Este é o repositório frontend para o sistema de autenticação via JWT, construído utilizando **React**. 

## 🛠️ Tecnologias e Bibliotecas Utilizadas

O projeto faz uso das seguintes tecnologias principais:
- **[React](https://reactjs.org/) (v18)**: Biblioteca principal para construção das interfaces de usuário.
- **[React Router DOM](https://reactrouter.com/)**: Gerenciamento de rotas e navegação.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para consultas à API.
- **[Bootstrap](https://getbootstrap.com/) (v4)**: Framework de CSS para componentes ágeis e responsividade.
- **[FontAwesome](https://fontawesome.com/)**: Biblioteca de ícones e SVG.
- **[Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)**: Controle de estados de formulários complexos e validação de esquemas.
- **Outras bibliotecas**: `date-fns` (manipulação de datas), `react-table` (tabelas interativas), e suporte a máscaras em inputs (`react-input-mask`, `react-number-format`).

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na máquina.
- [NPM](https://www.npmjs.com/) (incluso no Node.js).

## 🚀 Instalação e Inicialização

1. Clone o repositório e abra a pasta do projeto no terminal.
2. Instale as dependências executando:

```bash
npm install
```

3. Para rodar o ambiente de desenvolvimento localmente, utilize:

```bash
npm start
```
A aplicação abrirá automaticamente no navegador em `http://localhost:3000`.

## 📦 Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos através do NPM:

- `npm start`: Roda o aplicativo em modo de desenvolvimento.
- `npm run build`: Constrói o aplicativo de maneira otimizada ("production-ready") e exporta os arquivos para a pasta `build/`.
- `npm test`: Executa os testes usando o interpretador padrão.

## ⚠️ Aviso de Sistemas e Manutenção (Atualizações de Segurança)

> Devido a uma execução recente do comando `npm audit fix --force`, atenção à versão local da biblioteca `react-scripts` no arquivo `package.json`, que sofreu um *downgrade* agressivo para a versão `0.0.0` e desinstalou a fundação do Webpack e da compilação, o que pode impossibilitar o script `npm start` ou `npm run build` de funcionar localmente. Para consertar este comportamento, será preciso instalar uma versão funcional (`npm install react-scripts@5.0.1 --save`).
