const searchInput = document.getElementById("search-bar");
const nav = document.querySelector(".nav-wrapper");
let resultsContainer = document.getElementById("list-results");
let detailsContainer = document.querySelector(".detail");
const details = document.querySelector(".details");
let movesContainer = document.querySelector(".moves");
const main = document.querySelector("main");
const searchBtn = document.querySelector(".search");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let lastPageBtn = document.querySelector(".end");
let lastPage = 0;
let firstPageBtn = document.querySelector(".start");
let limitInput = document.getElementById("limit-input");
let limitInputBtn = document.getElementById("input-limit-btn");
let pageSelect = document.getElementById("page-select");
let pageSelectOptions = [];
let selectedPage = 1;

let pokeApi = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10";
let apiObj = { prev: null, next: pokeApi };
let pageDisplay = document.querySelector(".page-display");
let totalPages = 0;
let currentPage = 1;
let limit = 10;
let offset = 0;
let count = 0;
let firstPageOffset = 0;

searchInput.addEventListener("input", startSearch);
searchBtn.addEventListener("click", buttonSearch);
limitInputBtn.addEventListener("click", inputLimitSearch);

next.addEventListener("click", nextPage);
lastPageBtn.addEventListener("click", goToLastPage);
firstPageBtn.addEventListener("click", goToFirstPage);
prev.addEventListener("click", prevPage);

// displayPages();

function inputLimitSearch() {
    val = getLimitVal();

    limit = +val;

    let text = getVal();

    const xhr = new XMLHttpRequest();

    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon?limit=${val}`, true);

    xhr.onload = function () {
        if (this.status === 200) {
            obj = JSON.parse(this.responseText);

            pokeApi = obj.next;

            let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

            let pokemons = obj.results.filter((pokemon) => {
                if (pokemon.name.includes(text)) {
                    return true;
                } else {
                    return false;
                }
            });
            for (pokemon of pokemons) {
                res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
            }
            resultsContainer.innerHTML = res;
            setListeners(pokemons);
        } else {
            console.log("Nessun file trovato");
        }
    };

    xhr.send();

    // displayPages();

    offset = 0;

    currentPage = 1;

    checkBtnsDisabled(obj);

    displaySelectOptions();

    main.classList.remove("d-none");
}

pageSelect.addEventListener("change", goToPageSelect);

displaySelectOptions();

function goToPageSelect() {
    selectedPage = pageSelect.value / limit + 1;
    let _offset = pageSelect.value;
    currentPage = selectedPage;

    // offset += limit * totalPages - limit;
    let text = getVal();

    const xhr = new XMLHttpRequest();

    if (text.length >= 3 || text.length == 0) {
        xhr.open(
            "GET",
            `https://pokeapi.co/api/v2/pokemon?offset=${_offset}&limit=${limit}`,
            true
        );

        xhr.onload = function () {
            if (this.status === 200) {
                obj = JSON.parse(this.responseText);

                pokeApi = obj.next;

                let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

                let pokemons = obj.results.filter((pokemon) => {
                    if (pokemon.name.includes(text)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                for (pokemon of pokemons) {
                    res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
                }
                resultsContainer.innerHTML = res;
                setListeners(pokemons);
            } else {
                console.log("Nessun file trovato");
            }
        };

        xhr.send();

        checkBtnsDisabled(obj);
        setPagination(limit);
        displayPages();

        main.classList.remove("d-none");
    }
}

// function setPagination() {
//     limit = getLimitVal();

//     totalPages = Math.trunc(obj.count / limit + 1);

//     if (totalPages % limit === 0) {
//         totalPages = Math.trunc(obj.count / limit);
//     } else {
//         totalPages = Math.trunc(obj.count / limit + 1);
//     }

//     pokeApi = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

//     lastPage = totalPages;

//     return totalPages, lastPage;
// }

// function startSearch() {
//     let text = getVal();

//     const xhr = new XMLHttpRequest();

//     if (text.length >= 3 || text.length == 0) {
//         xhr.open(
//             "GET",
//             "https://pokeapi.co/api/v2/pokemon?limit=100000000000",
//             true
//         );

//         xhr.onload = function () {
//             if (this.status === 200) {
//                 obj = JSON.parse(this.responseText);

//                 pokeApi = obj.next;

//                 let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
//                            <hr>
//                 `;

//                 let pokemons = obj.results.filter((pokemon) => {
//                     if (pokemon.name.includes(text)) {
//                         return true;
//                     } else {
//                         return false;
//                     }
//                 });
//                 for (pokemon of pokemons) {
//                     res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
//                 }
//                 resultsContainer.innerHTML = res;
//                 setListeners(pokemons);
//             } else {
//                 console.log("Nessun file trovato");
//             }
//         };

//         xhr.send();

//         main.classList.remove("d-none");
//     }
// }

function displaySelectOptions() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
        true
    );

    xhr.onload = function () {
        if (this.status === 200) {
            obj = JSON.parse(this.responseText);

            // let totalPages = Math.trunc(obj.count / 10 + 1);
            // console.log(totalPages);

            setPagination(limit);

            displayPages();

            pageSelect.innerHTML = "";
            pageSelectOptions = [];

            for (i = 0; i < totalPages; i++) {
                // pageSelect.innerHTML += `
                // <option value="page-${i + 1}">Pag ${i + 1}</option>
                // `;

                pageSelectOptions.push(i + 1);
            }

            let _offset = 0;
            pageSelectOptions.forEach((e) => {
                _offset = limit * e - limit;

                pageSelect.innerHTML += `
        <option value="${_offset}">Pag ${e}</option>
        `;
            });
        } else {
            console.log("Nessun file trovato");
        }
    };

    xhr.send();
}

