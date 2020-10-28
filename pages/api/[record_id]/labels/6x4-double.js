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

  const imgs = {}
  await Promise.all([
    imageFromUrl('https://cloud-ncs8fqr6s.vercel.app/0pixil-frame-0.png').then(img =>
      imgs.stampPlaceholder = img),
    imageFromUrl(record.fields['Recipient QR Code']).then(img =>
      imgs.recipientQr = img),
    imageFromUrl(record.fields['Node Master QR Code']).then(img =>
      imgs.nodeMasterQr = img),
  ])

  // border for the 2 sides
  // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#rect
  doc.setLineWidth(0.01)

  // outside label
  // stamp outline
  doc.setLineWidth(0.01)
  doc.rect(11-1.25-0.5-0.125,1.375+0.125,0.6375,0.6375)
  doc.addImage(imgs.stampPlaceholder, null, 11-1.25-0.5-0.125,1.375+0.125,0.6375,0.6375)
  // outside qr code
  doc.addImage(imgs.nodeMasterQr, null, 11-1.375-4+0.25, 8.5-1.375-0.25-0.125, 0.5, 0.5)
  doc.setFontSize(8)
  doc.text([
    record.fields['Name'],
    'Summer of Making Stickers',
    record.id
  ].join("\n"), 11-1.375-4+0.25 + 0.5 + 0.125, 8.5-1.375-0.25)
  // return address
  let returnAddress = [
    'Hack Club',
    '15 Falls Road',
    'Shelburne, VT 05482'
  ]
  if (record.fields['Country Dropdown'] != 'United States of America (US)') {
    returnAddress.push('United States of America')
  }
  doc.setFontSize(8)
  doc.text(returnAddress.join("\n"), 11-1.375-4+0.25 + 0.125, 1.375+0.25)
  // recipient address
  let recipientAddress = [
    record.fields['Name'],
    record.fields['Combined Address For Geocoding']
  ]
  doc.setFontSize(12)
  doc.text(recipientAddress.join("\n"), 11-1.375-4+1.25, 1.375+3)



  // recipient sleeve
  doc.addImage(imgs.recipientQr, null, 1.25+0.125, 1.375+0.125, 0.5, 0.5)
  doc.setFontSize(8)
  doc.text([
    record.fields['Name'],
    'Summer of Making Stickers',
    record.id,
    record.fields['Comment']
  ].join("\n"), 1.25+0.125+0.5+0.1, 1.375+0.25)
  doc.setFontSize(20)
  doc.text("<-- scan this with your phone camera", 1.25+0.125, 0.75+1.375, null, -90)

  // label sheet border (not on one of the peel-able labels)
  doc.addImage(imgs.nodeMasterQr, null, 11-1.1, 0.1, 1, 1)
  doc.setFontSize(8)
  doc.text([
    record.fields['Name'],
    'Summer of Making Stickers',
    record.id,
    record.fields['Country Dropdown'],
    record.fields['Comment']
  ].join("\n"), 11-0.25, 1+0.25, null, -90)

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