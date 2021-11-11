cd ../node_modules/@zodiac-module/delay || exit;
yarn install --ignore-scripts;
yarn build;

if [[ ! -e ../../../src/contracts ]]; then
    mkdir ../../../src/contracts
fi

cp ./build/artifacts/contracts/Delay.sol/Delay.json ../../../src/contracts/Delay.json
