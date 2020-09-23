import { mount, shallowMount } from '@vue/test-utils'
import RichText from '@/RichText.vue'

describe('Foo', () => {
	it('renders a message and responds correctly to props changes', async() => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Test {placeholder}'
			}
		})

		expect(wrapper.text()).toEqual('Test {placeholder}')
	})

	it('properly inserts a child component', async() => {
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
		expect(wrapper.findComponent(MyComponent).exists()).toBe(true)
	})

	it('properly inserts a child component with props', async() => {
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
		expect(wrapper.findComponent(MyComponent).exists()).toBe(true)
		expect(wrapper.findComponent(MyComponent).vm.username).toBe('Jane')
	})
	test.each([
		['Fallback {placeholder}', {}, 'Fallback {placeholder}'],
		['{placeholder} fallback', {}, '{placeholder} fallback'],
		['Test {placeholder} {placeholder}', {}, 'Test {placeholder} {placeholder}'],
		['Test {placeholder}{placeholder}', {}, 'Test {placeholder}{placeholder}'],
		['Test {placeholder} between {placeholder}', {}, 'Test {placeholder} between {placeholder}'],
		['Test {placeholderA} {placeholderB}', {}, 'Test {placeholderA} {placeholderB}'],
		['Test {placeholderA}{placeholderB}', {}, 'Test {placeholderA}{placeholderB}'],
		['{placeholderA}', { placeholderA: 'A', placeholderB: 'B' }, 'A'],
		['{placeholderA} {placeholderB}', { placeholderA: 'A', placeholderB: 'B' }, 'A B'],
		['Test {placeholderA} {placeholderB}', { placeholderA: 'A', placeholderB: 'B' }, 'Test A B'],
		['Test {placeholderA} {placeholderA} {placeholderB}', { placeholderA: 'A', placeholderB: 'B' }, 'Test A A B']
	])('text: %s', (text, attrs, result) => {
		const wrapper = mount(RichText, {
			propsData: {
				text,
				arguments: attrs
			}
		})
		expect(wrapper.text()).toEqual(result)
	})

	it('properly inserts a link', async() => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Testwith a link to https://example.com - go visit it',
				autolink: true
			}
		})

		expect(wrapper.text()).toEqual('Testwith a link to https://example.com - go visit it')
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com')
	})

	it('properly inserts a link with brackets', async() => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Test with a link to (https://example.com) - go visit it',
				autolink: true
			}
		})
		expect(wrapper.text()).toEqual('Test with a link to (https://example.com) - go visit it')
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com')
	})

	it('properly inserts a link ending with a bracket', async() => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Test with a link to https://example.com/) - go visit it',
				autolink: true
			}
		})
		expect(wrapper.text()).toEqual('Test with a link to https://example.com/) - go visit it')
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com/)')
	})

	it('properly recognizes an url with a custom port and inserts a link', async() => {
		const wrapper = mount(RichText, {
			propsData: {
				text: 'Testwith a link to https://example.com:444 - go visit it',
				autolink: true
			}
		})
		expect(wrapper.text()).toEqual('Testwith a link to https://example.com:444 - go visit it')
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com:444')
	})

	it('properly formats markdown', async() => {
		const wrapper = mount(RichText, {
			propsData: {
				text: '**Testwith** a ~~link~~ *to* [Link](https://example:1337) - go visit it',
				autolink: true
			}
		})
		expect(wrapper.text()).toEqual('Testwith a link to Link - go visit it')
		expect(wrapper.find('a').attributes('href')).toEqual('https://example:1337')
		expect(wrapper.find('strong').text()).toEqual('Testwith')
		expect(wrapper.find('em').text()).toEqual('to')
		expect(wrapper.find('del').text()).toEqual('link')
	})
})
