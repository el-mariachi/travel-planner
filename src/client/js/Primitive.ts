// used for form error display elements
// makes Form code more readable
export class Primitive {
    constructor(private el: HTMLElement) {
        this.el = el;
        this.set.bind(this);
        this.clear.bind(this);
    }
    set(value: string) {
        this.el.textContent = value;
    }
    clear() {
        this.el.textContent = '';
    }
}