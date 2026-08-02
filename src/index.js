import { handleData } from './handleData'

export default function (Alpine) {
  Alpine.magic('emit', () => (targetEl, newData = {}) => {
    const emitPairs = Array.isArray(targetEl) ? targetEl : [[targetEl, newData]]

    emitPairs.forEach(([elTarget, elData = {}]) => {
      if (!elTarget) {
        return
      }

      const foundEls =
        typeof elTarget === 'string'
          ? document.querySelectorAll(elTarget)
          : [elTarget]

      foundEls.forEach((foundEl) => {
        if (!Alpine.closestRoot(foundEl)) {
          return
        }

        handleData(Alpine, foundEl, elData)
      })
    })
  })
}
