
import * as allIcons from '@yh/icons-svg/lib/dist'

const outLineIconList = []
for (const key in allIcons) {
  if (allIcons[key].theme === 'outline') {
    outLineIconList.push(allIcons[key].name)
  }
}
export {
  outLineIconList,
}
