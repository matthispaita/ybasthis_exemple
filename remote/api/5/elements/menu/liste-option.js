var constructeur = function(elOption)
{
	var option = elOption.getAttribute("option");
						
	var elementCombox = elOption.parentNode;
	if(elementCombox.nodeName.toLowerCase() != _config.espaceDeNom + '-liste')
	{
		throw new Error('utilisation d\'une option combox à l\'exterieur d\'une liste');
	}

	var opt = window.document.createElement("option");
	opt.text = elOption.innerHTML;
	elementCombox.shadowRoot.querySelector('select').appendChild(opt);

	return false;
};

var template =
`
	<template>
		<select>
		</select>
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
			}
		</style>
	</template>
`;
module.exports =
{
	nom				: 'option'
	,template		: template
	,constructeur	: constructeur
};