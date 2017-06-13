'use strict';
const pointerLock = (document.mozPointerLockElement !== undefined) ?
{
	event : 'mozPointerlockchange',
	element : () => document.mozPointerLockElement
} :
(document.webkitPointerLockElement !== undefined) ?
{
	event : 'webkitPointerlockchange',
	element : () => document.webkitPointerLockElement
} :
{
	event : 'pointerlockchange',
	element : () => document.pointerLockElement
};

export default shared =>
{
	const queryCursor = () =>
	{
		if(shared.isHandled)
			return;
		shared.dom.canvas.requestPointerLock();
	};
	const onPointerLockChange = () =>
	{
		if (pointerLock.element() == shared.dom.canvas)
		{
			shared.isHandled = true;
			document.removeEventListener('click', queryCursor);
		}
		else
		{
			shared.isHandled = false;
			document.addEventListener('click', queryCursor);
		}
	};
	document.addEventListener(pointerLock.event, onPointerLockChange, false);
	onPointerLockChange();
};