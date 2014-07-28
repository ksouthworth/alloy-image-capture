var photoDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "photos");
if(!photoDir.exists()) {
    photoDir.createDirectory();
}

function takePhoto(e) {
    var ImageFactory = require('ti.imagefactory');

    Ti.Media.showCamera({
        success: function(e) {
            if(e.media) {
                Ti.API.info((new Date()) + 'Captured image media:');
                Ti.API.info('  mime: ' + e.media.mimeType);
                Ti.API.info('  pixels: ' + e.media.size); // width * height in pixels
                Ti.API.info('  filesize: ' + (e.media.length / 1024.0) + ' KB');
                Ti.API.info('  dimensions: ' + e.media.width + ' x ' + e.media.height);
                Ti.API.info('  nativePath: ' + e.media.nativePath);
                Ti.API.info('  file: ' + e.media.file);

                var start, end = null;

                // write original blob to disk
                Ti.API.info('saving original to disk....');
                start = new Date();
                var outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'original.jpg');
                outputFile.write(e.media);
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // RESIZE blob to disk (core API)
                Ti.API.info('resizing original to disk (blob resize)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'blob-resized.jpg');
                outputFile.write( e.media.imageAsResized(768, 1024) );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // RESIZE blob to disk (module API)
                Ti.API.info('resizing original to disk (module resize)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'module-resized.jpg');
                outputFile.write( ImageFactory.imageAsResized(e.media, {
                    width: 768,
                    height: 1024,
                    quality: ImageFactory.QUALITY_HIGH,
                    hires: false // do NOT use 'true', it seems to crop out half the image!
                }) );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // COMPRESS original to 80 % (module API)
                Ti.API.info('compressing original to disk (module)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'original-compressed.jpg');
                outputFile.write( ImageFactory.compress(e.media, 0.8) );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // RESIZE & COMPRESS original (module API)
                Ti.API.info('resizing then compressing original to disk (module)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'module-resized-compressed.jpg');
                outputFile.write( ImageFactory.compress(ImageFactory.imageAsResized(e.media, {
                    width: 768,
                    height: 1024,
                    quality: ImageFactory.QUALITY_HIGH,
                    hires: false // do NOT use 'true', it seems to crop out half the image!
                }), 0.8) );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // THUMBNAIL blob to disk (core API)
                // this will automatically center-crop and resize (you will lose edges of the original image!)
                Ti.API.info('creating thumbnail of original to disk (blob thumbnail)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'blob-thumbnail.jpg');
                outputFile.write( e.media.imageAsThumbnail(50, 0, 0) );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // THUMBNAIL blob to disk (module API)
                // this will automatically center-crop and resize (you will lose edges of the original image!)
                Ti.API.info('creating thumbnail of original to disk (module thumbnail)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'module-thumbnail.jpg');
                outputFile.write( ImageFactory.imageAsThumbnail(e.media, {
                    size: 50,
                    borderSize: 0,
                    cornerRadius: 0,
                    quality: ImageFactory.QUALITY_HIGH })
                );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                // Resized as thumbnail blob to disk (module API)
                Ti.API.info('creating thumbnail of original to disk (module resize)....');
                start = new Date();
                outputFile = Ti.Filesystem.getFile(photoDir.nativePath, 'module-resized-thumbnail.jpg');
                outputFile.write( ImageFactory.imageAsResized(e.media, {
                    width: 50,
                    height: 50,
                    quality: ImageFactory.QUALITY_HIGH,
                    hires: false
                }) );
                outputFile = null;
                end = new Date();
                Ti.API.info('took: ' + (end - start) + ' ms' );

                Ti.API.info('done processing captured media');
            }
        },
        cancel: function() {
           Ti.API.info('user canceled camera');
        },
        error: function(error) {
           Ti.API.error('ERROR: ' + JSON.stringify(error));
        }
    });
}

$.index.open();
