import React, { Component } from 'react';
import Article from '../article';

const visibilities = [
    'visible',
    'showing',
    'loading',
    'hiddenTop',
    'hiddenBottom'
];

const backgrounds = [
    'transparent',
    'yellow',
    'red',
    'blue',
    'cyan'
];
export default class Page extends Component {
    constructor() {
        super();
        this.state = {
            blockTop: 0,
            blockLeft: 0,
            visibility: null
        };
    }
    componentDidMount() {
        this.calculatePosition(this.props.index, this.props.verticalIndex);
    }

    calculatePosition(index, verticalIndex) {
        this.setState({
            blockLeft: index * this.props.blockWidth,
            blockTop: verticalIndex * this.props.blockHeight
        });
    }

    calculateVisibility() {
        let outside = this.getOutside();
        let loading = this.getLoading();
        let showing = this.getShowing();
        let visible = 0;

        let visibility = Math.max(outside, loading, showing, visible);

        if (this.state.visibility === null || visibility !== this.state.visibility) {
            this.setState({visibility}, () => {
                this.props.onVisibilityChange();
            });
        }
    }

    getOutside() {
        let proximity = this.getProximity(3);

        if (proximity.isOusideTop) {
            return 3;
        }

        if (proximity.isOusideBottom) {
            return 4;
        }

        return -1;
    }

    getLoading() {
        let proximity = this.getProximity(2);

        return proximity.isOusideTop || proximity.isOusideRight || proximity.isOusideBottom || proximity.isOusideLeft ? 2 : -1;
    }

    getShowing() {
        let proximity = this.getProximity(1);

        return proximity.isOusideTop || proximity.isOusideRight || proximity.isOusideBottom || proximity.isOusideLeft ? 1 : -1;
    }

    getProximity(proximity) {
        let isOusideLeft = this.props.panLeft + this.state.blockLeft + (this.props.blockWidth * proximity) < 0;
        let isOusideTop = this.props.panTop + this.state.blockTop + (this.props.blockHeight * proximity) < 0;
        let isOusideRight = this.props.panLeft + this.state.blockLeft - (this.props.blockWidth * (proximity - 1)) > this.props.containerWidth;
        let isOusideBottom = this.props.panTop + this.state.blockTop - (this.props.blockHeight * (proximity - 1)) > this.props.containerHeight;

        return {
            isOusideLeft,
            isOusideTop,
            isOusideRight,
            isOusideBottom
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.verticalIndex !== this.props.verticalIndex) {
            this.calculatePosition(this.props.index, nextProps.verticalIndex);
        }
    }

    render() {
        this.calculateVisibility();

        let style = {
            left: this.state.blockLeft + 'px',
            top: this.state.blockTop + 'px',
            width: this.props.blockWidth + 'px',
            height: this.props.blockHeight + 'px',
            background: backgrounds[this.state.visibility]
        };

        return <div className="block" 
            index={this.props.index} 
            ref={node => this.node = node} style={style}>
            {this.props.index} {this.props.verticalIndex}
        </div>;
    }
}