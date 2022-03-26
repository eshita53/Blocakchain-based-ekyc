// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import LeftSideBar from "../components/LeftSideBar";
import { useRouter } from 'next/router';
import useUser from "../lib/useUser";
import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  DatePicker,
} from 'antd';
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";
const { Option } = Select;
export default function Register() {
  const router = useRouter();
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
  const dateFormat = 'DD-MM-YYYY';
  // function onChange(date, dateString) {
  //   console.log(date, dateString);
  // }
  const [selectDate, setSelectedDate] = useState(null)
  const RegistrationForm = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      console.log('Received values of form: ', values);
      console.log('Received values of date: ', values.dateOfBirth.format("DD-MM-YYYY"));
      const dateOfBirth = values.dateOfBirth.format("DD-MM-YYYY");
      const { name, nid, fatherName, motherName, passwordHash, gender } = values;
      const requestBody = {
        name: name,
        nid: nid,
        fatherName: fatherName,
        motherName: motherName,
        passwordHash: passwordHash,
        gender: gender,
        dateOfBirth: dateOfBirth,
      }
      //  console.log(requestBody);
      const fetch_response = await fetch('http://localhost:8080/createUser', {
        method: "POST",
        //mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        },
        body: new URLSearchParams(requestBody)
      });
      console.log(fetch_response.status);

      const privateKey = await fetch_response.text();
      console.log(privateKey);
      if (privateKey != 'cookie-found' && fetch_response.status == 200 && privateKey != 'Nid used') {
        const str2blob = txt => new Blob([txt]);

        let blob = str2blob(privateKey);

        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "privateKey.pem";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //after       
        console.log(privateKey);
        router.push('/home');
      } else if (privateKey == 'cookie-found') {
        router.push('/home');
      } else if (privateKey == 'Nid used') {
        alert('User has already created the account');
      } else {
        alert('User cant be created');
      }

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
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input your Name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
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
          name="fatherName"
          label="Father Name"
          rules={[
            {
              required: true,
              message: 'Please input your father name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="motherName"
          label="Mother Name"
          rules={[
            {
              required: true,
              message: 'Please input your mother name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="passwordHash"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: 'Please select gender!',
            },
          ]}
        >
          <Select placeholder="select your gender">
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Date Of Birth"

          rules={[
            {
              required: true,
              message: 'Please select your date of birth!',
            },
          ]}
        >
          {/* <DatePicker
            onChange={(value, e) => this.onFinish(value, e)}
            selected={this.state.inputValue} otherProps={here}
          /> */}
          <DatePicker picker="date" format={dateFormat} />
          {/* <DatePicker format={(DateTimeFormatter.ofPattern("dd-MM-yyy"))} /> */}
          {/* <DatePicker 
          selected = {selectDate} onClick ={ date => setSelectedDate=(date)}
          dateFormat = 'DD-MM-YYYY'
          /> */}
          {/* const date = datepicker.getValue().format(DateTimeFormatter.ofPattern("dd-MM-yyy")); */}

        </Form.Item>


        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Row>
      <Col span={8} offset={8}>
        <RegistrationForm />
      </Col>
    </Row>

  )
}

// 
