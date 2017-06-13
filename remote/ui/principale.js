'use strict';
import vueEspaceTravail from './espaceTravail/index.js';
import vueModules from './modules/index.js';
import vueAdministration from './administration/index.js';
import vueAutres from './autres/index.js';
export default () =>
{
	const guiEdi = new ybasthis.windows.Window({pos: {x: 10, y:110}, dim: {x: 550, y : 305}, titre: 'EDI'});
	const guiEdi2 = new ybasthis.windows.Window({pos: {x: 10, y:5}, dim: {x: 428, y : 100}, titre: 'EDI2'});
	guiEdi.dom.querySelector('.ybasthisFenetreContenu').appendChild(document.querySelector('#ediContent') );
	const espaceDeTravailDom = guiEdi.dom.querySelector('#espaceDeTravail');
	let decalage = getComputedStyle(guiEdi.dom.querySelector('#menuPrincipal') ).height;
	espaceDeTravailDom.style.top = decalage;
	espaceDeTravailDom.style.height = (ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(espaceDeTravailDom).height) - ybasthis.utilitaires.grandeurs.enleverUnité(decalage) ) + 'px';
		
	const interfaceEspaceDeTravail = document.querySelector('#espaceDeTravail');
	interfaceEspaceDeTravail.ajouter(vueEspaceTravail);
	interfaceEspaceDeTravail.ajouter(vueModules);
	interfaceEspaceDeTravail.ajouter(vueAdministration);
	interfaceEspaceDeTravail.ajouter(vueAutres);
	//	NOTE Evènements #menuPrincipal.
	(() =>
	{
		const menuElement = guiEdi.dom.querySelector('#menuPrincipal');
		menuElement.addEventListener('affichage', e =>
		{
			let {cible} = e.detail;
			if(cible === 'Espace Travail') interfaceEspaceDeTravail.afficher('espaceTravail');
			else if(cible === 'Modules') interfaceEspaceDeTravail.afficher('modules');
			else if(cible === 'Administration')  interfaceEspaceDeTravail.afficher('administration');
			else if(cible === 'Autres') interfaceEspaceDeTravail.afficher('autres');
			else throw new Error('Onglet non géré: ' + nomOnglet + '!');
		} );
		
	})();
	/**
		Test
	**/
	{
		let aaaTestDom = 
		`
			<yb-menu>
				<yb-onglet nom='Modele' type='bouton'></yb-onglet>
					<yb-onglet nom='Implémentation' ></yb-onglet>
				<yb-onglet nom='Modele' type='selection'>
					<yb-choix nom='HAHA' > </yb-choix>
					<yb-choix nom='HOHO' > </yb-choix>
					<yb-choix nom='Penis' > </yb-choix>
				</yb-onglet>
			</yb-menu>
			<yb-bouton>Test</yb-bouton>
		`;
		guiEdi2.dom.querySelector('.ybasthisFenetreContenu').innerHTML = aaaTestDom;
		//guiEdi2.dom.querySelector('.ybasthisFenetreContenu').querySelector('yb-menu').appliquerBordure();
		let espaceTravailDom = interfaceEspaceDeTravail.afficher('espaceTravail');
		let interface2 = espaceTravailDom.querySelector('yb-interface');
		//interface2.afficher('projetClasse');
	}
	{
		var kaka = [];
		document.body.lastChild.parcourirBas(zigzag => kaka.push(zigzag) );
		console.log('kaka', kaka);
		
	}
}
		
		