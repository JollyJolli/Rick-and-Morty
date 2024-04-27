document.addEventListener("DOMContentLoaded", function () {
    const characterContainer = document.getElementById("characterContainer");
    const searchInput = document.getElementById("searchInput");
    const themeButton = document.getElementById("themeButton");
    const themeStylesheet = document.getElementById("themeStylesheet");

    async function getAllCharacters() {
        let allCharacters = [];
        let currentPage = 1;
        let totalPages = 42;

        while (currentPage <= totalPages) {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${currentPage}`);
            const data = await response.json();
            allCharacters = allCharacters.concat(data.results);
            currentPage++;
        }

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

    async function loadAllCharacters() {
        characterContainer.innerHTML = "";
        try {
            const allCharacters = await getAllCharacters();
            allCharacters.forEach(character => {
                const card = createCharacterCard(character);
                characterContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al cargar los personajes:", error);
        }
    }

    function searchCharacters(searchTerm) {
        characterContainer.innerHTML = "";
        fetch(`https://rickandmortyapi.com/api/character/?name=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(character => {
                    const card = createCharacterCard(character);
                    characterContainer.appendChild(card);
                });
            });
    }

    loadAllCharacters();

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchCharacters(searchTerm);
        } else {
            loadAllCharacters();
        }
    });

    themeButton.addEventListener("click", function () {
        if (themeStylesheet.getAttribute("href") === "styles.css") {
            themeStylesheet.href = "light-theme.css";
            themeButton.innerHTML = '<i class="fas fa-moon"></i> Cambiar a Modo Oscuro';
        } else {
            themeStylesheet.href = "styles.css";
            themeButton.innerHTML = '<i class="fas fa-adjust"></i> Cambiar Tema';
        }
    });
});
