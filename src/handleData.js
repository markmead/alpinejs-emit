export function handleData(targetEl, newData) {
  const foundEl =
    typeof targetEl === 'object' ? targetEl : document.querySelector(targetEl)
  const alpineEl = Alpine.$data(foundEl)

  Object.keys(newData).forEach((dataKey) => {
    alpineEl[dataKey] =
      newData[dataKey] === '!!'
        ? (alpineEl[dataKey] = !alpineEl[dataKey])
        : newData[dataKey]
  })
}
