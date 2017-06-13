const vueNouveauProjet = require('./nouveauProjet.js');
const vueAccueuil = require('./accueuil.js');
const vueProjetClasse = require('./projetClasse.js');

module.exports =
{
	nom : 'espaceTravail',
	modele :
	`
		<yb-interface></yb-interface>
		<style>
			yb-interface
			{
				height:100%;
				width:100%;
			}
		</style>
	`,
	constructeur : (interfaceMère, el) =>
	{
		const elInterface = el.querySelector('YB-INTERFACE');
		elInterface.ajouter(vueNouveauProjet);
		elInterface.ajouter(vueAccueuil);
		elInterface.ajouter(vueProjetClasse);
		return () =>
		{
			elInterface.afficher('accueuil');
		};
	}
};