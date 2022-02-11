export function getEl() {
  const _els = {
    liveEl: document.querySelector('#live'),
    editorEl: document.querySelector('#editor'),
    executeEl: document.querySelector('#execute'),
    resetEl: document.querySelector('#reset'),
    consoleEl: document.querySelector('#console'),
    consoleCodeEl: document.querySelector('#console code'),
    toggleEl: document.querySelector('#toggle'),
    iframeEl: self.frameElement,
  }
  const _elNeedNotCheck = [_els.iframeEl]
  const _elNeedCheckKeys = Object.keys(_els).filter(key => !_elNeedNotCheck.includes(_els[key]))

  if (_elNeedCheckKeys.every(key => !!_els[key])) {
    getEl = () => _els;
    return _els
  } else {
    throw new Error('[CodeMirror init]: init el err!')
  }
}