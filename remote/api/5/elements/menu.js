var constructeur = function(elMenu)
{
	elMenu.style.top = '0px';
	elMenu.style.position = 'relative';
	
	let iRef = new ybasthis.typesDonnees.Reference;
	const index = [];
	const menu = elMenu.shadowRoot.querySelector('#menu');
	let xDisponnible = 0;
	let baseX = menu.getBoundingClientRect().x;
	elMenu.ajouterOnglet = (domElement, avecLiaison) =>
	{
		//console.log('x dispo: ', xDisponnible);
		if(avecLiaison === undefined) avecLiaison = true;
		let ref = iRef.obtenir();
		index[ref] = domElement;
		
		domElement.style.flexGrow = 1;
		domElement.style.flexBasis = 0;
		//domElement.style.position = 'relative';
		
		menu.appendChild(domElement);
		let elementClientRect = domElement.getBoundingClientRect();
		xDisponnible += elementClientRect.width;
		//domElement.style.top = - ((iRef.taille('occupe') - 1) * elementClientRect.height) + 'px';
		//console.log(domElement.getBoundingClientRect());
		const pointeurElement = menu.lastChild;
		
		if(avecLiaison)
		{
			pointeurElement.addEventListener('click', e =>
			{
				const evenementAffichage = new CustomEvent
				(
					"affichage", {detail:{type: "utilisateur", cible: pointeurElement},	bubbles: true, cancelable: true}
				);
				menu.dispatchEvent(evenementAffichage);
			
			} );
		}
		
		return ref;
	};
	elMenu.SupprimerOnglet	= ref =>
	{
		iRef.supprimer(ref);
		let element = index[ref];
		menu.removeChild(element);
		return ref;
	};
	elMenu.onglets = index;
	
	return false;
};

var template = 
`
	<template>
		<div id='menu'></div>
		<style>
			#menu
			{
				position : relative;
				width	: auto;
				display : flex;
				top : 0px;
			}
			.menu-item
			{
				
			}
		</syle>
	</template>
`;
module.exports =
{
	nom				: 'menu',
	template		: template,
	constructeur	: constructeur
};