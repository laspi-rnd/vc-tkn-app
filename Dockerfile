#
# Dockerfile para criar um ambiente de build para React Native (Android)
#

# Define a imagem base (Ubuntu 20.04 LTS)
FROM ubuntu:20.04

# Argumentos para configurar as versões das ferramentas (pode ser alterado no build)
ARG NODE_VERSION=22
ARG JDK_VERSION=11
ARG ANDROID_CMD_TOOLS="9477386"
ARG ANDROID_BUILD_TOOLS="33.0.2"
ARG ANDROID_PLATFORM="33"

# Variáveis de ambiente
ENV DEBIAN_FRONTEND="noninteractive"
ENV ANDROID_HOME="/opt/android-sdk"
ENV PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

# --------------------
# INSTALAÇÃO DE DEPENDÊNCIAS BASE
# --------------------
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget unzip curl git openssl sed && \
    # Instala o Java Development Kit (JDK)
    apt-get install -y openjdk-${JDK_VERSION}-jdk && \
    # Limpa o cache do apt para reduzir o tamanho da imagem
    apt-get clean && rm -rf /var/lib/apt/lists/*

# --------------------
# INSTALAÇÃO DO NODE.JS E NPM (Método Recomendado - NodeSource)
# --------------------
# O script do NodeSource configura o repositório APT.
# Depois, o apt-get install -y nodejs instala o Node.js e o NPM daquele repositório.
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs

# --------------------
# INSTALAÇÃO DO ANDROID SDK
# --------------------
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMD_TOOLS}_latest.zip" -O /tmp/cmdline-tools.zip && \
    unzip -q /tmp/cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Aceita as licenças do Android SDK e instala as plataformas e ferramentas de build necessárias
RUN yes | sdkmanager --licenses > /dev/null && \
    sdkmanager "platforms;android-${ANDROID_PLATFORM}" "build-tools;${ANDROID_BUILD_TOOLS}" "platform-tools"

# --------------------
# CONFIGURAÇÃO DO PROJETO
# --------------------
WORKDIR /app

# Copia e prepara o script de build
COPY build.sh /usr/local/bin/build.sh
RUN sed -i 's/\r$//' /usr/local/bin/build.sh
RUN chmod +x /usr/local/bin/build.sh

# Define o ponto de entrada do container
ENTRYPOINT ["/usr/local/bin/build.sh"]