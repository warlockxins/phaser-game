export class NavMesh {
    mesh: { columns: {}; vertices: Map<any, any>; edges: {}; };
    constructor(tilemap: Phaser.Tilemaps.Tilemap, tileLayer: Phaser.Tilemaps.DynamicTilemapLayer) {
        // get collidable tiles in range for path finding
        const tilesInRect = tilemap.getTilesWithin(0, 0, 100, 50, { isNotEmpty: true, isColliding: true }, tileLayer).map(({ pixelX, pixelY }) => {
            return { x: pixelX, y: pixelY }
        });

        console.time('points');
        this.mesh = pointsToTable(tilesInRect);
        console.timeEnd('points');
    }
}


const helpers = {
    solid: 1,
    wayPointGround: 2,
}

function pointsToTable(points) {
    const vertices = new Map();
    const edges = {};

    const columns = {};

    // fill walkable tiles from waypoints
    points.forEach(p => {
        if (!columns[p.x])
            columns[p.x] = {};
        columns[p.x][p.y] = helpers.solid;

        const curVertexName = `${p.x}:${p.y}`;
        vertices.set(curVertexName, p);
    });


    // fill points for falling from current block to left and right ... safely
    const checkSides = [-1, 1];
    const keys = Object.keys(columns);
    for (let index = 0; index < keys.length; index++) {

        const curColumn = columns[keys[index]];

        for (const [curY, tileType] of Object.entries(curColumn)) {
            const curVertexName = `${keys[index]}:${curY}`;

            const upY = (+curY) - 1;
            const curTileUp = curColumn[upY];

            // we can stand on this - don't have tile stacked above
            if (!curTileUp) {
                for (const offset of checkSides) {
                    const resIndex = index + offset;
                    if (resIndex < 0) continue;
                    if (resIndex >= keys.length) continue;

                    const checkColumnKey = keys[resIndex];
                    const columnCheck = columns[checkColumnKey];

                    if (columnCheck[upY]) {
                        continue;
                    }

                    // has neighbour tile, can stand on it
                    if (columnCheck[curY]) {
                        connectHorizontalTiles(edges, curVertexName, `${checkColumnKey}:${curY}`, 1);
                        continue
                    }
                    // check if can fall down to neighbour tile
                    const posBelow = columnWillLand(columnCheck, upY);
                    if (posBelow) {
                        const fromVertexKey = `${keys[index]}:${curY}`;
                        const toVertexKey = `${checkColumnKey}:${posBelow.y}`;
                        const diagonalCost = 1;
                        // jump down is possible = add to edges
                        connectHorizontalTiles(edges, fromVertexKey, toVertexKey, diagonalCost);

                        // Todo calculate if can jump up a tile (jump height dependency)
                        connectHorizontalTiles(edges, toVertexKey, fromVertexKey, diagonalCost);
                    }
                }
            }
        }
    }
    return { columns, vertices, edges };
}

function connectHorizontalTiles(inEdges, curVertexName, toVertexName, cost) {
    if (!inEdges[curVertexName]) {
        inEdges[curVertexName] = [];
    }
    inEdges[curVertexName].push({ to: toVertexName, cost: cost });

}


function columnWillLand(column, belowStart) {
    let lowest = { y: belowStart, waypointType: -1 };
    for (const [y, waypointType] of Object.entries(column)) {
        if (waypointType === 1 && y > belowStart) {
            lowest = { y, waypointType }
        }
    }
    return lowest.waypointType === -1 ? undefined : lowest;
}