import React, { Component } from 'react';
import Block from '../block';

export default class Column extends Component {
    render() {
        return <section className="column">
            {this.props.articles.map((article, index) => <Block key={index} article={article}/>)}
        </section>;
    }
}