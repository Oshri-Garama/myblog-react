export const fromHTMLtoString = (htmlData) => {
  let parsedData = `${htmlData.replace(/<\/p>/g, '\n')}`
  parsedData = `${parsedData.replace(/<.*>|<\/.*>/g, '')}`
  parsedData = `${parsedData.replace(/&nbsp;/g, ' ')}`
  console.log('*begin', parsedData, 'end***')
  return parsedData
}
