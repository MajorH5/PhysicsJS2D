import { Vector2 } from './vector2.js';

export const CollisionChunks = (function () {
    return class CollisionChunks {
        constructor (chunkSize, bounds) {
            this.chunkSize = chunkSize; // size of each chunk
            this.chunks = []; // 2d array of chunks
            this.cache = new Map(); // cache of the chunks an object is in
            this.objects = 0; // number of objects in the chunks

            this.bounds = null; // bounds of the chunks
            this.chunksX = null; // number of chunks in X direction
            this.chunksY = null; // number of chunks in Y direction

            this.resize(bounds);
        }

        resize (bounds) {
            this.clear();
            
            this.bounds = bounds;
            this.chunksX = Math.ceil(bounds.x / this.chunkSize);
            this.chunksY = Math.ceil(bounds.y / this.chunkSize);

            // create the chunks
            for (let y = 0; y < this.chunksY; y++){
                this.chunks[y] = [];
                for (let x = 0; x < this.chunksX; x++){
                    this.chunks[y][x] = [];
                }
            }
        }

        alignPointToChunkCoord (point) {
            // aligns a point to a chunk coordinate
            return point.div(this.chunkSize).floor();
        }

        getChunk (point) {
            // gets the chunk a point is in
            const chunkCoord = this.alignPointToChunkCoord(point);

            // check if the chunk exists
            if (chunkCoord.x < 0 || chunkCoord.x >= this.chunksX) return null;
            if (chunkCoord.y < 0 || chunkCoord.y >= this.chunksY) return null;

            // get the chunk
            return this.chunks[chunkCoord.y][chunkCoord.x];
        }

        getChunkIndex (point) {
            // gets the index of the chunk a point is in
            const chunkCoord = this.alignPointToChunkCoord(point);
            return chunkCoord.y * this.chunksX + chunkCoord.x;
        }

        getObjectsInArea (object) {
            // takes a set of points and combines all objects
            // in the chunks they are in into a single array

            const points = object.getVertices();
            const combined = new Set();
            const collected = [];

            for (let i = 0; i < points.length; i++){
                const point = points[i];
                const chunk = this.getChunk(point);

                if (chunk === null) continue; // no chunk found

                const chunkIndex = this.getChunkIndex(point);

                if (collected.includes(chunkIndex)) continue; // already collected this chunk

                collected.push(chunkIndex);
                
                // add the objects to the combined set
                for (let j = 0; j < chunk.length; j++){
                    const chunkObject = chunk[j];

                    if (chunkObject !== object) {
                        combined.add(chunkObject);
                    }
                }
            }

            return Array.from(combined);
        }

        storeObjectChunks (object, chunks) {
            // stores the chunks an object is in
            this.cache.set(object, chunks);
        }

        getObjectChunks (object) {
            // gets the chunks an object is in
            return this.cache.get(object);
        }

        deleteObjectChunks (object) {
            // deletes the chunks an object is in
            return this.cache.delete(object);
        }

        hasObject (object) {
            // returns true if the object is in the chunks
            return this.getObjectChunks(object) !== undefined;
        }
        
        moveObject (object) {
            // updates the chunks an object is in
            this.removeObject(object);
            this.addObject(object);
        }

        addObject (object) {
            // adds an object to the chunks it falls within
            const inserted = [];

            const x = object.position.x,
                  y = object.position.y;
            const w = object.size.x,
                  h = object.size.y;

            const dx = Math.ceil(w / this.chunkSize),
                    dy = Math.ceil(h / this.chunkSize);

            for (let xStep = x; xStep < x + w; xStep += dx){
                for (let yStep = y; yStep < y + h; yStep += dy){
                    const vertex = new Vector2(xStep, yStep);
                    
                    const chunk = this.getChunk(vertex);

                    if (chunk === null || chunk.includes(object)) continue; // vertex OOB or object already there

                    // add the object to the chunk
                    chunk.push(object);
                    inserted.push(chunk);
                }
            }


            this.storeObjectChunks(object, inserted);
            this.objects++;
        }

        removeObject (object, permanent) {
            // removes an object from the chunks it falls within
            const chunks = this.getObjectChunks(object);

            if (chunks === undefined) return; // object not in chunks

            for (let i = 0; i < chunks.length; i++){
                const chunk = chunks[i];
                const index = chunk.indexOf(object);

                if (index !== -1) chunk.splice(index, 1);
            }

            if (permanent) {
                // avoid repeated key creations & deletions
                this.deleteObjectChunks(object)
            }
            
            this.objects--;
        }

        clear () {
            // clears all objects
            this.chunks = [];
            this.cache = new Map();
            this.objects = 0;
        }
    }
})();