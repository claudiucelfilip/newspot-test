const puppeteer = require('puppeteer');
const RedisSMQ = require('rsmq');
const MongoClient = require('mongodb').MongoClient;

let rsmq, db, config;

var scrape = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    let links = await page.evaluate(() => {
        function cleanText(text) {
            text = text.trim();
            text = text.replace(/\n/, ' ');
            text = text.replace(/\s+/g, ' ');
            return text;
        }

        function isDescendant(parent, child) {
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        function getPriority(link, docHeight, weights) {
            var sizePriority = link.size / weights.maxSize * 6;
            var offsetPriority =
                (1 - 1 / (document.body.offsetHeight / link.offsetTop)) * 4;
            return sizePriority + offsetPriority;
        }

        function getCorners(item) {
            var bounds = item.getBoundingClientRect();
            return {
                topLeft: {
                    x: bounds.x,
                    y: bounds.y
                },
                topRight: {
                    x: bounds.x + bounds.width,
                    y: bounds.y
                },
                bottomRight: {
                    x: bounds.x + bounds.width,
                    y: bounds.y + bounds.height
                },
                bottomLeft: {
                    x: bounds.x,
                    y: bounds.y + bounds.height
                }
            };
        }

        function getDistance(p1, p2) {
            return Math.sqrt(
                Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
            );
        }

        function getProximity(target, item) {
            var targetCorners = getCorners(target);
            var itemCorners = getCorners(item);
            var distances = {
                topLeft: getDistance(
                    targetCorners.topLeft,
                    itemCorners.bottomRight
                ),
                top: getDistance(
                    targetCorners.topLeft,
                    itemCorners.bottomLeft
                ),
                topRight: getDistance(
                    targetCorners.topRight,
                    itemCorners.bottomLeft
                ),
                right: getDistance(
                    targetCorners.topRight,
                    itemCorners.topLeft
                ),
                bottomRight: getDistance(
                    targetCorners.bottomRight,
                    itemCorners.topLeft
                ),
                bottom: getDistance(
                    targetCorners.bottomLeft,
                    itemCorners.bottomLeft
                ),
                bottomLeft: getDistance(
                    targetCorners.bottomLeft,
                    itemCorners.topRight
                ),
                left: getDistance(
                    targetCorners.topLeft,
                    itemCorners.topRight
                )
            };

            return Math.min.apply(Math, Object.keys(distances).map(key => distances[key]));
        }

        function getNodeText(node) {
            return node.innerText;
        }

        function getExcerpt(link) {
            var parent = link.parentNode;
            var texts;
            var parentCount = 1;
            var fontSize = parseInt(
                getComputedStyle(link).getPropertyValue('font-size')
            );
            var acceptedTags = [
                'DIV',
                'EM',
                'SPAN',
                'P',
                'ARTICLE',
                'ASIDE',
                'STRONG'
            ];
            while (parent !== document.body) {
                texts = Array.prototype.slice
                    .call(parent.querySelectorAll('*'))
                    .filter(text => acceptedTags.indexOf(text.tagName) !== -1)
                    .filter(text => text.contains(link) === false)
                    .filter(item => getNodeText(item).length > 50);

                if (texts.length) {
                    if (parentCount > 4 || getProximity(texts[0], link) > 30) {
                        return;
                    }
                    texts = texts
                        .filter(item => item !== link)
                        .filter(item => !item.classList.contains('already-used'))
                        .filter(item => {
                            let bounds = item.getBoundingClientRect();
                            return bounds.width / bounds.height;
                        })
                        .reduce((prev, curr) => {
                            return isDescendant(prev, curr) ? prev : curr;
                        }, null);
                    if (texts) {
                        texts.classList.add('already-used');
                        return cleanText(texts.innerText);
                    }
                }
                parent = parent.parentNode;
                parentCount++;
            }
            return null;
        }

        function getImage(link) {
            var parent = link.parentNode;
            var images, divImages;
            var parentCount = 1;
            var fontSize = parseInt(
                getComputedStyle(link).getPropertyValue('font-size')
            );

            while (parent !== document.body) {
                images = Array.prototype.slice.call(
                    parent.querySelectorAll('img')
                );

                if (!images.length) {
                    images = Array.prototype.slice.call(
                        parent.querySelectorAll('*')
                    );
                    images = images.filter(image => {
                        return image.style.backgroundImage !== '' && image.offsetWidth >= 70 && image.offsetHeight >= 50;
                    });                 
                }

                if (images.length) {
                    if (parentCount > 3 && getProximity(images[0], link) > 30) {
                        return;
                    }
                    let result = images
                        .filter(image => !image.classList.contains('already-used'))
                        .reduce(
                            (acc, image) => {
                                var imageUrl = image.src;

                                if (!imageUrl || /(loader)|(loading)|(empty)|(\.gif)/.test(imageUrl)) {
                                    imageUrl = image.getAttribute('data-src') || image.getAttribute('data-original') || getComputedStyle(image).getPropertyValue('background-image').replace(/(\)(?=$))|"|'|(url\()/g, '') || imageUrl;
                                }
                              
                                imageUrl = imageUrl.replace(/^\/(?!=\/)/, location.href);
                              
                                if (
                                    image.offsetWidth >= acc.width &&
                                    image.offsetHeight >= acc.height
                                ) {
                                    Object.assign(acc, {
                                        url: imageUrl,
                                        image,
                                        width: image.offsetWidth,
                                        height: image.offsetHeight
                                    });
                                }
                                return acc;
                            }, {
                                url: '',
                                image: null,
                                width: 70,
                                height: 50
                            }
                        );

                    if (result.image) {
                        result.image.classList.add('already-used');
                        return result;
                    }
                }
                parent = parent.parentNode;
                parentCount++;
            }
            return null;
        }

        var links;

        links = Array.prototype.slice.call(document.querySelectorAll('a'));

        links = links.filter(item => {
            var text = cleanText(item.innerText);
            return /.+\s.+\s.+/g.test(text);
        });

        links = links.filter(link => link.offsetTop > 0);
        links = links.map(link => {
            let size = parseInt(
                window.getComputedStyle(link).getPropertyValue('font-size')
            );
            return {
                element: link,
                headline: cleanText(link.innerText),
                offsetTop: link.getBoundingClientRect().y,
                url: link.href,
                size
            };
        });

        var weights = links.reduce(
            (acc, item) => {
                acc.weights[item.size] = acc.weights[item.size] || 0;
                acc.weights[item.size]++;
                acc.maxSize = Math.max(acc.maxSize, item.size);
                acc.minSize = Math.min(acc.minSize, item.size);
                acc.total++;
                return acc;
            }, {
                total: 0,
                maxSize: 0,
                minSize: 10000,
                weights: {}
            }
        );
        var docHeight = document.body.offsetHeight;
        links = links.map(link =>
            Object.assign({}, link, {
                priority: getPriority(link, docHeight, weights)
            })
        );

        links = links
            .slice()
            .sort((a, b) => b.priority - a.priority)
            // .filter(link => link.priority > 5)
            .slice(0, 30);

        links = links.map(link => {
            let image = getImage(link.element); 
            let excerpt = getExcerpt(link.element);

            if (!image) {
                link.priority--;
            }

            link = Object.assign({}, link, {
                image,
                excerpt
            });
            delete link.element;
            return link;
        });

        return links;
    });

    await browser.close();
    return links;
};

