/* ===========================================
   AGRI-TECH - CALCULATEUR AGRICOLE
   JavaScript professionnel
=========================================== */


// Base de données des cultures
const cultures = {

    mais: {
        nom: "Maïs",
        semence: 20, // kg/ha
        duree: "90 - 120 jours",
        rendement: 4000, // kg/ha
        prixVente: 300
    },

    sorgho: {
        nom: "Sorgho",
        semence: 10,
        duree: "100 - 130 jours",
        rendement: 2500,
        prixVente: 350
    },

    mil: {
        nom: "Mil",
        semence: 8,
        duree: "90 - 110 jours",
        rendement: 2000,
        prixVente: 300
    },

    arachide: {
        nom: "Arachide",
        semence: 80,
        duree: "90 - 120 jours",
        rendement: 1500,
        prixVente: 600
    },

    gombo: {
        nom: "Gombo",
        semence: 5,
        duree: "60 - 90 jours",
        rendement: 12000,
        prixVente: 500
    },

    tomate: {
        nom: "Tomate",
        semence: 0.5,
        duree: "70 - 90 jours",
        rendement: 25000,
        prixVente: 400
    },

    piment: {
        nom: "Piment",
        semence: 1,
        duree: "90 - 150 jours",
        rendement: 10000,
        prixVente: 800
    },

    oignon: {
        nom: "Oignon",
        semence: 5,
        duree: "120 - 150 jours",
        rendement: 30000,
        prixVente: 350
    },

    papaye: {
        nom: "Papaye",
        semence: 0.5,
        duree: "8 - 12 mois",
        rendement: 20000,
        prixVente: 500
    },

    poivron: {
        nom: "Poivron",
        semence: 1,
        duree: "90 - 120 jours",
        rendement: 15000,
        prixVente: 600
    }

};



// Fonction principale de calcul

function calculer(){


    let culture = document.getElementById("culture").value;

    let surface = Number(document.getElementById("surface").value);

    let prixSemence = Number(document.getElementById("prix").value);



    if(culture === "" || surface <= 0 || prixSemence <= 0){

        alert("Veuillez remplir tous les champs correctement.");

        return;

    }



    let plante = cultures[culture];



    // Calculs

    let besoinSemence = plante.semence * surface;

    let coutSemence = besoinSemence * prixSemence;

    let production = plante.rendement * surface;

    let chiffreAffaire = production * plante.prixVente;

    let benefice = chiffreAffaire - coutSemence;



    // Affichage des résultats

    document.getElementById("resCulture").innerHTML = plante.nom;

    document.getElementById("resSurface").innerHTML =
    surface + " hectare(s)";


    document.getElementById("resSemence").innerHTML =
    besoinSemence.toFixed(2) + " kg";


    document.getElementById("resCout").innerHTML =
    coutSemence.toLocaleString() + " FCFA";


    document.getElementById("resDuree").innerHTML =
    plante.duree;


    document.getElementById("resRendement").innerHTML =
    plante.rendement.toLocaleString() + " kg/ha";


    document.getElementById("resProduction").innerHTML =
    production.toLocaleString() + " kg";


    document.getElementById("resPrixVente").innerHTML =
    plante.prixVente + " FCFA/kg";


    document.getElementById("resCA").innerHTML =
    chiffreAffaire.toLocaleString() + " FCFA";


    document.getElementById("resBenefice").innerHTML =
    benefice.toLocaleString() + " FCFA";


}



// Fonction réinitialiser

function reinitialiser(){


    document.getElementById("culture").value = "";

    document.getElementById("surface").value = "";

    document.getElementById("prix").value = "";



    document.getElementById("resCulture").innerHTML = "-";

    document.getElementById("resSurface").innerHTML = "-";

    document.getElementById("resSemence").innerHTML = "-";

    document.getElementById("resCout").innerHTML = "-";

    document.getElementById("resDuree").innerHTML = "-";

    document.getElementById("resRendement").innerHTML = "-";

    document.getElementById("resProduction").innerHTML = "-";

    document.getElementById("resPrixVente").innerHTML = "-";

    document.getElementById("resCA").innerHTML = "-";

    document.getElementById("resBenefice").innerHTML = "-";


}
