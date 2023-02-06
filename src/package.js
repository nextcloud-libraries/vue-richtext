import RichText from './RichText.vue'
import { registerWidget, renderWidget, isWidgetRegistered } from './widgets'
import ReferenceList from './ReferenceList.vue'
import ReferenceWidget from './ReferenceWidget.vue'
import ReferencePicker from './referencePicker/ReferencePicker.vue'
import ReferencePickerModal from './referencePicker/ReferencePickerModal.vue'
import Search from './referencePicker/Search.vue'
import { getLinkWithPicker } from './referencePicker/referencePickerModal.js'
import { getProvider, getProviders, sortProviders, searchProvider, anyLinkProviderId } from './referencePicker/providerHelper.js'
import { registerCustomPickerElement, renderCustomPickerElement, isCustomPickerElementRegistered, CustomPickerRenderResult } from './referencePicker/customPickerElements'

export default RichText

export {
	RichText,
	ReferenceList,
	ReferenceWidget,
	ReferencePicker,
	ReferencePickerModal,
	Search,

	registerWidget,
	renderWidget,
	isWidgetRegistered,

	CustomPickerRenderResult,
	registerCustomPickerElement,
	renderCustomPickerElement,
	isCustomPickerElementRegistered,
	getLinkWithPicker,
	anyLinkProviderId,
	getProvider,
	getProviders,
	sortProviders,
	searchProvider,
}
