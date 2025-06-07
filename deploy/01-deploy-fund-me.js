//方式一
/*
    function deployFunction() {
    console.log("这是一个部署函数")
    }

    module.exports.default = deployFunction
*/

//方式二简化
/*
module.exports = async (hre) => {
    //常用的两个函数
    const getNamedAccounts = hre.getNamedAccounts （） //获取账户
    const deployments = hre.deployments  //部署合约
    //又可以简化写成
    const {deployments, getNamedAccounts} = hre 
    console.log("这是一个部署函数")
}
*/

//方式三
module.exports = async ({deployments, getNamedAccounts}) => {
    const firstAccount  = (await getNamedAccounts()).firstAccount //获取账户
    const {deploy} = await deployments  //从deployments 对象中提取 deploy 方法，用于部署合约   const deploy  = (await getNamedAccounts()).deploy

    //部署合约,设置详细参数
    await deploy("FundMe",{
        from: firstAccount,  //使用哪个账户部署合约
        args: [180],
        log: true,
        waitConfirmations: 1  //等待一个区块确认后再继续执行
    })
}

//设置部署脚本的标签，用于匹配是否执行  fixture匹配all，就执行所有带all标签的合约，匹配fundme就只执行fundme合约
module.exports.tags = ["all", "fundme"]