recherche_courante// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];

var $zoneRecherche = $('#zone_saisie');

var $recherchesStockees = $('#recherches-stockees');

var $resultat = $('#resultats');

var $loading = $('#wait');

function ajouter_recherche() {
   recherche_courante = $zoneRecherche.val();

  if((recherches.indexOf(recherche_courante,1))<0)
  {
    recherches.push(recherche_courante);
  	$recherchesStockees.append('<p id="'+recherches.length+"_label"+'"class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+recherche_courante+'</label><img src="img/croix30.jpg" onclick="supprimer_recherche(this)" class="icone-croix"/></p>');

    localStorage.setItem("recherche",JSON.stringify(recherches));
  }
}

document.addEventListener('keydown', logKey);

function logKey(e) {
  if(e.keyCode===13)
  {
    rechercher_nouvelles();
  }
}

function supprimer_recherche(elt) {
  let paragraphe = elt.parentNode;
  paragraphe.parentNode.removeChild(paragraphe);
  if((recherches.indexOf(paragraphe.getElementsByTagName("label")[0].textContent))>=0)
  {
    recherches.splice(recherches.indexOf(paragraphe.getElementsByTagName("label")[0].textContent),1);

    localStorage.removeItem('recherche');

    if(recherches.length>0)
    {
      localStorage.setItem("recherche",JSON.stringify(recherches));
    }
  }
}


function selectionner_recherche(elt) {

  $resultat.empty();

  $zoneRecherche.val(elt.textContent);

  if(elt.textContent in localStorage)
  {
    recherche_courante_news = JSON.parse(localStorage.getItem(elt.textContent));

    for(elt of recherche_courante_news)
    {
        $resultat.append('<p class="titre_result"><a class="titre_news" href="'+elt.url+'" target="_blank">'+elt.titre+'</a><span class="date_news">'+elt.date+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>');
    }
  }
}


function init() {
  if('recherche' in localStorage)
  {
    recherches = JSON.parse(localStorage.getItem("recherche"));
    for(label of recherches)
    {
      $recherchesStockees.append('<p id="'+recherches.length+"_label"+'"class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+label+'</label><img src="img/croix30.jpg" onclick="supprimer_recherche(this)" class="icone-croix"/></p>');
    }
  }
}


function rechercher_nouvelles() {
  $resultat.empty();

  recherche_courante = $zoneRecherche.val();

  $loading.css("display", "block");

  if(recherche_courante in localStorage)
  {
    recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
  }

  ajax_get_request(maj_resultats,"https://carl-vincent.fr/search-internships.php?data="+recherche_courante,true);
}


function maj_resultats(res) {
  var tabRes = JSON.parse(res);

  for(elt of tabRes)
  {

      let paragraphe = '<p class="titre_result"><a class="titre_news" href="'+decodeHtmlEntities(elt.url)+'" target="_blank">'+decodeHtmlEntities(elt.titre)+'</a><span class="date_news">'+formatDate(elt.date);

      if(indexOfResultat(tabRes,elt)>=0)
      {
        paragraphe +=('</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>');
      }
      else {
        paragraphe+=('</span><span class="action_news" onclick="sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span></p>');
      }
      $resultat.append(paragraphe);
  }
  $loading.css("display", "none");
}


function sauver_nouvelle(elt) {

  recherche_courante = $zoneRecherche.val();

  let paragraphe = elt.parentNode;

  let lien = paragraphe.getElementsByTagName('a')[0];

  let date = paragraphe.getElementsByClassName('date_news')[0];

  elt.getElementsByTagName('img')[0].setAttribute("src", "img/disk15.jpg");

  let text = { "titre": lien.textContent , "date": date.textContent , "url": +lien.href };

  if((recherche_courante_news.indexOf(text))<0)
  {
    recherche_courante_news.push(text);

    localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
  }

  elt.removeAttribute('onclick');
  elt.setAttribute('onclick','supprimer_nouvelle(this)')

}


function supprimer_nouvelle(elt) {

  let paragraphe = elt.parentNode;

  recherche_courante = $zoneRecherche.val();

  let lien = paragraphe.getElementsByTagName('a')[0];

  let date = paragraphe.getElementsByClassName('date_news')[0];

  elt.getElementsByTagName('img')[0].setAttribute("src", "img/horloge15.jpg");

  let text = { "titre": lien.textContent , "date": date.textContent , "url": +lien.href };

  let index = recherche_courante_news.map(function(e) { return e.titre; }).indexOf(lien.textContent);

  recherche_courante_news.splice(index,1);

  localStorage.removeItem(recherche_courante);

  if(recherche_courante_news.length>0)
  {
    localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
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
