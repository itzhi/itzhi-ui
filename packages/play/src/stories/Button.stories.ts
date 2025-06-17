import type {Meta, StoryObj, ArgTypes} from '@storybook/vue3-vite'
import {fn, within, userEvent, expect, clearAllMocks} from "storybook/test";
import {ZButton, ZButtonGroup} from 'itzhi-ui'
import {set} from "lodash-es";

type Story = StoryObj<typeof ZButton> & { argType?: ArgTypes }

const meta: Meta<typeof ZButton> = {
  title: 'Example/Button',
  component: ZButton,
  // subcomponents: {ButtonGroup: ZButtonGroup},
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: {type: 'select'},
      options: ['primary', 'success', 'warning', 'danger', 'info', '']
    },
    size: {
      control: {type: 'select'},
      options: ['large', 'default', 'small', '']
    },
    disabled: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    },
    useThrottle: {
      control: 'boolean'
    },
    throttleDuration: {
      control: 'number'
    },
    autofocus: {
      control: 'boolean'
    },
    tag: {
      control: {type: 'select'},
      options: ['button', 'a', 'div']
    },
    nativeType: {
      control: {type: 'select'},
      options: ['button', 'submit', 'reset', '']
    },
    icon: {
      control: {type: 'text'}
    },
    loadingIcon: {
      control: {type: 'text'}
    }
  },
  args: {
    onClick: fn()
  }
}


const container = (val: string) => `<div style="margin: 5px">${val}</div>`

export const Default: Story & { args: { content: string } } = {
  argTypes: {
    content: {
      control: {type: 'text'}
    }
  },
  args: {
    type: 'primary',
    content: 'Button'
  },
  render: (args: any) => ({
    components: {ZButton},
    setup() {
      return {args}
    },
    template: container(`<z-button data-testid="story-test-btn" v-bind="args">{{args.content}}</z-button>`)
  }),
  play: async ({canvasElement, args, step}: any) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByTestId('story-test-btn')

    await step('当useThrottle被设置为true时，onclick应该被调用一次', async () => {
      set(args, 'useThrottle', true)
      await userEvent.tripleClick(btn)
      await expect(args.onClick).toHaveBeenCalledOnce()
      clearAllMocks()
    })

    await step('当useThrottle被设置为false时，onclick应该被调用三次', async () => {
      set(args, 'useThrottle', false)
      await userEvent.tripleClick(btn)
      await expect(args.onClick).toHaveBeenCalledTimes(3)
      clearAllMocks()
    })

    await step('当disabled设置为true时，不应该调用onclick', async () => {
      set(args, 'disabled', true)
      await userEvent.click(btn)
      await expect(args.onClick).toHaveBeenCalledTimes(0)
      set(args, 'disabled', false)
      clearAllMocks()
    })

    await step('当loading设置为true时，不应该调用onclick', async () => {
      set(args, 'loading', true)
      await userEvent.click(btn)
      await expect(args.onClick).toHaveBeenCalledTimes(0)
      set(args, 'loading', false)
      clearAllMocks()
    })
  }
}

export const AutoFocus: Story & {args: {content: string}} = {
  argType: {
    control: {type: 'text'}
  },
  args: {
    content: 'Button',
    autofocus: true
  },
  render: (args: any) => ({
    components: {ZButton},
    setup() {
      return {args}
    },
    template: container(`
      <p>请点击浏览器的刷新页面来获取按钮聚焦</p>
      <z-button data-testid="story-test-btn" v-bind="args">{{args.content}}</z-button>
    `)
  }),
  play: async({args}: any) => {
    await userEvent.keyboard('{enter}')
    await expect(args.onClick).toHaveBeenCalledOnce()
    clearAllMocks()
  }
}

export const Circle: Story = {
  args: { icon: 'search' },
  render: (args: any) => ({
    components: {ZButton},
    setup() { return {args} },
    template: container(`<z-button circle v-bind="args">`)
  }),
  play: async ({canvasElement, args, step}: any) => {
    const canvas = within(canvasElement)
    await step('click, button', async () => {
      await userEvent.click(canvas.getByRole('button'))
    })
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export const Group: Story & {args: {content1: string, content2: string}} = {
  argTypes: {
    groupType: {
      control: {type: 'select'},
      options: ['primary', 'success', 'warning', 'danger', 'info', '']
    },
    groupSize: {
      control: {type: 'select'},
      options: ['larger', 'default', 'small', '']
    },
    groupDisabled: {
      control: 'boolean'
    },
    content1: {
      control: {type: 'text'},
      defaultValue: 'Button1'
    },
    content2: {
      control: {type: 'text'},
      defaultValue: 'Button2'
    }
  },
  args: {
    round: true,
    content1: 'Button1',
    content2: 'Button2',
  },
  render: (args: any) => ({
    components: {ZButton, ZButtonGroup},
    setup() {return {args}},
    template: container(`
      <z-button-group :type="args.groupType" :size="args.groupSize" :disabled="args.groupDisabled">
        <z-button v-bind="args">{{args.content1}}</z-button>
        <z-button v-bind="args">{{args.content2}}</z-button>
      </z-button-group>
    `)
  }),
  play: async ({canvasElement, args, step}: any) => {
    const canvas = within(canvasElement)
    await step('click btn1', async () => {
      await userEvent.click(canvas.getByText('Button1'))
    })
    await step('click btn2', async () => {
      await userEvent.click(canvas.getByText('Button2'))
    })
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export default meta
