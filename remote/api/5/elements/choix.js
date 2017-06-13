var constructeur = function(elChoix)
{
	
	var option = elChoix.getAttribute("option");
						
	const elementConteneur = elChoix.parentElement;
	const type = elementConteneur.getAttribute('type');
	const nom = elChoix.getAttribute('nom');
	if(elementConteneur.tagName !== 'YB-ONGLET') throw new Error('utilisation d\'un choix à l\'exterieur d\'un onglet');
	else if(type !== 'selection') throw new Error('utilisation d\'un choix à l\'exterieur d\'un onglet de type selection, type actuel: ' + type);
	if(!nom || nom === '') throw new Error('utilisation d\'un choix avec un attribut @nom obligatoire non renseigné');
	
	const choix = document.createElement('p');
	choix.innerHTML = nom;
	elementConteneur.dom.ajouterChoix(choix);
	return false;
};

var template = `<template></template>`;
module.exports =
{
	nom				: 'choix'
	,template		: template
	,constructeur	: constructeur
};