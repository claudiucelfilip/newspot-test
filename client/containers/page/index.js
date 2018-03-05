import React, { Component } from 'react';
import Scroll from '../../components/scroll';
import { connect } from 'react-redux'
import { receiveArticles } from '../../actions';

function generateFakeData(len) {
    let output = [];
    while(len) {
        output.push({
            content: []
        });
        len--;
    }
    return output;
}

class Page extends Component {

    render() {
        let articles = this.props.articles;
        
        return <div>
            <h1>Hello world</h1>
            
            {articles.length ? <Scroll 
                articles={articles} 
                blockWidth={640}
                blockHeight={480}
                cols={4}
            /> : <span>Loading</span>}
        </div>;
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}

function mapStateToProps(state) {
    return {
        articles: state.articles
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);