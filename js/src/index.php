<?php

$dir = dirname(__FILE__);

$zip = new ZipArchive();
$zipfile = tempnam('tmp', 'zip');

if ($zip->open($zipfile, ZIPARCHIVE::OVERWRITE)) {
	foreach (glob("$dir/{**/,}*", GLOB_BRACE) as $filepath) {
		if ($filepath === __FILE__ || is_dir($filepath))
			continue;

		$relativepath = preg_replace("#^$dir/#", '', $filepath);
		$zip->addFile($filepath, $relativepath);
	}
	$zip->close();

	header("Content-Type: application/zip");
	header("Content-Length: ".filesize($zipfile));
	header("Content-Disposition: attachment; filename=\"".basename($dir)."_".date('Y-m-d').".zip\"");
	readfile($zipfile);

	unlink($zipfile);
}