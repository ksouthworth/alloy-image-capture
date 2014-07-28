function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function takePhoto() {
        var ImageFactory = require("ti.imagefactory");
        Ti.Media.showCamera({
            success: function(e) {
                if (e.media) {
                    Ti.API.info(new Date() + "Captured image media:");
                    Ti.API.info("  mime: " + e.media.mimeType);
                    Ti.API.info("  pixels: " + e.media.size);
                    Ti.API.info("  filesize: " + e.media.length / 1024 + " KB");
                    Ti.API.info("  dimensions: " + e.media.width + " x " + e.media.height);
                    Ti.API.info("  nativePath: " + e.media.nativePath);
                    Ti.API.info("  file: " + e.media.file);
                    var start, end = null;
                    Ti.API.info("saving original to disk....");
                    start = new Date();
                    var outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "original.jpg");
                    outputFile.write(e.media);
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("resizing original to disk (blob resize)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "blob-resized.jpg");
                    outputFile.write(e.media.imageAsResized(768, 1024));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("resizing original to disk (module resize)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "module-resized.jpg");
                    outputFile.write(ImageFactory.imageAsResized(e.media, {
                        width: 768,
                        height: 1024,
                        quality: ImageFactory.QUALITY_HIGH,
                        hires: false
                    }));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("compressing original to disk (module)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "original-compressed.jpg");
                    outputFile.write(ImageFactory.compress(e.media, .8));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("resizing then compressing original to disk (module)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "module-resized-compressed.jpg");
                    outputFile.write(ImageFactory.compress(ImageFactory.imageAsResized(e.media, {
                        width: 768,
                        height: 1024,
                        quality: ImageFactory.QUALITY_HIGH,
                        hires: false
                    }), .8));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("creating thumbnail of original to disk (blob thumbnail)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "blob-thumbnail.jpg");
                    outputFile.write(e.media.imageAsThumbnail(50, 0, 0));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("creating thumbnail of original to disk (module thumbnail)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "module-thumbnail.jpg");
                    outputFile.write(ImageFactory.imageAsThumbnail(e.media, {
                        size: 50,
                        borderSize: 0,
                        cornerRadius: 0,
                        quality: ImageFactory.QUALITY_HIGH
                    }));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("creating thumbnail of original to disk (module resize)....");
                    start = new Date();
                    outputFile = Ti.Filesystem.getFile(photoDir.nativePath, "module-resized-thumbnail.jpg");
                    outputFile.write(ImageFactory.imageAsResized(e.media, {
                        width: 50,
                        height: 50,
                        quality: ImageFactory.QUALITY_HIGH,
                        hires: false
                    }));
                    outputFile = null;
                    end = new Date();
                    Ti.API.info("took: " + (end - start) + " ms");
                    Ti.API.info("done processing captured media");
                }
            },
            cancel: function() {
                Ti.API.info("user canceled camera");
            },
            error: function(error) {
                Ti.API.error("ERROR: " + JSON.stringify(error));
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.capturePhotoButton = Ti.UI.createButton({
        id: "capturePhotoButton",
        title: "Take Photo"
    });
    $.__views.index.add($.__views.capturePhotoButton);
    takePhoto ? $.__views.capturePhotoButton.addEventListener("click", takePhoto) : __defers["$.__views.capturePhotoButton!click!takePhoto"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var photoDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "photos");
    photoDir.exists() || photoDir.createDirectory();
    $.index.open();
    __defers["$.__views.capturePhotoButton!click!takePhoto"] && $.__views.capturePhotoButton.addEventListener("click", takePhoto);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;