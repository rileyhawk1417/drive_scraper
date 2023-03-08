import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import GetGDrive from './api.js'
import { open } from 'lmdb';
import { addImg, getImg } from './db.js'

const DB = open({ path: 'img-db', compression: true })
const couples = 'https://drive.google.com/drive/folders/1uwxeLdxCGsBmMOgTue9qiKz2iFu3hWv9?usp=sharing'
const CORS = cors()
const app: Express = express()
const PORT = process.env.PORT || 5000

app.use(CORS)
app.use(express.json())
app.get('/data', (req: Request, res: Response) => {
  let reply = loadData()
  res.setHeader('Content-type', 'application/json')
  res.send(JSON.stringify(reply))
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
  } finally {
    res.setHeader('Content-type', 'application/json')
    res.send(JSON.stringify(results))
  }
}

)

app.listen(PORT, () => {
  console.log(`Server runnning on PORT: ${PORT}`)
})

const getURL = async (url: string) => {
  try {
    const res = await GetGDrive(url, true)
    DB.put('key', { key: res })
  }
  catch (e) {
    console.log(e)
  }
}

const loadData = async () => {
  try {
    let reply = DB.get('key').key
    return reply
  }
  catch (e) {
    console.log(e)
  }
}
//
