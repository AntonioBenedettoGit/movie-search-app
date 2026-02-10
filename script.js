const API_KEY = '674505286e9aebf5ddf68cc587523283';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/'; // Rimosso w500 per gestire dimensioni dinamiche
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// DOM Elements
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search-input');
const sectionTitle = document.getElementById('section-title');
const movieModal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebar = document.getElementById('close-sidebar');
const showHome = document.getElementById('show-home');
const showWatchlist = document.getElementById('show-watchlist');
const showHomeMobile = document.getElementById('show-home-mobile');
const showWatchlistMobile = document.getElementById('show-watchlist-mobile');
const showPopular = document.getElementById('show-popular');
const showTopRated = document.getElementById('show-top-rated');
const showUpcoming = document.getElementById('show-upcoming');
const genreContainer = document.getElementById('genre-container');
const sortBySelect = document.getElementById('sort-by');
const scrollSentinel = document.getElementById('scroll-sentinel');

// State
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let currentView = 'home'; 
let searchTimer;
let currentPage = 1;
let currentUrl = '';
let isLoading = false;
let selectedGenres = [];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    currentUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=it-IT`;
    fetchMovies(currentUrl);
    fetchGenres();
    initTheme();
    initSidebar();
    initInfiniteScroll();
    checkDeepLinking();
});

function initInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && currentView === 'home') {
            loadNextPage();
        }
    }, { threshold: 1.0 });

    observer.observe(scrollSentinel);
}

function checkDeepLinking() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (movieId) {
        fetchMovieDetails(movieId);
    }
}

function updateUrlParams(movieId) {
    const newUrl = movieId ? `?id=${movieId}` : window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

async function loadNextPage() {
    currentPage++;
    isLoading = true;
    
    // Aggiungi o aggiorna il parametro page nell'URL
    const urlWithPage = new URL(currentUrl);
    urlWithPage.searchParams.set('page', currentPage);
    
    try {
        const res = await fetch(urlWithPage.toString());
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            displayMovies(data.results, true); // true = append
        }
    } catch (error) {
        console.error('Errore caricamento pagina successiva:', error);
    } finally {
        isLoading = false;
    }
}

function initSidebar() {
    const closeMenu = () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });

    closeSidebar.addEventListener('click', closeMenu);
    sidebarOverlay.addEventListener('click', closeMenu);

    showHomeMobile.addEventListener('click', () => {
        showHome.click();
        closeMenu();
    });

    showWatchlistMobile.addEventListener('click', () => {
        showWatchlist.click();
        closeMenu();
    });

    const updateActiveShortcut = (btn) => {
        [showPopular, showTopRated, showUpcoming].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };

    showPopular.addEventListener('click', () => {
        currentUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=it-IT`;
        sectionTitle.innerText = 'Film Popolari';
        fetchMovies(currentUrl);
        updateActiveShortcut(showPopular);
        closeMenu();
    });

    showTopRated.addEventListener('click', () => {
        currentUrl = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=it-IT`;
        sectionTitle.innerText = 'I Più Votati';
        fetchMovies(currentUrl);
        updateActiveShortcut(showTopRated);
        closeMenu();
    });

    showUpcoming.addEventListener('click', () => {
        currentUrl = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=it-IT`;
        sectionTitle.innerText = 'Prossimamente al Cinema';
        fetchMovies(currentUrl);
        updateActiveShortcut(showUpcoming);
        closeMenu();
    });

    sortBySelect.addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
    });
}

function applyFilters() {
    const sort = sortBySelect.value;
    const genres = selectedGenres.join(',');
    
    currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=it-IT&sort_by=${sort}&with_genres=${genres}`;
    sectionTitle.innerText = selectedGenres.length > 0 ? 'Risultati filtrati' : 'Film Popolari';
    fetchMovies(currentUrl);
}

// --- API FETCHING ---

async function fetchGenres() {
    try {
        const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=it-IT`);
        const data = await res.json();
        displayGenres(data.genres);
    } catch (error) {
        console.error('Errore fetch generi:', error);
    }
}

