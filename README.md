# Mes cours de maths

_Ce projet est en cours de construction, veuillez repasser plus tard !_

Bienvenue sur la page Github du site web [Mes cours de maths](https://mes-cours-de-maths.fr) !
Il s'agit d'un petit site web où je dépose tous mes cours de mathématiques ainsi que les ressources
qui y sont liées.

Ce site est totalement open-source : vous pouvez tout à fait en exécuter une instance personnelle.
Pour cela, suivez le guide ci-dessous.

## Installation

### Création d'applications et de jetons

Sur Github, il va falloir créer une application OAUTH. Pour cela, rendez-vous sur
[ce lien](https://github.com/settings/applications/new).

* Dans `Application name`, mettez ce que vous souhaitez.
* Dans `Homepage URL` et dans `Authorization callback URL`, mettez l'URL de votre site web.
  Se référer à [https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#redirect-urls](ce lien)
  pour le dernier champ.

Par la suite, notez votre `Client ID` quelque-part et générez un nouveau `Client secret`. Copiez-le aussi
et ne le perdez surtout pas. Nous en aurons également besoin plus tard.

### Cloner le projet

Il vous suffit de [cliquer ici](https://github.com/Skyost/MesCoursDeMaths/fork) pour cloner le projet.
Cela créera un nouveau dépôt sur Github où vous pourrez [configurer](#configuration) votre nouveau site web.

Dans les paramètres de votre dépôt Github, il va falloir créer deux secrets :
* `CLIENT_SECRET`, qui doit contenir votre `Client secret`.
* `PERSONAL_ACCESS_TOKEN`, qui contient votre `Personal access token` créé précédemment.
  Cette étape est requise uniquement si vous utilisez un dépôt séparé pour héberger vos données.

### Configuration

Pour configurer le site web (nom, dépôt Github, répertoire des cours, etc.), il vous faut modifier le
fichier `site.js`. Indiquez votre `Client ID` dans le champ `clientId`.

Pour modifier le contenu de la page d'accueil, il faut éditer le fichier `pages/index.vue`.
Une façon plus rapide (et intuitive...) de modifier les pages sera sûrement ajoutée à l'avenir.

### Création d'un dépôt de données

Cette étape est optionnelle : vous pouvez parfaitement vous servir du même dépôt que le site web
pour y stocker vos données LaTeX. Pour cela, dans `site.js`, laissez `dataRepository` à la même valeur que `repository`.

Si vous souhaitez utiliser un dépôt séparé (par exemple, afin de garder les sources LaTeX privées ; ou tout
simplement pour séparer le contenu de sa présentation), créez-en un sur Github et indiquez sa valeur dans
`dataRepository`. Celui-ci doit contenir le `lessonsDirectory`.

Si votre dépôt est privé, nous allons devoir créer un `Personal access token`. Pour cela rendez-vous sur
[ce lien](https://github.com/settings/tokens/new). Nommez-le comme vous souhaitez et cochez la case `repo`.
Notez quelque-part le jeton que vous obtenez.

### Structure des fichiers LaTeX

Vos fichiers LaTeX peuvent être structurés comme vous le souhaitez, du moment qu'ils sont interprétables
par [KaTeX](https://katex.org). Ceux-ci doivent tout de même définir deux environnements :

* `doctitle` qui doit correspondre au titre de votre document.
* `docnumber` qui peut correspondre à un numéro de chapitre par exemple.

Afin d'être compilables par [Pandoc](https://pandoc.org), vous pouvez créer un fichier `pandoc.tex`,
à placer dans le `lessonsDirectory`. Voici par exemple le contenu du mien :

```tex
% Ceci me permet de remplacer ma commande \cours dans mes fichiers LaTeX.
\providecommand{\cours}[3]{%
	\begin{doctitle}%
		#2%
	\end{doctitle}%
}

% Et ceci me permet de remplacer ma commande \chapitrenumero dans mes fichiers LaTeX.
\providecommand{\chapitrenumero}[1]{%
	\begin{docnumber}%
		#1%
	\end{docnumber}%
}
```

### Création d'un projet Vercel

Afin que l'accès enseignant soit fonctionnel, nous avons encore besoin de créer un projet sur [Vercel](https://vercel.com/).
Inscrivez-vous si ce n'est pas déjà fait et créez un nouveau projet à partir du dépôt Github cloné.

Une fois créé, nous allons devoir ajouter deux variables d'environnements (dans les paramètres du projet Vercel) :

* `GITHUB_CLIENT_SECRET`, qui contient votre `Client secret`.
* `ENCRYPTION_KEY`, qui contient 32 caractères générés de manière aléatoire (majuscules, minuscules et chiffres uniquement).

Le domaine spécifié dans _Domains_ doit correspondre avec l'`apiUrl` du fichier `site.js`.

Dans l'onglet `Git` spécifiez `api` en tant que branche de production. 

## Tests locaux

Pour tester localement votre site web, une commande suffit : `npm run dev`. Il vous faut également
créer un fichier `.env` contenant toutes variables d'environnement listées [précédemment](#création-dun-projet-vercel).
