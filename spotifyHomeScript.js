/////////////////////////////////////
/////GESTIONE CARICAMENTO PAGINE/////
/////////////////////////////////////
const PATH_PAGINA_HOME = "spotifyHome.html";

function caricaSpotifyHome() {
  caricapagina(PATH_PAGINA_HOME);
}

function caricapagina(pagina) {
  window.location.replace(pagina);
}

/////////////////////////////////////////
/////DICHIARAZIONE VARIABILI GLOBALI/////
/////////////////////////////////////////
const spinner = document.querySelector("#spinner");
const API_URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
const sezioneDueColonne = document.querySelector("#sezioneDueColonne");
const sezioneFullWidth = document.querySelector("#sezioneFullWidth");

const heroSection = document.querySelector("#heroSection");
const imgHero = document.querySelector("#imgHero");
const songTitleHero = document.querySelector("#songTitleHero");
const artistNameHero = document.querySelector("#artistNameHero");
const albumDescriptionHero = document.querySelector("#albumDescriptionHero");

const audio = document.getElementById('audioPlayer');
const btnPlay = document.getElementById('btnPlay');
const iconPlay = btnPlay.querySelector('i');
const btnPlayMobile = document.getElementById('btnPlayMobile');
const iconPlayMobile = btnPlayMobile.querySelector('i');
const volumeRange = document.getElementById('volumeRange');
const btnVolume = document.getElementById('btnVolume');
const iconVolume = btnVolume.querySelector('i');

////////////////////////////////////
/////GESTIONE CHIAMATA FUNZIONI/////
////////////////////////////////////
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("spotifyHome.html")) {
    gestisciSpinner();
    aggiornaSaluto();
    fetchaAlbumColonne();
  }
});

///////////////////////////////
/////GESTIONE CHIAMATE API/////
///////////////////////////////
async function fetchaAlbumColonne(query) {
  try {
    const response = await fetch(API_URL + encodeURIComponent(query));

    if (!response.ok) {
      throw new Error("Errore nella fetch");
    }

    const data = await response.json();
    console.log(data.data);
    sezioneDueColonne.innerHTML = "";
    sezioneFullWidth.innerHTML = "";

    const shuffledData = data.data
      .filter(song => song.album && song.album.title && song.album.cover)
      .sort(() => Math.random() - 0.5);


    //Shuffle per 6 album sezione DueColonne
    shuffledData.slice(0, 6).forEach((song) => {
      const card = cardDueColonne(song.album);
      sezioneDueColonne.appendChild(card);
    });

    //Shuffle per 5 album sezione SingolaColonna
    shuffledData.slice(6, 11).forEach((song) => {
      const card = cardSingolaColonna(song.album);
      sezioneFullWidth.appendChild(card);
    });

    if (data.data.length > 0) {
      popolaHero(data.data[0]);
      popolaPlayerBar(data.data[0]);
    }
  } catch (error) {
    console.log("Errore nella fetch: ", error);
  }
}


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

/////////////////////////////////
/////GESTIONE SALUTO ACCESSO/////
/////////////////////////////////
function aggiornaSaluto() {
  const ora = new Date().getHours();
  const saluto =
    ora >= 5 && ora < 12
      ? "Buongiorno"
      : ora >= 12 && ora < 18
        ? "Buon pomeriggio"
        : "Buonasera";
  document.querySelectorAll(".benvenutoOrario").forEach((el) => {
    el.textContent = saluto;
  });
}

