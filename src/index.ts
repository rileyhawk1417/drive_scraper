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

const res = await GetGDrive(couples, true)
DB.put('key', { key: res })
let reply = DB.get('key').key
app.use(CORS)
app.get('/data', (req: Request, res: Response) => {
  res.send(reply)
})

app.listen(PORT, () => {
  console.log(`Server runnning on PORT: ${PORT}`)
})

//
