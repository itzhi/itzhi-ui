<script setup lang="ts">
import type { ButtonGroup } from "./types.ts";
import {provide, reactive, toRef} from "vue";
import {BUTTON_GROUP_CTX_KEY} from "./contants.ts";

defineOptions({
	name: "ZButtonGroup"
})

const props = defineProps<ButtonGroup>()
provide(BUTTON_GROUP_CTX_KEY, reactive({
	size: toRef(props, "size"),
	type: toRef(props, "type"),
	disabled: toRef(props, "disabled"),
}))
</script>

<template>
	<div class="z-button-group">
		<slot />
	</div>
</template>

<style scoped>
@import "./style.css";
</style>
