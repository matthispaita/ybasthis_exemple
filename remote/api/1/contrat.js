/**
	_contrat_( @donnée, @contrat) => undefined || Error
	Fonction privé définissant un contrat sur une donnée(i.e. identificateurs constants ou variables)
	Un contrat est un prédicat retournant une proposition.
	Le prédicat utilise une assertion pour calculer la proposition.
	L'assertion est déterminée en fonction du type du contrat(voir doc @contrat).
	La proposition est soit vraie soit une Error pour indiquer faux.
	@donnée
		Type:	tous
	@contrat
		Type:	'string' || Array || Object
			Cas:		Assertion:				Nom
			'string'	typeof					Donnée de même type
			Array		contrat || ...			Recursion sur chaque élément. Au moins une proposition doit être vraie.
			Object		instanceof				@donnée instance de @contrat
	**/
const fnContrat = module.exports = function(params)
{
	if(params.doit)
	{
		let [donnée, contrat] = params.doit;
		const genererErreur = (assertion) =>
		{
			let pileOuFace = new Error;
			pileOuFace.details = {};
			pileOuFace.message = 'La proposition du contrat est fausse';
			pileOuFace.details.attendu = contrat;
			pileOuFace.details.reçu = donnée;
			pileOuFace.details.assertion = assertion;
			return pileOuFace;
		}
		
		let proposition = false;
		if(typeof contrat === 'string')
		{
			if(typeof donnée === contrat) proposition = true;
			else throw genererErreur('type');
		}
		else if(contrat instanceof Array)
		{
			
			for(let valeurAdmise of contrat)
			{
				try
				{
					fnContrat({doit : [donnée, valeurAdmise] } );
					proposition = true;
					break;
				}
				catch(e){;;}
			}
			if(!proposition) throw genererErreur('intervale');
		}
		// Object
		else if((typeof contrat === 'object') || (contrat instanceof Object) )
		{
			if(donnée instanceof contrat) proposition = true;
			else throw genererErreur('instance');
		}
		if(proposition === true) return true;
	}
	if(params.nedoit)
	{
		throw 'Non Implémenté!';
	}
	console.log('contrat' , params);
	throw new Error('Contrat  avec paramètres invalide ou sans paramètres');
};