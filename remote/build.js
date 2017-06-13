/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	var obtenirParent = function obtenirParent(elem) {
		return elem.parent ? elem.parent : elem.host ? elem.host : elem.parentNode ? elem.parentNode : elem.offsetParent ? elem.offsetParent : false;
	};

	var jusquaRacine = function jusquaRacine(elem, i) {
		i = i ? i + 1 : 0;
		var suite = obtenirParent(elem);
		return !suite ? [i, elem] : jusquaRacine(suite, i);
	};
	var trouverIdProche = function trouverIdProche(elem, i) {
		i = i ? i + 1 : 0;
		var suite;
		var resultat = {};

		if (elem.getAttribute) resultat.id = elem.getAttribute('id');
		if (!resultat.id) {
			suite = obtenirParent(elem);
			if (!suite) throw new Error();
		} else resultat.dist = i;
		return resultat.id ? resultat : trouverIdProche(suite, i);
	};

	var obtenirNomTag = function obtenirNomTag(elem, recur, r) {
		r = r ? r : [];
		r.push(elem.host ? 'shadowRoot' : elem.tagName);
		recur--;
		return !recur > 0 ? r : obtenirNomTag(obtenirParent(elem), recur, r);
	};

	HTMLElement.prototype.obtenirId = function () {
		var id = {};
		var idProche;
		//	NOTES Obtention le l'id le plus proche ainsi que le nb de noeud parcouru.
		try {
			idProche = trouverIdProche(this, 0);
		}
		//	NOTES Il est possible qu'aucun ID ne soit récupéré 
		//	NOTES Dans ce cas récupération des 5 premiers tag.
		//	NOTES La distance sera valué à la somme des tailles des noms des noeuds.
		catch (e) {
			var nomsTag = obtenirNomTag(this, 5),
			    noms = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = nomsTag[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var nom = _step.value;

					noms.push(nom || 'undef');
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			idProche = { id: noms.join(''), dist: noms.length };
		}

		id.id = idProche.id;
		id.dist = idProche.dist;
		id.noeud = this.host ? 'shadowRoot' : this.tagName;

		return [id.id, id.dist, id.noeud].join('');
	};
	/**
 	(quandVerrouillage, quandDévérouillage) => void
 	Spécifie le verrouillage d'un élément.
 	Il n'y peut y avoir deux verous en même temps si ils ne font pas partis de la même branche dom.(i.e deux élément n'ayant pas de lien de parenté)
 	@quandVerrouillage(element, evenementClique) => appelé lorsque un élément est vérrouillé(il a été cliqué)
 	@quandDévérouillage(element, evenementClique) appelé lorsque un élément est dévérouillé 
 **/
	var ybasthisdom = null;
	HTMLElement.prototype.verrouiller = function (quandVerrouillage, quandDévérouillage) {
		var _this = this;

		if (!ybasthisdom) ybasthisdom = ybasthis.dom.desktop;
		var verrouiller = false;

		this.addEventListener('click', function (e) {
			if (_typeof(e.details) !== 'object') e.details = {};
			e.details.verrouillage = _this;

			if (verrouiller) return;
			verrouiller = true;
			quandVerrouillage(_this, e);

			var écouteur = function écouteur(ee) {
				var déverrouillage = false;

				if (_typeof(ee.details) !== 'object') déverrouillage = true;else if (!ee.details.verrouillage) déverrouillage = true;else if (ee.details.verrouillage !== _this) déverrouillage = true;

				if (déverrouillage) {
					verrouiller = false;
					ybasthisdom.removeEventListener('click', écouteur, false);
					quandDévérouillage(_this, ee);
				}
			};

			ybasthisdom.addEventListener('click', écouteur, false);
		});
	};

	HTMLElement.prototype.appliquerBordure = function () {
		var infos = this.getBoundingClientRect();
		var elFromPt = function elFromPt(x, y) {
			return document.elementFromPoint(x, y);
		};
		var collisions = {
			haut: false,
			droite: false,
			bas: false,
			gauche: false
		};
		var collisionBordure = function collisionBordure(côté, elementTestCollision) {
			var elStyleCalculé = getComputedStyle(elementTestCollision);
			if (côté === 'haut') if (elStyleCalculé.borderTopWidth) return true;else if (côté === 'droite') if (elStyleCalculé.borderRightWidth) return true;else if (côté === 'bas') if (elStyleCalculé.borderBottomWidth) return true;else if (côté === 'gauche') if (elStyleCalculé.borderLeftWidth) return true;
			return false;
		};

		this.style.border = '1px solid black';
		// Recherche de collision
		{
			var acc = 0;
			// Haut, bas
			{
				var hautY = infos.top - 1;
				var basY = infos.bottom + 1;
				var max = infos.x + infos.width;
				for (var positionX = infos.x; positionX < max; positionX++) {
					if (!collisions.haut) collisions.haut = collisionBordure('haut', elFromPt(positionX, hautY), acc++);
					if (!collisions.bas) collisions.bas = collisionBordure('bas', elFromPt(positionX, basY), acc++);
					if (acc > 1) break;
				}
			}
			// Gauche, droite
			{
				var gaucheX = infos.left - 1;
				var DroiteX = infos.right + 1;
				var _max = infos.Y + infos.height;
				for (var positionY = infos.y; positionY < _max; positionY++) {
					if (!collisions.gauche) collisions.gauche = collisionBordure('gauche', elFromPt(gaucheX, positionY), acc++);
					if (!collisions.droite) collisions.droite = collisionBordure('droite', elFromPt(DroiteX, positionY), acc++);
					if (acc > 3) break;
				}
			}
		}
		//console.log('collision: ', collisions);
		// Adaptation
		if (collisions.haut) {
			console.log('vertPomme');
			//this.style.top = (infos.top - 1) + 'px';
		}
		if (collisions.droite) this.style.width = infos.width + 1 + 'px';
		if (collisions.bas) this.style.height = infos.height + 1 + 'px';
		if (collisions.gauche) this.style.left = infos.left - 1 + 'px';
	};
	HTMLElement.prototype.réorganiser = function () {
		console.log(this.offsetHeight);
	};
	/**
 calculerTailleRéele({height : '100%'}, {height : '4em'}, {width : '0.5em'}, ...)
 @@arguments
 { nomAttributCss : 'tailleVoulue'}
 @@Retour
 [{
 	calcul	%chaine #attribut : tailleVoulue
 	resultat	%entier #le résultat du calcul
 }, ..]
 **/
	HTMLElement.prototype.calculerTailleRéele = function () {
		var styleInitiale = getComputedStyle(this);
		var resultats = [];
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = arguments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var arg = _step2.value;

				var attribut = Object.keys(arg);
				this.style[attribut] = arg[attribut];
				this.réorganiser();
				/*
    	Récupération du résultat avec getComputedStyle
    	Puis transformation en tableau afin de pouvoir opérer facilement sur les caractères.
    	But: retouner un nombre au lieu de retourner la taille suivie de l'unité en pixel.
    	Suppression des deux dernieres cases du tableau, respectivement 'p' suivi de 'x'
    	Retransformation du tableau en chaîne puis application du résultat à Number
    */
				var resultat = getComputedStyle(this)[attribut].split('');
				resultat.pop();
				resultat.pop();
				resultat = Number(resultat.join(''));
				/*
    	Ajout du résultat dans la lister des résultats
    */
				resultats.push({ calcul: attribut + ':' + arg[attribut], resultat: resultat });
				/*
    	Remise en place du style initial.
    */
				this.style[attribut] = styleInitiale[attribut];
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		return resultats;
	};

	// eod => end of data
	var errRemonterEOD = { eod: true };
	HTMLElement.prototype.remonter = function () {
		var parent = this.parentNode ? this.parentNode : this.parentElement ? this.parentElement : this.host ? this.host : undefined;
		if (parent === undefined) {
			var err = new Error();
			err.details = {};
			if (this === document) {
				err.message = 'eod';
				err.details.eod = true;
			} else err.message = 'Parent inconnu';

			err.details.objet = this;
			throw err;
		}
	};
	var ff = function ff(ejx) {
		console.log('ejx: ', ejx);
		return false;
	};
	HTMLElement.prototype.estDansDocument = false;
	HTMLElement.prototype.obtenirStyleAuteur = function () {
		var styleAuteur = this.styleSheets ? this.styleSheets : false;
		if (!styleAuteur) {
			var parent = this.parentNode ? this.parentNode : this.parentElement ? this.parentElement : false;
			if (parent.host) styleAuteur = parent.styleSheets;else if (parent) styleAuteur = parent.obtenirStyleAuteur();else {
				if (this.host) {
					if (this.host.styleSheets) styleAuteur = this.host.styleSheets;else throw new Error('Aucune feuille de style trouvée.');
				} else throw new Error('Impossible de remonter dans la hierarchie dom.');
			}
		}
		return styleAuteur;
	};
	HTMLElement.prototype.obtenirStyleAuteurElement = function () {
		var styleAuteur = null;
		try {
			console.log('Stat: ', document.readyState);
			styleAuteur = this.obtenirStyleAuteur();
		} catch (e) {
			console.log('ErR: ', document.readyState, this, e);
			throw 'kk';
		}
		var règlesElement = [];
		for (var iFeuille = 0, nFeuillesStyles = styleAuteur.length; iFeuille < nFeuillesStyles; iFeuille++) {
			var feuilleActuelle = styleAuteur[iFeuille].cssRules;
			for (var iRègleCss = 0, nRèglesCss = feuilleActuelle.length; iRègleCss < nRèglesCss; iRègleCss++) {
				var règleCssActuelle = feuilleActuelle[iRègleCss];
				if (this.matches(règleCssActuelle.selectorText)) règlesElement.push(règleCssActuelle);
			}
		}
		return règlesElement;
	};
	HTMLElement.prototype.parcourirBas = ShadowRoot.prototype.parcourirBas = function (fonctionTraitrement) {
		var traiterEnfant = function traiterEnfant(enfant) {
			fonctionTraitrement(enfant);
			enfant.parcourirBas(fonctionTraitrement);
		};
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var enfant = _step3.value;
				traiterEnfant(enfant);
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		if (this.shadowRoot) this.shadowRoot.parcourirBas(fonctionTraitrement);
	};

	{
		var HTMLColSymbIter = HTMLCollection.prototype[Symbol.iterator];
		HTMLCollection.prototype[Symbol.iterator] = HTMLColSymbIter ? HTMLColSymbIter : function () {
			var i = 0,
			    iMax = this.length,
			    sois = this;
			return {
				next: function next() {
					return {
						done: i++ < iMax - 1 ? false : true,
						value: sois[i]
					};
				}
			};
		};
	}
	{
		var MutationRecordSymbIter = MutationRecord.prototype[Symbol.iterator];
		MutationRecord.prototype[Symbol.iterator] = MutationRecordSymbIter ? MutationRecordSymbIter : function () {
			var i = 0,
			    iMax = this.length,
			    sois = this;
			return {
				next: function next() {
					return {
						done: i++ < iMax - 1 ? false : true,
						value: sois[i]
					};
				}
			};
		};
	}
	{
		var NodeListSymbIter = NodeList.prototype[Symbol.iterator];
		NodeList.prototype[Symbol.iterator] = NodeListSymbIter ? NodeListSymbIter : function () {
			var i = 0,
			    iMax = this.length,
			    sois = this;
			return {
				next: function next() {
					return {
						done: i++ < iMax - 1 ? false : true,
						value: sois[i]
					};
				}
			};
		};
	}

	HTMLElement.prototype.requestPointerLock = HTMLElement.prototype.requestPointerLock || HTMLElement.prototype.mozRequestPointerLock || HTMLElement.prototype.webkitRequestPointerLock;
	try {
		document.pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
	} catch (e) {
		;;
	}

	Error.prototype.lier = function (erreurLiée) {
		if (this.details && this.details._liaison) throw new Error('Error.prototype.lier: Erreur déjà liée');
		this.details = this.details || {};
		this.details._liaison = erreurLiée.details || {};
		this.details._liaison._message = erreurLiée.message;
		if (erreurLiée.details) {
			var propUtilisées = Object.keys(erreurLiée.details);
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = propUtilisées[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var prop = _step4.value;
					this.details._liaison[prop] = erreurLiée.details[prop];
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
		return this;
	};
	Error.prototype.formelle = function () {
		if (!this.estDefaut) throw new Error('Error.prototype.formelle: Erreur déjà assigné').formelle();
		this.estFormelle = true;
		return this;
	};
	Error.prototype.retour = function () {
		if (!this.estDefaut) throw new Error('Error.prototype.formelle: Erreur déjà assigné').formelle();
		this.estRetour = true;
		return this;
	};
	Error.prototype.estFormelle = false;
	Error.prototype.estRetour = false;
	Error.prototype.estDefaut = true;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvMC9zdXJjb3VjaGVOYXRpZnMuanMiXSwibmFtZXMiOlsib2J0ZW5pclBhcmVudCIsImVsZW0iLCJwYXJlbnQiLCJob3N0IiwicGFyZW50Tm9kZSIsIm9mZnNldFBhcmVudCIsImp1c3F1YVJhY2luZSIsImkiLCJzdWl0ZSIsInRyb3V2ZXJJZFByb2NoZSIsInJlc3VsdGF0IiwiZ2V0QXR0cmlidXRlIiwiaWQiLCJFcnJvciIsImRpc3QiLCJvYnRlbmlyTm9tVGFnIiwicmVjdXIiLCJyIiwicHVzaCIsInRhZ05hbWUiLCJIVE1MRWxlbWVudCIsInByb3RvdHlwZSIsIm9idGVuaXJJZCIsImlkUHJvY2hlIiwiZSIsIm5vbXNUYWciLCJub21zIiwibm9tIiwiam9pbiIsImxlbmd0aCIsIm5vZXVkIiwieWJhc3RoaXNkb20iLCJ2ZXJyb3VpbGxlciIsInF1YW5kVmVycm91aWxsYWdlIiwicXVhbmREw6l2w6lyb3VpbGxhZ2UiLCJ5YmFzdGhpcyIsImRvbSIsImRlc2t0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiZGV0YWlscyIsInZlcnJvdWlsbGFnZSIsIsOpY291dGV1ciIsImVlIiwiZMOpdmVycm91aWxsYWdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFwcGxpcXVlckJvcmR1cmUiLCJpbmZvcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImVsRnJvbVB0IiwieCIsInkiLCJkb2N1bWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjb2xsaXNpb25zIiwiaGF1dCIsImRyb2l0ZSIsImJhcyIsImdhdWNoZSIsImNvbGxpc2lvbkJvcmR1cmUiLCJjw7R0w6kiLCJlbGVtZW50VGVzdENvbGxpc2lvbiIsImVsU3R5bGVDYWxjdWzDqSIsImdldENvbXB1dGVkU3R5bGUiLCJib3JkZXJUb3BXaWR0aCIsImJvcmRlclJpZ2h0V2lkdGgiLCJib3JkZXJCb3R0b21XaWR0aCIsImJvcmRlckxlZnRXaWR0aCIsInN0eWxlIiwiYm9yZGVyIiwiYWNjIiwiaGF1dFkiLCJ0b3AiLCJiYXNZIiwiYm90dG9tIiwibWF4Iiwid2lkdGgiLCJwb3NpdGlvblgiLCJnYXVjaGVYIiwibGVmdCIsIkRyb2l0ZVgiLCJyaWdodCIsIlkiLCJoZWlnaHQiLCJwb3NpdGlvblkiLCJjb25zb2xlIiwibG9nIiwicsOpb3JnYW5pc2VyIiwib2Zmc2V0SGVpZ2h0IiwiY2FsY3VsZXJUYWlsbGVSw6llbGUiLCJzdHlsZUluaXRpYWxlIiwicmVzdWx0YXRzIiwiYXJndW1lbnRzIiwiYXJnIiwiYXR0cmlidXQiLCJPYmplY3QiLCJrZXlzIiwic3BsaXQiLCJwb3AiLCJOdW1iZXIiLCJjYWxjdWwiLCJlcnJSZW1vbnRlckVPRCIsImVvZCIsInJlbW9udGVyIiwicGFyZW50RWxlbWVudCIsInVuZGVmaW5lZCIsImVyciIsIm1lc3NhZ2UiLCJvYmpldCIsImZmIiwiZWp4IiwiZXN0RGFuc0RvY3VtZW50Iiwib2J0ZW5pclN0eWxlQXV0ZXVyIiwic3R5bGVBdXRldXIiLCJzdHlsZVNoZWV0cyIsIm9idGVuaXJTdHlsZUF1dGV1ckVsZW1lbnQiLCJyZWFkeVN0YXRlIiwicsOoZ2xlc0VsZW1lbnQiLCJpRmV1aWxsZSIsIm5GZXVpbGxlc1N0eWxlcyIsImZldWlsbGVBY3R1ZWxsZSIsImNzc1J1bGVzIiwiaVLDqGdsZUNzcyIsIm5Sw6hnbGVzQ3NzIiwicsOoZ2xlQ3NzQWN0dWVsbGUiLCJtYXRjaGVzIiwic2VsZWN0b3JUZXh0IiwicGFyY291cmlyQmFzIiwiU2hhZG93Um9vdCIsImZvbmN0aW9uVHJhaXRyZW1lbnQiLCJ0cmFpdGVyRW5mYW50IiwiZW5mYW50IiwiY2hpbGRyZW4iLCJzaGFkb3dSb290IiwiSFRNTENvbFN5bWJJdGVyIiwiSFRNTENvbGxlY3Rpb24iLCJTeW1ib2wiLCJpdGVyYXRvciIsImlNYXgiLCJzb2lzIiwibmV4dCIsImRvbmUiLCJ2YWx1ZSIsIk11dGF0aW9uUmVjb3JkU3ltYkl0ZXIiLCJNdXRhdGlvblJlY29yZCIsIk5vZGVMaXN0U3ltYkl0ZXIiLCJOb2RlTGlzdCIsInJlcXVlc3RQb2ludGVyTG9jayIsIm1velJlcXVlc3RQb2ludGVyTG9jayIsIndlYmtpdFJlcXVlc3RQb2ludGVyTG9jayIsInBvaW50ZXJMb2NrRWxlbWVudCIsIm1velBvaW50ZXJMb2NrRWxlbWVudCIsIndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCIsImxpZXIiLCJlcnJldXJMacOpZSIsIl9saWFpc29uIiwiX21lc3NhZ2UiLCJwcm9wVXRpbGlzw6llcyIsInByb3AiLCJmb3JtZWxsZSIsImVzdERlZmF1dCIsImVzdEZvcm1lbGxlIiwicmV0b3VyIiwiZXN0UmV0b3VyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsQ0FBQyxZQUNEO0FBQ0M7O0FBQ0EsS0FBTUEsZ0JBQWdCLFNBQWhCQSxhQUFnQixPQUN0QjtBQUNDLFNBQVFDLEtBQUtDLE1BQU4sR0FBZ0JELEtBQUtDLE1BQXJCLEdBQ0hELEtBQUtFLElBQU4sR0FBZUYsS0FBS0UsSUFBcEIsR0FDQ0YsS0FBS0csVUFBTixHQUFvQkgsS0FBS0csVUFBekIsR0FDQ0gsS0FBS0ksWUFBTixHQUFzQkosS0FBS0ksWUFBM0IsR0FDQSxLQUpIO0FBS0EsRUFQRDs7QUFTQSxLQUFNQyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0wsSUFBRCxFQUFPTSxDQUFQLEVBQ3JCO0FBQ0NBLE1BQUlBLElBQUlBLElBQUUsQ0FBTixHQUFVLENBQWQ7QUFDQSxNQUFNQyxRQUFRUixjQUFjQyxJQUFkLENBQWQ7QUFDQSxTQUFRLENBQUNPLEtBQUYsR0FBVyxDQUFDRCxDQUFELEVBQUlOLElBQUosQ0FBWCxHQUF1QkssYUFBYUUsS0FBYixFQUFvQkQsQ0FBcEIsQ0FBOUI7QUFDQSxFQUxEO0FBTUEsS0FBTUUsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDUixJQUFELEVBQU9NLENBQVAsRUFDeEI7QUFDQ0EsTUFBSUEsSUFBSUEsSUFBRSxDQUFOLEdBQVUsQ0FBZDtBQUNBLE1BQUlDLEtBQUo7QUFDQSxNQUFNRSxXQUFXLEVBQWpCOztBQUVBLE1BQUdULEtBQUtVLFlBQVIs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TixDQUFnQjZJLFNBQWhCLEdBQTRCLEtBQTVCO0FBQ0FySixPQUFNUSxTQUFOLENBQWdCMEksU0FBaEIsR0FBNEIsSUFBNUI7QUFDQSxDQXpaRCIsImZpbGUiOiJzdXJjb3VjaGVOYXRpZnMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIigoKSA9PlxyXG57XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cdGNvbnN0IG9idGVuaXJQYXJlbnQgPSBlbGVtID0+XHJcblx0e1xyXG5cdFx0cmV0dXJuIChlbGVtLnBhcmVudCkgP1x0ZWxlbS5wYXJlbnRcclxuXHRcdFx0OiAoZWxlbS5ob3N0KSA/XHRcdGVsZW0uaG9zdFxyXG5cdFx0XHQ6IChlbGVtLnBhcmVudE5vZGUpID9cdGVsZW0ucGFyZW50Tm9kZVxyXG5cdFx0XHQ6IChlbGVtLm9mZnNldFBhcmVudCkgP1x0ZWxlbS5vZmZzZXRQYXJlbnRcclxuXHRcdFx0OiBmYWxzZTtcclxuXHR9O1xyXG5cdFx0XHRcclxuXHRjb25zdCBqdXNxdWFSYWNpbmUgPSAoZWxlbSwgaSkgPT5cclxuXHR7XHJcblx0XHRpID0gaSA/IGkrMSA6IDA7XHJcblx0XHRjb25zdCBzdWl0ZSA9IG9idGVuaXJQYXJlbnQoZWxlbSk7XHJcblx0XHRyZXR1cm4gKCFzdWl0ZSkgPyBbaSwgZWxlbV0gOiBqdXNxdWFSYWNpbmUoc3VpdGUsIGkpO1xyXG5cdH07XHJcblx0Y29uc3QgdHJvdXZlcklkUHJvY2hlID0gKGVsZW0sIGkpID0+XHJcblx0e1xyXG5cdFx0aSA9IGkgPyBpKzEgOiAwO1xyXG5cdFx0dmFyIHN1aXRlO1xyXG5cdFx0Y29uc3QgcmVzdWx0YXQgPSB7fTtcclxuXHRcdFxyXG5cdFx0aWYoZWxlbS5nZXRBdHRyaWJ1dGUpIHJlc3VsdGF0LmlkID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcblx0XHRpZighcmVzdWx0YXQuaWQpXHJcblx0XHR7XHJcblx0XHRcdHN1aXRlID0gb2J0ZW5pclBhcmVudChlbGVtKTtcclxuXHRcdFx0aWYoIXN1aXRlKSB0aHJvdyBuZXcgRXJyb3I7XHJcblx0XHR9XHJcblx0XHRlbHNlIHJlc3VsdGF0LmRpc3QgPSBpO1xyXG5cdFx0cmV0dXJuIChyZXN1bHRhdC5pZCkgPyByZXN1bHRhdCA6IHRyb3V2ZXJJZFByb2NoZShzdWl0ZSwgaSk7XHJcblx0fTtcclxuXHJcblx0Y29uc3Qgb2J0ZW5pck5vbVRhZyA9IChlbGVtLCByZWN1ciwgcikgPT5cclxuXHR7XHJcblx0XHRyID0gciA/IHIgOiBbXTtcclxuXHRcdHIucHVzaCgoZWxlbS5ob3N0KSA/ICdzaGFkb3dSb290JyA6IGVsZW0udGFnTmFtZSk7XHJcblx0XHRyZWN1ci0tO1xyXG5cdFx0cmV0dXJuICghcmVjdXIgPiAwKSA/IHIgOiBvYnRlbmlyTm9tVGFnKG9idGVuaXJQYXJlbnQoZWxlbSksIHJlY3VyLCByKTtcclxuXHR9O1xyXG5cclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2J0ZW5pcklkID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGNvbnN0IGlkID0ge307XHJcblx0XHR2YXIgaWRQcm9jaGU7XHJcblx0XHQvL1x0Tk9URVMgT2J0ZW50aW9uIGxlIGwnaWQgbGUgcGx1cyBwcm9jaGUgYWluc2kgcXVlIGxlIG5iIGRlIG5vZXVkIHBhcmNvdXJ1LlxyXG5cdFx0dHJ5XHJcblx0XHR7XHRpZFByb2NoZSA9IHRyb3V2ZXJJZFByb2NoZSh0aGlzLCAwKTtcdH1cclxuXHRcdC8vXHROT1RFUyBJbCBlc3QgcG9zc2libGUgcXUnYXVjdW4gSUQgbmUgc29pdCByw6ljdXDDqXLDqSBcclxuXHRcdC8vXHROT1RFUyBEYW5zIGNlIGNhcyByw6ljdXDDqXJhdGlvbiBkZXMgNSBwcmVtaWVycyB0YWcuXHJcblx0XHQvL1x0Tk9URVMgTGEgZGlzdGFuY2Ugc2VyYSB2YWx1w6kgw6AgbGEgc29tbWUgZGVzIHRhaWxsZXMgZGVzIG5vbXMgZGVzIG5vZXVkcy5cclxuXHRcdGNhdGNoKGUpXHJcblx0XHR7XHJcblx0XHRcdGxldCBub21zVGFnID0gb2J0ZW5pck5vbVRhZyh0aGlzLCA1KSxcclxuXHRcdFx0XHRub21zID0gW107XHJcblx0XHRcdGZvcihsZXQgbm9tIG9mIG5vbXNUYWcpXHJcblx0XHRcdFx0bm9tcy5wdXNoKG5vbSB8fCAndW5kZWYnKTtcclxuXHRcdFx0aWRQcm9jaGUgPSB7IGlkIDogbm9tcy5qb2luKCcnKSwgIGRpc3QgOiBub21zLmxlbmd0aH07XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlkLmlkID0gaWRQcm9jaGUuaWQ7XHJcblx0XHRpZC5kaXN0ID0gaWRQcm9jaGUuZGlzdDtcclxuXHRcdGlkLm5vZXVkID0gKHRoaXMuaG9zdCkgPyAnc2hhZG93Um9vdCcgOiB0aGlzLnRhZ05hbWU7XHJcblx0XHRcdFx0XHJcblx0XHRyZXR1cm4gW2lkLmlkLCBpZC5kaXN0LCBpZC5ub2V1ZF0uam9pbignJyk7XHJcblx0fTtcclxuXHQvKipcclxuXHRcdChxdWFuZFZlcnJvdWlsbGFnZSwgcXVhbmREw6l2w6lyb3VpbGxhZ2UpID0+IHZvaWRcclxuXHRcdFNww6ljaWZpZSBsZSB2ZXJyb3VpbGxhZ2UgZCd1biDDqWzDqW1lbnQuXHJcblx0XHRJbCBuJ3kgcGV1dCB5IGF2b2lyIGRldXggdmVyb3VzIGVuIG3Dqm1lIHRlbXBzIHNpIGlscyBuZSBmb250IHBhcyBwYXJ0aXMgZGUgbGEgbcOqbWUgYnJhbmNoZSBkb20uKGkuZSBkZXV4IMOpbMOpbWVudCBuJ2F5YW50IHBhcyBkZSBsaWVuIGRlIHBhcmVudMOpKVxyXG5cdFx0QHF1YW5kVmVycm91aWxsYWdlKGVsZW1lbnQsIGV2ZW5lbWVudENsaXF1ZSkgPT4gYXBwZWzDqSBsb3JzcXVlIHVuIMOpbMOpbWVudCBlc3QgdsOpcnJvdWlsbMOpKGlsIGEgw6l0w6kgY2xpcXXDqSlcclxuXHRcdEBxdWFuZETDqXbDqXJvdWlsbGFnZShlbGVtZW50LCBldmVuZW1lbnRDbGlxdWUpIGFwcGVsw6kgbG9yc3F1ZSB1biDDqWzDqW1lbnQgZXN0IGTDqXbDqXJvdWlsbMOpIFxyXG5cdCoqL1xyXG5cdHZhciB5YmFzdGhpc2RvbSA9IG51bGw7XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnZlcnJvdWlsbGVyID0gZnVuY3Rpb24ocXVhbmRWZXJyb3VpbGxhZ2UsIHF1YW5kRMOpdsOpcm91aWxsYWdlKVxyXG5cdHtcclxuXHRcdGlmKCF5YmFzdGhpc2RvbSkgeWJhc3RoaXNkb20gPSB5YmFzdGhpcy5kb20uZGVza3RvcDtcclxuXHRcdGxldCB2ZXJyb3VpbGxlciA9IGZhbHNlO1xyXG5cdFx0XHJcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZih0eXBlb2YgZS5kZXRhaWxzICE9PSAnb2JqZWN0JykgZS5kZXRhaWxzID0ge307XHJcblx0XHRcdGUuZGV0YWlscy52ZXJyb3VpbGxhZ2UgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYodmVycm91aWxsZXIpIHJldHVybjtcclxuXHRcdFx0dmVycm91aWxsZXIgPSB0cnVlO1xyXG5cdFx0XHRxdWFuZFZlcnJvdWlsbGFnZSh0aGlzLCBlKTtcclxuXHRcdFx0XHJcblx0XHRcdGNvbnN0IMOpY291dGV1ciA9IChlZSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBkw6l2ZXJyb3VpbGxhZ2UgPSBmYWxzZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZih0eXBlb2YgZWUuZGV0YWlscyAhPT0gJ29iamVjdCcpIGTDqXZlcnJvdWlsbGFnZSA9IHRydWU7XHJcblx0XHRcdFx0ZWxzZSBpZighZWUuZGV0YWlscy52ZXJyb3VpbGxhZ2UpIGTDqXZlcnJvdWlsbGFnZSA9IHRydWU7XHJcblx0XHRcdFx0ZWxzZSBpZihlZS5kZXRhaWxzLnZlcnJvdWlsbGFnZSAhPT0gdGhpcykgZMOpdmVycm91aWxsYWdlID0gdHJ1ZTsgXHJcblx0XHRcdFxyXG5cdFx0XHRcdGlmKGTDqXZlcnJvdWlsbGFnZSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2ZXJyb3VpbGxlciA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0eWJhc3RoaXNkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCDDqWNvdXRldXIsIGZhbHNlKTtcclxuXHRcdFx0XHRcdHF1YW5kRMOpdsOpcm91aWxsYWdlKHRoaXMsIGVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHR5YmFzdGhpc2RvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIMOpY291dGV1ciwgZmFsc2UpO1xyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH07XHJcblx0XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmFwcGxpcXVlckJvcmR1cmUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc3QgaW5mb3MgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0Y29uc3QgZWxGcm9tUHQgPSAoeCwgeSkgPT4gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcclxuXHRcdGNvbnN0IGNvbGxpc2lvbnMgPVxyXG5cdFx0e1xyXG5cdFx0XHRoYXV0IDogZmFsc2UsXHJcblx0XHRcdGRyb2l0ZSA6IGZhbHNlLFxyXG5cdFx0XHRiYXMgOiBmYWxzZSxcclxuXHRcdFx0Z2F1Y2hlIDogZmFsc2VcclxuXHRcdH07XHJcblx0XHRjb25zdCBjb2xsaXNpb25Cb3JkdXJlID0gKGPDtHTDqSwgZWxlbWVudFRlc3RDb2xsaXNpb24pID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IGVsU3R5bGVDYWxjdWzDqSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudFRlc3RDb2xsaXNpb24pO1xyXG5cdFx0XHRpZihjw7R0w6kgPT09ICdoYXV0JykgaWYoZWxTdHlsZUNhbGN1bMOpLmJvcmRlclRvcFdpZHRoKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0ZWxzZSBpZihjw7R0w6kgPT09ICdkcm9pdGUnKSBpZihlbFN0eWxlQ2FsY3Vsw6kuYm9yZGVyUmlnaHRXaWR0aCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdGVsc2UgaWYoY8O0dMOpID09PSAnYmFzJykgaWYoZWxTdHlsZUNhbGN1bMOpLmJvcmRlckJvdHRvbVdpZHRoKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0ZWxzZSBpZihjw7R0w6kgPT09ICdnYXVjaGUnKSBpZihlbFN0eWxlQ2FsY3Vsw6kuYm9yZGVyTGVmdFdpZHRoKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpcy5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIGJsYWNrJztcclxuXHRcdC8vIFJlY2hlcmNoZSBkZSBjb2xsaXNpb25cclxuXHRcdHtcclxuXHRcdFx0bGV0IGFjYyA9IDA7XHJcblx0XHRcdC8vIEhhdXQsIGJhc1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IGhhdXRZID0gaW5mb3MudG9wIC0gMTtcclxuXHRcdFx0XHRsZXQgYmFzWSA9IGluZm9zLmJvdHRvbSArMTtcclxuXHRcdFx0XHRsZXQgbWF4ID0gIGluZm9zLnggKyBpbmZvcy53aWR0aDtcclxuXHRcdFx0XHRmb3IobGV0IHBvc2l0aW9uWCA9IGluZm9zLng7IHBvc2l0aW9uWCA8IG1heDsgcG9zaXRpb25YKyspXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYoIWNvbGxpc2lvbnMuaGF1dCkgY29sbGlzaW9ucy5oYXV0ID0gY29sbGlzaW9uQm9yZHVyZSgnaGF1dCcsIGVsRnJvbVB0KHBvc2l0aW9uWCwgaGF1dFkpLCBhY2MrKyk7XHJcblx0XHRcdFx0XHRpZighY29sbGlzaW9ucy5iYXMpIGNvbGxpc2lvbnMuYmFzID0gY29sbGlzaW9uQm9yZHVyZSgnYmFzJywgZWxGcm9tUHQocG9zaXRpb25YLCBiYXNZKSwgYWNjKyspO1xyXG5cdFx0XHRcdFx0aWYoYWNjID4gMSkgYnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEdhdWNoZSwgZHJvaXRlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsZXQgZ2F1Y2hlWCA9IGluZm9zLmxlZnQgLSAxO1xyXG5cdFx0XHRcdGxldCBEcm9pdGVYID0gaW5mb3MucmlnaHQgKzE7XHJcblx0XHRcdFx0bGV0IG1heCA9ICBpbmZvcy5ZICsgaW5mb3MuaGVpZ2h0O1xyXG5cdFx0XHRcdGZvcihsZXQgcG9zaXRpb25ZID0gaW5mb3MueTsgcG9zaXRpb25ZIDwgbWF4OyBwb3NpdGlvblkrKylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZighY29sbGlzaW9ucy5nYXVjaGUpIGNvbGxpc2lvbnMuZ2F1Y2hlID0gY29sbGlzaW9uQm9yZHVyZSgnZ2F1Y2hlJywgZWxGcm9tUHQoZ2F1Y2hlWCwgcG9zaXRpb25ZKSwgYWNjKyspO1xyXG5cdFx0XHRcdFx0aWYoIWNvbGxpc2lvbnMuZHJvaXRlKSBjb2xsaXNpb25zLmRyb2l0ZSA9IGNvbGxpc2lvbkJvcmR1cmUoJ2Ryb2l0ZScsIGVsRnJvbVB0KERyb2l0ZVgsIHBvc2l0aW9uWSksIGFjYysrKTtcclxuXHRcdFx0XHRcdGlmKGFjYyA+IDMpIGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9jb25zb2xlLmxvZygnY29sbGlzaW9uOiAnLCBjb2xsaXNpb25zKTtcclxuXHRcdC8vIEFkYXB0YXRpb25cclxuXHRcdGlmKGNvbGxpc2lvbnMuaGF1dClcclxuXHRcdHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3ZlcnRQb21tZScpO1xyXG5cdFx0XHQvL3RoaXMuc3R5bGUudG9wID0gKGluZm9zLnRvcCAtIDEpICsgJ3B4JztcclxuXHRcdH1cclxuXHRcdGlmKGNvbGxpc2lvbnMuZHJvaXRlKSB0aGlzLnN0eWxlLndpZHRoID0gKGluZm9zLndpZHRoICsgMSkgKyAncHgnO1xyXG5cdFx0aWYoY29sbGlzaW9ucy5iYXMpIHRoaXMuc3R5bGUuaGVpZ2h0ID0gKGluZm9zLmhlaWdodCArIDEpICsgJ3B4JztcclxuXHRcdGlmKGNvbGxpc2lvbnMuZ2F1Y2hlKSB0aGlzLnN0eWxlLmxlZnQgPSAoaW5mb3MubGVmdCAtIDEpICsgJ3B4JztcclxuXHRcdFxyXG5cdH07XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnLDqW9yZ2FuaXNlciA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLm9mZnNldEhlaWdodCk7XHJcblx0fTtcclxuXHQvKipcclxuXHRjYWxjdWxlclRhaWxsZVLDqWVsZSh7aGVpZ2h0IDogJzEwMCUnfSwge2hlaWdodCA6ICc0ZW0nfSwge3dpZHRoIDogJzAuNWVtJ30sIC4uLilcclxuXHRAQGFyZ3VtZW50c1xyXG5cdHsgbm9tQXR0cmlidXRDc3MgOiAndGFpbGxlVm91bHVlJ31cclxuXHRAQFJldG91clxyXG5cdFt7XHJcblx0XHRjYWxjdWxcdCVjaGFpbmUgI2F0dHJpYnV0IDogdGFpbGxlVm91bHVlXHJcblx0XHRyZXN1bHRhdFx0JWVudGllciAjbGUgcsOpc3VsdGF0IGR1IGNhbGN1bFxyXG5cdH0sIC4uXVxyXG5cdCoqL1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jYWxjdWxlclRhaWxsZVLDqWVsZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRjb25zdCBzdHlsZUluaXRpYWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKTtcclxuXHRcdGNvbnN0IHJlc3VsdGF0cyA9IFtdO1xyXG5cdFx0Zm9yKGxldCBhcmcgb2YgYXJndW1lbnRzKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgYXR0cmlidXQgPSBPYmplY3Qua2V5cyhhcmcpO1xyXG5cdFx0XHR0aGlzLnN0eWxlW2F0dHJpYnV0XSA9IGFyZ1thdHRyaWJ1dF07XHJcblx0XHRcdHRoaXMucsOpb3JnYW5pc2VyKCk7XHJcblx0XHRcdC8qXHJcblx0XHRcdFx0UsOpY3Vww6lyYXRpb24gZHUgcsOpc3VsdGF0IGF2ZWMgZ2V0Q29tcHV0ZWRTdHlsZVxyXG5cdFx0XHRcdFB1aXMgdHJhbnNmb3JtYXRpb24gZW4gdGFibGVhdSBhZmluIGRlIHBvdXZvaXIgb3DDqXJlciBmYWNpbGVtZW50IHN1ciBsZXMgY2FyYWN0w6hyZXMuXHJcblx0XHRcdFx0QnV0OiByZXRvdW5lciB1biBub21icmUgYXUgbGlldSBkZSByZXRvdXJuZXIgbGEgdGFpbGxlIHN1aXZpZSBkZSBsJ3VuaXTDqSBlbiBwaXhlbC5cclxuXHRcdFx0XHRTdXBwcmVzc2lvbiBkZXMgZGV1eCBkZXJuaWVyZXMgY2FzZXMgZHUgdGFibGVhdSwgcmVzcGVjdGl2ZW1lbnQgJ3AnIHN1aXZpIGRlICd4J1xyXG5cdFx0XHRcdFJldHJhbnNmb3JtYXRpb24gZHUgdGFibGVhdSBlbiBjaGHDrm5lIHB1aXMgYXBwbGljYXRpb24gZHUgcsOpc3VsdGF0IMOgIE51bWJlclxyXG5cdFx0XHQqL1xyXG5cdFx0XHRsZXQgcmVzdWx0YXQgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMpW2F0dHJpYnV0XS5zcGxpdCgnJyk7XHJcblx0XHRcdHJlc3VsdGF0LnBvcCgpO1xyXG5cdFx0XHRyZXN1bHRhdC5wb3AoKTtcclxuXHRcdFx0cmVzdWx0YXQgPSBOdW1iZXIocmVzdWx0YXQuam9pbignJykgKTtcclxuXHRcdFx0LypcclxuXHRcdFx0XHRBam91dCBkdSByw6lzdWx0YXQgZGFucyBsYSBsaXN0ZXIgZGVzIHLDqXN1bHRhdHNcclxuXHRcdFx0Ki9cclxuXHRcdFx0cmVzdWx0YXRzLnB1c2goeyBjYWxjdWwgOiBhdHRyaWJ1dCArICc6JyArIGFyZ1thdHRyaWJ1dF0sIHJlc3VsdGF0fSk7XHJcblx0XHRcdC8qXHJcblx0XHRcdFx0UmVtaXNlIGVuIHBsYWNlIGR1IHN0eWxlIGluaXRpYWwuXHJcblx0XHRcdCovXHJcblx0XHRcdHRoaXMuc3R5bGVbYXR0cmlidXRdID0gc3R5bGVJbml0aWFsZVthdHRyaWJ1dF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0YXRzO1xyXG5cdH07XHJcblx0XHJcblx0Ly8gZW9kID0+IGVuZCBvZiBkYXRhXHJcblx0Y29uc3QgZXJyUmVtb250ZXJFT0QgPSB7ZW9kIDogdHJ1ZX07XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnJlbW9udGVyID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGxldCBwYXJlbnQgPVx0KHRoaXMucGFyZW50Tm9kZSk/IHRoaXMucGFyZW50Tm9kZTpcclxuXHRcdFx0XHRcdFx0XHQodGhpcy5wYXJlbnRFbGVtZW50KT8gdGhpcy5wYXJlbnRFbGVtZW50OlxyXG5cdFx0XHRcdFx0XHRcdCh0aGlzLmhvc3QpPyB0aGlzLmhvc3QgOiB1bmRlZmluZWQ7XHJcblx0XHRpZihwYXJlbnQgPT09IHVuZGVmaW5lZClcclxuXHRcdHtcclxuXHRcdFx0bGV0IGVyciA9IG5ldyBFcnJvcjtcclxuXHRcdFx0ZXJyLmRldGFpbHMgPSB7fTtcclxuXHRcdFx0aWYodGhpcyA9PT0gZG9jdW1lbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRlcnIubWVzc2FnZSA9ICdlb2QnO1xyXG5cdFx0XHRcdGVyci5kZXRhaWxzLmVvZCA9IHRydWU7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBlcnIubWVzc2FnZSA9J1BhcmVudCBpbmNvbm51JztcclxuXHRcdFx0XHJcblx0XHRcdGVyci5kZXRhaWxzLm9iamV0ID0gdGhpcztcclxuXHRcdFx0dGhyb3cgZXJyO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fTtcclxuXHRsZXQgZmYgPSAoZWp4KSA9PlxyXG5cdHtcclxuXHRcdGNvbnNvbGUubG9nKCdlang6ICcsIGVqeCk7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuZXN0RGFuc0RvY3VtZW50ID0gZmFsc2U7XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLm9idGVuaXJTdHlsZUF1dGV1ciA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRsZXQgc3R5bGVBdXRldXIgPSAodGhpcy5zdHlsZVNoZWV0cyk/IHRoaXMuc3R5bGVTaGVldHMgOiBmYWxzZTtcclxuXHRcdGlmKCFzdHlsZUF1dGV1cikgXHJcblx0XHR7XHJcblx0XHRcdGxldCBwYXJlbnQgPVx0KHRoaXMucGFyZW50Tm9kZSk/IHRoaXMucGFyZW50Tm9kZTpcclxuXHRcdFx0XHRcdFx0XHRcdCh0aGlzLnBhcmVudEVsZW1lbnQpPyB0aGlzLnBhcmVudEVsZW1lbnQ6IGZhbHNlO1xyXG5cdFx0XHRpZihwYXJlbnQuaG9zdCkgc3R5bGVBdXRldXIgPSBwYXJlbnQuc3R5bGVTaGVldHM7XHJcblx0XHRcdGVsc2UgaWYocGFyZW50KSBzdHlsZUF1dGV1ciA9IHBhcmVudC5vYnRlbmlyU3R5bGVBdXRldXIoKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYodGhpcy5ob3N0KVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmKHRoaXMuaG9zdC5zdHlsZVNoZWV0cykgc3R5bGVBdXRldXIgPSB0aGlzLmhvc3Quc3R5bGVTaGVldHM7XHJcblx0XHRcdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcignQXVjdW5lIGZldWlsbGUgZGUgc3R5bGUgdHJvdXbDqWUuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgIHRocm93IG5ldyBFcnJvcignSW1wb3NzaWJsZSBkZSByZW1vbnRlciBkYW5zIGxhIGhpZXJhcmNoaWUgZG9tLicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc3R5bGVBdXRldXI7XHJcblx0fTtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2J0ZW5pclN0eWxlQXV0ZXVyRWxlbWVudCA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRsZXQgc3R5bGVBdXRldXIgPSBudWxsO1xyXG5cdFx0dHJ5XHJcblx0XHR7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdTdGF0OiAnLCBkb2N1bWVudC5yZWFkeVN0YXRlKTtcclxuXHRcdFx0c3R5bGVBdXRldXIgPSB0aGlzLm9idGVuaXJTdHlsZUF1dGV1cigpO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZSlcclxuXHRcdHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0VyUjogJywgZG9jdW1lbnQucmVhZHlTdGF0ZSwgdGhpcywgZSk7XHJcblx0XHRcdHRocm93ICdrayc7XHJcblx0XHR9XHJcblx0XHRjb25zdCByw6hnbGVzRWxlbWVudCA9IFtdO1xyXG5cdFx0Zm9yXHJcblx0XHQoXHJcblx0XHRcdGxldCBpRmV1aWxsZSA9IDAsIG5GZXVpbGxlc1N0eWxlcyA9IHN0eWxlQXV0ZXVyLmxlbmd0aDtcclxuXHRcdFx0aUZldWlsbGUgPCBuRmV1aWxsZXNTdHlsZXM7XHJcblx0XHRcdGlGZXVpbGxlKytcclxuXHRcdClcclxuXHRcdHtcclxuXHRcdFx0bGV0IGZldWlsbGVBY3R1ZWxsZSA9IHN0eWxlQXV0ZXVyW2lGZXVpbGxlXS5jc3NSdWxlcztcclxuXHRcdFx0Zm9yXHJcblx0XHRcdChcclxuXHRcdFx0XHRsZXQgaVLDqGdsZUNzcyA9IDAsIG5Sw6hnbGVzQ3NzID0gZmV1aWxsZUFjdHVlbGxlLmxlbmd0aDtcclxuXHRcdFx0XHRpUsOoZ2xlQ3NzIDwgblLDqGdsZXNDc3M7XHJcblx0XHRcdFx0aVLDqGdsZUNzcysrXHJcblx0XHRcdClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFx0bGV0IHLDqGdsZUNzc0FjdHVlbGxlID0gZmV1aWxsZUFjdHVlbGxlW2lSw6hnbGVDc3NdO1xyXG5cdFx0XHRcdGlmKHRoaXMubWF0Y2hlcyhyw6hnbGVDc3NBY3R1ZWxsZS5zZWxlY3RvclRleHQpICkgcsOoZ2xlc0VsZW1lbnQucHVzaChyw6hnbGVDc3NBY3R1ZWxsZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByw6hnbGVzRWxlbWVudDtcdFxyXG5cdH07XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnBhcmNvdXJpckJhcyA9IFNoYWRvd1Jvb3QucHJvdG90eXBlLnBhcmNvdXJpckJhcyA9IGZ1bmN0aW9uKGZvbmN0aW9uVHJhaXRyZW1lbnQpXHJcblx0e1xyXG5cdFx0Y29uc3QgdHJhaXRlckVuZmFudCA9IChlbmZhbnQpID0+XHJcblx0XHR7XHJcblx0XHRcdGZvbmN0aW9uVHJhaXRyZW1lbnQoZW5mYW50KTtcclxuXHRcdFx0ZW5mYW50LnBhcmNvdXJpckJhcyhmb25jdGlvblRyYWl0cmVtZW50KTtcclxuXHRcdH07XHJcblx0XHRmb3IobGV0IGVuZmFudCBvZiB0aGlzLmNoaWxkcmVuKSB0cmFpdGVyRW5mYW50KGVuZmFudCk7XHJcblx0XHRpZih0aGlzLnNoYWRvd1Jvb3QpIHRoaXMuc2hhZG93Um9vdC5wYXJjb3VyaXJCYXMoZm9uY3Rpb25UcmFpdHJlbWVudCk7XHJcblx0fTtcclxuXHJcblx0XHRcdFxyXG5cdHtcclxuXHRcdGxldCBIVE1MQ29sU3ltYkl0ZXIgPSBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXTtcclxuXHRcdEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gKEhUTUxDb2xTeW1iSXRlcikgPyBIVE1MQ29sU3ltYkl0ZXIgOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGxldCBpID0gMCxcclxuXHRcdFx0XHQgaU1heCA9IHRoaXMubGVuZ3RoLFxyXG5cdFx0XHRcdCBzb2lzXHQ9IHRoaXM7XHJcblx0XHRcdHJldHVybntcclxuXHRcdFx0XHRuZXh0KClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0XHRcdGRvbmUgOiAoaSsrIDwgaU1heCAtIDEpID8gZmFsc2UgOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA6IHNvaXNbaV1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fTtcclxuXHR9XHJcblx0e1xyXG5cdFx0bGV0IE11dGF0aW9uUmVjb3JkU3ltYkl0ZXIgPSBNdXRhdGlvblJlY29yZC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXTtcclxuXHRcdE11dGF0aW9uUmVjb3JkLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gKE11dGF0aW9uUmVjb3JkU3ltYkl0ZXIpID8gTXV0YXRpb25SZWNvcmRTeW1iSXRlciA6IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0bGV0IGkgPSAwLFxyXG5cdFx0XHRcdCBpTWF4ID0gdGhpcy5sZW5ndGgsXHJcblx0XHRcdFx0IHNvaXNcdD0gdGhpcztcclxuXHRcdFx0cmV0dXJue1xyXG5cdFx0XHRcdG5leHQoKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybntcclxuXHRcdFx0XHRcdFx0ZG9uZSA6IChpKysgPCBpTWF4IC0gMSkgPyBmYWxzZSA6IHRydWUsXHJcblx0XHRcdFx0XHRcdHZhbHVlIDogc29pc1tpXVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH1cclxuXHR7XHJcblx0XHRsZXQgTm9kZUxpc3RTeW1iSXRlciA9IE5vZGVMaXN0LnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xyXG5cdFx0Tm9kZUxpc3QucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSAoTm9kZUxpc3RTeW1iSXRlcikgPyBOb2RlTGlzdFN5bWJJdGVyIDogZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgaSA9IDAsXHJcblx0XHRcdFx0IGlNYXggPSB0aGlzLmxlbmd0aCxcclxuXHRcdFx0XHQgc29pc1x0PSB0aGlzO1xyXG5cdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0bmV4dCgpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJue1xyXG5cdFx0XHRcdFx0XHRkb25lIDogKGkrKyA8IGlNYXggIC0gMSkgPyBmYWxzZSA6IHRydWUsXHJcblx0XHRcdFx0XHRcdHZhbHVlIDogc29pc1tpXVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucmVxdWVzdFBvaW50ZXJMb2NrID0gSFRNTEVsZW1lbnQucHJvdG90eXBlLnJlcXVlc3RQb2ludGVyTG9jayB8fCBIVE1MRWxlbWVudC5wcm90b3R5cGUubW96UmVxdWVzdFBvaW50ZXJMb2NrIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZS53ZWJraXRSZXF1ZXN0UG9pbnRlckxvY2s7XHJcblx0dHJ5XHJcblx0e1xyXG5cdFx0ZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ID0gZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50IHx8IGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudCB8fCBkb2N1bWVudC53ZWJraXRQb2ludGVyTG9ja0VsZW1lbnQ7XHJcblx0fVxyXG5cdGNhdGNoKGUpXHJcblx0e1xyXG5cdFx0OztcclxuXHR9XHJcblx0XHJcblx0RXJyb3IucHJvdG90eXBlLmxpZXIgPSBmdW5jdGlvbihlcnJldXJMacOpZSlcclxuXHR7XHJcblx0XHRpZih0aGlzLmRldGFpbHMgJiYgdGhpcy5kZXRhaWxzLl9saWFpc29uKSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yLnByb3RvdHlwZS5saWVyOiBFcnJldXIgZMOpasOgIGxpw6llJyk7XHJcblx0XHR0aGlzLmRldGFpbHMgPSB0aGlzLmRldGFpbHMgfHwge307XHJcblx0XHR0aGlzLmRldGFpbHMuX2xpYWlzb24gPSBlcnJldXJMacOpZS5kZXRhaWxzIHx8IHt9O1xyXG5cdFx0dGhpcy5kZXRhaWxzLl9saWFpc29uLl9tZXNzYWdlID0gZXJyZXVyTGnDqWUubWVzc2FnZTtcclxuXHRcdGlmKGVycmV1ckxpw6llLmRldGFpbHMpXHJcblx0XHR7XHJcblx0XHRcdGxldCBwcm9wVXRpbGlzw6llcyA9IE9iamVjdC5rZXlzKGVycmV1ckxpw6llLmRldGFpbHMpO1xyXG5cdFx0XHRmb3IobGV0IHByb3Agb2YgcHJvcFV0aWxpc8OpZXMpIHRoaXMuZGV0YWlscy5fbGlhaXNvbltwcm9wXSA9IGVycmV1ckxpw6llLmRldGFpbHNbcHJvcF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cdEVycm9yLnByb3RvdHlwZS5mb3JtZWxsZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRpZighdGhpcy5lc3REZWZhdXQpIHRocm93IG5ldyBFcnJvcignRXJyb3IucHJvdG90eXBlLmZvcm1lbGxlOiBFcnJldXIgZMOpasOgIGFzc2lnbsOpJykuZm9ybWVsbGUoKTtcclxuXHRcdHRoaXMuZXN0Rm9ybWVsbGUgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHRFcnJvci5wcm90b3R5cGUucmV0b3VyID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGlmKCF0aGlzLmVzdERlZmF1dCkgdGhyb3cgbmV3IEVycm9yKCdFcnJvci5wcm90b3R5cGUuZm9ybWVsbGU6IEVycmV1ciBkw6lqw6AgYXNzaWduw6knKS5mb3JtZWxsZSgpO1xyXG5cdFx0dGhpcy5lc3RSZXRvdXIgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHRFcnJvci5wcm90b3R5cGUuZXN0Rm9ybWVsbGUgPSBmYWxzZTtcclxuXHRFcnJvci5wcm90b3R5cGUuZXN0UmV0b3VyID0gZmFsc2U7XHJcblx0RXJyb3IucHJvdG90eXBlLmVzdERlZmF1dCA9IHRydWU7XHJcbn0pKCk7Il19

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var fnContrat = module.exports = function (params) {
	if (params.doit) {
		var _params$doit = _slicedToArray(params.doit, 2),
		    donnée = _params$doit[0],
		    contrat = _params$doit[1];

		var genererErreur = function genererErreur(assertion) {
			var pileOuFace = new Error();
			pileOuFace.details = {};
			pileOuFace.message = 'La proposition du contrat est fausse';
			pileOuFace.details.attendu = contrat;
			pileOuFace.details.reçu = donnée;
			pileOuFace.details.assertion = assertion;
			return pileOuFace;
		};

		var proposition = false;
		if (typeof contrat === 'string') {
			if ((typeof donnée === 'undefined' ? 'undefined' : _typeof(donnée)) === contrat) proposition = true;else throw genererErreur('type');
		} else if (contrat instanceof Array) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {

				for (var _iterator = contrat[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var valeurAdmise = _step.value;

					try {
						fnContrat({ doit: [donnée, valeurAdmise] });
						proposition = true;
						break;
					} catch (e) {
						;;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (!proposition) throw genererErreur('intervale');
		}
		// Object
		else if ((typeof contrat === 'undefined' ? 'undefined' : _typeof(contrat)) === 'object' || contrat instanceof Object) {
				if (donnée instanceof contrat) proposition = true;else throw genererErreur('instance');
			}
		if (proposition === true) return true;
	}
	if (params.nedoit) {
		throw 'Non Implémenté!';
	}
	console.log('contrat', params);
	throw new Error('Contrat  avec paramètres invalide ou sans paramètres');
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvMS9jb250cmF0LmpzIl0sIm5hbWVzIjpbImZuQ29udHJhdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJwYXJhbXMiLCJkb2l0IiwiZG9ubsOpZSIsImNvbnRyYXQiLCJnZW5lcmVyRXJyZXVyIiwiYXNzZXJ0aW9uIiwicGlsZU91RmFjZSIsIkVycm9yIiwiZGV0YWlscyIsIm1lc3NhZ2UiLCJhdHRlbmR1IiwicmXDp3UiLCJwcm9wb3NpdGlvbiIsIkFycmF5IiwidmFsZXVyQWRtaXNlIiwiZSIsIk9iamVjdCIsIm5lZG9pdCIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLElBQU1BLFlBQVlDLE9BQU9DLE9BQVAsR0FBaUIsVUFBU0MsTUFBVCxFQUNuQztBQUNDLEtBQUdBLE9BQU9DLElBQVYsRUFDQTtBQUFBLG9DQUN5QkQsT0FBT0MsSUFEaEM7QUFBQSxNQUNNQyxNQUROO0FBQUEsTUFDY0MsT0FEZDs7QUFFQyxNQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLFNBQUQsRUFDdEI7QUFDQyxPQUFJQyxhQUFhLElBQUlDLEtBQUosRUFBakI7QUFDQUQsY0FBV0UsT0FBWCxHQUFxQixFQUFyQjtBQUNBRixjQUFXRyxPQUFYLEdBQXFCLHNDQUFyQjtBQUNBSCxjQUFXRSxPQUFYLENBQW1CRSxPQUFuQixHQUE2QlAsT0FBN0I7QUFDQUcsY0FBV0UsT0FBWCxDQUFtQkcsSUFBbkIsR0FBMEJULE1BQTFCO0FBQ0FJLGNBQVdFLE9BQVgsQ0FBbUJILFNBQW5CLEdBQStCQSxTQUEvQjtBQUNBLFVBQU9DLFVBQVA7QUFDQSxHQVREOztBQVdBLE1BQUlNLGNBQWMsS0FBbEI7QUFDQSxNQUFHLE9BQU9ULE9BQVAsS0FBbUIsUUFBdEIsRUFDQTtBQUNDLE9BQUcsUUFBT0QsTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQkMsT0FBckIsRUFBOEJTLGNBQWMsSUFBZCxDQUE5QixLQUNLLE1BQU1SLGNBQWMsTUFBZCxDQUFOO0FBQ0wsR0FKRCxNQUtLLElBQUdELG1CQUFtQlUsS0FBdEIsRUFDTDtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFFQyx5QkFBd0JWLE9BQXhCLDhIQUNBO0FBQUEsU0FEUVcsWUFDUjs7QUFDQyxTQUNBO0FBQ0NqQixnQkFBVSxFQUFDSSxNQUFPLENBQUNDLE1BQUQsRUFBU1ksWUFBVCxDQUFSLEVBQVY7QUFDQUYsb0JBQWMsSUFBZDtBQUNBO0FBQ0EsTUFMRCxDQU1BLE9BQU1HLENBQU4sRUFBUTtBQUFDLE9BQUM7QUFBRTtBQUNaO0FBWEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFZQyxPQUFHLENBQUNILFdBQUosRUFBaUIsTUFBTVIsY0FBYyxXQUFkLENBQU47QUFDakI7QUFDRDtBQWZLLE9BZ0JBLElBQUksUUFBT0QsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFwQixJQUFrQ0EsbUJBQW1CYSxNQUF4RCxFQUNMO0FBQ0MsUUFBR2Qsa0JBQWtCQyxPQUFyQixFQUE4QlMsY0FBYyxJQUFkLENBQTlCLEtBQ0ssTUFBTVIsY0FBYyxVQUFkLENBQU47QUFDTDtBQUNELE1BQUdRLGdCQUFnQixJQUFuQixFQUF5QixPQUFPLElBQVA7QUFDekI7QUFDRCxLQUFHWixPQUFPaUIsTUFBVixFQUNBO0FBQ0MsUUFBTSxpQkFBTjtBQUNBO0FBQ0RDLFNBQVFDLEdBQVIsQ0FBWSxTQUFaLEVBQXdCbkIsTUFBeEI7QUFDQSxPQUFNLElBQUlPLEtBQUosQ0FBVSxzREFBVixDQUFOO0FBQ0EsQ0FuREQiLCJmaWxlIjoiY29udHJhdC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcblx0X2NvbnRyYXRfKCBAZG9ubsOpZSwgQGNvbnRyYXQpID0+IHVuZGVmaW5lZCB8fCBFcnJvclxyXG5cdEZvbmN0aW9uIHByaXbDqSBkw6lmaW5pc3NhbnQgdW4gY29udHJhdCBzdXIgdW5lIGRvbm7DqWUoaS5lLiBpZGVudGlmaWNhdGV1cnMgY29uc3RhbnRzIG91IHZhcmlhYmxlcylcclxuXHRVbiBjb250cmF0IGVzdCB1biBwcsOpZGljYXQgcmV0b3VybmFudCB1bmUgcHJvcG9zaXRpb24uXHJcblx0TGUgcHLDqWRpY2F0IHV0aWxpc2UgdW5lIGFzc2VydGlvbiBwb3VyIGNhbGN1bGVyIGxhIHByb3Bvc2l0aW9uLlxyXG5cdEwnYXNzZXJ0aW9uIGVzdCBkw6l0ZXJtaW7DqWUgZW4gZm9uY3Rpb24gZHUgdHlwZSBkdSBjb250cmF0KHZvaXIgZG9jIEBjb250cmF0KS5cclxuXHRMYSBwcm9wb3NpdGlvbiBlc3Qgc29pdCB2cmFpZSBzb2l0IHVuZSBFcnJvciBwb3VyIGluZGlxdWVyIGZhdXguXHJcblx0QGRvbm7DqWVcclxuXHRcdFR5cGU6XHR0b3VzXHJcblx0QGNvbnRyYXRcclxuXHRcdFR5cGU6XHQnc3RyaW5nJyB8fCBBcnJheSB8fCBPYmplY3RcclxuXHRcdFx0Q2FzOlx0XHRBc3NlcnRpb246XHRcdFx0XHROb21cclxuXHRcdFx0J3N0cmluZydcdHR5cGVvZlx0XHRcdFx0XHREb25uw6llIGRlIG3Dqm1lIHR5cGVcclxuXHRcdFx0QXJyYXlcdFx0Y29udHJhdCB8fCAuLi5cdFx0XHRSZWN1cnNpb24gc3VyIGNoYXF1ZSDDqWzDqW1lbnQuIEF1IG1vaW5zIHVuZSBwcm9wb3NpdGlvbiBkb2l0IMOqdHJlIHZyYWllLlxyXG5cdFx0XHRPYmplY3RcdFx0aW5zdGFuY2VvZlx0XHRcdFx0QGRvbm7DqWUgaW5zdGFuY2UgZGUgQGNvbnRyYXRcclxuXHQqKi9cclxuY29uc3QgZm5Db250cmF0ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJhbXMpXHJcbntcclxuXHRpZihwYXJhbXMuZG9pdClcclxuXHR7XHJcblx0XHRsZXQgW2Rvbm7DqWUsIGNvbnRyYXRdID0gcGFyYW1zLmRvaXQ7XHJcblx0XHRjb25zdCBnZW5lcmVyRXJyZXVyID0gKGFzc2VydGlvbikgPT5cclxuXHRcdHtcclxuXHRcdFx0bGV0IHBpbGVPdUZhY2UgPSBuZXcgRXJyb3I7XHJcblx0XHRcdHBpbGVPdUZhY2UuZGV0YWlscyA9IHt9O1xyXG5cdFx0XHRwaWxlT3VGYWNlLm1lc3NhZ2UgPSAnTGEgcHJvcG9zaXRpb24gZHUgY29udHJhdCBlc3QgZmF1c3NlJztcclxuXHRcdFx0cGlsZU91RmFjZS5kZXRhaWxzLmF0dGVuZHUgPSBjb250cmF0O1xyXG5cdFx0XHRwaWxlT3VGYWNlLmRldGFpbHMucmXDp3UgPSBkb25uw6llO1xyXG5cdFx0XHRwaWxlT3VGYWNlLmRldGFpbHMuYXNzZXJ0aW9uID0gYXNzZXJ0aW9uO1xyXG5cdFx0XHRyZXR1cm4gcGlsZU91RmFjZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0bGV0IHByb3Bvc2l0aW9uID0gZmFsc2U7XHJcblx0XHRpZih0eXBlb2YgY29udHJhdCA9PT0gJ3N0cmluZycpXHJcblx0XHR7XHJcblx0XHRcdGlmKHR5cGVvZiBkb25uw6llID09PSBjb250cmF0KSBwcm9wb3NpdGlvbiA9IHRydWU7XHJcblx0XHRcdGVsc2UgdGhyb3cgZ2VuZXJlckVycmV1cigndHlwZScpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihjb250cmF0IGluc3RhbmNlb2YgQXJyYXkpXHJcblx0XHR7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IobGV0IHZhbGV1ckFkbWlzZSBvZiBjb250cmF0KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Zm5Db250cmF0KHtkb2l0IDogW2Rvbm7DqWUsIHZhbGV1ckFkbWlzZV0gfSApO1xyXG5cdFx0XHRcdFx0cHJvcG9zaXRpb24gPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGUpezs7fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFwcm9wb3NpdGlvbikgdGhyb3cgZ2VuZXJlckVycmV1cignaW50ZXJ2YWxlJyk7XHJcblx0XHR9XHJcblx0XHQvLyBPYmplY3RcclxuXHRcdGVsc2UgaWYoKHR5cGVvZiBjb250cmF0ID09PSAnb2JqZWN0JykgfHwgKGNvbnRyYXQgaW5zdGFuY2VvZiBPYmplY3QpIClcclxuXHRcdHtcclxuXHRcdFx0aWYoZG9ubsOpZSBpbnN0YW5jZW9mIGNvbnRyYXQpIHByb3Bvc2l0aW9uID0gdHJ1ZTtcclxuXHRcdFx0ZWxzZSB0aHJvdyBnZW5lcmVyRXJyZXVyKCdpbnN0YW5jZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYocHJvcG9zaXRpb24gPT09IHRydWUpIHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRpZihwYXJhbXMubmVkb2l0KVxyXG5cdHtcclxuXHRcdHRocm93ICdOb24gSW1wbMOpbWVudMOpISc7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCdjb250cmF0JyAsIHBhcmFtcyk7XHJcblx0dGhyb3cgbmV3IEVycm9yKCdDb250cmF0ICBhdmVjIHBhcmFtw6h0cmVzIGludmFsaWRlIG91IHNhbnMgcGFyYW3DqHRyZXMnKTtcclxufTsiXX0=

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = new function () {
	var _this = this;

	var listeners = {};
	var observerCallback = function observerCallback(mutations, observer) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = mutations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var mutation = _step.value;

				listeners[mutation.target](mutation);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	};
	var observer = new MutationObserver(observerCallback);
	this.new = function (target, mutationObserverInit, callback) {
		observer.observe(target, mutationObserverInit);
		listeners[target] = callback;
	};

	this.newAsAttributes = function (target, attrList, callback) {
		_this.new(target, { attributes: true, attributesFilter: attrList }, callback);
	};

	this.newAsAttributeExpected = function (target, attr, callback) {
		_this.new(target, { attributes: true, attributesFilter: attr.name }, function (mutation) {
			if (target[attr.name] == attr.expected) callback(mutation);
		});
	};

	this.newAsStyleExpected = function (target, style, callback) {
		_this.new(target, { attributes: true, attributesFilter: 'style' }, function (mutation) {
			var value = mutation.target.style[style.name];
			console.log('style>name: ', style.name, ' value: ', value, ' expected: ', style.expected);
			if (style.isEqual && value === style.expected || !style.isEqual && value !== style.expected) callback(mutation);
		});
	};
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvMS9zb25kZU11dGF0aW9uLmpzIl0sIm5hbWVzIjpbImxpc3RlbmVycyIsIm9ic2VydmVyQ2FsbGJhY2siLCJtdXRhdGlvbnMiLCJvYnNlcnZlciIsIm11dGF0aW9uIiwidGFyZ2V0IiwiTXV0YXRpb25PYnNlcnZlciIsIm5ldyIsIm11dGF0aW9uT2JzZXJ2ZXJJbml0IiwiY2FsbGJhY2siLCJvYnNlcnZlIiwibmV3QXNBdHRyaWJ1dGVzIiwiYXR0ckxpc3QiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlc0ZpbHRlciIsIm5ld0FzQXR0cmlidXRlRXhwZWN0ZWQiLCJhdHRyIiwibmFtZSIsImV4cGVjdGVkIiwibmV3QXNTdHlsZUV4cGVjdGVkIiwic3R5bGUiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJpc0VxdWFsIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7a0JBQ2UsSUFBSSxZQUNuQjtBQUFBOztBQUNDLEtBQU1BLFlBQVksRUFBbEI7QUFDQSxLQUFNQyxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFDQyxTQUFELEVBQVlDLFFBQVosRUFDekI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDQyx3QkFBb0JELFNBQXBCO0FBQUEsUUFBUUUsUUFBUjs7QUFDQ0osY0FBVUksU0FBU0MsTUFBbkIsRUFBMkJELFFBQTNCO0FBREQ7QUFERDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0MsRUFKRDtBQUtBLEtBQU1ELFdBQVcsSUFBSUcsZ0JBQUosQ0FBcUJMLGdCQUFyQixDQUFqQjtBQUNBLE1BQUtNLEdBQUwsR0FBVyxVQUFDRixNQUFELEVBQVNHLG9CQUFULEVBQStCQyxRQUEvQixFQUNYO0FBQ0NOLFdBQVNPLE9BQVQsQ0FBaUJMLE1BQWpCLEVBQXlCRyxvQkFBekI7QUFDQVIsWUFBVUssTUFBVixJQUFvQkksUUFBcEI7QUFDQSxFQUpEOztBQU1BLE1BQUtFLGVBQUwsR0FBdUIsVUFBQ04sTUFBRCxFQUFTTyxRQUFULEVBQW1CSCxRQUFuQixFQUN2QjtBQUNDLFFBQUtGLEdBQUwsQ0FBU0YsTUFBVCxFQUFpQixFQUFDUSxZQUFZLElBQWIsRUFBbUJDLGtCQUFrQkYsUUFBckMsRUFBakIsRUFBaUVILFFBQWpFO0FBQ0EsRUFIRDs7QUFLQSxNQUFLTSxzQkFBTCxHQUE4QixVQUFDVixNQUFELEVBQVNXLElBQVQsRUFBZVAsUUFBZixFQUM5QjtBQUNDLFFBQUtGLEdBQUwsQ0FBU0YsTUFBVCxFQUFpQixFQUFDUSxZQUFZLElBQWIsRUFBbUJDLGtCQUFrQkUsS0FBS0MsSUFBMUMsRUFBakIsRUFBa0Usb0JBQ2xFO0FBQ0MsT0FBSVosT0FBT1csS0FBS0MsSUFBWixLQUFxQkQsS0FBS0UsUUFBOUIsRUFDQ1QsU0FBU0wsUUFBVDtBQUNELEdBSkQ7QUFLQSxFQVBEOztBQVNBLE1BQUtlLGtCQUFMLEdBQTBCLFVBQUNkLE1BQUQsRUFBU2UsS0FBVCxFQUFnQlgsUUFBaEIsRUFDMUI7QUFDQyxRQUFLRixHQUFMLENBQVNGLE1BQVQsRUFBaUIsRUFBQ1EsWUFBWSxJQUFiLEVBQW1CQyxrQkFBa0IsT0FBckMsRUFBakIsRUFBZ0Usb0JBQ2hFO0FBQ0MsT0FBTU8sUUFBUWpCLFNBQVNDLE1BQVQsQ0FBZ0JlLEtBQWhCLENBQXNCQSxNQUFNSCxJQUE1QixDQUFkO0FBQ0FLLFdBQVFDLEdBQVIsQ0FBWSxjQUFaLEVBQTRCSCxNQUFNSCxJQUFsQyxFQUF3QyxVQUF4QyxFQUFvREksS0FBcEQsRUFBMkQsYUFBM0QsRUFBMEVELE1BQU1GLFFBQWhGO0FBQ0EsT0FBS0UsTUFBTUksT0FBTixJQUFrQkgsVUFBVUQsTUFBTUYsUUFBbkMsSUFDRCxDQUFDRSxNQUFNSSxPQUFQLElBQW1CSCxVQUFVRCxNQUFNRixRQUR0QyxFQUVDVCxTQUFTTCxRQUFUO0FBQ0QsR0FQRDtBQVFBLEVBVkQ7QUFXQSxDQXhDYyxFIiwiZmlsZSI6InNvbmRlTXV0YXRpb24uanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuZXhwb3J0IGRlZmF1bHQgbmV3IGZ1bmN0aW9uKClcclxue1xyXG5cdGNvbnN0XHRsaXN0ZW5lcnMgPSB7fTtcclxuXHRjb25zdCBvYnNlcnZlckNhbGxiYWNrID0gKG11dGF0aW9ucywgb2JzZXJ2ZXIpID0+XHJcblx0e1xyXG5cdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXHJcblx0XHRcdGxpc3RlbmVyc1ttdXRhdGlvbi50YXJnZXRdKG11dGF0aW9uKTtcclxuXHR9O1xyXG5cdGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIob2JzZXJ2ZXJDYWxsYmFjayk7XHJcblx0dGhpcy5uZXcgPSAodGFyZ2V0LCBtdXRhdGlvbk9ic2VydmVySW5pdCwgY2FsbGJhY2spID0+XHJcblx0e1xyXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG11dGF0aW9uT2JzZXJ2ZXJJbml0KTtcclxuXHRcdGxpc3RlbmVyc1t0YXJnZXRdID0gY2FsbGJhY2s7XHJcblx0fTtcclxuXHRcdFxyXG5cdHRoaXMubmV3QXNBdHRyaWJ1dGVzID0gKHRhcmdldCwgYXR0ckxpc3QsIGNhbGxiYWNrKSA9PlxyXG5cdHtcclxuXHRcdHRoaXMubmV3KHRhcmdldCwge2F0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZXNGaWx0ZXI6IGF0dHJMaXN0fSwgY2FsbGJhY2spO1xyXG5cdH07XHJcblxyXG5cdHRoaXMubmV3QXNBdHRyaWJ1dGVFeHBlY3RlZCA9ICh0YXJnZXQsIGF0dHIsIGNhbGxiYWNrKSA9PlxyXG5cdHtcclxuXHRcdHRoaXMubmV3KHRhcmdldCwge2F0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZXNGaWx0ZXI6IGF0dHIubmFtZX0sIG11dGF0aW9uID0+XHJcblx0XHR7XHJcblx0XHRcdGlmICh0YXJnZXRbYXR0ci5uYW1lXSA9PSBhdHRyLmV4cGVjdGVkKVxyXG5cdFx0XHRcdGNhbGxiYWNrKG11dGF0aW9uKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHRoaXMubmV3QXNTdHlsZUV4cGVjdGVkID0gKHRhcmdldCwgc3R5bGUsIGNhbGxiYWNrKSA9PlxyXG5cdHtcclxuXHRcdHRoaXMubmV3KHRhcmdldCwge2F0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZXNGaWx0ZXI6ICdzdHlsZSd9LCBtdXRhdGlvbiA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IG11dGF0aW9uLnRhcmdldC5zdHlsZVtzdHlsZS5uYW1lXTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3N0eWxlPm5hbWU6ICcsIHN0eWxlLm5hbWUsICcgdmFsdWU6ICcsIHZhbHVlLCAnIGV4cGVjdGVkOiAnLCBzdHlsZS5leHBlY3RlZCk7XHJcblx0XHRcdGlmICgoc3R5bGUuaXNFcXVhbCAmJiAodmFsdWUgPT09IHN0eWxlLmV4cGVjdGVkKSkgfHxcclxuXHRcdFx0XHRcdCghc3R5bGUuaXNFcXVhbCAmJiAodmFsdWUgIT09IHN0eWxlLmV4cGVjdGVkKSkpXHJcblx0XHRcdFx0Y2FsbGJhY2sobXV0YXRpb24pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxufTsiXX0=

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = new function () {
	var _this = this;

	var typesDonnees = this;
	this.Reference = function () {
		var refMax = 0;
		var refLibre = [];
		this.obtenir = function () {
			return refLibre.length === 0 ? refMax++ : refLibre.shift();
		};
		this.liberer = function (ref) {
			return void refLibre.push(ref) || ref;
		};
		this.libre = function () {
			return refLibre;
		};
		this.taille = function (type) {
			var r = {
				max: refMax,
				occupe: refMax - refLibre.length,
				libre: refLibre.length
			};
			return type === 'max' ? r.max : type === 'occupe' ? r.occupe : type === 'libre' ? r.libre : r;
		};
	};

	var IterateurInterneListe = function IterateurInterneListe(refs, representation) {
		var refLibre = refs.libre(),
		    taille = refs.taille('max');
		var iActuel = 0;

		this.suivant = function () {
			//Si l'emplacement n'est pas utilise il faut en trouver un autre
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = refLibre[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var libre = _step.value;

					if (libre !== iActuel) break;
					iActuel++;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var r = {
				done: false,
				value: { valeur: representation[iActuel], cle: iActuel }
			};
			if (iActuel++ === taille) r.done = true;
			return r;
		};
	};
	var liste_elVersRef = function liste_elVersRef(listeIterateur, element) {
		var r = null;
		while (void (r = listeIterateur.suivant()) || !r.done) {
			if (r.value.valeur === element) return r.value.cle;
		}return false;
	};
	/**
 	0.0.0
 	2/12/2015:
 		6H10
 			1ère version
 **/
	this.Liste = function () {
		var representation = [],
		    refs = new typesDonnees.Reference();
		var taille = 0;

		this.ajouter = function (element) {
			representation[refs.obtenir()] = element;
			taille++;
			return element;
		};
		this.supprimer = function (element) {
			var ref = null;
			try {
				ref = liste_elVersRef(new IterateurInterneListe(refs, representation), element);
				if (ref !== 0 && !ref) throw new Error('');
			} catch (e) {
				throw new Error('Liste.supprimer:@element non present dans la liste:	' + element);
			}
			representation[refs.liberer(ref)] = null;
			taille--;
		};
		/**
  	0.0.0
  	**/
		this.taille = function () {
			return taille;
		};
		/**
  	0.0.0
  **/
		this.contient = function (element) {
			return liste_elVersRef(new IterateurInterneListe(refs, representation), element) && true;
		};
		/**
  	0.0.0
  **/
		this.coercision = {
			versTableau: function versTableau() {
				return representation;
			}
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

		this[Symbol.iterator] = function () {
			var iterateur = new IterateurInterneListe(refs, representation);
			return {
				next: function next() {
					var r = iterateur.suivant();
					r.value = r.value.valeur;
					return r;
				}
			};
		};
	};

	(function () {
		var representation = {},
		    libre = [];
		var taille = 0,
		    iMax = 0;

		_this.ListeUR2 = function () {
			var emplacements = [];
			this.operation = function (type, element) {
				// ajout
				if (type === 0) {
					var id = libre.length === 0 ? iMax++ : libre.shift();
					return void (emplacements.push(id), representation[id] = element, taille++) || element;
				}
				// taille
				else if (type < 0) return emplacements.length;
					// suppression
					else {
							var id = null,
							    elementPresent = false;
							for (var i = 0, nElements = emplacements.length; i < nElements; i++) {
								id = emplacements[i];
								if (representation[id] === element) {
									emplacements[0] = emplacements[i];
									elementPresent = true;
									break;
								}
							}
							if (!elementPresent) throw new Error('ListeUR.operation@type > 0: tentative de suppression d\'un élément non présent, @element: ' + element);
							return void (delete representation[id], libre.push(id), emplacements.shift(), taille--) || element;
						}
			};

			this.pourDe = function (fn) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = emplacements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var id = _step2.value;
						fn(representation[id]);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			};
		};
	})();

	this.ListeUR3 = function () {
		var _this2 = this;

		this[0] = { 0: [], 1: null, 2: 0, 3: null };
		this[1] = function (e) {
			return _this2[0][0].push(e);
		};
		this[2] = function () {
			return _this2[0][0].length;
		};
		this[3] = function (e) {
			void (_this2[0][2] = 0, _this2[0][1] = null, _this2[0][3] = _this2[0][0].length);
			while (_this2[0][2] < _this2[0][3]) {
				if (_this2[0][0][_this2[0][2]] === e) {
					_this2[0][1] = _this2[0][2];break;
				};
				_this2[0][2]++;
			}
			if (_this2[0][1] === null) throw new Error('ListeUR@element non présent dans la liste');
			_this2[0][0][_this2[0][1]] = _this2[0][0][0];
			_this2[0][0].shift();
		};
	};

	this.Dictionnaire = function () {
		var representation = {},
		    index = new typesDonnees.Liste();

		this.taille = function () {
			return index.taille();
		};
		this.ajouter = function (cle, valeur) {
			if (representation[cle]) throw new Error('typesDonnees.Dictionnaire.ajouter@cle dejà defini:	' + cle);
			return void (representation[index.ajouter(cle)] = valeur) || cle;
		};
		this.modifier = function (cle, valeur) {
			if (!representation[cle]) throw new Error('typesDonnees.Dictionnaire.modifier@cle non presente dans le dictionnaire:	' + cle);
			return void (representation[cle] = valeur) || valeur;
		};
		this.supprimer = function (cle) {
			if (!representation[cle]) throw new Error('typesDonnees.Dictionnaire.supprimer@cle non presente dans le dictionnaire:	' + cle);
			return void (delete representation[cle] && index.supprimer(cle)) || cle;
		};
		this.obtenir = function (cle) {
			if (!representation[cle]) throw new Error('typesDonnees.Dictionnaire.obtenir@cle non presente dans le dictionnaire:	' + cle);
			return representation[cle];
		};
		this.contient = function (cle) {
			return representation[cle] ? true : false;
		};
		this[Symbol.iterator] = function () {
			return {
				_iAct: 0,
				_tab: index.coercision.versTableau(),
				next: function next() {
					var r = { done: false, value: representation[this._tab[this._iAct]] };
					if (this._iAct++ == this._tab.length) r.done = true;
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
	this.InterfaceTypée = function (signature) {
		this.valider = function (objet) {
			try {
				ybasthis.contrat({ doit: [objet, 'object'] });
			} catch (e) {
				throw new TypeError('InterfaceTypée.valider@objet n\'est pas de type Object!').formelle();
			}

			var signatureTesté = Object.keys(objet);
			/**
   	@options	Object
   **/
			// type = doit, nedoit,...
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Object.keys(signature)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var type = _step3.value;

					if (type !== 'doit' && type !== 'nedoit') throw new TypeError('InterfaceTypée.valider@objet n\'est pas un contrat valide!').formelle();
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = Object.keys(signature[type])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var nomProp = _step4.value;

							if (!signatureTesté.includes(nomProp)) throw new Error('InterfaceTypée.valider: Propriété absente: ' + nomProp);else {
								var propriétéTestée = objet[nomProp],
								    signatureTestée = signature[type][nomProp];
								try {
									ybasthis.contrat(_defineProperty({}, type, [propriétéTestée, signatureTestée]));
								} catch (prop) {
									if (prop.details.assertion === 'type') throw new Error('InterfaceTypée.valider: Propriété type différent: ' + nomProp).lier(prop);else if (prop.details.assertion === 'intervale') throw new Error('InterfaceTypée.valider: Propriété non comprise dans l\'intervale: ' + nomProp).lier(prop);else if (prop.details.assertion === 'instance') throw new Error('InterfaceTypée.valider: Propriété classe différent: ' + nomProp).lier(prop);
								}
							}
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return true;
		};
	};
	this.InterfaceNonTypée = function (signature) {};
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvMi90eXBlc0Rvbm5lZXMuanMiXSwibmFtZXMiOlsidHlwZXNEb25uZWVzIiwiUmVmZXJlbmNlIiwicmVmTWF4IiwicmVmTGlicmUiLCJvYnRlbmlyIiwibGVuZ3RoIiwic2hpZnQiLCJsaWJlcmVyIiwicHVzaCIsInJlZiIsImxpYnJlIiwidGFpbGxlIiwiciIsIm1heCIsIm9jY3VwZSIsInR5cGUiLCJJdGVyYXRldXJJbnRlcm5lTGlzdGUiLCJyZWZzIiwicmVwcmVzZW50YXRpb24iLCJpQWN0dWVsIiwic3VpdmFudCIsImRvbmUiLCJ2YWx1ZSIsInZhbGV1ciIsImNsZSIsImxpc3RlX2VsVmVyc1JlZiIsImxpc3RlSXRlcmF0ZXVyIiwiZWxlbWVudCIsIkxpc3RlIiwiYWpvdXRlciIsInN1cHByaW1lciIsIkVycm9yIiwiZSIsImNvbnRpZW50IiwiY29lcmNpc2lvbiIsInZlcnNUYWJsZWF1IiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJpdGVyYXRldXIiLCJuZXh0IiwiaU1heCIsIkxpc3RlVVIyIiwiZW1wbGFjZW1lbnRzIiwib3BlcmF0aW9uIiwiaWQiLCJlbGVtZW50UHJlc2VudCIsImkiLCJuRWxlbWVudHMiLCJwb3VyRGUiLCJmbiIsIkxpc3RlVVIzIiwiRGljdGlvbm5haXJlIiwiaW5kZXgiLCJtb2RpZmllciIsIl9pQWN0IiwiX3RhYiIsIkludGVyZmFjZVR5cMOpZSIsInNpZ25hdHVyZSIsInZhbGlkZXIiLCJvYmpldCIsInliYXN0aGlzIiwiY29udHJhdCIsImRvaXQiLCJUeXBlRXJyb3IiLCJmb3JtZWxsZSIsInNpZ25hdHVyZVRlc3TDqSIsIk9iamVjdCIsImtleXMiLCJub21Qcm9wIiwiaW5jbHVkZXMiLCJwcm9wcmnDqXTDqVRlc3TDqWUiLCJzaWduYXR1cmVUZXN0w6llIiwicHJvcCIsImRldGFpbHMiLCJhc3NlcnRpb24iLCJsaWVyIiwiSW50ZXJmYWNlTm9uVHlww6llIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFB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SCxJQUFsRyxDQUFOLENBREksS0FFQSxJQUFHQSxLQUFLQyxPQUFMLENBQWFDLFNBQWIsS0FBMkIsVUFBOUIsRUFDSixNQUFPLElBQUkzQyxLQUFKLENBQVUseURBQXlEcUMsT0FBbkUsQ0FBRCxDQUErRU8sSUFBL0UsQ0FBb0ZILElBQXBGLENBQU47QUFDRDtBQUVEO0FBQ0Q7QUFyQkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXNCQztBQWhDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWlDQyxVQUFPLElBQVA7QUFDQSxHQW5DRDtBQW9DQSxFQXRDRDtBQXVDQSxNQUFLSSxpQkFBTCxHQUF5QixVQUFTbkIsU0FBVCxFQUFtQixDQUFFLENBQTlDO0FBQ0EsQ0FsVGMsRSIsImZpbGUiOiJ0eXBlc0Rvbm5lZXMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IG5ldyBmdW5jdGlvbigpXHJcbntcclxuXHR2YXIgdHlwZXNEb25uZWVzID0gdGhpcztcclxuXHR0aGlzLlJlZmVyZW5jZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHR2YXIgcmVmTWF4ID0gMDtcclxuXHRcdGNvbnN0IHJlZkxpYnJlID0gW107XHJcblx0XHR0aGlzLm9idGVuaXIgPSAoKSA9PiAocmVmTGlicmUubGVuZ3RoID09PSAwKSA/IHJlZk1heCsrIDogcmVmTGlicmUuc2hpZnQoKTtcclxuXHRcdHRoaXMubGliZXJlciA9IHJlZiA9PiB2b2lkKHJlZkxpYnJlLnB1c2gocmVmKSkgfHwgcmVmO1xyXG5cdFx0dGhpcy5saWJyZSA9ICgpID0+IHJlZkxpYnJlO1xyXG5cdFx0dGhpcy50YWlsbGUgPSB0eXBlID0+XHJcblx0XHR7XHJcblx0XHRcdFx0dmFyIHIgPVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG1heDogcmVmTWF4LFxyXG5cdFx0XHRcdFx0b2NjdXBlOiByZWZNYXggLSByZWZMaWJyZS5sZW5ndGgsXHJcblx0XHRcdFx0XHRsaWJyZTogcmVmTGlicmUubGVuZ3RoXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRyZXR1cm4gKHR5cGUgPT09ICdtYXgnKT8gci5tYXggOiAodHlwZSA9PT0gJ29jY3VwZScpPyByLm9jY3VwZSA6ICh0eXBlID09PSAnbGlicmUnKT8gci5saWJyZSA6IHI7XHJcblx0XHR9O1xyXG5cdH07XHJcblx0XHJcblx0Y29uc3QgSXRlcmF0ZXVySW50ZXJuZUxpc3RlID0gZnVuY3Rpb24ocmVmcywgcmVwcmVzZW50YXRpb24pXHJcblx0e1xyXG5cdFx0Y29uc3QgcmVmTGlicmUgPSByZWZzLmxpYnJlKCksXHJcblx0XHRcdCAgdGFpbGxlID0gcmVmcy50YWlsbGUoJ21heCcpO1xyXG5cdFx0dmFyIGlBY3R1ZWwgPSAwO1xyXG5cdFx0XHRcclxuXHRcdHRoaXMuc3VpdmFudCA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdC8vU2kgbCdlbXBsYWNlbWVudCBuJ2VzdCBwYXMgdXRpbGlzZSBpbCBmYXV0IGVuIHRyb3V2ZXIgdW4gYXV0cmVcclxuXHRcdFx0Zm9yKHZhciBsaWJyZSBvZiByZWZMaWJyZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGxpYnJlICE9PSBpQWN0dWVsKSBicmVhaztcclxuXHRcdFx0XHRpQWN0dWVsKys7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHIgPVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZG9uZTogZmFsc2UsXHJcblx0XHRcdFx0dmFsdWU6ICB7IHZhbGV1ciA6cmVwcmVzZW50YXRpb25baUFjdHVlbF0sIGNsZSA6IGlBY3R1ZWwgfVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZihpQWN0dWVsKysgPT09IHRhaWxsZSkgci5kb25lID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9O1xyXG5cdH07XHJcblx0Y29uc3QgbGlzdGVfZWxWZXJzUmVmID0gKGxpc3RlSXRlcmF0ZXVyLCBlbGVtZW50KSA9PlxyXG5cdHtcclxuXHRcdHZhciByID0gbnVsbDtcclxuXHRcdHdoaWxlKHZvaWQociA9IGxpc3RlSXRlcmF0ZXVyLnN1aXZhbnQoKSkgfHwgIXIuZG9uZSkgaWYoci52YWx1ZS52YWxldXIgPT09IGVsZW1lbnQpIHJldHVybiByLnZhbHVlLmNsZTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cdC8qKlxyXG5cdFx0MC4wLjBcclxuXHRcdDIvMTIvMjAxNTpcclxuXHRcdFx0NkgxMFxyXG5cdFx0XHRcdDHDqHJlIHZlcnNpb25cclxuXHQqKi9cclxuXHR0aGlzLkxpc3RlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGNvbnN0IHJlcHJlc2VudGF0aW9uID0gW10sXHJcblx0XHRcdCAgcmVmcyA9IG5ldyB0eXBlc0Rvbm5lZXMuUmVmZXJlbmNlO1xyXG5cdFx0dmFyIHRhaWxsZSA9IDA7XHJcblx0XHRcclxuXHRcdHRoaXMuYWpvdXRlciA9IGVsZW1lbnQgPT5cclxuXHRcdHtcclxuXHRcdFx0cmVwcmVzZW50YXRpb25bcmVmcy5vYnRlbmlyKCldID0gZWxlbWVudDtcclxuXHRcdFx0dGFpbGxlKys7XHJcblx0XHRcdHJldHVybiBlbGVtZW50O1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuc3VwcHJpbWVyID0gZWxlbWVudCA9PlxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgcmVmID0gbnVsbDtcclxuXHRcdFx0dHJ5XHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZWYgPSBsaXN0ZV9lbFZlcnNSZWYobmV3IEl0ZXJhdGV1ckludGVybmVMaXN0ZShyZWZzLCByZXByZXNlbnRhdGlvbiksIGVsZW1lbnQpO1xyXG5cdFx0XHRcdGlmKHJlZiAhPT0gMCAmJiAhcmVmKSB0aHJvdyBuZXcgRXJyb3IoJycpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoKGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlLnN1cHByaW1lcjpAZWxlbWVudCBub24gcHJlc2VudCBkYW5zIGxhIGxpc3RlOlx0JyArIGVsZW1lbnQpO1x0XHJcblx0XHRcdH1cclxuXHRcdFx0cmVwcmVzZW50YXRpb25bcmVmcy5saWJlcmVyKHJlZildID0gbnVsbDtcclxuXHRcdFx0dGFpbGxlLS07XHJcblx0XHR9O1xyXG5cdFx0LyoqXHJcblx0XHRcdDAuMC4wXHJcblx0XHRcdCoqL1xyXG5cdFx0dGhpcy50YWlsbGUgPSAoKSA9PiB0YWlsbGU7XHJcblx0XHRcdC8qKlxyXG5cdFx0XHRcdDAuMC4wXHJcblx0XHRcdCoqL1xyXG5cdFx0dGhpcy5jb250aWVudCA9IGVsZW1lbnQgPT4gKGxpc3RlX2VsVmVyc1JlZihuZXcgSXRlcmF0ZXVySW50ZXJuZUxpc3RlKHJlZnMsIHJlcHJlc2VudGF0aW9uKSwgZWxlbWVudCkgJiYgdHJ1ZSk7XHJcblx0XHRcdC8qKlxyXG5cdFx0XHRcdDAuMC4wXHJcblx0XHRcdCoqL1xyXG5cdFx0dGhpcy5jb2VyY2lzaW9uID1cclxuXHRcdHtcclxuXHRcdFx0dmVyc1RhYmxlYXUgOiAoKSA9PiByZXByZXNlbnRhdGlvblxyXG5cdFx0fTtcclxuXHRcdFx0LyoqXHJcblx0XHRcdFx0MC4wLjJcclxuXHRcdFx0XHRcdDIvMTIvMjAxNTpcclxuXHRcdFx0XHRcdDZIMTBcclxuXHRcdFx0XHRcdFx0LURlcGxhY2VtZW50IGRlIHJlZiBsaWJyZSBkYW5zIGwnaXRlcmF0ZXVyIGF1IGxpZXUgZGUgbCdpdGVyYXRpb25cclxuXHRcdFx0XHRcdDUvMTI6XHJcblx0XHRcdFx0XHRcdC10aGlzIHZlcnMgcHJpdsOpLlxyXG5cdFx0XHRcdFx0XHQtMC4wLjIoKVxyXG5cdFx0XHQqKi9cclxuXHRcdFx0XHJcblx0XHR0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IGl0ZXJhdGV1ciA9IG5ldyBJdGVyYXRldXJJbnRlcm5lTGlzdGUocmVmcywgcmVwcmVzZW50YXRpb24pO1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG5leHQ6IGZ1bmN0aW9uKClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YXIgciA9IGl0ZXJhdGV1ci5zdWl2YW50KCk7XHJcblx0XHRcdFx0XHRyLnZhbHVlID0gci52YWx1ZS52YWxldXI7XHJcblx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH07XHJcblx0XHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgcmVwcmVzZW50YXRpb24gPSB7fSxcclxuXHRcdFx0ICBsaWJyZSA9IFtdO1xyXG5cdFx0dmFyIHRhaWxsZSA9IDAsXHJcblx0XHRcdGlNYXggPSAwO1xyXG5cdFx0XHRcclxuXHRcdHRoaXMuTGlzdGVVUjIgPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IGVtcGxhY2VtZW50cyA9IFtdO1xyXG5cdFx0XHR0aGlzLm9wZXJhdGlvbiA9ICh0eXBlLCBlbGVtZW50KSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gYWpvdXRcclxuXHRcdFx0XHRpZih0eXBlID09PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciBpZCA9IChsaWJyZS5sZW5ndGggPT09IDApPyBpTWF4KysgOiBsaWJyZS5zaGlmdCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZvaWRcclxuXHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0ZW1wbGFjZW1lbnRzLnB1c2goaWQpLFxyXG5cdFx0XHRcdFx0XHRyZXByZXNlbnRhdGlvbltpZF0gPSBlbGVtZW50LFxyXG5cdFx0XHRcdFx0XHR0YWlsbGUrK1xyXG5cdFx0XHRcdFx0KSB8fCBlbGVtZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyB0YWlsbGVcclxuXHRcdFx0XHRlbHNlIGlmKHR5cGUgPCAwKSByZXR1cm4gZW1wbGFjZW1lbnRzLmxlbmd0aDtcclxuXHRcdFx0XHQvLyBzdXBwcmVzc2lvblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSBudWxsLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50UHJlc2VudCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMCwgbkVsZW1lbnRzID0gZW1wbGFjZW1lbnRzLmxlbmd0aDsgaSA8IG5FbGVtZW50czsgaSsrKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZCA9IGVtcGxhY2VtZW50c1tpXTtcclxuXHRcdFx0XHRcdFx0aWYocmVwcmVzZW50YXRpb25baWRdID09PSBlbGVtZW50KVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0ZW1wbGFjZW1lbnRzWzBdID0gZW1wbGFjZW1lbnRzW2ldO1xyXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRQcmVzZW50ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoIWVsZW1lbnRQcmVzZW50KSB0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlVVIub3BlcmF0aW9uQHR5cGUgPiAwOiB0ZW50YXRpdmUgZGUgc3VwcHJlc3Npb24gZFxcJ3VuIMOpbMOpbWVudCBub24gcHLDqXNlbnQsIEBlbGVtZW50OiAnICsgZWxlbWVudCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdm9pZFxyXG5cdFx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0XHRkZWxldGUgcmVwcmVzZW50YXRpb25baWRdLFxyXG5cdFx0XHRcdFx0XHRsaWJyZS5wdXNoKGlkKSxcclxuXHRcdFx0XHRcdFx0ZW1wbGFjZW1lbnRzLnNoaWZ0KCksXHJcblx0XHRcdFx0XHRcdHRhaWxsZS0tXHJcblx0XHRcdFx0XHQpIHx8IGVsZW1lbnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5wb3VyRGUgPSBmbiA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Zm9yKHZhciBpZCBvZiBlbXBsYWNlbWVudHMpIGZuKHJlcHJlc2VudGF0aW9uW2lkXSApO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdH0pKCk7XHJcblx0XHJcblx0dGhpcy5MaXN0ZVVSMyA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHR0aGlzWzBiMDBdPXswYjAwOltdLDBiMDE6bnVsbCwwYjEwOjAsMGIxMTpudWxsfTtcclxuXHRcdHRoaXNbMGIwMV09ZT0+dGhpc1swYjAwXVswYjAwMF0ucHVzaChlKTtcclxuXHRcdHRoaXNbMGIxMF09KCk9PnRoaXNbMGIwMF1bMGIwMDBdLmxlbmd0aDtcclxuXHRcdHRoaXNbMGIxMV09ZSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR2b2lkKHRoaXNbMGIwMF1bMGIxMF09MCx0aGlzWzBiMDBdWzBiMDFdPW51bGwsdGhpc1swYjAwXVswYjExXT10aGlzWzBiMDBdWzBiMDAwXS5sZW5ndGgpO1xyXG5cdFx0XHR3aGlsZSh0aGlzWzBiMDBdWzBiMTBdPHRoaXNbMGIwMF1bMGIxMV0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZih0aGlzWzBiMDBdWzBiMDAwXVt0aGlzWzBiMDBdWzBiMTBdXT09PWUpe3RoaXNbMGIwMF1bMGIwMV09dGhpc1swYjAwXVswYjEwXTticmVhazt9O1xyXG5cdFx0XHRcdHRoaXNbMGIwMF1bMGIxMF0rKztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0aGlzWzBiMDBdWzBiMDFdPT09bnVsbCl0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlVVJAZWxlbWVudCBub24gcHLDqXNlbnQgZGFucyBsYSBsaXN0ZScpO1xyXG5cdFx0XHR0aGlzWzBiMDBdWzBiMDAwXVt0aGlzWzBiMDBdWzBiMDFdXT10aGlzWzBiMDBdWzBiMDAwXVswXTtcclxuXHRcdFx0dGhpc1swYjAwXVswYjAwMF0uc2hpZnQoKTtcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0dGhpcy5EaWN0aW9ubmFpcmUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc3QgcmVwcmVzZW50YXRpb24gPSB7fSxcclxuXHRcdFx0ICBpbmRleCA9IG5ldyB0eXBlc0Rvbm5lZXMuTGlzdGU7XHJcblx0XHRcclxuXHRcdHRoaXMudGFpbGxlID0gKCkgPT4gaW5kZXgudGFpbGxlKCk7XHJcblx0XHR0aGlzLmFqb3V0ZXIgPSAoY2xlLCB2YWxldXIpID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKHJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5ham91dGVyQGNsZSBkZWrDoCBkZWZpbmk6XHQnK2NsZSk7XHJcblx0XHRcdHJldHVybiB2b2lkKHJlcHJlc2VudGF0aW9uW2luZGV4LmFqb3V0ZXIoY2xlKV0gPSB2YWxldXIpIHx8ICBjbGU7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5tb2RpZmllciA9IChjbGUsIHZhbGV1cikgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoIXJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5tb2RpZmllckBjbGUgbm9uIHByZXNlbnRlIGRhbnMgbGUgZGljdGlvbm5haXJlOlx0JysgY2xlKTtcclxuXHRcdFx0cmV0dXJuIHZvaWQocmVwcmVzZW50YXRpb25bY2xlXSA9IHZhbGV1cikgfHwgdmFsZXVyO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuc3VwcHJpbWVyID0gY2xlID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKCFyZXByZXNlbnRhdGlvbltjbGVdKSB0aHJvdyBuZXcgRXJyb3IoJ3R5cGVzRG9ubmVlcy5EaWN0aW9ubmFpcmUuc3VwcHJpbWVyQGNsZSBub24gcHJlc2VudGUgZGFucyBsZSBkaWN0aW9ubmFpcmU6XHQnK2NsZSk7XHJcblx0XHRcdHJldHVybiB2b2lkKGRlbGV0ZSByZXByZXNlbnRhdGlvbltjbGVdICYmIGluZGV4LnN1cHByaW1lcihjbGUpXHQpIHx8IGNsZTtcclxuXHRcdH07XHJcblx0XHR0aGlzLm9idGVuaXIgPSBjbGUgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoIXJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5vYnRlbmlyQGNsZSBub24gcHJlc2VudGUgZGFucyBsZSBkaWN0aW9ubmFpcmU6XHQnK2NsZSk7XHJcblx0XHRcdHJldHVybiByZXByZXNlbnRhdGlvbltjbGVdO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuY29udGllbnQgPSBjbGUgPT4gKHJlcHJlc2VudGF0aW9uW2NsZV0pPyB0cnVlIDogZmFsc2U7XHJcblx0XHR0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0X2lBY3QgOiAwLFxyXG5cdFx0XHRcdF90YWIgOiBpbmRleC5jb2VyY2lzaW9uLnZlcnNUYWJsZWF1KCksXHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciByID0ge2RvbmU6IGZhbHNlLCB2YWx1ZTogcmVwcmVzZW50YXRpb25bdGhpcy5fdGFiW3RoaXMuX2lBY3RdXHRdXHR9O1xyXG5cdFx0XHRcdFx0aWYodGhpcy5faUFjdCsrID09IHRoaXMuX3RhYi5sZW5ndGgpIHIuZG9uZSA9IHRydWU7XHJcblx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdHZhciBhYSA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuSW50ZXJmYWNlKFsndHlwZScsICdub20nLCAnaWQnXSk7XHJcblx0XHR2YXIgYiA9IHt0eXBlIDogJ2fDqXJvZW0nLCBub20gOidqZWFuTHVjJywgaWQ6IDV9XHJcblx0XHRhYS52YWxpZGVyKGIpXHJcblx0XHRcclxuXHRcdFBlcm1ldCBkZSBkw6lmaW5pciBsYSBzaWduYXR1cmUgZCd1biBvYmpldC5cclxuXHRcdEBzaWduYXR1cmVcdFxyXG5cdFx0XHRPYmpldDpcclxuXHRcdFx0XHRsJ2ludGVyZmFjZSBkZXZyYSBhdm9pciBsYSBtw6ptZSBzaWduYXR1cmUgcXVlIGNlbGxlIGRlIGwnb2JqZXRcclxuXHRcdFx0VGFibGVhdTpcclxuXHRcdFx0XHR0YWlsbGUgPT09IDEgRVQgdHlwZW9mIHZhbGV1ciA9PT0gT2JqZWN0XHJcblx0XHRcdFx0XHRjbMOpXHRcdExlIG5vbSBkZSBsYSBwcm9wcmnDqXTDqVxyXG5cdFx0XHRcdFx0dmFsZXVyXHRMZSBjb250cmF0IHZvaXIoX2NvbnRyYXRfKTpcclxuXHRcdFx0XHRcdFx0U3RyaW5nXHQ9PiBjb250cmF0IHR5cGVvZlxyXG5cdFx0XHRcdFx0XHRPYmplY3RcdD0+IGNvbnRyYXRcdGluc3RhbmNlb2ZcclxuXHRcdFx0XHRcdFx0QXJyYXlcdD0+IGNvbnRyYXQgYXZlYyBwbHVzaWV1cnMgc2lnbmF0dXJlXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGFibGVhdSA9PiBpbnRlcmZhY2UgZG9udCBsYSBzaWduYXR1cmUgcmVwcsOpc2VudGUgbGVzIHZhbGV1cnMgZHUgdGFibGVhdVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFpbmUgPT4gbGUgbm9tIGRlIGxhIHByb3ByacOpdMOpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFtub21Qcm9wLCB0eXBlXVxyXG5cdCoqL1xyXG5cdHRoaXMuSW50ZXJmYWNlVHlww6llID0gZnVuY3Rpb24oc2lnbmF0dXJlKVxyXG5cdHtcclxuXHRcdHRoaXMudmFsaWRlciA9IChvYmpldCkgPT5cclxuXHRcdHtcclxuXHRcdFx0dHJ5e1x0eWJhc3RoaXMuY29udHJhdCh7ZG9pdCA6IFtvYmpldCwgJ29iamVjdCddIH0gKTtcdH1cclxuXHRcdFx0Y2F0Y2goZSl7XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlckBvYmpldCBuXFwnZXN0IHBhcyBkZSB0eXBlIE9iamVjdCEnKS5mb3JtZWxsZSgpO1x0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHNpZ25hdHVyZVRlc3TDqSA9IE9iamVjdC5rZXlzKG9iamV0KTtcclxuXHRcdFx0LyoqXHJcblx0XHRcdFx0QG9wdGlvbnNcdE9iamVjdFxyXG5cdFx0XHQqKi9cclxuXHRcdFx0Ly8gdHlwZSA9IGRvaXQsIG5lZG9pdCwuLi5cclxuXHRcdFx0Zm9yKGxldCB0eXBlIG9mIE9iamVjdC5rZXlzKHNpZ25hdHVyZSkgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYodHlwZSAhPT0gJ2RvaXQnICYmIHR5cGUgIT09ICduZWRvaXQnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlckBvYmpldCBuXFwnZXN0IHBhcyB1biBjb250cmF0IHZhbGlkZSEnKS5mb3JtZWxsZSgpO1xyXG5cdFx0XHRcdGZvcihsZXQgbm9tUHJvcCBvZiBPYmplY3Qua2V5cyhzaWduYXR1cmVbdHlwZV0gKSApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYoIXNpZ25hdHVyZVRlc3TDqS5pbmNsdWRlcyhub21Qcm9wKSApIHRocm93IG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIGFic2VudGU6ICcgKyBub21Qcm9wKTtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0bGV0XHRwcm9wcmnDqXTDqVRlc3TDqWUgPSBvYmpldFtub21Qcm9wXSxcclxuXHRcdFx0XHRcdFx0XHRcdHNpZ25hdHVyZVRlc3TDqWUgPSBzaWduYXR1cmVbdHlwZV1bbm9tUHJvcF07XHJcblx0XHRcdFx0XHRcdHRyeXtcdHliYXN0aGlzLmNvbnRyYXQoe1t0eXBlXSA6IFtwcm9wcmnDqXTDqVRlc3TDqWUsIHNpZ25hdHVyZVRlc3TDqWVdIH0gKTsgfVxyXG5cdFx0XHRcdFx0XHRjYXRjaChwcm9wKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aWYocHJvcC5kZXRhaWxzLmFzc2VydGlvbiA9PT0gJ3R5cGUnKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIHR5cGUgZGlmZsOpcmVudDogJyArIG5vbVByb3ApICkubGllcihwcm9wKTtcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKHByb3AuZGV0YWlscy5hc3NlcnRpb24gPT09ICdpbnRlcnZhbGUnKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIG5vbiBjb21wcmlzZSBkYW5zIGxcXCdpbnRlcnZhbGU6ICcgKyBub21Qcm9wKSApLmxpZXIocHJvcCk7XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZihwcm9wLmRldGFpbHMuYXNzZXJ0aW9uID09PSAnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIGNsYXNzZSBkaWZmw6lyZW50OiAnICsgbm9tUHJvcCkgKS5saWVyKHByb3ApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH07XHJcblx0fTtcclxuXHR0aGlzLkludGVyZmFjZU5vblR5cMOpZSA9IGZ1bmN0aW9uKHNpZ25hdHVyZSl7fTtcclxufTsiXX0=

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
	var _this = this;

	var SOIS = this;
	this.compris = null;
	(function () {
		var comprisIntervale = function comprisIntervale(intervale0, intervale1) {
			var resultat = false;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = intervale0[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var entier0 = _step.value;
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = intervale1[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var entier1 = _step2.value;

							if (entier0 === entier1) {
								resultat = true;
								break;
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return resultat;
		},
		    comprisIntervaleEntier = function comprisIntervaleEntier(intervale, entier1) {
			var resultat = false;
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = intervale[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var entier0 = _step3.value;

					if (entier0 === entier1) {
						resultat = true;
						break;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return resultat;
		},
		    comprisEntier = function comprisEntier(operande0, operande1) {
			return operande0 === operande1 ? true : false;
		};

		_this.compris = function (operande0, operande1) {
			var resultat = null;
			if (operande0 instanceof Array) {
				if (operande1 instanceof Array) resultat = comprisIntervale(operande0, operande1);else resultat = comprisIntervaleEntier(operande0, operande1);
			} else if (operande1 instanceof Array) resultat = comprisIntervaleEntier(operande1, operande0);else resultat = comprisEntier(operande0, operande1);
			return resultat;
		};
	})();
	this.chaîner = function (valeur) {
		return (typeof valeur === 'undefined' ? 'undefined' : _typeof(valeur)) === 'object' ? JSON.stringify(valeur) : valeur;
	};

	this.WHEN = function () {
		var listeners = [];
		var interval = null;
		var worker = function worker() {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				var _loop = function _loop() {
					var listener = _step4.value;

					if (listener.condition() === false) return 'continue';
					listener.callback();
					listeners = listeners.filter(function (el) {
						return el !== listener;
					});
					if (listeners.length == 0) {
						clearInterval(interval);
						interval = null;
					}
				};

				for (var _iterator4 = listeners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var _ret = _loop();

					if (_ret === 'continue') continue;
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		};
		return function (condition, callback) {
			listeners.push({ condition: condition, callback: callback });
			if (interval === null) interval = setInterval(worker, 20);
		};
	}();
	this.grandeurs = {
		enleverUnité: function enleverUnit(grandeur) {
			grandeur = Array.prototype.slice.call(grandeur).reverse();
			while (grandeur.length != 0) {
				if (!isNaN(Number(grandeur[0]))) break;
				grandeur.shift();
			}
			grandeur.reverse();
			return parseFloat(grandeur.join(''));
		}
	};

	(function () {
		var unités = ['px', 'em', 'cm', 'm', 'Kg', 'g', 'Hz', 'j', 'k', 'v', 'A'];
		_this.grandeurs.ajouterUnité = function (chaine, unité) {
			if (!unités.includes(unité)) throw new TypeError('@unité invalide: ' + SOIS.chaîner(unité));
			return chaine + unité;
		};
	})();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvMi91dGlsaXRhaXJlcy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiU09JUyIsImNvbXByaXMiLCJjb21wcmlzSW50ZXJ2YWxlIiwiaW50ZXJ2YWxlMCIsImludGVydmFsZTEiLCJyZXN1bHRhdCIsImVudGllcjAiLCJlbnRpZXIxIiwiY29tcHJpc0ludGVydmFsZUVudGllciIsImludGVydmFsZSIsImNvbXByaXNFbnRpZXIiLCJvcGVyYW5kZTAiLCJvcGVyYW5kZTEiLCJBcnJheSIsImNoYcOubmVyIiwidmFsZXVyIiwiSlNPTiIsInN0cmluZ2lmeSIsIldIRU4iLCJsaXN0ZW5lcnMiLCJpbnRlcnZhbCIsIndvcmtlciIsImxpc3RlbmVyIiwiY29uZGl0aW9uIiwiY2FsbGJhY2siLCJmaWx0ZXIiLCJlbCIsImxlbmd0aCIsImNsZWFySW50ZXJ2YWwiLCJwdXNoIiwic2V0SW50ZXJ2YWwiLCJncmFuZGV1cnMiLCJlbmxldmVyVW5pdMOpIiwiZ3JhbmRldXIiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJyZXZlcnNlIiwiaXNOYU4iLCJOdW1iZXIiLCJzaGlmdCIsInBhcnNlRmxvYXQiLCJqb2luIiwidW5pdMOpcyIsImFqb3V0ZXJVbml0w6kiLCJjaGFpbmUiLCJ1bml0w6kiLCJpbmNsdWRlcyIsIlR5cGVFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFDQUEsT0FBT0MsT0FBUCxHQUFpQixZQUNqQjtBQUFBOztBQUNDLEtBQU1DLE9BQU8sSUFBYjtBQUNBLE1BQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsRUFBQyxZQUNEO0FBQ0MsTUFDQ0MsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsVUFBRCxFQUFhQyxVQUFiLEVBQ25CO0FBQ0MsT0FBSUMsV0FBVyxLQUFmO0FBREQ7QUFBQTtBQUFBOztBQUFBO0FBRUMseUJBQW1CRixVQUFuQjtBQUFBLFNBQVFHLE9BQVI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFD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QixFQUFwQixDQUFYO0FBQ0QsR0FMRDtBQU1BLEVBekJXLEVBQVo7QUEwQkEsTUFBS1UsU0FBTCxHQUNBO0FBQ0NDLGdCQUFlLCtCQUNmO0FBQ0NDLGNBQVdwQixNQUFNcUIsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCSCxRQUEzQixFQUNMSSxPQURLLEVBQVg7QUFFQSxVQUFPSixTQUFTTixNQUFULElBQW1CLENBQTFCLEVBQ0E7QUFDQyxRQUFJLENBQUNXLE1BQU1DLE9BQU9OLFNBQVMsQ0FBVCxDQUFQLENBQU4sQ0FBTCxFQUNDO0FBQ0RBLGFBQVNPLEtBQVQ7QUFDQTtBQUNEUCxZQUFTSSxPQUFUO0FBQ0EsVUFBUUksV0FBV1IsU0FBU1MsSUFBVCxDQUFjLEVBQWQsQ0FBWCxDQUFSO0FBQ0E7QUFiRixFQURBOztBQWlCQSxFQUFDLFlBQ0Q7QUFDQyxNQUFNQyxTQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLEdBQW5CLEVBQXdCLElBQXhCLEVBQThCLEdBQTlCLEVBQW1DLElBQW5DLEVBQXlDLEdBQXpDLEVBQThDLEdBQTlDLEVBQW1ELEdBQW5ELEVBQXdELEdBQXhELENBQWY7QUFDQSxRQUFLWixTQUFMLENBQWVhLFlBQWYsR0FBOEIsVUFBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQzlCO0FBQ0MsT0FBRyxDQUFFSCxPQUFPSSxRQUFQLENBQWdCRCxLQUFoQixDQUFMLEVBQThCLE1BQU0sSUFBSUUsU0FBSixDQUFjLHNCQUFzQmhELEtBQUtjLE9BQUwsQ0FBYWdDLEtBQWIsQ0FBcEMsQ0FBTjtBQUM5QixVQUFPRCxTQUFTQyxLQUFoQjtBQUNBLEdBSkQ7QUFLQSxFQVJEO0FBU0EsQ0FwR0QiLCJmaWxlIjoidXRpbGl0YWlyZXMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpXHJcbntcclxuXHRjb25zdCBTT0lTID0gdGhpcztcclxuXHR0aGlzLmNvbXByaXMgPSBudWxsO1xyXG5cdCgoKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0XHJcblx0XHRcdGNvbXByaXNJbnRlcnZhbGUgPSAoaW50ZXJ2YWxlMCwgaW50ZXJ2YWxlMSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciByZXN1bHRhdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvcih2YXIgZW50aWVyMCBvZiBpbnRlcnZhbGUwKVxyXG5cdFx0XHRcdFx0Zm9yKHZhciBlbnRpZXIxIG9mIGludGVydmFsZTEpXHJcblx0XHRcdFx0XHRcdGlmKGVudGllcjAgPT09IGVudGllcjEpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRyZXN1bHRhdCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0YXQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNvbXByaXNJbnRlcnZhbGVFbnRpZXIgPSAoaW50ZXJ2YWxlLCBlbnRpZXIxKSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHJlc3VsdGF0ID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yKHZhciBlbnRpZXIwIG9mIGludGVydmFsZSlcclxuXHRcdFx0XHRcdGlmKGVudGllcjAgPT09IGVudGllcjEpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlc3VsdGF0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdGF0O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjb21wcmlzRW50aWVyID0gKG9wZXJhbmRlMCwgb3BlcmFuZGUxKSA9PiAob3BlcmFuZGUwID09PSBvcGVyYW5kZTEpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcclxuXHRcdHRoaXMuY29tcHJpcyA9IChvcGVyYW5kZTAsIG9wZXJhbmRlMSkgPT5cclxuXHRcdHtcclxuXHRcdFx0dmFyIHJlc3VsdGF0ID0gbnVsbDtcclxuXHRcdFx0aWYob3BlcmFuZGUwIGluc3RhbmNlb2YgQXJyYXkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZihvcGVyYW5kZTEgaW5zdGFuY2VvZiBBcnJheSkgcmVzdWx0YXQgPSBjb21wcmlzSW50ZXJ2YWxlKG9wZXJhbmRlMCwgb3BlcmFuZGUxKTtcclxuXHRcdFx0XHRlbHNlIHJlc3VsdGF0ID0gY29tcHJpc0ludGVydmFsZUVudGllcihvcGVyYW5kZTAsIG9wZXJhbmRlMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZihvcGVyYW5kZTEgaW5zdGFuY2VvZiBBcnJheSkgcmVzdWx0YXQgPSBjb21wcmlzSW50ZXJ2YWxlRW50aWVyKG9wZXJhbmRlMSwgb3BlcmFuZGUwKTtcclxuXHRcdFx0ZWxzZSByZXN1bHRhdCA9IGNvbXByaXNFbnRpZXIob3BlcmFuZGUwLCBvcGVyYW5kZTEpO1xyXG5cdFx0XHRyZXR1cm4gcmVzdWx0YXQ7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0fSkoKTtcclxuXHR0aGlzLmNoYcOubmVyID0gdmFsZXVyID0+ICh0eXBlb2YgdmFsZXVyID09PSAnb2JqZWN0JykgPyBKU09OLnN0cmluZ2lmeSh2YWxldXIpIDogdmFsZXVyO1xyXG5cdFxyXG5cdHRoaXMuV0hFTiA9ICgoKSA9PlxyXG5cdHtcclxuXHRcdGxldCBsaXN0ZW5lcnMgPVx0W107XHJcblx0XHRsZXQgaW50ZXJ2YWwgPVx0bnVsbDtcclxuXHRcdGNvbnN0IHdvcmtlciA9XHQoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChsaXN0ZW5lci5jb25kaXRpb24oKSA9PT0gZmFsc2UpXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRsaXN0ZW5lci5jYWxsYmFjaygpO1xyXG5cdFx0XHRcdGxpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIoZWwgPT4gZWwgIT09IGxpc3RlbmVyKTtcclxuXHRcdFx0XHRpZiAobGlzdGVuZXJzLmxlbmd0aCA9PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG5cdFx0XHRcdFx0aW50ZXJ2YWwgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAoY29uZGl0aW9uLCBjYWxsYmFjaykgPT5cclxuXHRcdHtcclxuXHRcdFx0bGlzdGVuZXJzLnB1c2goe2NvbmRpdGlvbiwgY2FsbGJhY2t9KTtcclxuXHRcdFx0aWYgKGludGVydmFsID09PSBudWxsKVxyXG5cdFx0XHRcdGludGVydmFsID0gc2V0SW50ZXJ2YWwod29ya2VyLCAyMCk7XHJcblx0XHR9O1xyXG5cdH0pKCk7XHJcblx0dGhpcy5ncmFuZGV1cnMgPVxyXG5cdHtcclxuXHRcdGVubGV2ZXJVbml0w6kgOiBncmFuZGV1ciA9PlxyXG5cdFx0e1xyXG5cdFx0XHRncmFuZGV1ciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGdyYW5kZXVyKVxyXG5cdFx0XHRcdFx0XHRcdFx0LnJldmVyc2UoKTtcclxuXHRcdFx0d2hpbGUgKGdyYW5kZXVyLmxlbmd0aCAhPSAwKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKCFpc05hTihOdW1iZXIoZ3JhbmRldXJbMF0pKSlcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHRncmFuZGV1ci5zaGlmdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGdyYW5kZXVyLnJldmVyc2UoKTtcclxuXHRcdFx0cmV0dXJuIChwYXJzZUZsb2F0KGdyYW5kZXVyLmpvaW4oJycpKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRcclxuXHQoKCkgPT5cclxuXHR7XHJcblx0XHRjb25zdCB1bml0w6lzID0gWydweCcsICdlbScsICdjbScsICdtJywgJ0tnJywgJ2cnLCAnSHonLCAnaicsICdrJywgJ3YnLCAnQSddO1xyXG5cdFx0dGhpcy5ncmFuZGV1cnMuYWpvdXRlclVuaXTDqSA9IChjaGFpbmUsIHVuaXTDqSkgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoISB1bml0w6lzLmluY2x1ZGVzKHVuaXTDqSkgKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdAdW5pdMOpIGludmFsaWRlOiAnICsgU09JUy5jaGHDrm5lcih1bml0w6kpICk7XHJcblx0XHRcdHJldHVybiBjaGFpbmUgKyB1bml0w6k7XHJcblx0XHR9O1xyXG5cdH0gKSgpO1xyXG59OyJdfQ==

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
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
var interpreteurHtml = function () {
	var interpreteurDom = new DOMParser();
	return function (chaineHtml) {
		return interpreteurDom.parseFromString(chaineHtml, 'text/html');
	};
}();

var fabrique = function fabrique(espaceDeNom) {
	ybasthis.contrat({ doit: [espaceDeNom, 'string', new Error('fabrique@espaceDeNom doit être un string')] });
	ybasthis.contrat({ doit: [fabrique.espaceDeNom[espaceDeNom], 'undefined', new Error('fabrique@espace de nom déjà utilisé')] });
	var dictionnaireElément = {};

	fabrique.espaceDeNom[espaceDeNom] = dictionnaireElément;
	/**
 	IElement
 		@nom String
 		@constructeur		Function
 		@template			undefined || String
 **/
	var IElement = new ybasthis.typesDonnees.InterfaceTypée({ doit: {
			nom: 'string',
			constructeur: Function,
			template: ['undefined', 'string']
		} });
	return function (paramètres) {
		var _this = this;

		try {
			IElement.valider(paramètres);
		} catch (e) {
			if (e.estFormelle) throw e;
			throw new Error(espaceDeNom + '-fabrique@paramètres n\'implémente pas l\interface IElement');
		}
		/**
  	Privé
  **/
		var soisClasseElement = this;
		var prototypeHtmlElement = Object.create(HTMLElement.prototype);
		var IntanceElementHtml = function IntanceElementHtml() {
			if (this.attachShadow) this.attachShadow({ mode: 'open' });else //deprecied
				this.createShadowRoot();
			this.shadowRoot.appendChild(soisClasseElement.modele.cloneNode(true).content);
			paramètres.constructeur(this);
		};
		/**
  	Publique
  **/
		this.obtenirPrototype = function () {
			return prototypeHtmlElement;
		};
		this.modele = null;
		/**
    Constructeur
  **/
		(function () {
			var modeleTemporaire = interpreteurHtml(paramètres.template);
			modeleTemporaire = modeleTemporaire.querySelector('template');
			modeleTemporaire.innerHTML += '<style> *, *::before, *::after {box-sizing: border-box; }';
			_this.modele = modeleTemporaire;
		})();

		prototypeHtmlElement.createdCallback = IntanceElementHtml;
		prototypeHtmlElement.attachedCallback = function () {
			/*console.log('attaché: ', this)
   ybasthis.sondeMutation.nouvelle(this);
   ybasthis.sondeMutation.nouvelle(this.shadowRoot);*/
		};
		prototypeHtmlElement.detachedCallback = function () {
			console.log('détaché: ', this);
		};
		try {
			fabrique.espaceDeNom[espaceDeNom][paramètres.nom] = document.registerElement(espaceDeNom + '-' + paramètres.nom, { prototype: prototypeHtmlElement });
		} catch (e) {
			throw new Error(espaceDeNom + '-fabrique: Erreur lors de l\'inscription de @nom ' + paramètres.nom).lier(e);
		}
	};
};
fabrique.espaceDeNom = {};
exports.default = fabrique;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvMy9lbGVtZW50c1BlcnNvbmFsaXPDqXMuanMiXSwibmFtZXMiOlsiaW50ZXJwcmV0ZXVySHRtbCIsImludGVycHJldGV1ckRvbSIsIkRPTVBhcnNlciIsInBhcnNlRnJvbVN0cmluZyIsImNoYWluZUh0bWwiLCJmYWJyaXF1ZSIsInliYXN0aGlzIiwiY29udHJhdCIsImRvaXQiLCJlc3BhY2VEZU5vbSIsIkVycm9yIiwiZGljdGlvbm5haXJlRWzDqW1lbnQiLCJJRWxlbWVudCIsInR5cGVzRG9ubmVlcyIsIkludGVyZmFjZVR5cMOpZSIsIm5vbSIsImNvbnN0cnVjdGV1ciIsIkZ1bmN0aW9uIiwidGVtcGxhdGUiLCJwYXJhbcOodHJlcyIsInZhbGlkZXIiLCJlIiwiZXN0Rm9ybWVsbGUiLCJzb2lzQ2xhc3NlRWxlbWVudCIsInByb3RvdHlwZUh0bWxFbGVtZW50IiwiT2JqZWN0IiwiY3JlYXRlIiwiSFRNTEVsZW1lbnQiLCJwcm90b3R5cGUiLCJJbnRhbmNlRWxlbWVudEh0bWwiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwiY3JlYXRlU2hhZG93Um9vdCIsInNoYWRvd1Jvb3QiLCJhcHBlbmRDaGlsZCIsIm1vZGVsZSIsImNsb25lTm9kZSIsImNvbnRlbnQiLCJvYnRlbmlyUHJvdG90eXBlIiwibW9kZWxlVGVtcG9yYWlyZSIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJjcmVhdGVkQ2FsbGJhY2siLCJhdHRhY2hlZENhbGxiYWNrIiwiZGV0YWNoZWRDYWxsYmFjayIsImNvbnNvbGUiLCJsb2ciLCJkb2N1bWVudCIsInJlZ2lzdGVyRWxlbWVudCIsImxpZXIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBLElBQU1BLG1CQUFvQixZQUMxQjtBQUNFLEtBQU1DLGtCQUFrQixJQUFJQyxTQUFKLEVBQXhCO0FBQ0EsUUFBTztBQUFBLFNBQWNELGdCQUFnQkUsZUFB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Q0FBTjtBQUE4RztBQUN4SCxFQW5ERDtBQW9EQSxDQXhFRDtBQXlFQWhCLFNBQVNJLFdBQVQsR0FBdUIsRUFBdkI7a0JBQ2VKLFEiLCJmaWxlIjoiZWxlbWVudHNQZXJzb25hbGlzw6lzLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuXHJcblx0VW5lIGZhYnJpcXVlIGVzdCB1bmUgZm9uY3Rpb25cclxuXHRGb25jdGlvbm5hbGl0w6llczpcclxuXHRcdElcdC1Bam91dGVyIHVuIMOpbMOpbWVudCBwZXJzb25uYWxpc8Opc1xyXG5cdFx0SUlcdC1vYnRlbmlyIGxlcyDDqWzDqW1lbnRzIHBlcnNvbm5hbGlzw6lzXHJcblx0XHRJSUlcdC1vYnRlbmlyIGxlcyBmYWJyaXF1ZXNcclxuXHRcdElWXHQtZ2VzdGlvbiBkZXMgZXNwYWNlIGRlIG5vbXNcclxuXHRmYWJyaXF1ZVx0RnVuY3Rpb25cclxuXHRcdFJldG91cm5lIHVuZSBGYWJyaXF1ZVxyXG5cdFx0QGVzcGFjZURlTm9tXHRTdHJpbmdcclxuXHRcdD0+IEZhYnJpcXVlXHJcblx0RmFicmlxdWUgRnVuY3Rpb24gXHJcblx0XHRDbGFzc2UgcG91ciBjcsOpZXIgZGVzIGNvbXBvc2FudHMgcGVyc29ubmFsaXPDqXMgSFRNTFxyXG5cdFx0QHBhcmFtw6h0cmVzXHRPYmplY3RcclxuXHRcdFx0QG5vbVx0XHRcdFN0cmluZ1xyXG5cdFx0XHRAY29uc3RydWN0ZXVyXHRGdW5jdGlvblxyXG5cdFx0XHRAdGVtcGxhdGVcdFx0dW5kZWZpbmVkIHx8IFN0cmluZ1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRAbW9kZWxlXHRcdFx0SFRNTEVsZW1lbnRcclxuXHRcdEBjb25zdHJ1Y3RldXJcdFx0RnVuY3Rpb24oIEBAY29tcG9zYW50SW50ZXJmYWNlLCBAQHZ1ZUludGVyZmFjZSkgPT4gdm9pZCB8fCBGdW5jdGlvbiggQEB2dWVJbnRlcmZhY2UpOlxyXG5cdFx0XHRBcHBsaXF1w6kgbG9ycyBkdSBwcmVtaWVyIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHRcdFNpIHJldG91cm5lIHVuZSBmb25jdGlvbiwgZWxsZSBzZXJhIGFwcGVsw6llIMOgIGNoYXF1ZSB2aXNpb25uYWdlXHJcblx0XHRcdFxyXG5cdEF0dGVudGlvbiwgbmUgcGFzIGNvbmZvbmRyZSBpbnRlcmZhY2UgYXBwbGljYXRpdmUgb3UgbCdpbnRlcmZhY2UgZCd1biBvYmpldCBhdmVjIHVuIGNvbXBvc2FudCBpbnRlcmZhY2VcclxuXHRcclxuXHRAYWpvdXRlcihAQHZ1ZSlcclxuXHRAYWZmaWNoZXIoQEBub21WdWUpXHJcblx0XHJcblx0XHROT00tLS0tLS0tLS0tLS0tLS1cdEZhYnJpcXVlXHJcblx0XHRUWVBFLS0tLS0tLS0tLS0tLS0tXHRGb25jdGlvbiAoQHBhcmFtw6h0cmVzKSA9PiBGb25jdGlvblxyXG5cdFx0QlVULS0tLS0tLS0tLS0tLS0tLVx0Q3LDqWF0aW9uLCBnZXN0aW9uLCBtYWludGVuYW5jZXMgZCfDqWzDqW1lbnRzIHBlcnNvbm5hbGlzw6lzIEhUTUwoaS5lLiBDdXN0b21FbGVtZW50KVxyXG5cdFx0XHJcblx0XHRmYWJyaXF1ZVxyXG5cdFx0XHRAcGFyYW1ldHJlc1x0T2JqZWN0XHJcblx0XHRcdFx0QFxyXG4qKi9cclxuY29uc3QgaW50ZXJwcmV0ZXVySHRtbCA9ICgoKSA9PlxyXG57XHJcbiAgY29uc3QgaW50ZXJwcmV0ZXVyRG9tID0gbmV3IERPTVBhcnNlcjtcclxuICByZXR1cm4gY2hhaW5lSHRtbCA9PiBpbnRlcnByZXRldXJEb20ucGFyc2VGcm9tU3RyaW5nKGNoYWluZUh0bWwsICd0ZXh0L2h0bWwnKTtcclxufSkoKTtcclxuXHJcbmNvbnN0IGZhYnJpcXVlID0gZXNwYWNlRGVOb20gPT5cclxue1xyXG5cdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbZXNwYWNlRGVOb20sICdzdHJpbmcnLCBuZXcgRXJyb3IoJ2ZhYnJpcXVlQGVzcGFjZURlTm9tIGRvaXQgw6p0cmUgdW4gc3RyaW5nJykgXSB9ICk7XHJcblx0eWJhc3RoaXMuY29udHJhdCh7ZG9pdCA6IFtmYWJyaXF1ZS5lc3BhY2VEZU5vbVtlc3BhY2VEZU5vbV0sICd1bmRlZmluZWQnLCBuZXcgRXJyb3IoJ2ZhYnJpcXVlQGVzcGFjZSBkZSBub20gZMOpasOgIHV0aWxpc8OpJykgXSB9ICk7XHJcblx0Y29uc3QgZGljdGlvbm5haXJlRWzDqW1lbnQgPSB7fTtcclxuXHJcblx0ZmFicmlxdWUuZXNwYWNlRGVOb21bZXNwYWNlRGVOb21dID0gZGljdGlvbm5haXJlRWzDqW1lbnQ7XHJcblx0LyoqXHJcblx0XHRJRWxlbWVudFxyXG5cdFx0XHRAbm9tIFN0cmluZ1xyXG5cdFx0XHRAY29uc3RydWN0ZXVyXHRcdEZ1bmN0aW9uXHJcblx0XHRcdEB0ZW1wbGF0ZVx0XHRcdHVuZGVmaW5lZCB8fCBTdHJpbmdcclxuXHQqKi9cclxuXHRjb25zdCBJRWxlbWVudCA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuSW50ZXJmYWNlVHlww6llXHJcblx0KHtkb2l0IDpcclxuXHR7XHJcblx0XHRub20gOiAnc3RyaW5nJyxcclxuXHRcdGNvbnN0cnVjdGV1ciA6IEZ1bmN0aW9uLFxyXG5cdFx0dGVtcGxhdGUgOiBbJ3VuZGVmaW5lZCcsICdzdHJpbmcnXSBcclxuXHR9fSk7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKHBhcmFtw6h0cmVzKVxyXG5cdHtcclxuXHRcdHRyeXtcdElFbGVtZW50LnZhbGlkZXIocGFyYW3DqHRyZXMpO1x0fVxyXG5cdFx0Y2F0Y2goZSlcclxuXHRcdHtcclxuXHRcdFx0aWYoZS5lc3RGb3JtZWxsZSkgdGhyb3cgZTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVzcGFjZURlTm9tICsgJy1mYWJyaXF1ZUBwYXJhbcOodHJlcyBuXFwnaW1wbMOpbWVudGUgcGFzIGxcXGludGVyZmFjZSBJRWxlbWVudCcpO1xyXG5cdFx0fVxyXG5cdFx0LyoqXHJcblx0XHRcdFByaXbDqVxyXG5cdFx0KiovXHJcblx0XHRjb25zdCBzb2lzQ2xhc3NlRWxlbWVudCA9IHRoaXM7XHJcblx0XHRjb25zdCBwcm90b3R5cGVIdG1sRWxlbWVudCA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKTtcclxuXHRcdGNvbnN0IEludGFuY2VFbGVtZW50SHRtbCA9IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNoU2hhZG93KVxyXG5cdFx0XHRcdHRoaXMuYXR0YWNoU2hhZG93KHttb2RlIDogJ29wZW4nfSk7XHJcblx0XHRcdGVsc2UgLy9kZXByZWNpZWRcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcclxuXHRcdFx0dGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHNvaXNDbGFzc2VFbGVtZW50Lm1vZGVsZS5jbG9uZU5vZGUodHJ1ZSkuY29udGVudCk7XHJcblx0XHRcdHBhcmFtw6h0cmVzLmNvbnN0cnVjdGV1cih0aGlzKTtcclxuXHRcdH07XHJcblx0XHQvKipcclxuXHRcdFx0UHVibGlxdWVcclxuXHRcdCoqL1xyXG5cdFx0dGhpcy5vYnRlbmlyUHJvdG90eXBlID0gKCkgPT4gcHJvdG90eXBlSHRtbEVsZW1lbnQ7XHJcblx0XHR0aGlzLm1vZGVsZSA9IG51bGw7XHJcblx0XHQvKipcclxuXHRcdCAgQ29uc3RydWN0ZXVyXHJcblx0XHQqKi9cclxuXHRcdCgoKSA9PlxyXG5cdFx0e1xyXG5cdFx0ICB2YXIgbW9kZWxlVGVtcG9yYWlyZSA9IGludGVycHJldGV1ckh0bWwocGFyYW3DqHRyZXMudGVtcGxhdGUpO1xyXG5cdFx0ICBtb2RlbGVUZW1wb3JhaXJlID0gbW9kZWxlVGVtcG9yYWlyZS5xdWVyeVNlbGVjdG9yKCd0ZW1wbGF0ZScpO1xyXG5cdFx0ICBtb2RlbGVUZW1wb3JhaXJlLmlubmVySFRNTCArPSAnPHN0eWxlPiAqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtib3gtc2l6aW5nOiBib3JkZXItYm94OyB9JztcclxuXHRcdCAgdGhpcy5tb2RlbGUgPSBtb2RlbGVUZW1wb3JhaXJlO1xyXG5cdFx0fSkoKTtcclxuXHRcdFx0XHJcblx0XHRwcm90b3R5cGVIdG1sRWxlbWVudC5jcmVhdGVkQ2FsbGJhY2sgPSBJbnRhbmNlRWxlbWVudEh0bWw7XHJcblx0XHRwcm90b3R5cGVIdG1sRWxlbWVudC5hdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24oKSBcclxuXHRcdHtcclxuXHRcdFx0Lypjb25zb2xlLmxvZygnYXR0YWNow6k6ICcsIHRoaXMpXHJcblx0XHRcdHliYXN0aGlzLnNvbmRlTXV0YXRpb24ubm91dmVsbGUodGhpcyk7XHJcblx0XHRcdHliYXN0aGlzLnNvbmRlTXV0YXRpb24ubm91dmVsbGUodGhpcy5zaGFkb3dSb290KTsqL1xyXG5cdFx0fTtcclxuXHRcdHByb3RvdHlwZUh0bWxFbGVtZW50LmRldGFjaGVkQ2FsbGJhY2s9IGZ1bmN0aW9uKCkgXHJcblx0XHR7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdkw6l0YWNow6k6ICcsIHRoaXMpXHJcblx0XHR9O1xyXG5cdFx0dHJ5e1x0ZmFicmlxdWUuZXNwYWNlRGVOb21bZXNwYWNlRGVOb21dW3BhcmFtw6h0cmVzLm5vbV0gPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZXNwYWNlRGVOb20gKyAnLScgKyBwYXJhbcOodHJlcy5ub20sIHtwcm90b3R5cGU6IHByb3RvdHlwZUh0bWxFbGVtZW50fSApO1x0fVxyXG5cdFx0Y2F0Y2goZSl7XHR0aHJvdyBuZXcgRXJyb3IoZXNwYWNlRGVOb20gKyAnLWZhYnJpcXVlOiBFcnJldXIgbG9ycyBkZSBsXFwnaW5zY3JpcHRpb24gZGUgQG5vbSAnICsgcGFyYW3DqHRyZXMubm9tKS5saWVyKGUpO1x0fVx0XHRcclxuXHR9O1xyXG59O1xyXG5mYWJyaXF1ZS5lc3BhY2VEZU5vbSA9IHt9O1xyXG5leHBvcnQgZGVmYXVsdCBmYWJyaXF1ZTsiXX0=

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _systemePointage = __webpack_require__(13);

var _systemePointage2 = _interopRequireDefault(_systemePointage);

var _windows = __webpack_require__(14);

var _windows2 = _interopRequireDefault(_windows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
	Object.assign(ybasthis, {
		config: {
			conteneur: document.getElementById('receptacleYbasthis')
		},
		dom: {
			conteneur: null,
			desktop: null
		},
		systemePointage: null
	});

	ybasthis.dom.conteneur = ybasthis.config.conteneur;
	ybasthis.dom.desktop = document.createElement('div');
	ybasthis.dom.desktop.id = 'desktop';
	ybasthis.dom.conteneur.appendChild(ybasthis.dom.desktop);
	Object.assign(ybasthis.dom.conteneur.style, {
		left: '0px',
		top: '0px',
		height: '100%',
		width: '100%',
		position: 'absolute',
		zIndex: 1
	});
	Object.assign(ybasthis.dom.desktop.style, {
		left: '0px',
		top: '0px',
		height: '100%',
		width: '100%',
		position: 'absolute',
		overflow: 'hidden',
		backgroundImage: ' url(./api/4/gui/images/background.png)',
		backgroundSize: '100% 100%',
		zIndex: 2
	});

	ybasthis.systemePointage = new _systemePointage2.default();
	ybasthis.windows = new _windows2.default();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvZ3VpSW5kZXguanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiYXNzaWduIiwieWJhc3RoaXMiLCJjb25maWciLCJjb250ZW5ldXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZG9tIiwiZGVza3RvcCIsInN5c3RlbWVQb2ludGFnZSIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImFwcGVuZENoaWxkIiwic3R5bGUiLCJsZWZ0IiwidG9wIiwiaGVpZ2h0Iiwid2lkdGgiLCJwb3NpdGlvbiIsInpJbmRleCIsIm92ZXJmbG93IiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiLCJ3aW5kb3dzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUNlLFlBQ2Y7QUFDQ0EsUUFBT0MsTUFBUCxDQUFjQyxRQUFkLEVBQ0E7QUFDQ0MsVUFDQTtBQUNDQyxjQUFZQyxTQUFTQyxjQUFULENBQXdCLG9CQUF4QjtBQURiLEdBRkQ7QUFLQ0MsT0FDQTtBQUNDSCxjQUFZLElBRGI7QUFFQ0ksWUFBVTtBQUZYLEdBTkQ7QUFVQ0MsbUJBQWtCO0FBVm5CLEVBREE7O0FBY0FQLFVBQVNLLEdBQVQsQ0FBYUgsU0FBYixHQUF5QkYsU0FBU0MsTUFBVCxDQUFnQkMsU0FBekM7QUFDQUYsVUFBU0ssR0FBVCxDQUFhQyxPQUFiLEdBQXVCSCxTQUFTSyxhQUFULENBQXVCLEtBQXZCLENBQXZCO0FBQ0FSLFVBQVNLLEdBQVQsQ0FBYUMsT0FBYixDQUFxQkcsRUFBckIsR0FBMEIsU0FBMUI7QUFDQVQsVUFBU0ssR0FBVCxDQUFhSCxTQUFiLENBQXVCUSxXQUF2QixDQUFtQ1YsU0FBU0ssR0FBVCxDQUFhQyxPQUFoRDtBQUNBUixRQUFPQyxNQUFQLENBQWNDLFNBQVNLLEdBQVQsQ0FBYUgsU0FBYixDQUF1QlMsS0FBckMsRUFDQTtBQUNDQyxRQUFPLEtBRFI7QUFFQ0MsT0FBTSxLQUZQO0FBR0NDLFVBQVMsTUFIVjtBQUlDQyxTQUFRLE1BSlQ7QUFLQ0MsWUFBVyxVQUxaO0FBTUNDLFVBQVM7QUFOVixFQURBO0FBU0FuQixRQUFPQyxNQUFQLENBQWNDLFNBQVNLLEdBQVQsQ0FBYUMsT0FBYixDQUFxQkssS0FBbkMsRUFDQTtBQUNDQyxRQUFPLEtBRFI7QUFFQ0MsT0FBTSxLQUZQO0FBR0NDLFVBQVMsTUFIVjtBQUlDQyxTQUFRLE1BSlQ7QUFLQ0MsWUFBVyxVQUxaO0FBTUNFLFlBQVcsUUFOWjtBQU9DQyxtQkFBa0IseUNBUG5CO0FBUUNDLGtCQUFpQixXQVJsQjtBQVNDSCxVQUFTO0FBVFYsRUFEQTs7QUFhQWpCLFVBQVNPLGVBQVQsR0FBMkIsK0JBQTNCO0FBQ0FQLFVBQVNxQixPQUFULEdBQW1CLHVCQUFuQjtBQUNBLEMiLCJmaWxlIjoiZ3VpSW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHN5c3RlbWVQb2ludGFnZSBmcm9tICcuL3N5c3RlbWVQb2ludGFnZS5qcyc7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gJy4vd2luZG93cy5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+XHJcbntcclxuXHRPYmplY3QuYXNzaWduKHliYXN0aGlzLFxyXG5cdHtcclxuXHRcdGNvbmZpZyA6XHJcblx0XHR7XHJcblx0XHRcdGNvbnRlbmV1ciA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNlcHRhY2xlWWJhc3RoaXMnKVxyXG5cdFx0fSxcclxuXHRcdGRvbSA6XHJcblx0XHR7XHJcblx0XHRcdGNvbnRlbmV1ciA6IG51bGwsXHJcblx0XHRcdGRlc2t0b3AgOiBudWxsXHJcblx0XHR9LFxyXG5cdFx0c3lzdGVtZVBvaW50YWdlIDogbnVsbFxyXG5cdH0pO1xyXG5cclxuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyID0geWJhc3RoaXMuY29uZmlnLmNvbnRlbmV1cjtcclxuXHR5YmFzdGhpcy5kb20uZGVza3RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdHliYXN0aGlzLmRvbS5kZXNrdG9wLmlkID0gJ2Rlc2t0b3AnO1xyXG5cdHliYXN0aGlzLmRvbS5jb250ZW5ldXIuYXBwZW5kQ2hpbGQoeWJhc3RoaXMuZG9tLmRlc2t0b3ApO1xyXG5cdE9iamVjdC5hc3NpZ24oeWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5zdHlsZSxcclxuXHR7XHJcblx0XHRsZWZ0IDogJzBweCcsXHJcblx0XHR0b3AgOiAnMHB4JyxcclxuXHRcdGhlaWdodCA6ICcxMDAlJyxcclxuXHRcdHdpZHRoIDogJzEwMCUnLFxyXG5cdFx0cG9zaXRpb24gOiAnYWJzb2x1dGUnLFxyXG5cdFx0ekluZGV4IDogMVxyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24oeWJhc3RoaXMuZG9tLmRlc2t0b3Auc3R5bGUsXHJcblx0e1xyXG5cdFx0bGVmdCA6ICcwcHgnLFxyXG5cdFx0dG9wIDogJzBweCcsXHJcblx0XHRoZWlnaHQgOiAnMTAwJScsXHJcblx0XHR3aWR0aCA6ICcxMDAlJyxcclxuXHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcdFxyXG5cdFx0b3ZlcmZsb3cgOiAnaGlkZGVuJyxcclxuXHRcdGJhY2tncm91bmRJbWFnZSA6ICcgdXJsKC4vYXBpLzQvZ3VpL2ltYWdlcy9iYWNrZ3JvdW5kLnBuZyknLFxyXG5cdFx0YmFja2dyb3VuZFNpemUgOiAnMTAwJSAxMDAlJyxcclxuXHRcdHpJbmRleCA6IDJcclxuXHR9KTtcclxuXHJcblx0eWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlID0gbmV3IHN5c3RlbWVQb2ludGFnZTtcclxuXHR5YmFzdGhpcy53aW5kb3dzID0gbmV3IHdpbmRvd3M7XHJcbn1cclxuIl19

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _caseCocher = __webpack_require__(16);

var _caseCocher2 = _interopRequireDefault(_caseCocher);

var _bouton = __webpack_require__(15);

var _bouton2 = _interopRequireDefault(_bouton);

var _menu = __webpack_require__(22);

var _menu2 = _interopRequireDefault(_menu);

var _menuTab = __webpack_require__(21);

var _menuTab2 = _interopRequireDefault(_menuTab);

var _menuOnglet = __webpack_require__(20);

var _menuOnglet2 = _interopRequireDefault(_menuOnglet);

var _interface = __webpack_require__(19);

var _interface2 = _interopRequireDefault(_interface);

var _gallerie = __webpack_require__(18);

var _gallerie2 = _interopRequireDefault(_gallerie);

var _selection = __webpack_require__(23);

var _selection2 = _interopRequireDefault(_selection);

var _choix = __webpack_require__(17);

var _choix2 = _interopRequireDefault(_choix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_caseCocher2.default, _bouton2.default, _menu2.default, _menuTab2.default, _menuOnglet2.default, _interface2.default, _gallerie2.default, _choix2.default, _selection2.default];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9saXN0ZUVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVBLGdMIiwiZmlsZSI6Imxpc3RlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbENhc2VDb2NoZXIgZnJvbSAnLi9lbGVtZW50cy9jYXNlQ29jaGVyLmpzJztcclxuaW1wb3J0IGVsQm91dG9uIGZyb20gJy4vZWxlbWVudHMvYm91dG9uLmpzJztcclxuaW1wb3J0IGVsTWVudSBmcm9tICcuL2VsZW1lbnRzL21lbnUuanMnO1xyXG5pbXBvcnQgZWxNZW51VGFiIGZyb20gJy4vZWxlbWVudHMvbWVudS10YWIuanMnO1xyXG5pbXBvcnQgZWxNZW51T25nbGV0IGZyb20gJy4vZWxlbWVudHMvbWVudS1vbmdsZXQuanMnO1xyXG5pbXBvcnQgZWxJbnRlcmZhY2UgZnJvbSAnLi9lbGVtZW50cy9pbnRlcmZhY2UuanMnO1xyXG5pbXBvcnQgZWxHYWxsZXJpZSBmcm9tICcuL2VsZW1lbnRzL2dhbGxlcmllLmpzJztcclxuaW1wb3J0IGVsU2VsZWN0aW9uIGZyb20gJy4vZWxlbWVudHMvc2VsZWN0aW9uLmpzJztcclxuaW1wb3J0IGVsY2hvaXggZnJvbSAnLi9lbGVtZW50cy9jaG9peC5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0XHJcbltcclxuXHRlbENhc2VDb2NoZXIsXHJcblx0ZWxCb3V0b24sXHJcblx0ZWxNZW51LFxyXG5cdGVsTWVudVRhYixcclxuXHRlbE1lbnVPbmdsZXQsXHJcblx0ZWxJbnRlcmZhY2UsXHJcblx0ZWxHYWxsZXJpZSxcclxuXHRlbGNob2l4LFxyXG5cdGVsU2VsZWN0aW9uXHJcbl07Il19

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = __webpack_require__(28);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(31);

var _index4 = _interopRequireDefault(_index3);

var _index5 = __webpack_require__(25);

var _index6 = _interopRequireDefault(_index5);

var _index7 = __webpack_require__(26);

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
	var guiEdi = new ybasthis.windows.Window({ pos: { x: 10, y: 110 }, dim: { x: 550, y: 305 }, titre: 'EDI' });
	var guiEdi2 = new ybasthis.windows.Window({ pos: { x: 10, y: 5 }, dim: { x: 428, y: 100 }, titre: 'EDI2' });
	guiEdi.dom.querySelector('.ybasthisFenetreContenu').appendChild(document.querySelector('#ediContent'));
	var espaceDeTravailDom = guiEdi.dom.querySelector('#espaceDeTravail');
	var decalage = getComputedStyle(guiEdi.dom.querySelector('#menuPrincipal')).height;
	espaceDeTravailDom.style.top = decalage;
	espaceDeTravailDom.style.height = ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(espaceDeTravailDom).height) - ybasthis.utilitaires.grandeurs.enleverUnité(decalage) + 'px';

	var interfaceEspaceDeTravail = document.querySelector('#espaceDeTravail');
	interfaceEspaceDeTravail.ajouter(_index2.default);
	interfaceEspaceDeTravail.ajouter(_index4.default);
	interfaceEspaceDeTravail.ajouter(_index6.default);
	interfaceEspaceDeTravail.ajouter(_index8.default);
	//	NOTE Evènements #menuPrincipal.
	(function () {
		var menuElement = guiEdi.dom.querySelector('#menuPrincipal');
		menuElement.addEventListener('affichage', function (e) {
			var cible = e.detail.cible;

			if (cible === 'Espace Travail') interfaceEspaceDeTravail.afficher('espaceTravail');else if (cible === 'Modules') interfaceEspaceDeTravail.afficher('modules');else if (cible === 'Administration') interfaceEspaceDeTravail.afficher('administration');else if (cible === 'Autres') interfaceEspaceDeTravail.afficher('autres');else throw new Error('Onglet non géré: ' + nomOnglet + '!');
		});
	})();
	/**
 	Test
 **/
	{
		var aaaTestDom = '\n\t\t\t<yb-menu>\n\t\t\t\t<yb-onglet nom=\'Modele\' type=\'bouton\'></yb-onglet>\n\t\t\t\t\t<yb-onglet nom=\'Impl\xE9mentation\' ></yb-onglet>\n\t\t\t\t<yb-onglet nom=\'Modele\' type=\'selection\'>\n\t\t\t\t\t<yb-choix nom=\'HAHA\' > </yb-choix>\n\t\t\t\t\t<yb-choix nom=\'HOHO\' > </yb-choix>\n\t\t\t\t\t<yb-choix nom=\'Penis\' > </yb-choix>\n\t\t\t\t</yb-onglet>\n\t\t\t</yb-menu>\n\t\t\t<yb-bouton>Test</yb-bouton>\n\t\t';
		guiEdi2.dom.querySelector('.ybasthisFenetreContenu').innerHTML = aaaTestDom;
		//guiEdi2.dom.querySelector('.ybasthisFenetreContenu').querySelector('yb-menu').appliquerBordure();
		var espaceTravailDom = interfaceEspaceDeTravail.afficher('espaceTravail');
		var interface2 = espaceTravailDom.querySelector('yb-interface');
		//interface2.afficher('projetClasse');
	}
	{
		var kaka = [];
		document.body.lastChild.parcourirBas(function (zigzag) {
			return kaka.push(zigzag);
		});
		console.log('kaka', kaka);
	}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9wcmluY2lwYWxlLmpzIl0sIm5hbWVzIjpbImd1aUVkaSIsInliYXN0aGlzIiwid2luZG93cyIsIldpbmRvdyIsInBvcyIsIngiLCJ5IiwiZGltIiwidGl0cmUiLCJndWlFZGkyIiwiZG9tIiwicXVlcnlTZWxlY3RvciIsImFwcGVuZENoaWxkIiwiZG9jdW1lbnQiLCJlc3BhY2VEZVRyYXZhaWxEb20iLCJkZWNhbGFnZSIsImdldENvbXB1dGVkU3R5bGUiLCJoZWlnaHQiLCJzdHlsZSIsInRvcCIsInV0aWxpdGFpcmVzIiwiZ3JhbmRldXJzIiwiZW5sZXZlclVuaXTDqSIsImludGVyZmFjZUVzcGFjZURlVHJhdmFpbCIsImFqb3V0ZXIiLCJtZW51RWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjaWJsZSIsImUiLCJkZXRhaWwiLCJhZmZpY2hlciIsIkVycm9yIiwibm9tT25nbGV0IiwiYWFhVGVzdERvbSIsImlubmVySFRNTCIsImVzcGFjZVRyYXZhaWxEb20iLCJpbnRlcmZhY2UyIiwia2FrYSIsImJvZHkiLCJsYXN0Q2hpbGQiLCJwYXJjb3VyaXJCYXMiLCJwdXNoIiwiemlnemFnIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBQ2UsWUFDZjtBQUNDLEtBQU1BLFNBQVMsSUFBSUMsU0FBU0MsT0FBVCxDQUFpQkMsTUFBckIsQ0FBNEIsRUFBQ0MsS0FBSyxFQUFDQyxHQUFHLEVBQUosRUFBUUMsR0FBRSxHQUFWLEVBQU4sRUFBc0JDLEtBQUssRUFBQ0YsR0FBRyxHQUFKLEVBQVNDLEdBQUksR0FBYixFQUEzQixFQUE4Q0UsT0FBTyxLQUFyRCxFQUE1QixDQUFmO0FBQ0EsS0FBTUMsVUFBVSxJQUFJUixTQUFTQyxPQUFULENBQWlCQyxNQUFyQixDQUE0QixFQUFDQyxLQUFLLEVBQUNDLEdBQUcsRUFBSixFQUFRQyxHQUFFLENBQVYsRUFBTixFQUFvQkMsS0FBSyxFQUFDRixHQUFHLEdBQUosRUFBU0MsR0FBSSxHQUFiLEVBQXpCLEVBQTRDRSxPQUFPLE1BQW5ELEVBQTVCLENBQWhCO0FBQ0FSLFFBQU9VLEdBQVAsQ0FBV0MsYUFBWCxDQUF5Qix5QkFBekIsRUFBb0RDLFdBQXBELENBQWdFQyxTQUFTRixhQUFULENBQXVCLGFBQXZCLENBQWhFO0FBQ0EsS0FBTUcscUJBQXFCZCxPQUFPVSxHQUFQLENBQVdDLGFBQVgsQ0FBeUIsa0JBQXpCLENBQTNCO0FBQ0EsS0FBSUksV0FBV0MsaUJBQWlCaEIsT0FBT1UsR0FBUCxDQUFXQyxhQUFYLENBQXlCLGdCQUF6QixDQUFqQixFQUE4RE0sTUFBN0U7QUFDQUgsb0JBQW1CSSxLQUFuQixDQUF5QkMsR0FBekIsR0FBK0JKLFFBQS9CO0FBQ0FELG9CQUFtQkksS0FBbkIsQ0FBeUJELE1BQXpCLEdBQW1DaEIsU0FBU21CLFdBQVQsQ0FBcUJDLFNBQXJCLENBQStCQyxZQUEvQixDQUE0Q04saUJBQWlCRixrQkFBakIsRUFBcUNHLE1BQWpGLElBQTJGaEIsU0FBU21CLFdBQVQsQ0FBcUJDLFNBQXJCLENBQStCQyxZQUEvQixDQUE0Q1AsUUFBNUMsQ0FBNUYsR0FBc0osSUFBeEw7O0FBRUEsS0FBTVEsMkJBQTJCVixTQUFTRixhQUFULENBQXVCLGtCQUF2QixDQUFqQztBQUNBWSwwQkFBeUJDLE9BQXpCO0FBQ0FELDBCQUF5QkMsT0FBekI7QUFDQUQsMEJBQXlCQyxPQUF6QjtBQUNBRCwwQkFBeUJDLE9BQXpCO0FBQ0E7QUFDQSxFQUFDLFlBQ0Q7QUFDQyxNQUFNQyxjQUFjekIsT0FBT1UsR0FBUCxDQUFXQyxhQUFYLENBQXlCLGdCQUF6QixDQUFwQjtBQUNBYyxjQUFZQyxnQkFBWixDQUE2QixXQUE3QixFQUEwQyxhQUMxQztBQUFBLE9BQ01DLEtBRE4sR0FDZUMsRUFBRUMsTUFEakIsQ0FDTUYsS0FETjs7QUFFQyxPQUFHQSxVQUFVLGdCQUFiLEVBQStCSix5QkFBeUJPLFFBQXpCLENBQWtDLGVBQWxDLEVBQS9CLEtBQ0ssSUFBR0gsVUFBVSxTQUFiLEVBQXdCSix5QkFBeUJPLFFBQXpCLENBQWtDLFNBQWxDLEVBQXhCLEtBQ0EsSUFBR0gsVUFBVSxnQkFBYixFQUFnQ0oseUJBQXlCTyxRQUF6QixDQUFrQyxnQkFBbEMsRUFBaEMsS0FDQSxJQUFHSCxVQUFVLFFBQWIsRUFBdUJKLHlCQUF5Qk8sUUFBekIsQ0FBa0MsUUFBbEMsRUFBdkIsS0FDQSxNQUFNLElBQUlDLEtBQUosQ0FBVSxzQkFBc0JDLFNBQXRCLEdBQWtDLEdBQTVDLENBQU47QUFDTCxHQVJEO0FBVUEsRUFiRDtBQWNBOzs7QUFHQTtBQUNDLE1BQUlDLHViQUFKO0FBYUF4QixVQUFRQyxHQUFSLENBQVlDLGFBQVosQ0FBMEIseUJBQTFCLEVBQXFEdUIsU0FBckQsR0FBaUVELFVBQWpFO0FBQ0E7QUFDQSxNQUFJRSxtQkFBbUJaLHlCQUF5Qk8sUUFBekIsQ0FBa0MsZUFBbEMsQ0FBdkI7QUFDQSxNQUFJTSxhQUFhRCxpQkFBaUJ4QixhQUFqQixDQUErQixjQUEvQixDQUFqQjtBQUNBO0FBQ0E7QUFDRDtBQUNDLE1BQUkwQixPQUFPLEVBQVg7QUFDQXhCLFdBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0JDLFlBQXhCLENBQXFDO0FBQUEsVUFBVUgsS0FBS0ksSUFBTCxDQUFVQyxNQUFWLENBQVY7QUFBQSxHQUFyQztBQUNBQyxVQUFRQyxHQUFSLENBQVksTUFBWixFQUFvQlAsSUFBcEI7QUFFQTtBQUNELEMiLCJmaWxlIjoicHJpbmNpcGFsZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgdnVlRXNwYWNlVHJhdmFpbCBmcm9tICcuL2VzcGFjZVRyYXZhaWwvaW5kZXguanMnO1xyXG5pbXBvcnQgdnVlTW9kdWxlcyBmcm9tICcuL21vZHVsZXMvaW5kZXguanMnO1xyXG5pbXBvcnQgdnVlQWRtaW5pc3RyYXRpb24gZnJvbSAnLi9hZG1pbmlzdHJhdGlvbi9pbmRleC5qcyc7XHJcbmltcG9ydCB2dWVBdXRyZXMgZnJvbSAnLi9hdXRyZXMvaW5kZXguanMnO1xyXG5leHBvcnQgZGVmYXVsdCAoKSA9PlxyXG57XHJcblx0Y29uc3QgZ3VpRWRpID0gbmV3IHliYXN0aGlzLndpbmRvd3MuV2luZG93KHtwb3M6IHt4OiAxMCwgeToxMTB9LCBkaW06IHt4OiA1NTAsIHkgOiAzMDV9LCB0aXRyZTogJ0VESSd9KTtcclxuXHRjb25zdCBndWlFZGkyID0gbmV3IHliYXN0aGlzLndpbmRvd3MuV2luZG93KHtwb3M6IHt4OiAxMCwgeTo1fSwgZGltOiB7eDogNDI4LCB5IDogMTAwfSwgdGl0cmU6ICdFREkyJ30pO1xyXG5cdGd1aUVkaS5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUNvbnRlbnUnKS5hcHBlbmRDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWRpQ29udGVudCcpICk7XHJcblx0Y29uc3QgZXNwYWNlRGVUcmF2YWlsRG9tID0gZ3VpRWRpLmRvbS5xdWVyeVNlbGVjdG9yKCcjZXNwYWNlRGVUcmF2YWlsJyk7XHJcblx0bGV0IGRlY2FsYWdlID0gZ2V0Q29tcHV0ZWRTdHlsZShndWlFZGkuZG9tLnF1ZXJ5U2VsZWN0b3IoJyNtZW51UHJpbmNpcGFsJykgKS5oZWlnaHQ7XHJcblx0ZXNwYWNlRGVUcmF2YWlsRG9tLnN0eWxlLnRvcCA9IGRlY2FsYWdlO1xyXG5cdGVzcGFjZURlVHJhdmFpbERvbS5zdHlsZS5oZWlnaHQgPSAoeWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koZ2V0Q29tcHV0ZWRTdHlsZShlc3BhY2VEZVRyYXZhaWxEb20pLmhlaWdodCkgLSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShkZWNhbGFnZSkgKSArICdweCc7XHJcblx0XHRcclxuXHRjb25zdCBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXNwYWNlRGVUcmF2YWlsJyk7XHJcblx0aW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFqb3V0ZXIodnVlRXNwYWNlVHJhdmFpbCk7XHJcblx0aW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFqb3V0ZXIodnVlTW9kdWxlcyk7XHJcblx0aW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFqb3V0ZXIodnVlQWRtaW5pc3RyYXRpb24pO1xyXG5cdGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5ham91dGVyKHZ1ZUF1dHJlcyk7XHJcblx0Ly9cdE5PVEUgRXbDqG5lbWVudHMgI21lbnVQcmluY2lwYWwuXHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgbWVudUVsZW1lbnQgPSBndWlFZGkuZG9tLnF1ZXJ5U2VsZWN0b3IoJyNtZW51UHJpbmNpcGFsJyk7XHJcblx0XHRtZW51RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZmZpY2hhZ2UnLCBlID0+XHJcblx0XHR7XHJcblx0XHRcdGxldCB7Y2libGV9ID0gZS5kZXRhaWw7XHJcblx0XHRcdGlmKGNpYmxlID09PSAnRXNwYWNlIFRyYXZhaWwnKSBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ2VzcGFjZVRyYXZhaWwnKTtcclxuXHRcdFx0ZWxzZSBpZihjaWJsZSA9PT0gJ01vZHVsZXMnKSBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ21vZHVsZXMnKTtcclxuXHRcdFx0ZWxzZSBpZihjaWJsZSA9PT0gJ0FkbWluaXN0cmF0aW9uJykgIGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5hZmZpY2hlcignYWRtaW5pc3RyYXRpb24nKTtcclxuXHRcdFx0ZWxzZSBpZihjaWJsZSA9PT0gJ0F1dHJlcycpIGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5hZmZpY2hlcignYXV0cmVzJyk7XHJcblx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdPbmdsZXQgbm9uIGfDqXLDqTogJyArIG5vbU9uZ2xldCArICchJyk7XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHR9KSgpO1xyXG5cdC8qKlxyXG5cdFx0VGVzdFxyXG5cdCoqL1xyXG5cdHtcclxuXHRcdGxldCBhYWFUZXN0RG9tID0gXHJcblx0XHRgXHJcblx0XHRcdDx5Yi1tZW51PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdNb2RlbGUnIHR5cGU9J2JvdXRvbic+PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0XHQ8eWItb25nbGV0IG5vbT0nSW1wbMOpbWVudGF0aW9uJyA+PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0PHliLW9uZ2xldCBub209J01vZGVsZScgdHlwZT0nc2VsZWN0aW9uJz5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0hBSEEnID4gPC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0hPSE8nID4gPC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J1BlbmlzJyA+IDwveWItY2hvaXg+XHJcblx0XHRcdFx0PC95Yi1vbmdsZXQ+XHJcblx0XHRcdDwveWItbWVudT5cclxuXHRcdFx0PHliLWJvdXRvbj5UZXN0PC95Yi1ib3V0b24+XHJcblx0XHRgO1xyXG5cdFx0Z3VpRWRpMi5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUNvbnRlbnUnKS5pbm5lckhUTUwgPSBhYWFUZXN0RG9tO1xyXG5cdFx0Ly9ndWlFZGkyLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlQ29udGVudScpLnF1ZXJ5U2VsZWN0b3IoJ3liLW1lbnUnKS5hcHBsaXF1ZXJCb3JkdXJlKCk7XHJcblx0XHRsZXQgZXNwYWNlVHJhdmFpbERvbSA9IGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5hZmZpY2hlcignZXNwYWNlVHJhdmFpbCcpO1xyXG5cdFx0bGV0IGludGVyZmFjZTIgPSBlc3BhY2VUcmF2YWlsRG9tLnF1ZXJ5U2VsZWN0b3IoJ3liLWludGVyZmFjZScpO1xyXG5cdFx0Ly9pbnRlcmZhY2UyLmFmZmljaGVyKCdwcm9qZXRDbGFzc2UnKTtcclxuXHR9XHJcblx0e1xyXG5cdFx0dmFyIGtha2EgPSBbXTtcclxuXHRcdGRvY3VtZW50LmJvZHkubGFzdENoaWxkLnBhcmNvdXJpckJhcyh6aWd6YWcgPT4ga2FrYS5wdXNoKHppZ3phZykgKTtcclxuXHRcdGNvbnNvbGUubG9nKCdrYWthJywga2FrYSk7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHRcdFxyXG5cdFx0Il19

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (options) {
	var _this = this;

	var self = this;
	try {
		options = options || {};
		options.pos = options.pos || { x: 0, y: 0 };
		options.dim = options.dim || { x: 250, y: 92 };

		this.titre = options.titre || ybasthis.windows.titreMax++;
		this.pos = options.pos;
		this.dim = options.dim;
		this.dom = void ybasthis.dom.desktop.appendChild(domFenetre.cloneNode(true)) || ybasthis.dom.desktop.lastChild;
		this.close = function () {
			_this.dom.remove();
			ybasthis.windows.liste.supprimer(_this);
		};
		this.dimmensionner = function (x, y) {
			_this.dom.style.width = x + 'px';
			_this.dom.style.height = y + 'px';
		};
		this.nommer = function (nom) {
			if (_this.titre === nom) throw new Error('nommage d\'une fenêtre avec un nouveau nom identique');
			_this.titre = nom || _this.titre;
			_this.dom.querySelector('.ybasthisFenetreTitre p').textContent = _this.titre;
		};
		var colisionContinue = false;
		this.positionner = function (x, y) {
			var colision = false;
			/*	Détection des colisions
   	Logique:
   		Pour chaque fenetre récupérer sa position ET sa taille
   */
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = ybasthis.windows.liste[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var fenetre = _step.value;

					if (fenetre.app === _this.app && fenetre.titre === _this.titre) continue;
					var pos = fenetre.pos,
					    dim = fenetre.dim;

					if (_this.pos.x >= pos.x && _this.pos.x <= pos.x + dim.x && _this.pos.y >= pos.y && _this.pos.y <= pos.y + dim.y) colision = true;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var deplacer = true;
			if (colision) {
				console.log('collision');
				if (colisionContinue === false) {
					ybasthis.systemePointage.bloquer();
					deplacer = false;
					var x = setTimeout(function () {
						return ybasthis.systemePointage.débloquer();
					}, 500);
				}
				colisionContinue = true;
			} else colisionContinue = false;
			if (deplacer) {
				_this.pos.x = x;
				_this.pos.y = y;
				_this.dom.style.left = x + 'px';
				_this.dom.style.top = y + 'px';
			}
		};
		(function () {
			var fenetreHautDom = _this.dom.querySelector('.ybasthisFenetreHaut');

			_this.dom.addEventListener('mousedown', function (event) {
				return ybasthis.windows.toFirstPlan(_this);
			});
			_this.dom.querySelector('.ybasthisFenetreHaut').addEventListener('mousedown', function (event) {
				ybasthis.windows.initialiserDéplacement(_this);
			});

			fenetreHautDom.addEventListener('mouseover', function (e) {
				return e.target.nodeName === 'P' ? ybasthis.systemePointage.changeCursor(false, 'deplacer') : void 1;
			});
			fenetreHautDom.addEventListener('mouseout', function () {
				return ybasthis.systemePointage.changeCursor(false, 'normal');
			});
			var buttons = _this.dom.querySelectorAll('.ybasthisFenetreHaut img');
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = buttons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var button = _step2.value;

					button.addEventListener('mouseover', function () {
						return ybasthis.systemePointage.changeCursor(false, 'declencher');
					});
					button.addEventListener('mouseout', function () {
						return ybasthis.systemePointage.changeCursor(false, 'normal');
					});
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			buttons[2].addEventListener('click', _this.close);
		})();
		this.positionner(this.pos.x, this.pos.y);
		this.dimmensionner(this.dim.x, this.dim.y);
		this.nommer();
		ybasthis.windows.liste.ajouter(this);

		var contenuDom = this.dom.querySelector('.' + _classe_('Contenu'));
		contenuDom.style.height = ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(contenuDom).height) - 32 + 'px';
	} catch (err) {
		console.log('errInitialisation module:	', err);
	}
};

var _classe_ = function _classe_(nom) {
	return 'ybasthisFenetre' + nom;
};

;

var domFenetre = document.createElement('div');
/**
	<div>
		<div class='Haut'>
			<div class='Titre'>
				<p></p>
			</div>
			<div class='Boutons'></div>
		</div>
		<div class='Contenu'></div>
	</div>
**/
(function () {
	var créerElément = function créerElément(el) {
		return document.createElement(el);
	};
	var div = function div() {
		return créerElément('div');
	};

	var tab = [];
	for (var i = 0; i <= 1; i++) {
		tab.push(div());
	}for (var i = 0; i <= 1; i++) {
		tab[0].appendChild(div());
	}tab[0].className = _classe_('Haut');
	tab[0].children[0].className = _classe_('Titre');
	tab[0].children[0].appendChild(créerElément('p'));
	tab[0].children[1].className = _classe_('Boutons');
	tab[0].children[1].appendChild(créerElément('img'));
	tab[0].children[1].appendChild(créerElément('img'));
	tab[0].children[1].appendChild(créerElément('img'));
	tab[0].children[1].children[0].src = './api/4/gui/images/minimiser.png';
	tab[0].children[1].children[1].src = './api/4/gui/images/reduire.png';
	tab[0].children[1].children[2].src = './api/4/gui/images/fermer.png';
	tab[1].className = _classe_('Contenu');

	Object.assign(tab[0].style, {
		height: 32 + 'px',
		width: '100%',
		position: 'absolute',
		borderBottom: '1px solid black'
	});
	Object.assign(tab[0].children[0].style, {
		position: 'absolute',
		margin: '0px',
		height: '100%',
		width: '100%'
	});
	Object.assign(tab[0].children[1].style, {
		top: '4px',
		position: 'absolute',
		right: '4px'
	});
	Object.assign(tab[0].children[0].children[0].style, {
		verticalAlign: 'middle',
		position: 'absolute',
		margin: '0px',
		height: '100%',
		width: '100%'
	});
	Object.assign(tab[0].children[1].children[0].style, {
		height: '24px',
		width: '24px',
		right: '8px',
		position: 'relative'
	});
	Object.assign(tab[0].children[1].children[1].style, {
		height: '24px',
		width: '24px',
		right: '4px',
		position: 'relative'
	});
	Object.assign(tab[0].children[1].children[2].style, {
		height: '24px',
		width: '24px',
		right: '0px',
		position: 'relative'
	});
	Object.assign(tab[1].style, {
		height: '100%',
		top: '32px',
		position: 'relative',
		overflow: 'auto'
	});
	Object.assign(domFenetre.style, {
		height: 125 + 'px',
		width: 250 + 'px',
		backgroundColor: '#D4D4D4',
		boxShadow: '0px 0px 9px white',
		position: 'absolute',
		borderColor: 'black',
		borderStyle: 'solid',
		borderWidth: '1px'
	});
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = tab[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var el = _step3.value;

			domFenetre.appendChild(el);
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvV2luZG93LmpzIl0sIm5hbWVzIjpbIm9wdGlvbnMiLCJzZWxmIiwicG9zIiwieCIsInkiLCJkaW0iLCJ0aXRyZSIsInliYXN0aGlzIiwid2luZG93cyIsInRpdHJlTWF4IiwiZG9tIiwiZGVza3RvcCIsImFwcGVuZENoaWxkIiwiZG9tRmVuZXRyZSIsImNsb25lTm9kZSIsImxhc3RDaGlsZCIsImNsb3NlIiwicmVtb3ZlIiwibGlzdGUiLCJzdXBwcmltZXIiLCJkaW1tZW5zaW9ubmVyIiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsIm5vbW1lciIsIm5vbSIsIkVycm9yIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY29saXNpb25Db250aW51ZSIsInBvc2l0aW9ubmVyIiwiY29saXNpb24iLCJmZW5ldHJlIiwiYXBwIiwiZGVwbGFjZXIiLCJjb25zb2xlIiwibG9nIiwic3lzdGVtZVBvaW50YWdlIiwiYmxvcXVlciIsInNldFRpbWVvdXQiLCJkw6libG9xdWVyIiwibGVmdCIsInRvcCIsImZlbmV0cmVIYXV0RG9tIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvRmlyc3RQbGFuIiwiaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQiLCJlIiwidGFyZ2V0Iiwibm9kZU5hbWUiLCJjaGFuZ2VDdXJzb3IiLCJidXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImJ1dHRvbiIsImFqb3V0ZXIiLCJjb250ZW51RG9tIiwiX2NsYXNzZV8iLCJ1dGlsaXRhaXJlcyIsImdyYW5kZXVycyIsImVubGV2ZXJVbml0w6kiLCJnZXRDb21wdXRlZFN0eWxlIiwiZXJyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3LDqWVyRWzDqW1lbnQiLCJlbCIsImRpdiIsInRhYiIsImkiLCJwdXNoIiwiY2xhc3NOYW1lIiwiY2hpbGRyZW4iLCJzcmMiLCJPYmplY3QiLCJhc3NpZ24iLCJwb3NpdGlvbiIsImJvcmRlckJvdHRvbSIsIm1hcmdpbiIsInJpZ2h0IiwidmVydGljYWxBbGlnbiIsIm92ZXJmbG93IiwiYmFja2dyb3VuZENvbG9yIiwiYm94U2hhZG93IiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBRWUsVUFBU0EsT0FBVCxFQUNmO0FBQUE7O0FBQ0MsS0FBTUMsT0FBTyxJQUFiO0FBQ0EsS0FDQTtBQUNDRCxZQUFVQSxXQUFXLEVBQXJCO0FBQ0FBLFVBQVFFLEdBQVIsR0FBY0YsUUFBUUUsR0FBUixJQUFlLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFFLENBQVIsRUFBN0I7QUFDQUosVUFBUUssR0FBUixHQUFjTCxRQUFRSyxHQUFSLElBQWUsRUFBQ0YsR0FBRSxHQUFILEVBQVFDLEdBQUUsRUFBVixFQUE3Qjs7QUFFQSxPQUFLRSxLQUFMLEdBQWFOLFFBQVFNLEtBQVIsSUFBaUJDLFNBQVNDLE9BQVQsQ0FBaUJDLFFBQWpCLEVBQTlCO0FBQ0EsT0FBS1AsR0FBTCxHQUFXRixRQUFRRSxHQUFuQjtBQUNBLE9BQUtHLEdBQUwsR0FBV0wsUUFBUUssR0FBbkI7QUFDQSxPQUFLSyxHQUFMLEdBQVcsS0FBS0gsU0FBU0csR0FBVCxDQUFhQyxPQUFiLENBQXFCQyxXQUFyQixDQUFpQ0MsV0FBV0MsU0FBWCxDQUFxQixJQUFyQixDQUFqQyxDQUFMLElBQXdFUCxTQUFTRyxHQUFULENBQWFDLE9BQWIsQ0FBcUJJLFNBQXhHO0FBQ0EsT0FBS0MsS0FBTCxHQUFhLFlBQ2I7QUFDQyxTQUFLTixHQUFMLENBQVNPLE1BQVQ7QUFDQVYsWUFBU0MsT0FBVCxDQUFpQlUsS0FBakIsQ0FBdUJDLFNBQXZCO0FBQ0EsR0FKRDtBQUtBLE9BQUtDLGFBQUwsR0FBcUIsVUFBQ2pCLENBQUQsRUFBSUMsQ0FBSixFQUNyQjtBQUNDLFNBQUtNLEdBQUwsQ0FBU1csS0FBVCxDQUFlQyxLQUFmLEdBQXVCbkIsSUFBSSxJQUEzQjtBQUNBLFNBQUtPLEdBQUwsQ0FBU1csS0FBVCxDQUFlRSxNQUFmLEdB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QWhCLEVBQW1CQSxRQUFuQixDQUE0QixDQUE1QixFQUErQmxELEtBQTdDLEVBQ0E7QUFDQ0UsVUFBUyxNQURWO0FBRUNELFNBQVMsTUFGVjtBQUdDd0QsU0FBUyxLQUhWO0FBSUNILFlBQVU7QUFKWCxFQURBO0FBT0FGLFFBQU9DLE1BQVAsQ0FBY1AsSUFBSSxDQUFKLEVBQU85QyxLQUFyQixFQUNBO0FBQ0NFLFVBQVMsTUFEVjtBQUVDbUIsT0FBTyxNQUZSO0FBR0NpQyxZQUFVLFVBSFg7QUFJQ0ssWUFBVTtBQUpYLEVBREE7QUFPQVAsUUFBT0MsTUFBUCxDQUFjN0QsV0FBV1EsS0FBekIsRUFDQTtBQUNDRSxVQUFhLE1BQU0sSUFEcEI7QUFFQ0QsU0FBWSxNQUFNLElBRm5CO0FBR0MyRCxtQkFBaUIsU0FIbEI7QUFJQ0MsYUFBYyxtQkFKZjtBQUtDUCxZQUFjLFVBTGY7QUFNQ1EsZUFBZSxPQU5oQjtBQU9DQyxlQUFlLE9BUGhCO0FBUUNDLGVBQWU7QUFSaEIsRUFEQTtBQTVFRDtBQUFBO0FBQUE7O0FBQUE7QUF1RkMsd0JBQWNsQixHQUFkO0FBQUEsT0FBUUYsRUFBUjs7QUFDQ3BELGNBQVdELFdBQVgsQ0FBdUJxRCxFQUF2QjtBQUREO0FBdkZEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF5RkMsQ0ExRkQiLCJmaWxlIjoiV2luZG93LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfY2xhc3NlXyA9IG5vbSA9PiAneWJhc3RoaXNGZW5ldHJlJyArIG5vbTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbntcclxuXHRjb25zdCBzZWxmID0gdGhpcztcclxuXHR0cnlcclxuXHR7XHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHRcdG9wdGlvbnMucG9zID0gb3B0aW9ucy5wb3MgfHwge3g6MCwgeTowfTtcclxuXHRcdG9wdGlvbnMuZGltID0gb3B0aW9ucy5kaW0gfHwge3g6MjUwLCB5OjkyfTtcclxuXHJcblx0XHR0aGlzLnRpdHJlID0gb3B0aW9ucy50aXRyZSB8fCB5YmFzdGhpcy53aW5kb3dzLnRpdHJlTWF4Kys7XHJcblx0XHR0aGlzLnBvcyA9IG9wdGlvbnMucG9zO1xyXG5cdFx0dGhpcy5kaW0gPSBvcHRpb25zLmRpbTtcclxuXHRcdHRoaXMuZG9tID0gdm9pZCh5YmFzdGhpcy5kb20uZGVza3RvcC5hcHBlbmRDaGlsZChkb21GZW5ldHJlLmNsb25lTm9kZSh0cnVlKSApICkgfHwgeWJhc3RoaXMuZG9tLmRlc2t0b3AubGFzdENoaWxkO1xyXG5cdFx0dGhpcy5jbG9zZSA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZG9tLnJlbW92ZSgpO1xyXG5cdFx0XHR5YmFzdGhpcy53aW5kb3dzLmxpc3RlLnN1cHByaW1lcih0aGlzKTtcclxuXHRcdH07XHJcblx0XHR0aGlzLmRpbW1lbnNpb25uZXIgPSAoeCwgeSkgPT5cclxuXHRcdHtcclxuXHRcdFx0dGhpcy5kb20uc3R5bGUud2lkdGggPSB4ICsgJ3B4JztcclxuXHRcdFx0dGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0geSArICdweCc7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5ub21tZXIgPSBub20gPT5cclxuXHRcdHtcclxuXHRcdFx0aWYodGhpcy50aXRyZSA9PT0gbm9tKSB0aHJvdyBuZXcgRXJyb3IoJ25vbW1hZ2UgZFxcJ3VuZSBmZW7DqnRyZSBhdmVjIHVuIG5vdXZlYXUgbm9tIGlkZW50aXF1ZScpO1xyXG5cdFx0XHR0aGlzLnRpdHJlID0gbm9tIHx8IHRoaXMudGl0cmU7XHJcblx0XHRcdHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoJy55YmFzdGhpc0ZlbmV0cmVUaXRyZSBwJykudGV4dENvbnRlbnQgPSB0aGlzLnRpdHJlO1xyXG5cdFx0XHRcclxuXHRcdH07XHJcblx0XHR2YXIgY29saXNpb25Db250aW51ZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5wb3NpdGlvbm5lciA9ICh4LCB5KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgY29saXNpb24gPSBmYWxzZTtcclxuXHRcdFx0LypcdETDqXRlY3Rpb24gZGVzIGNvbGlzaW9uc1xyXG5cdFx0XHRcdExvZ2lxdWU6XHJcblx0XHRcdFx0XHRQb3VyIGNoYXF1ZSBmZW5ldHJlIHLDqWN1cMOpcmVyIHNhIHBvc2l0aW9uIEVUIHNhIHRhaWxsZVxyXG5cdFx0XHQqL1xyXG5cdFx0XHRmb3IodmFyIGZlbmV0cmUgb2YgeWJhc3RoaXMud2luZG93cy5saXN0ZSApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZigoZmVuZXRyZS5hcHAgPT09IHRoaXMuYXBwKSAmJiAoZmVuZXRyZS50aXRyZSA9PT0gdGhpcy50aXRyZSkgKSBjb250aW51ZTtcclxuXHRcdFx0XHRjb25zdCB7cG9zLCBkaW19ID0gZmVuZXRyZTtcclxuXHRcdFx0XHRpZiAoKCh0aGlzLnBvcy54ID49IHBvcy54KSAmJiAodGhpcy5wb3MueCA8PSBwb3MueCArIGRpbS54KSkgJiZcclxuXHRcdFx0XHRcdCgodGhpcy5wb3MueSA+PSBwb3MueSkgJiYgKHRoaXMucG9zLnkgPD0gcG9zLnkgKyBkaW0ueSkpKVxyXG5cdFx0XHRcdFx0Y29saXNpb24gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBkZXBsYWNlciA9IHRydWU7XHJcblx0XHRcdGlmKGNvbGlzaW9uKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NvbGxpc2lvbicpO1xyXG5cdFx0XHRcdGlmKGNvbGlzaW9uQ29udGludWUgPT09IGZhbHNlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5ibG9xdWVyKCk7XHJcblx0XHRcdFx0XHRkZXBsYWNlciA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dmFyIHggPSBzZXRUaW1lb3V0KCgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5kw6libG9xdWVyKCksIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbGlzaW9uQ29udGludWUgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgY29saXNpb25Db250aW51ZSA9IGZhbHNlO1xyXG5cdFx0XHRpZihkZXBsYWNlcilcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMucG9zLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMucG9zLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMuZG9tLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcclxuXHRcdFx0XHR0aGlzLmRvbS5zdHlsZS50b3AgPSB5ICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdH07XHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgZmVuZXRyZUhhdXREb20gPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlSGF1dCcpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PiB5YmFzdGhpcy53aW5kb3dzLnRvRmlyc3RQbGFuKHRoaXMpICk7XHJcblx0XHR0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlSGF1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+XHJcblx0XHR7XHJcblx0XHRcdHliYXN0aGlzLndpbmRvd3MuaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQodGhpcyk7XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHRcdGZlbmV0cmVIYXV0RG9tLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGUgPT4gKGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnUCcpPyB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuY2hhbmdlQ3Vyc29yKGZhbHNlLCAnZGVwbGFjZXInKSA6IHZvaWQgMSk7XHJcblx0XHRmZW5ldHJlSGF1dERvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdub3JtYWwnKSApO1xyXG5cdFx0Y29uc3QgYnV0dG9ucyA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJy55YmFzdGhpc0ZlbmV0cmVIYXV0IGltZycpO1xyXG5cdFx0Zm9yKHZhciBidXR0b24gb2YgYnV0dG9ucylcclxuXHRcdHtcclxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdkZWNsZW5jaGVyJykgKTtcclxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4geWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLmNoYW5nZUN1cnNvcihmYWxzZSwgJ25vcm1hbCcpICk7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0YnV0dG9uc1syXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2UpO1xyXG5cdH0gKSgpO1xyXG5cdFx0dGhpcy5wb3NpdGlvbm5lcih0aGlzLnBvcy54LCB0aGlzLnBvcy55KTtcclxuXHRcdHRoaXMuZGltbWVuc2lvbm5lcih0aGlzLmRpbS54LCB0aGlzLmRpbS55KTtcclxuXHRcdHRoaXMubm9tbWVyKCk7XHJcblx0XHR5YmFzdGhpcy53aW5kb3dzLmxpc3RlLmFqb3V0ZXIodGhpcyk7XHJcblx0XHRcclxuXHRcdGxldCBjb250ZW51RG9tID0gdGhpcy5kb20ucXVlcnlTZWxlY3RvcignLicgKyBfY2xhc3NlXygnQ29udGVudScpICk7XHJcblx0XHRjb250ZW51RG9tLnN0eWxlLmhlaWdodCA9ICh5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnVEb20pLmhlaWdodCkgLSAzMikgKyAncHgnO1xyXG5cdH1cdFxyXG5cdGNhdGNoKGVycilcclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZygnZXJySW5pdGlhbGlzYXRpb24gbW9kdWxlOlx0JywgZXJyKTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBkb21GZW5ldHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbi8qKlxyXG5cdDxkaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPSdIYXV0Jz5cclxuXHRcdFx0PGRpdiBjbGFzcz0nVGl0cmUnPlxyXG5cdFx0XHRcdDxwPjwvcD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9J0JvdXRvbnMnPjwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPSdDb250ZW51Jz48L2Rpdj5cclxuXHQ8L2Rpdj5cclxuKiovXHJcbigoKSA9PlxyXG57XHJcblx0dmFyIGNyw6llckVsw6ltZW50ID0gKGVsKSA9PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcclxuXHR2YXIgZGl2ID0gKCkgPT4gY3LDqWVyRWzDqW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdFxyXG5cdHZhciB0YWIgPSBbXTtcclxuXHRmb3IodmFyIGkgPTA7IGkgPD0gMTsgaSsrKSB0YWIucHVzaChkaXYoKVx0KTtcclxuXHRmb3IodmFyIGkgPTA7IGkgPD0gMTsgaSsrKSB0YWJbMF0uYXBwZW5kQ2hpbGQoZGl2KClcdCk7XHJcblx0XHJcblx0dGFiWzBdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdIYXV0Jyk7XHRcclxuXHR0YWJbMF0uY2hpbGRyZW5bMF0uY2xhc3NOYW1lID0gX2NsYXNzZV8oJ1RpdHJlJyk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdwJykgKTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2xhc3NOYW1lID0gX2NsYXNzZV8oJ0JvdXRvbnMnKTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uYXBwZW5kQ2hpbGQoY3LDqWVyRWzDqW1lbnQoJ2ltZycpXHQpO1xyXG5cdHRhYlswXS5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChjcsOpZXJFbMOpbWVudCgnaW1nJylcdCk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdpbWcnKVx0KTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uc3JjID0gJy4vYXBpLzQvZ3VpL2ltYWdlcy9taW5pbWlzZXIucG5nJztcdFx0XHRcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uc3JjID0gJy4vYXBpLzQvZ3VpL2ltYWdlcy9yZWR1aXJlLnBuZyc7XHRcdFx0XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLnNyYyA9ICcuL2FwaS80L2d1aS9pbWFnZXMvZmVybWVyLnBuZyc7XHJcblx0dGFiWzFdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdDb250ZW51Jyk7XHJcblx0XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0OiBcdFx0XHQzMiArICdweCcsXHJcblx0XHR3aWR0aDogXHRcdFx0XHQnMTAwJScsXHJcblx0XHRwb3NpdGlvbjpcdFx0XHQnYWJzb2x1dGUnLFxyXG5cdFx0Ym9yZGVyQm90dG9tOlx0JzFweCBzb2xpZCBibGFjaydcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlswXS5jaGlsZHJlblswXS5zdHlsZSxcclxuXHR7XHJcblx0XHRwb3NpdGlvbjpcdCdhYnNvbHV0ZScsXHJcblx0XHRtYXJnaW46XHRcdCcwcHgnLFxyXG5cdFx0aGVpZ2h0Olx0XHQnMTAwJScsXHJcblx0XHR3aWR0aDpcdFx0JzEwMCUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0dG9wOlx0XHRcdCc0cHgnLFxyXG5cdFx0cG9zaXRpb246XHQnYWJzb2x1dGUnLFxyXG5cdFx0cmlnaHQ6XHRcdCc0cHgnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0dmVydGljYWxBbGlnbjpcdCdtaWRkbGUnLFxyXG5cdFx0cG9zaXRpb246IFx0XHRcdCdhYnNvbHV0ZScsXHJcblx0XHRtYXJnaW46XHRcdFx0XHRcdCcwcHgnLFxyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0XHQnMTAwJScsXHJcblx0XHR3aWR0aDpcdFx0XHRcdFx0JzEwMCUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0Olx0XHQnMjRweCcsXHJcblx0XHR3aWR0aDpcdFx0JzI0cHgnLFxyXG5cdFx0cmlnaHQ6XHRcdCc4cHgnLFxyXG5cdFx0cG9zaXRpb246XHQncmVsYXRpdmUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0OiBcdCcyNHB4JyxcclxuXHRcdHdpZHRoOiBcdFx0JzI0cHgnLFxyXG5cdFx0cmlnaHQ6IFx0XHQnNHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J3JlbGF0aXZlJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLnN0eWxlLFxyXG5cdHtcclxuXHRcdGhlaWdodDogXHQnMjRweCcsXHJcblx0XHR3aWR0aDogXHRcdCcyNHB4JyxcclxuXHRcdHJpZ2h0OiBcdFx0JzBweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZSdcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlsxXS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6XHRcdCcxMDAlJyxcclxuXHRcdHRvcDpcdFx0XHQnMzJweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZScsXHJcblx0XHRvdmVyZmxvdzpcdCdhdXRvJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24oZG9tRmVuZXRyZS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6XHRcdFx0XHRcdFx0MTI1ICsgJ3B4JyxcclxuXHRcdHdpZHRoOlx0XHRcdFx0XHRcdDI1MCArICdweCcsXHJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XHQnI0Q0RDRENCcsXHJcblx0XHRib3hTaGFkb3c6XHRcdFx0XHQnMHB4IDBweCA5cHggd2hpdGUnLFxyXG5cdFx0cG9zaXRpb246XHRcdFx0XHRcdCdhYnNvbHV0ZScsXHJcblx0XHRib3JkZXJDb2xvcjpcdFx0XHQnYmxhY2snLFxyXG5cdFx0Ym9yZGVyU3R5bGU6XHRcdFx0J3NvbGlkJyxcclxuXHRcdGJvcmRlcldpZHRoOlx0XHRcdCcxcHgnXHJcblx0fSk7XHJcblx0Zm9yKHZhciBlbCBvZiB0YWIpXHJcblx0XHRkb21GZW5ldHJlLmFwcGVuZENoaWxkKGVsKTtcclxufSkoKTsiXX0=

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var pointerLock = document.mozPointerLockElement !== undefined ? {
	event: 'mozPointerlockchange',
	element: function element() {
		return document.mozPointerLockElement;
	}
} : document.webkitPointerLockElement !== undefined ? {
	event: 'webkitPointerlockchange',
	element: function element() {
		return document.webkitPointerLockElement;
	}
} : {
	event: 'pointerlockchange',
	element: function element() {
		return document.pointerLockElement;
	}
};

exports.default = function (shared) {
	var queryCursor = function queryCursor() {
		if (shared.isHandled) return;
		shared.dom.canvas.requestPointerLock();
	};
	var onPointerLockChange = function onPointerLockChange() {
		if (pointerLock.element() == shared.dom.canvas) {
			shared.isHandled = true;
			document.removeEventListener('click', queryCursor);
		} else {
			shared.isHandled = false;
			document.addEventListener('click', queryCursor);
		}
	};
	document.addEventListener(pointerLock.event, onPointerLockChange, false);
	onPointerLockChange();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvcG9pbnRlckNhcHR1cmUuanMiXSwibmFtZXMiOlsicG9pbnRlckxvY2siLCJkb2N1bWVudCIsIm1velBvaW50ZXJMb2NrRWxlbWVudCIsInVuZGVmaW5lZCIsImV2ZW50IiwiZWxlbWVudCIsIndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCIsInBvaW50ZXJMb2NrRWxlbWVudCIsInF1ZXJ5Q3Vyc29yIiwic2hhcmVkIiwiaXNIYW5kbGVkIiwiZG9tIiwiY2FudmFzIiwicmVxdWVzdFBvaW50ZXJMb2NrIiwib25Qb2ludGVyTG9ja0NoYW5nZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFDQSxJQUFNQSxjQUFlQyxTQUFTQyxxQkFBVCxLQUFtQ0MsU0FBcEMsR0FDcEI7QUFDQ0MsUUFBUSxzQkFEVDtBQUVDQyxVQUFVO0FBQUEsU0FBTUosU0FBU0MscUJBQWY7QUFBQTtBQUZYLENBRG9CLEdBS25CRCxTQUFTSyx3QkFBVCxLQUFzQ0gsU0FBdkMsR0FDQTtBQUNDQyxRQUFRLHlCQURUO0FBRUNDLFVBQVU7QUFBQSxTQUFNSixTQUFTSyx3QkFBZjtBQUFBO0FBRlgsQ0FEQSxHQUtBO0FBQ0NGLFFBQVEsbUJBRFQ7QUFFQ0MsVUFBVTtBQUFBLFNBQU1KLFNBQVNNLGtCQUFmO0FBQUE7QUFGWCxDQVZBOztrQkFlZSxrQkFDZjtBQUNDLEtBQU1DLGNBQWMsU0FBZEEsV0FBYyxHQUNwQjtBQUNDLE1BQUdDLE9BQU9DLFNBQVYsRUFDQztBQUNERCxTQUFPRSxHQUFQLENBQVdDLE1BQVgsQ0FBa0JDLGtCQUFsQjtBQUNBLEVBTEQ7QUFNQSxLQUFNQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixHQUM1QjtBQUNDLE1BQUlkLFlBQVlLLE9BQVosTUFBeUJJLE9BQU9FLEdBQVAsQ0FBV0MsTUFBeEMsRUFDQTtBQUNDSCxVQUFPQyxTQUFQLEdBQW1CLElBQW5CO0FBQ0FULFlBQVNjLG1CQUFULENBQTZCLE9BQTdCLEVBQXNDUCxXQUF0QztBQUNBLEdBSkQsTUFNQTtBQUNDQyxVQUFPQyxTQUFQLEdBQW1CLEtBQW5CO0FBQ0FULFlBQVNlLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DUixXQUFuQztBQUNBO0FBQ0QsRUFaRDtBQWFBUCxVQUFTZSxnQkFBVCxDQUEwQmhCLFlBQVlJLEtBQXRDLEVBQTZDVSxtQkFBN0MsRUFBa0UsS0FBbEU7QUFDQUE7QUFDQSxDIiwiZmlsZSI6InBvaW50ZXJDYXB0dXJlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jb25zdCBwb2ludGVyTG9jayA9IChkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnQgIT09IHVuZGVmaW5lZCkgP1xue1xuXHRldmVudCA6ICdtb3pQb2ludGVybG9ja2NoYW5nZScsXG5cdGVsZW1lbnQgOiAoKSA9PiBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnRcbn0gOlxuKGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCAhPT0gdW5kZWZpbmVkKSA/XG57XG5cdGV2ZW50IDogJ3dlYmtpdFBvaW50ZXJsb2NrY2hhbmdlJyxcblx0ZWxlbWVudCA6ICgpID0+IGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudFxufSA6XG57XG5cdGV2ZW50IDogJ3BvaW50ZXJsb2NrY2hhbmdlJyxcblx0ZWxlbWVudCA6ICgpID0+IGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2hhcmVkID0+XG57XG5cdGNvbnN0IHF1ZXJ5Q3Vyc29yID0gKCkgPT5cblx0e1xuXHRcdGlmKHNoYXJlZC5pc0hhbmRsZWQpXG5cdFx0XHRyZXR1cm47XG5cdFx0c2hhcmVkLmRvbS5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XG5cdH07XG5cdGNvbnN0IG9uUG9pbnRlckxvY2tDaGFuZ2UgPSAoKSA9PlxuXHR7XG5cdFx0aWYgKHBvaW50ZXJMb2NrLmVsZW1lbnQoKSA9PSBzaGFyZWQuZG9tLmNhbnZhcylcblx0XHR7XG5cdFx0XHRzaGFyZWQuaXNIYW5kbGVkID0gdHJ1ZTtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcXVlcnlDdXJzb3IpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0c2hhcmVkLmlzSGFuZGxlZCA9IGZhbHNlO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBxdWVyeUN1cnNvcik7XG5cdFx0fVxuXHR9O1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHBvaW50ZXJMb2NrLmV2ZW50LCBvblBvaW50ZXJMb2NrQ2hhbmdlLCBmYWxzZSk7XG5cdG9uUG9pbnRlckxvY2tDaGFuZ2UoKTtcbn07Il19

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var bindedEvents = ['mouseup', 'dblclick', 'mousedown'];

exports.default = function (shared) {
	var eventBindToNode = function eventBindToNode(event) {
		if (event.isTrusted) {
			var node = shared.getNodeFromCursor();
			if (node) node.dispatchEvent(new MouseEvent(event.type, shared.IEvent));
			return node;
		} else {
			event.stopPropagation();
			event.preventDefault();
		}
		return null;
	};
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = bindedEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var event = _step.value;

			ybasthis.dom.conteneur.addEventListener(event, eventBindToNode, false);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	ybasthis.dom.conteneur.addEventListener('click', function (event) {
		var node = eventBindToNode(event);
		if (node) node.focus();
	}, false);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvcG9pbnRlckV2ZW50QmluZGluZy5qcyJdLCJuYW1lcyI6WyJiaW5kZWRFdmVudHMiLCJldmVudEJpbmRUb05vZGUiLCJldmVudCIsImlzVHJ1c3RlZCIsIm5vZGUiLCJzaGFyZWQiLCJnZXROb2RlRnJvbUN1cnNvciIsImRpc3BhdGNoRXZlbnQiLCJNb3VzZUV2ZW50IiwidHlwZSIsIklFdmVudCIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwieWJhc3RoaXMiLCJkb20iLCJjb250ZW5ldXIiLCJhZGRFdmVudExpc3RlbmVyIiwiZm9jdXMiXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQUVBLElBQU1BLGVBQWUsQ0FBQyxTQUFELEVBQVksVUFBWixFQUF3QixXQUF4QixDQUFyQjs7a0JBQ2Usa0JBQ2Y7QUFDQyxLQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFDeEI7QUFDQyxNQUFHQSxNQUFNQyxTQUFULEVBQ0E7QUFDQyxPQUFNQyxPQUFPQyxPQUFPQyxpQkFBUCxFQUFiO0FBQ0EsT0FBSUYsSUFBSixFQUNDQSxLQUFLRyxhQUFMLENBQW1CLElBQUlDLFVBQUosQ0FBZU4sTUFBTU8sSUFBckIsRUFBMkJKLE9BQU9LLE1BQWxDLENBQW5CO0FBQ0QsVUFBUU4sSUFBUjtBQUNBLEdBTkQsTUFRQTtBQUNDRixTQUFNUyxlQUFOO0FBQ0FULFNBQU1VLGNBQU47QUFDQTtBQUNELFNBQVEsSUFBUjtBQUNBLEVBZkQ7QUFERDtBQUFBO0FBQUE7O0FBQUE7QUFpQkMsdUJBQW1CWixZQUFuQjtBQUFBLE9BQVVFLEtBQVY7O0FBQ0NXLFlBQVNDLEdBQVQsQ0FBYUMsU0FBYixDQUF1QkMsZ0JBQXZCLENBQXdDZCxLQUF4QyxFQUErQ0QsZUFBL0MsRUFBZ0UsS0FBaEU7QUFERDtBQWpCRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQW1CQ1ksVUFBU0MsR0FBVCxDQUFhQyxTQUFiLENBQXVCQyxnQkFBdkIsQ0FFQyxPQUZELEVBR0MsaUJBQ0E7QUFDQyxNQUFNWixPQUFPSCxnQkFBZ0JDLEtBQWhCLENBQWI7QUFDQSxNQUFJRSxJQUFKLEVBQ0NBLEtBQUthLEtBQUw7QUFDRCxFQVJGLEVBU0MsS0FURDtBQVdBLEMiLCJmaWxlIjoicG9pbnRlckV2ZW50QmluZGluZy5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBiaW5kZWRFdmVudHMgPSBbJ21vdXNldXAnLCAnZGJsY2xpY2snLCAnbW91c2Vkb3duJ107XG5leHBvcnQgZGVmYXVsdCBzaGFyZWQgPT5cbntcblx0Y29uc3QgZXZlbnRCaW5kVG9Ob2RlID0gKGV2ZW50KSA9PlxuXHR7XG5cdFx0aWYoZXZlbnQuaXNUcnVzdGVkKVxuXHRcdHtcblx0XHRcdGNvbnN0IG5vZGUgPSBzaGFyZWQuZ2V0Tm9kZUZyb21DdXJzb3IoKTtcblx0XHRcdGlmIChub2RlKVxuXHRcdFx0XHRub2RlLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoZXZlbnQudHlwZSwgc2hhcmVkLklFdmVudCkpO1xuXHRcdFx0cmV0dXJuIChub2RlKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIChudWxsKTtcblx0fTtcblx0Zm9yKGNvbnN0IGV2ZW50IG9mIGJpbmRlZEV2ZW50cylcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50QmluZFRvTm9kZSwgZmFsc2UpO1xuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXJcblx0KFxuXHRcdCdjbGljaycsXG5cdFx0ZXZlbnQgPT5cblx0XHR7XG5cdFx0XHRjb25zdCBub2RlID0gZXZlbnRCaW5kVG9Ob2RlKGV2ZW50KTtcblx0XHRcdGlmIChub2RlKVxuXHRcdFx0XHRub2RlLmZvY3VzKCk7XG5cdFx0fSxcblx0XHRmYWxzZVxuXHQpO1xufTsiXX0=

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (shared) {
	var elemPrecendent = null;
	var onMouseMove = function onMouseMove(evenement) {
		if (shared.isLocked === true || !shared.isHandled) return;
		var pos = shared.position;
		pos.x += evenement.movementX;
		pos.y += evenement.movementY;
		if (pos.x < 1) pos.x = shared.areaSize.x - 1;else if (pos.y < 1) pos.y = shared.areaSize.y - 1;else if (pos.x > shared.areaSize.x - 1) pos.x = 0;else if (pos.y > shared.areaSize.y - 1) pos.y = 0;
		shared.dom.cursor.style.left = pos.x + 'px';
		shared.dom.cursor.style.top = pos.y + 'px';
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = shared.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var listener = _step.value;

				listener();
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		var elAct = shared.getNodeFromCursor();
		if (elAct === null || elAct === undefined) return;
		if (elemPrecendent === null) elemPrecendent = elAct;
		if (elAct !== elemPrecendent) {
			var evMouseOver = new CustomEvent('mouseover', shared.IEvent);
			var evMouseOut = new CustomEvent('mouseout', shared.IEvent);
			elemPrecendent.dispatchEvent(evMouseOut);
			elAct.dispatchEvent(evMouseOver);
			elemPrecendent = elAct;
		}
	};
	ybasthis.dom.conteneur.addEventListener('mousemove', onMouseMove);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvcG9pbnRlck9uTW92ZS5qcyJdLCJuYW1lcyI6WyJlbGVtUHJlY2VuZGVudCIsIm9uTW91c2VNb3ZlIiwic2hhcmVkIiwiaXNMb2NrZWQiLCJpc0hhbmRsZWQiLCJwb3MiLCJwb3NpdGlvbiIsIngiLCJldmVuZW1lbnQiLCJtb3ZlbWVudFgiLCJ5IiwibW92ZW1lbnRZIiwiYXJlYVNpemUiLCJkb20iLCJjdXJzb3IiLCJzdHlsZSIsImxlZnQiLCJ0b3AiLCJsaXN0ZW5lcnMiLCJsaXN0ZW5lciIsImVsQWN0IiwiZ2V0Tm9kZUZyb21DdXJzb3IiLCJ1bmRlZmluZWQiLCJldk1vdXNlT3ZlciIsIkN1c3RvbUV2ZW50IiwiSUV2ZW50IiwiZXZNb3VzZU91dCIsImRpc3BhdGNoRXZlbnQiLCJ5YmFzdGhpcyIsImNvbnRlbmV1ciIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7a0JBQ2Usa0JBQ2Y7QUFDQyxLQUFJQSxpQkFBaUIsSUFBckI7QUFDQSxLQUFNQyxjQUFjLFNBQWRBLFdBQWMsWUFDcEI7QUFDQyxNQUFJQyxPQUFPQyxRQUFQLEtBQW9CLElBQXBCLElBQTRCLENBQUNELE9BQU9FLFNBQXhDLEVBQ0M7QUFDRCxNQUFNQyxNQUFNSCxPQUFPSSxRQUFuQjtBQUNBRCxNQUFJRSxDQUFKLElBQVNDLFVBQVVDLFNBQW5CO0FBQ0FKLE1BQUlLLENBQUosSUFBU0YsVUFBVUcsU0FBbkI7QUFDQSxNQUFJTixJQUFJRSxDQUFKLEdBQVEsQ0FBWixFQUNDRixJQUFJRSxDQUFKLEdBQVFMLE9BQU9VLFFBQVAsQ0FBZ0JMLENBQWhCLEdBQW9CLENBQTVCLENBREQsS0FFSyxJQUFJRixJQUFJSyxDQUFKLEdBQVEsQ0FBWixFQUNKTCxJQUFJSyxDQUFKLEdBQVFSLE9BQU9VLFFBQVAsQ0FBZ0JGLENBQWhCLEdBQW9CLENBQTVCLENBREksS0FFQSxJQUFJTCxJQUFJRSxDQUFKLEdBQVFMLE9BQU9VLFFBQVAsQ0FBZ0JMLENBQWhCLEdBQW9CLENBQWhDLEVBQ0pGLElBQUlFLENBQUosR0FBUSxDQUFSLENBREksS0FFQSxJQUFJRixJQUFJSyxDQUFKLEdBQVFSLE9BQU9VLFFBQVAsQ0FBZ0JGLENBQWhCLEdBQW9CLENBQWhDLEVBQ0pMLElBQUlLLENBQUosR0FBUSxDQUFSO0FBQ0RSLFNBQU9XLEdBQVAsQ0FBV0MsTUFBWCxDQUFrQkMsS0FBbEIsQ0FBd0JDLElBQXhCLEdBQStCWCxJQUFJRSxDQUFKLEdBQVEsSUFBdkM7QUFDQUwsU0FBT1csR0FBUCxDQUFXQyxNQUFYLENBQWtCQyxLQUFsQixDQUF3QkUsR0FBeEIsR0FBOEJaLElBQUlLLENBQUosR0FBUSxJQUF0QztBQWZEO0FBQUE7QUFBQTs7QUFBQTtBQWdCQyx3QkFBb0JSLE9BQU9nQixTQUEzQjtBQUFBLFFBQVFDLFFBQVI7O0FBQ0NBO0FBREQ7QUFoQkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFrQkMsTUFBTUMsUUFBUWxCLE9BQU9tQixpQkFBUCxFQUFkO0FBQ0EsTUFBS0QsVUFBVSxJQUFYLElBQW9CQSxVQUFVRSxTQUFsQyxFQUNDO0FBQ0QsTUFBR3RCLG1CQUFtQixJQUF0QixFQUE0QkEsaUJBQWlCb0IsS0FBakI7QUFDNUIsTUFBR0EsVUFBVXBCLGNBQWIsRUFDQTtBQUNDLE9BQUl1QixjQUFjLElBQUlDLFdBQUosQ0FBZ0IsV0FBaEIsRUFBOEJ0QixPQUFPdUIsTUFBckMsQ0FBbEI7QUFDQSxPQUFJQyxhQUFhLElBQUlGLFdBQUosQ0FBZ0IsVUFBaEIsRUFBNkJ0QixPQUFPdUIsTUFBcEMsQ0FBakI7QUFDQXpCLGtCQUFlMkIsYUFBZixDQUE2QkQsVUFBN0I7QUFDQU4sU0FBTU8sYUFBTixDQUFvQkosV0FBcEI7QUFDQXZCLG9CQUFpQm9CLEtBQWpCO0FBQ0E7QUFDRCxFQS9CRDtBQWdDQVEsVUFBU2YsR0FBVCxDQUFhZ0IsU0FBYixDQUF1QkMsZ0JBQXZCLENBQXdDLFdBQXhDLEVBQXFEN0IsV0FBckQ7QUFDQSxDIiwiZmlsZSI6InBvaW50ZXJPbk1vdmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmV4cG9ydCBkZWZhdWx0IHNoYXJlZCA9Plxue1xuXHRsZXQgZWxlbVByZWNlbmRlbnQgPSBudWxsO1xuXHRjb25zdCBvbk1vdXNlTW92ZSA9IGV2ZW5lbWVudCA9PlxuXHR7XG5cdFx0aWYgKHNoYXJlZC5pc0xvY2tlZCA9PT0gdHJ1ZSB8fCAhc2hhcmVkLmlzSGFuZGxlZClcblx0XHRcdHJldHVybjtcblx0XHRjb25zdCBwb3MgPSBzaGFyZWQucG9zaXRpb247XG5cdFx0cG9zLnggKz0gZXZlbmVtZW50Lm1vdmVtZW50WDtcblx0XHRwb3MueSArPSBldmVuZW1lbnQubW92ZW1lbnRZO1xuXHRcdGlmIChwb3MueCA8IDEpXG5cdFx0XHRwb3MueCA9IHNoYXJlZC5hcmVhU2l6ZS54IC0gMTtcblx0XHRlbHNlIGlmIChwb3MueSA8IDEpXG5cdFx0XHRwb3MueSA9IHNoYXJlZC5hcmVhU2l6ZS55IC0gMTtcblx0XHRlbHNlIGlmIChwb3MueCA+IHNoYXJlZC5hcmVhU2l6ZS54IC0gMSlcblx0XHRcdHBvcy54ID0gMDtcblx0XHRlbHNlIGlmIChwb3MueSA+IHNoYXJlZC5hcmVhU2l6ZS55IC0gMSlcblx0XHRcdHBvcy55ID0gMDtcblx0XHRzaGFyZWQuZG9tLmN1cnNvci5zdHlsZS5sZWZ0ID0gcG9zLnggKyAncHgnO1xuXHRcdHNoYXJlZC5kb20uY3Vyc29yLnN0eWxlLnRvcCA9IHBvcy55ICsgJ3B4Jztcblx0XHRmb3IobGV0IGxpc3RlbmVyIG9mIHNoYXJlZC5saXN0ZW5lcnMpXG5cdFx0XHRsaXN0ZW5lcigpO1xuXHRcdGNvbnN0IGVsQWN0ID0gc2hhcmVkLmdldE5vZGVGcm9tQ3Vyc29yKCk7XG5cdFx0aWYgKChlbEFjdCA9PT0gbnVsbCkgfHwgZWxBY3QgPT09IHVuZGVmaW5lZClcblx0XHRcdHJldHVybjtcblx0XHRpZihlbGVtUHJlY2VuZGVudCA9PT0gbnVsbCkgZWxlbVByZWNlbmRlbnQgPSBlbEFjdDtcblx0XHRpZihlbEFjdCAhPT0gZWxlbVByZWNlbmRlbnQpXG5cdFx0e1xuXHRcdFx0bGV0IGV2TW91c2VPdmVyID0gbmV3IEN1c3RvbUV2ZW50KCdtb3VzZW92ZXInLCAgc2hhcmVkLklFdmVudCk7XG5cdFx0XHRsZXQgZXZNb3VzZU91dCA9IG5ldyBDdXN0b21FdmVudCgnbW91c2VvdXQnLCAgc2hhcmVkLklFdmVudCk7XG5cdFx0XHRlbGVtUHJlY2VuZGVudC5kaXNwYXRjaEV2ZW50KGV2TW91c2VPdXQpO1xuXHRcdFx0ZWxBY3QuZGlzcGF0Y2hFdmVudChldk1vdXNlT3Zlcik7XG5cdFx0XHRlbGVtUHJlY2VuZGVudCA9IGVsQWN0O1xuXHRcdH1cblx0fTtcblx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG59OyJdfQ==

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var _this = this;

	var chemincursors = './api/4/gui/cursors/';
	var dom = {
		canvas: Object.assign(document.createElement('canvas'), {
			id: 'canvas'
		}),
		cursor: Object.assign(document.createElement('img'), {
			src: chemincursors + 'normal.png',
			id: 'cursor'
		})
	};
	var shared = {
		dom: dom,
		isLocked: false,
		isHandled: false,
		getNodeFromCursor: function getNodeFromCursor() {
			return document.elementFromPoint(shared.position.x, shared.position.y);
		},
		position: { x: 0, y: 0 },
		areaSize: { x: 0, y: 0 },
		listeners: [],
		IEvent: {
			details: { simule: true },
			bubbles: true,
			cancelable: true,
			composed: true
		}
	};

	Object.assign(dom.cursor.style, {
		top: '0px',
		height: '20px',
		width: '14px',
		position: 'absolute',
		zIndex: 800,
		pointerEvent: 'none'
	});
	dom.cursor.style.setProperty('pointer-events', 'none', 'important');
	var décalage = { x: 0, y: 0 };
	var typecursor = {
		normal: { x: 0, y: 0 },
		declencher: { x: 0, y: 0 },
		deplacer: { x: 0, y: 0 }
	};
	var cursorActuel = 'normal';
	var cursorBloqué = false;

	this.bloquer = function () {
		if (cursorBloqué) throw new Error('ybasthisApplication.systemePointage.bloquer: pointeur déjà bloqué');
		cursorBloqué = true;
	};

	this.débloquer = function () {
		if (!cursorBloqué) throw new Error('ybasthisApplication.systemePointage.débloquer: pointeur non bloqué');
		cursorBloqué = false;
	};

	this.position = function () {
		return shared.position;
	};
	/**
 	Def:Change le cursor
 	Retour: void
 	@estActivation booléen => indique si le cursor signale une activation
 	@type chaineCaractère => le type de cursor voulu
 	Supplément:
 		@type optionnel auquel cas seulement le type d'activation sera modifié.
 **/
	this.changeCursor = function (estActivation, type) {
		var cursor = chemincursors;
		if (estActivation === true) cursor += '_';
		if (type) {
			if (!typecursor[type]) throw new Error('changement de cursor avec un type invalide:	' + type);
			cursorActuel = type;
			décalage.x = typecursor[type].x;
			décalage.y = typecursor[type].y;
			cursor += type;
		} else cursor += cursorActuel;
		dom.cursor.src = cursor + '.png';
	};
	this.quandMouvement = function (fn) {
		return shared.listeners.push(fn);
	};

	try {
		ybasthis.dom.conteneur.addEventListener('mousedown', function () {
			return _this.changeCursor(true);
		});
		ybasthis.dom.conteneur.addEventListener('mouseup', function () {
			return _this.changeCursor(false);
		});
		ybasthis.dom.conteneur.appendChild(dom.cursor);
		dom.canvas.getContext('2d');
		ybasthis.dom.conteneur.appendChild(dom.canvas);
		var cs = getComputedStyle(ybasthis.dom.desktop);
		shared.areaSize.x = ybasthis.utilitaires.grandeurs.enleverUnité(cs.width);
		shared.areaSize.y = ybasthis.utilitaires.grandeurs.enleverUnité(cs.height);
		(0, _pointerCapture2.default)(shared);
		(0, _pointerEventBinding2.default)(shared);
		(0, _pointerOnMove2.default)(shared);
	} catch (err) {
		console.log('errInitialisation module:	', err);
	}
};

var _pointerCapture = __webpack_require__(10);

var _pointerCapture2 = _interopRequireDefault(_pointerCapture);

var _pointerEventBinding = __webpack_require__(11);

var _pointerEventBinding2 = _interopRequireDefault(_pointerEventBinding);

var _pointerOnMove = __webpack_require__(12);

var _pointerOnMove2 = _interopRequireDefault(_pointerOnMove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvc3lzdGVtZVBvaW50YWdlLmpzIl0sIm5hbWVzIjpbImNoZW1pbmN1cnNvcnMiLCJkb20iLCJjYW52YXMiLCJPYmplY3QiLCJhc3NpZ24iLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImN1cnNvciIsInNyYyIsInNoYXJlZCIsImlzTG9ja2VkIiwiaXNIYW5kbGVkIiwiZ2V0Tm9kZUZyb21DdXJzb3IiLCJlbGVtZW50RnJvbVBvaW50IiwicG9zaXRpb24iLCJ4IiwieSIsImFyZWFTaXplIiwibGlzdGVuZXJzIiwiSUV2ZW50IiwiZGV0YWlscyIsInNpbXVsZSIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiY29tcG9zZWQiLCJzdHlsZSIsInRvcCIsImhlaWdodCIsIndpZHRoIiwiekluZGV4IiwicG9pbnRlckV2ZW50Iiwic2V0UHJvcGVydHkiLCJkw6ljYWxhZ2UiLCJ0eXBlY3Vyc29yIiwibm9ybWFsIiwiZGVjbGVuY2hlciIsImRlcGxhY2VyIiwiY3Vyc29yQWN0dWVsIiwiY3Vyc29yQmxvcXXDqSIsImJsb3F1ZXIiLCJFcnJvciIsImTDqWJsb3F1ZXIiLCJjaGFuZ2VDdXJzb3IiLCJlc3RBY3RpdmF0aW9uIiwidHlwZSIsInF1YW5kTW91dmVtZW50IiwicHVzaCIsImZuIiwieWJhc3RoaXMiLCJjb250ZW5ldXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYXBwZW5kQ2hpbGQiLCJnZXRDb250ZXh0IiwiY3MiLCJnZXRDb21wdXRlZFN0eWxlIiwiZGVza3RvcCIsInV0aWxpdGFpcmVzIiwiZ3JhbmRldXJzIiwiZW5sZXZlclVuaXTDqSIsImVyciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7a0JBTWUsWUFDZjtBQUFBOztBQUNDLEtBQU1BLGdCQUFnQixzQkFBdEI7QUFDQSxLQUFNQyxNQUNOO0FBQ0NDLFVBQVNDLE9BQU9DLE1BQVAsQ0FBY0MsU0FBU0MsYUFBVCxDQUF1QixRQUF2QixD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Q0E7Ozs7OztBQWdIQyIsImZpbGUiOiJzeXN0ZW1lUG9pbnRhZ2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBzdGFydENhcHR1cmUgZnJvbSAnLi9wb2ludGVyQ2FwdHVyZS5qcyc7XHJcbmltcG9ydCBldmVudEJpbmRpbmcgZnJvbSAnLi9wb2ludGVyRXZlbnRCaW5kaW5nLmpzJztcclxuaW1wb3J0IHBvaW50ZXJPbk1vdmVJbml0IGZyb20gJy4vcG9pbnRlck9uTW92ZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpXHJcbntcclxuXHRjb25zdCBjaGVtaW5jdXJzb3JzID0gJy4vYXBpLzQvZ3VpL2N1cnNvcnMvJztcclxuXHRjb25zdCBkb20gPVxyXG5cdHtcclxuXHRcdGNhbnZhcyA6IE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyksXHJcblx0XHR7XHJcblx0XHRcdGlkIDogJ2NhbnZhcydcclxuXHRcdH0pLFxyXG5cdFx0Y3Vyc29yIDogT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSxcclxuXHRcdHtcclxuXHRcdFx0c3JjIDogY2hlbWluY3Vyc29ycyArICdub3JtYWwucG5nJyxcclxuXHRcdFx0aWQgOiAnY3Vyc29yJ1xyXG5cdFx0fSlcclxuXHR9O1xyXG5cdGNvbnN0IHNoYXJlZCA9XHJcblx0e1xyXG5cdFx0ZG9tLFxyXG5cdFx0aXNMb2NrZWQ6XHRcdFx0XHRcdFx0ZmFsc2UsXHJcblx0XHRpc0hhbmRsZWQ6XHRcdFx0XHRcdGZhbHNlLFxyXG5cdFx0Z2V0Tm9kZUZyb21DdXJzb3I6XHQoKSA9PlxyXG5cdFx0XHRkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHNoYXJlZC5wb3NpdGlvbi54LCBzaGFyZWQucG9zaXRpb24ueSksXHJcblx0XHRwb3NpdGlvbjpcdFx0XHRcdFx0XHR7eDogMCwgeTogMH0sXHJcblx0XHRhcmVhU2l6ZTpcdFx0XHRcdFx0XHR7eDogMCwgeTogMH0sXHJcblx0XHRsaXN0ZW5lcnM6XHRcdFx0XHRcdFtdLFxyXG5cdFx0SUV2ZW50OlxyXG5cdFx0e1xyXG5cdFx0XHRkZXRhaWxzOlx0XHR7c2ltdWxlIDogdHJ1ZX0sXHJcblx0XHRcdGJ1YmJsZXM6XHRcdHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6XHR0cnVlLFxyXG5cdFx0XHRjb21wb3NlZDpcdFx0dHJ1ZVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdE9iamVjdC5hc3NpZ24oZG9tLmN1cnNvci5zdHlsZSxcclxuXHR7XHJcblx0XHR0b3A6XHRcdFx0JzBweCcsXHJcblx0XHRoZWlnaHQ6XHRcdCcyMHB4JyxcclxuXHRcdHdpZHRoOlx0XHQnMTRweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdhYnNvbHV0ZScsXHJcblx0XHR6SW5kZXg6XHRcdDgwMCxcclxuXHRcdHBvaW50ZXJFdmVudDpcdCdub25lJ1xyXG5cdH0pO1xyXG5cdGRvbS5jdXJzb3Iuc3R5bGUuc2V0UHJvcGVydHkoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnLCAnaW1wb3J0YW50Jyk7XHJcblx0Y29uc3QgZMOpY2FsYWdlID0ge3g6IDAsIHk6IDB9O1xyXG5cdGNvbnN0IHR5cGVjdXJzb3IgPSBcclxuXHR7XHJcblx0XHRub3JtYWwgOiB7eDogMCwgeTogMH0sXHJcblx0XHRkZWNsZW5jaGVyIDoge3g6IDAsIHk6IDB9LFxyXG5cdFx0ZGVwbGFjZXIgOiB7eDogMCwgeSA6IDB9XHJcblx0fTtcclxuXHRsZXQgY3Vyc29yQWN0dWVsID0gJ25vcm1hbCc7XHJcblx0bGV0IGN1cnNvckJsb3F1w6kgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLmJsb3F1ZXIgPSAoKSA9PlxyXG5cdHtcclxuXHRcdGlmKGN1cnNvckJsb3F1w6kpIHRocm93IG5ldyBFcnJvcigneWJhc3RoaXNBcHBsaWNhdGlvbi5zeXN0ZW1lUG9pbnRhZ2UuYmxvcXVlcjogcG9pbnRldXIgZMOpasOgIGJsb3F1w6knKTtcclxuXHRcdGN1cnNvckJsb3F1w6kgPSB0cnVlO1xyXG5cdH07XHJcblx0XHJcblx0dGhpcy5kw6libG9xdWVyID0gKCkgPT5cclxuXHR7XHJcblx0XHRpZighY3Vyc29yQmxvcXXDqSkgdGhyb3cgbmV3IEVycm9yKCd5YmFzdGhpc0FwcGxpY2F0aW9uLnN5c3RlbWVQb2ludGFnZS5kw6libG9xdWVyOiBwb2ludGV1ciBub24gYmxvcXXDqScpO1xyXG5cdFx0Y3Vyc29yQmxvcXXDqSA9IGZhbHNlO1xyXG5cdH07XHJcblxyXG5cdHRoaXMucG9zaXRpb24gPSAoKSA9PiBzaGFyZWQucG9zaXRpb247XHJcblx0LyoqXHJcblx0XHREZWY6Q2hhbmdlIGxlIGN1cnNvclxyXG5cdFx0UmV0b3VyOiB2b2lkXHJcblx0XHRAZXN0QWN0aXZhdGlvbiBib29sw6llbiA9PiBpbmRpcXVlIHNpIGxlIGN1cnNvciBzaWduYWxlIHVuZSBhY3RpdmF0aW9uXHJcblx0XHRAdHlwZSBjaGFpbmVDYXJhY3TDqHJlID0+IGxlIHR5cGUgZGUgY3Vyc29yIHZvdWx1XHJcblx0XHRTdXBwbMOpbWVudDpcclxuXHRcdFx0QHR5cGUgb3B0aW9ubmVsIGF1cXVlbCBjYXMgc2V1bGVtZW50IGxlIHR5cGUgZCdhY3RpdmF0aW9uIHNlcmEgbW9kaWZpw6kuXHJcblx0KiovXHJcblx0dGhpcy5jaGFuZ2VDdXJzb3IgPSAoZXN0QWN0aXZhdGlvbiwgdHlwZSkgPT5cclxuXHR7XHJcblx0XHRsZXQgY3Vyc29yID0gY2hlbWluY3Vyc29ycztcclxuXHRcdGlmKGVzdEFjdGl2YXRpb24gPT09IHRydWUpIGN1cnNvciArPSAnXycgO1xyXG5cdFx0aWYodHlwZSlcclxuXHRcdHtcclxuXHRcdFx0aWYoIXR5cGVjdXJzb3JbdHlwZV0gKSB0aHJvdyBuZXcgRXJyb3IoJ2NoYW5nZW1lbnQgZGUgY3Vyc29yIGF2ZWMgdW4gdHlwZSBpbnZhbGlkZTpcdCcgKyB0eXBlKTtcclxuXHRcdFx0Y3Vyc29yQWN0dWVsID0gdHlwZTtcclxuXHRcdFx0ZMOpY2FsYWdlLnggPSB0eXBlY3Vyc29yW3R5cGVdLng7XHJcblx0XHRcdGTDqWNhbGFnZS55ID0gdHlwZWN1cnNvclt0eXBlXS55O1xyXG5cdFx0XHRjdXJzb3IgKz0gIHR5cGU7XHJcblx0XHR9XHJcblx0XHRlbHNlIGN1cnNvciArPSAgY3Vyc29yQWN0dWVsO1xyXG5cdFx0ZG9tLmN1cnNvci5zcmMgPSBjdXJzb3IgKyAnLnBuZyc7XHJcblx0fTtcclxuXHR0aGlzLnF1YW5kTW91dmVtZW50ID0gZm4gPT4gc2hhcmVkLmxpc3RlbmVycy5wdXNoKGZuKTtcclxuXHRcclxuXHR0cnkgXHJcblx0e1xyXG5cdFx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB0aGlzLmNoYW5nZUN1cnNvcih0cnVlKSApO1xyXG5cdFx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4gdGhpcy5jaGFuZ2VDdXJzb3IoZmFsc2UpICk7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFwcGVuZENoaWxkKGRvbS5jdXJzb3IpO1xyXG5cdFx0ZG9tLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hcHBlbmRDaGlsZChkb20uY2FudmFzKTtcclxuXHRcdGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZSh5YmFzdGhpcy5kb20uZGVza3RvcCk7XHJcblx0XHRzaGFyZWQuYXJlYVNpemUueCA9IHliYXN0aGlzLnV0aWxpdGFpcmVzLmdyYW5kZXVycy5lbmxldmVyVW5pdMOpKGNzLndpZHRoKTtcclxuXHRcdHNoYXJlZC5hcmVhU2l6ZS55ID0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koY3MuaGVpZ2h0KTtcclxuXHRcdHN0YXJ0Q2FwdHVyZShzaGFyZWQpO1xyXG5cdFx0ZXZlbnRCaW5kaW5nKHNoYXJlZCk7XHJcblx0XHRwb2ludGVyT25Nb3ZlSW5pdChzaGFyZWQpO1xyXG5cdH1cclxuXHRjYXRjaChlcnIpXHJcblx0e1xyXG5cdFx0Y29uc29sZS5sb2coJ2VyckluaXRpYWxpc2F0aW9uIG1vZHVsZTpcdCcsIGVycik7XHJcblx0fVxyXG59OyJdfQ==

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var décalagePx = { x: null, y: null };
	var déplacer = function déplacer(état) {
		var pointeurPosition = ybasthis.systemePointage.position();
		switch (état) {
			case 'début':
				décalagePx.x = pointeurPosition.x - fenetreEnDéplacement.pos.x;
				décalagePx.y = fenetreEnDéplacement.pos.y - pointeurPosition.y;
				break;
			case 'encours':
				if (fenetreEnDéplacement) {
					fenetreEnDéplacement.positionner(pointeurPosition.x - décalagePx.x, pointeurPosition.y + décalagePx.y);
				} else return;
				break;
			case 'fin':
				if (fenetreEnDéplacement !== undefined) {
					fenetreEnDéplacement = undefined;
					décalagePx.x = 0;
					décalagePx.y = 0;
				} else return;
				break;
		}
	};

	var fenetreEnDéplacement = undefined;
	var indexPremierPlan = 0;
	this.initialiserDéplacement = function (fenetre) {
		fenetreEnDéplacement = fenetre;
		déplacer('début');
	};
	this.Window = _Window2.default;
	this.liste = new ybasthis.typesDonnees.Liste();
	this.toFirstPlan = function (window) {
		return window.dom.style.zIndex = indexPremierPlan++;
	};
	ybasthis.systemePointage.quandMouvement(function () {
		return déplacer('encours');
	});
	document.addEventListener('mouseup', function () {
		return déplacer('fin');
	});
};

var _Window = __webpack_require__(9);

var _Window2 = _interopRequireDefault(_Window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvd2luZG93cy5qcyJdLCJuYW1lcyI6WyJkw6ljYWxhZ2VQeCIsIngiLCJ5IiwiZMOpcGxhY2VyIiwiw6l0YXQiLCJwb2ludGV1clBvc2l0aW9uIiwieWJhc3RoaXMiLCJzeXN0ZW1lUG9pbnRhZ2UiLCJwb3NpdGlvbiIsImZlbmV0cmVFbkTDqXBsYWNlbWVudCIsInBvcyIsInBvc2l0aW9ubmVyIiwidW5kZWZpbmVkIiwiaW5kZXhQcmVtaWVyUGxhbiIsImluaXRpYWxpc2VyRMOpcGxhY2VtZW50IiwiZmVuZXRyZSIsIldpbmRvdyIsImxpc3RlIiwidHlwZXNEb25uZWVzIiwiTGlzdGUiLCJ0b0ZpcnN0UGxhbiIsIndpbmRvdyIsImRvbSIsInN0eWxlIiwiekluZGV4IiwicXVhbmRNb3V2ZW1lbnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFDZSxZQUNmO0FBQ0UsS0FBTUEsYUFBYSxFQUFDQyxHQUFJLElBQUwsRUFBV0MsR0FBSSxJQUFmLEVBQW5CO0FBQ0EsS0FBTUMsV0FBVyxTQUFYQSxRQUFXLENBQUNDLElBQUQsRUFDakI7QUFDQyxNQUFNQyxtQkFBbUJDLFNBQVNDLGVBQVQsQ0FBeUJDLFFBQXpCLEVBQXpCO0FBQ0EsVUFBT0osSUFBUDtBQUVDLFFBQUssT0FBTDtBQUNDSixlQUFXQyxDQUFYLEdBQWVJLGlCQUFpQkosQ0FBakIsR0FBcUJRLHFCQUFxQkMsR0FBckIsQ0FBeUJULENBQTdEO0FBQ0FELGVBQVdFLENBQVgsR0FBZU8scUJBQXFCQyxHQUFyQixDQUF5QlIsQ0FBekIsR0FBNkJHLGlCQUFpQkgsQ0FBN0Q7QUFDRDtBQUNBLFFBQUssU0FBTDtBQUNDLFFBQUdPLG9CQUFILEVBQ0E7QUFDQ0EsMEJBQXFCRSxXQUFyQixDQUVDTixpQkFBaUJKLENBQWpCLEdBQXFCRCxXQUFXQyxDQUZqQyxFQUdDSSxpQkFBaUJILENBQWpCLEdBQXFCRixXQUFXRSxDQUhqQztBQUtBLEtBUEQsTUFRSztBQUNOO0FBQ0EsUUFBSyxLQUFMO0FBQ0MsUUFBR08seUJBQXlCRyxTQUE1QixFQUNBO0FBQ0NILDRCQUF1QkcsU0FBdkI7QUFDQVosZ0JBQVdDLENBQVgsR0FBZSxDQUFmO0FBQ0FELGdCQUFXRSxDQUFYLEdBQWUsQ0FBZjtBQUNBLEtBTEQsTUFNSztBQUNOO0FBekJEO0FBMkJBLEVBOUJEOztBQWdDQSxLQUFJTyx1QkFBdUJHLFNBQTNCO0FBQ0EsS0FBSUMsbUJBQW1CLENBQXZCO0FBQ0EsTUFBS0Msc0JBQUwsR0FBOEIsbUJBQzlCO0FBQ0NMLHlCQUF1Qk0sT0FBdkI7QUFDQVosV0FBUyxPQUFUO0FBQ0EsRUFKRDtBQUtBLE1BQUthLE1BQUw7QUFDQSxNQUFLQyxLQUFMLEdBQWEsSUFBSVgsU0FBU1ksWUFBVCxDQUFzQkMsS0FBMUIsRUFBYjtBQUNBLE1BQUtDLFdBQUwsR0FBbUI7QUFBQSxTQUFVQyxPQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUJDLE1BQWpCLEdBQTBCWCxrQkFBcEM7QUFBQSxFQUFuQjtBQUNBUCxVQUFTQyxlQUFULENBQXlCa0IsY0FBekIsQ0FBd0M7QUFBQSxTQUFNdEIsU0FBUyxTQUFULENBQU47QUFBQSxFQUF4QztBQUNBdUIsVUFBU0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUM7QUFBQSxTQUFNeEIsU0FBUyxLQUFULENBQU47QUFBQSxFQUFyQztBQUNELEM7O0FBaEREOzs7Ozs7QUFnREMiLCJmaWxlIjoid2luZG93cy5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdpbmRvdyBmcm9tICcuL1dpbmRvdy5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKClcclxue1xyXG5cdFx0Y29uc3QgZMOpY2FsYWdlUHggPSB7eCA6IG51bGwsIHkgOiBudWxsfTtcclxuXHRcdGNvbnN0IGTDqXBsYWNlciA9ICjDqXRhdCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Y29uc3QgcG9pbnRldXJQb3NpdGlvbiA9IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5wb3NpdGlvbigpO1xyXG5cdFx0XHRzd2l0Y2gow6l0YXQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjYXNlICdkw6lidXQnOlxyXG5cdFx0XHRcdFx0ZMOpY2FsYWdlUHgueCA9IHBvaW50ZXVyUG9zaXRpb24ueCAtIGZlbmV0cmVFbkTDqXBsYWNlbWVudC5wb3MueDtcclxuXHRcdFx0XHRcdGTDqWNhbGFnZVB4LnkgPSBmZW5ldHJlRW5Ew6lwbGFjZW1lbnQucG9zLnkgLSBwb2ludGV1clBvc2l0aW9uLnk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnZW5jb3Vycyc6XHJcblx0XHRcdFx0XHRpZihmZW5ldHJlRW5Ew6lwbGFjZW1lbnQpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGZlbmV0cmVFbkTDqXBsYWNlbWVudC5wb3NpdGlvbm5lclxyXG5cdFx0XHRcdFx0XHQoXHJcblx0XHRcdFx0XHRcdFx0cG9pbnRldXJQb3NpdGlvbi54IC0gZMOpY2FsYWdlUHgueCwgXHJcblx0XHRcdFx0XHRcdFx0cG9pbnRldXJQb3NpdGlvbi55ICsgZMOpY2FsYWdlUHgueVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSByZXR1cm47XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnZmluJzpcclxuXHRcdFx0XHRcdGlmKGZlbmV0cmVFbkTDqXBsYWNlbWVudCAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRmZW5ldHJlRW5Ew6lwbGFjZW1lbnQgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdGTDqWNhbGFnZVB4LnggPSAwO1xyXG5cdFx0XHRcdFx0XHRkw6ljYWxhZ2VQeC55ID0gMDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgcmV0dXJuO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBmZW5ldHJlRW5Ew6lwbGFjZW1lbnQgPSB1bmRlZmluZWQ7XHJcblx0XHR2YXIgaW5kZXhQcmVtaWVyUGxhbiA9IDA7XHJcblx0XHR0aGlzLmluaXRpYWxpc2VyRMOpcGxhY2VtZW50ID0gZmVuZXRyZSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRmZW5ldHJlRW5Ew6lwbGFjZW1lbnQgPSBmZW5ldHJlO1xyXG5cdFx0XHRkw6lwbGFjZXIoJ2TDqWJ1dCcpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuV2luZG93ID0gV2luZG93O1xyXG5cdFx0dGhpcy5saXN0ZSA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuTGlzdGUoKTtcclxuXHRcdHRoaXMudG9GaXJzdFBsYW4gPSB3aW5kb3cgPT4gd2luZG93LmRvbS5zdHlsZS56SW5kZXggPSBpbmRleFByZW1pZXJQbGFuKys7XHJcblx0XHR5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UucXVhbmRNb3V2ZW1lbnQoKCkgPT4gZMOpcGxhY2VyKCdlbmNvdXJzJykgKTtcclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiBkw6lwbGFjZXIoJ2ZpbicpICk7XHJcbn07Il19

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constructeur = function constructeur(elBoutonExterne) {

	var elBoutonInterne = elBoutonExterne.shadowRoot;
	var bouton = elBoutonInterne.querySelector('input');

	bouton.appliquerBordure();
	elBoutonExterne.changerLabel = function (texte) {
		return bouton.value = texte;
	};
	elBoutonExterne.enleverEffets = function () {
		return bouton.style.boxShadow = 'none';
	};

	bouton.style.backgroundColor = ybasthis.charteUi.grisClair;
	bouton.value = elBoutonExterne.innerHTML;

	bouton.addEventListener('mouseover', function () {
		bouton.style.backgroundColor = ybasthis.charteUi.grisFonce;
	}, false);
	bouton.addEventListener('mouseout', function () {
		bouton.style.backgroundColor = ybasthis.charteUi.grisClair;
	}, false);

	/**
 	Style
 **/

	var styleExterne = elBoutonExterne.style;
	bouton.addEventListener('insertionDom', function (ee) {
		//console.log('WIDTH BTN: ', getComputedStyle(elBoutonExterne).width, bouton);
	});
	elBoutonExterne.addEventListener('insertionDom', function (ee) {
		//console.log('WIDTH BATH: ', getComputedStyle(elBoutonExterne).width, bouton);
	});
	if (styleExterne.width === '') {
		styleExterne.width = 'auto';
		//console.log("babar: ", elBoutonExterne.obtenirStyleAuteurElement() );
	}
	console.log('pute');
	/*ybasthis.mutationSensor.newAsStyleExpected
 (
 	elBoutonExterne,
 	{
 		name:			'width',
 		expected:	'auto',
 		isEqual:	false
 	},
 	mutation =>
 	{
 		console.log('pipi', mutation.target);
 		styleExterne.width = getComputedStyle(elBoutonExterne).width;
 		bouton.style.width = styleExterne.width;
 	}
 );
 ybasthis.mutationSensor.newAsStyleExpected
 (
 	elBoutonExterne,
 	{
 		name:			'height',
 		expected:	'auto',
 		isEqual:	false
 	},
 	mutation =>
 	{
 		styleExterne.height = getComputedStyle(elBoutonExterne).height;
 		bouton.style.height = styleExterne.height;
 	}
 );*/
	/*ybasthis.utilitaires.WHEN(() => getComputedStyle(elBoutonExterne).width !== 'auto',
 () =>
 {
 	//console.log('largeur', elBoutonExterne, getComputedStyle(elBoutonExterne).width);
 	//styleExterne.width = getComputedStyle(bouton).width;
 	bouton.style.width = getComputedStyle(elBoutonExterne).width;
 });
 //styleExterne.boxShadow = '0px 0px 8px 3px white';
 */
	return false;
};
var template = '\n\t<template>\n\t\t<input type="submit" name="" value="" />\n\t\t<style>\n\t\t\tinput\n\t\t\t{\n\t\t\t\tposition:\t\t\trelative;\n\t\t\t\tdisplay:\t\t\tblock;\n\t\t\t\tfont-weight:\t700;\n\t\t\t\ttext-align:\t\tcenter;\n\t\t\t\tcursor:\t\t\t\tpointer;\n\t\t\t\theight:\t\t\t\t100%;\n\t\t\t\twidth:\t\t\t\t100%;\n\t\t\t}\n\t\t</style>\n\t</template>\n';
module.exports = {
	nom: 'bouton',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9ib3V0b24uanMiXSwibmFtZXMiOlsiY29uc3RydWN0ZXVyIiwiZWxCb3V0b25FeHRlcm5lIiwiZWxCb3V0b25JbnRlcm5lIiwic2hhZG93Um9vdCIsImJvdXRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJhcHBsaXF1ZXJCb3JkdXJlIiwiY2hhbmdlckxhYmVsIiwidmFsdWUiLCJ0ZXh0ZSIsImVubGV2ZXJFZmZldHMiLCJzdHlsZSIsImJveFNoYWRvdyIsImJhY2tncm91bmRDb2xvciIsInliYXN0aGlzIiwiY2hhcnRlVWkiLCJncmlzQ2xhaXIiLCJpbm5lckhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiZ3Jpc0ZvbmNlIiwic3R5bGVFeHRlcm5lIiwid2lkdGgiLCJjb25zb2xlIiwibG9nIiwidGVtcGxhdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsU0FBZkEsWUFBZSxDQUFTQyxlQUFULEVBQ25COztBQUVDLEtBQU1DLGtCQUFrQkQsZ0JBQWdCRSxVQUF4QztBQUNBLEtBQU1DLFNBQVNGLGdCQUFnQkcsYUFBaEIsQ0FBOEIsT0FBOUIsQ0FBZjs7QUFFQUQsUUFBT0UsZ0JBQVA7QUFDQUwsaUJBQWdCTSxZQUFoQixHQUErQjtBQUFBLFNBQVNILE9BQU9JLEtBQVAsR0FBZUMsS0FBeEI7QUFBQSxFQUEvQjtBQUNBUixpQkFBZ0JTLGFBQWhCLEdBQWdDO0FBQUEsU0FBTU4sT0FBT08sS0FBUCxDQUFhQyxTQUFiLEdBQXlCLE1BQS9CO0FBQUEsRUFBaEM7O0FBR0FSLFFBQU9PLEtBQVAsQ0FBYUUsZUFBYixHQUErQkMsU0FBU0MsUUFBVCxDQUFrQkMsU0FBakQ7QUFDQVosUUFBT0ksS0FBUCxHQUFlUCxnQkFBZ0JnQixTQUEvQjs7QUFFQWIsUUFBT2MsZ0JBQVAsQ0FDQyxXQURELEVBRUMsWUFDQTtBQUFFZCxTQUFPTyxLQUFQLENBQWFFLGVBQWIsR0FBK0JDLFNBQVNDLFFBQVQsQ0FBa0JJLFNBQWpEO0FBQTZELEVBSGhFLEVBSUMsS0FKRDtBQU1BZixRQUFPYyxnQkFBUCxDQUNDLFVBREQsRUFFQyxZQUNBO0FBQUVkLFNBQU9PLEtBQVAsQ0FBYUUsZUFBYixHQUErQkMsU0FBU0MsUUFBVCxDQUFrQkMsU0FBakQ7QUFBNkQsRUFIaEUsRUFJQyxLQUpEOztBQU9BOzs7O0FBSUEsS0FBTUksZUFBZW5CLGdCQUFnQlUsS0FBckM7QUFDQVAsUUFBT2MsZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsY0FDeEM7QUFDQztBQUNBLEVBSEQ7QUFJQWpCLGlCQUFnQmlCLGdCQUFoQixDQUFpQyxjQUFqQyxFQUFpRCxjQUNqRDtBQUNDO0FBQ0EsRUFIRDtBQUlBLEtBQUdFLGFBQWFDLEtBQWIsS0FBdUIsRUFBMUIsRUFDQTtBQUNDRCxlQUFhQyxLQUFiLEdBQXFCLE1BQXJCO0FBQ0E7QUFDQTtBQUNEQyxTQUFRQyxHQUFSLENBQVksTUFBWjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCQTs7Ozs7Ozs7O0FBU0EsUUFBTyxLQUFQO0FBQ0EsQ0FyRkQ7QUFzRkEsSUFBSUMsNFdBQUo7QUFrQkFDLE9BQU9DLE9BQVAsR0FDQTtBQUNDQyxNQUFTLFFBRFY7QUFFRUgsV0FBWUEsUUFGZDtBQUdFeEIsZUFBZUE7QUFIakIsQ0FEQSIsImZpbGUiOiJib3V0b24uanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbInZhciBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihlbEJvdXRvbkV4dGVybmUpXHJcbntcclxuXHRcclxuXHRjb25zdCBlbEJvdXRvbkludGVybmUgPSBlbEJvdXRvbkV4dGVybmUuc2hhZG93Um9vdDtcclxuXHRjb25zdCBib3V0b24gPSBlbEJvdXRvbkludGVybmUucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcclxuXHRcclxuXHRib3V0b24uYXBwbGlxdWVyQm9yZHVyZSgpO1xyXG5cdGVsQm91dG9uRXh0ZXJuZS5jaGFuZ2VyTGFiZWwgPSB0ZXh0ZSA9PiBib3V0b24udmFsdWUgPSB0ZXh0ZTtcclxuXHRlbEJvdXRvbkV4dGVybmUuZW5sZXZlckVmZmV0cyA9ICgpXHQ9PiBib3V0b24uc3R5bGUuYm94U2hhZG93ID0gJ25vbmUnO1xyXG5cdFxyXG5cdFxyXG5cdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0Ym91dG9uLnZhbHVlID0gZWxCb3V0b25FeHRlcm5lLmlubmVySFRNTDtcclxuXHRcclxuXHRib3V0b24uYWRkRXZlbnRMaXN0ZW5lclxyXG5cdCgnbW91c2VvdmVyJyxcclxuXHRcdGZ1bmN0aW9uKClcclxuXHRcdHtcdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzRm9uY2U7XHR9LFxyXG5cdFx0ZmFsc2VcdFxyXG5cdCk7XHJcblx0Ym91dG9uLmFkZEV2ZW50TGlzdGVuZXJcclxuXHQoJ21vdXNlb3V0JyxcclxuXHRcdGZ1bmN0aW9uKClcclxuXHRcdHtcdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHR9LFxyXG5cdFx0ZmFsc2VcclxuXHQpO1xyXG5cclxuXHQvKipcclxuXHRcdFN0eWxlXHJcblx0KiovXHJcblx0XHJcblx0Y29uc3Qgc3R5bGVFeHRlcm5lID0gZWxCb3V0b25FeHRlcm5lLnN0eWxlO1xyXG5cdGJvdXRvbi5hZGRFdmVudExpc3RlbmVyKCdpbnNlcnRpb25Eb20nLCBlZSA9PlxyXG5cdHtcclxuXHRcdC8vY29uc29sZS5sb2coJ1dJRFRIIEJUTjogJywgZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoLCBib3V0b24pO1xyXG5cdH0gKTtcclxuXHRlbEJvdXRvbkV4dGVybmUuYWRkRXZlbnRMaXN0ZW5lcignaW5zZXJ0aW9uRG9tJywgZWUgPT5cclxuXHR7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdXSURUSCBCQVRIOiAnLCBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGgsIGJvdXRvbik7XHJcblx0fSApO1xyXG5cdGlmKHN0eWxlRXh0ZXJuZS53aWR0aCA9PT0gJycpXHJcblx0e1xyXG5cdFx0c3R5bGVFeHRlcm5lLndpZHRoID0gJ2F1dG8nO1xyXG5cdFx0Ly9jb25zb2xlLmxvZyhcImJhYmFyOiBcIiwgZWxCb3V0b25FeHRlcm5lLm9idGVuaXJTdHlsZUF1dGV1ckVsZW1lbnQoKSApO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZygncHV0ZScpO1xyXG5cdC8qeWJhc3RoaXMubXV0YXRpb25TZW5zb3IubmV3QXNTdHlsZUV4cGVjdGVkXHJcblx0KFxyXG5cdFx0ZWxCb3V0b25FeHRlcm5lLFxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOlx0XHRcdCd3aWR0aCcsXHJcblx0XHRcdGV4cGVjdGVkOlx0J2F1dG8nLFxyXG5cdFx0XHRpc0VxdWFsOlx0ZmFsc2VcclxuXHRcdH0sXHJcblx0XHRtdXRhdGlvbiA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmxvZygncGlwaScsIG11dGF0aW9uLnRhcmdldCk7XHJcblx0XHRcdHN0eWxlRXh0ZXJuZS53aWR0aCA9IGdldENvbXB1dGVkU3R5bGUoZWxCb3V0b25FeHRlcm5lKS53aWR0aDtcclxuXHRcdFx0Ym91dG9uLnN0eWxlLndpZHRoID0gc3R5bGVFeHRlcm5lLndpZHRoO1xyXG5cdFx0fVxyXG5cdCk7XHJcblx0eWJhc3RoaXMubXV0YXRpb25TZW5zb3IubmV3QXNTdHlsZUV4cGVjdGVkXHJcblx0KFxyXG5cdFx0ZWxCb3V0b25FeHRlcm5lLFxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOlx0XHRcdCdoZWlnaHQnLFxyXG5cdFx0XHRleHBlY3RlZDpcdCdhdXRvJyxcclxuXHRcdFx0aXNFcXVhbDpcdGZhbHNlXHJcblx0XHR9LFxyXG5cdFx0bXV0YXRpb24gPT5cclxuXHRcdHtcclxuXHRcdFx0c3R5bGVFeHRlcm5lLmhlaWdodCA9IGdldENvbXB1dGVkU3R5bGUoZWxCb3V0b25FeHRlcm5lKS5oZWlnaHQ7XHJcblx0XHRcdGJvdXRvbi5zdHlsZS5oZWlnaHQgPSBzdHlsZUV4dGVybmUuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdCk7Ki9cclxuXHQvKnliYXN0aGlzLnV0aWxpdGFpcmVzLldIRU4oKCkgPT4gZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoICE9PSAnYXV0bycsXHJcblx0KCkgPT5cclxuXHR7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdsYXJnZXVyJywgZWxCb3V0b25FeHRlcm5lLCBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGgpO1xyXG5cdFx0Ly9zdHlsZUV4dGVybmUud2lkdGggPSBnZXRDb21wdXRlZFN0eWxlKGJvdXRvbikud2lkdGg7XHJcblx0XHRib3V0b24uc3R5bGUud2lkdGggPSBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGg7XHJcblx0fSk7XHJcblx0Ly9zdHlsZUV4dGVybmUuYm94U2hhZG93ID0gJzBweCAwcHggOHB4IDNweCB3aGl0ZSc7XHJcblx0Ki9cdFxyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxudmFyIHRlbXBsYXRlID1cclxuYFxyXG5cdDx0ZW1wbGF0ZT5cclxuXHRcdDxpbnB1dCB0eXBlPVwic3VibWl0XCIgbmFtZT1cIlwiIHZhbHVlPVwiXCIgLz5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0aW5wdXRcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0XHRcdHJlbGF0aXZlO1xyXG5cdFx0XHRcdGRpc3BsYXk6XHRcdFx0YmxvY2s7XHJcblx0XHRcdFx0Zm9udC13ZWlnaHQ6XHQ3MDA7XHJcblx0XHRcdFx0dGV4dC1hbGlnbjpcdFx0Y2VudGVyO1xyXG5cdFx0XHRcdGN1cnNvcjpcdFx0XHRcdHBvaW50ZXI7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHRcdFx0MTAwJTtcclxuXHRcdFx0XHR3aWR0aDpcdFx0XHRcdDEwMCU7XHJcblx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0PC90ZW1wbGF0ZT5cclxuYDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdib3V0b24nXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59OyJdfQ==

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constructeur = function constructeur(elCocher) {
	var valeur = elCocher.getAttribute("valeur");

	var bouton = elCocher.shadowRoot.querySelector('div');

	if (!valeur) {
		valeur = false;
	} else {
		bouton.innerHTML = 'X';
	}

	bouton.addEventListener('click', function () {
		valeur = !valeur;
		if (valeur) {
			bouton.innerHTML = 'X';
		} else {
			bouton.innerHTML = '';
		}
		elCocher.setAttribute('valeur', valeur);
	}, false);
	bouton.addEventListener('mouseover', function () {
		bouton.style.backgroundColor = ybasthis.charteUi.grisFonce;
	}, false);
	bouton.addEventListener('mouseout', function () {
		bouton.style.backgroundColor = ybasthis.charteUi.grisClair;
	}, false);
	return false;
};

var template = '\n\t<template>\n\t\t<div></div>\n\t\t<style>\n\t\t\tdiv\n\t\t\t{\n\t\t\t\theight:32px;\n\t\t\t\twidth: 32px;\n\t\t\t\tborder-color\t\t: black;\n\t\t\t\tborder-style\t\t: solid;\n\t\t\t\tborder-width\t\t: 1px;\n\t\t\t\tbackground-color\t: white;\n\t\t\t\tfont-weight\t\t\t: 700;\n\t\t\t\tfont-size\t\t\t: 2em;\n\t\t\t\tbackground-color\t: #b5b3b3;\n\t\t\t\tcolor\t\t\t\t: green;\n\t\t\t\ttext-align\t\t\t: center;\n\t\t\t\tline-height\t\t\t: 28px;\n\t\t\t}\n\t\t</style>\n\t</template>\n';

module.exports = {
	nom: 'caseCocher',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9jYXNlQ29jaGVyLmpzIl0sIm5hbWVzIjpbImNvbnN0cnVjdGV1ciIsImVsQ29jaGVyIiwidmFsZXVyIiwiZ2V0QXR0cmlidXRlIiwiYm91dG9uIiwic2hhZG93Um9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0QXR0cmlidXRlIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ5YmFzdGhpcyIsImNoYXJ0ZVVpIiwiZ3Jpc0ZvbmNlIiwiZ3Jpc0NsYWlyIiwidGVtcGxhdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsU0FBZkEsWUFBZSxDQUFTQyxRQUFULEVBQ25CO0FBQ0MsS0FBSUMsU0FBU0QsU0FBU0UsWUFBVCxDQUFzQixRQUF0QixDQUFiOztBQUVBLEtBQUlDLFNBQVNILFNBQVNJLFVBQVQsQ0FBb0JDLGFBQXBCLENBQWtDLEtBQWxDLENBQWI7O0FBRUEsS0FBRyxDQUFDSixNQUFKLEVBQVc7QUFBRUEsV0FBUyxLQUFUO0FBQWlCLEVBQTlCLE1BQ0k7QUFBRUUsU0FBT0csU0FBUCxHQUFtQixHQUFuQjtBQUF5Qjs7QUFFL0JILFFBQU9JLGdCQUFQLENBRUMsT0FGRCxFQUdFLFlBQ0Q7QUFDQ04sV0FBUyxDQUFDQSxNQUFWO0FBQ0EsTUFBR0EsTUFBSCxFQUNBO0FBQUVFLFVBQU9HLFNBQVAsR0FBbUIsR0FBbkI7QUFBeUIsR0FEM0IsTUFHQTtBQUFFSCxVQUFPRyxTQUFQLEdBQW1CLEVBQW5CO0FBQXdCO0FBQzFCTixXQUFTUSxZQUFULENBQXNCLFFBQXRCLEVBQWdDUCxNQUFoQztBQUVBLEVBWkYsRUFhQyxLQWJEO0FBZUFFLFFBQU9JLGdCQUFQLENBQ0MsV0FERCxFQUVDLFlBQ0E7QUFBRUosU0FBT00sS0FBUCxDQUFhQyxlQUFiLEdBQStCQyxTQUFTQyxRQUFULENBQWtCQyxTQUFqRDtBQUE2RCxFQUhoRSxFQUlDLEtBSkQ7QUFNQVYsUUFBT0ksZ0JBQVAsQ0FDQyxVQURELEVBRUMsWUFDQTtBQUFFSixTQUFPTSxLQUFQLENBQWFDLGVBQWIsR0FBK0JDLFNBQVNDLFFBQVQsQ0FBa0JFLFNBQWpEO0FBQTZELEVBSGhFLEVBSUMsS0FKRDtBQU1BLFFBQU8sS0FBUDtBQUNBLENBckNEOztBQXVDQSxJQUFJQyxtZkFBSjs7QUF3QkFDLE9BQU9DLE9BQVAsR0FDQTtBQUNDQyxNQUFTLFlBRFY7QUFFRUgsV0FBWUEsUUFGZDtBQUdFaEIsZUFBZUE7QUFIakIsQ0FEQSIsImZpbGUiOiJjYXNlQ29jaGVyLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxDb2NoZXIpXHJcbntcclxuXHR2YXIgdmFsZXVyID0gZWxDb2NoZXIuZ2V0QXR0cmlidXRlKFwidmFsZXVyXCIpO1xyXG5cclxuXHR2YXIgYm91dG9uID0gZWxDb2NoZXIuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdkaXYnKTtcclxuXHRcclxuXHRpZighdmFsZXVyKXtcdHZhbGV1ciA9IGZhbHNlO1x0fVxyXG5cdGVsc2V7XHRib3V0b24uaW5uZXJIVE1MID0gJ1gnO1x0fVxyXG5cdFxyXG5cdGJvdXRvbi5hZGRFdmVudExpc3RlbmVyXHJcblx0KFxyXG5cdFx0J2NsaWNrJ1xyXG5cdFx0LGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0dmFsZXVyID0gIXZhbGV1cjtcclxuXHRcdFx0aWYodmFsZXVyKVxyXG5cdFx0XHR7XHRib3V0b24uaW5uZXJIVE1MID0gJ1gnO1x0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcdGJvdXRvbi5pbm5lckhUTUwgPSAnJztcdH1cclxuXHRcdFx0ZWxDb2NoZXIuc2V0QXR0cmlidXRlKCd2YWxldXInLCB2YWxldXIpO1xyXG5cdFx0XHRcclxuXHRcdH0sXHJcblx0XHRmYWxzZVxyXG5cdCk7XHJcblx0Ym91dG9uLmFkZEV2ZW50TGlzdGVuZXJcclxuXHQoJ21vdXNlb3ZlcicsXHJcblx0XHRmdW5jdGlvbigpXHJcblx0XHR7XHRib3V0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlO1x0fSxcclxuXHRcdGZhbHNlXHJcblx0KTtcclxuXHRib3V0b24uYWRkRXZlbnRMaXN0ZW5lclxyXG5cdCgnbW91c2VvdXQnLFxyXG5cdFx0ZnVuY3Rpb24oKVxyXG5cdFx0e1x0Ym91dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcdH0sXHJcblx0XHRmYWxzZVxyXG5cdCk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID1cclxuYFxyXG5cdDx0ZW1wbGF0ZT5cclxuXHRcdDxkaXY+PC9kaXY+XHJcblx0XHQ8c3R5bGU+XHJcblx0XHRcdGRpdlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGVpZ2h0OjMycHg7XHJcblx0XHRcdFx0d2lkdGg6IDMycHg7XHJcblx0XHRcdFx0Ym9yZGVyLWNvbG9yXHRcdDogYmxhY2s7XHJcblx0XHRcdFx0Ym9yZGVyLXN0eWxlXHRcdDogc29saWQ7XHJcblx0XHRcdFx0Ym9yZGVyLXdpZHRoXHRcdDogMXB4O1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3JcdDogd2hpdGU7XHJcblx0XHRcdFx0Zm9udC13ZWlnaHRcdFx0XHQ6IDcwMDtcclxuXHRcdFx0XHRmb250LXNpemVcdFx0XHQ6IDJlbTtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yXHQ6ICNiNWIzYjM7XHJcblx0XHRcdFx0Y29sb3JcdFx0XHRcdDogZ3JlZW47XHJcblx0XHRcdFx0dGV4dC1hbGlnblx0XHRcdDogY2VudGVyO1xyXG5cdFx0XHRcdGxpbmUtaGVpZ2h0XHRcdFx0OiAyOHB4O1xyXG5cdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ2Nhc2VDb2NoZXInXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59OyJdfQ==

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constructeur = function constructeur(elChoix) {

	var option = elChoix.getAttribute("option");

	var elementConteneur = elChoix.parentElement;
	var type = elementConteneur.getAttribute('type');
	var nom = elChoix.getAttribute('nom');
	if (elementConteneur.tagName !== 'YB-ONGLET') throw new Error('utilisation d\'un choix � l\'exterieur d\'un onglet');else if (type !== 'selection') throw new Error('utilisation d\'un choix � l\'exterieur d\'un onglet de type selection, type actuel: ' + type);
	if (!nom || nom === '') throw new Error('utilisation d\'un choix avec un attribut @nom obligatoire non renseign�');

	var choix = document.createElement('p');
	choix.innerHTML = nom;
	elementConteneur.dom.ajouterChoix(choix);
	return false;
};

var template = '<template></template>';
module.exports = {
	nom: 'choix',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9jaG9peC5qcyJdLCJuYW1lcyI6WyJjb25zdHJ1Y3RldXIiLCJlbENob2l4Iiwib3B0aW9uIiwiZ2V0QXR0cmlidXRlIiwiZWxlbWVudENvbnRlbmV1ciIsInBhcmVudEVsZW1lbnQiLCJ0eXBlIiwibm9tIiwidGFnTmFtZSIsIkVycm9yIiwiY2hvaXgiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJkb20iLCJham91dGVyQ2hvaXgiLCJ0ZW1wbGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsZUFBZSxTQUFmQSxZQUFlLENBQVNDLE9BQVQsRUFDbkI7O0FBRUMsS0FBSUMsU0FBU0QsUUFBUUUsWUFBUixDQUFxQixRQUFyQixDQUFiOztBQUVBLEtBQU1DLG1CQUFtQkgsUUFBUUksYUFBakM7QUFDQSxLQUFNQyxPQUFPRixpQkFBaUJELFlBQWpCLENBQThCLE1BQTlCLENBQWI7QUFDQSxLQUFNSSxNQUFNTixRQUFRRSxZQUFSLENBQXFCLEtBQXJCLENBQVo7QUFDQSxLQUFHQyxpQkFBaUJJLE9BQWpCLEtBQTZCLFdBQWhDLEVBQTZDLE1BQU0sSUFBSUMsS0FBSixDQUFVLHFEQUFWLENBQU4sQ0FBN0MsS0FDSyxJQUFHSCxTQUFTLFdBQVosRUFBeUIsTUFBTSxJQUFJRyxLQUFKLENBQVUseUZBQXlGSCxJQUFuRyxDQUFOO0FBQzlCLEtBQUcsQ0FBQ0MsR0FBRCxJQUFRQSxRQUFRLEVBQW5CLEVBQXVCLE1BQU0sSUFBSUUsS0FBSixDQUFVLHlFQUFWLENBQU47O0FBRXZCLEtBQU1DLFFBQVFDLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBZDtBQUNBRixPQUFNRyxTQUFOLEdBQWtCTixHQUFsQjtBQUNBSCxrQkFBaUJVLEdBQWpCLENBQXFCQyxZQUFyQixDQUFrQ0wsS0FBbEM7QUFDQSxRQUFPLEtBQVA7QUFDQSxDQWhCRDs7QUFrQkEsSUFBSU0sa0NBQUo7QUFDQUMsT0FBT0MsT0FBUCxHQUNBO0FBQ0NYLE1BQVMsT0FEVjtBQUVFUyxXQUFZQSxRQUZkO0FBR0VoQixlQUFlQTtBQUhqQixDQURBIiwiZmlsZSI6ImNob2l4LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxDaG9peClcclxue1xyXG5cdFxyXG5cdHZhciBvcHRpb24gPSBlbENob2l4LmdldEF0dHJpYnV0ZShcIm9wdGlvblwiKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0Y29uc3QgZWxlbWVudENvbnRlbmV1ciA9IGVsQ2hvaXgucGFyZW50RWxlbWVudDtcclxuXHRjb25zdCB0eXBlID0gZWxlbWVudENvbnRlbmV1ci5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcclxuXHRjb25zdCBub20gPSBlbENob2l4LmdldEF0dHJpYnV0ZSgnbm9tJyk7XHJcblx0aWYoZWxlbWVudENvbnRlbmV1ci50YWdOYW1lICE9PSAnWUItT05HTEVUJykgdGhyb3cgbmV3IEVycm9yKCd1dGlsaXNhdGlvbiBkXFwndW4gY2hvaXgg77+9IGxcXCdleHRlcmlldXIgZFxcJ3VuIG9uZ2xldCcpO1xyXG5cdGVsc2UgaWYodHlwZSAhPT0gJ3NlbGVjdGlvbicpIHRocm93IG5ldyBFcnJvcigndXRpbGlzYXRpb24gZFxcJ3VuIGNob2l4IO+/vSBsXFwnZXh0ZXJpZXVyIGRcXCd1biBvbmdsZXQgZGUgdHlwZSBzZWxlY3Rpb24sIHR5cGUgYWN0dWVsOiAnICsgdHlwZSk7XHJcblx0aWYoIW5vbSB8fCBub20gPT09ICcnKSB0aHJvdyBuZXcgRXJyb3IoJ3V0aWxpc2F0aW9uIGRcXCd1biBjaG9peCBhdmVjIHVuIGF0dHJpYnV0IEBub20gb2JsaWdhdG9pcmUgbm9uIHJlbnNlaWdu77+9Jyk7XHJcblx0XHJcblx0Y29uc3QgY2hvaXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcblx0Y2hvaXguaW5uZXJIVE1MID0gbm9tO1xyXG5cdGVsZW1lbnRDb250ZW5ldXIuZG9tLmFqb3V0ZXJDaG9peChjaG9peCk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID0gYDx0ZW1wbGF0ZT48L3RlbXBsYXRlPmA7XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnY2hvaXgnXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59OyJdfQ==

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var template = '\n\t<template>\n\t\t<div id=\'conteneur\'>\n\t\t\t<div id=\'titre\'>\n\t\t\t\t<p></p>\n\t\t\t</div>\n\t\t\t<div id=\'gallerie\'></div>\n\t\t</div>\n\t\t<style>\n\t\t\tp\n\t\t\t{\n\t\t\t\tmargin : 0px;\n\t\t\t}\n\t\t\t#conteneur\n\t\t\t{\n\t\t\t\theight\t: 100%;\n\t\t\t\twidth\t: 100%;\n\t\t\t}\n\t\t</style>\n\t</template>\n';

/**
	Une galleries possède ces propriétés privées:
	_donnees , modele, organiseur, lecteur, tailleVignette, formeVignette.
	
	_donnees représente les vignettes de la gallerie.
	modele est un tableau représentant le nom des propriétés valides pour une instance de vignette
	organiseur fonction appélé lors de l'affichage
	lecteur fonction appelé lors de l'affichage pour chaque vignettes
	nombreVignette 'petit':10 'moyen' 'grand'
	formeVignette 'carré' 'rectangle'
**/
var constructeur = function constructeur(elInterface) {
	var _arguments = arguments;

	var qs = function qs(sel) {
		return elInterface.shadowRoot.querySelector(sel);
	};
	var cs = getComputedStyle;

	var titre = elInterface.getAttribute('titre');
	qs('#titre').querySelector('p').innerHTML = titre;

	var _donnees = [],
	    pos = 0,
	    specialisation;

	elInterface.specialiser = function (param) {
		specialisation = param;
	};
	elInterface.ajouter = function ($donnees) {
		// NOTES Lot de données.
		if (_arguments[1]) {
			var argTableau = Array.prototype.slice.call(_arguments);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = argTableau[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var donnee = _step.value;

					// NOTES Test si les données sont valides.
					try {
						var autorise;
						for (var nomProp in donnee) {
							autorise = false;
							var _iteratorNormalCompletion2 = true;
							var _didIteratorError2 = false;
							var _iteratorError2 = undefined;

							try {
								for (var _iterator2 = specialisation.modele[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									var npAutorise = _step2.value;

									if (nomProp == npAutorise) {
										autorise = true;
									}
								}
							} catch (err) {
								_didIteratorError2 = true;
								_iteratorError2 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion2 && _iterator2.return) {
										_iterator2.return();
									}
								} finally {
									if (_didIteratorError2) {
										throw _iteratorError2;
									}
								}
							}

							if (!autorise) {
								throw new Error('Données non valides');
							}
						}
					} catch (e) {
						throw new Error(e);
					}
					_donnees.push(donnee);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	};

	var elGal = qs('#gallerie');
	elInterface.afficher = function () {
		for (var e = 0; e < elGal.children; e++) {
			elGal.children[e].remove();
		}
		if (!specialisation) {
			throw new Error('Pas de spécialisation L92 Fgallerie.js');
		} else {
			var donneesOrdonnees = specialisation.organisateur(_donnees);
			var vignette;
			for (var i = 0; i < specialisation.nombreVignette; i++) {
				vignette = donneesOrdonnees[i + pos];
				elGal.appendChild(specialisation.lecteur(vignette));
			}
		}
	};
	return false;
};
module.exports = {
	nom: 'gallerie',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9nYWxsZXJpZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsImNvbnN0cnVjdGV1ciIsImVsSW50ZXJmYWNlIiwicXMiLCJzaGFkb3dSb290IiwicXVlcnlTZWxlY3RvciIsInNlbCIsImNzIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInRpdHJlIiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiX2Rvbm5lZXMiLCJwb3MiLCJzcGVjaWFsaXNhdGlvbiIsInNwZWNpYWxpc2VyIiwicGFyYW0iLCJham91dGVyIiwiJGRvbm5lZXMiLCJhcmdUYWJsZWF1IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJkb25uZWUiLCJhdXRvcmlzZSIsIm5vbVByb3AiLCJtb2RlbGUiLCJucEF1dG9yaXNlIiwiRXJyb3IiLCJlIiwicHVzaCIsImVsR2FsIiwiYWZmaWNoZXIiLCJjaGlsZHJlbiIsInJlbW92ZSIsImRvbm5lZXNPcmRvbm5lZXMiLCJvcmdhbmlzYXRldXIiLCJ2aWduZXR0ZSIsImkiLCJub21icmVWaWduZXR0ZSIsImFwcGVuZENoaWxkIiwibGVjdGV1ciIsIm1vZHVsZSIsImV4cG9ydHMiLCJub20iXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsa1ZBQUo7O0FBdUJBOzs7Ozs7Ozs7OztBQVdBLElBQUlDLGVBQWUsU0FBZkEsWUFBZSxDQUFTQyxXQUFULEVBQ25CO0FBQUE7O0FBQ0MsS0FBSUMsS0FBSyxTQUFMQSxFQUFLO0FBQUEsU0FBT0QsWUFBWUUsVUFBWixDQUF1QkMsYUFBdkIsQ0FBcUNDLEdBQXJDLENBQVA7QUFBQSxFQUFUO0FBQ0EsS0FBSUMsS0FBS0MsZ0JBQVQ7O0FBRUEsS0FBSUMsUUFBUVAsWUFBWVEsWUFBWixDQUF5QixPQUF6QixDQUFaO0FBQ0FQLElBQUcsUUFBSCxFQUFhRSxhQUFiLENBQTJCLEdBQTNCLEVBQWdDTSxTQUFoQyxHQUE0Q0YsS0FBNUM7O0FBRUEsS0FBTUcsV0FBVyxFQUFqQjtBQUFBLEtBQXFCQyxNQUFNLENBQTNCO0FBQUEsS0FBOEJDLGNBQTlCOztBQUVBWixhQUFZYSxXQUFaLEdBQTBCLFVBQUNDLEtBQUQsRUFDMUI7QUFDQ0YsbUJBQWlCRSxLQUFqQjtBQUNBLEVBSEQ7QUFJQWQsYUFBWWUsT0FBWixHQUFzQixVQUFDQyxRQUFELEVBQ3RCO0FBQ0M7QUFDQSxNQUFHLFdBQVUsQ0FBVixDQUFILEVBQ0E7QUFDQyxPQUFJQyxhQUFhQyxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsWUFBakI7QUFERDtBQUFBO0FBQUE7O0FBQUE7QUFFQyx5QkFBa0JKLFVBQWxCLDhIQUNBO0FBQUEsU0FEUUssTUFDUjs7QUFDQztBQUNBLFNBQ0E7QUFDQyxVQUFJQyxRQUFKO0FBQ0EsV0FBSSxJQUFJQyxPQUFSLElBQW1CRixNQUFuQixFQUNBO0FBQ0NDLGtCQUFXLEtBQVg7QUFERDtBQUFBO0FBQUE7O0FBQUE7QUFFQyw4QkFBc0JYLGVBQWVhLE1BQXJDLG1JQUNBO0FBQUEsYUFEUUMsVUFDUjs7QUFDQyxhQUFHRixXQUFXRSxVQUFkLEVBQ0E7QUFBRUgscUJBQVcsSUFBWDtBQUFrQjtBQUNwQjtBQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT0MsV0FBRyxDQUFDQSxRQUFKLEVBQWE7QUFBRSxjQUFNLElBQUlJLEtBQUosQ0FBVSxxQkFBVixDQUFOO0FBQXdDO0FBQ3ZEO0FBQ0QsTUFiRCxDQWNBLE9BQU1DLENBQU4sRUFBUTtBQUFFLFlBQU0sSUFBSUQsS0FBSixDQUFVQyxDQUFWLENBQU47QUFBcUI7QUFDL0JsQixjQUFTbUIsSUFBVCxDQUFjUCxNQUFkO0FBQ0E7QUFyQkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXNCQztBQUNELEVBM0JEOztBQTZCQSxLQUFJUSxRQUFRN0IsR0FBRyxXQUFILENBQVo7QUFDQUQsYUFBWStCLFFBQVosR0FBdUIsWUFDdkI7QUFDQyxPQUFJLElBQUlILElBQUksQ0FBWixFQUFlQSxJQUFJRSxNQUFNRSxRQUF6QixFQUFtQ0osR0FBbkMsRUFDQTtBQUNDRSxTQUFNRSxRQUFOLENBQWVKLENBQWYsRUFBa0JLLE1BQWxCO0FBQ0E7QUFDRCxNQUFHLENBQUNyQixjQUFKLEVBQ0E7QUFDQyxTQUFNLElBQUllLEtBQUosQ0FBVSx3Q0FBVixDQUFOO0FBQ0EsR0FIRCxNQUtBO0FBQ0MsT0FBSU8sbUJBQW1CdEIsZUFBZXVCLFlBQWYsQ0FBNEJ6QixRQUE1QixDQUF2QjtBQUNBLE9BQUkwQixRQUFKO0FBQ0EsUUFBSSxJQUFJQyxJQUFHLENBQVgsRUFBY0EsSUFBSXpCLGVBQWUwQixjQUFqQyxFQUFpREQsR0FBakQsRUFDQTtBQUNDRCxlQUFXRixpQkFBaUJHLElBQUkxQixHQUFyQixDQUFYO0FBQ0FtQixVQUFNUyxXQUFOLENBQWtCM0IsZUFBZTRCLE9BQWYsQ0FBdUJKLFFBQXZCLENBQWxCO0FBQ0E7QUFDRDtBQUVELEVBckJEO0FBc0JBLFFBQU8sS0FBUDtBQUNBLENBbkVEO0FBb0VBSyxPQUFPQyxPQUFQLEdBQ0E7QUFDQ0MsTUFBUyxVQURWO0FBRUU3QyxXQUFZQSxRQUZkO0FBR0VDLGVBQWVBO0FBSGpCLENBREEiLCJmaWxlIjoiZ2FsbGVyaWUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbInZhciB0ZW1wbGF0ZSA9IFxyXG5gXHJcblx0PHRlbXBsYXRlPlxyXG5cdFx0PGRpdiBpZD0nY29udGVuZXVyJz5cclxuXHRcdFx0PGRpdiBpZD0ndGl0cmUnPlxyXG5cdFx0XHRcdDxwPjwvcD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgaWQ9J2dhbGxlcmllJz48L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHRwXHJcblx0XHRcdHtcclxuXHRcdFx0XHRtYXJnaW4gOiAwcHg7XHJcblx0XHRcdH1cclxuXHRcdFx0I2NvbnRlbmV1clxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGVpZ2h0XHQ6IDEwMCU7XHJcblx0XHRcdFx0d2lkdGhcdDogMTAwJTtcclxuXHRcdFx0fVxyXG5cdFx0PC9zdHlsZT5cclxuXHQ8L3RlbXBsYXRlPlxyXG5gO1xyXG5cclxuLyoqXHJcblx0VW5lIGdhbGxlcmllcyBwb3Nzw6hkZSBjZXMgcHJvcHJpw6l0w6lzIHByaXbDqWVzOlxyXG5cdF9kb25uZWVzICwgbW9kZWxlLCBvcmdhbmlzZXVyLCBsZWN0ZXVyLCB0YWlsbGVWaWduZXR0ZSwgZm9ybWVWaWduZXR0ZS5cclxuXHRcclxuXHRfZG9ubmVlcyByZXByw6lzZW50ZSBsZXMgdmlnbmV0dGVzIGRlIGxhIGdhbGxlcmllLlxyXG5cdG1vZGVsZSBlc3QgdW4gdGFibGVhdSByZXByw6lzZW50YW50IGxlIG5vbSBkZXMgcHJvcHJpw6l0w6lzIHZhbGlkZXMgcG91ciB1bmUgaW5zdGFuY2UgZGUgdmlnbmV0dGVcclxuXHRvcmdhbmlzZXVyIGZvbmN0aW9uIGFwcMOpbMOpIGxvcnMgZGUgbCdhZmZpY2hhZ2VcclxuXHRsZWN0ZXVyIGZvbmN0aW9uIGFwcGVsw6kgbG9ycyBkZSBsJ2FmZmljaGFnZSBwb3VyIGNoYXF1ZSB2aWduZXR0ZXNcclxuXHRub21icmVWaWduZXR0ZSAncGV0aXQnOjEwICdtb3llbicgJ2dyYW5kJ1xyXG5cdGZvcm1lVmlnbmV0dGUgJ2NhcnLDqScgJ3JlY3RhbmdsZSdcclxuKiovXHJcbnZhciBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihlbEludGVyZmFjZSlcclxue1xyXG5cdHZhciBxcyA9IHNlbCA9PiBlbEludGVyZmFjZS5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcclxuXHR2YXIgY3MgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdFxyXG5cdHZhciB0aXRyZSA9IGVsSW50ZXJmYWNlLmdldEF0dHJpYnV0ZSgndGl0cmUnKTtcclxuXHRxcygnI3RpdHJlJykucXVlcnlTZWxlY3RvcigncCcpLmlubmVySFRNTCA9IHRpdHJlO1xyXG5cdFxyXG5cdHZhciAgIF9kb25uZWVzID0gW10sIHBvcyA9IDAsIHNwZWNpYWxpc2F0aW9uO1xyXG5cdFxyXG5cdGVsSW50ZXJmYWNlLnNwZWNpYWxpc2VyID0gKHBhcmFtKSA9PlxyXG5cdHtcclxuXHRcdHNwZWNpYWxpc2F0aW9uID0gcGFyYW07XHJcblx0fTtcclxuXHRlbEludGVyZmFjZS5ham91dGVyID0gKCRkb25uZWVzKSA9PlxyXG5cdHtcclxuXHRcdC8vIE5PVEVTIExvdCBkZSBkb25uw6llcy5cclxuXHRcdGlmKGFyZ3VtZW50c1sxXSlcclxuXHRcdHtcclxuXHRcdFx0dmFyIGFyZ1RhYmxlYXUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdFx0XHRmb3IodmFyIGRvbm5lZSBvZiBhcmdUYWJsZWF1KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gTk9URVMgVGVzdCBzaSBsZXMgZG9ubsOpZXMgc29udCB2YWxpZGVzLlxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciBhdXRvcmlzZTtcclxuXHRcdFx0XHRcdGZvcih2YXIgbm9tUHJvcCBpbiBkb25uZWUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGF1dG9yaXNlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGZvcih2YXIgbnBBdXRvcmlzZSBvZiBzcGVjaWFsaXNhdGlvbi5tb2RlbGUpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpZihub21Qcm9wID09IG5wQXV0b3Jpc2UpXHJcblx0XHRcdFx0XHRcdFx0e1x0YXV0b3Jpc2UgPSB0cnVlO1x0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKCFhdXRvcmlzZSl7XHR0aHJvdyBuZXcgRXJyb3IoJ0Rvbm7DqWVzIG5vbiB2YWxpZGVzJyk7fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaChlKXtcdHRocm93IG5ldyBFcnJvcihlKTtcdH1cclxuXHRcdFx0XHRfZG9ubmVlcy5wdXNoKGRvbm5lZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdFxyXG5cdHZhciBlbEdhbCA9IHFzKCcjZ2FsbGVyaWUnKTtcclxuXHRlbEludGVyZmFjZS5hZmZpY2hlciA9ICgpID0+XHJcblx0e1xyXG5cdFx0Zm9yKHZhciBlID0gMDsgZSA8IGVsR2FsLmNoaWxkcmVuOyBlKyspXHJcblx0XHR7XHJcblx0XHRcdGVsR2FsLmNoaWxkcmVuW2VdLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdFx0aWYoIXNwZWNpYWxpc2F0aW9uKVxyXG5cdFx0e1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1BhcyBkZSBzcMOpY2lhbGlzYXRpb24gTDkyIEZnYWxsZXJpZS5qcycpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgZG9ubmVlc09yZG9ubmVlcyA9IHNwZWNpYWxpc2F0aW9uLm9yZ2FuaXNhdGV1cihfZG9ubmVlcyk7XHJcblx0XHRcdHZhciB2aWduZXR0ZTtcclxuXHRcdFx0Zm9yKHZhciBpID0wOyBpIDwgc3BlY2lhbGlzYXRpb24ubm9tYnJlVmlnbmV0dGU7IGkrKylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZpZ25ldHRlID0gZG9ubmVlc09yZG9ubmVlc1tpICsgcG9zXTtcclxuXHRcdFx0XHRlbEdhbC5hcHBlbmRDaGlsZChzcGVjaWFsaXNhdGlvbi5sZWN0ZXVyKHZpZ25ldHRlKSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHR9O1xyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdnYWxsZXJpZSdcclxuXHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07Il19

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
	var interfaces = {};
	var constructeur = function constructeur(elInterface) {
		/**
  	PRIVE
  **/
		var IInterfaceObjet = new ybasthis.typesDonnees.InterfaceTypée({ doit: {
				nom: 'string', modele: 'string', constructeur: Function
			} });
		var id = elInterface.obtenirId();
		/**
  	PUBLIQUE
  **/
		elInterface.ajouter = function (vue) {
			try {
				IInterfaceObjet.valider(vue);
			} catch (e) {
				if (e.estFormelle) throw e;
				var err = new TypeError('Interface.ajourter@vue ne correspond pas à un objet d\'interface!').lier(e);
				err.details.interfaceId = id;
				err.details.objetInterfaceReçu = vue;

				_ERREUR('interface.ajouter', err);
				//console.warn(err.message, err.details);
				throw err;
			}
			if (!interfaces[id][vue.nom]) {
				var modele = document.createElement('div');
				modele.innerHTML = vue.modele;

				interfaces[id][vue.nom] = { constructeur: vue.constructeur, modele: modele, initialisé: false };
				if (vue.defaut) interfaces[id]['_defaut'] = vue.nom;
			}
		};
		elInterface.afficher = function ($nom) {
			try {
				ybasthis.contrat({ doit: [$nom, ['undefined', 'string']] });
			} catch (e) {
				if (e.estFormelle) throw e;
				throw new TypeError('Interface.afficher@$nom doit être un string ou undefined').lier(e);
			}

			ybasthis.navigation.push('interface: ' + id + ' affichage: ' + $nom);
			var nom = !$nom ? '_defaut' : $nom;
			try {
				ybasthis.contrat({ doit: [interfaces[id][nom], 'object'] });
			} catch (e) {
				new Error('Interface.afficher@$nom{' + nom + '} n\'existe pas dans: {' + id + '}');
			}

			var _interfaces$id$nom = interfaces[id][nom],
			    modele = _interfaces$id$nom.modele,
			    constructeur = _interfaces$id$nom.constructeur,
			    initialisé = _interfaces$id$nom.initialisé,
			    initialiseur = _interfaces$id$nom.initialiseur;
			/** Suppression de l'ancienne vue **/

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = elInterface.shadowRoot.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var element = _step.value;
					element.remove();
				} /** Ajout dans le dom de la nouvelle vue **/
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			elInterface.shadowRoot.appendChild(modele);
			var vueInterface = elInterface.shadowRoot.lastChild;
			if (!initialisé) {
				interfaces[id][nom].initialiseur = constructeur(elInterface, vueInterface);
				interfaces[id][nom].initialisé = true;
			} else if (initialiseur) initialiseur(vueInterface);

			return vueInterface;
		};
		elInterface.listeInterfaces = function () {
			var r = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Object.keys(interfaces)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var idInt = _step2.value;
					r.push(interfaces[idInt]);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return r;
		};
		/**
  	CONSTRUCTEUR
  **/
		if (!interfaces[id]) interfaces[id] = {};
		return false;
	};

	var template = '\n\t\t<template>\n\t\t</template>\n\t';
	module.exports = {
		nom: 'interface',
		template: template,
		constructeur: constructeur
	};
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9pbnRlcmZhY2UuanMiXSwibmFtZXMiOlsiaW50ZXJmYWNlcyIsImNvbnN0cnVjdGV1ciIsImVsSW50ZXJmYWNlIiwiSUludGVyZmFjZU9iamV0IiwieWJhc3RoaXMiLCJ0eXBlc0Rvbm5lZXMiLCJJbnRlcmZhY2VUeXDDqWUiLCJkb2l0Iiwibm9tIiwibW9kZWxlIiwiRnVuY3Rpb24iLCJpZCIsIm9idGVuaXJJZCIsImFqb3V0ZXIiLCJ2dWUiLCJ2YWxpZGVyIiwiZSIsImVzdEZvcm1lbGxlIiwiZXJyIiwiVHlwZUVycm9yIiwibGllciIsImRldGFpbHMiLCJpbnRlcmZhY2VJZCIsIm9iamV0SW50ZXJmYWNlUmXDp3UiLCJfRVJSRVVSIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiaW5pdGlhbGlzw6kiLCJkZWZhdXQiLCJhZmZpY2hlciIsImNvbnRyYXQiLCIkbm9tIiwibmF2aWdhdGlvbiIsInB1c2giLCJFcnJvciIsImluaXRpYWxpc2V1ciIsInNoYWRvd1Jvb3QiLCJjaGlsZHJlbiIsImVsZW1lbnQiLCJyZW1vdmUiLCJhcHBlbmRDaGlsZCIsInZ1ZUludGVyZmFjZSIsImxhc3RDaGlsZCIsImxpc3RlSW50ZXJmYWNlcyIsInIiLCJPYmplY3QiLCJrZXlzIiwiaWRJbnQiLCJ0ZW1wbGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkE7QUFDQyxLQUFNQSxhQUFhLEVBQW5CO0FBQ0EsS0FBTUMsZUFBZSxTQUFmQSxZQUFlLENBQVNDLFdBQVQsRUFDckI7QUFDQzs7O0FBR0MsTUFBTUMsa0JBQWtCLElBQUlDLFNBQVNDLFlBQVQsQ0FBc0JDLGNBQTFCLENBQXlDLEVBQUNDLE1BQ2xFO0FBQ0NDLFNBQUssUUFETixFQUNnQkMsUUFBUSxRQUR4QixFQUNrQ1IsY0FBY1M7QUFEaEQsSUFEaUUsRUFBekMsQ0FBeEI7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QUFaLENBQXVCTSxTQUE1QztBQUNBLE9BQUcsQ0FBQ2YsVUFBSixFQUNBO0FBQ0M1QixlQUFXVyxFQUFYLEVBQWVILEdBQWYsRUFBb0I0QixZQUFwQixHQUFtQ25DLGFBQWFDLFdBQWIsRUFBMEJ3QyxZQUExQixDQUFuQztBQUNBMUMsZUFBV1csRUFBWCxFQUFlSCxHQUFmLEVBQW9Cb0IsVUFBcEIsR0FBaUMsSUFBakM7QUFDQSxJQUpELE1BS0ssSUFBR1EsWUFBSCxFQUFpQkEsYUFBYU0sWUFBYjs7QUFFdEIsVUFBT0EsWUFBUDtBQUNBLEdBckNEO0FBc0NBeEMsY0FBWTBDLGVBQVosR0FBOEIsWUFDOUI7QUFDQyxPQUFNQyxJQUFJLEVBQVY7QUFERDtBQUFBO0FBQUE7O0FBQUE7QUFFQywwQkFBaUJDLE9BQU9DLElBQVAsQ0FBWS9DLFVBQVosQ0FBakI7QUFBQSxTQUFRZ0QsS0FBUjtBQUEyQ0gsT0FBRVgsSUFBRixDQUFPbEMsV0FBV2dELEtBQVgsQ0FBUDtBQUEzQztBQUZEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBR0MsVUFBT0gsQ0FBUDtBQUNBLEdBTEQ7QUFNQTs7O0FBR0EsTUFBRyxDQUFDN0MsV0FBV1csRUFBWCxDQUFKLEVBQXFCWCxXQUFXVyxFQUFYLElBQWlCLEVBQWpCO0FBQ3JCLFNBQU8sS0FBUDtBQUNBLEVBckZEOztBQXVGQSxLQUFNc0Msa0RBQU47QUFLQUMsUUFBT0MsT0FBUCxHQUNBO0FBQ0MzQyxPQUFTLFdBRFY7QUFFRXlDLFlBQVlBLFFBRmQ7QUFHRWhELGdCQUFlQTtBQUhqQixFQURBO0FBTUEiLCJmaWxlIjoiaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcblx0VW5lIGludGVyZmFjZSBlc3QgdW4gY29tcG9zYW50IGRvbVxyXG5cdEZvbmN0aW9ubmFsaXTDqWVzOlxyXG5cdFx0SVx0LXN0b2NrZXIgZGVzIHZ1ZXNcclxuXHRcdElJXHQtYWZmaWNoZXIgdW5lIHZ1ZVxyXG5cdFx0SUlJXHQtZ2FyZGVyIGwnw6l0YXQgZCd1bmUgdnVlXHJcblx0XHRJVlx0LWFwcGxpcXVlciB1bmUgZm9uY3Rpb24gbG9ycyBkdSBwcmVtaWVyIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHRWXHQtYXBwbGlxdWVyIHVuZSBmb25jdGlvbiBsb3JzIGRlIGNoYXF1ZSB2aXNpb25uYWdlIGQndW5lIHZ1ZVxyXG5cdFxyXG5cdFZ1ZVx0T2JqZWN0XHJcblx0XHRFbnNlbWJsZSBkJ8OpbMOpbWVudCBkJ2ludGVyZmFjZSBncmFwaGlxdWUuXHJcblx0XHRAbm9tXHRcdFx0XHRTdHJpbmdcclxuXHRcdEBtb2RlbGVcdFx0XHRIVE1MRWxlbWVudFxyXG5cdFx0QGNvbnN0cnVjdGV1clx0XHRGdW5jdGlvbihAQGNvbXBvc2FudEludGVyZmFjZSwgQEB2dWVJbnRlcmZhY2UpID0+IHZvaWQgfHwgRnVuY3Rpb24oQEB2dWVJbnRlcmZhY2UpOlxyXG5cdFx0XHRBcHBsaXF1w6kgbG9ycyBkdSBwcmVtaWVyIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHRcdFNpIHJldG91cm5lIHVuZSBmb25jdGlvbiwgZWxsZSBzZXJhIGFwcGVsw6llIMOgIGNoYXF1ZSB2aXNpb25uYWdlXHJcblx0XHRcdFxyXG5cdEF0dGVudGlvbiwgbmUgcGFzIGNvbmZvbmRyZSBpbnRlcmZhY2UgYXBwbGljYXRpdmUgb3UgbCdpbnRlcmZhY2UgZCd1biBvYmpldCBhdmVjIHVuIGNvbXBvc2FudCBpbnRlcmZhY2VcclxuXHRcclxuXHRAYWpvdXRlcihAQHZ1ZSlcclxuXHRAYWZmaWNoZXIoQEBub21WdWUpXHJcbioqL1xyXG57XHJcblx0Y29uc3QgaW50ZXJmYWNlcyA9IHt9O1xyXG5cdGNvbnN0IGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsSW50ZXJmYWNlKVxyXG5cdHtcclxuXHRcdC8qKlxyXG5cdFx0XHRQUklWRVxyXG5cdFx0KiovXHJcblx0XHRcdGNvbnN0IElJbnRlcmZhY2VPYmpldCA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuSW50ZXJmYWNlVHlww6llKHtkb2l0OlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bm9tOiAnc3RyaW5nJywgbW9kZWxlOiAnc3RyaW5nJywgY29uc3RydWN0ZXVyOiBGdW5jdGlvblxyXG5cdFx0XHR9IH0gKTtcclxuXHRcdFx0Y29uc3QgaWQgPSBlbEludGVyZmFjZS5vYnRlbmlySWQoKTtcclxuXHRcdC8qKlxyXG5cdFx0XHRQVUJMSVFVRVxyXG5cdFx0KiovXHRcclxuXHRcdGVsSW50ZXJmYWNlLmFqb3V0ZXIgPSAodnVlKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0cnl7IElJbnRlcmZhY2VPYmpldC52YWxpZGVyKHZ1ZSk7IH1cclxuXHRcdFx0Y2F0Y2goZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGUuZXN0Rm9ybWVsbGUpIHRocm93IGU7XHJcblx0XHRcdFx0bGV0IGVyciA9IG5ldyBUeXBlRXJyb3IoJ0ludGVyZmFjZS5ham91cnRlckB2dWUgbmUgY29ycmVzcG9uZCBwYXMgw6AgdW4gb2JqZXQgZFxcJ2ludGVyZmFjZSEnKS5saWVyKGUpO1xyXG5cdFx0XHRcdGVyci5kZXRhaWxzLmludGVyZmFjZUlkID0gaWQ7XHJcblx0XHRcdFx0ZXJyLmRldGFpbHMub2JqZXRJbnRlcmZhY2VSZcOndSA9IHZ1ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRfRVJSRVVSKCdpbnRlcmZhY2UuYWpvdXRlcicsIGVycik7XHJcblx0XHRcdFx0Ly9jb25zb2xlLndhcm4oZXJyLm1lc3NhZ2UsIGVyci5kZXRhaWxzKTtcclxuXHRcdFx0XHR0aHJvdyBlcnI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWludGVyZmFjZXNbaWRdW3Z1ZS5ub21dIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBtb2RlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHRtb2RlbGUuaW5uZXJIVE1MID0gdnVlLm1vZGVsZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpbnRlcmZhY2VzW2lkXVt2dWUubm9tXSA9IHsgY29uc3RydWN0ZXVyIDogdnVlLmNvbnN0cnVjdGV1ciwgbW9kZWxlLCBpbml0aWFsaXPDqSA6IGZhbHNlfTtcclxuXHRcdFx0XHRpZih2dWUuZGVmYXV0KSBpbnRlcmZhY2VzW2lkXVsnX2RlZmF1dCddID0gdnVlLm5vbTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGVsSW50ZXJmYWNlLmFmZmljaGVyID0gJG5vbSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbJG5vbSwgWyd1bmRlZmluZWQnLCAnc3RyaW5nJ10gXSB9ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2goZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGUuZXN0Rm9ybWVsbGUpIHRocm93IGU7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignSW50ZXJmYWNlLmFmZmljaGVyQCRub20gZG9pdCDDqnRyZSB1biBzdHJpbmcgb3UgdW5kZWZpbmVkJykubGllcihlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0eWJhc3RoaXMubmF2aWdhdGlvbi5wdXNoKCdpbnRlcmZhY2U6ICcgKyBpZCArICcgYWZmaWNoYWdlOiAnICsgJG5vbSk7XHJcblx0XHRcdGxldCBub20gPSAoISRub20pPyAnX2RlZmF1dCcgOiAkbm9tO1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbaW50ZXJmYWNlc1tpZF1bbm9tXSwgJ29iamVjdCddIH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaChlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmV3IEVycm9yKCdJbnRlcmZhY2UuYWZmaWNoZXJAJG5vbXsnICsgbm9tICsgJ30gblxcJ2V4aXN0ZSBwYXMgZGFuczogeycgKyBpZCArICd9JylcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHttb2RlbGUsIGNvbnN0cnVjdGV1ciwgaW5pdGlhbGlzw6ksIGluaXRpYWxpc2V1cn0gPSBpbnRlcmZhY2VzW2lkXVtub21dO1xyXG5cdFx0XHQvKiogU3VwcHJlc3Npb24gZGUgbCdhbmNpZW5uZSB2dWUgKiovXHJcblx0XHRcdGZvcihsZXQgZWxlbWVudCBvZiBlbEludGVyZmFjZS5zaGFkb3dSb290LmNoaWxkcmVuKSBlbGVtZW50LnJlbW92ZSgpO1xyXG5cdFx0XHQvKiogQWpvdXQgZGFucyBsZSBkb20gZGUgbGEgbm91dmVsbGUgdnVlICoqL1xyXG5cdFx0XHRlbEludGVyZmFjZS5zaGFkb3dSb290LmFwcGVuZENoaWxkKG1vZGVsZSk7XHJcblx0XHRcdGNvbnN0IHZ1ZUludGVyZmFjZSA9IGVsSW50ZXJmYWNlLnNoYWRvd1Jvb3QubGFzdENoaWxkO1xyXG5cdFx0XHRpZighaW5pdGlhbGlzw6kpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpbnRlcmZhY2VzW2lkXVtub21dLmluaXRpYWxpc2V1ciA9IGNvbnN0cnVjdGV1cihlbEludGVyZmFjZSwgdnVlSW50ZXJmYWNlKTtcclxuXHRcdFx0XHRpbnRlcmZhY2VzW2lkXVtub21dLmluaXRpYWxpc8OpID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKGluaXRpYWxpc2V1cikgaW5pdGlhbGlzZXVyKHZ1ZUludGVyZmFjZSk7XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHZ1ZUludGVyZmFjZTtcclxuXHRcdH07XHJcblx0XHRlbEludGVyZmFjZS5saXN0ZUludGVyZmFjZXMgPSAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCByID0gW107XHJcblx0XHRcdGZvcih2YXIgaWRJbnQgb2YgT2JqZWN0LmtleXMoaW50ZXJmYWNlcykgKSByLnB1c2goaW50ZXJmYWNlc1tpZEludF0gKTtcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9O1xyXG5cdFx0LyoqXHJcblx0XHRcdENPTlNUUlVDVEVVUlxyXG5cdFx0KiovXHRcclxuXHRcdGlmKCFpbnRlcmZhY2VzW2lkXSApIGludGVyZmFjZXNbaWRdID0ge307XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0Y29uc3QgdGVtcGxhdGUgPSBcclxuXHRgXHJcblx0XHQ8dGVtcGxhdGU+XHJcblx0XHQ8L3RlbXBsYXRlPlxyXG5cdGA7XHJcblx0bW9kdWxlLmV4cG9ydHMgPVxyXG5cdHtcclxuXHRcdG5vbVx0XHRcdFx0OiAnaW50ZXJmYWNlJ1xyXG5cdFx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHRcdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcblx0fTtcclxufVxyXG4iXX0=

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constructeur = function constructeur(elOnglet) {
	var elementMenu = elOnglet.parentElement;
	var type = null,
	    elementMenuOnglet = null;

	if (elementMenu.tagName !== 'YB-MENU') throw new Error('yb-onglet à l\'exterieur d\'un tag yb-menu');
	if (!elOnglet.hasAttribute('nom')) throw new Error('yb-onglet sans attribut nom');
	var nomOnglet = elOnglet.getAttribute('nom');

	if (!elOnglet.hasAttribute('type')) type = 'bouton';else type = elOnglet.getAttribute('type');

	switch (type) {
		case 'bouton':
			elementMenuOnglet = document.createElement('yb-bouton');
			elementMenuOnglet.changerLabel(elOnglet.getAttribute('nom'));
			elementMenuOnglet.style.position = 'relative';
			elementMenuOnglet.addEventListener('click', function () {
				elementMenuOnglet.style.borderBottomWidth = '0px';
				var evenementAffichage = new CustomEvent("affichage", {
					detail: {
						type: "bouton",
						cible: nomOnglet
					},
					bubbles: true,
					cancelable: true
				});
				elementMenu.dispatchEvent(evenementAffichage);
			}, false);
			elementMenuOnglet.addEventListener('mouseout', function () {
				return elementMenuOnglet.style.borderBottomWidth = '1px';
			}, false);
			elementMenuOnglet.shadowRoot.querySelector('input').style.boxShadow = 'none';
			break;
		case 'selection':
			elementMenuOnglet = document.createElement('yb-selection');
			elementMenuOnglet.setAttribute('nom', elOnglet.getAttribute('nom'));
			//console.log('elOnglet, ', elementMenuOnglet, elOnglet);
			break;
		default:
			throw new Error('yb-onglet avec attribut type incorrect : ' + type);
			break;
	}
	elementMenuOnglet.style.display = 'block';
	elementMenuOnglet.style.position = 'relative';
	elOnglet.dom = elementMenuOnglet;
	elementMenu.ajouterOnglet(elementMenuOnglet, false);
	return false;
};

var template = '\t\t\n\t<template></template>\n\n';
module.exports = {
	nom: 'onglet',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LW9uZ2xldC5qcyJdLCJuYW1lcyI6WyJjb25zdHJ1Y3RldXIiLCJlbE9uZ2xldCIsImVsZW1lbnRNZW51IiwicGFyZW50RWxlbWVudCIsInR5cGUiLCJlbGVtZW50TWVudU9uZ2xldCIsInRhZ05hbWUiLCJFcnJvciIsImhhc0F0dHJpYnV0ZSIsIm5vbU9uZ2xldCIsImdldEF0dHJpYnV0ZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNoYW5nZXJMYWJlbCIsInN0eWxlIiwicG9zaXRpb24iLCJhZGRFdmVudExpc3RlbmVyIiwiYm9yZGVyQm90dG9tV2lkdGgiLCJldmVuZW1lbnRBZmZpY2hhZ2UiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImNpYmxlIiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJkaXNwYXRjaEV2ZW50Iiwic2hhZG93Um9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJib3hTaGFkb3ciLCJzZXRBdHRyaWJ1dGUiLCJkaXNwbGF5IiwiZG9tIiwiYWpvdXRlck9uZ2xldCIsInRlbXBsYXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm5vbSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxlQUFlLFNBQWZBLFlBQWUsQ0FBU0MsUUFBVCxFQUNuQjtBQUNDLEtBQU1DLGNBQWNELFNBQVNFLGFBQTdCO0FBQ0EsS0FBSUMsT0FBTyxJQUFYO0FBQUEsS0FDQ0Msb0JBQW9CLElBRHJCOztBQUdBLEtBQUdILFlBQVlJLE9BQVosS0FBd0IsU0FBM0IsRUFBc0MsTUFBTSxJQUFJQyxLQUFKLENBQVUsNENBQVYsQ0FBTjtBQUN0QyxLQUFHLENBQUNOLFNBQVNPLFlBQVQsQ0FBc0IsS0FBdEIsQ0FBSixFQUFtQyxNQUFNLElBQUlELEtBQUosQ0FBVSw2QkFBVixDQUFOO0FBQ25DLEtBQU1FLFlBQVlSLFNBQVNTLFlBQVQsQ0FBc0IsS0FBdEIsQ0FBbEI7O0FBRUEsS0FBRyxDQUFDVCxTQUFTTyxZQUFULENBQXNCLE1BQXRCLENBQUosRUFBb0NKLE9BQU8sUUFBUCxDQUFwQyxLQUNLQSxPQUFPSCxTQUFTUyxZQUFULENBQXNCLE1BQXRCLENBQVA7O0FBRUwsU0FBT04sSUFBUDtBQUVDLE9BQUssUUFBTDtBQUNDQyx1QkFBb0JNLFNBQVNDLGFBQVQsQ0FBdUIsV0FBdkIsQ0FBcEI7QUFDQVAscUJBQWtCUSxZQUFsQixDQUErQlosU0FBU1MsWUFBVCxDQUFzQixLQUF0QixDQUEvQjtBQUNBTCxxQkFBa0JTLEtBQWxCLENBQXdCQyxRQUF4QixHQUFtQyxVQUFuQztBQUNBVixxQkFBa0JXLGdCQUFsQixDQUVDLE9BRkQsRUFHQyxZQUNBO0FBQ0NYLHNCQUFrQlMsS0FBbEIsQ0FBd0JHLGlCQUF4QixHQUE0QyxLQUE1QztBQUNBLFFBQU1DLHFCQUFxQixJQUFJQyxXQUFKLENBRTFCLFdBRjBCLEVBRzFCO0FBQ0NDLGFBQ0E7QUFDQ2hCLFlBQU0sUUFEUDtBQUVDaUIsYUFBT1o7QUFGUixNQUZEO0FBTUNhLGNBQVMsSUFOVjtBQU9DQyxpQkFBWTtBQVBiLEtBSDBCLENBQTNCO0FBYUFyQixnQkFBWXNCLGFBQVosQ0FBMEJOLGtCQUExQjtBQUNBLElBcEJGLEVBcUJDLEtBckJEO0FBdUJBYixxQkFBa0JXLGdCQUFsQixDQUFtQyxVQUFuQyxFQUErQztBQUFBLFdBQUtYLGtCQUFrQlMsS0FBbEIsQ0FBd0JHLGlCQUF4QixHQUE0QyxLQUFqRDtBQUFBLElBQS9DLEVBQXVHLEtBQXZHO0FBQ0FaLHFCQUFrQm9CLFVBQWxCLENBQTZCQyxhQUE3QixDQUEyQyxPQUEzQyxFQUFvRFosS0FBcEQsQ0FBMERhLFNBQTFELEdBQXNFLE1BQXRFO0FBQ0Q7QUFDQSxPQUFLLFdBQUw7QUFDQ3RCLHVCQUFvQk0sU0FBU0MsYUFBVCxDQUF1QixjQUF2QixDQUFwQjtBQUNBUCxxQkFBa0J1QixZQUFsQixDQUErQixLQUEvQixFQUFzQzNCLFNBQVNTLFlBQVQsQ0FBc0IsS0FBdEIsQ0FBdEM7QUFDQTtBQUNEO0FBQ0E7QUFDQyxTQUFNLElBQUlILEtBQUosQ0FBVSw4Q0FBOENILElBQXhELENBQU47QUFDRDtBQXZDRDtBQXlDQUMsbUJBQWtCUyxLQUFsQixDQUF3QmUsT0FBeEIsR0FBa0MsT0FBbEM7QUFDQXhCLG1CQUFrQlMsS0FBbEIsQ0FBd0JDLFFBQXhCLEdBQW1DLFVBQW5DO0FBQ0FkLFVBQVM2QixHQUFULEdBQWV6QixpQkFBZjtBQUNBSCxhQUFZNkIsYUFBWixDQUEwQjFCLGlCQUExQixFQUE2QyxLQUE3QztBQUNBLFFBQU8sS0FBUDtBQUNBLENBM0REOztBQTZEQSxJQUFJMkIsOENBQUo7QUFLQUMsT0FBT0MsT0FBUCxHQUNBO0FBQ0NDLE1BQVMsUUFEVjtBQUVFSCxXQUFZQSxRQUZkO0FBR0VoQyxlQUFlQTtBQUhqQixDQURBIiwiZmlsZSI6Im1lbnUtb25nbGV0LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxPbmdsZXQpXHJcbntcclxuXHRjb25zdCBlbGVtZW50TWVudSA9IGVsT25nbGV0LnBhcmVudEVsZW1lbnQ7XHJcblx0bGV0IHR5cGUgPSBudWxsLFxyXG5cdFx0ZWxlbWVudE1lbnVPbmdsZXQgPSBudWxsO1xyXG5cdFx0XHJcblx0aWYoZWxlbWVudE1lbnUudGFnTmFtZSAhPT0gJ1lCLU1FTlUnKSB0aHJvdyBuZXcgRXJyb3IoJ3liLW9uZ2xldCDDoCBsXFwnZXh0ZXJpZXVyIGRcXCd1biB0YWcgeWItbWVudScpO1xyXG5cdGlmKCFlbE9uZ2xldC5oYXNBdHRyaWJ1dGUoJ25vbScpICkgdGhyb3cgbmV3IEVycm9yKCd5Yi1vbmdsZXQgc2FucyBhdHRyaWJ1dCBub20nKTtcclxuXHRjb25zdCBub21PbmdsZXQgPSBlbE9uZ2xldC5nZXRBdHRyaWJ1dGUoJ25vbScpO1xyXG5cdFxyXG5cdGlmKCFlbE9uZ2xldC5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSApIHR5cGUgPSAnYm91dG9uJztcclxuXHRlbHNlIHR5cGUgPSBlbE9uZ2xldC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcclxuXHRcclxuXHRzd2l0Y2godHlwZSlcclxuXHR7XHJcblx0XHRjYXNlICdib3V0b24nOlxyXG5cdFx0XHRlbGVtZW50TWVudU9uZ2xldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3liLWJvdXRvbicpO1xyXG5cdFx0XHRlbGVtZW50TWVudU9uZ2xldC5jaGFuZ2VyTGFiZWwoZWxPbmdsZXQuZ2V0QXR0cmlidXRlKCdub20nKVx0KTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuc3R5bGUucG9zaXRpb25cdD0gJ3JlbGF0aXZlJztcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuYWRkRXZlbnRMaXN0ZW5lclxyXG5cdFx0XHQoXHJcblx0XHRcdFx0J2NsaWNrJyxcclxuXHRcdFx0XHQoKSA9PlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gJzBweCc7XHJcblx0XHRcdFx0XHRjb25zdCBldmVuZW1lbnRBZmZpY2hhZ2UgPSBuZXcgQ3VzdG9tRXZlbnRcclxuXHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0XCJhZmZpY2hhZ2VcIiwgXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRkZXRhaWw6XHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJib3V0b25cIixcclxuXHRcdFx0XHRcdFx0XHRcdGNpYmxlOiBub21PbmdsZXRcclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudE1lbnUuZGlzcGF0Y2hFdmVudChldmVuZW1lbnRBZmZpY2hhZ2UpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0ZmFsc2VcclxuXHRcdFx0KTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PmVsZW1lbnRNZW51T25nbGV0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gJzFweCcsIGZhbHNlKTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnN0eWxlLmJveFNoYWRvdyA9ICdub25lJztcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnc2VsZWN0aW9uJzpcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd5Yi1zZWxlY3Rpb24nKTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuc2V0QXR0cmlidXRlKCdub20nLCBlbE9uZ2xldC5nZXRBdHRyaWJ1dGUoJ25vbScpICk7XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2VsT25nbGV0LCAnLCBlbGVtZW50TWVudU9uZ2xldCwgZWxPbmdsZXQpO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ3liLW9uZ2xldCBhdmVjIGF0dHJpYnV0IHR5cGUgaW5jb3JyZWN0IDogJyArIHR5cGUpO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRlbE9uZ2xldC5kb20gPSBlbGVtZW50TWVudU9uZ2xldDtcclxuXHRlbGVtZW50TWVudS5ham91dGVyT25nbGV0KGVsZW1lbnRNZW51T25nbGV0LCBmYWxzZSk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID0gXHJcbmBcdFx0XHJcblx0PHRlbXBsYXRlPjwvdGVtcGxhdGU+XHJcblxyXG5gO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ29uZ2xldCdcclxuXHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07Il19

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Fonctionne en apparence, même si code invalide!
// Dû au fait que la logique est codé dans l'élément onglet.

var constructeur = function constructeur(elTab) {
	var conteneur = vueInterne.querySelector('#conteneur');
	elTab.style.display = 'inline-block';
	elTab.style.backgroundColor = 'grey';
	elTab.style.overflow = 'hidden';
	var cs = getComputedStyle,
	    elMenu = conteneur.querySelector('#menu');

	var elOnglet = elTab.querySelector('#onglet');
	elOnglet.style.setProperty('height', cs(elTab).height - cs(elMenu).height + 'px');
	return false;
};

var template = '\n\t<template>\n\t\t<div id=\'conteneur\'>\n\t\t\t<div id=\'menu\'></div>\n\t\t\t<div id=\'onglet\'></div>\n\t\t</div>\n\t\t\t<style>\n\t\t\t\t#conteneur\n\t\t\t\t{\n\t\t\t\t\toverflow\t\t: hidden\n\t\t\t\t;\tdisplay\t\t\t: flex\n\t\t\t\t;\tflex-direction\t: column\n\t\t\t\t;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t#menu\n\t\t\t\t{\n\t\t\t\t\tdisplay \t\t\t: flex\t\t\t!important\n\t\t\t\t\t;flex-direction\t\t: row \t\t\t!important\n\t\t\t\t\t;height\t\t\t\t: 35px\n\t\t\t\t\t;z-index\t\t\t: 500px\n\t\t\t\t\t;\n\t\t\t\t}\n\t\t\t\t#onglet\n\t\t\t\t{\n\t\t\t\t\t;overflow\t\t\t: hidden\n\t\t\t\t\t;position\t\t\t: relative\n\t\t\t\t\t;top\t\t\t\t: 10 px;\n\t\t\t\t\t;background-color\t: green\n\t\t\t\t\t;width\t\t\t\t: 100%\n\t\t\t\t\t;height\t\t\t\t: 100%\n\t\t\t\t\t;display\t\t\t:block\n\t\t\t\t\t;z-index\t\t\t: 400px\n\t\t\t\t\t;\n\t\t\t\t}\n\t\t</style>\n\t</template>\n';
module.exports = {
	nom: 'menu-tab',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LXRhYi5qcyJdLCJuYW1lcyI6WyJjb25zdHJ1Y3RldXIiLCJlbFRhYiIsImNvbnRlbmV1ciIsInZ1ZUludGVybmUiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJkaXNwbGF5IiwiYmFja2dyb3VuZENvbG9yIiwib3ZlcmZsb3ciLCJjcyIsImdldENvbXB1dGVkU3R5bGUiLCJlbE1lbnUiLCJlbE9uZ2xldCIsInNldFByb3BlcnR5IiwiaGVpZ2h0IiwidGVtcGxhdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9tIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUEsZUFBZSxTQUFmQSxZQUFlLENBQVNDLEtBQVQsRUFDbkI7QUFDQyxLQUFJQyxZQUFZQyxXQUFXQyxhQUFYLENBQXlCLFlBQXpCLENBQWhCO0FBQ0FILE9BQU1JLEtBQU4sQ0FBWUMsT0FBWixHQUF3QixjQUF4QjtBQUNBTCxPQUFNSSxLQUFOLENBQVlFLGVBQVosR0FBOEIsTUFBOUI7QUFDQU4sT0FBTUksS0FBTixDQUFZRyxRQUFaLEdBQXlCLFFBQXpCO0FBQ0EsS0FBTUMsS0FBS0MsZ0JBQVg7QUFBQSxLQUNHQyxTQUFTVCxVQUFVRSxhQUFWLENBQXdCLE9BQXhCLENBRFo7O0FBSUMsS0FBSVEsV0FBV1gsTUFBTUcsYUFBTixDQUFvQixTQUFwQixDQUFmO0FBQ0RRLFVBQVNQLEtBQVQsQ0FBZVEsV0FBZixDQUEyQixRQUEzQixFQUFxQ0osR0FBR1IsS0FBSCxFQUFVYSxNQUFWLEdBQW9CTCxHQUFHRSxNQUFILEVBQVdHLE1BQS9CLEdBQXlDLElBQTlFO0FBQ0EsUUFBTyxLQUFQO0FBQ0EsQ0FiRDs7QUFnQkEsSUFBSUMsazNCQUFKO0FBdUNBQyxPQUFPQyxPQUFQLEdBQ0E7QUFDQ0MsTUFBUyxVQURWO0FBRUVILFdBQVlBLFFBRmQ7QUFHRWYsZUFBZUE7QUFIakIsQ0FEQSIsImZpbGUiOiJtZW51LXRhYi5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG4vLyBGb25jdGlvbm5lIGVuIGFwcGFyZW5jZSwgbcOqbWUgc2kgY29kZSBpbnZhbGlkZSFcclxuLy8gRMO7IGF1IGZhaXQgcXVlIGxhIGxvZ2lxdWUgZXN0IGNvZMOpIGRhbnMgbCfDqWzDqW1lbnQgb25nbGV0LlxyXG52YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxUYWIpXHJcbntcclxuXHR2YXIgY29udGVuZXVyID0gdnVlSW50ZXJuZS5xdWVyeVNlbGVjdG9yKCcjY29udGVuZXVyJyk7XHRcclxuXHRlbFRhYi5zdHlsZS5kaXNwbGF5XHRcdFx0PSAnaW5saW5lLWJsb2NrJztcclxuXHRlbFRhYi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3JcdD0gJ2dyZXknO1xyXG5cdGVsVGFiLnN0eWxlLm92ZXJmbG93XHRcdFx0PSAnaGlkZGVuJztcclxuXHR2YXIgICBjc1x0PSBnZXRDb21wdXRlZFN0eWxlXHJcblx0XHQsIGVsTWVudVx0PSBjb250ZW5ldXIucXVlcnlTZWxlY3RvcignI21lbnUnKVxyXG5cdDtcclxuXHRcclxuIFx0dmFyIGVsT25nbGV0XHQ9IGVsVGFiLnF1ZXJ5U2VsZWN0b3IoJyNvbmdsZXQnKTtcclxuXHRlbE9uZ2xldC5zdHlsZS5zZXRQcm9wZXJ0eSgnaGVpZ2h0JywgY3MoZWxUYWIpLmhlaWdodCAtIChjcyhlbE1lbnUpLmhlaWdodCkgKyAncHgnKTtcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5cclxudmFyIHRlbXBsYXRlID0gXHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8ZGl2IGlkPSdjb250ZW5ldXInPlxyXG5cdFx0XHQ8ZGl2IGlkPSdtZW51Jz48L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nb25nbGV0Jz48L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0XHQ8c3R5bGU+XHJcblx0XHRcdFx0I2NvbnRlbmV1clxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG92ZXJmbG93XHRcdDogaGlkZGVuXHJcblx0XHRcdFx0O1x0ZGlzcGxheVx0XHRcdDogZmxleFxyXG5cdFx0XHRcdDtcdGZsZXgtZGlyZWN0aW9uXHQ6IGNvbHVtblxyXG5cdFx0XHRcdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0I21lbnVcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRkaXNwbGF5IFx0XHRcdDogZmxleFx0XHRcdCFpbXBvcnRhbnRcclxuXHRcdFx0XHRcdDtmbGV4LWRpcmVjdGlvblx0XHQ6IHJvdyBcdFx0XHQhaW1wb3J0YW50XHJcblx0XHRcdFx0XHQ7aGVpZ2h0XHRcdFx0XHQ6IDM1cHhcclxuXHRcdFx0XHRcdDt6LWluZGV4XHRcdFx0OiA1MDBweFxyXG5cdFx0XHRcdFx0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQjb25nbGV0XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0O292ZXJmbG93XHRcdFx0OiBoaWRkZW5cclxuXHRcdFx0XHRcdDtwb3NpdGlvblx0XHRcdDogcmVsYXRpdmVcclxuXHRcdFx0XHRcdDt0b3BcdFx0XHRcdDogMTAgcHg7XHJcblx0XHRcdFx0XHQ7YmFja2dyb3VuZC1jb2xvclx0OiBncmVlblxyXG5cdFx0XHRcdFx0O3dpZHRoXHRcdFx0XHQ6IDEwMCVcclxuXHRcdFx0XHRcdDtoZWlnaHRcdFx0XHRcdDogMTAwJVxyXG5cdFx0XHRcdFx0O2Rpc3BsYXlcdFx0XHQ6YmxvY2tcclxuXHRcdFx0XHRcdDt6LWluZGV4XHRcdFx0OiA0MDBweFxyXG5cdFx0XHRcdFx0O1xyXG5cdFx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0PC90ZW1wbGF0ZT5cclxuYDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdtZW51LXRhYidcclxuXHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07Il19

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constructeur = function constructeur(elMenu) {
	elMenu.style.top = '0px';
	elMenu.style.position = 'relative';

	var iRef = new ybasthis.typesDonnees.Reference();
	var index = [];
	var menu = elMenu.shadowRoot.querySelector('#menu');
	var xDisponnible = 0;
	var baseX = menu.getBoundingClientRect().x;
	elMenu.ajouterOnglet = function (domElement, avecLiaison) {
		//console.log('x dispo: ', xDisponnible);
		if (avecLiaison === undefined) avecLiaison = true;
		var ref = iRef.obtenir();
		index[ref] = domElement;

		domElement.style.flexGrow = 1;
		domElement.style.flexBasis = 0;
		//domElement.style.position = 'relative';

		menu.appendChild(domElement);
		var elementClientRect = domElement.getBoundingClientRect();
		xDisponnible += elementClientRect.width;
		//domElement.style.top = - ((iRef.taille('occupe') - 1) * elementClientRect.height) + 'px';
		//console.log(domElement.getBoundingClientRect());
		var pointeurElement = menu.lastChild;

		if (avecLiaison) {
			pointeurElement.addEventListener('click', function (e) {
				var evenementAffichage = new CustomEvent("affichage", { detail: { type: "utilisateur", cible: pointeurElement }, bubbles: true, cancelable: true });
				menu.dispatchEvent(evenementAffichage);
			});
		}

		return ref;
	};
	elMenu.SupprimerOnglet = function (ref) {
		iRef.supprimer(ref);
		var element = index[ref];
		menu.removeChild(element);
		return ref;
	};
	elMenu.onglets = index;

	return false;
};

var template = '\n\t<template>\n\t\t<div id=\'menu\'></div>\n\t\t<style>\n\t\t\t#menu\n\t\t\t{\n\t\t\t\tposition : relative;\n\t\t\t\twidth\t: auto;\n\t\t\t\tdisplay : flex;\n\t\t\t\ttop : 0px;\n\t\t\t}\n\t\t\t.menu-item\n\t\t\t{\n\t\t\t\t\n\t\t\t}\n\t\t</syle>\n\t</template>\n';
module.exports = {
	nom: 'menu',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LmpzIl0sIm5hbWVzIjpbImNvbnN0cnVjdGV1ciIsImVsTWVudSIsInN0eWxlIiwidG9wIiwicG9zaXRpb24iLCJpUmVmIiwieWJhc3RoaXMiLCJ0eXBlc0Rvbm5lZXMiLCJSZWZlcmVuY2UiLCJpbmRleCIsIm1lbnUiLCJzaGFkb3dSb290IiwicXVlcnlTZWxlY3RvciIsInhEaXNwb25uaWJsZSIsImJhc2VYIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsImFqb3V0ZXJPbmdsZXQiLCJkb21FbGVtZW50IiwiYXZlY0xpYWlzb24iLCJ1bmRlZmluZWQiLCJyZWYiLCJvYnRlbmlyIiwiZmxleEdyb3ciLCJmbGV4QmFzaXMiLCJhcHBlbmRDaGlsZCIsImVsZW1lbnRDbGllbnRSZWN0Iiwid2lkdGgiLCJwb2ludGV1ckVsZW1lbnQiLCJsYXN0Q2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbmVtZW50QWZmaWNoYWdlIiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJ0eXBlIiwiY2libGUiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRpc3BhdGNoRXZlbnQiLCJTdXBwcmltZXJPbmdsZXQiLCJzdXBwcmltZXIiLCJlbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJvbmdsZXRzIiwidGVtcGxhdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsU0FBZkEsWUFBZSxDQUFTQyxNQUFULEVBQ25CO0FBQ0NBLFFBQU9DLEtBQVAsQ0FBYUMsR0FBYixHQUFtQixLQUFuQjtBQUNBRixRQUFPQyxLQUFQLENBQWFFLFFBQWIsR0FBd0IsVUFBeEI7O0FBRUEsS0FBSUMsT0FBTyxJQUFJQyxTQUFTQyxZQUFULENBQXNCQyxTQUExQixFQUFYO0FBQ0EsS0FBTUMsUUFBUSxFQUFkO0FBQ0EsS0FBTUMsT0FBT1QsT0FBT1UsVUFBUCxDQUFrQkMsYUFBbEIsQ0FBZ0MsT0FBaEMsQ0FBYjtBQUNBLEtBQUlDLGVBQWUsQ0FBbkI7QUFDQSxLQUFJQyxRQUFRSixLQUFLSyxxQkFBTCxHQUE2QkMsQ0FBekM7QUFDQWYsUUFBT2dCLGFBQVAsR0FBdUIsVUFBQ0MsVUFBRCxFQUFhQyxXQUFiLEVBQ3ZCO0FBQ0M7QUFDQSxNQUFHQSxnQkFBZ0JDLFNBQW5CLEVBQThCRCxjQUFjLElBQWQ7QUFDOUIsTUFBSUUsTUFBTWhCLEtBQUtpQixPQUFMLEVBQVY7QUFDQWIsUUFBTVksR0FBTixJQUFhSCxVQUFiOztBQUVBQSxhQUFXaEIsS0FBWCxDQUFpQnFCLFFBQWpCLEdBQTRCLENBQTVCO0FBQ0FMLGFBQVdoQixLQUFYLENBQWlCc0IsU0FBakIsR0FBNkIsQ0FBN0I7QUFDQTs7QUFFQWQsT0FBS2UsV0FBTCxDQUFpQlAsVUFBakI7QUFDQSxNQUFJUSxvQkFBb0JSLFdBQVdILHFCQUFYLEVBQXhCO0FBQ0FGLGtCQUFnQmEsa0JBQWtCQyxLQUFsQztBQUNBO0FBQ0E7QUFDQSxNQUFNQyxrQkFBa0JsQixLQUFLbUIsU0FBN0I7O0FBRUEsTUFBR1YsV0FBSCxFQUNBO0FBQ0NTLG1CQUFnQkUsZ0JBQWhCLENBQWlDLE9BQWpDLEVBQTBDLGFBQzFDO0FBQ0MsUUFBTUMscUJBQXFCLElBQUlDLFdBQUosQ0FFMUIsV0FGMEIsRUFFYixFQUFDQyxRQUFPLEVBQUNDLE1BQU0sYUFBUCxFQUFzQkMsT0FBT1AsZUFBN0IsRUFBUixFQUF1RFEsU0FBUyxJQUFoRSxFQUFzRUMsWUFBWSxJQUFsRixFQUZhLENBQTNCO0FBSUEzQixTQUFLNEIsYUFBTCxDQUFtQlAsa0JBQW5CO0FBRUEsSUFSRDtBQVNBOztBQUVELFNBQU9WLEdBQVA7QUFDQSxFQWhDRDtBQWlDQXBCLFFBQU9zQyxlQUFQLEdBQXlCLGVBQ3pCO0FBQ0NsQyxPQUFLbUMsU0FBTCxDQUFlbkIsR0FBZjtBQUNBLE1BQUlvQixVQUFVaEMsTUFBTVksR0FBTixDQUFkO0FBQ0FYLE9BQUtnQyxXQUFMLENBQWlCRCxPQUFqQjtBQUNBLFNBQU9wQixHQUFQO0FBQ0EsRUFORDtBQU9BcEIsUUFBTzBDLE9BQVAsR0FBaUJsQyxLQUFqQjs7QUFFQSxRQUFPLEtBQVA7QUFDQSxDQXJERDs7QUF1REEsSUFBSW1DLG1SQUFKO0FBbUJBQyxPQUFPQyxPQUFQLEdBQ0E7QUFDQ0MsTUFBUyxNQURWO0FBRUNILFdBQVlBLFFBRmI7QUFHQzVDLGVBQWVBO0FBSGhCLENBREEiLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsTWVudSlcclxue1xyXG5cdGVsTWVudS5zdHlsZS50b3AgPSAnMHB4JztcclxuXHRlbE1lbnUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFxyXG5cdGxldCBpUmVmID0gbmV3IHliYXN0aGlzLnR5cGVzRG9ubmVlcy5SZWZlcmVuY2U7XHJcblx0Y29uc3QgaW5kZXggPSBbXTtcclxuXHRjb25zdCBtZW51ID0gZWxNZW51LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignI21lbnUnKTtcclxuXHRsZXQgeERpc3Bvbm5pYmxlID0gMDtcclxuXHRsZXQgYmFzZVggPSBtZW51LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLng7XHJcblx0ZWxNZW51LmFqb3V0ZXJPbmdsZXQgPSAoZG9tRWxlbWVudCwgYXZlY0xpYWlzb24pID0+XHJcblx0e1xyXG5cdFx0Ly9jb25zb2xlLmxvZygneCBkaXNwbzogJywgeERpc3Bvbm5pYmxlKTtcclxuXHRcdGlmKGF2ZWNMaWFpc29uID09PSB1bmRlZmluZWQpIGF2ZWNMaWFpc29uID0gdHJ1ZTtcclxuXHRcdGxldCByZWYgPSBpUmVmLm9idGVuaXIoKTtcclxuXHRcdGluZGV4W3JlZl0gPSBkb21FbGVtZW50O1xyXG5cdFx0XHJcblx0XHRkb21FbGVtZW50LnN0eWxlLmZsZXhHcm93ID0gMTtcclxuXHRcdGRvbUVsZW1lbnQuc3R5bGUuZmxleEJhc2lzID0gMDtcclxuXHRcdC8vZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHRcclxuXHRcdG1lbnUuYXBwZW5kQ2hpbGQoZG9tRWxlbWVudCk7XHJcblx0XHRsZXQgZWxlbWVudENsaWVudFJlY3QgPSBkb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0eERpc3Bvbm5pYmxlICs9IGVsZW1lbnRDbGllbnRSZWN0LndpZHRoO1xyXG5cdFx0Ly9kb21FbGVtZW50LnN0eWxlLnRvcCA9IC0gKChpUmVmLnRhaWxsZSgnb2NjdXBlJykgLSAxKSAqIGVsZW1lbnRDbGllbnRSZWN0LmhlaWdodCkgKyAncHgnO1xyXG5cdFx0Ly9jb25zb2xlLmxvZyhkb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcclxuXHRcdGNvbnN0IHBvaW50ZXVyRWxlbWVudCA9IG1lbnUubGFzdENoaWxkO1xyXG5cdFx0XHJcblx0XHRpZihhdmVjTGlhaXNvbilcclxuXHRcdHtcclxuXHRcdFx0cG9pbnRldXJFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y29uc3QgZXZlbmVtZW50QWZmaWNoYWdlID0gbmV3IEN1c3RvbUV2ZW50XHJcblx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0XCJhZmZpY2hhZ2VcIiwge2RldGFpbDp7dHlwZTogXCJ1dGlsaXNhdGV1clwiLCBjaWJsZTogcG9pbnRldXJFbGVtZW50fSxcdGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWV9XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHRtZW51LmRpc3BhdGNoRXZlbnQoZXZlbmVtZW50QWZmaWNoYWdlKTtcclxuXHRcdFx0XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJlZjtcclxuXHR9O1xyXG5cdGVsTWVudS5TdXBwcmltZXJPbmdsZXRcdD0gcmVmID0+XHJcblx0e1xyXG5cdFx0aVJlZi5zdXBwcmltZXIocmVmKTtcclxuXHRcdGxldCBlbGVtZW50ID0gaW5kZXhbcmVmXTtcclxuXHRcdG1lbnUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gcmVmO1xyXG5cdH07XHJcblx0ZWxNZW51Lm9uZ2xldHMgPSBpbmRleDtcclxuXHRcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG52YXIgdGVtcGxhdGUgPSBcclxuYFxyXG5cdDx0ZW1wbGF0ZT5cclxuXHRcdDxkaXYgaWQ9J21lbnUnPjwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHQjbWVudVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cG9zaXRpb24gOiByZWxhdGl2ZTtcclxuXHRcdFx0XHR3aWR0aFx0OiBhdXRvO1xyXG5cdFx0XHRcdGRpc3BsYXkgOiBmbGV4O1xyXG5cdFx0XHRcdHRvcCA6IDBweDtcclxuXHRcdFx0fVxyXG5cdFx0XHQubWVudS1pdGVtXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0PC9zeWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnbWVudScsXHJcblx0dGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZSxcclxuXHRjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07Il19

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constructeur = function constructeur(selectionDomExterne) {
	var iRef = new ybasthis.typesDonnees.Reference();
	var index = [];
	var dom = document.createElement('div');

	var selectionOuverte = false;
	dom.style.zIndex = '5000';
	dom.style.position = 'absolute';
	dom.style.height = '64px';
	dom.style.backgroundColor = ybasthis.charteUi.grisClair;
	dom.style.display = 'none';
	//dom.style.border = '1px solid black';
	ybasthis.dom.desktop.appendChild(dom);

	selectionDomExterne.choix = index;
	selectionDomExterne.SupprimerChoix = function (ref) {
		index[ref].remove();
		iRef.supprimer(ref);
		return ref;
	};
	selectionDomExterne.ajouterChoix = function (domElement) {
		var ref = iRef.obtenir();
		domElement.style.height = selectionDomExterne.getBoundingClientRect().height / 2 + 'px';
		domElement.style.position = 'relative';
		domElement.style.top = '0px';
		domElement.style.margin = '0px';

		domElement.addEventListener('mouseover', function () {
			return domElement.style.backgroundColor = ybasthis.charteUi.grisFonce;
		});
		domElement.addEventListener('mouseout', function () {
			return domElement.style.backgroundColor = ybasthis.charteUi.grisClair;
		});

		dom.appendChild(domElement);

		index[ref] = dom.lastChild;
		return ref;
	};

	selectionDomExterne.verrouiller(function (element) {
		selectionOuverte = true;
		composantDom.style.backgroundColor = ybasthis.charteUi.grisFonce;
		var infos = element.getBoundingClientRect();
		dom.style.display = 'block';
		dom.style.top = infos.top + infos.height + 'px';
		dom.style.left = infos.left + 'px';
		dom.style.width = infos.width + 'px';
		dom.style.height = infos.height / 2 * dom.children.length + 2 + 'px';
	}, function () {
		selectionOuverte = false;
		dom.style.display = 'none';
		composantDom.style.backgroundColor = ybasthis.charteUi.grisClair;
	});
	var selectionDomInterne = selectionDomExterne.shadowRoot;
	var composantDom = selectionDomInterne.querySelector('#composant');
	//composantDom.style.height = '44px';
	composantDom.style.minWidth = '4em';
	composantDom.addEventListener('mouseover', function () {
		composantDom.style.backgroundColor = ybasthis.charteUi.grisFonce;
	});
	composantDom.addEventListener('mouseout', function () {
		if (!selectionOuverte) composantDom.style.backgroundColor = ybasthis.charteUi.grisClair;
	});

	ybasthis.mutationSensor.newAsAttributes(selectionDomExterne, ['nom'], function () {
		var titreDom = composantDom.querySelector('#titre');
		titreDom.innerHTML = selectionDomExterne.getAttribute('nom');
		//titreDom.style.width = 'auto';
		ybasthis.mutationSensor.newAsStyleExpected(titreDom, {
			name: 'width',
			expected: 'auto',
			isEqual: false
		}, function () {
			var largeurRéelleTitre = ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(titreDom).width);
			var largeurRéelleSelection = ybasthis.utilitaires.grandeurs.enleverUnité(getComputedStyle(composantDom.querySelector('#marqueurSelection')).width);
			composantDom.style.width = titreDom.offsetWidth + largeurRéelleSelection + 5 + 'px';
			selectionDomExterne.style.width = composantDom.style.width;
		});
	});
	//console.log('ejar', selectionDomExterne, selectionDomExterne.getAttribute('nom'));

	var largeurOccupé = 0;
	var outilsEnleverPx = function outilsEnleverPx(taille) {
		return void (taille = taille.split(''), taille.pop(), taille.pop()) || Number(taille.join(''));
	};
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = composantDom.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var enfant = _step.value;

			//console.log(enfant, enfant.offsetWidth);
			largeurOccupé += enfant.offsetWidth;
		}

		//console.log(largeurOccupé);
		//composantDom.style.width = largeurOccupé + 'px';
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return false;
};
var template = '\n\t\t<template>\n\t\t\t<div id=\'composant\' >\n\t\t\t\t<div id=\'titre\' ></div>\n\t\t\t\t<div id=\'marqueurSelection\' >&#8744;</div>\n\t\t\t</div>\n\t\t\n\t\t\t<style>\n\t\t\t\t#composant\n\t\t\t\t{\n\t\t\t\t\tposition :\trelative;\n\t\t\t\t\tbackground-color : #b5b3b3;\n\t\t\t\t\ttop: 0px;\n\t\t\t\t\tdisplay: grid;\n\t\t\t\t\tgrid-template-columns: auto 1em;\n\t\t\t\t\tgrid-template-rows: 100%;\n\t\t\t\t\tgrid-template-areas: "titre type";\n\t\t\t\t\tbackground-clip\t:\t\tborder-box;\n\t\t\t\t\tborder-style\t:\t\t\toutset;\n\t\t\t\t\tborder-width\t:\t\t\t2px;\n\t\t\t\t\tborder-collapse\t:\t\tseparate;\n\t\t\t\t\tborder-spacing\t:\t\t0px 0px;\n\t\t\t\t\tborder-color\t:\t\t\trgb(227, 227, 227);\n\t\t\t\t\tbox-sizing\t:\t\t\t\tborder-box;\n\t\t\t\t\ttransform-box\t:\t\tborder-box;\n\t\t\t\t\twidth : auto;\n\t\t\t\t\tmin-height : 1.5em;\n\t\t\t\t}\n\t\t\t\t#titre\n\t\t\t\t{\n\t\t\t\t\tposition: relative;\n\t\t\t\t\ttop: 0px;\n\t\t\t\t\tgrid-area: titre;\n\t\t\t\t\toverflow: hidden;\n\t\t\t\t\ttext-align: center;\n\t\t\t\t\tmargin-left: 0.5em;\n\t\t\t\t\tmargin-right: 0.5em;\n\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\tfont-weight : 700;\n\t\t\t\t\theight : auto;\n\t\t\t\t}\n\t\t\t\t#marqueurSelection\n\t\t\t\t{\n\t\t\t\t\tposition: relative;\n\t\t\t\t\ttop: 0px;\n\t\t\t\t\tgrid-area: type;\n\t\t\t\t\tright : 0px;\n\t\t\t\t\ttext-align: center;\n\t\t\t\t\tpadding-top : calc(50%  - 0.7em);\n\t\t\t\t\tbackground-color : grey;\n\t\t\t\t\theight : auto;\n\t\t\t\t}\n\t\t\t</style>\n\t\t</template>';
module.exports = {
	nom: 'selection',
	template: template,
	constructeur: constructeur
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9zZWxlY3Rpb24uanMiXSwibmFtZXMiOlsiY29uc3RydWN0ZXVyIiwic2VsZWN0aW9uRG9tRXh0ZXJuZSIsImlSZWYiLCJ5YmFzdGhpcyIsInR5cGVzRG9ubmVlcyIsIlJlZmVyZW5jZSIsImluZGV4IiwiZG9tIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2VsZWN0aW9uT3V2ZXJ0ZSIsInN0eWxlIiwiekluZGV4IiwicG9zaXRpb24iLCJoZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjaGFydGVVaSIsImdyaXNDbGFpciIsImRpc3BsYXkiLCJkZXNrdG9wIiwiYXBwZW5kQ2hpbGQiLCJjaG9peCIsIlN1cHByaW1lckNob2l4IiwicmVmIiwicmVtb3ZlIiwic3VwcHJpbWVyIiwiYWpvdXRlckNob2l4IiwiZG9tRWxlbWVudCIsIm9idGVuaXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJtYXJnaW4iLCJhZGRFdmVudExpc3RlbmVyIiwiZ3Jpc0ZvbmNlIiwibGFzdENoaWxkIiwidmVycm91aWxsZXIiLCJlbGVtZW50IiwiY29tcG9zYW50RG9tIiwiaW5mb3MiLCJsZWZ0Iiwid2lkdGgiLCJjaGlsZHJlbiIsImxlbmd0aCIsInNlbGVjdGlvbkRvbUludGVybmUiLCJzaGFkb3dSb290IiwicXVlcnlTZWxlY3RvciIsIm1pbldpZHRoIiwibXV0YXRpb25TZW5zb3IiLCJuZXdBc0F0dHJpYnV0ZXMiLCJ0aXRyZURvbSIsImlubmVySFRNTCIsImdldEF0dHJpYnV0ZSIsIm5ld0FzU3R5bGVFeHBlY3RlZCIsIm5hbWUiLCJleHBlY3RlZCIsImlzRXF1YWwiLCJsYXJnZXVyUsOpZWxsZVRpdHJlIiwidXRpbGl0YWlyZXMiLCJncmFuZGV1cnMiLCJlbmxldmVyVW5pdMOpIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImxhcmdldXJSw6llbGxlU2VsZWN0aW9uIiwib2Zmc2V0V2lkdGgiLCJsYXJnZXVyT2NjdXDDqSIsIm91dGlsc0VubGV2ZXJQeCIsInRhaWxsZSIsInNwbGl0IiwicG9wIiwiTnVtYmVyIiwiam9pbiIsImVuZmFudCIsInRlbXBsYXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm5vbSJdLCJtYXBwaW5ncyI6IkFBQUM7O0FBQ0EsSUFBTUEsZUFBZSxTQUFmQSxZQUFlLENBQVNDLG1CQUFULEVBQ3JCO0FBQ0MsS0FBTUMsT0FBTyxJQUFJQyxTQUFTQyxZQUFULENBQXNCQyxTQUExQixFQUFiO0FBQ0EsS0FBTUMsUUFBUSxFQUFkO0FBQ0EsS0FBTUMsTUFBTUMsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFaOztBQUVBLEtBQUlDLG1CQUFtQixLQUF2QjtBQUNBSCxLQUFJSSxLQUFKLENBQVVDLE1BQVYsR0FBbUIsTUFBbkI7QUFDQUwsS0FBSUksS0FBSixDQUFVRSxRQUFWLEdBQXFCLFVBQXJCO0FBQ0FOLEtBQUlJLEtBQUosQ0FBVUcsTUFBVixHQUFtQixNQUFuQjtBQUNBUCxLQUFJSSxLQUFKLENBQVVJLGVBQVYsR0FBNEJaLFNBQVNhLFFBQVQsQ0FBa0JDLFNBQTlDO0FBQ0FWLEtBQUlJLEtBQUosQ0FBVU8sT0FBVixHQUFvQixNQUFwQjtBQUNBO0FBQ0FmLFVBQVNJLEdBQVQsQ0FBYVksT0FBYixDQUFxQkMsV0FBckIsQ0FBaUNiLEdBQWpDOztBQUVBTixxQkFBb0JvQixLQUFwQixHQUE0QmYsS0FBNUI7QUFDQUwscUJBQW9CcUIsY0FBcEIsR0FBcUMsZUFDckM7QUFDQ2hCLFFBQU1pQixHQUFOLEVBQVdDLE1BQVg7QUFDQXRCLE9BQUt1QixTQUFMLENBQWVGLEdBQWY7QUFDQSxTQUFPQSxHQUFQO0FBQ0EsRUFMRDtBQU1BdEIscUJBQW9CeUIsWUFBcEIsR0FBbUMsVUFBQ0MsVUFBRCxFQUNuQztBQUNDLE1BQU1KLE1BQU1yQixLQUFLMEIsT0FBTCxFQUFaO0FBQ0FELGFBQVdoQixLQUFYLENBQWlCRyxNQUFqQixHQUEyQmIsb0JBQW9CNEIscUJBQXBCLEdBQTRDZixNQUE1QyxHQUFxRCxDQUF0RCxHQUEyRCxJQUFyRjtBQUNBYSxhQUFXaEIsS0FBWCxDQUFpQkUsUUFBakIsR0FBNEIsVUFBNUI7QUFDQWMsYUFBV2hCLEtBQVgsQ0FBaUJtQixHQUFqQixHQUF1QixLQUF2QjtBQUNBSCxhQUFXaEIsS0FBWCxDQUFpQm9CLE1BQWpCLEdBQTBCLEtBQTFCOztBQUVBSixhQUFXSyxnQkFBWCxDQUE0QixXQUE1QixFQUF5QztBQUFBLFVBQU1MLFdBQVdoQixLQUFYLENBQWlCSSxlQUFqQixHQUFtQ1osU0FBU2EsUUFBVCxDQUFrQmlCLFNBQTNEO0FBQUEsR0FBekM7QUFDQU4sYUFBV0ssZ0JBQVgsQ0FBNEIsVUFBNUIsRUFBd0M7QUFBQSxVQUFNTCxXQUFXaEIsS0FBWCxDQUFpQkksZUFBakIsR0FBbUNaLFNBQVNhLFFBQVQsQ0FBa0JDLFNBQTNEO0FBQUEsR0FBeEM7O0FBRUFWLE1BQUlhLFdBQUosQ0FBZ0JPLFVBQWhCOztBQUVBckIsUUFBTWlCLEdBQU4sSUFBYWhCLElBQUkyQixTQUFqQjtBQUNBLFNBQU9YLEdBQVA7QUFDQSxFQWZEOztBQWlCQXRCLHFCQUFvQmtDLFdBQXBCLENBRUMsVUFBQ0MsT0FBRCxFQUNBO0FBQ0MxQixxQkFBbUIsSUFBbkI7QUFDQTJCLGVBQWExQixLQUFiLENBQW1CSSxlQUFuQixHQUFxQ1osU0FBU2EsUUFBVCxDQUFrQmlCLFNBQXZEO0FBQ0EsTUFBTUssUUFBUUYsUUFBUVAscUJBQVIsRUFBZDtBQUNBdEIsTUFBSUksS0FBSixDQUFVTyxPQUFWLEdBQW9CLE9BQXBCO0FBQ0FYLE1BQUlJLEtBQUosQ0FBVW1CLEdBQVYsR0FBaUJRLE1BQU1SLEdBQU4sR0FBWVEsTUFBTXhCLE1BQW5CLEdBQTZCLElBQTdDO0FBQ0FQLE1BQUlJLEtBQUosQ0FBVTRCLElBQVYsR0FBaUJELE1BQU1DLElBQU4sR0FBYSxJQUE5QjtBQUNBaEMsTUFBSUksS0FBSixDQUFVNkIsS0FBVixHQUFrQkYsTUFBTUUsS0FBTixHQUFjLElBQWhDO0FBQ0FqQyxNQUFJSSxLQUFKLENBQVVHLE1BQVYsR0FBcUJ3QixNQUFNeEIsTUFBTixHQUFlLENBQWhCLEdBQXFCUCxJQUFJa0MsUUFBSixDQUFhQyxNQUFuQyxHQUE2QyxDQUE3QyxHQUFpRCxJQUFwRTtBQUNBLEVBWkYsRUFhQyxZQUNBO0FBQ0NoQyxxQkFBbUIsS0FBbkI7QUFDQUgsTUFBSUksS0FBSixDQUFVTyxPQUFWLEdBQW9CLE1BQXBCO0FBQ0FtQixlQUFhMUIsS0FBYixDQUFtQkksZUFBbkIsR0FBcUNaLFNBQVNhLFFBQVQsQ0FBa0JDLFNBQXZEO0FBQ0EsRUFsQkY7QUFvQkEsS0FBTTBCLHNCQUFzQjFDLG9CQUFvQjJDLFVBQWhEO0FBQ0EsS0FBTVAsZUFBZU0sb0JBQW9CRSxhQUFwQixDQUFrQyxZQUFsQyxDQUFyQjtBQUNBO0FBQ0FSLGNBQWExQixLQUFiLENBQW1CbUMsUUFBbkIsR0FBOEIsS0FBOUI7QUFDQVQsY0FBYUwsZ0JBQWIsQ0FBOEIsV0FBOUIsRUFBMkMsWUFDM0M7QUFDQ0ssZUFBYTFCLEtBQWIsQ0FBbUJJLGVBQW5CLEdBQXFDWixTQUFTYSxRQUFULENBQWtCaUIsU0FBdkQ7QUFDQSxFQUhEO0FBSUFJLGNBQWFMLGdCQUFiLENBQThCLFVBQTlCLEVBQTBDLFlBQzFDO0FBQ0MsTUFBRyxDQUFDdEIsZ0JBQUosRUFBc0IyQixhQUFhMUIsS0FBYixDQUFtQkksZUFBbkIsR0FBcUNaLFNBQVNhLFFBQVQsQ0FBa0JDLFNBQXZEO0FBRXRCLEVBSkQ7O0FBTUFkLFVBQVM0QyxjQUFULENBQXdCQyxlQUF4QixDQUF3Qy9DLG1CQUF4QyxFQUE2RCxDQUFDLEtBQUQsQ0FBN0QsRUFBc0UsWUFDdEU7QUFDQyxNQUFJZ0QsV0FBV1osYUFBYVEsYUFBYixDQUEyQixRQUEzQixDQUFmO0FBQ0FJLFdBQVNDLFNBQVQsR0FBcUJqRCxvQkFBb0JrRCxZQUFwQixDQUFpQyxLQUFqQyxDQUFyQjtBQUNBO0FBQ0FoRCxXQUFTNEMsY0FBVCxDQUF3Qkssa0JBQXhCLENBRUNILFFBRkQsRUFHQztBQUNDSSxTQUFRLE9BRFQ7QUFFQ0MsYUFBVSxNQUZYO0FBR0NDLFlBQVM7QUFIVixHQUhELEVBUUMsWUFDQTtBQUNDLE9BQUlDLHFCQUFxQnJELFNBQVNzRCxXQUFULENBQXFCQyxTQUFyQixDQUErQkMsWUFBL0IsQ0FBNENDLGlCQUFpQlgsUUFBakIsRUFBMkJULEtBQXZFLENBQXpCO0FBQ0EsT0FBSXFCLHlCQUF5QjFELFNBQVNzRCxXQUFULENBQXFCQyxTQUFyQixDQUErQkMsWUFBL0IsQ0FBNENDLGlCQUFpQnZCLGFBQWFRLGFBQWIsQ0FBMkIsb0JBQTNCLENBQWpCLEVBQW9FTCxLQUFoSCxDQUE3QjtBQUNBSCxnQkFBYTFCLEtBQWIsQ0FBbUI2QixLQUFuQixHQUEyQlMsU0FBU2EsV0FBVCxHQUF1QkQsc0JBQXZCLEdBQWdELENBQWhELEdBQW9ELElBQS9FO0FBQ0E1RCx1QkFBb0JVLEtBQXBCLENBQTBCNkIsS0FBMUIsR0FBa0NILGFBQWExQixLQUFiLENBQW1CNkIsS0FBckQ7QUFDQSxHQWRGO0FBZ0JBLEVBckJEO0FBc0JBOztBQUVBLEtBQUl1QixnQkFBZ0IsQ0FBcEI7QUFDQSxLQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsU0FBVSxNQUFLQyxTQUFTQSxPQUFPQyxLQUFQLENBQWEsRUFBYixDQUFULEVBQTJCRCxPQUFPRSxHQUFQLEVBQTNCLEVBQXlDRixPQUFPRSxHQUFQLEVBQTlDLEtBQWdFQyxPQUFPSCxPQUFPSSxJQUFQLENBQVksRUFBWixDQUFQLENBQTFFO0FBQUEsRUFBeEI7QUFqR0Q7QUFBQTtBQUFBOztBQUFBO0FBa0dDLHVCQUFrQmhDLGFBQWFJLFFBQS9CLDhIQUNBO0FBQUEsT0FEUTZCLE1BQ1I7O0FBQ0M7QUFDQVAsb0JBQWlCTyxPQUFPUixXQUF4QjtBQUNBOztBQUVEO0FBQ0E7QUF6R0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUEyR0MsUUFBTyxLQUFQO0FBQ0EsQ0E3R0Q7QUE4R0EsSUFBTVMsdy9DQUFOO0FBdUREQyxPQUFPQyxPQUFQLEdBQ0E7QUFDQ0MsTUFBUyxXQURWO0FBRUNILFdBQVlBLFFBRmI7QUFHQ3ZFLGVBQWVBO0FBSGhCLENBREEiLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJcdCd1c2Ugc3RyaWN0JztcclxuXHRjb25zdCBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihzZWxlY3Rpb25Eb21FeHRlcm5lKVxyXG5cdHtcclxuXHRcdGNvbnN0IGlSZWYgPSBuZXcgeWJhc3RoaXMudHlwZXNEb25uZWVzLlJlZmVyZW5jZTtcclxuXHRcdGNvbnN0IGluZGV4ID0gW107XHJcblx0XHRjb25zdCBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFxyXG5cdFx0bGV0IHNlbGVjdGlvbk91dmVydGUgPSBmYWxzZTtcclxuXHRcdGRvbS5zdHlsZS56SW5kZXggPSAnNTAwMCc7XHJcblx0XHRkb20uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0ZG9tLnN0eWxlLmhlaWdodCA9ICc2NHB4JztcclxuXHRcdGRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0XHRkb20uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdC8vZG9tLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgYmxhY2snO1xyXG5cdFx0eWJhc3RoaXMuZG9tLmRlc2t0b3AuYXBwZW5kQ2hpbGQoZG9tKTtcclxuXHRcdFxyXG5cdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS5jaG9peCA9IGluZGV4O1xyXG5cdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS5TdXBwcmltZXJDaG9peFx0PSByZWYgPT5cclxuXHRcdHtcclxuXHRcdFx0aW5kZXhbcmVmXS5yZW1vdmUoKTtcclxuXHRcdFx0aVJlZi5zdXBwcmltZXIocmVmKTtcclxuXHRcdFx0cmV0dXJuIHJlZjtcclxuXHRcdH07XHJcblx0XHRzZWxlY3Rpb25Eb21FeHRlcm5lLmFqb3V0ZXJDaG9peCA9IChkb21FbGVtZW50KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCByZWYgPSBpUmVmLm9idGVuaXIoKTtcclxuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAoc2VsZWN0aW9uRG9tRXh0ZXJuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyKSArICdweCc7XHJcblx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG5cdFx0XHRcclxuXHRcdFx0ZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PiBkb21FbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNGb25jZSk7XHJcblx0XHRcdGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiBkb21FbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcik7XHJcblx0XHJcblx0XHRcdGRvbS5hcHBlbmRDaGlsZChkb21FbGVtZW50KTtcclxuXHRcdFx0XHJcblx0XHRcdGluZGV4W3JlZl0gPSBkb20ubGFzdENoaWxkO1xyXG5cdFx0XHRyZXR1cm4gcmVmO1xyXG5cdFx0fTtcclxuXHRcclxuXHRcdHNlbGVjdGlvbkRvbUV4dGVybmUudmVycm91aWxsZXJcclxuXHRcdChcclxuXHRcdFx0KGVsZW1lbnQpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxlY3Rpb25PdXZlcnRlID0gdHJ1ZTtcclxuXHRcdFx0XHRjb21wb3NhbnREb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlO1xyXG5cdFx0XHRcdGNvbnN0IGluZm9zID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0XHRkb20uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLnRvcCA9IChpbmZvcy50b3AgKyBpbmZvcy5oZWlnaHQpICsgJ3B4JztcclxuXHRcdFx0XHRkb20uc3R5bGUubGVmdCA9IGluZm9zLmxlZnQgKyAncHgnO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS53aWR0aCA9IGluZm9zLndpZHRoICsgJ3B4JztcclxuXHRcdFx0XHRkb20uc3R5bGUuaGVpZ2h0ID0gKChpbmZvcy5oZWlnaHQgLyAyKSAqIGRvbS5jaGlsZHJlbi5sZW5ndGgpICsgMiArICdweCc7XHJcblx0XHRcdH0sXHJcblx0XHRcdCgpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxlY3Rpb25PdXZlcnRlID0gZmFsc2U7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdFx0Y29tcG9zYW50RG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHRcdGNvbnN0IHNlbGVjdGlvbkRvbUludGVybmUgPSBzZWxlY3Rpb25Eb21FeHRlcm5lLnNoYWRvd1Jvb3Q7XHJcblx0XHRjb25zdCBjb21wb3NhbnREb20gPSBzZWxlY3Rpb25Eb21JbnRlcm5lLnF1ZXJ5U2VsZWN0b3IoJyNjb21wb3NhbnQnKTtcclxuXHRcdC8vY29tcG9zYW50RG9tLnN0eWxlLmhlaWdodCA9ICc0NHB4JztcclxuXHRcdGNvbXBvc2FudERvbS5zdHlsZS5taW5XaWR0aCA9ICc0ZW0nO1xyXG5cdFx0Y29tcG9zYW50RG9tLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbXBvc2FudERvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzRm9uY2U7XHJcblx0XHR9ICk7XHJcblx0XHRjb21wb3NhbnREb20uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZighc2VsZWN0aW9uT3V2ZXJ0ZSkgY29tcG9zYW50RG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdFx0XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHRcdHliYXN0aGlzLm11dGF0aW9uU2Vuc29yLm5ld0FzQXR0cmlidXRlcyhzZWxlY3Rpb25Eb21FeHRlcm5lLCBbJ25vbSddLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgdGl0cmVEb20gPSBjb21wb3NhbnREb20ucXVlcnlTZWxlY3RvcignI3RpdHJlJyk7IFxyXG5cdFx0XHR0aXRyZURvbS5pbm5lckhUTUwgPSBzZWxlY3Rpb25Eb21FeHRlcm5lLmdldEF0dHJpYnV0ZSgnbm9tJyk7XHJcblx0XHRcdC8vdGl0cmVEb20uc3R5bGUud2lkdGggPSAnYXV0byc7XHJcblx0XHRcdHliYXN0aGlzLm11dGF0aW9uU2Vuc29yLm5ld0FzU3R5bGVFeHBlY3RlZFxyXG5cdFx0XHQoXHJcblx0XHRcdFx0dGl0cmVEb20sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bmFtZTpcdFx0XHQnd2lkdGgnLFxyXG5cdFx0XHRcdFx0ZXhwZWN0ZWQ6XHQnYXV0bycsXHJcblx0XHRcdFx0XHRpc0VxdWFsOlx0ZmFsc2VcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCgpID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGV0IGxhcmdldXJSw6llbGxlVGl0cmUgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKHRpdHJlRG9tKS53aWR0aCk7XHJcblx0XHRcdFx0XHRsZXQgbGFyZ2V1clLDqWVsbGVTZWxlY3Rpb24gPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKGNvbXBvc2FudERvbS5xdWVyeVNlbGVjdG9yKCcjbWFycXVldXJTZWxlY3Rpb24nKSApLndpZHRoKTtcclxuXHRcdFx0XHRcdGNvbXBvc2FudERvbS5zdHlsZS53aWR0aCA9IHRpdHJlRG9tLm9mZnNldFdpZHRoICsgbGFyZ2V1clLDqWVsbGVTZWxlY3Rpb24gKyA1ICsgJ3B4JztcclxuXHRcdFx0XHRcdHNlbGVjdGlvbkRvbUV4dGVybmUuc3R5bGUud2lkdGggPSBjb21wb3NhbnREb20uc3R5bGUud2lkdGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0fSk7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdlamFyJywgc2VsZWN0aW9uRG9tRXh0ZXJuZSwgc2VsZWN0aW9uRG9tRXh0ZXJuZS5nZXRBdHRyaWJ1dGUoJ25vbScpKTtcclxuXHRcdFxyXG5cdFx0bGV0IGxhcmdldXJPY2N1cMOpID0gMDtcclxuXHRcdGNvbnN0IG91dGlsc0VubGV2ZXJQeCA9IHRhaWxsZSA9PiB2b2lkKHRhaWxsZSA9IHRhaWxsZS5zcGxpdCgnJyksIHRhaWxsZS5wb3AoKSwgdGFpbGxlLnBvcCgpICkgfHwgTnVtYmVyKHRhaWxsZS5qb2luKCcnKSApO1xyXG5cdFx0Zm9yKGxldCBlbmZhbnQgb2YgY29tcG9zYW50RG9tLmNoaWxkcmVuKVxyXG5cdFx0e1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVuZmFudCwgZW5mYW50Lm9mZnNldFdpZHRoKTtcclxuXHRcdFx0bGFyZ2V1ck9jY3Vww6kgKz0gZW5mYW50Lm9mZnNldFdpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vY29uc29sZS5sb2cobGFyZ2V1ck9jY3Vww6kpO1xyXG5cdFx0Ly9jb21wb3NhbnREb20uc3R5bGUud2lkdGggPSBsYXJnZXVyT2NjdXDDqSArICdweCc7XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cdGNvbnN0IHRlbXBsYXRlID1cclxuXHRgXHJcblx0XHQ8dGVtcGxhdGU+XHJcblx0XHRcdDxkaXYgaWQ9J2NvbXBvc2FudCcgPlxyXG5cdFx0XHRcdDxkaXYgaWQ9J3RpdHJlJyA+PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBpZD0nbWFycXVldXJTZWxlY3Rpb24nID4mIzg3NDQ7PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHJcblx0XHRcdDxzdHlsZT5cclxuXHRcdFx0XHQjY29tcG9zYW50XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gOlx0cmVsYXRpdmU7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yIDogI2I1YjNiMztcclxuXHRcdFx0XHRcdHRvcDogMHB4O1xyXG5cdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byAxZW07XHJcblx0XHRcdFx0XHRncmlkLXRlbXBsYXRlLXJvd3M6IDEwMCU7XHJcblx0XHRcdFx0XHRncmlkLXRlbXBsYXRlLWFyZWFzOiBcInRpdHJlIHR5cGVcIjtcclxuXHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcFx0Olx0XHRib3JkZXItYm94O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLXN0eWxlXHQ6XHRcdFx0b3V0c2V0O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLXdpZHRoXHQ6XHRcdFx0MnB4O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLWNvbGxhcHNlXHQ6XHRcdHNlcGFyYXRlO1xyXG5cdFx0XHRcdFx0Ym9yZGVyLXNwYWNpbmdcdDpcdFx0MHB4IDBweDtcclxuXHRcdFx0XHRcdGJvcmRlci1jb2xvclx0Olx0XHRcdHJnYigyMjcsIDIyNywgMjI3KTtcclxuXHRcdFx0XHRcdGJveC1zaXppbmdcdDpcdFx0XHRcdGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHR0cmFuc2Zvcm0tYm94XHQ6XHRcdGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHR3aWR0aCA6IGF1dG87XHJcblx0XHRcdFx0XHRtaW4taGVpZ2h0IDogMS41ZW07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCN0aXRyZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHRcdFx0XHRcdHRvcDogMHB4O1xyXG5cdFx0XHRcdFx0Z3JpZC1hcmVhOiB0aXRyZTtcclxuXHRcdFx0XHRcdG92ZXJmbG93OiBoaWRkZW47XHJcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRtYXJnaW4tbGVmdDogMC41ZW07XHJcblx0XHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuNWVtO1xyXG5cdFx0XHRcdFx0d2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHRcdFx0XHRcdGZvbnQtd2VpZ2h0IDogNzAwO1xyXG5cdFx0XHRcdFx0aGVpZ2h0IDogYXV0bztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0I21hcnF1ZXVyU2VsZWN0aW9uXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0dG9wOiAwcHg7XHJcblx0XHRcdFx0XHRncmlkLWFyZWE6IHR5cGU7XHJcblx0XHRcdFx0XHRyaWdodCA6IDBweDtcclxuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRcdFx0XHRcdHBhZGRpbmctdG9wIDogY2FsYyg1MCUgIC0gMC43ZW0pO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvciA6IGdyZXk7XHJcblx0XHRcdFx0XHRoZWlnaHQgOiBhdXRvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0PC9zdHlsZT5cclxuXHRcdDwvdGVtcGxhdGU+YDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdzZWxlY3Rpb24nLFxyXG5cdHRlbXBsYXRlXHRcdDogdGVtcGxhdGUsXHJcblx0Y29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59OyJdfQ==

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(0);

var _contrat = __webpack_require__(1);

var _contrat2 = _interopRequireDefault(_contrat);

var _sondeMutation = __webpack_require__(2);

var _sondeMutation2 = _interopRequireDefault(_sondeMutation);

var _typesDonnees = __webpack_require__(3);

var _typesDonnees2 = _interopRequireDefault(_typesDonnees);

var _utilitaires = __webpack_require__(4);

var _utilitaires2 = _interopRequireDefault(_utilitaires);

var _elementsPersonalisS = __webpack_require__(5);

var _elementsPersonalisS2 = _interopRequireDefault(_elementsPersonalisS);

var _guiIndex = __webpack_require__(6);

var _guiIndex2 = _interopRequireDefault(_guiIndex);

var _listeElements = __webpack_require__(7);

var _listeElements2 = _interopRequireDefault(_listeElements);

var _principale = __webpack_require__(8);

var _principale2 = _interopRequireDefault(_principale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
	var ybasthis = window.ybasthis = {
		contrat: _contrat2.default,
		mutationSensor: _sondeMutation2.default,
		typesDonnees: _typesDonnees2.default,
		utilitaires: new _utilitaires2.default(),
		fabriqueElement: _elementsPersonalisS2.default,
		charteUi: {
			fond: 'grey',
			grisClair: '#b5b3b3',
			grisFonce: '#989898',
			vert: '#22780F',
			rouge: '#DB1702'
		},
		navigation: []
	};

	var demareur = function demareur(conf) {
		var FabriqueYbasthis = ybasthis.fabriqueElement(conf.ns);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _listeElements2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var element = _step.value;

				new FabriqueYbasthis(element);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		(0, _guiIndex2.default)();
		(0, _principale2.default)();
	};
	{
		var _onLoaded = function onLoaded() {
			window.removeEventListener('load', _onLoaded);
			_onLoaded = undefined;
			demareur({
				ns: 'yb'
			});
		};
		window.addEventListener('load', _onLoaded);
	}
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkveWJhc3RoaXMuanMiXSwibmFtZXMiOlsieWJhc3RoaXMiLCJ3aW5kb3ciLCJjb250cmF0IiwibXV0YXRpb25TZW5zb3IiLCJ0eXBlc0Rvbm5lZXMiLCJ1dGlsaXRhaXJlcyIsImZhYnJpcXVlRWxlbWVudCIsImNoYXJ0ZVVpIiwiZm9uZCIsImdyaXNDbGFpciIsImdyaXNGb25jZSIsInZlcnQiLCJyb3VnZSIsIm5hdmlnYXRpb24iLCJkZW1hcmV1ciIsImNvbmYiLCJGYWJyaXF1ZVliYXN0aGlzIiwibnMiLCJlbGVtZW50Iiwib25Mb2FkZWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidW5kZWZpbmVkIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsQ0FBQyxZQUNEO0FBQ0ksS0FBTUEsV0FBV0MsT0FBT0QsUUFBUCxHQUNwQjtBQUNDRSw0QkFERDtBQUVDQyx5Q0FGRDtBQUdDQyxzQ0FIRDtBQUlDQyxlQUFjLDJCQUpmO0FBS0NDLGdEQUxEO0FBTUNDLFlBQ0E7QUFDQ0MsU0FBUSxNQURUO0FBRUdDLGNBQVcsU0FGZDtBQUdHQyxjQUFXLFNBSGQ7QUFJR0MsU0FBTyxTQUpWO0FBS0NDLFVBQVE7QUFMVCxHQVBEO0FBY0NDLGNBQWE7QUFkZCxFQURHOztBQWtCSCxLQUFNQyxXQUFXLFNBQVhBLFFBQVcsQ0FBQ0MsSUFBRCxFQUNqQjtBQUNDLE1BQU1DLG1CQUFtQmhCLFNBQVNNLGVBQVQsQ0FBeUJTLEtBQUtFLEVBQTlCLENBQXpCO0FBREQ7QUFBQTtBQUFBOztBQUFBO0FBRUM7QUFBQSxRQUFRQyxPQUFSOztBQUNDLFFBQUlGLGdCQUFKLENBQXFCRSxPQUFyQjtBQUREO0FBRkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFJQztBQUNBO0FBQ0EsRUFQRDtBQVFBO0FBQ0MsTUFBSUMsWUFBVyxvQkFDZjtBQUNDbEIsVUFBT21CLG1CQUFQLENBQTJCLE1BQTNCLEVBQW1DRCxTQUFuQztBQUNBQSxlQUFXRSxTQUFYO0FBQ0FQLFlBQ0M7QUFDQUcsUUFBSztBQURMLElBREQ7QUFJQSxHQVJEO0FBU0FoQixTQUFPcUIsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0NILFNBQWhDO0FBQ0E7QUFDRCxDQXhDRCIsImZpbGUiOiJ5YmFzdGhpcy5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4vMC9zdXJjb3VjaGVOYXRpZnMuanMnO1xyXG5pbXBvcnQgY29udHJhdCBmcm9tICcuLzEvY29udHJhdC5qcyc7XHJcbmltcG9ydCBtdXRhdGlvblNlbnNvciBmcm9tICcuLzEvc29uZGVNdXRhdGlvbi5qcyc7XHJcbmltcG9ydCB0eXBlc0Rvbm5lZXMgZnJvbSAnLi8yL3R5cGVzRG9ubmVlcy5qcyc7XHJcbmltcG9ydCB1dGlsaXRhaXJlcyBmcm9tICcuLzIvdXRpbGl0YWlyZXMuanMnO1xyXG5pbXBvcnQgZmFicmlxdWVFbGVtZW50IGZyb20gJy4vMy9lbGVtZW50c1BlcnNvbmFsaXPDqXMuanMnO1xyXG5pbXBvcnQgZ3VpIGZyb20gJy4vNC9ndWkvZ3VpSW5kZXguanMnO1xyXG5pbXBvcnQgbGlzdGVFbGVtZW50cyBmcm9tICcuLzUvbGlzdGVFbGVtZW50cy5qcyc7XHJcbmltcG9ydCBmblVpUHJpbmNpcGFsZSBmcm9tICcuLi91aS9wcmluY2lwYWxlLmpzJztcclxuXHJcbigoKSA9PlxyXG57XHJcbiAgICBjb25zdCB5YmFzdGhpcyA9IHdpbmRvdy55YmFzdGhpcyA9XHJcblx0e1xyXG5cdFx0Y29udHJhdCxcclxuXHRcdG11dGF0aW9uU2Vuc29yLFxyXG5cdFx0dHlwZXNEb25uZWVzLFxyXG5cdFx0dXRpbGl0YWlyZXMgOiBuZXcgdXRpbGl0YWlyZXMoKSxcclxuXHRcdGZhYnJpcXVlRWxlbWVudCxcclxuXHRcdGNoYXJ0ZVVpIDpcclxuXHRcdHtcclxuXHRcdFx0Zm9uZDogXHRcdCdncmV5JyxcclxuXHQgIFx0XHRncmlzQ2xhaXI6XHQnI2I1YjNiMycsXHJcblx0ICBcdFx0Z3Jpc0ZvbmNlOlx0JyM5ODk4OTgnLFxyXG5cdCAgXHRcdHZlcnQ6XHRcdCcjMjI3ODBGJyxcclxuXHRcdFx0cm91Z2U6XHRcdCcjREIxNzAyJ1xyXG5cdFx0fSxcclxuXHRcdG5hdmlnYXRpb24gOiBbXVxyXG5cdH07XHJcblxyXG5cdGNvbnN0IGRlbWFyZXVyID0gKGNvbmYpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgRmFicmlxdWVZYmFzdGhpcyA9IHliYXN0aGlzLmZhYnJpcXVlRWxlbWVudChjb25mLm5zKTtcclxuXHRcdGZvcihsZXQgZWxlbWVudCBvZiBsaXN0ZUVsZW1lbnRzKVxyXG5cdFx0XHRuZXcgRmFicmlxdWVZYmFzdGhpcyhlbGVtZW50KTtcclxuXHRcdGd1aSgpO1xyXG5cdFx0Zm5VaVByaW5jaXBhbGUoKTtcclxuXHR9O1xyXG5cdHtcclxuXHRcdGxldCBvbkxvYWRlZCA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkZWQpO1xyXG5cdFx0XHRvbkxvYWRlZCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0ZGVtYXJldXJcclxuXHRcdFx0KHtcclxuXHRcdFx0XHRucyA6ICd5YidcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWRlZCk7XHJcblx0fVxyXG59ICkoKTtcclxuIl19

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	nom: 'administration',
	modele: '\n\t\t<div>Administration: En cours de dev</div>\n\t',
	constructeur: function constructeur(interfaceMère, el) {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9hZG1pbmlzdHJhdGlvbi9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibm9tIiwibW9kZWxlIiwiY29uc3RydWN0ZXVyIiwiaW50ZXJmYWNlTcOocmUiLCJlbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxHQUNBO0FBQ0NDLE1BQU0sZ0JBRFA7QUFFQ0MsK0RBRkQ7QUFNQ0MsZUFBZSxzQkFBQ0MsYUFBRCxFQUFnQkMsRUFBaEIsRUFDZixDQUNDO0FBUkYsQ0FEQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ2FkbWluaXN0cmF0aW9uJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXY+QWRtaW5pc3RyYXRpb246IEVuIGNvdXJzIGRlIGRldjwvZGl2PlxyXG5cdGAsXHJcblx0Y29uc3RydWN0ZXVyIDogKGludGVyZmFjZU3DqHJlLCBlbCkgPT5cclxuXHR7XHJcblx0fVxyXG59OyJdfQ==

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	nom: 'autres',
	modele: '\n\t\t<div>Autres: En cours de dev</div>\n\t',
	constructeur: function constructeur(interfaceMère, el) {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9hdXRyZXMvaW5kZXguanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm5vbSIsIm1vZGVsZSIsImNvbnN0cnVjdGV1ciIsImludGVyZmFjZU3DqHJlIiwiZWwiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsR0FDQTtBQUNDQyxNQUFNLFFBRFA7QUFFQ0MsdURBRkQ7QUFNQ0MsZUFBZSxzQkFBQ0MsYUFBRCxFQUFnQkMsRUFBaEIsRUFDZixDQUNDO0FBUkYsQ0FEQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ2F1dHJlcycsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2PkF1dHJlczogRW4gY291cnMgZGUgZGV2PC9kaXY+XHJcblx0YCxcclxuXHRjb25zdHJ1Y3RldXIgOiAoaW50ZXJmYWNlTcOocmUsIGVsKSA9PlxyXG5cdHtcclxuXHR9XHJcbn07Il19

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	nom: 'accueuil',
	modele: '\n\t\t<div id=\'conteneur\'>\n\t\t\t<yb-gallerie id=\'projets\' titre=\'Projets\'> </yb-gallerie>\n\t\t\t</div>\n\t\t\t<div id=\'autres\'>\n\t\t\t\t<yb-bouton id=\'nouveau\'>Nouveau</yb-bouton>\n\t\t\t\t<yb-bouton id=\'gestion\'>Gestion</yb-bouton>\n\t\t\t</div>\n\t\t</div>\n\t\t<style>\n\t\t\t#conteneur\n\t\t\t{\n\t\t\t\twidth\t: 100%;\n\t\t\t\theight\t: 100%;\n\t\t\t\t\n\t\t\t\tdisplay\t: flex;\n\t\t\t\tflex-direction : row;\n\t\t\t\t\n\t\t\t\tbackground-color : #D4D4D4;\n\t\t\t}\n\t\t\t#projets\n\t\t\t{\n\t\t\t\t/* longeur = 50% - 2 * marge */\n\t\t\t\twidth\t: calc(50% - 30px);\n\t\t\t\tdisplay\t: inline-block;\n\t\t\t\tmargin\t: 15px;\n\t\t\t\tposition: relative;\n\t\t\t\tbackground-color : green;\n\t\t\t}\n\t\t\t#autres\n\t\t\t{\n\t\t\t\twidth\t: 50%;\n\t\t\t\theight\t: calc(100% - 30px);\n\t\t\t\t\n\t\t\t\t\n\t\t\t\tdisplay\t: inline-block;\n\t\t\t\tposition: absolute;\n\t\t\t\tmargin\t: 15px;\n\t\t\t\tright\t: 0%;\n\t\t\t\ttop\t\t: 0%;\n\t\t\t}\n\t\t\t#nouveau\n\t\t\t{\n\t\t\t\twidth\t\t: 25%;\n\t\t\t\tmin-width : 5em;\n\t\t\t\theight\t: 15%;\n\t\t\t\ttop\t: 25%;\n\t\t\t\tleft\t: 35%;\n\t\t\t\tposition\t: absolute;\n\t\t\t\t\n\t\t\t}\n\t\t\t#gestion\n\t\t\t{\n\t\t\t\twidth\t\t: 25%;\n\t\t\t\tmin-width : 5em;\n\t\t\t\theight\t: 15%;\n\t\t\t\tposition\t: absolute;\n\t\t\t\tbottom\t: 25%;\n\t\t\t\tleft\t: 35%;\n\t\t\t\t\n\t\t\t}\n\t\t</style>\n\t',
	constructeur: function constructeur(interfaceMère, el) {
		//	RACC
		var qs = function qs(sel) {
			return el.querySelector(sel);
		};
		var eu = ybasthis.utilitaires.grandeurs.enleverUnité;
		var cs = getComputedStyle;

		var elNouv = qs('#nouveau'),
		    elGest = qs('#gestion'),
		    elCont = qs('#conteneur'),
		    elGall = qs('#projets'),
		    csElAu = cs(qs('#autres'));
		elGall.style.height = eu(cs(elCont).height) - 30 + 'px';
		/*
  elGall.specialiser({
  	lecteur : (data) =>
  	{
  		var a = document.createElement('div');
  		var b = document.createElement('p');
  			b.innerHTML = data.b;
  		var c = document.createElement('p');
  			c.innerHTML = data.c;
  		a.appendChild(b);
  		a.appendChild(c);
  		return a;
  	},
  	organisateur : liste => liste,
  	modele : ['b', 'c'],
  	formeVignette : 'rectangle',
  	nombreVignette : 4
  });
  elGall.ajouter
  (
  	  {b: 'EDI', c: 'EDI pour javascript'}
  	, {b: '2', c: 'z'}
  	, {b: '3', c: 'e'}
  	, {b: '4', c: 'r'}
  	, {b: '5', c: 't'}
  	, {b: '6', c: 'y'}
  	, {b: '7', c: 'u'}
  	, {b: '8', c: 'i'}
  	, {b: '9', c: 'o'}
  	, {b: '10', c: 'p'}
  	, {b: '11', c: 'q'}
  	, {b: '12', c: 's'}
  );
  elGall.afficher();
  */
		var nouv = el.querySelector('#nouveau');
		nouv.addEventListener('click', function () {
			return interfaceMère.afficher('nouveauProjet');
		});

		el.querySelector('#gestion').addEventListener('click', function () {
			return interfaceMère.afficher('projetClasse');
		});
	}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9lc3BhY2VUcmF2YWlsL2FjY3VldWlsLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJub20iLCJtb2RlbGUiLCJjb25zdHJ1Y3RldXIiLCJpbnRlcmZhY2VNw6hyZSIsImVsIiwicXMiLCJxdWVyeVNlbGVjdG9yIiwic2VsIiwiZXUiLCJ5YmFzdGhpcyIsInV0aWxpdGFpcmVzIiwiZ3JhbmRldXJzIiwiZW5sZXZlclVuaXTDqSIsImNzIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImVsTm91diIsImVsR2VzdCIsImVsQ29udCIsImVsR2FsbCIsImNzRWxBdSIsInN0eWxlIiwiaGVpZ2h0Iiwibm91diIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZmZpY2hlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxHQUNBO0FBQ0NDLE1BQU0sVUFEUDtBQUVDQyx3MkNBRkQ7QUFrRUNDLGVBQWUsc0JBQUNDLGFBQUQsRUFBZ0JDLEVBQWhCLEVBQ2Y7QUFDQztBQUNBLE1BQUlDLEtBQUssU0FBTEEsRUFBSztBQUFBLFVBQU9ELEdBQUdFLGFBQUgsQ0FBaUJDLEdBQWpCLENBQVA7QUFBQSxHQUFUO0FBQ0EsTUFBSUMsS0FBS0MsU0FBU0MsV0FBVCxDQUFxQkMsU0FBckIsQ0FBK0JDLFlBQXhDO0FBQ0EsTUFBSUMsS0FBS0MsZ0JBQVQ7O0FBRUEsTUFBSUMsU0FBU1YsR0FBRyxVQUFILENBQWI7QUFBQSxNQUNDVyxTQUFTWCxHQUFHLFVBQUgsQ0FEVjtBQUFBLE1BRUNZLFNBQVNaLEdBQUcsWUFBSCxDQUZWO0FBQUEsTUFHQ2EsU0FBU2IsR0FBRyxVQUFILENBSFY7QUFBQSxNQUlDYyxTQUFTTixHQUFHUixHQUFHLFNBQUgsQ0FBSCxDQUpWO0FBS0FhLFNBQU9FLEtBQVAsQ0FBYUMsTUFBYixHQUF1QmIsR0FBR0ssR0FBR0ksTUFBSCxFQUFXSSxNQUFkLElBQXVCLEVBQXhCLEdBQThCLElBQXBEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBLE1BQUlDLE9BQU9sQixHQUFHRSxhQUFILENBQWlCLFVBQWpCLENBQVg7QUFDQ2dCLE9BQUtDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCO0FBQUEsVUFBTXBCLGNBQWNxQixRQUFkLENBQXVCLGVBQXZCLENBQU47QUFBQSxHQUEvQjs7QUFFRHBCLEtBQUdFLGFBQUgsQ0FBaUIsVUFBakIsRUFBNkJpQixnQkFBN0IsQ0FBOEMsT0FBOUMsRUFBdUQ7QUFBQSxVQUFNcEIsY0FBY3FCLFFBQWQsQ0FBdUIsY0FBdkIsQ0FBTjtBQUFBLEdBQXZEO0FBQ0E7QUF0SEYsQ0FEQSIsImZpbGUiOiJhY2N1ZXVpbC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ2FjY3VldWlsJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXYgaWQ9J2NvbnRlbmV1cic+XHJcblx0XHRcdDx5Yi1nYWxsZXJpZSBpZD0ncHJvamV0cycgdGl0cmU9J1Byb2pldHMnPiA8L3liLWdhbGxlcmllPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nYXV0cmVzJz5cclxuXHRcdFx0XHQ8eWItYm91dG9uIGlkPSdub3V2ZWF1Jz5Ob3V2ZWF1PC95Yi1ib3V0b24+XHJcblx0XHRcdFx0PHliLWJvdXRvbiBpZD0nZ2VzdGlvbic+R2VzdGlvbjwveWItYm91dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHQjY29udGVuZXVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHR3aWR0aFx0OiAxMDAlO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxMDAlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGRpc3BsYXlcdDogZmxleDtcclxuXHRcdFx0XHRmbGV4LWRpcmVjdGlvbiA6IHJvdztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yIDogI0Q0RDRENDtcclxuXHRcdFx0fVxyXG5cdFx0XHQjcHJvamV0c1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0LyogbG9uZ2V1ciA9IDUwJSAtIDIgKiBtYXJnZSAqL1xyXG5cdFx0XHRcdHdpZHRoXHQ6IGNhbGMoNTAlIC0gMzBweCk7XHJcblx0XHRcdFx0ZGlzcGxheVx0OiBpbmxpbmUtYmxvY2s7XHJcblx0XHRcdFx0bWFyZ2luXHQ6IDE1cHg7XHJcblx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3IgOiBncmVlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHQjYXV0cmVzXHJcblx0XHRcdHtcclxuXHRcdFx0XHR3aWR0aFx0OiA1MCU7XHJcblx0XHRcdFx0aGVpZ2h0XHQ6IGNhbGMoMTAwJSAtIDMwcHgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGRpc3BsYXlcdDogaW5saW5lLWJsb2NrO1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRtYXJnaW5cdDogMTVweDtcclxuXHRcdFx0XHRyaWdodFx0OiAwJTtcclxuXHRcdFx0XHR0b3BcdFx0OiAwJTtcclxuXHRcdFx0fVxyXG5cdFx0XHQjbm91dmVhdVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGhcdFx0OiAyNSU7XHJcblx0XHRcdFx0bWluLXdpZHRoIDogNWVtO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxNSU7XHJcblx0XHRcdFx0dG9wXHQ6IDI1JTtcclxuXHRcdFx0XHRsZWZ0XHQ6IDM1JTtcclxuXHRcdFx0XHRwb3NpdGlvblx0OiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHQjZ2VzdGlvblxyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGhcdFx0OiAyNSU7XHJcblx0XHRcdFx0bWluLXdpZHRoIDogNWVtO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxNSU7XHJcblx0XHRcdFx0cG9zaXRpb25cdDogYWJzb2x1dGU7XHJcblx0XHRcdFx0Ym90dG9tXHQ6IDI1JTtcclxuXHRcdFx0XHRsZWZ0XHQ6IDM1JTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0PC9zdHlsZT5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdFx0Ly9cdFJBQ0NcclxuXHRcdHZhciBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHR2YXIgZXUgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqTtcclxuXHRcdHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0XHRcclxuXHRcdHZhciBlbE5vdXYgPSBxcygnI25vdXZlYXUnKSxcclxuXHRcdFx0ZWxHZXN0ID0gcXMoJyNnZXN0aW9uJyksXHJcblx0XHRcdGVsQ29udCA9IHFzKCcjY29udGVuZXVyJyksXHJcblx0XHRcdGVsR2FsbCA9IHFzKCcjcHJvamV0cycpLFxyXG5cdFx0XHRjc0VsQXUgPSBjcyhxcygnI2F1dHJlcycpKTtcclxuXHRcdGVsR2FsbC5zdHlsZS5oZWlnaHQgPSAoZXUoY3MoZWxDb250KS5oZWlnaHQpIC0zMCkgKyAncHgnO1xyXG5cdFx0LypcclxuXHRcdGVsR2FsbC5zcGVjaWFsaXNlcih7XHJcblx0XHRcdGxlY3RldXIgOiAoZGF0YSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0dmFyIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcblx0XHRcdFx0XHRiLmlubmVySFRNTCA9IGRhdGEuYjtcclxuXHRcdFx0XHR2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHRcdFx0XHRcdGMuaW5uZXJIVE1MID0gZGF0YS5jO1xyXG5cdFx0XHRcdGEuYXBwZW5kQ2hpbGQoYik7XHJcblx0XHRcdFx0YS5hcHBlbmRDaGlsZChjKTtcclxuXHRcdFx0XHRyZXR1cm4gYTtcclxuXHRcdFx0fSxcclxuXHRcdFx0b3JnYW5pc2F0ZXVyIDogbGlzdGUgPT4gbGlzdGUsXHJcblx0XHRcdG1vZGVsZSA6IFsnYicsICdjJ10sXHJcblx0XHRcdGZvcm1lVmlnbmV0dGUgOiAncmVjdGFuZ2xlJyxcclxuXHRcdFx0bm9tYnJlVmlnbmV0dGUgOiA0XHJcblx0XHR9KTtcclxuXHRcdGVsR2FsbC5ham91dGVyXHJcblx0XHQoXHJcblx0XHRcdCAge2I6ICdFREknLCBjOiAnRURJIHBvdXIgamF2YXNjcmlwdCd9XHJcblx0XHRcdCwge2I6ICcyJywgYzogJ3onfVxyXG5cdFx0XHQsIHtiOiAnMycsIGM6ICdlJ31cclxuXHRcdFx0LCB7YjogJzQnLCBjOiAncid9XHJcblx0XHRcdCwge2I6ICc1JywgYzogJ3QnfVxyXG5cdFx0XHQsIHtiOiAnNicsIGM6ICd5J31cclxuXHRcdFx0LCB7YjogJzcnLCBjOiAndSd9XHJcblx0XHRcdCwge2I6ICc4JywgYzogJ2knfVxyXG5cdFx0XHQsIHtiOiAnOScsIGM6ICdvJ31cclxuXHRcdFx0LCB7YjogJzEwJywgYzogJ3AnfVxyXG5cdFx0XHQsIHtiOiAnMTEnLCBjOiAncSd9XHJcblx0XHRcdCwge2I6ICcxMicsIGM6ICdzJ31cclxuXHRcdCk7XHJcblx0XHRlbEdhbGwuYWZmaWNoZXIoKTtcclxuXHRcdCovXHJcblx0XHR2YXIgbm91diA9IGVsLnF1ZXJ5U2VsZWN0b3IoJyNub3V2ZWF1Jyk7XHJcblx0XHRcdG5vdXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBpbnRlcmZhY2VNw6hyZS5hZmZpY2hlcignbm91dmVhdVByb2pldCcpICk7XHJcblx0XHRcdFxyXG5cdFx0ZWwucXVlcnlTZWxlY3RvcignI2dlc3Rpb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGludGVyZmFjZU3DqHJlLmFmZmljaGVyKCdwcm9qZXRDbGFzc2UnKSApO1xyXG5cdH1cclxufTsiXX0=

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var vueNouveauProjet = __webpack_require__(29);
var vueAccueuil = __webpack_require__(27);
var vueProjetClasse = __webpack_require__(30);

module.exports = {
	nom: 'espaceTravail',
	modele: '\n\t\t<yb-interface></yb-interface>\n\t\t<style>\n\t\t\tyb-interface\n\t\t\t{\n\t\t\t\theight:100%;\n\t\t\t\twidth:100%;\n\t\t\t}\n\t\t</style>\n\t',
	constructeur: function constructeur(interfaceMère, el) {
		var elInterface = el.querySelector('YB-INTERFACE');
		elInterface.ajouter(vueNouveauProjet);
		elInterface.ajouter(vueAccueuil);
		elInterface.ajouter(vueProjetClasse);
		return function () {
			elInterface.afficher('accueuil');
		};
	}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9lc3BhY2VUcmF2YWlsL2luZGV4LmpzIl0sIm5hbWVzIjpbInZ1ZU5vdXZlYXVQcm9qZXQiLCJyZXF1aXJlIiwidnVlQWNjdWV1aWwiLCJ2dWVQcm9qZXRDbGFzc2UiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9tIiwibW9kZWxlIiwiY29uc3RydWN0ZXVyIiwiaW50ZXJmYWNlTcOocmUiLCJlbCIsImVsSW50ZXJmYWNlIiwicXVlcnlTZWxlY3RvciIsImFqb3V0ZXIiLCJhZmZpY2hlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxtQkFBbUJDLFFBQVEsb0JBQVIsQ0FBekI7QUFDQSxJQUFNQyxjQUFjRCxRQUFRLGVBQVIsQ0FBcEI7QUFDQSxJQUFNRSxrQkFBa0JGLFFBQVEsbUJBQVIsQ0FBeEI7O0FBRUFHLE9BQU9DLE9BQVAsR0FDQTtBQUNDQyxNQUFNLGVBRFA7QUFFQ0MsOEpBRkQ7QUFhQ0MsZUFBZSxzQkFBQ0MsYUFBRCxFQUFnQkMsRUFBaEIsRUFDZjtBQUNDLE1BQU1DLGNBQWNELEdBQUdFLGFBQUgsQ0FBaUIsY0FBakIsQ0FBcEI7QUFDQUQsY0FBWUUsT0FBWixDQUFvQmIsZ0JBQXBCO0FBQ0FXLGNBQVlFLE9BQVosQ0FBb0JYLFdBQXBCO0FBQ0FTLGNBQVlFLE9BQVosQ0FBb0JWLGVBQXBCO0FBQ0EsU0FBTyxZQUNQO0FBQ0NRLGVBQVlHLFFBQVosQ0FBcUIsVUFBckI7QUFDQSxHQUhEO0FBSUE7QUF2QkYsQ0FEQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdnVlTm91dmVhdVByb2pldCA9IHJlcXVpcmUoJy4vbm91dmVhdVByb2pldC5qcycpO1xyXG5jb25zdCB2dWVBY2N1ZXVpbCA9IHJlcXVpcmUoJy4vYWNjdWV1aWwuanMnKTtcclxuY29uc3QgdnVlUHJvamV0Q2xhc3NlID0gcmVxdWlyZSgnLi9wcm9qZXRDbGFzc2UuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbSA6ICdlc3BhY2VUcmF2YWlsJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDx5Yi1pbnRlcmZhY2U+PC95Yi1pbnRlcmZhY2U+XHJcblx0XHQ8c3R5bGU+XHJcblx0XHRcdHliLWludGVyZmFjZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGVpZ2h0OjEwMCU7XHJcblx0XHRcdFx0d2lkdGg6MTAwJTtcclxuXHRcdFx0fVxyXG5cdFx0PC9zdHlsZT5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgZWxJbnRlcmZhY2UgPSBlbC5xdWVyeVNlbGVjdG9yKCdZQi1JTlRFUkZBQ0UnKTtcclxuXHRcdGVsSW50ZXJmYWNlLmFqb3V0ZXIodnVlTm91dmVhdVByb2pldCk7XHJcblx0XHRlbEludGVyZmFjZS5ham91dGVyKHZ1ZUFjY3VldWlsKTtcclxuXHRcdGVsSW50ZXJmYWNlLmFqb3V0ZXIodnVlUHJvamV0Q2xhc3NlKTtcclxuXHRcdHJldHVybiAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRlbEludGVyZmFjZS5hZmZpY2hlcignYWNjdWV1aWwnKTtcclxuXHRcdH07XHJcblx0fVxyXG59OyJdfQ==

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	nom: 'nouveauProjet',
	/**
 div #conteneur
 |	div #projets
 |	|	input #nom
 |	|	input #desc
 |	div #autres
 |	|	div #aut_type
 |	|	|	p #type
 |	|	div #aut_autres
 |	|	|	yb-bouton #annuler
 |	|	|	yb-bouton #valider=
 **/
	modele: '\n\t\t<div id=\'conteneur\'>\n\t\t\t<div id=\'projets\'>\n\t\t\t\t<input id=\'nom\' type=\'text\' placeholder=\'Nom\' />\n\t\t\t\t<input id=\'desc\' type=\'text\' placeholder=\'Description\' />\n\t\t\t</div>\n\t\t\t<div id=\'autres\'>\n\t\t\t\t<div id=\'aut_type\'>\n\t\t\t\t\t<p id=\'type\'>TYPE</p>\n\t\t\t\t</div>\n\t\t\t\t<div id=\'aut_autres\'>\n\t\t\t\t\t<yb-bouton class=\'aut_autresBouton\' id=\'annuler\'></yb-bouton>\n\t\t\t\t\t<yb-bouton class=\'aut_autresBouton\' id=\'valider\'></yb-bouton>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<style>\n\t\t\tinput\n\t\t\t{\t\n\t\t\t\t  height:\t50%;\n\t\t\t}\n\t\t\t#conteneur\n\t\t\t{\n\t\t\t\tdisplay:\t\t\t\t\tflex;\n\t\t\t\tflex-direction:\t\trow;\n\t\t\t\theight:\t\t\t\t\t\t100%;\n\t\t\t\twidth:\t\t\t\t\t\t100%;\n\t\t\t\tbackground-color:\t#D4D4D4;\n\t\t\t\tposition:\t\t\t\t\tabsolute;\n\t\t\t}\n\t\t\t#projets\n\t\t\t{\n\t\t\t\tdisplay:\tblock;\n\t\t\t\theight:\t\t100%;\n\t\t\t\twidth:\t\t50%;\n\t\t\t\ttop:\t\t\t0px;\n\t\t\t\tleft:\t\t\t0px;\n\t\t\t\tmargin:\t\t15px;\n \t\t\t\tposition:\trelative;\n\t\t\t}\n\t\t\t#nom\n\t\t\t{\n\t\t\t\t  width:\t\t\t\t\t50%;\n\t\t\t\t  height:\t\t\t\t\t15%;\n\t\t\t\t  border-width:\t\t1px;\n\t\t\t\t  border-style:\t\tsolid;\n\t\t\t\t  border-color:\t\tblack;\n\t\t\t\t\tmargin-bottom:\t15px;\n\t\t\t\t  position:\t\t\t\trelative;\n\t\t\t}\n\t\t\t#desc\n\t\t\t{\n\t\t\t\t height:\t\t\t\tcalc(100% - 15%);\n\t\t\t\t width:\t\t\t\t\t100%;\n\t\t\t\t border-width:\t1px;\n\t\t\t\t border-style:\tsolid;\n\t\t\t\t border-color:\tblack;\n\t\t\t\t position:\t\t\trelative;\n\t\t\t}\n\n\t\t\t\n\t\t\t#autres\n\t\t\t{\n\t\t\t\twidth:\t\t50%;\n\t\t\t\theight:\t\t100%;\n\t\t\t\tdisplay:\tinline-block;\n\t\t\t\tposition:\tabsolute;\n\t\t\t\tright\t\t: 0%;\n\t\t\t}\n\t\t\t\n\t\t\t#aut_type\n\t\t\t{\n\t\t\t\tmargin:\t\t\t\t\t\t15px;\n\t\t\t\tbackground-color:\t#D4D4D4;\n\t\t\t\tposition:\t\t\t\t\tabsolute;\n\t\t\t\toverflow:\t\t\t\t\thidden;\n\t\t\t\tborder-width:\t\t\t1px;\n\t\t\t\tborder-style:\t\t\tsolid;\n\t\t\t\tborder-color:\t\t\tblack;\n\t\t\t}\n\t\t\t\n\t\t\t#aut_autres\n\t\t\t{\n\t\t\t\tright:\t\t0px;\n\t\t\t\tmargin:\t\t15px;\n\t\t\t\tposition:\tabsolute;\n\t\t\t\toverflow:\thidden;\n\t\t\t}\n\n\t\t\t.aut_autresBouton\n\t\t\t{\n\t\t\t\tposition:\tabsolute;\n\t\t\t\twidth:\t\t100%;\n\t\t\t}\n\t\t\t#annuler\n\t\t\t{\n\t\t\t\tbackground-color:\tblack;\t\n\t\t\t}\n\t\t\t#valider\n\t\t\t{\n\t\t\t\tbackground-color:\tblack;\n\t\t\t}\n\t\t\t#type\n\t\t\t{\n\t\t\t\tborder-width:\t\t\t\t\t0px;\n\t\t\t\tborder-bottom-width:\t1px;\n\t\t\t\tborder-style:\t\t\t\t\tsolid;\n\t\t\t\tborder-color:\t\t\t\t\tblack;\n\t\t\t\tposition:\t\t\t\t\t\t\tabsolute;\n\t\t\t}\n\t\t</style>\n\t',
	constructeur: function constructeur(interfaceMère, el) {
		var qs = function qs(sel) {
			return el.querySelector(sel);
		};
		var eu = ybasthis.utilitaires.grandeurs.enleverUnité;
		var cs = getComputedStyle;
		var val = qs('#valider');
		val.changerLabel('V');
		val.enleverEffets();
		var anu = qs('#annuler');
		anu.changerLabel('X');
		anu.enleverEffets();
		anu.addEventListener('click', function () {
			interfaceMère.afficher('accueuil');
		});
		var aut_type = qs('#aut_type');
		var aut_autres = qs('#aut_autres');
		var autres_cp = cs(qs('#autres'));
		var csElCont = cs(qs('#conteneur'));
		var elProjet = qs('#projets');

		elProjet.style.height = eu(csElCont.height) - 45 + 'px';
		elProjet.style.width = eu(cs(elProjet).width) - 15 + 'px';
		aut_type.style.width = eu(autres_cp.width) * 90 / 100 - 45 + 'px';
		aut_type.style.height = eu(autres_cp.height) - 45 + 'px';
		aut_autres.style.height = aut_type.style.height;
		aut_autres.style.width = eu(autres_cp.width) * 10 / 100 + 'px';
		var aut_autres_cp = cs(aut_autres);
		anu.style.height = anu.style.width = aut_autres_cp.width;
		val.style.height = eu(aut_autres_cp.height) - eu(aut_autres_cp.width) - 15 + 'px';
		val.style.width = anu.style.width;
		val.style.top = eu(aut_autres_cp.width) + 15 + 'px';

		var desc = qs('#desc');
		var descCs = cs(desc);
		var nom = qs('#nom');
		nom.style.backgroundColor = ybasthis.charteUi.grisClair;
		desc.style.backgroundColor = ybasthis.charteUi.grisClair;
		desc.style.height = eu(cs(qs('#projets')).height) - eu(cs(nom).height) - 20 + 'px';
	}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9lc3BhY2VUcmF2YWlsL25vdXZlYXVQcm9qZXQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm5vbSIsIm1vZGVsZSIsImNvbnN0cnVjdGV1ciIsImludGVyZmFjZU3DqHJlIiwiZWwiLCJxcyIsInF1ZXJ5U2VsZWN0b3IiLCJzZWwiLCJldSIsInliYXN0aGlzIiwidXRpbGl0YWlyZXMiLCJncmFuZGV1cnMiLCJlbmxldmVyVW5pdMOpIiwiY3MiLCJnZXRDb21wdXRlZFN0eWxlIiwidmFsIiwiY2hhbmdlckxhYmVsIiwiZW5sZXZlckVmZmV0cyIsImFudSIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZmZpY2hlciIsImF1dF90eXBlIiwiYXV0X2F1dHJlcyIsImF1dHJlc19jcCIsImNzRWxDb250IiwiZWxQcm9qZXQiLCJzdHlsZSIsImhlaWdodCIsIndpZHRoIiwiYXV0X2F1dHJlc19jcCIsInRvcCIsImRlc2MiLCJkZXNjQ3MiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjaGFydGVVaSIsImdyaXNDbGFpciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0FBLE9BQU9DLE9BQVAsR0FDQTtBQUNDQyxNQUFNLGVBRFA7QUFFQzs7Ozs7Ozs7Ozs7O0FBWUFDLHlvRkFkRDtBQStIQ0MsZUFBZSxzQkFBQ0MsYUFBRCxFQUFnQkMsRUFBaEIsRUFDZjtBQUNDLE1BQU1DLEtBQUssU0FBTEEsRUFBSztBQUFBLFVBQU9ELEdBQUdFLGFBQUgsQ0FBaUJDLEdBQWpCLENBQVA7QUFBQSxHQUFYO0FBQ0EsTUFBTUMsS0FBS0MsU0FBU0MsV0FBVCxDQUFxQkMsU0FBckIsQ0FBK0JDLFlBQTFDO0FBQ0EsTUFBTUMsS0FBS0MsZ0JBQVg7QUFDQSxNQUFNQyxNQUFNVixHQUFHLFVBQUgsQ0FBWjtBQUNBVSxNQUFJQyxZQUFKLENBQWlCLEdBQWpCO0FBQ0FELE1BQUlFLGFBQUo7QUFDQSxNQUFNQyxNQUFNYixHQUFHLFVBQUgsQ0FBWjtBQUNBYSxNQUFJRixZQUFKLENBQWlCLEdBQWpCO0FBQ0FFLE1BQUlELGFBQUo7QUFDQUMsTUFBSUMsZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsWUFDOUI7QUFDQ2hCLGlCQUFjaUIsUUFBZCxDQUF1QixVQUF2QjtBQUNBLEdBSEQ7QUFJQSxNQUFNQyxXQUFXaEIsR0FBRyxXQUFILENBQWpCO0FBQ0EsTUFBTWlCLGFBQWFqQixHQUFHLGFBQUgsQ0FBbkI7QUFDQSxNQUFNa0IsWUFBWVYsR0FBR1IsR0FBRyxTQUFILENBQUgsQ0FBbEI7QUFDQSxNQUFNbUIsV0FBV1gsR0FBR1IsR0FBRyxZQUFILENBQUgsQ0FBakI7QUFDQSxNQUFNb0IsV0FBV3BCLEdBQUcsVUFBSCxDQUFqQjs7QUFFQW9CLFdBQVNDLEtBQVQsQ0FBZUMsTUFBZixHQUF5Qm5CLEdBQUdnQixTQUFTRyxNQUFaLElBQXNCLEVBQXZCLEdBQTZCLElBQXJEO0FBQ0FGLFdBQVNDLEtBQVQsQ0FBZUUsS0FBZixHQUF3QnBCLEdBQUdLLEdBQUdZLFFBQUgsRUFBYUcsS0FBaEIsSUFBd0IsRUFBekIsR0FBK0IsSUFBdEQ7QUFDQVAsV0FBU0ssS0FBVCxDQUFlRSxLQUFmLEdBRUdwQixHQUFHZSxVQUFVSyxLQUFiLElBQXNCLEVBQXZCLEdBQ0MsR0FERixHQUNTLEVBRlYsR0FHSSxJQUpKO0FBS0FQLFdBQVNLLEtBQVQsQ0FBZUMsTUFBZixHQUF5Qm5CLEdBQUdlLFVBQVVJLE1BQWIsSUFBdUIsRUFBeEIsR0FBK0IsSUFBdkQ7QUFDQUwsYUFBV0ksS0FBWCxDQUFpQkMsTUFBakIsR0FBMEJOLFNBQVNLLEtBQVQsQ0FBZUMsTUFBekM7QUFDQUwsYUFBV0ksS0FBWCxDQUFpQkUsS0FBakIsR0FFR3BCLEdBQUdlLFVBQVVLLEtBQWIsSUFBc0IsRUFBdkIsR0FDQyxHQUZILEdBR0ksSUFKSjtBQUtBLE1BQU1DLGdCQUFnQmhCLEdBQUdTLFVBQUgsQ0FBdEI7QUFDQUosTUFBSVEsS0FBSixDQUFVQyxNQUFWLEdBQW1CVCxJQUFJUSxLQUFKLENBQVVFLEtBQVYsR0FBa0JDLGNBQWNELEtBQW5EO0FBQ0FiLE1BQUlXLEtBQUosQ0FBVUMsTUFBVixHQUVDbkIsR0FBR3FCLGNBQWNGLE1BQWpCLElBRUFuQixHQUFHcUIsY0FBY0QsS0FBakIsQ0FIQSxHQUlHLEVBSkosR0FJVSxJQUxWO0FBTUFiLE1BQUlXLEtBQUosQ0FBVUUsS0FBVixHQUFrQlYsSUFBSVEsS0FBSixDQUFVRSxLQUE1QjtBQUNBYixNQUFJVyxLQUFKLENBQVVJLEdBQVYsR0FBaUJ0QixHQUFHcUIsY0FBY0QsS0FBakIsSUFBMEIsRUFBM0IsR0FBaUMsSUFBakQ7O0FBRUEsTUFBUUcsT0FBTzFCLEdBQUcsT0FBSCxDQUFmO0FBQ0EsTUFBTzJCLFNBQVNuQixHQUFHa0IsSUFBSCxDQUFoQjtBQUNBLE1BQU8vQixNQUFNSyxHQUFHLE1BQUgsQ0FBYjtBQUNBTCxNQUFJMEIsS0FBSixDQUFVTyxlQUFWLEdBQTRCeEIsU0FBU3lCLFFBQVQsQ0FBa0JDLFNBQTlDO0FBQ0FKLE9BQUtMLEtBQUwsQ0FBV08sZUFBWCxHQUE2QnhCLFNBQVN5QixRQUFULENBQWtCQyxTQUEvQztBQUNBSixPQUFLTCxLQUFMLENBQVdDLE1BQVgsR0FBc0JuQixHQUFHSyxHQUFHUixHQUFHLFVBQUgsQ0FBSCxFQUFtQnNCLE1BQXRCLElBQWdDbkIsR0FBR0ssR0FBR2IsR0FBSCxFQUFRMkIsTUFBWCxDQUFqQyxHQUF3RCxFQUF6RCxHQUErRCxJQUFuRjtBQUNBO0FBbkxGLENBREEiLCJmaWxlIjoibm91dmVhdVByb2pldC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnbm91dmVhdVByb2pldCcsXHJcblx0LyoqXHJcblx0ZGl2ICNjb250ZW5ldXJcclxuXHR8XHRkaXYgI3Byb2pldHNcclxuXHR8XHR8XHRpbnB1dCAjbm9tXHJcblx0fFx0fFx0aW5wdXQgI2Rlc2NcclxuXHR8XHRkaXYgI2F1dHJlc1xyXG5cdHxcdHxcdGRpdiAjYXV0X3R5cGVcclxuXHR8XHR8XHR8XHRwICN0eXBlXHJcblx0fFx0fFx0ZGl2ICNhdXRfYXV0cmVzXHJcblx0fFx0fFx0fFx0eWItYm91dG9uICNhbm51bGVyXHJcblx0fFx0fFx0fFx0eWItYm91dG9uICN2YWxpZGVyPVxyXG5cdCoqL1xyXG5cdG1vZGVsZSA6XHJcblx0YFxyXG5cdFx0PGRpdiBpZD0nY29udGVuZXVyJz5cclxuXHRcdFx0PGRpdiBpZD0ncHJvamV0cyc+XHJcblx0XHRcdFx0PGlucHV0IGlkPSdub20nIHR5cGU9J3RleHQnIHBsYWNlaG9sZGVyPSdOb20nIC8+XHJcblx0XHRcdFx0PGlucHV0IGlkPSdkZXNjJyB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nRGVzY3JpcHRpb24nIC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGlkPSdhdXRyZXMnPlxyXG5cdFx0XHRcdDxkaXYgaWQ9J2F1dF90eXBlJz5cclxuXHRcdFx0XHRcdDxwIGlkPSd0eXBlJz5UWVBFPC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgaWQ9J2F1dF9hdXRyZXMnPlxyXG5cdFx0XHRcdFx0PHliLWJvdXRvbiBjbGFzcz0nYXV0X2F1dHJlc0JvdXRvbicgaWQ9J2FubnVsZXInPjwveWItYm91dG9uPlxyXG5cdFx0XHRcdFx0PHliLWJvdXRvbiBjbGFzcz0nYXV0X2F1dHJlc0JvdXRvbicgaWQ9J3ZhbGlkZXInPjwveWItYm91dG9uPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHRpbnB1dFxyXG5cdFx0XHR7XHRcclxuXHRcdFx0XHQgIGhlaWdodDpcdDUwJTtcclxuXHRcdFx0fVxyXG5cdFx0XHQjY29udGVuZXVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkaXNwbGF5Olx0XHRcdFx0XHRmbGV4O1xyXG5cdFx0XHRcdGZsZXgtZGlyZWN0aW9uOlx0XHRyb3c7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHRcdFx0XHRcdDEwMCU7XHJcblx0XHRcdFx0d2lkdGg6XHRcdFx0XHRcdFx0MTAwJTtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOlx0I0Q0RDRENDtcclxuXHRcdFx0XHRwb3NpdGlvbjpcdFx0XHRcdFx0YWJzb2x1dGU7XHJcblx0XHRcdH1cclxuXHRcdFx0I3Byb2pldHNcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRpc3BsYXk6XHRibG9jaztcclxuXHRcdFx0XHRoZWlnaHQ6XHRcdDEwMCU7XHJcblx0XHRcdFx0d2lkdGg6XHRcdDUwJTtcclxuXHRcdFx0XHR0b3A6XHRcdFx0MHB4O1xyXG5cdFx0XHRcdGxlZnQ6XHRcdFx0MHB4O1xyXG5cdFx0XHRcdG1hcmdpbjpcdFx0MTVweDtcclxuIFx0XHRcdFx0cG9zaXRpb246XHRyZWxhdGl2ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQjbm9tXHJcblx0XHRcdHtcclxuXHRcdFx0XHQgIHdpZHRoOlx0XHRcdFx0XHQ1MCU7XHJcblx0XHRcdFx0ICBoZWlnaHQ6XHRcdFx0XHRcdDE1JTtcclxuXHRcdFx0XHQgIGJvcmRlci13aWR0aDpcdFx0MXB4O1xyXG5cdFx0XHRcdCAgYm9yZGVyLXN0eWxlOlx0XHRzb2xpZDtcclxuXHRcdFx0XHQgIGJvcmRlci1jb2xvcjpcdFx0YmxhY2s7XHJcblx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOlx0MTVweDtcclxuXHRcdFx0XHQgIHBvc2l0aW9uOlx0XHRcdFx0cmVsYXRpdmU7XHJcblx0XHRcdH1cclxuXHRcdFx0I2Rlc2NcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCBoZWlnaHQ6XHRcdFx0XHRjYWxjKDEwMCUgLSAxNSUpO1xyXG5cdFx0XHRcdCB3aWR0aDpcdFx0XHRcdFx0MTAwJTtcclxuXHRcdFx0XHQgYm9yZGVyLXdpZHRoOlx0MXB4O1xyXG5cdFx0XHRcdCBib3JkZXItc3R5bGU6XHRzb2xpZDtcclxuXHRcdFx0XHQgYm9yZGVyLWNvbG9yOlx0YmxhY2s7XHJcblx0XHRcdFx0IHBvc2l0aW9uOlx0XHRcdHJlbGF0aXZlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRcclxuXHRcdFx0I2F1dHJlc1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGg6XHRcdDUwJTtcclxuXHRcdFx0XHRoZWlnaHQ6XHRcdDEwMCU7XHJcblx0XHRcdFx0ZGlzcGxheTpcdGlubGluZS1ibG9jaztcclxuXHRcdFx0XHRwb3NpdGlvbjpcdGFic29sdXRlO1xyXG5cdFx0XHRcdHJpZ2h0XHRcdDogMCU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdCNhdXRfdHlwZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bWFyZ2luOlx0XHRcdFx0XHRcdDE1cHg7XHJcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjpcdCNENEQ0RDQ7XHJcblx0XHRcdFx0cG9zaXRpb246XHRcdFx0XHRcdGFic29sdXRlO1xyXG5cdFx0XHRcdG92ZXJmbG93Olx0XHRcdFx0XHRoaWRkZW47XHJcblx0XHRcdFx0Ym9yZGVyLXdpZHRoOlx0XHRcdDFweDtcclxuXHRcdFx0XHRib3JkZXItc3R5bGU6XHRcdFx0c29saWQ7XHJcblx0XHRcdFx0Ym9yZGVyLWNvbG9yOlx0XHRcdGJsYWNrO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQjYXV0X2F1dHJlc1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmlnaHQ6XHRcdDBweDtcclxuXHRcdFx0XHRtYXJnaW46XHRcdDE1cHg7XHJcblx0XHRcdFx0cG9zaXRpb246XHRhYnNvbHV0ZTtcclxuXHRcdFx0XHRvdmVyZmxvdzpcdGhpZGRlbjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LmF1dF9hdXRyZXNCb3V0b25cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0YWJzb2x1dGU7XHJcblx0XHRcdFx0d2lkdGg6XHRcdDEwMCU7XHJcblx0XHRcdH1cclxuXHRcdFx0I2FubnVsZXJcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6XHRibGFjaztcdFxyXG5cdFx0XHR9XHJcblx0XHRcdCN2YWxpZGVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOlx0YmxhY2s7XHJcblx0XHRcdH1cclxuXHRcdFx0I3R5cGVcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJvcmRlci13aWR0aDpcdFx0XHRcdFx0MHB4O1xyXG5cdFx0XHRcdGJvcmRlci1ib3R0b20td2lkdGg6XHQxcHg7XHJcblx0XHRcdFx0Ym9yZGVyLXN0eWxlOlx0XHRcdFx0XHRzb2xpZDtcclxuXHRcdFx0XHRib3JkZXItY29sb3I6XHRcdFx0XHRcdGJsYWNrO1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0XHRcdFx0XHRcdFx0YWJzb2x1dGU7XHJcblx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0YCxcclxuXHRjb25zdHJ1Y3RldXIgOiAoaW50ZXJmYWNlTcOocmUsIGVsKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0IHFzID0gc2VsID0+IGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcclxuXHRcdGNvbnN0IGV1ID0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6k7XHJcblx0XHRjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0XHRjb25zdCB2YWwgPSBxcygnI3ZhbGlkZXInKTtcclxuXHRcdHZhbC5jaGFuZ2VyTGFiZWwoJ1YnKTtcclxuXHRcdHZhbC5lbmxldmVyRWZmZXRzKCk7XHJcblx0XHRjb25zdCBhbnUgPSBxcygnI2FubnVsZXInKVxyXG5cdFx0YW51LmNoYW5nZXJMYWJlbCgnWCcpO1xyXG5cdFx0YW51LmVubGV2ZXJFZmZldHMoKTtcclxuXHRcdGFudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XHJcblx0XHR7XHJcblx0XHRcdGludGVyZmFjZU3DqHJlLmFmZmljaGVyKCdhY2N1ZXVpbCcpO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zdCBhdXRfdHlwZSA9IHFzKCcjYXV0X3R5cGUnKTtcclxuXHRcdGNvbnN0IGF1dF9hdXRyZXMgPSBxcygnI2F1dF9hdXRyZXMnKTtcclxuXHRcdGNvbnN0IGF1dHJlc19jcCA9IGNzKHFzKCcjYXV0cmVzJykpO1xyXG5cdFx0Y29uc3QgY3NFbENvbnQgPSBjcyhxcygnI2NvbnRlbmV1cicpKTtcclxuXHRcdGNvbnN0IGVsUHJvamV0ID0gcXMoJyNwcm9qZXRzJyk7XHJcblx0XHJcblx0XHRlbFByb2pldC5zdHlsZS5oZWlnaHQgPSAoZXUoY3NFbENvbnQuaGVpZ2h0KSAtIDQ1KSArICdweCc7XHJcblx0XHRlbFByb2pldC5zdHlsZS53aWR0aCA9IChldShjcyhlbFByb2pldCkud2lkdGgpIC0xNSkgKyAncHgnO1xyXG5cdFx0YXV0X3R5cGUuc3R5bGUud2lkdGggPVxyXG5cdFx0KFxyXG5cdFx0XHQoKGV1KGF1dHJlc19jcC53aWR0aCkgKiA5MClcclxuXHRcdFx0LyAxMDApIC0gNDVcclxuXHRcdCkgKyAncHgnO1xyXG5cdFx0YXV0X3R5cGUuc3R5bGUuaGVpZ2h0ID0gKGV1KGF1dHJlc19jcC5oZWlnaHQpIC0gNDUgKSArICdweCc7XHJcblx0XHRhdXRfYXV0cmVzLnN0eWxlLmhlaWdodCA9IGF1dF90eXBlLnN0eWxlLmhlaWdodDtcclxuXHRcdGF1dF9hdXRyZXMuc3R5bGUud2lkdGggPSBcclxuXHRcdChcclxuXHRcdFx0KChldShhdXRyZXNfY3Aud2lkdGgpICogMTApXHJcblx0XHRcdC8gMTAwKVxyXG5cdFx0KSArICdweCc7XHJcblx0XHRjb25zdCBhdXRfYXV0cmVzX2NwID0gY3MoYXV0X2F1dHJlcyk7XHJcblx0XHRhbnUuc3R5bGUuaGVpZ2h0ID0gYW51LnN0eWxlLndpZHRoID0gYXV0X2F1dHJlc19jcC53aWR0aDtcclxuXHRcdHZhbC5zdHlsZS5oZWlnaHQgPVxyXG5cdFx0KChcclxuXHRcdFx0ZXUoYXV0X2F1dHJlc19jcC5oZWlnaHQpIFxyXG5cdFx0XHQtXHJcblx0XHRcdGV1KGF1dF9hdXRyZXNfY3Aud2lkdGgpIFxyXG5cdFx0KSAtIDE1KSArICdweCc7XHJcblx0XHR2YWwuc3R5bGUud2lkdGggPSBhbnUuc3R5bGUud2lkdGg7XHJcblx0XHR2YWwuc3R5bGUudG9wID0gKGV1KGF1dF9hdXRyZXNfY3Aud2lkdGgpICsgMTUpICsgJ3B4JztcclxuXHRcdFxyXG5cdFx0Y29uc3QgICBkZXNjID0gcXMoJyNkZXNjJyk7XHJcblx0XHRjb25zdFx0XHRkZXNjQ3MgPSBjcyhkZXNjKTtcclxuXHRcdGNvbnN0XHRcdG5vbSA9IHFzKCcjbm9tJyk7XHJcblx0XHRub20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdFx0ZGVzYy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0XHRkZXNjLnN0eWxlLmhlaWdodCA9ICgoZXUoY3MocXMoJyNwcm9qZXRzJykpLmhlaWdodCkgLSBldShjcyhub20pLmhlaWdodCkgKSAtIDIwKSArICdweCc7XHJcblx0fVxyXG59OyJdfQ==

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	nom: 'projetClasse',
	modele: '\n\t\t<div id="editeur">\n\t\t\t<yb-menu>\n\t\t\t\t<yb-onglet nom=\'Modele\' type=\'selection\'>\n\t\t\t\t\t<yb-choix nom=\'Classe\' /></yb-choix>\n\t\t\t\t\t<yb-choix nom=\'Instance\' /></yb-choix>\n\t\t\t\t</yb-onglet>\n\t\t\t\t<yb-onglet nom=\'Impl\xE9mentation\' type=\'selection\'>\n\t\t\t\t\t<yb-choix nom=\'Classe\' /></yb-choix>\n\t\t\t\t\t<yb-choix nom=\'Instance\' /></yb-choix>\n\t\t\t\t</yb-onglet>\n\t\t\t\t<yb-onglet nom=\'Rapports\' type=\'selection\'>\n\t\t\t\t\t<yb-choix nom=\'Classe\' /></yb-choix>\n\t\t\t\t\t<yb-choix nom=\'Instance\' /></yb-choix>\n\t\t\t\t\t<yb-choix nom=\'G\xE9n\xE9raux\' /></yb-choix>\n\t\t\t\t</yb-onglet>\n\t\t\t\t<yb-onglet nom=\'D\xE9pendances\' type=\'bouton\' ></yb-onglet>\n\t\t\t</yb-menu>\n\t\t\t<table id="affichage">\n\t\t\t\t<tr>\n\t\t\t\t\t<th class=\'dummy\'></th>\n\t\t\t\t\t<th>Nom</th>\n\t\t\t\t\t<th>Type</th>\n\t\t\t\t\t<th>Force typage</th>\n\t\t\t\t\t<th>Port\xE9</th>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\'boutonSelectionner\'>\n\t\t\t\t\t\t<yb-caseCocher />\n\t\t\t\t\t</td>\n\t\t\t\t\t<td><p>taille</p></td>\n\t\t\t\t\t<td><p>entier naturel</p></td>\n\t\t\t\t\t<td><p>statique</p></td>\n\t\t\t\t\t<td><p>publique</p></td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\'boutonSelectionner\'>\n\t\t\t\t\t\t<yb-caseCocher />\n\t\t\t\t\t</td>\n\t\t\t\t\t<td><p>fr\xE9quence</p></td>\n\t\t\t\t\t<td><p>entier naturel</p></td>\n\t\t\t\t\t<td><p>constant</p></td>\n\t\t\t\t\t<td><p>priv\xE9e</p></td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t\t<div id="editeur_edition">\t</div>\n\t\t</div>\n\t\t<style>\n\t\t</style>\n\t',
	constructeur: function constructeur(interfaceMère, el) {
		//	RACC
		var qs = function qs(sel) {
			return el.querySelector(sel);
		};
		//var eu = _enleverUnite;
		var cs = getComputedStyle;
	}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9lc3BhY2VUcmF2YWlsL3Byb2pldENsYXNzZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibm9tIiwibW9kZWxlIiwiY29uc3RydWN0ZXVyIiwiaW50ZXJmYWNlTcOocmUiLCJlbCIsInFzIiwicXVlcnlTZWxlY3RvciIsInNlbCIsImNzIiwiZ2V0Q29tcHV0ZWRTdHlsZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsT0FBUCxHQUNBO0FBQ0NDLE1BQU0sY0FEUDtBQUVDQyxza0RBRkQ7QUFxRENDLGVBQWUsc0JBQUNDLGFBQUQsRUFBZ0JDLEVBQWhCLEVBQ2Y7QUFDQztBQUNBLE1BQUlDLEtBQUssU0FBTEEsRUFBSztBQUFBLFVBQU9ELEdBQUdFLGFBQUgsQ0FBaUJDLEdBQWpCLENBQVA7QUFBQSxHQUFUO0FBQ0E7QUFDQSxNQUFJQyxLQUFLQyxnQkFBVDtBQUNBO0FBM0RGLENBREEiLCJmaWxlIjoicHJvamV0Q2xhc3NlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAncHJvamV0Q2xhc3NlJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXYgaWQ9XCJlZGl0ZXVyXCI+XHJcblx0XHRcdDx5Yi1tZW51PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdNb2RlbGUnIHR5cGU9J3NlbGVjdGlvbic+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdDbGFzc2UnIC8+PC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0luc3RhbmNlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0PHliLW9uZ2xldCBub209J0ltcGzDqW1lbnRhdGlvbicgdHlwZT0nc2VsZWN0aW9uJz5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0NsYXNzZScgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nSW5zdGFuY2UnIC8+PC95Yi1jaG9peD5cclxuXHRcdFx0XHQ8L3liLW9uZ2xldD5cclxuXHRcdFx0XHQ8eWItb25nbGV0IG5vbT0nUmFwcG9ydHMnIHR5cGU9J3NlbGVjdGlvbic+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdDbGFzc2UnIC8+PC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0luc3RhbmNlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdHw6luw6lyYXV4JyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0PHliLW9uZ2xldCBub209J0TDqXBlbmRhbmNlcycgdHlwZT0nYm91dG9uJyA+PC95Yi1vbmdsZXQ+XHJcblx0XHRcdDwveWItbWVudT5cclxuXHRcdFx0PHRhYmxlIGlkPVwiYWZmaWNoYWdlXCI+XHJcblx0XHRcdFx0PHRyPlxyXG5cdFx0XHRcdFx0PHRoIGNsYXNzPSdkdW1teSc+PC90aD5cclxuXHRcdFx0XHRcdDx0aD5Ob208L3RoPlxyXG5cdFx0XHRcdFx0PHRoPlR5cGU8L3RoPlxyXG5cdFx0XHRcdFx0PHRoPkZvcmNlIHR5cGFnZTwvdGg+XHJcblx0XHRcdFx0XHQ8dGg+UG9ydMOpPC90aD5cclxuXHRcdFx0XHQ8L3RyPlxyXG5cdFx0XHRcdDx0cj5cclxuXHRcdFx0XHRcdDx0ZCBjbGFzcz0nYm91dG9uU2VsZWN0aW9ubmVyJz5cclxuXHRcdFx0XHRcdFx0PHliLWNhc2VDb2NoZXIgLz5cclxuXHRcdFx0XHRcdDwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+dGFpbGxlPC9wPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+ZW50aWVyIG5hdHVyZWw8L3A+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5zdGF0aXF1ZTwvcD48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPnB1YmxpcXVlPC9wPjwvdGQ+XHJcblx0XHRcdFx0PC90cj5cclxuXHRcdFx0XHQ8dHI+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9J2JvdXRvblNlbGVjdGlvbm5lcic+XHJcblx0XHRcdFx0XHRcdDx5Yi1jYXNlQ29jaGVyIC8+XHJcblx0XHRcdFx0XHQ8L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPmZyw6lxdWVuY2U8L3A+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5lbnRpZXIgbmF0dXJlbDwvcD48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPmNvbnN0YW50PC9wPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+cHJpdsOpZTwvcD48L3RkPlxyXG5cdFx0XHRcdDwvdHI+XHJcblx0XHRcdDwvdGFibGU+XHJcblx0XHRcdDxkaXYgaWQ9XCJlZGl0ZXVyX2VkaXRpb25cIj5cdDwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8c3R5bGU+XHJcblx0XHQ8L3N0eWxlPlxyXG5cdGAsXHJcblx0Y29uc3RydWN0ZXVyIDogKGludGVyZmFjZU3DqHJlLCBlbCkgPT5cclxuXHR7XHJcblx0XHQvL1x0UkFDQ1xyXG5cdFx0dmFyIHFzID0gc2VsID0+IGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcclxuXHRcdC8vdmFyIGV1ID0gX2VubGV2ZXJVbml0ZTtcclxuXHRcdHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0fVxyXG59OyJdfQ==

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	nom: 'modules',
	modele: '\n\t\t<div>Modules: En cours de dev</div>\n\t',
	constructeur: function constructeur(interfaceMère, el) {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS91aS9tb2R1bGVzL2luZGV4LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJub20iLCJtb2RlbGUiLCJjb25zdHJ1Y3RldXIiLCJpbnRlcmZhY2VNw6hyZSIsImVsIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLEdBQ0E7QUFDQ0MsTUFBTSxTQURQO0FBRUNDLHdEQUZEO0FBTUNDLGVBQWUsc0JBQUNDLGFBQUQsRUFBZ0JDLEVBQWhCLEVBQ2YsQ0FDQztBQVJGLENBREEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbSA6ICdtb2R1bGVzJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXY+TW9kdWxlczogRW4gY291cnMgZGUgZGV2PC9kaXY+XHJcblx0YCxcclxuXHRjb25zdHJ1Y3RldXIgOiAoaW50ZXJmYWNlTcOocmUsIGVsKSA9PlxyXG5cdHtcclxuXHR9XHJcbn07Il19

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTc5NDI3NDI0YTMxMDc1NjBmNWMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS8wL3N1cmNvdWNoZU5hdGlmcy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzEvY29udHJhdC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzEvc29uZGVNdXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzIvdHlwZXNEb25uZWVzLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvMi91dGlsaXRhaXJlcy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzMvZWxlbWVudHNQZXJzb25hbGlzw6lzLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvZ3VpSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2xpc3RlRWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL3VpL3ByaW5jaXBhbGUuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9XaW5kb3cuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyQ2FwdHVyZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL3BvaW50ZXJFdmVudEJpbmRpbmcuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyT25Nb3ZlLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvc3lzdGVtZVBvaW50YWdlLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvd2luZG93cy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvYm91dG9uLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9jYXNlQ29jaGVyLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9jaG9peC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvZ2FsbGVyaWUuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL2ludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvbWVudS1vbmdsZXQuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL21lbnUtdGFiLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9zZWxlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS95YmFzdGhpcy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvYWRtaW5pc3RyYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL3VpL2F1dHJlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9hY2N1ZXVpbC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9ub3V2ZWF1UHJvamV0LmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS91aS9lc3BhY2VUcmF2YWlsL3Byb2pldENsYXNzZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvbW9kdWxlcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJvYnRlbmlyUGFyZW50IiwiZWxlbSIsInBhcmVudCIsImhvc3QiLCJwYXJlbnROb2RlIiwib2Zmc2V0UGFyZW50IiwianVzcXVhUmFjaW5lIiwiaSIsInN1aXRlIiwidHJvdXZlcklkUHJvY2hlIiwicmVzdWx0YXQiLCJnZXRBdHRyaWJ1dGUiLCJpZCIsIkVycm9yIiwiZGlzdCIsIm9idGVuaXJOb21UYWciLCJyZWN1ciIsInIiLCJwdXNoIiwidGFnTmFtZSIsIkhUTUxFbGVtZW50IiwicHJvdG90eXBlIiwib2J0ZW5pcklkIiwiaWRQcm9jaGUiLCJlIiwibm9tc1RhZyIsIm5vbXMiLCJub20iLCJqb2luIiwibGVuZ3RoIiwibm9ldWQiLCJ5YmFzdGhpc2RvbSIsInZlcnJvdWlsbGVyIiwicXVhbmRWZXJyb3VpbGxhZ2UiLCJxdWFuZETDqXbDqXJvdWlsbGFnZSIsInliYXN0aGlzIiwiZG9tIiwiZGVza3RvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZXRhaWxzIiwidmVycm91aWxsYWdlIiwiw6ljb3V0ZXVyIiwiZWUiLCJkw6l2ZXJyb3VpbGxhZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYXBwbGlxdWVyQm9yZHVyZSIsImluZm9zIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZWxGcm9tUHQiLCJ4IiwieSIsImRvY3VtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNvbGxpc2lvbnMiLCJoYXV0IiwiZHJvaXRlIiwiYmFzIiwiZ2F1Y2hlIiwiY29sbGlzaW9uQm9yZHVyZSIsImPDtHTDqSIsImVsZW1lbnRUZXN0Q29sbGlzaW9uIiwiZWxTdHlsZUNhbGN1bMOpIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImJvcmRlclRvcFdpZHRoIiwiYm9yZGVyUmlnaHRXaWR0aCIsImJvcmRlckJvdHRvbVdpZHRoIiwiYm9yZGVyTGVmdFdpZHRoIiwic3R5bGUiLCJib3JkZXIiLCJhY2MiLCJoYXV0WSIsInRvcCIsImJhc1kiLCJib3R0b20iLCJtYXgiLCJ3aWR0aCIsInBvc2l0aW9uWCIsImdhdWNoZVgiLCJsZWZ0IiwiRHJvaXRlWCIsInJpZ2h0IiwiWSIsImhlaWdodCIsInBvc2l0aW9uWSIsImNvbnNvbGUiLCJsb2ciLCJyw6lvcmdhbmlzZXIiLCJvZmZzZXRIZWlnaHQiLCJjYWxjdWxlclRhaWxsZVLDqWVsZSIsInN0eWxlSW5pdGlhbGUiLCJyZXN1bHRhdHMiLCJhcmd1bWVudHMiLCJhcmciLCJhdHRyaWJ1dCIsIk9iamVjdCIsImtleXMiLCJzcGxpdCIsInBvcCIsIk51bWJlciIsImNhbGN1bCIsImVyclJlbW9udGVyRU9EIiwiZW9kIiwicmVtb250ZXIiLCJwYXJlbnRFbGVtZW50IiwidW5kZWZpbmVkIiwiZXJyIiwibWVzc2FnZSIsIm9iamV0IiwiZmYiLCJlangiLCJlc3REYW5zRG9jdW1lbnQiLCJvYnRlbmlyU3R5bGVBdXRldXIiLCJzdHlsZUF1dGV1ciIsInN0eWxlU2hlZXRzIiwib2J0ZW5pclN0eWxlQXV0ZXVyRWxlbWVudCIsInJlYWR5U3RhdGUiLCJyw6hnbGVzRWxlbWVudCIsImlGZXVpbGxlIiwibkZldWlsbGVzU3R5bGVzIiwiZmV1aWxsZUFjdHVlbGxlIiwiY3NzUnVsZXMiLCJpUsOoZ2xlQ3NzIiwiblLDqGdsZXNDc3MiLCJyw6hnbGVDc3NBY3R1ZWxsZSIsIm1hdGNoZXMiLCJzZWxlY3RvclRleHQiLCJwYXJjb3VyaXJCYXMiLCJTaGFkb3dSb290IiwiZm9uY3Rpb25UcmFpdHJlbWVudCIsInRyYWl0ZXJFbmZhbnQiLCJlbmZhbnQiLCJjaGlsZHJlbiIsInNoYWRvd1Jvb3QiLCJIVE1MQ29sU3ltYkl0ZXIiLCJIVE1MQ29sbGVjdGlvbiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiaU1heCIsInNvaXMiLCJuZXh0IiwiZG9uZSIsInZhbHVlIiwiTXV0YXRpb25SZWNvcmRTeW1iSXRlciIsIk11dGF0aW9uUmVjb3JkIiwiTm9kZUxpc3RTeW1iSXRlciIsIk5vZGVMaXN0IiwicmVxdWVzdFBvaW50ZXJMb2NrIiwibW96UmVxdWVzdFBvaW50ZXJMb2NrIiwid2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrIiwicG9pbnRlckxvY2tFbGVtZW50IiwibW96UG9pbnRlckxvY2tFbGVtZW50Iiwid2Via2l0UG9pbnRlckxvY2tFbGVtZW50IiwibGllciIsImVycmV1ckxpw6llIiwiX2xpYWlzb24iLCJfbWVzc2FnZSIsInByb3BVdGlsaXPDqWVzIiwicHJvcCIsImZvcm1lbGxlIiwiZXN0RGVmYXV0IiwiZXN0Rm9ybWVsbGUiLCJyZXRvdXIiLCJlc3RSZXRvdXIiLCJmbkNvbnRyYXQiLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyYW1zIiwiZG9pdCIsImRvbm7DqWUiLCJjb250cmF0IiwiZ2VuZXJlckVycmV1ciIsImFzc2VydGlvbiIsInBpbGVPdUZhY2UiLCJhdHRlbmR1IiwicmXDp3UiLCJwcm9wb3NpdGlvbiIsIkFycmF5IiwidmFsZXVyQWRtaXNlIiwibmVkb2l0IiwibGlzdGVuZXJzIiwib2JzZXJ2ZXJDYWxsYmFjayIsIm11dGF0aW9ucyIsIm9ic2VydmVyIiwibXV0YXRpb24iLCJ0YXJnZXQiLCJNdXRhdGlvbk9ic2VydmVyIiwibmV3IiwibXV0YXRpb25PYnNlcnZlckluaXQiLCJjYWxsYmFjayIsIm9ic2VydmUiLCJuZXdBc0F0dHJpYnV0ZXMiLCJhdHRyTGlzdCIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzRmlsdGVyIiwibmV3QXNBdHRyaWJ1dGVFeHBlY3RlZCIsImF0dHIiLCJuYW1lIiwiZXhwZWN0ZWQiLCJuZXdBc1N0eWxlRXhwZWN0ZWQiLCJpc0VxdWFsIiwidHlwZXNEb25uZWVzIiwiUmVmZXJlbmNlIiwicmVmTWF4IiwicmVmTGlicmUiLCJvYnRlbmlyIiwic2hpZnQiLCJsaWJlcmVyIiwicmVmIiwibGlicmUiLCJ0YWlsbGUiLCJvY2N1cGUiLCJ0eXBlIiwiSXRlcmF0ZXVySW50ZXJuZUxpc3RlIiwicmVmcyIsInJlcHJlc2VudGF0aW9uIiwiaUFjdHVlbCIsInN1aXZhbnQiLCJ2YWxldXIiLCJjbGUiLCJsaXN0ZV9lbFZlcnNSZWYiLCJsaXN0ZUl0ZXJhdGV1ciIsImVsZW1lbnQiLCJMaXN0ZSIsImFqb3V0ZXIiLCJzdXBwcmltZXIiLCJjb250aWVudCIsImNvZXJjaXNpb24iLCJ2ZXJzVGFibGVhdSIsIml0ZXJhdGV1ciIsIkxpc3RlVVIyIiwiZW1wbGFjZW1lbnRzIiwib3BlcmF0aW9uIiwiZWxlbWVudFByZXNlbnQiLCJuRWxlbWVudHMiLCJwb3VyRGUiLCJmbiIsIkxpc3RlVVIzIiwiRGljdGlvbm5haXJlIiwiaW5kZXgiLCJtb2RpZmllciIsIl9pQWN0IiwiX3RhYiIsIkludGVyZmFjZVR5cMOpZSIsInNpZ25hdHVyZSIsInZhbGlkZXIiLCJUeXBlRXJyb3IiLCJzaWduYXR1cmVUZXN0w6kiLCJub21Qcm9wIiwiaW5jbHVkZXMiLCJwcm9wcmnDqXTDqVRlc3TDqWUiLCJzaWduYXR1cmVUZXN0w6llIiwiSW50ZXJmYWNlTm9uVHlww6llIiwiU09JUyIsImNvbXByaXMiLCJjb21wcmlzSW50ZXJ2YWxlIiwiaW50ZXJ2YWxlMCIsImludGVydmFsZTEiLCJlbnRpZXIwIiwiZW50aWVyMSIsImNvbXByaXNJbnRlcnZhbGVFbnRpZXIiLCJpbnRlcnZhbGUiLCJjb21wcmlzRW50aWVyIiwib3BlcmFuZGUwIiwib3BlcmFuZGUxIiwiY2hhw65uZXIiLCJKU09OIiwic3RyaW5naWZ5IiwiV0hFTiIsImludGVydmFsIiwid29ya2VyIiwibGlzdGVuZXIiLCJjb25kaXRpb24iLCJmaWx0ZXIiLCJlbCIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImdyYW5kZXVycyIsImVubGV2ZXJVbml0w6kiLCJncmFuZGV1ciIsInNsaWNlIiwiY2FsbCIsInJldmVyc2UiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJ1bml0w6lzIiwiYWpvdXRlclVuaXTDqSIsImNoYWluZSIsInVuaXTDqSIsImludGVycHJldGV1ckh0bWwiLCJpbnRlcnByZXRldXJEb20iLCJET01QYXJzZXIiLCJwYXJzZUZyb21TdHJpbmciLCJjaGFpbmVIdG1sIiwiZmFicmlxdWUiLCJlc3BhY2VEZU5vbSIsImRpY3Rpb25uYWlyZUVsw6ltZW50IiwiSUVsZW1lbnQiLCJjb25zdHJ1Y3RldXIiLCJGdW5jdGlvbiIsInRlbXBsYXRlIiwicGFyYW3DqHRyZXMiLCJzb2lzQ2xhc3NlRWxlbWVudCIsInByb3RvdHlwZUh0bWxFbGVtZW50IiwiY3JlYXRlIiwiSW50YW5jZUVsZW1lbnRIdG1sIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsImNyZWF0ZVNoYWRvd1Jvb3QiLCJhcHBlbmRDaGlsZCIsIm1vZGVsZSIsImNsb25lTm9kZSIsImNvbnRlbnQiLCJvYnRlbmlyUHJvdG90eXBlIiwibW9kZWxlVGVtcG9yYWlyZSIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJjcmVhdGVkQ2FsbGJhY2siLCJhdHRhY2hlZENhbGxiYWNrIiwiZGV0YWNoZWRDYWxsYmFjayIsInJlZ2lzdGVyRWxlbWVudCIsImFzc2lnbiIsImNvbmZpZyIsImNvbnRlbmV1ciIsImdldEVsZW1lbnRCeUlkIiwic3lzdGVtZVBvaW50YWdlIiwiY3JlYXRlRWxlbWVudCIsInBvc2l0aW9uIiwiekluZGV4Iiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSIsIndpbmRvd3MiLCJndWlFZGkiLCJXaW5kb3ciLCJwb3MiLCJkaW0iLCJ0aXRyZSIsImd1aUVkaTIiLCJlc3BhY2VEZVRyYXZhaWxEb20iLCJkZWNhbGFnZSIsInV0aWxpdGFpcmVzIiwiaW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsIiwibWVudUVsZW1lbnQiLCJjaWJsZSIsImRldGFpbCIsImFmZmljaGVyIiwibm9tT25nbGV0IiwiYWFhVGVzdERvbSIsImVzcGFjZVRyYXZhaWxEb20iLCJpbnRlcmZhY2UyIiwia2FrYSIsImJvZHkiLCJsYXN0Q2hpbGQiLCJ6aWd6YWciLCJvcHRpb25zIiwic2VsZiIsInRpdHJlTWF4IiwiZG9tRmVuZXRyZSIsImNsb3NlIiwicmVtb3ZlIiwibGlzdGUiLCJkaW1tZW5zaW9ubmVyIiwibm9tbWVyIiwidGV4dENvbnRlbnQiLCJjb2xpc2lvbkNvbnRpbnVlIiwicG9zaXRpb25uZXIiLCJjb2xpc2lvbiIsImZlbmV0cmUiLCJhcHAiLCJkZXBsYWNlciIsImJsb3F1ZXIiLCJzZXRUaW1lb3V0IiwiZMOpYmxvcXVlciIsImZlbmV0cmVIYXV0RG9tIiwidG9GaXJzdFBsYW4iLCJpbml0aWFsaXNlckTDqXBsYWNlbWVudCIsIm5vZGVOYW1lIiwiY2hhbmdlQ3Vyc29yIiwiYnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJidXR0b24iLCJjb250ZW51RG9tIiwiX2NsYXNzZV8iLCJjcsOpZXJFbMOpbWVudCIsImRpdiIsInRhYiIsImNsYXNzTmFtZSIsInNyYyIsImJvcmRlckJvdHRvbSIsIm1hcmdpbiIsInZlcnRpY2FsQWxpZ24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3hTaGFkb3ciLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJwb2ludGVyTG9jayIsImV2ZW50IiwicXVlcnlDdXJzb3IiLCJzaGFyZWQiLCJpc0hhbmRsZWQiLCJjYW52YXMiLCJvblBvaW50ZXJMb2NrQ2hhbmdlIiwiYmluZGVkRXZlbnRzIiwiZXZlbnRCaW5kVG9Ob2RlIiwiaXNUcnVzdGVkIiwibm9kZSIsImdldE5vZGVGcm9tQ3Vyc29yIiwiZGlzcGF0Y2hFdmVudCIsIk1vdXNlRXZlbnQiLCJJRXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImZvY3VzIiwiZWxlbVByZWNlbmRlbnQiLCJvbk1vdXNlTW92ZSIsImlzTG9ja2VkIiwiZXZlbmVtZW50IiwibW92ZW1lbnRYIiwibW92ZW1lbnRZIiwiYXJlYVNpemUiLCJjdXJzb3IiLCJlbEFjdCIsImV2TW91c2VPdmVyIiwiQ3VzdG9tRXZlbnQiLCJldk1vdXNlT3V0IiwiY2hlbWluY3Vyc29ycyIsInNpbXVsZSIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiY29tcG9zZWQiLCJwb2ludGVyRXZlbnQiLCJzZXRQcm9wZXJ0eSIsImTDqWNhbGFnZSIsInR5cGVjdXJzb3IiLCJub3JtYWwiLCJkZWNsZW5jaGVyIiwiY3Vyc29yQWN0dWVsIiwiY3Vyc29yQmxvcXXDqSIsImVzdEFjdGl2YXRpb24iLCJxdWFuZE1vdXZlbWVudCIsImdldENvbnRleHQiLCJjcyIsImTDqWNhbGFnZVB4IiwiZMOpcGxhY2VyIiwiw6l0YXQiLCJwb2ludGV1clBvc2l0aW9uIiwiZmVuZXRyZUVuRMOpcGxhY2VtZW50IiwiaW5kZXhQcmVtaWVyUGxhbiIsIndpbmRvdyIsImVsQm91dG9uRXh0ZXJuZSIsImVsQm91dG9uSW50ZXJuZSIsImJvdXRvbiIsImNoYW5nZXJMYWJlbCIsInRleHRlIiwiZW5sZXZlckVmZmV0cyIsImNoYXJ0ZVVpIiwiZ3Jpc0NsYWlyIiwiZ3Jpc0ZvbmNlIiwic3R5bGVFeHRlcm5lIiwiZWxDb2NoZXIiLCJzZXRBdHRyaWJ1dGUiLCJlbENob2l4Iiwib3B0aW9uIiwiZWxlbWVudENvbnRlbmV1ciIsImNob2l4IiwiYWpvdXRlckNob2l4IiwiZWxJbnRlcmZhY2UiLCJxcyIsInNlbCIsIl9kb25uZWVzIiwic3BlY2lhbGlzYXRpb24iLCJzcGVjaWFsaXNlciIsInBhcmFtIiwiJGRvbm5lZXMiLCJhcmdUYWJsZWF1IiwiZG9ubmVlIiwiYXV0b3Jpc2UiLCJucEF1dG9yaXNlIiwiZWxHYWwiLCJkb25uZWVzT3Jkb25uZWVzIiwib3JnYW5pc2F0ZXVyIiwidmlnbmV0dGUiLCJub21icmVWaWduZXR0ZSIsImxlY3RldXIiLCJpbnRlcmZhY2VzIiwiSUludGVyZmFjZU9iamV0IiwidnVlIiwiaW50ZXJmYWNlSWQiLCJvYmpldEludGVyZmFjZVJlw6d1IiwiX0VSUkVVUiIsImluaXRpYWxpc8OpIiwiZGVmYXV0IiwiJG5vbSIsIm5hdmlnYXRpb24iLCJpbml0aWFsaXNldXIiLCJ2dWVJbnRlcmZhY2UiLCJsaXN0ZUludGVyZmFjZXMiLCJpZEludCIsImVsT25nbGV0IiwiZWxlbWVudE1lbnUiLCJlbGVtZW50TWVudU9uZ2xldCIsImhhc0F0dHJpYnV0ZSIsImV2ZW5lbWVudEFmZmljaGFnZSIsImRpc3BsYXkiLCJham91dGVyT25nbGV0IiwiZWxUYWIiLCJ2dWVJbnRlcm5lIiwiZWxNZW51IiwiaVJlZiIsIm1lbnUiLCJ4RGlzcG9ubmlibGUiLCJiYXNlWCIsImRvbUVsZW1lbnQiLCJhdmVjTGlhaXNvbiIsImZsZXhHcm93IiwiZmxleEJhc2lzIiwiZWxlbWVudENsaWVudFJlY3QiLCJwb2ludGV1ckVsZW1lbnQiLCJTdXBwcmltZXJPbmdsZXQiLCJyZW1vdmVDaGlsZCIsIm9uZ2xldHMiLCJzZWxlY3Rpb25Eb21FeHRlcm5lIiwic2VsZWN0aW9uT3V2ZXJ0ZSIsIlN1cHByaW1lckNob2l4IiwiY29tcG9zYW50RG9tIiwic2VsZWN0aW9uRG9tSW50ZXJuZSIsIm1pbldpZHRoIiwibXV0YXRpb25TZW5zb3IiLCJ0aXRyZURvbSIsImxhcmdldXJSw6llbGxlVGl0cmUiLCJsYXJnZXVyUsOpZWxsZVNlbGVjdGlvbiIsIm9mZnNldFdpZHRoIiwibGFyZ2V1ck9jY3Vww6kiLCJvdXRpbHNFbmxldmVyUHgiLCJmYWJyaXF1ZUVsZW1lbnQiLCJmb25kIiwidmVydCIsInJvdWdlIiwiZGVtYXJldXIiLCJjb25mIiwiRmFicmlxdWVZYmFzdGhpcyIsIm5zIiwib25Mb2FkZWQiLCJpbnRlcmZhY2VNw6hyZSIsImV1IiwiZWxOb3V2IiwiZWxHZXN0IiwiZWxDb250IiwiZWxHYWxsIiwiY3NFbEF1Iiwibm91diIsInZ1ZU5vdXZlYXVQcm9qZXQiLCJyZXF1aXJlIiwidnVlQWNjdWV1aWwiLCJ2dWVQcm9qZXRDbGFzc2UiLCJ2YWwiLCJhbnUiLCJhdXRfdHlwZSIsImF1dF9hdXRyZXMiLCJhdXRyZXNfY3AiLCJjc0VsQ29udCIsImVsUHJvamV0IiwiYXV0X2F1dHJlc19jcCIsImRlc2MiLCJkZXNjQ3MiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNB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LEdBQTZCcFcsU0FBU3FhLFFBQVQsQ0FBa0JDLFNBQS9DO0FBQ0EyRyxPQUFLamYsS0FBTCxDQUFXZSxNQUFYLEdBQXNCK2MsR0FBR3ZHLEdBQUcwQixHQUFHLFVBQUgsQ0FBSCxFQUFtQmxZLE1BQXRCLElBQWdDK2MsR0FBR3ZHLEdBQUcvWixHQUFILEVBQVF1RCxNQUFYLENBQWpDLEdBQXdELEVBQXpELEdBQStELElBQW5GO0FBQ0E7QUFuTEYsQ0FEQTs7Ozs7Ozs7OztBQ0RBa0YsT0FBT0MsT0FBUCxHQUNBO0FBQ0MxSSxNQUFNLGNBRFA7QUFFQzBSLHNrREFGRDtBQXFEQ1osZUFBZSxzQkFBQ3VQLGFBQUQsRUFBZ0IvUSxFQUFoQixFQUNmO0FBQ0M7QUFDQSxNQUFJbU0sS0FBSyxTQUFMQSxFQUFLO0FBQUEsVUFBT25NLEdBQUd5QyxhQUFILENBQWlCMkosR0FBakIsQ0FBUDtBQUFBLEdBQVQ7QUFDQTtBQUNBLE1BQUkzQixLQUFLNVgsZ0JBQVQ7QUFDQTtBQTNERixDQURBOzs7Ozs7Ozs7O0FDQUFzRyxPQUFPQyxPQUFQLEdBQ0E7QUFDQzFJLE1BQU0sU0FEUDtBQUVDMFIsd0RBRkQ7QUFNQ1osZUFBZSxzQkFBQ3VQLGFBQUQsRUFBZ0IvUSxFQUFoQixFQUNmLENBQ0M7QUFSRixDQURBIiwiZmlsZSI6ImJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTc5NDI3NDI0YTMxMDc1NjBmNWMiLCIoKCkgPT5cclxue1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHRjb25zdCBvYnRlbmlyUGFyZW50ID0gZWxlbSA9PlxyXG5cdHtcclxuXHRcdHJldHVybiAoZWxlbS5wYXJlbnQpID9cdGVsZW0ucGFyZW50XHJcblx0XHRcdDogKGVsZW0uaG9zdCkgP1x0XHRlbGVtLmhvc3RcclxuXHRcdFx0OiAoZWxlbS5wYXJlbnROb2RlKSA/XHRlbGVtLnBhcmVudE5vZGVcclxuXHRcdFx0OiAoZWxlbS5vZmZzZXRQYXJlbnQpID9cdGVsZW0ub2Zmc2V0UGFyZW50XHJcblx0XHRcdDogZmFsc2U7XHJcblx0fTtcclxuXHRcdFx0XHJcblx0Y29uc3QganVzcXVhUmFjaW5lID0gKGVsZW0sIGkpID0+XHJcblx0e1xyXG5cdFx0aSA9IGkgPyBpKzEgOiAwO1xyXG5cdFx0Y29uc3Qgc3VpdGUgPSBvYnRlbmlyUGFyZW50KGVsZW0pO1xyXG5cdFx0cmV0dXJuICghc3VpdGUpID8gW2ksIGVsZW1dIDoganVzcXVhUmFjaW5lKHN1aXRlLCBpKTtcclxuXHR9O1xyXG5cdGNvbnN0IHRyb3V2ZXJJZFByb2NoZSA9IChlbGVtLCBpKSA9PlxyXG5cdHtcclxuXHRcdGkgPSBpID8gaSsxIDogMDtcclxuXHRcdHZhciBzdWl0ZTtcclxuXHRcdGNvbnN0IHJlc3VsdGF0ID0ge307XHJcblx0XHRcclxuXHRcdGlmKGVsZW0uZ2V0QXR0cmlidXRlKSByZXN1bHRhdC5pZCA9IGVsZW0uZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cdFx0aWYoIXJlc3VsdGF0LmlkKVxyXG5cdFx0e1xyXG5cdFx0XHRzdWl0ZSA9IG9idGVuaXJQYXJlbnQoZWxlbSk7XHJcblx0XHRcdGlmKCFzdWl0ZSkgdGhyb3cgbmV3IEVycm9yO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSByZXN1bHRhdC5kaXN0ID0gaTtcclxuXHRcdHJldHVybiAocmVzdWx0YXQuaWQpID8gcmVzdWx0YXQgOiB0cm91dmVySWRQcm9jaGUoc3VpdGUsIGkpO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IG9idGVuaXJOb21UYWcgPSAoZWxlbSwgcmVjdXIsIHIpID0+XHJcblx0e1xyXG5cdFx0ciA9IHIgPyByIDogW107XHJcblx0XHRyLnB1c2goKGVsZW0uaG9zdCkgPyAnc2hhZG93Um9vdCcgOiBlbGVtLnRhZ05hbWUpO1xyXG5cdFx0cmVjdXItLTtcclxuXHRcdHJldHVybiAoIXJlY3VyID4gMCkgPyByIDogb2J0ZW5pck5vbVRhZyhvYnRlbmlyUGFyZW50KGVsZW0pLCByZWN1ciwgcik7XHJcblx0fTtcclxuXHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLm9idGVuaXJJZCA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRjb25zdCBpZCA9IHt9O1xyXG5cdFx0dmFyIGlkUHJvY2hlO1xyXG5cdFx0Ly9cdE5PVEVTIE9idGVudGlvbiBsZSBsJ2lkIGxlIHBsdXMgcHJvY2hlIGFpbnNpIHF1ZSBsZSBuYiBkZSBub2V1ZCBwYXJjb3VydS5cclxuXHRcdHRyeVxyXG5cdFx0e1x0aWRQcm9jaGUgPSB0cm91dmVySWRQcm9jaGUodGhpcywgMCk7XHR9XHJcblx0XHQvL1x0Tk9URVMgSWwgZXN0IHBvc3NpYmxlIHF1J2F1Y3VuIElEIG5lIHNvaXQgcsOpY3Vww6lyw6kgXHJcblx0XHQvL1x0Tk9URVMgRGFucyBjZSBjYXMgcsOpY3Vww6lyYXRpb24gZGVzIDUgcHJlbWllcnMgdGFnLlxyXG5cdFx0Ly9cdE5PVEVTIExhIGRpc3RhbmNlIHNlcmEgdmFsdcOpIMOgIGxhIHNvbW1lIGRlcyB0YWlsbGVzIGRlcyBub21zIGRlcyBub2V1ZHMuXHJcblx0XHRjYXRjaChlKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgbm9tc1RhZyA9IG9idGVuaXJOb21UYWcodGhpcywgNSksXHJcblx0XHRcdFx0bm9tcyA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IG5vbSBvZiBub21zVGFnKVxyXG5cdFx0XHRcdG5vbXMucHVzaChub20gfHwgJ3VuZGVmJyk7XHJcblx0XHRcdGlkUHJvY2hlID0geyBpZCA6IG5vbXMuam9pbignJyksICBkaXN0IDogbm9tcy5sZW5ndGh9O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZC5pZCA9IGlkUHJvY2hlLmlkO1xyXG5cdFx0aWQuZGlzdCA9IGlkUHJvY2hlLmRpc3Q7XHJcblx0XHRpZC5ub2V1ZCA9ICh0aGlzLmhvc3QpID8gJ3NoYWRvd1Jvb3QnIDogdGhpcy50YWdOYW1lO1xyXG5cdFx0XHRcdFxyXG5cdFx0cmV0dXJuIFtpZC5pZCwgaWQuZGlzdCwgaWQubm9ldWRdLmpvaW4oJycpO1xyXG5cdH07XHJcblx0LyoqXHJcblx0XHQocXVhbmRWZXJyb3VpbGxhZ2UsIHF1YW5kRMOpdsOpcm91aWxsYWdlKSA9PiB2b2lkXHJcblx0XHRTcMOpY2lmaWUgbGUgdmVycm91aWxsYWdlIGQndW4gw6lsw6ltZW50LlxyXG5cdFx0SWwgbid5IHBldXQgeSBhdm9pciBkZXV4IHZlcm91cyBlbiBtw6ptZSB0ZW1wcyBzaSBpbHMgbmUgZm9udCBwYXMgcGFydGlzIGRlIGxhIG3Dqm1lIGJyYW5jaGUgZG9tLihpLmUgZGV1eCDDqWzDqW1lbnQgbidheWFudCBwYXMgZGUgbGllbiBkZSBwYXJlbnTDqSlcclxuXHRcdEBxdWFuZFZlcnJvdWlsbGFnZShlbGVtZW50LCBldmVuZW1lbnRDbGlxdWUpID0+IGFwcGVsw6kgbG9yc3F1ZSB1biDDqWzDqW1lbnQgZXN0IHbDqXJyb3VpbGzDqShpbCBhIMOpdMOpIGNsaXF1w6kpXHJcblx0XHRAcXVhbmREw6l2w6lyb3VpbGxhZ2UoZWxlbWVudCwgZXZlbmVtZW50Q2xpcXVlKSBhcHBlbMOpIGxvcnNxdWUgdW4gw6lsw6ltZW50IGVzdCBkw6l2w6lyb3VpbGzDqSBcclxuXHQqKi9cclxuXHR2YXIgeWJhc3RoaXNkb20gPSBudWxsO1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS52ZXJyb3VpbGxlciA9IGZ1bmN0aW9uKHF1YW5kVmVycm91aWxsYWdlLCBxdWFuZETDqXbDqXJvdWlsbGFnZSlcclxuXHR7XHJcblx0XHRpZigheWJhc3RoaXNkb20pIHliYXN0aGlzZG9tID0geWJhc3RoaXMuZG9tLmRlc2t0b3A7XHJcblx0XHRsZXQgdmVycm91aWxsZXIgPSBmYWxzZTtcclxuXHRcdFxyXG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYodHlwZW9mIGUuZGV0YWlscyAhPT0gJ29iamVjdCcpIGUuZGV0YWlscyA9IHt9O1xyXG5cdFx0XHRlLmRldGFpbHMudmVycm91aWxsYWdlID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdGlmKHZlcnJvdWlsbGVyKSByZXR1cm47XHJcblx0XHRcdHZlcnJvdWlsbGVyID0gdHJ1ZTtcclxuXHRcdFx0cXVhbmRWZXJyb3VpbGxhZ2UodGhpcywgZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRjb25zdCDDqWNvdXRldXIgPSAoZWUpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRsZXQgZMOpdmVycm91aWxsYWdlID0gZmFsc2U7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYodHlwZW9mIGVlLmRldGFpbHMgIT09ICdvYmplY3QnKSBkw6l2ZXJyb3VpbGxhZ2UgPSB0cnVlO1xyXG5cdFx0XHRcdGVsc2UgaWYoIWVlLmRldGFpbHMudmVycm91aWxsYWdlKSBkw6l2ZXJyb3VpbGxhZ2UgPSB0cnVlO1xyXG5cdFx0XHRcdGVsc2UgaWYoZWUuZGV0YWlscy52ZXJyb3VpbGxhZ2UgIT09IHRoaXMpIGTDqXZlcnJvdWlsbGFnZSA9IHRydWU7IFxyXG5cdFx0XHRcclxuXHRcdFx0XHRpZihkw6l2ZXJyb3VpbGxhZ2UpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmVycm91aWxsZXIgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHliYXN0aGlzZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgw6ljb3V0ZXVyLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRxdWFuZETDqXbDqXJvdWlsbGFnZSh0aGlzLCBlZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0eWJhc3RoaXNkb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCDDqWNvdXRldXIsIGZhbHNlKTtcclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cdFxyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hcHBsaXF1ZXJCb3JkdXJlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGNvbnN0IGluZm9zID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdGNvbnN0IGVsRnJvbVB0ID0gKHgsIHkpID0+IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XHJcblx0XHRjb25zdCBjb2xsaXNpb25zID1cclxuXHRcdHtcclxuXHRcdFx0aGF1dCA6IGZhbHNlLFxyXG5cdFx0XHRkcm9pdGUgOiBmYWxzZSxcclxuXHRcdFx0YmFzIDogZmFsc2UsXHJcblx0XHRcdGdhdWNoZSA6IGZhbHNlXHJcblx0XHR9O1xyXG5cdFx0Y29uc3QgY29sbGlzaW9uQm9yZHVyZSA9IChjw7R0w6ksIGVsZW1lbnRUZXN0Q29sbGlzaW9uKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCBlbFN0eWxlQ2FsY3Vsw6kgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnRUZXN0Q29sbGlzaW9uKTtcclxuXHRcdFx0aWYoY8O0dMOpID09PSAnaGF1dCcpIGlmKGVsU3R5bGVDYWxjdWzDqS5ib3JkZXJUb3BXaWR0aCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdGVsc2UgaWYoY8O0dMOpID09PSAnZHJvaXRlJykgaWYoZWxTdHlsZUNhbGN1bMOpLmJvcmRlclJpZ2h0V2lkdGgpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRlbHNlIGlmKGPDtHTDqSA9PT0gJ2JhcycpIGlmKGVsU3R5bGVDYWxjdWzDqS5ib3JkZXJCb3R0b21XaWR0aCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdGVsc2UgaWYoY8O0dMOpID09PSAnZ2F1Y2hlJykgaWYoZWxTdHlsZUNhbGN1bMOpLmJvcmRlckxlZnRXaWR0aCkgcmV0dXJuIHRydWU7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXMuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCBibGFjayc7XHJcblx0XHQvLyBSZWNoZXJjaGUgZGUgY29sbGlzaW9uXHJcblx0XHR7XHJcblx0XHRcdGxldCBhY2MgPSAwO1xyXG5cdFx0XHQvLyBIYXV0LCBiYXNcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBoYXV0WSA9IGluZm9zLnRvcCAtIDE7XHJcblx0XHRcdFx0bGV0IGJhc1kgPSBpbmZvcy5ib3R0b20gKzE7XHJcblx0XHRcdFx0bGV0IG1heCA9ICBpbmZvcy54ICsgaW5mb3Mud2lkdGg7XHJcblx0XHRcdFx0Zm9yKGxldCBwb3NpdGlvblggPSBpbmZvcy54OyBwb3NpdGlvblggPCBtYXg7IHBvc2l0aW9uWCsrKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmKCFjb2xsaXNpb25zLmhhdXQpIGNvbGxpc2lvbnMuaGF1dCA9IGNvbGxpc2lvbkJvcmR1cmUoJ2hhdXQnLCBlbEZyb21QdChwb3NpdGlvblgsIGhhdXRZKSwgYWNjKyspO1xyXG5cdFx0XHRcdFx0aWYoIWNvbGxpc2lvbnMuYmFzKSBjb2xsaXNpb25zLmJhcyA9IGNvbGxpc2lvbkJvcmR1cmUoJ2JhcycsIGVsRnJvbVB0KHBvc2l0aW9uWCwgYmFzWSksIGFjYysrKTtcclxuXHRcdFx0XHRcdGlmKGFjYyA+IDEpIGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBHYXVjaGUsIGRyb2l0ZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IGdhdWNoZVggPSBpbmZvcy5sZWZ0IC0gMTtcclxuXHRcdFx0XHRsZXQgRHJvaXRlWCA9IGluZm9zLnJpZ2h0ICsxO1xyXG5cdFx0XHRcdGxldCBtYXggPSAgaW5mb3MuWSArIGluZm9zLmhlaWdodDtcclxuXHRcdFx0XHRmb3IobGV0IHBvc2l0aW9uWSA9IGluZm9zLnk7IHBvc2l0aW9uWSA8IG1heDsgcG9zaXRpb25ZKyspXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYoIWNvbGxpc2lvbnMuZ2F1Y2hlKSBjb2xsaXNpb25zLmdhdWNoZSA9IGNvbGxpc2lvbkJvcmR1cmUoJ2dhdWNoZScsIGVsRnJvbVB0KGdhdWNoZVgsIHBvc2l0aW9uWSksIGFjYysrKTtcclxuXHRcdFx0XHRcdGlmKCFjb2xsaXNpb25zLmRyb2l0ZSkgY29sbGlzaW9ucy5kcm9pdGUgPSBjb2xsaXNpb25Cb3JkdXJlKCdkcm9pdGUnLCBlbEZyb21QdChEcm9pdGVYLCBwb3NpdGlvblkpLCBhY2MrKyk7XHJcblx0XHRcdFx0XHRpZihhY2MgPiAzKSBicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY29uc29sZS5sb2coJ2NvbGxpc2lvbjogJywgY29sbGlzaW9ucyk7XHJcblx0XHQvLyBBZGFwdGF0aW9uXHJcblx0XHRpZihjb2xsaXNpb25zLmhhdXQpXHJcblx0XHR7XHJcblx0XHRcdGNvbnNvbGUubG9nKCd2ZXJ0UG9tbWUnKTtcclxuXHRcdFx0Ly90aGlzLnN0eWxlLnRvcCA9IChpbmZvcy50b3AgLSAxKSArICdweCc7XHJcblx0XHR9XHJcblx0XHRpZihjb2xsaXNpb25zLmRyb2l0ZSkgdGhpcy5zdHlsZS53aWR0aCA9IChpbmZvcy53aWR0aCArIDEpICsgJ3B4JztcclxuXHRcdGlmKGNvbGxpc2lvbnMuYmFzKSB0aGlzLnN0eWxlLmhlaWdodCA9IChpbmZvcy5oZWlnaHQgKyAxKSArICdweCc7XHJcblx0XHRpZihjb2xsaXNpb25zLmdhdWNoZSkgdGhpcy5zdHlsZS5sZWZ0ID0gKGluZm9zLmxlZnQgLSAxKSArICdweCc7XHJcblx0XHRcclxuXHR9O1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5yw6lvcmdhbmlzZXIgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc29sZS5sb2codGhpcy5vZmZzZXRIZWlnaHQpO1xyXG5cdH07XHJcblx0LyoqXHJcblx0Y2FsY3VsZXJUYWlsbGVSw6llbGUoe2hlaWdodCA6ICcxMDAlJ30sIHtoZWlnaHQgOiAnNGVtJ30sIHt3aWR0aCA6ICcwLjVlbSd9LCAuLi4pXHJcblx0QEBhcmd1bWVudHNcclxuXHR7IG5vbUF0dHJpYnV0Q3NzIDogJ3RhaWxsZVZvdWx1ZSd9XHJcblx0QEBSZXRvdXJcclxuXHRbe1xyXG5cdFx0Y2FsY3VsXHQlY2hhaW5lICNhdHRyaWJ1dCA6IHRhaWxsZVZvdWx1ZVxyXG5cdFx0cmVzdWx0YXRcdCVlbnRpZXIgI2xlIHLDqXN1bHRhdCBkdSBjYWxjdWxcclxuXHR9LCAuLl1cclxuXHQqKi9cclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY2FsY3VsZXJUYWlsbGVSw6llbGUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc3Qgc3R5bGVJbml0aWFsZSA9IGdldENvbXB1dGVkU3R5bGUodGhpcyk7XHJcblx0XHRjb25zdCByZXN1bHRhdHMgPSBbXTtcclxuXHRcdGZvcihsZXQgYXJnIG9mIGFyZ3VtZW50cylcclxuXHRcdHtcclxuXHRcdFx0bGV0IGF0dHJpYnV0ID0gT2JqZWN0LmtleXMoYXJnKTtcclxuXHRcdFx0dGhpcy5zdHlsZVthdHRyaWJ1dF0gPSBhcmdbYXR0cmlidXRdO1xyXG5cdFx0XHR0aGlzLnLDqW9yZ2FuaXNlcigpO1xyXG5cdFx0XHQvKlxyXG5cdFx0XHRcdFLDqWN1cMOpcmF0aW9uIGR1IHLDqXN1bHRhdCBhdmVjIGdldENvbXB1dGVkU3R5bGVcclxuXHRcdFx0XHRQdWlzIHRyYW5zZm9ybWF0aW9uIGVuIHRhYmxlYXUgYWZpbiBkZSBwb3V2b2lyIG9ww6lyZXIgZmFjaWxlbWVudCBzdXIgbGVzIGNhcmFjdMOocmVzLlxyXG5cdFx0XHRcdEJ1dDogcmV0b3VuZXIgdW4gbm9tYnJlIGF1IGxpZXUgZGUgcmV0b3VybmVyIGxhIHRhaWxsZSBzdWl2aWUgZGUgbCd1bml0w6kgZW4gcGl4ZWwuXHJcblx0XHRcdFx0U3VwcHJlc3Npb24gZGVzIGRldXggZGVybmllcmVzIGNhc2VzIGR1IHRhYmxlYXUsIHJlc3BlY3RpdmVtZW50ICdwJyBzdWl2aSBkZSAneCdcclxuXHRcdFx0XHRSZXRyYW5zZm9ybWF0aW9uIGR1IHRhYmxlYXUgZW4gY2hhw65uZSBwdWlzIGFwcGxpY2F0aW9uIGR1IHLDqXN1bHRhdCDDoCBOdW1iZXJcclxuXHRcdFx0Ki9cclxuXHRcdFx0bGV0IHJlc3VsdGF0ID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKVthdHRyaWJ1dF0uc3BsaXQoJycpO1xyXG5cdFx0XHRyZXN1bHRhdC5wb3AoKTtcclxuXHRcdFx0cmVzdWx0YXQucG9wKCk7XHJcblx0XHRcdHJlc3VsdGF0ID0gTnVtYmVyKHJlc3VsdGF0LmpvaW4oJycpICk7XHJcblx0XHRcdC8qXHJcblx0XHRcdFx0QWpvdXQgZHUgcsOpc3VsdGF0IGRhbnMgbGEgbGlzdGVyIGRlcyByw6lzdWx0YXRzXHJcblx0XHRcdCovXHJcblx0XHRcdHJlc3VsdGF0cy5wdXNoKHsgY2FsY3VsIDogYXR0cmlidXQgKyAnOicgKyBhcmdbYXR0cmlidXRdLCByZXN1bHRhdH0pO1xyXG5cdFx0XHQvKlxyXG5cdFx0XHRcdFJlbWlzZSBlbiBwbGFjZSBkdSBzdHlsZSBpbml0aWFsLlxyXG5cdFx0XHQqL1xyXG5cdFx0XHR0aGlzLnN0eWxlW2F0dHJpYnV0XSA9IHN0eWxlSW5pdGlhbGVbYXR0cmlidXRdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdGF0cztcclxuXHR9O1xyXG5cdFxyXG5cdC8vIGVvZCA9PiBlbmQgb2YgZGF0YVxyXG5cdGNvbnN0IGVyclJlbW9udGVyRU9EID0ge2VvZCA6IHRydWV9O1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5yZW1vbnRlciA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRsZXQgcGFyZW50ID1cdCh0aGlzLnBhcmVudE5vZGUpPyB0aGlzLnBhcmVudE5vZGU6XHJcblx0XHRcdFx0XHRcdFx0KHRoaXMucGFyZW50RWxlbWVudCk/IHRoaXMucGFyZW50RWxlbWVudDpcclxuXHRcdFx0XHRcdFx0XHQodGhpcy5ob3N0KT8gdGhpcy5ob3N0IDogdW5kZWZpbmVkO1xyXG5cdFx0aWYocGFyZW50ID09PSB1bmRlZmluZWQpXHJcblx0XHR7XHJcblx0XHRcdGxldCBlcnIgPSBuZXcgRXJyb3I7XHJcblx0XHRcdGVyci5kZXRhaWxzID0ge307XHJcblx0XHRcdGlmKHRoaXMgPT09IGRvY3VtZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZXJyLm1lc3NhZ2UgPSAnZW9kJztcclxuXHRcdFx0XHRlcnIuZGV0YWlscy5lb2QgPSB0cnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgZXJyLm1lc3NhZ2UgPSdQYXJlbnQgaW5jb25udSc7XHJcblx0XHRcdFxyXG5cdFx0XHRlcnIuZGV0YWlscy5vYmpldCA9IHRoaXM7XHJcblx0XHRcdHRocm93IGVycjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH07XHJcblx0bGV0IGZmID0gKGVqeCkgPT5cclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZygnZWp4OiAnLCBlangpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH07XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmVzdERhbnNEb2N1bWVudCA9IGZhbHNlO1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5vYnRlbmlyU3R5bGVBdXRldXIgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0bGV0IHN0eWxlQXV0ZXVyID0gKHRoaXMuc3R5bGVTaGVldHMpPyB0aGlzLnN0eWxlU2hlZXRzIDogZmFsc2U7XHJcblx0XHRpZighc3R5bGVBdXRldXIpIFxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgcGFyZW50ID1cdCh0aGlzLnBhcmVudE5vZGUpPyB0aGlzLnBhcmVudE5vZGU6XHJcblx0XHRcdFx0XHRcdFx0XHQodGhpcy5wYXJlbnRFbGVtZW50KT8gdGhpcy5wYXJlbnRFbGVtZW50OiBmYWxzZTtcclxuXHRcdFx0aWYocGFyZW50Lmhvc3QpIHN0eWxlQXV0ZXVyID0gcGFyZW50LnN0eWxlU2hlZXRzO1xyXG5cdFx0XHRlbHNlIGlmKHBhcmVudCkgc3R5bGVBdXRldXIgPSBwYXJlbnQub2J0ZW5pclN0eWxlQXV0ZXVyKCk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKHRoaXMuaG9zdClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZih0aGlzLmhvc3Quc3R5bGVTaGVldHMpIHN0eWxlQXV0ZXVyID0gdGhpcy5ob3N0LnN0eWxlU2hlZXRzO1xyXG5cdFx0XHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ0F1Y3VuZSBmZXVpbGxlIGRlIHN0eWxlIHRyb3V2w6llLicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlICB0aHJvdyBuZXcgRXJyb3IoJ0ltcG9zc2libGUgZGUgcmVtb250ZXIgZGFucyBsYSBoaWVyYXJjaGllIGRvbS4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0eWxlQXV0ZXVyO1xyXG5cdH07XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLm9idGVuaXJTdHlsZUF1dGV1ckVsZW1lbnQgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0bGV0IHN0eWxlQXV0ZXVyID0gbnVsbDtcclxuXHRcdHRyeVxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmxvZygnU3RhdDogJywgZG9jdW1lbnQucmVhZHlTdGF0ZSk7XHJcblx0XHRcdHN0eWxlQXV0ZXVyID0gdGhpcy5vYnRlbmlyU3R5bGVBdXRldXIoKTtcclxuXHRcdH1cclxuXHRcdGNhdGNoKGUpXHJcblx0XHR7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdFclI6ICcsIGRvY3VtZW50LnJlYWR5U3RhdGUsIHRoaXMsIGUpO1xyXG5cdFx0XHR0aHJvdyAna2snO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgcsOoZ2xlc0VsZW1lbnQgPSBbXTtcclxuXHRcdGZvclxyXG5cdFx0KFxyXG5cdFx0XHRsZXQgaUZldWlsbGUgPSAwLCBuRmV1aWxsZXNTdHlsZXMgPSBzdHlsZUF1dGV1ci5sZW5ndGg7XHJcblx0XHRcdGlGZXVpbGxlIDwgbkZldWlsbGVzU3R5bGVzO1xyXG5cdFx0XHRpRmV1aWxsZSsrXHJcblx0XHQpXHJcblx0XHR7XHJcblx0XHRcdGxldCBmZXVpbGxlQWN0dWVsbGUgPSBzdHlsZUF1dGV1cltpRmV1aWxsZV0uY3NzUnVsZXM7XHJcblx0XHRcdGZvclxyXG5cdFx0XHQoXHJcblx0XHRcdFx0bGV0IGlSw6hnbGVDc3MgPSAwLCBuUsOoZ2xlc0NzcyA9IGZldWlsbGVBY3R1ZWxsZS5sZW5ndGg7XHJcblx0XHRcdFx0aVLDqGdsZUNzcyA8IG5Sw6hnbGVzQ3NzO1xyXG5cdFx0XHRcdGlSw6hnbGVDc3MrK1xyXG5cdFx0XHQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcdGxldCByw6hnbGVDc3NBY3R1ZWxsZSA9IGZldWlsbGVBY3R1ZWxsZVtpUsOoZ2xlQ3NzXTtcclxuXHRcdFx0XHRpZih0aGlzLm1hdGNoZXMocsOoZ2xlQ3NzQWN0dWVsbGUuc2VsZWN0b3JUZXh0KSApIHLDqGdsZXNFbGVtZW50LnB1c2gocsOoZ2xlQ3NzQWN0dWVsbGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcsOoZ2xlc0VsZW1lbnQ7XHRcclxuXHR9O1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5wYXJjb3VyaXJCYXMgPSBTaGFkb3dSb290LnByb3RvdHlwZS5wYXJjb3VyaXJCYXMgPSBmdW5jdGlvbihmb25jdGlvblRyYWl0cmVtZW50KVxyXG5cdHtcclxuXHRcdGNvbnN0IHRyYWl0ZXJFbmZhbnQgPSAoZW5mYW50KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRmb25jdGlvblRyYWl0cmVtZW50KGVuZmFudCk7XHJcblx0XHRcdGVuZmFudC5wYXJjb3VyaXJCYXMoZm9uY3Rpb25UcmFpdHJlbWVudCk7XHJcblx0XHR9O1xyXG5cdFx0Zm9yKGxldCBlbmZhbnQgb2YgdGhpcy5jaGlsZHJlbikgdHJhaXRlckVuZmFudChlbmZhbnQpO1xyXG5cdFx0aWYodGhpcy5zaGFkb3dSb290KSB0aGlzLnNoYWRvd1Jvb3QucGFyY291cmlyQmFzKGZvbmN0aW9uVHJhaXRyZW1lbnQpO1xyXG5cdH07XHJcblxyXG5cdFx0XHRcclxuXHR7XHJcblx0XHRsZXQgSFRNTENvbFN5bWJJdGVyID0gSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl07XHJcblx0XHRIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IChIVE1MQ29sU3ltYkl0ZXIpID8gSFRNTENvbFN5bWJJdGVyIDogZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgaSA9IDAsXHJcblx0XHRcdFx0IGlNYXggPSB0aGlzLmxlbmd0aCxcclxuXHRcdFx0XHQgc29pc1x0PSB0aGlzO1xyXG5cdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0bmV4dCgpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJue1xyXG5cdFx0XHRcdFx0XHRkb25lIDogKGkrKyA8IGlNYXggLSAxKSA/IGZhbHNlIDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0dmFsdWUgOiBzb2lzW2ldXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblx0fVxyXG5cdHtcclxuXHRcdGxldCBNdXRhdGlvblJlY29yZFN5bWJJdGVyID0gTXV0YXRpb25SZWNvcmQucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl07XHJcblx0XHRNdXRhdGlvblJlY29yZC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IChNdXRhdGlvblJlY29yZFN5bWJJdGVyKSA/IE11dGF0aW9uUmVjb3JkU3ltYkl0ZXIgOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGxldCBpID0gMCxcclxuXHRcdFx0XHQgaU1heCA9IHRoaXMubGVuZ3RoLFxyXG5cdFx0XHRcdCBzb2lzXHQ9IHRoaXM7XHJcblx0XHRcdHJldHVybntcclxuXHRcdFx0XHRuZXh0KClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0XHRcdGRvbmUgOiAoaSsrIDwgaU1heCAtIDEpID8gZmFsc2UgOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA6IHNvaXNbaV1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fTtcclxuXHR9XHJcblx0e1xyXG5cdFx0bGV0IE5vZGVMaXN0U3ltYkl0ZXIgPSBOb2RlTGlzdC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXTtcclxuXHRcdE5vZGVMaXN0LnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gKE5vZGVMaXN0U3ltYkl0ZXIpID8gTm9kZUxpc3RTeW1iSXRlciA6IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0bGV0IGkgPSAwLFxyXG5cdFx0XHRcdCBpTWF4ID0gdGhpcy5sZW5ndGgsXHJcblx0XHRcdFx0IHNvaXNcdD0gdGhpcztcclxuXHRcdFx0cmV0dXJue1xyXG5cdFx0XHRcdG5leHQoKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybntcclxuXHRcdFx0XHRcdFx0ZG9uZSA6IChpKysgPCBpTWF4ICAtIDEpID8gZmFsc2UgOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA6IHNvaXNbaV1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnJlcXVlc3RQb2ludGVyTG9jayA9IEhUTUxFbGVtZW50LnByb3RvdHlwZS5yZXF1ZXN0UG9pbnRlckxvY2sgfHwgSFRNTEVsZW1lbnQucHJvdG90eXBlLm1velJlcXVlc3RQb2ludGVyTG9jayB8fCBIVE1MRWxlbWVudC5wcm90b3R5cGUud2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrO1xyXG5cdHRyeVxyXG5cdHtcclxuXHRcdGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCA9IGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCB8fCBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnQgfHwgZG9jdW1lbnQud2Via2l0UG9pbnRlckxvY2tFbGVtZW50O1xyXG5cdH1cclxuXHRjYXRjaChlKVxyXG5cdHtcclxuXHRcdDs7XHJcblx0fVxyXG5cdFxyXG5cdEVycm9yLnByb3RvdHlwZS5saWVyID0gZnVuY3Rpb24oZXJyZXVyTGnDqWUpXHJcblx0e1xyXG5cdFx0aWYodGhpcy5kZXRhaWxzICYmIHRoaXMuZGV0YWlscy5fbGlhaXNvbikgdGhyb3cgbmV3IEVycm9yKCdFcnJvci5wcm90b3R5cGUubGllcjogRXJyZXVyIGTDqWrDoCBsacOpZScpO1xyXG5cdFx0dGhpcy5kZXRhaWxzID0gdGhpcy5kZXRhaWxzIHx8IHt9O1xyXG5cdFx0dGhpcy5kZXRhaWxzLl9saWFpc29uID0gZXJyZXVyTGnDqWUuZGV0YWlscyB8fCB7fTtcclxuXHRcdHRoaXMuZGV0YWlscy5fbGlhaXNvbi5fbWVzc2FnZSA9IGVycmV1ckxpw6llLm1lc3NhZ2U7XHJcblx0XHRpZihlcnJldXJMacOpZS5kZXRhaWxzKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgcHJvcFV0aWxpc8OpZXMgPSBPYmplY3Qua2V5cyhlcnJldXJMacOpZS5kZXRhaWxzKTtcclxuXHRcdFx0Zm9yKGxldCBwcm9wIG9mIHByb3BVdGlsaXPDqWVzKSB0aGlzLmRldGFpbHMuX2xpYWlzb25bcHJvcF0gPSBlcnJldXJMacOpZS5kZXRhaWxzW3Byb3BdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHRFcnJvci5wcm90b3R5cGUuZm9ybWVsbGUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0aWYoIXRoaXMuZXN0RGVmYXV0KSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yLnByb3RvdHlwZS5mb3JtZWxsZTogRXJyZXVyIGTDqWrDoCBhc3NpZ27DqScpLmZvcm1lbGxlKCk7XHJcblx0XHR0aGlzLmVzdEZvcm1lbGxlID0gdHJ1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblx0RXJyb3IucHJvdG90eXBlLnJldG91ciA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRpZighdGhpcy5lc3REZWZhdXQpIHRocm93IG5ldyBFcnJvcignRXJyb3IucHJvdG90eXBlLmZvcm1lbGxlOiBFcnJldXIgZMOpasOgIGFzc2lnbsOpJykuZm9ybWVsbGUoKTtcclxuXHRcdHRoaXMuZXN0UmV0b3VyID0gdHJ1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblx0RXJyb3IucHJvdG90eXBlLmVzdEZvcm1lbGxlID0gZmFsc2U7XHJcblx0RXJyb3IucHJvdG90eXBlLmVzdFJldG91ciA9IGZhbHNlO1xyXG5cdEVycm9yLnByb3RvdHlwZS5lc3REZWZhdXQgPSB0cnVlO1xyXG59KSgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvMC9zdXJjb3VjaGVOYXRpZnMuanMiLCIvKipcclxuXHRfY29udHJhdF8oIEBkb25uw6llLCBAY29udHJhdCkgPT4gdW5kZWZpbmVkIHx8IEVycm9yXHJcblx0Rm9uY3Rpb24gcHJpdsOpIGTDqWZpbmlzc2FudCB1biBjb250cmF0IHN1ciB1bmUgZG9ubsOpZShpLmUuIGlkZW50aWZpY2F0ZXVycyBjb25zdGFudHMgb3UgdmFyaWFibGVzKVxyXG5cdFVuIGNvbnRyYXQgZXN0IHVuIHByw6lkaWNhdCByZXRvdXJuYW50IHVuZSBwcm9wb3NpdGlvbi5cclxuXHRMZSBwcsOpZGljYXQgdXRpbGlzZSB1bmUgYXNzZXJ0aW9uIHBvdXIgY2FsY3VsZXIgbGEgcHJvcG9zaXRpb24uXHJcblx0TCdhc3NlcnRpb24gZXN0IGTDqXRlcm1pbsOpZSBlbiBmb25jdGlvbiBkdSB0eXBlIGR1IGNvbnRyYXQodm9pciBkb2MgQGNvbnRyYXQpLlxyXG5cdExhIHByb3Bvc2l0aW9uIGVzdCBzb2l0IHZyYWllIHNvaXQgdW5lIEVycm9yIHBvdXIgaW5kaXF1ZXIgZmF1eC5cclxuXHRAZG9ubsOpZVxyXG5cdFx0VHlwZTpcdHRvdXNcclxuXHRAY29udHJhdFxyXG5cdFx0VHlwZTpcdCdzdHJpbmcnIHx8IEFycmF5IHx8IE9iamVjdFxyXG5cdFx0XHRDYXM6XHRcdEFzc2VydGlvbjpcdFx0XHRcdE5vbVxyXG5cdFx0XHQnc3RyaW5nJ1x0dHlwZW9mXHRcdFx0XHRcdERvbm7DqWUgZGUgbcOqbWUgdHlwZVxyXG5cdFx0XHRBcnJheVx0XHRjb250cmF0IHx8IC4uLlx0XHRcdFJlY3Vyc2lvbiBzdXIgY2hhcXVlIMOpbMOpbWVudC4gQXUgbW9pbnMgdW5lIHByb3Bvc2l0aW9uIGRvaXQgw6p0cmUgdnJhaWUuXHJcblx0XHRcdE9iamVjdFx0XHRpbnN0YW5jZW9mXHRcdFx0XHRAZG9ubsOpZSBpbnN0YW5jZSBkZSBAY29udHJhdFxyXG5cdCoqL1xyXG5jb25zdCBmbkNvbnRyYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhcmFtcylcclxue1xyXG5cdGlmKHBhcmFtcy5kb2l0KVxyXG5cdHtcclxuXHRcdGxldCBbZG9ubsOpZSwgY29udHJhdF0gPSBwYXJhbXMuZG9pdDtcclxuXHRcdGNvbnN0IGdlbmVyZXJFcnJldXIgPSAoYXNzZXJ0aW9uKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgcGlsZU91RmFjZSA9IG5ldyBFcnJvcjtcclxuXHRcdFx0cGlsZU91RmFjZS5kZXRhaWxzID0ge307XHJcblx0XHRcdHBpbGVPdUZhY2UubWVzc2FnZSA9ICdMYSBwcm9wb3NpdGlvbiBkdSBjb250cmF0IGVzdCBmYXVzc2UnO1xyXG5cdFx0XHRwaWxlT3VGYWNlLmRldGFpbHMuYXR0ZW5kdSA9IGNvbnRyYXQ7XHJcblx0XHRcdHBpbGVPdUZhY2UuZGV0YWlscy5yZcOndSA9IGRvbm7DqWU7XHJcblx0XHRcdHBpbGVPdUZhY2UuZGV0YWlscy5hc3NlcnRpb24gPSBhc3NlcnRpb247XHJcblx0XHRcdHJldHVybiBwaWxlT3VGYWNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRsZXQgcHJvcG9zaXRpb24gPSBmYWxzZTtcclxuXHRcdGlmKHR5cGVvZiBjb250cmF0ID09PSAnc3RyaW5nJylcclxuXHRcdHtcclxuXHRcdFx0aWYodHlwZW9mIGRvbm7DqWUgPT09IGNvbnRyYXQpIHByb3Bvc2l0aW9uID0gdHJ1ZTtcclxuXHRcdFx0ZWxzZSB0aHJvdyBnZW5lcmVyRXJyZXVyKCd0eXBlJyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKGNvbnRyYXQgaW5zdGFuY2VvZiBBcnJheSlcclxuXHRcdHtcclxuXHRcdFx0XHJcblx0XHRcdGZvcihsZXQgdmFsZXVyQWRtaXNlIG9mIGNvbnRyYXQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRmbkNvbnRyYXQoe2RvaXQgOiBbZG9ubsOpZSwgdmFsZXVyQWRtaXNlXSB9ICk7XHJcblx0XHRcdFx0XHRwcm9wb3NpdGlvbiA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2goZSl7Ozt9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIXByb3Bvc2l0aW9uKSB0aHJvdyBnZW5lcmVyRXJyZXVyKCdpbnRlcnZhbGUnKTtcclxuXHRcdH1cclxuXHRcdC8vIE9iamVjdFxyXG5cdFx0ZWxzZSBpZigodHlwZW9mIGNvbnRyYXQgPT09ICdvYmplY3QnKSB8fCAoY29udHJhdCBpbnN0YW5jZW9mIE9iamVjdCkgKVxyXG5cdFx0e1xyXG5cdFx0XHRpZihkb25uw6llIGluc3RhbmNlb2YgY29udHJhdCkgcHJvcG9zaXRpb24gPSB0cnVlO1xyXG5cdFx0XHRlbHNlIHRocm93IGdlbmVyZXJFcnJldXIoJ2luc3RhbmNlJyk7XHJcblx0XHR9XHJcblx0XHRpZihwcm9wb3NpdGlvbiA9PT0gdHJ1ZSkgcmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdGlmKHBhcmFtcy5uZWRvaXQpXHJcblx0e1xyXG5cdFx0dGhyb3cgJ05vbiBJbXBsw6ltZW50w6khJztcclxuXHR9XHJcblx0Y29uc29sZS5sb2coJ2NvbnRyYXQnICwgcGFyYW1zKTtcclxuXHR0aHJvdyBuZXcgRXJyb3IoJ0NvbnRyYXQgIGF2ZWMgcGFyYW3DqHRyZXMgaW52YWxpZGUgb3Ugc2FucyBwYXJhbcOodHJlcycpO1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvMS9jb250cmF0LmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5leHBvcnQgZGVmYXVsdCBuZXcgZnVuY3Rpb24oKVxyXG57XHJcblx0Y29uc3RcdGxpc3RlbmVycyA9IHt9O1xyXG5cdGNvbnN0IG9ic2VydmVyQ2FsbGJhY2sgPSAobXV0YXRpb25zLCBvYnNlcnZlcikgPT5cclxuXHR7XHJcblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcclxuXHRcdFx0bGlzdGVuZXJzW211dGF0aW9uLnRhcmdldF0obXV0YXRpb24pO1xyXG5cdH07XHJcblx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihvYnNlcnZlckNhbGxiYWNrKTtcclxuXHR0aGlzLm5ldyA9ICh0YXJnZXQsIG11dGF0aW9uT2JzZXJ2ZXJJbml0LCBjYWxsYmFjaykgPT5cclxuXHR7XHJcblx0XHRvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgbXV0YXRpb25PYnNlcnZlckluaXQpO1xyXG5cdFx0bGlzdGVuZXJzW3RhcmdldF0gPSBjYWxsYmFjaztcclxuXHR9O1xyXG5cdFx0XHJcblx0dGhpcy5uZXdBc0F0dHJpYnV0ZXMgPSAodGFyZ2V0LCBhdHRyTGlzdCwgY2FsbGJhY2spID0+XHJcblx0e1xyXG5cdFx0dGhpcy5uZXcodGFyZ2V0LCB7YXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlc0ZpbHRlcjogYXR0ckxpc3R9LCBjYWxsYmFjayk7XHJcblx0fTtcclxuXHJcblx0dGhpcy5uZXdBc0F0dHJpYnV0ZUV4cGVjdGVkID0gKHRhcmdldCwgYXR0ciwgY2FsbGJhY2spID0+XHJcblx0e1xyXG5cdFx0dGhpcy5uZXcodGFyZ2V0LCB7YXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlc0ZpbHRlcjogYXR0ci5uYW1lfSwgbXV0YXRpb24gPT5cclxuXHRcdHtcclxuXHRcdFx0aWYgKHRhcmdldFthdHRyLm5hbWVdID09IGF0dHIuZXhwZWN0ZWQpXHJcblx0XHRcdFx0Y2FsbGJhY2sobXV0YXRpb24pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0dGhpcy5uZXdBc1N0eWxlRXhwZWN0ZWQgPSAodGFyZ2V0LCBzdHlsZSwgY2FsbGJhY2spID0+XHJcblx0e1xyXG5cdFx0dGhpcy5uZXcodGFyZ2V0LCB7YXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlc0ZpbHRlcjogJ3N0eWxlJ30sIG11dGF0aW9uID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IHZhbHVlID0gbXV0YXRpb24udGFyZ2V0LnN0eWxlW3N0eWxlLm5hbWVdO1xyXG5cdFx0XHRjb25zb2xlLmxvZygnc3R5bGU+bmFtZTogJywgc3R5bGUubmFtZSwgJyB2YWx1ZTogJywgdmFsdWUsICcgZXhwZWN0ZWQ6ICcsIHN0eWxlLmV4cGVjdGVkKTtcclxuXHRcdFx0aWYgKChzdHlsZS5pc0VxdWFsICYmICh2YWx1ZSA9PT0gc3R5bGUuZXhwZWN0ZWQpKSB8fFxyXG5cdFx0XHRcdFx0KCFzdHlsZS5pc0VxdWFsICYmICh2YWx1ZSAhPT0gc3R5bGUuZXhwZWN0ZWQpKSlcclxuXHRcdFx0XHRjYWxsYmFjayhtdXRhdGlvbik7XHJcblx0XHR9KTtcclxuXHR9O1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvMS9zb25kZU11dGF0aW9uLmpzIiwiZXhwb3J0IGRlZmF1bHQgbmV3IGZ1bmN0aW9uKClcclxue1xyXG5cdHZhciB0eXBlc0Rvbm5lZXMgPSB0aGlzO1xyXG5cdHRoaXMuUmVmZXJlbmNlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdHZhciByZWZNYXggPSAwO1xyXG5cdFx0Y29uc3QgcmVmTGlicmUgPSBbXTtcclxuXHRcdHRoaXMub2J0ZW5pciA9ICgpID0+IChyZWZMaWJyZS5sZW5ndGggPT09IDApID8gcmVmTWF4KysgOiByZWZMaWJyZS5zaGlmdCgpO1xyXG5cdFx0dGhpcy5saWJlcmVyID0gcmVmID0+IHZvaWQocmVmTGlicmUucHVzaChyZWYpKSB8fCByZWY7XHJcblx0XHR0aGlzLmxpYnJlID0gKCkgPT4gcmVmTGlicmU7XHJcblx0XHR0aGlzLnRhaWxsZSA9IHR5cGUgPT5cclxuXHRcdHtcclxuXHRcdFx0XHR2YXIgciA9XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bWF4OiByZWZNYXgsXHJcblx0XHRcdFx0XHRvY2N1cGU6IHJlZk1heCAtIHJlZkxpYnJlLmxlbmd0aCxcclxuXHRcdFx0XHRcdGxpYnJlOiByZWZMaWJyZS5sZW5ndGhcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJldHVybiAodHlwZSA9PT0gJ21heCcpPyByLm1heCA6ICh0eXBlID09PSAnb2NjdXBlJyk/IHIub2NjdXBlIDogKHR5cGUgPT09ICdsaWJyZScpPyByLmxpYnJlIDogcjtcclxuXHRcdH07XHJcblx0fTtcclxuXHRcclxuXHRjb25zdCBJdGVyYXRldXJJbnRlcm5lTGlzdGUgPSBmdW5jdGlvbihyZWZzLCByZXByZXNlbnRhdGlvbilcclxuXHR7XHJcblx0XHRjb25zdCByZWZMaWJyZSA9IHJlZnMubGlicmUoKSxcclxuXHRcdFx0ICB0YWlsbGUgPSByZWZzLnRhaWxsZSgnbWF4Jyk7XHJcblx0XHR2YXIgaUFjdHVlbCA9IDA7XHJcblx0XHRcdFxyXG5cdFx0dGhpcy5zdWl2YW50ID0gKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Ly9TaSBsJ2VtcGxhY2VtZW50IG4nZXN0IHBhcyB1dGlsaXNlIGlsIGZhdXQgZW4gdHJvdXZlciB1biBhdXRyZVxyXG5cdFx0XHRmb3IodmFyIGxpYnJlIG9mIHJlZkxpYnJlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYobGlicmUgIT09IGlBY3R1ZWwpIGJyZWFrO1xyXG5cdFx0XHRcdGlBY3R1ZWwrKztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgciA9XHJcblx0XHRcdHtcclxuXHRcdFx0XHRkb25lOiBmYWxzZSxcclxuXHRcdFx0XHR2YWx1ZTogIHsgdmFsZXVyIDpyZXByZXNlbnRhdGlvbltpQWN0dWVsXSwgY2xlIDogaUFjdHVlbCB9XHJcblx0XHRcdH07XHJcblx0XHRcdGlmKGlBY3R1ZWwrKyA9PT0gdGFpbGxlKSByLmRvbmUgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm4gcjtcclxuXHRcdH07XHJcblx0fTtcclxuXHRjb25zdCBsaXN0ZV9lbFZlcnNSZWYgPSAobGlzdGVJdGVyYXRldXIsIGVsZW1lbnQpID0+XHJcblx0e1xyXG5cdFx0dmFyIHIgPSBudWxsO1xyXG5cdFx0d2hpbGUodm9pZChyID0gbGlzdGVJdGVyYXRldXIuc3VpdmFudCgpKSB8fCAhci5kb25lKSBpZihyLnZhbHVlLnZhbGV1ciA9PT0gZWxlbWVudCkgcmV0dXJuIHIudmFsdWUuY2xlO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH07XHJcblx0LyoqXHJcblx0XHQwLjAuMFxyXG5cdFx0Mi8xMi8yMDE1OlxyXG5cdFx0XHQ2SDEwXHJcblx0XHRcdFx0McOocmUgdmVyc2lvblxyXG5cdCoqL1xyXG5cdHRoaXMuTGlzdGUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc3QgcmVwcmVzZW50YXRpb24gPSBbXSxcclxuXHRcdFx0ICByZWZzID0gbmV3IHR5cGVzRG9ubmVlcy5SZWZlcmVuY2U7XHJcblx0XHR2YXIgdGFpbGxlID0gMDtcclxuXHRcdFxyXG5cdFx0dGhpcy5ham91dGVyID0gZWxlbWVudCA9PlxyXG5cdFx0e1xyXG5cdFx0XHRyZXByZXNlbnRhdGlvbltyZWZzLm9idGVuaXIoKV0gPSBlbGVtZW50O1xyXG5cdFx0XHR0YWlsbGUrKztcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQ7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5zdXBwcmltZXIgPSBlbGVtZW50ID0+XHJcblx0XHR7XHJcblx0XHRcdHZhciByZWYgPSBudWxsO1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJlZiA9IGxpc3RlX2VsVmVyc1JlZihuZXcgSXRlcmF0ZXVySW50ZXJuZUxpc3RlKHJlZnMsIHJlcHJlc2VudGF0aW9uKSwgZWxlbWVudCk7XHJcblx0XHRcdFx0aWYocmVmICE9PSAwICYmICFyZWYpIHRocm93IG5ldyBFcnJvcignJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2goZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTGlzdGUuc3VwcHJpbWVyOkBlbGVtZW50IG5vbiBwcmVzZW50IGRhbnMgbGEgbGlzdGU6XHQnICsgZWxlbWVudCk7XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXByZXNlbnRhdGlvbltyZWZzLmxpYmVyZXIocmVmKV0gPSBudWxsO1xyXG5cdFx0XHR0YWlsbGUtLTtcclxuXHRcdH07XHJcblx0XHQvKipcclxuXHRcdFx0MC4wLjBcclxuXHRcdFx0KiovXHJcblx0XHR0aGlzLnRhaWxsZSA9ICgpID0+IHRhaWxsZTtcclxuXHRcdFx0LyoqXHJcblx0XHRcdFx0MC4wLjBcclxuXHRcdFx0KiovXHJcblx0XHR0aGlzLmNvbnRpZW50ID0gZWxlbWVudCA9PiAobGlzdGVfZWxWZXJzUmVmKG5ldyBJdGVyYXRldXJJbnRlcm5lTGlzdGUocmVmcywgcmVwcmVzZW50YXRpb24pLCBlbGVtZW50KSAmJiB0cnVlKTtcclxuXHRcdFx0LyoqXHJcblx0XHRcdFx0MC4wLjBcclxuXHRcdFx0KiovXHJcblx0XHR0aGlzLmNvZXJjaXNpb24gPVxyXG5cdFx0e1xyXG5cdFx0XHR2ZXJzVGFibGVhdSA6ICgpID0+IHJlcHJlc2VudGF0aW9uXHJcblx0XHR9O1xyXG5cdFx0XHQvKipcclxuXHRcdFx0XHQwLjAuMlxyXG5cdFx0XHRcdFx0Mi8xMi8yMDE1OlxyXG5cdFx0XHRcdFx0NkgxMFxyXG5cdFx0XHRcdFx0XHQtRGVwbGFjZW1lbnQgZGUgcmVmIGxpYnJlIGRhbnMgbCdpdGVyYXRldXIgYXUgbGlldSBkZSBsJ2l0ZXJhdGlvblxyXG5cdFx0XHRcdFx0NS8xMjpcclxuXHRcdFx0XHRcdFx0LXRoaXMgdmVycyBwcml2w6kuXHJcblx0XHRcdFx0XHRcdC0wLjAuMigpXHJcblx0XHRcdCoqL1xyXG5cdFx0XHRcclxuXHRcdHRoaXNbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0Y29uc3QgaXRlcmF0ZXVyID0gbmV3IEl0ZXJhdGV1ckludGVybmVMaXN0ZShyZWZzLCByZXByZXNlbnRhdGlvbik7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciByID0gaXRlcmF0ZXVyLnN1aXZhbnQoKTtcclxuXHRcdFx0XHRcdHIudmFsdWUgPSByLnZhbHVlLnZhbGV1cjtcclxuXHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblx0fTtcclxuXHRcclxuXHQoKCkgPT5cclxuXHR7XHJcblx0XHRjb25zdCByZXByZXNlbnRhdGlvbiA9IHt9LFxyXG5cdFx0XHQgIGxpYnJlID0gW107XHJcblx0XHR2YXIgdGFpbGxlID0gMCxcclxuXHRcdFx0aU1heCA9IDA7XHJcblx0XHRcdFxyXG5cdFx0dGhpcy5MaXN0ZVVSMiA9IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0Y29uc3QgZW1wbGFjZW1lbnRzID0gW107XHJcblx0XHRcdHRoaXMub3BlcmF0aW9uID0gKHR5cGUsIGVsZW1lbnQpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBham91dFxyXG5cdFx0XHRcdGlmKHR5cGUgPT09IDApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIGlkID0gKGxpYnJlLmxlbmd0aCA9PT0gMCk/IGlNYXgrKyA6IGxpYnJlLnNoaWZ0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdm9pZFxyXG5cdFx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0XHRlbXBsYWNlbWVudHMucHVzaChpZCksXHJcblx0XHRcdFx0XHRcdHJlcHJlc2VudGF0aW9uW2lkXSA9IGVsZW1lbnQsXHJcblx0XHRcdFx0XHRcdHRhaWxsZSsrXHJcblx0XHRcdFx0XHQpIHx8IGVsZW1lbnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIHRhaWxsZVxyXG5cdFx0XHRcdGVsc2UgaWYodHlwZSA8IDApIHJldHVybiBlbXBsYWNlbWVudHMubGVuZ3RoO1xyXG5cdFx0XHRcdC8vIHN1cHByZXNzaW9uXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciBpZCA9IG51bGwsXHJcblx0XHRcdFx0XHRcdGVsZW1lbnRQcmVzZW50ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwLCBuRWxlbWVudHMgPSBlbXBsYWNlbWVudHMubGVuZ3RoOyBpIDwgbkVsZW1lbnRzOyBpKyspXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlkID0gZW1wbGFjZW1lbnRzW2ldO1xyXG5cdFx0XHRcdFx0XHRpZihyZXByZXNlbnRhdGlvbltpZF0gPT09IGVsZW1lbnQpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRlbXBsYWNlbWVudHNbMF0gPSBlbXBsYWNlbWVudHNbaV07XHJcblx0XHRcdFx0XHRcdFx0ZWxlbWVudFByZXNlbnQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZighZWxlbWVudFByZXNlbnQpIHRocm93IG5ldyBFcnJvcignTGlzdGVVUi5vcGVyYXRpb25AdHlwZSA+IDA6IHRlbnRhdGl2ZSBkZSBzdXBwcmVzc2lvbiBkXFwndW4gw6lsw6ltZW50IG5vbiBwcsOpc2VudCwgQGVsZW1lbnQ6ICcgKyBlbGVtZW50KTtcclxuXHRcdFx0XHRcdHJldHVybiB2b2lkXHJcblx0XHRcdFx0XHQoXHJcblx0XHRcdFx0XHRcdGRlbGV0ZSByZXByZXNlbnRhdGlvbltpZF0sXHJcblx0XHRcdFx0XHRcdGxpYnJlLnB1c2goaWQpLFxyXG5cdFx0XHRcdFx0XHRlbXBsYWNlbWVudHMuc2hpZnQoKSxcclxuXHRcdFx0XHRcdFx0dGFpbGxlLS1cclxuXHRcdFx0XHRcdCkgfHwgZWxlbWVudDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnBvdXJEZSA9IGZuID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRmb3IodmFyIGlkIG9mIGVtcGxhY2VtZW50cykgZm4ocmVwcmVzZW50YXRpb25baWRdICk7XHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdH07XHJcblx0fSkoKTtcclxuXHRcclxuXHR0aGlzLkxpc3RlVVIzID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdHRoaXNbMGIwMF09ezBiMDA6W10sMGIwMTpudWxsLDBiMTA6MCwwYjExOm51bGx9O1xyXG5cdFx0dGhpc1swYjAxXT1lPT50aGlzWzBiMDBdWzBiMDAwXS5wdXNoKGUpO1xyXG5cdFx0dGhpc1swYjEwXT0oKT0+dGhpc1swYjAwXVswYjAwMF0ubGVuZ3RoO1xyXG5cdFx0dGhpc1swYjExXT1lID0+XHJcblx0XHR7XHJcblx0XHRcdHZvaWQodGhpc1swYjAwXVswYjEwXT0wLHRoaXNbMGIwMF1bMGIwMV09bnVsbCx0aGlzWzBiMDBdWzBiMTFdPXRoaXNbMGIwMF1bMGIwMDBdLmxlbmd0aCk7XHJcblx0XHRcdHdoaWxlKHRoaXNbMGIwMF1bMGIxMF08dGhpc1swYjAwXVswYjExXSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKHRoaXNbMGIwMF1bMGIwMDBdW3RoaXNbMGIwMF1bMGIxMF1dPT09ZSl7dGhpc1swYjAwXVswYjAxXT10aGlzWzBiMDBdWzBiMTBdO2JyZWFrO307XHJcblx0XHRcdFx0dGhpc1swYjAwXVswYjEwXSsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRoaXNbMGIwMF1bMGIwMV09PT1udWxsKXRocm93IG5ldyBFcnJvcignTGlzdGVVUkBlbGVtZW50IG5vbiBwcsOpc2VudCBkYW5zIGxhIGxpc3RlJyk7XHJcblx0XHRcdHRoaXNbMGIwMF1bMGIwMDBdW3RoaXNbMGIwMF1bMGIwMV1dPXRoaXNbMGIwMF1bMGIwMDBdWzBdO1xyXG5cdFx0XHR0aGlzWzBiMDBdWzBiMDAwXS5zaGlmdCgpO1xyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHR0aGlzLkRpY3Rpb25uYWlyZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRjb25zdCByZXByZXNlbnRhdGlvbiA9IHt9LFxyXG5cdFx0XHQgIGluZGV4ID0gbmV3IHR5cGVzRG9ubmVlcy5MaXN0ZTtcclxuXHRcdFxyXG5cdFx0dGhpcy50YWlsbGUgPSAoKSA9PiBpbmRleC50YWlsbGUoKTtcclxuXHRcdHRoaXMuYWpvdXRlciA9IChjbGUsIHZhbGV1cikgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYocmVwcmVzZW50YXRpb25bY2xlXSkgdGhyb3cgbmV3IEVycm9yKCd0eXBlc0Rvbm5lZXMuRGljdGlvbm5haXJlLmFqb3V0ZXJAY2xlIGRlasOgIGRlZmluaTpcdCcrY2xlKTtcclxuXHRcdFx0cmV0dXJuIHZvaWQocmVwcmVzZW50YXRpb25baW5kZXguYWpvdXRlcihjbGUpXSA9IHZhbGV1cikgfHwgIGNsZTtcclxuXHRcdH07XHJcblx0XHR0aGlzLm1vZGlmaWVyID0gKGNsZSwgdmFsZXVyKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZighcmVwcmVzZW50YXRpb25bY2xlXSkgdGhyb3cgbmV3IEVycm9yKCd0eXBlc0Rvbm5lZXMuRGljdGlvbm5haXJlLm1vZGlmaWVyQGNsZSBub24gcHJlc2VudGUgZGFucyBsZSBkaWN0aW9ubmFpcmU6XHQnKyBjbGUpO1xyXG5cdFx0XHRyZXR1cm4gdm9pZChyZXByZXNlbnRhdGlvbltjbGVdID0gdmFsZXVyKSB8fCB2YWxldXI7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5zdXBwcmltZXIgPSBjbGUgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoIXJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5zdXBwcmltZXJAY2xlIG5vbiBwcmVzZW50ZSBkYW5zIGxlIGRpY3Rpb25uYWlyZTpcdCcrY2xlKTtcclxuXHRcdFx0cmV0dXJuIHZvaWQoZGVsZXRlIHJlcHJlc2VudGF0aW9uW2NsZV0gJiYgaW5kZXguc3VwcHJpbWVyKGNsZSlcdCkgfHwgY2xlO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMub2J0ZW5pciA9IGNsZSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZighcmVwcmVzZW50YXRpb25bY2xlXSkgdGhyb3cgbmV3IEVycm9yKCd0eXBlc0Rvbm5lZXMuRGljdGlvbm5haXJlLm9idGVuaXJAY2xlIG5vbiBwcmVzZW50ZSBkYW5zIGxlIGRpY3Rpb25uYWlyZTpcdCcrY2xlKTtcclxuXHRcdFx0cmV0dXJuIHJlcHJlc2VudGF0aW9uW2NsZV07XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5jb250aWVudCA9IGNsZSA9PiAocmVwcmVzZW50YXRpb25bY2xlXSk/IHRydWUgOiBmYWxzZTtcclxuXHRcdHRoaXNbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRfaUFjdCA6IDAsXHJcblx0XHRcdFx0X3RhYiA6IGluZGV4LmNvZXJjaXNpb24udmVyc1RhYmxlYXUoKSxcclxuXHRcdFx0XHRuZXh0OiBmdW5jdGlvbigpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIHIgPSB7ZG9uZTogZmFsc2UsIHZhbHVlOiByZXByZXNlbnRhdGlvblt0aGlzLl90YWJbdGhpcy5faUFjdF1cdF1cdH07XHJcblx0XHRcdFx0XHRpZih0aGlzLl9pQWN0KysgPT0gdGhpcy5fdGFiLmxlbmd0aCkgci5kb25lID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0dmFyIGFhID0gbmV3IHliYXN0aGlzLnR5cGVzRG9ubmVlcy5JbnRlcmZhY2UoWyd0eXBlJywgJ25vbScsICdpZCddKTtcclxuXHRcdHZhciBiID0ge3R5cGUgOiAnZ8Opcm9lbScsIG5vbSA6J2plYW5MdWMnLCBpZDogNX1cclxuXHRcdGFhLnZhbGlkZXIoYilcclxuXHRcdFxyXG5cdFx0UGVybWV0IGRlIGTDqWZpbmlyIGxhIHNpZ25hdHVyZSBkJ3VuIG9iamV0LlxyXG5cdFx0QHNpZ25hdHVyZVx0XHJcblx0XHRcdE9iamV0OlxyXG5cdFx0XHRcdGwnaW50ZXJmYWNlIGRldnJhIGF2b2lyIGxhIG3Dqm1lIHNpZ25hdHVyZSBxdWUgY2VsbGUgZGUgbCdvYmpldFxyXG5cdFx0XHRUYWJsZWF1OlxyXG5cdFx0XHRcdHRhaWxsZSA9PT0gMSBFVCB0eXBlb2YgdmFsZXVyID09PSBPYmplY3RcclxuXHRcdFx0XHRcdGNsw6lcdFx0TGUgbm9tIGRlIGxhIHByb3ByacOpdMOpXHJcblx0XHRcdFx0XHR2YWxldXJcdExlIGNvbnRyYXQgdm9pcihfY29udHJhdF8pOlxyXG5cdFx0XHRcdFx0XHRTdHJpbmdcdD0+IGNvbnRyYXQgdHlwZW9mXHJcblx0XHRcdFx0XHRcdE9iamVjdFx0PT4gY29udHJhdFx0aW5zdGFuY2VvZlxyXG5cdFx0XHRcdFx0XHRBcnJheVx0PT4gY29udHJhdCBhdmVjIHBsdXNpZXVycyBzaWduYXR1cmVcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR0YWJsZWF1ID0+IGludGVyZmFjZSBkb250IGxhIHNpZ25hdHVyZSByZXByw6lzZW50ZSBsZXMgdmFsZXVycyBkdSB0YWJsZWF1XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNoYWluZSA9PiBsZSBub20gZGUgbGEgcHJvcHJpw6l0w6lcclxuXHRcdFx0XHRcdFx0XHRcdFx0W25vbVByb3AsIHR5cGVdXHJcblx0KiovXHJcblx0dGhpcy5JbnRlcmZhY2VUeXDDqWUgPSBmdW5jdGlvbihzaWduYXR1cmUpXHJcblx0e1xyXG5cdFx0dGhpcy52YWxpZGVyID0gKG9iamV0KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0cnl7XHR5YmFzdGhpcy5jb250cmF0KHtkb2l0IDogW29iamV0LCAnb2JqZWN0J10gfSApO1x0fVxyXG5cdFx0XHRjYXRjaChlKXtcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludGVyZmFjZVR5cMOpZS52YWxpZGVyQG9iamV0IG5cXCdlc3QgcGFzIGRlIHR5cGUgT2JqZWN0IScpLmZvcm1lbGxlKCk7XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgc2lnbmF0dXJlVGVzdMOpID0gT2JqZWN0LmtleXMob2JqZXQpO1xyXG5cdFx0XHQvKipcclxuXHRcdFx0XHRAb3B0aW9uc1x0T2JqZWN0XHJcblx0XHRcdCoqL1xyXG5cdFx0XHQvLyB0eXBlID0gZG9pdCwgbmVkb2l0LC4uLlxyXG5cdFx0XHRmb3IobGV0IHR5cGUgb2YgT2JqZWN0LmtleXMoc2lnbmF0dXJlKSApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZih0eXBlICE9PSAnZG9pdCcgJiYgdHlwZSAhPT0gJ25lZG9pdCcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludGVyZmFjZVR5cMOpZS52YWxpZGVyQG9iamV0IG5cXCdlc3QgcGFzIHVuIGNvbnRyYXQgdmFsaWRlIScpLmZvcm1lbGxlKCk7XHJcblx0XHRcdFx0Zm9yKGxldCBub21Qcm9wIG9mIE9iamVjdC5rZXlzKHNpZ25hdHVyZVt0eXBlXSApIClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZighc2lnbmF0dXJlVGVzdMOpLmluY2x1ZGVzKG5vbVByb3ApICkgdGhyb3cgbmV3IEVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlcjogUHJvcHJpw6l0w6kgYWJzZW50ZTogJyArIG5vbVByb3ApO1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRsZXRcdHByb3ByacOpdMOpVGVzdMOpZSA9IG9iamV0W25vbVByb3BdLFxyXG5cdFx0XHRcdFx0XHRcdFx0c2lnbmF0dXJlVGVzdMOpZSA9IHNpZ25hdHVyZVt0eXBlXVtub21Qcm9wXTtcclxuXHRcdFx0XHRcdFx0dHJ5e1x0eWJhc3RoaXMuY29udHJhdCh7W3R5cGVdIDogW3Byb3ByacOpdMOpVGVzdMOpZSwgc2lnbmF0dXJlVGVzdMOpZV0gfSApOyB9XHJcblx0XHRcdFx0XHRcdGNhdGNoKHByb3ApXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpZihwcm9wLmRldGFpbHMuYXNzZXJ0aW9uID09PSAndHlwZScpXHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyAobmV3IEVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlcjogUHJvcHJpw6l0w6kgdHlwZSBkaWZmw6lyZW50OiAnICsgbm9tUHJvcCkgKS5saWVyKHByb3ApO1xyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYocHJvcC5kZXRhaWxzLmFzc2VydGlvbiA9PT0gJ2ludGVydmFsZScpXHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyAobmV3IEVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlcjogUHJvcHJpw6l0w6kgbm9uIGNvbXByaXNlIGRhbnMgbFxcJ2ludGVydmFsZTogJyArIG5vbVByb3ApICkubGllcihwcm9wKTtcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKHByb3AuZGV0YWlscy5hc3NlcnRpb24gPT09ICdpbnN0YW5jZScpXHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyAobmV3IEVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlcjogUHJvcHJpw6l0w6kgY2xhc3NlIGRpZmbDqXJlbnQ6ICcgKyBub21Qcm9wKSApLmxpZXIocHJvcCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fTtcclxuXHR9O1xyXG5cdHRoaXMuSW50ZXJmYWNlTm9uVHlww6llID0gZnVuY3Rpb24oc2lnbmF0dXJlKXt9O1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvMi90eXBlc0Rvbm5lZXMuanMiLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKVxyXG57XHJcblx0Y29uc3QgU09JUyA9IHRoaXM7XHJcblx0dGhpcy5jb21wcmlzID0gbnVsbDtcclxuXHQoKCkgPT5cclxuXHR7XHJcblx0XHRjb25zdFxyXG5cdFx0XHRjb21wcmlzSW50ZXJ2YWxlID0gKGludGVydmFsZTAsIGludGVydmFsZTEpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgcmVzdWx0YXQgPSBmYWxzZTtcclxuXHRcdFx0XHRmb3IodmFyIGVudGllcjAgb2YgaW50ZXJ2YWxlMClcclxuXHRcdFx0XHRcdGZvcih2YXIgZW50aWVyMSBvZiBpbnRlcnZhbGUxKVxyXG5cdFx0XHRcdFx0XHRpZihlbnRpZXIwID09PSBlbnRpZXIxKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0YXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdGF0O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjb21wcmlzSW50ZXJ2YWxlRW50aWVyID0gKGludGVydmFsZSwgZW50aWVyMSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciByZXN1bHRhdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvcih2YXIgZW50aWVyMCBvZiBpbnRlcnZhbGUpXHJcblx0XHRcdFx0XHRpZihlbnRpZXIwID09PSBlbnRpZXIxKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXN1bHRhdCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiByZXN1bHRhdDtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y29tcHJpc0VudGllciA9IChvcGVyYW5kZTAsIG9wZXJhbmRlMSkgPT4gKG9wZXJhbmRlMCA9PT0gb3BlcmFuZGUxKSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHJcblx0XHR0aGlzLmNvbXByaXMgPSAob3BlcmFuZGUwLCBvcGVyYW5kZTEpID0+XHJcblx0XHR7XHJcblx0XHRcdHZhciByZXN1bHRhdCA9IG51bGw7XHJcblx0XHRcdGlmKG9wZXJhbmRlMCBpbnN0YW5jZW9mIEFycmF5KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYob3BlcmFuZGUxIGluc3RhbmNlb2YgQXJyYXkpIHJlc3VsdGF0ID0gY29tcHJpc0ludGVydmFsZShvcGVyYW5kZTAsIG9wZXJhbmRlMSk7XHJcblx0XHRcdFx0ZWxzZSByZXN1bHRhdCA9IGNvbXByaXNJbnRlcnZhbGVFbnRpZXIob3BlcmFuZGUwLCBvcGVyYW5kZTEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYob3BlcmFuZGUxIGluc3RhbmNlb2YgQXJyYXkpIHJlc3VsdGF0ID0gY29tcHJpc0ludGVydmFsZUVudGllcihvcGVyYW5kZTEsIG9wZXJhbmRlMCk7XHJcblx0XHRcdGVsc2UgcmVzdWx0YXQgPSBjb21wcmlzRW50aWVyKG9wZXJhbmRlMCwgb3BlcmFuZGUxKTtcclxuXHRcdFx0cmV0dXJuIHJlc3VsdGF0O1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdH0pKCk7XHJcblx0dGhpcy5jaGHDrm5lciA9IHZhbGV1ciA9PiAodHlwZW9mIHZhbGV1ciA9PT0gJ29iamVjdCcpID8gSlNPTi5zdHJpbmdpZnkodmFsZXVyKSA6IHZhbGV1cjtcclxuXHRcclxuXHR0aGlzLldIRU4gPSAoKCkgPT5cclxuXHR7XHJcblx0XHRsZXQgbGlzdGVuZXJzID1cdFtdO1xyXG5cdFx0bGV0IGludGVydmFsID1cdG51bGw7XHJcblx0XHRjb25zdCB3b3JrZXIgPVx0KCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Zm9yIChjb25zdCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAobGlzdGVuZXIuY29uZGl0aW9uKCkgPT09IGZhbHNlKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0bGlzdGVuZXIuY2FsbGJhY2soKTtcclxuXHRcdFx0XHRsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZmlsdGVyKGVsID0+IGVsICE9PSBsaXN0ZW5lcik7XHJcblx0XHRcdFx0aWYgKGxpc3RlbmVycy5sZW5ndGggPT0gMClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKGludGVydmFsKTtcclxuXHRcdFx0XHRcdGludGVydmFsID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRyZXR1cm4gKGNvbmRpdGlvbiwgY2FsbGJhY2spID0+XHJcblx0XHR7XHJcblx0XHRcdGxpc3RlbmVycy5wdXNoKHtjb25kaXRpb24sIGNhbGxiYWNrfSk7XHJcblx0XHRcdGlmIChpbnRlcnZhbCA9PT0gbnVsbClcclxuXHRcdFx0XHRpbnRlcnZhbCA9IHNldEludGVydmFsKHdvcmtlciwgMjApO1xyXG5cdFx0fTtcclxuXHR9KSgpO1xyXG5cdHRoaXMuZ3JhbmRldXJzID1cclxuXHR7XHJcblx0XHRlbmxldmVyVW5pdMOpIDogZ3JhbmRldXIgPT5cclxuXHRcdHtcclxuXHRcdFx0Z3JhbmRldXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChncmFuZGV1cilcclxuXHRcdFx0XHRcdFx0XHRcdC5yZXZlcnNlKCk7XHJcblx0XHRcdHdoaWxlIChncmFuZGV1ci5sZW5ndGggIT0gMClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICghaXNOYU4oTnVtYmVyKGdyYW5kZXVyWzBdKSkpXHJcblx0XHRcdFx0XHRicmVhayA7XHJcblx0XHRcdFx0Z3JhbmRldXIuc2hpZnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRncmFuZGV1ci5yZXZlcnNlKCk7XHJcblx0XHRcdHJldHVybiAocGFyc2VGbG9hdChncmFuZGV1ci5qb2luKCcnKSkpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0XHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgdW5pdMOpcyA9IFsncHgnLCAnZW0nLCAnY20nLCAnbScsICdLZycsICdnJywgJ0h6JywgJ2onLCAnaycsICd2JywgJ0EnXTtcclxuXHRcdHRoaXMuZ3JhbmRldXJzLmFqb3V0ZXJVbml0w6kgPSAoY2hhaW5lLCB1bml0w6kpID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKCEgdW5pdMOpcy5pbmNsdWRlcyh1bml0w6kpICkgdGhyb3cgbmV3IFR5cGVFcnJvcignQHVuaXTDqSBpbnZhbGlkZTogJyArIFNPSVMuY2hhw65uZXIodW5pdMOpKSApO1xyXG5cdFx0XHRyZXR1cm4gY2hhaW5lICsgdW5pdMOpO1xyXG5cdFx0fTtcclxuXHR9ICkoKTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzIvdXRpbGl0YWlyZXMuanMiLCIvKipcclxuXHJcblx0VW5lIGZhYnJpcXVlIGVzdCB1bmUgZm9uY3Rpb25cclxuXHRGb25jdGlvbm5hbGl0w6llczpcclxuXHRcdElcdC1Bam91dGVyIHVuIMOpbMOpbWVudCBwZXJzb25uYWxpc8Opc1xyXG5cdFx0SUlcdC1vYnRlbmlyIGxlcyDDqWzDqW1lbnRzIHBlcnNvbm5hbGlzw6lzXHJcblx0XHRJSUlcdC1vYnRlbmlyIGxlcyBmYWJyaXF1ZXNcclxuXHRcdElWXHQtZ2VzdGlvbiBkZXMgZXNwYWNlIGRlIG5vbXNcclxuXHRmYWJyaXF1ZVx0RnVuY3Rpb25cclxuXHRcdFJldG91cm5lIHVuZSBGYWJyaXF1ZVxyXG5cdFx0QGVzcGFjZURlTm9tXHRTdHJpbmdcclxuXHRcdD0+IEZhYnJpcXVlXHJcblx0RmFicmlxdWUgRnVuY3Rpb24gXHJcblx0XHRDbGFzc2UgcG91ciBjcsOpZXIgZGVzIGNvbXBvc2FudHMgcGVyc29ubmFsaXPDqXMgSFRNTFxyXG5cdFx0QHBhcmFtw6h0cmVzXHRPYmplY3RcclxuXHRcdFx0QG5vbVx0XHRcdFN0cmluZ1xyXG5cdFx0XHRAY29uc3RydWN0ZXVyXHRGdW5jdGlvblxyXG5cdFx0XHRAdGVtcGxhdGVcdFx0dW5kZWZpbmVkIHx8IFN0cmluZ1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRAbW9kZWxlXHRcdFx0SFRNTEVsZW1lbnRcclxuXHRcdEBjb25zdHJ1Y3RldXJcdFx0RnVuY3Rpb24oIEBAY29tcG9zYW50SW50ZXJmYWNlLCBAQHZ1ZUludGVyZmFjZSkgPT4gdm9pZCB8fCBGdW5jdGlvbiggQEB2dWVJbnRlcmZhY2UpOlxyXG5cdFx0XHRBcHBsaXF1w6kgbG9ycyBkdSBwcmVtaWVyIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHRcdFNpIHJldG91cm5lIHVuZSBmb25jdGlvbiwgZWxsZSBzZXJhIGFwcGVsw6llIMOgIGNoYXF1ZSB2aXNpb25uYWdlXHJcblx0XHRcdFxyXG5cdEF0dGVudGlvbiwgbmUgcGFzIGNvbmZvbmRyZSBpbnRlcmZhY2UgYXBwbGljYXRpdmUgb3UgbCdpbnRlcmZhY2UgZCd1biBvYmpldCBhdmVjIHVuIGNvbXBvc2FudCBpbnRlcmZhY2VcclxuXHRcclxuXHRAYWpvdXRlcihAQHZ1ZSlcclxuXHRAYWZmaWNoZXIoQEBub21WdWUpXHJcblx0XHJcblx0XHROT00tLS0tLS0tLS0tLS0tLS1cdEZhYnJpcXVlXHJcblx0XHRUWVBFLS0tLS0tLS0tLS0tLS0tXHRGb25jdGlvbiAoQHBhcmFtw6h0cmVzKSA9PiBGb25jdGlvblxyXG5cdFx0QlVULS0tLS0tLS0tLS0tLS0tLVx0Q3LDqWF0aW9uLCBnZXN0aW9uLCBtYWludGVuYW5jZXMgZCfDqWzDqW1lbnRzIHBlcnNvbm5hbGlzw6lzIEhUTUwoaS5lLiBDdXN0b21FbGVtZW50KVxyXG5cdFx0XHJcblx0XHRmYWJyaXF1ZVxyXG5cdFx0XHRAcGFyYW1ldHJlc1x0T2JqZWN0XHJcblx0XHRcdFx0QFxyXG4qKi9cclxuY29uc3QgaW50ZXJwcmV0ZXVySHRtbCA9ICgoKSA9PlxyXG57XHJcbiAgY29uc3QgaW50ZXJwcmV0ZXVyRG9tID0gbmV3IERPTVBhcnNlcjtcclxuICByZXR1cm4gY2hhaW5lSHRtbCA9PiBpbnRlcnByZXRldXJEb20ucGFyc2VGcm9tU3RyaW5nKGNoYWluZUh0bWwsICd0ZXh0L2h0bWwnKTtcclxufSkoKTtcclxuXHJcbmNvbnN0IGZhYnJpcXVlID0gZXNwYWNlRGVOb20gPT5cclxue1xyXG5cdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbZXNwYWNlRGVOb20sICdzdHJpbmcnLCBuZXcgRXJyb3IoJ2ZhYnJpcXVlQGVzcGFjZURlTm9tIGRvaXQgw6p0cmUgdW4gc3RyaW5nJykgXSB9ICk7XHJcblx0eWJhc3RoaXMuY29udHJhdCh7ZG9pdCA6IFtmYWJyaXF1ZS5lc3BhY2VEZU5vbVtlc3BhY2VEZU5vbV0sICd1bmRlZmluZWQnLCBuZXcgRXJyb3IoJ2ZhYnJpcXVlQGVzcGFjZSBkZSBub20gZMOpasOgIHV0aWxpc8OpJykgXSB9ICk7XHJcblx0Y29uc3QgZGljdGlvbm5haXJlRWzDqW1lbnQgPSB7fTtcclxuXHJcblx0ZmFicmlxdWUuZXNwYWNlRGVOb21bZXNwYWNlRGVOb21dID0gZGljdGlvbm5haXJlRWzDqW1lbnQ7XHJcblx0LyoqXHJcblx0XHRJRWxlbWVudFxyXG5cdFx0XHRAbm9tIFN0cmluZ1xyXG5cdFx0XHRAY29uc3RydWN0ZXVyXHRcdEZ1bmN0aW9uXHJcblx0XHRcdEB0ZW1wbGF0ZVx0XHRcdHVuZGVmaW5lZCB8fCBTdHJpbmdcclxuXHQqKi9cclxuXHRjb25zdCBJRWxlbWVudCA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuSW50ZXJmYWNlVHlww6llXHJcblx0KHtkb2l0IDpcclxuXHR7XHJcblx0XHRub20gOiAnc3RyaW5nJyxcclxuXHRcdGNvbnN0cnVjdGV1ciA6IEZ1bmN0aW9uLFxyXG5cdFx0dGVtcGxhdGUgOiBbJ3VuZGVmaW5lZCcsICdzdHJpbmcnXSBcclxuXHR9fSk7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKHBhcmFtw6h0cmVzKVxyXG5cdHtcclxuXHRcdHRyeXtcdElFbGVtZW50LnZhbGlkZXIocGFyYW3DqHRyZXMpO1x0fVxyXG5cdFx0Y2F0Y2goZSlcclxuXHRcdHtcclxuXHRcdFx0aWYoZS5lc3RGb3JtZWxsZSkgdGhyb3cgZTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVzcGFjZURlTm9tICsgJy1mYWJyaXF1ZUBwYXJhbcOodHJlcyBuXFwnaW1wbMOpbWVudGUgcGFzIGxcXGludGVyZmFjZSBJRWxlbWVudCcpO1xyXG5cdFx0fVxyXG5cdFx0LyoqXHJcblx0XHRcdFByaXbDqVxyXG5cdFx0KiovXHJcblx0XHRjb25zdCBzb2lzQ2xhc3NlRWxlbWVudCA9IHRoaXM7XHJcblx0XHRjb25zdCBwcm90b3R5cGVIdG1sRWxlbWVudCA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKTtcclxuXHRcdGNvbnN0IEludGFuY2VFbGVtZW50SHRtbCA9IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMuYXR0YWNoU2hhZG93KVxyXG5cdFx0XHRcdHRoaXMuYXR0YWNoU2hhZG93KHttb2RlIDogJ29wZW4nfSk7XHJcblx0XHRcdGVsc2UgLy9kZXByZWNpZWRcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcclxuXHRcdFx0dGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHNvaXNDbGFzc2VFbGVtZW50Lm1vZGVsZS5jbG9uZU5vZGUodHJ1ZSkuY29udGVudCk7XHJcblx0XHRcdHBhcmFtw6h0cmVzLmNvbnN0cnVjdGV1cih0aGlzKTtcclxuXHRcdH07XHJcblx0XHQvKipcclxuXHRcdFx0UHVibGlxdWVcclxuXHRcdCoqL1xyXG5cdFx0dGhpcy5vYnRlbmlyUHJvdG90eXBlID0gKCkgPT4gcHJvdG90eXBlSHRtbEVsZW1lbnQ7XHJcblx0XHR0aGlzLm1vZGVsZSA9IG51bGw7XHJcblx0XHQvKipcclxuXHRcdCAgQ29uc3RydWN0ZXVyXHJcblx0XHQqKi9cclxuXHRcdCgoKSA9PlxyXG5cdFx0e1xyXG5cdFx0ICB2YXIgbW9kZWxlVGVtcG9yYWlyZSA9IGludGVycHJldGV1ckh0bWwocGFyYW3DqHRyZXMudGVtcGxhdGUpO1xyXG5cdFx0ICBtb2RlbGVUZW1wb3JhaXJlID0gbW9kZWxlVGVtcG9yYWlyZS5xdWVyeVNlbGVjdG9yKCd0ZW1wbGF0ZScpO1xyXG5cdFx0ICBtb2RlbGVUZW1wb3JhaXJlLmlubmVySFRNTCArPSAnPHN0eWxlPiAqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtib3gtc2l6aW5nOiBib3JkZXItYm94OyB9JztcclxuXHRcdCAgdGhpcy5tb2RlbGUgPSBtb2RlbGVUZW1wb3JhaXJlO1xyXG5cdFx0fSkoKTtcclxuXHRcdFx0XHJcblx0XHRwcm90b3R5cGVIdG1sRWxlbWVudC5jcmVhdGVkQ2FsbGJhY2sgPSBJbnRhbmNlRWxlbWVudEh0bWw7XHJcblx0XHRwcm90b3R5cGVIdG1sRWxlbWVudC5hdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24oKSBcclxuXHRcdHtcclxuXHRcdFx0Lypjb25zb2xlLmxvZygnYXR0YWNow6k6ICcsIHRoaXMpXHJcblx0XHRcdHliYXN0aGlzLnNvbmRlTXV0YXRpb24ubm91dmVsbGUodGhpcyk7XHJcblx0XHRcdHliYXN0aGlzLnNvbmRlTXV0YXRpb24ubm91dmVsbGUodGhpcy5zaGFkb3dSb290KTsqL1xyXG5cdFx0fTtcclxuXHRcdHByb3RvdHlwZUh0bWxFbGVtZW50LmRldGFjaGVkQ2FsbGJhY2s9IGZ1bmN0aW9uKCkgXHJcblx0XHR7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdkw6l0YWNow6k6ICcsIHRoaXMpXHJcblx0XHR9O1xyXG5cdFx0dHJ5e1x0ZmFicmlxdWUuZXNwYWNlRGVOb21bZXNwYWNlRGVOb21dW3BhcmFtw6h0cmVzLm5vbV0gPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZXNwYWNlRGVOb20gKyAnLScgKyBwYXJhbcOodHJlcy5ub20sIHtwcm90b3R5cGU6IHByb3RvdHlwZUh0bWxFbGVtZW50fSApO1x0fVxyXG5cdFx0Y2F0Y2goZSl7XHR0aHJvdyBuZXcgRXJyb3IoZXNwYWNlRGVOb20gKyAnLWZhYnJpcXVlOiBFcnJldXIgbG9ycyBkZSBsXFwnaW5zY3JpcHRpb24gZGUgQG5vbSAnICsgcGFyYW3DqHRyZXMubm9tKS5saWVyKGUpO1x0fVx0XHRcclxuXHR9O1xyXG59O1xyXG5mYWJyaXF1ZS5lc3BhY2VEZU5vbSA9IHt9O1xyXG5leHBvcnQgZGVmYXVsdCBmYWJyaXF1ZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzMvZWxlbWVudHNQZXJzb25hbGlzw6lzLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgc3lzdGVtZVBvaW50YWdlIGZyb20gJy4vc3lzdGVtZVBvaW50YWdlLmpzJztcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSAnLi93aW5kb3dzLmpzJztcclxuZXhwb3J0IGRlZmF1bHQgKCkgPT5cclxue1xyXG5cdE9iamVjdC5hc3NpZ24oeWJhc3RoaXMsXHJcblx0e1xyXG5cdFx0Y29uZmlnIDpcclxuXHRcdHtcclxuXHRcdFx0Y29udGVuZXVyIDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlY2VwdGFjbGVZYmFzdGhpcycpXHJcblx0XHR9LFxyXG5cdFx0ZG9tIDpcclxuXHRcdHtcclxuXHRcdFx0Y29udGVuZXVyIDogbnVsbCxcclxuXHRcdFx0ZGVza3RvcCA6IG51bGxcclxuXHRcdH0sXHJcblx0XHRzeXN0ZW1lUG9pbnRhZ2UgOiBudWxsXHJcblx0fSk7XHJcblxyXG5cdHliYXN0aGlzLmRvbS5jb250ZW5ldXIgPSB5YmFzdGhpcy5jb25maWcuY29udGVuZXVyO1xyXG5cdHliYXN0aGlzLmRvbS5kZXNrdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0eWJhc3RoaXMuZG9tLmRlc2t0b3AuaWQgPSAnZGVza3RvcCc7XHJcblx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hcHBlbmRDaGlsZCh5YmFzdGhpcy5kb20uZGVza3RvcCk7XHJcblx0T2JqZWN0LmFzc2lnbih5YmFzdGhpcy5kb20uY29udGVuZXVyLnN0eWxlLFxyXG5cdHtcclxuXHRcdGxlZnQgOiAnMHB4JyxcclxuXHRcdHRvcCA6ICcwcHgnLFxyXG5cdFx0aGVpZ2h0IDogJzEwMCUnLFxyXG5cdFx0d2lkdGggOiAnMTAwJScsXHJcblx0XHRwb3NpdGlvbiA6ICdhYnNvbHV0ZScsXHJcblx0XHR6SW5kZXggOiAxXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih5YmFzdGhpcy5kb20uZGVza3RvcC5zdHlsZSxcclxuXHR7XHJcblx0XHRsZWZ0IDogJzBweCcsXHJcblx0XHR0b3AgOiAnMHB4JyxcclxuXHRcdGhlaWdodCA6ICcxMDAlJyxcclxuXHRcdHdpZHRoIDogJzEwMCUnLFxyXG5cdFx0cG9zaXRpb24gOiAnYWJzb2x1dGUnLFx0XHJcblx0XHRvdmVyZmxvdyA6ICdoaWRkZW4nLFxyXG5cdFx0YmFja2dyb3VuZEltYWdlIDogJyB1cmwoLi9hcGkvNC9ndWkvaW1hZ2VzL2JhY2tncm91bmQucG5nKScsXHJcblx0XHRiYWNrZ3JvdW5kU2l6ZSA6ICcxMDAlIDEwMCUnLFxyXG5cdFx0ekluZGV4IDogMlxyXG5cdH0pO1xyXG5cclxuXHR5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UgPSBuZXcgc3lzdGVtZVBvaW50YWdlO1xyXG5cdHliYXN0aGlzLndpbmRvd3MgPSBuZXcgd2luZG93cztcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL2d1aUluZGV4LmpzIiwiaW1wb3J0IGVsQ2FzZUNvY2hlciBmcm9tICcuL2VsZW1lbnRzL2Nhc2VDb2NoZXIuanMnO1xyXG5pbXBvcnQgZWxCb3V0b24gZnJvbSAnLi9lbGVtZW50cy9ib3V0b24uanMnO1xyXG5pbXBvcnQgZWxNZW51IGZyb20gJy4vZWxlbWVudHMvbWVudS5qcyc7XHJcbmltcG9ydCBlbE1lbnVUYWIgZnJvbSAnLi9lbGVtZW50cy9tZW51LXRhYi5qcyc7XHJcbmltcG9ydCBlbE1lbnVPbmdsZXQgZnJvbSAnLi9lbGVtZW50cy9tZW51LW9uZ2xldC5qcyc7XHJcbmltcG9ydCBlbEludGVyZmFjZSBmcm9tICcuL2VsZW1lbnRzL2ludGVyZmFjZS5qcyc7XHJcbmltcG9ydCBlbEdhbGxlcmllIGZyb20gJy4vZWxlbWVudHMvZ2FsbGVyaWUuanMnO1xyXG5pbXBvcnQgZWxTZWxlY3Rpb24gZnJvbSAnLi9lbGVtZW50cy9zZWxlY3Rpb24uanMnO1xyXG5pbXBvcnQgZWxjaG9peCBmcm9tICcuL2VsZW1lbnRzL2Nob2l4LmpzJztcclxuZXhwb3J0IGRlZmF1bHRcclxuW1xyXG5cdGVsQ2FzZUNvY2hlcixcclxuXHRlbEJvdXRvbixcclxuXHRlbE1lbnUsXHJcblx0ZWxNZW51VGFiLFxyXG5cdGVsTWVudU9uZ2xldCxcclxuXHRlbEludGVyZmFjZSxcclxuXHRlbEdhbGxlcmllLFxyXG5cdGVsY2hvaXgsXHJcblx0ZWxTZWxlY3Rpb25cclxuXTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvbGlzdGVFbGVtZW50cy5qcyIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHZ1ZUVzcGFjZVRyYXZhaWwgZnJvbSAnLi9lc3BhY2VUcmF2YWlsL2luZGV4LmpzJztcclxuaW1wb3J0IHZ1ZU1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzL2luZGV4LmpzJztcclxuaW1wb3J0IHZ1ZUFkbWluaXN0cmF0aW9uIGZyb20gJy4vYWRtaW5pc3RyYXRpb24vaW5kZXguanMnO1xyXG5pbXBvcnQgdnVlQXV0cmVzIGZyb20gJy4vYXV0cmVzL2luZGV4LmpzJztcclxuZXhwb3J0IGRlZmF1bHQgKCkgPT5cclxue1xyXG5cdGNvbnN0IGd1aUVkaSA9IG5ldyB5YmFzdGhpcy53aW5kb3dzLldpbmRvdyh7cG9zOiB7eDogMTAsIHk6MTEwfSwgZGltOiB7eDogNTUwLCB5IDogMzA1fSwgdGl0cmU6ICdFREknfSk7XHJcblx0Y29uc3QgZ3VpRWRpMiA9IG5ldyB5YmFzdGhpcy53aW5kb3dzLldpbmRvdyh7cG9zOiB7eDogMTAsIHk6NX0sIGRpbToge3g6IDQyOCwgeSA6IDEwMH0sIHRpdHJlOiAnRURJMid9KTtcclxuXHRndWlFZGkuZG9tLnF1ZXJ5U2VsZWN0b3IoJy55YmFzdGhpc0ZlbmV0cmVDb250ZW51JykuYXBwZW5kQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VkaUNvbnRlbnQnKSApO1xyXG5cdGNvbnN0IGVzcGFjZURlVHJhdmFpbERvbSA9IGd1aUVkaS5kb20ucXVlcnlTZWxlY3RvcignI2VzcGFjZURlVHJhdmFpbCcpO1xyXG5cdGxldCBkZWNhbGFnZSA9IGdldENvbXB1dGVkU3R5bGUoZ3VpRWRpLmRvbS5xdWVyeVNlbGVjdG9yKCcjbWVudVByaW5jaXBhbCcpICkuaGVpZ2h0O1xyXG5cdGVzcGFjZURlVHJhdmFpbERvbS5zdHlsZS50b3AgPSBkZWNhbGFnZTtcclxuXHRlc3BhY2VEZVRyYXZhaWxEb20uc3R5bGUuaGVpZ2h0ID0gKHliYXN0aGlzLnV0aWxpdGFpcmVzLmdyYW5kZXVycy5lbmxldmVyVW5pdMOpKGdldENvbXB1dGVkU3R5bGUoZXNwYWNlRGVUcmF2YWlsRG9tKS5oZWlnaHQpIC0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koZGVjYWxhZ2UpICkgKyAncHgnO1xyXG5cdFx0XHJcblx0Y29uc3QgaW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VzcGFjZURlVHJhdmFpbCcpO1xyXG5cdGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5ham91dGVyKHZ1ZUVzcGFjZVRyYXZhaWwpO1xyXG5cdGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5ham91dGVyKHZ1ZU1vZHVsZXMpO1xyXG5cdGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5ham91dGVyKHZ1ZUFkbWluaXN0cmF0aW9uKTtcclxuXHRpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWpvdXRlcih2dWVBdXRyZXMpO1xyXG5cdC8vXHROT1RFIEV2w6huZW1lbnRzICNtZW51UHJpbmNpcGFsLlxyXG5cdCgoKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0IG1lbnVFbGVtZW50ID0gZ3VpRWRpLmRvbS5xdWVyeVNlbGVjdG9yKCcjbWVudVByaW5jaXBhbCcpO1xyXG5cdFx0bWVudUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWZmaWNoYWdlJywgZSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRsZXQge2NpYmxlfSA9IGUuZGV0YWlsO1xyXG5cdFx0XHRpZihjaWJsZSA9PT0gJ0VzcGFjZSBUcmF2YWlsJykgaW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFmZmljaGVyKCdlc3BhY2VUcmF2YWlsJyk7XHJcblx0XHRcdGVsc2UgaWYoY2libGUgPT09ICdNb2R1bGVzJykgaW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFmZmljaGVyKCdtb2R1bGVzJyk7XHJcblx0XHRcdGVsc2UgaWYoY2libGUgPT09ICdBZG1pbmlzdHJhdGlvbicpICBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ2FkbWluaXN0cmF0aW9uJyk7XHJcblx0XHRcdGVsc2UgaWYoY2libGUgPT09ICdBdXRyZXMnKSBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ2F1dHJlcycpO1xyXG5cdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcignT25nbGV0IG5vbiBnw6lyw6k6ICcgKyBub21PbmdsZXQgKyAnIScpO1xyXG5cdFx0fSApO1xyXG5cdFx0XHJcblx0fSkoKTtcclxuXHQvKipcclxuXHRcdFRlc3RcclxuXHQqKi9cclxuXHR7XHJcblx0XHRsZXQgYWFhVGVzdERvbSA9IFxyXG5cdFx0YFxyXG5cdFx0XHQ8eWItbWVudT5cclxuXHRcdFx0XHQ8eWItb25nbGV0IG5vbT0nTW9kZWxlJyB0eXBlPSdib3V0b24nPjwveWItb25nbGV0PlxyXG5cdFx0XHRcdFx0PHliLW9uZ2xldCBub209J0ltcGzDqW1lbnRhdGlvbicgPjwveWItb25nbGV0PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdNb2RlbGUnIHR5cGU9J3NlbGVjdGlvbic+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdIQUhBJyA+IDwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdIT0hPJyA+IDwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdQZW5pcycgPiA8L3liLWNob2l4PlxyXG5cdFx0XHRcdDwveWItb25nbGV0PlxyXG5cdFx0XHQ8L3liLW1lbnU+XHJcblx0XHRcdDx5Yi1ib3V0b24+VGVzdDwveWItYm91dG9uPlxyXG5cdFx0YDtcclxuXHRcdGd1aUVkaTIuZG9tLnF1ZXJ5U2VsZWN0b3IoJy55YmFzdGhpc0ZlbmV0cmVDb250ZW51JykuaW5uZXJIVE1MID0gYWFhVGVzdERvbTtcclxuXHRcdC8vZ3VpRWRpMi5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUNvbnRlbnUnKS5xdWVyeVNlbGVjdG9yKCd5Yi1tZW51JykuYXBwbGlxdWVyQm9yZHVyZSgpO1xyXG5cdFx0bGV0IGVzcGFjZVRyYXZhaWxEb20gPSBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ2VzcGFjZVRyYXZhaWwnKTtcclxuXHRcdGxldCBpbnRlcmZhY2UyID0gZXNwYWNlVHJhdmFpbERvbS5xdWVyeVNlbGVjdG9yKCd5Yi1pbnRlcmZhY2UnKTtcclxuXHRcdC8vaW50ZXJmYWNlMi5hZmZpY2hlcigncHJvamV0Q2xhc3NlJyk7XHJcblx0fVxyXG5cdHtcclxuXHRcdHZhciBrYWthID0gW107XHJcblx0XHRkb2N1bWVudC5ib2R5Lmxhc3RDaGlsZC5wYXJjb3VyaXJCYXMoemlnemFnID0+IGtha2EucHVzaCh6aWd6YWcpICk7XHJcblx0XHRjb25zb2xlLmxvZygna2FrYScsIGtha2EpO1xyXG5cdFx0XHJcblx0fVxyXG59XHJcblx0XHRcclxuXHRcdFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS91aS9wcmluY2lwYWxlLmpzIiwiY29uc3QgX2NsYXNzZV8gPSBub20gPT4gJ3liYXN0aGlzRmVuZXRyZScgKyBub207XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zKVxyXG57XHJcblx0Y29uc3Qgc2VsZiA9IHRoaXM7XHJcblx0dHJ5XHJcblx0e1xyXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0XHRvcHRpb25zLnBvcyA9IG9wdGlvbnMucG9zIHx8IHt4OjAsIHk6MH07XHJcblx0XHRvcHRpb25zLmRpbSA9IG9wdGlvbnMuZGltIHx8IHt4OjI1MCwgeTo5Mn07XHJcblxyXG5cdFx0dGhpcy50aXRyZSA9IG9wdGlvbnMudGl0cmUgfHwgeWJhc3RoaXMud2luZG93cy50aXRyZU1heCsrO1xyXG5cdFx0dGhpcy5wb3MgPSBvcHRpb25zLnBvcztcclxuXHRcdHRoaXMuZGltID0gb3B0aW9ucy5kaW07XHJcblx0XHR0aGlzLmRvbSA9IHZvaWQoeWJhc3RoaXMuZG9tLmRlc2t0b3AuYXBwZW5kQ2hpbGQoZG9tRmVuZXRyZS5jbG9uZU5vZGUodHJ1ZSkgKSApIHx8IHliYXN0aGlzLmRvbS5kZXNrdG9wLmxhc3RDaGlsZDtcclxuXHRcdHRoaXMuY2xvc2UgPSAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmRvbS5yZW1vdmUoKTtcclxuXHRcdFx0eWJhc3RoaXMud2luZG93cy5saXN0ZS5zdXBwcmltZXIodGhpcyk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5kaW1tZW5zaW9ubmVyID0gKHgsIHkpID0+XHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZG9tLnN0eWxlLndpZHRoID0geCArICdweCc7XHJcblx0XHRcdHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IHkgKyAncHgnO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMubm9tbWVyID0gbm9tID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKHRoaXMudGl0cmUgPT09IG5vbSkgdGhyb3cgbmV3IEVycm9yKCdub21tYWdlIGRcXCd1bmUgZmVuw6p0cmUgYXZlYyB1biBub3V2ZWF1IG5vbSBpZGVudGlxdWUnKTtcclxuXHRcdFx0dGhpcy50aXRyZSA9IG5vbSB8fCB0aGlzLnRpdHJlO1xyXG5cdFx0XHR0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlVGl0cmUgcCcpLnRleHRDb250ZW50ID0gdGhpcy50aXRyZTtcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdFx0dmFyIGNvbGlzaW9uQ29udGludWUgPSBmYWxzZTtcclxuXHRcdHRoaXMucG9zaXRpb25uZXIgPSAoeCwgeSkgPT5cclxuXHRcdHtcclxuXHRcdFx0dmFyIGNvbGlzaW9uID0gZmFsc2U7XHJcblx0XHRcdC8qXHREw6l0ZWN0aW9uIGRlcyBjb2xpc2lvbnNcclxuXHRcdFx0XHRMb2dpcXVlOlxyXG5cdFx0XHRcdFx0UG91ciBjaGFxdWUgZmVuZXRyZSByw6ljdXDDqXJlciBzYSBwb3NpdGlvbiBFVCBzYSB0YWlsbGVcclxuXHRcdFx0Ki9cclxuXHRcdFx0Zm9yKHZhciBmZW5ldHJlIG9mIHliYXN0aGlzLndpbmRvd3MubGlzdGUgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYoKGZlbmV0cmUuYXBwID09PSB0aGlzLmFwcCkgJiYgKGZlbmV0cmUudGl0cmUgPT09IHRoaXMudGl0cmUpICkgY29udGludWU7XHJcblx0XHRcdFx0Y29uc3Qge3BvcywgZGltfSA9IGZlbmV0cmU7XHJcblx0XHRcdFx0aWYgKCgodGhpcy5wb3MueCA+PSBwb3MueCkgJiYgKHRoaXMucG9zLnggPD0gcG9zLnggKyBkaW0ueCkpICYmXHJcblx0XHRcdFx0XHQoKHRoaXMucG9zLnkgPj0gcG9zLnkpICYmICh0aGlzLnBvcy55IDw9IHBvcy55ICsgZGltLnkpKSlcclxuXHRcdFx0XHRcdGNvbGlzaW9uID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZGVwbGFjZXIgPSB0cnVlO1xyXG5cdFx0XHRpZihjb2xpc2lvbilcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdjb2xsaXNpb24nKTtcclxuXHRcdFx0XHRpZihjb2xpc2lvbkNvbnRpbnVlID09PSBmYWxzZSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuYmxvcXVlcigpO1xyXG5cdFx0XHRcdFx0ZGVwbGFjZXIgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHZhciB4ID0gc2V0VGltZW91dCgoKSA9PiB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuZMOpYmxvcXVlcigpLCA1MDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb2xpc2lvbkNvbnRpbnVlID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGNvbGlzaW9uQ29udGludWUgPSBmYWxzZTtcclxuXHRcdFx0aWYoZGVwbGFjZXIpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLnBvcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnBvcy55ID0geTtcclxuXHRcdFx0XHR0aGlzLmRvbS5zdHlsZS5sZWZ0ID0geCArICdweCc7XHJcblx0XHRcdFx0dGhpcy5kb20uc3R5bGUudG9wID0geSArICdweCc7XHJcblx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHJcblx0XHR9O1xyXG5cdCgoKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0IGZlbmV0cmVIYXV0RG9tID0gdGhpcy5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUhhdXQnKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT4geWJhc3RoaXMud2luZG93cy50b0ZpcnN0UGxhbih0aGlzKSApO1xyXG5cdFx0dGhpcy5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUhhdXQnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PlxyXG5cdFx0e1xyXG5cdFx0XHR5YmFzdGhpcy53aW5kb3dzLmluaXRpYWxpc2VyRMOpcGxhY2VtZW50KHRoaXMpO1xyXG5cdFx0fSApO1xyXG5cdFx0XHJcblx0XHRmZW5ldHJlSGF1dERvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBlID0+IChlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ1AnKT8geWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLmNoYW5nZUN1cnNvcihmYWxzZSwgJ2RlcGxhY2VyJykgOiB2b2lkIDEpO1xyXG5cdFx0ZmVuZXRyZUhhdXREb20uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuY2hhbmdlQ3Vyc29yKGZhbHNlLCAnbm9ybWFsJykgKTtcclxuXHRcdGNvbnN0IGJ1dHRvbnMgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yQWxsKCcueWJhc3RoaXNGZW5ldHJlSGF1dCBpbWcnKTtcclxuXHRcdGZvcih2YXIgYnV0dG9uIG9mIGJ1dHRvbnMpXHJcblx0XHR7XHJcblx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PiB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuY2hhbmdlQ3Vyc29yKGZhbHNlLCAnZGVjbGVuY2hlcicpICk7XHJcblx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdub3JtYWwnKSApO1xyXG5cdFx0XHRcclxuXHRcdH1cclxuXHRcdGJ1dHRvbnNbMl0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlKTtcclxuXHR9ICkoKTtcclxuXHRcdHRoaXMucG9zaXRpb25uZXIodGhpcy5wb3MueCwgdGhpcy5wb3MueSk7XHJcblx0XHR0aGlzLmRpbW1lbnNpb25uZXIodGhpcy5kaW0ueCwgdGhpcy5kaW0ueSk7XHJcblx0XHR0aGlzLm5vbW1lcigpO1xyXG5cdFx0eWJhc3RoaXMud2luZG93cy5saXN0ZS5ham91dGVyKHRoaXMpO1xyXG5cdFx0XHJcblx0XHRsZXQgY29udGVudURvbSA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoJy4nICsgX2NsYXNzZV8oJ0NvbnRlbnUnKSApO1xyXG5cdFx0Y29udGVudURvbS5zdHlsZS5oZWlnaHQgPSAoeWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW51RG9tKS5oZWlnaHQpIC0gMzIpICsgJ3B4JztcclxuXHR9XHRcclxuXHRjYXRjaChlcnIpXHJcblx0e1xyXG5cdFx0Y29uc29sZS5sb2coJ2VyckluaXRpYWxpc2F0aW9uIG1vZHVsZTpcdCcsIGVycik7XHJcblx0fVxyXG59O1xyXG5cclxuY29uc3QgZG9tRmVuZXRyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4vKipcclxuXHQ8ZGl2PlxyXG5cdFx0PGRpdiBjbGFzcz0nSGF1dCc+XHJcblx0XHRcdDxkaXYgY2xhc3M9J1RpdHJlJz5cclxuXHRcdFx0XHQ8cD48L3A+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPSdCb3V0b25zJz48L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PGRpdiBjbGFzcz0nQ29udGVudSc+PC9kaXY+XHJcblx0PC9kaXY+XHJcbioqL1xyXG4oKCkgPT5cclxue1xyXG5cdHZhciBjcsOpZXJFbMOpbWVudCA9IChlbCkgPT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbCk7XHJcblx0dmFyIGRpdiA9ICgpID0+IGNyw6llckVsw6ltZW50KCdkaXYnKTtcclxuXHRcdFx0XHRcclxuXHR2YXIgdGFiID0gW107XHJcblx0Zm9yKHZhciBpID0wOyBpIDw9IDE7IGkrKykgdGFiLnB1c2goZGl2KClcdCk7XHJcblx0Zm9yKHZhciBpID0wOyBpIDw9IDE7IGkrKykgdGFiWzBdLmFwcGVuZENoaWxkKGRpdigpXHQpO1xyXG5cdFxyXG5cdHRhYlswXS5jbGFzc05hbWUgPSBfY2xhc3NlXygnSGF1dCcpO1x0XHJcblx0dGFiWzBdLmNoaWxkcmVuWzBdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdUaXRyZScpO1xyXG5cdHRhYlswXS5jaGlsZHJlblswXS5hcHBlbmRDaGlsZChjcsOpZXJFbMOpbWVudCgncCcpICk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdCb3V0b25zJyk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdpbWcnKVx0KTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uYXBwZW5kQ2hpbGQoY3LDqWVyRWzDqW1lbnQoJ2ltZycpXHQpO1xyXG5cdHRhYlswXS5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChjcsOpZXJFbMOpbWVudCgnaW1nJylcdCk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLnNyYyA9ICcuL2FwaS80L2d1aS9pbWFnZXMvbWluaW1pc2VyLnBuZyc7XHRcdFx0XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzFdLnNyYyA9ICcuL2FwaS80L2d1aS9pbWFnZXMvcmVkdWlyZS5wbmcnO1x0XHRcdFxyXG5cdHRhYlswXS5jaGlsZHJlblsxXS5jaGlsZHJlblsyXS5zcmMgPSAnLi9hcGkvNC9ndWkvaW1hZ2VzL2Zlcm1lci5wbmcnO1xyXG5cdHRhYlsxXS5jbGFzc05hbWUgPSBfY2xhc3NlXygnQ29udGVudScpO1xyXG5cdFxyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLnN0eWxlLFxyXG5cdHtcclxuXHRcdGhlaWdodDogXHRcdFx0MzIgKyAncHgnLFxyXG5cdFx0d2lkdGg6IFx0XHRcdFx0JzEwMCUnLFxyXG5cdFx0cG9zaXRpb246XHRcdFx0J2Fic29sdXRlJyxcclxuXHRcdGJvcmRlckJvdHRvbTpcdCcxcHggc29saWQgYmxhY2snXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0cG9zaXRpb246XHQnYWJzb2x1dGUnLFxyXG5cdFx0bWFyZ2luOlx0XHQnMHB4JyxcclxuXHRcdGhlaWdodDpcdFx0JzEwMCUnLFxyXG5cdFx0d2lkdGg6XHRcdCcxMDAlJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzFdLnN0eWxlLFxyXG5cdHtcclxuXHRcdHRvcDpcdFx0XHQnNHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J2Fic29sdXRlJyxcclxuXHRcdHJpZ2h0Olx0XHQnNHB4J1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLnN0eWxlLFxyXG5cdHtcclxuXHRcdHZlcnRpY2FsQWxpZ246XHQnbWlkZGxlJyxcclxuXHRcdHBvc2l0aW9uOiBcdFx0XHQnYWJzb2x1dGUnLFxyXG5cdFx0bWFyZ2luOlx0XHRcdFx0XHQnMHB4JyxcclxuXHRcdGhlaWdodDpcdFx0XHRcdFx0JzEwMCUnLFxyXG5cdFx0d2lkdGg6XHRcdFx0XHRcdCcxMDAlJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLnN0eWxlLFxyXG5cdHtcclxuXHRcdGhlaWdodDpcdFx0JzI0cHgnLFxyXG5cdFx0d2lkdGg6XHRcdCcyNHB4JyxcclxuXHRcdHJpZ2h0Olx0XHQnOHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J3JlbGF0aXZlJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzFdLnN0eWxlLFxyXG5cdHtcclxuXHRcdGhlaWdodDogXHQnMjRweCcsXHJcblx0XHR3aWR0aDogXHRcdCcyNHB4JyxcclxuXHRcdHJpZ2h0OiBcdFx0JzRweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZSdcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlswXS5jaGlsZHJlblsxXS5jaGlsZHJlblsyXS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6IFx0JzI0cHgnLFxyXG5cdFx0d2lkdGg6IFx0XHQnMjRweCcsXHJcblx0XHRyaWdodDogXHRcdCcwcHgnLFxyXG5cdFx0cG9zaXRpb246XHQncmVsYXRpdmUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0Olx0XHQnMTAwJScsXHJcblx0XHR0b3A6XHRcdFx0JzMycHgnLFxyXG5cdFx0cG9zaXRpb246XHQncmVsYXRpdmUnLFxyXG5cdFx0b3ZlcmZsb3c6XHQnYXV0bydcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKGRvbUZlbmV0cmUuc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0XHRcdDEyNSArICdweCcsXHJcblx0XHR3aWR0aDpcdFx0XHRcdFx0XHQyNTAgKyAncHgnLFxyXG5cdFx0YmFja2dyb3VuZENvbG9yOlx0JyNENEQ0RDQnLFxyXG5cdFx0Ym94U2hhZG93Olx0XHRcdFx0JzBweCAwcHggOXB4IHdoaXRlJyxcclxuXHRcdHBvc2l0aW9uOlx0XHRcdFx0XHQnYWJzb2x1dGUnLFxyXG5cdFx0Ym9yZGVyQ29sb3I6XHRcdFx0J2JsYWNrJyxcclxuXHRcdGJvcmRlclN0eWxlOlx0XHRcdCdzb2xpZCcsXHJcblx0XHRib3JkZXJXaWR0aDpcdFx0XHQnMXB4J1xyXG5cdH0pO1xyXG5cdGZvcih2YXIgZWwgb2YgdGFiKVxyXG5cdFx0ZG9tRmVuZXRyZS5hcHBlbmRDaGlsZChlbCk7XHJcbn0pKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9XaW5kb3cuanMiLCIndXNlIHN0cmljdCc7XG5jb25zdCBwb2ludGVyTG9jayA9IChkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnQgIT09IHVuZGVmaW5lZCkgP1xue1xuXHRldmVudCA6ICdtb3pQb2ludGVybG9ja2NoYW5nZScsXG5cdGVsZW1lbnQgOiAoKSA9PiBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnRcbn0gOlxuKGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCAhPT0gdW5kZWZpbmVkKSA/XG57XG5cdGV2ZW50IDogJ3dlYmtpdFBvaW50ZXJsb2NrY2hhbmdlJyxcblx0ZWxlbWVudCA6ICgpID0+IGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudFxufSA6XG57XG5cdGV2ZW50IDogJ3BvaW50ZXJsb2NrY2hhbmdlJyxcblx0ZWxlbWVudCA6ICgpID0+IGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2hhcmVkID0+XG57XG5cdGNvbnN0IHF1ZXJ5Q3Vyc29yID0gKCkgPT5cblx0e1xuXHRcdGlmKHNoYXJlZC5pc0hhbmRsZWQpXG5cdFx0XHRyZXR1cm47XG5cdFx0c2hhcmVkLmRvbS5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XG5cdH07XG5cdGNvbnN0IG9uUG9pbnRlckxvY2tDaGFuZ2UgPSAoKSA9PlxuXHR7XG5cdFx0aWYgKHBvaW50ZXJMb2NrLmVsZW1lbnQoKSA9PSBzaGFyZWQuZG9tLmNhbnZhcylcblx0XHR7XG5cdFx0XHRzaGFyZWQuaXNIYW5kbGVkID0gdHJ1ZTtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcXVlcnlDdXJzb3IpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0c2hhcmVkLmlzSGFuZGxlZCA9IGZhbHNlO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBxdWVyeUN1cnNvcik7XG5cdFx0fVxuXHR9O1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHBvaW50ZXJMb2NrLmV2ZW50LCBvblBvaW50ZXJMb2NrQ2hhbmdlLCBmYWxzZSk7XG5cdG9uUG9pbnRlckxvY2tDaGFuZ2UoKTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyQ2FwdHVyZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYmluZGVkRXZlbnRzID0gWydtb3VzZXVwJywgJ2RibGNsaWNrJywgJ21vdXNlZG93biddO1xuZXhwb3J0IGRlZmF1bHQgc2hhcmVkID0+XG57XG5cdGNvbnN0IGV2ZW50QmluZFRvTm9kZSA9IChldmVudCkgPT5cblx0e1xuXHRcdGlmKGV2ZW50LmlzVHJ1c3RlZClcblx0XHR7XG5cdFx0XHRjb25zdCBub2RlID0gc2hhcmVkLmdldE5vZGVGcm9tQ3Vyc29yKCk7XG5cdFx0XHRpZiAobm9kZSlcblx0XHRcdFx0bm9kZS5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KGV2ZW50LnR5cGUsIHNoYXJlZC5JRXZlbnQpKTtcblx0XHRcdHJldHVybiAobm9kZSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHRcdHJldHVybiAobnVsbCk7XG5cdH07XG5cdGZvcihjb25zdCBldmVudCBvZiBiaW5kZWRFdmVudHMpXG5cdFx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEJpbmRUb05vZGUsIGZhbHNlKTtcblx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5hZGRFdmVudExpc3RlbmVyXG5cdChcblx0XHQnY2xpY2snLFxuXHRcdGV2ZW50ID0+XG5cdFx0e1xuXHRcdFx0Y29uc3Qgbm9kZSA9IGV2ZW50QmluZFRvTm9kZShldmVudCk7XG5cdFx0XHRpZiAobm9kZSlcblx0XHRcdFx0bm9kZS5mb2N1cygpO1xuXHRcdH0sXG5cdFx0ZmFsc2Vcblx0KTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyRXZlbnRCaW5kaW5nLmpzIiwiJ3VzZSBzdHJpY3QnO1xuZXhwb3J0IGRlZmF1bHQgc2hhcmVkID0+XG57XG5cdGxldCBlbGVtUHJlY2VuZGVudCA9IG51bGw7XG5cdGNvbnN0IG9uTW91c2VNb3ZlID0gZXZlbmVtZW50ID0+XG5cdHtcblx0XHRpZiAoc2hhcmVkLmlzTG9ja2VkID09PSB0cnVlIHx8ICFzaGFyZWQuaXNIYW5kbGVkKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHBvcyA9IHNoYXJlZC5wb3NpdGlvbjtcblx0XHRwb3MueCArPSBldmVuZW1lbnQubW92ZW1lbnRYO1xuXHRcdHBvcy55ICs9IGV2ZW5lbWVudC5tb3ZlbWVudFk7XG5cdFx0aWYgKHBvcy54IDwgMSlcblx0XHRcdHBvcy54ID0gc2hhcmVkLmFyZWFTaXplLnggLSAxO1xuXHRcdGVsc2UgaWYgKHBvcy55IDwgMSlcblx0XHRcdHBvcy55ID0gc2hhcmVkLmFyZWFTaXplLnkgLSAxO1xuXHRcdGVsc2UgaWYgKHBvcy54ID4gc2hhcmVkLmFyZWFTaXplLnggLSAxKVxuXHRcdFx0cG9zLnggPSAwO1xuXHRcdGVsc2UgaWYgKHBvcy55ID4gc2hhcmVkLmFyZWFTaXplLnkgLSAxKVxuXHRcdFx0cG9zLnkgPSAwO1xuXHRcdHNoYXJlZC5kb20uY3Vyc29yLnN0eWxlLmxlZnQgPSBwb3MueCArICdweCc7XG5cdFx0c2hhcmVkLmRvbS5jdXJzb3Iuc3R5bGUudG9wID0gcG9zLnkgKyAncHgnO1xuXHRcdGZvcihsZXQgbGlzdGVuZXIgb2Ygc2hhcmVkLmxpc3RlbmVycylcblx0XHRcdGxpc3RlbmVyKCk7XG5cdFx0Y29uc3QgZWxBY3QgPSBzaGFyZWQuZ2V0Tm9kZUZyb21DdXJzb3IoKTtcblx0XHRpZiAoKGVsQWN0ID09PSBudWxsKSB8fCBlbEFjdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmKGVsZW1QcmVjZW5kZW50ID09PSBudWxsKSBlbGVtUHJlY2VuZGVudCA9IGVsQWN0O1xuXHRcdGlmKGVsQWN0ICE9PSBlbGVtUHJlY2VuZGVudClcblx0XHR7XG5cdFx0XHRsZXQgZXZNb3VzZU92ZXIgPSBuZXcgQ3VzdG9tRXZlbnQoJ21vdXNlb3ZlcicsICBzaGFyZWQuSUV2ZW50KTtcblx0XHRcdGxldCBldk1vdXNlT3V0ID0gbmV3IEN1c3RvbUV2ZW50KCdtb3VzZW91dCcsICBzaGFyZWQuSUV2ZW50KTtcblx0XHRcdGVsZW1QcmVjZW5kZW50LmRpc3BhdGNoRXZlbnQoZXZNb3VzZU91dCk7XG5cdFx0XHRlbEFjdC5kaXNwYXRjaEV2ZW50KGV2TW91c2VPdmVyKTtcblx0XHRcdGVsZW1QcmVjZW5kZW50ID0gZWxBY3Q7XG5cdFx0fVxuXHR9O1xuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyT25Nb3ZlLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHN0YXJ0Q2FwdHVyZSBmcm9tICcuL3BvaW50ZXJDYXB0dXJlLmpzJztcclxuaW1wb3J0IGV2ZW50QmluZGluZyBmcm9tICcuL3BvaW50ZXJFdmVudEJpbmRpbmcuanMnO1xyXG5pbXBvcnQgcG9pbnRlck9uTW92ZUluaXQgZnJvbSAnLi9wb2ludGVyT25Nb3ZlLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKClcclxue1xyXG5cdGNvbnN0IGNoZW1pbmN1cnNvcnMgPSAnLi9hcGkvNC9ndWkvY3Vyc29ycy8nO1xyXG5cdGNvbnN0IGRvbSA9XHJcblx0e1xyXG5cdFx0Y2FudmFzIDogT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSxcclxuXHRcdHtcclxuXHRcdFx0aWQgOiAnY2FudmFzJ1xyXG5cdFx0fSksXHJcblx0XHRjdXJzb3IgOiBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLFxyXG5cdFx0e1xyXG5cdFx0XHRzcmMgOiBjaGVtaW5jdXJzb3JzICsgJ25vcm1hbC5wbmcnLFxyXG5cdFx0XHRpZCA6ICdjdXJzb3InXHJcblx0XHR9KVxyXG5cdH07XHJcblx0Y29uc3Qgc2hhcmVkID1cclxuXHR7XHJcblx0XHRkb20sXHJcblx0XHRpc0xvY2tlZDpcdFx0XHRcdFx0XHRmYWxzZSxcclxuXHRcdGlzSGFuZGxlZDpcdFx0XHRcdFx0ZmFsc2UsXHJcblx0XHRnZXROb2RlRnJvbUN1cnNvcjpcdCgpID0+XHJcblx0XHRcdGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoc2hhcmVkLnBvc2l0aW9uLngsIHNoYXJlZC5wb3NpdGlvbi55KSxcclxuXHRcdHBvc2l0aW9uOlx0XHRcdFx0XHRcdHt4OiAwLCB5OiAwfSxcclxuXHRcdGFyZWFTaXplOlx0XHRcdFx0XHRcdHt4OiAwLCB5OiAwfSxcclxuXHRcdGxpc3RlbmVyczpcdFx0XHRcdFx0W10sXHJcblx0XHRJRXZlbnQ6XHJcblx0XHR7XHJcblx0XHRcdGRldGFpbHM6XHRcdHtzaW11bGUgOiB0cnVlfSxcclxuXHRcdFx0YnViYmxlczpcdFx0dHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTpcdHRydWUsXHJcblx0XHRcdGNvbXBvc2VkOlx0XHR0cnVlXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0T2JqZWN0LmFzc2lnbihkb20uY3Vyc29yLnN0eWxlLFxyXG5cdHtcclxuXHRcdHRvcDpcdFx0XHQnMHB4JyxcclxuXHRcdGhlaWdodDpcdFx0JzIwcHgnLFxyXG5cdFx0d2lkdGg6XHRcdCcxNHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J2Fic29sdXRlJyxcclxuXHRcdHpJbmRleDpcdFx0ODAwLFxyXG5cdFx0cG9pbnRlckV2ZW50Olx0J25vbmUnXHJcblx0fSk7XHJcblx0ZG9tLmN1cnNvci5zdHlsZS5zZXRQcm9wZXJ0eSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScsICdpbXBvcnRhbnQnKTtcclxuXHRjb25zdCBkw6ljYWxhZ2UgPSB7eDogMCwgeTogMH07XHJcblx0Y29uc3QgdHlwZWN1cnNvciA9IFxyXG5cdHtcclxuXHRcdG5vcm1hbCA6IHt4OiAwLCB5OiAwfSxcclxuXHRcdGRlY2xlbmNoZXIgOiB7eDogMCwgeTogMH0sXHJcblx0XHRkZXBsYWNlciA6IHt4OiAwLCB5IDogMH1cclxuXHR9O1xyXG5cdGxldCBjdXJzb3JBY3R1ZWwgPSAnbm9ybWFsJztcclxuXHRsZXQgY3Vyc29yQmxvcXXDqSA9IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMuYmxvcXVlciA9ICgpID0+XHJcblx0e1xyXG5cdFx0aWYoY3Vyc29yQmxvcXXDqSkgdGhyb3cgbmV3IEVycm9yKCd5YmFzdGhpc0FwcGxpY2F0aW9uLnN5c3RlbWVQb2ludGFnZS5ibG9xdWVyOiBwb2ludGV1ciBkw6lqw6AgYmxvcXXDqScpO1xyXG5cdFx0Y3Vyc29yQmxvcXXDqSA9IHRydWU7XHJcblx0fTtcclxuXHRcclxuXHR0aGlzLmTDqWJsb3F1ZXIgPSAoKSA9PlxyXG5cdHtcclxuXHRcdGlmKCFjdXJzb3JCbG9xdcOpKSB0aHJvdyBuZXcgRXJyb3IoJ3liYXN0aGlzQXBwbGljYXRpb24uc3lzdGVtZVBvaW50YWdlLmTDqWJsb3F1ZXI6IHBvaW50ZXVyIG5vbiBibG9xdcOpJyk7XHJcblx0XHRjdXJzb3JCbG9xdcOpID0gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0dGhpcy5wb3NpdGlvbiA9ICgpID0+IHNoYXJlZC5wb3NpdGlvbjtcclxuXHQvKipcclxuXHRcdERlZjpDaGFuZ2UgbGUgY3Vyc29yXHJcblx0XHRSZXRvdXI6IHZvaWRcclxuXHRcdEBlc3RBY3RpdmF0aW9uIGJvb2zDqWVuID0+IGluZGlxdWUgc2kgbGUgY3Vyc29yIHNpZ25hbGUgdW5lIGFjdGl2YXRpb25cclxuXHRcdEB0eXBlIGNoYWluZUNhcmFjdMOocmUgPT4gbGUgdHlwZSBkZSBjdXJzb3Igdm91bHVcclxuXHRcdFN1cHBsw6ltZW50OlxyXG5cdFx0XHRAdHlwZSBvcHRpb25uZWwgYXVxdWVsIGNhcyBzZXVsZW1lbnQgbGUgdHlwZSBkJ2FjdGl2YXRpb24gc2VyYSBtb2RpZmnDqS5cclxuXHQqKi9cclxuXHR0aGlzLmNoYW5nZUN1cnNvciA9IChlc3RBY3RpdmF0aW9uLCB0eXBlKSA9PlxyXG5cdHtcclxuXHRcdGxldCBjdXJzb3IgPSBjaGVtaW5jdXJzb3JzO1xyXG5cdFx0aWYoZXN0QWN0aXZhdGlvbiA9PT0gdHJ1ZSkgY3Vyc29yICs9ICdfJyA7XHJcblx0XHRpZih0eXBlKVxyXG5cdFx0e1xyXG5cdFx0XHRpZighdHlwZWN1cnNvclt0eXBlXSApIHRocm93IG5ldyBFcnJvcignY2hhbmdlbWVudCBkZSBjdXJzb3IgYXZlYyB1biB0eXBlIGludmFsaWRlOlx0JyArIHR5cGUpO1xyXG5cdFx0XHRjdXJzb3JBY3R1ZWwgPSB0eXBlO1xyXG5cdFx0XHRkw6ljYWxhZ2UueCA9IHR5cGVjdXJzb3JbdHlwZV0ueDtcclxuXHRcdFx0ZMOpY2FsYWdlLnkgPSB0eXBlY3Vyc29yW3R5cGVdLnk7XHJcblx0XHRcdGN1cnNvciArPSAgdHlwZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgY3Vyc29yICs9ICBjdXJzb3JBY3R1ZWw7XHJcblx0XHRkb20uY3Vyc29yLnNyYyA9IGN1cnNvciArICcucG5nJztcclxuXHR9O1xyXG5cdHRoaXMucXVhbmRNb3V2ZW1lbnQgPSBmbiA9PiBzaGFyZWQubGlzdGVuZXJzLnB1c2goZm4pO1xyXG5cdFxyXG5cdHRyeSBcclxuXHR7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHRoaXMuY2hhbmdlQ3Vyc29yKHRydWUpICk7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB0aGlzLmNoYW5nZUN1cnNvcihmYWxzZSkgKTtcclxuXHRcdHliYXN0aGlzLmRvbS5jb250ZW5ldXIuYXBwZW5kQ2hpbGQoZG9tLmN1cnNvcik7XHJcblx0XHRkb20uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFwcGVuZENoaWxkKGRvbS5jYW52YXMpO1xyXG5cdFx0Y29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKHliYXN0aGlzLmRvbS5kZXNrdG9wKTtcclxuXHRcdHNoYXJlZC5hcmVhU2l6ZS54ID0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koY3Mud2lkdGgpO1xyXG5cdFx0c2hhcmVkLmFyZWFTaXplLnkgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShjcy5oZWlnaHQpO1xyXG5cdFx0c3RhcnRDYXB0dXJlKHNoYXJlZCk7XHJcblx0XHRldmVudEJpbmRpbmcoc2hhcmVkKTtcclxuXHRcdHBvaW50ZXJPbk1vdmVJbml0KHNoYXJlZCk7XHJcblx0fVxyXG5cdGNhdGNoKGVycilcclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZygnZXJySW5pdGlhbGlzYXRpb24gbW9kdWxlOlx0JywgZXJyKTtcclxuXHR9XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9zeXN0ZW1lUG9pbnRhZ2UuanMiLCJpbXBvcnQgV2luZG93IGZyb20gJy4vV2luZG93LmpzJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKVxyXG57XHJcblx0XHRjb25zdCBkw6ljYWxhZ2VQeCA9IHt4IDogbnVsbCwgeSA6IG51bGx9O1xyXG5cdFx0Y29uc3QgZMOpcGxhY2VyID0gKMOpdGF0KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCBwb2ludGV1clBvc2l0aW9uID0geWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLnBvc2l0aW9uKCk7XHJcblx0XHRcdHN3aXRjaCjDqXRhdClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNhc2UgJ2TDqWJ1dCc6XHJcblx0XHRcdFx0XHRkw6ljYWxhZ2VQeC54ID0gcG9pbnRldXJQb3NpdGlvbi54IC0gZmVuZXRyZUVuRMOpcGxhY2VtZW50LnBvcy54O1xyXG5cdFx0XHRcdFx0ZMOpY2FsYWdlUHgueSA9IGZlbmV0cmVFbkTDqXBsYWNlbWVudC5wb3MueSAtIHBvaW50ZXVyUG9zaXRpb24ueTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdlbmNvdXJzJzpcclxuXHRcdFx0XHRcdGlmKGZlbmV0cmVFbkTDqXBsYWNlbWVudClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZmVuZXRyZUVuRMOpcGxhY2VtZW50LnBvc2l0aW9ubmVyXHJcblx0XHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0XHRwb2ludGV1clBvc2l0aW9uLnggLSBkw6ljYWxhZ2VQeC54LCBcclxuXHRcdFx0XHRcdFx0XHRwb2ludGV1clBvc2l0aW9uLnkgKyBkw6ljYWxhZ2VQeC55XHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHJldHVybjtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdmaW4nOlxyXG5cdFx0XHRcdFx0aWYoZmVuZXRyZUVuRMOpcGxhY2VtZW50ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGZlbmV0cmVFbkTDqXBsYWNlbWVudCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHRcdFx0ZMOpY2FsYWdlUHgueCA9IDA7XHJcblx0XHRcdFx0XHRcdGTDqWNhbGFnZVB4LnkgPSAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSByZXR1cm47XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGZlbmV0cmVFbkTDqXBsYWNlbWVudCA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciBpbmRleFByZW1pZXJQbGFuID0gMDtcclxuXHRcdHRoaXMuaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQgPSBmZW5ldHJlID0+XHJcblx0XHR7XHJcblx0XHRcdGZlbmV0cmVFbkTDqXBsYWNlbWVudCA9IGZlbmV0cmU7XHJcblx0XHRcdGTDqXBsYWNlcignZMOpYnV0Jyk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5XaW5kb3cgPSBXaW5kb3c7XHJcblx0XHR0aGlzLmxpc3RlID0gbmV3IHliYXN0aGlzLnR5cGVzRG9ubmVlcy5MaXN0ZSgpO1xyXG5cdFx0dGhpcy50b0ZpcnN0UGxhbiA9IHdpbmRvdyA9PiB3aW5kb3cuZG9tLnN0eWxlLnpJbmRleCA9IGluZGV4UHJlbWllclBsYW4rKztcclxuXHRcdHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5xdWFuZE1vdXZlbWVudCgoKSA9PiBkw6lwbGFjZXIoJ2VuY291cnMnKSApO1xyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IGTDqXBsYWNlcignZmluJykgKTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL3dpbmRvd3MuanMiLCJ2YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxCb3V0b25FeHRlcm5lKVxyXG57XHJcblx0XHJcblx0Y29uc3QgZWxCb3V0b25JbnRlcm5lID0gZWxCb3V0b25FeHRlcm5lLnNoYWRvd1Jvb3Q7XHJcblx0Y29uc3QgYm91dG9uID0gZWxCb3V0b25JbnRlcm5lLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XHJcblx0XHJcblx0Ym91dG9uLmFwcGxpcXVlckJvcmR1cmUoKTtcclxuXHRlbEJvdXRvbkV4dGVybmUuY2hhbmdlckxhYmVsID0gdGV4dGUgPT4gYm91dG9uLnZhbHVlID0gdGV4dGU7XHJcblx0ZWxCb3V0b25FeHRlcm5lLmVubGV2ZXJFZmZldHMgPSAoKVx0PT4gYm91dG9uLnN0eWxlLmJveFNoYWRvdyA9ICdub25lJztcclxuXHRcclxuXHRcclxuXHRib3V0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdGJvdXRvbi52YWx1ZSA9IGVsQm91dG9uRXh0ZXJuZS5pbm5lckhUTUw7XHJcblx0XHJcblx0Ym91dG9uLmFkZEV2ZW50TGlzdGVuZXJcclxuXHQoJ21vdXNlb3ZlcicsXHJcblx0XHRmdW5jdGlvbigpXHJcblx0XHR7XHRib3V0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlO1x0fSxcclxuXHRcdGZhbHNlXHRcclxuXHQpO1xyXG5cdGJvdXRvbi5hZGRFdmVudExpc3RlbmVyXHJcblx0KCdtb3VzZW91dCcsXHJcblx0XHRmdW5jdGlvbigpXHJcblx0XHR7XHRib3V0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1x0fSxcclxuXHRcdGZhbHNlXHJcblx0KTtcclxuXHJcblx0LyoqXHJcblx0XHRTdHlsZVxyXG5cdCoqL1xyXG5cdFxyXG5cdGNvbnN0IHN0eWxlRXh0ZXJuZSA9IGVsQm91dG9uRXh0ZXJuZS5zdHlsZTtcclxuXHRib3V0b24uYWRkRXZlbnRMaXN0ZW5lcignaW5zZXJ0aW9uRG9tJywgZWUgPT5cclxuXHR7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdXSURUSCBCVE46ICcsIGdldENvbXB1dGVkU3R5bGUoZWxCb3V0b25FeHRlcm5lKS53aWR0aCwgYm91dG9uKTtcclxuXHR9ICk7XHJcblx0ZWxCb3V0b25FeHRlcm5lLmFkZEV2ZW50TGlzdGVuZXIoJ2luc2VydGlvbkRvbScsIGVlID0+XHJcblx0e1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnV0lEVEggQkFUSDogJywgZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoLCBib3V0b24pO1xyXG5cdH0gKTtcclxuXHRpZihzdHlsZUV4dGVybmUud2lkdGggPT09ICcnKVxyXG5cdHtcclxuXHRcdHN0eWxlRXh0ZXJuZS53aWR0aCA9ICdhdXRvJztcclxuXHRcdC8vY29uc29sZS5sb2coXCJiYWJhcjogXCIsIGVsQm91dG9uRXh0ZXJuZS5vYnRlbmlyU3R5bGVBdXRldXJFbGVtZW50KCkgKTtcclxuXHR9XHJcblx0Y29uc29sZS5sb2coJ3B1dGUnKTtcclxuXHQvKnliYXN0aGlzLm11dGF0aW9uU2Vuc29yLm5ld0FzU3R5bGVFeHBlY3RlZFxyXG5cdChcclxuXHRcdGVsQm91dG9uRXh0ZXJuZSxcclxuXHRcdHtcclxuXHRcdFx0bmFtZTpcdFx0XHQnd2lkdGgnLFxyXG5cdFx0XHRleHBlY3RlZDpcdCdhdXRvJyxcclxuXHRcdFx0aXNFcXVhbDpcdGZhbHNlXHJcblx0XHR9LFxyXG5cdFx0bXV0YXRpb24gPT5cclxuXHRcdHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3BpcGknLCBtdXRhdGlvbi50YXJnZXQpO1xyXG5cdFx0XHRzdHlsZUV4dGVybmUud2lkdGggPSBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGg7XHJcblx0XHRcdGJvdXRvbi5zdHlsZS53aWR0aCA9IHN0eWxlRXh0ZXJuZS53aWR0aDtcclxuXHRcdH1cclxuXHQpO1xyXG5cdHliYXN0aGlzLm11dGF0aW9uU2Vuc29yLm5ld0FzU3R5bGVFeHBlY3RlZFxyXG5cdChcclxuXHRcdGVsQm91dG9uRXh0ZXJuZSxcclxuXHRcdHtcclxuXHRcdFx0bmFtZTpcdFx0XHQnaGVpZ2h0JyxcclxuXHRcdFx0ZXhwZWN0ZWQ6XHQnYXV0bycsXHJcblx0XHRcdGlzRXF1YWw6XHRmYWxzZVxyXG5cdFx0fSxcclxuXHRcdG11dGF0aW9uID0+XHJcblx0XHR7XHJcblx0XHRcdHN0eWxlRXh0ZXJuZS5oZWlnaHQgPSBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkuaGVpZ2h0O1xyXG5cdFx0XHRib3V0b24uc3R5bGUuaGVpZ2h0ID0gc3R5bGVFeHRlcm5lLmhlaWdodDtcclxuXHRcdH1cclxuXHQpOyovXHJcblx0Lyp5YmFzdGhpcy51dGlsaXRhaXJlcy5XSEVOKCgpID0+IGdldENvbXB1dGVkU3R5bGUoZWxCb3V0b25FeHRlcm5lKS53aWR0aCAhPT0gJ2F1dG8nLFxyXG5cdCgpID0+XHJcblx0e1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnbGFyZ2V1cicsIGVsQm91dG9uRXh0ZXJuZSwgZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoKTtcclxuXHRcdC8vc3R5bGVFeHRlcm5lLndpZHRoID0gZ2V0Q29tcHV0ZWRTdHlsZShib3V0b24pLndpZHRoO1xyXG5cdFx0Ym91dG9uLnN0eWxlLndpZHRoID0gZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoO1xyXG5cdH0pO1xyXG5cdC8vc3R5bGVFeHRlcm5lLmJveFNoYWRvdyA9ICcwcHggMHB4IDhweCAzcHggd2hpdGUnO1xyXG5cdCovXHRcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcbnZhciB0ZW1wbGF0ZSA9XHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJcIiB2YWx1ZT1cIlwiIC8+XHJcblx0XHQ8c3R5bGU+XHJcblx0XHRcdGlucHV0XHJcblx0XHRcdHtcclxuXHRcdFx0XHRwb3NpdGlvbjpcdFx0XHRyZWxhdGl2ZTtcclxuXHRcdFx0XHRkaXNwbGF5Olx0XHRcdGJsb2NrO1xyXG5cdFx0XHRcdGZvbnQtd2VpZ2h0Olx0NzAwO1xyXG5cdFx0XHRcdHRleHQtYWxpZ246XHRcdGNlbnRlcjtcclxuXHRcdFx0XHRjdXJzb3I6XHRcdFx0XHRwb2ludGVyO1xyXG5cdFx0XHRcdGhlaWdodDpcdFx0XHRcdDEwMCU7XHJcblx0XHRcdFx0d2lkdGg6XHRcdFx0XHQxMDAlO1xyXG5cdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnYm91dG9uJ1xyXG5cdCx0ZW1wbGF0ZVx0XHQ6IHRlbXBsYXRlXHJcblx0LGNvbnN0cnVjdGV1clx0OiBjb25zdHJ1Y3RldXJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvYm91dG9uLmpzIiwidmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsQ29jaGVyKVxyXG57XHJcblx0dmFyIHZhbGV1ciA9IGVsQ29jaGVyLmdldEF0dHJpYnV0ZShcInZhbGV1clwiKTtcclxuXHJcblx0dmFyIGJvdXRvbiA9IGVsQ29jaGVyLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignZGl2Jyk7XHJcblx0XHJcblx0aWYoIXZhbGV1cil7XHR2YWxldXIgPSBmYWxzZTtcdH1cclxuXHRlbHNle1x0Ym91dG9uLmlubmVySFRNTCA9ICdYJztcdH1cclxuXHRcclxuXHRib3V0b24uYWRkRXZlbnRMaXN0ZW5lclxyXG5cdChcclxuXHRcdCdjbGljaydcclxuXHRcdCxmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHZhbGV1ciA9ICF2YWxldXI7XHJcblx0XHRcdGlmKHZhbGV1cilcclxuXHRcdFx0e1x0Ym91dG9uLmlubmVySFRNTCA9ICdYJztcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHRib3V0b24uaW5uZXJIVE1MID0gJyc7XHR9XHJcblx0XHRcdGVsQ29jaGVyLnNldEF0dHJpYnV0ZSgndmFsZXVyJywgdmFsZXVyKTtcclxuXHRcdFx0XHJcblx0XHR9LFxyXG5cdFx0ZmFsc2VcclxuXHQpO1xyXG5cdGJvdXRvbi5hZGRFdmVudExpc3RlbmVyXHJcblx0KCdtb3VzZW92ZXInLFxyXG5cdFx0ZnVuY3Rpb24oKVxyXG5cdFx0e1x0Ym91dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNGb25jZTtcdH0sXHJcblx0XHRmYWxzZVxyXG5cdCk7XHJcblx0Ym91dG9uLmFkZEV2ZW50TGlzdGVuZXJcclxuXHQoJ21vdXNlb3V0JyxcclxuXHRcdGZ1bmN0aW9uKClcclxuXHRcdHtcdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHR9LFxyXG5cdFx0ZmFsc2VcclxuXHQpO1xyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbnZhciB0ZW1wbGF0ZSA9XHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8ZGl2PjwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHRkaXZcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhlaWdodDozMnB4O1xyXG5cdFx0XHRcdHdpZHRoOiAzMnB4O1xyXG5cdFx0XHRcdGJvcmRlci1jb2xvclx0XHQ6IGJsYWNrO1xyXG5cdFx0XHRcdGJvcmRlci1zdHlsZVx0XHQ6IHNvbGlkO1xyXG5cdFx0XHRcdGJvcmRlci13aWR0aFx0XHQ6IDFweDtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yXHQ6IHdoaXRlO1xyXG5cdFx0XHRcdGZvbnQtd2VpZ2h0XHRcdFx0OiA3MDA7XHJcblx0XHRcdFx0Zm9udC1zaXplXHRcdFx0OiAyZW07XHJcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvclx0OiAjYjViM2IzO1xyXG5cdFx0XHRcdGNvbG9yXHRcdFx0XHQ6IGdyZWVuO1xyXG5cdFx0XHRcdHRleHQtYWxpZ25cdFx0XHQ6IGNlbnRlcjtcclxuXHRcdFx0XHRsaW5lLWhlaWdodFx0XHRcdDogMjhweDtcclxuXHRcdFx0fVxyXG5cdFx0PC9zdHlsZT5cclxuXHQ8L3RlbXBsYXRlPlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdjYXNlQ29jaGVyJ1xyXG5cdCx0ZW1wbGF0ZVx0XHQ6IHRlbXBsYXRlXHJcblx0LGNvbnN0cnVjdGV1clx0OiBjb25zdHJ1Y3RldXJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvY2FzZUNvY2hlci5qcyIsInZhciBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihlbENob2l4KVxyXG57XHJcblx0XHJcblx0dmFyIG9wdGlvbiA9IGVsQ2hvaXguZ2V0QXR0cmlidXRlKFwib3B0aW9uXCIpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRjb25zdCBlbGVtZW50Q29udGVuZXVyID0gZWxDaG9peC5wYXJlbnRFbGVtZW50O1xyXG5cdGNvbnN0IHR5cGUgPSBlbGVtZW50Q29udGVuZXVyLmdldEF0dHJpYnV0ZSgndHlwZScpO1xyXG5cdGNvbnN0IG5vbSA9IGVsQ2hvaXguZ2V0QXR0cmlidXRlKCdub20nKTtcclxuXHRpZihlbGVtZW50Q29udGVuZXVyLnRhZ05hbWUgIT09ICdZQi1PTkdMRVQnKSB0aHJvdyBuZXcgRXJyb3IoJ3V0aWxpc2F0aW9uIGRcXCd1biBjaG9peCDvv70gbFxcJ2V4dGVyaWV1ciBkXFwndW4gb25nbGV0Jyk7XHJcblx0ZWxzZSBpZih0eXBlICE9PSAnc2VsZWN0aW9uJykgdGhyb3cgbmV3IEVycm9yKCd1dGlsaXNhdGlvbiBkXFwndW4gY2hvaXgg77+9IGxcXCdleHRlcmlldXIgZFxcJ3VuIG9uZ2xldCBkZSB0eXBlIHNlbGVjdGlvbiwgdHlwZSBhY3R1ZWw6ICcgKyB0eXBlKTtcclxuXHRpZighbm9tIHx8IG5vbSA9PT0gJycpIHRocm93IG5ldyBFcnJvcigndXRpbGlzYXRpb24gZFxcJ3VuIGNob2l4IGF2ZWMgdW4gYXR0cmlidXQgQG5vbSBvYmxpZ2F0b2lyZSBub24gcmVuc2VpZ27vv70nKTtcclxuXHRcclxuXHRjb25zdCBjaG9peCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHRjaG9peC5pbm5lckhUTUwgPSBub207XHJcblx0ZWxlbWVudENvbnRlbmV1ci5kb20uYWpvdXRlckNob2l4KGNob2l4KTtcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG52YXIgdGVtcGxhdGUgPSBgPHRlbXBsYXRlPjwvdGVtcGxhdGU+YDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdjaG9peCdcclxuXHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL2Nob2l4LmpzIiwidmFyIHRlbXBsYXRlID0gXHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8ZGl2IGlkPSdjb250ZW5ldXInPlxyXG5cdFx0XHQ8ZGl2IGlkPSd0aXRyZSc+XHJcblx0XHRcdFx0PHA+PC9wPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nZ2FsbGVyaWUnPjwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8c3R5bGU+XHJcblx0XHRcdHBcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG1hcmdpbiA6IDBweDtcclxuXHRcdFx0fVxyXG5cdFx0XHQjY29udGVuZXVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHRoZWlnaHRcdDogMTAwJTtcclxuXHRcdFx0XHR3aWR0aFx0OiAxMDAlO1xyXG5cdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcblxyXG4vKipcclxuXHRVbmUgZ2FsbGVyaWVzIHBvc3PDqGRlIGNlcyBwcm9wcmnDqXTDqXMgcHJpdsOpZXM6XHJcblx0X2Rvbm5lZXMgLCBtb2RlbGUsIG9yZ2FuaXNldXIsIGxlY3RldXIsIHRhaWxsZVZpZ25ldHRlLCBmb3JtZVZpZ25ldHRlLlxyXG5cdFxyXG5cdF9kb25uZWVzIHJlcHLDqXNlbnRlIGxlcyB2aWduZXR0ZXMgZGUgbGEgZ2FsbGVyaWUuXHJcblx0bW9kZWxlIGVzdCB1biB0YWJsZWF1IHJlcHLDqXNlbnRhbnQgbGUgbm9tIGRlcyBwcm9wcmnDqXTDqXMgdmFsaWRlcyBwb3VyIHVuZSBpbnN0YW5jZSBkZSB2aWduZXR0ZVxyXG5cdG9yZ2FuaXNldXIgZm9uY3Rpb24gYXBww6lsw6kgbG9ycyBkZSBsJ2FmZmljaGFnZVxyXG5cdGxlY3RldXIgZm9uY3Rpb24gYXBwZWzDqSBsb3JzIGRlIGwnYWZmaWNoYWdlIHBvdXIgY2hhcXVlIHZpZ25ldHRlc1xyXG5cdG5vbWJyZVZpZ25ldHRlICdwZXRpdCc6MTAgJ21veWVuJyAnZ3JhbmQnXHJcblx0Zm9ybWVWaWduZXR0ZSAnY2FycsOpJyAncmVjdGFuZ2xlJ1xyXG4qKi9cclxudmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsSW50ZXJmYWNlKVxyXG57XHJcblx0dmFyIHFzID0gc2VsID0+IGVsSW50ZXJmYWNlLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcihzZWwpO1xyXG5cdHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0XHJcblx0dmFyIHRpdHJlID0gZWxJbnRlcmZhY2UuZ2V0QXR0cmlidXRlKCd0aXRyZScpO1xyXG5cdHFzKCcjdGl0cmUnKS5xdWVyeVNlbGVjdG9yKCdwJykuaW5uZXJIVE1MID0gdGl0cmU7XHJcblx0XHJcblx0dmFyICAgX2Rvbm5lZXMgPSBbXSwgcG9zID0gMCwgc3BlY2lhbGlzYXRpb247XHJcblx0XHJcblx0ZWxJbnRlcmZhY2Uuc3BlY2lhbGlzZXIgPSAocGFyYW0pID0+XHJcblx0e1xyXG5cdFx0c3BlY2lhbGlzYXRpb24gPSBwYXJhbTtcclxuXHR9O1xyXG5cdGVsSW50ZXJmYWNlLmFqb3V0ZXIgPSAoJGRvbm5lZXMpID0+XHJcblx0e1xyXG5cdFx0Ly8gTk9URVMgTG90IGRlIGRvbm7DqWVzLlxyXG5cdFx0aWYoYXJndW1lbnRzWzFdKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgYXJnVGFibGVhdSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0XHRcdGZvcih2YXIgZG9ubmVlIG9mIGFyZ1RhYmxlYXUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBOT1RFUyBUZXN0IHNpIGxlcyBkb25uw6llcyBzb250IHZhbGlkZXMuXHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIGF1dG9yaXNlO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBub21Qcm9wIGluIGRvbm5lZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0YXV0b3Jpc2UgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0Zm9yKHZhciBucEF1dG9yaXNlIG9mIHNwZWNpYWxpc2F0aW9uLm1vZGVsZSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlmKG5vbVByb3AgPT0gbnBBdXRvcmlzZSlcclxuXHRcdFx0XHRcdFx0XHR7XHRhdXRvcmlzZSA9IHRydWU7XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoIWF1dG9yaXNlKXtcdHRocm93IG5ldyBFcnJvcignRG9ubsOpZXMgbm9uIHZhbGlkZXMnKTt9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGUpe1x0dGhyb3cgbmV3IEVycm9yKGUpO1x0fVxyXG5cdFx0XHRcdF9kb25uZWVzLnB1c2goZG9ubmVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0XHJcblx0dmFyIGVsR2FsID0gcXMoJyNnYWxsZXJpZScpO1xyXG5cdGVsSW50ZXJmYWNlLmFmZmljaGVyID0gKCkgPT5cclxuXHR7XHJcblx0XHRmb3IodmFyIGUgPSAwOyBlIDwgZWxHYWwuY2hpbGRyZW47IGUrKylcclxuXHRcdHtcclxuXHRcdFx0ZWxHYWwuY2hpbGRyZW5bZV0ucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRpZighc3BlY2lhbGlzYXRpb24pXHJcblx0XHR7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignUGFzIGRlIHNww6ljaWFsaXNhdGlvbiBMOTIgRmdhbGxlcmllLmpzJyk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHZhciBkb25uZWVzT3Jkb25uZWVzID0gc3BlY2lhbGlzYXRpb24ub3JnYW5pc2F0ZXVyKF9kb25uZWVzKTtcclxuXHRcdFx0dmFyIHZpZ25ldHRlO1xyXG5cdFx0XHRmb3IodmFyIGkgPTA7IGkgPCBzcGVjaWFsaXNhdGlvbi5ub21icmVWaWduZXR0ZTsgaSsrKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmlnbmV0dGUgPSBkb25uZWVzT3Jkb25uZWVzW2kgKyBwb3NdO1xyXG5cdFx0XHRcdGVsR2FsLmFwcGVuZENoaWxkKHNwZWNpYWxpc2F0aW9uLmxlY3RldXIodmlnbmV0dGUpICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdH07XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ2dhbGxlcmllJ1xyXG5cdCx0ZW1wbGF0ZVx0XHQ6IHRlbXBsYXRlXHJcblx0LGNvbnN0cnVjdGV1clx0OiBjb25zdHJ1Y3RldXJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvZ2FsbGVyaWUuanMiLCJcclxuLyoqXHJcblx0VW5lIGludGVyZmFjZSBlc3QgdW4gY29tcG9zYW50IGRvbVxyXG5cdEZvbmN0aW9ubmFsaXTDqWVzOlxyXG5cdFx0SVx0LXN0b2NrZXIgZGVzIHZ1ZXNcclxuXHRcdElJXHQtYWZmaWNoZXIgdW5lIHZ1ZVxyXG5cdFx0SUlJXHQtZ2FyZGVyIGwnw6l0YXQgZCd1bmUgdnVlXHJcblx0XHRJVlx0LWFwcGxpcXVlciB1bmUgZm9uY3Rpb24gbG9ycyBkdSBwcmVtaWVyIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHRWXHQtYXBwbGlxdWVyIHVuZSBmb25jdGlvbiBsb3JzIGRlIGNoYXF1ZSB2aXNpb25uYWdlIGQndW5lIHZ1ZVxyXG5cdFxyXG5cdFZ1ZVx0T2JqZWN0XHJcblx0XHRFbnNlbWJsZSBkJ8OpbMOpbWVudCBkJ2ludGVyZmFjZSBncmFwaGlxdWUuXHJcblx0XHRAbm9tXHRcdFx0XHRTdHJpbmdcclxuXHRcdEBtb2RlbGVcdFx0XHRIVE1MRWxlbWVudFxyXG5cdFx0QGNvbnN0cnVjdGV1clx0XHRGdW5jdGlvbihAQGNvbXBvc2FudEludGVyZmFjZSwgQEB2dWVJbnRlcmZhY2UpID0+IHZvaWQgfHwgRnVuY3Rpb24oQEB2dWVJbnRlcmZhY2UpOlxyXG5cdFx0XHRBcHBsaXF1w6kgbG9ycyBkdSBwcmVtaWVyIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHRcdFNpIHJldG91cm5lIHVuZSBmb25jdGlvbiwgZWxsZSBzZXJhIGFwcGVsw6llIMOgIGNoYXF1ZSB2aXNpb25uYWdlXHJcblx0XHRcdFxyXG5cdEF0dGVudGlvbiwgbmUgcGFzIGNvbmZvbmRyZSBpbnRlcmZhY2UgYXBwbGljYXRpdmUgb3UgbCdpbnRlcmZhY2UgZCd1biBvYmpldCBhdmVjIHVuIGNvbXBvc2FudCBpbnRlcmZhY2VcclxuXHRcclxuXHRAYWpvdXRlcihAQHZ1ZSlcclxuXHRAYWZmaWNoZXIoQEBub21WdWUpXHJcbioqL1xyXG57XHJcblx0Y29uc3QgaW50ZXJmYWNlcyA9IHt9O1xyXG5cdGNvbnN0IGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsSW50ZXJmYWNlKVxyXG5cdHtcclxuXHRcdC8qKlxyXG5cdFx0XHRQUklWRVxyXG5cdFx0KiovXHJcblx0XHRcdGNvbnN0IElJbnRlcmZhY2VPYmpldCA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuSW50ZXJmYWNlVHlww6llKHtkb2l0OlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bm9tOiAnc3RyaW5nJywgbW9kZWxlOiAnc3RyaW5nJywgY29uc3RydWN0ZXVyOiBGdW5jdGlvblxyXG5cdFx0XHR9IH0gKTtcclxuXHRcdFx0Y29uc3QgaWQgPSBlbEludGVyZmFjZS5vYnRlbmlySWQoKTtcclxuXHRcdC8qKlxyXG5cdFx0XHRQVUJMSVFVRVxyXG5cdFx0KiovXHRcclxuXHRcdGVsSW50ZXJmYWNlLmFqb3V0ZXIgPSAodnVlKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0cnl7IElJbnRlcmZhY2VPYmpldC52YWxpZGVyKHZ1ZSk7IH1cclxuXHRcdFx0Y2F0Y2goZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGUuZXN0Rm9ybWVsbGUpIHRocm93IGU7XHJcblx0XHRcdFx0bGV0IGVyciA9IG5ldyBUeXBlRXJyb3IoJ0ludGVyZmFjZS5ham91cnRlckB2dWUgbmUgY29ycmVzcG9uZCBwYXMgw6AgdW4gb2JqZXQgZFxcJ2ludGVyZmFjZSEnKS5saWVyKGUpO1xyXG5cdFx0XHRcdGVyci5kZXRhaWxzLmludGVyZmFjZUlkID0gaWQ7XHJcblx0XHRcdFx0ZXJyLmRldGFpbHMub2JqZXRJbnRlcmZhY2VSZcOndSA9IHZ1ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRfRVJSRVVSKCdpbnRlcmZhY2UuYWpvdXRlcicsIGVycik7XHJcblx0XHRcdFx0Ly9jb25zb2xlLndhcm4oZXJyLm1lc3NhZ2UsIGVyci5kZXRhaWxzKTtcclxuXHRcdFx0XHR0aHJvdyBlcnI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWludGVyZmFjZXNbaWRdW3Z1ZS5ub21dIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBtb2RlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHRtb2RlbGUuaW5uZXJIVE1MID0gdnVlLm1vZGVsZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpbnRlcmZhY2VzW2lkXVt2dWUubm9tXSA9IHsgY29uc3RydWN0ZXVyIDogdnVlLmNvbnN0cnVjdGV1ciwgbW9kZWxlLCBpbml0aWFsaXPDqSA6IGZhbHNlfTtcclxuXHRcdFx0XHRpZih2dWUuZGVmYXV0KSBpbnRlcmZhY2VzW2lkXVsnX2RlZmF1dCddID0gdnVlLm5vbTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGVsSW50ZXJmYWNlLmFmZmljaGVyID0gJG5vbSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbJG5vbSwgWyd1bmRlZmluZWQnLCAnc3RyaW5nJ10gXSB9ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2goZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGUuZXN0Rm9ybWVsbGUpIHRocm93IGU7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignSW50ZXJmYWNlLmFmZmljaGVyQCRub20gZG9pdCDDqnRyZSB1biBzdHJpbmcgb3UgdW5kZWZpbmVkJykubGllcihlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0eWJhc3RoaXMubmF2aWdhdGlvbi5wdXNoKCdpbnRlcmZhY2U6ICcgKyBpZCArICcgYWZmaWNoYWdlOiAnICsgJG5vbSk7XHJcblx0XHRcdGxldCBub20gPSAoISRub20pPyAnX2RlZmF1dCcgOiAkbm9tO1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbaW50ZXJmYWNlc1tpZF1bbm9tXSwgJ29iamVjdCddIH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaChlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmV3IEVycm9yKCdJbnRlcmZhY2UuYWZmaWNoZXJAJG5vbXsnICsgbm9tICsgJ30gblxcJ2V4aXN0ZSBwYXMgZGFuczogeycgKyBpZCArICd9JylcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHttb2RlbGUsIGNvbnN0cnVjdGV1ciwgaW5pdGlhbGlzw6ksIGluaXRpYWxpc2V1cn0gPSBpbnRlcmZhY2VzW2lkXVtub21dO1xyXG5cdFx0XHQvKiogU3VwcHJlc3Npb24gZGUgbCdhbmNpZW5uZSB2dWUgKiovXHJcblx0XHRcdGZvcihsZXQgZWxlbWVudCBvZiBlbEludGVyZmFjZS5zaGFkb3dSb290LmNoaWxkcmVuKSBlbGVtZW50LnJlbW92ZSgpO1xyXG5cdFx0XHQvKiogQWpvdXQgZGFucyBsZSBkb20gZGUgbGEgbm91dmVsbGUgdnVlICoqL1xyXG5cdFx0XHRlbEludGVyZmFjZS5zaGFkb3dSb290LmFwcGVuZENoaWxkKG1vZGVsZSk7XHJcblx0XHRcdGNvbnN0IHZ1ZUludGVyZmFjZSA9IGVsSW50ZXJmYWNlLnNoYWRvd1Jvb3QubGFzdENoaWxkO1xyXG5cdFx0XHRpZighaW5pdGlhbGlzw6kpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpbnRlcmZhY2VzW2lkXVtub21dLmluaXRpYWxpc2V1ciA9IGNvbnN0cnVjdGV1cihlbEludGVyZmFjZSwgdnVlSW50ZXJmYWNlKTtcclxuXHRcdFx0XHRpbnRlcmZhY2VzW2lkXVtub21dLmluaXRpYWxpc8OpID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKGluaXRpYWxpc2V1cikgaW5pdGlhbGlzZXVyKHZ1ZUludGVyZmFjZSk7XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHZ1ZUludGVyZmFjZTtcclxuXHRcdH07XHJcblx0XHRlbEludGVyZmFjZS5saXN0ZUludGVyZmFjZXMgPSAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCByID0gW107XHJcblx0XHRcdGZvcih2YXIgaWRJbnQgb2YgT2JqZWN0LmtleXMoaW50ZXJmYWNlcykgKSByLnB1c2goaW50ZXJmYWNlc1tpZEludF0gKTtcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9O1xyXG5cdFx0LyoqXHJcblx0XHRcdENPTlNUUlVDVEVVUlxyXG5cdFx0KiovXHRcclxuXHRcdGlmKCFpbnRlcmZhY2VzW2lkXSApIGludGVyZmFjZXNbaWRdID0ge307XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0Y29uc3QgdGVtcGxhdGUgPSBcclxuXHRgXHJcblx0XHQ8dGVtcGxhdGU+XHJcblx0XHQ8L3RlbXBsYXRlPlxyXG5cdGA7XHJcblx0bW9kdWxlLmV4cG9ydHMgPVxyXG5cdHtcclxuXHRcdG5vbVx0XHRcdFx0OiAnaW50ZXJmYWNlJ1xyXG5cdFx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHRcdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcblx0fTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvaW50ZXJmYWNlLmpzIiwidmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsT25nbGV0KVxyXG57XHJcblx0Y29uc3QgZWxlbWVudE1lbnUgPSBlbE9uZ2xldC5wYXJlbnRFbGVtZW50O1xyXG5cdGxldCB0eXBlID0gbnVsbCxcclxuXHRcdGVsZW1lbnRNZW51T25nbGV0ID0gbnVsbDtcclxuXHRcdFxyXG5cdGlmKGVsZW1lbnRNZW51LnRhZ05hbWUgIT09ICdZQi1NRU5VJykgdGhyb3cgbmV3IEVycm9yKCd5Yi1vbmdsZXQgw6AgbFxcJ2V4dGVyaWV1ciBkXFwndW4gdGFnIHliLW1lbnUnKTtcclxuXHRpZighZWxPbmdsZXQuaGFzQXR0cmlidXRlKCdub20nKSApIHRocm93IG5ldyBFcnJvcigneWItb25nbGV0IHNhbnMgYXR0cmlidXQgbm9tJyk7XHJcblx0Y29uc3Qgbm9tT25nbGV0ID0gZWxPbmdsZXQuZ2V0QXR0cmlidXRlKCdub20nKTtcclxuXHRcclxuXHRpZighZWxPbmdsZXQuaGFzQXR0cmlidXRlKCd0eXBlJykgKSB0eXBlID0gJ2JvdXRvbic7XHJcblx0ZWxzZSB0eXBlID0gZWxPbmdsZXQuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XHJcblx0XHJcblx0c3dpdGNoKHR5cGUpXHJcblx0e1xyXG5cdFx0Y2FzZSAnYm91dG9uJzpcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd5Yi1ib3V0b24nKTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuY2hhbmdlckxhYmVsKGVsT25nbGV0LmdldEF0dHJpYnV0ZSgnbm9tJylcdCk7XHJcblx0XHRcdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLnBvc2l0aW9uXHQ9ICdyZWxhdGl2ZSc7XHJcblx0XHRcdGVsZW1lbnRNZW51T25nbGV0LmFkZEV2ZW50TGlzdGVuZXJcclxuXHRcdFx0KFxyXG5cdFx0XHRcdCdjbGljaycsXHJcblx0XHRcdFx0KCkgPT5cclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRlbGVtZW50TWVudU9uZ2xldC5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9ICcwcHgnO1xyXG5cdFx0XHRcdFx0Y29uc3QgZXZlbmVtZW50QWZmaWNoYWdlID0gbmV3IEN1c3RvbUV2ZW50XHJcblx0XHRcdFx0XHQoXHJcblx0XHRcdFx0XHRcdFwiYWZmaWNoYWdlXCIsIFxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0ZGV0YWlsOlxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYm91dG9uXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRjaWJsZTogbm9tT25nbGV0XHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRidWJibGVzOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGNhbmNlbGFibGU6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGVsZW1lbnRNZW51LmRpc3BhdGNoRXZlbnQoZXZlbmVtZW50QWZmaWNoYWdlKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGZhbHNlXHJcblx0XHRcdCk7XHJcblx0XHRcdGVsZW1lbnRNZW51T25nbGV0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT5lbGVtZW50TWVudU9uZ2xldC5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9ICcxcHgnLCBmYWxzZSk7XHJcblx0XHRcdGVsZW1lbnRNZW51T25nbGV0LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignaW5wdXQnKS5zdHlsZS5ib3hTaGFkb3cgPSAnbm9uZSc7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3NlbGVjdGlvbic6XHJcblx0XHRcdGVsZW1lbnRNZW51T25nbGV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgneWItc2VsZWN0aW9uJyk7XHJcblx0XHRcdGVsZW1lbnRNZW51T25nbGV0LnNldEF0dHJpYnV0ZSgnbm9tJywgZWxPbmdsZXQuZ2V0QXR0cmlidXRlKCdub20nKSApO1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdlbE9uZ2xldCwgJywgZWxlbWVudE1lbnVPbmdsZXQsIGVsT25nbGV0KTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCd5Yi1vbmdsZXQgYXZlYyBhdHRyaWJ1dCB0eXBlIGluY29ycmVjdCA6ICcgKyB0eXBlKTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHRlbGVtZW50TWVudU9uZ2xldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRlbGVtZW50TWVudU9uZ2xldC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0ZWxPbmdsZXQuZG9tID0gZWxlbWVudE1lbnVPbmdsZXQ7XHJcblx0ZWxlbWVudE1lbnUuYWpvdXRlck9uZ2xldChlbGVtZW50TWVudU9uZ2xldCwgZmFsc2UpO1xyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbnZhciB0ZW1wbGF0ZSA9IFxyXG5gXHRcdFxyXG5cdDx0ZW1wbGF0ZT48L3RlbXBsYXRlPlxyXG5cclxuYDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdvbmdsZXQnXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LW9uZ2xldC5qcyIsIid1c2Ugc3RyaWN0JztcclxuLy8gRm9uY3Rpb25uZSBlbiBhcHBhcmVuY2UsIG3Dqm1lIHNpIGNvZGUgaW52YWxpZGUhXHJcbi8vIETDuyBhdSBmYWl0IHF1ZSBsYSBsb2dpcXVlIGVzdCBjb2TDqSBkYW5zIGwnw6lsw6ltZW50IG9uZ2xldC5cclxudmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsVGFiKVxyXG57XHJcblx0dmFyIGNvbnRlbmV1ciA9IHZ1ZUludGVybmUucXVlcnlTZWxlY3RvcignI2NvbnRlbmV1cicpO1x0XHJcblx0ZWxUYWIuc3R5bGUuZGlzcGxheVx0XHRcdD0gJ2lubGluZS1ibG9jayc7XHJcblx0ZWxUYWIuc3R5bGUuYmFja2dyb3VuZENvbG9yXHQ9ICdncmV5JztcclxuXHRlbFRhYi5zdHlsZS5vdmVyZmxvd1x0XHRcdD0gJ2hpZGRlbic7XHJcblx0dmFyICAgY3NcdD0gZ2V0Q29tcHV0ZWRTdHlsZVxyXG5cdFx0LCBlbE1lbnVcdD0gY29udGVuZXVyLnF1ZXJ5U2VsZWN0b3IoJyNtZW51JylcclxuXHQ7XHJcblx0XHJcbiBcdHZhciBlbE9uZ2xldFx0PSBlbFRhYi5xdWVyeVNlbGVjdG9yKCcjb25nbGV0Jyk7XHJcblx0ZWxPbmdsZXQuc3R5bGUuc2V0UHJvcGVydHkoJ2hlaWdodCcsIGNzKGVsVGFiKS5oZWlnaHQgLSAoY3MoZWxNZW51KS5oZWlnaHQpICsgJ3B4Jyk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuXHJcbnZhciB0ZW1wbGF0ZSA9IFxyXG5gXHJcblx0PHRlbXBsYXRlPlxyXG5cdFx0PGRpdiBpZD0nY29udGVuZXVyJz5cclxuXHRcdFx0PGRpdiBpZD0nbWVudSc+PC9kaXY+XHJcblx0XHRcdDxkaXYgaWQ9J29uZ2xldCc+PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHRcdFx0PHN0eWxlPlxyXG5cdFx0XHRcdCNjb250ZW5ldXJcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvdmVyZmxvd1x0XHQ6IGhpZGRlblxyXG5cdFx0XHRcdDtcdGRpc3BsYXlcdFx0XHQ6IGZsZXhcclxuXHRcdFx0XHQ7XHRmbGV4LWRpcmVjdGlvblx0OiBjb2x1bW5cclxuXHRcdFx0XHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdCNtZW51XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0ZGlzcGxheSBcdFx0XHQ6IGZsZXhcdFx0XHQhaW1wb3J0YW50XHJcblx0XHRcdFx0XHQ7ZmxleC1kaXJlY3Rpb25cdFx0OiByb3cgXHRcdFx0IWltcG9ydGFudFxyXG5cdFx0XHRcdFx0O2hlaWdodFx0XHRcdFx0OiAzNXB4XHJcblx0XHRcdFx0XHQ7ei1pbmRleFx0XHRcdDogNTAwcHhcclxuXHRcdFx0XHRcdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0I29uZ2xldFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdDtvdmVyZmxvd1x0XHRcdDogaGlkZGVuXHJcblx0XHRcdFx0XHQ7cG9zaXRpb25cdFx0XHQ6IHJlbGF0aXZlXHJcblx0XHRcdFx0XHQ7dG9wXHRcdFx0XHQ6IDEwIHB4O1xyXG5cdFx0XHRcdFx0O2JhY2tncm91bmQtY29sb3JcdDogZ3JlZW5cclxuXHRcdFx0XHRcdDt3aWR0aFx0XHRcdFx0OiAxMDAlXHJcblx0XHRcdFx0XHQ7aGVpZ2h0XHRcdFx0XHQ6IDEwMCVcclxuXHRcdFx0XHRcdDtkaXNwbGF5XHRcdFx0OmJsb2NrXHJcblx0XHRcdFx0XHQ7ei1pbmRleFx0XHRcdDogNDAwcHhcclxuXHRcdFx0XHRcdDtcclxuXHRcdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnbWVudS10YWInXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LXRhYi5qcyIsInZhciBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihlbE1lbnUpXHJcbntcclxuXHRlbE1lbnUuc3R5bGUudG9wID0gJzBweCc7XHJcblx0ZWxNZW51LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcclxuXHRsZXQgaVJlZiA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuUmVmZXJlbmNlO1xyXG5cdGNvbnN0IGluZGV4ID0gW107XHJcblx0Y29uc3QgbWVudSA9IGVsTWVudS5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJyNtZW51Jyk7XHJcblx0bGV0IHhEaXNwb25uaWJsZSA9IDA7XHJcblx0bGV0IGJhc2VYID0gbWVudS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54O1xyXG5cdGVsTWVudS5ham91dGVyT25nbGV0ID0gKGRvbUVsZW1lbnQsIGF2ZWNMaWFpc29uKSA9PlxyXG5cdHtcclxuXHRcdC8vY29uc29sZS5sb2coJ3ggZGlzcG86ICcsIHhEaXNwb25uaWJsZSk7XHJcblx0XHRpZihhdmVjTGlhaXNvbiA9PT0gdW5kZWZpbmVkKSBhdmVjTGlhaXNvbiA9IHRydWU7XHJcblx0XHRsZXQgcmVmID0gaVJlZi5vYnRlbmlyKCk7XHJcblx0XHRpbmRleFtyZWZdID0gZG9tRWxlbWVudDtcclxuXHRcdFxyXG5cdFx0ZG9tRWxlbWVudC5zdHlsZS5mbGV4R3JvdyA9IDE7XHJcblx0XHRkb21FbGVtZW50LnN0eWxlLmZsZXhCYXNpcyA9IDA7XHJcblx0XHQvL2RvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0XHJcblx0XHRtZW51LmFwcGVuZENoaWxkKGRvbUVsZW1lbnQpO1xyXG5cdFx0bGV0IGVsZW1lbnRDbGllbnRSZWN0ID0gZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdHhEaXNwb25uaWJsZSArPSBlbGVtZW50Q2xpZW50UmVjdC53aWR0aDtcclxuXHRcdC8vZG9tRWxlbWVudC5zdHlsZS50b3AgPSAtICgoaVJlZi50YWlsbGUoJ29jY3VwZScpIC0gMSkgKiBlbGVtZW50Q2xpZW50UmVjdC5oZWlnaHQpICsgJ3B4JztcclxuXHRcdC8vY29uc29sZS5sb2coZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XHJcblx0XHRjb25zdCBwb2ludGV1ckVsZW1lbnQgPSBtZW51Lmxhc3RDaGlsZDtcclxuXHRcdFxyXG5cdFx0aWYoYXZlY0xpYWlzb24pXHJcblx0XHR7XHJcblx0XHRcdHBvaW50ZXVyRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNvbnN0IGV2ZW5lbWVudEFmZmljaGFnZSA9IG5ldyBDdXN0b21FdmVudFxyXG5cdFx0XHRcdChcclxuXHRcdFx0XHRcdFwiYWZmaWNoYWdlXCIsIHtkZXRhaWw6e3R5cGU6IFwidXRpbGlzYXRldXJcIiwgY2libGU6IHBvaW50ZXVyRWxlbWVudH0sXHRidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlfVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0bWVudS5kaXNwYXRjaEV2ZW50KGV2ZW5lbWVudEFmZmljaGFnZSk7XHJcblx0XHRcdFxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZWY7XHJcblx0fTtcclxuXHRlbE1lbnUuU3VwcHJpbWVyT25nbGV0XHQ9IHJlZiA9PlxyXG5cdHtcclxuXHRcdGlSZWYuc3VwcHJpbWVyKHJlZik7XHJcblx0XHRsZXQgZWxlbWVudCA9IGluZGV4W3JlZl07XHJcblx0XHRtZW51LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIHJlZjtcclxuXHR9O1xyXG5cdGVsTWVudS5vbmdsZXRzID0gaW5kZXg7XHJcblx0XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID0gXHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8ZGl2IGlkPSdtZW51Jz48L2Rpdj5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0I21lbnVcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHBvc2l0aW9uIDogcmVsYXRpdmU7XHJcblx0XHRcdFx0d2lkdGhcdDogYXV0bztcclxuXHRcdFx0XHRkaXNwbGF5IDogZmxleDtcclxuXHRcdFx0XHR0b3AgOiAwcHg7XHJcblx0XHRcdH1cclxuXHRcdFx0Lm1lbnUtaXRlbVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdDwvc3lsZT5cclxuXHQ8L3RlbXBsYXRlPlxyXG5gO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ21lbnUnLFxyXG5cdHRlbXBsYXRlXHRcdDogdGVtcGxhdGUsXHJcblx0Y29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LmpzIiwiXHQndXNlIHN0cmljdCc7XHJcblx0Y29uc3QgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oc2VsZWN0aW9uRG9tRXh0ZXJuZSlcclxuXHR7XHJcblx0XHRjb25zdCBpUmVmID0gbmV3IHliYXN0aGlzLnR5cGVzRG9ubmVlcy5SZWZlcmVuY2U7XHJcblx0XHRjb25zdCBpbmRleCA9IFtdO1xyXG5cdFx0Y29uc3QgZG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcclxuXHRcdGxldCBzZWxlY3Rpb25PdXZlcnRlID0gZmFsc2U7XHJcblx0XHRkb20uc3R5bGUuekluZGV4ID0gJzUwMDAnO1xyXG5cdFx0ZG9tLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdGRvbS5zdHlsZS5oZWlnaHQgPSAnNjRweCc7XHJcblx0XHRkb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdFx0ZG9tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHQvL2RvbS5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIGJsYWNrJztcclxuXHRcdHliYXN0aGlzLmRvbS5kZXNrdG9wLmFwcGVuZENoaWxkKGRvbSk7XHJcblx0XHRcclxuXHRcdHNlbGVjdGlvbkRvbUV4dGVybmUuY2hvaXggPSBpbmRleDtcclxuXHRcdHNlbGVjdGlvbkRvbUV4dGVybmUuU3VwcHJpbWVyQ2hvaXhcdD0gcmVmID0+XHJcblx0XHR7XHJcblx0XHRcdGluZGV4W3JlZl0ucmVtb3ZlKCk7XHJcblx0XHRcdGlSZWYuc3VwcHJpbWVyKHJlZik7XHJcblx0XHRcdHJldHVybiByZWY7XHJcblx0XHR9O1xyXG5cdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS5ham91dGVyQ2hvaXggPSAoZG9tRWxlbWVudCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Y29uc3QgcmVmID0gaVJlZi5vYnRlbmlyKCk7XHJcblx0XHRcdGRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gKHNlbGVjdGlvbkRvbUV4dGVybmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMikgKyAncHgnO1xyXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcclxuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSAnMHB4JztcclxuXHRcdFx0XHJcblx0XHRcdGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKCkgPT4gZG9tRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzRm9uY2UpO1xyXG5cdFx0XHRkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4gZG9tRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXIpO1xyXG5cdFxyXG5cdFx0XHRkb20uYXBwZW5kQ2hpbGQoZG9tRWxlbWVudCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpbmRleFtyZWZdID0gZG9tLmxhc3RDaGlsZDtcclxuXHRcdFx0cmV0dXJuIHJlZjtcclxuXHRcdH07XHJcblx0XHJcblx0XHRzZWxlY3Rpb25Eb21FeHRlcm5lLnZlcnJvdWlsbGVyXHJcblx0XHQoXHJcblx0XHRcdChlbGVtZW50KSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZWN0aW9uT3V2ZXJ0ZSA9IHRydWU7XHJcblx0XHRcdFx0Y29tcG9zYW50RG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNGb25jZTtcclxuXHRcdFx0XHRjb25zdCBpbmZvcyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS50b3AgPSAoaW5mb3MudG9wICsgaW5mb3MuaGVpZ2h0KSArICdweCc7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLmxlZnQgPSBpbmZvcy5sZWZ0ICsgJ3B4JztcclxuXHRcdFx0XHRkb20uc3R5bGUud2lkdGggPSBpbmZvcy53aWR0aCArICdweCc7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLmhlaWdodCA9ICgoaW5mb3MuaGVpZ2h0IC8gMikgKiBkb20uY2hpbGRyZW4ubGVuZ3RoKSArIDIgKyAncHgnO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZWN0aW9uT3V2ZXJ0ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHRcdGNvbXBvc2FudERvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblx0XHRjb25zdCBzZWxlY3Rpb25Eb21JbnRlcm5lID0gc2VsZWN0aW9uRG9tRXh0ZXJuZS5zaGFkb3dSb290O1xyXG5cdFx0Y29uc3QgY29tcG9zYW50RG9tID0gc2VsZWN0aW9uRG9tSW50ZXJuZS5xdWVyeVNlbGVjdG9yKCcjY29tcG9zYW50Jyk7XHJcblx0XHQvL2NvbXBvc2FudERvbS5zdHlsZS5oZWlnaHQgPSAnNDRweCc7XHJcblx0XHRjb21wb3NhbnREb20uc3R5bGUubWluV2lkdGggPSAnNGVtJztcclxuXHRcdGNvbXBvc2FudERvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb21wb3NhbnREb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlO1xyXG5cdFx0fSApO1xyXG5cdFx0Y29tcG9zYW50RG9tLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoIXNlbGVjdGlvbk91dmVydGUpIGNvbXBvc2FudERvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0XHRcdFxyXG5cdFx0fSApO1xyXG5cdFx0XHJcblx0XHR5YmFzdGhpcy5tdXRhdGlvblNlbnNvci5uZXdBc0F0dHJpYnV0ZXMoc2VsZWN0aW9uRG9tRXh0ZXJuZSwgWydub20nXSwgKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0bGV0IHRpdHJlRG9tID0gY29tcG9zYW50RG9tLnF1ZXJ5U2VsZWN0b3IoJyN0aXRyZScpOyBcclxuXHRcdFx0dGl0cmVEb20uaW5uZXJIVE1MID0gc2VsZWN0aW9uRG9tRXh0ZXJuZS5nZXRBdHRyaWJ1dGUoJ25vbScpO1xyXG5cdFx0XHQvL3RpdHJlRG9tLnN0eWxlLndpZHRoID0gJ2F1dG8nO1xyXG5cdFx0XHR5YmFzdGhpcy5tdXRhdGlvblNlbnNvci5uZXdBc1N0eWxlRXhwZWN0ZWRcclxuXHRcdFx0KFxyXG5cdFx0XHRcdHRpdHJlRG9tLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG5hbWU6XHRcdFx0J3dpZHRoJyxcclxuXHRcdFx0XHRcdGV4cGVjdGVkOlx0J2F1dG8nLFxyXG5cdFx0XHRcdFx0aXNFcXVhbDpcdGZhbHNlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQoKSA9PlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxldCBsYXJnZXVyUsOpZWxsZVRpdHJlID0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koZ2V0Q29tcHV0ZWRTdHlsZSh0aXRyZURvbSkud2lkdGgpO1xyXG5cdFx0XHRcdFx0bGV0IGxhcmdldXJSw6llbGxlU2VsZWN0aW9uID0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koZ2V0Q29tcHV0ZWRTdHlsZShjb21wb3NhbnREb20ucXVlcnlTZWxlY3RvcignI21hcnF1ZXVyU2VsZWN0aW9uJykgKS53aWR0aCk7XHJcblx0XHRcdFx0XHRjb21wb3NhbnREb20uc3R5bGUud2lkdGggPSB0aXRyZURvbS5vZmZzZXRXaWR0aCArIGxhcmdldXJSw6llbGxlU2VsZWN0aW9uICsgNSArICdweCc7XHJcblx0XHRcdFx0XHRzZWxlY3Rpb25Eb21FeHRlcm5lLnN0eWxlLndpZHRoID0gY29tcG9zYW50RG9tLnN0eWxlLndpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdH0pO1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnZWphcicsIHNlbGVjdGlvbkRvbUV4dGVybmUsIHNlbGVjdGlvbkRvbUV4dGVybmUuZ2V0QXR0cmlidXRlKCdub20nKSk7XHJcblx0XHRcclxuXHRcdGxldCBsYXJnZXVyT2NjdXDDqSA9IDA7XHJcblx0XHRjb25zdCBvdXRpbHNFbmxldmVyUHggPSB0YWlsbGUgPT4gdm9pZCh0YWlsbGUgPSB0YWlsbGUuc3BsaXQoJycpLCB0YWlsbGUucG9wKCksIHRhaWxsZS5wb3AoKSApIHx8IE51bWJlcih0YWlsbGUuam9pbignJykgKTtcclxuXHRcdGZvcihsZXQgZW5mYW50IG9mIGNvbXBvc2FudERvbS5jaGlsZHJlbilcclxuXHRcdHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbmZhbnQsIGVuZmFudC5vZmZzZXRXaWR0aCk7XHJcblx0XHRcdGxhcmdldXJPY2N1cMOpICs9IGVuZmFudC5vZmZzZXRXaWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHQvL2NvbnNvbGUubG9nKGxhcmdldXJPY2N1cMOpKTtcclxuXHRcdC8vY29tcG9zYW50RG9tLnN0eWxlLndpZHRoID0gbGFyZ2V1ck9jY3Vww6kgKyAncHgnO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHRjb25zdCB0ZW1wbGF0ZSA9XHJcblx0YFxyXG5cdFx0PHRlbXBsYXRlPlxyXG5cdFx0XHQ8ZGl2IGlkPSdjb21wb3NhbnQnID5cclxuXHRcdFx0XHQ8ZGl2IGlkPSd0aXRyZScgPjwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgaWQ9J21hcnF1ZXVyU2VsZWN0aW9uJyA+JiM4NzQ0OzwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFxyXG5cdFx0XHQ8c3R5bGU+XHJcblx0XHRcdFx0I2NvbXBvc2FudFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uIDpcdHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvciA6ICNiNWIzYjM7XHJcblx0XHRcdFx0XHR0b3A6IDBweDtcclxuXHRcdFx0XHRcdGRpc3BsYXk6IGdyaWQ7XHJcblx0XHRcdFx0XHRncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gMWVtO1xyXG5cdFx0XHRcdFx0Z3JpZC10ZW1wbGF0ZS1yb3dzOiAxMDAlO1xyXG5cdFx0XHRcdFx0Z3JpZC10ZW1wbGF0ZS1hcmVhczogXCJ0aXRyZSB0eXBlXCI7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNsaXBcdDpcdFx0Ym9yZGVyLWJveDtcclxuXHRcdFx0XHRcdGJvcmRlci1zdHlsZVx0Olx0XHRcdG91dHNldDtcclxuXHRcdFx0XHRcdGJvcmRlci13aWR0aFx0Olx0XHRcdDJweDtcclxuXHRcdFx0XHRcdGJvcmRlci1jb2xsYXBzZVx0Olx0XHRzZXBhcmF0ZTtcclxuXHRcdFx0XHRcdGJvcmRlci1zcGFjaW5nXHQ6XHRcdDBweCAwcHg7XHJcblx0XHRcdFx0XHRib3JkZXItY29sb3JcdDpcdFx0XHRyZ2IoMjI3LCAyMjcsIDIyNyk7XHJcblx0XHRcdFx0XHRib3gtc2l6aW5nXHQ6XHRcdFx0XHRib3JkZXItYm94O1xyXG5cdFx0XHRcdFx0dHJhbnNmb3JtLWJveFx0Olx0XHRib3JkZXItYm94O1xyXG5cdFx0XHRcdFx0d2lkdGggOiBhdXRvO1xyXG5cdFx0XHRcdFx0bWluLWhlaWdodCA6IDEuNWVtO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQjdGl0cmVcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0XHR0b3A6IDBweDtcclxuXHRcdFx0XHRcdGdyaWQtYXJlYTogdGl0cmU7XHJcblx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xyXG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xyXG5cdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IDAuNWVtO1xyXG5cdFx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAwLjVlbTtcclxuXHRcdFx0XHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcblx0XHRcdFx0XHRmb250LXdlaWdodCA6IDcwMDtcclxuXHRcdFx0XHRcdGhlaWdodCA6IGF1dG87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCNtYXJxdWV1clNlbGVjdGlvblxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHRcdFx0XHRcdHRvcDogMHB4O1xyXG5cdFx0XHRcdFx0Z3JpZC1hcmVhOiB0eXBlO1xyXG5cdFx0XHRcdFx0cmlnaHQgOiAwcHg7XHJcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRwYWRkaW5nLXRvcCA6IGNhbGMoNTAlICAtIDAuN2VtKTtcclxuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3IgOiBncmV5O1xyXG5cdFx0XHRcdFx0aGVpZ2h0IDogYXV0bztcclxuXHRcdFx0XHR9XHJcblx0XHRcdDwvc3R5bGU+XHJcblx0XHQ8L3RlbXBsYXRlPmA7XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnc2VsZWN0aW9uJyxcclxuXHR0ZW1wbGF0ZVx0XHQ6IHRlbXBsYXRlLFxyXG5cdGNvbnN0cnVjdGV1clx0OiBjb25zdHJ1Y3RldXJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvc2VsZWN0aW9uLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4vMC9zdXJjb3VjaGVOYXRpZnMuanMnO1xyXG5pbXBvcnQgY29udHJhdCBmcm9tICcuLzEvY29udHJhdC5qcyc7XHJcbmltcG9ydCBtdXRhdGlvblNlbnNvciBmcm9tICcuLzEvc29uZGVNdXRhdGlvbi5qcyc7XHJcbmltcG9ydCB0eXBlc0Rvbm5lZXMgZnJvbSAnLi8yL3R5cGVzRG9ubmVlcy5qcyc7XHJcbmltcG9ydCB1dGlsaXRhaXJlcyBmcm9tICcuLzIvdXRpbGl0YWlyZXMuanMnO1xyXG5pbXBvcnQgZmFicmlxdWVFbGVtZW50IGZyb20gJy4vMy9lbGVtZW50c1BlcnNvbmFsaXPDqXMuanMnO1xyXG5pbXBvcnQgZ3VpIGZyb20gJy4vNC9ndWkvZ3VpSW5kZXguanMnO1xyXG5pbXBvcnQgbGlzdGVFbGVtZW50cyBmcm9tICcuLzUvbGlzdGVFbGVtZW50cy5qcyc7XHJcbmltcG9ydCBmblVpUHJpbmNpcGFsZSBmcm9tICcuLi91aS9wcmluY2lwYWxlLmpzJztcclxuXHJcbigoKSA9PlxyXG57XHJcbiAgICBjb25zdCB5YmFzdGhpcyA9IHdpbmRvdy55YmFzdGhpcyA9XHJcblx0e1xyXG5cdFx0Y29udHJhdCxcclxuXHRcdG11dGF0aW9uU2Vuc29yLFxyXG5cdFx0dHlwZXNEb25uZWVzLFxyXG5cdFx0dXRpbGl0YWlyZXMgOiBuZXcgdXRpbGl0YWlyZXMoKSxcclxuXHRcdGZhYnJpcXVlRWxlbWVudCxcclxuXHRcdGNoYXJ0ZVVpIDpcclxuXHRcdHtcclxuXHRcdFx0Zm9uZDogXHRcdCdncmV5JyxcclxuXHQgIFx0XHRncmlzQ2xhaXI6XHQnI2I1YjNiMycsXHJcblx0ICBcdFx0Z3Jpc0ZvbmNlOlx0JyM5ODk4OTgnLFxyXG5cdCAgXHRcdHZlcnQ6XHRcdCcjMjI3ODBGJyxcclxuXHRcdFx0cm91Z2U6XHRcdCcjREIxNzAyJ1xyXG5cdFx0fSxcclxuXHRcdG5hdmlnYXRpb24gOiBbXVxyXG5cdH07XHJcblxyXG5cdGNvbnN0IGRlbWFyZXVyID0gKGNvbmYpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgRmFicmlxdWVZYmFzdGhpcyA9IHliYXN0aGlzLmZhYnJpcXVlRWxlbWVudChjb25mLm5zKTtcclxuXHRcdGZvcihsZXQgZWxlbWVudCBvZiBsaXN0ZUVsZW1lbnRzKVxyXG5cdFx0XHRuZXcgRmFicmlxdWVZYmFzdGhpcyhlbGVtZW50KTtcclxuXHRcdGd1aSgpO1xyXG5cdFx0Zm5VaVByaW5jaXBhbGUoKTtcclxuXHR9O1xyXG5cdHtcclxuXHRcdGxldCBvbkxvYWRlZCA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkZWQpO1xyXG5cdFx0XHRvbkxvYWRlZCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0ZGVtYXJldXJcclxuXHRcdFx0KHtcclxuXHRcdFx0XHRucyA6ICd5YidcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWRlZCk7XHJcblx0fVxyXG59ICkoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS95YmFzdGhpcy5qcyIsIm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbSA6ICdhZG1pbmlzdHJhdGlvbicsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2PkFkbWluaXN0cmF0aW9uOiBFbiBjb3VycyBkZSBkZXY8L2Rpdj5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvYWRtaW5pc3RyYXRpb24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnYXV0cmVzJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXY+QXV0cmVzOiBFbiBjb3VycyBkZSBkZXY8L2Rpdj5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvYXV0cmVzL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ2FjY3VldWlsJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXYgaWQ9J2NvbnRlbmV1cic+XHJcblx0XHRcdDx5Yi1nYWxsZXJpZSBpZD0ncHJvamV0cycgdGl0cmU9J1Byb2pldHMnPiA8L3liLWdhbGxlcmllPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nYXV0cmVzJz5cclxuXHRcdFx0XHQ8eWItYm91dG9uIGlkPSdub3V2ZWF1Jz5Ob3V2ZWF1PC95Yi1ib3V0b24+XHJcblx0XHRcdFx0PHliLWJvdXRvbiBpZD0nZ2VzdGlvbic+R2VzdGlvbjwveWItYm91dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHQjY29udGVuZXVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHR3aWR0aFx0OiAxMDAlO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxMDAlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGRpc3BsYXlcdDogZmxleDtcclxuXHRcdFx0XHRmbGV4LWRpcmVjdGlvbiA6IHJvdztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yIDogI0Q0RDRENDtcclxuXHRcdFx0fVxyXG5cdFx0XHQjcHJvamV0c1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0LyogbG9uZ2V1ciA9IDUwJSAtIDIgKiBtYXJnZSAqL1xyXG5cdFx0XHRcdHdpZHRoXHQ6IGNhbGMoNTAlIC0gMzBweCk7XHJcblx0XHRcdFx0ZGlzcGxheVx0OiBpbmxpbmUtYmxvY2s7XHJcblx0XHRcdFx0bWFyZ2luXHQ6IDE1cHg7XHJcblx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3IgOiBncmVlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHQjYXV0cmVzXHJcblx0XHRcdHtcclxuXHRcdFx0XHR3aWR0aFx0OiA1MCU7XHJcblx0XHRcdFx0aGVpZ2h0XHQ6IGNhbGMoMTAwJSAtIDMwcHgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGRpc3BsYXlcdDogaW5saW5lLWJsb2NrO1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRtYXJnaW5cdDogMTVweDtcclxuXHRcdFx0XHRyaWdodFx0OiAwJTtcclxuXHRcdFx0XHR0b3BcdFx0OiAwJTtcclxuXHRcdFx0fVxyXG5cdFx0XHQjbm91dmVhdVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGhcdFx0OiAyNSU7XHJcblx0XHRcdFx0bWluLXdpZHRoIDogNWVtO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxNSU7XHJcblx0XHRcdFx0dG9wXHQ6IDI1JTtcclxuXHRcdFx0XHRsZWZ0XHQ6IDM1JTtcclxuXHRcdFx0XHRwb3NpdGlvblx0OiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHQjZ2VzdGlvblxyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGhcdFx0OiAyNSU7XHJcblx0XHRcdFx0bWluLXdpZHRoIDogNWVtO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxNSU7XHJcblx0XHRcdFx0cG9zaXRpb25cdDogYWJzb2x1dGU7XHJcblx0XHRcdFx0Ym90dG9tXHQ6IDI1JTtcclxuXHRcdFx0XHRsZWZ0XHQ6IDM1JTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0PC9zdHlsZT5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdFx0Ly9cdFJBQ0NcclxuXHRcdHZhciBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHR2YXIgZXUgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqTtcclxuXHRcdHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0XHRcclxuXHRcdHZhciBlbE5vdXYgPSBxcygnI25vdXZlYXUnKSxcclxuXHRcdFx0ZWxHZXN0ID0gcXMoJyNnZXN0aW9uJyksXHJcblx0XHRcdGVsQ29udCA9IHFzKCcjY29udGVuZXVyJyksXHJcblx0XHRcdGVsR2FsbCA9IHFzKCcjcHJvamV0cycpLFxyXG5cdFx0XHRjc0VsQXUgPSBjcyhxcygnI2F1dHJlcycpKTtcclxuXHRcdGVsR2FsbC5zdHlsZS5oZWlnaHQgPSAoZXUoY3MoZWxDb250KS5oZWlnaHQpIC0zMCkgKyAncHgnO1xyXG5cdFx0LypcclxuXHRcdGVsR2FsbC5zcGVjaWFsaXNlcih7XHJcblx0XHRcdGxlY3RldXIgOiAoZGF0YSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0dmFyIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcblx0XHRcdFx0XHRiLmlubmVySFRNTCA9IGRhdGEuYjtcclxuXHRcdFx0XHR2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHRcdFx0XHRcdGMuaW5uZXJIVE1MID0gZGF0YS5jO1xyXG5cdFx0XHRcdGEuYXBwZW5kQ2hpbGQoYik7XHJcblx0XHRcdFx0YS5hcHBlbmRDaGlsZChjKTtcclxuXHRcdFx0XHRyZXR1cm4gYTtcclxuXHRcdFx0fSxcclxuXHRcdFx0b3JnYW5pc2F0ZXVyIDogbGlzdGUgPT4gbGlzdGUsXHJcblx0XHRcdG1vZGVsZSA6IFsnYicsICdjJ10sXHJcblx0XHRcdGZvcm1lVmlnbmV0dGUgOiAncmVjdGFuZ2xlJyxcclxuXHRcdFx0bm9tYnJlVmlnbmV0dGUgOiA0XHJcblx0XHR9KTtcclxuXHRcdGVsR2FsbC5ham91dGVyXHJcblx0XHQoXHJcblx0XHRcdCAge2I6ICdFREknLCBjOiAnRURJIHBvdXIgamF2YXNjcmlwdCd9XHJcblx0XHRcdCwge2I6ICcyJywgYzogJ3onfVxyXG5cdFx0XHQsIHtiOiAnMycsIGM6ICdlJ31cclxuXHRcdFx0LCB7YjogJzQnLCBjOiAncid9XHJcblx0XHRcdCwge2I6ICc1JywgYzogJ3QnfVxyXG5cdFx0XHQsIHtiOiAnNicsIGM6ICd5J31cclxuXHRcdFx0LCB7YjogJzcnLCBjOiAndSd9XHJcblx0XHRcdCwge2I6ICc4JywgYzogJ2knfVxyXG5cdFx0XHQsIHtiOiAnOScsIGM6ICdvJ31cclxuXHRcdFx0LCB7YjogJzEwJywgYzogJ3AnfVxyXG5cdFx0XHQsIHtiOiAnMTEnLCBjOiAncSd9XHJcblx0XHRcdCwge2I6ICcxMicsIGM6ICdzJ31cclxuXHRcdCk7XHJcblx0XHRlbEdhbGwuYWZmaWNoZXIoKTtcclxuXHRcdCovXHJcblx0XHR2YXIgbm91diA9IGVsLnF1ZXJ5U2VsZWN0b3IoJyNub3V2ZWF1Jyk7XHJcblx0XHRcdG5vdXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBpbnRlcmZhY2VNw6hyZS5hZmZpY2hlcignbm91dmVhdVByb2pldCcpICk7XHJcblx0XHRcdFxyXG5cdFx0ZWwucXVlcnlTZWxlY3RvcignI2dlc3Rpb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGludGVyZmFjZU3DqHJlLmFmZmljaGVyKCdwcm9qZXRDbGFzc2UnKSApO1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9hY2N1ZXVpbC5qcyIsImNvbnN0IHZ1ZU5vdXZlYXVQcm9qZXQgPSByZXF1aXJlKCcuL25vdXZlYXVQcm9qZXQuanMnKTtcclxuY29uc3QgdnVlQWNjdWV1aWwgPSByZXF1aXJlKCcuL2FjY3VldWlsLmpzJyk7XHJcbmNvbnN0IHZ1ZVByb2pldENsYXNzZSA9IHJlcXVpcmUoJy4vcHJvamV0Q2xhc3NlLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnZXNwYWNlVHJhdmFpbCcsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8eWItaW50ZXJmYWNlPjwveWItaW50ZXJmYWNlPlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHR5Yi1pbnRlcmZhY2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhlaWdodDoxMDAlO1xyXG5cdFx0XHRcdHdpZHRoOjEwMCU7XHJcblx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0YCxcclxuXHRjb25zdHJ1Y3RldXIgOiAoaW50ZXJmYWNlTcOocmUsIGVsKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0IGVsSW50ZXJmYWNlID0gZWwucXVlcnlTZWxlY3RvcignWUItSU5URVJGQUNFJyk7XHJcblx0XHRlbEludGVyZmFjZS5ham91dGVyKHZ1ZU5vdXZlYXVQcm9qZXQpO1xyXG5cdFx0ZWxJbnRlcmZhY2UuYWpvdXRlcih2dWVBY2N1ZXVpbCk7XHJcblx0XHRlbEludGVyZmFjZS5ham91dGVyKHZ1ZVByb2pldENsYXNzZSk7XHJcblx0XHRyZXR1cm4gKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0ZWxJbnRlcmZhY2UuYWZmaWNoZXIoJ2FjY3VldWlsJyk7XHJcblx0XHR9O1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ25vdXZlYXVQcm9qZXQnLFxyXG5cdC8qKlxyXG5cdGRpdiAjY29udGVuZXVyXHJcblx0fFx0ZGl2ICNwcm9qZXRzXHJcblx0fFx0fFx0aW5wdXQgI25vbVxyXG5cdHxcdHxcdGlucHV0ICNkZXNjXHJcblx0fFx0ZGl2ICNhdXRyZXNcclxuXHR8XHR8XHRkaXYgI2F1dF90eXBlXHJcblx0fFx0fFx0fFx0cCAjdHlwZVxyXG5cdHxcdHxcdGRpdiAjYXV0X2F1dHJlc1xyXG5cdHxcdHxcdHxcdHliLWJvdXRvbiAjYW5udWxlclxyXG5cdHxcdHxcdHxcdHliLWJvdXRvbiAjdmFsaWRlcj1cclxuXHQqKi9cclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXYgaWQ9J2NvbnRlbmV1cic+XHJcblx0XHRcdDxkaXYgaWQ9J3Byb2pldHMnPlxyXG5cdFx0XHRcdDxpbnB1dCBpZD0nbm9tJyB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nTm9tJyAvPlxyXG5cdFx0XHRcdDxpbnB1dCBpZD0nZGVzYycgdHlwZT0ndGV4dCcgcGxhY2Vob2xkZXI9J0Rlc2NyaXB0aW9uJyAvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nYXV0cmVzJz5cclxuXHRcdFx0XHQ8ZGl2IGlkPSdhdXRfdHlwZSc+XHJcblx0XHRcdFx0XHQ8cCBpZD0ndHlwZSc+VFlQRTwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGlkPSdhdXRfYXV0cmVzJz5cclxuXHRcdFx0XHRcdDx5Yi1ib3V0b24gY2xhc3M9J2F1dF9hdXRyZXNCb3V0b24nIGlkPSdhbm51bGVyJz48L3liLWJvdXRvbj5cclxuXHRcdFx0XHRcdDx5Yi1ib3V0b24gY2xhc3M9J2F1dF9hdXRyZXNCb3V0b24nIGlkPSd2YWxpZGVyJz48L3liLWJvdXRvbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0aW5wdXRcclxuXHRcdFx0e1x0XHJcblx0XHRcdFx0ICBoZWlnaHQ6XHQ1MCU7XHJcblx0XHRcdH1cclxuXHRcdFx0I2NvbnRlbmV1clxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGlzcGxheTpcdFx0XHRcdFx0ZmxleDtcclxuXHRcdFx0XHRmbGV4LWRpcmVjdGlvbjpcdFx0cm93O1xyXG5cdFx0XHRcdGhlaWdodDpcdFx0XHRcdFx0XHQxMDAlO1xyXG5cdFx0XHRcdHdpZHRoOlx0XHRcdFx0XHRcdDEwMCU7XHJcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjpcdCNENEQ0RDQ7XHJcblx0XHRcdFx0cG9zaXRpb246XHRcdFx0XHRcdGFic29sdXRlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCNwcm9qZXRzXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkaXNwbGF5Olx0YmxvY2s7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHQxMDAlO1xyXG5cdFx0XHRcdHdpZHRoOlx0XHQ1MCU7XHJcblx0XHRcdFx0dG9wOlx0XHRcdDBweDtcclxuXHRcdFx0XHRsZWZ0Olx0XHRcdDBweDtcclxuXHRcdFx0XHRtYXJnaW46XHRcdDE1cHg7XHJcbiBcdFx0XHRcdHBvc2l0aW9uOlx0cmVsYXRpdmU7XHJcblx0XHRcdH1cclxuXHRcdFx0I25vbVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ICB3aWR0aDpcdFx0XHRcdFx0NTAlO1xyXG5cdFx0XHRcdCAgaGVpZ2h0Olx0XHRcdFx0XHQxNSU7XHJcblx0XHRcdFx0ICBib3JkZXItd2lkdGg6XHRcdDFweDtcclxuXHRcdFx0XHQgIGJvcmRlci1zdHlsZTpcdFx0c29saWQ7XHJcblx0XHRcdFx0ICBib3JkZXItY29sb3I6XHRcdGJsYWNrO1xyXG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTpcdDE1cHg7XHJcblx0XHRcdFx0ICBwb3NpdGlvbjpcdFx0XHRcdHJlbGF0aXZlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCNkZXNjXHJcblx0XHRcdHtcclxuXHRcdFx0XHQgaGVpZ2h0Olx0XHRcdFx0Y2FsYygxMDAlIC0gMTUlKTtcclxuXHRcdFx0XHQgd2lkdGg6XHRcdFx0XHRcdDEwMCU7XHJcblx0XHRcdFx0IGJvcmRlci13aWR0aDpcdDFweDtcclxuXHRcdFx0XHQgYm9yZGVyLXN0eWxlOlx0c29saWQ7XHJcblx0XHRcdFx0IGJvcmRlci1jb2xvcjpcdGJsYWNrO1xyXG5cdFx0XHRcdCBwb3NpdGlvbjpcdFx0XHRyZWxhdGl2ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdCNhdXRyZXNcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHdpZHRoOlx0XHQ1MCU7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHQxMDAlO1xyXG5cdFx0XHRcdGRpc3BsYXk6XHRpbmxpbmUtYmxvY2s7XHJcblx0XHRcdFx0cG9zaXRpb246XHRhYnNvbHV0ZTtcclxuXHRcdFx0XHRyaWdodFx0XHQ6IDAlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQjYXV0X3R5cGVcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG1hcmdpbjpcdFx0XHRcdFx0XHQxNXB4O1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6XHQjRDRENEQ0O1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0XHRcdFx0XHRhYnNvbHV0ZTtcclxuXHRcdFx0XHRvdmVyZmxvdzpcdFx0XHRcdFx0aGlkZGVuO1xyXG5cdFx0XHRcdGJvcmRlci13aWR0aDpcdFx0XHQxcHg7XHJcblx0XHRcdFx0Ym9yZGVyLXN0eWxlOlx0XHRcdHNvbGlkO1xyXG5cdFx0XHRcdGJvcmRlci1jb2xvcjpcdFx0XHRibGFjaztcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0I2F1dF9hdXRyZXNcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJpZ2h0Olx0XHQwcHg7XHJcblx0XHRcdFx0bWFyZ2luOlx0XHQxNXB4O1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0YWJzb2x1dGU7XHJcblx0XHRcdFx0b3ZlcmZsb3c6XHRoaWRkZW47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC5hdXRfYXV0cmVzQm91dG9uXHJcblx0XHRcdHtcclxuXHRcdFx0XHRwb3NpdGlvbjpcdGFic29sdXRlO1xyXG5cdFx0XHRcdHdpZHRoOlx0XHQxMDAlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCNhbm51bGVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOlx0YmxhY2s7XHRcclxuXHRcdFx0fVxyXG5cdFx0XHQjdmFsaWRlclxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjpcdGJsYWNrO1xyXG5cdFx0XHR9XHJcblx0XHRcdCN0eXBlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRib3JkZXItd2lkdGg6XHRcdFx0XHRcdDBweDtcclxuXHRcdFx0XHRib3JkZXItYm90dG9tLXdpZHRoOlx0MXB4O1xyXG5cdFx0XHRcdGJvcmRlci1zdHlsZTpcdFx0XHRcdFx0c29saWQ7XHJcblx0XHRcdFx0Ym9yZGVyLWNvbG9yOlx0XHRcdFx0XHRibGFjaztcclxuXHRcdFx0XHRwb3NpdGlvbjpcdFx0XHRcdFx0XHRcdGFic29sdXRlO1xyXG5cdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdGAsXHJcblx0Y29uc3RydWN0ZXVyIDogKGludGVyZmFjZU3DqHJlLCBlbCkgPT5cclxuXHR7XHJcblx0XHRjb25zdCBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHRjb25zdCBldSA9IHliYXN0aGlzLnV0aWxpdGFpcmVzLmdyYW5kZXVycy5lbmxldmVyVW5pdMOpO1xyXG5cdFx0Y29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdFx0Y29uc3QgdmFsID0gcXMoJyN2YWxpZGVyJyk7XHJcblx0XHR2YWwuY2hhbmdlckxhYmVsKCdWJyk7XHJcblx0XHR2YWwuZW5sZXZlckVmZmV0cygpO1xyXG5cdFx0Y29uc3QgYW51ID0gcXMoJyNhbm51bGVyJylcclxuXHRcdGFudS5jaGFuZ2VyTGFiZWwoJ1gnKTtcclxuXHRcdGFudS5lbmxldmVyRWZmZXRzKCk7XHJcblx0XHRhbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpbnRlcmZhY2VNw6hyZS5hZmZpY2hlcignYWNjdWV1aWwnKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgYXV0X3R5cGUgPSBxcygnI2F1dF90eXBlJyk7XHJcblx0XHRjb25zdCBhdXRfYXV0cmVzID0gcXMoJyNhdXRfYXV0cmVzJyk7XHJcblx0XHRjb25zdCBhdXRyZXNfY3AgPSBjcyhxcygnI2F1dHJlcycpKTtcclxuXHRcdGNvbnN0IGNzRWxDb250ID0gY3MocXMoJyNjb250ZW5ldXInKSk7XHJcblx0XHRjb25zdCBlbFByb2pldCA9IHFzKCcjcHJvamV0cycpO1xyXG5cdFxyXG5cdFx0ZWxQcm9qZXQuc3R5bGUuaGVpZ2h0ID0gKGV1KGNzRWxDb250LmhlaWdodCkgLSA0NSkgKyAncHgnO1xyXG5cdFx0ZWxQcm9qZXQuc3R5bGUud2lkdGggPSAoZXUoY3MoZWxQcm9qZXQpLndpZHRoKSAtMTUpICsgJ3B4JztcclxuXHRcdGF1dF90eXBlLnN0eWxlLndpZHRoID1cclxuXHRcdChcclxuXHRcdFx0KChldShhdXRyZXNfY3Aud2lkdGgpICogOTApXHJcblx0XHRcdC8gMTAwKSAtIDQ1XHJcblx0XHQpICsgJ3B4JztcclxuXHRcdGF1dF90eXBlLnN0eWxlLmhlaWdodCA9IChldShhdXRyZXNfY3AuaGVpZ2h0KSAtIDQ1ICkgKyAncHgnO1xyXG5cdFx0YXV0X2F1dHJlcy5zdHlsZS5oZWlnaHQgPSBhdXRfdHlwZS5zdHlsZS5oZWlnaHQ7XHJcblx0XHRhdXRfYXV0cmVzLnN0eWxlLndpZHRoID0gXHJcblx0XHQoXHJcblx0XHRcdCgoZXUoYXV0cmVzX2NwLndpZHRoKSAqIDEwKVxyXG5cdFx0XHQvIDEwMClcclxuXHRcdCkgKyAncHgnO1xyXG5cdFx0Y29uc3QgYXV0X2F1dHJlc19jcCA9IGNzKGF1dF9hdXRyZXMpO1xyXG5cdFx0YW51LnN0eWxlLmhlaWdodCA9IGFudS5zdHlsZS53aWR0aCA9IGF1dF9hdXRyZXNfY3Aud2lkdGg7XHJcblx0XHR2YWwuc3R5bGUuaGVpZ2h0ID1cclxuXHRcdCgoXHJcblx0XHRcdGV1KGF1dF9hdXRyZXNfY3AuaGVpZ2h0KSBcclxuXHRcdFx0LVxyXG5cdFx0XHRldShhdXRfYXV0cmVzX2NwLndpZHRoKSBcclxuXHRcdCkgLSAxNSkgKyAncHgnO1xyXG5cdFx0dmFsLnN0eWxlLndpZHRoID0gYW51LnN0eWxlLndpZHRoO1xyXG5cdFx0dmFsLnN0eWxlLnRvcCA9IChldShhdXRfYXV0cmVzX2NwLndpZHRoKSArIDE1KSArICdweCc7XHJcblx0XHRcclxuXHRcdGNvbnN0ICAgZGVzYyA9IHFzKCcjZGVzYycpO1xyXG5cdFx0Y29uc3RcdFx0ZGVzY0NzID0gY3MoZGVzYyk7XHJcblx0XHRjb25zdFx0XHRub20gPSBxcygnI25vbScpO1xyXG5cdFx0bm9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdGRlc2Muc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdFx0ZGVzYy5zdHlsZS5oZWlnaHQgPSAoKGV1KGNzKHFzKCcjcHJvamV0cycpKS5oZWlnaHQpIC0gZXUoY3Mobm9tKS5oZWlnaHQpICkgLSAyMCkgKyAncHgnO1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9ub3V2ZWF1UHJvamV0LmpzIiwibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ3Byb2pldENsYXNzZScsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2IGlkPVwiZWRpdGV1clwiPlxyXG5cdFx0XHQ8eWItbWVudT5cclxuXHRcdFx0XHQ8eWItb25nbGV0IG5vbT0nTW9kZWxlJyB0eXBlPSdzZWxlY3Rpb24nPlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nQ2xhc3NlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdJbnN0YW5jZScgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdDwveWItb25nbGV0PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdJbXBsw6ltZW50YXRpb24nIHR5cGU9J3NlbGVjdGlvbic+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdDbGFzc2UnIC8+PC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0luc3RhbmNlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0PHliLW9uZ2xldCBub209J1JhcHBvcnRzJyB0eXBlPSdzZWxlY3Rpb24nPlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nQ2xhc3NlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdJbnN0YW5jZScgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nR8OpbsOpcmF1eCcgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdDwveWItb25nbGV0PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdEw6lwZW5kYW5jZXMnIHR5cGU9J2JvdXRvbicgPjwveWItb25nbGV0PlxyXG5cdFx0XHQ8L3liLW1lbnU+XHJcblx0XHRcdDx0YWJsZSBpZD1cImFmZmljaGFnZVwiPlxyXG5cdFx0XHRcdDx0cj5cclxuXHRcdFx0XHRcdDx0aCBjbGFzcz0nZHVtbXknPjwvdGg+XHJcblx0XHRcdFx0XHQ8dGg+Tm9tPC90aD5cclxuXHRcdFx0XHRcdDx0aD5UeXBlPC90aD5cclxuXHRcdFx0XHRcdDx0aD5Gb3JjZSB0eXBhZ2U8L3RoPlxyXG5cdFx0XHRcdFx0PHRoPlBvcnTDqTwvdGg+XHJcblx0XHRcdFx0PC90cj5cclxuXHRcdFx0XHQ8dHI+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9J2JvdXRvblNlbGVjdGlvbm5lcic+XHJcblx0XHRcdFx0XHRcdDx5Yi1jYXNlQ29jaGVyIC8+XHJcblx0XHRcdFx0XHQ8L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPnRhaWxsZTwvcD48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPmVudGllciBuYXR1cmVsPC9wPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+c3RhdGlxdWU8L3A+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5wdWJsaXF1ZTwvcD48L3RkPlxyXG5cdFx0XHRcdDwvdHI+XHJcblx0XHRcdFx0PHRyPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPSdib3V0b25TZWxlY3Rpb25uZXInPlxyXG5cdFx0XHRcdFx0XHQ8eWItY2FzZUNvY2hlciAvPlxyXG5cdFx0XHRcdFx0PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5mcsOpcXVlbmNlPC9wPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+ZW50aWVyIG5hdHVyZWw8L3A+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5jb25zdGFudDwvcD48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPnByaXbDqWU8L3A+PC90ZD5cclxuXHRcdFx0XHQ8L3RyPlxyXG5cdFx0XHQ8L3RhYmxlPlxyXG5cdFx0XHQ8ZGl2IGlkPVwiZWRpdGV1cl9lZGl0aW9uXCI+XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0PC9zdHlsZT5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdFx0Ly9cdFJBQ0NcclxuXHRcdHZhciBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHQvL3ZhciBldSA9IF9lbmxldmVyVW5pdGU7XHJcblx0XHR2YXIgY3MgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9wcm9qZXRDbGFzc2UuanMiLCJtb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnbW9kdWxlcycsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2Pk1vZHVsZXM6IEVuIGNvdXJzIGRlIGRldjwvZGl2PlxyXG5cdGAsXHJcblx0Y29uc3RydWN0ZXVyIDogKGludGVyZmFjZU3DqHJlLCBlbCkgPT5cclxuXHR7XHJcblx0fVxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS91aS9tb2R1bGVzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==