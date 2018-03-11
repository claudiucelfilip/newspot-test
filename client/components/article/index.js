import React, { Component } from 'react';
import striptags from 'striptags';

export default class Article extends Component {
    constructor() {
        super();
        this.state = {
            excerpt: null
        }
        
    }
    componentDidMount() {
        if (!this.content) {
            return;
        }
        let layout = this.props.article.layout;

        let extraPadding = layout.width >= 12 && layout.height >= 6 ? 20: 0;
        extraPadding = layout.width >= 9  ? 10 : extraPadding;

        let parentHeight = this.content.parentNode.offsetHeight;
        let titleHeight = this.title.offsetHeight + 20;
        let height = this.content.offsetHeight;

        let threshold = (parentHeight - titleHeight - extraPadding) / height;

        this.setState({
            excerpt: this.state.excerpt.slice(0, this.state.excerpt.length * threshold) + ' ...'
        });
    }

    componentWillMount() {
        let excerpt = excerpt = striptags(this.props.article.content.join() || '');
        this.setState({
            excerpt
        });
    }
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
        let layout = article.layout;

        let isSmallWidth = layout.width <= 3;
        let isSmallHeight = layout.height <= 3;

        let isLargeWidth = (layout.width >= 9 && layout.height >= 6);
        let isLargeHeight = (layout.width >= 3 && layout.height >= 12);
        
        title = article.headline;
        
        
        if (title.length > 200) {
            title = title.slice(0, 200) + '...';
        }
        let colX = layout.x + 1;
        let colY = layout.y + 1;
    

        let style = {
            gridColumn: `${colX} / span ${layout.width}`,
            gridRow: `${colY} / span ${layout.height}`
        };

        let headline = isSmallWidth || isSmallHeight ? <h4>{title}</h4> : <h2>{title}</h2>;
        headline = layout.width >= 9 && isSmallHeight ? <h3>{title}</h3> : headline;

        let className = `article article--${(layout.width >= 9 && layout.height <= 3)  ? 'wide' : 'normal'} ${imageUrl ? 'grid--two': ''}`;

        className += isLargeWidth ? ' article--wide-text' : '';
        className += layout.width >= 12 && layout.height >= 6 ? ' article--ultra-wide-text' : '';
        return <article key={article._id} className={className} style={style}>
            
            {imageUrl ? <div className="image" style={imageStyle}></div> : ''}
            <div className="content" >
                <a href={article.url} target="_blank" className="title" ref={title => this.title = title}>
                    {headline}
                </a>

                {this.state.excerpt.length > 10 && !isSmallHeight ? <div className="text" ref={content => this.content = content}>
                    {this.state.excerpt}
                </div> : ''}
                
            </div>
        </article>;
    }
}


