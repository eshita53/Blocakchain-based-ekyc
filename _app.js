import 'antd/dist/antd.css';
import '../styles/globals.css';

import { Layout, Menu, Breadcrumb } from 'antd';
import LeftSideBar from "../components/LeftSideBar.js";


const { Header, Content, Footer, Sider } = Layout;
// import {
//   HomeOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
//   LoginOutlined,
// } from '@ant-design/icons';


function MyApp({ Component, pageProps }) {
  return (
    // <Layout className="site-layout" style={{ marginLeft: 200 }}>
    //  <LeftSideBar/>
    //   {/* <Layout> */}
    //     <Header className="site-layout-sub-header-background" style={{ padding: 0}} />
    //     <Content style={{ margin: '24px 16px 0'}}>
    //       <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}> 
    <Layout>
      {/* <Layout className="site-layout" style={{ marginLeft: 200 }}> */}
      <Header className="header">
        {/* <div className="logo"/>  */}
        <Menu theme="dark" mode="horizontal" style={{
          //  overflow: 'auto',
          //   height: '100%',
          //position: 'fixed',
          // paddingLeft: 70,
          // top: 0,
          // bottom: 0,
          //  // width:200,
        }} >
          {/* <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item> */}
        </Menu>
      </Header>
      <Layout>
        <LeftSideBar />
        {/* <Layout style={{ padding: '0 16px 24px' }}> */}
          <Content style={{ margin: '24px 16px 0px', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 280, margin: 0 }}>
              {/*-----*/}
              <Component {...pageProps} />
          
        
          Content
              {/*-----*/}
            </div>
          </Content>
      {/* ///  </Layout> */}
      </Layout>
      {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
    </Layout>
  )
}
export default MyApp
//


