
import { Button } from 'antd';
// import './home.css';
import React, { Component } from 'react';

import Web3 from 'web3';

import DTable from '../../components/table/Table'

import Cdata from '../../data/TodoList.json';



export default class Home extends Component {

 constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
    console.log(this.state);
  }

  initWeb3 = () => {
    let web3;
    // // Instantiate new web3 global instance
    // if (typeof window !== 'undefined' && // Check we're on the client-side
    //         (typeof window.web3 === 'undefined' ||
    //         typeof window.web3.currentProvider === 'undefined')) {
    //   window.web3 = new Web3('ws://127.0.0.1:7545');
    // }

    // // Instantiate new web3 local instance
    // if (typeof window !== 'undefined' && // Check we're on the client-side
    //   typeof window.web3 !== 'undefined' &&
    //   typeof window.web3.currentProvider !== 'undefined') {
    //   web3 = new Web3(window.web3.currentProvider);
    // }

    if (typeof web3 !== 'undefined') {
       web3 = new Web3(web3.currentProvider);
       console.log("undefine")
   } else {
       // set the provider you want from Web3.providers
       web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
   }
    
    return web3;
  }

  getAbi = (web3) => {
    // let abi = [{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"str","type":"string"}],"name":"setData","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"data","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    // let address = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
    // let data = new web3.eth.Contract(abi,address);
    console.log(Cdata);
    let contract = new web3.eth.Contract(Cdata.abi,'0x67a068179889167F4Ea9010A4f4D1418f7A6ebC2');
    return contract;
  }

  // ??????TaskCount
  async getTaskCount(contract) {
    let myValue = await contract.methods.taskCount().call();
    console.log("the num is: ",myValue);
    return myValue
  }

  // ????????????
  async createTask (contract,context,account) {
    return new Promise((resolve, reject) => {
     contract.methods.createTask(context).send({from: account}).on('transactionHash', function(hash){
      console.log("hash:", hash);
      resolve({"hash":hash});
     })
      .on('error', function(error, receipt) { // ??????????????????????????????????????????????????????????????????????????????????????????
       reject({"hash": false});
      });
    })
  }

  // ????????????
  async toggleCompleted (contract,id,account) {
    return new Promise((resolve, reject) => {
      contract.methods.toggleCompleted(id).send({from: account}).on('transactionHash', function(hash){
        console.log("hash:", hash);
        resolve({"hash":hash});
      })
      .on('error', function(error, receipt) { // ??????????????????????????????????????????????????????????????????????????????????????????
       reject({"hash": false});
      });
    })
  }

  // ??????????????????
  async getTasks(contract,id) {
    let data = await contract.methods.tasks(id).call();
    console.log("the task is: ",data);
    return data
  }



  // ??????????????????????????? DOM ????????????
  async componentDidMount() {
    // let fromAddr='0x67a068179889167F4Ea9010A4f4D1418f7A6ebC2';
    let account='0x94BDff4D6B3Ae6Efdf37fc05FB79AF2b4F247F74';
    let web3=this.initWeb3();
    web3.eth.defaultAccount = web3.eth.accounts[0];
    console.log('accounts',web3.eth.accounts[0])
    console.log('web3',web3);
    let contract=this.getAbi(web3);
    console.log(contract.methods);
    let togResult = await this.toggleCompleted(contract,2,account);
    console.log('togResult',togResult);
    let num = await this.getTaskCount(contract);
    console.log('hhhh',num)
    let tasks = await this.getTasks(contract,2);
    console.log('task',tasks)    
  }
  componentWillUnmount() {
  }

  
  
  

  render() {
    return (
      <div>
          <h1>
            ??????????????????todo-list
          </h1>
          <Button type="primary">??????task</Button>
          <DTable></DTable>
      </div>
    )
  }
}