function checkQueue() {
    return new Promise((resolve, reject) => {
        rsmq.receiveMessage({ qname: config.queues.headlineParser.name }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });
}

function removeMessage(messageId) {
    return new Promise((resolve, reject) => {
        rsmq.deleteMessage({ qname: config.queues.headlineParser.name, id: messageId }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });

}

function onlyChanged(items) {
    return (article) => {
        let item = items.find(item => item.url === article.url) || {};
        return item.headline && item.headline !== article.headline;
    }
}

function checkDuplicates({ articles, source }) {
    const col = db.collection('articles');

    let urls = articles.map(article => article.url);
    return new Promise((resolve, reject) => {
        col.find({ url: { $in: urls } }).toArray((err, items) => {
            if (err) {
                return reject(err);
            }
            if (!items.length) {
                return resolve({ articles, source });
            }
            resolve({ articles: articles.filter(onlyChanged(items)), source });
        });
    });

}

function getHeadlines() {
    return checkQueue()
        .then(resp => {
            console.log('Headline check for message:', resp);
            if (resp.message) {
                let data = JSON.parse(resp.message);
                let source = data.source;

                return scrape(source.url)
                    .then((articles) => {
                        removeMessage(resp.id);
                        return { articles, source };
                    }, err => {
                        console.error(err);
                    })
                    .then(checkDuplicates);
            }
            return Promise.reject('No message');
        }, err => {
            console.log('Headlne check queue error:', err.message);
        });

}

function notifyArticleParsers({ articles, source }) {
    if (!articles.length) {
        return Promise.reject('No new headlines');
    }
    const revision = (new Date()).getTime();

    articles.forEach(article => {
        let message = JSON.stringify({
            revision,
            article,
            source
        });
        rsmq.sendMessage({ qname: config.queues.articleParser.name, message }, function(err, resp) {
            if (err) {
                console.log('Error', err)
                return;
            }
            console.log("Message sent:", article.url);
        });
    });

    return { revision, articles, source };
}

function start() {
    return getHeadlines()
        .then(notifyArticleParsers)
        .catch(console.error)
        .then(() => {
            setTimeout(start, 5000);
        });
}

exports.init = (initConfig) => {
    config = initConfig;
    rsmq = new RedisSMQ(config.redis);
    MongoClient.connect(config.mongo.host, function(err, client) {
        console.log("Connected successfully to server");
        db = client.db(config.mongo.database);

        start();
    });
};