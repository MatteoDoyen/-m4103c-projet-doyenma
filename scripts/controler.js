var controler = {};

function ajouter_recherche() {
    //récupère la zone de recherche
   recherche_courante = view.recherche_courante();
   //si l'index est négatif, la recherche n'existe pas, on peut donc l'ajouter
  if(model.getIndexRecherches(recherche_courante)<0)
  {
    //ajoute la recherche au tableau des recherches
    model.addRecherches(recherche_courante);
    //affichage de la recherche, on passe la longueur du tableau pour créer l'ID
    view.addRecherche(recherches.length,recherche_courante);
  }
}

//cette fonction lance la fonction rechercher_nouvelles à l'appuie sur la touche entrée
document.addEventListener('keydown', logKey);
function logKey(e) {
  if(e.keyCode===13)
  {
    rechercher_nouvelles();
  }
}

function supprimer_recherche(elt) {
  //on supprime le paragraphe sur lequel à cliqué l'utilisateur et on récupère le titre de l'annonce
  let titre = view.supprParagraphe(elt);
  //on récupère l'index du titre dans la recherche
  let index = model.getIndexRecherches(titre);
  //on vérifie que l'on a bien trouvé une occurence du titre
  if(index>=0)
  {
    //on supprime l'occurence de la recherche dans le tableau de recherche et ont met à jour le stockage du local storage
    model.suppRecherches(index);
  }
}


function selectionner_recherche(elt) {
  //on vide la zone d'affichage des offres
  view.clearResultat();
  //on change la zone de recherche avec la recherche sur laquelle on à cliqué
  //cette fonction retourne le nom de la recherche
  let recherche = view.setZoneRecherche(elt);
  //si cette recherche existe dans le local storage on peut récupérer les offres qui lui sont associès
  if(elt.textContent in localStorage)
  {
    //récupère toutes les offres et les renvoies sous forme de tableau
    let recherche_courante_news = model.recupererOffre(recherche);
    //affiche les offres
    view.afficherOffre(recherche_courante_news);
  }
}


function init() {
  //si il existe des recherches de stockées on les récupères
  if('recherche' in localStorage)
  {
    //recupération des recherches
    let recherches = model.recupererRecherches();
    //ajout des recherches au navigateur
    view.afficherRecherches(recherches.lenght,recherches);
  }
}


function rechercher_nouvelles() {
  //clear la zone de resultat
  view.clearResultat();
  //récupère la zone de recherche
  let recherche_courante = view.recherche_courante();
  //cache la zone avec un chargement jusqu'a la fin des opérations
  view.loading();
  //verifie si la recherche existe dans le local storage
  if(recherche_courante in localStorage)
  {
    //rempli le tableau avec ce qu'il y à dans le localStorage
    model.recupererOffre(recherche_courante);
  }
  if(model.getIndextableauDeRecherchesTape(recherche_courante)<0)
  {
    model.addTableauDeRecherchesTape(recherche_courante);
  }
  //récupère les offres d'emploi sur le site et appel maj resultat
  ajax_get_request(maj_resultats,"https://carl-vincent.fr/search-internships.php?data="+recherche_courante,true);
}


function maj_resultats(res) {
  //recupère les offres
  let tabRes = model.recupererOffres(res);
  //passage du tableau d'offre à la vue, elle affichera toutes les offres
  view.ajouterOffre(tabRes);
  //on peut désormais arrêter le chargement et afficher le resultat
  view.loadingFini();

}


function sauver_nouvelle(elt) {
  //récupère la zone de recherche
  let recherche = view.recherche_courante();
  //créer un objet avec le titre,l'url et la date de l'offre selectionné
  //on met false pour que l'image soit une disquette
  let text = view.sauver_nouvelle(elt,false);
  //renvoie l'index de l'objet dans le tableau
  let index = model.getIndexRecherchesCourantes(recherche);
  //si l'objet pas dans tableau, on l'y met
  if(index<0)
  {
    model.addOffres(recherche,text);
  }
  //change l'attribut pour qu'il appel supprimer_nouvelle
  view.attributSupprimer(elt);
}


function supprimer_nouvelle(elt) {

  let recherche_courante = view.recherche_courante();
  //créer un objet avec le titre,l'url et la date de l'offre selectionné
  //on met true pour que l'image soit une horloge
  let text = view.sauver_nouvelle(elt,true);
  //supprime l'offre du tableau
  model.supprimerRechecheCourante(text,recherche_courante);
  //change l'attribut pour qu'il appel sauver_nouvelle
  view.attributAjouter(elt);
}


function ajax_get_request(callback, url, async) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){


		if (callback && xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

			callback(xhr.responseText);
		}
	};

	xhr.open("GET", url, async);
	xhr.send();

}

$(function(){
    var tabRecherches = model.getTableauDeRecherchesTape();
    $("#zone_saisie").autocomplete({
      source: tabRecherches
    });
});
