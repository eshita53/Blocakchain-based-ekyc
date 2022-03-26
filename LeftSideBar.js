import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useRouter } from 'next/router';
const { SubMenu } = Menu;

const { Sider } = Layout;

export default function LeftSideBar() {

  const router = useRouter();

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        //   bottom: 0,
        //  // width:200,
      }}
    >
      <h2 className="logo"> eKyc </h2>
      {/* defaultSelectedKeys={['1']} */}
      <Menu theme="dark" mode="inline" style={{}}>
        <Menu.Item key="1" icon={<UserOutlined />} onClick={() => router.push('/register')}>
          Register
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={() => router.push('/login')}>
          Login
        </Menu.Item>

        <SubMenu key="sub" icon={<HomeOutlined />} title="Home">
            {/* <Menu.Item key="sub1" onClick={() => router.push('/accountDetails')}>Account Details</Menu.Item> */}
            <Menu.Item key="sub2" onClick={() => router.push('/moneyTransfer')}>Money Transfer</Menu.Item>
            <Menu.Item key="sub3"onClick={() => router.push('/loanRequest')}>Loan Request</Menu.Item>
          
          </SubMenu>

        {/* <Menu.Item key="3" icon={<HomeOutlined />} onClick={() => router.push('/home')}>
          Home
        </Menu.Item> */}
        <Menu.Item key="4" icon={<LoginOutlined />} onClick={() => router.push('/logout')}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
