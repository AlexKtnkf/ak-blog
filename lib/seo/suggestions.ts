interface SEOSuggestion {
  type: 'warning' | 'info' | 'error'
  message: string
}

export function analyzeSEO(content: {
  title: string
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: string
  }
  blocks: Array<{ type: string; content: string }>
}): SEOSuggestion[] {
  const suggestions: SEOSuggestion[] = []

  // Meta title checks
  if (!content.seo.metaTitle) {
    suggestions.push({
      type: 'error',
      message: 'Meta title is missing',
    })
  } else {
    const titleLength = content.seo.metaTitle.length
    if (titleLength < 30) {
      suggestions.push({
        type: 'warning',
        message: 'Meta title is too short (recommended: 30-60 characters)',
      })
    } else if (titleLength > 60) {
      suggestions.push({
        type: 'warning',
        message: 'Meta title is too long (recommended: 30-60 characters)',
      })
    }
  }

  // Meta description checks
  if (!content.seo.metaDescription) {
    suggestions.push({
      type: 'error',
      message: 'Meta description is missing',
    })
  } else {
    const descLength = content.seo.metaDescription.length
    if (descLength < 120) {
      suggestions.push({
        type: 'warning',
        message: 'Meta description is too short (recommended: 120-160 characters)',
      })
    } else if (descLength > 160) {
      suggestions.push({
        type: 'warning',
        message: 'Meta description is too long (recommended: 120-160 characters)',
      })
    }
  }

  // OG Image check
  if (!content.seo.ogImage) {
    suggestions.push({
      type: 'warning',
      message: 'Social sharing image is missing',
    })
  }

  // Content analysis
  const textContent = content.blocks
    .filter((block) => block.type === 'text')
    .map((block) => block.content)
    .join(' ')
    .replace(/<[^>]*>/g, '') // Remove HTML tags

  // Word count
  const wordCount = textContent.split(/\s+/).length
  if (wordCount < 300) {
    suggestions.push({
      type: 'info',
      message: 'Content might be too short for good SEO (recommended: 300+ words)',
    })
  }

  // Keyword density (if meta title is available)
  if (content.seo.metaTitle) {
    const mainKeyword = content.seo.metaTitle
      .toLowerCase()
      .split(/\s+/)
      .slice(0, 2)
      .join(' ')
    const keywordRegex = new RegExp(mainKeyword, 'gi')
    const keywordCount = (textContent.match(keywordRegex) || []).length
    const density = (keywordCount / wordCount) * 100

    if (density < 0.5) {
      suggestions.push({
        type: 'info',
        message: 'Main keyword density might be too low',
      })
    } else if (density > 2.5) {
      suggestions.push({
        type: 'warning',
        message: 'Main keyword density might be too high (possible keyword stuffing)',
      })
    }
  }

  return suggestions
} 