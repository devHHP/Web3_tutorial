const { task } = require("hardhat/config")

//合约交互
//由于这里使用到fundMe函数，需要定义，就需要通过添加参数的形式传入 .addParam("")
task("interact-fundme","交互fundme合约").addParam("addr","fundme 合约地址").setAction(async(taskArgs,hre) => {

    //新建fundMe对象，通过合约工厂拿到
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)

    //1.初始化2个账户
    const [firstAmount,secondAcount] = await ethers.getSigners()
    //2.发送第一个合约账户   fundMe.fund发送完不代表马上能部署完查询到 需要等待交易完成
    const fundTX_1 = await fundMe.fund({value: ethers.parseEther("0.01")})
    await fundTX_1.wait()
    //3.检查合约余额
    const balanceOfContract_1 = await ethers.provider.getBalance(fundMe.target)
    //第一个账户向所部署的合约发送的个数，在已部署的合约查询到的总数额
    console.log(`已部署合约地址的余额是 ${balanceOfContract_1}`)
    //4.查询第二个合约账户
    const fundTX_2 = await fundMe.connect(secondAcount).fund({value: ethers.parseEther("0.01")})
    await fundTX_2.wait()
    //5.检查合约余额
    const balanceOfContract_2 = await ethers.provider.getBalance(fundMe.target)
    //第二个账户向所部署的合约发送的个数，在已部署的合约查询到的总数额
    console.log(`已部署合约地址的余额是 ${balanceOfContract_2}`)
    //6.检查mapping是否更新 fundersToAmount
    const firstAcountbalanceInFundMe = await fundMe.fundersToAmount(firstAmount.address)
    const secondAcountbalanceInFundMe = await fundMe.fundersToAmount(secondAcount.address)
    console.log(`第一个账户在合约中的存款总额是： ${firstAcountbalanceInFundMe}`)
    console.log(`第二个账户在合约中的存款总额是： ${secondAcountbalanceInFundMe}`)
})

module.exports = {}