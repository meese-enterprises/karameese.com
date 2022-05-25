<?php

# TODO: Implement rate limiting for my clients so the server isn't overwhelmed
# IDEA: Add in my proxy script with PANTHER_CHROME_ARGUMENTS='--proxy-server=socks://127.0.0.1:9050'

# https://oxylabs.io/blog/web-scraping-php
require "vendor/autoload.php";
use \Symfony\Component\Panther\Client;
use Symfony\Component\DomCrawler\Crawler;
use DiDom\Document;
$client = Client::createChromeClient();

# Crawl the Google page of interest and wait for the JavaScript to load
$query = urlencode($_GET["q"]);
$client->get("http://www.google.com/search?hl=en&tbo=d&site=&source=hp&q=".$query);
$crawler = $client->waitFor("#search");
$html = $crawler->html();

# Parse the HTML and get the results elements
$document = new Document($html);
$difficult_elements = $document->find('h3[role="heading"]');
foreach ($difficult_elements as $element) {
	# Removes several Google elements that are difficult to parse later on
	$element->remove();
}
$search = $document->find("[data-async-context*=query]")[0];
$results = $search->children();

/** Contains Google selectors that we aren't interested in returning. */
$ignore = [
	// Removes "People also ask" results
	"data-initq",
	// These shouldn't exist in this section, but removes any ads if they do
	"data-text-ad",
	// Removes the annoying map with local businesses
	"Local Results",
	// Removes YouTube and Twitter cards
	"g-scrolling-carousel",
	// Removes news that nobody should be interested in
	"Top stories",
];

# Filters out all the $ignore selectors from the results.
# https://stackoverflow.com/a/33987987/6456163
$relevantResults = array_filter($results, function($result) use ($ignore) {
	# Remove all script tags
	if (!empty($result->first("script"))) {
		foreach($result->findInDocument("script") as $script) {
			$script->remove();
		}
	}

	$html = $result->html();
	foreach ($ignore as $tag) {
    if (stripos($html, $tag) !== FALSE) {
			return false;
    }
	}

	return true;
});

# Maps the relevant results to an array of HTML strings.
$relevantResults = array_map(function($result) {
	$googleElem  = $result->find(".g");

	if (!empty($googleElem)) {
		# Strips some more of the filler data from the Google result.
		return $googleElem[0]->html();
	} else {
		return $result->html();
	}
}, $relevantResults);

# Filter out all the results that don't have h3 tags.
$relevantResults = array_filter($relevantResults, function($result) {
	$document = new Document($result);
	$h3_elements = $document->find("h3");

	return isset($h3_elements[0]);
});

# Get only the data we care about from the HTML.
$resultData = array_map(function($result) {
	$document = new Document($result);
	$title = $document->find("h3")[0]->text();
	$breadcrumbs = $document->find("cite")[0]->text();
	$url = $document->find("a")[0]->attr("href");

	$description = $document->find("[data-content-feature=\"1\"]");
	if (!empty($description)) {
		$description = $description[0]->text();
	} else {
		$description = $document->find("h3")[0]->parent()->parent()->nextSibling()->text();
	}

	return [
		"title" => $title,
		"url" => $url,
		"breadcrumbs" => $breadcrumbs,
		"description" => $description,
	];
}, $relevantResults);

# Returns the relevant results as stringified JSON.
echo json_encode($resultData);

?>
