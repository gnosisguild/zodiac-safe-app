#!/bin/bash

cd ../node_modules/@zodiac-module/delay || exit;
yarn install --ignore-scripts;
yarn build;

mkdir -p ../../../src/contracts

cp ./build/artifacts/contracts/Delay.sol/Delay.json ../../../src/contracts/Delay.json
