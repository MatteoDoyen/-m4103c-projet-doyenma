var model = {};

model.recherche_courante = "";
model.recherches = [];
model.recherche_courante_news = [];
model.tableauDeRecherchesTape = [];

model.getIndextableauDeRecherchesTape = function(recherche) { return model.tableauDeRecherchesTape.indexOf(recherche,0);}

model.fillTableauDeRecherchesTape = function() {
  //si il existe des recherches tapé dans le local storage on les récupère
  if("rechercheTaper" in localStorage)
  {
    model.tableauDeRecherchesTape = JSON.parse(localStorage.getItem("rechercheTaper"));
  }
  return model.tableauDeRecherchesTape;
}
//ajoute une recherche tapé au tableau et au localStorage
model.addTableauDeRecherchesTape = function(recherche) {
  model.tableauDeRecherchesTape.push(recherche);
  if("rechercheTaper" in localStorage)
  {
    localStorage.removeItem('rechercheTaper');
  }
  localStorage.setItem("rechercheTaper",JSON.stringify(model.tableauDeRecherchesTape));
}

model.getIndexRecherches = function(recherche) { return model.recherches.indexOf(recherche,0); }

model.getIndexRecherchesCourantes = function(recherche) { return model.recherche_courante_news.indexOf(recherche,0);}
//ajoute la recherche au tableau puis ajoute le tableau au localStorage
model.addRecherches = function(recherche) {model.recherches.push(recherche);  localStorage.setItem("recherche",JSON.stringify(model.recherches));  }
//ajoutel'offre au tableau puis ajoute le tableau au localStorage
model.addOffres = function(recherche_courante,text) { model.recherche_courante_news.push(text); localStorage.setItem(recherche_courante,JSON.stringify(model.recherche_courante_news)); }

model.suppRecherches = function(index) {
  //supprime du tableau
  model.recherches.splice(index,1);
  //supprime le tableau du localStorage
  localStorage.removeItem('recherche');
  //si le tableau à au moins un élément après suppression alors on l'ajoute au localStorage à nouveau
  if(model.recherches.length>0)
  {
    localStorage.setItem("recherche",JSON.stringify(model.recherches));
  }
}

//recupère les offres du localStorage et les renvoie
model.recupererOffre = function(recherche) {

  model.recherche_courante_news = JSON.parse(localStorage.getItem(recherche));

  return model.recherche_courante_news;
}
//recupère les recherches du localStorage et les renvoie
model.recupererRecherches = function() {

  model.recherches = JSON.parse(localStorage.getItem("recherche"));

  return model.recherches;
}

model.recupererOffres = function(res){ return JSON.parse(res) }


//récupère l'index de l'objet et le supprime
model.supprimerRechecheCourante = function(text,recherche_courante) {

  let index = model.recherche_courante_news.map(function(e) { return e.titre; }).indexOf(text.lien);

  model.recherche_courante_news.splice(index,1);

  localStorage.removeItem(recherche_courante);

  if(model.recherche_courante_news.length>0)
  {
    localStorage.setItem(recherche_courante,JSON.stringify(model.recherche_courante_news));
  }
}
