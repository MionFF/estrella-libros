export const stripHtmlTags = (html: string): string => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

export const cleanCategories = (categories: string[] | undefined): string[] => {
  if (!categories || !Array.isArray(categories)) return []

  return categories
    .map(cat => stripHtmlTags(cat))
    .map(cat => {
      const parts = cat.split('/')
      return parts[0].trim()
    })
    .filter(cat => cat.length > 0)
    .filter((cat, index, self) => self.indexOf(cat) === index)
    .slice(0, 3)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
