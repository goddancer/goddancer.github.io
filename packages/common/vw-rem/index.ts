import { configProps } from './type'

const getMatchValue = (content: string | undefined | null, key: string): number | boolean => {
  if (!content) {
    return false
  }
  const _matched = content.match(new RegExp(`${key}=([\\d\\.]+)`, 'i'))
  return !!_matched && Math.abs(parseInt(_matched[1]))
}
function getConfig(): configProps {
  const _vwRemEl = document.querySelector('meta[name="vw-rem"]')
  const _veRemElContent = _vwRemEl?.getAttribute('content')
  return {
    baseCell: (getMatchValue(_veRemElContent, 'base-cell') || 10) as number,
    uiWidth: (document.documentElement.getBoundingClientRect().width || 375) as number,
    minWidth: (getMatchValue(_veRemElContent, 'min-width') || 320) as number,
    maxWidth: (getMatchValue(_veRemElContent, 'max-width') || 540) as number,
  }
}
export function px2rem(px: number): number {
  const { uiWidth, baseCell } = getConfig()
  const _baseFontSize = uiWidth / baseCell
  return px / _baseFontSize
}
function initVwRem() {
  const { uiWidth, baseCell, minWidth, maxWidth } = getConfig()
  const _baseFontSize = uiWidth / baseCell
  const _styleEl = document.createElement('style')
  _styleEl.appendChild(document.createTextNode(`
    html {
      font-size: ${_baseFontSize}px;
    }
    body {
      max-width: ${baseCell}rem;
      margin: 0 auto;
    }
    @media screen and (max-width: ${minWidth}px) {
      html {
        font-size: ${_baseFontSize * minWidth / uiWidth}px;
      }
    }
    @media screen and (min-width: ${maxWidth}px) {
      html {
        font-size: ${_baseFontSize * maxWidth / uiWidth}px;
      }
    }
  `))
  document.head.appendChild(_styleEl)
}
initVwRem()