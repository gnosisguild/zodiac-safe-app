cd ../node_modules/@zodiac-module/delay &&
yarn install --ignore-scripts &&
yarn build &&
mkdir ../../../src/contracts -p &&
cp ./build/artifacts/contracts/Delay.sol/Delay.json ../../../src/contracts/Delay.json