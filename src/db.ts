import { open } from 'lmdb';

const db = open({ path: 'img-db', compression: true })

export const addImg = (img: any, key: string) => {
  db.put(key, { key: img })
}

export const getImg = (key: any) => {
  db.get(key)
}
