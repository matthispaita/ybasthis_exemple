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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvZ3VpSW5kZXguanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiYXNzaWduIiwieWJhc3RoaXMiLCJjb25maWciLCJjb250ZW5ldXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZG9tIiwiZGVza3RvcCIsInN5c3RlbWVQb2ludGFnZSIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImFwcGVuZENoaWxkIiwic3R5bGUiLCJsZWZ0IiwidG9wIiwiaGVpZ2h0Iiwid2lkdGgiLCJwb3NpdGlvbiIsInpJbmRleCIsIm92ZXJmbG93IiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiLCJ3aW5kb3dzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7a0JBQ2UsWUFDZjtBQUNDQSxRQUFPQyxNQUFQLENBQWNDLFFBQWQsRUFDQTtBQUNDQyxVQUNBO0FBQ0NDLGNBQVlDLFNBQVNDLGNBQVQsQ0FBd0Isb0JBQXhCO0FBRGIsR0FGRDtBQUtDQyxPQUNBO0FBQ0NILGNBQVksSUFEYjtBQUVDSSxZQUFVO0FBRlgsR0FORDtBQVVDQyxtQkFBa0I7QUFWbkIsRUFEQTs7QUFjQVAsVUFBU0ssR0FBVCxDQUFhSCxTQUFiLEdBQXlCRixTQUFTQyxNQUFULENBQWdCQyxTQUF6QztBQUNBRixVQUFTSyxHQUFULENBQWFDLE9BQWIsR0FBdUJILFNBQVNLLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdkI7QUFDQVIsVUFBU0ssR0FBVCxDQUFhQyxPQUFiLENBQXFCRyxFQUFyQixHQUEwQixTQUExQjtBQUNBVCxVQUFTSyxHQUFULENBQWFILFNBQWIsQ0FBdUJRLFdBQXZCLENBQW1DVixTQUFTSyxHQUFULENBQWFDLE9BQWhEO0FBQ0FSLFFBQU9DLE1BQVAsQ0FBY0MsU0FBU0ssR0FBVCxDQUFhSCxTQUFiLENBQXVCUyxLQUFyQyxFQUNBO0FBQ0NDLFFBQU8sS0FEUjtBQUVDQyxPQUFNLEtBRlA7QUFHQ0MsVUFBUyxNQUhWO0FBSUNDLFNBQVEsTUFKVDtBQUtDQyxZQUFXLFVBTFo7QUFNQ0MsVUFBUztBQU5WLEVBREE7QUFTQW5CLFFBQU9DLE1BQVAsQ0FBY0MsU0FBU0ssR0FBVCxDQUFhQyxPQUFiLENBQXFCSyxLQUFuQyxFQUNBO0FBQ0NDLFFBQU8sS0FEUjtBQUVDQyxPQUFNLEtBRlA7QUFHQ0MsVUFBUyxNQUhWO0FBSUNDLFNBQVEsTUFKVDtBQUtDQyxZQUFXLFVBTFo7QUFNQ0UsWUFBVyxRQU5aO0FBT0NDLG1CQUFrQix5Q0FQbkI7QUFRQ0Msa0JBQWlCLFdBUmxCO0FBU0NILFVBQVM7QUFUVixFQURBOztBQWFBakIsVUFBU08sZUFBVCxHQUEyQiwrQkFBM0I7QUFDQVAsVUFBU3FCLE9BQVQsR0FBbUIsdUJBQW5CO0FBQ0EsQyIsImZpbGUiOiJndWlJbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN5c3RlbWVQb2ludGFnZSBmcm9tICcuL3N5c3RlbWVQb2ludGFnZS5qcyc7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gJy4vd2luZG93cy5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+XHJcbntcclxuXHRPYmplY3QuYXNzaWduKHliYXN0aGlzLFxyXG5cdHtcclxuXHRcdGNvbmZpZyA6XHJcblx0XHR7XHJcblx0XHRcdGNvbnRlbmV1ciA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWNlcHRhY2xlWWJhc3RoaXMnKVxyXG5cdFx0fSxcclxuXHRcdGRvbSA6XHJcblx0XHR7XHJcblx0XHRcdGNvbnRlbmV1ciA6IG51bGwsXHJcblx0XHRcdGRlc2t0b3AgOiBudWxsXHJcblx0XHR9LFxyXG5cdFx0c3lzdGVtZVBvaW50YWdlIDogbnVsbFxyXG5cdH0pO1xyXG5cclxuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyID0geWJhc3RoaXMuY29uZmlnLmNvbnRlbmV1cjtcclxuXHR5YmFzdGhpcy5kb20uZGVza3RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdHliYXN0aGlzLmRvbS5kZXNrdG9wLmlkID0gJ2Rlc2t0b3AnO1xyXG5cdHliYXN0aGlzLmRvbS5jb250ZW5ldXIuYXBwZW5kQ2hpbGQoeWJhc3RoaXMuZG9tLmRlc2t0b3ApO1xyXG5cdE9iamVjdC5hc3NpZ24oeWJhc3RoaXMuZG9tLmNvbnRlbmV1ci5zdHlsZSxcclxuXHR7XHJcblx0XHRsZWZ0IDogJzBweCcsXHJcblx0XHR0b3AgOiAnMHB4JyxcclxuXHRcdGhlaWdodCA6ICcxMDAlJyxcclxuXHRcdHdpZHRoIDogJzEwMCUnLFxyXG5cdFx0cG9zaXRpb24gOiAnYWJzb2x1dGUnLFxyXG5cdFx0ekluZGV4IDogMVxyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24oeWJhc3RoaXMuZG9tLmRlc2t0b3Auc3R5bGUsXHJcblx0e1xyXG5cdFx0bGVmdCA6ICcwcHgnLFxyXG5cdFx0dG9wIDogJzBweCcsXHJcblx0XHRoZWlnaHQgOiAnMTAwJScsXHJcblx0XHR3aWR0aCA6ICcxMDAlJyxcclxuXHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcdFxyXG5cdFx0b3ZlcmZsb3cgOiAnaGlkZGVuJyxcclxuXHRcdGJhY2tncm91bmRJbWFnZSA6ICcgdXJsKC4vYXBpLzQvZ3VpL2ltYWdlcy9iYWNrZ3JvdW5kLnBuZyknLFxyXG5cdFx0YmFja2dyb3VuZFNpemUgOiAnMTAwJSAxMDAlJyxcclxuXHRcdHpJbmRleCA6IDJcclxuXHR9KTtcclxuXHJcblx0eWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlID0gbmV3IHN5c3RlbWVQb2ludGFnZTtcclxuXHR5YmFzdGhpcy53aW5kb3dzID0gbmV3IHdpbmRvd3M7XHJcbn1cclxuIl19

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _caseCocher = __webpack_require__(17);

var _caseCocher2 = _interopRequireDefault(_caseCocher);

var _bouton = __webpack_require__(16);

var _bouton2 = _interopRequireDefault(_bouton);

var _menu = __webpack_require__(23);

var _menu2 = _interopRequireDefault(_menu);

var _menuTab = __webpack_require__(22);

var _menuTab2 = _interopRequireDefault(_menuTab);

var _menuOnglet = __webpack_require__(21);

var _menuOnglet2 = _interopRequireDefault(_menuOnglet);

var _interface = __webpack_require__(20);

var _interface2 = _interopRequireDefault(_interface);

var _gallerie = __webpack_require__(19);

var _gallerie2 = _interopRequireDefault(_gallerie);

var _selection = __webpack_require__(15);

var _selection2 = _interopRequireDefault(_selection);

var _choix = __webpack_require__(18);

var _choix2 = _interopRequireDefault(_choix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_caseCocher2.default, _bouton2.default, _menu2.default, _menuTab2.default, _menuOnglet2.default, _interface2.default, _gallerie2.default, _choix2.default, _selection2.default];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9saXN0ZUVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVBLGdMIiwiZmlsZSI6Imxpc3RlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbENhc2VDb2NoZXIgZnJvbSAnLi9lbGVtZW50cy9jYXNlQ29jaGVyLmpzJztcclxuaW1wb3J0IGVsQm91dG9uIGZyb20gJy4vZWxlbWVudHMvYm91dG9uLmpzJztcclxuaW1wb3J0IGVsTWVudSBmcm9tICcuL2VsZW1lbnRzL21lbnUuanMnO1xyXG5pbXBvcnQgZWxNZW51VGFiIGZyb20gJy4vZWxlbWVudHMvbWVudS10YWIuanMnO1xyXG5pbXBvcnQgZWxNZW51T25nbGV0IGZyb20gJy4vZWxlbWVudHMvbWVudS1vbmdsZXQuanMnO1xyXG5pbXBvcnQgZWxJbnRlcmZhY2UgZnJvbSAnLi9lbGVtZW50cy9pbnRlcmZhY2UuanMnO1xyXG5pbXBvcnQgZWxHYWxsZXJpZSBmcm9tICcuL2VsZW1lbnRzL2dhbGxlcmllLmpzJztcclxuaW1wb3J0IGVsU2VsZWN0aW9uIGZyb20gJy4vZWxlbWVudHMvX19zZWxlY3Rpb24yLmpzJztcclxuaW1wb3J0IGVsY2hvaXggZnJvbSAnLi9lbGVtZW50cy9jaG9peC5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0XHJcbltcclxuXHRlbENhc2VDb2NoZXIsXHJcblx0ZWxCb3V0b24sXHJcblx0ZWxNZW51LFxyXG5cdGVsTWVudVRhYixcclxuXHRlbE1lbnVPbmdsZXQsXHJcblx0ZWxJbnRlcmZhY2UsXHJcblx0ZWxHYWxsZXJpZSxcclxuXHRlbGNob2l4LFxyXG5cdGVsU2VsZWN0aW9uXHJcbl07Il19

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

		/***************>
  //	PUBLIQUE   //
  <***************/
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

					//console.log('fenetre', fenetre);
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
		/***************>
  //	EVENEMENTS //
  <***************/
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
		/***************>
  //	CONSTR	   //
  <***************/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvV2luZG93LmpzIl0sIm5hbWVzIjpbIm9wdGlvbnMiLCJzZWxmIiwicG9zIiwieCIsInkiLCJkaW0iLCJ0aXRyZSIsInliYXN0aGlzIiwid2luZG93cyIsInRpdHJlTWF4IiwiZG9tIiwiZGVza3RvcCIsImFwcGVuZENoaWxkIiwiZG9tRmVuZXRyZSIsImNsb25lTm9kZSIsImxhc3RDaGlsZCIsImNsb3NlIiwicmVtb3ZlIiwibGlzdGUiLCJzdXBwcmltZXIiLCJkaW1tZW5zaW9ubmVyIiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsIm5vbW1lciIsIm5vbSIsIkVycm9yIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY29saXNpb25Db250aW51ZSIsInBvc2l0aW9ubmVyIiwiY29saXNpb24iLCJmZW5ldHJlIiwiYXBwIiwiZGVwbGFjZXIiLCJjb25zb2xlIiwibG9nIiwic3lzdGVtZVBvaW50YWdlIiwiYmxvcXVlciIsInNldFRpbWVvdXQiLCJkw6libG9xdWVyIiwibGVmdCIsInRvcCIsImZlbmV0cmVIYXV0RG9tIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvRmlyc3RQbGFuIiwiaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQiLCJlIiwidGFyZ2V0Iiwibm9kZU5hbWUiLCJjaGFuZ2VDdXJzb3IiLCJidXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImJ1dHRvbiIsImFqb3V0ZXIiLCJjb250ZW51RG9tIiwiX2NsYXNzZV8iLCJ1dGlsaXRhaXJlcyIsImdyYW5kZXVycyIsImVubGV2ZXJVbml0w6kiLCJnZXRDb21wdXRlZFN0eWxlIiwiZXJyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3LDqWVyRWzDqW1lbnQiLCJlbCIsImRpdiIsInRhYiIsImkiLCJwdXNoIiwiY2xhc3NOYW1lIiwiY2hpbGRyZW4iLCJzcmMiLCJPYmplY3QiLCJhc3NpZ24iLCJwb3NpdGlvbiIsImJvcmRlckJvdHRvbSIsIm1hcmdpbiIsInJpZ2h0IiwidmVydGljYWxBbGlnbiIsIm92ZXJmbG93IiwiYmFja2dyb3VuZENvbG9yIiwiYm94U2hhZG93IiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBRWUsVUFBU0EsT0FBVCxFQUNmO0FBQUE7O0FBQ0MsS0FBTUMsT0FBTyxJQUFiO0FBQ0EsS0FDQTtBQUNDRCxZQUFVQSxXQUFXLEVBQXJCO0FBQ0FBLFVBQVFFLEdBQVIsR0FBY0YsUUFBUUUsR0FBUixJQUFlLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFFLENBQVIsRUFBN0I7QUFDQUosVUFBUUssR0FBUixHQUFjTCxRQUFRSyxHQUFSLElBQWUsRUFBQ0YsR0FBRSxHQUFILEVBQVFDLEdBQUUsRUFBVixFQUE3Qjs7QUFFRDs7O0FBR0MsT0FBS0UsS0FBTCxHQUFhTixRQUFRTSxLQUFSLElBQWlCQyxTQUFTQyxPQUFULENBQWlCQyxRQUFqQixFQUE5QjtBQUNBLE9BQUtQLEdBQUwsR0FBV0YsUUFBUUUsR0FBbkI7QUFDQSxPQUFLRyxHQUFMLEdBQVdMLFFBQVFLLEdBQW5CO0FBQ0EsT0FBS0ssR0FBTCxHQUFXLEtBQUtILFNBQVNHLEdBQVQsQ0FBYUMsT0FBYixDQUFxQkMsV0FBckIsQ0FBaUNDLFdBQVdDLFNBQVgsQ0FBcUIsSUFBckIsQ0FBakMsQ0FBTCxJQUF3RVAsU0FBU0csR0FBVCxDQUFhQyxPQUFiLENBQXFCSSxTQUF4RztBQUNBLE9BQUtDLEtBQUwsR0FBYSxZQUNiO0FBQ0MsU0FBS04sR0FBTCxDQUFTTyxNQUFUO0FBQ0FWLFlBQVNDLE9BQVQsQ0FBaUJVLEtBQWpCLENBQXVCQyxTQUF2QjtBQUNBLEdBSkQ7QUFLQSxPQUFLQyxhQUFMLEdBQXFCLFVBQUNqQixDQUFELEVBQUlDLENBQUosRUFDckI7QUFDQyxTQUFLTSxHQUFMLENBQVNXLEtBQVQsQ0FBZUMsS0FBZixHQUF1Qm5CLElBQUksSUFBM0I7QUFDQSxTQUFLTyxHQUFMLENBQVNXLEtBQVQsQ0FBZUUs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QUksQ0FBSixFQUFPSSxRQUFQLENBQWdCLENBQWhCLEVBQW1CQSxRQUFuQixDQUE0QixDQUE1QixFQUErQmxELEtBQTdDLEVBQ0E7QUFDQ0UsVUFBUyxNQURWO0FBRUNELFNBQVMsTUFGVjtBQUdDd0QsU0FBUyxLQUhWO0FBSUNILFlBQVU7QUFKWCxFQURBO0FBT0FGLFFBQU9DLE1BQVAsQ0FBY1AsSUFBSSxDQUFKLEVBQU85QyxLQUFyQixFQUNBO0FBQ0NFLFVBQVMsTUFEVjtBQUVDbUIsT0FBTyxNQUZSO0FBR0NpQyxZQUFVLFVBSFg7QUFJQ0ssWUFBVTtBQUpYLEVBREE7QUFPQVAsUUFBT0MsTUFBUCxDQUFjN0QsV0FBV1EsS0FBekIsRUFDQTtBQUNDRSxVQUFhLE1BQU0sSUFEcEI7QUFFQ0QsU0FBWSxNQUFNLElBRm5CO0FBR0MyRCxtQkFBaUIsU0FIbEI7QUFJQ0MsYUFBYyxtQkFKZjtBQUtDUCxZQUFjLFVBTGY7QUFNQ1EsZUFBZSxPQU5oQjtBQU9DQyxlQUFlLE9BUGhCO0FBUUNDLGVBQWU7QUFSaEIsRUFEQTtBQTVFRDtBQUFBO0FBQUE7O0FBQUE7QUF1RkMsd0JBQWNsQixHQUFkO0FBQUEsT0FBUUYsRUFBUjs7QUFDQ3BELGNBQVdELFdBQVgsQ0FBdUJxRCxFQUF2QjtBQUREO0FBdkZEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF5RkMsQ0ExRkQiLCJmaWxlIjoiV2luZG93LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfY2xhc3NlXyA9IG5vbSA9PiAneWJhc3RoaXNGZW5ldHJlJyArIG5vbTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbntcclxuXHRjb25zdCBzZWxmID0gdGhpcztcclxuXHR0cnlcclxuXHR7XHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHRcdG9wdGlvbnMucG9zID0gb3B0aW9ucy5wb3MgfHwge3g6MCwgeTowfTtcclxuXHRcdG9wdGlvbnMuZGltID0gb3B0aW9ucy5kaW0gfHwge3g6MjUwLCB5OjkyfTtcclxuXHRcdFx0XHRcclxuXHQvKioqKioqKioqKioqKioqPlxyXG5cdC8vXHRQVUJMSVFVRSAgIC8vXHJcblx0PCoqKioqKioqKioqKioqKi9cclxuXHRcdHRoaXMudGl0cmUgPSBvcHRpb25zLnRpdHJlIHx8IHliYXN0aGlzLndpbmRvd3MudGl0cmVNYXgrKztcclxuXHRcdHRoaXMucG9zID0gb3B0aW9ucy5wb3M7XHJcblx0XHR0aGlzLmRpbSA9IG9wdGlvbnMuZGltO1xyXG5cdFx0dGhpcy5kb20gPSB2b2lkKHliYXN0aGlzLmRvbS5kZXNrdG9wLmFwcGVuZENoaWxkKGRvbUZlbmV0cmUuY2xvbmVOb2RlKHRydWUpICkgKSB8fCB5YmFzdGhpcy5kb20uZGVza3RvcC5sYXN0Q2hpbGQ7XHJcblx0XHR0aGlzLmNsb3NlID0gKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0dGhpcy5kb20ucmVtb3ZlKCk7XHJcblx0XHRcdHliYXN0aGlzLndpbmRvd3MubGlzdGUuc3VwcHJpbWVyKHRoaXMpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuZGltbWVuc2lvbm5lciA9ICh4LCB5KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmRvbS5zdHlsZS53aWR0aCA9IHggKyAncHgnO1xyXG5cdFx0XHR0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSB5ICsgJ3B4JztcclxuXHRcdH07XHJcblx0XHR0aGlzLm5vbW1lciA9IG5vbSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZih0aGlzLnRpdHJlID09PSBub20pIHRocm93IG5ldyBFcnJvcignbm9tbWFnZSBkXFwndW5lIGZlbsOqdHJlIGF2ZWMgdW4gbm91dmVhdSBub20gaWRlbnRpcXVlJyk7XHJcblx0XHRcdHRoaXMudGl0cmUgPSBub20gfHwgdGhpcy50aXRyZTtcclxuXHRcdFx0dGhpcy5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZVRpdHJlIHAnKS50ZXh0Q29udGVudCA9IHRoaXMudGl0cmU7XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHRcdHZhciBjb2xpc2lvbkNvbnRpbnVlID0gZmFsc2U7XHJcblx0XHR0aGlzLnBvc2l0aW9ubmVyID0gKHgsIHkpID0+XHJcblx0XHR7XHJcblx0XHRcdHZhciBjb2xpc2lvbiA9IGZhbHNlO1xyXG5cdFx0XHQvKlx0RMOpdGVjdGlvbiBkZXMgY29saXNpb25zXHJcblx0XHRcdFx0TG9naXF1ZTpcclxuXHRcdFx0XHRcdFBvdXIgY2hhcXVlIGZlbmV0cmUgcsOpY3Vww6lyZXIgc2EgcG9zaXRpb24gRVQgc2EgdGFpbGxlXHJcblx0XHRcdCovXHJcblx0XHRcdGZvcih2YXIgZmVuZXRyZSBvZiB5YmFzdGhpcy53aW5kb3dzLmxpc3RlIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2ZlbmV0cmUnLCBmZW5ldHJlKTtcclxuXHRcdFx0XHRpZigoZmVuZXRyZS5hcHAgPT09IHRoaXMuYXBwKSAmJiAoZmVuZXRyZS50aXRyZSA9PT0gdGhpcy50aXRyZSkgKSBjb250aW51ZTtcclxuXHRcdFx0XHRjb25zdCB7cG9zLCBkaW19ID0gZmVuZXRyZTtcclxuXHRcdFx0XHRpZiAoKCh0aGlzLnBvcy54ID49IHBvcy54KSAmJiAodGhpcy5wb3MueCA8PSBwb3MueCArIGRpbS54KSkgJiZcclxuXHRcdFx0XHRcdCgodGhpcy5wb3MueSA+PSBwb3MueSkgJiYgKHRoaXMucG9zLnkgPD0gcG9zLnkgKyBkaW0ueSkpKVxyXG5cdFx0XHRcdFx0Y29saXNpb24gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBkZXBsYWNlciA9IHRydWU7XHJcblx0XHRcdGlmKGNvbGlzaW9uKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NvbGxpc2lvbicpO1xyXG5cdFx0XHRcdGlmKGNvbGlzaW9uQ29udGludWUgPT09IGZhbHNlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5ibG9xdWVyKCk7XHJcblx0XHRcdFx0XHRkZXBsYWNlciA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dmFyIHggPSBzZXRUaW1lb3V0KCgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5kw6libG9xdWVyKCksIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbGlzaW9uQ29udGludWUgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgY29saXNpb25Db250aW51ZSA9IGZhbHNlO1xyXG5cdFx0XHRpZihkZXBsYWNlcilcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMucG9zLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMucG9zLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMuZG9tLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcclxuXHRcdFx0XHR0aGlzLmRvbS5zdHlsZS50b3AgPSB5ICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdH07XHJcblx0LyoqKioqKioqKioqKioqKj5cclxuXHQvL1x0RVZFTkVNRU5UUyAvL1xyXG5cdDwqKioqKioqKioqKioqKiovXHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgZmVuZXRyZUhhdXREb20gPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlSGF1dCcpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PiB5YmFzdGhpcy53aW5kb3dzLnRvRmlyc3RQbGFuKHRoaXMpICk7XHJcblx0XHR0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlSGF1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+XHJcblx0XHR7XHJcblx0XHRcdHliYXN0aGlzLndpbmRvd3MuaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQodGhpcyk7XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHRcdGZlbmV0cmVIYXV0RG9tLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGUgPT4gKGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnUCcpPyB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuY2hhbmdlQ3Vyc29yKGZhbHNlLCAnZGVwbGFjZXInKSA6IHZvaWQgMSk7XHJcblx0XHRmZW5ldHJlSGF1dERvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdub3JtYWwnKSApO1xyXG5cdFx0XHRcclxuXHRcdFxyXG5cdFx0Y29uc3QgYnV0dG9ucyA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJy55YmFzdGhpc0ZlbmV0cmVIYXV0IGltZycpO1xyXG5cdFx0Zm9yKHZhciBidXR0b24gb2YgYnV0dG9ucylcclxuXHRcdHtcclxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdkZWNsZW5jaGVyJykgKTtcclxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4geWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLmNoYW5nZUN1cnNvcihmYWxzZSwgJ25vcm1hbCcpICk7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0YnV0dG9uc1syXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2UpO1xyXG5cdH0gKSgpO1xyXG5cdC8qKioqKioqKioqKioqKio+XHJcblx0Ly9cdENPTlNUUlx0ICAgLy9cclxuXHQ8KioqKioqKioqKioqKioqL1xyXG5cdFx0dGhpcy5wb3NpdGlvbm5lcih0aGlzLnBvcy54LCB0aGlzLnBvcy55KTtcclxuXHRcdHRoaXMuZGltbWVuc2lvbm5lcih0aGlzLmRpbS54LCB0aGlzLmRpbS55KTtcclxuXHRcdHRoaXMubm9tbWVyKCk7XHJcblx0XHR5YmFzdGhpcy53aW5kb3dzLmxpc3RlLmFqb3V0ZXIodGhpcyk7XHJcblx0XHRcclxuXHRcdGxldCBjb250ZW51RG9tID0gdGhpcy5kb20ucXVlcnlTZWxlY3RvcignLicgKyBfY2xhc3NlXygnQ29udGVudScpICk7XHJcblx0XHRjb250ZW51RG9tLnN0eWxlLmhlaWdodCA9ICh5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnVEb20pLmhlaWdodCkgLSAzMikgKyAncHgnO1xyXG5cdH1cdFxyXG5cdGNhdGNoKGVycilcclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZygnZXJySW5pdGlhbGlzYXRpb24gbW9kdWxlOlx0JywgZXJyKTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBkb21GZW5ldHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbi8qKlxyXG5cdDxkaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPSdIYXV0Jz5cclxuXHRcdFx0PGRpdiBjbGFzcz0nVGl0cmUnPlxyXG5cdFx0XHRcdDxwPjwvcD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9J0JvdXRvbnMnPjwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPSdDb250ZW51Jz48L2Rpdj5cclxuXHQ8L2Rpdj5cclxuKiovXHJcbigoKSA9PlxyXG57XHJcblx0dmFyIGNyw6llckVsw6ltZW50ID0gKGVsKSA9PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcclxuXHR2YXIgZGl2ID0gKCkgPT4gY3LDqWVyRWzDqW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdFxyXG5cdHZhciB0YWIgPSBbXTtcclxuXHRmb3IodmFyIGkgPTA7IGkgPD0gMTsgaSsrKSB0YWIucHVzaChkaXYoKVx0KTtcclxuXHRmb3IodmFyIGkgPTA7IGkgPD0gMTsgaSsrKSB0YWJbMF0uYXBwZW5kQ2hpbGQoZGl2KClcdCk7XHJcblx0XHJcblx0dGFiWzBdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdIYXV0Jyk7XHRcclxuXHR0YWJbMF0uY2hpbGRyZW5bMF0uY2xhc3NOYW1lID0gX2NsYXNzZV8oJ1RpdHJlJyk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdwJykgKTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2xhc3NOYW1lID0gX2NsYXNzZV8oJ0JvdXRvbnMnKTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uYXBwZW5kQ2hpbGQoY3LDqWVyRWzDqW1lbnQoJ2ltZycpXHQpO1xyXG5cdHRhYlswXS5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChjcsOpZXJFbMOpbWVudCgnaW1nJylcdCk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdpbWcnKVx0KTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uc3JjID0gJy4vYXBpLzQvZ3VpL2ltYWdlcy9taW5pbWlzZXIucG5nJztcdFx0XHRcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uc3JjID0gJy4vYXBpLzQvZ3VpL2ltYWdlcy9yZWR1aXJlLnBuZyc7XHRcdFx0XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLnNyYyA9ICcuL2FwaS80L2d1aS9pbWFnZXMvZmVybWVyLnBuZyc7XHJcblx0dGFiWzFdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdDb250ZW51Jyk7XHJcblx0XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0OiBcdFx0XHQzMiArICdweCcsXHJcblx0XHR3aWR0aDogXHRcdFx0XHQnMTAwJScsXHJcblx0XHRwb3NpdGlvbjpcdFx0XHQnYWJzb2x1dGUnLFxyXG5cdFx0Ym9yZGVyQm90dG9tOlx0JzFweCBzb2xpZCBibGFjaydcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlswXS5jaGlsZHJlblswXS5zdHlsZSxcclxuXHR7XHJcblx0XHRwb3NpdGlvbjpcdCdhYnNvbHV0ZScsXHJcblx0XHRtYXJnaW46XHRcdCcwcHgnLFxyXG5cdFx0aGVpZ2h0Olx0XHQnMTAwJScsXHJcblx0XHR3aWR0aDpcdFx0JzEwMCUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0dG9wOlx0XHRcdCc0cHgnLFxyXG5cdFx0cG9zaXRpb246XHQnYWJzb2x1dGUnLFxyXG5cdFx0cmlnaHQ6XHRcdCc0cHgnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0dmVydGljYWxBbGlnbjpcdCdtaWRkbGUnLFxyXG5cdFx0cG9zaXRpb246IFx0XHRcdCdhYnNvbHV0ZScsXHJcblx0XHRtYXJnaW46XHRcdFx0XHRcdCcwcHgnLFxyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0XHQnMTAwJScsXHJcblx0XHR3aWR0aDpcdFx0XHRcdFx0JzEwMCUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0Olx0XHQnMjRweCcsXHJcblx0XHR3aWR0aDpcdFx0JzI0cHgnLFxyXG5cdFx0cmlnaHQ6XHRcdCc4cHgnLFxyXG5cdFx0cG9zaXRpb246XHQncmVsYXRpdmUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0OiBcdCcyNHB4JyxcclxuXHRcdHdpZHRoOiBcdFx0JzI0cHgnLFxyXG5cdFx0cmlnaHQ6IFx0XHQnNHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J3JlbGF0aXZlJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLnN0eWxlLFxyXG5cdHtcclxuXHRcdGhlaWdodDogXHQnMjRweCcsXHJcblx0XHR3aWR0aDogXHRcdCcyNHB4JyxcclxuXHRcdHJpZ2h0OiBcdFx0JzBweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZSdcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlsxXS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6XHRcdCcxMDAlJyxcclxuXHRcdHRvcDpcdFx0XHQnMzJweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZScsXHJcblx0XHRvdmVyZmxvdzpcdCdhdXRvJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24oZG9tRmVuZXRyZS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6XHRcdFx0XHRcdFx0MTI1ICsgJ3B4JyxcclxuXHRcdHdpZHRoOlx0XHRcdFx0XHRcdDI1MCArICdweCcsXHJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XHQnI0Q0RDRENCcsXHJcblx0XHRib3hTaGFkb3c6XHRcdFx0XHQnMHB4IDBweCA5cHggd2hpdGUnLFxyXG5cdFx0cG9zaXRpb246XHRcdFx0XHRcdCdhYnNvbHV0ZScsXHJcblx0XHRib3JkZXJDb2xvcjpcdFx0XHQnYmxhY2snLFxyXG5cdFx0Ym9yZGVyU3R5bGU6XHRcdFx0J3NvbGlkJyxcclxuXHRcdGJvcmRlcldpZHRoOlx0XHRcdCcxcHgnXHJcblx0fSk7XHJcblx0Zm9yKHZhciBlbCBvZiB0YWIpXHJcblx0XHRkb21GZW5ldHJlLmFwcGVuZENoaWxkKGVsKTtcclxufSkoKTsiXX0=

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvcG9pbnRlckNhcHR1cmUuanMiXSwibmFtZXMiOlsicG9pbnRlckxvY2siLCJkb2N1bWVudCIsIm1velBvaW50ZXJMb2NrRWxlbWVudCIsInVuZGVmaW5lZCIsImV2ZW50IiwiZWxlbWVudCIsIndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCIsInBvaW50ZXJMb2NrRWxlbWVudCIsInF1ZXJ5Q3Vyc29yIiwic2hhcmVkIiwiaXNIYW5kbGVkIiwiZG9tIiwiY2FudmFzIiwicmVxdWVzdFBvaW50ZXJMb2NrIiwib25Qb2ludGVyTG9ja0NoYW5nZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU1BLGNBQWVDLFNBQVNDLHFCQUFULEtBQW1DQyxTQUFwQyxHQUNwQjtBQUNDQyxRQUFRLHNCQURUO0FBRUNDLFVBQVU7QUFBQSxTQUFNSixTQUFTQyxxQkFBZjtBQUFBO0FBRlgsQ0FEb0IsR0FLbkJELFNBQVNLLHdCQUFULEtBQXNDSCxTQUF2QyxHQUNBO0FBQ0NDLFFBQVEseUJBRFQ7QUFFQ0MsVUFBVTtBQUFBLFNBQU1KLFNBQVNLLHdCQUFmO0FBQUE7QUFGWCxDQURBLEdBS0E7QUFDQ0YsUUFBUSxtQkFEVDtBQUVDQyxVQUFVO0FBQUEsU0FBTUosU0FBU00sa0JBQWY7QUFBQTtBQUZYLENBVkE7O2tCQWVlLGtCQUNmO0FBQ0MsS0FBTUMsY0FBYyxTQUFkQSxXQUFjLEdBQ3BCO0FBQ0MsTUFBR0MsT0FBT0MsU0FBVixFQUNDO0FBQ0RELFNBQU9FLEdBQVAsQ0FBV0MsTUFBWCxDQUFrQkMsa0JBQWxCO0FBQ0EsRUFMRDtBQU1BLEtBQU1DLHNCQUFzQixTQUF0QkEsbUJBQXNCLEdBQzVCO0FBQ0MsTUFBSWQsWUFBWUssT0FBWixNQUF5QkksT0FBT0UsR0FBUCxDQUFXQyxNQUF4QyxFQUNBO0FBQ0NILFVBQU9DLFNBQVAsR0FBbUIsSUFBbkI7QUFDQVQsWUFBU2MsbUJBQVQsQ0FBNkIsT0FBN0IsRUFBc0NQLFdBQXRDO0FBQ0EsR0FKRCxNQU1BO0FBQ0NDLFVBQU9DLFNBQVAsR0FBbUIsS0FBbkI7QUFDQVQsWUFBU2UsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNSLFdBQW5DO0FBQ0E7QUFDRCxFQVpEO0FBYUFQLFVBQVNlLGdCQUFULENBQTBCaEIsWUFBWUksS0FBdEMsRUFBNkNVLG1CQUE3QyxFQUFrRSxLQUFsRTtBQUNBQTtBQUNBLEMiLCJmaWxlIjoicG9pbnRlckNhcHR1cmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBvaW50ZXJMb2NrID0gKGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudCAhPT0gdW5kZWZpbmVkKSA/XG57XG5cdGV2ZW50IDogJ21velBvaW50ZXJsb2NrY2hhbmdlJyxcblx0ZWxlbWVudCA6ICgpID0+IGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudFxufSA6XG4oZG9jdW1lbnQud2Via2l0UG9pbnRlckxvY2tFbGVtZW50ICE9PSB1bmRlZmluZWQpID9cbntcblx0ZXZlbnQgOiAnd2Via2l0UG9pbnRlcmxvY2tjaGFuZ2UnLFxuXHRlbGVtZW50IDogKCkgPT4gZG9jdW1lbnQud2Via2l0UG9pbnRlckxvY2tFbGVtZW50XG59IDpcbntcblx0ZXZlbnQgOiAncG9pbnRlcmxvY2tjaGFuZ2UnLFxuXHRlbGVtZW50IDogKCkgPT4gZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzaGFyZWQgPT5cbntcblx0Y29uc3QgcXVlcnlDdXJzb3IgPSAoKSA9PlxuXHR7XG5cdFx0aWYoc2hhcmVkLmlzSGFuZGxlZClcblx0XHRcdHJldHVybjtcblx0XHRzaGFyZWQuZG9tLmNhbnZhcy5yZXF1ZXN0UG9pbnRlckxvY2soKTtcblx0fTtcblx0Y29uc3Qgb25Qb2ludGVyTG9ja0NoYW5nZSA9ICgpID0+XG5cdHtcblx0XHRpZiAocG9pbnRlckxvY2suZWxlbWVudCgpID09IHNoYXJlZC5kb20uY2FudmFzKVxuXHRcdHtcblx0XHRcdHNoYXJlZC5pc0hhbmRsZWQgPSB0cnVlO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBxdWVyeUN1cnNvcik7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzaGFyZWQuaXNIYW5kbGVkID0gZmFsc2U7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHF1ZXJ5Q3Vyc29yKTtcblx0XHR9XG5cdH07XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIocG9pbnRlckxvY2suZXZlbnQsIG9uUG9pbnRlckxvY2tDaGFuZ2UsIGZhbHNlKTtcblx0b25Qb2ludGVyTG9ja0NoYW5nZSgpO1xufTsiXX0=

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
		// Affichage du cursor
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvcG9pbnRlck9uTW92ZS5qcyJdLCJuYW1lcyI6WyJlbGVtUHJlY2VuZGVudCIsIm9uTW91c2VNb3ZlIiwic2hhcmVkIiwiaXNMb2NrZWQiLCJpc0hhbmRsZWQiLCJwb3MiLCJwb3NpdGlvbiIsIngiLCJldmVuZW1lbnQiLCJtb3ZlbWVudFgiLCJ5IiwibW92ZW1lbnRZIiwiYXJlYVNpemUiLCJkb20iLCJjdXJzb3IiLCJzdHlsZSIsImxlZnQiLCJ0b3AiLCJsaXN0ZW5lcnMiLCJsaXN0ZW5lciIsImVsQWN0IiwiZ2V0Tm9kZUZyb21DdXJzb3IiLCJ1bmRlZmluZWQiLCJldk1vdXNlT3ZlciIsIkN1c3RvbUV2ZW50IiwiSUV2ZW50IiwiZXZNb3VzZU91dCIsImRpc3BhdGNoRXZlbnQiLCJ5YmFzdGhpcyIsImNvbnRlbmV1ciIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7a0JBQ2Usa0JBQ2Y7QUFDQyxLQUFJQSxpQkFBaUIsSUFBckI7QUFDQSxLQUFNQyxjQUFjLFNBQWRBLFdBQWMsWUFDcEI7QUFDQyxNQUFJQyxPQUFPQyxRQUFQLEtBQW9CLElBQXBCLElBQTRCLENBQUNELE9BQU9FLFNBQXhDLEVBQ0M7QUFDRCxNQUFNQyxNQUFNSCxPQUFPSSxRQUFuQjtBQUNBRCxNQUFJRSxDQUFKLElBQVNDLFVBQVVDLFNBQW5CO0FBQ0FKLE1BQUlLLENBQUosSUFBU0YsVUFBVUcsU0FBbkI7QUFDQSxNQUFJTixJQUFJRSxDQUFKLEdBQVEsQ0FBWixFQUNDRixJQUFJRSxDQUFKLEdBQVFMLE9BQU9VLFFBQVAsQ0FBZ0JMLENBQWhCLEdBQW9CLENBQTVCLENBREQsS0FFSyxJQUFJRixJQUFJSyxDQUFKLEdBQVEsQ0FBWixFQUNKTCxJQUFJSyxDQUFKLEdBQVFSLE9BQU9VLFFBQVAsQ0FBZ0JGLENBQWhCLEdBQW9CLENBQTVCLENBREksS0FFQSxJQUFJTCxJQUFJRSxDQUFKLEdBQVFMLE9BQU9VLFFBQVAsQ0FBZ0JMLENBQWhCLEdBQW9CLENBQWhDLEVBQ0pGLElBQUlFLENBQUosR0FBUSxDQUFSLENBREksS0FFQSxJQUFJRixJQUFJSyxDQUFKLEdBQVFSLE9BQU9VLFFBQVAsQ0FBZ0JGLENBQWhCLEdBQW9CLENBQWhDLEVBQ0pMLElBQUlLLENBQUosR0FBUSxDQUFSO0FBQ0Q7QUFDQVIsU0FBT1csR0FBUCxDQUFXQyxNQUFYLENBQWtCQyxLQUFsQixDQUF3QkMsSUFBeEIsR0FBK0JYLElBQUlFLENBQUosR0FBUSxJQUF2QztBQUNBTCxTQUFPVyxHQUFQLENBQVdDLE1BQVgsQ0FBa0JDLEtBQWxCLENBQXdCRSxHQUF4QixHQUE4QlosSUFBSUssQ0FBSixHQUFRLElBQXRDO0FBaEJEO0FBQUE7QUFBQTs7QUFBQTtBQWlCQyx3QkFBb0JSLE9BQU9nQixTQUEzQjtBQUFBLFFBQVFDLFFBQVI7O0FBQ0NBO0FBREQ7QUFqQkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFtQkMsTUFBTUMsUUFBUWxCLE9BQU9tQixpQkFBUCxFQUFkO0FBQ0EsTUFBS0QsVUFBVSxJQUFYLElBQW9CQSxVQUFVRSxTQUFsQyxFQUNDO0FBQ0QsTUFBR3RCLG1CQUFtQixJQUF0QixFQUE0QkEsaUJBQWlCb0IsS0FBakI7QUFDNUIsTUFBR0EsVUFBVXBCLGNBQWIsRUFDQTtBQUNDLE9BQUl1QixjQUFjLElBQUlDLFdBQUosQ0FBZ0IsV0FBaEIsRUFBOEJ0QixPQUFPdUIsTUFBckMsQ0FBbEI7QUFDQSxPQUFJQyxhQUFhLElBQUlGLFdBQUosQ0FBZ0IsVUFBaEIsRUFBNkJ0QixPQUFPdUIsTUFBcEMsQ0FBakI7QUFDQXpCLGtCQUFlMkIsYUFBZixDQUE2QkQsVUFBN0I7QUFDQU4sU0FBTU8sYUFBTixDQUFvQkosV0FBcEI7QUFDQXZCLG9CQUFpQm9CLEtBQWpCO0FBQ0E7QUFDRCxFQWhDRDtBQWlDQVEsVUFBU2YsR0FBVCxDQUFhZ0IsU0FBYixDQUF1QkMsZ0JBQXZCLENBQXdDLFdBQXhDLEVBQXFEN0IsV0FBckQ7QUFDQSxDIiwiZmlsZSI6InBvaW50ZXJPbk1vdmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmV4cG9ydCBkZWZhdWx0IHNoYXJlZCA9Plxue1xuXHRsZXQgZWxlbVByZWNlbmRlbnQgPSBudWxsO1xuXHRjb25zdCBvbk1vdXNlTW92ZSA9IGV2ZW5lbWVudCA9PlxuXHR7XG5cdFx0aWYgKHNoYXJlZC5pc0xvY2tlZCA9PT0gdHJ1ZSB8fCAhc2hhcmVkLmlzSGFuZGxlZClcblx0XHRcdHJldHVybjtcblx0XHRjb25zdCBwb3MgPSBzaGFyZWQucG9zaXRpb247XG5cdFx0cG9zLnggKz0gZXZlbmVtZW50Lm1vdmVtZW50WDtcblx0XHRwb3MueSArPSBldmVuZW1lbnQubW92ZW1lbnRZO1xuXHRcdGlmIChwb3MueCA8IDEpXG5cdFx0XHRwb3MueCA9IHNoYXJlZC5hcmVhU2l6ZS54IC0gMTtcblx0XHRlbHNlIGlmIChwb3MueSA8IDEpXG5cdFx0XHRwb3MueSA9IHNoYXJlZC5hcmVhU2l6ZS55IC0gMTtcblx0XHRlbHNlIGlmIChwb3MueCA+IHNoYXJlZC5hcmVhU2l6ZS54IC0gMSlcblx0XHRcdHBvcy54ID0gMDtcblx0XHRlbHNlIGlmIChwb3MueSA+IHNoYXJlZC5hcmVhU2l6ZS55IC0gMSlcblx0XHRcdHBvcy55ID0gMDtcblx0XHQvLyBBZmZpY2hhZ2UgZHUgY3Vyc29yXG5cdFx0c2hhcmVkLmRvbS5jdXJzb3Iuc3R5bGUubGVmdCA9IHBvcy54ICsgJ3B4Jztcblx0XHRzaGFyZWQuZG9tLmN1cnNvci5zdHlsZS50b3AgPSBwb3MueSArICdweCc7XG5cdFx0Zm9yKGxldCBsaXN0ZW5lciBvZiBzaGFyZWQubGlzdGVuZXJzKVxuXHRcdFx0bGlzdGVuZXIoKTtcblx0XHRjb25zdCBlbEFjdCA9IHNoYXJlZC5nZXROb2RlRnJvbUN1cnNvcigpO1xuXHRcdGlmICgoZWxBY3QgPT09IG51bGwpIHx8IGVsQWN0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRyZXR1cm47XG5cdFx0aWYoZWxlbVByZWNlbmRlbnQgPT09IG51bGwpIGVsZW1QcmVjZW5kZW50ID0gZWxBY3Q7XG5cdFx0aWYoZWxBY3QgIT09IGVsZW1QcmVjZW5kZW50KVxuXHRcdHtcblx0XHRcdGxldCBldk1vdXNlT3ZlciA9IG5ldyBDdXN0b21FdmVudCgnbW91c2VvdmVyJywgIHNoYXJlZC5JRXZlbnQpO1xuXHRcdFx0bGV0IGV2TW91c2VPdXQgPSBuZXcgQ3VzdG9tRXZlbnQoJ21vdXNlb3V0JywgIHNoYXJlZC5JRXZlbnQpO1xuXHRcdFx0ZWxlbVByZWNlbmRlbnQuZGlzcGF0Y2hFdmVudChldk1vdXNlT3V0KTtcblx0XHRcdGVsQWN0LmRpc3BhdGNoRXZlbnQoZXZNb3VzZU92ZXIpO1xuXHRcdFx0ZWxlbVByZWNlbmRlbnQgPSBlbEFjdDtcblx0XHR9XG5cdH07XG5cdHliYXN0aGlzLmRvbS5jb250ZW5ldXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xufTsiXX0=

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
	/***************>
 //	PRIVE	   //
 <***************/
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
	/***************>
 //	PUBLIQUE   //
 <***************/
	this.initialiserDéplacement = function (fenetre) {
		fenetreEnDéplacement = fenetre;
		déplacer('début');
	};
	this.Window = _Window2.default;
	this.liste = new ybasthis.typesDonnees.Liste();
	this.toFirstPlan = function (window) {
		return window.dom.style.zIndex = indexPremierPlan++;
	};
	/***************>
 //	EVENEMENTS //
 <***************/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNC9ndWkvd2luZG93cy5qcyJdLCJuYW1lcyI6WyJkw6ljYWxhZ2VQeCIsIngiLCJ5IiwiZMOpcGxhY2VyIiwiw6l0YXQiLCJwb2ludGV1clBvc2l0aW9uIiwieWJhc3RoaXMiLCJzeXN0ZW1lUG9pbnRhZ2UiLCJwb3NpdGlvbiIsImZlbmV0cmVFbkTDqXBsYWNlbWVudCIsInBvcyIsInBvc2l0aW9ubmVyIiwidW5kZWZpbmVkIiwiaW5kZXhQcmVtaWVyUGxhbiIsImluaXRpYWxpc2VyRMOpcGxhY2VtZW50IiwiZmVuZXRyZSIsIldpbmRvdyIsImxpc3RlIiwidHlwZXNEb25uZWVzIiwiTGlzdGUiLCJ0b0ZpcnN0UGxhbiIsIndpbmRvdyIsImRvbSIsInN0eWxlIiwiekluZGV4IiwicXVhbmRNb3V2ZW1lbnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFDZSxZQUNmO0FBQ0M7OztBQUdDLEtBQU1BLGFBQWEsRUFBQ0MsR0FBSSxJQUFMLEVBQVdDLEdBQUksSUFBZixFQUFuQjtBQUNBLEtBQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQ2pCO0FBQ0MsTUFBTUMsbUJBQW1CQyxTQUFTQyxlQUFULENBQXlCQyxRQUF6QixFQUF6QjtBQUNBLFVBQU9KLElBQVA7QUFFQyxRQUFLLE9BQUw7QUFDQ0osZUFBV0MsQ0FBWCxHQUFlSSxpQkFBaUJKLENBQWpCLEdBQXFCUSxxQkFBcUJDLEdBQXJCLENBQXlCVCxDQUE3RDtBQUNBRCxlQUFXRSxDQUFYLEdBQWVPLHFCQUFxQkMsR0FBckIsQ0FBeUJSLENBQXpCLEdBQTZCRyxpQkFBaUJILENBQTdEO0FBQ0Q7QUFDQSxRQUFLLFNBQUw7QUFDQyxRQUFHTyxvQkFBSCxFQUNBO0FBQ0NBLDBCQUFxQkUsV0FBckIsQ0FFQ04saUJBQWlCSixDQUFqQixHQUFxQkQsV0FBV0MsQ0FGakMsRUFHQ0ksaUJBQWlCSCxDQUFqQixHQUFxQkYsV0FBV0UsQ0FIakM7QUFLQSxLQVBELE1BUUs7QUFDTjtBQUNBLFFBQUssS0FBTDtBQUNDLFFBQUdPLHlCQUF5QkcsU0FBNUIsRUFDQTtBQUNDSCw0QkFBdUJHLFNBQXZCO0FBQ0FaLGdCQUFXQyxDQUFYLEdBQWUsQ0FBZjtBQUNBRCxnQkFBV0UsQ0FBWCxHQUFlLENBQWY7QUFDQSxLQUxELE1BTUs7QUFDTjtBQXpCRDtBQTJCQSxFQTlCRDs7QUFnQ0EsS0FBSU8sdUJBQXVCRyxTQUEzQjtBQUNBLEtBQUlDLG1CQUFtQixDQUF2QjtBQUNEOzs7QUFHQyxNQUFLQyxzQkFBTCxHQUE4QixtQkFDOUI7QUFDQ0wseUJBQXVCTSxPQUF2QjtBQUNBWixXQUFTLE9BQVQ7QUFDQSxFQUpEO0FBS0EsTUFBS2EsTUFBTDtBQUNBLE1BQUtDLEtBQUwsR0FBYSxJQUFJWCxTQUFTWSxZQUFULENBQXNCQyxLQUExQixFQUFiO0FBQ0EsTUFBS0MsV0FBTCxHQUFtQjtBQUFBLFNBQVVDLE9BQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQkMsTUFBakIsR0FBMEJYLGtCQUFwQztBQUFBLEVBQW5CO0FBQ0Q7OztBQUdDUCxVQUFTQyxlQUFULENBQXlCa0IsY0FBekIsQ0FBd0M7QUFBQSxTQUFNdEIsU0FBUyxTQUFULENBQU47QUFBQSxFQUF4QztBQUNBdUIsVUFBU0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUM7QUFBQSxTQUFNeEIsU0FBUyxLQUFULENBQU47QUFBQSxFQUFyQztBQUNELEM7O0FBekREOzs7Ozs7QUF5REMiLCJmaWxlIjoid2luZG93cy5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdpbmRvdyBmcm9tICcuL1dpbmRvdy5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKClcclxue1xyXG5cdC8qKioqKioqKioqKioqKio+XHJcblx0Ly9cdFBSSVZFXHQgICAvL1xyXG5cdDwqKioqKioqKioqKioqKiovXHJcblx0XHRjb25zdCBkw6ljYWxhZ2VQeCA9IHt4IDogbnVsbCwgeSA6IG51bGx9O1xyXG5cdFx0Y29uc3QgZMOpcGxhY2VyID0gKMOpdGF0KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCBwb2ludGV1clBvc2l0aW9uID0geWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLnBvc2l0aW9uKCk7XHJcblx0XHRcdHN3aXRjaCjDqXRhdClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNhc2UgJ2TDqWJ1dCc6XHJcblx0XHRcdFx0XHRkw6ljYWxhZ2VQeC54ID0gcG9pbnRldXJQb3NpdGlvbi54IC0gZmVuZXRyZUVuRMOpcGxhY2VtZW50LnBvcy54O1xyXG5cdFx0XHRcdFx0ZMOpY2FsYWdlUHgueSA9IGZlbmV0cmVFbkTDqXBsYWNlbWVudC5wb3MueSAtIHBvaW50ZXVyUG9zaXRpb24ueTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdlbmNvdXJzJzpcclxuXHRcdFx0XHRcdGlmKGZlbmV0cmVFbkTDqXBsYWNlbWVudClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZmVuZXRyZUVuRMOpcGxhY2VtZW50LnBvc2l0aW9ubmVyXHJcblx0XHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0XHRwb2ludGV1clBvc2l0aW9uLnggLSBkw6ljYWxhZ2VQeC54LCBcclxuXHRcdFx0XHRcdFx0XHRwb2ludGV1clBvc2l0aW9uLnkgKyBkw6ljYWxhZ2VQeC55XHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHJldHVybjtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdmaW4nOlxyXG5cdFx0XHRcdFx0aWYoZmVuZXRyZUVuRMOpcGxhY2VtZW50ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGZlbmV0cmVFbkTDqXBsYWNlbWVudCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHRcdFx0ZMOpY2FsYWdlUHgueCA9IDA7XHJcblx0XHRcdFx0XHRcdGTDqWNhbGFnZVB4LnkgPSAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSByZXR1cm47XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGZlbmV0cmVFbkTDqXBsYWNlbWVudCA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciBpbmRleFByZW1pZXJQbGFuID0gMDtcclxuXHQvKioqKioqKioqKioqKioqPlxyXG5cdC8vXHRQVUJMSVFVRSAgIC8vXHJcblx0PCoqKioqKioqKioqKioqKi9cclxuXHRcdHRoaXMuaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQgPSBmZW5ldHJlID0+XHJcblx0XHR7XHJcblx0XHRcdGZlbmV0cmVFbkTDqXBsYWNlbWVudCA9IGZlbmV0cmU7XHJcblx0XHRcdGTDqXBsYWNlcignZMOpYnV0Jyk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5XaW5kb3cgPSBXaW5kb3c7XHJcblx0XHR0aGlzLmxpc3RlID0gbmV3IHliYXN0aGlzLnR5cGVzRG9ubmVlcy5MaXN0ZSgpO1xyXG5cdFx0dGhpcy50b0ZpcnN0UGxhbiA9IHdpbmRvdyA9PiB3aW5kb3cuZG9tLnN0eWxlLnpJbmRleCA9IGluZGV4UHJlbWllclBsYW4rKztcclxuXHQvKioqKioqKioqKioqKioqPlxyXG5cdC8vXHRFVkVORU1FTlRTIC8vXHJcblx0PCoqKioqKioqKioqKioqKi9cclxuXHRcdHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5xdWFuZE1vdXZlbWVudCgoKSA9PiBkw6lwbGFjZXIoJ2VuY291cnMnKSApO1xyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IGTDqXBsYWNlcignZmluJykgKTtcclxufTsiXX0=

/***/ }),
/* 15 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9fX3NlbGVjdGlvbjIuanMiXSwibmFtZXMiOlsiY29uc3RydWN0ZXVyIiwic2VsZWN0aW9uRG9tRXh0ZXJuZSIsImlSZWYiLCJ5YmFzdGhpcyIsInR5cGVzRG9ubmVlcyIsIlJlZmVyZW5jZSIsImluZGV4IiwiZG9tIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2VsZWN0aW9uT3V2ZXJ0ZSIsInN0eWxlIiwiekluZGV4IiwicG9zaXRpb24iLCJoZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjaGFydGVVaSIsImdyaXNDbGFpciIsImRpc3BsYXkiLCJkZXNrdG9wIiwiYXBwZW5kQ2hpbGQiLCJjaG9peCIsIlN1cHByaW1lckNob2l4IiwicmVmIiwicmVtb3ZlIiwic3VwcHJpbWVyIiwiYWpvdXRlckNob2l4IiwiZG9tRWxlbWVudCIsIm9idGVuaXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJtYXJnaW4iLCJhZGRFdmVudExpc3RlbmVyIiwiZ3Jpc0ZvbmNlIiwibGFzdENoaWxkIiwidmVycm91aWxsZXIiLCJlbGVtZW50IiwiY29tcG9zYW50RG9tIiwiaW5mb3MiLCJsZWZ0Iiwid2lkdGgiLCJjaGlsZHJlbiIsImxlbmd0aCIsInNlbGVjdGlvbkRvbUludGVybmUiLCJzaGFkb3dSb290IiwicXVlcnlTZWxlY3RvciIsIm1pbldpZHRoIiwibXV0YXRpb25TZW5zb3IiLCJuZXdBc0F0dHJpYnV0ZXMiLCJ0aXRyZURvbSIsImlubmVySFRNTCIsImdldEF0dHJpYnV0ZSIsIm5ld0FzU3R5bGVFeHBlY3RlZCIsIm5hbWUiLCJleHBlY3RlZCIsImlzRXF1YWwiLCJsYXJnZXVyUsOpZWxsZVRpdHJlIiwidXRpbGl0YWlyZXMiLCJncmFuZGV1cnMiLCJlbmxldmVyVW5pdMOpIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImxhcmdldXJSw6llbGxlU2VsZWN0aW9uIiwib2Zmc2V0V2lkdGgiLCJsYXJnZXVyT2NjdXDDqSIsIm91dGlsc0VubGV2ZXJQeCIsInRhaWxsZSIsInNwbGl0IiwicG9wIiwiTnVtYmVyIiwiam9pbiIsImVuZmFudCIsInRlbXBsYXRlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm5vbSJdLCJtYXBwaW5ncyI6IkFBQUM7O0FBQ0EsSUFBTUEsZUFBZSxTQUFmQSxZQUFlLENBQVNDLG1CQUFULEVBQ3JCO0FBQ0MsS0FBTUMsT0FBTyxJQUFJQyxTQUFTQyxZQUFULENBQXNCQyxTQUExQixFQUFiO0FBQ0EsS0FBTUMsUUFBUSxFQUFkO0FBQ0EsS0FBTUMsTUFBTUMsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFaOztBQUVBLEtBQUlDLG1CQUFtQixLQUF2QjtBQUNBSCxLQUFJSSxLQUFKLENBQVVDLE1BQVYsR0FBbUIsTUFBbkI7QUFDQUwsS0FBSUksS0FBSixDQUFVRSxRQUFWLEdBQXFCLFVBQXJCO0FBQ0FOLEtBQUlJLEtBQUosQ0FBVUcsTUFBVixHQUFtQixNQUFuQjtBQUNBUCxLQUFJSSxLQUFKLENBQVVJLGVBQVYsR0FBNEJaLFNBQVNhLFFBQVQsQ0FBa0JDLFNBQTlDO0FBQ0FWLEtBQUlJLEtBQUosQ0FBVU8sT0FBVixHQUFvQixNQUFwQjtBQUNBO0FBQ0FmLFVBQVNJLEdBQVQsQ0FBYVksT0FBYixDQUFxQkMsV0FBckIsQ0FBaUNiLEdBQWpDOztBQUVBTixxQkFBb0JvQixLQUFwQixHQUE0QmYsS0FBNUI7QUFDQUwscUJBQW9CcUIsY0FBcEIsR0FBcUMsZUFDckM7QUFDQ2hCLFFBQU1pQixHQUFOLEVBQVdDLE1BQVg7QUFDQXRCLE9BQUt1QixTQUFMLENBQWVGLEdBQWY7QUFDQSxTQUFPQSxHQUFQO0FBQ0EsRUFMRDtBQU1BdEIscUJBQW9CeUIsWUFBcEIsR0FBbUMsVUFBQ0MsVUFBRCxFQUNuQztBQUNDLE1BQU1KLE1BQU1yQixLQUFLMEIsT0FBTCxFQUFaO0FBQ0FELGFBQVdoQixLQUFYLENBQWlCRyxNQUFqQixHQUEyQmIsb0JBQW9CNEIscUJBQXBCLEdBQTRDZixNQUE1QyxHQUFxRCxD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QyxPQUFQLEdBQ0E7QUFDQ0MsTUFBUyxXQURWO0FBRUNILFdBQVlBLFFBRmI7QUFHQ3ZFLGVBQWVBO0FBSGhCLENBREEiLCJmaWxlIjoiX19zZWxlY3Rpb24yLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyJcdCd1c2Ugc3RyaWN0JztcclxuXHRjb25zdCBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihzZWxlY3Rpb25Eb21FeHRlcm5lKVxyXG5cdHtcclxuXHRcdGNvbnN0IGlSZWYgPSBuZXcgeWJhc3RoaXMudHlwZXNEb25uZWVzLlJlZmVyZW5jZTtcclxuXHRcdGNvbnN0IGluZGV4ID0gW107XHJcblx0XHRjb25zdCBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFxyXG5cdFx0bGV0IHNlbGVjdGlvbk91dmVydGUgPSBmYWxzZTtcclxuXHRcdGRvbS5zdHlsZS56SW5kZXggPSAnNTAwMCc7XHJcblx0XHRkb20uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0ZG9tLnN0eWxlLmhlaWdodCA9ICc2NHB4JztcclxuXHRcdGRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0XHRkb20uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdC8vZG9tLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgYmxhY2snO1xyXG5cdFx0eWJhc3RoaXMuZG9tLmRlc2t0b3AuYXBwZW5kQ2hpbGQoZG9tKTtcclxuXHRcdFxyXG5cdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS5jaG9peCA9IGluZGV4O1xyXG5cdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS5TdXBwcmltZXJDaG9peFx0PSByZWYgPT5cclxuXHRcdHtcclxuXHRcdFx0aW5kZXhbcmVmXS5yZW1vdmUoKTtcclxuXHRcdFx0aVJlZi5zdXBwcmltZXIocmVmKTtcclxuXHRcdFx0cmV0dXJuIHJlZjtcclxuXHRcdH07XHJcblx0XHRzZWxlY3Rpb25Eb21FeHRlcm5lLmFqb3V0ZXJDaG9peCA9IChkb21FbGVtZW50KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCByZWYgPSBpUmVmLm9idGVuaXIoKTtcclxuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAoc2VsZWN0aW9uRG9tRXh0ZXJuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyKSArICdweCc7XHJcblx0XHRcdGRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG5cdFx0XHRcclxuXHRcdFx0ZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PiBkb21FbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNGb25jZSk7XHJcblx0XHRcdGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiBkb21FbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcik7XHJcblx0XHJcblx0XHRcdGRvbS5hcHBlbmRDaGlsZChkb21FbGVtZW50KTtcclxuXHRcdFx0XHJcblx0XHRcdGluZGV4W3JlZl0gPSBkb20ubGFzdENoaWxkO1xyXG5cdFx0XHRyZXR1cm4gcmVmO1xyXG5cdFx0fTtcclxuXHRcclxuXHRcdHNlbGVjdGlvbkRvbUV4dGVybmUudmVycm91aWxsZXJcclxuXHRcdChcclxuXHRcdFx0KGVsZW1lbnQpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxlY3Rpb25PdXZlcnRlID0gdHJ1ZTtcclxuXHRcdFx0XHRjb21wb3NhbnREb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlO1xyXG5cdFx0XHRcdGNvbnN0IGluZm9zID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0XHRkb20uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLnRvcCA9IChpbmZvcy50b3AgKyBpbmZvcy5oZWlnaHQpICsgJ3B4JztcclxuXHRcdFx0XHRkb20uc3R5bGUubGVmdCA9IGluZm9zLmxlZnQgKyAncHgnO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS53aWR0aCA9IGluZm9zLndpZHRoICsgJ3B4JztcclxuXHRcdFx0XHRkb20uc3R5bGUuaGVpZ2h0ID0gKChpbmZvcy5oZWlnaHQgLyAyKSAqIGRvbS5jaGlsZHJlbi5sZW5ndGgpICsgMiArICdweCc7XHJcblx0XHRcdH0sXHJcblx0XHRcdCgpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxlY3Rpb25PdXZlcnRlID0gZmFsc2U7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdFx0Y29tcG9zYW50RG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHRcdGNvbnN0IHNlbGVjdGlvbkRvbUludGVybmUgPSBzZWxlY3Rpb25Eb21FeHRlcm5lLnNoYWRvd1Jvb3Q7XHJcblx0XHRjb25zdCBjb21wb3NhbnREb20gPSBzZWxlY3Rpb25Eb21JbnRlcm5lLnF1ZXJ5U2VsZWN0b3IoJyNjb21wb3NhbnQnKTtcclxuXHRcdC8vY29tcG9zYW50RG9tLnN0eWxlLmhlaWdodCA9ICc0NHB4JztcclxuXHRcdGNvbXBvc2FudERvbS5zdHlsZS5taW5XaWR0aCA9ICc0ZW0nO1xyXG5cdFx0Y29tcG9zYW50RG9tLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbXBvc2FudERvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzRm9uY2U7XHJcblx0XHR9ICk7XHJcblx0XHRjb21wb3NhbnREb20uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZighc2VsZWN0aW9uT3V2ZXJ0ZSkgY29tcG9zYW50RG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdFx0XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHRcdHliYXN0aGlzLm11dGF0aW9uU2Vuc29yLm5ld0FzQXR0cmlidXRlcyhzZWxlY3Rpb25Eb21FeHRlcm5lLCBbJ25vbSddLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgdGl0cmVEb20gPSBjb21wb3NhbnREb20ucXVlcnlTZWxlY3RvcignI3RpdHJlJyk7IFxyXG5cdFx0XHR0aXRyZURvbS5pbm5lckhUTUwgPSBzZWxlY3Rpb25Eb21FeHRlcm5lLmdldEF0dHJpYnV0ZSgnbm9tJyk7XHJcblx0XHRcdC8vdGl0cmVEb20uc3R5bGUud2lkdGggPSAnYXV0byc7XHJcblx0XHRcdHliYXN0aGlzLm11dGF0aW9uU2Vuc29yLm5ld0FzU3R5bGVFeHBlY3RlZFxyXG5cdFx0XHQoXHJcblx0XHRcdFx0dGl0cmVEb20sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bmFtZTpcdFx0XHQnd2lkdGgnLFxyXG5cdFx0XHRcdFx0ZXhwZWN0ZWQ6XHQnYXV0bycsXHJcblx0XHRcdFx0XHRpc0VxdWFsOlx0ZmFsc2VcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCgpID0+XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bGV0IGxhcmdldXJSw6llbGxlVGl0cmUgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKHRpdHJlRG9tKS53aWR0aCk7XHJcblx0XHRcdFx0XHRsZXQgbGFyZ2V1clLDqWVsbGVTZWxlY3Rpb24gPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKGNvbXBvc2FudERvbS5xdWVyeVNlbGVjdG9yKCcjbWFycXVldXJTZWxlY3Rpb24nKSApLndpZHRoKTtcclxuXHRcdFx0XHRcdGNvbXBvc2FudERvbS5zdHlsZS53aWR0aCA9IHRpdHJlRG9tLm9mZnNldFdpZHRoICsgbGFyZ2V1clLDqWVsbGVTZWxlY3Rpb24gKyA1ICsgJ3B4JztcclxuXHRcdFx0XHRcdHNlbGVjdGlvbkRvbUV4dGVybmUuc3R5bGUud2lkdGggPSBjb21wb3NhbnREb20uc3R5bGUud2lkdGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0fSk7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdlamFyJywgc2VsZWN0aW9uRG9tRXh0ZXJuZSwgc2VsZWN0aW9uRG9tRXh0ZXJuZS5nZXRBdHRyaWJ1dGUoJ25vbScpKTtcclxuXHRcdFxyXG5cdFx0bGV0IGxhcmdldXJPY2N1cMOpID0gMDtcclxuXHRcdGNvbnN0IG91dGlsc0VubGV2ZXJQeCA9IHRhaWxsZSA9PiB2b2lkKHRhaWxsZSA9IHRhaWxsZS5zcGxpdCgnJyksIHRhaWxsZS5wb3AoKSwgdGFpbGxlLnBvcCgpICkgfHwgTnVtYmVyKHRhaWxsZS5qb2luKCcnKSApO1xyXG5cdFx0Zm9yKGxldCBlbmZhbnQgb2YgY29tcG9zYW50RG9tLmNoaWxkcmVuKVxyXG5cdFx0e1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVuZmFudCwgZW5mYW50Lm9mZnNldFdpZHRoKTtcclxuXHRcdFx0bGFyZ2V1ck9jY3Vww6kgKz0gZW5mYW50Lm9mZnNldFdpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vY29uc29sZS5sb2cobGFyZ2V1ck9jY3Vww6kpO1xyXG5cdFx0Ly9jb21wb3NhbnREb20uc3R5bGUud2lkdGggPSBsYXJnZXVyT2NjdXDDqSArICdweCc7XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cdGNvbnN0IHRlbXBsYXRlID1cclxuXHRgXHJcblx0XHQ8dGVtcGxhdGU+XHJcblx0XHRcdDxkaXYgaWQ9J2NvbXBvc2FudCcgPlxyXG5cdFx0XHRcdDxkaXYgaWQ9J3RpdHJlJyA+PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBpZD0nbWFycXVldXJTZWxlY3Rpb24nID4mIzg3NDQ7PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHJcblx0XHRcdDxzdHlsZT5cclxuXHRcdFx0XHQjY29tcG9zYW50XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gOlx0cmVsYXRpdmU7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yIDogI2I1YjNiMztcclxuXHRcdFx0XHRcdHRvcDogMHB4O1xyXG5cdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byAxZW07XHJcblx0XHRcdFx0XHRncmlkLXRlbXBsYXRlLXJvd3M6IDEwMCU7XHJcblx0XHRcdFx0XHRncmlkLXRlbXBsYXRlLWFyZWFzOiBcInRpdHJlIHR5cGVcIjtcclxuXHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcFx0Olx0XHRib3JkZXItYm94O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLXN0eWxlXHQ6XHRcdFx0b3V0c2V0O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLXdpZHRoXHQ6XHRcdFx0MnB4O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLWNvbGxhcHNlXHQ6XHRcdHNlcGFyYXRlO1xyXG5cdFx0XHRcdFx0Ym9yZGVyLXNwYWNpbmdcdDpcdFx0MHB4IDBweDtcclxuXHRcdFx0XHRcdGJvcmRlci1jb2xvclx0Olx0XHRcdHJnYigyMjcsIDIyNywgMjI3KTtcclxuXHRcdFx0XHRcdGJveC1zaXppbmdcdDpcdFx0XHRcdGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHR0cmFuc2Zvcm0tYm94XHQ6XHRcdGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHR3aWR0aCA6IGF1dG87XHJcblx0XHRcdFx0XHRtaW4taGVpZ2h0IDogMS41ZW07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCN0aXRyZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHRcdFx0XHRcdHRvcDogMHB4O1xyXG5cdFx0XHRcdFx0Z3JpZC1hcmVhOiB0aXRyZTtcclxuXHRcdFx0XHRcdG92ZXJmbG93OiBoaWRkZW47XHJcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRtYXJnaW4tbGVmdDogMC41ZW07XHJcblx0XHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuNWVtO1xyXG5cdFx0XHRcdFx0d2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHRcdFx0XHRcdGZvbnQtd2VpZ2h0IDogNzAwO1xyXG5cdFx0XHRcdFx0aGVpZ2h0IDogYXV0bztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0I21hcnF1ZXVyU2VsZWN0aW9uXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0dG9wOiAwcHg7XHJcblx0XHRcdFx0XHRncmlkLWFyZWE6IHR5cGU7XHJcblx0XHRcdFx0XHRyaWdodCA6IDBweDtcclxuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRcdFx0XHRcdHBhZGRpbmctdG9wIDogY2FsYyg1MCUgIC0gMC43ZW0pO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvciA6IGdyZXk7XHJcblx0XHRcdFx0XHRoZWlnaHQgOiBhdXRvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0PC9zdHlsZT5cclxuXHRcdDwvdGVtcGxhdGU+YDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdzZWxlY3Rpb24nLFxyXG5cdHRlbXBsYXRlXHRcdDogdGVtcGxhdGUsXHJcblx0Y29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59OyJdfQ==

/***/ }),
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LXRhYi5qcyJdLCJuYW1lcyI6WyJjb25zdHJ1Y3RldXIiLCJlbFRhYiIsImNvbnRlbmV1ciIsInZ1ZUludGVybmUiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJkaXNwbGF5IiwiYmFja2dyb3VuZENvbG9yIiwib3ZlcmZsb3ciLCJjcyIsImdldENvbXB1dGVkU3R5bGUiLCJlbE1lbnUiLCJlbE9uZ2xldCIsInNldFByb3BlcnR5IiwiaGVpZ2h0IiwidGVtcGxhdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9tIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQSxJQUFJQSxlQUFlLFNBQWZBLFlBQWUsQ0FBU0MsS0FBVCxFQUNuQjtBQUNDLEtBQUlDLFlBQVlDLFdBQVdDLGFBQVgsQ0FBeUIsWUFBekIsQ0FBaEI7QUFDQUgsT0FBTUksS0FBTixDQUFZQyxPQUFaLEdBQXdCLGNBQXhCO0FBQ0FMLE9BQU1JLEtBQU4sQ0FBWUUsZUFBWixHQUE4QixNQUE5QjtBQUNBTixPQUFNSSxLQUFOLENBQVlHLFFBQVosR0FBeUIsUUFBekI7QUFDQSxLQUFNQyxLQUFLQyxnQkFBWDtBQUFBLEtBQ0dDLFNBQVNULFVBQVVFLGFBQVYsQ0FBd0IsT0FBeEIsQ0FEWjs7QUFJQyxLQUFJUSxXQUFXWCxNQUFNRyxhQUFOLENBQW9CLFNBQXBCLENBQWY7QUFDRFEsVUFBU1AsS0FBVCxDQUFlUSxXQUFmLENBQTJCLFFBQTNCLEVBQXFDSixHQUFHUixLQUFILEVBQVVhLE1BQVYsR0FBb0JMLEdBQUdFLE1BQUgsRUFBV0csTUFBL0IsR0FBeUMsSUFBOUU7QUFDQSxRQUFPLEtBQVA7QUFDQSxDQWJEOztBQWdCQSxJQUFJQyxrM0JBQUo7QUF1Q0FDLE9BQU9DLE9BQVAsR0FDQTtBQUNDQyxNQUFTLFVBRFY7QUFFRUgsV0FBWUEsUUFGZDtBQUdFZixlQUFlQTtBQUhqQixDQURBIiwiZmlsZSI6Im1lbnUtdGFiLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGb25jdGlvbm5lIGVuIGFwcGFyZW5jZSwgbcOqbWUgc2kgY29kZSBpbnZhbGlkZSFcclxuLy8gRMO7IGF1IGZhaXQgcXVlIGxhIGxvZ2lxdWUgZXN0IGNvZMOpIGRhbnMgbCfDqWzDqW1lbnQgb25nbGV0LlxyXG52YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxUYWIpXHJcbntcclxuXHR2YXIgY29udGVuZXVyID0gdnVlSW50ZXJuZS5xdWVyeVNlbGVjdG9yKCcjY29udGVuZXVyJyk7XHRcclxuXHRlbFRhYi5zdHlsZS5kaXNwbGF5XHRcdFx0PSAnaW5saW5lLWJsb2NrJztcclxuXHRlbFRhYi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3JcdD0gJ2dyZXknO1xyXG5cdGVsVGFiLnN0eWxlLm92ZXJmbG93XHRcdFx0PSAnaGlkZGVuJztcclxuXHR2YXIgICBjc1x0PSBnZXRDb21wdXRlZFN0eWxlXHJcblx0XHQsIGVsTWVudVx0PSBjb250ZW5ldXIucXVlcnlTZWxlY3RvcignI21lbnUnKVxyXG5cdDtcclxuXHRcclxuIFx0dmFyIGVsT25nbGV0XHQ9IGVsVGFiLnF1ZXJ5U2VsZWN0b3IoJyNvbmdsZXQnKTtcclxuXHRlbE9uZ2xldC5zdHlsZS5zZXRQcm9wZXJ0eSgnaGVpZ2h0JywgY3MoZWxUYWIpLmhlaWdodCAtIChjcyhlbE1lbnUpLmhlaWdodCkgKyAncHgnKTtcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5cclxudmFyIHRlbXBsYXRlID0gXHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8ZGl2IGlkPSdjb250ZW5ldXInPlxyXG5cdFx0XHQ8ZGl2IGlkPSdtZW51Jz48L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nb25nbGV0Jz48L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0XHQ8c3R5bGU+XHJcblx0XHRcdFx0I2NvbnRlbmV1clxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG92ZXJmbG93XHRcdDogaGlkZGVuXHJcblx0XHRcdFx0O1x0ZGlzcGxheVx0XHRcdDogZmxleFxyXG5cdFx0XHRcdDtcdGZsZXgtZGlyZWN0aW9uXHQ6IGNvbHVtblxyXG5cdFx0XHRcdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0I21lbnVcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRkaXNwbGF5IFx0XHRcdDogZmxleFx0XHRcdCFpbXBvcnRhbnRcclxuXHRcdFx0XHRcdDtmbGV4LWRpcmVjdGlvblx0XHQ6IHJvdyBcdFx0XHQhaW1wb3J0YW50XHJcblx0XHRcdFx0XHQ7aGVpZ2h0XHRcdFx0XHQ6IDM1cHhcclxuXHRcdFx0XHRcdDt6LWluZGV4XHRcdFx0OiA1MDBweFxyXG5cdFx0XHRcdFx0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQjb25nbGV0XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0O292ZXJmbG93XHRcdFx0OiBoaWRkZW5cclxuXHRcdFx0XHRcdDtwb3NpdGlvblx0XHRcdDogcmVsYXRpdmVcclxuXHRcdFx0XHRcdDt0b3BcdFx0XHRcdDogMTAgcHg7XHJcblx0XHRcdFx0XHQ7YmFja2dyb3VuZC1jb2xvclx0OiBncmVlblxyXG5cdFx0XHRcdFx0O3dpZHRoXHRcdFx0XHQ6IDEwMCVcclxuXHRcdFx0XHRcdDtoZWlnaHRcdFx0XHRcdDogMTAwJVxyXG5cdFx0XHRcdFx0O2Rpc3BsYXlcdFx0XHQ6YmxvY2tcclxuXHRcdFx0XHRcdDt6LWluZGV4XHRcdFx0OiA0MDBweFxyXG5cdFx0XHRcdFx0O1xyXG5cdFx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0PC90ZW1wbGF0ZT5cclxuYDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdtZW51LXRhYidcclxuXHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07Il19

/***/ }),
/* 23 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjIzYmRhZDhmYWExNTQ4ZTFkNjAiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS8wL3N1cmNvdWNoZU5hdGlmcy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzEvY29udHJhdC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzEvc29uZGVNdXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzIvdHlwZXNEb25uZWVzLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvMi91dGlsaXRhaXJlcy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzMvZWxlbWVudHNQZXJzb25hbGlzw6lzLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvZ3VpSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2xpc3RlRWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL3VpL3ByaW5jaXBhbGUuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9XaW5kb3cuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyQ2FwdHVyZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL3BvaW50ZXJFdmVudEJpbmRpbmcuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyT25Nb3ZlLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvc3lzdGVtZVBvaW50YWdlLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvd2luZG93cy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvX19zZWxlY3Rpb24yLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9ib3V0b24uanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL2Nhc2VDb2NoZXIuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL2Nob2l4LmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9nYWxsZXJpZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvaW50ZXJmYWNlLmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LW9uZ2xldC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvbWVudS10YWIuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL21lbnUuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS95YmFzdGhpcy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvYWRtaW5pc3RyYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL3VpL2F1dHJlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9hY2N1ZXVpbC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9ub3V2ZWF1UHJvamV0LmpzIiwid2VicGFjazovLy8vaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS91aS9lc3BhY2VUcmF2YWlsL3Byb2pldENsYXNzZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvbW9kdWxlcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJvYnRlbmlyUGFyZW50IiwiZWxlbSIsInBhcmVudCIsImhvc3QiLCJwYXJlbnROb2RlIiwib2Zmc2V0UGFyZW50IiwianVzcXVhUmFjaW5lIiwiaSIsInN1aXRlIiwidHJvdXZlcklkUHJvY2hlIiwicmVzdWx0YXQiLCJnZXRBdHRyaWJ1dGUiLCJpZCIsIkVycm9yIiwiZGlzdCIsIm9idGVuaXJOb21UYWciLCJyZWN1ciIsInIiLCJwdXNoIiwidGFnTmFtZSIsIkhUTUxFbGVtZW50IiwicHJvdG90eXBlIiwib2J0ZW5pcklkIiwiaWRQcm9jaGUiLCJlIiwibm9tc1RhZyIsIm5vbXMiLCJub20iLCJqb2luIiwibGVuZ3RoIiwibm9ldWQiLCJ5YmFzdGhpc2RvbSIsInZlcnJvdWlsbGVyIiwicXVhbmRWZXJyb3VpbGxhZ2UiLCJxdWFuZETDqXbDqXJvdWlsbGFnZSIsInliYXN0aGlzIiwiZG9tIiwiZGVza3RvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZXRhaWxzIiwidmVycm91aWxsYWdlIiwiw6ljb3V0ZXVyIiwiZWUiLCJkw6l2ZXJyb3VpbGxhZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYXBwbGlxdWVyQm9yZHVyZSIsImluZm9zIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZWxGcm9tUHQiLCJ4IiwieSIsImRvY3VtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNvbGxpc2lvbnMiLCJoYXV0IiwiZHJvaXRlIiwiYmFzIiwiZ2F1Y2hlIiwiY29sbGlzaW9uQm9yZHVyZSIsImPDtHTDqSIsImVsZW1lbnRUZXN0Q29sbGlzaW9uIiwiZWxTdHlsZUNhbGN1bMOpIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImJvcmRlclRvcFdpZHRoIiwiYm9yZGVyUmlnaHRXaWR0aCIsImJvcmRlckJvdHRvbVdpZHRoIiwiYm9yZGVyTGVmdFdpZHRoIiwic3R5bGUiLCJib3JkZXIiLCJhY2MiLCJoYXV0WSIsInRvcCIsImJhc1kiLCJib3R0b20iLCJtYXgiLCJ3aWR0aCIsInBvc2l0aW9uWCIsImdhdWNoZVgiLCJsZWZ0IiwiRHJvaXRlWCIsInJpZ2h0IiwiWSIsImhlaWdodCIsInBvc2l0aW9uWSIsImNvbnNvbGUiLCJsb2ciLCJyw6lvcmdhbmlzZXIiLCJvZmZzZXRIZWlnaHQiLCJjYWxjdWxlclRhaWxsZVLDqWVsZSIsInN0eWxlSW5pdGlhbGUiLCJyZXN1bHRhdHMiLCJhcmd1bWVudHMiLCJhcmciLCJhdHRyaWJ1dCIsIk9iamVjdCIsImtleXMiLCJzcGxpdCIsInBvcCIsIk51bWJlciIsImNhbGN1bCIsImVyclJlbW9udGVyRU9EIiwiZW9kIiwicmVtb250ZXIiLCJwYXJlbnRFbGVtZW50IiwidW5kZWZpbmVkIiwiZXJyIiwibWVzc2FnZSIsIm9iamV0IiwiZmYiLCJlangiLCJlc3REYW5zRG9jdW1lbnQiLCJvYnRlbmlyU3R5bGVBdXRldXIiLCJzdHlsZUF1dGV1ciIsInN0eWxlU2hlZXRzIiwib2J0ZW5pclN0eWxlQXV0ZXVyRWxlbWVudCIsInJlYWR5U3RhdGUiLCJyw6hnbGVzRWxlbWVudCIsImlGZXVpbGxlIiwibkZldWlsbGVzU3R5bGVzIiwiZmV1aWxsZUFjdHVlbGxlIiwiY3NzUnVsZXMiLCJpUsOoZ2xlQ3NzIiwiblLDqGdsZXNDc3MiLCJyw6hnbGVDc3NBY3R1ZWxsZSIsIm1hdGNoZXMiLCJzZWxlY3RvclRleHQiLCJwYXJjb3VyaXJCYXMiLCJTaGFkb3dSb290IiwiZm9uY3Rpb25UcmFpdHJlbWVudCIsInRyYWl0ZXJFbmZhbnQiLCJlbmZhbnQiLCJjaGlsZHJlbiIsInNoYWRvd1Jvb3QiLCJIVE1MQ29sU3ltYkl0ZXIiLCJIVE1MQ29sbGVjdGlvbiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiaU1heCIsInNvaXMiLCJuZXh0IiwiZG9uZSIsInZhbHVlIiwiTXV0YXRpb25SZWNvcmRTeW1iSXRlciIsIk11dGF0aW9uUmVjb3JkIiwiTm9kZUxpc3RTeW1iSXRlciIsIk5vZGVMaXN0IiwicmVxdWVzdFBvaW50ZXJMb2NrIiwibW96UmVxdWVzdFBvaW50ZXJMb2NrIiwid2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrIiwicG9pbnRlckxvY2tFbGVtZW50IiwibW96UG9pbnRlckxvY2tFbGVtZW50Iiwid2Via2l0UG9pbnRlckxvY2tFbGVtZW50IiwibGllciIsImVycmV1ckxpw6llIiwiX2xpYWlzb24iLCJfbWVzc2FnZSIsInByb3BVdGlsaXPDqWVzIiwicHJvcCIsImZvcm1lbGxlIiwiZXN0RGVmYXV0IiwiZXN0Rm9ybWVsbGUiLCJyZXRvdXIiLCJlc3RSZXRvdXIiLCJmbkNvbnRyYXQiLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyYW1zIiwiZG9pdCIsImRvbm7DqWUiLCJjb250cmF0IiwiZ2VuZXJlckVycmV1ciIsImFzc2VydGlvbiIsInBpbGVPdUZhY2UiLCJhdHRlbmR1IiwicmXDp3UiLCJwcm9wb3NpdGlvbiIsIkFycmF5IiwidmFsZXVyQWRtaXNlIiwibmVkb2l0IiwibGlzdGVuZXJzIiwib2JzZXJ2ZXJDYWxsYmFjayIsIm11dGF0aW9ucyIsIm9ic2VydmVyIiwibXV0YXRpb24iLCJ0YXJnZXQiLCJNdXRhdGlvbk9ic2VydmVyIiwibmV3IiwibXV0YXRpb25PYnNlcnZlckluaXQiLCJjYWxsYmFjayIsIm9ic2VydmUiLCJuZXdBc0F0dHJpYnV0ZXMiLCJhdHRyTGlzdCIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzRmlsdGVyIiwibmV3QXNBdHRyaWJ1dGVFeHBlY3RlZCIsImF0dHIiLCJuYW1lIiwiZXhwZWN0ZWQiLCJuZXdBc1N0eWxlRXhwZWN0ZWQiLCJpc0VxdWFsIiwidHlwZXNEb25uZWVzIiwiUmVmZXJlbmNlIiwicmVmTWF4IiwicmVmTGlicmUiLCJvYnRlbmlyIiwic2hpZnQiLCJsaWJlcmVyIiwicmVmIiwibGlicmUiLCJ0YWlsbGUiLCJvY2N1cGUiLCJ0eXBlIiwiSXRlcmF0ZXVySW50ZXJuZUxpc3RlIiwicmVmcyIsInJlcHJlc2VudGF0aW9uIiwiaUFjdHVlbCIsInN1aXZhbnQiLCJ2YWxldXIiLCJjbGUiLCJsaXN0ZV9lbFZlcnNSZWYiLCJsaXN0ZUl0ZXJhdGV1ciIsImVsZW1lbnQiLCJMaXN0ZSIsImFqb3V0ZXIiLCJzdXBwcmltZXIiLCJjb250aWVudCIsImNvZXJjaXNpb24iLCJ2ZXJzVGFibGVhdSIsIml0ZXJhdGV1ciIsIkxpc3RlVVIyIiwiZW1wbGFjZW1lbnRzIiwib3BlcmF0aW9uIiwiZWxlbWVudFByZXNlbnQiLCJuRWxlbWVudHMiLCJwb3VyRGUiLCJmbiIsIkxpc3RlVVIzIiwiRGljdGlvbm5haXJlIiwiaW5kZXgiLCJtb2RpZmllciIsIl9pQWN0IiwiX3RhYiIsIkludGVyZmFjZVR5cMOpZSIsInNpZ25hdHVyZSIsInZhbGlkZXIiLCJUeXBlRXJyb3IiLCJzaWduYXR1cmVUZXN0w6kiLCJub21Qcm9wIiwiaW5jbHVkZXMiLCJwcm9wcmnDqXTDqVRlc3TDqWUiLCJzaWduYXR1cmVUZXN0w6llIiwiSW50ZXJmYWNlTm9uVHlww6llIiwiU09JUyIsImNvbXByaXMiLCJjb21wcmlzSW50ZXJ2YWxlIiwiaW50ZXJ2YWxlMCIsImludGVydmFsZTEiLCJlbnRpZXIwIiwiZW50aWVyMSIsImNvbXByaXNJbnRlcnZhbGVFbnRpZXIiLCJpbnRlcnZhbGUiLCJjb21wcmlzRW50aWVyIiwib3BlcmFuZGUwIiwib3BlcmFuZGUxIiwiY2hhw65uZXIiLCJKU09OIiwic3RyaW5naWZ5IiwiV0hFTiIsImludGVydmFsIiwid29ya2VyIiwibGlzdGVuZXIiLCJjb25kaXRpb24iLCJmaWx0ZXIiLCJlbCIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImdyYW5kZXVycyIsImVubGV2ZXJVbml0w6kiLCJncmFuZGV1ciIsInNsaWNlIiwiY2FsbCIsInJldmVyc2UiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJ1bml0w6lzIiwiYWpvdXRlclVuaXTDqSIsImNoYWluZSIsInVuaXTDqSIsImludGVycHJldGV1ckh0bWwiLCJpbnRlcnByZXRldXJEb20iLCJET01QYXJzZXIiLCJwYXJzZUZyb21TdHJpbmciLCJjaGFpbmVIdG1sIiwiZmFicmlxdWUiLCJlc3BhY2VEZU5vbSIsImRpY3Rpb25uYWlyZUVsw6ltZW50IiwiSUVsZW1lbnQiLCJjb25zdHJ1Y3RldXIiLCJGdW5jdGlvbiIsInRlbXBsYXRlIiwicGFyYW3DqHRyZXMiLCJzb2lzQ2xhc3NlRWxlbWVudCIsInByb3RvdHlwZUh0bWxFbGVtZW50IiwiY3JlYXRlIiwiSW50YW5jZUVsZW1lbnRIdG1sIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsImNyZWF0ZVNoYWRvd1Jvb3QiLCJhcHBlbmRDaGlsZCIsIm1vZGVsZSIsImNsb25lTm9kZSIsImNvbnRlbnQiLCJvYnRlbmlyUHJvdG90eXBlIiwibW9kZWxlVGVtcG9yYWlyZSIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJjcmVhdGVkQ2FsbGJhY2siLCJhdHRhY2hlZENhbGxiYWNrIiwiZGV0YWNoZWRDYWxsYmFjayIsInJlZ2lzdGVyRWxlbWVudCIsImFzc2lnbiIsImNvbmZpZyIsImNvbnRlbmV1ciIsImdldEVsZW1lbnRCeUlkIiwic3lzdGVtZVBvaW50YWdlIiwiY3JlYXRlRWxlbWVudCIsInBvc2l0aW9uIiwiekluZGV4Iiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSIsIndpbmRvd3MiLCJndWlFZGkiLCJXaW5kb3ciLCJwb3MiLCJkaW0iLCJ0aXRyZSIsImd1aUVkaTIiLCJlc3BhY2VEZVRyYXZhaWxEb20iLCJkZWNhbGFnZSIsInV0aWxpdGFpcmVzIiwiaW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsIiwibWVudUVsZW1lbnQiLCJjaWJsZSIsImRldGFpbCIsImFmZmljaGVyIiwibm9tT25nbGV0IiwiYWFhVGVzdERvbSIsImVzcGFjZVRyYXZhaWxEb20iLCJpbnRlcmZhY2UyIiwia2FrYSIsImJvZHkiLCJsYXN0Q2hpbGQiLCJ6aWd6YWciLCJvcHRpb25zIiwic2VsZiIsInRpdHJlTWF4IiwiZG9tRmVuZXRyZSIsImNsb3NlIiwicmVtb3ZlIiwibGlzdGUiLCJkaW1tZW5zaW9ubmVyIiwibm9tbWVyIiwidGV4dENvbnRlbnQiLCJjb2xpc2lvbkNvbnRpbnVlIiwicG9zaXRpb25uZXIiLCJjb2xpc2lvbiIsImZlbmV0cmUiLCJhcHAiLCJkZXBsYWNlciIsImJsb3F1ZXIiLCJzZXRUaW1lb3V0IiwiZMOpYmxvcXVlciIsImZlbmV0cmVIYXV0RG9tIiwidG9GaXJzdFBsYW4iLCJpbml0aWFsaXNlckTDqXBsYWNlbWVudCIsIm5vZGVOYW1lIiwiY2hhbmdlQ3Vyc29yIiwiYnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJidXR0b24iLCJjb250ZW51RG9tIiwiX2NsYXNzZV8iLCJjcsOpZXJFbMOpbWVudCIsImRpdiIsInRhYiIsImNsYXNzTmFtZSIsInNyYyIsImJvcmRlckJvdHRvbSIsIm1hcmdpbiIsInZlcnRpY2FsQWxpZ24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3hTaGFkb3ciLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJwb2ludGVyTG9jayIsImV2ZW50IiwicXVlcnlDdXJzb3IiLCJzaGFyZWQiLCJpc0hhbmRsZWQiLCJjYW52YXMiLCJvblBvaW50ZXJMb2NrQ2hhbmdlIiwiYmluZGVkRXZlbnRzIiwiZXZlbnRCaW5kVG9Ob2RlIiwiaXNUcnVzdGVkIiwibm9kZSIsImdldE5vZGVGcm9tQ3Vyc29yIiwiZGlzcGF0Y2hFdmVudCIsIk1vdXNlRXZlbnQiLCJJRXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImZvY3VzIiwiZWxlbVByZWNlbmRlbnQiLCJvbk1vdXNlTW92ZSIsImlzTG9ja2VkIiwiZXZlbmVtZW50IiwibW92ZW1lbnRYIiwibW92ZW1lbnRZIiwiYXJlYVNpemUiLCJjdXJzb3IiLCJlbEFjdCIsImV2TW91c2VPdmVyIiwiQ3VzdG9tRXZlbnQiLCJldk1vdXNlT3V0IiwiY2hlbWluY3Vyc29ycyIsInNpbXVsZSIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiY29tcG9zZWQiLCJwb2ludGVyRXZlbnQiLCJzZXRQcm9wZXJ0eSIsImTDqWNhbGFnZSIsInR5cGVjdXJzb3IiLCJub3JtYWwiLCJkZWNsZW5jaGVyIiwiY3Vyc29yQWN0dWVsIiwiY3Vyc29yQmxvcXXDqSIsImVzdEFjdGl2YXRpb24iLCJxdWFuZE1vdXZlbWVudCIsImdldENvbnRleHQiLCJjcyIsImTDqWNhbGFnZVB4IiwiZMOpcGxhY2VyIiwiw6l0YXQiLCJwb2ludGV1clBvc2l0aW9uIiwiZmVuZXRyZUVuRMOpcGxhY2VtZW50IiwiaW5kZXhQcmVtaWVyUGxhbiIsIndpbmRvdyIsInNlbGVjdGlvbkRvbUV4dGVybmUiLCJpUmVmIiwic2VsZWN0aW9uT3V2ZXJ0ZSIsImNoYXJ0ZVVpIiwiZ3Jpc0NsYWlyIiwiZGlzcGxheSIsImNob2l4IiwiU3VwcHJpbWVyQ2hvaXgiLCJham91dGVyQ2hvaXgiLCJkb21FbGVtZW50IiwiZ3Jpc0ZvbmNlIiwiY29tcG9zYW50RG9tIiwic2VsZWN0aW9uRG9tSW50ZXJuZSIsIm1pbldpZHRoIiwibXV0YXRpb25TZW5zb3IiLCJ0aXRyZURvbSIsImxhcmdldXJSw6llbGxlVGl0cmUiLCJsYXJnZXVyUsOpZWxsZVNlbGVjdGlvbiIsIm9mZnNldFdpZHRoIiwibGFyZ2V1ck9jY3Vww6kiLCJvdXRpbHNFbmxldmVyUHgiLCJlbEJvdXRvbkV4dGVybmUiLCJlbEJvdXRvbkludGVybmUiLCJib3V0b24iLCJjaGFuZ2VyTGFiZWwiLCJ0ZXh0ZSIsImVubGV2ZXJFZmZldHMiLCJzdHlsZUV4dGVybmUiLCJlbENvY2hlciIsInNldEF0dHJpYnV0ZSIsImVsQ2hvaXgiLCJvcHRpb24iLCJlbGVtZW50Q29udGVuZXVyIiwiZWxJbnRlcmZhY2UiLCJxcyIsInNlbCIsIl9kb25uZWVzIiwic3BlY2lhbGlzYXRpb24iLCJzcGVjaWFsaXNlciIsInBhcmFtIiwiJGRvbm5lZXMiLCJhcmdUYWJsZWF1IiwiZG9ubmVlIiwiYXV0b3Jpc2UiLCJucEF1dG9yaXNlIiwiZWxHYWwiLCJkb25uZWVzT3Jkb25uZWVzIiwib3JnYW5pc2F0ZXVyIiwidmlnbmV0dGUiLCJub21icmVWaWduZXR0ZSIsImxlY3RldXIiLCJpbnRlcmZhY2VzIiwiSUludGVyZmFjZU9iamV0IiwidnVlIiwiaW50ZXJmYWNlSWQiLCJvYmpldEludGVyZmFjZVJlw6d1IiwiX0VSUkVVUiIsImluaXRpYWxpc8OpIiwiZGVmYXV0IiwiJG5vbSIsIm5hdmlnYXRpb24iLCJpbml0aWFsaXNldXIiLCJ2dWVJbnRlcmZhY2UiLCJsaXN0ZUludGVyZmFjZXMiLCJpZEludCIsImVsT25nbGV0IiwiZWxlbWVudE1lbnUiLCJlbGVtZW50TWVudU9uZ2xldCIsImhhc0F0dHJpYnV0ZSIsImV2ZW5lbWVudEFmZmljaGFnZSIsImFqb3V0ZXJPbmdsZXQiLCJlbFRhYiIsInZ1ZUludGVybmUiLCJlbE1lbnUiLCJtZW51IiwieERpc3Bvbm5pYmxlIiwiYmFzZVgiLCJhdmVjTGlhaXNvbiIsImZsZXhHcm93IiwiZmxleEJhc2lzIiwiZWxlbWVudENsaWVudFJlY3QiLCJwb2ludGV1ckVsZW1lbnQiLCJTdXBwcmltZXJPbmdsZXQiLCJyZW1vdmVDaGlsZCIsIm9uZ2xldHMiLCJmYWJyaXF1ZUVsZW1lbnQiLCJmb25kIiwidmVydCIsInJvdWdlIiwiZGVtYXJldXIiLCJjb25mIiwiRmFicmlxdWVZYmFzdGhpcyIsIm5zIiwib25Mb2FkZWQiLCJpbnRlcmZhY2VNw6hyZSIsImV1IiwiZWxOb3V2IiwiZWxHZXN0IiwiZWxDb250IiwiZWxHYWxsIiwiY3NFbEF1Iiwibm91diIsInZ1ZU5vdXZlYXVQcm9qZXQiLCJyZXF1aXJlIiwidnVlQWNjdWV1aWwiLCJ2dWVQcm9qZXRDbGFzc2UiLCJ2YWwiLCJhbnUiLCJhdXRfdHlwZSIsImF1dF9hdXRyZXMiLCJhdXRyZXNfY3AiLCJjc0VsQ29udCIsImVsUHJvamV0IiwiYXV0X2F1dHJlc19jcCIsImRlc2MiLCJkZXNjQ3MiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Es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LFFBQVQsQ0FBa0JDLFNBQTlDO0FBQ0E4RyxPQUFLamYsS0FBTCxDQUFXb1UsZUFBWCxHQUE2QnBXLFNBQVNrYSxRQUFULENBQWtCQyxTQUEvQztBQUNBOEcsT0FBS2pmLEtBQUwsQ0FBV2UsTUFBWCxHQUFzQitjLEdBQUd2RyxHQUFHMEMsR0FBRyxVQUFILENBQUgsRUFBbUJsWixNQUF0QixJQUFnQytjLEdBQUd2RyxHQUFHL1osR0FBSCxFQUFRdUQsTUFBWCxDQUFqQyxHQUF3RCxFQUF6RCxHQUErRCxJQUFuRjtBQUNBO0FBbkxGLENBREE7Ozs7Ozs7Ozs7QUNEQWtGLE9BQU9DLE9BQVAsR0FDQTtBQUNDMUksTUFBTSxjQURQO0FBRUMwUixza0RBRkQ7QUFxRENaLGVBQWUsc0JBQUN1UCxhQUFELEVBQWdCL1EsRUFBaEIsRUFDZjtBQUNDO0FBQ0EsTUFBSW1OLEtBQUssU0FBTEEsRUFBSztBQUFBLFVBQU9uTixHQUFHeUMsYUFBSCxDQUFpQjJLLEdBQWpCLENBQVA7QUFBQSxHQUFUO0FBQ0E7QUFDQSxNQUFJM0MsS0FBSzVYLGdCQUFUO0FBQ0E7QUEzREYsQ0FEQTs7Ozs7Ozs7OztBQ0FBc0csT0FBT0MsT0FBUCxHQUNBO0FBQ0MxSSxNQUFNLFNBRFA7QUFFQzBSLHdEQUZEO0FBTUNaLGVBQWUsc0JBQUN1UCxhQUFELEVBQWdCL1EsRUFBaEIsRUFDZixDQUNDO0FBUkYsQ0FEQSIsImZpbGUiOiJidWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGYyM2JkYWQ4ZmFhMTU0OGUxZDYwIiwiKCgpID0+XHJcbntcclxuXHQndXNlIHN0cmljdCc7XHJcblx0Y29uc3Qgb2J0ZW5pclBhcmVudCA9IGVsZW0gPT5cclxuXHR7XHJcblx0XHRyZXR1cm4gKGVsZW0ucGFyZW50KSA/XHRlbGVtLnBhcmVudFxyXG5cdFx0XHQ6IChlbGVtLmhvc3QpID9cdFx0ZWxlbS5ob3N0XHJcblx0XHRcdDogKGVsZW0ucGFyZW50Tm9kZSkgP1x0ZWxlbS5wYXJlbnROb2RlXHJcblx0XHRcdDogKGVsZW0ub2Zmc2V0UGFyZW50KSA/XHRlbGVtLm9mZnNldFBhcmVudFxyXG5cdFx0XHQ6IGZhbHNlO1xyXG5cdH07XHJcblx0XHRcdFxyXG5cdGNvbnN0IGp1c3F1YVJhY2luZSA9IChlbGVtLCBpKSA9PlxyXG5cdHtcclxuXHRcdGkgPSBpID8gaSsxIDogMDtcclxuXHRcdGNvbnN0IHN1aXRlID0gb2J0ZW5pclBhcmVudChlbGVtKTtcclxuXHRcdHJldHVybiAoIXN1aXRlKSA/IFtpLCBlbGVtXSA6IGp1c3F1YVJhY2luZShzdWl0ZSwgaSk7XHJcblx0fTtcclxuXHRjb25zdCB0cm91dmVySWRQcm9jaGUgPSAoZWxlbSwgaSkgPT5cclxuXHR7XHJcblx0XHRpID0gaSA/IGkrMSA6IDA7XHJcblx0XHR2YXIgc3VpdGU7XHJcblx0XHRjb25zdCByZXN1bHRhdCA9IHt9O1xyXG5cdFx0XHJcblx0XHRpZihlbGVtLmdldEF0dHJpYnV0ZSkgcmVzdWx0YXQuaWQgPSBlbGVtLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuXHRcdGlmKCFyZXN1bHRhdC5pZClcclxuXHRcdHtcclxuXHRcdFx0c3VpdGUgPSBvYnRlbmlyUGFyZW50KGVsZW0pO1xyXG5cdFx0XHRpZighc3VpdGUpIHRocm93IG5ldyBFcnJvcjtcclxuXHRcdH1cclxuXHRcdGVsc2UgcmVzdWx0YXQuZGlzdCA9IGk7XHJcblx0XHRyZXR1cm4gKHJlc3VsdGF0LmlkKSA/IHJlc3VsdGF0IDogdHJvdXZlcklkUHJvY2hlKHN1aXRlLCBpKTtcclxuXHR9O1xyXG5cclxuXHRjb25zdCBvYnRlbmlyTm9tVGFnID0gKGVsZW0sIHJlY3VyLCByKSA9PlxyXG5cdHtcclxuXHRcdHIgPSByID8gciA6IFtdO1xyXG5cdFx0ci5wdXNoKChlbGVtLmhvc3QpID8gJ3NoYWRvd1Jvb3QnIDogZWxlbS50YWdOYW1lKTtcclxuXHRcdHJlY3VyLS07XHJcblx0XHRyZXR1cm4gKCFyZWN1ciA+IDApID8gciA6IG9idGVuaXJOb21UYWcob2J0ZW5pclBhcmVudChlbGVtKSwgcmVjdXIsIHIpO1xyXG5cdH07XHJcblxyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5vYnRlbmlySWQgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc3QgaWQgPSB7fTtcclxuXHRcdHZhciBpZFByb2NoZTtcclxuXHRcdC8vXHROT1RFUyBPYnRlbnRpb24gbGUgbCdpZCBsZSBwbHVzIHByb2NoZSBhaW5zaSBxdWUgbGUgbmIgZGUgbm9ldWQgcGFyY291cnUuXHJcblx0XHR0cnlcclxuXHRcdHtcdGlkUHJvY2hlID0gdHJvdXZlcklkUHJvY2hlKHRoaXMsIDApO1x0fVxyXG5cdFx0Ly9cdE5PVEVTIElsIGVzdCBwb3NzaWJsZSBxdSdhdWN1biBJRCBuZSBzb2l0IHLDqWN1cMOpcsOpIFxyXG5cdFx0Ly9cdE5PVEVTIERhbnMgY2UgY2FzIHLDqWN1cMOpcmF0aW9uIGRlcyA1IHByZW1pZXJzIHRhZy5cclxuXHRcdC8vXHROT1RFUyBMYSBkaXN0YW5jZSBzZXJhIHZhbHXDqSDDoCBsYSBzb21tZSBkZXMgdGFpbGxlcyBkZXMgbm9tcyBkZXMgbm9ldWRzLlxyXG5cdFx0Y2F0Y2goZSlcclxuXHRcdHtcclxuXHRcdFx0bGV0IG5vbXNUYWcgPSBvYnRlbmlyTm9tVGFnKHRoaXMsIDUpLFxyXG5cdFx0XHRcdG5vbXMgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBub20gb2Ygbm9tc1RhZylcclxuXHRcdFx0XHRub21zLnB1c2gobm9tIHx8ICd1bmRlZicpO1xyXG5cdFx0XHRpZFByb2NoZSA9IHsgaWQgOiBub21zLmpvaW4oJycpLCAgZGlzdCA6IG5vbXMubGVuZ3RofTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWQuaWQgPSBpZFByb2NoZS5pZDtcclxuXHRcdGlkLmRpc3QgPSBpZFByb2NoZS5kaXN0O1xyXG5cdFx0aWQubm9ldWQgPSAodGhpcy5ob3N0KSA/ICdzaGFkb3dSb290JyA6IHRoaXMudGFnTmFtZTtcclxuXHRcdFx0XHRcclxuXHRcdHJldHVybiBbaWQuaWQsIGlkLmRpc3QsIGlkLm5vZXVkXS5qb2luKCcnKTtcclxuXHR9O1xyXG5cdC8qKlxyXG5cdFx0KHF1YW5kVmVycm91aWxsYWdlLCBxdWFuZETDqXbDqXJvdWlsbGFnZSkgPT4gdm9pZFxyXG5cdFx0U3DDqWNpZmllIGxlIHZlcnJvdWlsbGFnZSBkJ3VuIMOpbMOpbWVudC5cclxuXHRcdElsIG4neSBwZXV0IHkgYXZvaXIgZGV1eCB2ZXJvdXMgZW4gbcOqbWUgdGVtcHMgc2kgaWxzIG5lIGZvbnQgcGFzIHBhcnRpcyBkZSBsYSBtw6ptZSBicmFuY2hlIGRvbS4oaS5lIGRldXggw6lsw6ltZW50IG4nYXlhbnQgcGFzIGRlIGxpZW4gZGUgcGFyZW50w6kpXHJcblx0XHRAcXVhbmRWZXJyb3VpbGxhZ2UoZWxlbWVudCwgZXZlbmVtZW50Q2xpcXVlKSA9PiBhcHBlbMOpIGxvcnNxdWUgdW4gw6lsw6ltZW50IGVzdCB2w6lycm91aWxsw6koaWwgYSDDqXTDqSBjbGlxdcOpKVxyXG5cdFx0QHF1YW5kRMOpdsOpcm91aWxsYWdlKGVsZW1lbnQsIGV2ZW5lbWVudENsaXF1ZSkgYXBwZWzDqSBsb3JzcXVlIHVuIMOpbMOpbWVudCBlc3QgZMOpdsOpcm91aWxsw6kgXHJcblx0KiovXHJcblx0dmFyIHliYXN0aGlzZG9tID0gbnVsbDtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUudmVycm91aWxsZXIgPSBmdW5jdGlvbihxdWFuZFZlcnJvdWlsbGFnZSwgcXVhbmREw6l2w6lyb3VpbGxhZ2UpXHJcblx0e1xyXG5cdFx0aWYoIXliYXN0aGlzZG9tKSB5YmFzdGhpc2RvbSA9IHliYXN0aGlzLmRvbS5kZXNrdG9wO1xyXG5cdFx0bGV0IHZlcnJvdWlsbGVyID0gZmFsc2U7XHJcblx0XHRcclxuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKHR5cGVvZiBlLmRldGFpbHMgIT09ICdvYmplY3QnKSBlLmRldGFpbHMgPSB7fTtcclxuXHRcdFx0ZS5kZXRhaWxzLnZlcnJvdWlsbGFnZSA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdFx0XHRpZih2ZXJyb3VpbGxlcikgcmV0dXJuO1xyXG5cdFx0XHR2ZXJyb3VpbGxlciA9IHRydWU7XHJcblx0XHRcdHF1YW5kVmVycm91aWxsYWdlKHRoaXMsIGUpO1xyXG5cdFx0XHRcclxuXHRcdFx0Y29uc3Qgw6ljb3V0ZXVyID0gKGVlKSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IGTDqXZlcnJvdWlsbGFnZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlZS5kZXRhaWxzICE9PSAnb2JqZWN0JykgZMOpdmVycm91aWxsYWdlID0gdHJ1ZTtcclxuXHRcdFx0XHRlbHNlIGlmKCFlZS5kZXRhaWxzLnZlcnJvdWlsbGFnZSkgZMOpdmVycm91aWxsYWdlID0gdHJ1ZTtcclxuXHRcdFx0XHRlbHNlIGlmKGVlLmRldGFpbHMudmVycm91aWxsYWdlICE9PSB0aGlzKSBkw6l2ZXJyb3VpbGxhZ2UgPSB0cnVlOyBcclxuXHRcdFx0XHJcblx0XHRcdFx0aWYoZMOpdmVycm91aWxsYWdlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZlcnJvdWlsbGVyID0gZmFsc2U7XHJcblx0XHRcdFx0XHR5YmFzdGhpc2RvbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIMOpY291dGV1ciwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0cXVhbmREw6l2w6lyb3VpbGxhZ2UodGhpcywgZWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0XHJcblx0XHRcdHliYXN0aGlzZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgw6ljb3V0ZXVyLCBmYWxzZSk7XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHRcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYXBwbGlxdWVyQm9yZHVyZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHRjb25zdCBpbmZvcyA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRjb25zdCBlbEZyb21QdCA9ICh4LCB5KSA9PiBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xyXG5cdFx0Y29uc3QgY29sbGlzaW9ucyA9XHJcblx0XHR7XHJcblx0XHRcdGhhdXQgOiBmYWxzZSxcclxuXHRcdFx0ZHJvaXRlIDogZmFsc2UsXHJcblx0XHRcdGJhcyA6IGZhbHNlLFxyXG5cdFx0XHRnYXVjaGUgOiBmYWxzZVxyXG5cdFx0fTtcclxuXHRcdGNvbnN0IGNvbGxpc2lvbkJvcmR1cmUgPSAoY8O0dMOpLCBlbGVtZW50VGVzdENvbGxpc2lvbikgPT5cclxuXHRcdHtcclxuXHRcdFx0Y29uc3QgZWxTdHlsZUNhbGN1bMOpID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50VGVzdENvbGxpc2lvbik7XHJcblx0XHRcdGlmKGPDtHTDqSA9PT0gJ2hhdXQnKSBpZihlbFN0eWxlQ2FsY3Vsw6kuYm9yZGVyVG9wV2lkdGgpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRlbHNlIGlmKGPDtHTDqSA9PT0gJ2Ryb2l0ZScpIGlmKGVsU3R5bGVDYWxjdWzDqS5ib3JkZXJSaWdodFdpZHRoKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0ZWxzZSBpZihjw7R0w6kgPT09ICdiYXMnKSBpZihlbFN0eWxlQ2FsY3Vsw6kuYm9yZGVyQm90dG9tV2lkdGgpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRlbHNlIGlmKGPDtHTDqSA9PT0gJ2dhdWNoZScpIGlmKGVsU3R5bGVDYWxjdWzDqS5ib3JkZXJMZWZ0V2lkdGgpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgYmxhY2snO1xyXG5cdFx0Ly8gUmVjaGVyY2hlIGRlIGNvbGxpc2lvblxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgYWNjID0gMDtcclxuXHRcdFx0Ly8gSGF1dCwgYmFzXHJcblx0XHRcdHtcclxuXHRcdFx0XHRsZXQgaGF1dFkgPSBpbmZvcy50b3AgLSAxO1xyXG5cdFx0XHRcdGxldCBiYXNZID0gaW5mb3MuYm90dG9tICsxO1xyXG5cdFx0XHRcdGxldCBtYXggPSAgaW5mb3MueCArIGluZm9zLndpZHRoO1xyXG5cdFx0XHRcdGZvcihsZXQgcG9zaXRpb25YID0gaW5mb3MueDsgcG9zaXRpb25YIDwgbWF4OyBwb3NpdGlvblgrKylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZighY29sbGlzaW9ucy5oYXV0KSBjb2xsaXNpb25zLmhhdXQgPSBjb2xsaXNpb25Cb3JkdXJlKCdoYXV0JywgZWxGcm9tUHQocG9zaXRpb25YLCBoYXV0WSksIGFjYysrKTtcclxuXHRcdFx0XHRcdGlmKCFjb2xsaXNpb25zLmJhcykgY29sbGlzaW9ucy5iYXMgPSBjb2xsaXNpb25Cb3JkdXJlKCdiYXMnLCBlbEZyb21QdChwb3NpdGlvblgsIGJhc1kpLCBhY2MrKyk7XHJcblx0XHRcdFx0XHRpZihhY2MgPiAxKSBicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gR2F1Y2hlLCBkcm9pdGVcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCBnYXVjaGVYID0gaW5mb3MubGVmdCAtIDE7XHJcblx0XHRcdFx0bGV0IERyb2l0ZVggPSBpbmZvcy5yaWdodCArMTtcclxuXHRcdFx0XHRsZXQgbWF4ID0gIGluZm9zLlkgKyBpbmZvcy5oZWlnaHQ7XHJcblx0XHRcdFx0Zm9yKGxldCBwb3NpdGlvblkgPSBpbmZvcy55OyBwb3NpdGlvblkgPCBtYXg7IHBvc2l0aW9uWSsrKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmKCFjb2xsaXNpb25zLmdhdWNoZSkgY29sbGlzaW9ucy5nYXVjaGUgPSBjb2xsaXNpb25Cb3JkdXJlKCdnYXVjaGUnLCBlbEZyb21QdChnYXVjaGVYLCBwb3NpdGlvblkpLCBhY2MrKyk7XHJcblx0XHRcdFx0XHRpZighY29sbGlzaW9ucy5kcm9pdGUpIGNvbGxpc2lvbnMuZHJvaXRlID0gY29sbGlzaW9uQm9yZHVyZSgnZHJvaXRlJywgZWxGcm9tUHQoRHJvaXRlWCwgcG9zaXRpb25ZKSwgYWNjKyspO1xyXG5cdFx0XHRcdFx0aWYoYWNjID4gMykgYnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKCdjb2xsaXNpb246ICcsIGNvbGxpc2lvbnMpO1xyXG5cdFx0Ly8gQWRhcHRhdGlvblxyXG5cdFx0aWYoY29sbGlzaW9ucy5oYXV0KVxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmxvZygndmVydFBvbW1lJyk7XHJcblx0XHRcdC8vdGhpcy5zdHlsZS50b3AgPSAoaW5mb3MudG9wIC0gMSkgKyAncHgnO1xyXG5cdFx0fVxyXG5cdFx0aWYoY29sbGlzaW9ucy5kcm9pdGUpIHRoaXMuc3R5bGUud2lkdGggPSAoaW5mb3Mud2lkdGggKyAxKSArICdweCc7XHJcblx0XHRpZihjb2xsaXNpb25zLmJhcykgdGhpcy5zdHlsZS5oZWlnaHQgPSAoaW5mb3MuaGVpZ2h0ICsgMSkgKyAncHgnO1xyXG5cdFx0aWYoY29sbGlzaW9ucy5nYXVjaGUpIHRoaXMuc3R5bGUubGVmdCA9IChpbmZvcy5sZWZ0IC0gMSkgKyAncHgnO1xyXG5cdFx0XHJcblx0fTtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucsOpb3JnYW5pc2VyID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMub2Zmc2V0SGVpZ2h0KTtcclxuXHR9O1xyXG5cdC8qKlxyXG5cdGNhbGN1bGVyVGFpbGxlUsOpZWxlKHtoZWlnaHQgOiAnMTAwJSd9LCB7aGVpZ2h0IDogJzRlbSd9LCB7d2lkdGggOiAnMC41ZW0nfSwgLi4uKVxyXG5cdEBAYXJndW1lbnRzXHJcblx0eyBub21BdHRyaWJ1dENzcyA6ICd0YWlsbGVWb3VsdWUnfVxyXG5cdEBAUmV0b3VyXHJcblx0W3tcclxuXHRcdGNhbGN1bFx0JWNoYWluZSAjYXR0cmlidXQgOiB0YWlsbGVWb3VsdWVcclxuXHRcdHJlc3VsdGF0XHQlZW50aWVyICNsZSByw6lzdWx0YXQgZHUgY2FsY3VsXHJcblx0fSwgLi5dXHJcblx0KiovXHJcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNhbGN1bGVyVGFpbGxlUsOpZWxlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGNvbnN0IHN0eWxlSW5pdGlhbGUgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMpO1xyXG5cdFx0Y29uc3QgcmVzdWx0YXRzID0gW107XHJcblx0XHRmb3IobGV0IGFyZyBvZiBhcmd1bWVudHMpXHJcblx0XHR7XHJcblx0XHRcdGxldCBhdHRyaWJ1dCA9IE9iamVjdC5rZXlzKGFyZyk7XHJcblx0XHRcdHRoaXMuc3R5bGVbYXR0cmlidXRdID0gYXJnW2F0dHJpYnV0XTtcclxuXHRcdFx0dGhpcy5yw6lvcmdhbmlzZXIoKTtcclxuXHRcdFx0LypcclxuXHRcdFx0XHRSw6ljdXDDqXJhdGlvbiBkdSByw6lzdWx0YXQgYXZlYyBnZXRDb21wdXRlZFN0eWxlXHJcblx0XHRcdFx0UHVpcyB0cmFuc2Zvcm1hdGlvbiBlbiB0YWJsZWF1IGFmaW4gZGUgcG91dm9pciBvcMOpcmVyIGZhY2lsZW1lbnQgc3VyIGxlcyBjYXJhY3TDqHJlcy5cclxuXHRcdFx0XHRCdXQ6IHJldG91bmVyIHVuIG5vbWJyZSBhdSBsaWV1IGRlIHJldG91cm5lciBsYSB0YWlsbGUgc3VpdmllIGRlIGwndW5pdMOpIGVuIHBpeGVsLlxyXG5cdFx0XHRcdFN1cHByZXNzaW9uIGRlcyBkZXV4IGRlcm5pZXJlcyBjYXNlcyBkdSB0YWJsZWF1LCByZXNwZWN0aXZlbWVudCAncCcgc3VpdmkgZGUgJ3gnXHJcblx0XHRcdFx0UmV0cmFuc2Zvcm1hdGlvbiBkdSB0YWJsZWF1IGVuIGNoYcOubmUgcHVpcyBhcHBsaWNhdGlvbiBkdSByw6lzdWx0YXQgw6AgTnVtYmVyXHJcblx0XHRcdCovXHJcblx0XHRcdGxldCByZXN1bHRhdCA9IGdldENvbXB1dGVkU3R5bGUodGhpcylbYXR0cmlidXRdLnNwbGl0KCcnKTtcclxuXHRcdFx0cmVzdWx0YXQucG9wKCk7XHJcblx0XHRcdHJlc3VsdGF0LnBvcCgpO1xyXG5cdFx0XHRyZXN1bHRhdCA9IE51bWJlcihyZXN1bHRhdC5qb2luKCcnKSApO1xyXG5cdFx0XHQvKlxyXG5cdFx0XHRcdEFqb3V0IGR1IHLDqXN1bHRhdCBkYW5zIGxhIGxpc3RlciBkZXMgcsOpc3VsdGF0c1xyXG5cdFx0XHQqL1xyXG5cdFx0XHRyZXN1bHRhdHMucHVzaCh7IGNhbGN1bCA6IGF0dHJpYnV0ICsgJzonICsgYXJnW2F0dHJpYnV0XSwgcmVzdWx0YXR9KTtcclxuXHRcdFx0LypcclxuXHRcdFx0XHRSZW1pc2UgZW4gcGxhY2UgZHUgc3R5bGUgaW5pdGlhbC5cclxuXHRcdFx0Ki9cclxuXHRcdFx0dGhpcy5zdHlsZVthdHRyaWJ1dF0gPSBzdHlsZUluaXRpYWxlW2F0dHJpYnV0XTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHRhdHM7XHJcblx0fTtcclxuXHRcclxuXHQvLyBlb2QgPT4gZW5kIG9mIGRhdGFcclxuXHRjb25zdCBlcnJSZW1vbnRlckVPRCA9IHtlb2QgOiB0cnVlfTtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucmVtb250ZXIgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0bGV0IHBhcmVudCA9XHQodGhpcy5wYXJlbnROb2RlKT8gdGhpcy5wYXJlbnROb2RlOlxyXG5cdFx0XHRcdFx0XHRcdCh0aGlzLnBhcmVudEVsZW1lbnQpPyB0aGlzLnBhcmVudEVsZW1lbnQ6XHJcblx0XHRcdFx0XHRcdFx0KHRoaXMuaG9zdCk/IHRoaXMuaG9zdCA6IHVuZGVmaW5lZDtcclxuXHRcdGlmKHBhcmVudCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgZXJyID0gbmV3IEVycm9yO1xyXG5cdFx0XHRlcnIuZGV0YWlscyA9IHt9O1xyXG5cdFx0XHRpZih0aGlzID09PSBkb2N1bWVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGVyci5tZXNzYWdlID0gJ2VvZCc7XHJcblx0XHRcdFx0ZXJyLmRldGFpbHMuZW9kID0gdHJ1ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGVyci5tZXNzYWdlID0nUGFyZW50IGluY29ubnUnO1xyXG5cdFx0XHRcclxuXHRcdFx0ZXJyLmRldGFpbHMub2JqZXQgPSB0aGlzO1xyXG5cdFx0XHR0aHJvdyBlcnI7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9O1xyXG5cdGxldCBmZiA9IChlangpID0+XHJcblx0e1xyXG5cdFx0Y29uc29sZS5sb2coJ2VqeDogJywgZWp4KTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5lc3REYW5zRG9jdW1lbnQgPSBmYWxzZTtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2J0ZW5pclN0eWxlQXV0ZXVyID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGxldCBzdHlsZUF1dGV1ciA9ICh0aGlzLnN0eWxlU2hlZXRzKT8gdGhpcy5zdHlsZVNoZWV0cyA6IGZhbHNlO1xyXG5cdFx0aWYoIXN0eWxlQXV0ZXVyKSBcclxuXHRcdHtcclxuXHRcdFx0bGV0IHBhcmVudCA9XHQodGhpcy5wYXJlbnROb2RlKT8gdGhpcy5wYXJlbnROb2RlOlxyXG5cdFx0XHRcdFx0XHRcdFx0KHRoaXMucGFyZW50RWxlbWVudCk/IHRoaXMucGFyZW50RWxlbWVudDogZmFsc2U7XHJcblx0XHRcdGlmKHBhcmVudC5ob3N0KSBzdHlsZUF1dGV1ciA9IHBhcmVudC5zdHlsZVNoZWV0cztcclxuXHRcdFx0ZWxzZSBpZihwYXJlbnQpIHN0eWxlQXV0ZXVyID0gcGFyZW50Lm9idGVuaXJTdHlsZUF1dGV1cigpO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZih0aGlzLmhvc3QpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYodGhpcy5ob3N0LnN0eWxlU2hlZXRzKSBzdHlsZUF1dGV1ciA9IHRoaXMuaG9zdC5zdHlsZVNoZWV0cztcclxuXHRcdFx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdBdWN1bmUgZmV1aWxsZSBkZSBzdHlsZSB0cm91dsOpZS4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSAgdGhyb3cgbmV3IEVycm9yKCdJbXBvc3NpYmxlIGRlIHJlbW9udGVyIGRhbnMgbGEgaGllcmFyY2hpZSBkb20uJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHlsZUF1dGV1cjtcclxuXHR9O1xyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5vYnRlbmlyU3R5bGVBdXRldXJFbGVtZW50ID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGxldCBzdHlsZUF1dGV1ciA9IG51bGw7XHJcblx0XHR0cnlcclxuXHRcdHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ1N0YXQ6ICcsIGRvY3VtZW50LnJlYWR5U3RhdGUpO1xyXG5cdFx0XHRzdHlsZUF1dGV1ciA9IHRoaXMub2J0ZW5pclN0eWxlQXV0ZXVyKCk7XHJcblx0XHR9XHJcblx0XHRjYXRjaChlKVxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmxvZygnRXJSOiAnLCBkb2N1bWVudC5yZWFkeVN0YXRlLCB0aGlzLCBlKTtcclxuXHRcdFx0dGhyb3cgJ2trJztcclxuXHRcdH1cclxuXHRcdGNvbnN0IHLDqGdsZXNFbGVtZW50ID0gW107XHJcblx0XHRmb3JcclxuXHRcdChcclxuXHRcdFx0bGV0IGlGZXVpbGxlID0gMCwgbkZldWlsbGVzU3R5bGVzID0gc3R5bGVBdXRldXIubGVuZ3RoO1xyXG5cdFx0XHRpRmV1aWxsZSA8IG5GZXVpbGxlc1N0eWxlcztcclxuXHRcdFx0aUZldWlsbGUrK1xyXG5cdFx0KVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgZmV1aWxsZUFjdHVlbGxlID0gc3R5bGVBdXRldXJbaUZldWlsbGVdLmNzc1J1bGVzO1xyXG5cdFx0XHRmb3JcclxuXHRcdFx0KFxyXG5cdFx0XHRcdGxldCBpUsOoZ2xlQ3NzID0gMCwgblLDqGdsZXNDc3MgPSBmZXVpbGxlQWN0dWVsbGUubGVuZ3RoO1xyXG5cdFx0XHRcdGlSw6hnbGVDc3MgPCBuUsOoZ2xlc0NzcztcclxuXHRcdFx0XHRpUsOoZ2xlQ3NzKytcclxuXHRcdFx0KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHRsZXQgcsOoZ2xlQ3NzQWN0dWVsbGUgPSBmZXVpbGxlQWN0dWVsbGVbaVLDqGdsZUNzc107XHJcblx0XHRcdFx0aWYodGhpcy5tYXRjaGVzKHLDqGdsZUNzc0FjdHVlbGxlLnNlbGVjdG9yVGV4dCkgKSByw6hnbGVzRWxlbWVudC5wdXNoKHLDqGdsZUNzc0FjdHVlbGxlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHLDqGdsZXNFbGVtZW50O1x0XHJcblx0fTtcclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucGFyY291cmlyQmFzID0gU2hhZG93Um9vdC5wcm90b3R5cGUucGFyY291cmlyQmFzID0gZnVuY3Rpb24oZm9uY3Rpb25UcmFpdHJlbWVudClcclxuXHR7XHJcblx0XHRjb25zdCB0cmFpdGVyRW5mYW50ID0gKGVuZmFudCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Zm9uY3Rpb25UcmFpdHJlbWVudChlbmZhbnQpO1xyXG5cdFx0XHRlbmZhbnQucGFyY291cmlyQmFzKGZvbmN0aW9uVHJhaXRyZW1lbnQpO1xyXG5cdFx0fTtcclxuXHRcdGZvcihsZXQgZW5mYW50IG9mIHRoaXMuY2hpbGRyZW4pIHRyYWl0ZXJFbmZhbnQoZW5mYW50KTtcclxuXHRcdGlmKHRoaXMuc2hhZG93Um9vdCkgdGhpcy5zaGFkb3dSb290LnBhcmNvdXJpckJhcyhmb25jdGlvblRyYWl0cmVtZW50KTtcclxuXHR9O1xyXG5cclxuXHRcdFx0XHJcblx0e1xyXG5cdFx0bGV0IEhUTUxDb2xTeW1iSXRlciA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xyXG5cdFx0SFRNTENvbGxlY3Rpb24ucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSAoSFRNTENvbFN5bWJJdGVyKSA/IEhUTUxDb2xTeW1iSXRlciA6IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0bGV0IGkgPSAwLFxyXG5cdFx0XHRcdCBpTWF4ID0gdGhpcy5sZW5ndGgsXHJcblx0XHRcdFx0IHNvaXNcdD0gdGhpcztcclxuXHRcdFx0cmV0dXJue1xyXG5cdFx0XHRcdG5leHQoKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybntcclxuXHRcdFx0XHRcdFx0ZG9uZSA6IChpKysgPCBpTWF4IC0gMSkgPyBmYWxzZSA6IHRydWUsXHJcblx0XHRcdFx0XHRcdHZhbHVlIDogc29pc1tpXVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH1cclxuXHR7XHJcblx0XHRsZXQgTXV0YXRpb25SZWNvcmRTeW1iSXRlciA9IE11dGF0aW9uUmVjb3JkLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xyXG5cdFx0TXV0YXRpb25SZWNvcmQucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSAoTXV0YXRpb25SZWNvcmRTeW1iSXRlcikgPyBNdXRhdGlvblJlY29yZFN5bWJJdGVyIDogZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHRsZXQgaSA9IDAsXHJcblx0XHRcdFx0IGlNYXggPSB0aGlzLmxlbmd0aCxcclxuXHRcdFx0XHQgc29pc1x0PSB0aGlzO1xyXG5cdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0bmV4dCgpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJue1xyXG5cdFx0XHRcdFx0XHRkb25lIDogKGkrKyA8IGlNYXggLSAxKSA/IGZhbHNlIDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0dmFsdWUgOiBzb2lzW2ldXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblx0fVxyXG5cdHtcclxuXHRcdGxldCBOb2RlTGlzdFN5bWJJdGVyID0gTm9kZUxpc3QucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl07XHJcblx0XHROb2RlTGlzdC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IChOb2RlTGlzdFN5bWJJdGVyKSA/IE5vZGVMaXN0U3ltYkl0ZXIgOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGxldCBpID0gMCxcclxuXHRcdFx0XHQgaU1heCA9IHRoaXMubGVuZ3RoLFxyXG5cdFx0XHRcdCBzb2lzXHQ9IHRoaXM7XHJcblx0XHRcdHJldHVybntcclxuXHRcdFx0XHRuZXh0KClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0XHRcdGRvbmUgOiAoaSsrIDwgaU1heCAgLSAxKSA/IGZhbHNlIDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0dmFsdWUgOiBzb2lzW2ldXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5yZXF1ZXN0UG9pbnRlckxvY2sgPSBIVE1MRWxlbWVudC5wcm90b3R5cGUucmVxdWVzdFBvaW50ZXJMb2NrIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZS5tb3pSZXF1ZXN0UG9pbnRlckxvY2sgfHwgSFRNTEVsZW1lbnQucHJvdG90eXBlLndlYmtpdFJlcXVlc3RQb2ludGVyTG9jaztcclxuXHR0cnlcclxuXHR7XHJcblx0XHRkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPSBkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgfHwgZG9jdW1lbnQubW96UG9pbnRlckxvY2tFbGVtZW50IHx8IGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudDtcclxuXHR9XHJcblx0Y2F0Y2goZSlcclxuXHR7XHJcblx0XHQ7O1xyXG5cdH1cclxuXHRcclxuXHRFcnJvci5wcm90b3R5cGUubGllciA9IGZ1bmN0aW9uKGVycmV1ckxpw6llKVxyXG5cdHtcclxuXHRcdGlmKHRoaXMuZGV0YWlscyAmJiB0aGlzLmRldGFpbHMuX2xpYWlzb24pIHRocm93IG5ldyBFcnJvcignRXJyb3IucHJvdG90eXBlLmxpZXI6IEVycmV1ciBkw6lqw6AgbGnDqWUnKTtcclxuXHRcdHRoaXMuZGV0YWlscyA9IHRoaXMuZGV0YWlscyB8fCB7fTtcclxuXHRcdHRoaXMuZGV0YWlscy5fbGlhaXNvbiA9IGVycmV1ckxpw6llLmRldGFpbHMgfHwge307XHJcblx0XHR0aGlzLmRldGFpbHMuX2xpYWlzb24uX21lc3NhZ2UgPSBlcnJldXJMacOpZS5tZXNzYWdlO1xyXG5cdFx0aWYoZXJyZXVyTGnDqWUuZGV0YWlscylcclxuXHRcdHtcclxuXHRcdFx0bGV0IHByb3BVdGlsaXPDqWVzID0gT2JqZWN0LmtleXMoZXJyZXVyTGnDqWUuZGV0YWlscyk7XHJcblx0XHRcdGZvcihsZXQgcHJvcCBvZiBwcm9wVXRpbGlzw6llcykgdGhpcy5kZXRhaWxzLl9saWFpc29uW3Byb3BdID0gZXJyZXVyTGnDqWUuZGV0YWlsc1twcm9wXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblx0RXJyb3IucHJvdG90eXBlLmZvcm1lbGxlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGlmKCF0aGlzLmVzdERlZmF1dCkgdGhyb3cgbmV3IEVycm9yKCdFcnJvci5wcm90b3R5cGUuZm9ybWVsbGU6IEVycmV1ciBkw6lqw6AgYXNzaWduw6knKS5mb3JtZWxsZSgpO1xyXG5cdFx0dGhpcy5lc3RGb3JtZWxsZSA9IHRydWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cdEVycm9yLnByb3RvdHlwZS5yZXRvdXIgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0aWYoIXRoaXMuZXN0RGVmYXV0KSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yLnByb3RvdHlwZS5mb3JtZWxsZTogRXJyZXVyIGTDqWrDoCBhc3NpZ27DqScpLmZvcm1lbGxlKCk7XHJcblx0XHR0aGlzLmVzdFJldG91ciA9IHRydWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cdEVycm9yLnByb3RvdHlwZS5lc3RGb3JtZWxsZSA9IGZhbHNlO1xyXG5cdEVycm9yLnByb3RvdHlwZS5lc3RSZXRvdXIgPSBmYWxzZTtcclxuXHRFcnJvci5wcm90b3R5cGUuZXN0RGVmYXV0ID0gdHJ1ZTtcclxufSkoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzAvc3VyY291Y2hlTmF0aWZzLmpzIiwiLyoqXHJcblx0X2NvbnRyYXRfKCBAZG9ubsOpZSwgQGNvbnRyYXQpID0+IHVuZGVmaW5lZCB8fCBFcnJvclxyXG5cdEZvbmN0aW9uIHByaXbDqSBkw6lmaW5pc3NhbnQgdW4gY29udHJhdCBzdXIgdW5lIGRvbm7DqWUoaS5lLiBpZGVudGlmaWNhdGV1cnMgY29uc3RhbnRzIG91IHZhcmlhYmxlcylcclxuXHRVbiBjb250cmF0IGVzdCB1biBwcsOpZGljYXQgcmV0b3VybmFudCB1bmUgcHJvcG9zaXRpb24uXHJcblx0TGUgcHLDqWRpY2F0IHV0aWxpc2UgdW5lIGFzc2VydGlvbiBwb3VyIGNhbGN1bGVyIGxhIHByb3Bvc2l0aW9uLlxyXG5cdEwnYXNzZXJ0aW9uIGVzdCBkw6l0ZXJtaW7DqWUgZW4gZm9uY3Rpb24gZHUgdHlwZSBkdSBjb250cmF0KHZvaXIgZG9jIEBjb250cmF0KS5cclxuXHRMYSBwcm9wb3NpdGlvbiBlc3Qgc29pdCB2cmFpZSBzb2l0IHVuZSBFcnJvciBwb3VyIGluZGlxdWVyIGZhdXguXHJcblx0QGRvbm7DqWVcclxuXHRcdFR5cGU6XHR0b3VzXHJcblx0QGNvbnRyYXRcclxuXHRcdFR5cGU6XHQnc3RyaW5nJyB8fCBBcnJheSB8fCBPYmplY3RcclxuXHRcdFx0Q2FzOlx0XHRBc3NlcnRpb246XHRcdFx0XHROb21cclxuXHRcdFx0J3N0cmluZydcdHR5cGVvZlx0XHRcdFx0XHREb25uw6llIGRlIG3Dqm1lIHR5cGVcclxuXHRcdFx0QXJyYXlcdFx0Y29udHJhdCB8fCAuLi5cdFx0XHRSZWN1cnNpb24gc3VyIGNoYXF1ZSDDqWzDqW1lbnQuIEF1IG1vaW5zIHVuZSBwcm9wb3NpdGlvbiBkb2l0IMOqdHJlIHZyYWllLlxyXG5cdFx0XHRPYmplY3RcdFx0aW5zdGFuY2VvZlx0XHRcdFx0QGRvbm7DqWUgaW5zdGFuY2UgZGUgQGNvbnRyYXRcclxuXHQqKi9cclxuY29uc3QgZm5Db250cmF0ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJhbXMpXHJcbntcclxuXHRpZihwYXJhbXMuZG9pdClcclxuXHR7XHJcblx0XHRsZXQgW2Rvbm7DqWUsIGNvbnRyYXRdID0gcGFyYW1zLmRvaXQ7XHJcblx0XHRjb25zdCBnZW5lcmVyRXJyZXVyID0gKGFzc2VydGlvbikgPT5cclxuXHRcdHtcclxuXHRcdFx0bGV0IHBpbGVPdUZhY2UgPSBuZXcgRXJyb3I7XHJcblx0XHRcdHBpbGVPdUZhY2UuZGV0YWlscyA9IHt9O1xyXG5cdFx0XHRwaWxlT3VGYWNlLm1lc3NhZ2UgPSAnTGEgcHJvcG9zaXRpb24gZHUgY29udHJhdCBlc3QgZmF1c3NlJztcclxuXHRcdFx0cGlsZU91RmFjZS5kZXRhaWxzLmF0dGVuZHUgPSBjb250cmF0O1xyXG5cdFx0XHRwaWxlT3VGYWNlLmRldGFpbHMucmXDp3UgPSBkb25uw6llO1xyXG5cdFx0XHRwaWxlT3VGYWNlLmRldGFpbHMuYXNzZXJ0aW9uID0gYXNzZXJ0aW9uO1xyXG5cdFx0XHRyZXR1cm4gcGlsZU91RmFjZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0bGV0IHByb3Bvc2l0aW9uID0gZmFsc2U7XHJcblx0XHRpZih0eXBlb2YgY29udHJhdCA9PT0gJ3N0cmluZycpXHJcblx0XHR7XHJcblx0XHRcdGlmKHR5cGVvZiBkb25uw6llID09PSBjb250cmF0KSBwcm9wb3NpdGlvbiA9IHRydWU7XHJcblx0XHRcdGVsc2UgdGhyb3cgZ2VuZXJlckVycmV1cigndHlwZScpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihjb250cmF0IGluc3RhbmNlb2YgQXJyYXkpXHJcblx0XHR7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IobGV0IHZhbGV1ckFkbWlzZSBvZiBjb250cmF0KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Zm5Db250cmF0KHtkb2l0IDogW2Rvbm7DqWUsIHZhbGV1ckFkbWlzZV0gfSApO1xyXG5cdFx0XHRcdFx0cHJvcG9zaXRpb24gPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGUpezs7fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFwcm9wb3NpdGlvbikgdGhyb3cgZ2VuZXJlckVycmV1cignaW50ZXJ2YWxlJyk7XHJcblx0XHR9XHJcblx0XHQvLyBPYmplY3RcclxuXHRcdGVsc2UgaWYoKHR5cGVvZiBjb250cmF0ID09PSAnb2JqZWN0JykgfHwgKGNvbnRyYXQgaW5zdGFuY2VvZiBPYmplY3QpIClcclxuXHRcdHtcclxuXHRcdFx0aWYoZG9ubsOpZSBpbnN0YW5jZW9mIGNvbnRyYXQpIHByb3Bvc2l0aW9uID0gdHJ1ZTtcclxuXHRcdFx0ZWxzZSB0aHJvdyBnZW5lcmVyRXJyZXVyKCdpbnN0YW5jZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYocHJvcG9zaXRpb24gPT09IHRydWUpIHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRpZihwYXJhbXMubmVkb2l0KVxyXG5cdHtcclxuXHRcdHRocm93ICdOb24gSW1wbMOpbWVudMOpISc7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCdjb250cmF0JyAsIHBhcmFtcyk7XHJcblx0dGhyb3cgbmV3IEVycm9yKCdDb250cmF0ICBhdmVjIHBhcmFtw6h0cmVzIGludmFsaWRlIG91IHNhbnMgcGFyYW3DqHRyZXMnKTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzEvY29udHJhdC5qcyIsIid1c2Ugc3RyaWN0JztcclxuZXhwb3J0IGRlZmF1bHQgbmV3IGZ1bmN0aW9uKClcclxue1xyXG5cdGNvbnN0XHRsaXN0ZW5lcnMgPSB7fTtcclxuXHRjb25zdCBvYnNlcnZlckNhbGxiYWNrID0gKG11dGF0aW9ucywgb2JzZXJ2ZXIpID0+XHJcblx0e1xyXG5cdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXHJcblx0XHRcdGxpc3RlbmVyc1ttdXRhdGlvbi50YXJnZXRdKG11dGF0aW9uKTtcclxuXHR9O1xyXG5cdGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIob2JzZXJ2ZXJDYWxsYmFjayk7XHJcblx0dGhpcy5uZXcgPSAodGFyZ2V0LCBtdXRhdGlvbk9ic2VydmVySW5pdCwgY2FsbGJhY2spID0+XHJcblx0e1xyXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG11dGF0aW9uT2JzZXJ2ZXJJbml0KTtcclxuXHRcdGxpc3RlbmVyc1t0YXJnZXRdID0gY2FsbGJhY2s7XHJcblx0fTtcclxuXHRcdFxyXG5cdHRoaXMubmV3QXNBdHRyaWJ1dGVzID0gKHRhcmdldCwgYXR0ckxpc3QsIGNhbGxiYWNrKSA9PlxyXG5cdHtcclxuXHRcdHRoaXMubmV3KHRhcmdldCwge2F0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZXNGaWx0ZXI6IGF0dHJMaXN0fSwgY2FsbGJhY2spO1xyXG5cdH07XHJcblxyXG5cdHRoaXMubmV3QXNBdHRyaWJ1dGVFeHBlY3RlZCA9ICh0YXJnZXQsIGF0dHIsIGNhbGxiYWNrKSA9PlxyXG5cdHtcclxuXHRcdHRoaXMubmV3KHRhcmdldCwge2F0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZXNGaWx0ZXI6IGF0dHIubmFtZX0sIG11dGF0aW9uID0+XHJcblx0XHR7XHJcblx0XHRcdGlmICh0YXJnZXRbYXR0ci5uYW1lXSA9PSBhdHRyLmV4cGVjdGVkKVxyXG5cdFx0XHRcdGNhbGxiYWNrKG11dGF0aW9uKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHRoaXMubmV3QXNTdHlsZUV4cGVjdGVkID0gKHRhcmdldCwgc3R5bGUsIGNhbGxiYWNrKSA9PlxyXG5cdHtcclxuXHRcdHRoaXMubmV3KHRhcmdldCwge2F0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZXNGaWx0ZXI6ICdzdHlsZSd9LCBtdXRhdGlvbiA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IG11dGF0aW9uLnRhcmdldC5zdHlsZVtzdHlsZS5uYW1lXTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3N0eWxlPm5hbWU6ICcsIHN0eWxlLm5hbWUsICcgdmFsdWU6ICcsIHZhbHVlLCAnIGV4cGVjdGVkOiAnLCBzdHlsZS5leHBlY3RlZCk7XHJcblx0XHRcdGlmICgoc3R5bGUuaXNFcXVhbCAmJiAodmFsdWUgPT09IHN0eWxlLmV4cGVjdGVkKSkgfHxcclxuXHRcdFx0XHRcdCghc3R5bGUuaXNFcXVhbCAmJiAodmFsdWUgIT09IHN0eWxlLmV4cGVjdGVkKSkpXHJcblx0XHRcdFx0Y2FsbGJhY2sobXV0YXRpb24pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzEvc29uZGVNdXRhdGlvbi5qcyIsImV4cG9ydCBkZWZhdWx0IG5ldyBmdW5jdGlvbigpXHJcbntcclxuXHR2YXIgdHlwZXNEb25uZWVzID0gdGhpcztcclxuXHR0aGlzLlJlZmVyZW5jZSA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHR2YXIgcmVmTWF4ID0gMDtcclxuXHRcdGNvbnN0IHJlZkxpYnJlID0gW107XHJcblx0XHR0aGlzLm9idGVuaXIgPSAoKSA9PiAocmVmTGlicmUubGVuZ3RoID09PSAwKSA/IHJlZk1heCsrIDogcmVmTGlicmUuc2hpZnQoKTtcclxuXHRcdHRoaXMubGliZXJlciA9IHJlZiA9PiB2b2lkKHJlZkxpYnJlLnB1c2gocmVmKSkgfHwgcmVmO1xyXG5cdFx0dGhpcy5saWJyZSA9ICgpID0+IHJlZkxpYnJlO1xyXG5cdFx0dGhpcy50YWlsbGUgPSB0eXBlID0+XHJcblx0XHR7XHJcblx0XHRcdFx0dmFyIHIgPVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG1heDogcmVmTWF4LFxyXG5cdFx0XHRcdFx0b2NjdXBlOiByZWZNYXggLSByZWZMaWJyZS5sZW5ndGgsXHJcblx0XHRcdFx0XHRsaWJyZTogcmVmTGlicmUubGVuZ3RoXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRyZXR1cm4gKHR5cGUgPT09ICdtYXgnKT8gci5tYXggOiAodHlwZSA9PT0gJ29jY3VwZScpPyByLm9jY3VwZSA6ICh0eXBlID09PSAnbGlicmUnKT8gci5saWJyZSA6IHI7XHJcblx0XHR9O1xyXG5cdH07XHJcblx0XHJcblx0Y29uc3QgSXRlcmF0ZXVySW50ZXJuZUxpc3RlID0gZnVuY3Rpb24ocmVmcywgcmVwcmVzZW50YXRpb24pXHJcblx0e1xyXG5cdFx0Y29uc3QgcmVmTGlicmUgPSByZWZzLmxpYnJlKCksXHJcblx0XHRcdCAgdGFpbGxlID0gcmVmcy50YWlsbGUoJ21heCcpO1xyXG5cdFx0dmFyIGlBY3R1ZWwgPSAwO1xyXG5cdFx0XHRcclxuXHRcdHRoaXMuc3VpdmFudCA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdC8vU2kgbCdlbXBsYWNlbWVudCBuJ2VzdCBwYXMgdXRpbGlzZSBpbCBmYXV0IGVuIHRyb3V2ZXIgdW4gYXV0cmVcclxuXHRcdFx0Zm9yKHZhciBsaWJyZSBvZiByZWZMaWJyZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGxpYnJlICE9PSBpQWN0dWVsKSBicmVhaztcclxuXHRcdFx0XHRpQWN0dWVsKys7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHIgPVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZG9uZTogZmFsc2UsXHJcblx0XHRcdFx0dmFsdWU6ICB7IHZhbGV1ciA6cmVwcmVzZW50YXRpb25baUFjdHVlbF0sIGNsZSA6IGlBY3R1ZWwgfVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZihpQWN0dWVsKysgPT09IHRhaWxsZSkgci5kb25lID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9O1xyXG5cdH07XHJcblx0Y29uc3QgbGlzdGVfZWxWZXJzUmVmID0gKGxpc3RlSXRlcmF0ZXVyLCBlbGVtZW50KSA9PlxyXG5cdHtcclxuXHRcdHZhciByID0gbnVsbDtcclxuXHRcdHdoaWxlKHZvaWQociA9IGxpc3RlSXRlcmF0ZXVyLnN1aXZhbnQoKSkgfHwgIXIuZG9uZSkgaWYoci52YWx1ZS52YWxldXIgPT09IGVsZW1lbnQpIHJldHVybiByLnZhbHVlLmNsZTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cdC8qKlxyXG5cdFx0MC4wLjBcclxuXHRcdDIvMTIvMjAxNTpcclxuXHRcdFx0NkgxMFxyXG5cdFx0XHRcdDHDqHJlIHZlcnNpb25cclxuXHQqKi9cclxuXHR0aGlzLkxpc3RlID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdGNvbnN0IHJlcHJlc2VudGF0aW9uID0gW10sXHJcblx0XHRcdCAgcmVmcyA9IG5ldyB0eXBlc0Rvbm5lZXMuUmVmZXJlbmNlO1xyXG5cdFx0dmFyIHRhaWxsZSA9IDA7XHJcblx0XHRcclxuXHRcdHRoaXMuYWpvdXRlciA9IGVsZW1lbnQgPT5cclxuXHRcdHtcclxuXHRcdFx0cmVwcmVzZW50YXRpb25bcmVmcy5vYnRlbmlyKCldID0gZWxlbWVudDtcclxuXHRcdFx0dGFpbGxlKys7XHJcblx0XHRcdHJldHVybiBlbGVtZW50O1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuc3VwcHJpbWVyID0gZWxlbWVudCA9PlxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgcmVmID0gbnVsbDtcclxuXHRcdFx0dHJ5XHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZWYgPSBsaXN0ZV9lbFZlcnNSZWYobmV3IEl0ZXJhdGV1ckludGVybmVMaXN0ZShyZWZzLCByZXByZXNlbnRhdGlvbiksIGVsZW1lbnQpO1xyXG5cdFx0XHRcdGlmKHJlZiAhPT0gMCAmJiAhcmVmKSB0aHJvdyBuZXcgRXJyb3IoJycpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoKGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlLnN1cHByaW1lcjpAZWxlbWVudCBub24gcHJlc2VudCBkYW5zIGxhIGxpc3RlOlx0JyArIGVsZW1lbnQpO1x0XHJcblx0XHRcdH1cclxuXHRcdFx0cmVwcmVzZW50YXRpb25bcmVmcy5saWJlcmVyKHJlZildID0gbnVsbDtcclxuXHRcdFx0dGFpbGxlLS07XHJcblx0XHR9O1xyXG5cdFx0LyoqXHJcblx0XHRcdDAuMC4wXHJcblx0XHRcdCoqL1xyXG5cdFx0dGhpcy50YWlsbGUgPSAoKSA9PiB0YWlsbGU7XHJcblx0XHRcdC8qKlxyXG5cdFx0XHRcdDAuMC4wXHJcblx0XHRcdCoqL1xyXG5cdFx0dGhpcy5jb250aWVudCA9IGVsZW1lbnQgPT4gKGxpc3RlX2VsVmVyc1JlZihuZXcgSXRlcmF0ZXVySW50ZXJuZUxpc3RlKHJlZnMsIHJlcHJlc2VudGF0aW9uKSwgZWxlbWVudCkgJiYgdHJ1ZSk7XHJcblx0XHRcdC8qKlxyXG5cdFx0XHRcdDAuMC4wXHJcblx0XHRcdCoqL1xyXG5cdFx0dGhpcy5jb2VyY2lzaW9uID1cclxuXHRcdHtcclxuXHRcdFx0dmVyc1RhYmxlYXUgOiAoKSA9PiByZXByZXNlbnRhdGlvblxyXG5cdFx0fTtcclxuXHRcdFx0LyoqXHJcblx0XHRcdFx0MC4wLjJcclxuXHRcdFx0XHRcdDIvMTIvMjAxNTpcclxuXHRcdFx0XHRcdDZIMTBcclxuXHRcdFx0XHRcdFx0LURlcGxhY2VtZW50IGRlIHJlZiBsaWJyZSBkYW5zIGwnaXRlcmF0ZXVyIGF1IGxpZXUgZGUgbCdpdGVyYXRpb25cclxuXHRcdFx0XHRcdDUvMTI6XHJcblx0XHRcdFx0XHRcdC10aGlzIHZlcnMgcHJpdsOpLlxyXG5cdFx0XHRcdFx0XHQtMC4wLjIoKVxyXG5cdFx0XHQqKi9cclxuXHRcdFx0XHJcblx0XHR0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IGl0ZXJhdGV1ciA9IG5ldyBJdGVyYXRldXJJbnRlcm5lTGlzdGUocmVmcywgcmVwcmVzZW50YXRpb24pO1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG5leHQ6IGZ1bmN0aW9uKClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YXIgciA9IGl0ZXJhdGV1ci5zdWl2YW50KCk7XHJcblx0XHRcdFx0XHRyLnZhbHVlID0gci52YWx1ZS52YWxldXI7XHJcblx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH07XHJcblx0XHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgcmVwcmVzZW50YXRpb24gPSB7fSxcclxuXHRcdFx0ICBsaWJyZSA9IFtdO1xyXG5cdFx0dmFyIHRhaWxsZSA9IDAsXHJcblx0XHRcdGlNYXggPSAwO1xyXG5cdFx0XHRcclxuXHRcdHRoaXMuTGlzdGVVUjIgPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IGVtcGxhY2VtZW50cyA9IFtdO1xyXG5cdFx0XHR0aGlzLm9wZXJhdGlvbiA9ICh0eXBlLCBlbGVtZW50KSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gYWpvdXRcclxuXHRcdFx0XHRpZih0eXBlID09PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciBpZCA9IChsaWJyZS5sZW5ndGggPT09IDApPyBpTWF4KysgOiBsaWJyZS5zaGlmdCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZvaWRcclxuXHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0ZW1wbGFjZW1lbnRzLnB1c2goaWQpLFxyXG5cdFx0XHRcdFx0XHRyZXByZXNlbnRhdGlvbltpZF0gPSBlbGVtZW50LFxyXG5cdFx0XHRcdFx0XHR0YWlsbGUrK1xyXG5cdFx0XHRcdFx0KSB8fCBlbGVtZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyB0YWlsbGVcclxuXHRcdFx0XHRlbHNlIGlmKHR5cGUgPCAwKSByZXR1cm4gZW1wbGFjZW1lbnRzLmxlbmd0aDtcclxuXHRcdFx0XHQvLyBzdXBwcmVzc2lvblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSBudWxsLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50UHJlc2VudCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMCwgbkVsZW1lbnRzID0gZW1wbGFjZW1lbnRzLmxlbmd0aDsgaSA8IG5FbGVtZW50czsgaSsrKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZCA9IGVtcGxhY2VtZW50c1tpXTtcclxuXHRcdFx0XHRcdFx0aWYocmVwcmVzZW50YXRpb25baWRdID09PSBlbGVtZW50KVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0ZW1wbGFjZW1lbnRzWzBdID0gZW1wbGFjZW1lbnRzW2ldO1xyXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRQcmVzZW50ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoIWVsZW1lbnRQcmVzZW50KSB0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlVVIub3BlcmF0aW9uQHR5cGUgPiAwOiB0ZW50YXRpdmUgZGUgc3VwcHJlc3Npb24gZFxcJ3VuIMOpbMOpbWVudCBub24gcHLDqXNlbnQsIEBlbGVtZW50OiAnICsgZWxlbWVudCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdm9pZFxyXG5cdFx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0XHRkZWxldGUgcmVwcmVzZW50YXRpb25baWRdLFxyXG5cdFx0XHRcdFx0XHRsaWJyZS5wdXNoKGlkKSxcclxuXHRcdFx0XHRcdFx0ZW1wbGFjZW1lbnRzLnNoaWZ0KCksXHJcblx0XHRcdFx0XHRcdHRhaWxsZS0tXHJcblx0XHRcdFx0XHQpIHx8IGVsZW1lbnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5wb3VyRGUgPSBmbiA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Zm9yKHZhciBpZCBvZiBlbXBsYWNlbWVudHMpIGZuKHJlcHJlc2VudGF0aW9uW2lkXSApO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdH0pKCk7XHJcblx0XHJcblx0dGhpcy5MaXN0ZVVSMyA9IGZ1bmN0aW9uKClcclxuXHR7XHJcblx0XHR0aGlzWzBiMDBdPXswYjAwOltdLDBiMDE6bnVsbCwwYjEwOjAsMGIxMTpudWxsfTtcclxuXHRcdHRoaXNbMGIwMV09ZT0+dGhpc1swYjAwXVswYjAwMF0ucHVzaChlKTtcclxuXHRcdHRoaXNbMGIxMF09KCk9PnRoaXNbMGIwMF1bMGIwMDBdLmxlbmd0aDtcclxuXHRcdHRoaXNbMGIxMV09ZSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR2b2lkKHRoaXNbMGIwMF1bMGIxMF09MCx0aGlzWzBiMDBdWzBiMDFdPW51bGwsdGhpc1swYjAwXVswYjExXT10aGlzWzBiMDBdWzBiMDAwXS5sZW5ndGgpO1xyXG5cdFx0XHR3aGlsZSh0aGlzWzBiMDBdWzBiMTBdPHRoaXNbMGIwMF1bMGIxMV0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZih0aGlzWzBiMDBdWzBiMDAwXVt0aGlzWzBiMDBdWzBiMTBdXT09PWUpe3RoaXNbMGIwMF1bMGIwMV09dGhpc1swYjAwXVswYjEwXTticmVhazt9O1xyXG5cdFx0XHRcdHRoaXNbMGIwMF1bMGIxMF0rKztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0aGlzWzBiMDBdWzBiMDFdPT09bnVsbCl0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlVVJAZWxlbWVudCBub24gcHLDqXNlbnQgZGFucyBsYSBsaXN0ZScpO1xyXG5cdFx0XHR0aGlzWzBiMDBdWzBiMDAwXVt0aGlzWzBiMDBdWzBiMDFdXT10aGlzWzBiMDBdWzBiMDAwXVswXTtcclxuXHRcdFx0dGhpc1swYjAwXVswYjAwMF0uc2hpZnQoKTtcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0dGhpcy5EaWN0aW9ubmFpcmUgPSBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0Y29uc3QgcmVwcmVzZW50YXRpb24gPSB7fSxcclxuXHRcdFx0ICBpbmRleCA9IG5ldyB0eXBlc0Rvbm5lZXMuTGlzdGU7XHJcblx0XHRcclxuXHRcdHRoaXMudGFpbGxlID0gKCkgPT4gaW5kZXgudGFpbGxlKCk7XHJcblx0XHR0aGlzLmFqb3V0ZXIgPSAoY2xlLCB2YWxldXIpID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKHJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5ham91dGVyQGNsZSBkZWrDoCBkZWZpbmk6XHQnK2NsZSk7XHJcblx0XHRcdHJldHVybiB2b2lkKHJlcHJlc2VudGF0aW9uW2luZGV4LmFqb3V0ZXIoY2xlKV0gPSB2YWxldXIpIHx8ICBjbGU7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5tb2RpZmllciA9IChjbGUsIHZhbGV1cikgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoIXJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5tb2RpZmllckBjbGUgbm9uIHByZXNlbnRlIGRhbnMgbGUgZGljdGlvbm5haXJlOlx0JysgY2xlKTtcclxuXHRcdFx0cmV0dXJuIHZvaWQocmVwcmVzZW50YXRpb25bY2xlXSA9IHZhbGV1cikgfHwgdmFsZXVyO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuc3VwcHJpbWVyID0gY2xlID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKCFyZXByZXNlbnRhdGlvbltjbGVdKSB0aHJvdyBuZXcgRXJyb3IoJ3R5cGVzRG9ubmVlcy5EaWN0aW9ubmFpcmUuc3VwcHJpbWVyQGNsZSBub24gcHJlc2VudGUgZGFucyBsZSBkaWN0aW9ubmFpcmU6XHQnK2NsZSk7XHJcblx0XHRcdHJldHVybiB2b2lkKGRlbGV0ZSByZXByZXNlbnRhdGlvbltjbGVdICYmIGluZGV4LnN1cHByaW1lcihjbGUpXHQpIHx8IGNsZTtcclxuXHRcdH07XHJcblx0XHR0aGlzLm9idGVuaXIgPSBjbGUgPT5cclxuXHRcdHtcclxuXHRcdFx0aWYoIXJlcHJlc2VudGF0aW9uW2NsZV0pIHRocm93IG5ldyBFcnJvcigndHlwZXNEb25uZWVzLkRpY3Rpb25uYWlyZS5vYnRlbmlyQGNsZSBub24gcHJlc2VudGUgZGFucyBsZSBkaWN0aW9ubmFpcmU6XHQnK2NsZSk7XHJcblx0XHRcdHJldHVybiByZXByZXNlbnRhdGlvbltjbGVdO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuY29udGllbnQgPSBjbGUgPT4gKHJlcHJlc2VudGF0aW9uW2NsZV0pPyB0cnVlIDogZmFsc2U7XHJcblx0XHR0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0X2lBY3QgOiAwLFxyXG5cdFx0XHRcdF90YWIgOiBpbmRleC5jb2VyY2lzaW9uLnZlcnNUYWJsZWF1KCksXHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciByID0ge2RvbmU6IGZhbHNlLCB2YWx1ZTogcmVwcmVzZW50YXRpb25bdGhpcy5fdGFiW3RoaXMuX2lBY3RdXHRdXHR9O1xyXG5cdFx0XHRcdFx0aWYodGhpcy5faUFjdCsrID09IHRoaXMuX3RhYi5sZW5ndGgpIHIuZG9uZSA9IHRydWU7XHJcblx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdHZhciBhYSA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuSW50ZXJmYWNlKFsndHlwZScsICdub20nLCAnaWQnXSk7XHJcblx0XHR2YXIgYiA9IHt0eXBlIDogJ2fDqXJvZW0nLCBub20gOidqZWFuTHVjJywgaWQ6IDV9XHJcblx0XHRhYS52YWxpZGVyKGIpXHJcblx0XHRcclxuXHRcdFBlcm1ldCBkZSBkw6lmaW5pciBsYSBzaWduYXR1cmUgZCd1biBvYmpldC5cclxuXHRcdEBzaWduYXR1cmVcdFxyXG5cdFx0XHRPYmpldDpcclxuXHRcdFx0XHRsJ2ludGVyZmFjZSBkZXZyYSBhdm9pciBsYSBtw6ptZSBzaWduYXR1cmUgcXVlIGNlbGxlIGRlIGwnb2JqZXRcclxuXHRcdFx0VGFibGVhdTpcclxuXHRcdFx0XHR0YWlsbGUgPT09IDEgRVQgdHlwZW9mIHZhbGV1ciA9PT0gT2JqZWN0XHJcblx0XHRcdFx0XHRjbMOpXHRcdExlIG5vbSBkZSBsYSBwcm9wcmnDqXTDqVxyXG5cdFx0XHRcdFx0dmFsZXVyXHRMZSBjb250cmF0IHZvaXIoX2NvbnRyYXRfKTpcclxuXHRcdFx0XHRcdFx0U3RyaW5nXHQ9PiBjb250cmF0IHR5cGVvZlxyXG5cdFx0XHRcdFx0XHRPYmplY3RcdD0+IGNvbnRyYXRcdGluc3RhbmNlb2ZcclxuXHRcdFx0XHRcdFx0QXJyYXlcdD0+IGNvbnRyYXQgYXZlYyBwbHVzaWV1cnMgc2lnbmF0dXJlXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGFibGVhdSA9PiBpbnRlcmZhY2UgZG9udCBsYSBzaWduYXR1cmUgcmVwcsOpc2VudGUgbGVzIHZhbGV1cnMgZHUgdGFibGVhdVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFpbmUgPT4gbGUgbm9tIGRlIGxhIHByb3ByacOpdMOpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFtub21Qcm9wLCB0eXBlXVxyXG5cdCoqL1xyXG5cdHRoaXMuSW50ZXJmYWNlVHlww6llID0gZnVuY3Rpb24oc2lnbmF0dXJlKVxyXG5cdHtcclxuXHRcdHRoaXMudmFsaWRlciA9IChvYmpldCkgPT5cclxuXHRcdHtcclxuXHRcdFx0dHJ5e1x0eWJhc3RoaXMuY29udHJhdCh7ZG9pdCA6IFtvYmpldCwgJ29iamVjdCddIH0gKTtcdH1cclxuXHRcdFx0Y2F0Y2goZSl7XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlckBvYmpldCBuXFwnZXN0IHBhcyBkZSB0eXBlIE9iamVjdCEnKS5mb3JtZWxsZSgpO1x0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHNpZ25hdHVyZVRlc3TDqSA9IE9iamVjdC5rZXlzKG9iamV0KTtcclxuXHRcdFx0LyoqXHJcblx0XHRcdFx0QG9wdGlvbnNcdE9iamVjdFxyXG5cdFx0XHQqKi9cclxuXHRcdFx0Ly8gdHlwZSA9IGRvaXQsIG5lZG9pdCwuLi5cclxuXHRcdFx0Zm9yKGxldCB0eXBlIG9mIE9iamVjdC5rZXlzKHNpZ25hdHVyZSkgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYodHlwZSAhPT0gJ2RvaXQnICYmIHR5cGUgIT09ICduZWRvaXQnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnRlcmZhY2VUeXDDqWUudmFsaWRlckBvYmpldCBuXFwnZXN0IHBhcyB1biBjb250cmF0IHZhbGlkZSEnKS5mb3JtZWxsZSgpO1xyXG5cdFx0XHRcdGZvcihsZXQgbm9tUHJvcCBvZiBPYmplY3Qua2V5cyhzaWduYXR1cmVbdHlwZV0gKSApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYoIXNpZ25hdHVyZVRlc3TDqS5pbmNsdWRlcyhub21Qcm9wKSApIHRocm93IG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIGFic2VudGU6ICcgKyBub21Qcm9wKTtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0bGV0XHRwcm9wcmnDqXTDqVRlc3TDqWUgPSBvYmpldFtub21Qcm9wXSxcclxuXHRcdFx0XHRcdFx0XHRcdHNpZ25hdHVyZVRlc3TDqWUgPSBzaWduYXR1cmVbdHlwZV1bbm9tUHJvcF07XHJcblx0XHRcdFx0XHRcdHRyeXtcdHliYXN0aGlzLmNvbnRyYXQoe1t0eXBlXSA6IFtwcm9wcmnDqXTDqVRlc3TDqWUsIHNpZ25hdHVyZVRlc3TDqWVdIH0gKTsgfVxyXG5cdFx0XHRcdFx0XHRjYXRjaChwcm9wKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aWYocHJvcC5kZXRhaWxzLmFzc2VydGlvbiA9PT0gJ3R5cGUnKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIHR5cGUgZGlmZsOpcmVudDogJyArIG5vbVByb3ApICkubGllcihwcm9wKTtcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKHByb3AuZGV0YWlscy5hc3NlcnRpb24gPT09ICdpbnRlcnZhbGUnKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIG5vbiBjb21wcmlzZSBkYW5zIGxcXCdpbnRlcnZhbGU6ICcgKyBub21Qcm9wKSApLmxpZXIocHJvcCk7XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZihwcm9wLmRldGFpbHMuYXNzZXJ0aW9uID09PSAnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW50ZXJmYWNlVHlww6llLnZhbGlkZXI6IFByb3ByacOpdMOpIGNsYXNzZSBkaWZmw6lyZW50OiAnICsgbm9tUHJvcCkgKS5saWVyKHByb3ApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH07XHJcblx0fTtcclxuXHR0aGlzLkludGVyZmFjZU5vblR5cMOpZSA9IGZ1bmN0aW9uKHNpZ25hdHVyZSl7fTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzIvdHlwZXNEb25uZWVzLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKClcclxue1xyXG5cdGNvbnN0IFNPSVMgPSB0aGlzO1xyXG5cdHRoaXMuY29tcHJpcyA9IG51bGw7XHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3RcclxuXHRcdFx0Y29tcHJpc0ludGVydmFsZSA9IChpbnRlcnZhbGUwLCBpbnRlcnZhbGUxKSA9PlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHJlc3VsdGF0ID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yKHZhciBlbnRpZXIwIG9mIGludGVydmFsZTApXHJcblx0XHRcdFx0XHRmb3IodmFyIGVudGllcjEgb2YgaW50ZXJ2YWxlMSlcclxuXHRcdFx0XHRcdFx0aWYoZW50aWVyMCA9PT0gZW50aWVyMSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdGF0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiByZXN1bHRhdDtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y29tcHJpc0ludGVydmFsZUVudGllciA9IChpbnRlcnZhbGUsIGVudGllcjEpID0+XHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgcmVzdWx0YXQgPSBmYWxzZTtcclxuXHRcdFx0XHRmb3IodmFyIGVudGllcjAgb2YgaW50ZXJ2YWxlKVxyXG5cdFx0XHRcdFx0aWYoZW50aWVyMCA9PT0gZW50aWVyMSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0YXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0YXQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNvbXByaXNFbnRpZXIgPSAob3BlcmFuZGUwLCBvcGVyYW5kZTEpID0+IChvcGVyYW5kZTAgPT09IG9wZXJhbmRlMSkgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFxyXG5cdFx0dGhpcy5jb21wcmlzID0gKG9wZXJhbmRlMCwgb3BlcmFuZGUxKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgcmVzdWx0YXQgPSBudWxsO1xyXG5cdFx0XHRpZihvcGVyYW5kZTAgaW5zdGFuY2VvZiBBcnJheSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKG9wZXJhbmRlMSBpbnN0YW5jZW9mIEFycmF5KSByZXN1bHRhdCA9IGNvbXByaXNJbnRlcnZhbGUob3BlcmFuZGUwLCBvcGVyYW5kZTEpO1xyXG5cdFx0XHRcdGVsc2UgcmVzdWx0YXQgPSBjb21wcmlzSW50ZXJ2YWxlRW50aWVyKG9wZXJhbmRlMCwgb3BlcmFuZGUxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKG9wZXJhbmRlMSBpbnN0YW5jZW9mIEFycmF5KSByZXN1bHRhdCA9IGNvbXByaXNJbnRlcnZhbGVFbnRpZXIob3BlcmFuZGUxLCBvcGVyYW5kZTApO1xyXG5cdFx0XHRlbHNlIHJlc3VsdGF0ID0gY29tcHJpc0VudGllcihvcGVyYW5kZTAsIG9wZXJhbmRlMSk7XHJcblx0XHRcdHJldHVybiByZXN1bHRhdDtcclxuXHRcdH07XHJcblx0XHRcclxuXHR9KSgpO1xyXG5cdHRoaXMuY2hhw65uZXIgPSB2YWxldXIgPT4gKHR5cGVvZiB2YWxldXIgPT09ICdvYmplY3QnKSA/IEpTT04uc3RyaW5naWZ5KHZhbGV1cikgOiB2YWxldXI7XHJcblx0XHJcblx0dGhpcy5XSEVOID0gKCgpID0+XHJcblx0e1xyXG5cdFx0bGV0IGxpc3RlbmVycyA9XHRbXTtcclxuXHRcdGxldCBpbnRlcnZhbCA9XHRudWxsO1xyXG5cdFx0Y29uc3Qgd29ya2VyID1cdCgpID0+XHJcblx0XHR7XHJcblx0XHRcdGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGxpc3RlbmVyLmNvbmRpdGlvbigpID09PSBmYWxzZSlcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdGxpc3RlbmVyLmNhbGxiYWNrKCk7XHJcblx0XHRcdFx0bGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcihlbCA9PiBlbCAhPT0gbGlzdGVuZXIpO1xyXG5cdFx0XHRcdGlmIChsaXN0ZW5lcnMubGVuZ3RoID09IDApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcblx0XHRcdFx0XHRpbnRlcnZhbCA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIChjb25kaXRpb24sIGNhbGxiYWNrKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRsaXN0ZW5lcnMucHVzaCh7Y29uZGl0aW9uLCBjYWxsYmFja30pO1xyXG5cdFx0XHRpZiAoaW50ZXJ2YWwgPT09IG51bGwpXHJcblx0XHRcdFx0aW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh3b3JrZXIsIDIwKTtcclxuXHRcdH07XHJcblx0fSkoKTtcclxuXHR0aGlzLmdyYW5kZXVycyA9XHJcblx0e1xyXG5cdFx0ZW5sZXZlclVuaXTDqSA6IGdyYW5kZXVyID0+XHJcblx0XHR7XHJcblx0XHRcdGdyYW5kZXVyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZ3JhbmRldXIpXHJcblx0XHRcdFx0XHRcdFx0XHQucmV2ZXJzZSgpO1xyXG5cdFx0XHR3aGlsZSAoZ3JhbmRldXIubGVuZ3RoICE9IDApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoIWlzTmFOKE51bWJlcihncmFuZGV1clswXSkpKVxyXG5cdFx0XHRcdFx0YnJlYWsgO1xyXG5cdFx0XHRcdGdyYW5kZXVyLnNoaWZ0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Z3JhbmRldXIucmV2ZXJzZSgpO1xyXG5cdFx0XHRyZXR1cm4gKHBhcnNlRmxvYXQoZ3JhbmRldXIuam9pbignJykpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdFxyXG5cdCgoKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0IHVuaXTDqXMgPSBbJ3B4JywgJ2VtJywgJ2NtJywgJ20nLCAnS2cnLCAnZycsICdIeicsICdqJywgJ2snLCAndicsICdBJ107XHJcblx0XHR0aGlzLmdyYW5kZXVycy5ham91dGVyVW5pdMOpID0gKGNoYWluZSwgdW5pdMOpKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZighIHVuaXTDqXMuaW5jbHVkZXModW5pdMOpKSApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0B1bml0w6kgaW52YWxpZGU6ICcgKyBTT0lTLmNoYcOubmVyKHVuaXTDqSkgKTtcclxuXHRcdFx0cmV0dXJuIGNoYWluZSArIHVuaXTDqTtcclxuXHRcdH07XHJcblx0fSApKCk7XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS8yL3V0aWxpdGFpcmVzLmpzIiwiLyoqXHJcblxyXG5cdFVuZSBmYWJyaXF1ZSBlc3QgdW5lIGZvbmN0aW9uXHJcblx0Rm9uY3Rpb25uYWxpdMOpZXM6XHJcblx0XHRJXHQtQWpvdXRlciB1biDDqWzDqW1lbnQgcGVyc29ubmFsaXPDqXNcclxuXHRcdElJXHQtb2J0ZW5pciBsZXMgw6lsw6ltZW50cyBwZXJzb25uYWxpc8Opc1xyXG5cdFx0SUlJXHQtb2J0ZW5pciBsZXMgZmFicmlxdWVzXHJcblx0XHRJVlx0LWdlc3Rpb24gZGVzIGVzcGFjZSBkZSBub21zXHJcblx0ZmFicmlxdWVcdEZ1bmN0aW9uXHJcblx0XHRSZXRvdXJuZSB1bmUgRmFicmlxdWVcclxuXHRcdEBlc3BhY2VEZU5vbVx0U3RyaW5nXHJcblx0XHQ9PiBGYWJyaXF1ZVxyXG5cdEZhYnJpcXVlIEZ1bmN0aW9uIFxyXG5cdFx0Q2xhc3NlIHBvdXIgY3LDqWVyIGRlcyBjb21wb3NhbnRzIHBlcnNvbm5hbGlzw6lzIEhUTUxcclxuXHRcdEBwYXJhbcOodHJlc1x0T2JqZWN0XHJcblx0XHRcdEBub21cdFx0XHRTdHJpbmdcclxuXHRcdFx0QGNvbnN0cnVjdGV1clx0RnVuY3Rpb25cclxuXHRcdFx0QHRlbXBsYXRlXHRcdHVuZGVmaW5lZCB8fCBTdHJpbmdcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0QG1vZGVsZVx0XHRcdEhUTUxFbGVtZW50XHJcblx0XHRAY29uc3RydWN0ZXVyXHRcdEZ1bmN0aW9uKCBAQGNvbXBvc2FudEludGVyZmFjZSwgQEB2dWVJbnRlcmZhY2UpID0+IHZvaWQgfHwgRnVuY3Rpb24oIEBAdnVlSW50ZXJmYWNlKTpcclxuXHRcdFx0QXBwbGlxdcOpIGxvcnMgZHUgcHJlbWllciB2aXNpb25uYWdlIGQndW5lIHZ1ZVxyXG5cdFx0XHRTaSByZXRvdXJuZSB1bmUgZm9uY3Rpb24sIGVsbGUgc2VyYSBhcHBlbMOpZSDDoCBjaGFxdWUgdmlzaW9ubmFnZVxyXG5cdFx0XHRcclxuXHRBdHRlbnRpb24sIG5lIHBhcyBjb25mb25kcmUgaW50ZXJmYWNlIGFwcGxpY2F0aXZlIG91IGwnaW50ZXJmYWNlIGQndW4gb2JqZXQgYXZlYyB1biBjb21wb3NhbnQgaW50ZXJmYWNlXHJcblx0XHJcblx0QGFqb3V0ZXIoQEB2dWUpXHJcblx0QGFmZmljaGVyKEBAbm9tVnVlKVxyXG5cdFxyXG5cdFx0Tk9NLS0tLS0tLS0tLS0tLS0tXHRGYWJyaXF1ZVxyXG5cdFx0VFlQRS0tLS0tLS0tLS0tLS0tLVx0Rm9uY3Rpb24gKEBwYXJhbcOodHJlcykgPT4gRm9uY3Rpb25cclxuXHRcdEJVVC0tLS0tLS0tLS0tLS0tLS1cdENyw6lhdGlvbiwgZ2VzdGlvbiwgbWFpbnRlbmFuY2VzIGQnw6lsw6ltZW50cyBwZXJzb25uYWxpc8OpcyBIVE1MKGkuZS4gQ3VzdG9tRWxlbWVudClcclxuXHRcdFxyXG5cdFx0ZmFicmlxdWVcclxuXHRcdFx0QHBhcmFtZXRyZXNcdE9iamVjdFxyXG5cdFx0XHRcdEBcclxuKiovXHJcbmNvbnN0IGludGVycHJldGV1ckh0bWwgPSAoKCkgPT5cclxue1xyXG4gIGNvbnN0IGludGVycHJldGV1ckRvbSA9IG5ldyBET01QYXJzZXI7XHJcbiAgcmV0dXJuIGNoYWluZUh0bWwgPT4gaW50ZXJwcmV0ZXVyRG9tLnBhcnNlRnJvbVN0cmluZyhjaGFpbmVIdG1sLCAndGV4dC9odG1sJyk7XHJcbn0pKCk7XHJcblxyXG5jb25zdCBmYWJyaXF1ZSA9IGVzcGFjZURlTm9tID0+XHJcbntcclxuXHR5YmFzdGhpcy5jb250cmF0KHtkb2l0IDogW2VzcGFjZURlTm9tLCAnc3RyaW5nJywgbmV3IEVycm9yKCdmYWJyaXF1ZUBlc3BhY2VEZU5vbSBkb2l0IMOqdHJlIHVuIHN0cmluZycpIF0gfSApO1xyXG5cdHliYXN0aGlzLmNvbnRyYXQoe2RvaXQgOiBbZmFicmlxdWUuZXNwYWNlRGVOb21bZXNwYWNlRGVOb21dLCAndW5kZWZpbmVkJywgbmV3IEVycm9yKCdmYWJyaXF1ZUBlc3BhY2UgZGUgbm9tIGTDqWrDoCB1dGlsaXPDqScpIF0gfSApO1xyXG5cdGNvbnN0IGRpY3Rpb25uYWlyZUVsw6ltZW50ID0ge307XHJcblxyXG5cdGZhYnJpcXVlLmVzcGFjZURlTm9tW2VzcGFjZURlTm9tXSA9IGRpY3Rpb25uYWlyZUVsw6ltZW50O1xyXG5cdC8qKlxyXG5cdFx0SUVsZW1lbnRcclxuXHRcdFx0QG5vbSBTdHJpbmdcclxuXHRcdFx0QGNvbnN0cnVjdGV1clx0XHRGdW5jdGlvblxyXG5cdFx0XHRAdGVtcGxhdGVcdFx0XHR1bmRlZmluZWQgfHwgU3RyaW5nXHJcblx0KiovXHJcblx0Y29uc3QgSUVsZW1lbnQgPSBuZXcgeWJhc3RoaXMudHlwZXNEb25uZWVzLkludGVyZmFjZVR5cMOpZVxyXG5cdCh7ZG9pdCA6XHJcblx0e1xyXG5cdFx0bm9tIDogJ3N0cmluZycsXHJcblx0XHRjb25zdHJ1Y3RldXIgOiBGdW5jdGlvbixcclxuXHRcdHRlbXBsYXRlIDogWyd1bmRlZmluZWQnLCAnc3RyaW5nJ10gXHJcblx0fX0pO1xyXG5cdHJldHVybiBmdW5jdGlvbihwYXJhbcOodHJlcylcclxuXHR7XHJcblx0XHR0cnl7XHRJRWxlbWVudC52YWxpZGVyKHBhcmFtw6h0cmVzKTtcdH1cclxuXHRcdGNhdGNoKGUpXHJcblx0XHR7XHJcblx0XHRcdGlmKGUuZXN0Rm9ybWVsbGUpIHRocm93IGU7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihlc3BhY2VEZU5vbSArICctZmFicmlxdWVAcGFyYW3DqHRyZXMgblxcJ2ltcGzDqW1lbnRlIHBhcyBsXFxpbnRlcmZhY2UgSUVsZW1lbnQnKTtcclxuXHRcdH1cclxuXHRcdC8qKlxyXG5cdFx0XHRQcml2w6lcclxuXHRcdCoqL1xyXG5cdFx0Y29uc3Qgc29pc0NsYXNzZUVsZW1lbnQgPSB0aGlzO1xyXG5cdFx0Y29uc3QgcHJvdG90eXBlSHRtbEVsZW1lbnQgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSk7XHJcblx0XHRjb25zdCBJbnRhbmNlRWxlbWVudEh0bWwgPSBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGlmICh0aGlzLmF0dGFjaFNoYWRvdylcclxuXHRcdFx0XHR0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZSA6ICdvcGVuJ30pO1xyXG5cdFx0XHRlbHNlIC8vZGVwcmVjaWVkXHJcblx0XHRcdFx0dGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XHJcblx0XHRcdHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzb2lzQ2xhc3NlRWxlbWVudC5tb2RlbGUuY2xvbmVOb2RlKHRydWUpLmNvbnRlbnQpO1xyXG5cdFx0XHRwYXJhbcOodHJlcy5jb25zdHJ1Y3RldXIodGhpcyk7XHJcblx0XHR9O1xyXG5cdFx0LyoqXHJcblx0XHRcdFB1YmxpcXVlXHJcblx0XHQqKi9cclxuXHRcdHRoaXMub2J0ZW5pclByb3RvdHlwZSA9ICgpID0+IHByb3RvdHlwZUh0bWxFbGVtZW50O1xyXG5cdFx0dGhpcy5tb2RlbGUgPSBudWxsO1xyXG5cdFx0LyoqXHJcblx0XHQgIENvbnN0cnVjdGV1clxyXG5cdFx0KiovXHJcblx0XHQoKCkgPT5cclxuXHRcdHtcclxuXHRcdCAgdmFyIG1vZGVsZVRlbXBvcmFpcmUgPSBpbnRlcnByZXRldXJIdG1sKHBhcmFtw6h0cmVzLnRlbXBsYXRlKTtcclxuXHRcdCAgbW9kZWxlVGVtcG9yYWlyZSA9IG1vZGVsZVRlbXBvcmFpcmUucXVlcnlTZWxlY3RvcigndGVtcGxhdGUnKTtcclxuXHRcdCAgbW9kZWxlVGVtcG9yYWlyZS5pbm5lckhUTUwgKz0gJzxzdHlsZT4gKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7Ym94LXNpemluZzogYm9yZGVyLWJveDsgfSc7XHJcblx0XHQgIHRoaXMubW9kZWxlID0gbW9kZWxlVGVtcG9yYWlyZTtcclxuXHRcdH0pKCk7XHJcblx0XHRcdFxyXG5cdFx0cHJvdG90eXBlSHRtbEVsZW1lbnQuY3JlYXRlZENhbGxiYWNrID0gSW50YW5jZUVsZW1lbnRIdG1sO1xyXG5cdFx0cHJvdG90eXBlSHRtbEVsZW1lbnQuYXR0YWNoZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkgXHJcblx0XHR7XHJcblx0XHRcdC8qY29uc29sZS5sb2coJ2F0dGFjaMOpOiAnLCB0aGlzKVxyXG5cdFx0XHR5YmFzdGhpcy5zb25kZU11dGF0aW9uLm5vdXZlbGxlKHRoaXMpO1xyXG5cdFx0XHR5YmFzdGhpcy5zb25kZU11dGF0aW9uLm5vdXZlbGxlKHRoaXMuc2hhZG93Um9vdCk7Ki9cclxuXHRcdH07XHJcblx0XHRwcm90b3R5cGVIdG1sRWxlbWVudC5kZXRhY2hlZENhbGxiYWNrPSBmdW5jdGlvbigpIFxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZMOpdGFjaMOpOiAnLCB0aGlzKVxyXG5cdFx0fTtcclxuXHRcdHRyeXtcdGZhYnJpcXVlLmVzcGFjZURlTm9tW2VzcGFjZURlTm9tXVtwYXJhbcOodHJlcy5ub21dID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGVzcGFjZURlTm9tICsgJy0nICsgcGFyYW3DqHRyZXMubm9tLCB7cHJvdG90eXBlOiBwcm90b3R5cGVIdG1sRWxlbWVudH0gKTtcdH1cclxuXHRcdGNhdGNoKGUpe1x0dGhyb3cgbmV3IEVycm9yKGVzcGFjZURlTm9tICsgJy1mYWJyaXF1ZTogRXJyZXVyIGxvcnMgZGUgbFxcJ2luc2NyaXB0aW9uIGRlIEBub20gJyArIHBhcmFtw6h0cmVzLm5vbSkubGllcihlKTtcdH1cdFx0XHJcblx0fTtcclxufTtcclxuZmFicmlxdWUuZXNwYWNlRGVOb20gPSB7fTtcclxuZXhwb3J0IGRlZmF1bHQgZmFicmlxdWU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS8zL2VsZW1lbnRzUGVyc29uYWxpc8Opcy5qcyIsImltcG9ydCBzeXN0ZW1lUG9pbnRhZ2UgZnJvbSAnLi9zeXN0ZW1lUG9pbnRhZ2UuanMnO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tICcuL3dpbmRvd3MuanMnO1xyXG5leHBvcnQgZGVmYXVsdCAoKSA9PlxyXG57XHJcblx0T2JqZWN0LmFzc2lnbih5YmFzdGhpcyxcclxuXHR7XHJcblx0XHRjb25maWcgOlxyXG5cdFx0e1xyXG5cdFx0XHRjb250ZW5ldXIgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjZXB0YWNsZVliYXN0aGlzJylcclxuXHRcdH0sXHJcblx0XHRkb20gOlxyXG5cdFx0e1xyXG5cdFx0XHRjb250ZW5ldXIgOiBudWxsLFxyXG5cdFx0XHRkZXNrdG9wIDogbnVsbFxyXG5cdFx0fSxcclxuXHRcdHN5c3RlbWVQb2ludGFnZSA6IG51bGxcclxuXHR9KTtcclxuXHJcblx0eWJhc3RoaXMuZG9tLmNvbnRlbmV1ciA9IHliYXN0aGlzLmNvbmZpZy5jb250ZW5ldXI7XHJcblx0eWJhc3RoaXMuZG9tLmRlc2t0b3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHR5YmFzdGhpcy5kb20uZGVza3RvcC5pZCA9ICdkZXNrdG9wJztcclxuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFwcGVuZENoaWxkKHliYXN0aGlzLmRvbS5kZXNrdG9wKTtcclxuXHRPYmplY3QuYXNzaWduKHliYXN0aGlzLmRvbS5jb250ZW5ldXIuc3R5bGUsXHJcblx0e1xyXG5cdFx0bGVmdCA6ICcwcHgnLFxyXG5cdFx0dG9wIDogJzBweCcsXHJcblx0XHRoZWlnaHQgOiAnMTAwJScsXHJcblx0XHR3aWR0aCA6ICcxMDAlJyxcclxuXHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcclxuXHRcdHpJbmRleCA6IDFcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHliYXN0aGlzLmRvbS5kZXNrdG9wLnN0eWxlLFxyXG5cdHtcclxuXHRcdGxlZnQgOiAnMHB4JyxcclxuXHRcdHRvcCA6ICcwcHgnLFxyXG5cdFx0aGVpZ2h0IDogJzEwMCUnLFxyXG5cdFx0d2lkdGggOiAnMTAwJScsXHJcblx0XHRwb3NpdGlvbiA6ICdhYnNvbHV0ZScsXHRcclxuXHRcdG92ZXJmbG93IDogJ2hpZGRlbicsXHJcblx0XHRiYWNrZ3JvdW5kSW1hZ2UgOiAnIHVybCguL2FwaS80L2d1aS9pbWFnZXMvYmFja2dyb3VuZC5wbmcpJyxcclxuXHRcdGJhY2tncm91bmRTaXplIDogJzEwMCUgMTAwJScsXHJcblx0XHR6SW5kZXggOiAyXHJcblx0fSk7XHJcblxyXG5cdHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZSA9IG5ldyBzeXN0ZW1lUG9pbnRhZ2U7XHJcblx0eWJhc3RoaXMud2luZG93cyA9IG5ldyB3aW5kb3dzO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvZ3VpSW5kZXguanMiLCJpbXBvcnQgZWxDYXNlQ29jaGVyIGZyb20gJy4vZWxlbWVudHMvY2FzZUNvY2hlci5qcyc7XHJcbmltcG9ydCBlbEJvdXRvbiBmcm9tICcuL2VsZW1lbnRzL2JvdXRvbi5qcyc7XHJcbmltcG9ydCBlbE1lbnUgZnJvbSAnLi9lbGVtZW50cy9tZW51LmpzJztcclxuaW1wb3J0IGVsTWVudVRhYiBmcm9tICcuL2VsZW1lbnRzL21lbnUtdGFiLmpzJztcclxuaW1wb3J0IGVsTWVudU9uZ2xldCBmcm9tICcuL2VsZW1lbnRzL21lbnUtb25nbGV0LmpzJztcclxuaW1wb3J0IGVsSW50ZXJmYWNlIGZyb20gJy4vZWxlbWVudHMvaW50ZXJmYWNlLmpzJztcclxuaW1wb3J0IGVsR2FsbGVyaWUgZnJvbSAnLi9lbGVtZW50cy9nYWxsZXJpZS5qcyc7XHJcbmltcG9ydCBlbFNlbGVjdGlvbiBmcm9tICcuL2VsZW1lbnRzL19fc2VsZWN0aW9uMi5qcyc7XHJcbmltcG9ydCBlbGNob2l4IGZyb20gJy4vZWxlbWVudHMvY2hvaXguanMnO1xyXG5leHBvcnQgZGVmYXVsdFxyXG5bXHJcblx0ZWxDYXNlQ29jaGVyLFxyXG5cdGVsQm91dG9uLFxyXG5cdGVsTWVudSxcclxuXHRlbE1lbnVUYWIsXHJcblx0ZWxNZW51T25nbGV0LFxyXG5cdGVsSW50ZXJmYWNlLFxyXG5cdGVsR2FsbGVyaWUsXHJcblx0ZWxjaG9peCxcclxuXHRlbFNlbGVjdGlvblxyXG5dO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9saXN0ZUVsZW1lbnRzLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgdnVlRXNwYWNlVHJhdmFpbCBmcm9tICcuL2VzcGFjZVRyYXZhaWwvaW5kZXguanMnO1xyXG5pbXBvcnQgdnVlTW9kdWxlcyBmcm9tICcuL21vZHVsZXMvaW5kZXguanMnO1xyXG5pbXBvcnQgdnVlQWRtaW5pc3RyYXRpb24gZnJvbSAnLi9hZG1pbmlzdHJhdGlvbi9pbmRleC5qcyc7XHJcbmltcG9ydCB2dWVBdXRyZXMgZnJvbSAnLi9hdXRyZXMvaW5kZXguanMnO1xyXG5leHBvcnQgZGVmYXVsdCAoKSA9PlxyXG57XHJcblx0Y29uc3QgZ3VpRWRpID0gbmV3IHliYXN0aGlzLndpbmRvd3MuV2luZG93KHtwb3M6IHt4OiAxMCwgeToxMTB9LCBkaW06IHt4OiA1NTAsIHkgOiAzMDV9LCB0aXRyZTogJ0VESSd9KTtcclxuXHRjb25zdCBndWlFZGkyID0gbmV3IHliYXN0aGlzLndpbmRvd3MuV2luZG93KHtwb3M6IHt4OiAxMCwgeTo1fSwgZGltOiB7eDogNDI4LCB5IDogMTAwfSwgdGl0cmU6ICdFREkyJ30pO1xyXG5cdGd1aUVkaS5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUNvbnRlbnUnKS5hcHBlbmRDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWRpQ29udGVudCcpICk7XHJcblx0Y29uc3QgZXNwYWNlRGVUcmF2YWlsRG9tID0gZ3VpRWRpLmRvbS5xdWVyeVNlbGVjdG9yKCcjZXNwYWNlRGVUcmF2YWlsJyk7XHJcblx0bGV0IGRlY2FsYWdlID0gZ2V0Q29tcHV0ZWRTdHlsZShndWlFZGkuZG9tLnF1ZXJ5U2VsZWN0b3IoJyNtZW51UHJpbmNpcGFsJykgKS5oZWlnaHQ7XHJcblx0ZXNwYWNlRGVUcmF2YWlsRG9tLnN0eWxlLnRvcCA9IGRlY2FsYWdlO1xyXG5cdGVzcGFjZURlVHJhdmFpbERvbS5zdHlsZS5oZWlnaHQgPSAoeWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koZ2V0Q29tcHV0ZWRTdHlsZShlc3BhY2VEZVRyYXZhaWxEb20pLmhlaWdodCkgLSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShkZWNhbGFnZSkgKSArICdweCc7XHJcblx0XHRcclxuXHRjb25zdCBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXNwYWNlRGVUcmF2YWlsJyk7XHJcblx0aW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFqb3V0ZXIodnVlRXNwYWNlVHJhdmFpbCk7XHJcblx0aW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFqb3V0ZXIodnVlTW9kdWxlcyk7XHJcblx0aW50ZXJmYWNlRXNwYWNlRGVUcmF2YWlsLmFqb3V0ZXIodnVlQWRtaW5pc3RyYXRpb24pO1xyXG5cdGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5ham91dGVyKHZ1ZUF1dHJlcyk7XHJcblx0Ly9cdE5PVEUgRXbDqG5lbWVudHMgI21lbnVQcmluY2lwYWwuXHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgbWVudUVsZW1lbnQgPSBndWlFZGkuZG9tLnF1ZXJ5U2VsZWN0b3IoJyNtZW51UHJpbmNpcGFsJyk7XHJcblx0XHRtZW51RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZmZpY2hhZ2UnLCBlID0+XHJcblx0XHR7XHJcblx0XHRcdGxldCB7Y2libGV9ID0gZS5kZXRhaWw7XHJcblx0XHRcdGlmKGNpYmxlID09PSAnRXNwYWNlIFRyYXZhaWwnKSBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ2VzcGFjZVRyYXZhaWwnKTtcclxuXHRcdFx0ZWxzZSBpZihjaWJsZSA9PT0gJ01vZHVsZXMnKSBpbnRlcmZhY2VFc3BhY2VEZVRyYXZhaWwuYWZmaWNoZXIoJ21vZHVsZXMnKTtcclxuXHRcdFx0ZWxzZSBpZihjaWJsZSA9PT0gJ0FkbWluaXN0cmF0aW9uJykgIGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5hZmZpY2hlcignYWRtaW5pc3RyYXRpb24nKTtcclxuXHRcdFx0ZWxzZSBpZihjaWJsZSA9PT0gJ0F1dHJlcycpIGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5hZmZpY2hlcignYXV0cmVzJyk7XHJcblx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdPbmdsZXQgbm9uIGfDqXLDqTogJyArIG5vbU9uZ2xldCArICchJyk7XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHR9KSgpO1xyXG5cdC8qKlxyXG5cdFx0VGVzdFxyXG5cdCoqL1xyXG5cdHtcclxuXHRcdGxldCBhYWFUZXN0RG9tID0gXHJcblx0XHRgXHJcblx0XHRcdDx5Yi1tZW51PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdNb2RlbGUnIHR5cGU9J2JvdXRvbic+PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0XHQ8eWItb25nbGV0IG5vbT0nSW1wbMOpbWVudGF0aW9uJyA+PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0PHliLW9uZ2xldCBub209J01vZGVsZScgdHlwZT0nc2VsZWN0aW9uJz5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0hBSEEnID4gPC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0hPSE8nID4gPC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J1BlbmlzJyA+IDwveWItY2hvaXg+XHJcblx0XHRcdFx0PC95Yi1vbmdsZXQ+XHJcblx0XHRcdDwveWItbWVudT5cclxuXHRcdFx0PHliLWJvdXRvbj5UZXN0PC95Yi1ib3V0b24+XHJcblx0XHRgO1xyXG5cdFx0Z3VpRWRpMi5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZUNvbnRlbnUnKS5pbm5lckhUTUwgPSBhYWFUZXN0RG9tO1xyXG5cdFx0Ly9ndWlFZGkyLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlQ29udGVudScpLnF1ZXJ5U2VsZWN0b3IoJ3liLW1lbnUnKS5hcHBsaXF1ZXJCb3JkdXJlKCk7XHJcblx0XHRsZXQgZXNwYWNlVHJhdmFpbERvbSA9IGludGVyZmFjZUVzcGFjZURlVHJhdmFpbC5hZmZpY2hlcignZXNwYWNlVHJhdmFpbCcpO1xyXG5cdFx0bGV0IGludGVyZmFjZTIgPSBlc3BhY2VUcmF2YWlsRG9tLnF1ZXJ5U2VsZWN0b3IoJ3liLWludGVyZmFjZScpO1xyXG5cdFx0Ly9pbnRlcmZhY2UyLmFmZmljaGVyKCdwcm9qZXRDbGFzc2UnKTtcclxuXHR9XHJcblx0e1xyXG5cdFx0dmFyIGtha2EgPSBbXTtcclxuXHRcdGRvY3VtZW50LmJvZHkubGFzdENoaWxkLnBhcmNvdXJpckJhcyh6aWd6YWcgPT4ga2FrYS5wdXNoKHppZ3phZykgKTtcclxuXHRcdGNvbnNvbGUubG9nKCdrYWthJywga2FrYSk7XHJcblx0XHRcclxuXHR9XHJcbn1cclxuXHRcdFxyXG5cdFx0XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL3VpL3ByaW5jaXBhbGUuanMiLCJjb25zdCBfY2xhc3NlXyA9IG5vbSA9PiAneWJhc3RoaXNGZW5ldHJlJyArIG5vbTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbntcclxuXHRjb25zdCBzZWxmID0gdGhpcztcclxuXHR0cnlcclxuXHR7XHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHRcdG9wdGlvbnMucG9zID0gb3B0aW9ucy5wb3MgfHwge3g6MCwgeTowfTtcclxuXHRcdG9wdGlvbnMuZGltID0gb3B0aW9ucy5kaW0gfHwge3g6MjUwLCB5OjkyfTtcclxuXHRcdFx0XHRcclxuXHQvKioqKioqKioqKioqKioqPlxyXG5cdC8vXHRQVUJMSVFVRSAgIC8vXHJcblx0PCoqKioqKioqKioqKioqKi9cclxuXHRcdHRoaXMudGl0cmUgPSBvcHRpb25zLnRpdHJlIHx8IHliYXN0aGlzLndpbmRvd3MudGl0cmVNYXgrKztcclxuXHRcdHRoaXMucG9zID0gb3B0aW9ucy5wb3M7XHJcblx0XHR0aGlzLmRpbSA9IG9wdGlvbnMuZGltO1xyXG5cdFx0dGhpcy5kb20gPSB2b2lkKHliYXN0aGlzLmRvbS5kZXNrdG9wLmFwcGVuZENoaWxkKGRvbUZlbmV0cmUuY2xvbmVOb2RlKHRydWUpICkgKSB8fCB5YmFzdGhpcy5kb20uZGVza3RvcC5sYXN0Q2hpbGQ7XHJcblx0XHR0aGlzLmNsb3NlID0gKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0dGhpcy5kb20ucmVtb3ZlKCk7XHJcblx0XHRcdHliYXN0aGlzLndpbmRvd3MubGlzdGUuc3VwcHJpbWVyKHRoaXMpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuZGltbWVuc2lvbm5lciA9ICh4LCB5KSA9PlxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmRvbS5zdHlsZS53aWR0aCA9IHggKyAncHgnO1xyXG5cdFx0XHR0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSB5ICsgJ3B4JztcclxuXHRcdH07XHJcblx0XHR0aGlzLm5vbW1lciA9IG5vbSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpZih0aGlzLnRpdHJlID09PSBub20pIHRocm93IG5ldyBFcnJvcignbm9tbWFnZSBkXFwndW5lIGZlbsOqdHJlIGF2ZWMgdW4gbm91dmVhdSBub20gaWRlbnRpcXVlJyk7XHJcblx0XHRcdHRoaXMudGl0cmUgPSBub20gfHwgdGhpcy50aXRyZTtcclxuXHRcdFx0dGhpcy5kb20ucXVlcnlTZWxlY3RvcignLnliYXN0aGlzRmVuZXRyZVRpdHJlIHAnKS50ZXh0Q29udGVudCA9IHRoaXMudGl0cmU7XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHRcdHZhciBjb2xpc2lvbkNvbnRpbnVlID0gZmFsc2U7XHJcblx0XHR0aGlzLnBvc2l0aW9ubmVyID0gKHgsIHkpID0+XHJcblx0XHR7XHJcblx0XHRcdHZhciBjb2xpc2lvbiA9IGZhbHNlO1xyXG5cdFx0XHQvKlx0RMOpdGVjdGlvbiBkZXMgY29saXNpb25zXHJcblx0XHRcdFx0TG9naXF1ZTpcclxuXHRcdFx0XHRcdFBvdXIgY2hhcXVlIGZlbmV0cmUgcsOpY3Vww6lyZXIgc2EgcG9zaXRpb24gRVQgc2EgdGFpbGxlXHJcblx0XHRcdCovXHJcblx0XHRcdGZvcih2YXIgZmVuZXRyZSBvZiB5YmFzdGhpcy53aW5kb3dzLmxpc3RlIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2ZlbmV0cmUnLCBmZW5ldHJlKTtcclxuXHRcdFx0XHRpZigoZmVuZXRyZS5hcHAgPT09IHRoaXMuYXBwKSAmJiAoZmVuZXRyZS50aXRyZSA9PT0gdGhpcy50aXRyZSkgKSBjb250aW51ZTtcclxuXHRcdFx0XHRjb25zdCB7cG9zLCBkaW19ID0gZmVuZXRyZTtcclxuXHRcdFx0XHRpZiAoKCh0aGlzLnBvcy54ID49IHBvcy54KSAmJiAodGhpcy5wb3MueCA8PSBwb3MueCArIGRpbS54KSkgJiZcclxuXHRcdFx0XHRcdCgodGhpcy5wb3MueSA+PSBwb3MueSkgJiYgKHRoaXMucG9zLnkgPD0gcG9zLnkgKyBkaW0ueSkpKVxyXG5cdFx0XHRcdFx0Y29saXNpb24gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBkZXBsYWNlciA9IHRydWU7XHJcblx0XHRcdGlmKGNvbGlzaW9uKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NvbGxpc2lvbicpO1xyXG5cdFx0XHRcdGlmKGNvbGlzaW9uQ29udGludWUgPT09IGZhbHNlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5ibG9xdWVyKCk7XHJcblx0XHRcdFx0XHRkZXBsYWNlciA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dmFyIHggPSBzZXRUaW1lb3V0KCgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5kw6libG9xdWVyKCksIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbGlzaW9uQ29udGludWUgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgY29saXNpb25Db250aW51ZSA9IGZhbHNlO1xyXG5cdFx0XHRpZihkZXBsYWNlcilcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMucG9zLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMucG9zLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMuZG9tLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcclxuXHRcdFx0XHR0aGlzLmRvbS5zdHlsZS50b3AgPSB5ICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdH07XHJcblx0LyoqKioqKioqKioqKioqKj5cclxuXHQvL1x0RVZFTkVNRU5UUyAvL1xyXG5cdDwqKioqKioqKioqKioqKiovXHJcblx0KCgpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgZmVuZXRyZUhhdXREb20gPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlSGF1dCcpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PiB5YmFzdGhpcy53aW5kb3dzLnRvRmlyc3RQbGFuKHRoaXMpICk7XHJcblx0XHR0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCcueWJhc3RoaXNGZW5ldHJlSGF1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+XHJcblx0XHR7XHJcblx0XHRcdHliYXN0aGlzLndpbmRvd3MuaW5pdGlhbGlzZXJEw6lwbGFjZW1lbnQodGhpcyk7XHJcblx0XHR9ICk7XHJcblx0XHRcclxuXHRcdGZlbmV0cmVIYXV0RG9tLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGUgPT4gKGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnUCcpPyB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UuY2hhbmdlQ3Vyc29yKGZhbHNlLCAnZGVwbGFjZXInKSA6IHZvaWQgMSk7XHJcblx0XHRmZW5ldHJlSGF1dERvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdub3JtYWwnKSApO1xyXG5cdFx0XHRcclxuXHRcdFxyXG5cdFx0Y29uc3QgYnV0dG9ucyA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJy55YmFzdGhpc0ZlbmV0cmVIYXV0IGltZycpO1xyXG5cdFx0Zm9yKHZhciBidXR0b24gb2YgYnV0dG9ucylcclxuXHRcdHtcclxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHliYXN0aGlzLnN5c3RlbWVQb2ludGFnZS5jaGFuZ2VDdXJzb3IoZmFsc2UsICdkZWNsZW5jaGVyJykgKTtcclxuXHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4geWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLmNoYW5nZUN1cnNvcihmYWxzZSwgJ25vcm1hbCcpICk7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0YnV0dG9uc1syXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2UpO1xyXG5cdH0gKSgpO1xyXG5cdC8qKioqKioqKioqKioqKio+XHJcblx0Ly9cdENPTlNUUlx0ICAgLy9cclxuXHQ8KioqKioqKioqKioqKioqL1xyXG5cdFx0dGhpcy5wb3NpdGlvbm5lcih0aGlzLnBvcy54LCB0aGlzLnBvcy55KTtcclxuXHRcdHRoaXMuZGltbWVuc2lvbm5lcih0aGlzLmRpbS54LCB0aGlzLmRpbS55KTtcclxuXHRcdHRoaXMubm9tbWVyKCk7XHJcblx0XHR5YmFzdGhpcy53aW5kb3dzLmxpc3RlLmFqb3V0ZXIodGhpcyk7XHJcblx0XHRcclxuXHRcdGxldCBjb250ZW51RG9tID0gdGhpcy5kb20ucXVlcnlTZWxlY3RvcignLicgKyBfY2xhc3NlXygnQ29udGVudScpICk7XHJcblx0XHRjb250ZW51RG9tLnN0eWxlLmhlaWdodCA9ICh5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnVEb20pLmhlaWdodCkgLSAzMikgKyAncHgnO1xyXG5cdH1cdFxyXG5cdGNhdGNoKGVycilcclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZygnZXJySW5pdGlhbGlzYXRpb24gbW9kdWxlOlx0JywgZXJyKTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBkb21GZW5ldHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbi8qKlxyXG5cdDxkaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPSdIYXV0Jz5cclxuXHRcdFx0PGRpdiBjbGFzcz0nVGl0cmUnPlxyXG5cdFx0XHRcdDxwPjwvcD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3M9J0JvdXRvbnMnPjwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8ZGl2IGNsYXNzPSdDb250ZW51Jz48L2Rpdj5cclxuXHQ8L2Rpdj5cclxuKiovXHJcbigoKSA9PlxyXG57XHJcblx0dmFyIGNyw6llckVsw6ltZW50ID0gKGVsKSA9PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcclxuXHR2YXIgZGl2ID0gKCkgPT4gY3LDqWVyRWzDqW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdFxyXG5cdHZhciB0YWIgPSBbXTtcclxuXHRmb3IodmFyIGkgPTA7IGkgPD0gMTsgaSsrKSB0YWIucHVzaChkaXYoKVx0KTtcclxuXHRmb3IodmFyIGkgPTA7IGkgPD0gMTsgaSsrKSB0YWJbMF0uYXBwZW5kQ2hpbGQoZGl2KClcdCk7XHJcblx0XHJcblx0dGFiWzBdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdIYXV0Jyk7XHRcclxuXHR0YWJbMF0uY2hpbGRyZW5bMF0uY2xhc3NOYW1lID0gX2NsYXNzZV8oJ1RpdHJlJyk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdwJykgKTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2xhc3NOYW1lID0gX2NsYXNzZV8oJ0JvdXRvbnMnKTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uYXBwZW5kQ2hpbGQoY3LDqWVyRWzDqW1lbnQoJ2ltZycpXHQpO1xyXG5cdHRhYlswXS5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChjcsOpZXJFbMOpbWVudCgnaW1nJylcdCk7XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmFwcGVuZENoaWxkKGNyw6llckVsw6ltZW50KCdpbWcnKVx0KTtcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uc3JjID0gJy4vYXBpLzQvZ3VpL2ltYWdlcy9taW5pbWlzZXIucG5nJztcdFx0XHRcclxuXHR0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uc3JjID0gJy4vYXBpLzQvZ3VpL2ltYWdlcy9yZWR1aXJlLnBuZyc7XHRcdFx0XHJcblx0dGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLnNyYyA9ICcuL2FwaS80L2d1aS9pbWFnZXMvZmVybWVyLnBuZyc7XHJcblx0dGFiWzFdLmNsYXNzTmFtZSA9IF9jbGFzc2VfKCdDb250ZW51Jyk7XHJcblx0XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0OiBcdFx0XHQzMiArICdweCcsXHJcblx0XHR3aWR0aDogXHRcdFx0XHQnMTAwJScsXHJcblx0XHRwb3NpdGlvbjpcdFx0XHQnYWJzb2x1dGUnLFxyXG5cdFx0Ym9yZGVyQm90dG9tOlx0JzFweCBzb2xpZCBibGFjaydcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlswXS5jaGlsZHJlblswXS5zdHlsZSxcclxuXHR7XHJcblx0XHRwb3NpdGlvbjpcdCdhYnNvbHV0ZScsXHJcblx0XHRtYXJnaW46XHRcdCcwcHgnLFxyXG5cdFx0aGVpZ2h0Olx0XHQnMTAwJScsXHJcblx0XHR3aWR0aDpcdFx0JzEwMCUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0dG9wOlx0XHRcdCc0cHgnLFxyXG5cdFx0cG9zaXRpb246XHQnYWJzb2x1dGUnLFxyXG5cdFx0cmlnaHQ6XHRcdCc0cHgnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0dmVydGljYWxBbGlnbjpcdCdtaWRkbGUnLFxyXG5cdFx0cG9zaXRpb246IFx0XHRcdCdhYnNvbHV0ZScsXHJcblx0XHRtYXJnaW46XHRcdFx0XHRcdCcwcHgnLFxyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0XHQnMTAwJScsXHJcblx0XHR3aWR0aDpcdFx0XHRcdFx0JzEwMCUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0Olx0XHQnMjRweCcsXHJcblx0XHR3aWR0aDpcdFx0JzI0cHgnLFxyXG5cdFx0cmlnaHQ6XHRcdCc4cHgnLFxyXG5cdFx0cG9zaXRpb246XHQncmVsYXRpdmUnXHJcblx0fSk7XHJcblx0T2JqZWN0LmFzc2lnbih0YWJbMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uc3R5bGUsXHJcblx0e1xyXG5cdFx0aGVpZ2h0OiBcdCcyNHB4JyxcclxuXHRcdHdpZHRoOiBcdFx0JzI0cHgnLFxyXG5cdFx0cmlnaHQ6IFx0XHQnNHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J3JlbGF0aXZlJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24odGFiWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLnN0eWxlLFxyXG5cdHtcclxuXHRcdGhlaWdodDogXHQnMjRweCcsXHJcblx0XHR3aWR0aDogXHRcdCcyNHB4JyxcclxuXHRcdHJpZ2h0OiBcdFx0JzBweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZSdcclxuXHR9KTtcclxuXHRPYmplY3QuYXNzaWduKHRhYlsxXS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6XHRcdCcxMDAlJyxcclxuXHRcdHRvcDpcdFx0XHQnMzJweCcsXHJcblx0XHRwb3NpdGlvbjpcdCdyZWxhdGl2ZScsXHJcblx0XHRvdmVyZmxvdzpcdCdhdXRvJ1xyXG5cdH0pO1xyXG5cdE9iamVjdC5hc3NpZ24oZG9tRmVuZXRyZS5zdHlsZSxcclxuXHR7XHJcblx0XHRoZWlnaHQ6XHRcdFx0XHRcdFx0MTI1ICsgJ3B4JyxcclxuXHRcdHdpZHRoOlx0XHRcdFx0XHRcdDI1MCArICdweCcsXHJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XHQnI0Q0RDRENCcsXHJcblx0XHRib3hTaGFkb3c6XHRcdFx0XHQnMHB4IDBweCA5cHggd2hpdGUnLFxyXG5cdFx0cG9zaXRpb246XHRcdFx0XHRcdCdhYnNvbHV0ZScsXHJcblx0XHRib3JkZXJDb2xvcjpcdFx0XHQnYmxhY2snLFxyXG5cdFx0Ym9yZGVyU3R5bGU6XHRcdFx0J3NvbGlkJyxcclxuXHRcdGJvcmRlcldpZHRoOlx0XHRcdCcxcHgnXHJcblx0fSk7XHJcblx0Zm9yKHZhciBlbCBvZiB0YWIpXHJcblx0XHRkb21GZW5ldHJlLmFwcGVuZENoaWxkKGVsKTtcclxufSkoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL1dpbmRvdy5qcyIsImNvbnN0IHBvaW50ZXJMb2NrID0gKGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudCAhPT0gdW5kZWZpbmVkKSA/XG57XG5cdGV2ZW50IDogJ21velBvaW50ZXJsb2NrY2hhbmdlJyxcblx0ZWxlbWVudCA6ICgpID0+IGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudFxufSA6XG4oZG9jdW1lbnQud2Via2l0UG9pbnRlckxvY2tFbGVtZW50ICE9PSB1bmRlZmluZWQpID9cbntcblx0ZXZlbnQgOiAnd2Via2l0UG9pbnRlcmxvY2tjaGFuZ2UnLFxuXHRlbGVtZW50IDogKCkgPT4gZG9jdW1lbnQud2Via2l0UG9pbnRlckxvY2tFbGVtZW50XG59IDpcbntcblx0ZXZlbnQgOiAncG9pbnRlcmxvY2tjaGFuZ2UnLFxuXHRlbGVtZW50IDogKCkgPT4gZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzaGFyZWQgPT5cbntcblx0Y29uc3QgcXVlcnlDdXJzb3IgPSAoKSA9PlxuXHR7XG5cdFx0aWYoc2hhcmVkLmlzSGFuZGxlZClcblx0XHRcdHJldHVybjtcblx0XHRzaGFyZWQuZG9tLmNhbnZhcy5yZXF1ZXN0UG9pbnRlckxvY2soKTtcblx0fTtcblx0Y29uc3Qgb25Qb2ludGVyTG9ja0NoYW5nZSA9ICgpID0+XG5cdHtcblx0XHRpZiAocG9pbnRlckxvY2suZWxlbWVudCgpID09IHNoYXJlZC5kb20uY2FudmFzKVxuXHRcdHtcblx0XHRcdHNoYXJlZC5pc0hhbmRsZWQgPSB0cnVlO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBxdWVyeUN1cnNvcik7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzaGFyZWQuaXNIYW5kbGVkID0gZmFsc2U7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHF1ZXJ5Q3Vyc29yKTtcblx0XHR9XG5cdH07XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIocG9pbnRlckxvY2suZXZlbnQsIG9uUG9pbnRlckxvY2tDaGFuZ2UsIGZhbHNlKTtcblx0b25Qb2ludGVyTG9ja0NoYW5nZSgpO1xufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL3BvaW50ZXJDYXB0dXJlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBiaW5kZWRFdmVudHMgPSBbJ21vdXNldXAnLCAnZGJsY2xpY2snLCAnbW91c2Vkb3duJ107XG5leHBvcnQgZGVmYXVsdCBzaGFyZWQgPT5cbntcblx0Y29uc3QgZXZlbnRCaW5kVG9Ob2RlID0gKGV2ZW50KSA9PlxuXHR7XG5cdFx0aWYoZXZlbnQuaXNUcnVzdGVkKVxuXHRcdHtcblx0XHRcdGNvbnN0IG5vZGUgPSBzaGFyZWQuZ2V0Tm9kZUZyb21DdXJzb3IoKTtcblx0XHRcdGlmIChub2RlKVxuXHRcdFx0XHRub2RlLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoZXZlbnQudHlwZSwgc2hhcmVkLklFdmVudCkpO1xuXHRcdFx0cmV0dXJuIChub2RlKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIChudWxsKTtcblx0fTtcblx0Zm9yKGNvbnN0IGV2ZW50IG9mIGJpbmRlZEV2ZW50cylcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50QmluZFRvTm9kZSwgZmFsc2UpO1xuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXJcblx0KFxuXHRcdCdjbGljaycsXG5cdFx0ZXZlbnQgPT5cblx0XHR7XG5cdFx0XHRjb25zdCBub2RlID0gZXZlbnRCaW5kVG9Ob2RlKGV2ZW50KTtcblx0XHRcdGlmIChub2RlKVxuXHRcdFx0XHRub2RlLmZvY3VzKCk7XG5cdFx0fSxcblx0XHRmYWxzZVxuXHQpO1xufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzQvZ3VpL3BvaW50ZXJFdmVudEJpbmRpbmcuanMiLCIndXNlIHN0cmljdCc7XG5leHBvcnQgZGVmYXVsdCBzaGFyZWQgPT5cbntcblx0bGV0IGVsZW1QcmVjZW5kZW50ID0gbnVsbDtcblx0Y29uc3Qgb25Nb3VzZU1vdmUgPSBldmVuZW1lbnQgPT5cblx0e1xuXHRcdGlmIChzaGFyZWQuaXNMb2NrZWQgPT09IHRydWUgfHwgIXNoYXJlZC5pc0hhbmRsZWQpXG5cdFx0XHRyZXR1cm47XG5cdFx0Y29uc3QgcG9zID0gc2hhcmVkLnBvc2l0aW9uO1xuXHRcdHBvcy54ICs9IGV2ZW5lbWVudC5tb3ZlbWVudFg7XG5cdFx0cG9zLnkgKz0gZXZlbmVtZW50Lm1vdmVtZW50WTtcblx0XHRpZiAocG9zLnggPCAxKVxuXHRcdFx0cG9zLnggPSBzaGFyZWQuYXJlYVNpemUueCAtIDE7XG5cdFx0ZWxzZSBpZiAocG9zLnkgPCAxKVxuXHRcdFx0cG9zLnkgPSBzaGFyZWQuYXJlYVNpemUueSAtIDE7XG5cdFx0ZWxzZSBpZiAocG9zLnggPiBzaGFyZWQuYXJlYVNpemUueCAtIDEpXG5cdFx0XHRwb3MueCA9IDA7XG5cdFx0ZWxzZSBpZiAocG9zLnkgPiBzaGFyZWQuYXJlYVNpemUueSAtIDEpXG5cdFx0XHRwb3MueSA9IDA7XG5cdFx0Ly8gQWZmaWNoYWdlIGR1IGN1cnNvclxuXHRcdHNoYXJlZC5kb20uY3Vyc29yLnN0eWxlLmxlZnQgPSBwb3MueCArICdweCc7XG5cdFx0c2hhcmVkLmRvbS5jdXJzb3Iuc3R5bGUudG9wID0gcG9zLnkgKyAncHgnO1xuXHRcdGZvcihsZXQgbGlzdGVuZXIgb2Ygc2hhcmVkLmxpc3RlbmVycylcblx0XHRcdGxpc3RlbmVyKCk7XG5cdFx0Y29uc3QgZWxBY3QgPSBzaGFyZWQuZ2V0Tm9kZUZyb21DdXJzb3IoKTtcblx0XHRpZiAoKGVsQWN0ID09PSBudWxsKSB8fCBlbEFjdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmKGVsZW1QcmVjZW5kZW50ID09PSBudWxsKSBlbGVtUHJlY2VuZGVudCA9IGVsQWN0O1xuXHRcdGlmKGVsQWN0ICE9PSBlbGVtUHJlY2VuZGVudClcblx0XHR7XG5cdFx0XHRsZXQgZXZNb3VzZU92ZXIgPSBuZXcgQ3VzdG9tRXZlbnQoJ21vdXNlb3ZlcicsICBzaGFyZWQuSUV2ZW50KTtcblx0XHRcdGxldCBldk1vdXNlT3V0ID0gbmV3IEN1c3RvbUV2ZW50KCdtb3VzZW91dCcsICBzaGFyZWQuSUV2ZW50KTtcblx0XHRcdGVsZW1QcmVjZW5kZW50LmRpc3BhdGNoRXZlbnQoZXZNb3VzZU91dCk7XG5cdFx0XHRlbEFjdC5kaXNwYXRjaEV2ZW50KGV2TW91c2VPdmVyKTtcblx0XHRcdGVsZW1QcmVjZW5kZW50ID0gZWxBY3Q7XG5cdFx0fVxuXHR9O1xuXHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9wb2ludGVyT25Nb3ZlLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHN0YXJ0Q2FwdHVyZSBmcm9tICcuL3BvaW50ZXJDYXB0dXJlLmpzJztcclxuaW1wb3J0IGV2ZW50QmluZGluZyBmcm9tICcuL3BvaW50ZXJFdmVudEJpbmRpbmcuanMnO1xyXG5pbXBvcnQgcG9pbnRlck9uTW92ZUluaXQgZnJvbSAnLi9wb2ludGVyT25Nb3ZlLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKClcclxue1xyXG5cdGNvbnN0IGNoZW1pbmN1cnNvcnMgPSAnLi9hcGkvNC9ndWkvY3Vyc29ycy8nO1xyXG5cdGNvbnN0IGRvbSA9XHJcblx0e1xyXG5cdFx0Y2FudmFzIDogT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSxcclxuXHRcdHtcclxuXHRcdFx0aWQgOiAnY2FudmFzJ1xyXG5cdFx0fSksXHJcblx0XHRjdXJzb3IgOiBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLFxyXG5cdFx0e1xyXG5cdFx0XHRzcmMgOiBjaGVtaW5jdXJzb3JzICsgJ25vcm1hbC5wbmcnLFxyXG5cdFx0XHRpZCA6ICdjdXJzb3InXHJcblx0XHR9KVxyXG5cdH07XHJcblx0Y29uc3Qgc2hhcmVkID1cclxuXHR7XHJcblx0XHRkb20sXHJcblx0XHRpc0xvY2tlZDpcdFx0XHRcdFx0XHRmYWxzZSxcclxuXHRcdGlzSGFuZGxlZDpcdFx0XHRcdFx0ZmFsc2UsXHJcblx0XHRnZXROb2RlRnJvbUN1cnNvcjpcdCgpID0+XHJcblx0XHRcdGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoc2hhcmVkLnBvc2l0aW9uLngsIHNoYXJlZC5wb3NpdGlvbi55KSxcclxuXHRcdHBvc2l0aW9uOlx0XHRcdFx0XHRcdHt4OiAwLCB5OiAwfSxcclxuXHRcdGFyZWFTaXplOlx0XHRcdFx0XHRcdHt4OiAwLCB5OiAwfSxcclxuXHRcdGxpc3RlbmVyczpcdFx0XHRcdFx0W10sXHJcblx0XHRJRXZlbnQ6XHJcblx0XHR7XHJcblx0XHRcdGRldGFpbHM6XHRcdHtzaW11bGUgOiB0cnVlfSxcclxuXHRcdFx0YnViYmxlczpcdFx0dHJ1ZSxcclxuXHRcdFx0Y2FuY2VsYWJsZTpcdHRydWUsXHJcblx0XHRcdGNvbXBvc2VkOlx0XHR0cnVlXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0T2JqZWN0LmFzc2lnbihkb20uY3Vyc29yLnN0eWxlLFxyXG5cdHtcclxuXHRcdHRvcDpcdFx0XHQnMHB4JyxcclxuXHRcdGhlaWdodDpcdFx0JzIwcHgnLFxyXG5cdFx0d2lkdGg6XHRcdCcxNHB4JyxcclxuXHRcdHBvc2l0aW9uOlx0J2Fic29sdXRlJyxcclxuXHRcdHpJbmRleDpcdFx0ODAwLFxyXG5cdFx0cG9pbnRlckV2ZW50Olx0J25vbmUnXHJcblx0fSk7XHJcblx0ZG9tLmN1cnNvci5zdHlsZS5zZXRQcm9wZXJ0eSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScsICdpbXBvcnRhbnQnKTtcclxuXHRjb25zdCBkw6ljYWxhZ2UgPSB7eDogMCwgeTogMH07XHJcblx0Y29uc3QgdHlwZWN1cnNvciA9IFxyXG5cdHtcclxuXHRcdG5vcm1hbCA6IHt4OiAwLCB5OiAwfSxcclxuXHRcdGRlY2xlbmNoZXIgOiB7eDogMCwgeTogMH0sXHJcblx0XHRkZXBsYWNlciA6IHt4OiAwLCB5IDogMH1cclxuXHR9O1xyXG5cdGxldCBjdXJzb3JBY3R1ZWwgPSAnbm9ybWFsJztcclxuXHRsZXQgY3Vyc29yQmxvcXXDqSA9IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMuYmxvcXVlciA9ICgpID0+XHJcblx0e1xyXG5cdFx0aWYoY3Vyc29yQmxvcXXDqSkgdGhyb3cgbmV3IEVycm9yKCd5YmFzdGhpc0FwcGxpY2F0aW9uLnN5c3RlbWVQb2ludGFnZS5ibG9xdWVyOiBwb2ludGV1ciBkw6lqw6AgYmxvcXXDqScpO1xyXG5cdFx0Y3Vyc29yQmxvcXXDqSA9IHRydWU7XHJcblx0fTtcclxuXHRcclxuXHR0aGlzLmTDqWJsb3F1ZXIgPSAoKSA9PlxyXG5cdHtcclxuXHRcdGlmKCFjdXJzb3JCbG9xdcOpKSB0aHJvdyBuZXcgRXJyb3IoJ3liYXN0aGlzQXBwbGljYXRpb24uc3lzdGVtZVBvaW50YWdlLmTDqWJsb3F1ZXI6IHBvaW50ZXVyIG5vbiBibG9xdcOpJyk7XHJcblx0XHRjdXJzb3JCbG9xdcOpID0gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0dGhpcy5wb3NpdGlvbiA9ICgpID0+IHNoYXJlZC5wb3NpdGlvbjtcclxuXHQvKipcclxuXHRcdERlZjpDaGFuZ2UgbGUgY3Vyc29yXHJcblx0XHRSZXRvdXI6IHZvaWRcclxuXHRcdEBlc3RBY3RpdmF0aW9uIGJvb2zDqWVuID0+IGluZGlxdWUgc2kgbGUgY3Vyc29yIHNpZ25hbGUgdW5lIGFjdGl2YXRpb25cclxuXHRcdEB0eXBlIGNoYWluZUNhcmFjdMOocmUgPT4gbGUgdHlwZSBkZSBjdXJzb3Igdm91bHVcclxuXHRcdFN1cHBsw6ltZW50OlxyXG5cdFx0XHRAdHlwZSBvcHRpb25uZWwgYXVxdWVsIGNhcyBzZXVsZW1lbnQgbGUgdHlwZSBkJ2FjdGl2YXRpb24gc2VyYSBtb2RpZmnDqS5cclxuXHQqKi9cclxuXHR0aGlzLmNoYW5nZUN1cnNvciA9IChlc3RBY3RpdmF0aW9uLCB0eXBlKSA9PlxyXG5cdHtcclxuXHRcdGxldCBjdXJzb3IgPSBjaGVtaW5jdXJzb3JzO1xyXG5cdFx0aWYoZXN0QWN0aXZhdGlvbiA9PT0gdHJ1ZSkgY3Vyc29yICs9ICdfJyA7XHJcblx0XHRpZih0eXBlKVxyXG5cdFx0e1xyXG5cdFx0XHRpZighdHlwZWN1cnNvclt0eXBlXSApIHRocm93IG5ldyBFcnJvcignY2hhbmdlbWVudCBkZSBjdXJzb3IgYXZlYyB1biB0eXBlIGludmFsaWRlOlx0JyArIHR5cGUpO1xyXG5cdFx0XHRjdXJzb3JBY3R1ZWwgPSB0eXBlO1xyXG5cdFx0XHRkw6ljYWxhZ2UueCA9IHR5cGVjdXJzb3JbdHlwZV0ueDtcclxuXHRcdFx0ZMOpY2FsYWdlLnkgPSB0eXBlY3Vyc29yW3R5cGVdLnk7XHJcblx0XHRcdGN1cnNvciArPSAgdHlwZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgY3Vyc29yICs9ICBjdXJzb3JBY3R1ZWw7XHJcblx0XHRkb20uY3Vyc29yLnNyYyA9IGN1cnNvciArICcucG5nJztcclxuXHR9O1xyXG5cdHRoaXMucXVhbmRNb3V2ZW1lbnQgPSBmbiA9PiBzaGFyZWQubGlzdGVuZXJzLnB1c2goZm4pO1xyXG5cdFxyXG5cdHRyeSBcclxuXHR7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHRoaXMuY2hhbmdlQ3Vyc29yKHRydWUpICk7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB0aGlzLmNoYW5nZUN1cnNvcihmYWxzZSkgKTtcclxuXHRcdHliYXN0aGlzLmRvbS5jb250ZW5ldXIuYXBwZW5kQ2hpbGQoZG9tLmN1cnNvcik7XHJcblx0XHRkb20uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHR5YmFzdGhpcy5kb20uY29udGVuZXVyLmFwcGVuZENoaWxkKGRvbS5jYW52YXMpO1xyXG5cdFx0Y29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKHliYXN0aGlzLmRvbS5kZXNrdG9wKTtcclxuXHRcdHNoYXJlZC5hcmVhU2l6ZS54ID0geWJhc3RoaXMudXRpbGl0YWlyZXMuZ3JhbmRldXJzLmVubGV2ZXJVbml0w6koY3Mud2lkdGgpO1xyXG5cdFx0c2hhcmVkLmFyZWFTaXplLnkgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqShjcy5oZWlnaHQpO1xyXG5cdFx0c3RhcnRDYXB0dXJlKHNoYXJlZCk7XHJcblx0XHRldmVudEJpbmRpbmcoc2hhcmVkKTtcclxuXHRcdHBvaW50ZXJPbk1vdmVJbml0KHNoYXJlZCk7XHJcblx0fVxyXG5cdGNhdGNoKGVycilcclxuXHR7XHJcblx0XHRjb25zb2xlLmxvZygnZXJySW5pdGlhbGlzYXRpb24gbW9kdWxlOlx0JywgZXJyKTtcclxuXHR9XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS80L2d1aS9zeXN0ZW1lUG9pbnRhZ2UuanMiLCJpbXBvcnQgV2luZG93IGZyb20gJy4vV2luZG93LmpzJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKVxyXG57XHJcblx0LyoqKioqKioqKioqKioqKj5cclxuXHQvL1x0UFJJVkVcdCAgIC8vXHJcblx0PCoqKioqKioqKioqKioqKi9cclxuXHRcdGNvbnN0IGTDqWNhbGFnZVB4ID0ge3ggOiBudWxsLCB5IDogbnVsbH07XHJcblx0XHRjb25zdCBkw6lwbGFjZXIgPSAow6l0YXQpID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IHBvaW50ZXVyUG9zaXRpb24gPSB5YmFzdGhpcy5zeXN0ZW1lUG9pbnRhZ2UucG9zaXRpb24oKTtcclxuXHRcdFx0c3dpdGNoKMOpdGF0KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2FzZSAnZMOpYnV0JzpcclxuXHRcdFx0XHRcdGTDqWNhbGFnZVB4LnggPSBwb2ludGV1clBvc2l0aW9uLnggLSBmZW5ldHJlRW5Ew6lwbGFjZW1lbnQucG9zLng7XHJcblx0XHRcdFx0XHRkw6ljYWxhZ2VQeC55ID0gZmVuZXRyZUVuRMOpcGxhY2VtZW50LnBvcy55IC0gcG9pbnRldXJQb3NpdGlvbi55O1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2VuY291cnMnOlxyXG5cdFx0XHRcdFx0aWYoZmVuZXRyZUVuRMOpcGxhY2VtZW50KVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRmZW5ldHJlRW5Ew6lwbGFjZW1lbnQucG9zaXRpb25uZXJcclxuXHRcdFx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0XHRcdHBvaW50ZXVyUG9zaXRpb24ueCAtIGTDqWNhbGFnZVB4LngsIFxyXG5cdFx0XHRcdFx0XHRcdHBvaW50ZXVyUG9zaXRpb24ueSArIGTDqWNhbGFnZVB4LnlcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgcmV0dXJuO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2Zpbic6XHJcblx0XHRcdFx0XHRpZihmZW5ldHJlRW5Ew6lwbGFjZW1lbnQgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZmVuZXRyZUVuRMOpcGxhY2VtZW50ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0XHRkw6ljYWxhZ2VQeC54ID0gMDtcclxuXHRcdFx0XHRcdFx0ZMOpY2FsYWdlUHgueSA9IDA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHJldHVybjtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZmVuZXRyZUVuRMOpcGxhY2VtZW50ID0gdW5kZWZpbmVkO1xyXG5cdFx0dmFyIGluZGV4UHJlbWllclBsYW4gPSAwO1xyXG5cdC8qKioqKioqKioqKioqKio+XHJcblx0Ly9cdFBVQkxJUVVFICAgLy9cclxuXHQ8KioqKioqKioqKioqKioqL1xyXG5cdFx0dGhpcy5pbml0aWFsaXNlckTDqXBsYWNlbWVudCA9IGZlbmV0cmUgPT5cclxuXHRcdHtcclxuXHRcdFx0ZmVuZXRyZUVuRMOpcGxhY2VtZW50ID0gZmVuZXRyZTtcclxuXHRcdFx0ZMOpcGxhY2VyKCdkw6lidXQnKTtcclxuXHRcdH07XHJcblx0XHR0aGlzLldpbmRvdyA9IFdpbmRvdztcclxuXHRcdHRoaXMubGlzdGUgPSBuZXcgeWJhc3RoaXMudHlwZXNEb25uZWVzLkxpc3RlKCk7XHJcblx0XHR0aGlzLnRvRmlyc3RQbGFuID0gd2luZG93ID0+IHdpbmRvdy5kb20uc3R5bGUuekluZGV4ID0gaW5kZXhQcmVtaWVyUGxhbisrO1xyXG5cdC8qKioqKioqKioqKioqKio+XHJcblx0Ly9cdEVWRU5FTUVOVFMgLy9cclxuXHQ8KioqKioqKioqKioqKioqL1xyXG5cdFx0eWJhc3RoaXMuc3lzdGVtZVBvaW50YWdlLnF1YW5kTW91dmVtZW50KCgpID0+IGTDqXBsYWNlcignZW5jb3VycycpICk7XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4gZMOpcGxhY2VyKCdmaW4nKSApO1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNC9ndWkvd2luZG93cy5qcyIsIlx0J3VzZSBzdHJpY3QnO1xyXG5cdGNvbnN0IGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKHNlbGVjdGlvbkRvbUV4dGVybmUpXHJcblx0e1xyXG5cdFx0Y29uc3QgaVJlZiA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuUmVmZXJlbmNlO1xyXG5cdFx0Y29uc3QgaW5kZXggPSBbXTtcclxuXHRcdGNvbnN0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHJcblx0XHRsZXQgc2VsZWN0aW9uT3V2ZXJ0ZSA9IGZhbHNlO1xyXG5cdFx0ZG9tLnN0eWxlLnpJbmRleCA9ICc1MDAwJztcclxuXHRcdGRvbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRkb20uc3R5bGUuaGVpZ2h0ID0gJzY0cHgnO1xyXG5cdFx0ZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdGRvbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0Ly9kb20uc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCBibGFjayc7XHJcblx0XHR5YmFzdGhpcy5kb20uZGVza3RvcC5hcHBlbmRDaGlsZChkb20pO1xyXG5cdFx0XHJcblx0XHRzZWxlY3Rpb25Eb21FeHRlcm5lLmNob2l4ID0gaW5kZXg7XHJcblx0XHRzZWxlY3Rpb25Eb21FeHRlcm5lLlN1cHByaW1lckNob2l4XHQ9IHJlZiA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpbmRleFtyZWZdLnJlbW92ZSgpO1xyXG5cdFx0XHRpUmVmLnN1cHByaW1lcihyZWYpO1xyXG5cdFx0XHRyZXR1cm4gcmVmO1xyXG5cdFx0fTtcclxuXHRcdHNlbGVjdGlvbkRvbUV4dGVybmUuYWpvdXRlckNob2l4ID0gKGRvbUVsZW1lbnQpID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IHJlZiA9IGlSZWYub2J0ZW5pcigpO1xyXG5cdFx0XHRkb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IChzZWxlY3Rpb25Eb21FeHRlcm5lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDIpICsgJ3B4JztcclxuXHRcdFx0ZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHRcdGRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XHJcblx0XHRcdGRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gJzBweCc7XHJcblx0XHRcdFxyXG5cdFx0XHRkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IGRvbUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlKTtcclxuXHRcdFx0ZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IGRvbUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyKTtcclxuXHRcclxuXHRcdFx0ZG9tLmFwcGVuZENoaWxkKGRvbUVsZW1lbnQpO1xyXG5cdFx0XHRcclxuXHRcdFx0aW5kZXhbcmVmXSA9IGRvbS5sYXN0Q2hpbGQ7XHJcblx0XHRcdHJldHVybiByZWY7XHJcblx0XHR9O1xyXG5cdFxyXG5cdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS52ZXJyb3VpbGxlclxyXG5cdFx0KFxyXG5cdFx0XHQoZWxlbWVudCkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGVjdGlvbk91dmVydGUgPSB0cnVlO1xyXG5cdFx0XHRcdGNvbXBvc2FudERvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzRm9uY2U7XHJcblx0XHRcdFx0Y29uc3QgaW5mb3MgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdFx0XHRkb20uc3R5bGUudG9wID0gKGluZm9zLnRvcCArIGluZm9zLmhlaWdodCkgKyAncHgnO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS5sZWZ0ID0gaW5mb3MubGVmdCArICdweCc7XHJcblx0XHRcdFx0ZG9tLnN0eWxlLndpZHRoID0gaW5mb3Mud2lkdGggKyAncHgnO1xyXG5cdFx0XHRcdGRvbS5zdHlsZS5oZWlnaHQgPSAoKGluZm9zLmhlaWdodCAvIDIpICogZG9tLmNoaWxkcmVuLmxlbmd0aCkgKyAyICsgJ3B4JztcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGVjdGlvbk91dmVydGUgPSBmYWxzZTtcclxuXHRcdFx0XHRkb20uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0XHRjb21wb3NhbnREb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cdFx0Y29uc3Qgc2VsZWN0aW9uRG9tSW50ZXJuZSA9IHNlbGVjdGlvbkRvbUV4dGVybmUuc2hhZG93Um9vdDtcclxuXHRcdGNvbnN0IGNvbXBvc2FudERvbSA9IHNlbGVjdGlvbkRvbUludGVybmUucXVlcnlTZWxlY3RvcignI2NvbXBvc2FudCcpO1xyXG5cdFx0Ly9jb21wb3NhbnREb20uc3R5bGUuaGVpZ2h0ID0gJzQ0cHgnO1xyXG5cdFx0Y29tcG9zYW50RG9tLnN0eWxlLm1pbldpZHRoID0gJzRlbSc7XHJcblx0XHRjb21wb3NhbnREb20uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0Y29tcG9zYW50RG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNGb25jZTtcclxuXHRcdH0gKTtcclxuXHRcdGNvbXBvc2FudERvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+XHJcblx0XHR7XHJcblx0XHRcdGlmKCFzZWxlY3Rpb25PdXZlcnRlKSBjb21wb3NhbnREb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdFx0XHRcclxuXHRcdH0gKTtcclxuXHRcdFxyXG5cdFx0eWJhc3RoaXMubXV0YXRpb25TZW5zb3IubmV3QXNBdHRyaWJ1dGVzKHNlbGVjdGlvbkRvbUV4dGVybmUsIFsnbm9tJ10sICgpID0+XHJcblx0XHR7XHJcblx0XHRcdGxldCB0aXRyZURvbSA9IGNvbXBvc2FudERvbS5xdWVyeVNlbGVjdG9yKCcjdGl0cmUnKTsgXHJcblx0XHRcdHRpdHJlRG9tLmlubmVySFRNTCA9IHNlbGVjdGlvbkRvbUV4dGVybmUuZ2V0QXR0cmlidXRlKCdub20nKTtcclxuXHRcdFx0Ly90aXRyZURvbS5zdHlsZS53aWR0aCA9ICdhdXRvJztcclxuXHRcdFx0eWJhc3RoaXMubXV0YXRpb25TZW5zb3IubmV3QXNTdHlsZUV4cGVjdGVkXHJcblx0XHRcdChcclxuXHRcdFx0XHR0aXRyZURvbSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRuYW1lOlx0XHRcdCd3aWR0aCcsXHJcblx0XHRcdFx0XHRleHBlY3RlZDpcdCdhdXRvJyxcclxuXHRcdFx0XHRcdGlzRXF1YWw6XHRmYWxzZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0KCkgPT5cclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsZXQgbGFyZ2V1clLDqWVsbGVUaXRyZSA9IHliYXN0aGlzLnV0aWxpdGFpcmVzLmdyYW5kZXVycy5lbmxldmVyVW5pdMOpKGdldENvbXB1dGVkU3R5bGUodGl0cmVEb20pLndpZHRoKTtcclxuXHRcdFx0XHRcdGxldCBsYXJnZXVyUsOpZWxsZVNlbGVjdGlvbiA9IHliYXN0aGlzLnV0aWxpdGFpcmVzLmdyYW5kZXVycy5lbmxldmVyVW5pdMOpKGdldENvbXB1dGVkU3R5bGUoY29tcG9zYW50RG9tLnF1ZXJ5U2VsZWN0b3IoJyNtYXJxdWV1clNlbGVjdGlvbicpICkud2lkdGgpO1xyXG5cdFx0XHRcdFx0Y29tcG9zYW50RG9tLnN0eWxlLndpZHRoID0gdGl0cmVEb20ub2Zmc2V0V2lkdGggKyBsYXJnZXVyUsOpZWxsZVNlbGVjdGlvbiArIDUgKyAncHgnO1xyXG5cdFx0XHRcdFx0c2VsZWN0aW9uRG9tRXh0ZXJuZS5zdHlsZS53aWR0aCA9IGNvbXBvc2FudERvbS5zdHlsZS53aWR0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHR9KTtcclxuXHRcdC8vY29uc29sZS5sb2coJ2VqYXInLCBzZWxlY3Rpb25Eb21FeHRlcm5lLCBzZWxlY3Rpb25Eb21FeHRlcm5lLmdldEF0dHJpYnV0ZSgnbm9tJykpO1xyXG5cdFx0XHJcblx0XHRsZXQgbGFyZ2V1ck9jY3Vww6kgPSAwO1xyXG5cdFx0Y29uc3Qgb3V0aWxzRW5sZXZlclB4ID0gdGFpbGxlID0+IHZvaWQodGFpbGxlID0gdGFpbGxlLnNwbGl0KCcnKSwgdGFpbGxlLnBvcCgpLCB0YWlsbGUucG9wKCkgKSB8fCBOdW1iZXIodGFpbGxlLmpvaW4oJycpICk7XHJcblx0XHRmb3IobGV0IGVuZmFudCBvZiBjb21wb3NhbnREb20uY2hpbGRyZW4pXHJcblx0XHR7XHJcblx0XHRcdC8vY29uc29sZS5sb2coZW5mYW50LCBlbmZhbnQub2Zmc2V0V2lkdGgpO1xyXG5cdFx0XHRsYXJnZXVyT2NjdXDDqSArPSBlbmZhbnQub2Zmc2V0V2lkdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9jb25zb2xlLmxvZyhsYXJnZXVyT2NjdXDDqSk7XHJcblx0XHQvL2NvbXBvc2FudERvbS5zdHlsZS53aWR0aCA9IGxhcmdldXJPY2N1cMOpICsgJ3B4JztcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH07XHJcblx0Y29uc3QgdGVtcGxhdGUgPVxyXG5cdGBcclxuXHRcdDx0ZW1wbGF0ZT5cclxuXHRcdFx0PGRpdiBpZD0nY29tcG9zYW50JyA+XHJcblx0XHRcdFx0PGRpdiBpZD0ndGl0cmUnID48L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGlkPSdtYXJxdWV1clNlbGVjdGlvbicgPiYjODc0NDs8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcclxuXHRcdFx0PHN0eWxlPlxyXG5cdFx0XHRcdCNjb21wb3NhbnRcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRwb3NpdGlvbiA6XHRyZWxhdGl2ZTtcclxuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3IgOiAjYjViM2IzO1xyXG5cdFx0XHRcdFx0dG9wOiAwcHg7XHJcblx0XHRcdFx0XHRkaXNwbGF5OiBncmlkO1xyXG5cdFx0XHRcdFx0Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIDFlbTtcclxuXHRcdFx0XHRcdGdyaWQtdGVtcGxhdGUtcm93czogMTAwJTtcclxuXHRcdFx0XHRcdGdyaWQtdGVtcGxhdGUtYXJlYXM6IFwidGl0cmUgdHlwZVwiO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jbGlwXHQ6XHRcdGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHRib3JkZXItc3R5bGVcdDpcdFx0XHRvdXRzZXQ7XHJcblx0XHRcdFx0XHRib3JkZXItd2lkdGhcdDpcdFx0XHQycHg7XHJcblx0XHRcdFx0XHRib3JkZXItY29sbGFwc2VcdDpcdFx0c2VwYXJhdGU7XHJcblx0XHRcdFx0XHRib3JkZXItc3BhY2luZ1x0Olx0XHQwcHggMHB4O1xyXG5cdFx0XHRcdFx0Ym9yZGVyLWNvbG9yXHQ6XHRcdFx0cmdiKDIyNywgMjI3LCAyMjcpO1xyXG5cdFx0XHRcdFx0Ym94LXNpemluZ1x0Olx0XHRcdFx0Ym9yZGVyLWJveDtcclxuXHRcdFx0XHRcdHRyYW5zZm9ybS1ib3hcdDpcdFx0Ym9yZGVyLWJveDtcclxuXHRcdFx0XHRcdHdpZHRoIDogYXV0bztcclxuXHRcdFx0XHRcdG1pbi1oZWlnaHQgOiAxLjVlbTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0I3RpdHJlXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0dG9wOiAwcHg7XHJcblx0XHRcdFx0XHRncmlkLWFyZWE6IHRpdHJlO1xyXG5cdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRcdFx0XHRcdG1hcmdpbi1sZWZ0OiAwLjVlbTtcclxuXHRcdFx0XHRcdG1hcmdpbi1yaWdodDogMC41ZW07XHJcblx0XHRcdFx0XHR3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG5cdFx0XHRcdFx0Zm9udC13ZWlnaHQgOiA3MDA7XHJcblx0XHRcdFx0XHRoZWlnaHQgOiBhdXRvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQjbWFycXVldXJTZWxlY3Rpb25cclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0XHR0b3A6IDBweDtcclxuXHRcdFx0XHRcdGdyaWQtYXJlYTogdHlwZTtcclxuXHRcdFx0XHRcdHJpZ2h0IDogMHB4O1xyXG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xyXG5cdFx0XHRcdFx0cGFkZGluZy10b3AgOiBjYWxjKDUwJSAgLSAwLjdlbSk7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yIDogZ3JleTtcclxuXHRcdFx0XHRcdGhlaWdodCA6IGF1dG87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQ8L3N0eWxlPlxyXG5cdFx0PC90ZW1wbGF0ZT5gO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ3NlbGVjdGlvbicsXHJcblx0dGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZSxcclxuXHRjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL19fc2VsZWN0aW9uMi5qcyIsInZhciBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihlbEJvdXRvbkV4dGVybmUpXHJcbntcclxuXHRcclxuXHRjb25zdCBlbEJvdXRvbkludGVybmUgPSBlbEJvdXRvbkV4dGVybmUuc2hhZG93Um9vdDtcclxuXHRjb25zdCBib3V0b24gPSBlbEJvdXRvbkludGVybmUucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcclxuXHRcclxuXHRib3V0b24uYXBwbGlxdWVyQm9yZHVyZSgpO1xyXG5cdGVsQm91dG9uRXh0ZXJuZS5jaGFuZ2VyTGFiZWwgPSB0ZXh0ZSA9PiBib3V0b24udmFsdWUgPSB0ZXh0ZTtcclxuXHRlbEJvdXRvbkV4dGVybmUuZW5sZXZlckVmZmV0cyA9ICgpXHQ9PiBib3V0b24uc3R5bGUuYm94U2hhZG93ID0gJ25vbmUnO1xyXG5cdFxyXG5cdFxyXG5cdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHJcblx0Ym91dG9uLnZhbHVlID0gZWxCb3V0b25FeHRlcm5lLmlubmVySFRNTDtcclxuXHRcclxuXHRib3V0b24uYWRkRXZlbnRMaXN0ZW5lclxyXG5cdCgnbW91c2VvdmVyJyxcclxuXHRcdGZ1bmN0aW9uKClcclxuXHRcdHtcdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzRm9uY2U7XHR9LFxyXG5cdFx0ZmFsc2VcdFxyXG5cdCk7XHJcblx0Ym91dG9uLmFkZEV2ZW50TGlzdGVuZXJcclxuXHQoJ21vdXNlb3V0JyxcclxuXHRcdGZ1bmN0aW9uKClcclxuXHRcdHtcdGJvdXRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB5YmFzdGhpcy5jaGFydGVVaS5ncmlzQ2xhaXI7XHR9LFxyXG5cdFx0ZmFsc2VcclxuXHQpO1xyXG5cclxuXHQvKipcclxuXHRcdFN0eWxlXHJcblx0KiovXHJcblx0XHJcblx0Y29uc3Qgc3R5bGVFeHRlcm5lID0gZWxCb3V0b25FeHRlcm5lLnN0eWxlO1xyXG5cdGJvdXRvbi5hZGRFdmVudExpc3RlbmVyKCdpbnNlcnRpb25Eb20nLCBlZSA9PlxyXG5cdHtcclxuXHRcdC8vY29uc29sZS5sb2coJ1dJRFRIIEJUTjogJywgZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoLCBib3V0b24pO1xyXG5cdH0gKTtcclxuXHRlbEJvdXRvbkV4dGVybmUuYWRkRXZlbnRMaXN0ZW5lcignaW5zZXJ0aW9uRG9tJywgZWUgPT5cclxuXHR7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdXSURUSCBCQVRIOiAnLCBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGgsIGJvdXRvbik7XHJcblx0fSApO1xyXG5cdGlmKHN0eWxlRXh0ZXJuZS53aWR0aCA9PT0gJycpXHJcblx0e1xyXG5cdFx0c3R5bGVFeHRlcm5lLndpZHRoID0gJ2F1dG8nO1xyXG5cdFx0Ly9jb25zb2xlLmxvZyhcImJhYmFyOiBcIiwgZWxCb3V0b25FeHRlcm5lLm9idGVuaXJTdHlsZUF1dGV1ckVsZW1lbnQoKSApO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZygncHV0ZScpO1xyXG5cdC8qeWJhc3RoaXMubXV0YXRpb25TZW5zb3IubmV3QXNTdHlsZUV4cGVjdGVkXHJcblx0KFxyXG5cdFx0ZWxCb3V0b25FeHRlcm5lLFxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOlx0XHRcdCd3aWR0aCcsXHJcblx0XHRcdGV4cGVjdGVkOlx0J2F1dG8nLFxyXG5cdFx0XHRpc0VxdWFsOlx0ZmFsc2VcclxuXHRcdH0sXHJcblx0XHRtdXRhdGlvbiA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zb2xlLmxvZygncGlwaScsIG11dGF0aW9uLnRhcmdldCk7XHJcblx0XHRcdHN0eWxlRXh0ZXJuZS53aWR0aCA9IGdldENvbXB1dGVkU3R5bGUoZWxCb3V0b25FeHRlcm5lKS53aWR0aDtcclxuXHRcdFx0Ym91dG9uLnN0eWxlLndpZHRoID0gc3R5bGVFeHRlcm5lLndpZHRoO1xyXG5cdFx0fVxyXG5cdCk7XHJcblx0eWJhc3RoaXMubXV0YXRpb25TZW5zb3IubmV3QXNTdHlsZUV4cGVjdGVkXHJcblx0KFxyXG5cdFx0ZWxCb3V0b25FeHRlcm5lLFxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lOlx0XHRcdCdoZWlnaHQnLFxyXG5cdFx0XHRleHBlY3RlZDpcdCdhdXRvJyxcclxuXHRcdFx0aXNFcXVhbDpcdGZhbHNlXHJcblx0XHR9LFxyXG5cdFx0bXV0YXRpb24gPT5cclxuXHRcdHtcclxuXHRcdFx0c3R5bGVFeHRlcm5lLmhlaWdodCA9IGdldENvbXB1dGVkU3R5bGUoZWxCb3V0b25FeHRlcm5lKS5oZWlnaHQ7XHJcblx0XHRcdGJvdXRvbi5zdHlsZS5oZWlnaHQgPSBzdHlsZUV4dGVybmUuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdCk7Ki9cclxuXHQvKnliYXN0aGlzLnV0aWxpdGFpcmVzLldIRU4oKCkgPT4gZ2V0Q29tcHV0ZWRTdHlsZShlbEJvdXRvbkV4dGVybmUpLndpZHRoICE9PSAnYXV0bycsXHJcblx0KCkgPT5cclxuXHR7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdsYXJnZXVyJywgZWxCb3V0b25FeHRlcm5lLCBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGgpO1xyXG5cdFx0Ly9zdHlsZUV4dGVybmUud2lkdGggPSBnZXRDb21wdXRlZFN0eWxlKGJvdXRvbikud2lkdGg7XHJcblx0XHRib3V0b24uc3R5bGUud2lkdGggPSBnZXRDb21wdXRlZFN0eWxlKGVsQm91dG9uRXh0ZXJuZSkud2lkdGg7XHJcblx0fSk7XHJcblx0Ly9zdHlsZUV4dGVybmUuYm94U2hhZG93ID0gJzBweCAwcHggOHB4IDNweCB3aGl0ZSc7XHJcblx0Ki9cdFxyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxudmFyIHRlbXBsYXRlID1cclxuYFxyXG5cdDx0ZW1wbGF0ZT5cclxuXHRcdDxpbnB1dCB0eXBlPVwic3VibWl0XCIgbmFtZT1cIlwiIHZhbHVlPVwiXCIgLz5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0aW5wdXRcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0XHRcdHJlbGF0aXZlO1xyXG5cdFx0XHRcdGRpc3BsYXk6XHRcdFx0YmxvY2s7XHJcblx0XHRcdFx0Zm9udC13ZWlnaHQ6XHQ3MDA7XHJcblx0XHRcdFx0dGV4dC1hbGlnbjpcdFx0Y2VudGVyO1xyXG5cdFx0XHRcdGN1cnNvcjpcdFx0XHRcdHBvaW50ZXI7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHRcdFx0MTAwJTtcclxuXHRcdFx0XHR3aWR0aDpcdFx0XHRcdDEwMCU7XHJcblx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0PC90ZW1wbGF0ZT5cclxuYDtcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tXHRcdFx0XHQ6ICdib3V0b24nXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9ib3V0b24uanMiLCJ2YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxDb2NoZXIpXHJcbntcclxuXHR2YXIgdmFsZXVyID0gZWxDb2NoZXIuZ2V0QXR0cmlidXRlKFwidmFsZXVyXCIpO1xyXG5cclxuXHR2YXIgYm91dG9uID0gZWxDb2NoZXIuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdkaXYnKTtcclxuXHRcclxuXHRpZighdmFsZXVyKXtcdHZhbGV1ciA9IGZhbHNlO1x0fVxyXG5cdGVsc2V7XHRib3V0b24uaW5uZXJIVE1MID0gJ1gnO1x0fVxyXG5cdFxyXG5cdGJvdXRvbi5hZGRFdmVudExpc3RlbmVyXHJcblx0KFxyXG5cdFx0J2NsaWNrJ1xyXG5cdFx0LGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0dmFsZXVyID0gIXZhbGV1cjtcclxuXHRcdFx0aWYodmFsZXVyKVxyXG5cdFx0XHR7XHRib3V0b24uaW5uZXJIVE1MID0gJ1gnO1x0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcdGJvdXRvbi5pbm5lckhUTUwgPSAnJztcdH1cclxuXHRcdFx0ZWxDb2NoZXIuc2V0QXR0cmlidXRlKCd2YWxldXInLCB2YWxldXIpO1xyXG5cdFx0XHRcclxuXHRcdH0sXHJcblx0XHRmYWxzZVxyXG5cdCk7XHJcblx0Ym91dG9uLmFkZEV2ZW50TGlzdGVuZXJcclxuXHQoJ21vdXNlb3ZlcicsXHJcblx0XHRmdW5jdGlvbigpXHJcblx0XHR7XHRib3V0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0ZvbmNlO1x0fSxcclxuXHRcdGZhbHNlXHJcblx0KTtcclxuXHRib3V0b24uYWRkRXZlbnRMaXN0ZW5lclxyXG5cdCgnbW91c2VvdXQnLFxyXG5cdFx0ZnVuY3Rpb24oKVxyXG5cdFx0e1x0Ym91dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcdH0sXHJcblx0XHRmYWxzZVxyXG5cdCk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID1cclxuYFxyXG5cdDx0ZW1wbGF0ZT5cclxuXHRcdDxkaXY+PC9kaXY+XHJcblx0XHQ8c3R5bGU+XHJcblx0XHRcdGRpdlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGVpZ2h0OjMycHg7XHJcblx0XHRcdFx0d2lkdGg6IDMycHg7XHJcblx0XHRcdFx0Ym9yZGVyLWNvbG9yXHRcdDogYmxhY2s7XHJcblx0XHRcdFx0Ym9yZGVyLXN0eWxlXHRcdDogc29saWQ7XHJcblx0XHRcdFx0Ym9yZGVyLXdpZHRoXHRcdDogMXB4O1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3JcdDogd2hpdGU7XHJcblx0XHRcdFx0Zm9udC13ZWlnaHRcdFx0XHQ6IDcwMDtcclxuXHRcdFx0XHRmb250LXNpemVcdFx0XHQ6IDJlbTtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yXHQ6ICNiNWIzYjM7XHJcblx0XHRcdFx0Y29sb3JcdFx0XHRcdDogZ3JlZW47XHJcblx0XHRcdFx0dGV4dC1hbGlnblx0XHRcdDogY2VudGVyO1xyXG5cdFx0XHRcdGxpbmUtaGVpZ2h0XHRcdFx0OiAyOHB4O1xyXG5cdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ2Nhc2VDb2NoZXInXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9jYXNlQ29jaGVyLmpzIiwidmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsQ2hvaXgpXHJcbntcclxuXHRcclxuXHR2YXIgb3B0aW9uID0gZWxDaG9peC5nZXRBdHRyaWJ1dGUoXCJvcHRpb25cIik7XHJcblx0XHRcdFx0XHRcdFxyXG5cdGNvbnN0IGVsZW1lbnRDb250ZW5ldXIgPSBlbENob2l4LnBhcmVudEVsZW1lbnQ7XHJcblx0Y29uc3QgdHlwZSA9IGVsZW1lbnRDb250ZW5ldXIuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XHJcblx0Y29uc3Qgbm9tID0gZWxDaG9peC5nZXRBdHRyaWJ1dGUoJ25vbScpO1xyXG5cdGlmKGVsZW1lbnRDb250ZW5ldXIudGFnTmFtZSAhPT0gJ1lCLU9OR0xFVCcpIHRocm93IG5ldyBFcnJvcigndXRpbGlzYXRpb24gZFxcJ3VuIGNob2l4IO+/vSBsXFwnZXh0ZXJpZXVyIGRcXCd1biBvbmdsZXQnKTtcclxuXHRlbHNlIGlmKHR5cGUgIT09ICdzZWxlY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ3V0aWxpc2F0aW9uIGRcXCd1biBjaG9peCDvv70gbFxcJ2V4dGVyaWV1ciBkXFwndW4gb25nbGV0IGRlIHR5cGUgc2VsZWN0aW9uLCB0eXBlIGFjdHVlbDogJyArIHR5cGUpO1xyXG5cdGlmKCFub20gfHwgbm9tID09PSAnJykgdGhyb3cgbmV3IEVycm9yKCd1dGlsaXNhdGlvbiBkXFwndW4gY2hvaXggYXZlYyB1biBhdHRyaWJ1dCBAbm9tIG9ibGlnYXRvaXJlIG5vbiByZW5zZWlnbu+/vScpO1xyXG5cdFxyXG5cdGNvbnN0IGNob2l4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG5cdGNob2l4LmlubmVySFRNTCA9IG5vbTtcclxuXHRlbGVtZW50Q29udGVuZXVyLmRvbS5ham91dGVyQ2hvaXgoY2hvaXgpO1xyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbnZhciB0ZW1wbGF0ZSA9IGA8dGVtcGxhdGU+PC90ZW1wbGF0ZT5gO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ2Nob2l4J1xyXG5cdCx0ZW1wbGF0ZVx0XHQ6IHRlbXBsYXRlXHJcblx0LGNvbnN0cnVjdGV1clx0OiBjb25zdHJ1Y3RldXJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvYXBpLzUvZWxlbWVudHMvY2hvaXguanMiLCJ2YXIgdGVtcGxhdGUgPSBcclxuYFxyXG5cdDx0ZW1wbGF0ZT5cclxuXHRcdDxkaXYgaWQ9J2NvbnRlbmV1cic+XHJcblx0XHRcdDxkaXYgaWQ9J3RpdHJlJz5cclxuXHRcdFx0XHQ8cD48L3A+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGlkPSdnYWxsZXJpZSc+PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0cFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bWFyZ2luIDogMHB4O1xyXG5cdFx0XHR9XHJcblx0XHRcdCNjb250ZW5ldXJcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxMDAlO1xyXG5cdFx0XHRcdHdpZHRoXHQ6IDEwMCU7XHJcblx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0PC90ZW1wbGF0ZT5cclxuYDtcclxuXHJcbi8qKlxyXG5cdFVuZSBnYWxsZXJpZXMgcG9zc8OoZGUgY2VzIHByb3ByacOpdMOpcyBwcml2w6llczpcclxuXHRfZG9ubmVlcyAsIG1vZGVsZSwgb3JnYW5pc2V1ciwgbGVjdGV1ciwgdGFpbGxlVmlnbmV0dGUsIGZvcm1lVmlnbmV0dGUuXHJcblx0XHJcblx0X2Rvbm5lZXMgcmVwcsOpc2VudGUgbGVzIHZpZ25ldHRlcyBkZSBsYSBnYWxsZXJpZS5cclxuXHRtb2RlbGUgZXN0IHVuIHRhYmxlYXUgcmVwcsOpc2VudGFudCBsZSBub20gZGVzIHByb3ByacOpdMOpcyB2YWxpZGVzIHBvdXIgdW5lIGluc3RhbmNlIGRlIHZpZ25ldHRlXHJcblx0b3JnYW5pc2V1ciBmb25jdGlvbiBhcHDDqWzDqSBsb3JzIGRlIGwnYWZmaWNoYWdlXHJcblx0bGVjdGV1ciBmb25jdGlvbiBhcHBlbMOpIGxvcnMgZGUgbCdhZmZpY2hhZ2UgcG91ciBjaGFxdWUgdmlnbmV0dGVzXHJcblx0bm9tYnJlVmlnbmV0dGUgJ3BldGl0JzoxMCAnbW95ZW4nICdncmFuZCdcclxuXHRmb3JtZVZpZ25ldHRlICdjYXJyw6knICdyZWN0YW5nbGUnXHJcbioqL1xyXG52YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxJbnRlcmZhY2UpXHJcbntcclxuXHR2YXIgcXMgPSBzZWwgPT4gZWxJbnRlcmZhY2Uuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0dmFyIGNzID0gZ2V0Q29tcHV0ZWRTdHlsZTtcclxuXHRcclxuXHR2YXIgdGl0cmUgPSBlbEludGVyZmFjZS5nZXRBdHRyaWJ1dGUoJ3RpdHJlJyk7XHJcblx0cXMoJyN0aXRyZScpLnF1ZXJ5U2VsZWN0b3IoJ3AnKS5pbm5lckhUTUwgPSB0aXRyZTtcclxuXHRcclxuXHR2YXIgICBfZG9ubmVlcyA9IFtdLCBwb3MgPSAwLCBzcGVjaWFsaXNhdGlvbjtcclxuXHRcclxuXHRlbEludGVyZmFjZS5zcGVjaWFsaXNlciA9IChwYXJhbSkgPT5cclxuXHR7XHJcblx0XHRzcGVjaWFsaXNhdGlvbiA9IHBhcmFtO1xyXG5cdH07XHJcblx0ZWxJbnRlcmZhY2UuYWpvdXRlciA9ICgkZG9ubmVlcykgPT5cclxuXHR7XHJcblx0XHQvLyBOT1RFUyBMb3QgZGUgZG9ubsOpZXMuXHJcblx0XHRpZihhcmd1bWVudHNbMV0pXHJcblx0XHR7XHJcblx0XHRcdHZhciBhcmdUYWJsZWF1ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRcdFx0Zm9yKHZhciBkb25uZWUgb2YgYXJnVGFibGVhdSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIE5PVEVTIFRlc3Qgc2kgbGVzIGRvbm7DqWVzIHNvbnQgdmFsaWRlcy5cclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YXIgYXV0b3Jpc2U7XHJcblx0XHRcdFx0XHRmb3IodmFyIG5vbVByb3AgaW4gZG9ubmVlKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRhdXRvcmlzZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRmb3IodmFyIG5wQXV0b3Jpc2Ugb2Ygc3BlY2lhbGlzYXRpb24ubW9kZWxlKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aWYobm9tUHJvcCA9PSBucEF1dG9yaXNlKVxyXG5cdFx0XHRcdFx0XHRcdHtcdGF1dG9yaXNlID0gdHJ1ZTtcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighYXV0b3Jpc2Upe1x0dGhyb3cgbmV3IEVycm9yKCdEb25uw6llcyBub24gdmFsaWRlcycpO31cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2goZSl7XHR0aHJvdyBuZXcgRXJyb3IoZSk7XHR9XHJcblx0XHRcdFx0X2Rvbm5lZXMucHVzaChkb25uZWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRcclxuXHR2YXIgZWxHYWwgPSBxcygnI2dhbGxlcmllJyk7XHJcblx0ZWxJbnRlcmZhY2UuYWZmaWNoZXIgPSAoKSA9PlxyXG5cdHtcclxuXHRcdGZvcih2YXIgZSA9IDA7IGUgPCBlbEdhbC5jaGlsZHJlbjsgZSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRlbEdhbC5jaGlsZHJlbltlXS5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHRcdGlmKCFzcGVjaWFsaXNhdGlvbilcclxuXHRcdHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYXMgZGUgc3DDqWNpYWxpc2F0aW9uIEw5MiBGZ2FsbGVyaWUuanMnKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0dmFyIGRvbm5lZXNPcmRvbm5lZXMgPSBzcGVjaWFsaXNhdGlvbi5vcmdhbmlzYXRldXIoX2Rvbm5lZXMpO1xyXG5cdFx0XHR2YXIgdmlnbmV0dGU7XHJcblx0XHRcdGZvcih2YXIgaSA9MDsgaSA8IHNwZWNpYWxpc2F0aW9uLm5vbWJyZVZpZ25ldHRlOyBpKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2aWduZXR0ZSA9IGRvbm5lZXNPcmRvbm5lZXNbaSArIHBvc107XHJcblx0XHRcdFx0ZWxHYWwuYXBwZW5kQ2hpbGQoc3BlY2lhbGlzYXRpb24ubGVjdGV1cih2aWduZXR0ZSkgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fTtcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnZ2FsbGVyaWUnXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9nYWxsZXJpZS5qcyIsIlxyXG4vKipcclxuXHRVbmUgaW50ZXJmYWNlIGVzdCB1biBjb21wb3NhbnQgZG9tXHJcblx0Rm9uY3Rpb25uYWxpdMOpZXM6XHJcblx0XHRJXHQtc3RvY2tlciBkZXMgdnVlc1xyXG5cdFx0SUlcdC1hZmZpY2hlciB1bmUgdnVlXHJcblx0XHRJSUlcdC1nYXJkZXIgbCfDqXRhdCBkJ3VuZSB2dWVcclxuXHRcdElWXHQtYXBwbGlxdWVyIHVuZSBmb25jdGlvbiBsb3JzIGR1IHByZW1pZXIgdmlzaW9ubmFnZSBkJ3VuZSB2dWVcclxuXHRcdFZcdC1hcHBsaXF1ZXIgdW5lIGZvbmN0aW9uIGxvcnMgZGUgY2hhcXVlIHZpc2lvbm5hZ2UgZCd1bmUgdnVlXHJcblx0XHJcblx0VnVlXHRPYmplY3RcclxuXHRcdEVuc2VtYmxlIGQnw6lsw6ltZW50IGQnaW50ZXJmYWNlIGdyYXBoaXF1ZS5cclxuXHRcdEBub21cdFx0XHRcdFN0cmluZ1xyXG5cdFx0QG1vZGVsZVx0XHRcdEhUTUxFbGVtZW50XHJcblx0XHRAY29uc3RydWN0ZXVyXHRcdEZ1bmN0aW9uKEBAY29tcG9zYW50SW50ZXJmYWNlLCBAQHZ1ZUludGVyZmFjZSkgPT4gdm9pZCB8fCBGdW5jdGlvbihAQHZ1ZUludGVyZmFjZSk6XHJcblx0XHRcdEFwcGxpcXXDqSBsb3JzIGR1IHByZW1pZXIgdmlzaW9ubmFnZSBkJ3VuZSB2dWVcclxuXHRcdFx0U2kgcmV0b3VybmUgdW5lIGZvbmN0aW9uLCBlbGxlIHNlcmEgYXBwZWzDqWUgw6AgY2hhcXVlIHZpc2lvbm5hZ2VcclxuXHRcdFx0XHJcblx0QXR0ZW50aW9uLCBuZSBwYXMgY29uZm9uZHJlIGludGVyZmFjZSBhcHBsaWNhdGl2ZSBvdSBsJ2ludGVyZmFjZSBkJ3VuIG9iamV0IGF2ZWMgdW4gY29tcG9zYW50IGludGVyZmFjZVxyXG5cdFxyXG5cdEBham91dGVyKEBAdnVlKVxyXG5cdEBhZmZpY2hlcihAQG5vbVZ1ZSlcclxuKiovXHJcbntcclxuXHRjb25zdCBpbnRlcmZhY2VzID0ge307XHJcblx0Y29uc3QgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxJbnRlcmZhY2UpXHJcblx0e1xyXG5cdFx0LyoqXHJcblx0XHRcdFBSSVZFXHJcblx0XHQqKi9cclxuXHRcdFx0Y29uc3QgSUludGVyZmFjZU9iamV0ID0gbmV3IHliYXN0aGlzLnR5cGVzRG9ubmVlcy5JbnRlcmZhY2VUeXDDqWUoe2RvaXQ6XHJcblx0XHRcdHtcclxuXHRcdFx0XHRub206ICdzdHJpbmcnLCBtb2RlbGU6ICdzdHJpbmcnLCBjb25zdHJ1Y3RldXI6IEZ1bmN0aW9uXHJcblx0XHRcdH0gfSApO1xyXG5cdFx0XHRjb25zdCBpZCA9IGVsSW50ZXJmYWNlLm9idGVuaXJJZCgpO1xyXG5cdFx0LyoqXHJcblx0XHRcdFBVQkxJUVVFXHJcblx0XHQqKi9cdFxyXG5cdFx0ZWxJbnRlcmZhY2UuYWpvdXRlciA9ICh2dWUpID0+XHJcblx0XHR7XHJcblx0XHRcdHRyeXsgSUludGVyZmFjZU9iamV0LnZhbGlkZXIodnVlKTsgfVxyXG5cdFx0XHRjYXRjaChlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYoZS5lc3RGb3JtZWxsZSkgdGhyb3cgZTtcclxuXHRcdFx0XHRsZXQgZXJyID0gbmV3IFR5cGVFcnJvcignSW50ZXJmYWNlLmFqb3VydGVyQHZ1ZSBuZSBjb3JyZXNwb25kIHBhcyDDoCB1biBvYmpldCBkXFwnaW50ZXJmYWNlIScpLmxpZXIoZSk7XHJcblx0XHRcdFx0ZXJyLmRldGFpbHMuaW50ZXJmYWNlSWQgPSBpZDtcclxuXHRcdFx0XHRlcnIuZGV0YWlscy5vYmpldEludGVyZmFjZVJlw6d1ID0gdnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdF9FUlJFVVIoJ2ludGVyZmFjZS5ham91dGVyJywgZXJyKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUud2FybihlcnIubWVzc2FnZSwgZXJyLmRldGFpbHMpO1xyXG5cdFx0XHRcdHRocm93IGVycjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighaW50ZXJmYWNlc1tpZF1bdnVlLm5vbV0gKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGV0IG1vZGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdG1vZGVsZS5pbm5lckhUTUwgPSB2dWUubW9kZWxlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGludGVyZmFjZXNbaWRdW3Z1ZS5ub21dID0geyBjb25zdHJ1Y3RldXIgOiB2dWUuY29uc3RydWN0ZXVyLCBtb2RlbGUsIGluaXRpYWxpc8OpIDogZmFsc2V9O1xyXG5cdFx0XHRcdGlmKHZ1ZS5kZWZhdXQpIGludGVyZmFjZXNbaWRdWydfZGVmYXV0J10gPSB2dWUubm9tO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0ZWxJbnRlcmZhY2UuYWZmaWNoZXIgPSAkbm9tID0+XHJcblx0XHR7XHJcblx0XHRcdHRyeVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0eWJhc3RoaXMuY29udHJhdCh7ZG9pdCA6IFskbm9tLCBbJ3VuZGVmaW5lZCcsICdzdHJpbmcnXSBdIH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaChlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYoZS5lc3RGb3JtZWxsZSkgdGhyb3cgZTtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnRlcmZhY2UuYWZmaWNoZXJAJG5vbSBkb2l0IMOqdHJlIHVuIHN0cmluZyBvdSB1bmRlZmluZWQnKS5saWVyKGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR5YmFzdGhpcy5uYXZpZ2F0aW9uLnB1c2goJ2ludGVyZmFjZTogJyArIGlkICsgJyBhZmZpY2hhZ2U6ICcgKyAkbm9tKTtcclxuXHRcdFx0bGV0IG5vbSA9ICghJG5vbSk/ICdfZGVmYXV0JyA6ICRub207XHJcblx0XHRcdHRyeVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0eWJhc3RoaXMuY29udHJhdCh7ZG9pdCA6IFtpbnRlcmZhY2VzW2lkXVtub21dLCAnb2JqZWN0J10gfSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoKGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuZXcgRXJyb3IoJ0ludGVyZmFjZS5hZmZpY2hlckAkbm9teycgKyBub20gKyAnfSBuXFwnZXhpc3RlIHBhcyBkYW5zOiB7JyArIGlkICsgJ30nKVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQge21vZGVsZSwgY29uc3RydWN0ZXVyLCBpbml0aWFsaXPDqSwgaW5pdGlhbGlzZXVyfSA9IGludGVyZmFjZXNbaWRdW25vbV07XHJcblx0XHRcdC8qKiBTdXBwcmVzc2lvbiBkZSBsJ2FuY2llbm5lIHZ1ZSAqKi9cclxuXHRcdFx0Zm9yKGxldCBlbGVtZW50IG9mIGVsSW50ZXJmYWNlLnNoYWRvd1Jvb3QuY2hpbGRyZW4pIGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHRcdC8qKiBBam91dCBkYW5zIGxlIGRvbSBkZSBsYSBub3V2ZWxsZSB2dWUgKiovXHJcblx0XHRcdGVsSW50ZXJmYWNlLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQobW9kZWxlKTtcclxuXHRcdFx0Y29uc3QgdnVlSW50ZXJmYWNlID0gZWxJbnRlcmZhY2Uuc2hhZG93Um9vdC5sYXN0Q2hpbGQ7XHJcblx0XHRcdGlmKCFpbml0aWFsaXPDqSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGludGVyZmFjZXNbaWRdW25vbV0uaW5pdGlhbGlzZXVyID0gY29uc3RydWN0ZXVyKGVsSW50ZXJmYWNlLCB2dWVJbnRlcmZhY2UpO1xyXG5cdFx0XHRcdGludGVyZmFjZXNbaWRdW25vbV0uaW5pdGlhbGlzw6kgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYoaW5pdGlhbGlzZXVyKSBpbml0aWFsaXNldXIodnVlSW50ZXJmYWNlKTtcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gdnVlSW50ZXJmYWNlO1xyXG5cdFx0fTtcclxuXHRcdGVsSW50ZXJmYWNlLmxpc3RlSW50ZXJmYWNlcyA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0IHIgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBpZEludCBvZiBPYmplY3Qua2V5cyhpbnRlcmZhY2VzKSApIHIucHVzaChpbnRlcmZhY2VzW2lkSW50XSApO1xyXG5cdFx0XHRyZXR1cm4gcjtcclxuXHRcdH07XHJcblx0XHQvKipcclxuXHRcdFx0Q09OU1RSVUNURVVSXHJcblx0XHQqKi9cdFxyXG5cdFx0aWYoIWludGVyZmFjZXNbaWRdICkgaW50ZXJmYWNlc1tpZF0gPSB7fTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHRjb25zdCB0ZW1wbGF0ZSA9IFxyXG5cdGBcclxuXHRcdDx0ZW1wbGF0ZT5cclxuXHRcdDwvdGVtcGxhdGU+XHJcblx0YDtcclxuXHRtb2R1bGUuZXhwb3J0cyA9XHJcblx0e1xyXG5cdFx0bm9tXHRcdFx0XHQ6ICdpbnRlcmZhY2UnXHJcblx0XHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdFx0LGNvbnN0cnVjdGV1clx0OiBjb25zdHJ1Y3RldXJcclxuXHR9O1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9pbnRlcmZhY2UuanMiLCJ2YXIgY29uc3RydWN0ZXVyID0gZnVuY3Rpb24oZWxPbmdsZXQpXHJcbntcclxuXHRjb25zdCBlbGVtZW50TWVudSA9IGVsT25nbGV0LnBhcmVudEVsZW1lbnQ7XHJcblx0bGV0IHR5cGUgPSBudWxsLFxyXG5cdFx0ZWxlbWVudE1lbnVPbmdsZXQgPSBudWxsO1xyXG5cdFx0XHJcblx0aWYoZWxlbWVudE1lbnUudGFnTmFtZSAhPT0gJ1lCLU1FTlUnKSB0aHJvdyBuZXcgRXJyb3IoJ3liLW9uZ2xldCDDoCBsXFwnZXh0ZXJpZXVyIGRcXCd1biB0YWcgeWItbWVudScpO1xyXG5cdGlmKCFlbE9uZ2xldC5oYXNBdHRyaWJ1dGUoJ25vbScpICkgdGhyb3cgbmV3IEVycm9yKCd5Yi1vbmdsZXQgc2FucyBhdHRyaWJ1dCBub20nKTtcclxuXHRjb25zdCBub21PbmdsZXQgPSBlbE9uZ2xldC5nZXRBdHRyaWJ1dGUoJ25vbScpO1xyXG5cdFxyXG5cdGlmKCFlbE9uZ2xldC5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSApIHR5cGUgPSAnYm91dG9uJztcclxuXHRlbHNlIHR5cGUgPSBlbE9uZ2xldC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcclxuXHRcclxuXHRzd2l0Y2godHlwZSlcclxuXHR7XHJcblx0XHRjYXNlICdib3V0b24nOlxyXG5cdFx0XHRlbGVtZW50TWVudU9uZ2xldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3liLWJvdXRvbicpO1xyXG5cdFx0XHRlbGVtZW50TWVudU9uZ2xldC5jaGFuZ2VyTGFiZWwoZWxPbmdsZXQuZ2V0QXR0cmlidXRlKCdub20nKVx0KTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuc3R5bGUucG9zaXRpb25cdD0gJ3JlbGF0aXZlJztcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuYWRkRXZlbnRMaXN0ZW5lclxyXG5cdFx0XHQoXHJcblx0XHRcdFx0J2NsaWNrJyxcclxuXHRcdFx0XHQoKSA9PlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gJzBweCc7XHJcblx0XHRcdFx0XHRjb25zdCBldmVuZW1lbnRBZmZpY2hhZ2UgPSBuZXcgQ3VzdG9tRXZlbnRcclxuXHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0XCJhZmZpY2hhZ2VcIiwgXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRkZXRhaWw6XHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJib3V0b25cIixcclxuXHRcdFx0XHRcdFx0XHRcdGNpYmxlOiBub21PbmdsZXRcclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudE1lbnUuZGlzcGF0Y2hFdmVudChldmVuZW1lbnRBZmZpY2hhZ2UpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0ZmFsc2VcclxuXHRcdFx0KTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PmVsZW1lbnRNZW51T25nbGV0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gJzFweCcsIGZhbHNlKTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnN0eWxlLmJveFNoYWRvdyA9ICdub25lJztcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnc2VsZWN0aW9uJzpcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd5Yi1zZWxlY3Rpb24nKTtcclxuXHRcdFx0ZWxlbWVudE1lbnVPbmdsZXQuc2V0QXR0cmlidXRlKCdub20nLCBlbE9uZ2xldC5nZXRBdHRyaWJ1dGUoJ25vbScpICk7XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2VsT25nbGV0LCAnLCBlbGVtZW50TWVudU9uZ2xldCwgZWxPbmdsZXQpO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ3liLW9uZ2xldCBhdmVjIGF0dHJpYnV0IHR5cGUgaW5jb3JyZWN0IDogJyArIHR5cGUpO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdGVsZW1lbnRNZW51T25nbGV0LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRlbE9uZ2xldC5kb20gPSBlbGVtZW50TWVudU9uZ2xldDtcclxuXHRlbGVtZW50TWVudS5ham91dGVyT25nbGV0KGVsZW1lbnRNZW51T25nbGV0LCBmYWxzZSk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID0gXHJcbmBcdFx0XHJcblx0PHRlbXBsYXRlPjwvdGVtcGxhdGU+XHJcblxyXG5gO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ29uZ2xldCdcclxuXHQsdGVtcGxhdGVcdFx0OiB0ZW1wbGF0ZVxyXG5cdCxjb25zdHJ1Y3RldXJcdDogY29uc3RydWN0ZXVyXHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS81L2VsZW1lbnRzL21lbnUtb25nbGV0LmpzIiwiLy8gRm9uY3Rpb25uZSBlbiBhcHBhcmVuY2UsIG3Dqm1lIHNpIGNvZGUgaW52YWxpZGUhXHJcbi8vIETDuyBhdSBmYWl0IHF1ZSBsYSBsb2dpcXVlIGVzdCBjb2TDqSBkYW5zIGwnw6lsw6ltZW50IG9uZ2xldC5cclxudmFyIGNvbnN0cnVjdGV1ciA9IGZ1bmN0aW9uKGVsVGFiKVxyXG57XHJcblx0dmFyIGNvbnRlbmV1ciA9IHZ1ZUludGVybmUucXVlcnlTZWxlY3RvcignI2NvbnRlbmV1cicpO1x0XHJcblx0ZWxUYWIuc3R5bGUuZGlzcGxheVx0XHRcdD0gJ2lubGluZS1ibG9jayc7XHJcblx0ZWxUYWIuc3R5bGUuYmFja2dyb3VuZENvbG9yXHQ9ICdncmV5JztcclxuXHRlbFRhYi5zdHlsZS5vdmVyZmxvd1x0XHRcdD0gJ2hpZGRlbic7XHJcblx0dmFyICAgY3NcdD0gZ2V0Q29tcHV0ZWRTdHlsZVxyXG5cdFx0LCBlbE1lbnVcdD0gY29udGVuZXVyLnF1ZXJ5U2VsZWN0b3IoJyNtZW51JylcclxuXHQ7XHJcblx0XHJcbiBcdHZhciBlbE9uZ2xldFx0PSBlbFRhYi5xdWVyeVNlbGVjdG9yKCcjb25nbGV0Jyk7XHJcblx0ZWxPbmdsZXQuc3R5bGUuc2V0UHJvcGVydHkoJ2hlaWdodCcsIGNzKGVsVGFiKS5oZWlnaHQgLSAoY3MoZWxNZW51KS5oZWlnaHQpICsgJ3B4Jyk7XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuXHJcbnZhciB0ZW1wbGF0ZSA9IFxyXG5gXHJcblx0PHRlbXBsYXRlPlxyXG5cdFx0PGRpdiBpZD0nY29udGVuZXVyJz5cclxuXHRcdFx0PGRpdiBpZD0nbWVudSc+PC9kaXY+XHJcblx0XHRcdDxkaXYgaWQ9J29uZ2xldCc+PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHRcdFx0PHN0eWxlPlxyXG5cdFx0XHRcdCNjb250ZW5ldXJcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvdmVyZmxvd1x0XHQ6IGhpZGRlblxyXG5cdFx0XHRcdDtcdGRpc3BsYXlcdFx0XHQ6IGZsZXhcclxuXHRcdFx0XHQ7XHRmbGV4LWRpcmVjdGlvblx0OiBjb2x1bW5cclxuXHRcdFx0XHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdCNtZW51XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0ZGlzcGxheSBcdFx0XHQ6IGZsZXhcdFx0XHQhaW1wb3J0YW50XHJcblx0XHRcdFx0XHQ7ZmxleC1kaXJlY3Rpb25cdFx0OiByb3cgXHRcdFx0IWltcG9ydGFudFxyXG5cdFx0XHRcdFx0O2hlaWdodFx0XHRcdFx0OiAzNXB4XHJcblx0XHRcdFx0XHQ7ei1pbmRleFx0XHRcdDogNTAwcHhcclxuXHRcdFx0XHRcdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0I29uZ2xldFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdDtvdmVyZmxvd1x0XHRcdDogaGlkZGVuXHJcblx0XHRcdFx0XHQ7cG9zaXRpb25cdFx0XHQ6IHJlbGF0aXZlXHJcblx0XHRcdFx0XHQ7dG9wXHRcdFx0XHQ6IDEwIHB4O1xyXG5cdFx0XHRcdFx0O2JhY2tncm91bmQtY29sb3JcdDogZ3JlZW5cclxuXHRcdFx0XHRcdDt3aWR0aFx0XHRcdFx0OiAxMDAlXHJcblx0XHRcdFx0XHQ7aGVpZ2h0XHRcdFx0XHQ6IDEwMCVcclxuXHRcdFx0XHRcdDtkaXNwbGF5XHRcdFx0OmJsb2NrXHJcblx0XHRcdFx0XHQ7ei1pbmRleFx0XHRcdDogNDAwcHhcclxuXHRcdFx0XHRcdDtcclxuXHRcdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdDwvdGVtcGxhdGU+XHJcbmA7XHJcbm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbVx0XHRcdFx0OiAnbWVudS10YWInXHJcblx0LHRlbXBsYXRlXHRcdDogdGVtcGxhdGVcclxuXHQsY29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LXRhYi5qcyIsInZhciBjb25zdHJ1Y3RldXIgPSBmdW5jdGlvbihlbE1lbnUpXHJcbntcclxuXHRlbE1lbnUuc3R5bGUudG9wID0gJzBweCc7XHJcblx0ZWxNZW51LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcclxuXHRsZXQgaVJlZiA9IG5ldyB5YmFzdGhpcy50eXBlc0Rvbm5lZXMuUmVmZXJlbmNlO1xyXG5cdGNvbnN0IGluZGV4ID0gW107XHJcblx0Y29uc3QgbWVudSA9IGVsTWVudS5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJyNtZW51Jyk7XHJcblx0bGV0IHhEaXNwb25uaWJsZSA9IDA7XHJcblx0bGV0IGJhc2VYID0gbWVudS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54O1xyXG5cdGVsTWVudS5ham91dGVyT25nbGV0ID0gKGRvbUVsZW1lbnQsIGF2ZWNMaWFpc29uKSA9PlxyXG5cdHtcclxuXHRcdC8vY29uc29sZS5sb2coJ3ggZGlzcG86ICcsIHhEaXNwb25uaWJsZSk7XHJcblx0XHRpZihhdmVjTGlhaXNvbiA9PT0gdW5kZWZpbmVkKSBhdmVjTGlhaXNvbiA9IHRydWU7XHJcblx0XHRsZXQgcmVmID0gaVJlZi5vYnRlbmlyKCk7XHJcblx0XHRpbmRleFtyZWZdID0gZG9tRWxlbWVudDtcclxuXHRcdFxyXG5cdFx0ZG9tRWxlbWVudC5zdHlsZS5mbGV4R3JvdyA9IDE7XHJcblx0XHRkb21FbGVtZW50LnN0eWxlLmZsZXhCYXNpcyA9IDA7XHJcblx0XHQvL2RvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0XHJcblx0XHRtZW51LmFwcGVuZENoaWxkKGRvbUVsZW1lbnQpO1xyXG5cdFx0bGV0IGVsZW1lbnRDbGllbnRSZWN0ID0gZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdHhEaXNwb25uaWJsZSArPSBlbGVtZW50Q2xpZW50UmVjdC53aWR0aDtcclxuXHRcdC8vZG9tRWxlbWVudC5zdHlsZS50b3AgPSAtICgoaVJlZi50YWlsbGUoJ29jY3VwZScpIC0gMSkgKiBlbGVtZW50Q2xpZW50UmVjdC5oZWlnaHQpICsgJ3B4JztcclxuXHRcdC8vY29uc29sZS5sb2coZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XHJcblx0XHRjb25zdCBwb2ludGV1ckVsZW1lbnQgPSBtZW51Lmxhc3RDaGlsZDtcclxuXHRcdFxyXG5cdFx0aWYoYXZlY0xpYWlzb24pXHJcblx0XHR7XHJcblx0XHRcdHBvaW50ZXVyRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNvbnN0IGV2ZW5lbWVudEFmZmljaGFnZSA9IG5ldyBDdXN0b21FdmVudFxyXG5cdFx0XHRcdChcclxuXHRcdFx0XHRcdFwiYWZmaWNoYWdlXCIsIHtkZXRhaWw6e3R5cGU6IFwidXRpbGlzYXRldXJcIiwgY2libGU6IHBvaW50ZXVyRWxlbWVudH0sXHRidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlfVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0bWVudS5kaXNwYXRjaEV2ZW50KGV2ZW5lbWVudEFmZmljaGFnZSk7XHJcblx0XHRcdFxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZWY7XHJcblx0fTtcclxuXHRlbE1lbnUuU3VwcHJpbWVyT25nbGV0XHQ9IHJlZiA9PlxyXG5cdHtcclxuXHRcdGlSZWYuc3VwcHJpbWVyKHJlZik7XHJcblx0XHRsZXQgZWxlbWVudCA9IGluZGV4W3JlZl07XHJcblx0XHRtZW51LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIHJlZjtcclxuXHR9O1xyXG5cdGVsTWVudS5vbmdsZXRzID0gaW5kZXg7XHJcblx0XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxudmFyIHRlbXBsYXRlID0gXHJcbmBcclxuXHQ8dGVtcGxhdGU+XHJcblx0XHQ8ZGl2IGlkPSdtZW51Jz48L2Rpdj5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0I21lbnVcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHBvc2l0aW9uIDogcmVsYXRpdmU7XHJcblx0XHRcdFx0d2lkdGhcdDogYXV0bztcclxuXHRcdFx0XHRkaXNwbGF5IDogZmxleDtcclxuXHRcdFx0XHR0b3AgOiAwcHg7XHJcblx0XHRcdH1cclxuXHRcdFx0Lm1lbnUtaXRlbVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdDwvc3lsZT5cclxuXHQ8L3RlbXBsYXRlPlxyXG5gO1xyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub21cdFx0XHRcdDogJ21lbnUnLFxyXG5cdHRlbXBsYXRlXHRcdDogdGVtcGxhdGUsXHJcblx0Y29uc3RydWN0ZXVyXHQ6IGNvbnN0cnVjdGV1clxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS9hcGkvNS9lbGVtZW50cy9tZW51LmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4vMC9zdXJjb3VjaGVOYXRpZnMuanMnO1xyXG5pbXBvcnQgY29udHJhdCBmcm9tICcuLzEvY29udHJhdC5qcyc7XHJcbmltcG9ydCBtdXRhdGlvblNlbnNvciBmcm9tICcuLzEvc29uZGVNdXRhdGlvbi5qcyc7XHJcbmltcG9ydCB0eXBlc0Rvbm5lZXMgZnJvbSAnLi8yL3R5cGVzRG9ubmVlcy5qcyc7XHJcbmltcG9ydCB1dGlsaXRhaXJlcyBmcm9tICcuLzIvdXRpbGl0YWlyZXMuanMnO1xyXG5pbXBvcnQgZmFicmlxdWVFbGVtZW50IGZyb20gJy4vMy9lbGVtZW50c1BlcnNvbmFsaXPDqXMuanMnO1xyXG5pbXBvcnQgZ3VpIGZyb20gJy4vNC9ndWkvZ3VpSW5kZXguanMnO1xyXG5pbXBvcnQgbGlzdGVFbGVtZW50cyBmcm9tICcuLzUvbGlzdGVFbGVtZW50cy5qcyc7XHJcbmltcG9ydCBmblVpUHJpbmNpcGFsZSBmcm9tICcuLi91aS9wcmluY2lwYWxlLmpzJztcclxuXHJcbigoKSA9PlxyXG57XHJcbiAgICBjb25zdCB5YmFzdGhpcyA9IHdpbmRvdy55YmFzdGhpcyA9XHJcblx0e1xyXG5cdFx0Y29udHJhdCxcclxuXHRcdG11dGF0aW9uU2Vuc29yLFxyXG5cdFx0dHlwZXNEb25uZWVzLFxyXG5cdFx0dXRpbGl0YWlyZXMgOiBuZXcgdXRpbGl0YWlyZXMoKSxcclxuXHRcdGZhYnJpcXVlRWxlbWVudCxcclxuXHRcdGNoYXJ0ZVVpIDpcclxuXHRcdHtcclxuXHRcdFx0Zm9uZDogXHRcdCdncmV5JyxcclxuXHQgIFx0XHRncmlzQ2xhaXI6XHQnI2I1YjNiMycsXHJcblx0ICBcdFx0Z3Jpc0ZvbmNlOlx0JyM5ODk4OTgnLFxyXG5cdCAgXHRcdHZlcnQ6XHRcdCcjMjI3ODBGJyxcclxuXHRcdFx0cm91Z2U6XHRcdCcjREIxNzAyJ1xyXG5cdFx0fSxcclxuXHRcdG5hdmlnYXRpb24gOiBbXVxyXG5cdH07XHJcblxyXG5cdGNvbnN0IGRlbWFyZXVyID0gKGNvbmYpID0+XHJcblx0e1xyXG5cdFx0Y29uc3QgRmFicmlxdWVZYmFzdGhpcyA9IHliYXN0aGlzLmZhYnJpcXVlRWxlbWVudChjb25mLm5zKTtcclxuXHRcdGZvcihsZXQgZWxlbWVudCBvZiBsaXN0ZUVsZW1lbnRzKVxyXG5cdFx0XHRuZXcgRmFicmlxdWVZYmFzdGhpcyhlbGVtZW50KTtcclxuXHRcdGd1aSgpO1xyXG5cdFx0Zm5VaVByaW5jaXBhbGUoKTtcclxuXHR9O1xyXG5cdHtcclxuXHRcdGxldCBvbkxvYWRlZCA9ICgpID0+XHJcblx0XHR7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkZWQpO1xyXG5cdFx0XHRvbkxvYWRlZCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0ZGVtYXJldXJcclxuXHRcdFx0KHtcclxuXHRcdFx0XHRucyA6ICd5YidcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWRlZCk7XHJcblx0fVxyXG59ICkoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL3liYXN0aGlzL0Rlc2t0b3AvZGV2L3Rlc3QvcmVtb3RlL2FwaS95YmFzdGhpcy5qcyIsIm1vZHVsZS5leHBvcnRzID1cclxue1xyXG5cdG5vbSA6ICdhZG1pbmlzdHJhdGlvbicsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2PkFkbWluaXN0cmF0aW9uOiBFbiBjb3VycyBkZSBkZXY8L2Rpdj5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvYWRtaW5pc3RyYXRpb24vaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnYXV0cmVzJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXY+QXV0cmVzOiBFbiBjb3VycyBkZSBkZXY8L2Rpdj5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvYXV0cmVzL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ2FjY3VldWlsJyxcclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXYgaWQ9J2NvbnRlbmV1cic+XHJcblx0XHRcdDx5Yi1nYWxsZXJpZSBpZD0ncHJvamV0cycgdGl0cmU9J1Byb2pldHMnPiA8L3liLWdhbGxlcmllPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nYXV0cmVzJz5cclxuXHRcdFx0XHQ8eWItYm91dG9uIGlkPSdub3V2ZWF1Jz5Ob3V2ZWF1PC95Yi1ib3V0b24+XHJcblx0XHRcdFx0PHliLWJvdXRvbiBpZD0nZ2VzdGlvbic+R2VzdGlvbjwveWItYm91dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHQjY29udGVuZXVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHR3aWR0aFx0OiAxMDAlO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxMDAlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGRpc3BsYXlcdDogZmxleDtcclxuXHRcdFx0XHRmbGV4LWRpcmVjdGlvbiA6IHJvdztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yIDogI0Q0RDRENDtcclxuXHRcdFx0fVxyXG5cdFx0XHQjcHJvamV0c1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0LyogbG9uZ2V1ciA9IDUwJSAtIDIgKiBtYXJnZSAqL1xyXG5cdFx0XHRcdHdpZHRoXHQ6IGNhbGMoNTAlIC0gMzBweCk7XHJcblx0XHRcdFx0ZGlzcGxheVx0OiBpbmxpbmUtYmxvY2s7XHJcblx0XHRcdFx0bWFyZ2luXHQ6IDE1cHg7XHJcblx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3IgOiBncmVlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHQjYXV0cmVzXHJcblx0XHRcdHtcclxuXHRcdFx0XHR3aWR0aFx0OiA1MCU7XHJcblx0XHRcdFx0aGVpZ2h0XHQ6IGNhbGMoMTAwJSAtIDMwcHgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGRpc3BsYXlcdDogaW5saW5lLWJsb2NrO1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRtYXJnaW5cdDogMTVweDtcclxuXHRcdFx0XHRyaWdodFx0OiAwJTtcclxuXHRcdFx0XHR0b3BcdFx0OiAwJTtcclxuXHRcdFx0fVxyXG5cdFx0XHQjbm91dmVhdVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGhcdFx0OiAyNSU7XHJcblx0XHRcdFx0bWluLXdpZHRoIDogNWVtO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxNSU7XHJcblx0XHRcdFx0dG9wXHQ6IDI1JTtcclxuXHRcdFx0XHRsZWZ0XHQ6IDM1JTtcclxuXHRcdFx0XHRwb3NpdGlvblx0OiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHQjZ2VzdGlvblxyXG5cdFx0XHR7XHJcblx0XHRcdFx0d2lkdGhcdFx0OiAyNSU7XHJcblx0XHRcdFx0bWluLXdpZHRoIDogNWVtO1xyXG5cdFx0XHRcdGhlaWdodFx0OiAxNSU7XHJcblx0XHRcdFx0cG9zaXRpb25cdDogYWJzb2x1dGU7XHJcblx0XHRcdFx0Ym90dG9tXHQ6IDI1JTtcclxuXHRcdFx0XHRsZWZ0XHQ6IDM1JTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0PC9zdHlsZT5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdFx0Ly9cdFJBQ0NcclxuXHRcdHZhciBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHR2YXIgZXUgPSB5YmFzdGhpcy51dGlsaXRhaXJlcy5ncmFuZGV1cnMuZW5sZXZlclVuaXTDqTtcclxuXHRcdHZhciBjcyA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0XHRcclxuXHRcdHZhciBlbE5vdXYgPSBxcygnI25vdXZlYXUnKSxcclxuXHRcdFx0ZWxHZXN0ID0gcXMoJyNnZXN0aW9uJyksXHJcblx0XHRcdGVsQ29udCA9IHFzKCcjY29udGVuZXVyJyksXHJcblx0XHRcdGVsR2FsbCA9IHFzKCcjcHJvamV0cycpLFxyXG5cdFx0XHRjc0VsQXUgPSBjcyhxcygnI2F1dHJlcycpKTtcclxuXHRcdGVsR2FsbC5zdHlsZS5oZWlnaHQgPSAoZXUoY3MoZWxDb250KS5oZWlnaHQpIC0zMCkgKyAncHgnO1xyXG5cdFx0LypcclxuXHRcdGVsR2FsbC5zcGVjaWFsaXNlcih7XHJcblx0XHRcdGxlY3RldXIgOiAoZGF0YSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0dmFyIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcblx0XHRcdFx0XHRiLmlubmVySFRNTCA9IGRhdGEuYjtcclxuXHRcdFx0XHR2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHRcdFx0XHRcdGMuaW5uZXJIVE1MID0gZGF0YS5jO1xyXG5cdFx0XHRcdGEuYXBwZW5kQ2hpbGQoYik7XHJcblx0XHRcdFx0YS5hcHBlbmRDaGlsZChjKTtcclxuXHRcdFx0XHRyZXR1cm4gYTtcclxuXHRcdFx0fSxcclxuXHRcdFx0b3JnYW5pc2F0ZXVyIDogbGlzdGUgPT4gbGlzdGUsXHJcblx0XHRcdG1vZGVsZSA6IFsnYicsICdjJ10sXHJcblx0XHRcdGZvcm1lVmlnbmV0dGUgOiAncmVjdGFuZ2xlJyxcclxuXHRcdFx0bm9tYnJlVmlnbmV0dGUgOiA0XHJcblx0XHR9KTtcclxuXHRcdGVsR2FsbC5ham91dGVyXHJcblx0XHQoXHJcblx0XHRcdCAge2I6ICdFREknLCBjOiAnRURJIHBvdXIgamF2YXNjcmlwdCd9XHJcblx0XHRcdCwge2I6ICcyJywgYzogJ3onfVxyXG5cdFx0XHQsIHtiOiAnMycsIGM6ICdlJ31cclxuXHRcdFx0LCB7YjogJzQnLCBjOiAncid9XHJcblx0XHRcdCwge2I6ICc1JywgYzogJ3QnfVxyXG5cdFx0XHQsIHtiOiAnNicsIGM6ICd5J31cclxuXHRcdFx0LCB7YjogJzcnLCBjOiAndSd9XHJcblx0XHRcdCwge2I6ICc4JywgYzogJ2knfVxyXG5cdFx0XHQsIHtiOiAnOScsIGM6ICdvJ31cclxuXHRcdFx0LCB7YjogJzEwJywgYzogJ3AnfVxyXG5cdFx0XHQsIHtiOiAnMTEnLCBjOiAncSd9XHJcblx0XHRcdCwge2I6ICcxMicsIGM6ICdzJ31cclxuXHRcdCk7XHJcblx0XHRlbEdhbGwuYWZmaWNoZXIoKTtcclxuXHRcdCovXHJcblx0XHR2YXIgbm91diA9IGVsLnF1ZXJ5U2VsZWN0b3IoJyNub3V2ZWF1Jyk7XHJcblx0XHRcdG5vdXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBpbnRlcmZhY2VNw6hyZS5hZmZpY2hlcignbm91dmVhdVByb2pldCcpICk7XHJcblx0XHRcdFxyXG5cdFx0ZWwucXVlcnlTZWxlY3RvcignI2dlc3Rpb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGludGVyZmFjZU3DqHJlLmFmZmljaGVyKCdwcm9qZXRDbGFzc2UnKSApO1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9hY2N1ZXVpbC5qcyIsImNvbnN0IHZ1ZU5vdXZlYXVQcm9qZXQgPSByZXF1aXJlKCcuL25vdXZlYXVQcm9qZXQuanMnKTtcclxuY29uc3QgdnVlQWNjdWV1aWwgPSByZXF1aXJlKCcuL2FjY3VldWlsLmpzJyk7XHJcbmNvbnN0IHZ1ZVByb2pldENsYXNzZSA9IHJlcXVpcmUoJy4vcHJvamV0Q2xhc3NlLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnZXNwYWNlVHJhdmFpbCcsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8eWItaW50ZXJmYWNlPjwveWItaW50ZXJmYWNlPlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0XHR5Yi1pbnRlcmZhY2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhlaWdodDoxMDAlO1xyXG5cdFx0XHRcdHdpZHRoOjEwMCU7XHJcblx0XHRcdH1cclxuXHRcdDwvc3R5bGU+XHJcblx0YCxcclxuXHRjb25zdHJ1Y3RldXIgOiAoaW50ZXJmYWNlTcOocmUsIGVsKSA9PlxyXG5cdHtcclxuXHRcdGNvbnN0IGVsSW50ZXJmYWNlID0gZWwucXVlcnlTZWxlY3RvcignWUItSU5URVJGQUNFJyk7XHJcblx0XHRlbEludGVyZmFjZS5ham91dGVyKHZ1ZU5vdXZlYXVQcm9qZXQpO1xyXG5cdFx0ZWxJbnRlcmZhY2UuYWpvdXRlcih2dWVBY2N1ZXVpbCk7XHJcblx0XHRlbEludGVyZmFjZS5ham91dGVyKHZ1ZVByb2pldENsYXNzZSk7XHJcblx0XHRyZXR1cm4gKCkgPT5cclxuXHRcdHtcclxuXHRcdFx0ZWxJbnRlcmZhY2UuYWZmaWNoZXIoJ2FjY3VldWlsJyk7XHJcblx0XHR9O1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ25vdXZlYXVQcm9qZXQnLFxyXG5cdC8qKlxyXG5cdGRpdiAjY29udGVuZXVyXHJcblx0fFx0ZGl2ICNwcm9qZXRzXHJcblx0fFx0fFx0aW5wdXQgI25vbVxyXG5cdHxcdHxcdGlucHV0ICNkZXNjXHJcblx0fFx0ZGl2ICNhdXRyZXNcclxuXHR8XHR8XHRkaXYgI2F1dF90eXBlXHJcblx0fFx0fFx0fFx0cCAjdHlwZVxyXG5cdHxcdHxcdGRpdiAjYXV0X2F1dHJlc1xyXG5cdHxcdHxcdHxcdHliLWJvdXRvbiAjYW5udWxlclxyXG5cdHxcdHxcdHxcdHliLWJvdXRvbiAjdmFsaWRlcj1cclxuXHQqKi9cclxuXHRtb2RlbGUgOlxyXG5cdGBcclxuXHRcdDxkaXYgaWQ9J2NvbnRlbmV1cic+XHJcblx0XHRcdDxkaXYgaWQ9J3Byb2pldHMnPlxyXG5cdFx0XHRcdDxpbnB1dCBpZD0nbm9tJyB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nTm9tJyAvPlxyXG5cdFx0XHRcdDxpbnB1dCBpZD0nZGVzYycgdHlwZT0ndGV4dCcgcGxhY2Vob2xkZXI9J0Rlc2NyaXB0aW9uJyAvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD0nYXV0cmVzJz5cclxuXHRcdFx0XHQ8ZGl2IGlkPSdhdXRfdHlwZSc+XHJcblx0XHRcdFx0XHQ8cCBpZD0ndHlwZSc+VFlQRTwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGlkPSdhdXRfYXV0cmVzJz5cclxuXHRcdFx0XHRcdDx5Yi1ib3V0b24gY2xhc3M9J2F1dF9hdXRyZXNCb3V0b24nIGlkPSdhbm51bGVyJz48L3liLWJvdXRvbj5cclxuXHRcdFx0XHRcdDx5Yi1ib3V0b24gY2xhc3M9J2F1dF9hdXRyZXNCb3V0b24nIGlkPSd2YWxpZGVyJz48L3liLWJvdXRvbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHRcdDxzdHlsZT5cclxuXHRcdFx0aW5wdXRcclxuXHRcdFx0e1x0XHJcblx0XHRcdFx0ICBoZWlnaHQ6XHQ1MCU7XHJcblx0XHRcdH1cclxuXHRcdFx0I2NvbnRlbmV1clxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGlzcGxheTpcdFx0XHRcdFx0ZmxleDtcclxuXHRcdFx0XHRmbGV4LWRpcmVjdGlvbjpcdFx0cm93O1xyXG5cdFx0XHRcdGhlaWdodDpcdFx0XHRcdFx0XHQxMDAlO1xyXG5cdFx0XHRcdHdpZHRoOlx0XHRcdFx0XHRcdDEwMCU7XHJcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjpcdCNENEQ0RDQ7XHJcblx0XHRcdFx0cG9zaXRpb246XHRcdFx0XHRcdGFic29sdXRlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCNwcm9qZXRzXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkaXNwbGF5Olx0YmxvY2s7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHQxMDAlO1xyXG5cdFx0XHRcdHdpZHRoOlx0XHQ1MCU7XHJcblx0XHRcdFx0dG9wOlx0XHRcdDBweDtcclxuXHRcdFx0XHRsZWZ0Olx0XHRcdDBweDtcclxuXHRcdFx0XHRtYXJnaW46XHRcdDE1cHg7XHJcbiBcdFx0XHRcdHBvc2l0aW9uOlx0cmVsYXRpdmU7XHJcblx0XHRcdH1cclxuXHRcdFx0I25vbVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ICB3aWR0aDpcdFx0XHRcdFx0NTAlO1xyXG5cdFx0XHRcdCAgaGVpZ2h0Olx0XHRcdFx0XHQxNSU7XHJcblx0XHRcdFx0ICBib3JkZXItd2lkdGg6XHRcdDFweDtcclxuXHRcdFx0XHQgIGJvcmRlci1zdHlsZTpcdFx0c29saWQ7XHJcblx0XHRcdFx0ICBib3JkZXItY29sb3I6XHRcdGJsYWNrO1xyXG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTpcdDE1cHg7XHJcblx0XHRcdFx0ICBwb3NpdGlvbjpcdFx0XHRcdHJlbGF0aXZlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCNkZXNjXHJcblx0XHRcdHtcclxuXHRcdFx0XHQgaGVpZ2h0Olx0XHRcdFx0Y2FsYygxMDAlIC0gMTUlKTtcclxuXHRcdFx0XHQgd2lkdGg6XHRcdFx0XHRcdDEwMCU7XHJcblx0XHRcdFx0IGJvcmRlci13aWR0aDpcdDFweDtcclxuXHRcdFx0XHQgYm9yZGVyLXN0eWxlOlx0c29saWQ7XHJcblx0XHRcdFx0IGJvcmRlci1jb2xvcjpcdGJsYWNrO1xyXG5cdFx0XHRcdCBwb3NpdGlvbjpcdFx0XHRyZWxhdGl2ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdCNhdXRyZXNcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHdpZHRoOlx0XHQ1MCU7XHJcblx0XHRcdFx0aGVpZ2h0Olx0XHQxMDAlO1xyXG5cdFx0XHRcdGRpc3BsYXk6XHRpbmxpbmUtYmxvY2s7XHJcblx0XHRcdFx0cG9zaXRpb246XHRhYnNvbHV0ZTtcclxuXHRcdFx0XHRyaWdodFx0XHQ6IDAlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQjYXV0X3R5cGVcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG1hcmdpbjpcdFx0XHRcdFx0XHQxNXB4O1xyXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6XHQjRDRENEQ0O1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0XHRcdFx0XHRhYnNvbHV0ZTtcclxuXHRcdFx0XHRvdmVyZmxvdzpcdFx0XHRcdFx0aGlkZGVuO1xyXG5cdFx0XHRcdGJvcmRlci13aWR0aDpcdFx0XHQxcHg7XHJcblx0XHRcdFx0Ym9yZGVyLXN0eWxlOlx0XHRcdHNvbGlkO1xyXG5cdFx0XHRcdGJvcmRlci1jb2xvcjpcdFx0XHRibGFjaztcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0I2F1dF9hdXRyZXNcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJpZ2h0Olx0XHQwcHg7XHJcblx0XHRcdFx0bWFyZ2luOlx0XHQxNXB4O1xyXG5cdFx0XHRcdHBvc2l0aW9uOlx0YWJzb2x1dGU7XHJcblx0XHRcdFx0b3ZlcmZsb3c6XHRoaWRkZW47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC5hdXRfYXV0cmVzQm91dG9uXHJcblx0XHRcdHtcclxuXHRcdFx0XHRwb3NpdGlvbjpcdGFic29sdXRlO1xyXG5cdFx0XHRcdHdpZHRoOlx0XHQxMDAlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCNhbm51bGVyXHJcblx0XHRcdHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOlx0YmxhY2s7XHRcclxuXHRcdFx0fVxyXG5cdFx0XHQjdmFsaWRlclxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjpcdGJsYWNrO1xyXG5cdFx0XHR9XHJcblx0XHRcdCN0eXBlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRib3JkZXItd2lkdGg6XHRcdFx0XHRcdDBweDtcclxuXHRcdFx0XHRib3JkZXItYm90dG9tLXdpZHRoOlx0MXB4O1xyXG5cdFx0XHRcdGJvcmRlci1zdHlsZTpcdFx0XHRcdFx0c29saWQ7XHJcblx0XHRcdFx0Ym9yZGVyLWNvbG9yOlx0XHRcdFx0XHRibGFjaztcclxuXHRcdFx0XHRwb3NpdGlvbjpcdFx0XHRcdFx0XHRcdGFic29sdXRlO1xyXG5cdFx0XHR9XHJcblx0XHQ8L3N0eWxlPlxyXG5cdGAsXHJcblx0Y29uc3RydWN0ZXVyIDogKGludGVyZmFjZU3DqHJlLCBlbCkgPT5cclxuXHR7XHJcblx0XHRjb25zdCBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHRjb25zdCBldSA9IHliYXN0aGlzLnV0aWxpdGFpcmVzLmdyYW5kZXVycy5lbmxldmVyVW5pdMOpO1xyXG5cdFx0Y29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdFx0Y29uc3QgdmFsID0gcXMoJyN2YWxpZGVyJyk7XHJcblx0XHR2YWwuY2hhbmdlckxhYmVsKCdWJyk7XHJcblx0XHR2YWwuZW5sZXZlckVmZmV0cygpO1xyXG5cdFx0Y29uc3QgYW51ID0gcXMoJyNhbm51bGVyJylcclxuXHRcdGFudS5jaGFuZ2VyTGFiZWwoJ1gnKTtcclxuXHRcdGFudS5lbmxldmVyRWZmZXRzKCk7XHJcblx0XHRhbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRpbnRlcmZhY2VNw6hyZS5hZmZpY2hlcignYWNjdWV1aWwnKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgYXV0X3R5cGUgPSBxcygnI2F1dF90eXBlJyk7XHJcblx0XHRjb25zdCBhdXRfYXV0cmVzID0gcXMoJyNhdXRfYXV0cmVzJyk7XHJcblx0XHRjb25zdCBhdXRyZXNfY3AgPSBjcyhxcygnI2F1dHJlcycpKTtcclxuXHRcdGNvbnN0IGNzRWxDb250ID0gY3MocXMoJyNjb250ZW5ldXInKSk7XHJcblx0XHRjb25zdCBlbFByb2pldCA9IHFzKCcjcHJvamV0cycpO1xyXG5cdFxyXG5cdFx0ZWxQcm9qZXQuc3R5bGUuaGVpZ2h0ID0gKGV1KGNzRWxDb250LmhlaWdodCkgLSA0NSkgKyAncHgnO1xyXG5cdFx0ZWxQcm9qZXQuc3R5bGUud2lkdGggPSAoZXUoY3MoZWxQcm9qZXQpLndpZHRoKSAtMTUpICsgJ3B4JztcclxuXHRcdGF1dF90eXBlLnN0eWxlLndpZHRoID1cclxuXHRcdChcclxuXHRcdFx0KChldShhdXRyZXNfY3Aud2lkdGgpICogOTApXHJcblx0XHRcdC8gMTAwKSAtIDQ1XHJcblx0XHQpICsgJ3B4JztcclxuXHRcdGF1dF90eXBlLnN0eWxlLmhlaWdodCA9IChldShhdXRyZXNfY3AuaGVpZ2h0KSAtIDQ1ICkgKyAncHgnO1xyXG5cdFx0YXV0X2F1dHJlcy5zdHlsZS5oZWlnaHQgPSBhdXRfdHlwZS5zdHlsZS5oZWlnaHQ7XHJcblx0XHRhdXRfYXV0cmVzLnN0eWxlLndpZHRoID0gXHJcblx0XHQoXHJcblx0XHRcdCgoZXUoYXV0cmVzX2NwLndpZHRoKSAqIDEwKVxyXG5cdFx0XHQvIDEwMClcclxuXHRcdCkgKyAncHgnO1xyXG5cdFx0Y29uc3QgYXV0X2F1dHJlc19jcCA9IGNzKGF1dF9hdXRyZXMpO1xyXG5cdFx0YW51LnN0eWxlLmhlaWdodCA9IGFudS5zdHlsZS53aWR0aCA9IGF1dF9hdXRyZXNfY3Aud2lkdGg7XHJcblx0XHR2YWwuc3R5bGUuaGVpZ2h0ID1cclxuXHRcdCgoXHJcblx0XHRcdGV1KGF1dF9hdXRyZXNfY3AuaGVpZ2h0KSBcclxuXHRcdFx0LVxyXG5cdFx0XHRldShhdXRfYXV0cmVzX2NwLndpZHRoKSBcclxuXHRcdCkgLSAxNSkgKyAncHgnO1xyXG5cdFx0dmFsLnN0eWxlLndpZHRoID0gYW51LnN0eWxlLndpZHRoO1xyXG5cdFx0dmFsLnN0eWxlLnRvcCA9IChldShhdXRfYXV0cmVzX2NwLndpZHRoKSArIDE1KSArICdweCc7XHJcblx0XHRcclxuXHRcdGNvbnN0ICAgZGVzYyA9IHFzKCcjZGVzYycpO1xyXG5cdFx0Y29uc3RcdFx0ZGVzY0NzID0gY3MoZGVzYyk7XHJcblx0XHRjb25zdFx0XHRub20gPSBxcygnI25vbScpO1xyXG5cdFx0bm9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHliYXN0aGlzLmNoYXJ0ZVVpLmdyaXNDbGFpcjtcclxuXHRcdGRlc2Muc3R5bGUuYmFja2dyb3VuZENvbG9yID0geWJhc3RoaXMuY2hhcnRlVWkuZ3Jpc0NsYWlyO1xyXG5cdFx0ZGVzYy5zdHlsZS5oZWlnaHQgPSAoKGV1KGNzKHFzKCcjcHJvamV0cycpKS5oZWlnaHQpIC0gZXUoY3Mobm9tKS5oZWlnaHQpICkgLSAyMCkgKyAncHgnO1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9ub3V2ZWF1UHJvamV0LmpzIiwibW9kdWxlLmV4cG9ydHMgPVxyXG57XHJcblx0bm9tIDogJ3Byb2pldENsYXNzZScsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2IGlkPVwiZWRpdGV1clwiPlxyXG5cdFx0XHQ8eWItbWVudT5cclxuXHRcdFx0XHQ8eWItb25nbGV0IG5vbT0nTW9kZWxlJyB0eXBlPSdzZWxlY3Rpb24nPlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nQ2xhc3NlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdJbnN0YW5jZScgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdDwveWItb25nbGV0PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdJbXBsw6ltZW50YXRpb24nIHR5cGU9J3NlbGVjdGlvbic+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdDbGFzc2UnIC8+PC95Yi1jaG9peD5cclxuXHRcdFx0XHRcdDx5Yi1jaG9peCBub209J0luc3RhbmNlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0PC95Yi1vbmdsZXQ+XHJcblx0XHRcdFx0PHliLW9uZ2xldCBub209J1JhcHBvcnRzJyB0eXBlPSdzZWxlY3Rpb24nPlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nQ2xhc3NlJyAvPjwveWItY2hvaXg+XHJcblx0XHRcdFx0XHQ8eWItY2hvaXggbm9tPSdJbnN0YW5jZScgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdFx0PHliLWNob2l4IG5vbT0nR8OpbsOpcmF1eCcgLz48L3liLWNob2l4PlxyXG5cdFx0XHRcdDwveWItb25nbGV0PlxyXG5cdFx0XHRcdDx5Yi1vbmdsZXQgbm9tPSdEw6lwZW5kYW5jZXMnIHR5cGU9J2JvdXRvbicgPjwveWItb25nbGV0PlxyXG5cdFx0XHQ8L3liLW1lbnU+XHJcblx0XHRcdDx0YWJsZSBpZD1cImFmZmljaGFnZVwiPlxyXG5cdFx0XHRcdDx0cj5cclxuXHRcdFx0XHRcdDx0aCBjbGFzcz0nZHVtbXknPjwvdGg+XHJcblx0XHRcdFx0XHQ8dGg+Tm9tPC90aD5cclxuXHRcdFx0XHRcdDx0aD5UeXBlPC90aD5cclxuXHRcdFx0XHRcdDx0aD5Gb3JjZSB0eXBhZ2U8L3RoPlxyXG5cdFx0XHRcdFx0PHRoPlBvcnTDqTwvdGg+XHJcblx0XHRcdFx0PC90cj5cclxuXHRcdFx0XHQ8dHI+XHJcblx0XHRcdFx0XHQ8dGQgY2xhc3M9J2JvdXRvblNlbGVjdGlvbm5lcic+XHJcblx0XHRcdFx0XHRcdDx5Yi1jYXNlQ29jaGVyIC8+XHJcblx0XHRcdFx0XHQ8L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPnRhaWxsZTwvcD48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPmVudGllciBuYXR1cmVsPC9wPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+c3RhdGlxdWU8L3A+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5wdWJsaXF1ZTwvcD48L3RkPlxyXG5cdFx0XHRcdDwvdHI+XHJcblx0XHRcdFx0PHRyPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPSdib3V0b25TZWxlY3Rpb25uZXInPlxyXG5cdFx0XHRcdFx0XHQ8eWItY2FzZUNvY2hlciAvPlxyXG5cdFx0XHRcdFx0PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5mcsOpcXVlbmNlPC9wPjwvdGQ+XHJcblx0XHRcdFx0XHQ8dGQ+PHA+ZW50aWVyIG5hdHVyZWw8L3A+PC90ZD5cclxuXHRcdFx0XHRcdDx0ZD48cD5jb25zdGFudDwvcD48L3RkPlxyXG5cdFx0XHRcdFx0PHRkPjxwPnByaXbDqWU8L3A+PC90ZD5cclxuXHRcdFx0XHQ8L3RyPlxyXG5cdFx0XHQ8L3RhYmxlPlxyXG5cdFx0XHQ8ZGl2IGlkPVwiZWRpdGV1cl9lZGl0aW9uXCI+XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHN0eWxlPlxyXG5cdFx0PC9zdHlsZT5cclxuXHRgLFxyXG5cdGNvbnN0cnVjdGV1ciA6IChpbnRlcmZhY2VNw6hyZSwgZWwpID0+XHJcblx0e1xyXG5cdFx0Ly9cdFJBQ0NcclxuXHRcdHZhciBxcyA9IHNlbCA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XHJcblx0XHQvL3ZhciBldSA9IF9lbmxldmVyVW5pdGU7XHJcblx0XHR2YXIgY3MgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUveWJhc3RoaXMvRGVza3RvcC9kZXYvdGVzdC9yZW1vdGUvdWkvZXNwYWNlVHJhdmFpbC9wcm9qZXRDbGFzc2UuanMiLCJtb2R1bGUuZXhwb3J0cyA9XHJcbntcclxuXHRub20gOiAnbW9kdWxlcycsXHJcblx0bW9kZWxlIDpcclxuXHRgXHJcblx0XHQ8ZGl2Pk1vZHVsZXM6IEVuIGNvdXJzIGRlIGRldjwvZGl2PlxyXG5cdGAsXHJcblx0Y29uc3RydWN0ZXVyIDogKGludGVyZmFjZU3DqHJlLCBlbCkgPT5cclxuXHR7XHJcblx0fVxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS95YmFzdGhpcy9EZXNrdG9wL2Rldi90ZXN0L3JlbW90ZS91aS9tb2R1bGVzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==