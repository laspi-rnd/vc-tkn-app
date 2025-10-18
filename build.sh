#!/bin/sh
set -e

echo "================================================="
echo "      INICIANDO BUILD ANDROID REACT NATIVE       "
echo "================================================="

if [ ! -f "package.json" ]; then
echo "ERRO: O arquivo package.json não foi encontrado."
echo "Certifique-se de que você está montando o volume do seu projeto em /app"
exit 1
fi

echo "--> Instalando dependências do npm..."
npm install

cd android
echo "--> Limpando build anterior do Gradle..."
./gradlew clean

echo "--> Gerando o APK de Release..."
./gradlew assembleRelease --no-daemon

echo "--> Copiando APK para o diretório de saída..."
OUTPUT_DIR="/app/build/apk"
mkdir -p ${OUTPUT_DIR}
cp app/build/outputs/apk/release/app-release.apk ${OUTPUT_DIR}/

echo "================================================="
echo "           BUILD CONCLUÍDO COM SUCESSO!          "
echo " O APK está disponível na sua pasta local 'build/apk' "
echo "================================================="