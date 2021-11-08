cd ../node_modules/@zodiac-module/exit &&
yarn install --ignore-scripts &&
yarn build &&
mkdir ../../../src/contracts -p &&
cp ./build/artifacts/contracts/ExitModule.sol/Exit.json ../../../src/contracts/Exit.json