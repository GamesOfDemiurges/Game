<?
	$param = $_POST['data'];
	$myFile = 'traect.json';
	file_put_contents($myFile,$param);

	echo 'success';
?>