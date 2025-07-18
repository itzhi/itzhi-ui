import {describe, it, test, expect, vi} from 'vitest'
import {mount} from "@vue/test-utils"
import {withInstall} from '@itzhi-ui/utils'
import {ZButton} from "./index.ts";
import Button from "./Button.vue"
import ButtonGroup from "./ButtonGroup.vue";
import Icon from '../Icon/Icon.vue';

describe("Button.vue", () => {
	// Props: type
	it("should has the correct type class when type prop is set", () => {
		const types = ["primary", "success", "warning", "danger", "info"];
		types.forEach((type) => {
			const wrapper = mount(Button, {
				props: {type: type as any},
			});
			expect(wrapper.classes()).toContain(`z-button--${type}`);
		});
	});

	// Props: size
	it("should has the correct size class when size prop is set", () => {
		const sizes = ["large", "default", "small"];
		sizes.forEach((size) => {
			const wrapper = mount(Button, {
				props: {size: size as any},
			});
			expect(wrapper.classes()).toContain(`z-button--${size}`);
		});
	});

	// Props: plain, round, circle
	it.each([
		["plain", "is-plain"],
		["round", "is-round"],
		["circle", "is-circle"],
		["disabled", "is-disabled"],
		["loading", "is-loading"],
	])(
		"should has the correct class when prop %s is set to true",
		(prop, className) => {
			const wrapper = mount(Button, {
				props: {[prop]: true},
				global: {
					stubs: ["ZIcon"],
				},
			});
			expect(wrapper.classes()).toContain(className);
		}
	);

	it("should has the correct native type attribute when native-type prop is set", () => {
		const wrapper = mount(Button, {
			props: {nativeType: "submit"},
		});
		expect(wrapper.element.tagName).toBe("BUTTON");
		expect((wrapper.element as any).type).toBe("submit");
	});

	it.each([['withoutThrottle', false], ['withThrottle', true]])('emits click event %s', async (_, useThrottle) => {
		const clickSpy = vi.fn()
		const wrapper = mount(() => (<Button onClick={clickSpy} {...{useThrottle, throttleDuration: 400}} />))
		await wrapper.get('button').trigger('click');
		await wrapper.get('button').trigger('click');
		await wrapper.get('button').trigger('click');
		expect(clickSpy).toBeCalledTimes(useThrottle ? 1 : 3)
	})

	// Props: tag
	it("should renders the custom tag when tag prop is set", () => {
		const wrapper = mount(Button, {
			props: {tag: "a"},
		});
		expect(wrapper.element.tagName.toLowerCase()).toBe("a");
	});

	// Events: click
	it("should emits a click event when the button is clicked", async () => {
		const wrapper = mount(Button, {});
		await wrapper.trigger("click");
		expect(wrapper.emitted().click).toHaveLength(1);
	});

	// Exception Handling: Loading state
	// 应该显示加载图标，而不是发出点击事件时，按钮正在加载
	it('should display loading icon and not emit click event when button is loading', async () => {
		const wrapper = mount(Button, {
			props: {loading: true},
			global: {stubs: ["ZIcon"],}
		})
		const iconElement = wrapper.findComponent(Icon);

		expect(wrapper.find('.loading-icon').exists()).toBe(true)
		expect(iconElement.exists()).toBeTruthy()
		expect(iconElement.attributes('icon')).toBe('spinner')
		await wrapper.trigger('click')
		expect(wrapper.emitted('click')).toBeUndefined()
	});

	const onClick = vi.fn()

	test('basic button', async () => {
		const wrapper = mount(() => (<Button type="primary" {...{onClick}}>button content</Button>))
		expect(wrapper.classes()).toContain('z-button--primary')
		expect(wrapper.get('button').text()).toBe('button content')
		await wrapper.get('button').trigger('click')
		expect(onClick).toHaveBeenCalledOnce()
	})

	test('disabled button', async () => {
		const wrapper = mount(() => (<Button disabled {...{onClick}}>disabled button</Button>))
		expect(wrapper.classes()).toContain('is-disabled')
		expect(wrapper.attributes('disabled')).toBeDefined()
		expect(wrapper.find('button').element.disabled).toBeTruthy()
		await wrapper.get('button').trigger('click')
		expect(onClick).toHaveBeenCalledOnce()
		expect(wrapper.emitted('click')).toBeUndefined()
	})

	test('loading button', () => {
		const wrapper = mount(Button, {
			props: {loading: true},
			slots: {default: "loading Button"},
			global: {stubs: ["ZIcon"],}
		})

		expect(wrapper.classes()).toContain('is-loading')
		expect(wrapper.attributes('disabled')).toBeDefined()
		expect(wrapper.find('button').element.disabled).toBeTruthy()
		wrapper.get('button').trigger('click')
		expect(wrapper.emitted()).not.toHaveProperty('click')

		const iconElement = wrapper.findComponent(Icon);
		expect(iconElement.exists()).toBeTruthy()
		expect(iconElement.attributes('icon')).toBe('spinner')
	})

	test('icon button', () => {
		const wrapper = mount(Button, {
			props: {icon: "arrow-up"},
			slots: {default: "icon button"},
			global: {stubs: ["ZIcon"],}
		})
		const iconElement = wrapper.findComponent(Icon);
		expect(iconElement.exists()).toBeTruthy()
		expect(iconElement.attributes('icon')).toBe('arrow-up')
	})
});

describe("ButtonGroup.vue", () => {
	test('basic button group', async () => {
		const wrapper = mount(() => (
			<ButtonGroup>
				<Button>button1</Button>
				<Button>button2</Button>
			</ButtonGroup>
		))
		expect(wrapper.classes()).toContain('z-button-group')
	})

	test('button group size', () => {
		const size = ['large', 'default', 'small']
		size.forEach((size) => {
			const wrapper = mount(() => (
				<ButtonGroup size={size as any}>
					<Button>button1</Button>
					<Button>button2</Button>
				</ButtonGroup>
			))
			const buttonWrapper = wrapper.findComponent(Button)
			expect(buttonWrapper.classes()).toContain(`z-button--${size}`)
		})
	})

	test('button group type', () => {
		const types = ['primary', 'success', 'warning', 'danger', 'info']
		types.forEach((type) => {
			const wrapper = mount(() => (
				<ButtonGroup type={type as any}>
					<Button>button1</Button>
					<Button>button2</Button>
				</ButtonGroup>
			))
			const buttonWrapper = wrapper.findComponent(Button)
			expect(buttonWrapper.classes()).toContain(`z-button--${type}`)
		})
	})

	test('button group disabled', () => {
		const wrapper = mount(() => (
			<ButtonGroup disabled>
				<Button>button1</Button>
				<Button>button2</Button>
			</ButtonGroup>
		))
		const buttonWrapper = wrapper.findComponent(Button)
		expect(buttonWrapper.classes()).toContain(`is-disabled`)
	})
})

describe("Button/index", () => {
	it('should be exported with withInstall', () => {
		expect(ZButton.install).toBeDefined()
	})
	it('component should be exported', () => {
		expect(ZButton).toBe(Button)
	})

	it('should enhance Button component', () => {
		const enhanceButton = withInstall(Button)
		expect(enhanceButton).toBe(ZButton)
	})

	it('should apply specific enhance', () => {
		const enhanceButton = withInstall(Button)
		expect(enhanceButton).toHaveProperty('install')
	})
})
