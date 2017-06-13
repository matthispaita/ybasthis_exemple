(() =>
{
	'use strict';
	const obtenirParent = elem =>
	{
		return (elem.parent) ?	elem.parent
			: (elem.host) ?		elem.host
			: (elem.parentNode) ?	elem.parentNode
			: (elem.offsetParent) ?	elem.offsetParent
			: false;
	};
			
	const jusquaRacine = (elem, i) =>
	{
		i = i ? i+1 : 0;
		const suite = obtenirParent(elem);
		return (!suite) ? [i, elem] : jusquaRacine(suite, i);
	};
	const trouverIdProche = (elem, i) =>
	{
		i = i ? i+1 : 0;
		var suite;
		const resultat = {};
		
		if(elem.getAttribute) resultat.id = elem.getAttribute('id');
		if(!resultat.id)
		{
			suite = obtenirParent(elem);
			if(!suite) throw new Error;
		}
		else resultat.dist = i;
		return (resultat.id) ? resultat : trouverIdProche(suite, i);
	};

	const obtenirNomTag = (elem, recur, r) =>
	{
		r = r ? r : [];
		r.push((elem.host) ? 'shadowRoot' : elem.tagName);
		recur--;
		return (!recur > 0) ? r : obtenirNomTag(obtenirParent(elem), recur, r);
	};

	HTMLElement.prototype.obtenirId = function()
	{
		const id = {};
		var idProche;
		//	NOTES Obtention le l'id le plus proche ainsi que le nb de noeud parcouru.
		try
		{	idProche = trouverIdProche(this, 0);	}
		//	NOTES Il est possible qu'aucun ID ne soit récupéré 
		//	NOTES Dans ce cas récupération des 5 premiers tag.
		//	NOTES La distance sera valué à la somme des tailles des noms des noeuds.
		catch(e)
		{
			let nomsTag = obtenirNomTag(this, 5),
				noms = [];
			for(let nom of nomsTag)
				noms.push(nom || 'undef');
			idProche = { id : noms.join(''),  dist : noms.length};
		}
		
		id.id = idProche.id;
		id.dist = idProche.dist;
		id.noeud = (this.host) ? 'shadowRoot' : this.tagName;
				
		return [id.id, id.dist, id.noeud].join('');
	};
	/**
		(quandVerrouillage, quandDévérouillage) => void
		Spécifie le verrouillage d'un élément.
		Il n'y peut y avoir deux verous en même temps si ils ne font pas partis de la même branche dom.(i.e deux élément n'ayant pas de lien de parenté)
		@quandVerrouillage(element, evenementClique) => appelé lorsque un élément est vérrouillé(il a été cliqué)
		@quandDévérouillage(element, evenementClique) appelé lorsque un élément est dévérouillé 
	**/
	var ybasthisdom = null;
	HTMLElement.prototype.verrouiller = function(quandVerrouillage, quandDévérouillage)
	{
		if(!ybasthisdom) ybasthisdom = ybasthis.dom.desktop;
		let verrouiller = false;
		
		this.addEventListener('click', e =>
		{
			if(typeof e.details !== 'object') e.details = {};
			e.details.verrouillage = this;
			
			if(verrouiller) return;
			verrouiller = true;
			quandVerrouillage(this, e);
			
			const écouteur = (ee) =>
			{
				let déverrouillage = false;
				
				if(typeof ee.details !== 'object') déverrouillage = true;
				else if(!ee.details.verrouillage) déverrouillage = true;
				else if(ee.details.verrouillage !== this) déverrouillage = true; 
			
				if(déverrouillage)
				{
					verrouiller = false;
					ybasthisdom.removeEventListener('click', écouteur, false);
					quandDévérouillage(this, ee);
				}
			};
			
			ybasthisdom.addEventListener('click', écouteur, false);
			
		});
	};
	
	HTMLElement.prototype.appliquerBordure = function()
	{
		const infos = this.getBoundingClientRect();
		const elFromPt = (x, y) => document.elementFromPoint(x, y);
		const collisions =
		{
			haut : false,
			droite : false,
			bas : false,
			gauche : false
		};
		const collisionBordure = (côté, elementTestCollision) =>
		{
			const elStyleCalculé = getComputedStyle(elementTestCollision);
			if(côté === 'haut') if(elStyleCalculé.borderTopWidth) return true;
			else if(côté === 'droite') if(elStyleCalculé.borderRightWidth) return true;
			else if(côté === 'bas') if(elStyleCalculé.borderBottomWidth) return true;
			else if(côté === 'gauche') if(elStyleCalculé.borderLeftWidth) return true;
			return false;
		};
		
		this.style.border = '1px solid black';
		// Recherche de collision
		{
			let acc = 0;
			// Haut, bas
			{
				let hautY = infos.top - 1;
				let basY = infos.bottom +1;
				let max =  infos.x + infos.width;
				for(let positionX = infos.x; positionX < max; positionX++)
				{
					if(!collisions.haut) collisions.haut = collisionBordure('haut', elFromPt(positionX, hautY), acc++);
					if(!collisions.bas) collisions.bas = collisionBordure('bas', elFromPt(positionX, basY), acc++);
					if(acc > 1) break;
				}
			}
			// Gauche, droite
			{
				let gaucheX = infos.left - 1;
				let DroiteX = infos.right +1;
				let max =  infos.Y + infos.height;
				for(let positionY = infos.y; positionY < max; positionY++)
				{
					if(!collisions.gauche) collisions.gauche = collisionBordure('gauche', elFromPt(gaucheX, positionY), acc++);
					if(!collisions.droite) collisions.droite = collisionBordure('droite', elFromPt(DroiteX, positionY), acc++);
					if(acc > 3) break;
				}
			}
		}
		//console.log('collision: ', collisions);
		// Adaptation
		if(collisions.haut)
		{
			console.log('vertPomme');
			//this.style.top = (infos.top - 1) + 'px';
		}
		if(collisions.droite) this.style.width = (infos.width + 1) + 'px';
		if(collisions.bas) this.style.height = (infos.height + 1) + 'px';
		if(collisions.gauche) this.style.left = (infos.left - 1) + 'px';
		
	};
	HTMLElement.prototype.réorganiser = function()
	{
		console.log(this.offsetHeight);
	};
	/**
	calculerTailleRéele({height : '100%'}, {height : '4em'}, {width : '0.5em'}, ...)
	@@arguments
	{ nomAttributCss : 'tailleVoulue'}
	@@Retour
	[{
		calcul	%chaine #attribut : tailleVoulue
		resultat	%entier #le résultat du calcul
	}, ..]
	**/
	HTMLElement.prototype.calculerTailleRéele = function()
	{
		const styleInitiale = getComputedStyle(this);
		const resultats = [];
		for(let arg of arguments)
		{
			let attribut = Object.keys(arg);
			this.style[attribut] = arg[attribut];
			this.réorganiser();
			/*
				Récupération du résultat avec getComputedStyle
				Puis transformation en tableau afin de pouvoir opérer facilement sur les caractères.
				But: retouner un nombre au lieu de retourner la taille suivie de l'unité en pixel.
				Suppression des deux dernieres cases du tableau, respectivement 'p' suivi de 'x'
				Retransformation du tableau en chaîne puis application du résultat à Number
			*/
			let resultat = getComputedStyle(this)[attribut].split('');
			resultat.pop();
			resultat.pop();
			resultat = Number(resultat.join('') );
			/*
				Ajout du résultat dans la lister des résultats
			*/
			resultats.push({ calcul : attribut + ':' + arg[attribut], resultat});
			/*
				Remise en place du style initial.
			*/
			this.style[attribut] = styleInitiale[attribut];
		}
		return resultats;
	};
	
	// eod => end of data
	const errRemonterEOD = {eod : true};
	HTMLElement.prototype.remonter = function()
	{
		let parent =	(this.parentNode)? this.parentNode:
							(this.parentElement)? this.parentElement:
							(this.host)? this.host : undefined;
		if(parent === undefined)
		{
			let err = new Error;
			err.details = {};
			if(this === document)
			{
				err.message = 'eod';
				err.details.eod = true;
				
			}
			else err.message ='Parent inconnu';
			
			err.details.objet = this;
			throw err;
		}
		
	};
	let ff = (ejx) =>
	{
		console.log('ejx: ', ejx);
		return false;
	};
	HTMLElement.prototype.estDansDocument = false;
	HTMLElement.prototype.obtenirStyleAuteur = function()
	{
		let styleAuteur = (this.styleSheets)? this.styleSheets : false;
		if(!styleAuteur) 
		{
			let parent =	(this.parentNode)? this.parentNode:
								(this.parentElement)? this.parentElement: false;
			if(parent.host) styleAuteur = parent.styleSheets;
			else if(parent) styleAuteur = parent.obtenirStyleAuteur();
			else
			{
				if(this.host)
				{
					if(this.host.styleSheets) styleAuteur = this.host.styleSheets;
					else throw new Error('Aucune feuille de style trouvée.');
				}
				else  throw new Error('Impossible de remonter dans la hierarchie dom.');
			}
		}
		return styleAuteur;
	};
	HTMLElement.prototype.obtenirStyleAuteurElement = function()
	{
		let styleAuteur = null;
		try
		{
			console.log('Stat: ', document.readyState);
			styleAuteur = this.obtenirStyleAuteur();
		}
		catch(e)
		{
			console.log('ErR: ', document.readyState, this, e);
			throw 'kk';
		}
		const règlesElement = [];
		for
		(
			let iFeuille = 0, nFeuillesStyles = styleAuteur.length;
			iFeuille < nFeuillesStyles;
			iFeuille++
		)
		{
			let feuilleActuelle = styleAuteur[iFeuille].cssRules;
			for
			(
				let iRègleCss = 0, nRèglesCss = feuilleActuelle.length;
				iRègleCss < nRèglesCss;
				iRègleCss++
			)
			{
					let règleCssActuelle = feuilleActuelle[iRègleCss];
				if(this.matches(règleCssActuelle.selectorText) ) règlesElement.push(règleCssActuelle);
			}
		}
		return règlesElement;	
	};
	HTMLElement.prototype.parcourirBas = ShadowRoot.prototype.parcourirBas = function(fonctionTraitrement)
	{
		const traiterEnfant = (enfant) =>
		{
			fonctionTraitrement(enfant);
			enfant.parcourirBas(fonctionTraitrement);
		};
		for(let enfant of this.children) traiterEnfant(enfant);
		if(this.shadowRoot) this.shadowRoot.parcourirBas(fonctionTraitrement);
	};

			
	{
		let HTMLColSymbIter = HTMLCollection.prototype[Symbol.iterator];
		HTMLCollection.prototype[Symbol.iterator] = (HTMLColSymbIter) ? HTMLColSymbIter : function()
		{
			let i = 0,
				 iMax = this.length,
				 sois	= this;
			return{
				next()
				{
					return{
						done : (i++ < iMax - 1) ? false : true,
						value : sois[i]
					};
				}
			};
		};
	}
	{
		let MutationRecordSymbIter = MutationRecord.prototype[Symbol.iterator];
		MutationRecord.prototype[Symbol.iterator] = (MutationRecordSymbIter) ? MutationRecordSymbIter : function()
		{
			let i = 0,
				 iMax = this.length,
				 sois	= this;
			return{
				next()
				{
					return{
						done : (i++ < iMax - 1) ? false : true,
						value : sois[i]
					};
				}
			};
		};
	}
	{
		let NodeListSymbIter = NodeList.prototype[Symbol.iterator];
		NodeList.prototype[Symbol.iterator] = (NodeListSymbIter) ? NodeListSymbIter : function()
		{
			let i = 0,
				 iMax = this.length,
				 sois	= this;
			return{
				next()
				{
					return{
						done : (i++ < iMax  - 1) ? false : true,
						value : sois[i]
					};
				}
			};
		};
	}
	
	HTMLElement.prototype.requestPointerLock = HTMLElement.prototype.requestPointerLock || HTMLElement.prototype.mozRequestPointerLock || HTMLElement.prototype.webkitRequestPointerLock;
	try
	{
		document.pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
	}
	catch(e)
	{
		;;
	}
	
	Error.prototype.lier = function(erreurLiée)
	{
		if(this.details && this.details._liaison) throw new Error('Error.prototype.lier: Erreur déjà liée');
		this.details = this.details || {};
		this.details._liaison = erreurLiée.details || {};
		this.details._liaison._message = erreurLiée.message;
		if(erreurLiée.details)
		{
			let propUtilisées = Object.keys(erreurLiée.details);
			for(let prop of propUtilisées) this.details._liaison[prop] = erreurLiée.details[prop];
		}
		return this;
	};
	Error.prototype.formelle = function()
	{
		if(!this.estDefaut) throw new Error('Error.prototype.formelle: Erreur déjà assigné').formelle();
		this.estFormelle = true;
		return this;
	};
	Error.prototype.retour = function()
	{
		if(!this.estDefaut) throw new Error('Error.prototype.formelle: Erreur déjà assigné').formelle();
		this.estRetour = true;
		return this;
	};
	Error.prototype.estFormelle = false;
	Error.prototype.estRetour = false;
	Error.prototype.estDefaut = true;
})();