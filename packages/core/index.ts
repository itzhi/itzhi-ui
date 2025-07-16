import { makeInstall } from '@itzhi-ui/utils'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import components from './components'
import printLogo from './printLogo.ts'
import '@itzhi-ui/theme/index.css'

printLogo()
library.add(fas)
const installer = makeInstall(components)

export * from '@itzhi-ui/components'
export default installer
