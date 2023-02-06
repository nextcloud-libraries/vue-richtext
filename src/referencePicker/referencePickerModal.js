import Vue from 'vue'
import ReferencePickerModal from './ReferencePickerModal.vue'
import { getProvider } from './providerHelper.js'

/**
 * Creates a reference picker modal and return a promise which provides the result
 *
 * @param {String} providerId Optional ID of initial selected provider
 * @param {Boolean} isInsideViewer Should be true if this function is called while the Viewer is displayed
 * @returns {Promise<unknown>}
 */
export async function getLinkWithPicker(providerId = null, isInsideViewer = undefined) {
	return await new Promise((resolve, reject) => {
		const modalId = 'referencePickerModal'
		const modalElement = document.createElement('div')
		modalElement.id = modalId
		document.body.append(modalElement)

		const initialProvider = providerId === null
			? null
			: (getProvider(providerId) ?? null)

		const View = Vue.extend(ReferencePickerModal)
		const view = new View({
			propsData: {
				initialProvider,
				isInsideViewer,
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
