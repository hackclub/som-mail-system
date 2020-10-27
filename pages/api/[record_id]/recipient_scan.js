// This should input a "record_id", & update the airtable record's
// "Recipient Scanned At" field with the current time

export async function setRecipientScan(record_id) {
  const endpoint = `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?authKey=${process.env.AIRBRIDGE_TOKEN}`
  const rawRecords = await fetch(endpoint, {
    method: "PATCH",
    body: {
      id: record_id,
      fields: {
        "Recipient Scanned At": Date.now()
      }
    }
  })
  const parsedRecords = await rawRecords.json()
  const record = parsedRecords[0]
  return record
}

export default async (req, res) => {
  const { record_id } = req.query;
  if (!record_id || record_id === undefined) {
    return res.status(404).json({ status: 404, error: "missing record ID" });
  }
  const record = await setRecipientScan(record_id)
  res.json(record)
}