//////////////////////////////////////////////////////
/////GESTIONE CREAZIONE DINAMICA CARD DUE COLONNE/////
//////////////////////////////////////////////////////
function cardDueColonne(album) {
  //Col
  const col = document.createElement("div");
  col.className = "col-6 col-md-4 d-flex";

  //Link
  const linkCard = document.createElement("a");
  linkCard.href = `album.html?id=${album.id}`;
  linkCard.className = "text-decoration-none text-white w-100";

  //Card
  const card = document.createElement("div");
  card.className = "card bg-dark text-white p-2 h-100 w-100 card-contenuto";
  card.id = "cardsSopra";

  //Riga per 3 colonne nella card
  const rigaCard = document.createElement("div");
  rigaCard.className = "d-flex flex-nowrap align-items-center";
  card.appendChild(rigaCard);

  //Colonna Img a sx
  const colImg = document.createElement("div");
  colImg.style.flex = "0 0 auto";

  const imgCard = document.createElement("img");
  imgCard.className = "img-fluid rounded me-2";
  imgCard.src = album.cover_small;
  imgCard.style.width = "50px";
  colImg.appendChild(imgCard);

  //Colonna Titolo centro
  const colTitolo = document.createElement("div");
  colTitolo.style.flex = "1 1 auto";
  colTitolo.style.minWidth = "0";

  const titoloCard = document.createElement("p");
  titoloCard.className = "mb-0 text-truncate me-2";
  titoloCard.style.whiteSpace = "nowrap";
  titoloCard.style.overflow = "hidden";
  titoloCard.style.textOverflow = "ellipsis";
  titoloCard.innerText = album.title;
  colTitolo.appendChild(titoloCard);

  //Colonna Icona more
  const colIconaMore = document.createElement("div");
  colIconaMore.style.flex = "0 0 auto";

  const btnMore = document.createElement("button");
  btnMore.className =
    "btn p-1 d-flex align-items-center justify-content-center";
  btnMore.style.borderRadius = "50%";
  btnMore.style.width = "35px";
  btnMore.style.height = "35px";

  const iconaMore = document.createElement("i");
  iconaMore.className = "bi bi-three-dots text-success";

  btnMore.appendChild(iconaMore);
  colIconaMore.appendChild(btnMore);

  rigaCard.append(colImg, colTitolo, colIconaMore);
  card.appendChild(rigaCard);
  linkCard.appendChild(card);
  col.appendChild(linkCard);

  return col;
}

/////////////////////////////////////////////////////
/////GESTIONE CREAZIONE DINAMICA CARD FULL-WIDTH/////
/////////////////////////////////////////////////////
function cardSingolaColonna(album) {
  //Col
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-2";

  //Link
  const link = document.createElement("a");
  link.href = `album.html?id=${album.id}`;
  link.className = "text-decoration-none";
  link.style.color = "inherit";
  link.style.display = "block";

  //Card
  const card = document.createElement("div");
  card.className = "card text-white h-100 w-100 p-2 d-flex flex-column card-contenuto";
  card.id = "cardsSotto";

  //Container card top
  const containerCardTop = document.createElement("div");
  containerCardTop.className = "d-flex d-md-block";

  //Img card
  const imgCard = document.createElement("img");
  imgCard.className = "img-fluid card-img-top";
  imgCard.src = album.cover;
  imgCard.style.minHeight = "200px";
  imgCard.style.maxHeight = "200px";
  imgCard.style.objectFit = "contain";
  containerCardTop.appendChild(imgCard);

  //Container testi top
  const containerTestiTop = document.createElement("div");
  containerTestiTop.className =
    "text-card d-md-block flex-grow-1 overflow-hidden";
  containerCardTop.appendChild(containerTestiTop);

  //Testo Playlist
  const playlistStr = document.createElement("small");
  playlistStr.className = "text-secondary ms-2";
  playlistStr.innerText = "Playlist";
  containerTestiTop.appendChild(playlistStr);

  //Titolo album
  const titoloAlbum = document.createElement("p");
  titoloAlbum.className = "mb-0 text-truncate ms-2";
  titoloAlbum.innerText = album.title;
  containerTestiTop.appendChild(titoloAlbum);

  //Container card bottom
  const containerCardBottom = document.createElement("div");
  containerCardBottom.className =
    "d-flex justify-content-between align-items-center pt-2";

  //Lato sx bottom
  const containerBottomSx = document.createElement("div");
  containerBottomSx.className = "d-flex";
  containerCardBottom.appendChild(containerBottomSx);

  //Icona cuore
  const btnCuore = document.createElement("button");
  btnCuore.className =
    "btn p-1 d-flex align-items-center justify-content-center";
  btnCuore.style.borderRadius = "50%";
  btnCuore.style.width = "35px";
  btnCuore.style.height = "35px";

  const iconaCuore = document.createElement("i");
  iconaCuore.className = "bi bi-heart-fill text-success";

  btnCuore.appendChild(iconaCuore);
  containerBottomSx.appendChild(btnCuore);

  //Icona tre puntini verticali
  const btnMore = document.createElement("button");
  btnMore.className =
    "btn p-1 d-flex align-items-center justify-content-center";
  btnMore.style.borderRadius = "50%";
  btnMore.style.width = "35px";
  btnMore.style.height = "35px";

  const iconaMoreVertical = document.createElement("i");
  iconaMoreVertical.className = "bi bi-three-dots-vertical text-white";

  btnMore.appendChild(iconaMoreVertical);
  containerBottomSx.appendChild(btnMore);

  //Lato dx bottom
  const containerBottomDx = document.createElement("div");
  containerBottomDx.className = "d-flex align-items-center flex-shrink-0";
  containerCardBottom.appendChild(containerBottomDx);

  //Numero brani
  const numeroRandom = Math.floor(Math.random() * 30) + 1;

  const numeroBrani = document.createElement("small");
  numeroBrani.className = "card-text text-secondary m-0 me-3 d-block d-md-none d-xl-block";
  numeroBrani.innerText = `${numeroRandom} brani`;
  containerBottomDx.appendChild(numeroBrani);

  //Icona play
  const btnPlay = document.createElement("button");
  btnPlay.className = "btn p-1 d-flex align-items-center justify-content-center";
  btnPlay.style.borderRadius = "50%";
  btnPlay.style.width = "35px";
  btnPlay.style.height = "35px";
  btnPlay.style.backgroundColor = "black";
  btnPlay.style.opacity = "0.5";

  const iconaPlay = document.createElement("i");
  iconaPlay.className = "bi bi-play-fill text-light";

  btnPlay.appendChild(iconaPlay);
  containerBottomDx.appendChild(btnPlay);

  card.append(containerCardTop, containerCardBottom);
  link.appendChild(card);
  col.appendChild(link);
  sezioneFullWidth.appendChild(col);

  return col;
}

