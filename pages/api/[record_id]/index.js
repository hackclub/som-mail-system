import { getLeastPopularDino } from "../least-popular-dino"

export async function getRecordById(record_id, withAuth=false) {
  const options = {
    maxRecords: 1,
    filterByFormula: `RECORD_ID()='${record_id}'`
  }
  let baseUrl = 'https://api2.hackclub.com/v0.1/SOM Sticker Requests/Sticker Requests'
  let endpoint = `${baseUrl}?select=${JSON.stringify(options)}`
  if (withAuth) {
    endpoint += `&authKey=${process.env.AIRBRIDGE_TOKEN}`
  }
  const rawRecords = await fetch(endpoint)
  const parsedRecords = await rawRecords.json()
  let record = parsedRecords[0]
  if (!record.fields['Artwork'] && withAuth) {
    // Don't have any artwork? Oh no! Let's assign it
    const patchUrl = `${baseUrl}?authKey=${process.env.AIRBRIDGE_TOKEN}`
    const artworkId = await getLeastPopularDino()
    const rawUpdatedRecord = await fetch(patchUrl, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: record_id,
        fields: {
          'Artwork': [artworkId]
        }
      })
    })
    const updatedRecord = await rawUpdatedRecord.json()
    record = updatedRecord
  }
  return record
}

export default async (req, res) => {
  const { record_id } = req.query
  if (!record_id || record_id === undefined) {
    return res.status(404).json({ status: 404, error: "missing record ID" })
  }

  const record = await getRecordById(record_id)

  res.json(record)
}