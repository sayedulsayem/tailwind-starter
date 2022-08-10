const { watch, series, src, dest } = require("gulp");
const sass = require("gulp-sass")((require('sass')));
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const csscomb = require("gulp-csscomb");
const autoPrefixer = require("gulp-autoprefixer");
const plumberNotifier = require("gulp-plumber-notifier");

const imagemin = require('gulp-imagemin');

const AUTOPREFIXER_BROWSERS = [
	"last 2 version",
	"> 1%",
	"ie >= 9",
	"ie_mob >= 10",
	"ff >= 30",
	"chrome >= 34",
	"safari >= 7",
	"opera >= 23",
	"ios >= 7",
	"android >= 4",
	"bb >= 10",
];

const sassFiles = "assets/dev/scss/*.scss";
const jsFiles = "assets/dev/js/*.js";

function makeCSS(cb) {
	return src(sassFiles)
		.pipe(postcss())
        .pipe(plumberNotifier())
		.pipe(sass())
		.pipe(autoPrefixer(AUTOPREFIXER_BROWSERS))
		// .pipe(csscomb())
		.pipe(dest("assets/css"))
		.pipe(csso())
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest("assets/css"))
        .pipe(browserSync.stream());
	cb();
}

function makeJS() {
	return src(jsFiles)
		.pipe(plumberNotifier())
		.pipe(
			babel({
				presets: ["@babel/env"],
			})
		)
		.pipe(dest("assets/js"))
		.pipe(uglify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest("assets/js"));
}

function imageminTask(cb) {
	return src("./assets/dev/images/*")
		.pipe(imagemin())
		.pipe(dest("./assets/images"));
	cb();
}

function browsersyncServe(cb) {
	browserSync.init({
		server: {
			baseDir: "./",
		},
	});
	cb();
}

function browsersyncReload(cb) {
	browserSync.reload();
	cb();
}

function watchTask() {
	watch(["./**/*.html", "./*.html"], series(makeCSS, makeJS, browsersyncReload));
	watch(sassFiles, series(makeCSS, browsersyncReload));
	watch(jsFiles, series(makeJS, browsersyncReload));
}

exports.default = series(
    makeCSS,
    makeJS,
    browsersyncServe,
    watchTask
);

exports.images = imageminTask;
