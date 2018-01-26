import { combineReducers } from 'redux';
import articles from './articles';

const articlesApp = combineReducers({
    articles
});

export default articlesApp;
