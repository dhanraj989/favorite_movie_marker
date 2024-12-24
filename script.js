const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=3e9a54d1"; // OMDB API Key
const BACKEND_URL = "https://backend-favourite-movies.onrender.com"; // Flask/FastAPI backend URL

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieResults = document.getElementById("movieResults");
const favorites = document.getElementById("favorites");

// Fetch favorites from the backend and display them
async function fetchFavorites() {
  try {
    const response = await fetch(`${BACKEND_URL}/favorites`);
    const data = await response.json();
    favoriteMovies = data;
    displayFavorites();
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

// Add a favorite to the backend
async function addToFavorites(id, title, poster, year) {
  try {
    const newFavorite = { id, title, poster, year };
    await fetch(`${BACKEND_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFavorite),
    });
    fetchFavorites();
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
}

// Remove a favorite from the backend
async function removeFromFavorites(id) {
  try {
    await fetch(`${BACKEND_URL}/favorites/${id}`, {
      method: "DELETE",
    });
    fetchFavorites();
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
}

// Display fetched favorites
function displayFavorites() {
  favorites.innerHTML = "";
  favoriteMovies.forEach((movie) => {
    const favoriteCard = document.createElement("div");
    favoriteCard.classList.add("movie-card");
    if (document.body.classList.contains("dark-mode")) {
      favoriteCard.classList.add("dark-mode");
    }
    favoriteCard.innerHTML = `
      <img src="${movie.poster !== "N/A" ? movie.poster : "placeholder.jpg"}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.year}</p>
      <button onclick="removeFromFavorites('${movie.id}')">Remove</button>
    `;
    favorites.appendChild(favoriteCard);
  });
}

// Fetch movies from the OMDB API
async function fetchMovies(query) {
  try {
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieResults.innerHTML = `<p>No movies found for "${query}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Display fetched movies
function displayMovies(movies) {
  movieResults.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    if (document.body.classList.contains("dark-mode")) {
      movieCard.classList.add("dark-mode");
    }
    movieCard.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addToFavorites('${movie.imdbID}', '${movie.Title.replace("'", "\\" + "'")}', '${movie.Poster}', '${movie.Year}')">Add to Favorites</button>
    `;
    movieResults.appendChild(movieCard);
  });
}

// Set up dark mode toggle
function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", () => {
    // Toggle dark mode on the body
    document.body.classList.toggle("dark-mode");

    // Toggle dark mode for all movie cards
    document.querySelectorAll(".movie-card").forEach((card) => {
      card.classList.toggle("dark-mode");
    });

    // Toggle dark mode for other elements
    document.querySelectorAll(".favorites-section, header, footer, .search-section, h2").forEach((el) => {
      el.classList.toggle("dark-mode");
    });

    // Update the toggle button text
    themeToggle.textContent = document.body.classList.contains("dark-mode")
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";
  });
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  fetchFavorites();
});

// Handle search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});
