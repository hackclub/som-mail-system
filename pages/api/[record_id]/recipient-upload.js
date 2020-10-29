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

export async function setRecipientUpload(record_id, image_url) {
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
  return await rawRecords.json()
}

async function getArtwork(recordId) {
  const options = {
    maxRecords: 1,
    filterByFormula: `RECORD_ID()='${recordId}'`
  }
  const endpoint = `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Artwork?select=${JSON.stringify(options)}&authKey=${process.env.AIRBRIDGE_TOKEN}`
  const rawRecords = await fetch(endpoint)
  const parsedRecords = await rawRecords.json()
  const record = parsedRecords[0]
  return record
}

async function getArtworkUsage(artworkRecordId) {
  const options = {
    filterByFormula: `AND({Recipient Uploads},{Record ID (from Artwork)}='${artworkRecordId}')`
  }
  const endpoint = `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?select=${JSON.stringify(options)}&authKey=${process.env.AIRBRIDGE_TOKEN}`
  const rawRecords = await fetch(endpoint)
  const parsedRecords = await rawRecords.json()
  return parsedRecords.length
}

async function notifyArtist(packageRecord, artworkRecord) {
  const artworkUsage = await getArtworkUsage(artworkRecord.id)
  // first, check the number of times the art has been sent
  if (artworkUsage == 1) {
    return await postInSlack({
      channel: 'C14D3AQTT',
      messageText: `Hey <@${artworkRecord.fields['Artist Slack ID']}>! The first package with your art on it just reached ${packageRecord.fields['Name']}`,
    })
  }
  return
}

export async function postInPackages(packageRecord, artworkRecord) {
  return await postInSlack({
    channel: 'C14D3AQTT',
    messageText: `${packageRecord.fields['Name']} just received a SoM Envelope from HQ (with art by ${artworkRecord.fields['Artist Name']})`,
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
  const artworkRecord = await getArtwork(packageRecord.fields['Artwork'][0])

  await Promise.all([
    postInPackages(packageRecord, artworkRecord), // Make sure to post in the packages channel once done!
    notifyArtist(packageRecord, artworkRecord), // notify the artist their work is out in the world!
  ])

  res.send(packageRecord)
}
