import text from './test.text'
import './styles'
// import '@/styles/vw-rem'
import '@/utils/vw-rem'

window.onload = function () {
  document.body.innerHTML += text
}