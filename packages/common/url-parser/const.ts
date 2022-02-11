import { parsedObjProps } from './type'

export const URL_FILEDS = ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol', 'search'] as const
export const PARSED_URL_OBJ = URL_FILEDS.reduce((a, c) => {
  a[c] = ''
  return a
}, {} as parsedObjProps)