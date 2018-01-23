const Packer = (function() {
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

    return function(items, width, height) {
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
})();