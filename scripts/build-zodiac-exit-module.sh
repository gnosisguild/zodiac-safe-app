cd ../node_modules/@zodiac-module/exit/packages/contracts || exit;
yarn install --ignore-scripts;
yarn build;

if [[ ! -e ../../../../../src/contracts ]]; then
    mkdir ../../../../../src/contracts
fi

cp ./build/artifacts/contracts/ExitModule.sol/Exit.json ../../../../../src/contracts/Exit.json
