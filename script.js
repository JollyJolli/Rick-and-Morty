document.addEventListener("DOMContentLoaded", function () {
    const characterContainer = document.getElementById("characterContainer");
    const searchInput = document.getElementById("searchInput");
    const loader = document.getElementById("loader");
    const favoritesButton = document.getElementById("favoritesButton");

    let isShowingFavorites = false;

    async function getRandomCharacters(count) {
        loader.style.display = "block";

        let randomCharacters = [];
        const totalPages = 42;

        for (let i = 0; i < count; i++) {
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${randomPage}`);
            const data = await response.json();
            const randomCharacterIndex = Math.floor(Math.random() * data.results.length);
            randomCharacters.push(data.results[randomCharacterIndex]);
        }

        loader.style.display = "none";
        return randomCharacters;
    }

    async function getAllCharacters(searchTerm = "") {
        loader.style.display = "block";

        let allCharacters = [];
        const totalPages = 42;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${currentPage}&name=${searchTerm}`);
            const data = await response.json();
            allCharacters = allCharacters.concat(data.results);
        }

        loader.style.display = "none";
        return allCharacters;
    }

    async function getLocationInfo(locationUrl) {
        const response = await fetch(locationUrl);
        const data = await response.json();
        return data;
    }

    function createCharacterCard(character) {
        const card = document.createElement("div");
        card.classList.add("character-card");

        const image = document.createElement("img");
        image.src = character.image;
        card.appendChild(image);

        const title = document.createElement("h2");
        title.innerHTML = `<i class="fas fa-user"></i> ${character.name}`;
        card.appendChild(title);

        const status = document.createElement("p");
        status.innerHTML = `<i class="fas fa-heartbeat"></i> Status: ${character.status}`;
        card.appendChild(status);

        const species = document.createElement("p");
        species.innerHTML = `<i class="fas fa-paw"></i> Species: ${character.species}`;
        card.appendChild(species);

        if (character.type !== "") {
            const type = document.createElement("p");
            type.innerHTML = `<i class="fas fa-info-circle"></i> Type: ${character.type}`;
            card.appendChild(type);
        }

        const gender = document.createElement("p");
        gender.innerHTML = `<i class="fas fa-venus-mars"></i> Gender: ${character.gender}`;
        card.appendChild(gender);

        const origin = document.createElement("p");
        origin.innerHTML = `<i class="fas fa-globe"></i> Origin: ${character.origin.name}`;
        card.appendChild(origin);

        const locationUrl = character.origin.url;
        getLocationInfo(locationUrl)
            .then(locationData => {
                const locationInfo = document.createElement("p");
                locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> Location: ${locationData.type} - ${locationData.dimension}`;
                card.appendChild(locationInfo);
            });

        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("favorite-button");
        favoriteButton.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteButton.addEventListener("click", function () {
            toggleFavorite(character.id);
            favoriteButton.classList.toggle("favorited");
        });
        if (isFavorite(character.id)) {
            favoriteButton.classList.add("favorited");
        }
        card.appendChild(favoriteButton);

        return card;
    }

    async function loadRandomCharacters(count) {
        loader.style.display = "block";
        characterContainer.innerHTML = "";
        try {
            const randomCharacters = await getRandomCharacters(count);
            randomCharacters.forEach(character => {
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al cargar los personajes aleatorios:", error);
        } finally {
            loader.style.display = "none";
        }
    }

    async function loadAllCharacters(searchTerm = "") {
        loader.style.display = "block";
        characterContainer.innerHTML = "";
        try {
            const allCharacters = await getAllCharacters(searchTerm);
            allCharacters.forEach(character => {
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            });

            if (allCharacters.length === 0) {
                showNoResultsMessage();
            }
        } catch (error) {
            console.error("Error al cargar los personajes:", error);
        } finally {
            loader.style.display = "none";
        }
    }

    async function searchCharacters(searchTerm) {
        loader.style.display = "none";
        characterContainer.innerHTML = "";

        try {
            const allCharacters = await getAllCharacters();
            const filteredCharacters = allCharacters.filter(character =>
                character.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredCharacters.length === 0) {
                showNoResultsMessage();
                return;
            }

            filteredCharacters.forEach(character => {
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al buscar los personajes:", error);
        } finally {
            loader.style.display = "none";
        }
    }

    function showNoResultsMessage() {
        const message = document.createElement("p");
        message.textContent = "No se encontraron resultados.";
        characterContainer.appendChild(message);
    }

    function toggleFavorite(characterId) {
        const favorites = getFavorites();
        const index = favorites.indexOf(characterId);

        if (index !== -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(characterId);
        }

        saveFavorites(favorites);
    }

    function isFavorite(characterId) {
        const favorites = getFavorites();
        return favorites.includes(characterId);
    }

    function saveFavorites(favorites) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    function getFavorites() {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        return favorites;
    }

    async function showFavorites() {
        isShowingFavorites = true;
        characterContainer.innerHTML = "";
        const favorites = getFavorites();

        if (favorites.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No tienes personajes favoritos.";
            characterContainer.appendChild(message);
            return;
        }

        for (let i = 0; i < favorites.length; i++) {
            try {
                const response = await fetch(`https://rickandmortyapi.com/api/character/${favorites[i]}`);
                const character = await response.json();
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            } catch (error) {
                console.error(`Error al obtener el personaje favorito ${favorites[i]}:`, error);
            }
        }
    }

    favoritesButton.addEventListener("click", function () {
        if (!isShowingFavorites) {
            showFavorites();
            favoritesButton.textContent = "Mostrar Todos";
        } else {
            characterContainer.innerHTML = "";
            loadRandomCharacters(23);
            favoritesButton.textContent = "Mostrar Favoritos";
        }
        isShowingFavorites = !isShowingFavorites;
    });

    loadRandomCharacters(23);

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchCharacters(searchTerm);
        } else {
            if (isShowingFavorites) {
                characterContainer.innerHTML = "";
                showFavorites();
            } else {
                loadRandomCharacters(20);
            }
        }
    });
});
