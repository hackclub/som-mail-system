export const getLeastPopularDino = async () => {
  const options = {
    maxRecords: 1,
    sort: [{field: "Sticker Requests Count", direction: "asc"}],
    fields: []
  }
  const endpoint = `https://api2.hackclub.com/v0.1/SOM%20Sticker%20Requests/Artwork?select=${JSON.stringify(options)}`
  const rawRecord = await fetch(endpoint)
  const parsedRecord = await rawRecord.json()
  return parsedRecord[0].id
}
export default async (req, res) => {
  const id = await getLeastPopularDino()

  res.json({id})
}