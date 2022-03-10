import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './styles/index.less';
import 'codemirror/mode/javascript/javascript.js';
import { writeOutput, formatOutput } from './utils/console-utils.js';
import { getEl } from './utils/el.js';
import * as d3 from 'd3';

const DEFAULT_CODE_TEXT = `console.log('hola CodeMirror');`;
let CodeMirrorInstance = null;
function initCodeMirror() {
  const { editorEl } = getEl();

  return new Promise((resolve) => {
    setTimeout(() => {
      CodeMirrorInstance = CodeMirror.fromTextArea(editorEl, {
        mode: 'javascript',
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        undoDepth: 5,
        tabindex: 0,
      });
      resolve();
    }, 0);
  });
}
export function setCode(codeStr) {
  CodeMirrorInstance && CodeMirrorInstance.setValue(codeStr);
}
export function setCodeTitle(str) {
  const { liveEl } = getEl();
  liveEl.querySelector('header h4').innerHTML = str;
}
function initConsole() {
  const clog = console.log;
  const cerr = console.error;
  console.error = function (t) {
    writeOutput(t);
    cerr.apply(console, arguments);
  };
  console.log = function (...t) {
    const formated = t.map((it) => formatOutput(it));
    writeOutput(formated.join(' '));
    clog.apply(console, t);
  };
}
function initListener() {
  const { executeEl, resetEl, consoleCodeEl, toggleEl, iframeEl } = getEl();

  executeEl.addEventListener(
    'click',
    function () {
      consoleCodeEl.textContent = '';
      const activeCode = CodeMirrorInstance.getDoc().getValue();
      consoleCodeEl.classList.add('fade-in');
      try {
        new Function(activeCode)();
      } catch (t) {
        consoleCodeEl.textContent = 'Error: ' + t.message;
      }
      consoleCodeEl.addEventListener(
        'animationend',
        function () {
          consoleCodeEl.classList.remove('fade-in');
        },
        false
      );
    },
    false
  );
  resetEl.addEventListener(
    'click',
    function () {
      window.location.reload();
    },
    false
  );
  toggleEl.addEventListener(
    'click',
    function () {
      if (!iframeEl) {
        toggleEl.remove();
        return;
      }
      const _codeMirrorEl = document.querySelector('.CodeMirror');
      if (parseInt(iframeEl.style.height) > 400) {
        _codeMirrorEl.style.height = '200px';
        iframeEl.style.height = '400px';
      } else {
        _codeMirrorEl.style.height = '400px';
        iframeEl.style.height = '600px';
      }
    },
    false
  );
}
export function initData() {
  const { iframeEl } = getEl();
  const urlObj = new URL(window.location.href);
  const query = new URLSearchParams(urlObj.search);
  let _title = '',
    _code = DEFAULT_CODE_TEXT;
  if (iframeEl) {
    iframeEl.getAttribute('title') && (_title = iframeEl.getAttribute('title'));
    iframeEl.textContent &&
      (_code = iframeEl.textContent
        .trim()
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&'));
  }
  !_title && (_title = query.get('title'));
  _title && setCodeTitle(_title);
  setCode(_code);
}
function setFromAttribute() {
  const { iframeEl } = getEl();
  const _fontSize = iframeEl.getAttribute('font-size');
  _fontSize &&
    (document.querySelector('.CodeMirror').style.fontSize = `${parseFloat(
      _fontSize
    )}px`);
}
export function init() {
  window.d3 = d3;
  initConsole();
  initCodeMirror().then(() => {
    initListener();
    initData();
    setFromAttribute();
  });
}
init();
