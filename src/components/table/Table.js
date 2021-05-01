import { Table} from 'antd';
import React, { Component } from 'react';

const columns = [
  {
    title: 'TaskId',
    dataIndex: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Content',
    className: 'column-money',
    dataIndex: 'content',
    align: 'left',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Completed',
    dataIndex: 'completed',
    render: text => <a>{text}</a>,
  },
];

// const data = [
//   {
//     key: '1',
//     id: '1',
//     content: 'hello blockchain',
//     completed: 'false',
//   }
// ];

export default class DTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }
  //props发生变化时触发
  componentWillReceiveProps(props) {
    console.log('监测变化',props)
    this.setState({
      data: props.data
    });
  }

    render() {
      return (
        <div>
            <Table
              columns={columns}
              dataSource={this.state.data}
              bordered
          />
        </div>
      )
    }
  }
  