//import ethers.js      引入ethers.js包
//create main function   创建主函数
    /*
        //1.初始化2个账户
        //2.查询第一个合约账户
        //3.检查合约余额
        //4.查询第二个合约账户
        //5.检查合约余额
        //6.检查mapping是否更新 fundersToAmount
    */
//execute main function   执行主函数


//通过js脚本进行部署


const { ethers } = require("hardhat")

async function main() {
    //创建合约工厂    await关键字是表示执行完当前的才执行下一个  然后就需要加async  表示异步函数
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("合约正在部署")
    //通过工厂部署合约  部署需要时间 所以需要await
    const fundMe = await fundMeFactory.deploy(180)

    //等待合约部署完成入块
    await fundMe.waitForDeployment()
    //打印日志
    //console.log("合约部署成功，合约地址是" + fundMe.target);
    console.log(`合约部署成功，合约地址是 ${fundMe.target}`);
    
    
    // 在 scripts/deployFundMe.js 顶部添加
    console.log("当前链 ID:", hre.network.config.chainId);
    console.log("ETHERSCAN_API_KEY 是否存在:", !!process.env.ETHERSCAN_API_KEY);
    //可能存在合约部署完成在连上，但是etherscan还没有写到自己的输出里 然后调用浏览器的api进行验证，由于浏览器还没有存，可能就显示是个空合约
    //避免这个问题就是多等待几个区块多验证,通过合约拿到部署的交易等待5个区块再去验证
    //验证合约
    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
        console.log("sepolia网络,等待5个区块确认")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target,[180])
    }else{
        console.log("本地网络，验证已跳过")
    }

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
}
 
//把验证的部分抽成一个函数
async function verifyFundMe(fundMeAddr,args){
    //配置脚本验证合约
    //hre运行时环境
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [args],
    });
} 

main().then().catch((error) => {
    console.error(error)
    process.exit(0)
})