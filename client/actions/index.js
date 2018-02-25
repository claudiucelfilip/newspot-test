const API = '/articles';
export const REQUEST_ARTICLES = 'REQUEST_ARTICLES';
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES';

function receiveArticles(articles) {
    return {
        type: RECEIVE_ARTICLES,
        payload: { articles }
    }
}

function requestArticles() {
    return {
        type: REQUEST_ARTICLES
    }
}

export function fetchArticles() {
    return function(dispatch) {
        dispatch(requestArticles());
        fetch(API).then(data => data.json())
            .then(articles => {
                dispatch(receiveArticles(articles));
            });
    };
}