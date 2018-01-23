const Combinations = (function() {
    let order, sizes = generateAvailableSizes();

    function generateAvailableSizes() {
        var widths = [
            3, 6, 9, 12
        ];

        var heights = [
            3, 6, 9
        ];

        var comb = [];

        for (var i = 0; i < widths.length; i++) {
            for (var j = 0; j < heights.length; j++) {
                comb.push({
                    width: widths[i],
                    height: heights[j]
                });
            }
        }

        return comb;
    }

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

    function isValidCombination(sol, m) {
        let areas = m.map((item) => {
            return item.width * item.height;
        });

        if (order !== getOrder(areas)) {
            return false;
        }

        let totalArea = areas.reduce((acc, item) => acc + item, 0);
        if (totalArea !== 12 * 9) {
            return false;
        }

        let isStripe = m.reduce((acc, item) => {
            if (acc === true) {
                return acc;
            }
            return item.width / item.height < 0.34;
        }, false);

        if (isStripe && m.length > 3) {
            return false;
        }

        return true;

    }


    function generateCombinations(items, comb, start, m, sol, viz) {
        m = m || [];
        viz = viz || {};
        sol = sol || [];

        if (start === items) {
            if (isValidCombination(sol, m)) {
                sol.push(m);
            }
            return sol;
        }

        for (var val = 0; val < comb.length; val++) {
            if (!viz[start]) {
                m[start] = Object.assign({}, comb[val]);
                viz[start] = true;
                generateCombinations(items, comb, start + 1, m.slice(), sol, viz);
                viz[start] = false;
            }
        }
        return sol;
    }

    return function(orders) {
        order = orders;

        return generateCombinations(orders.length + 1, sizes, 0);
    }

})();