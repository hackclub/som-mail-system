import { jsPDF } from "jspdf"
import { getRecordById } from ".."

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

  return doc.output()
}

export default async (req, res) => {
  const { record_id } = req.query
  const record = await getRecordById(record_id)
  if (!record) {
    return res.status(404).end()
  }

  const label = await generateLabel(record)
  res.setHeader('Content-Type','application/pdf')
  res.send(Buffer.from(label))
}