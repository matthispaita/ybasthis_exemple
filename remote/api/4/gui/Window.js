const _classe_ = nom => 'ybasthisFenetre' + nom;

export default function(options)
{
	const self = this;
	try
	{
		options = options || {};
		options.pos = options.pos || {x:0, y:0};
		options.dim = options.dim || {x:250, y:92};

		this.titre = options.titre || ybasthis.windows.titreMax++;
		this.pos = options.pos;
		this.dim = options.dim;
		this.dom = void(ybasthis.dom.desktop.appendChild(domFenetre.cloneNode(true) ) ) || ybasthis.dom.desktop.lastChild;
		this.close = () =>
		{
			this.dom.remove();
			ybasthis.windows.liste.supprimer(this);
		};
		this.dimmensionner = (x, y) =>
		{
			this.dom.style.width = x + 'px';
			this.dom.style.height = y + 'px';
		};
		this.nommer = nom =>
		{
			if(this.titre === nom) throw new Error('nommage d\'une fenêtre avec un nouveau nom identique');
			this.titre = nom || this.titre;
			this.dom.querySelector('.ybasthisFenetreTitre p').textContent = this.titre;
			
		};
		var colisionContinue = false;
		this.positionner = (x, y) =>
		{
			var colision = false;
			/*	Détection des colisions
				Logique:
					Pour chaque fenetre récupérer sa position ET sa taille
			*/
			for(var fenetre of ybasthis.windows.liste )
			{
				if((fenetre.app === this.app) && (fenetre.titre === this.titre) ) continue;
				const {pos, dim} = fenetre;
				if (((this.pos.x >= pos.x) && (this.pos.x <= pos.x + dim.x)) &&
					((this.pos.y >= pos.y) && (this.pos.y <= pos.y + dim.y)))
					colision = true;
			}
			var deplacer = true;
			if(colision)
			{
				console.log('collision');
				if(colisionContinue === false)
				{
					ybasthis.systemePointage.bloquer();
					deplacer = false;
					var x = setTimeout(() => ybasthis.systemePointage.débloquer(), 500);
				}
				colisionContinue = true;
			}
			else colisionContinue = false;
			if(deplacer)
			{
				this.pos.x = x;
				this.pos.y = y;
				this.dom.style.left = x + 'px';
				this.dom.style.top = y + 'px';
			}
					
					
		};
	(() =>
	{
		const fenetreHautDom = this.dom.querySelector('.ybasthisFenetreHaut');
		
		this.dom.addEventListener('mousedown', event => ybasthis.windows.toFirstPlan(this) );
		this.dom.querySelector('.ybasthisFenetreHaut').addEventListener('mousedown', event =>
		{
			ybasthis.windows.initialiserDéplacement(this);
		} );
		
		fenetreHautDom.addEventListener('mouseover', e => (e.target.nodeName === 'P')? ybasthis.systemePointage.changeCursor(false, 'deplacer') : void 1);
		fenetreHautDom.addEventListener('mouseout', () => ybasthis.systemePointage.changeCursor(false, 'normal') );
		const buttons = this.dom.querySelectorAll('.ybasthisFenetreHaut img');
		for(var button of buttons)
		{
			button.addEventListener('mouseover', () => ybasthis.systemePointage.changeCursor(false, 'declencher') );
			button.addEventListener('mouseout', () => ybasthis.systemePointage.changeCursor(false, 'normal') );
			
		}
		buttons[2].addEventListener('click', this.close);
	} )();
		this.positionner(this.pos.x, this.pos.y);
		this.dimmensionner(this.dim.x, this.dim.y);
		this.nommer();
		ybasthis.windows.liste.ajouter(this);
		
		let contenuDom = this.dom.querySelector('.' + _classe_('Contenu') );
		contenuDom.style.height = (ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(contenuDom).height) - 32) + 'px';
	}	
	catch(err)
	{
		console.log('errInitialisation module:	', err);
	}
};

const domFenetre = document.createElement('div');
/**
	<div>
		<div class='Haut'>
			<div class='Titre'>
				<p></p>
			</div>
			<div class='Boutons'></div>
		</div>
		<div class='Contenu'></div>
	</div>
**/
(() =>
{
	var créerElément = (el) => document.createElement(el);
	var div = () => créerElément('div');
				
	var tab = [];
	for(var i =0; i <= 1; i++) tab.push(div()	);
	for(var i =0; i <= 1; i++) tab[0].appendChild(div()	);
	
	tab[0].className = _classe_('Haut');	
	tab[0].children[0].className = _classe_('Titre');
	tab[0].children[0].appendChild(créerElément('p') );
	tab[0].children[1].className = _classe_('Boutons');
	tab[0].children[1].appendChild(créerElément('img')	);
	tab[0].children[1].appendChild(créerElément('img')	);
	tab[0].children[1].appendChild(créerElément('img')	);
	tab[0].children[1].children[0].src = './api/4/gui/images/minimiser.png';			
	tab[0].children[1].children[1].src = './api/4/gui/images/reduire.png';			
	tab[0].children[1].children[2].src = './api/4/gui/images/fermer.png';
	tab[1].className = _classe_('Contenu');
	
	Object.assign(tab[0].style,
	{
		height: 			32 + 'px',
		width: 				'100%',
		position:			'absolute',
		borderBottom:	'1px solid black'
	});
	Object.assign(tab[0].children[0].style,
	{
		position:	'absolute',
		margin:		'0px',
		height:		'100%',
		width:		'100%'
	});
	Object.assign(tab[0].children[1].style,
	{
		top:			'4px',
		position:	'absolute',
		right:		'4px'
	});
	Object.assign(tab[0].children[0].children[0].style,
	{
		verticalAlign:	'middle',
		position: 			'absolute',
		margin:					'0px',
		height:					'100%',
		width:					'100%'
	});
	Object.assign(tab[0].children[1].children[0].style,
	{
		height:		'24px',
		width:		'24px',
		right:		'8px',
		position:	'relative'
	});
	Object.assign(tab[0].children[1].children[1].style,
	{
		height: 	'24px',
		width: 		'24px',
		right: 		'4px',
		position:	'relative'
	});
	Object.assign(tab[0].children[1].children[2].style,
	{
		height: 	'24px',
		width: 		'24px',
		right: 		'0px',
		position:	'relative'
	});
	Object.assign(tab[1].style,
	{
		height:		'100%',
		top:			'32px',
		position:	'relative',
		overflow:	'auto'
	});
	Object.assign(domFenetre.style,
	{
		height:						125 + 'px',
		width:						250 + 'px',
		backgroundColor:	'#D4D4D4',
		boxShadow:				'0px 0px 9px white',
		position:					'absolute',
		borderColor:			'black',
		borderStyle:			'solid',
		borderWidth:			'1px'
	});
	for(var el of tab)
		domFenetre.appendChild(el);
})();