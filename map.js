console.log(solution);

console.log(Object.keys(solution)
    .sort()
    .reverse()
    .sort((a, b) => a.length - b.length)
);

priorities = priorities.map(item => Math.round(item * 10) / 10);
console.log(priorities);

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


function getSimilarOrder(sampleOrder) {
    let similars = Object.keys(solution)
        .filter(key => key.length === sampleOrder.length)

    .map(key => {
            let similarity = key.split('').filter((letter, index) => letter === sampleOrder[index]).length;
            return {
                key,
                similarity
            }
        })
        .sort((a, b) => b.similarity - a.similarity)

    return similars[0].key;
}

function getRandomSolution(solutions) {
    let index = Math.floor((Math.random() * solutions.length));
    return solutions[index];
}

function getLayouts(sample) {
    let orderedSample = sample.slice().sort().reverse();
    let sampleOrder = getOrder(orderedSample);

    if (!sampleOrder) {
        return;
    }
    if (!solution[sampleOrder]) {
        sampleOrder = getSimilarOrder(sampleOrder);
    }
    // if (solution[sampleOrder]) {
    return {
        order: sampleOrder,
        sample,
        solution: getRandomSolution(solution[sampleOrder])
    }
    // }
}


function findLayouts(priorities, sampleSize) {
    priorities = priorities.reduce((acc, item, index) => {
        if (index % sampleSize === 0) {
            acc.push([]);
        }
        let last = acc.length - 1;
        acc[last] = acc[last] || [];
        acc[last].push(item);
        return acc;
    }, [])


    let last = priorities[priorities.length - 1];
    let nextToLast = priorities[priorities.length - 2];

    if (last.length === 1) {
        last.push(nextToLast.pop());
    }
    return priorities.map(getLayouts);
}

let samples = findLayouts(priorities, 5);
console.log(samples);
samples.forEach(item => {
    drawOne(item.solution, item.sample.join(' - '));
});