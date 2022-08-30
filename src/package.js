import RichText from './RichText.vue'
import { registerWidget, renderWidget, isWidgetRegistered } from './widgets'
import ReferenceList from './ReferenceList.vue'
import ReferenceWidget from './ReferenceWidget.vue'

export default RichText

export {
	RichText,
	ReferenceList,
	ReferenceWidget,

	registerWidget,
	renderWidget,
	isWidgetRegistered
}
