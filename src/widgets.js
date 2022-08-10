
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

const renderWidget = (id, richObjectData, el) => {
	if (id === 'open-graph') {
		return
	}

	if (!window._vue_richtext_widgets[id]) {
		console.error('Widget for id ' + id + ' not registered')
		return
	}

	window._vue_richtext_widgets[id].callback(richObjectData, el)
}

window._registerWidget = registerWidget

export {
	registerWidget,
	renderWidget,
	isWidgetRegistered
}
