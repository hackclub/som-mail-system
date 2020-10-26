// This should input a "record_id", & update the airtable record's
// "Recipient Scanned At" field with the current time


export default async (req, res) => {
  const { record_id } = req.query
  if (!record_id || record_id === undefined) {
    return res.status(404).json({ status: 404, error: "missing record ID" })
  }

  const record = await setRecipientScan(record_id)
}
