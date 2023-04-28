module.exports = function groupBy (array, key) {
    return array.reduce((acc, item) => ({
      ...acc,
      [item[key]]: [...(acc[item[key]] ?? []), item],
    }),
  {})
}