import { makeInstall } from '@itzhi-ui/utils'
import components from './components'
import '@itzhi-ui/theme/index.css'

const installer = makeInstall(components)

export * from '@itzhi-ui/components'
export default installer
