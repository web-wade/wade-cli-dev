'use strict';

const path = require('path');

module.exports = formatPath;

function formatPath(p) {
    if (p && typeof p === 'string') {
        // mac   /
        // window \
        if (path.sep === '/') {
            return p;
        } else {
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}
