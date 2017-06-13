'use strict';
var constructeur = function(elNavigation)
{	
	var	  nav	= {enfants:0}
		, cursus	= []
		, elements	= []
	;
	
	var noeudActuel = () =>
	{
		var cursusConnu = nav;
		if(cursus.length !== 0)
		{
			for(var index of cursus)
			{
				cursusConnu = cursusConnu[index];
			}
		}
		
		return cursusConnu;
	};
	
	/**
		Met à jour l'interface de navigation et appele la fn s'y référent.
		@sens
		- => vèrs la gauche
		+ => vèrs la droite
		
		Logique:
			Pour déterminer qu'elles sont les modifications
			à effectuer il faut déterminer le sens.
			Si négatif supprimer des éléments jusqu'à l'élément actuel.
			Quand actuel si différent alors modifier le nom.
	**/
	var maj = (sens) =>
	{
		console.log('--	APPEL => maj('+sens+')');
		var conteneur = elNavigation.shadowRoot.querySelector('div');
		var na = noeudActuel();
		
		
		if(!estPositif(sens))
		{
			console.log('--		ARG n\'est pas positif!');
			var enf = conteneur.querySelector('p');
			// Suppresion des onglets devenus inutiles
			while(sens < 0)
			{
				console.log('--		SUPPRESION de:');
				console.log(conteneur.lastChild);
				conteneur.lastChild.remove();
				sens++;
			}
		}
		else
		{
			var el = document.createElement('p');
			el.style.backgroundColor = 'green';
			el.className = 'onglet';
			el.innerHTML = na.nom;
			conteneur.appendChild(el);
		}
		na.quandActuel();
		
		
		
	};
	var initialise = false;
	elNavigation.defRacine = (nom, fnRacine) =>
	{
		if(initialise)
		{
			throw new Error('Tentative de définir la racine alors qu\'elle existe déjà!');
		}
		nav.nom	= nom;
		nav.quandActuel = fnRacine;
		initialise = true;
		maj(1);
		
	};
	elNavigation.ajouter = (nom, fn) =>
	{
		var noeud = noeudActuel();
		noeud[noeud.enfants] =
		{
			enfants:0
			, quandActuel	: fn
			, nom			: nom
		}
		return noeud.enfants++;
	};
	
	elNavigation.gauche	= (recursion)	=>
	{
		for(var i = 0; i < recursion; i++)
		{
			cursus.pop();
		}
		maj(-(recursion) );
	};
	elNavigation.droite	= index	=>
	{
		cursus.push(index);
		maj(1);
	};
	elNavigation.deplacer = noeud =>
	{
		;;
	};
	
	return false;
};
var template =
`
	<template>
		<div>
			<p id='racine'></p>
		</div>
	<style>
		div
		{
			  display	: flex
			; flex-direction: row
			; height	: 32px
			; width		: 128px
			; background-color : red
			; z-index	: 666
			;
		}
		</style>
	</template>
`;
module.exports =
{
	nom				: 'navigation'
	,template		: template
	,constructeur	: constructeur
};