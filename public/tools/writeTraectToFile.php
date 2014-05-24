<?
	$param = $_POST['data'];
	$myFile = 'traect.json';
	file_put_contents("../../assets/tools/".$myFile,$param);

	echo 'success';
?>