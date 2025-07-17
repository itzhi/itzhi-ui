import type {Plugin} from 'vue'
import {describe, expect, it} from 'vitest'
import {ZIcon, ZButton, ZButtonGroup} from '../index'
import {map, get} from 'lodash-es'

const comps = [ZIcon, ZButtonGroup, ZButton] as Plugin[]

describe('components/index', () => {
	it.each(map(comps, (c) => [get(c, 'name')??'', c]))('%s should be exported', (_, component) => {
		expect(component).toBeDefined()
		expect(component.install).toBeDefined()
	})
})
