const nodes = document.querySelectorAll(".graph__node");
const edges = document.querySelectorAll(".graph__edge");
const weights = document.querySelectorAll(".graph__weight");
const edgeElements = [...edges, ...weights];
edgeElements.forEach((edgeElement) => {
    edgeElement.style.display = "none";
});

const n = nodes.length;
const adjacency = generateSquareMatrix(n, null);
const virtualAdjacency = [
    [0, 2, 0, 6, 0],
    [2, 0, 3, 8, 5],
    [0, 3, 0, 0, 7],
    [6, 8, 0, 0, 9],
    [0, 5, 7, 9, 0]
];
const WITHOUT_LINKING = 0;
let TIME_DELAY;
generateComposedGridForm();

for(let i = 0; i < n; i++) {
    for(let j = i + 1; j < n; j++) {
        if(virtualAdjacency[i][j] !== WITHOUT_LINKING) {
            const edge = document.querySelector(`#gEdge${i}-${j}`);
            const weight = document.querySelector(`#gWeight${i}-${j}`);
            edge.style.display = "inline";
            weight.style.display = "inline";
            weight.textContent = virtualAdjacency[i][j];
        }
    }
}

function clearout() {
    nodes.forEach((node) => {node.style.backgroundColor = "#DDD";});
    edges.forEach((edge) => {edge.style.backgroundColor = "#000";});
}

const btnStartAlgorithm = document.querySelector(`#btnStartAlgorithm`);
btnStartAlgorithm.onclick = function() {
    clearout();

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            const gInput = document.querySelector(`#gInput${i}-${j}`);
            const edgeValue = Number.parseInt(gInput.value);
            if(!isNaN(edgeValue)) {
                virtualAdjacency[i][j] = edgeValue;
            } else {
                virtualAdjacency[i][j] = 0;
                gInput.value = 0;
            }
        }
    }

    for(let i = 0; i < n; i++) {
        for(let j = i + 1; j < n; j++) {
            if(virtualAdjacency[i][j] !== WITHOUT_LINKING) {
                const edge = document.querySelector(`#gEdge${i}-${j}`);
                const weight = document.querySelector(`#gWeight${i}-${j}`);
                edge.style.display = "inline";
                weight.style.display = "inline";
                weight.textContent = virtualAdjacency[i][j];
            }
        }
    }

    const srcControl = document.querySelector("#srcControl");
    const delayControl = document.querySelector("#delayControl");
    let src = Number.parseInt(srcControl.value);
    if(src < 0 || src > nodes.length) {
        src = 0;
        srcControl.value = 0;
    }
    srcControl.value = src;
    TIME_DELAY = Number.parseInt(delayControl.value);
    if(isNaN(TIME_DELAY)) {
        TIME_DELAY = 1000;
        delayControl.value = 1000;
    }
    delayControl.value = TIME_DELAY;
    Prim(virtualAdjacency, src);
}

function generateComposedGridForm() {
    const adjacency = document.querySelector(".adjacency__inputs");
    for(let i = 0; i < n + 1; i++) {
        for(let j = 0; j < n + 1; j++) {
            const edgeInput = document.createElement("input");
            edgeInput.classList.add("adjacency__input");
            adjacency.appendChild(edgeInput);

            if(i > 0 && j > 0 && i == j) {
                edgeInput.value = 0;
            }
            if(i >= j) {
                edgeInput.disabled = true;
            }
            if(i == 0 && j == 0) {
                edgeInput.value = "i / j";
                edgeInput.style.fontWeight = "bold";
            } else if(i == 0) {
                edgeInput.value = j - 1;
            } else if(j == 0) {
                edgeInput.value = i - 1;
            } else {
                edgeInput.id = `gInput${i-1}-${j-1}`;
                edgeInput.value = virtualAdjacency[i-1][j-1];
            }
        }
    }
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            const edgeInput = document.querySelector(`#gInput${i}-${j}`);
            edgeInput.oninput = function(evt) {
                const alternInput = document.querySelector(`#gInput${j}-${i}`);
                const edgeValue = evt.target.value;
                alternInput.value = edgeValue;

                const edge = document.querySelector(`#gEdge${i}-${j}`);
                const weight = document.querySelector(`#gWeight${i}-${j}`);
                const nodeValue = Number.parseInt(edgeValue);
                if(!isNaN(nodeValue) && nodeValue !== 0) {
                    edge.style.display = "inline";
                    weight.style.display = "inline";
                    weight.textContent = edgeValue;
                } else {
                    edge.style.display = "none";
                    weight.style.display = "none";
                }
            }
        }
    }
}

function generateMatrix(amountRows, amountColumns, initializer) {
    const mtx = [];
    for(let i = 0; i < amountRows; i++) {
        mtx.push([]);
        for(let j = 0; j < amountColumns; j++) {
            mtx[i].push(initializer);
        }
    }
    return mtx;
}

function generateSquareMatrix(dimension, initializer) {
    return generateMatrix(dimension, dimension, initializer);
}

function sleep(seconds) {
    return new Promise((resolve, _) => {
        setTimeout(() => {
            return resolve(null);
        }, seconds);
    });
}

function minKey(n, key, mstSet) {
    let min = Infinity;
    let min_index;

    for(let v = 0; v < n; v++) {
        if(!mstSet[v] && min > key[v]) {
            min = key[v];
            min_index = v;
        }
    }
    return min_index;
}

async function Prim(g, src) {
    const n = g.length;

    const key = [];
    const parent = [];
    const mstSet = [];

    for(let i = 0; i < n; i++) {
        key.push(Infinity);
        mstSet.push(false);
    }
    key[src] = 0;
    parent[src] = -1;

    for(let i = 0; i < n; i++) {
        await sleep(TIME_DELAY);
        const u = minKey(n, key, mstSet);
        mstSet[u] = true;

        if(parent[u] !== -1) {
            const edge = document.querySelector(`#gEdge${Math.min(parent[u], u)}-${Math.max(parent[u], u)}`);
            edge.style.backgroundColor = "#90EE90";
        }
        nodes[u].style.backgroundColor = "#90EE90";

        for(let j = 0; j < n; j++) {
            if(g[u][j] === WITHOUT_LINKING || mstSet[j]) {
                continue;
            }

            await sleep(TIME_DELAY);
            const edge = document.querySelector(`#gEdge${Math.min(u, j)}-${Math.max(u, j)}`);
            if(g[u][j] !== WITHOUT_LINKING && !mstSet[j] && key[j] > g[u][j]) {
                if(parent[j] !== undefined && parent[j] !== -1) {
                    const previous = document.querySelector(`#gEdge${Math.min(parent[j], j)}-${Math.max(parent[j], j)}`);
                    previous.style.backgroundColor = "#FF0000";
                }
                key[j] = g[u][j];
                parent[j] = u;
                edge.style.backgroundColor = "#FFA500";
            } else if(key[j] <= g[u][j]) {
                edge.style.backgroundColor = "#FF0000";
            }
        }
    }
}