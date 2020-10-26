import Layout from '../../components/Layout'
import { setNodeMasterScan } from '../api/[record_id]/node_master_scan'
/* 
 * This page needs to post the record_id to the api endpoint
 * "api/node_master_scan", then show a "success" message
 */

export default function NodeMasterScanPage({record}) {
  if (record) {
    return <Layout>Success!</Layout>
  } else {
    return <Layout>error!</Layout>
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({params}) {
  return {
    props: {
      record: await setNodeMasterScan(params.record_id)
    }
  }
}