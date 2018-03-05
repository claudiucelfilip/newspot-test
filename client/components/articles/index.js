import React, { Component } from 'react';
import Article from '../article';

export default class Articles extends Component {
    render() {
        let articles = this.props.articles.filter(article => article);
        
        return <section className="articles">
            {articles.map((article, index) => <Article article={article} key={index}></Article>)}
        </section>;
    }
}