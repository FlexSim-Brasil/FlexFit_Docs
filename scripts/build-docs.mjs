import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANUAL_DIR = path.join(ROOT, 'modules', 'RailWorks', 'manual');
const NAV_FILE = path.join(ROOT, 'modules', 'RailWorks', 'docs', 'nav.html');
const CSS_SRC = path.join(ROOT, 'CSS');
const STAGING_DIR = path.join(ROOT, '.site-staging');
const SITE_DIR = path.join(ROOT, 'site');
const BASE_URL = (process.env.BASE_URL ?? '').replace(/\/$/, '');
const WELCOME_PATH = 'modules/RailWorks/manual/WelcomeToRailWorks.html';

let outputDir = STAGING_DIR;

const navTemplate = fs.readFileSync(NAV_FILE, 'utf8');

function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true });
	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

function walkDir(dir, callback) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkDir(fullPath, callback);
		} else {
			callback(fullPath);
		}
	}
}

function toPosix(value) {
	return value.split(path.sep).join('/');
}

function normalizeSitePath(value) {
	return toPosix(value).replace(/\\/g, '/').replace(/^\/+/, '').toLowerCase();
}

function getManualRelativePath(filePath) {
	const relative = toPosix(path.relative(MANUAL_DIR, filePath));
	return `modules/RailWorks/manual/${relative}`;
}

function getCssRelativePath(manualRelativePath) {
	const dirPart = path.posix.dirname(manualRelativePath.replace('modules/RailWorks/manual/', ''));
	const depth = dirPart === '.' ? 0 : dirPart.split('/').length;
	const levelsUp = 3 + depth;
	return '../'.repeat(levelsUp) + 'CSS/';
}

function getImagesRelativePath(manualRelativePath) {
	const dirPart = path.posix.dirname(manualRelativePath.replace('modules/RailWorks/manual/', ''));
	const depth = dirPart === '.' ? 0 : dirPart.split('/').length;
	return '../'.repeat(depth) + 'Images/';
}

function buildSidebarHtml(navHtml, imagesPath) {
	const homeUrl = joinBaseUrl(WELCOME_PATH);
	return `\t\t\t<div class="sidebar-brand sidebar-brand--railworks">
\t\t\t\t<a href="${homeUrl}" aria-label="RailWorks Documentation home">
\t\t\t\t\t<img src="${imagesPath}logo_RW.svg" alt="RailWorks" />
\t\t\t\t</a>
\t\t\t</div>
\t\t\t<div class="sidebar-nav">
\t\t\t\t${navHtml}
\t\t\t</div>
\t\t\t<div class="sidebar-brand sidebar-brand--flexsim">
\t\t\t\t<img src="${imagesPath}logo_FS.png" alt="FlexSim" />
\t\t\t</div>`;
}

function joinBaseUrl(sitePath) {
	const normalizedPath = sitePath.replace(/\\/g, '/');
	if (!BASE_URL) {
		return `/${normalizedPath}`;
	}
	return `${BASE_URL}/${normalizedPath}`.replace(/([^:]\/)\/+/g, '$1');
}

function rewriteNavLinks(navHtml) {
	const $ = cheerio.load(navHtml, { xml: false, decodeEntities: false }, false);

	$('a[href]').each((_i, el) => {
		const href = $(el).attr('href');
		if (!href || href === '#') {
			return;
		}
		const sitePath = href.replace(/\\/g, '/');
		$(el).attr('href', joinBaseUrl(sitePath));
	});

	return $.root().html() ?? navHtml;
}

