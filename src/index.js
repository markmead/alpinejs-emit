import { handleData } from './handleData'

export default function (Alpine) {
  Alpine.magic('emit', () => (targetEl, newData = {}) => {
    const emitPairs = Array.isArray(targetEl) ? targetEl : [[targetEl, newData]]

    emitPairs.forEach((emitPair) => {
      // Strings are iterable, so a flat array of selectors would destructure
      // into single characters and throw on querySelectorAll.
      if (!Array.isArray(emitPair)) {
        return
      }

      const [elTarget, elData = {}] = emitPair

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
