function generateLayout(priorities) {
    let versions = Combinations(priorities);
    versions = versions.map(version => version.sort(Demo.sort.maxside));

    return versions
        .map(version => {
            return Packer(version, 12, 9);
        })
        .filter(version => {
            let nodes = version.filter(item => item.node).length;
            return nodes === version.length;
        });
}

let orders = Orders(5);
// console.log(orders);
Object.keys(orders).forEach(key => {
    orders[key].forEach(order => {
        let combinations = Combinations(order.order);
        combinations = combinations.map(combination => Packer(combination, 12, 9))
            .filter(combination => {
                return combination.filter(item => item.node).length === combination.length;
            })
            .map(version => {
                return version.map(item => {
                    return {
                        width: item.width,
                        height: item.height,
                        x: item.node.x,
                        y: item.node.y
                    }
                });
            });

        console.log(order.order, combinations);
        drawAll(combinations, order.order);
    });
});


let solutions = []
document.body.addEventListener('click', (event) => {
    let container = event.target.closest('.container');
    if (container) {
        let value = container.getAttribute('data-value');
        container.classList.toggle('active');

        let index = solutions.indexOf(value);
        if (container.classList.contains('active')) {
            if (index === -1) {
                solutions.push(value);
            }
        } else {
            if (index !== -1) {
                solutions.splice(index, 1);
            }
        }
        let result = solutions.map(JSON.parse)
            .reduce((acc, item) => {
                acc[item.order] = acc[item.order] || [];
                acc[item.order].push(item.article);
                return acc;
            }, {});
        console.log(result);
    }
});