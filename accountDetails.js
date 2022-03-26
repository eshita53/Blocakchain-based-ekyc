
import useUser from "../lib/useUser";
//import '../styles/Home.module.css';

// import { Table, Tag, Space } from 'antd';
import { Descriptions, Badge } from 'antd';

export default function accountDetails() {

    useUser({redirectTo: '/login', redirectIfFound: false})
 //   useUser({ redirectTo: '/home', redirectIfFound: true })
    // const columns = [
    //     {
    //       title: 'Name',
    //       dataIndex: 'name',
    //       key: 'name',
    //       render: text => <a>{text}</a>,
    //     },
    //     {
    //       title: 'Age',
    //       dataIndex: 'age',
    //       key: 'age',
    //     },
    //     {
    //       title: 'Address',
    //       dataIndex: 'address',
    //       key: 'address',
    //     },
    //     {
    //       title: 'Tags',
    //       key: 'tags',
    //       dataIndex: 'tags',
    //       render: tags => (
    //         <>
    //           {tags.map(tag => {
    //             let color = tag.length > 5 ? 'geekblue' : 'green';
    //             if (tag === 'loser') {
    //               color = 'volcano';
    //             }
    //             return (
    //               <Tag color={color} key={tag}>
    //                 {tag.toUpperCase()}
    //               </Tag>
    //             );
    //           })}
    //         </>
    //       ),
    //     },
    //     {
    //       title: 'Action',
    //       key: 'action',
    //       render: (text, record) => (
    //         <Space size="middle">
    //           <a>Invite {record.name}</a>
    //           <a>Delete</a>
    //         </Space>
    //       ),
    //     },
    //   ];
      
    //   const data = [
    //     {
    //       key: '1',
    //       name: 'John Brown',
    //       age: 32,
    //       address: 'New York No. 1 Lake Park',
    //       tags: ['nice', 'developer'],
    //     },
    //     {
    //       key: '2',
    //       name: 'Jim Green',
    //       age: 42,
    //       address: 'London No. 1 Lake Park',
    //       tags: ['loser'],
    //     },
    //     {
    //       key: '3',
    //       name: 'Joe Black',
    //       age: 32,
    //       address: 'Sidney No. 1 Lake Park',
    //       tags: ['cool', 'teacher'],
    //     },
    //   ];
      
    return (

     //   <Table columns={columns} dataSource={data} />
     <Descriptions title="User Info" bordered style={{paddingLeft: 160}}>
     <Descriptions.Item label="Name">Cloud Database</Descriptions.Item>
     <Descriptions.Item label="Nid">Prepaid</Descriptions.Item>
     <Descriptions.Item label="Account Number">YES</Descriptions.Item>
     <Descriptions.Item label="Balance">2018-04-24 18:00:00</Descriptions.Item>
     <Descriptions.Item label="Account creation Time" >
       2019-04-24 18:00:00
     </Descriptions.Item>

   </Descriptions>
       
    )
}