//////////////////////////////////////////////////
/////GESTIONE CREAZIONE DINAMICA SEZIONE HERO/////
//////////////////////////////////////////////////
function popolaHero(song) {
  imgHero.src = song.album.cover;
  songTitleHero.innerText = song.album.title;
  artistNameHero.innerText = song.artist.name;
  albumDescriptionHero.innerText = `Ascolta il nuovo brano di ${song.artist.name}`;
  albumDescriptionHero.className = "text-light";
}

//////////////////////////////////////////////
/////GESTIONE FUNZIONAMENTO PLAYBAR SONGS/////
//////////////////////////////////////////////
function popolaPlayerBar(song) {
  const imgAlbumPlayerBar = document.querySelector("#imgAlbumPlayerBar");
  imgAlbumPlayerBar.src = song.album.cover_small;
  imgAlbumPlayerBar.alt = song.album.title;

  const titoloPlayerBar = document.querySelector("#titoloPlayerBar");
  const wrapper = document.querySelector("#titoloWrapper");

  //Reset animazione e testo
  titoloPlayerBar.classList.remove("scroll-attiva");
  titoloPlayerBar.innerText = song.title;

  //Se il titolo è più lungo dello spazio visibile, si attiva l'animazione
  setTimeout(() => {
    if (titoloPlayerBar.scrollWidth > wrapper.clientWidth) {
      titoloPlayerBar.classList.add("scroll-attiva");
    }
  }, 100);

  const artistaPlayerBar = document.querySelector("#artistaPlayerBar");
  artistaPlayerBar.innerText = song.artist.name;

  audio.src = song.preview;


  btnPlay.addEventListener('click', () => {
    togglePlay(audio, iconPlay);
  });

  btnPlayMobile.addEventListener('click', () => {
    togglePlay(audio, iconPlayMobile);
  });

  function togglePlay(audio, icon) {
    if (audio.paused) {
      audio.play();
      icon.classList.remove('bi-play-circle-fill');
      icon.classList.add('bi-pause-circle-fill');
    } else {
      audio.pause();
      icon.classList.remove('bi-pause-circle-fill');
      icon.classList.add('bi-play-circle-fill');
    }
  }

  function resetIconePlay() {
    iconPlay.classList.remove('bi-pause-circle-fill');
    iconPlay.classList.add('bi-play-circle-fill');

    iconPlayMobile.classList.remove('bi-pause-circle-fill');
    iconPlayMobile.classList.add('bi-play-circle-fill');
  }

}

//Volume inizializzato al 50%
audio.volume = 0.5;

volumeRange.addEventListener('input', () => {
  const volumeValue = volumeRange.value / 100;
  audio.volume = volumeValue;

  aggiornaIconaVolume(volumeValue);
});

btnVolume.addEventListener('click', () => {
  // Mute/unmute toggle
  if (audio.volume > 0) {
    audio.dataset.previousVolume = audio.volume;
    audio.volume = 0;
    volumeRange.value = 0;
  } else {
    audio.volume = audio.dataset.previousVolume || 0.5;
    volumeRange.value = audio.volume * 100;
  }

  aggiornaIconaVolume(audio.volume);
});

function aggiornaIconaVolume(volume) {
  iconVolume.className = 'bi'; // reset icona

  if (volume === 0) {
    iconVolume.classList.add('bi-volume-mute-fill');
  } else if (volume <= 0.3) {
    iconVolume.classList.add('bi-volume-down-fill');
  } else {
    iconVolume.classList.add('bi-volume-up-fill');
  }
}
