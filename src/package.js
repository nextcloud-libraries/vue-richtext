import RichText from './RichText.vue'
import { registerWidget, renderWidget, isWidgetRegistered } from './widgets'
import References from './References.vue'
import ReferenceWidget from './ReferenceWidget.vue'

export default RichText

export {
    RichText,
    References,
    ReferenceWidget,

    registerWidget,
    renderWidget,
    isWidgetRegistered,
}