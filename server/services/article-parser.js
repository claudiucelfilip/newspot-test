const puppeteer = require('puppeteer');
const RedisSMQ = require('rsmq');
const MongoClient = require('mongodb').MongoClient;

let rsmq, db, config;

var scrape = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    let article = await page.evaluate(() => {

        var headings = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG']
        var acceptedTags = [
            'DIV',
            'EM',
            'SPAN',
            ...headings,
            'SECTION',
            'P',
            'ARTICLE',
            'ASIDE'
        ];

        var title = Array.prototype.slice.call(document.body.querySelectorAll('*'))
            .filter(text => acceptedTags.indexOf(text.tagName) !== -1)
            .filter(item => (item.innerText || '').trim().length > 30)
            .filter(isVisible)
            .sort((a, b) => {
                let sizeA = getComputedStyle(a).getPropertyValue('font-size');
                let sizeB = getComputedStyle(b).getPropertyValue('font-size');
                return parseInt(sizeB) - parseInt(sizeA);
            })[0];

        function isVisible(node) {
            if (node === document.body) {
                return true;
            }
            let style = getComputedStyle(node);
            if (
                style['display'] === 'none' || style['visibility'] === 'hidden' || style['opacity'] === 0
            ) {
                return false;
            }
            return isVisible(node.parentNode);
        }

        function hasProperSize(node, title) {
            var style = getComputedStyle(node);
            let width = parseInt(style['width']);
            let height = parseInt(style['height']);

            if (height / width >= 3 || node.innerText.length / title.innerText.length > 3) {
                return true;
            }
            return false;
        }

        function getText(title) {
            var parent = title.parentNode;

            while (parent !== document.body) {

                if (hasProperSize(parent, title)) {
                    let texts = getTextChildren(parent, title);
                    if (texts.length > 1) {
                        return texts;
                    }
                }
                parent = parent.parentNode;
            }
            return [];
        }

        function sanitizeText(text) {
            return text.replace(/\s+|\n/g, ' ').trim();
        }

        function removeTags(text) {
            return text.replace(/(<.*?>)/g, '');
        }

        function getOwnText(node) {
            let text = Array.prototype.slice.call(node.childNodes)
                .filter(child => child.nodeType === 3)
                .filter(child => sanitizeText(child.textContent).length > 5)
                .reduce((acc, item) => acc += item.textContent, '');

            return sanitizeText(text);
        }

        function getAvgHeadlineSize(children) {
            let avgFontsize = children
                .filter(child => headings.indexOf(child.nodeName) !== -1)
                .reduce((acc, child) => {
                    let style = getComputedStyle(child);
                    let fontSize = parseInt(style['font-size']);
                    acc[fontSize] = acc[fontSize] || 0;
                    acc[fontSize]++;
                    return acc;
                }, {})
            avgFontsize = Object.keys(avgFontsize)
                .sort((a, b) => avgFontsize[b] - avgFontsize[a]);
            return parseInt(avgFontsize[0] || 0);
        }

        function getAvgTextSize(children) {
            let avgFontsize = children
                .filter(child => headings.indexOf(child.nodeName) === -1)
                .reduce((acc, child) => {
                    let style = getComputedStyle(child);
                    let fontSize = parseInt(style['font-size']);
                    acc[fontSize] = acc[fontSize] || 0;
                    acc[fontSize]++;
                    return acc;
                }, {})
            avgFontsize = Object.keys(avgFontsize)
                .sort((a, b) => avgFontsize[b] - avgFontsize[a]);
            return parseInt(avgFontsize[0] || 0);
        }

        function hasProperLength(child) {
            let text = getOwnText(child);
            if (headings.indexOf(child.nodeName) !== -1) {
                return text.length > 10;
            }
            return text.length > 50;
        }

        function getTextChildren(node, title) {
            let selector = acceptedTags.map(item => item.toLowerCase()).join(', ');
            let children = Array.prototype.slice.call(node.querySelectorAll(selector));
            children = children
                .filter(isVisible)
                .filter(child => !child.closest('a'))
                .filter(child => child && child !== title && !isDescendant(child, title))
                .filter(hasProperLength)


            let avgTextSize = getAvgTextSize(children);
            let avgHeadlineSize = Math.max(getAvgHeadlineSize(children), avgTextSize);
            return children
                .filter(child => {
                    let style = getComputedStyle(child);
                    let fontSize = parseInt(style['font-size']);
                    if (headings.indexOf(child.nodeName) !== -1) {
                        return fontSize === avgHeadlineSize && fontSize >= avgTextSize;
                    }
                    return fontSize >= avgTextSize && fontSize <= avgHeadlineSize;
                })
                .map(child => {
                    let text, type;

                    type = child.nodeName;
                    let children = Array.prototype.slice.call(child.children);
                    if (child.children.length) {
                        text = child.textContent;
                        children.forEach(node => node.innerHTML = '');
                    } else {
                        text = getOwnText(child);
                    }
                    return {
                        text: sanitizeText(removeTags(text)),
                        type
                    };
                })
                .filter(item => item.text.length)
                .map(child => {
                    let wrapper;
                    if (headings.indexOf(child.type) !== -1) {
                        wrapper = document.createElement('h3');
                    } else {
                        wrapper = document.createElement('p');
                    }
                    wrapper.innerText = child.text;
                    return wrapper;
                });
        }

        function isDescendant(parent, child) {
            if (!parent) {
                return false;
            }
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
        var content = getText(title);

        return content.map(child => child.outerHTML);
    });

    await browser.close();
    return article;
};



function checkQueue() {
    return new Promise((resolve, reject) => {
        rsmq.receiveMessage({ qname: config.queues.articleParser.name }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });
}

function removeMessage(messageId) {
    return new Promise((resolve, reject) => {
        rsmq.deleteMessage({ qname: config.queues.articleParser.name, id: messageId }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });

}

function getArticle() {
    return checkQueue()
        .then(resp => {
            if (resp.message) {
                let data = JSON.parse(resp.message);
                console.log('..............................................................');
                console.log('Parsing:', data.article.url);
                return scrape(data.article.url)
                    .then(content => {
                        removeMessage(resp.id);
                        return Object.assign({}, data.article, {
                            content,
                            revision: data.revision,
                            source: data.source._id
                        });
                    });
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject('No new message');
                }, 3000);
            });
        }, err => {
            console.log('Article check queue error:', err.message);
        });

}

function storeArticles(article) {
    const col = db.collection('articles');


    return new Promise((resolve, reject) => {
        col.update({ url: article.url }, article, { upsert: true }, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });

}

function notifyClient(results) {
    let articleCount = results.reduce((acc, item) => {
        if (item.result.nModified) {
            acc.updated++;
        } else {
            acc.created++;
        }
        return acc;
    }, {
        updated: 0,
        created: 0
    })

    let message = JSON.stringify({
        type: 'new-articles',
        count: articleCount
    });
    rsmq.sendMessage({ qname: config.queues.client.name, message }, function(err, resp) {
        if (err) {
            console.log('Error', err)
            return;
        }
        console.log("Message sent. ID:", resp);
    });
}

function start() {
    return getArticle()
        .then(storeArticles)
        // .then(notifyClient)
        .catch(err => {
            console.log(err);
        })
        .then(start);
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