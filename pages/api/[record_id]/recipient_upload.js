// This should input a "record_id" & "file", & update the airtable record's
// "Recipient Uploaded At" field with the current time & the "Recipient Scan"
// field with the "file"

// Then it should post the "file" in #packages (see #packages for examples)

export async function setRecipientUpload(record_id, image_url) {}

export default async (req, res) => {
  const { record_id, image_url } = req.query
  if (!record_id || record_id === undefined) {
    return res.status(404).json({ status: 404, error: 'missing record ID' })
  } else {
    const endpoint = `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?authKey=${process.env.AIRBRIDGE_TOKEN}`
    const rawRecords = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: record_id,
        fields: {
          'Recipient Uploads': [
            {
              url: image_url
            }
          ]
        }
      })
    })
    const record = await rawRecords.json()
    res.send(record)
  }
}
