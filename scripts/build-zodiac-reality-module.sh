cd ../node_modules/@zodiac-module/reality || exit;
yarn install --ignore-scripts;
yarn build;

if [[ ! -e ../../../src/contracts ]]; then
    mkdir ../../../src/contracts
fi

cp ./build/artifacts/contracts/RealityModuleERC20.sol/RealityModuleERC20.json ../../../src/contracts/RealityModuleERC20.json;
cp ./build/artifacts/contracts/RealityModuleETH.sol/RealityModuleETH.json ../../../src/contracts/RealityModuleETH.json;
