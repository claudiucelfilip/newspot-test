import { RECEIVE_ARTICLES, REQUEST_ARTICLES } from '../actions';

const articles = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_ARTICLES:
            return [...state, ...action.payload.articles];
        case REQUEST_ARTICLES:
            console.log('REQUESTING ARTICLES');
            return state;
        default:
            return state;
    }
};

export default articles;