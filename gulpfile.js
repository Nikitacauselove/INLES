const { src, dest, parallel } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');

function cascadingStyleSheets() {
     return src([
        'node_modules/codemirror/lib/codemirror.css',
        'node_modules/codemirror/addon/scroll/simplescrollbars.css',
        'node_modules/codemirror/addon/fold/foldgutter.css',
        'node_modules/normalize.css/normalize.css',
        'node_modules/codemirror/theme/twilight.css',
        'src/index.css'
    ]).pipe(concat('main.css')).pipe(cleanCSS()).pipe(dest('output/'));
}

function hyperTextMarkupLanguage() {
    return src([
        'src/**/Lato-Black.woff2',
        'src/**/Lato-Bold.woff2',
        'src/index.html',
        'src/robots.txt'
    ]).pipe(gulpif('*.html', useref())).pipe(dest('output/'));
}

function javaScript() {
    return src([
        'node_modules/codemirror/lib/codemirror.js',
        'node_modules/codemirror/addon/fold/foldcode.js',
        'node_modules/codemirror/addon/fold/foldgutter.js',
        'node_modules/codemirror/addon/scroll/simplescrollbars.js',
        'node_modules/codemirror/mode/python/python.js',
        'src/index.js'
    ]).pipe(concat('main.js')).pipe(uglify()).pipe(dest('output/'));
}

exports.default = parallel(cascadingStyleSheets, hyperTextMarkupLanguage, javaScript);