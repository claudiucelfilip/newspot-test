import React, { Component } from 'react';
import striptags from 'striptags';

export default class Article extends Component {
    render() {
        let article = this.props.article;
        let imageUrl, imageStyle, excerpt, title;
        // let image = article.image ? <img src={'/proxy?url=' + article.image.url} /> : null;
        if (article.image) {
            imageUrl = article.image ? '/proxy?url=' + article.image.url : null;
            imageStyle;
            imageStyle = {
                backgroundImage: `url(${imageUrl})`,
                // maxWidth: article.image.width + 'px',
                // maxHeight: article.image.height + 'px',
            };
            
        }
        
        excerpt = striptags(article.content.join() || '');
        if (excerpt.length > 150) {
            excerpt = excerpt.slice(0, 150) + '...';
        }
        
        title = article.headline;
        if (title.length > 250) {
            title = title.slice(0, 250) + '...';
        }

        let layout = article.layout;

        let colX = layout.x + 1;
        let colY = layout.y + 1;
        
        // console.log(style);
        let isSmallWidth = layout.width <= 3;
        let isSmallHeight = layout.height <= 3;

        let style = {
            gridColumn: `${colX} / span ${layout.width}`,
            gridRow: `${colY} / span ${layout.height}`
            // left: layout.x / 12 * 100 + '%',
            // top: layout.y / 9 * 100 + '%',
            // width: layout.width / 12 * 100 + '%',
            // height: layout.height / 9 * 100 + '%'
        };

        

        let className = `article article--${(layout.width >= 12 && layout.height <= 6) || layout.height <= 3 ? 'wide' : 'normal'} ${imageUrl ? 'grid--two': ''}`;

        return <article key={article._id} className={className} style={style}>
            {/* <div className="image">
                {image}
            </div> */}
            {imageUrl ? <div className="image" style={imageStyle}></div> : ''}
            <div className="content">
                <a href={article.url} target="_blank" className="title">
                    {isSmallWidth && isSmallHeight ? <h3>{title}</h3> : <h2>{title}</h2>}
                </a>

                {imageUrl && !isSmallHeight ? <div className="text">{excerpt}</div> : ''}
                
            </div>
        </article>;
    }
}


