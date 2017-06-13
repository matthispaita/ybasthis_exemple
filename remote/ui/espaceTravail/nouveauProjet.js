'use strict';
module.exports =
{
	nom : 'nouveauProjet',
	/**
	div #conteneur
	|	div #projets
	|	|	input #nom
	|	|	input #desc
	|	div #autres
	|	|	div #aut_type
	|	|	|	p #type
	|	|	div #aut_autres
	|	|	|	yb-bouton #annuler
	|	|	|	yb-bouton #valider=
	**/
	modele :
	`
		<div id='conteneur'>
			<div id='projets'>
				<input id='nom' type='text' placeholder='Nom' />
				<input id='desc' type='text' placeholder='Description' />
			</div>
			<div id='autres'>
				<div id='aut_type'>
					<p id='type'>TYPE</p>
				</div>
				<div id='aut_autres'>
					<yb-bouton class='aut_autresBouton' id='annuler'></yb-bouton>
					<yb-bouton class='aut_autresBouton' id='valider'></yb-bouton>
				</div>
			</div>
		</div>
		<style>
			input
			{	
				  height:	50%;
			}
			#conteneur
			{
				display:					flex;
				flex-direction:		row;
				height:						100%;
				width:						100%;
				background-color:	#D4D4D4;
				position:					absolute;
			}
			#projets
			{
				display:	block;
				height:		100%;
				width:		50%;
				top:			0px;
				left:			0px;
				margin:		15px;
 				position:	relative;
			}
			#nom
			{
				  width:					50%;
				  height:					15%;
				  border-width:		1px;
				  border-style:		solid;
				  border-color:		black;
					margin-bottom:	15px;
				  position:				relative;
			}
			#desc
			{
				 height:				calc(100% - 15%);
				 width:					100%;
				 border-width:	1px;
				 border-style:	solid;
				 border-color:	black;
				 position:			relative;
			}

			
			#autres
			{
				width:		50%;
				height:		100%;
				display:	inline-block;
				position:	absolute;
				right		: 0%;
			}
			
			#aut_type
			{
				margin:						15px;
				background-color:	#D4D4D4;
				position:					absolute;
				overflow:					hidden;
				border-width:			1px;
				border-style:			solid;
				border-color:			black;
			}
			
			#aut_autres
			{
				right:		0px;
				margin:		15px;
				position:	absolute;
				overflow:	hidden;
			}

			.aut_autresBouton
			{
				position:	absolute;
				width:		100%;
			}
			#annuler
			{
				background-color:	black;	
			}
			#valider
			{
				background-color:	black;
			}
			#type
			{
				border-width:					0px;
				border-bottom-width:	1px;
				border-style:					solid;
				border-color:					black;
				position:							absolute;
			}
		</style>
	`,
	constructeur : (interfaceMère, el) =>
	{
		const qs = sel => el.querySelector(sel);
		const eu = ybasthis.utilitaires.grandeurs.enleverUnité;
		const cs = getComputedStyle;
		const val = qs('#valider');
		val.changerLabel('V');
		val.enleverEffets();
		const anu = qs('#annuler')
		anu.changerLabel('X');
		anu.enleverEffets();
		anu.addEventListener('click', () =>
		{
			interfaceMère.afficher('accueuil');
		});
		const aut_type = qs('#aut_type');
		const aut_autres = qs('#aut_autres');
		const autres_cp = cs(qs('#autres'));
		const csElCont = cs(qs('#conteneur'));
		const elProjet = qs('#projets');
	
		elProjet.style.height = (eu(csElCont.height) - 45) + 'px';
		elProjet.style.width = (eu(cs(elProjet).width) -15) + 'px';
		aut_type.style.width =
		(
			((eu(autres_cp.width) * 90)
			/ 100) - 45
		) + 'px';
		aut_type.style.height = (eu(autres_cp.height) - 45 ) + 'px';
		aut_autres.style.height = aut_type.style.height;
		aut_autres.style.width = 
		(
			((eu(autres_cp.width) * 10)
			/ 100)
		) + 'px';
		const aut_autres_cp = cs(aut_autres);
		anu.style.height = anu.style.width = aut_autres_cp.width;
		val.style.height =
		((
			eu(aut_autres_cp.height) 
			-
			eu(aut_autres_cp.width) 
		) - 15) + 'px';
		val.style.width = anu.style.width;
		val.style.top = (eu(aut_autres_cp.width) + 15) + 'px';
		
		const   desc = qs('#desc');
		const		descCs = cs(desc);
		const		nom = qs('#nom');
		nom.style.backgroundColor = ybasthis.charteUi.grisClair;
		desc.style.backgroundColor = ybasthis.charteUi.grisClair;
		desc.style.height = ((eu(cs(qs('#projets')).height) - eu(cs(nom).height) ) - 20) + 'px';
	}
};