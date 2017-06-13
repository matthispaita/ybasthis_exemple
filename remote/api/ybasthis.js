'use strict';
import './0/surcoucheNatifs.js';
import contrat from './1/contrat.js';
import mutationSensor from './1/sondeMutation.js';
import typesDonnees from './2/typesDonnees.js';
import utilitaires from './2/utilitaires.js';
import fabriqueElement from './3/elementsPersonalisés.js';
import gui from './4/gui/guiIndex.js';
import listeElements from './5/listeElements.js';
import fnUiPrincipale from '../ui/principale.js';

(() =>
{
    const ybasthis = window.ybasthis =
	{
		contrat,
		mutationSensor,
		typesDonnees,
		utilitaires : new utilitaires(),
		fabriqueElement,
		charteUi :
		{
			fond: 		'grey',
	  		grisClair:	'#b5b3b3',
	  		grisFonce:	'#989898',
	  		vert:		'#22780F',
			rouge:		'#DB1702'
		},
		navigation : []
	};

	const demareur = (conf) =>
	{
		const FabriqueYbasthis = ybasthis.fabriqueElement(conf.ns);
		for(let element of listeElements)
			new FabriqueYbasthis(element);
		gui();
		fnUiPrincipale();
	};
	{
		let onLoaded = () =>
		{
			window.removeEventListener('load', onLoaded);
			onLoaded = undefined;
			demareur
			({
				ns : 'yb'
			});
		};
		window.addEventListener('load', onLoaded);
	}
} )();
