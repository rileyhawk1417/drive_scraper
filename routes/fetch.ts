import GetGDrive from './api.js'

let reg = new RegExp(/['*.jpg', '*.png']/g)

export const getURL = async (url: string) => {
  //NOTE: Blurhash, base64 needs actual image data
  //WARN: Does not work well with googles custom file links
  try {
    let content: any = []
    let subFolder: any = {};
    let root: any = {};
    const res = await GetGDrive(url, true)
    return res;
    /*
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
    let reply = 'Hi'
    //let reply = DB.get('org').org
    return reply
  }
  catch (e) {
    console.log(e)
  }
}

export const ReturnData = async (res: any, req: any) => {
  try {
    let reply = await loadData()
    res.statusCode = 200
    res.setHeader('Content-type', 'application/json')
    res.send(JSON.stringify(reply))
  } catch (e) {
    res.statusCode = 500
    res.send(JSON.stringify('Failed to fetch data'))
  }
}

export const QueryData = async (res: any, req: any) => {
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
