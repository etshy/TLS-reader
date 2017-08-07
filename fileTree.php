<?php
/**
 * Created by PhpStorm.
 * User: Etshy
 * Date: 05/08/2017
 * Time: 22:52
 */


//Mettre ce fichier php sur le serveur stockant les epubs !

/**
 * CONFIG
 */

$epubFolders = "bookshelf/";
//Max hierarchy to search
$hierarchyLevelMax = 2;

/**
 * ENF CONFIG
 */

header("Access-Control-Allow-Origin: *");

function listFolders($dir, $hierarchyLevel)
{
    $hierarchyLevel++;
    $dh = scandir($dir);
    $return = array();

    foreach ($dh as $folder) {
        if ($folder != '.' && $folder != '..') {
            if (is_dir($dir . '/' . $folder)) {
                if($hierarchyLevel == $hierarchyLevelMax)
                {
                    $return[$folder] = array();
                } else {
                    $return[$folder] = listFolders($dir . '/' . $folder, $hierarchyLevel);
                }
            } else {
                $return[] = $folder;
            }
        }
    }
    return $return;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $folders = listFolders($epubFolders, 0);
    header('Content-Type: application/json');
    echo json_encode($folders);
}
