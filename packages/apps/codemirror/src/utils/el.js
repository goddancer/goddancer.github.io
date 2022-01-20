export function getEl() {
  const liveEl = document.querySelector('#live');
  const editorEl = document.querySelector('#editor');
  const executeEl = document.querySelector('#execute');
  const resetEl = document.querySelector('#reset');
  const consoleEl = document.querySelector('#console');
  const consoleCodeEl = document.querySelector('#console code');
  const iframeEl = self.frameElement;

  if ([liveEl, editorEl, executeEl, resetEl, consoleEl, consoleCodeEl].every(el => !!el)) {
    getEl = () => ({
      liveEl,
      editorEl,
      executeEl,
      resetEl,
      consoleEl,
      consoleCodeEl,
      iframeEl,
    });
  } else {
    throw new Error('[CodeMirror init]: init el err!')
  }
}