function displayPages() {
    setPagination(limit);

    pageDisplay.innerHTML = `Pagina ${currentPage} di ${totalPages}`;

    return;

    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=100000000000`,
        true
    );

    xhr.onload = function () {
        if (this.status === 200) {
            obj = JSON.parse(this.responseText);

            // let totalPages = Math.trunc(obj.count / 10 + 1);
            // console.log(totalPages);

            setPagination(limit);

            pageDisplay.innerHTML = `Pagina ${currentPage} di ${totalPages}`;
        } else {
            console.log("Nessun file trovato");
        }
    };

    xhr.send();
}

function setPagination(limit) {
    limit = getLimitVal();

    totalPages = Math.trunc(obj.count / limit + 1);
    lastPage = totalPages - 1;

    if (totalPages % limit === 0) {
        totalPages = Math.trunc(obj.count / limit);
        lastPage = totalPages - 1;
    } else {
        totalPages = Math.trunc(obj.count / limit + 1);
        lastPage = totalPages;
    }

    pokeApi = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${limit}`;

    return totalPages, lastPage;
}

function startSearch() {
    let text = getVal();

    const xhr = new XMLHttpRequest();

    if (text.length >= 3) {
        xhr.open(
            "GET",
            "https://pokeapi.co/api/v2/pokemon?limit=100000000000",
            true
        );

        xhr.onload = function () {
            if (this.status === 200) {
                obj = JSON.parse(this.responseText);

                pokeApi = obj.next;

                let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

                let pokemons = obj.results.filter((pokemon) => {
                    if (pokemon.name.includes(text)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                for (pokemon of pokemons) {
                    res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
                }
                resultsContainer.innerHTML = res;
                setListeners(pokemons);
            } else {
                console.log("Nessun file trovato");
            }
        };

        xhr.send();

        main.classList.remove("d-none");

        nav.classList.add("d-none");
        resultsContainer.classList.add("h-640");
    } else if (text.length == 0) {
        xhr.open(
            "GET",
            "https://pokeapi.co/api/v2/pokemon?limit=100000000000",
            true
        );

        xhr.onload = function () {
            if (this.status === 200) {
                obj = JSON.parse(this.responseText);

                pokeApi = obj.next;

                let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

                let pokemons = obj.results.filter((pokemon) => {
                    if (pokemon.name.includes(text)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                for (pokemon of pokemons) {
                    res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
                }
                resultsContainer.innerHTML = res;
                setListeners(pokemons);
            } else {
                console.log("Nessun file trovato");
            }
        };

        xhr.send();

        main.classList.remove("d-none");

        nav.classList.remove("d-none");

        // resultsContainer.classList.remove("h-640");

    }
}

function showDetail(url) {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onload = function () {
        if (this.status === 200) {
            obj = JSON.parse(this.responseText);

            // showEvolution(obj.id);

            /**
             * <div class="pb-2 text-capitalize"><strong>Tipo:</strong> ${obj.types[0].type.name}/${obj.types[1].type.name}</div>
             * 
             * <div class="pb-2 text-capitalize"><strong>Tipo:</strong> ${obj.types[0].length > 0 ? `${obj.types[0].type.name}/${obj.types[1].type.name}` : `${obj.types[0].type.name}`}</div>
                            <div class="pb-2 text-capitalize"><strong>Specie:</strong> ${obj.species.name}</div>
             */

            detailsContainer.innerHTML = `
                        <div class="d-flex flex-column align-items-center">
                            <h3 class="pb-2 text-capitalize">${obj.name}</h3>
                            <div class="sprite-container pb-3">
                                <img class="sprite" src="${obj.sprites.front_default}" alt="${obj.name}">
                            </div>
                        </div>
                        <hr>
                        <div>
                            <h4 class="py-2 text-center">Informazioni aggiuntive</h4>
                            <hr>
                            <div class="pb-2 text-capitalize"><span class="badge rounded-pill bg-light text-dark"><strong>ID Pokémon:</strong></span> ${obj.id}</div>
                            <div class="pb-2"><span class="badge rounded-pill bg-light text-dark"><strong>Altezza:</strong></span> ${obj.height}</div>
                            <div class="pb-2"><span class="badge rounded-pill bg-light text-dark"><strong>Peso:</strong></span> ${obj.weight}</div>
                        </div>
            `;

            let types = [];

            obj.types.forEach((type) => {
                types.push(type.type.name);
            });

            detailsContainer.innerHTML += `
                <div class="types pb-3 text-capitalize">
                    <span class="badge rounded-pill bg-light text-dark">
                        <strong>
                            Tipo:
                        </strong>
                    </span>
                    ${types}
                </div>
            `;

            if (!obj.moves.length == 0) {
                let moves = [];
                obj.moves.forEach((el) => {
                    moves.push(el.move.name);
                });

                detailsContainer.innerHTML += `
                <div class="moves-wrapper p-2">
                    <div class="mb-3 badge rounded-pill bg-primary">
                        <strong>
                            Elenco mosse:
                        </strong>
                    </div>
                    <ol class="moves mb-2 text-capitalize overflow-auto">

                    </ol>
                </div>
                `;

                moves.forEach((move) => {
                    document.querySelector(".moves").innerHTML += `
                    <li class="pb-2">${move}</li>
                `;
                });
            } else {
                detailsContainer.innerHTML += `
                <div class="moves-wrapper p-2">
                    <div class="mb-3 badge rounded-pill bg-primary">
                        <strong>
                            Elenco mosse:
                        </strong>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <div class="mb-3 text-center">
                            <strong>
                                Nessuna mossa trovata
                            </strong>
                        </div>
                    </div>
                </div>
                `;
            }
        } else {
            console.log("Nessun file trovato");
        }
    };

    xhr.send();

    displaySelectOptions();

    setPagination(limit);

    details.classList.remove("d-none");
}

// function showTypes(url) {
//     const xhr = new XMLHttpRequest();

//     xhr.open("GET", url, true);

//     xhr.onload = function () {
//         if (this.status === 200) {
//             obj = JSON.parse(this.responseText);

//             let types = [];

//             obj.types.forEach((type) => {
//                 types.push(type.type.name);
//             });

//             detailsContainer.innerHTML += `
//                 <div class="types pb-2 text-capitalize">
//                     <strong>
//                         Tipo:
//                     </strong>
//                     ${types}
//                 </div>
//             `;
//         } else {
//             console.log("Nessun file trovato");
//         }
//     };

//     xhr.send();
// }

// function showMoves(url) {
//     const xhr = new XMLHttpRequest();

//     xhr.open("GET", url, true);

//     xhr.onload = function () {
//         if (this.status === 200) {
//             obj = JSON.parse(this.responseText);

//             let moves = [];

//             obj.moves.forEach((el) => {
//                 moves.push(el.move.name);
//             });

//             detailsContainer.innerHTML += `
//                 <div class="moves mb-2 ellipsis text-capitalize">
//                     <strong>
//                         Elenco mosse:
//                     </strong>
//                     <div>${moves}</div>
//                 </div>
//             `;
//         } else {
//             console.log("Nessun file trovato");
//         }
//     };

//     xhr.send();
// }

// function showEvolution(pokeid) {
//     const xhr = new XMLHttpRequest();

//     xhr.open(
//         "GET",
//         `https://pokeapi.co/api/v2/evolution-chain/${pokeid}/`,
//         true
//     );

//     xhr.onload = function () {
//         if (this.status === 200) {
//             obj = JSON.parse(this.responseText);
//             // console.log(obj.chain.evolves_to[0].species.name);

//             let evolutions = [];

//             evolutions.push(obj.chain.evolves_to[0].species.name);

//             // console.log(obj.chain.evolves_to[0].evolves_to[0].species.name)

//             evolutions.push(obj.chain.evolves_to[0].evolves_to[0].species.name);

//             // console.log(evolutions)

//             detailsContainer.innerHTML += `
//                         <div class="pb-2 text-capitalize"><strong>Evoluzioni:</strong> ${evolutions} </div>
//             `;
//         } else {
//             console.log("Nessun file trovato");
//         }
//     };

//     xhr.send();
// }

function buttonSearch() {
    let text = getVal();

    const xhr = new XMLHttpRequest();

    if (text.length >= 3 || text.length == 0) {
        xhr.open("GET", `${pokeApi}`, true);

        xhr.onload = function () {
            if (this.status === 200) {
                obj = JSON.parse(this.responseText);
                apiObj.next = obj.next;
                apiObj.prev = obj.previous;

                let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

                let pokemons = obj.results.filter((pokemon) => {
                    if (pokemon.name.includes(text)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                for (pokemon of pokemons) {
                    res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
                }
                resultsContainer.innerHTML = res;
                setListeners(pokemons);
            } else {
                console.log("Nessun file trovato");
            }
        };

        xhr.send();

        main.classList.remove("d-none");

        nav.classList.remove("d-none");
    }
}

function nextPage() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `${getApiUrl(true)}`, true);

    xhr.onload = function () {
        if (this.status === 200) {
            obj = JSON.parse(this.responseText);

            currentPage++;
            setPagination(limit);
            checkBtnsDisabled(obj, false);
            console.log(lastPage);
            displayPages();

            // if (obj.next != null) {
            //     next.classList.remove("disabled");
            //     pokeApi = obj.next;
            // } else {
            //     next.classList.add("disabled");
            // }

            let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

            let pokemons = [];

            obj.results.forEach((el) => {
                pokemons.push(el);
            });

            for (pokemon of pokemons) {
                res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
            }

            resultsContainer.innerHTML = res;
            setListeners(pokemons);
        } else {
            console.log("Nessun file trovato");
        }
    };

    xhr.send();

    main.classList.remove("d-none");
}

function prevPage() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `${getApiUrl(false)}`, true);

    xhr.onload = function () {
        if (this.status === 200) {
            obj = JSON.parse(this.responseText);

            displayPages();

            checkBtnsDisabled(obj, false);

            // if (obj.previous != null) {
            //     prev.classList.remove("disabled");
            //     pokeApi = obj.previous;
            // } else {
            //     prev.classList.add("disabled");
            // }
            // console.log(obj.previous);

            let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

            let pokemons = [];

            obj.results.forEach((el) => {
                pokemons.push(el);
            });

            for (pokemon of pokemons) {
                res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
            }

            resultsContainer.innerHTML = res;
            setListeners(pokemons);
        } else {
            console.log("Nessun file trovato");
        }
    };

    xhr.send();
    currentPage--;
    setPagination(limit);

    main.classList.remove("d-none");
}

function goToLastPage() {
    // lastPage = totalPages;
    let _offset = obj.count - (obj.count % limit);

    let text = getVal();

    const xhr = new XMLHttpRequest();

    if (text.length >= 3 || text.length == 0) {
        xhr.open(
            "GET",
            `https://pokeapi.co/api/v2/pokemon?offset=${_offset}&limit=${limit}`,
            true
        );

        xhr.onload = function () {
            if (this.status === 200) {
                obj = JSON.parse(this.responseText);

                pokeApi = obj.next;

                let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

                let pokemons = obj.results.filter((pokemon) => {
                    if (pokemon.name.includes(text)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                for (pokemon of pokemons) {
                    res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
                }
                resultsContainer.innerHTML = res;
                setListeners(pokemons);
            } else {
                console.log("Nessun file trovato");
            }
        };

        xhr.send();

        offset = _offset;
        // console.log(offset);

        currentPage = lastPage;

        displayPages();

        checkBtnsDisabled(obj);

        main.classList.remove("d-none");

        console.log(offset);
    }
}

function goToFirstPage() {
    firstPageOffset = obj.count - obj.count;
    currentPage = 1;

    let text = getVal();

    const xhr = new XMLHttpRequest();

    if (text.length >= 3 || text.length == 0) {
        xhr.open(
            "GET",
            `https://pokeapi.co/api/v2/pokemon?offset=${firstPageOffset}&limit=${limit}`,
            true
        );

        xhr.onload = function () {
            if (this.status === 200) {
                obj = JSON.parse(this.responseText);

                pokeApi = obj.next;

                let res = `<h3 class="pb-3 text-center">Risultati ricerca</h3>
                           <hr>
                `;

                let pokemons = obj.results.filter((pokemon) => {
                    if (pokemon.name.includes(text)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                for (pokemon of pokemons) {
                    res += `<li id="${pokemon.name}" class="poke-list pb-2 text-capitalize" url="${pokemon.url}"><span class="iconify me-1 pokeicon" data-icon="mdi:pokeball"></span> ${pokemon.name}</li>`;
                }
                resultsContainer.innerHTML = res;
                setListeners(pokemons);
            } else {
                console.log("Nessun file trovato");
            }
        };

        xhr.send();

        currentPage = 1;
        displayPages();

        offset = 0;

        checkBtnsDisabled(obj);

        main.classList.remove("d-none");
    }
}

function checkBtnsDisabled(obj) {
    const { next: n, previous: p } = obj;
    if (p) {
        // Non disabilitato
        prev.classList.remove("disabled");
    } else {
        prev.classList.add("disabled");
        next.classList.remove("disabled");
    }

    if (n) {
        next.classList.remove("disabled");
    } else {
        next.classList.add("disabled");
        lastPageBtn.classList.add("disabled");
        prev.classList.remove("disabled");
    }

    if (currentPage == lastPage) {
        next.classList.add("disabled");
        lastPageBtn.classList.add("disabled");
        prev.classList.remove("disabled");
        firstPageBtn.classList.remove("disabled");
    } else {
        next.classList.remove("disabled");
        lastPageBtn.classList.remove("disabled");
    }

    if (currentPage == 0 || currentPage == 1) {
        next.classList.remove("disabled");
        lastPageBtn.classList.remove("disabled");
        prev.classList.add("disabled");
        firstPageBtn.classList.add("disabled");
    } else {
        prev.classList.remove("disabled");
        firstPageBtn.classList.remove("disabled");
    }
}

function getVal() {
    return document.getElementById("search-bar").value;
}

function getLimitVal() {
    if (document.getElementById("limit-input").value == 0) {
        return (document.getElementById("limit-input").value = limit);
    } else {
        return document.getElementById("limit-input").value;
    }
}

function setListeners(pokemons) {
    for (pokemon of pokemons) {
        let element = document.getElementById(pokemon.name);
        element.addEventListener("click", (e) => {
            showDetail(e.target.getAttribute("url"));
            // showTypes(e.target.getAttribute("url"));
            // showMoves(e.target.getAttribute("url"));

            // showEvolution(e.target.getAttribute("pokeid"));
        });
    }
}

function getApiUrl(isNextStep) {
    let _offset = offset;

    if (isNextStep) {
        _offset = offset + limit;
    } else {
        _offset = offset - limit;
    }

    offset = _offset;

    return `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
}
