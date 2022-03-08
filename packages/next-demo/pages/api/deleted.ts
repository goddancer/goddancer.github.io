const fsp = require('fs/promises')
const path = require('path')

export default async function handler(req: any, res: any) {
  // Check for secret to confirm this is a valid request
  if (!req.query.id) { // process.env.MY_SECRET_TOKEN
    return res.status(401).json({ message: 'should specfic the articles id which will be deleted!' })
  }
  const hit = await fsp.readFile(path.resolve(__dirname, '../../../../data/del.json')).then((data: any) => {
    const dataStr = data.toString()
    const _data = JSON.parse(dataStr)
    console.log('_data.id: ', _data.id);
    console.log('req.query.id: ', req.query.id);
    return _data.id == req.query.id
  })

  try {
    console.log('hit: ', hit);
    return res.json({
      deleted: hit,
    })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}