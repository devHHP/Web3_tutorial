const { ethers } = require("hardhat")
const { assert } = require("chai")

describe("测试funme合约", async function () {
    //it就是单元测试
    it("测试owner是否是mag.sender", async function(){
        //定义第一个账户
        const [firstAmount] = await ethers.getSigners()

        //通过ethers创建fundMe的合约工厂，通过合约工厂创建fundMe合约对象
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        //通过工厂部署合约对象
        const fundMe = await fundMeFactory.deploy(180)
        //工厂发送部署合约但不代表立马完成。需要等待部署完成
        await fundMe.waitForDeployment()

        //比较owner是否是mag.sender，就是比较地址是否相同
        //assert.equal(actual, expected) 是断言函数
        assert.equal((await fundMe.owner()), firstAmount.address)
    }) 

    //第二个测试 测试dataFeed的值与0x694AA1769357215DE4FAC081bf1f309aDC325306是否相同
    it("测试dataFeed的值与0x694AA1769357215DE4FAC081bf1f309aDC325306是否相同", async function(){
       
        //通过ethers创建fundMe的合约工厂，通过合约工厂创建fundMe合约对象
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        //通过工厂部署合约对象
        const fundMe = await fundMeFactory.deploy(180)
        //工厂发送部署合约但不代表立马完成。需要等待部署完成
        await fundMe.waitForDeployment()

        //比较owner是否是mag.sender，就是比较地址是否相同
        //assert.equal(actual, expected) 是断言函数
        assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })

})