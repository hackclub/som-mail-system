// This page should first load up the data for the SOM record from airtable,
// then if the "Recipient Uploaded At" is empty, include instructions for uploading with the file picker,
// or if not empty, include instruction saying "image successfully posted in #packages"

// It should post to "api/recipient_scan" with the "record_id" when the page loads

// It should show a file_picker that will post to "api/recipient_upload" with
// the "record_id" and "file"

function RecipientScanPage() {
  return <div>Loading...</div>
}

export default RecipientScanPage