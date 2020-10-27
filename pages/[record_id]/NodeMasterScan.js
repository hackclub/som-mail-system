import Layout from '../../components/Layout'
import { setNodeMasterScan } from '../api/[record_id]/node_master_scan'
/* 
 * This page needs to post the record_id to the api endpoint
 * "api/node_master_scan", then show a "success" message
 */

function NodeMasterScanPage({record}) {
  if (record && record.fields) {
    return <Layout>You've just scanned the package for {record.fields['Name']}!</Layout>
  } else {
    return <Layout>loading...</Layout>
  }
}
export default NodeMasterScanPage

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({params}) {
  const record = await setNodeMasterScan(params.record_id)
  return { props: { record } }
}