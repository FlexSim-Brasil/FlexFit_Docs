function onDOMLoaded(event) {
	renderMathInElement(document.body, {
		// customised options
		// • auto-render specific keys, e.g.:
		delimiters: [
			{left: '$', right: '$', display: false}
		],
		// • rendering keys, e.g.:
		throwOnError : false
	});
}
window.addEventListener('DOMContentLoaded', onDOMLoaded);
