	'use strict';
	const constructeur = function(selectionDomExterne)
	{
		const iRef = new ybasthis.typesDonnees.Reference;
		const index = [];
		const dom = document.createElement('div');
		
		let selectionOuverte = false;
		dom.style.zIndex = '5000';
		dom.style.position = 'absolute';
		dom.style.height = '64px';
		dom.style.backgroundColor = ybasthis.charteUi.grisClair;
		dom.style.display = 'none';
		//dom.style.border = '1px solid black';
		ybasthis.dom.desktop.appendChild(dom);
		
		selectionDomExterne.choix = index;
		selectionDomExterne.SupprimerChoix	= ref =>
		{
			index[ref].remove();
			iRef.supprimer(ref);
			return ref;
		};
		selectionDomExterne.ajouterChoix = (domElement) =>
		{
			const ref = iRef.obtenir();
			domElement.style.height = (selectionDomExterne.getBoundingClientRect().height / 2) + 'px';
			domElement.style.position = 'relative';
			domElement.style.top = '0px';
			domElement.style.margin = '0px';
			
			domElement.addEventListener('mouseover', () => domElement.style.backgroundColor = ybasthis.charteUi.grisFonce);
			domElement.addEventListener('mouseout', () => domElement.style.backgroundColor = ybasthis.charteUi.grisClair);
	
			dom.appendChild(domElement);
			
			index[ref] = dom.lastChild;
			return ref;
		};
	
		selectionDomExterne.verrouiller
		(
			(element) =>
			{
				selectionOuverte = true;
				composantDom.style.backgroundColor = ybasthis.charteUi.grisFonce;
				const infos = element.getBoundingClientRect();
				dom.style.display = 'block';
				dom.style.top = (infos.top + infos.height) + 'px';
				dom.style.left = infos.left + 'px';
				dom.style.width = infos.width + 'px';
				dom.style.height = ((infos.height / 2) * dom.children.length) + 2 + 'px';
			},
			() =>
			{
				selectionOuverte = false;
				dom.style.display = 'none';
				composantDom.style.backgroundColor = ybasthis.charteUi.grisClair;
			}
		);
		const selectionDomInterne = selectionDomExterne.shadowRoot;
		const composantDom = selectionDomInterne.querySelector('#composant');
		//composantDom.style.height = '44px';
		composantDom.style.minWidth = '4em';
		composantDom.addEventListener('mouseover', () =>
		{
			composantDom.style.backgroundColor = ybasthis.charteUi.grisFonce;
		} );
		composantDom.addEventListener('mouseout', () =>
		{
			if(!selectionOuverte) composantDom.style.backgroundColor = ybasthis.charteUi.grisClair;
			
		} );
		
		ybasthis.mutationSensor.newAsAttributes(selectionDomExterne, ['nom'], () =>
		{
			let titreDom = composantDom.querySelector('#titre'); 
			titreDom.innerHTML = selectionDomExterne.getAttribute('nom');
			//titreDom.style.width = 'auto';
			ybasthis.mutationSensor.newAsStyleExpected
			(
				titreDom,
				{
					name:			'width',
					expected:	'auto',
					isEqual:	false
				},
				() =>
				{
					let largeurRéelleTitre = ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(titreDom).width);
					let largeurRéelleSelection = ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(composantDom.querySelector('#marqueurSelection') ).width);
					composantDom.style.width = titreDom.offsetWidth + largeurRéelleSelection + 5 + 'px';
					selectionDomExterne.style.width = composantDom.style.width;
				}
			);
		});
		//console.log('ejar', selectionDomExterne, selectionDomExterne.getAttribute('nom'));
		
		let largeurOccupé = 0;
		const outilsEnleverPx = taille => void(taille = taille.split(''), taille.pop(), taille.pop() ) || Number(taille.join('') );
		for(let enfant of composantDom.children)
		{
			//console.log(enfant, enfant.offsetWidth);
			largeurOccupé += enfant.offsetWidth;
		}

		//console.log(largeurOccupé);
		//composantDom.style.width = largeurOccupé + 'px';
		
		return false;
	};
	const template =
	`
		<template>
			<div id='composant' >
				<div id='titre' ></div>
				<div id='marqueurSelection' >&#8744;</div>
			</div>
		
			<style>
				#composant
				{
					position :	relative;
					background-color : #b5b3b3;
					top: 0px;
					display: grid;
					grid-template-columns: auto 1em;
					grid-template-rows: 100%;
					grid-template-areas: "titre type";
					background-clip	:		border-box;
					border-style	:			outset;
					border-width	:			2px;
					border-collapse	:		separate;
					border-spacing	:		0px 0px;
					border-color	:			rgb(227, 227, 227);
					box-sizing	:				border-box;
					transform-box	:		border-box;
					width : auto;
					min-height : 1.5em;
				}
				#titre
				{
					position: relative;
					top: 0px;
					grid-area: titre;
					overflow: hidden;
					text-align: center;
					margin-left: 0.5em;
					margin-right: 0.5em;
					white-space: nowrap;
					font-weight : 700;
					height : auto;
				}
				#marqueurSelection
				{
					position: relative;
					top: 0px;
					grid-area: type;
					right : 0px;
					text-align: center;
					padding-top : calc(50%  - 0.7em);
					background-color : grey;
					height : auto;
				}
			</style>
		</template>`;
module.exports =
{
	nom				: 'selection',
	template		: template,
	constructeur	: constructeur
};