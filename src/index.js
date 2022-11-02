export default function (Alpine) {
  Alpine.magic('emit', (el, { Alpine }) => (targetEl, newData) => {
    // Pass query selector
    // Find elements
    // Get data
    // Change data based on options

    const foundEl = document.querySelector(targetEl)

    const alpineEl = Alpine.$data(foundEl)

    Object.keys(newData).forEach((dataKey) => {
      alpineEl[dataKey] = newData[dataKey]
    })
  })
}

// document.addEventListener('alpine:init', () => {
//   Alpine.magic('manage', () => (xRef) => {
//       const targetEl = document.querySelector(`[x-ref="${xRef}"]`)
//       if (!targetEl) {
//           return
//       }
//       return Alpine.$data(targetEl)
//   })
// })