function displayGenres(genres) {
    genreContainer.innerHTML = '';
    genres.forEach(genre => {
        const tag = document.createElement('span');
        tag.classList.add('genre-tag');
        tag.innerText = genre.name;
        tag.dataset.id = genre.id;
        
        tag.addEventListener('click', () => {
            if (tag.classList.contains('active')) {
                tag.classList.remove('active');
                selectedGenres = selectedGenres.filter(id => id !== genre.id);
            } else {
                tag.classList.add('active');
                selectedGenres.push(genre.id);
            }
            
            currentPage = 1;
            applyFilters();
        });
        genreContainer.appendChild(tag);
    });
}

async function fetchMovies(url, append = false) {
    if (!append) {
        showSkeletons();
        currentPage = 1;
    }
    
    try {
        const res = await fetch(url);
        
        if (res.status === 401) {
            movieGrid.innerHTML = `
                <div class="error-msg">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ffc107; margin-bottom: 20px;"></i>
                    <p><strong>Errore 401: API Key non valida.</strong></p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Assicurati che la chiave API in <code>script.js</code> sia corretta.</p>
                </div>
            `;
            return;
        }

        const data = await res.json();
        if (data.results && data.results.length > 0) {
            displayMovies(data.results, append);
        } else if (!append) {
            movieGrid.innerHTML = '<p class="error-msg">Nessun film trovato.</p>';
        }
    } catch (error) {
        console.error('Errore nel fetch dei film:', error);
        if (!append) movieGrid.innerHTML = '<p class="error-msg">Errore di connessione.</p>';
    }
}

function showSkeletons() {
    movieGrid.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const skeleton = document.createElement('div');
        skeleton.classList.add('skeleton-card');
        movieGrid.appendChild(skeleton);
    }
}

async function fetchMovieDetails(id) {
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=it-IT&append_to_response=credits,videos`);
        const data = await res.json();
        showModal(data);
        updateUrlParams(id);
    } catch (error) {
        console.error('Errore nel fetch dei dettagli:', error);
    }
}

// --- DISPLAY LOGIC ---

function displayMovies(movies, append = false) {
    if (!append) movieGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const { id, title, poster_path, vote_average, release_date } = movie;
        const year = release_date ? release_date.split('-')[0] : 'N/A';
        
        // Immagini Responsive: w342 per mobile, w500 per desktop
        const posterBase = IMG_URL;
        const poster = poster_path 
            ? `${posterBase}w500${poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Poster';

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');
        movieEl.setAttribute('tabindex', '0'); // Accessibilità: navigabile da tastiera
        movieEl.innerHTML = `
            <div class="movie-poster-container">
                <img src="${poster}" 
                     srcset="${poster_path ? `${posterBase}w342${poster_path} 342w, ${posterBase}w500${poster_path} 500w` : ''}"
                     sizes="(max-width: 600px) 342px, 500px"
                     alt="${title}" 
                     class="movie-poster"
                     loading="lazy">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <div class="movie-meta">
                    <span class="year">${year}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${vote_average.toFixed(1)}</span>
                </div>
            </div>
        `;
        
        const openDetails = () => fetchMovieDetails(id);
        movieEl.addEventListener('click', openDetails);
        movieEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') openDetails(); });
        
        movieGrid.appendChild(movieEl);
    });
}

