var template = 
`
	<template>
		<div id='conteneur'>
			<div id='titre'>
				<p></p>
			</div>
			<div id='gallerie'></div>
		</div>
		<style>
			p
			{
				margin : 0px;
			}
			#conteneur
			{
				height	: 100%;
				width	: 100%;
			}
		</style>
	</template>
`;

/**
	Une galleries possède ces propriétés privées:
	_donnees , modele, organiseur, lecteur, tailleVignette, formeVignette.
	
	_donnees représente les vignettes de la gallerie.
	modele est un tableau représentant le nom des propriétés valides pour une instance de vignette
	organiseur fonction appélé lors de l'affichage
	lecteur fonction appelé lors de l'affichage pour chaque vignettes
	nombreVignette 'petit':10 'moyen' 'grand'
	formeVignette 'carré' 'rectangle'
**/
var constructeur = function(elInterface)
{
	var qs = sel => elInterface.shadowRoot.querySelector(sel);
	var cs = getComputedStyle;
	
	var titre = elInterface.getAttribute('titre');
	qs('#titre').querySelector('p').innerHTML = titre;
	
	var   _donnees = [], pos = 0, specialisation;
	
	elInterface.specialiser = (param) =>
	{
		specialisation = param;
	};
	elInterface.ajouter = ($donnees) =>
	{
		// NOTES Lot de données.
		if(arguments[1])
		{
			var argTableau = Array.prototype.slice.call(arguments);
			for(var donnee of argTableau)
			{
				// NOTES Test si les données sont valides.
				try
				{
					var autorise;
					for(var nomProp in donnee)
					{
						autorise = false;
						for(var npAutorise of specialisation.modele)
						{
							if(nomProp == npAutorise)
							{	autorise = true;	}
						}
						if(!autorise){	throw new Error('Données non valides');}
					}
				}
				catch(e){	throw new Error(e);	}
				_donnees.push(donnee);
			}
		}
	};
	
	var elGal = qs('#gallerie');
	elInterface.afficher = () =>
	{
		for(var e = 0; e < elGal.children; e++)
		{
			elGal.children[e].remove();
		}
		if(!specialisation)
		{
			throw new Error('Pas de spécialisation L92 Fgallerie.js');
		}
		else
		{
			var donneesOrdonnees = specialisation.organisateur(_donnees);
			var vignette;
			for(var i =0; i < specialisation.nombreVignette; i++)
			{
				vignette = donneesOrdonnees[i + pos];
				elGal.appendChild(specialisation.lecteur(vignette) );
			}
		}
		
	};
	return false;
};
module.exports =
{
	nom				: 'gallerie'
	,template		: template
	,constructeur	: constructeur
};