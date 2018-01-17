const puppeteer = require('puppeteer');
RedisSMQ = require('rsmq');
rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq' });

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
            var fontSize = parseInt(
                getComputedStyle(link).getPropertyValue('font-size')
            );
            var acceptedTags = [
                'DIV',
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
                    if (getProximity(texts[0], link) > fontSize * 2) {
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
            }
            return null;
        }

        function getImage(link) {
            var parent = link.parentNode;
            var images;
            var fontSize = parseInt(
                getComputedStyle(link).getPropertyValue('font-size')
            );

            while (parent !== document.body) {
                images = Array.prototype.slice.call(
                    parent.querySelectorAll('img')
                );
                if (images.length) {
                    if (getProximity(images[0], link) > fontSize * 2) {
                        return;
                    }
                    let result = images
                        .filter(image => !image.classList.contains('already-used'))
                        .reduce(
                        (acc, image) => {
                            if (
                                image.width >= acc.width &&
                                image.height >= acc.height
                            ) {
                                Object.assign(acc, {
                                    url: image.src,
                                    image,
                                    width: image.width,
                                    height: image.height
                                });
                            }
                            return acc;
                        },
                        {
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
            }
            return null;
        }

        var links;
        setTimeout(() => {

        })
        links = Array.prototype.slice.call(document.querySelectorAll('a'));

        links = links.filter(item => {
            var text = cleanText(item.innerText);
            return /\s.*\s.*\s/g.test(text);
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
            },
            {
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
            .filter(link => link.priority > 5)
            .slice(0, 30);

        links = links.map(link => {
            link = Object.assign({}, link, {
                image: getImage(link.element),
                excerpt: getExcerpt(link.element)
            });
            // delete link.element;
            return link;
        });

        return links;
    });

    rsmq.sendMessage(
        { qname: 'myqueue', message: JSON.stringify(links) },
        function(err, resp) {
            if (resp) {
                console.log('Message sent. ID:', resp);
            }
        }
    );

    await browser.close();
};

exports.init = () => {
    console.log('This is article parser');
    scrape('http://www.adevarul.ro');
    // scrape('http://www.mediafax.ro');
};
