import solution from './solutions';
console.log(solution);


console.log(Object.keys(solution)
    .sort()
    .reverse()
    .sort((a, b) => a.length - b.length)
);


function getOrder(arr) {
    let output = '';
    arr.reduce((prev, curr) => {
        if (prev === curr) {
            output += '=';
        } else {
            output += prev < curr ? '<' : '>';
        }

        return curr;
    });

    return output;
}


function getSimilarOrder(sampleOrder) {
    let similars = Object.keys(solution)
        .filter(key => key.length === sampleOrder.length)

    .map(key => {
            let similarity = key.split('').filter((letter, index) => letter === sampleOrder[index]).length;
            return {
                key,
                similarity
            }
        })
        .sort((a, b) => b.similarity - a.similarity)

    return similars[0].key;
}

function getRandomSolution(solutions) {
    let index = Math.floor((Math.random() * solutions.length));
    return solutions[index];
}


function getLayouts(articles) {
    let orderedArticles = articles.slice().sort((a, b) => a.priority - b.priority).reverse();
    let priorities = orderedArticles.map(article => article.priority);
    
    let sampleOrder = getOrder(priorities);

    
    if (!sampleOrder) {
        return;
    }
    if (!solution[sampleOrder]) {
        sampleOrder = getSimilarOrder(sampleOrder);
    }

    let layout = getRandomSolution(solution[sampleOrder]);

    orderedArticles = orderedArticles.map((article, index) => Object.assign({}, article, {
        layout: layout[index]
    }));
    // if (solution[sampleOrder]) {
    return orderedArticles;
    // }
}


export function findLayouts(articles, sampleSize) {
    let priorities = articles.map(article => Math.round(article.priority * 10) / 10);

    articles = articles.reduce((acc, article, index) => {
        // let item = Math.round(article.priority * 10) / 10;

        if (index % sampleSize === 0) {
            acc.push([]);
        }
        let last = acc.length - 1;
        acc[last] = acc[last] || [];
        acc[last].push(article);
        return acc;
    }, [])

    let last = articles[articles.length - 1];
    let nextToLast = articles[articles.length - 2];

    if (last.length === 1) {
        last.push(nextToLast.pop());
    }
    return articles.map(getLayouts);
}
