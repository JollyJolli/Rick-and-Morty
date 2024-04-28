document.addEventListener("DOMContentLoaded", function () {
    const characterContainer = document.getElementById("characterContainer");
    const searchInput = document.getElementById("searchInput");
    const themeButton = document.getElementById("themeButton");
    const themeStylesheet = document.getElementById("themeStylesheet");
    const loader = document.getElementById("loader"); // Obtener el elemento del loader

    async function getRandomCharacters(count) {
        loader.style.display = "block"; // Mostrar el loader al iniciar la carga

        let randomCharacters = [];
        const totalPages = 42;

        for (let i = 0; i < count; i++) {
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${randomPage}`);
            const data = await response.json();
            const randomCharacterIndex = Math.floor(Math.random() * data.results.length);
            randomCharacters.push(data.results[randomCharacterIndex]);
        }

        loader.style.display = "none"; // Apagar el loader cuando se han mostrado todos los personajes
        return randomCharacters;
    }

    async function getAllCharacters(searchTerm = "") {
        loader.style.display = "block"; // Mostrar el loader al iniciar la carga

        let allCharacters = [];
        const totalPages = 42;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${currentPage}&name=${searchTerm}`);
            const data = await response.json();
            allCharacters = allCharacters.concat(data.results);
        }

        loader.style.display = "none"; // Apagar el loader cuando se han mostrado todos los personajes
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

        return card;
    }

    async function loadRandomCharacters(count) {
        loader.style.display = "block"; // Mostrar el loader al iniciar la carga
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
            loader.style.display = "none"; // Apagar el loader cuando se han mostrado todos los personajes
        }
    }

    async function loadAllCharacters(searchTerm = "") {
        loader.style.display = "block"; // Mostrar el loader al iniciar la carga
        characterContainer.innerHTML = "";
        try {
            const allCharacters = await getAllCharacters(searchTerm);
            allCharacters.forEach(character => {
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al cargar los personajes:", error);
        } finally {
            loader.style.display = "none"; // Apagar el loader cuando se han mostrado todos los personajes
        }
    }

    async function searchCharacters(searchTerm) {
        loader.style.display = "none"; // Mostrar el loader al iniciar la búsqueda
        characterContainer.innerHTML = ""; // Limpiar la lista de personajes actuales

        try {
            const allCharacters = await getAllCharacters(); // Obtener todos los personajes
            const filteredCharacters = allCharacters.filter(character =>
                character.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            filteredCharacters.forEach(character => {
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al buscar los personajes:", error);
        } finally {
            loader.style.display = "none"; // Apagar el loader cuando se han mostrado todos los personajes
        }
    }

    loadRandomCharacters(15);

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchCharacters(searchTerm);
        } else {
            loadRandomCharacters(15);
        }
    });

    themeButton.addEventListener("click", function () {
        if (themeStylesheet.getAttribute("href") === "styles.css") {
            themeStylesheet.href = "light-theme.css";
            themeButton.innerHTML = '<i class="fas fa-moon"></i> Cambiar a Modo Oscuro';
        } else {
            themeStylesheet.href = "styles.css";
            themeButton.innerHTML = '<i class="fas fa-adjust"></i> Cambiar a Modo Claro';
        }
    });
});
