const { task } = require("hardhat/config")

//task("deploy-fundme")定义task的名字
task("deploy-fundme","部署并且验证fundme合约").setAction(async(taskArgs, hre) => {
    //task实现的任务体，逻辑


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
} )

//把验证的部分抽成一个函数
async function verifyFundMe(fundMeAddr,args){
    //配置脚本验证合约
    //hre运行时环境
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [args],
    });
} 

module.exports = {}
