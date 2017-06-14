# Ybasthis exemple
- Système de fenêtre
- Web Composant
- Pointeur personnalisé

Côté client que du JavaScript vanilla, pour le serveur __express__ afin de desservir les fichiers statiques et __webpack__ + __babel__ afin de génerer le code client.
![alt text](https://github.com/matthispaita/ybasthis_exemple/blob/master/Untitled.png)
## Utilisation:

Lancer le serveur depuis la racine avec la commande `npm start`.

Le serveur accepte deux type de commande:
- `(c)lose`:          Arrêter le serveur.
- `(r)eload-(r)emote`: Reconstruire le code client.

## Environnement testés:
* Windows 10, node 8.1
* openSUSE Tumbleweed, node 6.5

## Support Firefox 52:
Total avec activation de propriétées dans about:config
- dom.webcomponents.customelements.enabled=true
- dom.webcomponents.enabled=true
- full-screen-api.pointer-lock.enabled=true
- pointer-lock-api.prefixed.enabled=false

## Support Chrome 53:
Partiel:

    document.getElement(s)FromPosition n'analyse pas l'arbre interne d'un ShadowRoot,
    seulement son arbre externe. De ce fait les écouteurs d'évènements de type pointeur
    ne sont pas notifiés en cas d'évènement car les noeuds ne peuvent être
    retrouvés de façon native.

Ceci entraîne la non réaction de certains éléménts personnalisés.