<?php

# Modified from https://stackoverflow.com/q/68028049/6456163
require "./vendor/autoload.php";
use DiDom\Document;
$url = "https://html.duckduckgo.com/html/?q=".$_GET["q"]; #."&amp;t=KaraMeese";
$document = new Document($url, true);

$results = new stdClass();
$results->titles   = $document->find(".result__title");
$results->icons    = $document->find(".result__icon__img");
$results->urls     = $document->find(".result__url");
$results->snippets = $document->find(".result__snippet");

$api = [];
$length = count($results->titles);
if ($length > 10) $length = 10; # Limit to a maximum 10 results per query

for ($i = 0; $i < $length; $i++) {
	# Create the individual result
	$result = new stdClass();
	$result->url     = trim($results->urls[$i]->text());
	$result->snippet = trim($results->snippets[$i]->text());
	$result->icon = "https:" . trim($results->icons[$i]->attr("src"));

	# Perform additional processing on the title to remove ads
	$rawTitle = $results->titles[$i]->text();
	$titleWithoutAds = explode("Ad\n", $rawTitle)[0];
	$titleWithoutNewLines = preg_replace("/\\n/", "", $titleWithoutAds);
	$result->title = trim($titleWithoutNewLines);

	array_push($api, $result);
}

echo json_encode($api);

?>
