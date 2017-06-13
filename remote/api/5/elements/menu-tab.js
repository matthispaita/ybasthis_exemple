'use strict';
// Fonctionne en apparence, même si code invalide!
// Dû au fait que la logique est codé dans l'élément onglet.
var constructeur = function(elTab)
{
	var conteneur = vueInterne.querySelector('#conteneur');	
	elTab.style.display			= 'inline-block';
	elTab.style.backgroundColor	= 'grey';
	elTab.style.overflow			= 'hidden';
	var   cs	= getComputedStyle
		, elMenu	= conteneur.querySelector('#menu')
	;
	
 	var elOnglet	= elTab.querySelector('#onglet');
	elOnglet.style.setProperty('height', cs(elTab).height - (cs(elMenu).height) + 'px');
	return false;
};


var template = 
`
	<template>
		<div id='conteneur'>
			<div id='menu'></div>
			<div id='onglet'></div>
		</div>
			<style>
				#conteneur
				{
					overflow		: hidden
				;	display			: flex
				;	flex-direction	: column
				;
				}
				
				#menu
				{
					display 			: flex			!important
					;flex-direction		: row 			!important
					;height				: 35px
					;z-index			: 500px
					;
				}
				#onglet
				{
					;overflow			: hidden
					;position			: relative
					;top				: 10 px;
					;background-color	: green
					;width				: 100%
					;height				: 100%
					;display			:block
					;z-index			: 400px
					;
				}
		</style>
	</template>
`;
module.exports =
{
	nom				: 'menu-tab'
	,template		: template
	,constructeur	: constructeur
};