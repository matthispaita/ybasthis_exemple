module.exports =
{
	nom : 'projetClasse',
	modele :
	`
		<div id="editeur">
			<yb-menu>
				<yb-onglet nom='Modele' type='selection'>
					<yb-choix nom='Classe' /></yb-choix>
					<yb-choix nom='Instance' /></yb-choix>
				</yb-onglet>
				<yb-onglet nom='Implémentation' type='selection'>
					<yb-choix nom='Classe' /></yb-choix>
					<yb-choix nom='Instance' /></yb-choix>
				</yb-onglet>
				<yb-onglet nom='Rapports' type='selection'>
					<yb-choix nom='Classe' /></yb-choix>
					<yb-choix nom='Instance' /></yb-choix>
					<yb-choix nom='Généraux' /></yb-choix>
				</yb-onglet>
				<yb-onglet nom='Dépendances' type='bouton' ></yb-onglet>
			</yb-menu>
			<table id="affichage">
				<tr>
					<th class='dummy'></th>
					<th>Nom</th>
					<th>Type</th>
					<th>Force typage</th>
					<th>Porté</th>
				</tr>
				<tr>
					<td class='boutonSelectionner'>
						<yb-caseCocher />
					</td>
					<td><p>taille</p></td>
					<td><p>entier naturel</p></td>
					<td><p>statique</p></td>
					<td><p>publique</p></td>
				</tr>
				<tr>
					<td class='boutonSelectionner'>
						<yb-caseCocher />
					</td>
					<td><p>fréquence</p></td>
					<td><p>entier naturel</p></td>
					<td><p>constant</p></td>
					<td><p>privée</p></td>
				</tr>
			</table>
			<div id="editeur_edition">	</div>
		</div>
		<style>
		</style>
	`,
	constructeur : (interfaceMère, el) =>
	{
		//	RACC
		var qs = sel => el.querySelector(sel);
		//var eu = _enleverUnite;
		var cs = getComputedStyle;
	}
};