// This should input a "record_id" & "file", & update the airtable record's
// "Recipient Uploaded At" field with the current time & the "Recipient Scan"
// field with the "file"

// Then it should post the "file" in #packages (see #packages for examples)

module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  })
}
