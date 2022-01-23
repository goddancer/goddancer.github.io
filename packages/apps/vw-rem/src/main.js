import './styles'
import '@jico/common/vw-rem'

document.body.innerHTML += `
  <hr></hr>
  <button data-width="320px">width 320</button>
  <button data-width="375px">width 375</button>
  <button data-width="540px">width 540</button>
  <button data-width="100%">width 100%</button>
`
document.querySelector('body').addEventListener('click', function (e) {
  self.frameElement && (self.frameElement.style.width = `${e.target.getAttribute('data-width')}`)
}, false)