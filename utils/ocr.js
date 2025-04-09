const puppeteer = require('puppeteer');

async function startBrowser() {
	let browser;
	try {
		console.log("Opening the browser......");
		browser = await puppeteer.launch({
			headless: false,
			args: ["--disable-setuid-sandbox"],
			'ignoreHTTPSErrors': true
		});
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}
async function scraper(browser) {
	console.log(browser)
	const url = "https://www.rbnz.govt.nz/monetary-policy/about-monetary-policy/the-official-cash-rate"
	let page = await browser.newPage();
	console.log(`Navigating to ${url}...`);
	await page.goto(url);
	// Wait for the required DOM to be rendered
	await page.waitForSelector('.stats-card__value');
	// Get the link to all the required books
	let element = await page.$('.stats-card__value')
	let ocrElement = await page.evaluate(el => el.textContent, element)
	return ocrElement;
}
async function getOCR() {
	try {
		let browserInstance = await startBrowser();
		let ocr = await scraper(browserInstance);
		await browserInstance.close()
		ocr = ocr.trim();
		let regex = /[0-9]+\.[0-9]+/
		let extractedOCR = ocr.match(regex)[0];
		let parsedOCR = parseFloat(extractedOCR);
		return parsedOCR;
	} catch (e) {
		console.log(e);
		return 5
	}
}
module.exports = {
	getOCR
}