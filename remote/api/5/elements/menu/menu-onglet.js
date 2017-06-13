var constructeur = function(elOnglet)
{
	const elementMenu = elOnglet.parentNode,
		  aInterface = elOnglet.getAttribute('interface');

	//elementMenuOnglet.enleverEffets();
	var elementMenuOnglet;
	
	if(elOnglet.parentElement.tagName === 'YB-MENU-TAB')
	{
		elementMenuOnglet = window.document.createElement('yb-bouton');
		elementMenuOnglet.changerLabel(elOnglet.getAttribute('nom')	);
		elementMenuOnglet.style.borderStyle = 'solid';
		elementMenuOnglet.style.borderWidth = '1px';
		
		elementMenuOnglet.style.height	= '100%';	////////////////////////////////////
		elementMenuOnglet.addEventListener
		(	'click'
		,	function()
			{
				elementMenuOnglet.style.borderBottomWidth = '0px';
				//Affichage du contenu
				//hauteur, largeur fixé dans le menu-tab, non modifiable.
				var c_contenu = elementMenu.shadowRoot.querySelector('#onglet');
				c_contenu.innerHTML = aInterface	?	_ui.interface(aInterface)	:	elOnglet.innerHTML;
				_d(c_contenu.innerHTML);
			},
			false
		);
		elementMenuOnglet.addEventListener
		(	'mouseout'
		,	function()
			{	elementMenuOnglet.style.borderBottomWidth = '1px'	}
		,	false
		);
		elementMenuOnglet.shadowRoot.querySelector('input').style.boxShadow = 'none';
		
	}
	else
	{
		elementMenuOnglet = elOnglet.firstElementChild;
		
	}
	
	elementMenu.shadowRoot.querySelector('#menu').appendChild(elementMenuOnglet);
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