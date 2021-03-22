export class Primitive {
    constructor(el) {
        this.el = el;
        this.set.bind(this);
        this.clear.bind(this);
    }
    set(value) {
        this.el.textContent = value;
    }
    clear() {
        this.el.textContent = '';
    }
}