// This page should first load up the data for the SOM record from airtable,
// then if the "Recipient Uploaded At" is empty, include instructions for uploading with the file picker,
// or if not empty, include instruction saying "image successfully posted in #packages"

// It should post to "api/recipient_scan" with the "record_id" when the page loads

// It should show a file_picker that will post to "api/recipient_upload" with
// the "record_id" and "file"

import { useState } from 'react';
import { Container, Heading, Image, Button, Link } from 'theme-ui'
import { getRecordById } from '../api/[record_id]';
import { setRecipientScan } from '../api/[record_id]/recipient-scan'

async function fileToTmpReq(file) {
  const formData = new FormData()
  formData.append('input_file', file, 'image' + '.png')
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

  const blobURL = imageRequest?.headers?.get('X-Final-Url')?.replace('download', 'dl')
  return blobURL
}

function RecipientScanPage(props) {
  const [status, setStatus] = useState("default")

  const buttonColor = {
    error: '#8492a6',
    loading: '#ff8c37',
    success: '#33d6a6',
  }[status]
  const buttonText = {
    default: "Share a picture!",
    error: "Oh no! Try again?",
    loading: "Loading...",
    success: "Shared!",
  }[status]

  const uploadPhotos = async (e, record_id) => {
    setStatus("loading")
    const fileData = e.target.files[0]
    const tempFileUrl = await fileToTmpReq(fileData)
    if (!tempFileUrl) {
      setStatus("error")
      return
    }

    const updatedRecord = await fetch(`/api/${record_id}/recipient-upload?image_url=${tempFileUrl}`)

    if (!updatedRecord) {
      setStatus("error")
      return
    }

    setStatus("success")
  }

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
      <Button id="input-file-label-button" sx={{
        backgroundColor: buttonColor
      }}>
        <label htmlFor={status == 'success' ? null : "file-upload"} className="custom-file-upload" id="input-file-label-text">
          {buttonText}
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

export async function getServerSideProps(props) {
  const { record_id } = props.params
  const results = {}
  await Promise.all([
    setRecipientScan(record_id),
    getRecordById(record_id, true).then(rec => results.record = rec)
  ])
  return { props: { record: results.record } }
}
