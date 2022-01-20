import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
import './styles'

const imageViewer = new Viewer(document.querySelector('body'), {
  viewed() {
    // some case will zoom the image into a bigger size
    viewer.zoomTo(1);
  },
})
console.log('imageViewer: ', imageViewer);