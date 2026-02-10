# MovieSearch | Portfolio Project

Un'applicazione web moderna e performante per la ricerca di film, sviluppata interamente in JavaScript vanilla. Il progetto mette in mostra competenze di manipolazione del DOM, integrazione di API RESTful e design responsive, seguendo un approccio mobile-first.

## Caratteristiche Principali

- **Ricerca Avanzata**: Integrazione con l'API di TheMovieDB (TMDB) con sistema di debouncing per ottimizzare le chiamate di rete.
- **Infinite Scroll**: Caricamento dinamico dei contenuti tramite Intersection Observer API per un'esperienza di navigazione fluida.
- **Filtraggio Dinamico**: Sistema di filtri combinati per genere e ordinamento (popolarità, voto, data di rilascio).
- **Esperienza Utente Ottimizzata**: Skeleton screens durante il caricamento e micro-interazioni fluide per un feedback immediato.
- **Watchlist Persistente**: Gestione dei preferiti tramite LocalStorage per mantenere i dati tra le sessioni.
- **Design Responsive & Dark Mode**: Interfaccia adattiva ottimizzata per ogni dispositivo, con supporto nativo al cambio tema.
- **Deep Linking**: Supporto alla navigazione diretta tramite parametri URL per la condivisione di titoli specifici.

## Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3 (Custom Properties, Flexbox, Grid)
- **Scripting**: JavaScript ES6+ (Async/Await, Fetch API, DOM manipulation)
- **API**: TheMovieDB REST API
- **Tooling**: Font Awesome per l'iconografia, Google Fonts per la tipografia

## Requisiti e Installazione

Per eseguire il progetto in locale:

1. Clonare la repository:
   ```bash
   git clone https://github.com/AntonioBenedettoGit/movie-search-app.git
   ```
2. Aprire il file `index.html` in un browser o utilizzare un server locale (es. Live Server).

## Note Tecniche

Particolare attenzione è stata dedicata a:

- **Performance**: Ottimizzazione del caricamento delle immagini tramite attributi `srcset` e `sizes`.
- **Accessibilità**: Navigazione da tastiera migliorata e gestione del focus all'interno dei componenti modali.
- **Clean Code**: Architettura modulare delle funzioni JavaScript per facilitare la manutenibilità.

## Licenza

Questo progetto è distribuito sotto licenza MIT. Consulta il file `LICENSE` per ulteriori dettagli.
