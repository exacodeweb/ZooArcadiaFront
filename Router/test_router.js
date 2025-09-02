import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
// Création d'une route pour la page 404 (page introuvable) 
const route404 = new Route("404", "Page introuvable", "/pages/404.html");
// Fonction pour récupérer la route correspondant à une URL donnée 
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance 
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404 
  if (currentRoute != null) {
    return currentRoute;
  }
  else {
    return route404;
  }
};
// Fonction pour charger le contenu de la page 
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de l'URL actuelle 
  const actualRoute = getRouteByUrl(path);
  // Récupération du contenu HTML de la route 
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page" 
  document.getElementById("main-page").innerHTML = html;
  // Ajout du contenu JavaScript 
  if (actualRoute.pathJS != "") {
    // Création d'une balise script 
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    // Ajout de la balise script au corps du document 
    document.querySelector("body").appendChild(scriptTag);
  }
  // Changement du titre de la page 
  document.title = actualRoute.title + " - " + websiteName;
};

const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();

  const href = event.target.getAttribute("href");

  // Si le lien contient un #ancre
  if (href.includes("#")) {
    const [url, anchor] = href.split("#");

    // On force le retour vers la home (index.html)
    window.history.pushState({}, "", "/index.html");

    // On recharge index.html
    LoadContentPage().then(() => {
      // Quand c’est chargé, scroll jusqu’à l’ancre
      if (anchor) {
        const target = document.getElementById(anchor);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  } else {
    // Cas normal
    window.history.pushState({}, "", href);
    LoadContentPage();
  }
};
