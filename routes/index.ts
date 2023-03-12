import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import GetGDrive from './api.js'
import { open } from 'lmdb';
import sharp from 'sharp'
import { encode, decode } from 'blurhash'

const DB = open({ path: 'img-db', compression: true })
const couples = 'https://drive.google.com/drive/folders/1uwxeLdxCGsBmMOgTue9qiKz2iFu3hWv9?usp=sharing'
const CORS = cors()
const app: Express = express()
const PORT = process.env.PORT || 5000

const handler = (res, req) => {
  res.status(200).end('Server OK')
}

app.use(CORS)
app.use(express.json())
app.get('/data', async (req: Request, res: Response) => {
  try {
    let reply = await loadData()
    res.statusCode = 200
    res.setHeader('Content-type', 'application/json')
    res.send(JSON.stringify(reply))
  } catch (e) {
    res.statusCode = 500
    res.send(JSON.stringify('Failed to fetch data'))
  }
})

// Include function  to post
app.post('/fetch', async (req, res) => {
  let results: any = {}
  try {
    let query = req.body
    await getURL(query.url)
    let data = await loadData()
    results.data = data
    results.success = true
  } catch (e) {
    console.log(e)
    res.statusCode = 500
  } finally {
    res.statusCode = 200
    res.setHeader('Content-type', 'application/json')
    res.send(JSON.stringify(results))
  }
}

)

app.listen(PORT, () => {
  console.log('Server is up and runnning :)')
})

let reg = new RegExp(/['*.jpg', '*.png']/g)

const getURL = async (url: string) => {
  //NOTE: Blurhash, base64 needs actual image data
  //WARN: Does not work well with googles custom file links
  try {
    let content: any = []
    let subFolder: any = {};
    let root: any = {};
    const res = await GetGDrive(url, true)
    res.map((val: any) => {
      if (res.type == 'folder') {
        subFolder.img = res.url
        subFolder.name = res.name
        content.push({ subFolder })
      }
      else {
        root.img = res.url
        root.name = res.name
        content.push({ root })
      }
    })
    DB.put('org', { org: res })
    DB.put('key', { key: content })

    /*
    let db: any = []
    let values: any = {}
    res.map(async (imgs: any) => {
      if (imgs.type == 'folder') {
        if (imgs.name.match(/\.[a-z]+$/i)) {
          values.name = imgs.name
          values.hash = await blur(imgs.url)
          db.push({ values })
        }
      }
      else {

        if (imgs.name.match(/\.[a-z]+$/i)) {
          values.name = imgs.name
          values.hash = await blur(imgs.url)
          db.push({ values })
        }
      }
    })
    console.log(values)
    */
    //DB.put('key', { key: db })
  }
  catch (e) {
    console.log(e)
  }
}

const loadData = async () => {
  try {
    let reply = DB.get('key').key
    //let reply = DB.get('org').org
    return reply
  }
  catch (e) {
    console.log(e)
  }
}

export default handler