function showModal(movie) {
    const { id, title, overview, release_date, vote_average, runtime, genres, poster_path, backdrop_path, credits, videos } = movie;
    
    const year = release_date ? release_date.split('-')[0] : 'N/A';
    const poster = poster_path ? `${IMG_URL}w500${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
    const backdrop = backdrop_path ? BACKDROP_URL + backdrop_path : '';
    const genresList = genres.map(g => g.name).join(', ');
    const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    
    const isInWatchlist = watchlist.some(m => m.id === id);

    modalBody.innerHTML = `
        <div class="modal-header">
            ${backdrop ? `<img src="${backdrop}" alt="${title}" class="backdrop-img">` : ''}
        </div>
        <div class="modal-details">
            <img src="${poster}" alt="${title}" class="modal-poster">
            <div class="modal-info">
                <h2 class="modal-title">${title}</h2>
                <div class="modal-stats">
                    <span><i class="far fa-calendar"></i> ${year}</span>
                    <span><i class="far fa-clock"></i> ${runtime} min</span>
                    <span class="rating"><i class="fas fa-star"></i> ${vote_average.toFixed(1)}</span>
                </div>
                <p class="modal-genres"><strong>Generi:</strong> ${genresList}</p>
                <div class="modal-overview">
                    <h3>Trama</h3>
                    <p>${overview || 'Trama non disponibile.'}</p>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary ${isInWatchlist ? 'in-watchlist' : ''}" id="watchlist-toggle-btn" aria-label="${isInWatchlist ? 'Rimuovi dalla watchlist' : 'Aggiungi alla watchlist'}">
                        <i class="fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}"></i> 
                        <span>${isInWatchlist ? 'In Watchlist' : 'Aggiungi alla Watchlist'}</span>
                    </button>
                </div>

                ${trailer ? `
                    <div class="modal-trailer">
                        <h3>Trailer Ufficiale</h3>
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen title="Trailer di ${title}"></iframe>
                        </div>
                    </div>
                ` : ''}

                <div class="modal-cast">
                    <h3>Cast Principale</h3>
                    <div class="cast-list">
                        ${credits.cast.slice(0, 5).map(person => `
                            <div class="cast-item">
                                <img src="${person.profile_path ? IMG_URL + 'w185' + person.profile_path : 'https://via.placeholder.com/100x100?text=N/A'}" alt="${person.name}" class="cast-img">
                                <p class="cast-name">${person.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    window.fetchMovieDetails = fetchMovieDetails;

    movieModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Focus trap per accessibilità
    const closeBtn = movieModal.querySelector('.close-modal');
    closeBtn.focus();

    document.getElementById('watchlist-toggle-btn').onclick = function() {
        toggleWatchlist(movie);
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        if (this.classList.contains('in-watchlist')) {
            this.classList.remove('in-watchlist');
            icon.className = 'fas fa-plus';
            text.innerText = 'Aggiungi alla Watchlist';
        } else {
            this.classList.add('in-watchlist');
            icon.className = 'fas fa-check';
            text.innerText = 'In Watchlist';
        }
        
        if (currentView === 'watchlist') displayWatchlist();
    };
}

// --- WATCHLIST LOGIC ---

function toggleWatchlist(movie) {
    const index = watchlist.findIndex(m => m.id === movie.id);
    if (index > -1) {
        watchlist.splice(index, 1);
    } else {
        watchlist.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date
        });
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function displayWatchlist() {
    currentView = 'watchlist';
    sectionTitle.innerText = 'La Mia Watchlist';
    
    showWatchlist.classList.add('active');
    showHome.classList.remove('active');
    showWatchlistMobile.classList.add('active');
    showHomeMobile.classList.remove('active');
    
    if (watchlist.length > 0) {
        displayMovies(watchlist);
    } else {
        movieGrid.innerHTML = '<p class="error-msg">La tua watchlist è vuota. Aggiungi dei film!</p>';
    }
}

// --- EVENTS ---

searchInput.oninput = (e) => {
    clearTimeout(searchTimer);
    const query = e.target.value;
    
    if (query.length > 2) {
        searchTimer = setTimeout(() => {
            currentView = 'home';
            sectionTitle.innerText = `Risultati per: "${query}"`;
            
            showWatchlist.classList.remove('active');
            showHome.classList.add('active');
            showWatchlistMobile.classList.remove('active');
            showHomeMobile.classList.add('active');
            
            currentUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=it-IT`;
            fetchMovies(currentUrl);
        }, 500); 
    } else if (query.length === 0) {
        showHome.click();
    }
};

showHome.onclick = () => {
    currentView = 'home';
    sectionTitle.innerText = 'Film Popolari';
    
    showHome.classList.add('active');
    showWatchlist.classList.remove('active');
    showHomeMobile.classList.add('active');
    showWatchlistMobile.classList.remove('active');
    
    currentUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=it-IT`;
    fetchMovies(currentUrl);
};

showWatchlist.onclick = displayWatchlist;

closeModal.onclick = () => {
    movieModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    updateUrlParams(null); // Rimuovi ID dall'URL
};

window.onclick = (e) => {
    if (e.target === movieModal) closeModal.onclick();
};

// --- THEME LOGIC ---

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

themeToggle.onclick = () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    }
};
