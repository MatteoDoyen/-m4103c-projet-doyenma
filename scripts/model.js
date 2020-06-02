


var model = {};



model.recherche_courante = "";
model.recherches = [];
model.recherche_courante_news = [];
model.nomFonction = function() { ... }

model.addRecherches = function(elt) { recherches.push(elt); }

model.getIndexRecherche = function(elt) { return model.recherches.indexOf(elt,1); }

model.setItemRecherche = function() { localStorage.setItem("recherche",JSON.stringify(recherches)); }
