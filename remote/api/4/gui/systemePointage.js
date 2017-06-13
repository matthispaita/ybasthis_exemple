'use strict';

import startCapture from './pointerCapture.js';
import eventBinding from './pointerEventBinding.js';
import pointerOnMoveInit from './pointerOnMove.js';

export default function()
{
	const chemincursors = './api/4/gui/cursors/';
	const dom =
	{
		canvas : Object.assign(document.createElement('canvas'),
		{
			id : 'canvas'
		}),
		cursor : Object.assign(document.createElement('img'),
		{
			src : chemincursors + 'normal.png',
			id : 'cursor'
		})
	};
	const shared =
	{
		dom,
		isLocked:						false,
		isHandled:					false,
		getNodeFromCursor:	() =>
			document.elementFromPoint(shared.position.x, shared.position.y),
		position:						{x: 0, y: 0},
		areaSize:						{x: 0, y: 0},
		listeners:					[],
		IEvent:
		{
			details:		{simule : true},
			bubbles:		true,
			cancelable:	true,
			composed:		true
		}
	};

	Object.assign(dom.cursor.style,
	{
		top:			'0px',
		height:		'20px',
		width:		'14px',
		position:	'absolute',
		zIndex:		800,
		pointerEvent:	'none'
	});
	dom.cursor.style.setProperty('pointer-events', 'none', 'important');
	const décalage = {x: 0, y: 0};
	const typecursor = 
	{
		normal : {x: 0, y: 0},
		declencher : {x: 0, y: 0},
		deplacer : {x: 0, y : 0}
	};
	let cursorActuel = 'normal';
	let cursorBloqué = false;
	
	this.bloquer = () =>
	{
		if(cursorBloqué) throw new Error('ybasthisApplication.systemePointage.bloquer: pointeur déjà bloqué');
		cursorBloqué = true;
	};
	
	this.débloquer = () =>
	{
		if(!cursorBloqué) throw new Error('ybasthisApplication.systemePointage.débloquer: pointeur non bloqué');
		cursorBloqué = false;
	};

	this.position = () => shared.position;
	/**
		Def:Change le cursor
		Retour: void
		@estActivation booléen => indique si le cursor signale une activation
		@type chaineCaractère => le type de cursor voulu
		Supplément:
			@type optionnel auquel cas seulement le type d'activation sera modifié.
	**/
	this.changeCursor = (estActivation, type) =>
	{
		let cursor = chemincursors;
		if(estActivation === true) cursor += '_' ;
		if(type)
		{
			if(!typecursor[type] ) throw new Error('changement de cursor avec un type invalide:	' + type);
			cursorActuel = type;
			décalage.x = typecursor[type].x;
			décalage.y = typecursor[type].y;
			cursor +=  type;
		}
		else cursor +=  cursorActuel;
		dom.cursor.src = cursor + '.png';
	};
	this.quandMouvement = fn => shared.listeners.push(fn);
	
	try 
	{
		ybasthis.dom.conteneur.addEventListener('mousedown', () => this.changeCursor(true) );
		ybasthis.dom.conteneur.addEventListener('mouseup', () => this.changeCursor(false) );
		ybasthis.dom.conteneur.appendChild(dom.cursor);
		dom.canvas.getContext('2d');
		ybasthis.dom.conteneur.appendChild(dom.canvas);
		const cs = getComputedStyle(ybasthis.dom.desktop);
		shared.areaSize.x = ybasthis.utilitaires.grandeurs.enleverUnité(cs.width);
		shared.areaSize.y = ybasthis.utilitaires.grandeurs.enleverUnité(cs.height);
		startCapture(shared);
		eventBinding(shared);
		pointerOnMoveInit(shared);
	}
	catch(err)
	{
		console.log('errInitialisation module:	', err);
	}
};