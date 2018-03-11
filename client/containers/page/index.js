import React, { Component } from 'react';
import Column from '../../components/Column';
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
        
        let backgrounds1 = [
            'rgba(188, 52, 40, 1.000)',
            'rgba(199, 55, 42, 1.000)',
            'rgba(177, 49, 37, 1.000)',
            'rgba(188, 52, 40, 1.000)'
        ];

        let backgrounds2 = [
            'rgba(66, 12, 63, 1.000)',
            'rgba(67, 10, 47, 1.000)',
            'rgba(63, 14, 57, 1.000)',
            'rgba(69, 13, 65, 1.000)'
        ];

        let backgrounds3 = [
            'rgba(5, 110, 158, 1.000)',
            'rgba(6, 118, 138, 1.000)',
            'rgba(2, 108, 156, 1.000)',
            'rgba(1, 123, 148, 1.000)'
        ];

        let backgrounds4 = [
            'rgba(8, 123, 82, 1.000)',
            'rgba(4, 113, 73, 1.000)',
            'rgba(6, 143, 57, 1.000)',
            'rgba(12, 133, 77, 1.000)'
        ];
        return <div className="scroll-container">

            <Column 
                articles={articles}
                title={'Adevarul'}
                backgrounds={backgrounds1}
                blockHeight={868}
            />

            <Column 
                articles={articles}  
                title={'Mediafax'}
                backgrounds={backgrounds2}               
                blockHeight={868}
                cols={1}
            />

            <Column 
                articles={articles}     
                title={'Agerpress'}
                backgrounds={backgrounds3}            
                blockHeight={868}
                cols={1}
            />

            <Column 
                articles={articles}
                title={'New York Times'}  
                backgrounds={backgrounds4}           
                blockHeight={868}
                cols={1}
            />
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