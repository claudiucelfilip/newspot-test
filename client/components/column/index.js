import React, { Component } from 'react';
import Scroll from '../scroll';


export default class Column extends Component {
    render() {
        let style = {
            background: this.props.backgrounds[0],
            width: this.props.blockWidth + 'px'
        };
        
        return <section className="column" style={style}>
            <h2 className="source-title" >{this.props.title}</h2>
            {this.props.articles.length ? <Scroll 
                articles={this.props.articles}
                title={this.props.title}
                backgrounds={this.props.backgrounds}
                blockHeight={this.props.blockHeight}
                cols={1}
            /> : <span>Loading</span>}
        </section>;
    }
}