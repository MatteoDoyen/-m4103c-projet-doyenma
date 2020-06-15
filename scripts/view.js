var view = {};

//renvoie la valeur de la zone de saisie
view.recherche_courante = function() { return $('#zone_saisie').val(); }
//div qui affiche les recherches de l'utilisateur
view.recherchesStockees = $('#recherches-stockees');
//affiche une recherche
view.addRecherche = function(taille,recherche_courante) { view.recherchesStockees.append('<p id="'+taille+"_label"+'"class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+recherche_courante+'</label><img src="img/croix30.jpg" onclick="supprimer_recherche(this)" class="icone-croix"/></p>'); }
//div qui affiche les offres
view.resultat = $('#resultats');
//affiche chargement et cache resultat
view.loading = function() {$('#wait').css("display", "block");}
//cache chargement et affiche resultat
view.loadingFini = function() { $('#wait').css("display", "none");}
//recupère la zone de saisie
view.zone_saisie = $('#zone_saisie');

view.supprParagraphe = function(elt) {
	//on récupère le parent du bouton sur lequel à cliqué l'utilisateur, c'est le paragraphe
	let paragraphe = elt.parentNode;
	//on demande au parent du paragraphe de le supprimer
	paragraphe.parentNode.removeChild(paragraphe);
	//on retourne le titre de l'annonce
	return paragraphe.getElementsByTagName("label")[0].textContent;
}
//change la valeur de la zone de saisie
view.setZoneRecherche = function (elt) {view.zone_saisie.val(elt.textContent); return  elt.textContent;}

view.clearResultat = function() { view.resultat.empty(); }

view.afficherOffre = function(recherche_courante_news)
{
	for(elt of recherche_courante_news)
  {
		  //ajoute des offre à la div resultat
      view.resultat.append('<p class="titre_result"><a class="titre_news" href="'+elt.url+'" target="_blank">'+elt.titre+'</a><span class="date_news">'+elt.date+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>');
  }
}

view.afficherRecherches = function(taille,recherches)
{
	for(label of recherches)
	{
		//ajoute des recherche à la div recherchesStockees
		view.addRecherche(taille,label);
	}
}

view.ajouterOffre = function(tabRes) {

	//index initialisé à -2 pour passer le test : sup à 0 et égaux
	//j'utilise cette solution avec deux index car indexOfResultat ne fonctionne pas pour moi
	let indexTitre = -2;
	let indexDate = -2;

	for(elt of tabRes)
	{
		indexTitre = recherche_courante_news.map(function(e) {
		return e.titre}).indexOf(decodeHtmlEntities(elt.titre));

		indexDate = recherche_courante_news.map(function(e) {
		return e.date}).indexOf(formatDate(elt.date),indexTitre);
		//on créer le paragraphe sans son image, selon si il est dans le local storage il aura soit une horloge, soit une disquette
		let paragraphe = '<p class="titre_result"><a class="titre_news" href="'+decodeHtmlEntities(elt.url)+'" target="_blank">'+decodeHtmlEntities(elt.titre)+'</a><span class="date_news">'+formatDate(elt.date);

		if(indexTitre==indexDate&&indexDate>=0)
		{
			paragraphe+=('</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>');
		}
		else {
			paragraphe+=('</span><span class="action_news" onclick="sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span></p>');
		}
		//on ajoute le resultat
		view.resultat.append(paragraphe);
	}
}

view.sauver_nouvelle = function(elt,supprimer) {
	//recup le père du l'element => le paragraphe
	let paragraphe = elt.parentNode;

  let lien = paragraphe.getElementsByTagName('a')[0];

  let date = paragraphe.getElementsByClassName('date_news')[0];
	//si true alors l'offre est supprimé du localStorage et doit donc avoir l'image d'horloge
	let image = supprimer == true ? "img/horloge15.jpg" : "img/disk15.jpg";
  elt.getElementsByTagName('img')[0].setAttribute("src", image);
	//creation d'objet avec le titre, la date et le lien
  let text = { "titre": lien.textContent , "date": date.textContent , "url": lien.href };

	return text;
}

view.attributSupprimer = function(elt) { elt.removeAttribute('onclick'); elt.setAttribute('onclick','supprimer_nouvelle(this)'); }

view.attributAjouter = function(elt) { elt.removeAttribute('onclick'); elt.setAttribute('onclick','sauver_nouvelle(this)'); }
