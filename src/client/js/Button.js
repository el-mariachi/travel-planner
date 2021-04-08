import { Component } from './Component';
// used for buttons in the Trip class
export class Button extends Component {
    constructor(el, props) {
        super(el, props);
    }
    componentDidMount() {
        this.el.addEventListener('click', this.props.click);
        return false;
    }
}