const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function showPokemonDetails(pokemon) {
    const modal = document.getElementById('pokemonDetailModal');
    const modalName = document.getElementById('pokemonDetailName');
    const modalImage = document.getElementById('pokemonDetailImage');
    const modalTypes = document.getElementById('pokemonDetailTypes');
    const modalStats = document.getElementById('pokemonDetailStats'); // Novo elemento para stats

    modalName.textContent = pokemon.name;
    modalImage.src = pokemon.photo;
    modalImage.alt = pokemon.name;

    // Tipos do Pokémon
    modalTypes.innerHTML = pokemon.types
        .map((type) => `<li>${type}</li>`)
        .join('');

    // Detalhes extras no modal
    modalStats.innerHTML = `
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p> <!-- Converte de decímetros para metros -->
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p> <!-- Converte de hectogramas para kg -->
        <p><strong>Stats:</strong></p>
        <ul>
            ${pokemon.stats.map(stat => `<li><strong>${stat.name}:</strong> ${stat.value}</li>`).join('')}
        </ul>
    `;

    modal.classList.remove('hidden');
}

// Fechar o modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('pokemonDetailModal').classList.add('hidden');
});


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;


        addPokemonClickEvents(pokemons);
    });
}

function addPokemonClickEvents(pokemons) {
    const pokemonItems = document.querySelectorAll('.pokemon');

    pokemonItems.forEach((pokemonItem) => {
        pokemonItem.addEventListener('click', () => {
            const pokemonId = pokemonItem.getAttribute('data-pokemon-id');
            const selectedPokemon = pokemons.find(pokemon => pokemon.number === parseInt(pokemonId));

            if (selectedPokemon) {
                showPokemonDetails(selectedPokemon); 
            } else {
                console.error('Pokemon não encontrado!');
            }
        });
    });
}

loadPokemonItens(offset, limit);


loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
