cd ../node_modules/@zodiac-module/bridge &&
yarn install --ignore-scripts &&
yarn build &&
mkdir ../../../src/contracts -p &&
cp ./build/artifacts/contracts/AMBModule.sol/AMBModule.json ../../../src/contracts/AMBModule.json