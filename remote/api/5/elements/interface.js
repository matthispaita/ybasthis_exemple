
/**
	Une interface est un composant dom
	Fonctionnalitées:
		I	-stocker des vues
		II	-afficher une vue
		III	-garder l'état d'une vue
		IV	-appliquer une fonction lors du premier visionnage d'une vue
		V	-appliquer une fonction lors de chaque visionnage d'une vue
	
	Vue	Object
		Ensemble d'élément d'interface graphique.
		@nom				String
		@modele			HTMLElement
		@constructeur		Function(@@composantInterface, @@vueInterface) => void || Function(@@vueInterface):
			Appliqué lors du premier visionnage d'une vue
			Si retourne une fonction, elle sera appelée à chaque visionnage
			
	Attention, ne pas confondre interface applicative ou l'interface d'un objet avec un composant interface
	
	@ajouter(@@vue)
	@afficher(@@nomVue)
**/
{
	const interfaces = {};
	const constructeur = function(elInterface)
	{
		/**
			PRIVE
		**/
			const IInterfaceObjet = new ybasthis.typesDonnees.InterfaceTypée({doit:
			{
				nom: 'string', modele: 'string', constructeur: Function
			} } );
			const id = elInterface.obtenirId();
		/**
			PUBLIQUE
		**/	
		elInterface.ajouter = (vue) =>
		{
			try{ IInterfaceObjet.valider(vue); }
			catch(e)
			{
				if(e.estFormelle) throw e;
				let err = new TypeError('Interface.ajourter@vue ne correspond pas à un objet d\'interface!').lier(e);
				err.details.interfaceId = id;
				err.details.objetInterfaceReçu = vue;
				
				_ERREUR('interface.ajouter', err);
				//console.warn(err.message, err.details);
				throw err;
			}
			if(!interfaces[id][vue.nom] )
			{
				let modele = document.createElement('div');
				modele.innerHTML = vue.modele;
				
				interfaces[id][vue.nom] = { constructeur : vue.constructeur, modele, initialisé : false};
				if(vue.defaut) interfaces[id]['_defaut'] = vue.nom;
			}
		};
		elInterface.afficher = $nom =>
		{
			try
			{
				ybasthis.contrat({doit : [$nom, ['undefined', 'string'] ] } );
			}
			catch(e)
			{
				if(e.estFormelle) throw e;
				throw new TypeError('Interface.afficher@$nom doit être un string ou undefined').lier(e);
			}
			
			ybasthis.navigation.push('interface: ' + id + ' affichage: ' + $nom);
			let nom = (!$nom)? '_defaut' : $nom;
			try
			{
				ybasthis.contrat({doit : [interfaces[id][nom], 'object'] } );
			}
			catch(e)
			{
				new Error('Interface.afficher@$nom{' + nom + '} n\'existe pas dans: {' + id + '}')
			}
			
			let {modele, constructeur, initialisé, initialiseur} = interfaces[id][nom];
			/** Suppression de l'ancienne vue **/
			for(let element of elInterface.shadowRoot.children) element.remove();
			/** Ajout dans le dom de la nouvelle vue **/
			elInterface.shadowRoot.appendChild(modele);
			const vueInterface = elInterface.shadowRoot.lastChild;
			if(!initialisé)
			{
				interfaces[id][nom].initialiseur = constructeur(elInterface, vueInterface);
				interfaces[id][nom].initialisé = true;
			}
			else if(initialiseur) initialiseur(vueInterface);		
			
			return vueInterface;
		};
		elInterface.listeInterfaces = () =>
		{
			const r = [];
			for(var idInt of Object.keys(interfaces) ) r.push(interfaces[idInt] );
			return r;
		};
		/**
			CONSTRUCTEUR
		**/	
		if(!interfaces[id] ) interfaces[id] = {};
		return false;
	};

	const template = 
	`
		<template>
		</template>
	`;
	module.exports =
	{
		nom				: 'interface'
		,template		: template
		,constructeur	: constructeur
	};
}
