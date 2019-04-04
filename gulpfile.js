const gulp = require("gulp");
const sass = require("gulp-sass");

gulp.task("default", done => {
  console.log("Gulping!")
  done();
});

gulp.task("styles", done => {
  gulp.src("sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"));
  done();
});