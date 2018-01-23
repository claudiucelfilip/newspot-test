var solution = {
    "=": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 9, "x": 6, "y": 0 }]
    ],
    ">": [
        [{ "width": 9, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }],
        [{ "width": 12, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }]
    ],
    "==": [
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 6, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 0, "y": 3 }, { "width": 6, "height": 6, "x": 6, "y": 3 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 3 }, { "width": 12, "height": 3, "x": 0, "y": 6 }]
    ],
    ">=": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 12, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 6 }]
    ],
    ">>": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 6, "x": 9, "y": 0 }],
        [{ "width": 9, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 12, "height": 6, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    "===": [
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 3, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 3 }, { "width": 9, "height": 3, "x": 3, "y": 6 }]
    ],
    ">==": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }],
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 9, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    "=>=": [
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 6, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 3 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 6 }]
    ],
    ">>=": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }],
        [{ "width": 12, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    "=>>": [
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 3 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    ">>>": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    ">===": [
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 6, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 6, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 3, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 3, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 3, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }, { "width": 6, "height": 3, "x": 3, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 12, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 3, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 6, "height": 3, "x": 0, "y": 6 }]
    ],
    "=>==": [
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 3, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 3, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 3, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 0 }, { "width": 3, "height": 6, "x": 3, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 0 }, { "width": 3, "height": 6, "x": 3, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 0 }, { "width": 6, "height": 3, "x": 3, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }, { "width": 6, "height": 3, "x": 3, "y": 6 }],
        [{ "width": 9, "height": 3, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 3, "height": 6, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 3, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }],
        [{ "width": 9, "height": 3, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 3, "height": 6, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 3, "y": 3 }, { "width": 6, "height": 3, "x": 3, "y": 6 }],
        [{ "width": 9, "height": 3, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }],
        [{ "width": 9, "height": 3, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 6 }]
    ],
    ">>==": [
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 3, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    ">=>=": [
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 9, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 3, "y": 6 }],
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }],
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 6, "height": 9, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 3, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 9, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 3 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    "=>>=": [
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 6, "y": 0 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 3, "y": 6 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 3 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 0 }, { "width": 3, "height": 3, "x": 6, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 3 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 6, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 3 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 6, "height": 6, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 6, "y": 3 }, { "width": 3, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 12, "height": 3, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ],
    ">>=>": [
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 6, "height": 6, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 6, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 3 }, { "width": 3, "height": 6, "x": 9, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 3, "x": 6, "y": 6 }],
        [{ "width": 12, "height": 3, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 3 }, { "width": 6, "height": 3, "x": 0, "y": 6 }, { "width": 6, "height": 3, "x": 6, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 3 }]
    ],
    "==>>": [
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 3, "height": 9, "x": 3, "y": 0 }, { "width": 3, "height": 9, "x": 6, "y": 0 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 3, "height": 9, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 0 }, { "width": 9, "height": 3, "x": 3, "y": 3 }, { "width": 6, "height": 3, "x": 3, "y": 6 }, { "width": 3, "height": 3, "x": 9, "y": 6 }],
        [{ "width": 9, "height": 3, "x": 0, "y": 0 }, { "width": 9, "height": 3, "x": 0, "y": 3 }, { "width": 9, "height": 3, "x": 0, "y": 6 }, { "width": 3, "height": 6, "x": 9, "y": 0 }, { "width": 3, "height": 3, "x": 9, "y": 6 }]
    ]
};

var priorities = [
    8.967941,
    8.771409,
    8.914031,
    8.612410,
    8.712766,
    9.230880,
    9.436723,
    9.088981,
    9.754888,
    9.341406,
    9.611702,
    9.470673,
    9.529615,
    9.540972,
    9.418200,
    9.343301,
    9.353194,
    9.397211,
    9.099339,
    8.907131,
    9.152818,
    9.287090,
    8.857389,
    9.039390,
    9.174813,
    8.650230,
    8.831369,
    8.696078,
    8.789390,
    9.614290,
    9.228723,
    9.030477,
    8.966072,
    9.285676,
    8.442806,
    9.602627,
    8.226301,
    8.590192,
    7.828825,
    7.892771,
    6.267894,
    8.714324,
    7.826245,
    7.500781,
    8.043818,
    7.628788,
    7.380524,
    7.146260,
    7.772514,
    7.260268,
    7.107283,
    6.931164,
    7.304413,
    6.963777,
    6.890684,
    6.964324,
    9.871454,
    8.935996,
    8.172906,
    7.793512,
    7.362765,
    6.966787,
    9.021466,
    8.247488,
    8.411648,
    7.413848,
    9.682702,
    8.007251,
    8.007251,
    6.675504,
    8.221364,
    6.973579,
    7.223045,
    6.198602,
    7.326080,
    9.393947,
    6.331610,
    6.198602,
    6.487840,
    7.830332,
    6.198602,
    6.420805,
    6.198602,
    6.198602,
    6.778498,
    6.198602,
    6.198602,
    6.198602,
    6.198602,
    6.198602,
    6.198602
]