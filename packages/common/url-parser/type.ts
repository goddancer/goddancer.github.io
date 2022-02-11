import { URL_FILEDS } from './const'

export type URL_FILEDS_TYPE = typeof URL_FILEDS[number]
export type parsedObjProps = Record<URL_FILEDS_TYPE, string>