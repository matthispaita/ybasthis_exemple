var constructeur = function(elBoutonExterne)
{
	
	const elBoutonInterne = elBoutonExterne.shadowRoot;
	const bouton = elBoutonInterne.querySelector('input');
	
	bouton.appliquerBordure();
	elBoutonExterne.changerLabel = texte => bouton.value = texte;
	elBoutonExterne.enleverEffets = ()	=> bouton.style.boxShadow = 'none';
	
	
	bouton.style.backgroundColor = ybasthis.charteUi.grisClair;
	bouton.value = elBoutonExterne.innerHTML;
	
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

	/**
		Style
	**/
	
	const styleExterne = elBoutonExterne.style;
	bouton.addEventListener('insertionDom', ee =>
	{
		//console.log('WIDTH BTN: ', getComputedStyle(elBoutonExterne).width, bouton);
	} );
	elBoutonExterne.addEventListener('insertionDom', ee =>
	{
		//console.log('WIDTH BATH: ', getComputedStyle(elBoutonExterne).width, bouton);
	} );
	if(styleExterne.width === '')
	{
		styleExterne.width = 'auto';
		//console.log("babar: ", elBoutonExterne.obtenirStyleAuteurElement() );
	}
	console.log('pute');
	/*ybasthis.mutationSensor.newAsStyleExpected
	(
		elBoutonExterne,
		{
			name:			'width',
			expected:	'auto',
			isEqual:	false
		},
		mutation =>
		{
			console.log('pipi', mutation.target);
			styleExterne.width = getComputedStyle(elBoutonExterne).width;
			bouton.style.width = styleExterne.width;
		}
	);
	ybasthis.mutationSensor.newAsStyleExpected
	(
		elBoutonExterne,
		{
			name:			'height',
			expected:	'auto',
			isEqual:	false
		},
		mutation =>
		{
			styleExterne.height = getComputedStyle(elBoutonExterne).height;
			bouton.style.height = styleExterne.height;
		}
	);*/
	/*ybasthis.utilitaires.WHEN(() => getComputedStyle(elBoutonExterne).width !== 'auto',
	() =>
	{
		//console.log('largeur', elBoutonExterne, getComputedStyle(elBoutonExterne).width);
		//styleExterne.width = getComputedStyle(bouton).width;
		bouton.style.width = getComputedStyle(elBoutonExterne).width;
	});
	//styleExterne.boxShadow = '0px 0px 8px 3px white';
	*/	
	return false;
};
var template =
`
	<template>
		<input type="submit" name="" value="" />
		<style>
			input
			{
				position:			relative;
				display:			block;
				font-weight:	700;
				text-align:		center;
				cursor:				pointer;
				height:				100%;
				width:				100%;
			}
		</style>
	</template>
`;
module.exports =
{
	nom				: 'bouton'
	,template		: template
	,constructeur	: constructeur
};