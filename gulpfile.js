var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: '*',
        rename: {
            'gulp-jshint': 'gJshint'
        }
    });

var reload = plugins.browserSync.reload;

var config = {
    serverPort: 10000,
    browser: 'OTHER',
    app: 'app',
    dist: 'dist',
    html: 'app/**/*.html',
    styles: 'app/styles/**/*.scss',
    scripts: 'app/**/*.js',
    fonts: [
        'bower_components/font-awesome/fonts/fontawesome-webfont.*',
        'bower_components/bootstrap/fonts/glyphicons-halflings-regular.*',
        'app/fonts/*'
    ],
    flags: 'bower_components/flag-icon-css/flags/**/*'
};

var lintScripts = plugins.lazypipe()
    .pipe(plugins.gJshint, '.jshintrc')
    .pipe(plugins.gJshint.reporter, 'jshint-stylish');

gulp.task('watch:scripts', function () {
    gulp.src([config.scripts])
        .pipe(plugins.plumber())
        .pipe(lintScripts())
        .pipe(reload({stream: true}));
});

gulp.task('watch:styles', function () {
    gulp.src(config.app + '/styles/app.scss')
        .pipe(plugins.plumber())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(config.app + '/styles/'))
        .pipe(reload({stream: true}));
});


gulp.task('watch:html', function () {
    gulp.src(config.html)
        .pipe(reload({stream: true}));
});

gulp.task('browser-sync', function () {
	execSync("envsub app/env.config.js.template app/env.config.js");
	
    plugins.browserSync({
    	open: false,
        server: {
            baseDir: config.app,
            routes: {
                '/bower_components': 'bower_components'
            }
        },
        port: process.env.PORT,
        browser: config.browser,
        startPath: process.env.PUBLIC_PATH+'/#!/peers'
    });
});

gulp.task('server:dist', function () {
    plugins.browserSync({
        server: {
            baseDir: config.dist
        },
        port: config.serverPort,
        browser: config.browser
    });
});

gulp.task('watch', function () {
    gulp.watch(config.styles, gulp.series('watch:styles'));
    gulp.watch(config.scripts, gulp.series('watch:scripts'));
    gulp.watch(config.html, gulp.series('watch:html'));
});

gulp.task('server', gulp.parallel('watch:scripts', 'watch:styles', 'watch:html', 'browser-sync', 'watch'));
gulp.task('default', gulp.series('server'));

gulp.task('clean:dist', function () {
    return plugins.del(['dist/*']);
});


gulp.task('index:build', function () {
    return gulp.src('app/index.html')
        .pipe(plugins.useref())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(plugins.if('*.js', plugins.sourcemaps.write('.')))
        .pipe(plugins.if('*.css', plugins.minifyCss({keepSpecialComments: 1, processImport: false})))
        //.pipe(plugins.if('*.css', plugins.sourcemaps.write('.')))

        .pipe(gulp.dest(config.dist));
});

gulp.task('copy:html', function () {
    return gulp.src([config.app + '/**/*.html', '!' + config.app + '/index.html'])
        .pipe(plugins.htmlmin({
            collapseWhitespace: true
        }))

        .pipe(gulp.dest(config.dist));
});

gulp.task('copy:fonts', function () {
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.dist + '/fonts'));
});

gulp.task('copy:flags', function () {
    return gulp.src(config.flags)
        .pipe(gulp.dest(config.dist + '/flags'));
});

gulp.task('copy:images', function() {
    return gulp.src(config.app + '/images/**/*')

        .pipe(gulp.dest(config.dist + '/images'));
});

gulp.task('copy:config', function() {
    return gulp.src(config.app + '/env.config.js')

        .pipe(gulp.dest(config.dist));
});


gulp.task('build', gulp.series('clean:dist', gulp.series('copy:config','copy:html','copy:images','copy:fonts','copy:flags', 'index:build')));//, function () {
//    plugins.runSequence(['copy:html','copy:images','copy:fonts','copy:flags', 'index:build']);
//});
