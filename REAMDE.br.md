# NodeChain

NodeChain é um projeto de blockchain simples implementado em Node.js utilizando TypeScript. O objetivo do projeto é fornecer uma demonstração funcional de como construir uma blockchain com blocos encadeados, usando hash para garantir a integridade dos dados.

## Estrutura do Projeto

O projeto é composto por várias classes e serviços que implementam o núcleo de uma blockchain. A estrutura é composta principalmente por três componentes principais:

1. **Block.ts**: Define a classe `Block`, responsável pela criação e validação de blocos na blockchain.
2. **Blockchain.ts**: Define a classe `Blockchain`, que gerencia a cadeia de blocos e valida a integridade da blockchain.
3. **Validation.ts**: Define a classe `Validation`, usada para verificar a validade dos blocos e da blockchain.
4. **BlockchainServer.ts**: Define as rotas em um servidor HTTP/REST de uso para inserção e consulta de blocks na blockchain.

## Funcionalidades

- **Geração de Blocos**: Cada bloco contém um índice, timestamp, dados, o hash do bloco anterior e o seu próprio hash gerado com SHA-256.
- **Validação de Blocos**: A classe `Block` valida a integridade de cada bloco com base no índice, hash do bloco anterior e dados do bloco.
- **Validação da Blockchain**: A classe `Blockchain` garante que todos os blocos da cadeia sejam válidos, verificando a integridade de cada bloco.
- **Adição de Blocos**: Novos blocos podem ser adicionados à blockchain após a validação de sua integridade.
- **Servidor REST para a Blockchain**: O correto seria um RPC, mas como é um protótipo, foi mantido REST mesmo, a ideia é manter os dados em memória até o momento da blockchain.

## Instalação

Para instalar e executar o projeto, siga as instruções abaixo:

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **NPM** ou **Yarn**

### Passos

1. Clone este repositório:
```bash
   git clone git@github.com:ejrgeek/nodechain-prototipo.git
   cd nodechain-prototipo
```

2. Instale as dependências:
```bash
   npm install
```

3. Executa os testes usando o Jest:
```bash
   npm test
```

4. Executa o servidor TypeScript para rodar a blockchain:
```bash
   npm run blockchain
```

### Scripts
- **npm run test**: Executa os testes usando o Jest.
- **npm run compile**: Compila o código TypeScript.
- **npm run dev**: Inicia o servidor de desenvolvimento com nodemon e ts-node.
- **npm run start**: Roda o código compilado.
- **npm run blockchain**: Executa o servidor TypeScript para rodar a blockchain.

## Contribuição
Sinta-se à vontade para contribuir! Se você tiver sugestões ou melhorias, fique à vontade para abrir uma pull request ou issue.