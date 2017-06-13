'use strict';
export default new function()
{
	const	listeners = {};
	const observerCallback = (mutations, observer) =>
	{
		for(let mutation of mutations)
			listeners[mutation.target](mutation);
	};
	const observer = new MutationObserver(observerCallback);
	this.new = (target, mutationObserverInit, callback) =>
	{
		observer.observe(target, mutationObserverInit);
		listeners[target] = callback;
	};
		
	this.newAsAttributes = (target, attrList, callback) =>
	{
		this.new(target, {attributes: true, attributesFilter: attrList}, callback);
	};

	this.newAsAttributeExpected = (target, attr, callback) =>
	{
		this.new(target, {attributes: true, attributesFilter: attr.name}, mutation =>
		{
			if (target[attr.name] == attr.expected)
				callback(mutation);
		});
	};

	this.newAsStyleExpected = (target, style, callback) =>
	{
		this.new(target, {attributes: true, attributesFilter: 'style'}, mutation =>
		{
			const value = mutation.target.style[style.name];
			console.log('style>name: ', style.name, ' value: ', value, ' expected: ', style.expected);
			if ((style.isEqual && (value === style.expected)) ||
					(!style.isEqual && (value !== style.expected)))
				callback(mutation);
		});
	};
};