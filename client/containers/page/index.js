import React, { Component } from 'react';
import Column from '../../components/column';
import { connect } from 'react-redux'

class Page extends Component {
    render() {
        let articles = this.props.articles;
        return <div>
            <h1>Hello world</h1>
            <Column articles={articles}/>
        </div>;
    }
}
function mapDispatchToProps(dispatch) {
    return {}
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