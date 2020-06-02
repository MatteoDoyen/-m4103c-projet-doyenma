

var controler = {};



controler.ajouter_recherche =  function ajouter_recherche() {

	let zoneRecherche = view.getRechercheValue();

  if(model.getIndexRecherche(zoneRecherche)<0)
  {

    model.addRecherches(zoneRecherche);

		let paragraphe = '<p id="'+recherches.length+"_label"+'"class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+zoneRecherche+'</label><img src="img/croix30.jpg" onclick="supprimer_recherche(this)" class="icone-croix"/></p>';

		view.addRechercheStockees(paragraphe);

		model.setItemRecherche();
  }
}
