<script setup lang="ts">
import type {IconProps} from './types.ts'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {omit} from 'lodash-es'
import {computed} from 'vue'

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
		<font-awesome-icon v-bind="filterProps"/>
	</i>
</template>

<style>
@import "./style.css";
</style>
