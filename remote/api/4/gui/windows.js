import Window from './Window.js';
export default function()
{
		const décalagePx = {x : null, y : null};
		const déplacer = (état) =>
		{
			const pointeurPosition = ybasthis.systemePointage.position();
			switch(état)
			{
				case 'début':
					décalagePx.x = pointeurPosition.x - fenetreEnDéplacement.pos.x;
					décalagePx.y = fenetreEnDéplacement.pos.y - pointeurPosition.y;
				break;
				case 'encours':
					if(fenetreEnDéplacement)
					{
						fenetreEnDéplacement.positionner
						(
							pointeurPosition.x - décalagePx.x, 
							pointeurPosition.y + décalagePx.y
						);
					}
					else return;
				break;
				case 'fin':
					if(fenetreEnDéplacement !== undefined)
					{
						fenetreEnDéplacement = undefined;
						décalagePx.x = 0;
						décalagePx.y = 0;
					}
					else return;
				break;
			}
		}
		
		var fenetreEnDéplacement = undefined;
		var indexPremierPlan = 0;
		this.initialiserDéplacement = fenetre =>
		{
			fenetreEnDéplacement = fenetre;
			déplacer('début');
		};
		this.Window = Window;
		this.liste = new ybasthis.typesDonnees.Liste();
		this.toFirstPlan = window => window.dom.style.zIndex = indexPremierPlan++;
		ybasthis.systemePointage.quandMouvement(() => déplacer('encours') );
		document.addEventListener('mouseup', () => déplacer('fin') );
};