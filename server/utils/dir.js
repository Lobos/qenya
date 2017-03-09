import fs from 'fs'

export function mkDir (path) {
  if (typeof path === 'string') path = [path]
  path.forEach(p => {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  })
}
