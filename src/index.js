import { handleData } from './handleData'

export default function (Alpine) {
  Alpine.magic('emit', ({ Alpine }) => (targetEl, newData = false) => {
    if (typeof targetEl === 'object') {
      targetEl.forEach((elItem) => handleData(elItem[0], elItem[1]))

      return
    }

    handleData(targetEl, newData)
  })
}