function markActiveNav(navHtml, currentSitePath) {
	const $ = cheerio.load(navHtml, { xml: false, decodeEntities: false }, false);
	const current = normalizeSitePath(currentSitePath);

	$('a[href]').each((_i, el) => {
		const href = $(el).attr('href');
		if (!href || href === '#') {
			return;
		}

		const linkPath = normalizeSitePath(href.replace(BASE_URL, '').replace(/^\//, ''));
		if (linkPath === current) {
			$(el).parents('li').addClass('selected');
		}
	});

	return $.root().html() ?? navHtml;
}

function buildPage(filePath) {
	const sitePath = getManualRelativePath(filePath);
	const cssPath = getCssRelativePath(sitePath);
	const sourceHtml = fs.readFileSync(filePath, 'utf8');
	const $ = cheerio.load(sourceHtml, { xml: false, decodeEntities: false });

	const headHtml = $('head').html() ?? '';
	const body = $('body');
	const bodyAttrs = { ...body.attr() };
	const bodyContent = body.html() ?? '';

	const existingClass = bodyAttrs.class ?? '';
	bodyAttrs.class = existingClass
		? `docs-with-sidebar ${existingClass}`
		: 'docs-with-sidebar';

	const bodyAttrString = Object.entries(bodyAttrs)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');

	const bodyOpen = `<body ${bodyAttrString}>`;

	let navHtml = rewriteNavLinks(navTemplate);
	navHtml = markActiveNav(navHtml, sitePath);
	const imagesPath = getImagesRelativePath(sitePath);
	const sidebarHtml = buildSidebarHtml(navHtml, imagesPath);

	const output = `<!DOCTYPE html>
<html>
<head>
${headHtml}
\t<link rel="stylesheet" href="${cssPath}docs-layout.css" />
\t<link rel="stylesheet" href="${cssPath}toc/css/menu.css" />
\t<link rel="stylesheet" href="${cssPath}sidebar-theme.css" />
</head>
${bodyOpen}
\t<button type="button" class="sidebar-toggle" aria-label="Menu">&#9776;</button>
\t<div class="sidebar-overlay" aria-hidden="true"></div>
\t<div class="docs-layout">
\t\t<aside class="docs-sidebar" aria-label="Navegação">
${sidebarHtml}
\t\t</aside>
\t\t<main class="docs-content">
${bodyContent}
\t\t</main>
\t</div>
\t<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
\t<script src="${cssPath}toc/js/tendina.min.js"></script>
\t<script src="${cssPath}toc/js/sidebar-init.js"></script>
</body>
</html>
`;

	const outputPath = path.join(outputDir, sitePath);
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, output, 'utf8');
}

function buildIndex() {
	const welcomeUrl = joinBaseUrl(WELCOME_PATH);
	const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
\t<meta charset="UTF-8" />
\t<meta http-equiv="refresh" content="0; url=${welcomeUrl}" />
\t<title>RailWorks Documentation</title>
</head>
<body>
\t<p>Redirecting to <a href="${welcomeUrl}">RailWorks Documentation</a>...</p>
</body>
</html>
`;
	fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml, 'utf8');
}

function cleanOutputDir(dir) {
	fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
	fs.mkdirSync(dir, { recursive: true });
}

function promoteStagingToSite() {
	try {
		fs.rmSync(SITE_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
		fs.renameSync(STAGING_DIR, SITE_DIR);
		return true;
	} catch {
		return false;
	}
}

function main() {
	console.log(`Building site with BASE_URL="${BASE_URL}"`);
	outputDir = STAGING_DIR;
	cleanOutputDir(STAGING_DIR);
	copyDir(CSS_SRC, path.join(outputDir, 'CSS'));

	walkDir(MANUAL_DIR, (filePath) => {
		const relativePath = path.relative(MANUAL_DIR, filePath);
		const destPath = path.join(outputDir, 'modules', 'RailWorks', 'manual', relativePath);

		if (filePath.endsWith('.html')) {
			buildPage(filePath);
			console.log(`  built ${getManualRelativePath(filePath)}`);
			return;
		}

		fs.mkdirSync(path.dirname(destPath), { recursive: true });
		fs.copyFileSync(filePath, destPath);
		console.log(`  copied ${getManualRelativePath(filePath)}`);
	});

	buildIndex();

	if (promoteStagingToSite()) {
		console.log(`Done. Output: ${SITE_DIR}`);
		return;
	}

	console.warn('');
	console.warn(`Could not replace ${SITE_DIR} (stop npx serve or close files in site/ and re-run).`);
	console.warn(`Build output is available at: ${STAGING_DIR}`);
	console.warn(`Preview with: npx serve ${STAGING_DIR}`);
	console.warn('');
	process.exitCode = 1;
}

main();
