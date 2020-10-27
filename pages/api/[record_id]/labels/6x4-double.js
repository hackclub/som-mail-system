import { jsPDF } from "jspdf"
import { getRecordById } from ".."

async function imageFromUrl(url) {

  const res = await fetch(url)
  const blob = await res.blob()
  const buff = new Buffer(await blob.arrayBuffer())

  return 'data:' + res.headers.get('content-type') + ';base64,' + buff.toString('base64')

}
async function generateLabel(record) {
  const doc = new jsPDF({
    orientation: "landscape",
    format: "letter",
    unit: "in"
  })
  // border for the 2 sides
  // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#rect
  doc.setLineWidth(0.01)
  doc.rect(1.25,1.375,4,6)
  doc.rect(11-4-1.25,1.375,4,6)

  doc.setFontSize(40)
  doc.text("Hello world!", 1.25, 1+1.375)
  doc.text(record.id, 10, 20)

  // get QR code and add to image
  const recipientQrImage = await imageFromUrl(record.fields['Recipient QR Code'])
  const qrCodes = {}
  await Promise.all([
    imageFromUrl(record.fields['Recipient QR Code']).then(img =>
      qrCodes.recipient = img),
    imageFromUrl(record.fields['Node Master QR Code']).then(img =>
      qrCodes.nodeMaster = img),
  ])
  doc.addImage(qrCodes.recipient, null, 1.25, 1.375, 1, 1)
  doc.addImage(qrCodes.nodeMaster, null, 11-1, 8.5-1.375, 1, 1)

  return doc.output()
}

export default async (req, res) => {
  const { record_id } = req.query
  const record = await getRecordById(record_id, true)
  if (!record) {
    return res.status(404).end()
  }

  const label = await generateLabel(record)
  res.setHeader('Content-Type','application/pdf')

  res.send(Buffer.from(label, 'binary'))
}