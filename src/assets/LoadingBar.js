import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false, // Hide the loading spinner
  trickleSpeed: 100 // Speed of progress bar updates
})

export default NProgress
