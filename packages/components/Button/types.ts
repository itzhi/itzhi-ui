import type {Component, ComputedRef, Ref} from "vue";

export type ButtonType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type NativeType = 'button' | 'reset' | 'submit'
export type ButtonSize = 'small' | 'default' | 'large'

export interface ButtonProps {
	tag?: string | Component
	type?: ButtonType
	size?: ButtonSize
	nativeType?: NativeType
	disabled?: boolean
	loading?: boolean
	icon?: string
	circle?: boolean
	plain?: boolean
	round?: boolean
	loadingIcon?: string
	autofocus?: boolean
	useThrottle?: boolean
	throttleDuration?: number
}

export interface ButtonGroup {
	size?: ButtonSize
	type?: ButtonType
	disabled?: boolean
}

export interface ButtonGroupContext extends ButtonGroup {
}

export interface ButtonEmits {
	(e: 'click', val: MouseEvent): void
}

export interface ButtonInstance {
	ref: Ref<HTMLButtonElement | void>
	disabled: ComputedRef<boolean>
	size: ComputedRef<ButtonSize | ''>
	type: ComputedRef<ButtonType | ''>
}
