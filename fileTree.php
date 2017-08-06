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

/**
 * ENF CONFIG
 */

header("Access-Control-Allow-Origin: *");

function listFolders($dir)
{
    $dh = scandir($dir);
    $return = array();

    foreach ($dh as $folder) {
        if ($folder != '.' && $folder != '..') {
            if (is_dir($dir . '/' . $folder)) {
                $return[$folder] = listFolders($dir . '/' . $folder);
            } else {
                $return[] = $folder;
            }
        }
    }
    return $return;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $folders = listFolders($epubFolders);
    header('Content-Type: application/json');
    echo json_encode($folders);
}