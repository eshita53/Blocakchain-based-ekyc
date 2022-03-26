
import useUser from "../lib/useUser";
import user from "../lib/user";
import useSWR from "swr";
//import '../styles/Home.module.css';

import {
    Row,
    Col,
    Tabs,
    Menu,
    Breadcrumb,

} from 'antd';
import { Content } from "antd/lib/layout/layout";
import { Descriptions, Badge } from 'antd';
const { TabPane } = Tabs;
const { SubMenu } = Menu;
const fetcher = (url) => fetch(url, {
   credentials: 'include'
  }).then(res => res.json())

export default function Home() {

   useUser({redirectTo: '/login', redirectIfFound: false})
   useUser({ redirectTo: '/home', redirectIfFound: true })
   const {data: user} = useSWR("http://localhost:8080/profile", fetcher, {
  });
 // const nid;
  // if (user){ nid = user.Nid}
  //const{response} = useSWR("http://localhost:8080/userAccountDetails?nid="+ , fetcher)
///  console.log({user ? {user.Nid} : 'loading'}});
console.log('hello from home', {user});

const { response: details} = useSWR(() => 'http://localhost:8080/userAccountDetails?nid=' + user.Nid, fetcher);
console.log('hello', {details});

      //  if(!details) return <h1>loading</h1>
        return(
        <Descriptions title="User Info" bordered style={{paddingLeft: 160}}>
        <Descriptions.Item label="Name">{ details ? <h1>{details.name} </h1> : <h1></h1>}</Descriptions.Item>
        <Descriptions.Item label="Nid"></Descriptions.Item>
        <Descriptions.Item label="Account Number">YES</Descriptions.Item>
        <Descriptions.Item label="Balance">2018-04-24 18:00:00</Descriptions.Item>
        <Descriptions.Item label="Account creation Time" >
          2019-04-24 18:00:00
        </Descriptions.Item>
   
      </Descriptions>
    )
}