var constructeur = function(elMenu)
{
	elMenu.ajouterOnglet	= (nomTag, nomOnglet) =>
	{
		var onglet = document.createElement(nomTag);
		onglet.changerLabel(nomOnglet);
		elMenu.shadowRoot.querySelector('#menu').appendChild(onglet);
		return onglet;
	};
	
	elMenu.style.display		= 'flex';
	elMenu.style.flexDirection	= 'row';
	
	return false;
};

var template = 
`
	<template>
		<div id='menu'></div>
		<style>
			#menu
			{
				  display			: flex
				; flex-direction	: row
				; width				: 100%
				; background-color	: red
				;
			}
		</syle>
	</template>
`;
module.exports =
{
	nom				: 'menu'
	,template		: template
	,constructeur	: constructeur
};