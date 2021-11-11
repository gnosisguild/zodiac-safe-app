cd ../node_modules/@zodiac-module/bridge || exit;
yarn install --ignore-scripts;
yarn build;

if [[ ! -e ../../../src/contracts ]]; then
    mkdir ../../../src/contracts
fi

cp ./build/artifacts/contracts/AMBModule.sol/AMBModule.json ../../../src/contracts/AMBModule.json
