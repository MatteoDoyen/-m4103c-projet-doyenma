var model = {};
model.recherche_courante = "";
model.recherches = [];
model.recherche_courante_news = [];
model.nomFonction = function() { ... }


var $zoneRecherche = $('#zone_saisie');

var $recherchesStockees = $('#recherches-stockees');

var $resultat = $('#resultats');

var $loading = $('#wait');

function ajouter_recherche() {
  if((recherches.indexOf($zoneRecherche.val(),1))<0)
  {
    recherches.push($zoneRecherche.val());
  	$recherchesStockees.append('<p id="'+recherches.length+"_label"+'"class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+$zoneRecherche.val()+'</label><img src="img/croix30.jpg" onclick="supprimer_recherche(this)" class="icone-croix"/></p>');

    sessionStorage.setItem("recherche",JSON.stringify(recherches));
  }
}


function supprimer_recherche(elt) {
  let paragraphe = elt.parentNode;
  paragraphe.parentNode.removeChild(paragraphe);
  if((recherches.indexOf(paragraphe.getElementsByTagName("label")[0].textContent))>=0)
  {
    recherches.splice(recherches.indexOf(paragraphe.getElementsByTagName("label")[0].textContent),1);
    sessionStorage.removeItem('recherches');
    sessionStorage.setItem("recherche",JSON.stringify(recherches));
  }
}


function selectionner_recherche(elt) {

  $resultat.text = '';

  $zoneRecherche.val(elt.textContent);

  recherche_courante_news = JSON.parse(sessionStorage.getItem(elt.textContent));

  for(elt of recherche_courante_news)
  {
      $resultat.append('<p class="titre_result"><a class="titre_news" href="'+elt.url+'" target="_blank">'+elt.Titre+'</a><span class="date_news">'+elt.date+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>');
  }

}


function init() {
  recherches = JSON.parse(sessionStorage.getItem("recherche"));
	for(label of recherches)
  {
    $recherchesStockees.append('<p id="'+recherches.length+"_label"+'"class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+label+'</label><img src="img/croix30.jpg" onclick="supprimer_recherche(this)" class="icone-croix"/></p>');
  }
}


function rechercher_nouvelles() {
  $resultat.empty();
  $loading.css("display", "block");

  if($zoneRecherche.val() in sessionStorage)
  {
    console.log("okok");
    recherche_courante_news = JSON.parse(sessionStorage.getItem($zoneRecherche.val()));
    console.log(recherche_courante_news);
  }

  recherche_courante_news
  ajax_get_request(maj_resultats,"https://carl-vincent.fr/search-internships.php?data="+$zoneRecherche.val(),true);
}


function maj_resultats(res) {
  var tabRes = JSON.parse(res);

  for(elt of tabRes)
  {
      let indexTitre = recherche_courante_news.map(function(e) {return e.Titre}).indexOf(elt.titre);
      let indexdate = recherche_courante_news.map(function(e) {return e.date}).indexOf(elt.date);

      let paragraphe = '<p class="titre_result"><a class="titre_news" href="'+elt.url+'" target="_blank">'+elt.titre+'</a><span class="date_news">'+elt.date+'</span><span class="action_news" onclick="sauver_nouvelle(this)">';

      if(indexTitre==indexdate&&indexdate>=0)
      {
        paragraphe +=('<img src="img/disk15.jpg"/></span></p>');
      }
      else {
        paragraphe+=('<img src="img/horloge15.jpg"/></span></p>');
      }
      $resultat.append(paragraphe);
  }
  $loading.css("display", "none");
}


function sauver_nouvelle(elt) {

  let paragraphe = elt.parentNode;

  let lien = paragraphe.getElementsByTagName('a')[0];

  let date = paragraphe.getElementsByClassName('date_news')[0];

  elt.getElementsByTagName('img')[0].setAttribute("src", "img/disk15.jpg");

  let text = { "Titre": lien.textContent , "date": date.textContent , "url": +lien.href };

  if((recherche_courante_news.indexOf(text))<0)
  {
    recherche_courante_news.push(text);

    sessionStorage.setItem($zoneRecherche.val(),JSON.stringify(recherche_courante_news));
  }

  elt.removeAttribute('onclick');
  elt.setAttribute('onclick','supprimer_nouvelle(this)')

}


function supprimer_nouvelle(elt) {


  let paragraphe = elt.parentNode;

  let lien = paragraphe.getElementsByTagName('a')[0];

  let date = paragraphe.getElementsByClassName('date_news')[0];

  elt.getElementsByTagName('img')[0].setAttribute("src", "img/horloge15.jpg");

  let text = { "Titre": lien.textContent , "date": date.textContent , "url": +lien.href };

  let index = recherche_courante_news.map(function(e) { return e.Titre; }).indexOf(lien.textContent);

  if(index>=0)
  {
    recherche_courante_news.splice(index,1);

    sessionStorage.removeItem(lien.textContent);
  }

  elt.removeAttribute('onclick');
  elt.setAttribute('onclick','sauver_nouvelle(this)')

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
