import React, { useState } from 'react';
//import useUser from "../lib/useUser";
import LeftSideBar from "../components/LeftSideBar";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  DatePicker,
} from 'antd';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';
const { Option } = Select;
export default function moneyTransfer() {
  //useUser({ redirectTo: '/home', redirectIfFound: true });
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const MoneyTransferForm = () => {

    const [form] = Form.useForm();


    // useUser({redirectTo: '/', redirectIfFound: true})
    const router = useRouter();
    const onFinish = async (values) => {
      console.log('Received values of form: ', values);
      const { user2AccountNumber, amountToTransfer } = values;
      //  useUser({redirectTo: '/', redirectIfFound: true})
      const requestBody = {
        user2AccountNumber: user2AccountNumber,
        amountToTransfer: amountToTransfer,
      }
      const fetch_response = await fetch('http://localhost:8080/moneyTransfer', {
        method: "POST",
      //  mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
        headers: {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        },
        body: new URLSearchParams(requestBody)
      });
      console.log(fetch_response);
      const data = await fetch_response.text();
      console.log(data)
     if (data == 'successful') {
        router.push('/sendMoneySuccessful');
      } else if (data == 'Unsuccessful') {
        alert('Insufficent Money');
      } else {
        alert('There has been Error. Please  try again!!!');
      }
      ///   console.log(data)
      // if (data != 'OK') {
      //   alert('Wrong NID number or password');
      // }
      //  else if (data == 'OK') {
      //     router.push('/home');
      // } 
    };
    return (
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="user2AccountNumber"
          label="AccountNumber"
          rules={[
            {
              required: true,
              message: 'Please input the account number to send money',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="amountToTransfer"
          label="Amount"
          rules={[
            {
              required: true,
              message: 'Please input how much money you want to send',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Send Money
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Row>
      {/* //  <Row justify="space-around" align="middle"> */}
      <Col span={8} offset={8} >
        < MoneyTransferForm/>
      </Col>
    </Row>

  )
}
