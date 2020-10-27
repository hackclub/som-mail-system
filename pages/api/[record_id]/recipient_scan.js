// This should input a "record_id", & update the airtable record's
// "Recipient Scanned At" field with the current time

<<<<<<< Updated upstream
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

async function setRecipientScan(record_id) {
  // Here is the code to
  base("Add base name").update(
    [
      {
        id: record_id,
        fields: {
          "Recipient Scanned At": new Date(),
        },
      },
    ],
    function (err, records) {
      if (err) {
        return `Error! Error! View it: ${err}`;
=======
export async function setRecipientScan(record_id) {
  const endpoint = `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Sticker%20Requests?authKey=${process.env.AIRBRIDGE_TOKEN}`
  const rawRecords = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: record_id,
      fields: {
        "Recipient Scanned At": Date.now()
>>>>>>> Stashed changes
      }
      records.forEach(function (record) {
        return record;
      });
    }
  );
}

export default async (req, res) => {
  const { record_id } = req.query;
  if (!record_id || record_id === undefined) {
    return res.status(404).json({ status: 404, error: "missing record ID" });
  }
<<<<<<< Updated upstream
  const record = await setRecipientScan(record_id);
  return record
};
=======
  const record = await setRecipientScan(record_id)
  res.json(record)
}
>>>>>>> Stashed changes
