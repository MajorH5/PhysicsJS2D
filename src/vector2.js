// basic class for 2d vectors
// methods return new vectors, they do not modify the original vector
export const Vector2 = (function () {
    return class Vector2 {
        constructor (x = 0, y = 0) {
            if (typeof x !== 'number') throw new TypeError('new Vector2(): must be a number.');
            if (typeof y !== 'number') throw new TypeError('new Vector2(): must be a number.');
    
            this._x = x;
            this._y = y;
        }
    
        get x () {
            return this._x;
        }
    
        get y () {
            return this._y;
        }

        set x (value) {
            if (typeof value !== 'number') throw new TypeError('Vector2(): x must be a number.');
            this._x = value;
        }

        set y (value ) {
            if (typeof value !== 'number') throw new TypeError('Vector2(): y must be a number.');
            this._y = value;
        }

        add (vector) {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }

        subtract (vector) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }

        multiply (vector) {
            return new Vector2(this.x * vector.x, this.y * vector.y);
        }

        divide (vector) {
            return new Vector2(this.x / vector.x, this.y / vector.y);
        }

        equals (vector) {
            return this.x === vector.x && this.y === vector.y;
        }
        
        scale (scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        }

        div (divisor) {
            return new Vector2(this.x / divisor, this.y / divisor);
        }

        magnitude () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        floor () {
            return new Vector2(Math.floor(this.x), Math.floor(this.y));
        }

        ceil () {
            return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
        }
    }
})();