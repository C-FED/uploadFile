<?php 
header('content-type:text/html;charset=utf8');

$data=$_FILES;

$dirname='../upload';
$filename=iconv('UTF-8','gbk',$data['file']['name']);

if (!file_exists($dirname)) {
	mkdir($dirname);
}
// 上传图片
move_uploaded_file($data['file']['tmp_name'], $dirname.'/'.$filename);


echo "===POST===\n";
print_r($_POST);
echo "===FILES===\n";
print_r($_FILES);
// echo "===REQUEST===\n";
// print_r($_REQUEST);


?>



