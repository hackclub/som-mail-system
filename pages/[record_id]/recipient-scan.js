// This page should first load up the data for the SOM record from airtable,
// then if the "Recipient Uploaded At" is empty, include instructions for uploading with the file picker,
// or if not empty, include instruction saying "image successfully posted in #packages"

// It should post to "api/recipient_scan" with the "record_id" when the page loads

// It should show a file_picker that will post to "api/recipient_upload" with
// the "record_id" and "file"

import { Container, Heading, Image, Button, Link } from 'theme-ui'
import { setRecipientScan } from '../api/[record_id]/recipient-scan'
import { setRecipientUpload } from '../api/[record_id]/recipient-upload'

async function uploadPhotos(e, record_id) {
  const fileData = e.target.files[0]
  document.getElementById("input-file-label-text").innerHTML = "Loading...";
  document.getElementById("input-file-label-button").style.backgroundColor = "#ff8c37";
  console.log('File Received:', fileData)
  const formData = new FormData()
  formData.append('input_file', fileData, 'image' + '.png')
  formData.append('max_views', 0)
  formData.append('max_minutes', 1)
  formData.append('upl', 'Upload')
  const fileURL =
    'https://cors-anywhere.herokuapp.com/https://tmpfiles.org/?upload'
  const imageRequest = await fetch(fileURL, {
    method: 'POST',
    mode: 'cors',
    body: formData
  })

  if (imageRequest.headers) {
    const blobURL = imageRequest.headers
      .get('X-Final-Url')
      .replace('download', 'dl')
    const response = await fetch(`/api/${record_id}/recipient_upload?record_id=${record_id}&image_url=${blobURL} `)
    if(response.ok){
      document.getElementById("input-file-label-text").innerHTML = "Success!";
      document.getElementById("input-file-label-button").style.backgroundColor = "#33d6a6";
      document.getElementById("input-file-label-text").htmlFor = "";
    }
    else{
      document.getElementById("input-file-label-text").innerHTML = "Oh no! Try again?";
      document.getElementById("input-file-label-button").style.backgroundColor = "#8492a6";
    }
  } else {
    console.log('error')
    document.getElementById("input-file-label-text").innerHTML = "Oh no! Try again?";
    document.getElementById("input-file-label-button").style.backgroundColor = "#8492a6";
  }
}

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
      <Link href="https://hackclub.com">
        <Image
          src="https://cloud-firx16aou.vercel.app/0som.svg"
          sx={{ marginBottom: '20px' }}
        />
      </Link>
      <Heading
        as="h1"
        sx={{
          fontSize: '',
          maxWidth: '400px',
          margin: 'auto',
          marginBottom: '20px'
        }}
      >
        Thank you for making with us this summer!{' '}
      </Heading>
      <p>
        As a small token of appreciation, we've sent you a couple of stickers!
      </p>
      {typeof props.record.fields['Recipient Uploads'] == 'undefined' ?
      <>
      <p>
        If you want, take a photo of your package to share! Make sure to cover all private details first!
      </p>
      <Button id="input-file-label-button">
        <label htmlFor="file-upload" className="custom-file-upload" id="input-file-label-text">
          Share a picture
        </label>
      </Button>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        capture="environment"
        name="file"
        style={{ display: 'none' }}
        onChange={e => uploadPhotos(e, props.record.id)}
      />
      </> : <p></p>}
    </Container>
  )
}

export default RecipientScanPage

export async function getServerSideProps(context) {
  const scanned = await setRecipientScan(context.params.record_id)
  console.log(scanned)
  const record = await fetch(
    `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?authKey=${process.env.AIRBRIDGE_TOKEN}&select=` +
      JSON.stringify({
        filterByFormula: `{Record ID} = "${context.params.record_id}"`
      })
  ).then(r => r.json())
  return { props: { record: record[0] } }
}
