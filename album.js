const indirizzo = window.location.search;
const searchIndirizzo = new URLSearchParams(indirizzo);
const albumId = searchIndirizzo.get(`id`);
const coverContainer = document.querySelector("#copertina-album");
const braniContainer = document.querySelector("#titoli-album");

/////ID di test locale///////
if (!albumId) {
  albumId = 7714218;
  console.warn("Nessun ID trovato nell'URL. Uso di ID di test", albumId);
} //console.warn viene usato per visualizzare un messaggio di avviso in console

//crea la chiamata per la risorsa specifica
async function getAlbumId() {
  try {
    const result = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    );
    const identification = await result.json();
    console.log(identification);

    coverContainer.innerHTML = `
    <img id="album-cover" src="${identification.cover_big}" alt="" crossorigin="anonymous" />
            <div>
              <p class="text-white">ALBUM</p>
              <h1 class="text-white">${identification.title}</h1>
              <h6 class="text-white">${identification.artist.name}</h6>
            </div>`;

    ////////////////PRENDI IL COLORE DELL'ALBUM E RENDILO SFUMATO COME SFONDO////////////////

    const img = document.getElementById("album-cover");
    const albumArea = document.getElementById("album-area");
    const colorThief = new ColorThief();
    //  colorThief.getColor(document.getElementById("album-cover"));

    //IndexSizeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source width is 0.
    // at n.getImageData (color-thief.umd.js:1:4958)
    //at o.getPalette (color-thief.umd.js:1:5731)
    //at o.getColor (color-thief.umd.js:1:5092)
    //at getAlbumId (album.js:35:16)

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
    </div>`;
    });

    // if (!albumId) {
    // alert("Nessun album selezionato! Ritorna alla homepage.");
    // window.location.href = "index.html"; //qui va inserito il file della homepage
    // return;
    // }
    console.log("Indirizzo completo:", window.location.href);
    console.log("albumId:", albumId);
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
