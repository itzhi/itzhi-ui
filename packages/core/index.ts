import { makeInstall } from '@itzhi-ui/utils'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import components from './components'
import '@itzhi-ui/theme/index.css'

library.add(fas)
const installer = makeInstall(components)

export * from '../components'
export default installer
