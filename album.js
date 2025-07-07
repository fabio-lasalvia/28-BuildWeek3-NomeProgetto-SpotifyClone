const indirizzo = window.location.search;
const searchIndirizzo = new URLSearchParams(indirizzo);
const albumId = searchIndirizzo.get(`id`);
const coverContainer = document.querySelector("#copertina-album");
const braniContainer = document.querySelector("#titoli-album");
const playerImage = document.querySelector("#imgAlbumPlayerBar");
let artistId;

//chiamata per collegamento pagina artista
async function getArtistId(id) {
  try {
    const risultato = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`
    );
    const artistData = await risultato.json();
    console.log("Dati artista:", artistData);
  } catch (e) {
    console.log(e);
  }
}

//crea la chiamata per la risorsa specifica
async function getAlbumId() {
  try {
    const result = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    );
    const identification = await result.json();
    console.log(identification);

    const artistName = identification.artist.name;
    const artistImage = identification.artist.picture_small;
    const releaseYear = new Date(identification.release_date).getFullYear();
    const numberOfTracks = identification.nb_tracks;
    const totalDuration = identification.duration;
    const song = identification.tracks.data[0];
    artistId = identification.artist.id;

    //passa i dati per le info sull'artista
    getArtistId(artistId);

    //calcola minuti e secondi
    const minuti = Math.floor(totalDuration / 60);
    const secondi = totalDuration % 60;

    coverContainer.innerHTML = `
    <img id="album-cover" src="${
      identification.cover_big
    }" alt="" crossorigin="anonymous" />
          <div class="album-text-container">
              <p class="d-none d-md-block text-white">ALBUM</p>
              <p class="d-sm-block d-lg-none text-white">Album &middot; ${releaseYear}</p>
              <h1 class="text-white">${identification.title}</h1>
            <div id="album-artist-info">
              <img src="${artistImage}" alt="${artistName}" class="artist-icon">
              <h6 class="artist-name text-white"><strong><a href="artist.html?id=${artistId}" class="text-white text-decoration-none">${artistName} </a></strong></h6>
              <span><strong>&middot;</strong><strong>  ${releaseYear} &middot;</strong></span>
              <span><strong>${numberOfTracks} brani,</strong></span>
              <span>${minuti} min ${secondi
      .toString()
      .padStart(2, "0")} sec.</span>
            </div>
          </div>`;

    ////////////////PRENDI IL COLORE DELL'ALBUM E RENDILO SFUMATO COME SFONDO////////////////

    const img = document.getElementById("album-cover");
    const albumArea = document.getElementById("album-area");
    const colorThief = new ColorThief();
    //  colorThief.getColor(document.getElementById("album-cover"));

    //Se l'immagine e' gia' caricata, prendi subito il colore
    if (img.complete) {
      setGradient();
    } else {
      img.addEventListener("load", setGradient);
    }

    //per ottenere un gradiente personalizzato, parte dal colore dominante della copertina e sfuma verso il nero(#121212)
    function setGradient() {
      const color = colorThief.getColor(img); // [r, g, b]
      const gradient = `linear-gradient(to bottom, rgb(${color[0]}, ${color[1]}, ${color[2]}), #121212)`;
      albumArea.style.background = gradient;
    }

    //Tracce
    braniContainer.innerHTML = `
<div class="traccia header">
<div class="col numero">#</div>
<div class= "col titolo"> Titolo</div>
<div class="col riproduzioni">Riproduzioni</div>
<div class="col durata"><i class="fa-regular fa-clock"></i></div>
</div>`;

    

    identification.tracks.data.forEach((track, index) => {
      braniContainer.innerHTML += `
    <div class="traccia">
        <div class="col titolo">
            <span class="numero">${index + 1}</span>
            <div class="info"><strong>${track.title}</strong>
            <br/><span class="artista">${track.artist.name}</span>
            </div>
        </div>
        <div class="col riproduzioni">${track.rank.toLocaleString()}</div>
        <div class="col durata">${secondsToMinutes(track.duration)}</div>
        <div class="d-sm-flex d-md-none  d-lg-none"><i class="fa-solid fa-ellipsis-vertical text-white"></i></div>
    </div>`;
    });

    if (!albumId) {
      alert("Nessun album selezionato! Ritorna alla homepage.");
      window.location.href = "index.html"; //qui va inserito il file della homepage
      return;
    }

    console.log("Indirizzo completo:", window.location.href);
    console.log("albumId:", albumId);
    
    popolaPlayerBar(song);

    //////////////////////////////////////////////
    /////GESTIONE FUNZIONAMENTO PLAYBAR SONGS/////
    //////////////////////////////////////////////
    function popolaPlayerBar(song) {
      const imgAlbumPlayerBar = document.querySelector("#imgAlbumPlayerBar");
      imgAlbumPlayerBar.src = song.album
        ? song.album.cover_small
        : identification.cover_small;
      imgAlbumPlayerBar.alt = song.title;

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

      btnPlay.addEventListener("click", () => {
        togglePlay(audio, iconPlay);
      });

      btnPlayMobile.addEventListener("click", () => {
        togglePlay(audio, iconPlayMobile);
      });

      function togglePlay(audio, icon) {
        if (audio.paused) {
          audio.play();
          icon.classList.remove("bi-play-circle-fill");
          icon.classList.add("bi-pause-circle-fill");
        } else {
          audio.pause();
          icon.classList.remove("bi-pause-circle-fill");
          icon.classList.add("bi-play-circle-fill");
        }
      }

      function resetIconePlay() {
        iconPlay.classList.remove("bi-pause-circle-fill");
        iconPlay.classList.add("bi-play-circle-fill");

        iconPlayMobile.classList.remove("bi-pause-circle-fill");
        iconPlayMobile.classList.add("bi-play-circle-fill");
      }
    }
  } catch (e) {
    console.log(e);
  }
}

getAlbumId();

//Funzione per rendere leggibili minuti e secondi
function secondsToMinutes(sec) {
  const min = Math.floor(sec / 60); //sec input esterno, math.floor per calcolare quanti minuti interi ci sono
  const secLeft = sec % 60; //calcolo dei secondi restanti
  return `${min}:${secLeft.toString().padStart(2, "0")}`; // secLeft.toString().padStart(2, "0") serve per aggiungere lo zero davanti se i secondi sono meno di 10.
}
