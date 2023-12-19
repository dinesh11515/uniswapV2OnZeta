import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-dependency-compiler";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },

  networks: {
    zeta: {
      url: `https://rpc.ankr.com/zetachain_evm_athens_testnet`,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  dependencyCompiler: {
    paths: [
      "@uniswap/v2-core/contracts/UniswapV2Pair.sol",
      "@uniswap/v2-core/contracts/UniswapV2Factory.sol",
      "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol",
    ],
  },
};

export default config;
