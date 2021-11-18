cd ../node_modules/@zodiac-module/exit/packages/contracts || exit;
yarn install --ignore-scripts;
yarn build;

mkdir -p ../../../../../src/contracts

cp ./build/artifacts/contracts/ExitModule.sol/Exit.json ../../../../../src/contracts/Exit.json
