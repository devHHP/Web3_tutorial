//原dotenv方式（删除）
//require("dotenv").config()

// 新加密加载方式
const { config } = require("@chainlink/env-enc");  // 替换dotenv
config(); // 自动加载.env.enc

require("./tasks")

require("@nomicfoundation/hardhat-toolbox");


//使用.env中的配置
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",

  //默认存在  网络设置  
  //defaultNetwork: "hardhat",
  //若需要配置其他网络就需要显式写出来
  networks: {
    sepolia: {
      url: SEPOLIA_URL,      // 从加密环境加载
      accounts: [PRIVATE_KEY,PRIVATE_KEY_1],    // 从加密环境加载
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY  // 新的 v2 版本  单一全局密钥，无需按网络拆分 故不需要写 通用sepolia
  }
};
