import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Divider,Form, Input } from 'antd';
import DTable from '../../components/table/Table'
import DForm from '../../components/form/Form'
import Abi from '../../data/KovanTodoABI.json';


// let account1='0x47fc1f87f03BD419430101dF411684bBC8be7Ff6';
// let providerUrl='https://kovan.infura.io/v3/0950a6ac14b845f1a36b4f975b59a1fe';
let contractAddress='0xf98C51E06C34FDE938B4EDCf305a79556083E2c7';


   const connection = async () =>{
    let web3
    // 实例化web3
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
          // window.ethereum.enable().then(function() {});
          window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(function() {})
          .catch((error) => {
            if (error.code === 4001) {
              // EIP-1193 userRejectedRequest error
              console.log('Please connect to MetaMask.');
            } else {
              console.error(error);
            }
          });
      } catch (e) {}
  } else if (window.web3) {
      web3 = new Web3(web3.currentProvider);
  } else {
      alert('You have to install MetaMask !');
  }
  return web3;
  }
  // INFURA
  // const initWeb3 = () => {
  //   let web3;
  //   if (typeof web3 !== 'undefined') {
  //      web3 = new Web3(web3.currentProvider);
  //      console.log('web3',"undefine")
  //  } else {
  //      web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  //  }
  //   return web3;
  // }

  // 获取合信息
  const getContract = async () => {
    console.log('Abi',Abi);
    // let web3 = initWeb3();
    let web3 = await connection();
    let contract = new web3.eth.Contract(Abi,contractAddress);
    console.log('contract methods',contract.methods)
    return contract;
  }


  // 读取TaskCount
  async function getTaskCount() {
    let contract = await getContract();
    let count = await contract.methods.taskCount().call();
    return count;
  }

  // 创建任务
  async function createTask (account1,context) {
    let contract = await getContract();
    return new Promise((resolve, reject) => {
     contract.methods.createTask(context).send({from: account1}).on('transactionHash', function(hash){
      console.log("hash:", hash);
      resolve({"hash":hash});
     })
      .on('error', function(error, receipt) { // 如果交易被网络拒绝并带有交易收据，则第二个参数将是交易收据。
        console.log('error',error)
        reject({"hash": false});
      });
    })
  }

  // 完成任务
  async function toggleCompleted (account1,id) {
    console.log('account1',account1)
    let contract = await getContract();
    return new Promise((resolve, reject) => {
      contract.methods.toggleCompleted(id).send({from: account1}).on('transactionHash', function(hash){
        console.log("hash:", hash);
        resolve({"hash":hash});
      })
      .on('error', function(error, receipt) { // 如果交易被网络拒绝并带有交易收据，则第二个参数将是交易收据。
        console.log('error11:',error)
       reject({"hash": false});
      });
    })
  }
   


export default class TodoList extends Component {
   constructor(props) {
    super(props);
    // 任务数据
    this.state = {
      tdata: [],
      taskId: 1,
      taskCount: 0,
      account: 'Loading ·····',
      balance: 0,
      hashList: []
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({taskId: event.target.value});
  }

  // 读取账号信息
  async getAccount() {
    let web3= await connection();
    console.log(web3);
    var accounts = await web3.eth.getAccounts();
    // web3.eth.getAccounts().then((e)=>{console.log(e)})
    // 取第一个账户
    var myAccount = accounts[0];
    console.log(myAccount, 1);
    // 返回指定地址账户的余额
    var balance = await web3.eth.getBalance(myAccount);
    console.log('balance',balance)
    this.setState({
      account: myAccount,
      balance: balance
    })
  }
  // 在组件已经被渲染到 DOM 中后运行
  async componentDidMount() {
    await this.getAccount();
    let contract = getContract();
    console.log('methods:',contract.methods);
    let taskCount= await getTaskCount();
    this.setState({
      taskCount: taskCount
    })
  }

  render() {
    // 读取任务详细
    const getTasks = async () => {
      // 获取文本框id
      let contract = await getContract();
      let taskResult = await contract.methods.tasks(this.state.taskId).call();
      console.log('task',taskResult)
      let taskData =[{
        key: taskResult.id,
        content: taskResult.content,
        completed: taskResult.completed.toString(),
        id: taskResult.id,
      }]
      // 查询 count
      let taskCount= await getTaskCount();
      this.setState({
        tdata: taskData,
        taskCount: taskCount
      })
      console.log('taskStatte',this.state)
      return taskResult;
    }

    // 刷新TaskCount事件
    const refreshTaskCount = async () => {
      let taskCount= await getTaskCount();
      this.setState({
        taskCount: taskCount
      })
    }


    // 创建任务事件
    const doCreateTask = async (content) => {
      let hash = await createTask(this.state.account,content);
      let tmpList=this.state.hashList;
      tmpList.push(hash)
      this.setState({
        hashList: tmpList
      })
      await this.getAccount();
    }

    const doCompleted = async (id) => {
      let hash = await toggleCompleted(this.state.account,id);
      let tmpList=this.state.hashList;
      console.log(hash)
      tmpList.push(hash)
      this.setState({
        hashList: tmpList
      })
      // 刷新钱包
      await this.getAccount();
    }

    return (
    <div>
          <h1>
            欢迎，这里是todo-list {this.state.title}
          </h1>
          <Divider orientation="left">Wallet</Divider>
          <Form
              name="customized_form_controls"
              layout="inline"
            >
              <Form.Item
                name="account"
              >
                {`Account: ${this.state.account}`}
              </Form.Item>
          
              <Form.Item
              name="balance"
              >{`Balance: ${this.state.balance}`}</Form.Item>
          </Form>
          <Divider orientation="left">Action</Divider>
          <DForm taskCreate={doCreateTask} toggleCompleted={doCompleted}></DForm>
          <Divider orientation="left">Hash</Divider>
            {
                this.state.hashList.map((data,index) => {
                    return (
                        <li key={index}>{data.hash}</li>
                    )
                })
            }
          <Divider orientation="left">Task Infomation -- Count ({this.state.taskCount})</Divider>
          <Form
              name="customized_form_controls"
              layout="inline"
            >
              <Form.Item
              >
              TaskCount: {this.state.taskCount}
              </Form.Item>
              <Form.Item>
              <Button  onClick={()=>refreshTaskCount()} type="primary" >
                  refresh
            </Button>
              </Form.Item>
            </Form>
            <Divider></Divider>
          <Form
              name="customized_form_controls"
              layout="inline"
            >
              <Form.Item
                name="taskId"
                label="taskId"
              >
                <Input
                  type="text"
                  value={this.state.taskId} 
                  onChange={this.handleChange} 
                  style={{
                    width: 100,
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={()=>getTasks()} type="primary" >
                  query
                </Button>
              </Form.Item>
            </Form>
          <DTable data={this.state.tdata}></DTable>
      </div>
    )

  }
}
