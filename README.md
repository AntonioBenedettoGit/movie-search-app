# MovieSearch | Portfolio Project

Un'applicazione web moderna e performante per la ricerca di film e serie TV, sviluppata interamente in JavaScript vanilla. Il progetto mette in mostra competenze avanzate di manipolazione del DOM, integrazione di API RESTful e design responsive, seguendo un approccio mobile-first e orientato all'esperienza utente.

## Caratteristiche Principali

- **Ricerca Multi-Contenuto**: Integrazione completa con l'API di TheMovieDB (TMDB) per la ricerca simultanea di Film e Serie TV (Multi-Search).
- **Filtraggio Temporale Rigoroso**: Sistema di controllo che limita la visualizzazione ai titoli rilasciati fino all'anno 2026, escludendo automaticamente le produzioni future non ancora disponibili.
- **Infinite Scroll**: Caricamento dinamico e asincrono dei contenuti tramite Intersection Observer API per una navigazione senza interruzioni.
- **Filtraggio Dinamico e Categorie**: 
    - Navigazione dedicata per Serie TV e Film Popolari.
    - Sistema di filtri combinati per genere e ordinamento (popolarità, voto, data di rilascio).
- **Esperienza Utente (UX)**: 
    - Skeleton screens durante il caricamento per ridurre la percezione dell'attesa.
    - Trailer ufficiali integrati direttamente nei dettagli del titolo.
    - Micro-interazioni fluide e feedback visivi immediati.
- **Watchlist Universale**: Gestione persistente dei preferiti (Film e Serie TV) tramite LocalStorage.
- **Design Responsive & Dark Mode**: Interfaccia adattiva ottimizzata per mobile, tablet e desktop, con supporto nativo al cambio tema (Light/Dark).
- **Deep Linking**: Supporto alla navigazione diretta tramite parametri URL (`id` e `type`) per la condivisione di titoli specifici.

## Tecnologie Utilizzate

- **Frontend**: HTML5 (Semantico), CSS3 (Custom Properties, Flexbox, Grid, Animations)
- **Scripting**: JavaScript ES6+ (Async/Await, Fetch API, Event Delegation, Intersection Observer)
- **API**: TheMovieDB (TMDB) REST API
- **Iconografia**: Font Awesome 6.0

## Requisiti e Installazione

Il progetto è pronto per l'uso e non richiede build tools.

1. **Clonare la repository**:
   ```bash
   git clone https://github.com/AntonioBenedettoGit/movie-search-app.git
   ```
2. **Esecuzione**:
   Aprire `index.html` nel browser o utilizzare un server locale (consigliato: Live Server per VS Code).

## Note Tecniche

- **Performance**: Ottimizzazione del caricamento delle immagini tramite attributi `srcset` e `sizes` per servire risoluzioni adeguate al dispositivo.
- **Accessibilità (A11y)**: Navigazione da tastiera migliorata, attributi ARIA e gestione del focus (focus trap) all'interno dei componenti modali.
- **Sostenibilità**: Nessuna dipendenza esterna o framework pesante, garantendo tempi di caricamento minimi e massima compatibilità.

## Autore

**Antonio Benedetto** - [Profilo GitHub](https://github.com/AntonioBenedettoGit)

---
*Dati forniti da [The Movie Database (TMDB)](https://www.themoviedb.org/).*
