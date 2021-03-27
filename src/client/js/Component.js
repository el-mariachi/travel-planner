import { EventBus } from './event-bus';

export class Component {
    // these are events for all subclasses
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_LSDU: "flow:localstorage-did-update",
        FLOW_DATA: "flow:new-data",
        FLOW_RENDER: "flow:render",
        RESET: "reset",
        HIDE: "hide",
        DELETE: "delete",
        USER_SUBMIT: "user:submit"
    }
    constructor(el, props = {}) {
        this.el = el;
        this.props = props;
        const eventBus = new EventBus;
        this.eventBus = () => eventBus;
        this._registerEvents(eventBus);
        eventBus.emit(Component.EVENTS.INIT);
    }
    _registerEvents(eventBus) {
        eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Component.EVENTS.RESET, this._reset.bind(this));
        eventBus.on(Component.EVENTS.HIDE, this.hide.bind(this));
        this.registerEvents(eventBus);
    }
    registerEvents(eventBus) {
        // can be redefined in subclasses
    }
    init() {
        this.eventBus().emit(Component.EVENTS.FLOW_CDM);
    }
    _reset() {
        this.reset();
    }
    reset() {
        // can be redefined in subclass
    }
    _componentDidMount() {
        this.componentDidMount();
        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
    }
    componentDidMount() {
        // can be redefined in subclasses
    }
    _componentDidUpdate(oldProps, newProps) {
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
        }
    }
    componentDidUpdate(oldProps, newProps) {
        // can be redefined in subclasses
        return true;
    }
    show() {
        this.el.classList.remove(`${this._base_class}--hidden`);
    }
    hide() {
        this.el.classList.add(`${this._base_class}--hidden`);
    }
    _render() {
        this.render();
    }
    render() {
        // can be redefined in subclasses
    }
}