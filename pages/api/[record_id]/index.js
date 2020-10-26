export async function getRecordById(record_id) {
  const options = {
    maxRecords: 1,
    filterByFormula: `RECORD_ID()='${record_id}'`
  }
  const endpoint = `https://api2.hackclub.com/v0.1/SOM Sticker Requests/Sticker Requests?select=${JSON.stringify(options)}`
  const rawRecords = await fetch(endpoint)
  const parsedRecords = await rawRecords.json()
  const record = parsedRecords[0]
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