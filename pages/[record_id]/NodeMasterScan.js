/*
 * This page needs to post the record_id to the api endpoint
 * "api/node_master_scan", then show a "success" message
 */

import { Container, Heading, Image, Button, Link } from 'theme-ui'
import { setNodeMasterScan } from '../api/[record_id]/node_master_scan'

function RecipientScanPage(props) {
  return (
    <Container
      sx={{
        paddingTop: '60px',
        paddingBottom: '60px',
        textAlign: 'center',
        width: '90%',
        maxWidth: '500px!important'
      }}
    >
      <Image
        src="https://cloud-firx16aou.vercel.app/0som.svg"
        sx={{ marginBottom: '20px' }}
      />

      <Heading
        as="h1"
        sx={{
          fontSize: '',
          maxWidth: '400px',
          margin: 'auto',
          marginBottom: '20px'
        }}
      >
        We're all set!
      </Heading>
      <p>You've just scanned the package for {props.record.fields['Name']}! Go ahead and ship it out once you're ready. </p>
      <p>🙌 Thank you for being awesome!</p>
      <p></p>
      
    </Container>
  )
}

export default RecipientScanPage

export async function getServerSideProps(context) {
  const scanned = await setNodeMasterScan(context.params.record_id)
  console.log(scanned)
  const record = await fetch(
    'https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?select=' +
      JSON.stringify({
        filterByFormula: `{Record ID} = "${context.params.record_id}"`
      })
  ).then(r => r.json())
  return { props: { record: record[0] } }
}
