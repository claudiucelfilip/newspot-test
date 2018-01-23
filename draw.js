function drawAll(articles, order) {
    let fragment = document.createElement('div');
    fragment.innerHTML = `<h2>${order}</h2>`;

    articles.forEach(article => {
        let container = draw(article);
        container.setAttribute('data-value', JSON.stringify({
            order,
            article
        }));
        fragment.appendChild(container);
    });

    document.body.appendChild(fragment);
}

function drawOne(article, text) {
    // let fragment = document.createElement('div');
    // fragment.innerHTML = `<h3>${text}</h3>`;
    let container = draw(article);
    // fragment.appendChild(container);
    document.getElementById('main').appendChild(container);
}


function draw(article) {
    let container = document.createElement('div');
    container.className = 'container';
    container.style.width = 120 + 'px';
    container.style.height = 90 + 'px';

    article
        .forEach(item => {
            let div = document.createElement('div');
            div.className = 'item';
            div.style.left = item.x * 10 + 'px';
            div.style.top = item.y * 10 + 'px';
            div.style.width = item.width * 10 + 'px';
            div.style.height = item.height * 10 + 'px';

            container.appendChild(div);
        });

    return container;
}