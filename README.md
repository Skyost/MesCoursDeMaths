# Mes cours de maths

Bienvenue sur la page Github du site web [Mes cours de maths](https://mes-cours-de-maths.fr) !
Il s'agit d'un petit site web (open-source !) où je dépose tous mes cours de mathématiques
ainsi que les ressources qui y sont liées.

![GitHub Created At](https://img.shields.io/github/created-at/Skyost/MesCoursDeMaths)
![GitHub License](https://img.shields.io/github/license/Skyost/MesCoursDeMaths)
![GitHub top language](https://img.shields.io/github/languages/top/Skyost/MesCoursDeMaths)

## Technologies

Pour son développement, ce site web a recours principalement à :

* [Nuxt](https://nuxt.com) et [Vue](https://vuejs.org).
* [ThatLatexLib](https://github.com/Skyost/ThatLatexLib).
* [Bootstrap](https://getbootstrap.com) et [Bootstrap Vue Next](https://bootstrap-vue-next.github.io/bootstrap-vue-next/).

Il est hébergé sur [Github Pages](http://pages.github.com).

## Comment ça marche ?

Afin d'afficher une liste des cours, ce site va télécharger le contenu
d'un dépot distant qui, lui, contient les données qui suivent cette structure :

```
.
└── données/
    └── latex/
        ├── niveau-1/
        │   ├── images/
        │   ├── grade.json
        │   ├── activite.tex
        │   ├── premier-cours.tex
        │   └── deuxieme-cours.tex
        ├── niveau-2/
        │   ├── images/
        │   ├── grade.json
        │   ├── activite.tex
        │   ├── premier-cours.tex
        │   └── deuxieme-cours.tex
        └── ...
```

Les fichiers `grade.json` permettent d'indiquer que le répertoire courant est
bien celui d'un niveau (`sixieme`, `seconde`, ...) et d'y apporter quelques éléments
de contexte.

Tous les fichiers qui finissent par `-cours.tex` sont ceux qui sont transformés
et affichés (par exemple, [ici](https://mes-cours-de-maths.fr/cours/cinquieme/nombres-relatifs/)).

Enfin, tous les fichiers `.tex` sont compilés afin d'être mis à disposition en téléchargement.

## License

Ce projet est disponible sous licence [GNU GPL v3](https://github.com/Skyost/MesCoursDeMaths/blob/main/LICENSE).
Les contenus que vous pouvez y trouver sont, eux, disponibles sous licence
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr).

## Contributions

Toutes les contributions sont appréciées ! N'hésitez pas à :

* [Envoyer](https://github.com/Skyost/MesCoursDeMaths/stargazers) une étoile sur GitHub.
* [Signaler](https://github.com/Skyost/MesCoursDeMaths/issues/new/choose) une erreur ou demander une nouvelle
  fonctionnalité.
* [Donner](https://paypal.me/Skyost) pour supporter le développeur.
