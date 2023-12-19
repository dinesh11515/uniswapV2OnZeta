import { ethers } from "hardhat";
import { UniswapV2FactoryAddress } from "../constants/index";
async function main() {
  //   const bitcoinZRC20 = "0x65a45c57636f9BcCeD4fe193A602008578BcA90b";
  //   const ethZRC20 = "0x13A0c5930C028511Dc02665E7285134B6d11A5f4";
  const [signer] = await ethers.getSigners();
  //   const uniswapV2Factory = await ethers.getContractAt(
  //     "UniswapV2Factory",
  //     UniswapV2FactoryAddress,
  //     signer
  //   );
  //   await uniswapV2Factory.createPair(bitcoinZRC20, ethZRC20);

  //   const pairAddress = await uniswapV2Factory.getPair(bitcoinZRC20, ethZRC20);
  //   console.log(`Pool address of bitcoin and eth ${pairAddress}`);

  const pairContract = await ethers.getContractAt(
    "UniswapV2Pair",
    "0x65a45c57636f9BcCeD4fe193A602008578BcA90b",
    signer
  );
  console.log(pairContract);

  //   const reserves = await uniswapV2Factory.getPair(bitcoinZRC20, ethZRC20);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
