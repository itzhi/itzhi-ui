<script setup lang="ts">
import type {IconProps} from './types.ts'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {omit} from 'lodash-es'
import {computed } from 'vue'

defineOptions({
	name: "ZIcon",
	inheritAttrs: false,
})

const props = defineProps<IconProps>()
const filterProps = computed(() => omit(props, ['type', 'color']))
const customStyles = computed(() => ({color: props.color ?? void 0}))
</script>

<template>
	<i
		class="z-icon"
		:class="[`z-icon-${props.type}`]"
		:style="customStyles"
		v-bind="$attrs"
	>
		<font-awesome-icon v-bind="filterProps" />
	</i>
</template>

<style scoped>
.z-icon {
	--z-icon-color: inherit;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	position: relative;
	fill: currentColor;
	color: var(--z-icon-color);
	font-size: inherit;
}

@each $val in primary, info, success, warning, danger {
	.z-icon--$(val) {
		--z-icon-color: var(--z-color-$(val));
	}
}
</style>
