export function handleData(Alpine, targetEl, newData) {
  const alpineData = Alpine.$data(targetEl)

  Object.keys(newData).forEach((dataKey) => {
    alpineData[dataKey] =
      newData[dataKey] === '!!' ? !alpineData[dataKey] : newData[dataKey]
  })
}
