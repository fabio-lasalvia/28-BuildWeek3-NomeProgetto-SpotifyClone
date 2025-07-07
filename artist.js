// Variabili
const params = new URLSearchParams(window.location.search);
const artistName = document.querySelector("#artist-name");
const ascoltatoriMensili = document.querySelectorAll(".monthly-listeners");
const artistHero = document.querySelector(".hero-section");
const followButton = document.querySelectorAll(".follow-btn");

// Variabili per la sezione "Brani che ti piacciono"
const artistaImg = document.querySelector(".brani-images");
const braniSubtitle = document.querySelector(".brani-subtitle");

// Variabili per il player
const audioPlayer = document.querySelector("#audio-player");
const playerTitle = document.querySelector("#player-title");
const playerArtist = document.querySelector("#player-artist");
const playerCover = document.querySelector("#player-cover");
const playPauseBtn = document.querySelector("#play-pause");
const trackDuration = document.querySelector("#track-duration");
const playerTitleBottom = document.querySelector(".bottom-player-title");

// Caricare l'ultima canzone riprodotta dal localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedSong = localStorage.getItem("lastSong");
  if (savedSong) {
    const track = JSON.parse(savedSong);
    aggiornaPlayer(track);
    audioPlayer.pause();
    playPauseBtn.querySelector("i").classList.remove("bi-pause-circle-fill");
    playPauseBtn.querySelector("i").classList.add("bi-play-circle-fill");
  }
});

// FUNZIONE FETCH
async function getArtistData() {
  try {
    const artistId = params.get("id") || "647650"; // Imposta un ID di default se non è fornito

    if (!artistId) {
      throw new Error("Nessun ID artista fornito nella query URL.");
    }

    const response = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`
    );

    if (!response.ok) {
      throw new Error(`Errore: ${response.status}`);
    }

    const artistData = await response.json();
    console.log(artistData);

    // Popola la pagina con i dati
    artistName.textContent = artistData.name;
    ascoltatoriMensili.forEach((element) => {
      element.textContent = `${artistData.nb_fan.toLocaleString()} ascoltatori mensili`;
    });
    artistHero.style.backgroundImage = `url('${artistData.picture_xl}')`;
    artistaImg.style.backgroundImage = `url('${artistData.picture_small}')`;
    artistaImg.alt = artistData.name;
    braniSubtitle.textContent = `Di ${artistData.name}`;

    // Fetch top songs
    const tracksResponse = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`
    );

    if (!tracksResponse.ok) {
      throw new Error(`Errore tracce: ${tracksResponse.status}`);
    }

    const tracksData = await tracksResponse.json();
    const top5Tracks = tracksData.data.slice(0, 5);
    console.log(top5Tracks);

    // Seleziona il contenitore della lista
    const trackList = document.querySelector(".track-list");
    trackList.innerHTML = "";

    // Crea dinamicamente i track-item
    top5Tracks.forEach((track, index) => {
      const trackItem = document.createElement("div");
      trackItem.classList.add("track-item");

      trackItem.innerHTML = `
        <div class="track-number">${index + 1}</div>
        <img src="${track.album.cover_small}" alt="${
        track.title
      }" class="track-image">
        <div class="track-info">
          <div class="track-title">${track.title_short}</div>
        </div>
        <div class="track-plays">${track.rank.toLocaleString()}</div>
        <div class="track-duration">${formatDuration(track.duration)}</div>
      `;

      //  Aggiunge l'evento click per aggiornare il player
      trackItem.addEventListener("click", () => {
        aggiornaPlayer(track);
      });

      trackList.appendChild(trackItem);
    });

    const visualizzaAltro = document.createElement("button");
    visualizzaAltro.textContent = "VISUALIZZA ALTRO";
    visualizzaAltro.className = " btn btn-visualizzaAltro";
    trackList.appendChild(visualizzaAltro);

    return artistData;
  } catch (error) {
    console.error("Errore:", error);
  }
}

getArtistData();

// Funzione per formattare la durata in mm:ss
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/////////////PLAYER BAR////////////////////////////////////////////////////

//////////// FUNZIONE PER AGGIORNARE IL PLAYER
function aggiornaPlayer(track) {
  playerTitle.textContent = track.title_short;
  playerTitleBottom.textContent = track.title;
  playerArtist.textContent = track.artist.name;
  playerCover.src = track.album.cover_small;
  playerCover.className = "album-cover me-3";
  audioPlayer.src = track.preview;
  audioPlayer.play();
  playPauseBtn.querySelector("i").classList.remove("bi-play-circle-fill");
  playPauseBtn.querySelector("i").classList.add("bi-pause-circle-fill");
  trackDuration.textContent = formatDuration(track.duration);

  // Salva in localStorage l'ultima canzone riprodotta
  localStorage.setItem("lastSong", JSON.stringify(track));
}

// Gestisci il click sul pulsante play/pause
playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.querySelector("i").classList.remove("bi-play-circle-fill");
    playPauseBtn.querySelector("i").classList.add("bi-pause-circle-fill");
  } else {
    audioPlayer.pause();
    playPauseBtn.querySelector("i").classList.remove("bi-pause-circle-fill");
    playPauseBtn.querySelector("i").classList.add("bi-play-circle-fill");
  }
});

// Gestisci volume
const volumeControl = document.getElementById("volume-control");
volumeControl.addEventListener("input", () => {
  audioPlayer.volume = volumeControl.value;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Gestisci il click sul pulsante follow
followButton.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.textContent.trim().toUpperCase() === "SEGUI") {
      button.textContent = "Segui già";
      button.classList.add("following");
    } else {
      button.textContent = "SEGUI";
      button.classList.remove("following");
    }
  });
});
