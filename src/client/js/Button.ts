import { Component, IProps } from './Component';
// used for buttons in the Trip class
export class Button extends Component {
    constructor(public el: HTMLElement, public props: IProps) {
        super(el, props);
    }
    componentDidMount() {
        this.el.addEventListener('click', this.props.click);
        return false;
    }
}