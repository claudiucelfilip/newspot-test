const Orders = (function() {
    var orders = [
        '>',
        '=',
        '<',
        ''
    ];

    function getOrder(arr) {
        let output = '';
        if (!arr.length) {
            return output;
        }
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

    function isValidOrder(sol, m) {
        if (!m.length) {
            return false;
        }

        if (!sol[m.length] || sol[m.length].findIndex(item => item.order === m) === -1) {
            return true;
        }
        return false;
    }

    function generateOrders(items, orders, start, m, sol, viz) {
        m = m || [];
        viz = viz || {};
        sol = sol || {};

        if (start === items) {
            m = m.filter(m => m)
                .sort()
                .reverse();
            let order = getOrder(m);

            if (isValidOrder(sol, order)) {
                sol[order.length] = sol[order.length] || [];
                sol[order.length].push({
                    order,
                    values: m
                });
            }
            return sol;
        }

        for (var val = 0; val <= items; val++) {
            if (!viz[start]) {
                m[start] = val;
                viz[start] = true;
                generateOrders(items, orders, start + 1, m.slice(), sol, viz);
                viz[start] = false;
            }
        }
        return sol;
    };

    return function(items) {
        return generateOrders(items, orders, 0);
    }
})();