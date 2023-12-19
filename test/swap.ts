import { expect } from "chai";
import { ethers } from "hardhat";
import path from "path";

describe("UniswapV2 On ZETA", async function () {
  const bitcoinZRC20 = "0x65a45c57636f9BcCeD4fe193A602008578BcA90b";
  const ethZRC20 = "0x13A0c5930C028511Dc02665E7285134B6d11A5f4";
  // gets the contract addresses from json file
  const pathDeployOutputParameters = path.join(
    __dirname,
    "../scripts/address.json"
  );
  const deployOutputParameters = require(pathDeployOutputParameters);
  const pairAddress = deployOutputParameters.pairAddress;
  const UniswapV2Router02Address =
    deployOutputParameters.UniswapV2Router02Address;
  const [signer] = await ethers.getSigners();

  describe("Token Approvals", function () {
    // Testing for token approvals
    it("Should approve the token", async function () {
      // Bitcoin ZRC20 contract instance creation
      const bitcoin = await ethers.getContractAt("ZRC20", bitcoinZRC20, signer);
      // Eth ZRC20 contract instance creation
      const eth = await ethers.getContractAt("ZRC20", ethZRC20, signer);
      //Bitcoin approval to router contract with max limit unit256(for testing used max but in production need to use exact numbers)
      const approveBTC = await bitcoin.approve(
        UniswapV2Router02Address,
        ethers.MaxUint256
      );
      await approveBTC.wait();
      expect(
        await bitcoin.allowance(signer.address, UniswapV2Router02Address)
      ).to.equal(ethers.MaxUint256);
      //ETH approval to router contract with max limit unit256(for testing used max but in production need to use exact numbers)
      const approveETH = await eth.approve(
        UniswapV2Router02Address,
        ethers.MaxUint256
      );
      await approveETH.wait();
      expect(
        await eth.allowance(signer.address, UniswapV2Router02Address)
      ).to.equal(ethers.MaxUint256);
    });
  });
  describe("Adding liquidity", function () {
    // Adding liquidity to pool
    it("Should add liquidity", async function () {
      // 10 mins from now in timestamp format
      const deadline = Math.floor((Date.now() / 1000) * (10 * 60));
      // input amounts to add in pool
      const amountBTC = ethers.parseUnits("0.0005", 8);
      const amountETH = ethers.parseEther("0.01");

      // BTC-ETH pair contract instance
      const pairContract = await ethers.getContractAt(
        "UniswapV2Pair",
        pairAddress,
        signer
      );
      // gets the reserves before adding liquidity
      const reservesBefore = await pairContract.getReserves();
      console.log("Reserves Before", reservesBefore);
      // Uniswap router contract instance
      const uniswapV2Router02 = await ethers.getContractAt(
        "UniswapV2Router02",
        UniswapV2Router02Address,
        signer
      );
      // Tx for adding liquidity to pair, passing desired amounts as 0 cause this was first liquidation of pool
      const addLiquidity = await uniswapV2Router02.addLiquidity(
        bitcoinZRC20,
        ethZRC20,
        amountBTC,
        amountETH,
        0,
        0,
        signer.address,
        deadline,
        { gasLimit: "1000000" }
      );
      await addLiquidity.wait();

      // gets the reserves after adding liquidity
      const reservesAfter = await pairContract.getReserves();
      console.log("Reserves After", reservesAfter);
      expect(reservesAfter[0]).to.equal(amountETH);
      expect(reservesAfter[1]).to.equal(amountBTC);
    });
  });
  describe("Swapping Tokens", function () {
    it("Should swap btc to eth token", async function () {
      // 10 mins from now in timestamp format
      const deadline = Math.floor((Date.now() / 1000) * (10 * 60));
      //BTC amountIn for swap
      const amountIn = ethers.parseUnits("0.00005", 8);

      const uniswapV2Router02 = await ethers.getContractAt(
        "UniswapV2Router02",
        UniswapV2Router02Address,
        signer
      );
      // ETH ZRC20 contract instance
      const eth = await ethers.getContractAt("ZRC20", ethZRC20, signer);
      // Eth balance before swapping
      const balanceBefore = await eth.balanceOf(signer.address);
      console.log("Eth Balance Before Swapping", balanceBefore);
      //swap tx
      const swapTx = await uniswapV2Router02.swapExactTokensForTokens(
        amountIn,
        0,
        [bitcoinZRC20, ethZRC20],
        signer.address,
        deadline,
        { gasLimit: "1000000" }
      );
      await swapTx.wait();
      // Eth balance After swapping
      const balanceAfter = await eth.balanceOf(signer.address);
      console.log("Eth Balance After Swapping", balanceAfter);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should swap eth to btc token", async function () {
      // 10 mins from now in timestamp format
      const deadline = Math.floor((Date.now() / 1000) * (10 * 60));
      // ETH amountIn for swap
      const amountIn = ethers.parseEther("0.01");

      const uniswapV2Router02 = await ethers.getContractAt(
        "UniswapV2Router02",
        UniswapV2Router02Address,
        signer
      );
      // bitcoin contract instance
      const bitcoin = await ethers.getContractAt("ZRC20", bitcoinZRC20, signer);
      // Bitcoin balance before swapping
      const balanceBefore = await bitcoin.balanceOf(signer.address);
      console.log("Bitcoin Balance Before Swapping", balanceBefore);
      const swapTx = await uniswapV2Router02.swapExactTokensForTokens(
        amountIn,
        0,
        [ethZRC20, bitcoinZRC20],
        signer.address,
        deadline,
        { gasLimit: "1000000" }
      );
      await swapTx.wait();
      // Bitcoin balance After swapping
      const balanceAfter = await bitcoin.balanceOf(signer.address);
      console.log("Bitcoin Balance Before Swapping", balanceAfter);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
  });
});
