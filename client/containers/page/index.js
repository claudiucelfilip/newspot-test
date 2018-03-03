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

    componentWillMount() {
        this.props.receiveArticles(generateFakeData(140));
    }
    render() {
        let articles = this.props.articles;
        
        return <div>
            <h1>Hello world</h1>
            <Scroll 
                articles={articles} 
                blockWidth={120}
                blockHeight={100}
                cols={12}
            />
        </div>;
    }
}
function mapDispatchToProps(dispatch) {
    return {
        receiveArticles: (len) => {
            return dispatch(receiveArticles(len));
        }
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