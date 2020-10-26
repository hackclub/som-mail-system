// This should input a "record_id", & update the airtable record's
// "Recipient Scanned At" field with the current time

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
  const record = await setRecipientScan(record_id);
  return record
};
