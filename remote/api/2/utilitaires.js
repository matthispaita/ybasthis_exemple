'use strict';
module.exports = function()
{
	const SOIS = this;
	this.compris = null;
	(() =>
	{
		const
			comprisIntervale = (intervale0, intervale1) =>
			{
				var resultat = false;
				for(var entier0 of intervale0)
					for(var entier1 of intervale1)
						if(entier0 === entier1)
						{
							resultat = true;
							break;
						}
				return resultat;
			},
			comprisIntervaleEntier = (intervale, entier1) =>
			{
				var resultat = false;
				for(var entier0 of intervale)
					if(entier0 === entier1)
					{
						resultat = true;
						break;
					}
				return resultat;
			},
			comprisEntier = (operande0, operande1) => (operande0 === operande1) ? true : false;
			
		this.compris = (operande0, operande1) =>
		{
			var resultat = null;
			if(operande0 instanceof Array)
			{
				if(operande1 instanceof Array) resultat = comprisIntervale(operande0, operande1);
				else resultat = comprisIntervaleEntier(operande0, operande1);
			}
			else if(operande1 instanceof Array) resultat = comprisIntervaleEntier(operande1, operande0);
			else resultat = comprisEntier(operande0, operande1);
			return resultat;
		};
		
	})();
	this.chaîner = valeur => (typeof valeur === 'object') ? JSON.stringify(valeur) : valeur;
	
	this.WHEN = (() =>
	{
		let listeners =	[];
		let interval =	null;
		const worker =	() =>
		{
			for (const listener of listeners)
			{
				if (listener.condition() === false)
					continue;
				listener.callback();
				listeners = listeners.filter(el => el !== listener);
				if (listeners.length == 0)
				{
					clearInterval(interval);
					interval = null;
				}
			}
		};
		return (condition, callback) =>
		{
			listeners.push({condition, callback});
			if (interval === null)
				interval = setInterval(worker, 20);
		};
	})();
	this.grandeurs =
	{
		enleverUnité : grandeur =>
		{
			grandeur = Array.prototype.slice.call(grandeur)
								.reverse();
			while (grandeur.length != 0)
			{
				if (!isNaN(Number(grandeur[0])))
					break ;
				grandeur.shift();
			}
			grandeur.reverse();
			return (parseFloat(grandeur.join('')));
		}
	};
	
	(() =>
	{
		const unités = ['px', 'em', 'cm', 'm', 'Kg', 'g', 'Hz', 'j', 'k', 'v', 'A'];
		this.grandeurs.ajouterUnité = (chaine, unité) =>
		{
			if(! unités.includes(unité) ) throw new TypeError('@unité invalide: ' + SOIS.chaîner(unité) );
			return chaine + unité;
		};
	} )();
};