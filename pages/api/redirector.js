export default async (req, res) => {
  const { record_id, page } = req.query
  res.statusCode=302
  res.setHeader('Location', `/${record_id}/${page}`)
  return res.end()
}