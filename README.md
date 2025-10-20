# Prova de Conceito: Carteira de Identidade Digital

Este repositório contém o código-fonte de uma Prova de Conceito (PoC) de um aplicativo de carteira de identidade digital, desenvolvido em React Native com Expo. O objetivo do projeto é demonstrar um fluxo completo de onboarding, autenticação, e gerenciamento de credenciais (tokens) de forma segura e descentralizada.

## ✨ Funcionalidades Implementadas

O aplicativo simula um ecossistema onde Instituições Financeiras (IFs) podem solicitar a criação ou consulta de tokens de identidade de um usuário, que tem total controle para autorizar ou recusar essas solicitações.

**Fluxo de Onboarding e Cadastro:**
* Tela de boas-vindas para novos usuários.
* Confirmação segura de dados pré-preenchidos (mockados).
* Etapa de criação de senha para a nova conta.

**Autenticação Segura:**
* Login via CPF e Senha.
* Funcionalidade "Lembrar CPF" usando `AsyncStorage`.
* Mecanismo de proteção contra brute-force com bloqueio temporário após múltiplas tentativas falhas.

**Dashboard Principal (Menu de Abas):**
* **Caixa de Entrada:** Exibe solicitações de IFs para consulta ou criação de tokens, com ícones e descrições claras. As solicitações são removidas após serem tratadas.
* **Minha Carteira:** Lista todos os tokens de identidade do usuário, com status (Válido, Expirado, Revogado) e filtros interativos.
* **Visualização de Detalhes:** Telas detalhadas para cada token na carteira.

**Fluxo de Autorização de Tokens:**
* Tela de seleção que diferencia tokens obrigatórios e opcionais.
* Opção para recusar e excluir uma solicitação permanentemente.
* Telas de sucesso e erro para dar feedback claro ao usuário.

**Gerenciamento de Perfil:**
* Header personalizado com nome e foto do usuário.
* Botão de logout seguro no header.
* Tela de perfil acessível ao clicar na foto, exibindo dados cadastrais e opção para alterar a imagem.
* Modal para exibição de QR Code com o hash da conta e detalhes completos.

## 🛠️ Tecnologias Utilizadas

* **React Native & Expo:** Para o desenvolvimento multiplataforma (iOS & Android).
* **TypeScript:** Para garantir a segurança de tipos e a robustez do código.
* **React Navigation:** Para gerenciar toda a navegação do aplicativo, utilizando:
    * `Native Stack Navigator` para fluxos de telas.
    * `Bottom Tab Navigator` para o menu principal.
* **React Context API:** Para o gerenciamento de estado global (dados do usuário e notificações).
* **AsyncStorage:** Para persistência de dados simples no dispositivo (ex: CPF salvo).
* **react-native-svg & @expo/vector-icons:** Para renderização de ícones e logos de alta qualidade.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### Pré-requisitos
* **Node.js:** Versão LTS (18.x ou superior) recomendada. [Baixe aqui](https://nodejs.org/).
* **NPM ou Yarn:** Instalado junto com o Node.js.
* **Expo Go App:** Instale o aplicativo "Expo Go" no seu celular (iOS ou Android) para testar o projeto em um dispositivo físico.
    * [Download para Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
    * [Download para iOS (App Store)](https://apps.apple.com/us/app/expo-go/id982107779)

### Passos de Instalação
1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd <NOME_DA_PASTA_DO_PROJETO>
    ```
3.  **Instale as dependências:**
    Este comando irá baixar todos os pacotes necessários listados no `package.json`.
    ```bash
    npm install
    ```

### Rodando o Aplicativo
1.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    npx expo start
    ```
2.  **Conecte o seu dispositivo:**
    * Após o comando acima, um QR code aparecerá no seu terminal.
    * Abra o aplicativo Expo Go no seu celular.
    * Escaneie o QR code (no iOS, use o app de Câmera; no Android, use a opção de scan dentro do Expo Go).
    * O aplicativo será compilado e carregado no seu celular. Qualquer alteração que você fizer no código será refletida em tempo real!

### Build do Aplicativo

#### Pré-requisitos

Docker instalado e em execução na sua máquina.

Passos

1. Preparação

Copie os arquivos Dockerfile e build.sh para a pasta raiz do seu projeto React Native.

/seu-projeto-react-native
|-- android/
|-- ios/
|-- src/
|-- package.json
|-- Dockerfile      <-- Adicione este arquivo aqui
|-- build.sh        <-- Adicione este arquivo aqui


2. Construa a Imagem Docker

```bash
docker build -t react-native-builder .
```

3. Execute o Build do APK

Depois que a imagem for construída com sucesso, execute o seguinte comando para iniciar um container, compilar seu projeto e gerar o APK:

```bash
npx expo prebuild --platform android
docker run --rm -v $(pwd):/app -v $(pwd)/build:/app/build react-native-builder
```

4. Encontre seu APK

Ao final do processo, uma nova pasta build/apk/ será criada na raiz do seu projeto, e dentro dela você encontrará o app-release.apk pronto para ser distribuído.

/seu-projeto-react-native
|-- build/
|   |-- apk/
|       |-- app-release.apk   <-- SEU APK ESTÁ AQUI!
|-- android/
|-- ...

Pronto! Agora você tem um processo de build que pode ser facilmente replicado em qualquer máquina que tenha Docker.