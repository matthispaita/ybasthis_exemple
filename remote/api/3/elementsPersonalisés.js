/**

	Une fabrique est une fonction
	Fonctionnalitées:
		I	-Ajouter un élément personnalisés
		II	-obtenir les éléments personnalisés
		III	-obtenir les fabriques
		IV	-gestion des espace de noms
	fabrique	Function
		Retourne une Fabrique
		@espaceDeNom	String
		=> Fabrique
	Fabrique Function 
		Classe pour créer des composants personnalisés HTML
		@paramètres	Object
			@nom			String
			@constructeur	Function
			@template		undefined || String
			
			
		@modele			HTMLElement
		@constructeur		Function( @@composantInterface, @@vueInterface) => void || Function( @@vueInterface):
			Appliqué lors du premier visionnage d'une vue
			Si retourne une fonction, elle sera appelée à chaque visionnage
			
	Attention, ne pas confondre interface applicative ou l'interface d'un objet avec un composant interface
	
	@ajouter(@@vue)
	@afficher(@@nomVue)
	
		NOM---------------	Fabrique
		TYPE---------------	Fonction (@paramètres) => Fonction
		BUT----------------	Création, gestion, maintenances d'éléments personnalisés HTML(i.e. CustomElement)
		
		fabrique
			@parametres	Object
				@
**/
const interpreteurHtml = (() =>
{
  const interpreteurDom = new DOMParser;
  return chaineHtml => interpreteurDom.parseFromString(chaineHtml, 'text/html');
})();

const fabrique = espaceDeNom =>
{
	ybasthis.contrat({doit : [espaceDeNom, 'string', new Error('fabrique@espaceDeNom doit être un string') ] } );
	ybasthis.contrat({doit : [fabrique.espaceDeNom[espaceDeNom], 'undefined', new Error('fabrique@espace de nom déjà utilisé') ] } );
	const dictionnaireElément = {};

	fabrique.espaceDeNom[espaceDeNom] = dictionnaireElément;
	/**
		IElement
			@nom String
			@constructeur		Function
			@template			undefined || String
	**/
	const IElement = new ybasthis.typesDonnees.InterfaceTypée
	({doit :
	{
		nom : 'string',
		constructeur : Function,
		template : ['undefined', 'string'] 
	}});
	return function(paramètres)
	{
		try{	IElement.valider(paramètres);	}
		catch(e)
		{
			if(e.estFormelle) throw e;
			throw new Error(espaceDeNom + '-fabrique@paramètres n\'implémente pas l\interface IElement');
		}
		/**
			Privé
		**/
		const soisClasseElement = this;
		const prototypeHtmlElement = Object.create(HTMLElement.prototype);
		const IntanceElementHtml = function()
		{
			if (this.attachShadow)
				this.attachShadow({mode : 'open'});
			else //deprecied
				this.createShadowRoot();
			this.shadowRoot.appendChild(soisClasseElement.modele.cloneNode(true).content);
			paramètres.constructeur(this);
		};
		/**
			Publique
		**/
		this.obtenirPrototype = () => prototypeHtmlElement;
		this.modele = null;
		/**
		  Constructeur
		**/
		(() =>
		{
		  var modeleTemporaire = interpreteurHtml(paramètres.template);
		  modeleTemporaire = modeleTemporaire.querySelector('template');
		  modeleTemporaire.innerHTML += '<style> *, *::before, *::after {box-sizing: border-box; }';
		  this.modele = modeleTemporaire;
		})();
			
		prototypeHtmlElement.createdCallback = IntanceElementHtml;
		prototypeHtmlElement.attachedCallback = function() 
		{
			/*console.log('attaché: ', this)
			ybasthis.sondeMutation.nouvelle(this);
			ybasthis.sondeMutation.nouvelle(this.shadowRoot);*/
		};
		prototypeHtmlElement.detachedCallback= function() 
		{
			console.log('détaché: ', this)
		};
		try{	fabrique.espaceDeNom[espaceDeNom][paramètres.nom] = document.registerElement(espaceDeNom + '-' + paramètres.nom, {prototype: prototypeHtmlElement} );	}
		catch(e){	throw new Error(espaceDeNom + '-fabrique: Erreur lors de l\'inscription de @nom ' + paramètres.nom).lier(e);	}		
	};
};
fabrique.espaceDeNom = {};
export default fabrique;