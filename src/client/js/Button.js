import { Component } from './Component';

export class Button extends Component {
    constructor(el, props) {
        super(el, props);
    }
    componentDidMount() {
        this.el.addEventListener('click', this.props.click);
    }
}