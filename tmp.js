const g = [
    [0, 2, 0, 6, 0],
    [2, 0, 3, 8, 5],
    [0, 3, 0, 0, 7],
    [6, 8, 0, 0, 9],
    [0, 5, 7, 9, 0]
];

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

function printMST(n, parent, g) {
    for(let v = 1; v < n; v++) {
        console.log(`${parent[v]}-${v} -> ${g[parent[v]][v]}`);
    }
}

function Prim(g) {
    const n = g.length;

    const key = [];
    const parent = [];
    const mstSet = [];
    for(let i = 0; i < n; i++) {
        key.push(Infinity);
        parent.push(undefined);
        mstSet.push(false);
    }
    key[0] = 0;
    parent[0] = -1; // root would be 0

    for(let i = 0; i < n; i++) {
        const u = minKey(n, key, mstSet);
        mstSet[u] = true;

        for(let j = 0; j < n; j++) {
            if(g[u][j] > 0 && !mstSet[j] && key[j] > g[u][j]) { 
                key[j] = g[u][j];
                parent[j] = u;
            }
        }
    }
    printMST(n, parent, g);
}

Prim(g);