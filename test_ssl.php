<?php
function sslerror($errno, $errstr){
		echo 'window.serverCanUseHTTPS = 0;';
		echo 'window.sslTestEncounteredError = ['.$errno.', "'.$errstr.'"];';
		die();
}

set_error_handler("sslerror");
echo 'window.sslTestEncounteredError = 0;';
$selectedServer = explode(':', $_SERVER['HTTP_HOST'])[0];

if ($selectedServer == 'localhost') {
		echo 'window.serverCanUseHTTPS = 0;window.sslTestHostServer = "localhost";window.sslTestCertificateServer="";';
} else {
		echo 'window.sslTestHostServer = "'.$selectedServer.'";';
		$stream = stream_context_create (array("ssl" => array("capture_peer_cert" => true)));
		$read = fopen("https://".$selectedServer, "rb", false, $stream);
		$cont = stream_context_get_params($read);
		$var = ($cont["options"]["ssl"]["peer_certificate"]);
		$cert = openssl_x509_parse( $var );
		$certserver = trim(substr($cert['name'], strpos($cert['name'], 'CN=') + 3, strlen($cert['name'])), '*.');
		$certserver = trim($certserver, 'www.');
		echo 'window.sslTestCertificateServer = "'.$certserver.'";';

		$certserver = explode('.', $certserver)[0];
		if (strpos($certserver, '/')) {
			$certserver = substr($certserver, 0, strpos($certserver, '/'));
		}

		if (strpos($selectedServer, $certserver) || strpos($selectedServer, $certserver) === 0) {
			echo 'window.serverCanUseHTTPS = 1;';
		} else {
			echo 'window.serverCanUseHTTPS = 0;';
		}
}
?>