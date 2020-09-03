export const fromHTMLtoString = (htmlData) => {
  let parsedData = `${htmlData.replace(/<\/p>/g, '\n')}`
  parsedData = `${parsedData.replace(/<.*>|<\/.*>/g, '')}`
  parsedData = `${parsedData.replace(/&nbsp;/g, ' ')}`
  parsedData = parsedData.trim()
  return parsedData
}
