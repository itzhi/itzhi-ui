import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createApp} from 'vue'
import {makeInstall,withInstall} from '../install.ts'

const AppComp = defineComponent({
	name: 'App',
	setup() {
		return () => <div>App</div>
	}
})

const CompA = withInstall(defineComponent({
	name: 'CompA',
	setup() {
		return () => <div>CompA</div>
	}
}))

const CompB = withInstall(defineComponent({
	name: 'CompB',
	setup() {
		return () => <div>CompB</div>
	}
}))

describe('utils/install', () => {
	it('withInstall should be worked', () => {
		const wrapper = mount(() => <div id="app"></div>)
		const app = createApp(AppComp)
		app.use(CompA).mount(wrapper.element)

		expect(CompA.install).toBeDefined()
		expect(CompB.install).toBeDefined()
		expect(app._context.components['CompA']).toBeTruthy()
		expect(app._context.components['CompB']).toBeFalsy()
	})

	it('makeInstall should be worked', () => {
		const wrapper = mount(() => <div id="app"></div>)
		const app = createApp(AppComp)
		const install = makeInstall([CompA, CompB])

		app.use(install).mount(wrapper.element)
		expect(install).toBeDefined()
		expect(app._context.components['CompA']).toBeTruthy()
		expect(app._context.components['CompB']).toBeTruthy()
	})
})
