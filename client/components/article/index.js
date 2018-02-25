import React, { Component } from 'react';

export default class Page extends Component {
    render() {
        let article = this.props.article;
        let image = article.image ? <img src={'/proxy?url=' + article.image.url} /> : null;
        
        return <article key={article._id} className="article">
            <h2>
                <a href="{article.url}">{article.headline}</a>
            </h2>
            {image}
            <div className="content">
                {article.content.map((line, index) => <div key={index} dangerouslySetInnerHTML={{__html: line}}></div>)}
            </div>
        </article>;
    }
}