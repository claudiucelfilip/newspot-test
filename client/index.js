import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/page';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import articlesApp from './reducers';

let store = createStore(articlesApp);
ReactDOM.render(
    <Provider store={store}>
        <Page />
    </Provider>,
    document.getElementById('main')
);
