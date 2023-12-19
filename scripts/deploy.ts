import { ethers } from "hardhat";
import path = require("path");
import { writeFileSync } from "fs";

// this function will depoly the uniswap v2 factory and router, also creates the BTC and ETH pair pool in uniswap v2
async function main() {
  const bitcoinZRC20 = "0x65a45c57636f9BcCeD4fe193A602008578BcA90b";
  const ethZRC20 = "0x13A0c5930C028511Dc02665E7285134B6d11A5f4";
  //UniswapV2Factory Contract deployment
  const uniswapV2Factory = await ethers.deployContract("UniswapV2Factory", [
    ethers.ZeroAddress, // No fee address
  ]);

  await uniswapV2Factory.waitForDeployment();

  console.log(`UniswapV2Factory deployed to ${uniswapV2Factory.target}`);

  //UniswapV2Router02 Contract deployment
  const uniswapV2Router02 = await ethers.deployContract("UniswapV2Router02", [
    uniswapV2Factory.target,
    "0x13A0c5930C028511Dc02665E7285134B6d11A5f4",
  ]);

  await uniswapV2Router02.waitForDeployment();

  console.log(`UniswapV2Router02 deployed to ${uniswapV2Router02.target}`);

  // BTC and ETH Pair creation tx
  const tx = await uniswapV2Factory.createPair(bitcoinZRC20, ethZRC20);
  await tx.wait();
  const pairAddress = await uniswapV2Factory.getPair(bitcoinZRC20, ethZRC20);
  console.log(`Pair address of bitcoin and eth ${pairAddress}`);

  // this will create a address json file and stores the addresses of above contracts
  const outputJson = {
    UniswapV2FactoryAddress: uniswapV2Factory.target,
    UniswapV2Router02Address: uniswapV2Router02.target,
    pairAddress: pairAddress,
  };
  const pathOutputJson = path.join(__dirname, "./address.json");
  writeFileSync(pathOutputJson, JSON.stringify(outputJson, null, 1));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
