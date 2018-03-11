import React, { Component } from 'react';
import Row from '../row';
import Pan from '../pan';
import { findLayouts } from './map';

export default class Scroll extends Component {
    constructor () {
        super();
        this.state = {
            width: 0,
            height: 0,
            panWidth: 0,
            panHeight: 0,
            rows: 0
        }
        this.container = {};
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentDidMount () {
        this.handleWindowResize();
    }

    handleWindowResize = (e) => {
        let width = this.container.clientWidth;
        let height = this.container.clientHeight;
        let rows = Math.ceil(height / this.props.blockHeight) + 4;

        this.setState({
            width,
            height,
            rows
        });
    }

    handleScroll = (e) => {
        let posX = e.target.scrollLeft;
        let posY = e.target.scrollTop;

        this.pan.handlePanMove(e, posX, posY);
    }

    render () {
        let panWidth = this.props.cols * this.props.blockWidth;
        let panHeight = Math.floor(this.props.articles.length / this.props.cols) * this.props.blockHeight;


        let blocks = new Array(this.state.rows * this.props.cols);
        blocks.fill({
            content: []
        });

        let blockWidth = this.container.offsetWidth;

        let articles = findLayouts(this.props.articles, 3);

        let rows = blocks.reduce((acc, block, index) => {
            let rowIndex = index % this.state.rows;
            acc[rowIndex] = acc[rowIndex] || [];

            acc[rowIndex].push({
                articles: articles[index]
            });
            return acc;
        }, []);

        return <section className="scroll" onScroll={this.handleScroll} ref={container => this.container = container}>
            <Pan containerWidth={this.state.width}
                containerHeight={this.state.height}
                ref={pan => this.pan = pan}
                blockWidth={blockWidth}
                backgrounds={this.props.backgrounds}
                blockHeight={this.props.blockHeight}
                width={panWidth}
                height={panHeight}>
                {rows.map((blocks, index) => <Row
                    key={index}
                    blocks={blocks}
                    index={index}
                    rows={rows.length}
                    cols={this.props.cols}
                    
                ></Row>)}
            </Pan>
        </section>;
    }
}