class PathTableItem {
    cost: any;
    from: any;
    heuristic: number;
    /**
     * 
     * @param {number} cost 
     * @param {string} from 
     * @param {number} heuristic 
     */
    constructor(cost, from, heuristic = 0) {
        this.cost = cost;
        this.from = from;
        this.heuristic = heuristic;
    }
}

export class PathPlanner {
    unvisited: string[];
    vertexes: any;
    edges: any;
    pathTable: {};
    visited: any[];
    /**
     * 
     * @param {Map} vertexes 
     * @param {*} edges 
     */
    constructor(vertexes, edges) {
        this.vertexes = vertexes;
        this.edges = edges;
        this.unvisited = [];
        this.pathTable = {};
        this.visited = [];
    }

    /**
     * this needs should help calculate optimistic right direction, 
     * Must override per need
     * by default just 0
     * 
     * @param {*} fromNode vertex
     * @param {*} toNode vertex
     * @returns number
     */
    calculateHeuristic(fromNode, toNode) {
        return Math.sqrt(Math.pow((fromNode.x - toNode.x), 2) + Math.pow((fromNode.y - toNode.y), 2));
    }

    /**
     * @param {string} from vertex key
     */
    resetPathTable(from) {
        const fromNode = this.vertexes.get(from);

        for (const [key, node] of this.vertexes) {
            this.pathTable[key] =
                key === from ?
                    new PathTableItem(0, undefined, 0)
                    : new PathTableItem(Number.POSITIVE_INFINITY, undefined, this.calculateHeuristic(fromNode, this.vertexes.get(key)))
        }
    }

    calculateNeighboursDistance(currentNode) {
        const neighbours = this.edges[currentNode];
        if (!neighbours || neighbours.length === 0) {
            return;
        }

        const distFrom = this.pathTable[currentNode].cost;

        neighbours.forEach((edge) => {
            if (this.visited.indexOf(edge.to) === -1) {
                this.unvisited.push(edge.to);
            }
            const elementTo = this.pathTable[edge.to];

            const cost = distFrom + edge.cost;

            if (elementTo.cost > cost) {
                elementTo.cost = cost;
                elementTo.from = currentNode;
            }
        });
    }

    pickNextVertexKey(): string | undefined {
        let smallest = Number.POSITIVE_INFINITY;
        let cheapCostKey: string | undefined = undefined;

        this.unvisited.forEach((vertexKey) => {
            if (this.visited.indexOf(vertexKey) === -1) {
                const { cost, heuristic } = this.pathTable[vertexKey];
                const itemCostWithHeuristic = cost + heuristic;

                if (itemCostWithHeuristic < smallest) {
                    smallest = itemCostWithHeuristic;
                    cheapCostKey = vertexKey;
                }
            }
        });

        return cheapCostKey;
    }

    removeUnvisited(vertexKey) {
        const index = this.unvisited.indexOf(vertexKey);
        if (index != -1) {
            this.unvisited.splice(index, 1);
        }
    }

    extractPath(to: string) {
        let currentNode = to;
        const path: string[] = [];

        while (currentNode) {
            path.push(currentNode);
            currentNode = this.pathTable[currentNode].from;
        }

        return path.reverse().map(item => this.vertexes.get(item));
    }

    /**
     * 
     * @param {[x, y]} from 
     * @param {string} to
     * @returns 
     */
    execute(from: string, to: string) {
        const fromNode = this.vertexes.get(from);
        if (!fromNode) {
            return [];
        };

        let counter = 0;
        this.resetPathTable(from);
        let currentNode: string | undefined = from;
        this.unvisited.push(from);

        while (currentNode) {
            counter++;
            if (currentNode === to) {
                // console.log('======Counter', counter);
                return this.extractPath(to);
            }

            this.calculateNeighboursDistance(currentNode);

            this.visited.push(currentNode);
            this.removeUnvisited(currentNode);
            currentNode = this.pickNextVertexKey();
        }

        return [];
    }
}
