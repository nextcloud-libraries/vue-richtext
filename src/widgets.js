
if (!window._vue_richtext_widgets) {
	window._vue_richtext_widgets = {}
}

const isWidgetRegistered = (id) => {
	return !!window._vue_richtext_widgets[id]
}

const registerWidget = (id, callback) => {
	if (window._vue_richtext_widgets[id]) {
		console.error('Widget for id ' + id + ' already registered')
		return
	}

	window._vue_richtext_widgets[id] = {
		id,
		callback
	}
}

const renderWidget = (el, { richObjectType, richObject, accessible }) => {
	if (richObjectType === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[richObjectType]) {
		console.error('Widget for rich object type ' + richObjectType + ' not registered')
		return
	}

	window._vue_richtext_widgets[richObjectType].callback(el, { richObjectType, richObject, accessible })
}

window._registerWidget = registerWidget

export {
	registerWidget,
	renderWidget,
	isWidgetRegistered
}
