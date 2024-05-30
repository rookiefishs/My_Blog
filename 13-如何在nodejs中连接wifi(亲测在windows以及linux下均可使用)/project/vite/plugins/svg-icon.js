import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default function createSvgIcon (isBuild) {
  return createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/images/svg')],
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild
  })
}
