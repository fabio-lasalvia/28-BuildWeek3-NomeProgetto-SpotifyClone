/////////////////////////////////////////
/////DICHIARAZIONE VARIABILI GLOBALI/////
/////////////////////////////////////////
const spinner = document.querySelector("#spinner");

////////////////////////////////////
/////GESTIONE CHIAMATA FUNZIONI/////
////////////////////////////////////
window.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("spotifyCerca.html")) {
        gestisciSpinner();
        //aggiornaSaluto();
    }
});

//////////////////////////
/////GESTIONE SPINNER/////
//////////////////////////
function gestisciSpinner() {
    // Verifico se il caricamento della pagina è già terminato
    if (document.readyState === "complete") {
        // Se sì, nascondo lo spinner
        spinner.classList.add("d-none");
    } else {
        // Se la pagina non è ancora completamente caricata,
        // allora aspetta l'evento "load" (il completamento del caricamento)
        window.addEventListener("load", () => {
            // Quando il caricamento è finito, si nasconde lo spinner
            spinner.classList.add("d-none");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const contenitoreCard = document.getElementById("contenitoreCard");

    const generiMusicaliFinti = [
        { id: 1, title: "Jazz", cover_small: "img/genereMusicale/jazz.png" },
        { id: 2, title: "Hip Hop", cover_small: "img/genereMusicale/hipHop.png" },
        { id: 3, title: "Techno", cover_small: "img/genereMusicale/techno.png" },
        { id: 4, title: "Rock", cover_small: "img/genereMusicale/rock.png" },
        { id: 5, title: "Indie", cover_small: "img/genereMusicale/indie.png" },
        { id: 6, title: "Trap", cover_small: "img/genereMusicale/trap.png" },
        { id: 7, title: "Classica", cover_small: "img/genereMusicale/classica.png" },
        { id: 8, title: "Reggae", cover_small: "img/genereMusicale/reggae.png" },
        { id: 9, title: "Pop", cover_small: "img/genereMusicale/pop.png" },
        { id: 10, title: "Blues", cover_small: "img/genereMusicale/blues.png" },
        { id: 11, title: "Metal", cover_small: "img/genereMusicale/metal.png" },
        { id: 12, title: "Funk", cover_small: "img/genereMusicale/funk.png" },
        { id: 13, title: "Country", cover_small: "img/genereMusicale/country.png" },
        { id: 14, title: "Soul", cover_small: "img/genereMusicale/soul.png" },
        { id: 15, title: "Latin", cover_small: "img/genereMusicale/latin.png" },
    ];


    generiMusicaliFinti.forEach((genere) => {
        const card = cardDueColonne(genere);
        contenitoreCard.appendChild(card);
    });
});



function cardDueColonne(album) {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4";

    const card = document.createElement("div");
    card.className = "card bg-dark text-white h-100";

    const img = document.createElement("img");
    img.src = album.cover_small;
    img.className = "card-img-top";
    img.alt = album.title;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = album.title;

    cardBody.appendChild(title);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}
