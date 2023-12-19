import { ethers } from "hardhat";

async function main() {
  const uniswapV2Factory = await ethers.deployContract("UniswapV2Factory", [
    "0xE643CF465eDE9ad11E152BAb8d3cdC6CBC3712E1",
  ]);

  await uniswapV2Factory.waitForDeployment();

  console.log(`UniswapV2Factory deployed to ${uniswapV2Factory.target}`);

  const uniswapV2Router02 = await ethers.deployContract("UniswapV2Router02", [
    uniswapV2Factory.target,
    "0x13A0c5930C028511Dc02665E7285134B6d11A5f4",
  ]);

  await uniswapV2Router02.waitForDeployment();

  console.log(`UniswapV2Router02 deployed to ${uniswapV2Router02.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
