require('regenerator-runtime/runtime');

import { mount, shallowMount } from '@vue/test-utils'
import RichText from '@/RichText.vue'
import Link from '@/Link.vue'

describe('Foo', () => {
	it('renders a message and responds correctly to props changes', async () => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Test {placeholder}'
			}
		})

		expect(wrapper.text()).toEqual('Test placeholder')
		expect(wrapper.find('.rich-text--fallback').text()).toEqual('placeholder')

		wrapper.setProps({ text: 'Abc' })
		await wrapper.vm.$nextTick()
		expect(wrapper.text()).toEqual('Abc')
	})

	it('properly inserts a child component', async () => {
		const MyComponent = {
			name: 'MyComponent',
			render: (createElement) => {
				return createElement('div', 'MYCOMPONENT')
			}
		}
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Test {placeholder}',
				arguments: {
					placeholder: {
						component: MyComponent
					}
				}
			}
		})

		expect(wrapper.text()).toEqual('Test MYCOMPONENT')
		expect(wrapper.find(MyComponent).exists()).toBe(true)
	})

	it('properly inserts a child component with props', async () => {
		const MyComponent = {
			name: 'MyComponent',
			props: ['username'],
			render: (createElement) => {
				return createElement('div', 'MYCOMPONENT')
			}
		}
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Test {placeholder}',
				arguments: {
					placeholder: {
						component: MyComponent,
						props: {
							username: 'Jane'
						}
					}
				}
			}
		})

		expect(wrapper.text()).toEqual('Test MYCOMPONENT')
		expect(wrapper.find(MyComponent).exists()).toBe(true)
		expect(wrapper.find(MyComponent).vm.username).toBe('Jane')
	})
	test.each([
		['Fallback {placeholder}', {}, 'Fallback placeholder'],
		['{placeholder} fallback', {}, 'placeholder fallback'],
		['Test {placeholder} {placeholder}', {}, 'Test placeholder placeholder'],
		// FIXME: known issue
		// ['Test {placeholder}{placeholder}', {}, 'Test placeholder placeholder'],
		['Test {placeholder} between {placeholder}', {}, 'Test placeholder between placeholder'],
		['Test {placeholderA} {placeholderB}', {}, 'Test placeholderA placeholderB'],
		['Test {placeholderA}{placeholderB}', {}, 'Test placeholderAplaceholderB'],
		['Test {placeholderA} {placeholderB}', { placeholderA: 'A', placeholderB: 'B' }, 'Test A B'],
		['Test {placeholderA} {placeholderA} {placeholderB}', { placeholderA: 'A', placeholderB: 'B' }, 'Test A A B'],
	])('text: %s', (text, attrs, result) => {
		const wrapper = mount(RichText, {
			propsData: {
				text,
				arguments: attrs
			}
		})
		expect(wrapper.text()).toEqual(result)
	});


	it('properly inserts a link component', async () => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Testwith a link to https://example.com - go visit it',
				autolink: true
			}
		})
		expect(wrapper.text()).toEqual('Testwith a link to https://example.com - go visit it')
		expect(wrapper.find(Link).exists()).toBe(true)
		expect(wrapper.find(Link).attributes('href')).toBe('https://example.com')
	})

	it('properly inserts a link component with brackets', async () => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Testwith a link to (https://example.com) - go visit it',
				autolink: true
			}
		})
		expect(wrapper.text()).toEqual('Testwith a link to (https://example.com) - go visit it')
		expect(wrapper.find(Link).exists()).toBe(true)
		expect(wrapper.find(Link).attributes('href')).toBe('https://example.com')
	})


})