import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import GetGDrive from './routes/api.js'
import sharp from 'sharp'
import { getURL } from './routes/fetch.js'


const couples = 'https://drive.google.com/drive/folders/1uwxeLdxCGsBmMOgTue9qiKz2iFu3hWv9?usp=sharing'
const CORS = cors()
const app: Express = express()
const PORT = process.env.PORT || 5000

app.use(CORS)
app.use(express.json())
app.get('/data', async (req: Request, res: Response) => {
  res.send('Ya nothing to see here')
})

// Include function  to post
app.post('/fetch', async (req, res) => {
  try {

    let data = await getURL(req.body.url)
    if (data != null) {
      res.statusCode = 200
      res.send(JSON.stringify(data))
    } else {
      res.statusCode = 500
      res.send('Error Fetching Data')
    }
  } catch (e) {
    console.log(e)
  }
})

app.listen(PORT, () => {
  console.log('Server is up and runnning :)')
})

app.get('/', (req: Request, res: Response) => {
  res.send('Index page for the server')
})

