export async function getRecordById(record_id, withAuth=false) {
  const options = {
    maxRecords: 1,
    filterByFormula: `RECORD_ID()='${record_id}'`
  }
  let baseUrl = 'https://api2.hackclub.com/v0.1/SOM Sticker Requests/Leaps in India'
  let endpoint = `${baseUrl}?select=${JSON.stringify(options)}`
  if (withAuth) {
    endpoint += `&authKey=${process.env.AIRBRIDGE_TOKEN}`
  }
  const rawRecords = await fetch(endpoint)
  const parsedRecords = await rawRecords.json()
  let record = parsedRecords[0]
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
