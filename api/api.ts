
import got from 'got'

const bodyRegex = new RegExp(/\["([\d\w-]+?)",\["[\d\w-]+?"\],"(.+?)","(.+?)"/gi)

async function GetGDrive(url: string, browse?: boolean) {
  const gDrive = 'https://drive.google.com/drive/folders/'

  if (!url.includes('http')) {
    url = gDrive + url + "?usp=sharing"
  }

  const req = await got(url)
  const text = req.body
  const drive: any = []
  let res: any;

  while ((res = bodyRegex.exec(text)) != null) {
    const isFolder = res[3] == 'application/vnd.google-apps.folder';
    const type = isFolder ? 'folder' : 'image' || 'video';
    if (!drive.find((e: any) => e.id == res[1]) && (res[3].includes('folder') || res[3].includes('image') || res[3].includes('video'))) {
      drive.push({
        id: res[1],
        name: res[2],
        realType: res[3],
        type: type,
        url: isFolder ? `${gDrive}/${res[1]}` :
          `http://drive.google.com/uc?type=view&id=${res[1]}`
      })
    }
  }

  if (browse) {
    let folders = drive.filter((e: any) => e.type == 'folder')
    while (folders && folders.length > 0) {
      let content: any = [];
      for (const folder of folders) {
        const folderDrive = await GetGDrive(folder.id)
        folder.content = folderDrive
        content = content.concat(folderDrive)
      }
      folders = content.filter((e: any) => e.type == 'folder')
    }
  }
  return drive;
}

export default GetGDrive

