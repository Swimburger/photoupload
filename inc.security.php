<?php
$_REQUEST = array_map_recursive("trim",$_REQUEST);
$_REQUEST = array_map_recursive("addslashes",$_REQUEST);
$_REQUEST = array_map_recursive("htmlspecialchars",$_REQUEST);

$_FILES = array_map_recursive("trim",$_FILES);
$_FILES = array_map_recursive("addslashes",$_FILES);
$_FILES = array_map_recursive("htmlspecialchars",$_FILES);

// http://php.net/manual/en/function.array-map.php#112857
    function array_map_recursive($callback, $array) {
        foreach ($array as $key => $value) {
            if (is_array($array[$key])) {
                $array[$key] = array_map_recursive($callback, $array[$key]);
            }
            else {
                $array[$key] = call_user_func($callback, $array[$key]);
            }
        }
        return $array;
    }
?>