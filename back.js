Demo = {
    sort: {

        random: function(a, b) { return Math.random() - 0.5; },
        w: function(a, b) { return b.width - a.width; },
        h: function(a, b) { return b.height - a.height; },
        a: function(a, b) { return b.area - a.area; },
        max: function(a, b) { return Math.max(b.width, b.height) - Math.max(a.width, a.height); },
        min: function(a, b) { return Math.min(b.width, b.height) - Math.min(a.width, a.height); },

        height: function(a, b) { return Demo.sort.msort(a, b, ['h', 'w']); },
        width: function(a, b) { return Demo.sort.msort(a, b, ['w', 'h']); },
        area: function(a, b) { return Demo.sort.msort(a, b, ['a', 'h', 'w']); },
        maxside: function(a, b) { return Demo.sort.msort(a, b, ['max', 'min', 'h', 'w']); },

        msort: function(a, b, criteria) { /* sort by multiple criteria */
            var diff, n;
            for (n = 0; n < criteria.length; n++) {
                diff = Demo.sort[criteria[n]](a, b);
                if (diff != 0)
                    return diff;
            }
            return 0;
        }
    }
};

function pack(items, width, height) {
    var root = {
        x: 0,
        y: 0,
        width,
        height
    };

    return items
        .map(item => Object.assign({}, item))
        .map(item => {
            let node;
            if (node = find(root, item.width, item.height)) {
                item.node = split(node, item.width, item.height);
            }
            return item;
        });
}

function find(target, width, height) {
    if (target.used) {
        return find(target.right, width, height) || find(target.bottom, width, height);
    }
    if (width <= target.width && height <= target.height) {
        return target;
    }
    return null;
}

function split(target, width, height) {
    target.used = true;
    target.right = {
        x: target.x + width,
        y: target.y,
        width: target.width - width,
        height: target.height
    };
    target.bottom = {
        x: target.x,
        y: target.y + height,
        width: target.width,
        height: target.height - height
    };

    return target;
}


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

var priorities = [8.96, 8.77, 8.91, 8.61, 8.71];


var order = getOrder(priorities);
console.log(order);
// var viz = {};

// function isValid(m, max) {
//     return m.reduce((acc, item) => acc + item, 0) === max;
// }

// var lengths = []

// function back(items, max, start, m, sol) {
//     m = m || [];
//     sol = sol || [];
//     start = typeof start === 'undefined' ? 0 : start;


//     if (start === items) {

//         if (isValid(m, max)) {

//             let solution = m.filter(item => item).join('');
//             // console.log(m);
//             if (sol.indexOf(solution) === -1) {
//                 sol.push(solution);
//             }
//         }
//         return;
//     }

//     for (var val = 0; val < max / 3, val * 3 < 10; val++) {
//         if (!viz[start]) {
//             m[start] = val * 3;
//             viz[start] = true;
//             back(items, max, start + 1, m, sol);
//             viz[start] = false;
//         }
//     }

//     return sol;
// }

// function getNumbers(sol) {
//     return sol.map(item => {
//         return item.split('').map(val => parseInt(val))
//     });
// }
// let widths = getNumbers(back(5, 12));
// let heights = getNumbers(back(3, 9));


// console.log(widths);
// console.log(heights);
// // console.log(widths);
// // console.log('');
// // console.log(heights);

// var comb = [];
// widths.forEach(items => {
//     // var buff = [];
//     items.forEach(width => {
//         heights.forEach(items => {
//             items.forEach(height => {
//                 let val = '' + width + height;
//                 if (comb.indexOf(val) === -1) {
//                     comb.push(val);
//                 }

//             });
//         });
//     });
//     // comb.push(buff);
// });

// let w2 = widths.map(width => {
//     return width.join('');
// });

// let pattern = new RegExp(w2.join('|'), 'g');


var viz = {};

function isValid2(sol, m) {
    // if (sol.findIndex(item => item.width === m.width && item.height === m.height) !== -1) {
    //     return false;
    // }


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

    if (isStripe) {
        return false;
    }

    return true;

}


function back2(items, comb, start, m, sol) {
    m = m || [];
    start = typeof start === 'undefined' ? 0 : start;
    sol = sol || [];

    if (start === items) {
        if (isValid2(sol, m)) {
            sol.push(m);
        }
        return sol;
    }

    for (var val = 0; val < comb.length; val++) {
        if (!viz[start]) {
            m[start] = Object.assign({}, comb[val]);
            viz[start] = true;
            back2(items, comb, start + 1, m.slice(), sol);
            viz[start] = false;
        }
    }
    return sol;
}

let versions = back2(priorities.length, comb);
let allVersions = versions.slice();

versions = versions.map(version => version.sort(Demo.sort.maxside));

console.log(versions);
var lastFiltered = [{
        width: 12,
        height: 3
    },
    {
        width: 12,
        height: 3
    },
    {
        width: 6,
        height: 6
    }
]
versions = versions
    .map(version => {
        // packer.init(12, 9);
        // packer.fit(version);
        // return version;

        return pack(version, 12, 9);
    })
    .filter(version => {
        let nodes = version.filter(item => item.node).length;
        return nodes === version.length;
    });
console.log(versions);
var last = versions[versions.length - 1];
console.log(last);


let fragment = document.createElement('div');

versions.slice(0, 1).forEach(version => {
    let container = document.createElement('div');
    container.className = 'container';
    container.style.width = 120 + 'px';
    container.style.height = 90 + 'px';

    version.filter(item => item.node)
        .forEach(item => {
            let div = document.createElement('div');
            div.className = 'item';
            div.style.left = item.node.x * 10 + 'px';
            div.style.top = item.node.y * 10 + 'px';
            div.style.width = item.width * 10 + 'px';
            div.style.height = item.height * 10 + 'px';

            container.appendChild(div);
        });
    fragment.appendChild(container);
});

document.body.appendChild(fragment);


// let v2 = versions.map(version => {
//     return version.map(item => item[0]).join('');
// });
// console.log(w2.join('|'));
// console.log(comb.slice(0, 100));
// console.log(w2.slice(0, 100));

// var valid = isValid([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1])