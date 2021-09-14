const BASE_URL = "http://localhost:3000/pokemons";
const pokeContainer = document.getElementById("poke-container");
const pokeForm = document.getElementById("poke-form");

function renderPokemon(pokemon) {
  // console.log(pokemon)
  const pokeCard = document.createElement("div");
  pokeCard.id = `poke-${pokemon.id}`;
  pokeCard.className = "poke-card";

  const pokeImg = document.createElement("img");
  pokeImg.src = pokemon.img;
  pokeImg.alt = `${pokemon.name} image`;

  const pokeName = document.createElement("h3");
  pokeName.textContent = pokemon.name;

  const pokeLikes = document.createElement("h3");
  pokeLikes.textContent = "Likes: ";

  const likesNum = document.createElement("h5");
  likesNum.className = "like-num";
  likesNum.textContent = pokemon.likes;

  const likeBttn = document.createElement("button");
  likeBttn.className = "like-bttn";
  likeBttn.textContent = "♥";
  likeBttn.addEventListener("click", () => increaseLikes(pokemon, likesNum));

  const deleteBttn = document.createElement("button");
  deleteBttn.className = "delete-bttn";
  deleteBttn.textContent = "Delete";
  deleteBttn.addEventListener("click", () => deletePoke(pokemon, pokeCard));

  pokeCard.append(pokeImg, pokeName, pokeLikes, likesNum, likeBttn, deleteBttn);
  pokeContainer.appendChild(pokeCard);
}

function createPokemon(event) {
  event.preventDefault();
  const name = document.querySelector("#name-input").value;
  const img = event.target.querySelector("#img-input").value;

  const pokemon = {
    name: name,
    img: img,
    likes: 0,
  };

  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pokemon),
  };

  renderPokemon(pokemon);

  // pessimistic rendering
  // fetch(BASE_URL, configObj)
  //   .then(function (resp) {
  //     return resp.json();
  //   })
  //   .then(function (pokemon) {
  //     renderPokemon(pokemon);
  //   });

  // optimistic rendering
  fetch(BASE_URL, configObj);

  pokeForm.reset();
}

// add another layer that persists those updates
function increaseLikes(pokemon, likesNum) {
  // console.log(pokemon)
  ++pokemon.likes;
  likesNum.textContent = pokemon.likes;

  // console.log(pokemon.likes)
  // create an endpoint that includes the id
  // console.log(`${BASE_URL}/${pokemon.id}`)

  // optimistically rendering
  fetch(`${BASE_URL}/${pokemon.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: pokemon.likes }), // pass in the properties that are being updated
  });

  // pessimistic rendering
  // fetch(`${BASE_URL}/${pokemon.id}`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ likes: pokemon.likes }) // pass in the properties that are being updated
  // })
  // .then(resp => resp.json())
  // .then(pokemon => likesNum.textContent = pokemon.likes)
}

function deletePoke(pokemon, card) {
  // optimistic
  card.remove();
  fetch(`${BASE_URL}/${pokemon.id}`, {
    method: "DELETE",
  });

  // pessimistic
  // fetch(`${BASE_URL}/${pokemon.id}`, {
  //   method: 'DELETE'
  // })
  // .then(resp => resp.json())
  // .then(data => card.remove())
}

function getPokemons() {
  fetch(BASE_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (pokemonsArray) {
      pokemonsArray.forEach(function (pokemon) {
        renderPokemon(pokemon);
      });
    });
}

function submitFunction(e) {
  e.preventDefault();
}

function init() {
  getPokemons();
  pokeForm.addEventListener("submit", createPokemon);
  // const commentForm = document.querySelector("#comment-form");
  // commentForm.addEventListener("submit", submitFunction);
}

init();
