<script setup lang="ts">
import {computed, ref, inject} from "vue";
import type {ButtonProps, ButtonEmits, ButtonInstance} from "./types.ts";
import {throttle} from "lodash-es";
import ZIcon from '../Icon/Icon.vue'
import {BUTTON_GROUP_CTX_KEY} from "./contants.ts";

defineOptions({
	name: "ZButton"
})
const props = withDefaults(defineProps<ButtonProps>(), {
	tag: "button",
	nativeType: "button",
	useThrottle: true,
	throttleDuration: 500
})

const emits = defineEmits<ButtonEmits>()
const slots = defineSlots()
const _ref = ref<HTMLButtonElement>()
const ctx = inject(BUTTON_GROUP_CTX_KEY, void 0)
const iconStyle = computed(() => ({marginRight: slots.default ? '6px' : '0'}))
const size = computed(() => ctx?.size ?? props?.size ?? '')
const type = computed(() => ctx?.type ?? props?.type ?? '')
const disabled = computed(() => ctx?.disabled || props?.disabled || false)

const handleBtnClick = (e: MouseEvent) => emits('click', e)
const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration, {trailing: false})

defineExpose<ButtonInstance>({
	ref: _ref,
	disabled,
	size,
	type,
})
</script>

<template>
	<component
		ref="_ref"
		class="z-button"
		:is="props.tag"
		:autofocus="autofocus"
		:type="tag === 'button' ? nativeType : void 0"
		:disabled="disabled || loading ? true : void 0"
		:class="{
			[`z-button--${type}`]: type,
			[`z-button--${size}`]: size,
			'is-plain': plain,
			'is-round': round,
			'is-circle': circle,
			'is-disabled': disabled,
			'is-loading': loading
		}"
		@click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)"
	>
		<template v-if="loading">
			<slot name="loading">
				<z-icon
					class="loading-icon"
					:icon="loadingIcon ?? 'spinner'"
					:style="iconStyle"
					size="1x"
					spin
				/>
			</slot>
		</template>
		<z-icon
			v-if="icon && !loading"
			:icon="icon"
			:style="iconStyle"
			size="1x"
		/>
		<slot />
	</component>
</template>

<style scoped>
@import "style.css";
</style>
