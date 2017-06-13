var constructeur = function(elCocher)
{
	var valeur = elCocher.getAttribute("valeur");

	var bouton = elCocher.shadowRoot.querySelector('div');
	
	if(!valeur){	valeur = false;	}
	else{	bouton.innerHTML = 'X';	}
	
	bouton.addEventListener
	(
		'click'
		,function()
		{
			valeur = !valeur;
			if(valeur)
			{	bouton.innerHTML = 'X';	}
			else
			{	bouton.innerHTML = '';	}
			elCocher.setAttribute('valeur', valeur);
			
		},
		false
	);
	bouton.addEventListener
	('mouseover',
		function()
		{	bouton.style.backgroundColor = ybasthis.charteUi.grisFonce;	},
		false
	);
	bouton.addEventListener
	('mouseout',
		function()
		{	bouton.style.backgroundColor = ybasthis.charteUi.grisClair;	},
		false
	);
	return false;
};

var template =
`
	<template>
		<div></div>
		<style>
			div
			{
				height:32px;
				width: 32px;
				border-color		: black;
				border-style		: solid;
				border-width		: 1px;
				background-color	: white;
				font-weight			: 700;
				font-size			: 2em;
				background-color	: #b5b3b3;
				color				: green;
				text-align			: center;
				line-height			: 28px;
			}
		</style>
	</template>
`;

module.exports =
{
	nom				: 'caseCocher'
	,template		: template
	,constructeur	: constructeur
};