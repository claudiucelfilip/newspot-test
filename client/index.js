import React from 'react';
import ReactDOM from 'react-dom';
import Page from './containers/page';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import articlesApp from './reducers';
import thunkMiddleware from 'redux-thunk';
import { fetchArticles } from './actions';

let store = createStore(articlesApp, 
    applyMiddleware(thunkMiddleware)
);
// store.dispatch(fetchArticles());

window.store = store;

ReactDOM.render(
    <Provider store={store}>
        <Page />
    </Provider>,
    document.getElementById('main')
);
