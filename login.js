import React, { useState } from 'react';
import useUser from "../lib/useUser";
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
export default function LogIn() {
  useUser({ redirectTo: '/home', redirectIfFound: true });
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

  const LogInForm = () => {

    const [form] = Form.useForm();


    // useUser({redirectTo: '/', redirectIfFound: true})
    const router = useRouter();
    const onFinish = async (values) => {
      console.log('Received values of form: ', values);
      const { nid, passwordHash } = values;

      const param = {
        nid: nid,
        passwordHash: passwordHash,
      }


      const fetch_response = await fetch('http://localhost:8080/login', {
        method:"POST",
        //mode: 'no-cors',
        cache: 'no-cache',
        withCredentials: true,
        credentials: 'include',
        headers: {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        },
        body: new URLSearchParams(param)
      });

      // const fetch_response = await fetch('http://localhost:8080/login', {
      //  mode: 'no-cors',
      //  cache: 'no-cache',
      // // withCredentials: true,
      //  credentials: 'include',
      // // headers: {
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      // },
      // body: new URLSearchParams(param)
      // });
      // const fetch_response = await fetch('http://localhost:8080/login?' + new URLSearchParams({
      //   nid: nid,
      //   passwordHash: passwordHash,
      // }) );

      //   fetch('https://example.com?' + new URLSearchParams({
      // foo: 'value',
      // bar: 2,
      // }))
      const data = await fetch_response.text();
      console.log(data)
      if (data == 'error') {
        alert('Wrong NID number or password');
      } else if (data == 'OK') {
        router.push('/home');
      } else if (data == 'cookie-found') {
        router.push('/home');
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
          name="nid"
          label="NID"
          rules={[
            {
              required: true,
              message: 'Please input your NID!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="passwordHash"
          label="Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('passwordHash') === value) {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            LogIn
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Row>
      {/* //  <Row justify="space-around" align="middle"> */}
      <Col span={8} offset={8} >
        <LogInForm />
      </Col>
    </Row>

  )
}
