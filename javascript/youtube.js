/* =========================
   CONFIGURAÇÃO ÚNICA
========================= */

const PLAYLIST_ID = "PLs7JrXsSeGNde8Il4UO0qk08hbIB9DH7M";

/* =========================
   ELEMENTOS
========================= */

const player = document.getElementById("cultoPlayer");
const btnPlaylist = document.getElementById("btnPlaylist");

/* =========================
   FUNÇÕES
========================= */

// Último culto (primeiro da playlist)
function carregarUltimoCulto() {
  player.src = `https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&rel=0`;
}

// Abrir playlist completa
function abrirPlaylist() {
  player.src = `https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&rel=0`;
}

/* =========================
   INIT
========================= */

carregarUltimoCulto();
btnPlaylist.addEventListener("click", abrirPlaylist);


/* =========================
   FIM DO ARQUIVO
========================= */
