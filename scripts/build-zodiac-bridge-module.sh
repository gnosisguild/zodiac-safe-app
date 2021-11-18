cd ../node_modules/@zodiac-module/bridge || exit;
yarn install --ignore-scripts;
yarn build;

mkdir -p ../../../src/contracts

cp ./build/artifacts/contracts/AMBModule.sol/AMBModule.json ../../../src/contracts/AMBModule.json
