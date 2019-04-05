/*eslint-env node */

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const jasmineBrowser = require("gulp-jasmine-browser");

// Default and all other tasks
gulp.task("default", ["copy-html", "copy-images", "styles", "lint"], function() {
  gulp.watch("sass/**/*.scss", ["styles"]);
  gulp.watch("js/**/*.js", ["lint"]);
  gulp.watch("/index.html", ["copy-html"]);
  //gulp.watch("*.html").on("change", browserSync.reload);

  // init local server
  browserSync.init({
    server: "./dist"  
  });
});

// Lint code for errors in syntax formatting
gulp.task("lint", function() {
  return gulp.src(["js/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(gulp.dest("dist/js"));
});

// Copy index.html to dist
gulp.task("copy-html", function(){
  gulp.src("./index.html")
    .pipe(gulp.dest("./dist"));
});

// Copy img's to dist
gulp.task("copy-images", function() {
  gulp.src("img/*")
    .pipe(gulp.dest("dist/img"));
});

// SCSS conversions
gulp.task("styles", function() {
  gulp.src("sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

// Testing
gulp.task("tests", function(){
  return gulp
    .src("tests/spec/extraSpec.js")
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless({ driver: "chrome" }));
});