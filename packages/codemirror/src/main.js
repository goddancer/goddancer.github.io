import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import './styles/index.less'
import 'codemirror/mode/javascript/javascript.js'
import { writeOutput, formatOutput } from './utils/console-utils.js'
import { getEl } from './utils/el.js'

const DEFAULT_CODE_TEXT = `console.log('hola CodeMirror');`;
let CodeMirrorInstance = null;
function initCodeMirror() {
  const { editorEl } = getEl();

  return new Promise((resolve) => {
    setTimeout(() => {
      CodeMirrorInstance = CodeMirror.fromTextArea(editorEl, {
        mode: "javascript",
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        undoDepth: 5,
        tabindex: 0,
      });
      resolve();
    }, 0)
  })
}
export function setCode(codeStr) {
  CodeMirrorInstance && CodeMirrorInstance.setValue(codeStr);
}
export function setCodeTitle(str) {
  const { liveEl } = getEl();
  liveEl.querySelector('header h4').innerHTML = str
}
function initConsole() {
  const clog = console.log;
  const cerr = console.error;
  console.error = function(t) {
    writeOutput(t);
    cerr.apply(console, arguments)
  }
  console.log = function(...t) {
    const formated = t.map(it => formatOutput(it))
    writeOutput(formated.join(' '));
    clog.apply(console, t);
  }
}
function initListener() {
  const { executeEl, resetEl, consoleCodeEl } = getEl();

  executeEl.addEventListener('click', function () {
    consoleCodeEl.textContent = '';
    const activeCode = CodeMirrorInstance.getDoc().getValue();
    consoleCodeEl.classList.add("fade-in");
    try {
      new Function(activeCode)();
    } catch (t) {
      consoleCodeEl.textContent = "Error: " + t.message;
    }
    consoleCodeEl.addEventListener("animationend", function() {
      consoleCodeEl.classList.remove("fade-in")
    }, false)
  }, false);
  resetEl.addEventListener('click', function () {
    window.location.reload();
  }, false);
}
export function initData() {
  const { iframeEl } = getEl();
  const urlObj = new URL(window.location.href);
  const query = new URLSearchParams(urlObj.search);
  let _title = '', _code = DEFAULT_CODE_TEXT;
  if (iframeEl) {
    iframeEl.getAttribute('title') && (_title = iframeEl.getAttribute('title'));
    iframeEl.textContent && (_code = iframeEl.textContent.trim().replaceAll('&gt;', '>'));
  }
  (!_title) && (_title = query.get('title'));
  _title && setCodeTitle(_title);
  setCode(_code);
}
export function init() {
  getEl();
  initConsole();
  initCodeMirror().then(() => {
    initListener();
    initData();
  });
}
init()