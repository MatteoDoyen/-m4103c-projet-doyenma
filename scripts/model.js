var model = {};

var recherches = [];
var recherche_courante_news = [];

var tableauDeRecherchesTape = []

model.getIndextableauDeRecherchesTape = function(recherche) { return tableauDeRecherchesTape.indexOf(recherche,0);}

model.getTableauDeRecherchesTape = function() { return tableauDeRecherchesTape;}

model.addTableauDeRecherchesTape = function(recherche) { tableauDeRecherchesTape.push(recherche)

  if("rechercheTaper" in localStorage)
  {
    localStorage.removeItem('rechercheTaper');
  }
  localStorage.setItem("rechercheTaper",JSON.stringify(tableauDeRecherchesTape));

  ;}

model.getIndexRecherches = function(recherche) { return recherches.indexOf(recherche,0); }

model.getIndexRecherchesCourantes = function(recherche) { return recherche_courante_news.indexOf(recherche,0);}
//ajoute la recherche au tableau puis ajoute le tableau au localStorage
model.addRecherches = function(recherche) {recherches.push(recherche);  localStorage.setItem("recherche",JSON.stringify(recherches));  }
//ajoutel'offre au tableau puis ajoute le tableau au localStorage
model.addOffres = function(recherche_courante,text) { recherche_courante_news.push(text); localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news)); }

model.suppRecherches = function(index) {
  //supprime du tableau
  recherches.splice(index,1);
  //supprime le tableau du localStorage
  localStorage.removeItem('recherche');
  //si le tableau à au moins un élément après suppression alors on l'ajoute au localStorage à nouveau
  if(recherches.length>0)
  {
    localStorage.setItem("recherche",JSON.stringify(recherches));
  }
}

//recupère les offres du localStorage et les renvoie
model.recupererOffre = function(recherche) {

  recherche_courante_news = JSON.parse(localStorage.getItem(recherche));

  return recherche_courante_news;
}
//recupère les recherches du localStorage et les renvoie
model.recupererRecherches = function() {

  recherches = JSON.parse(localStorage.getItem("recherche"));

  return recherches;
}

model.recupererOffres = function(res){ return JSON.parse(res) }


//récupère l'index de l'objet et le supprime
model.supprimerRechecheCourante = function(text,recherche_courante) {

  let index = recherche_courante_news.map(function(e) { return e.titre; }).indexOf(text.lien);

  recherche_courante_news.splice(index,1);

  localStorage.removeItem(recherche_courante);

  if(recherche_courante_news.length>0)
  {
    localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
  }
}
