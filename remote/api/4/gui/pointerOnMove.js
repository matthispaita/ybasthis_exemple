'use strict';
export default shared =>
{
	let elemPrecendent = null;
	const onMouseMove = evenement =>
	{
		if (shared.isLocked === true || !shared.isHandled)
			return;
		const pos = shared.position;
		pos.x += evenement.movementX;
		pos.y += evenement.movementY;
		if (pos.x < 1)
			pos.x = shared.areaSize.x - 1;
		else if (pos.y < 1)
			pos.y = shared.areaSize.y - 1;
		else if (pos.x > shared.areaSize.x - 1)
			pos.x = 0;
		else if (pos.y > shared.areaSize.y - 1)
			pos.y = 0;
		shared.dom.cursor.style.left = pos.x + 'px';
		shared.dom.cursor.style.top = pos.y + 'px';
		for(let listener of shared.listeners)
			listener();
		const elAct = shared.getNodeFromCursor();
		if ((elAct === null) || elAct === undefined)
			return;
		if(elemPrecendent === null) elemPrecendent = elAct;
		if(elAct !== elemPrecendent)
		{
			let evMouseOver = new CustomEvent('mouseover',  shared.IEvent);
			let evMouseOut = new CustomEvent('mouseout',  shared.IEvent);
			elemPrecendent.dispatchEvent(evMouseOut);
			elAct.dispatchEvent(evMouseOver);
			elemPrecendent = elAct;
		}
	};
	ybasthis.dom.conteneur.addEventListener('mousemove', onMouseMove);
};