import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import GetGDrive from './routes/api.js'
import { open } from 'lmdb';
import sharp from 'sharp'
import { ReturnData, QueryData } from './routes/fetch.js'

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
  ReturnData(res, req)
})

// Include function  to post
app.post('/fetch', async (req, res) => {
  QueryData(res, req)
})

app.listen(PORT, () => {
  console.log('Server is up and runnning :)')
})

app.get('/', (req: Request, res: Response) => {
  res.status(200).end('Servers running and is 200')
  res.send('Index page for the server')
})

export default handler
