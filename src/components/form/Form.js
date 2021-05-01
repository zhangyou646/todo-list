import React, { useState, Component } from 'react';
import { Form, Input, Button, Divider } from 'antd';




export default class DTable extends Component {
    constructor(props) {
        super(props);
        console.log('form',this.props)
        this.state = {
            content: 'default say hello world!',
            id: 1
          };
        this.handleChangeContent = this.handleChangeContent.bind(this);
        this.handleCompleted = this.handleCompleted.bind(this);
      }

      handleChangeContent(event) {
        this.setState({content: event.target.value});
      }

      handleCompleted(event) {
        this.setState({id: event.target.value});
      }
      
    render() {


          const onCreateTask = () =>{
            console.log('获取content:',this.state.content)
            this.props.taskCreate(this.state.content);
          }

          const onCompleted = () =>{
            console.log('获取content:',this.state.id)
            this.props.toggleCompleted(this.state.id);
          }


          return (
            <Form
              name="customized_form_controls"
              layout="inline"
            >
              <Form.Item
                name="context"
                label="context"
              >
                  <Input
                  type="text"
                  value={this.state.content} 
                  onChange={this.handleChangeContent} 
                  style={{
                    width: 100,
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={()=>onCreateTask()} type="primary">
                  createTask
                </Button>
              </Form.Item>
              <Divider/>
              <Form.Item
                name="taskId"
                label="taskId"
              >
                <span>
                    <Input
                        type="text"
                        value={this.state.id}
                        onChange={this.handleCompleted}
                        style={{
                        width: 100,
                        }}
                    />
                    </span>
              </Form.Item>
              <Form.Item>
                <Button onClick={()=>onCompleted()} type="primary">
                  toggleComplted
                </Button>
              </Form.Item>
            </Form>
          );
    }
  }
