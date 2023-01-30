import Vue from 'vue'
import ReferencePickerModal from './ReferencePickerModal.vue'

/**
 * Creates a reference picker modal and return a promise which provides the result
 *
 * @param {Object} provider
 * @returns {Promise<unknown>}
 */
export async function getLinkWithPicker(provider) {
	return await new Promise((resolve, reject) => {
		const modalId = 'referencePickerModal'
		const modalElement = document.createElement('div')
		modalElement.id = modalId
		document.body.append(modalElement)

		const View = Vue.extend(ReferencePickerModal)
		const view = new View({
			propsData: {
				initialProvider: provider,
			},
		}).$mount(modalElement)

		view.$on('cancel', () => {
			view.$destroy()
			reject('User cancellation')
		})
		view.$on('submit', (link) => {
			view.$destroy()
			resolve(link)
		})
	})
}
