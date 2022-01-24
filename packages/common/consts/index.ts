import UrlParser from '../url-parser'

// @ts-ignore
export const QUERY = UrlParser.parse().values
export const LANG = QUERY.lang || 'zh-hans'
