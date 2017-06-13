module.exports =
{
	nom : 'accueuil',
	modele :
	`
		<div id='conteneur'>
			<yb-gallerie id='projets' titre='Projets'> </yb-gallerie>
			</div>
			<div id='autres'>
				<yb-bouton id='nouveau'>Nouveau</yb-bouton>
				<yb-bouton id='gestion'>Gestion</yb-bouton>
			</div>
		</div>
		<style>
			#conteneur
			{
				width	: 100%;
				height	: 100%;
				
				display	: flex;
				flex-direction : row;
				
				background-color : #D4D4D4;
			}
			#projets
			{
				/* longeur = 50% - 2 * marge */
				width	: calc(50% - 30px);
				display	: inline-block;
				margin	: 15px;
				position: relative;
				background-color : green;
			}
			#autres
			{
				width	: 50%;
				height	: calc(100% - 30px);
				
				
				display	: inline-block;
				position: absolute;
				margin	: 15px;
				right	: 0%;
				top		: 0%;
			}
			#nouveau
			{
				width		: 25%;
				min-width : 5em;
				height	: 15%;
				top	: 25%;
				left	: 35%;
				position	: absolute;
				
			}
			#gestion
			{
				width		: 25%;
				min-width : 5em;
				height	: 15%;
				position	: absolute;
				bottom	: 25%;
				left	: 35%;
				
			}
		</style>
	`,
	constructeur : (interfaceMère, el) =>
	{
		//	RACC
		var qs = sel => el.querySelector(sel);
		var eu = ybasthis.utilitaires.grandeurs.enleverUnité;
		var cs = getComputedStyle;
		
		var elNouv = qs('#nouveau'),
			elGest = qs('#gestion'),
			elCont = qs('#conteneur'),
			elGall = qs('#projets'),
			csElAu = cs(qs('#autres'));
		elGall.style.height = (eu(cs(elCont).height) -30) + 'px';
		/*
		elGall.specialiser({
			lecteur : (data) =>
			{
				var a = document.createElement('div');
				var b = document.createElement('p');
					b.innerHTML = data.b;
				var c = document.createElement('p');
					c.innerHTML = data.c;
				a.appendChild(b);
				a.appendChild(c);
				return a;
			},
			organisateur : liste => liste,
			modele : ['b', 'c'],
			formeVignette : 'rectangle',
			nombreVignette : 4
		});
		elGall.ajouter
		(
			  {b: 'EDI', c: 'EDI pour javascript'}
			, {b: '2', c: 'z'}
			, {b: '3', c: 'e'}
			, {b: '4', c: 'r'}
			, {b: '5', c: 't'}
			, {b: '6', c: 'y'}
			, {b: '7', c: 'u'}
			, {b: '8', c: 'i'}
			, {b: '9', c: 'o'}
			, {b: '10', c: 'p'}
			, {b: '11', c: 'q'}
			, {b: '12', c: 's'}
		);
		elGall.afficher();
		*/
		var nouv = el.querySelector('#nouveau');
			nouv.addEventListener('click', () => interfaceMère.afficher('nouveauProjet') );
			
		el.querySelector('#gestion').addEventListener('click', () => interfaceMère.afficher('projetClasse') );
	}
};