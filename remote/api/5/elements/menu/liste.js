var constructeur = function(elListe)
{
	const nom = elListe.getAttribute("nom");
	var liste = elListe.shadowRoot.querySelector('select');
	liste.style.backgroundColor = _config.couleurs.elements.clair;
	// STOP
	
	liste.addEventListener('mouseover', function(){
		liste.style.backgroundColor = _config.couleurs.elements.fonce;
	}, false);
	liste.addEventListener('mouseout', function(){
	liste.style.backgroundColor = _config.couleurs.elements.clair;
	}, false);
									
	return false;
};

var template =
`
	<template>
		<select name="Dupont" ></select>
		<style>
			select
			{
				display:			block;
				border-color:		black;
				border-style:		none;
				font-weight: 		700;
				text-align:			center;
				border-style:		solid;
				border-width:		1px;
				box-shadow: 		0px 0px 8px 3px white;
				cursor: 			pointer;
				height:				100%;
				width:				100%;
			}
		</style>
	</template>
`;

module.exports =
{
	nom				: 'liste'
	,template		: template
	,constructeur	: constructeur
};