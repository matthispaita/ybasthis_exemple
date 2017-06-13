'use strict';
import systemePointage from './systemePointage.js';
import windows from './windows.js';
export default () =>
{
	Object.assign(ybasthis,
	{
		config :
		{
			conteneur : document.getElementById('receptacleYbasthis')
		},
		dom :
		{
			conteneur : null,
			desktop : null
		},
		systemePointage : null
	});

	ybasthis.dom.conteneur = ybasthis.config.conteneur;
	ybasthis.dom.desktop = document.createElement('div');
	ybasthis.dom.desktop.id = 'desktop';
	ybasthis.dom.conteneur.appendChild(ybasthis.dom.desktop);
	Object.assign(ybasthis.dom.conteneur.style,
	{
		left : '0px',
		top : '0px',
		height : '100%',
		width : '100%',
		position : 'absolute',
		zIndex : 1
	});
	Object.assign(ybasthis.dom.desktop.style,
	{
		left : '0px',
		top : '0px',
		height : '100%',
		width : '100%',
		position : 'absolute',	
		overflow : 'hidden',
		backgroundImage : ' url(./api/4/gui/images/background.png)',
		backgroundSize : '100% 100%',
		zIndex : 2
	});

	ybasthis.systemePointage = new systemePointage;
	ybasthis.windows = new windows;
}
