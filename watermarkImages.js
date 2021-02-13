// https://www.codedrome.com/processing-uploaded-images-with-node-and-jimp/
const Jimp = require('jimp');
const artworkDirectory = './src/images/artwork';
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// NOTE: Uncomment for easy testing on singular images
/*processImage({
	imagepath: artworkDirectory + "/skull.jpg",
	saveimagepath: `./static/watermarked/test.png`,
	watermarkpath: './static/logo.png'
});*/

// https://stackoverflow.com/a/32511953/6456163
fs.readdir(artworkDirectory, function (err, files) {
	if (err) {
		console.error('Could not read the artwork directory:', err);
		process.exit(1);
	}

	files.forEach(async (file) => {
		var imageSource = path.join(artworkDirectory, file);
		await fs.stat(imageSource, async function (error, stat) {
			if (error) return console.error('Error stating file.', error);
			if (!stat.isFile()) return;

			await processImage({
				imagepath: imageSource,
				saveimagepath: `./static/watermarked/${file}`,
				watermarkpath: './static/logo.png'
			});
		});
	});
});

/**
 * Calls the watermark function on the specified image,
 * then saves it to the specified location.
 * @param {object} options - specifies the details of the image
 * to be watermarked.
 */
async function processImage(options) {
	Jimp.read(options.imagepath)
		.then(async image => {
			//await addImageWatermark(image, options.watermarkpath);
			await addTextWatermark(image, 'Kara Meese');

			image.quality(95);
			image.writeAsync(options.saveimagepath)
				.then(() => console.log('image saved'))
				.catch(err => console.error(err));
		})
		.catch(err => {
			console.error(err);
		});
}

/**
 * Adds a text watermark of the specified text to the
 * given image.
 * @param {object} image - Jimp image object
 * @param {string} text - text you want for the watermark
 */
async function addTextWatermark(image, text) {
	const width = image.bitmap.width, height = image.bitmap.height;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');
	const watermarkSize = width > height ? width * .15 : height * .15;
	const watermark = generateTextWatermark(text, watermarkSize);
	const pattern = ctx.createPattern(watermark, 'repeat');
	ctx.rect(0, 0, width, height);
  ctx.fillStyle = pattern;
  ctx.fill();

	const opacity = 0.5;
	const watermarkData = canvas.toDataURL().replace('data:image/png;base64,', '');
	return Jimp.read(Buffer.from(watermarkData, 'base64'))
		.then(watermark => {
			image.composite(watermark, 0, 0, { opacitySource: opacity });
		})
		.catch(err => {
			console.error(err);
		});
}

/**
 * Generates a 45 degree canvas to be repeated for the 
 * image watermark.
 * @param {string} text - the diagonal text for the watermark
 * @param {integer} size - the dimensions of the watermark
 */
function generateTextWatermark(text, size) {
	// Modified from https://github.com/ajmeese7/aaronmeese.com/blob/master/src/lettercrap.js
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const font = 'monospace';
	const fontsize = measureTextBinaryMethod(text, font, 0, 1024, canvas.width);
	ctx.font = `${fontsize} ${font}`;
	ctx.translate(canvas.width / 2, canvas.height / 2);

	const angle = -45;
	ctx.rotate(angle * Math.PI / 180);
	ctx.textAlign = 'center';
	ctx.fillText(text, 0, 0);
	return canvas;

	// https://jsfiddle.net/be6ppdre/29/
	function measureTextBinaryMethod(text, fontface, min, max, desiredWidth) {
		if (max - min < 1) return min;
		let test = min + ((max - min) / 2); // Find half interval
		ctx.font = `${test}px ${fontface}`;
		let measureTest = ctx.measureText(text).width;

		const condition = measureTest > desiredWidth;
		return measureTextBinaryMethod(text, fontface, condition ? min : test, 
			condition ? test : max, desiredWidth);
	}
}

/**
 * Adds the specified watermark to the specified image.
 * @param {string} image 
 * @param {string} watermarkpath 
 */
async function addImageWatermark(image, watermarkpath) {
	const opacity = 0.5;
	return Jimp.read(watermarkpath)
		.then(watermark => {
			// Watermark width 20% of image width
			const watermarkSize = image.bitmap.width * .2;
			watermark.resize(watermarkSize, watermarkSize);

			// Offset the watermark 32px both directions off the bottom right corner
			const x = image.bitmap.width - 32 - watermark.bitmap.width;
			const y = image.bitmap.height - 32 - watermark.bitmap.height;
			image.composite(watermark, x, y, { opacitySource: opacity });
		})
		.catch(err => {
			console.error(err);
		});
}

/**
 * Generates a thumbnail of an image.
 * TODO: Implement for the main page, then only load the full
 * images on request via the "Full Image" button.
 * @param {object} image - Jimp image object
 * @param {integer} size - maximum dimension of the thumbnail
 * @param {string} path - the intended destination file
 */
async function generateThumbnail(image, size, path) {
	const thumbnail = image.clone();
	thumbnail.scaleToFit(options.thumbmax, options.thumbmax);
	thumbnail.writeAsync(options.thumbpath)
		.then(() => console.log('thumbnail saved'))
		.catch(err => { console.error(err); });
}