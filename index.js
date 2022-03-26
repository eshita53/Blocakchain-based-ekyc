
import useUser from "../lib/useUser";

export default function Home() {

   // useUser({redirectTo: '/login', redirectIfFound: false})
    useUser({redirectTo: '/home', redirectIfFound: true})

    return (
        <div>Loading</div>
    )
}

// import Layout from '../components/layout'
// import NestedLayout from '../components/nested-layout'

// export default function Page() {
//   return {
//     /** Your content */
//   }
// }

// Page.getLayout = function getLayout(page) {
//   return (
//     <Layout>
//       <NestedLayout>{page}</NestedLayout>
//     </Layout>
//   )
// }