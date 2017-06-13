var peutIterer = obj => (obj == null)? false : (obj[Symbol.iterator] !== undefined);

var typesDonnees =
{
	// FONCTIONNEL !!!
	/*
	TESTS:
		var ref = new Reference;
		var tab = [];

		tab.push(ref.obtenir());
		tab.push(ref.obtenir());
		tab.push(ref.obtenir());
		tab.push(ref.obtenir());
		tab.push(ref.obtenir());
		tab.push('liberer:3');
		ref.liberer(3);
		tab.push(ref.obtenir());
		tab.push(ref.obtenir());
	*/
	Reference : function()
	{
		var refMax = 0;
		var refLibre = [];
		this.obtenir = () => (refLibre.length === 0) ? refMax++ : refLibre.shift();
		this.liberer = ref => (refLibre.push(ref) && false) || ref;
		this.libre = () => refLibre;
		this.taille = type =>
		{
			var r = {max: refMax, occupe: refMax - refLibre.length, libre: refLibre.length};
			return (type === 'max')? r.max : (type === 'occupe')? r.occupe : (type === 'libre')? r.libre : r;
		};
	},
	
	// 1er arrivé dernier parti
	/*
		var tab = [];
		var pile = new typesDonnees.Pile;
		tab.push(pile.ajouter('a1')	);
		tab.push(pile.ajouter('a2')	);
		tab.push(pile.ajouter('a3')	);
		tab.push(pile.ajouter('a4')	);
		tab.push(pile.lire()	);
		tab.push(pile.ajouter('a5')	);
		tab.push(pile.suivant()	);
		tab.push(pile.lire()	);
		tab.push(pile.ajouter('a6')	);
		tab.push(pile.lire()	);
		tab.push(pile.ajouter('a3')	);
		
	Attendus: Array [ "a1", "a2", "a3", "a4", "a4", "a5", "a4", "a4", "a6", "a6", "a3"]
	*/
	Pile : function()
	{
		var représentation = [];
		this.suivant = () => (représentation.pop() && false) || this.lire();
		this.ajouter = element => (représentation.push(element) && false) || element;
		this.lire = () => représentation[représentation.length - 1];
	},
	// 1er arrivé premier parti
	/*
		var tab = [];
		var file = new typesDonnees.File;
		tab.push(file.ajouter('a1')	);
		tab.push(file.ajouter('a2')	);
		tab.push(file.ajouter('a3')	);
		tab.push(file.ajouter('a4')	);
		tab.push(file.lire()	);
		tab.push(file.ajouter('a5')	);
		tab.push(file.suivant()	);
		tab.push(file.lire()	);
		tab.push(file.ajouter('a6')	);
		tab.push(pile.lire()	);
		tab.push(file.ajouter('a3')	);
		
	Attendus: Array [ "a1", "a2", "a3", "a4", "a1", "a5", "a2", "a2", "a6", "a3", "a3"]
	*/
	File : function()
	{
		var représentation = [];
		this.suivant = () => (représentation.shift() && false) || this.lire();
		this.ajouter = element => (représentation.push(element) && false) || element;
		this.lire = () => représentation[0];
	},
	// FONCTIONNEL !!!
	/*
	TESTS:
		var tab = [];
		var dic = new Dictionnaire;
		tab.push(dic.ajouter('bijour', 1));
		tab.push(dic.ajouter('tutu', 2));
		tab.push(dic.ajouter('tanteGoo', 3));
		tab.push('supprimer: tutu');
		dic.supprimer('tutu');
		tab.push(dic.ajouter('minou', 4));
		tab.push('modifier: minou');
		dic.modifier('minou', 'miaouu');
		tab.push(dic.ajouter('pede', 5));
		tab.push('contient: minou' + dic.contient('minou'));
		tab.push('contient: tutu'+ dic.contient('tutu'));
		tab.push('valeur: minou'+ dic.obtenir('minou'));
		tab.push('valeur: tanteGoo'+ dic.obtenir('tanteGoo'));
		for(var val of dic)
		{
			tab.push('forOf val:' + val);
		}
	*/
	Dictionnaire : function()
	{
		var representation = {};
		var index = new typesDonnees.Liste;
		this.taille = () => index.taille();
		this.ajouter = (cle, valeur) =>
		{
			if(representation[cle]) throw new Error('typesDonnees.Dictionnaire.ajouter@cle dejà defini:	'+cle);
			return ((representation[index.ajouter(cle)] = valeur ) && false) ||  cle;
		};
		this.modifier = (cle, valeur) =>
		{
			if(!representation[cle]) throw new Error('typesDonnees.Dictionnaire.modifier@cle non presente dans le dictionnaire:	'+ cle);
			return ((representation[cle] = valeur) && false) || valeur;
		};
		this.supprimer = cle =>
		{
			if(!representation[cle]) throw new Error('typesDonnees.Dictionnaire.supprimer@cle non presente dans le dictionnaire:	'+cle);
			return ((delete representation[cle] || index.supprimer(cle)) && false) || cle;
		};
		this.obtenir = cle =>
		{
			if(!representation[cle]) throw new Error('typesDonnees.Dictionnaire.obtenir@cle non presente dans le dictionnaire:	'+cle);
			return representation[cle];
		};
		this.contient = cle => (representation[cle])? true : false;
		this[Symbol.iterator] = function()
		{
			return {
				_iAct : 0,
				_tab : index.versTableau(),
				next: function()
				{
					var r = {done: false, value: representation[this._tab[this._iAct]	]	};
					if(this._iAct++ == this._tab.length) r.done = true;
					return r;
				}
			};
		};
	},
	// FONCTIONNEL !!!
	/*
	TESTS:
		var tab = [];
		var liste = new typesDonnees.Liste;
		tab.push(liste.ajouter('abc1'));
		tab.push(liste.ajouter('scouby2'));
		tab.push(liste.ajouter('alo3'));
		tab.push(liste.ajouter('4'));
		tab.push(liste.ajouter('55'));
		tab.push('supprimer:4');
		liste.supprimer('4');
		tab.push(liste.ajouter('win6'));
		tab.push(liste.ajouter('jey7'));
		tab.push(liste.ajouter('scou3'));
		tab.push('supprimer:jey7');
		liste.supprimer('jey7');
		tab.push('supprimer:scouby2');
		liste.supprimer('scouby2');
		tab.push(liste.ajouter('grt8'));
		tab.push(liste.ajouter('btp9'));
		tab.push(liste.ajouter('grotte10'));

		tab.push('contient scou3 :'+ liste.contient('scou3'));
		tab.push('contient scouby2 :'+ liste.contient('scouby2'));
		tab.push(liste.coercision.versTableau());
		tab.push(liste.premier());
		tab.push(liste.dernier());
	*/
	Liste : function()
	{
		var soisListe = this,
			refs = new typesDonnees.Reference,
			taille = 0,
			premier,
			deuxieme,
			dernier,
			elementVersRef = element =>
			{
				if(element === undefined) throw new Error('Liste.elementVersRef:@element === undefined');
				for(var elementL of this) if(elementL.valeur === element) return elementL.cle;
				return false;
			};
			
		this.ajouter = element =>
		{
			for(var elementT of this) if(elementT === element) throw new Error('Liste.ajouter:@element déjà présent');
			var id = refs.obtenir();
			if(!premier){premier = id;console.log('premier:'+element);}
			else if(!deuxieme) deuxieme = id;
			dernier = id;
			this[id] = element;
			taille++;
			return element;
		};
		this.premier = () => premier;
		this.dernier = () => dernier;
		this.supprimer = element =>
		{
			try
			{
				var ref = elementVersRef(element);
				if(ref || ref === 0) delete this[refs.liberer(ref)];
				else throw new Error('');
				if(premier === ref)
				{
					console.log('premier === '+element);
					premier = deuxieme || undefined;
					delete deuxieme;
				}
			}
			catch(e)
			{	throw new Error('Liste.supprimer:@element non present dans la liste:	' + element);	}
			taille--;
		};
		this.taille = () => taille;
		this.contient = element => (elementVersRef(element) && true);
		this.coercision =
		{
			versTableau : () =>
			{
				var tableau = [];
				for(var element of soisListe) tableau.push(element.valeur);
				return tableau;
			}
		};
		this[Symbol.iterator] = function()
		{
			return {
				_iAct : 0,
				_taille : refs.taille('max'),
				next: function()
				{
					//Si l'emplacement n'est pas utilise il faut en trouver un autre
					var refLibre = refs.libre();
					for(var libre of refLibre)
					{
						if(libre !== this._iAct) break;
						this._iAct++;
					}
					var r =
					{
						done: false,
						value: { valeur : soisListe[this._iAct], cle : this._iAct}
					};
					if(this._iAct++ == this._taille) r.done = true;
					return r;
				}
			};
		};
	},
	
	// FONCTIONNEL !!!
	/*
	TESTS:
		var tab = [];
		var liste = new ListeOrdonnée;
		tab.push(liste.ajouter('abc1'));
		tab.push(liste.ajouter('scouby2'));
		tab.push(liste.ajouter('alo3'));
		tab.push(liste.ajouter('4'));
		tab.push(liste.ajouter('55'));
		tab.push('supprimer:4');
		liste.supprimer('4');
		tab.push(liste.ajouter('win6'));
		tab.push(liste.ajouter('jey7'));
		tab.push(liste.ajouter('scou3'));
		tab.push('supprimer:jey7');
		liste.supprimer('jey7');
		tab.push('supprimer:scouby2');
		liste.supprimer('scouby2');
		tab.push(liste.ajouter('grt8'));
		tab.push(liste.ajouter('btp9'));
		tab.push(liste.ajouter('grotte10'));
		

		tab.push('contient scou3 :'+ liste.contient('scou3'));
		tab.push('contient scouby2 :'+ liste.contient('scouby2'));
	*/
	ListeOrdonnée : function()
	{
		var liste = new typesDonnées.Liste,
			ordre = [];
			
		this.ajouter = element => (liste.ajouter(element) !== undefined)? (ordre.push(element) && false) || element : undefined;
		this.premier = () => ordre[0];
		this.dernier = () => ordre[ordre.length - 1];
		this.supprimer = element =>
		{
			try	{	liste.supprimer(element);	}
			catch(e)
			{	throw new Error('ListeOrdonnée.supprimer:@element non present dans la liste:	' + element);	}
			delete ordre;
		};
		
		this.contient = element => liste.contient(element);
		this[Symbol.iterator] = liste[Symbol.iterator];
	},
	Reseau : function()
	{
		var sois 		= this;
		var idDispo		=	0;
		this.taille		=	()		=> idDispo;
		this.nomVersId	=	nom =>
		{
			var retour;
			for(var i = 0; i < idDispo; i++) if(sois[i].nom == nom) { retour = i; break; };/* ;; */
			
			return (retour === 0) ? retour : (retour)? retour : false;
		};
		this.obtenir		=	(nom)	=> this[this.nomVersId(nom)] || false;
		this.ajouterNoeud	=	(noeud)	=>
		{
			this[idDispo]	=	noeud;
			return idDispo++;
		};
		this.Noeud	=	function(nom, amont)
		{
			this.nom	=	nom;
			this.aval	=	[];
			this.id		=	sois.ajouterNoeud(this);
			
			if('centre' !== nom) for(var amontId of amont) sois[amontId].aval.push(this.id);
		};
		new this.Noeud('centre', [0]);
	},
	/**
		Dictionnaire ayant pour spécificiter de supporter seulement l'ajout d'entrée.
		Quand une nouvelle entrée possède la même clé qu'une entrée existante, celle-ci est modifiée.
		Ce qui permet de stocker uniquement les entrées les plus récentes.
	**/
	// FONCTIONNEL !!!
	/*
	TESTS:
		var dic = new typesDonnees.DictionnaireOrdonne;
		dic.ajouter('sobre1', 11);
		dic.ajouter('sapin2', 22);
		dic.ajouter('porte3', 33);
		dic.ajouter('chambre4', 44);
		dic.ajouter('sapin2', 55);
		dic.ajouter('placart6', 66);
		dic.ajouter('lit7', 77);
		console.log(dic.ordre()	);

		console.log('--Supp 1--');
		dic.supprimer('chambre4');
		console.log(dic.ordre()	);

		console.log('--Supp 2--');
		dic.supprimer('placartd6');
		console.log(dic.ordre()	);
	
	*/
	DictionnaireOrdonne : function()
	{
		var representation = [];
		var dico = new typesDonnees.Dictionnaire;
		var formatVoulu = (i, v) => ({id: i, valeur: v	}	);
		this.ajouter = (cle, valeur) =>
		{
			var id = representation.push(cle) - 1;
			if(dico.contient(cle)	)
			{
				delete representation[dico.obtenir(cle).id];
				dico.modifier(cle, formatVoulu(id, valeur)	);
			}
			else dico.ajouter(cle, formatVoulu(id, valeur)	);
			return cle;
		};
		this.obtenir = cle =>
		{
			try
			{
				return dico.obtenir(cle);
			}
			catch(e)
			{
				throw new Error('typesDonnees.DictionnaireOrdonne.obtenir@cle non presente dans le dictionnaire:	'+cle);
			}
		}
		this.supprimer = cle =>
		{
			if(!dico.contient(cle)	) throw new Error('DictionnaireOrdonne.supprimer@cle non utilise');
			delete representation[dico.obtenir(cle).id];
			dico.supprimer(cle);
			return cle;
		};
		this.ordre = () =>
		{
			var ordre = [];
			for(var cle of representation) if(cle !== undefined) ordre.push(dico.obtenir(cle)	);
			return ordre;
		};
	}

};


var tab = [];
		var liste = new typesDonnees.Liste;
		tab.push(liste.ajouter('abc1'));
		tab.push(liste.ajouter('scouby2'));
		tab.push(liste.ajouter('alo3'));
		tab.push(liste.ajouter('4'));
		tab.push(liste.ajouter('55'));
		tab.push('supprimer:4');
		liste.supprimer('4');
		tab.push(liste.ajouter('win6'));
		tab.push(liste.ajouter('jey7'));
		tab.push(liste.ajouter('scou3'));
		tab.push('supprimer:jey7');
		liste.supprimer('jey7');
		tab.push('supprimer:scouby2');
		liste.supprimer('scouby2');
		tab.push(liste.ajouter('grt8'));
		tab.push(liste.ajouter('btp9'));
		tab.push(liste.ajouter('grotte10'));

		tab.push('contient scou3 :'+ liste.contient('scou3'));
		tab.push('contient scouby2 :'+ liste.contient('scouby2'));
		tab.push(liste.coercision.versTableau());
		tab.push(liste.premier());
		tab.push(liste.dernier());