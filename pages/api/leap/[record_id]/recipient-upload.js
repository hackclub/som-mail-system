// This should input a "record_id" & "file", & update the airtable record's
// "Recipient Uploaded At" field with the current time & the "Recipient Scan"
// field with the "file"

// Then it should post the "file" in #packages (see #packages for examples)

async function postInSlack({channel, messageText, attachImageByUrl, thread}) {
    const endpoint = 'https://hooks.zapier.com/hooks/catch/507705/oq8mtti/'
    const body = {
        zapierAuthToken: process.env.ZAPIER_TOKEN || 'auth-token',
        channel,
        messageText,
        attachImageByUrl,
        thread,
      }
    return await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }
  
  async function imgToCDN(url) {
    const upload = await fetch('https://cdn.hackclub.com/api/v1/new', {
      method: 'POST',
      body: JSON.stringify([url])
    }).then(d => d.json())
    .catch(err => {
      console.error(err)
    })
    return upload[0]
  }
  
  export async function setRecipientUpload(record_id, tmp_image_url) {
    const cdn_url = await imgToCDN(tmp_image_url)
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
              url: cdn_url
            }],
          'Uploaded Image URL (CDN)': cdn_url
          
        }
      })
    })
    return await rawRecords.json()
  }
  
  export async function postInPackages(packageRecord) {
    return await postInSlack({
      channel: 'C14D3AQTT',
      messageText: `${packageRecord.fields['Name']} just received an Orpheus Leap!`,
      attachImageByUrl: packageRecord.fields['Recipient Uploads'][0]['url']
    })
  }
  
  export default async (req, res) => {
    const { record_id, image_url } = req.query
    if (!record_id || record_id === undefined) {
      return res.status(404).json({ status: 404, error: 'missing record ID' })
    }
  
    // Set the record straight! (Upload the image to Airtable)
    const packageRecord = await setRecipientUpload(record_id, image_url)
    await postInPackages(packageRecord)
  
    res.send(packageRecord)
  }
  