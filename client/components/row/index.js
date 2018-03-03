import React, { Component } from 'react';
import Block from '../block';

export default class Row extends Component {
    constructor() {
        super();
        this.state = {
            verticalIndex: null
        };

        this.blockRefs = [];
    }

    componentWillMount() {
        let verticalIndex = this.props.index;

        this.setState({
            verticalIndex
        });
    }

    changeVerticalIndex(direction) {
        let increment = this.props.rows * direction;
        let newVericalIndex = this.state.verticalIndex - increment;

        this.setState({
            verticalIndex: newVericalIndex < 0 ? this.state.verticalIndex : newVericalIndex
        });
    }

    handleVisibility = () => {
        if (this.props.verticalDirection === 0) {
            return;
        }

        let threshold = this.props.verticalDirection < 0 ? 3 : 4;

        let hiddenBlocks = this.blockRefs.filter(block => block && block.state.visibility === threshold);
        if ( hiddenBlocks.length === this.props.blocks.length) {
            this.changeVerticalIndex(this.props.verticalDirection);
        }
    }
    render() {
        return <section className="row">
        {
            this.props.blocks.map((block, index) => <Block key={index} 
                {...this.props}
                verticalIndex={this.state.verticalIndex}
                ref={block => this.blockRefs[index] = block}
                onVisibilityChange={this.handleVisibility}
                index={index}
                block={block}/>
            )
        }
        </section>;
    }
}