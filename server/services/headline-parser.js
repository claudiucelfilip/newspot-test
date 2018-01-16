const puppeteer = require('puppeteer');
RedisSMQ = require("rsmq");
rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

function mapToWeight(size, weights) {
    return Math.floor(size / weights.maxSize * 10);
}
var scrape = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    let links = await page.evaluate(() => {
        var links = Array.prototype.slice.call(document.querySelectorAll('a'));
        return links
            .filter(link => {
                return link.href && (link.title || link.text).trim().length > 5;
            })
            .map(link => {
                let fontSize = parseInt(
                    window
                        .getComputedStyle(link)
                        .getPropertyValue('font-size')
                );
                return {
                    headline: link.text.trim(),
                    url: link.href,
                    size: fontSize
                };
            });
    });
    

    let weights = links.reduce((acc, item) => {
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

    links = links.map(link => Object.assign({}, link, {
        priority: mapToWeight(link.size, weights)
    }));

    links = links.slice()
        .sort((a, b) => b.priority - a.priority)
        .filter(link => link.priority > 5)
        .slice(0, 20);
    console.log(links);

    rsmq.sendMessage({qname:"myqueue", message: JSON.stringify(links)}, function (err, resp) {
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
