const gulp = require("gulp");                             // gulp core
const sass = require('gulp-sass')(require('sass'));                       // sass compiler
const browserSync = require('browser-sync').create();     // inject code to all devices


const autoprefixer = require('gulp-autoprefixer');       // sets missing browserprefixes
const  csso = require('gulp-csso');                        // minify the css files
// const cmq = require('gulp-combine-mq');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;



const del = require('del');

const gulpif = require('gulp-if');
const useref = require('gulp-useref');

const imagemin = require('gulp-imagemin'),
    imageminWebp = require('imagemin-webp'), // webP
    extReplace = require("gulp-ext-replace"),
    spritesmith = require('gulp.spritesmith');

const changed = require('gulp-changed'),
    options = {removeComments: false};


/*********************************************/
/*WATCHER (WATCHING FILE CHANGES)*/
/*********************************************/

function styles() {
    return gulp.src('./app/sass/**/*')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src('./app/js/*.js')                 // get the files
        .pipe(browserSync.stream())
    // browsersync stream
}


function fonts() {
    return gulp.src('./app/fonts/**/*')                 // get the files
        .pipe(gulp.dest('dist/fonts'));                 // where to put the files
}

/*********************************************/
/*LIBS TASKS (PERSONAL DEVELOPER LIBS)*/
/*********************************************/

function libs() {
    return gulp.src('./app/libs/**/*')                  // get the files
        .pipe(gulp.dest('dist/libs'));                  // where to put the files
}

function extrass () {
    return gulp.src([                                   // get the files
        'app/*.html'                                   // except '.html'
    ]).pipe(gulp.dest('dist'));                         // where to put the files
}



function buildSprite() {
    var spriteData = gulp.src('./app/images/sprite/*.*')
        .pipe(spritesmith({
            imgName: '../images/sprite.png',
            cssName: '_sprite.scss',
            cssFormat: 'scss',
            padding: 5
        }));

    spriteData.img.pipe(gulp.dest('./app/images'));
    return spriteData.css.pipe(gulp.dest('./app/sass/components'));
}


function sprite(done) {
    buildSprite().on('end', done);
}


function images() {
    return gulp.src('./app/images/**/*')                   // get the files
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            // imagemin.svgo({
            //     plugins: [
            //         {removeViewBox: false},
            //         {cleanupIDs: false}
            //     ]
            // })
        ]))

        .pipe(gulp.dest('dist/images'));                   // where to put the files
}


gulp.task('webp', () =>
    gulp.src('./app/images/**/*.{jpg,png}')
        .pipe(imagemin([
            imageminWebp({
                quality: 85,
                preset: 'photo'
            })]))
        .pipe(extReplace(".webp"))
        .pipe(gulp.dest('app/images'))
);


function watch(){
    browserSync.init({
        server:{
            baseDir: "./app/",

        },
        // tunnel: true,
    });
    gulp.watch('./app/sass/**/*.scss', styles);
    gulp.watch('./app/index.html').on('change', browserSync.reload);
    gulp.watch('./app/js/**/*.js').on('change', browserSync.reload);
    gulp.watch('./app/images/sprite/*.*').on('change', browserSync.reload);

}


function clean () {
    return del(['dist/**', '!dist'])
}




function finished() {

    return gulp.src('app/*.html')
        .pipe(gulpif('app/*.js', uglify()))   // uglify js-files
        .pipe(gulpif('app/*.css', csso()))    // minify css-files
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
}



function compress () {
    return pipeline(
        gulp.src('dist/js/*.js'),
        uglify(),
        gulp.dest('dist/js')
    );
}



gulp.task('extrass', extrass);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('libs', libs);
gulp.task('fonts', fonts);


// gulp.task('stylesReviews', stylesReviews);



gulp.task('sprite', sprite);
gulp.task('images', images);

// gulp.task('webP', webP);

gulp.task('clean', clean);
gulp.task('finished', finished);

gulp.task('compress', compress);

gulp.task('watch', watch);


const standartWatch = gulp.parallel(watch);
gulp.task('default', standartWatch);



gulp.task('build', gulp.series('clean', 'styles', 'scripts', 'images', 'fonts', 'libs', 'extrass', 'finished', 'compress'));
