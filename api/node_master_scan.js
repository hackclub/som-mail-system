// This should input a "record_id", & update the airtable record's
// "Node Master Scanned At" field with the current time

module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  })
}
