const puppeteer = require('puppeteer');
RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });




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
            var offsetPriority = (1 - 1 / (document.body.offsetHeight / link.offsetTop)) * 4;
            return sizePriority + offsetPriority;
        }

        function isSimilarSize(parent, child) {
            var ratio = parent.getBoundingClientRect().width / child.getBoundingClientRect().width;
            return ratio < 2
        }

        function getExcerpt(link) {
            var parent = link.parentNode;
            var texts;
            while (isSimilarSize(parent, link) && parent !== document.body) {
                texts = Array.prototype.slice.call(parent.querySelectorAll('*'));
                texts = texts.filter(item => item !== link)
                    .filter(item => item.innerText.trim().length > 100)
                    .filter(item => {
                        let bounds = item.getBoundingClientRect();
                        return bounds.width / bounds.height;
                    })
                    .reduce((prev, curr) => {
                        return isDescendant(prev, curr) ? prev : curr;
                    }, null);
                if (texts) {
                    return cleanText(texts.innerText);
                }

                parent = parent.parentNode;
            }
            return null;
        }

        function getImage(link) {
            var parent = link.parentNode;
            var images;

            while (isSimilarSize(parent, link) && parent !== document.body) {
                images = Array.prototype.slice.call(parent.querySelectorAll('img'));
                if (images.length && images.length < 3) {
                    return images.reduce((acc, image) => {
                        if (image.width >= acc.width && image.height >= acc.height) {
                            Object.assign(acc, {
                                url: image.src,
                                width: image.width,
                                height: image.height
                            });
                        }
                        return acc;
                    }, {
                        url: '',
                        width: 70,
                        height: 50
                    });
                }

                parent = parent.parentNode;
            }
            return null;
        }

        var links = Array.prototype.slice.call(document.querySelectorAll('a'));

        links = links.filter(item => {
            var text = cleanText(item.innerText);
            return /\s.*\s.*\s/g.test(text);
        });

        links = links.filter(link => link.offsetTop > 0);
        links = links.map(link => {
            let fontSize = parseInt(
                window
                .getComputedStyle(link)
                .getPropertyValue('font-size')
            );
            return {
                element: link,
                headline: cleanText(link.innerText),
                offsetTop: link.offsetTop,
                url: link.href,
                size: fontSize
            };
        });

        var weights = links.reduce((acc, item) => {
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
        });
        var docHeight = document.body.offsetHeight;
        links = links.map(link => Object.assign({}, link, {
            priority: getPriority(link, docHeight, weights)
        }));

        links = links.slice()
            .sort((a, b) => b.priority - a.priority)
            .filter(link => link.priority > 5)
            .slice(0, 30);

        links = links
            .map(link => {
                link = Object.assign({}, link, {
                    image: getImage(link.element),
                    excerpt: getExcerpt(link.element)
                });
                delete link.element;
                return link;
            });


        return links;
    });




    rsmq.sendMessage({ qname: "myqueue", message: JSON.stringify(links) }, function(err, resp) {
        if (resp) {
            console.log("Message sent. ID:", resp);
        }
    });

    await browser.close();
};

exports.init = () => {
    console.log('This is article parser');
    scrape('http://www.adevarul.ro');
    // scrape('http://www.mediafax.ro');
};