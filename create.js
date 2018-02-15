var fs = require('fs');
var path = require('path');
var mds = require('markdown-styles');
var phantom = require('phantom');

var inputdir = process.argv[2];
var outputdir = process.argv[3];
var layout = process.argv[4];

function usage() {
    console.log("usage: node .\create.js <inputdir> <outputdir> <layout>");
}

function checkParams(dir, dirname, createnew) {
    if (typeof dir === 'undefined' || dir.length < 1) {
        console.error("%s directory is missing", dirname);
        usage();
        process.exit(1);
    } else {
        try {
            var isDirectory = fs.lstatSync(dir).isDirectory();
            if (isDirectory) {
                // console.log("%s is the %s directory", dir, dirname);
                return path.resolve(dir);
            } else {
                console.error("%s is not a directory 2", dir);
                usage();
                process.exit(1);
            }
        } catch (err) {
            if (createnew) {
                console.log("%s directory does not exist. creating...", dir);
                fs.mkdirSync(dir);
                console.log("Created %s directory.", dir);
                return path.resolve(dir);
            } else {
                console.error("%s is not a directory", dir);
                usage();
                process.exit(1);
            }
        }
    }
}

var inputdirpath = checkParams(inputdir, "Input", false);
console.log('inputdir path %s', inputdirpath);
var outputdirpath = checkParams(outputdir, "Output", true);
console.log('outputdir path %s', outputdirpath);

if (typeof layout === 'undefined' || layout.length < 1) {
    console.error("layout is missing");
    usage();
    process.exit(1);
}

function createpdf(htmlFile, pdfFile) {
    console.log("Html file %s", htmlFile);
    console.log("PDF file %s", pdfFile);

    phantom.create().then(function (ph) {
        ph.createPage().then(function (page) {
            page.property('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' }).then(function () {
                page.property('zoomFactor', 300.0 / 72.0).then(function () {
                    page.open(htmlFile).then(function (status) {
                        page.render(pdfFile).then(function () {
                            console.log('Page Rendered %s', pdfFile);
                            ph.exit();
                        });
                    });
                });
            });
        });
    });
}

function generatehtml(mdfile, inputdirpath, outputdirpath) {
    var markdownextension = '.md';
    var htmlextension = ".html";
    var pdfextension = ".pdf";
    var mdfilePath = inputdirpath + '/' + mdfile;
    console.log ("Markdown file path %s", mdfilePath);
    mds.render(mds.resolveArgs({
        input: mdfilePath,
        output: outputdirpath,
        layout: layout,
    }), function () {
        var htmlFile = outputdir + '/' + mdfile.replace(markdownextension, htmlextension);
        var pdfFile = outputdir + '/' + mdfile.replace(markdownextension, pdfextension);
        createpdf(htmlFile, pdfFile);
    });
}

fs.readdir(inputdirpath, function (err, files) {
    var markdownextension = '.md';

    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
    var numberofmdfiles = 0;
    files.forEach(function (file, index) {
        if (path.extname(file) === markdownextension) {
            numberofmdfiles += 1;
            console.log("markdown file: %s", file);
            //do something
            generatehtml(file, inputdirpath, outputdirpath);
        }
    });
    if (numberofmdfiles === 0) {
        console.error("No markdown files in the input directory");
    }
});

