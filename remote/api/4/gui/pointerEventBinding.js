'use strict';

const bindedEvents = ['mouseup', 'dblclick', 'mousedown'];
export default shared =>
{
	const eventBindToNode = (event) =>
	{
		if(event.isTrusted)
		{
			const node = shared.getNodeFromCursor();
			if (node)
				node.dispatchEvent(new MouseEvent(event.type, shared.IEvent));
			return (node);
		}
		else
		{
			event.stopPropagation();
			event.preventDefault();
		}
		return (null);
	};
	for(const event of bindedEvents)
		ybasthis.dom.conteneur.addEventListener(event, eventBindToNode, false);
	ybasthis.dom.conteneur.addEventListener
	(
		'click',
		event =>
		{
			const node = eventBindToNode(event);
			if (node)
				node.focus();
		},
		false
	);
};