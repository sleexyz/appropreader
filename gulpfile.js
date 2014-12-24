var gulp = require("gulp"),
    sass = require("gulp-sass"),
    minifycss = require("gulp-minify-css"),
    livereload = require("gulp-livereload"),
    notify = require("gulp-notify"),
    jade = require("gulp-jade"),
    del = require("del"),
    gutil = require("gulp-util"),
    source = require("vinyl-source-stream"),
    watchify = require("watchify"),
    browserify = require("browserify"),
    reactify = require("reactify"),
    lr = require("tiny-lr"),
    server = lr();

var paths = {
    sass: ["./src/*.scss"],
    jade: ["./src/**/index.jade"],
    js: ["./src/**/*.js", '!./src/browserify/**/*js'],
    browserify: ["./src/browserify/**.js", "./src/browserify/**.jsx"],
    app_js: ["./src/browserify/app.jsx"]
}

gulp.task("sass", function() {
	return gulp.src(paths.sass)
		.pipe(sass())
		.pipe(minifycss())
		.pipe(gulp.dest("./build/"))
		.pipe(livereload(server))
		.pipe(notify({ message: "Sass task completed"}));
});

gulp.task("jade", function() {
	return gulp.src(paths.jade)
		.pipe(jade())
		.pipe(gulp.dest("./build/"))
		.pipe(livereload(server))
		.pipe(notify({ message: "Jade task completed"}));
});

gulp.task("js", function() {
	return gulp.src(paths.js)
		.pipe(gulp.dest("./build/"))
		.pipe(livereload(server))
		.pipe(notify({ message: "JS task completed"}));
});

gulp.task("browserify", function() {
    browserify(paths.app_js)
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
		.pipe(livereload(server))
        .pipe(gulp.dest('./build/'));
});

gulp.task("server", function() {
    var http = require('http'),
        connect = require("connect"),
        serveStatic = require("serve-static");

    var app = connect().use(serveStatic('./build'));
    http.createServer(app).listen(8080);
});

gulp.task("watch", function() {
	gulp.watch(paths.sass, ['sass']);
	gulp.watch(paths.js, ['js']);
	gulp.watch(paths.jade, ['jade']);
    gulp.watch(paths.browserify, ['browserify']);

    // live-reload
	server.listen(35729, function(e) {
		if (e) {
			return console.log(e);
		};
	});
});

gulp.task("clean", function(cb) {
	del(["build/**/*"], cb);
});
gulp.task("build",['clean'], function() { return gulp.run(["sass", "js", "jade", "browserify"])});
gulp.task("daemon", ["server", "watch"]);
gulp.task("default", ["build"]);
