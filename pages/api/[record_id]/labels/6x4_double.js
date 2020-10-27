import { jsPDF } from "jspdf"
import { getRecordById } from ".."
// import fetchBase64 from 'fetch-base64'
// import { blobToBase64 } from 'base64-blob'
// import FileReader from 'filereader'
// import fapi from 'file-api'
// import { File, FileReader }from 'file-api'
// import { apiResolver } from "next/dist/next-server/server/api-utils"
import { requestBase64 } from 'base64-img'

async function imageFromUrl(url) {
  // let img = new Image()
  // img.src = url
  // return img

  // const res = await fetch(url)
  // const blob = await res.blob()
  // return blobToBase64(blob)

  const res = await fetch(url)
  const blob = await res.blob()
  const buff = new Buffer(await blob.arrayBuffer())

  return 'data:' + res.headers.get('content-type') + ';base64,' + buff.toString('base64')

  // return new Promise((resolve, reject) => {
  //   requestBase64(url, (err, res, body) => {
  //     if (err) {
  //       reject(err)
  //     }
  //     resolve(body)
  //   })
  // })

  // const res = await fetch(url)
  // const blob = await res.blob()
  // const arBuf = await blob.arrayBuffer()
  // let reader = new FileReader()
  // // let File = fapi.File
  // return new Promise(resolve => {
  //   reader.onload = () => apiResolver(reader.result)
  //   // reader.readAsDataURL(new File(blob))
  //   reader.readAsArrayBuffer(arBuf)
  // })

  // console.log({url})
  // const result = await fetchBase64.remote(url)
  // console.log({result})
  // return result

  // const res = await fetch(url)
  // const blob = await res.blob()
  // const arBuf = await blob.arrayBuffer()
  // const uint8Array = new Uint8Array(arBuf.byteLength)
  // for (var i = 0; i< uint8Array.length; i++) {
  //   uint8Array[i] = arBuf[i]
  // }
  // return uint8Array
  // return {
  //   data: "data:"+blob.type+";base64,"+buf.toString('base64'),
  //   type: blob.type.substring(blob.type.lastIndexOf("/")+1)
  // }

  // const res = await fetch(url)
  // const blob = await res.blob()
  // const buf = await blob.arrayBuffer()
  // return new Promise(resolve => {
  //   const reader = new FileReader()
  //   reader.onloadend = () => resolve(reader.result)
  //   reader.readAsDataURL(blob)
  // })
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
  // console.log(recipientQrImage)
  doc.addImage(recipientQrImage, null, 0, 0, 1, 1)
  // doc.addImage({
  //   imageData: recipientQrImage,
  //   x: 1.25+0.1,
  //   y: 1.375+0.1,
  //   w: 1,
  //   h: 1,
  // })
  // doc.addImage(record.fields['Recipient QR Code'],'PNG', 1.25+0.1, 1.375+0.1, 1, 1)

  return doc.output()
  // return doc.save('test.pdf')
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