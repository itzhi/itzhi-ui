import {describe, expect, it} from 'vitest'

import {makeInstall,withInstall} from '../index.ts'

describe('utils/index', () => {
	it('makeInstall should be exported', () => {
		expect(makeInstall).toBeDefined()
	})
	it('withInstall should be exported', () => {
		expect(withInstall).toBeDefined()
	})
})
