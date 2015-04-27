<?php
function browseDir($dir, &$outputList, $extensionList){
	$fileList = array();
	$d = opendir($dir);
	while($f = readdir($d)){
		if($f != '.' && $f != '..'){
			$fileList[$f] = $dir.$f;
		}
	}
	closedir($d);
	ksort($fileList);
	foreach($fileList as $f){
		if(is_dir($f)){
			browseDir($f.'/', $outputList, $extensionList);
		}else if(in_array(substr($f, -3), $extensionList)){
			$id = str_replace(array('img/', 'sound/', '/'), array('', '','.'), $f);
			$id = preg_replace('/[.]([^.]*)$/', '', $id);
			$outputList[$id] = $f;
		}
	}
}
browseDir("img/", $imageList, array('png', 'jpg'));
browseDir("sound/", $soundList, array('mp3', 'wav', 'ogg'));

$content = 'var imageList = '.json_encode($imageList).';'."\n";
$content .= 'var soundList = '.json_encode($soundList).';'."\n";
file_put_contents("loadingData.json", $content);
echo 'LoadingData generated';