// class for basic event emitter

export const Event = (function () {
    return class {
        constructor () {
            this.handlers = [];
        }

        listen (handler) {
            // binds a handler to the event
            if (this.handlers.includes(handler)){
                return;
            }

            this.handlers.push(handler);
        }

        unlisten (handler) {
            // unbinds a handler from the event
            const index = this.handlers.indexOf(handler);

            if (index !== -1) {
                this.handlers.splice(index, 1);
            }
        }

        trigger (...data) {
            // fires the event and calls all listening handlers
            // with the given data
            for (let i = 0; i < this.handlers.length; i++){
                try {
                    this.handlers[i](...data);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
})();