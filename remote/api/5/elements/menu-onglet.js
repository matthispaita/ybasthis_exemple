var constructeur = function(elOnglet)
{
	const elementMenu = elOnglet.parentElement;
	let type = null,
		elementMenuOnglet = null;
		
	if(elementMenu.tagName !== 'YB-MENU') throw new Error('yb-onglet à l\'exterieur d\'un tag yb-menu');
	if(!elOnglet.hasAttribute('nom') ) throw new Error('yb-onglet sans attribut nom');
	const nomOnglet = elOnglet.getAttribute('nom');
	
	if(!elOnglet.hasAttribute('type') ) type = 'bouton';
	else type = elOnglet.getAttribute('type');
	
	switch(type)
	{
		case 'bouton':
			elementMenuOnglet = document.createElement('yb-bouton');
			elementMenuOnglet.changerLabel(elOnglet.getAttribute('nom')	);
			elementMenuOnglet.style.position	= 'relative';
			elementMenuOnglet.addEventListener
			(
				'click',
				() =>
				{
					elementMenuOnglet.style.borderBottomWidth = '0px';
					const evenementAffichage = new CustomEvent
					(
						"affichage", 
						{
							detail:
							{
								type: "bouton",
								cible: nomOnglet
							},
							bubbles: true,
							cancelable: true
						}
					);
					elementMenu.dispatchEvent(evenementAffichage);
				},
				false
			);
			elementMenuOnglet.addEventListener('mouseout', () =>elementMenuOnglet.style.borderBottomWidth = '1px', false);
			elementMenuOnglet.shadowRoot.querySelector('input').style.boxShadow = 'none';
		break;
		case 'selection':
			elementMenuOnglet = document.createElement('yb-selection');
			elementMenuOnglet.setAttribute('nom', elOnglet.getAttribute('nom') );
			//console.log('elOnglet, ', elementMenuOnglet, elOnglet);
		break;
		default:
			throw new Error('yb-onglet avec attribut type incorrect : ' + type);
		break;
	}
	elementMenuOnglet.style.display = 'block';
	elementMenuOnglet.style.position = 'relative';
	elOnglet.dom = elementMenuOnglet;
	elementMenu.ajouterOnglet(elementMenuOnglet, false);
	return false;
};

var template = 
`		
	<template></template>

`;
module.exports =
{
	nom				: 'onglet'
	,template		: template
	,constructeur	: constructeur
};