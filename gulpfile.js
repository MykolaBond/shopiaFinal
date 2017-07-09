var gulp 			 = require('gulp'),
	autoprefixer	 = require('gulp-autoprefixer'),
	cssnano 		 = require('gulp-cssnano'),
	del          	 = require('del'),
	sass 			 = require('gulp-sass'),
	concat 			 = require('gulp-concat'),
    uglify       	 = require('gulp-uglifyjs'),
	browserSync   	 = require('browser-sync'),
	imagemin 	 	 = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),
	cache 			 = require('gulp-cache');



var path = {
	css: 'src/css/*.css',
	sass: 'src/sass/**/*.scss',
	img:'src/img/*',
	libs:[
		'src/libs/jquery/dist/jquery.min.js',
		'src/libs/bootstrap/dist/js/bootstrap.min.js',
		'src/libs/swiper/dist/js/swiper.min.js',
		'src/libs/tether/dist/js/tether.min.js'
	],
	libs_css:'src/libs_css/libs_css.scss',
	html:'src/*.html'
}

gulp.task('browserSync',function(){
	browserSync({
		server:{
			baseDir:'build'
	}
	});
});

gulp.task('css',function(){
	return gulp.src(path.css)
	.pipe(autoprefixer(['last 15 version','>1%','ie 8','ie 7'],{cascade:false}))
	.pipe(cssnano())
	.pipe(gulp.dest('build/css'));
});
gulp.task('watch',['build'],function(){
	gulp.watch(path.sass,['sass']);
	gulp.watch(path.css,['css']);
	gulp.watch(path.html,['html']);
	gulp.watch(path.img,['imagemin']);
});

gulp.task('clean',function(){
	return del.sync('build');
});

gulp.task('build',['clean','scripts-libs','scc-libs','browserSync','imagemin','sass','css','html']);

gulp.task('sass',function(){
	return gulp.src(path.sass)
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 version','>1%','ie 8','ie 7'],{cascade:false}))
	.pipe(cssnano())
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts-libs',function(){
	return gulp.src(path.libs)
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('build/js'));
});

gulp.task('scc-libs',function(){
	return gulp.src(path.libs_css)
	.pipe(sass().on('error', sass.logError))
	.pipe(cssnano())
	.pipe(gulp.dest('build/css'));
});

gulp.task('html',function(){
	return gulp.src(path.html)
	.pipe (gulp.dest('build'))
	.pipe(browserSync.reload({stream:true}));
	
});

gulp.task('imagemin',function(){
	return gulp.src(path.img)
        .pipe(cache(imagemin({
    		interlaced: true,
    		progressive: true,
    		optimizationLevel: 5,
    		svgoPlugins: [{removeViewBox: true}],
			use: [imageminPngquant()]
			})))
        .pipe(gulp.dest('build/img'))
});

gulp.task('default',['watch']);