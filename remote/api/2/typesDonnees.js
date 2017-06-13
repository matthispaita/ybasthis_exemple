export default new function()
{
	var typesDonnees = this;
	this.Reference = function()
	{
		var refMax = 0;
		const refLibre = [];
		this.obtenir = () => (refLibre.length === 0) ? refMax++ : refLibre.shift();
		this.liberer = ref => void(refLibre.push(ref)) || ref;
		this.libre = () => refLibre;
		this.taille = type =>
		{
				var r =
				{
					max: refMax,
					occupe: refMax - refLibre.length,
					libre: refLibre.length
				};
				return (type === 'max')? r.max : (type === 'occupe')? r.occupe : (type === 'libre')? r.libre : r;
		};
	};
	
	const IterateurInterneListe = function(refs, representation)
	{
		const refLibre = refs.libre(),
			  taille = refs.taille('max');
		var iActuel = 0;
			
		this.suivant = () =>
		{
			//Si l'emplacement n'est pas utilise il faut en trouver un autre
			for(var libre of refLibre)
			{
				if(libre !== iActuel) break;
				iActuel++;
			}
			var r =
			{
				done: false,
				value:  { valeur :representation[iActuel], cle : iActuel }
			};
			if(iActuel++ === taille) r.done = true;
			return r;
		};
	};
	const liste_elVersRef = (listeIterateur, element) =>
	{
		var r = null;
		while(void(r = listeIterateur.suivant()) || !r.done) if(r.value.valeur === element) return r.value.cle;
		return false;
	};
	/**
		0.0.0
		2/12/2015:
			6H10
				1ère version
	**/
	this.Liste = function()
	{
		const representation = [],
			  refs = new typesDonnees.Reference;
		var taille = 0;
		
		this.ajouter = element =>
		{
			representation[refs.obtenir()] = element;
			taille++;
			return element;
		};
		this.supprimer = element =>
		{
			var ref = null;
			try
			{
				ref = liste_elVersRef(new IterateurInterneListe(refs, representation), element);
				if(ref !== 0 && !ref) throw new Error('');
			}
			catch(e)
			{
				throw new Error('Liste.supprimer:@element non present dans la liste:	' + element);	
			}
			representation[refs.liberer(ref)] = null;
			taille--;
		};
		/**
			0.0.0
			**/
		this.taille = () => taille;
			/**
				0.0.0
			**/
		this.contient = element => (liste_elVersRef(new IterateurInterneListe(refs, representation), element) && true);
			/**
				0.0.0
			**/
		this.coercision =
		{
			versTableau : () => representation
		};
			/**
				0.0.2
					2/12/2015:
					6H10
						-Deplacement de ref libre dans l'iterateur au lieu de l'iteration
					5/12:
						-this vers privé.
						-0.0.2()
			**/
			
		this[Symbol.iterator] = function()
		{
			const iterateur = new IterateurInterneListe(refs, representation);
			return {
				next: function()
				{
					var r = iterateur.suivant();
					r.value = r.value.valeur;
					return r;
				}
			};
		};
	};
	
	(() =>
	{
		const representation = {},
			  libre = [];
		var taille = 0,
			iMax = 0;
			
		this.ListeUR2 = function()
		{
			const emplacements = [];
			this.operation = (type, element) =>
			{
				// ajout
				if(type === 0)
				{
					var id = (libre.length === 0)? iMax++ : libre.shift();
					return void
					(
						emplacements.push(id),
						representation[id] = element,
						taille++
					) || element;
				}
				// taille
				else if(type < 0) return emplacements.length;
				// suppression
				else
				{
					var id = null,
						elementPresent = false;
					for(var i = 0, nElements = emplacements.length; i < nElements; i++)
					{
						id = emplacements[i];
						if(representation[id] === element)
						{
							emplacements[0] = emplacements[i];
							elementPresent = true;
							break;
						}
					}
					if(!elementPresent) throw new Error('ListeUR.operation@type > 0: tentative de suppression d\'un élément non présent, @element: ' + element);
					return void
					(
						delete representation[id],
						libre.push(id),
						emplacements.shift(),
						taille--
					) || element;
				}
			};
			
			this.pourDe = fn =>
			{
				for(var id of emplacements) fn(representation[id] );
			};
			
			
		};
	})();
	
	this.ListeUR3 = function()
	{
		this[0b00]={0b00:[],0b01:null,0b10:0,0b11:null};
		this[0b01]=e=>this[0b00][0b000].push(e);
		this[0b10]=()=>this[0b00][0b000].length;
		this[0b11]=e =>
		{
			void(this[0b00][0b10]=0,this[0b00][0b01]=null,this[0b00][0b11]=this[0b00][0b000].length);
			while(this[0b00][0b10]<this[0b00][0b11])
			{
				if(this[0b00][0b000][this[0b00][0b10]]===e){this[0b00][0b01]=this[0b00][0b10];break;};
				this[0b00][0b10]++;
			}
			if(this[0b00][0b01]===null)throw new Error('ListeUR@element non présent dans la liste');
			this[0b00][0b000][this[0b00][0b01]]=this[0b00][0b000][0];
			this[0b00][0b000].shift();
		};
	};

	this.Dictionnaire = function()
	{
		const representation = {},
			  index = new typesDonnees.Liste;
		
		this.taille = () => index.taille();
		this.ajouter = (cle, valeur) =>
		{
			if(representation[cle]) throw new Error('typesDonnees.Dictionnaire.ajouter@cle dejà defini:	'+cle);
			return void(representation[index.ajouter(cle)] = valeur) ||  cle;
		};
		this.modifier = (cle, valeur) =>
		{
			if(!representation[cle]) throw new Error('typesDonnees.Dictionnaire.modifier@cle non presente dans le dictionnaire:	'+ cle);
			return void(representation[cle] = valeur) || valeur;
		};
		this.supprimer = cle =>
		{
			if(!representation[cle]) throw new Error('typesDonnees.Dictionnaire.supprimer@cle non presente dans le dictionnaire:	'+cle);
			return void(delete representation[cle] && index.supprimer(cle)	) || cle;
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
				_tab : index.coercision.versTableau(),
				next: function()
				{
					var r = {done: false, value: representation[this._tab[this._iAct]	]	};
					if(this._iAct++ == this._tab.length) r.done = true;
					return r;
				}
			};
		};
	};

	/**
	var aa = new ybasthis.typesDonnees.Interface(['type', 'nom', 'id']);
		var b = {type : 'géroem', nom :'jeanLuc', id: 5}
		aa.valider(b)
		
		Permet de définir la signature d'un objet.
		@signature	
			Objet:
				l'interface devra avoir la même signature que celle de l'objet
			Tableau:
				taille === 1 ET typeof valeur === Object
					clé		Le nom de la propriété
					valeur	Le contrat voir(_contrat_):
						String	=> contrat typeof
						Object	=> contrat	instanceof
						Array	=> contrat avec plusieurs signature
					
					
					tableau => interface dont la signature représente les valeurs du tableau
									chaine => le nom de la propriété
									[nomProp, type]
	**/
	this.InterfaceTypée = function(signature)
	{
		this.valider = (objet) =>
		{
			try{	ybasthis.contrat({doit : [objet, 'object'] } );	}
			catch(e){	throw new TypeError('InterfaceTypée.valider@objet n\'est pas de type Object!').formelle();	}
			
			let signatureTesté = Object.keys(objet);
			/**
				@options	Object
			**/
			// type = doit, nedoit,...
			for(let type of Object.keys(signature) )
			{
				if(type !== 'doit' && type !== 'nedoit') throw new TypeError('InterfaceTypée.valider@objet n\'est pas un contrat valide!').formelle();
				for(let nomProp of Object.keys(signature[type] ) )
				{
					if(!signatureTesté.includes(nomProp) ) throw new Error('InterfaceTypée.valider: Propriété absente: ' + nomProp);
					else
					{
						let	propriétéTestée = objet[nomProp],
								signatureTestée = signature[type][nomProp];
						try{	ybasthis.contrat({[type] : [propriétéTestée, signatureTestée] } ); }
						catch(prop)
						{
							if(prop.details.assertion === 'type')
								throw (new Error('InterfaceTypée.valider: Propriété type différent: ' + nomProp) ).lier(prop);
							else if(prop.details.assertion === 'intervale')
								throw (new Error('InterfaceTypée.valider: Propriété non comprise dans l\'intervale: ' + nomProp) ).lier(prop);
							else if(prop.details.assertion === 'instance')
								throw (new Error('InterfaceTypée.valider: Propriété classe différent: ' + nomProp) ).lier(prop);
						}
						
					}
				}
			}
			return true;
		};
	};
	this.InterfaceNonTypée = function(signature){};
};