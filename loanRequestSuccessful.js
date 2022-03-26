
import useUser from "../lib/useUser";
//import '../styles/Home.module.css';

import {
    Row,
    Col,
    Tabs,
    Menu,
    Breadcrumb,

} from 'antd';
import { Content } from "antd/lib/layout/layout";
const { TabPane } = Tabs;
const { SubMenu } = Menu;
export default function Home() {

    //useUser({redirectTo: '/login', redirectIfFound: false})
    useUser({ redirectTo: '/home', redirectIfFound: true })
    // state = {
    //     current: 'mail',
    //   };

    //   handleClick = e => {
    //     console.log('click ', e);
    //     this.setState({ current: e.key });
    //   };
    return (

        <Row> 
        <Col span={8} offset={6}><h2>Thank you foe requesting a loan. Bank will notify you for further information. </h2> </Col>
   </Row>
        // <div className="card-container" style={{  paddingLeft: 160}} >

        // <Tabs type="card" centered>
        //         <TabPane tab="Account Details" key="1">
        //             <p>Content of Tab Pane 1</p>
        //             <p>Content of Tab Pane 1</p>
        //             <p>Content of Tab Pane 1</p>
        //         </TabPane>
        //         <TabPane tab="Money Transfer" key="2">
        //             <p>Content of Tab Pane 2</p>
        //             <p>Content of Tab Pane 2</p>
        //             <p>Content of Tab Pane 2</p>
        //         </TabPane>
        //         <TabPane tab="Loan Request" key="3">
        //             <p>Content of Tab Pane 3</p>
        //             <p>Content of Tab Pane 3</p>
        //             <p>Content of Tab Pane 3</p>
        //         </TabPane>
        //     </Tabs>
        // </div>

    //     <Tabs defaultActiveKey="1" centered>
    //     <TabPane tab="Tab 1" key="1">
    //       Content of Tab Pane 1
    //     </TabPane>
    //     <TabPane tab="Tab 2" key="2">
    //       Content of Tab Pane 2
    //     </TabPane>
    //     <TabPane tab="Tab 3" key="3">
    //       Content of Tab Pane 3
    //     </TabPane>
    //   </Tabs>

        //  <Row>
        //  {/* <Col span={35} offset={6}> */}
    
        //  <Menu  mode="horizontal"  >
        //         <Menu.Item key="mail" >
        //             Navigation One
        //         </Menu.Item>
        //         <Menu.Item key="app" >
        //             Navigation Two
        //         </Menu.Item>
        //         <Menu.Item key="alipay">
        //             <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        //                 Navigation Four - Link
        //             </a>
        //         </Menu.Item>
        //     </Menu> 
       
        // </Row>

    )
}