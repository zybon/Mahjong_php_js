<!DOCTYPE html>
<html>
    <head>
        <META HTTP-EQUIV="Content-Type" Content="text/html; Charset=UTF-8">
        <META HTTP-EQUIV="Content-Language" Content="hu">
        <script type="text/javascript" src="mahj_script.js"></script>
        <link rel="stylesheet" type="text/css" href="mahj_style.css" />
        <link rel="stylesheet" type="text/css" href="../../forall/all_style.css" />
    </head>
    <body>
        <form name="gameForm" action="jatek_gen_mahj.php" method="get">
            <div id="mind">
                <div id="jatekter">
                    <div class="cim">
                        <div class="dropdown">
                            <input type="button" id="menuButton" onclick="menuShow()" value="Játék" />
                            <div id="dropdownContent" class="dropdown-content">
                                <div id="restartBtn" class="dropdown-content-item" onclick="restartGame()">Újrakezdés</div>
                                <div id="restartWithShuffleBtn" class="dropdown-content-item" onclick="restartWithShuffle()">Újrakeverés</div>
                                <div id="newLayoutBtn" class="dropdown-content-item" onclick="backToLayouts()">Új elrendezés</div>
                                <hr>
                                <div id="undoBtn" class="dropdown-content-item" onclick="undo()">Visszavonás</div>
                                <div id="hintBtn" class="dropdown-content-item" onclick="hint()">Segítség (+20 mp)</div>
                            </div>
                        </div>
                    </div>
                    <div class="tartalom" id="Tart">
                        <div id="tablbef">
                            <img src="./res/images/00.gif" id="cover" style="position:absolute;top:0px;width:100%;height:100%;z-index:200;display:block;">

                            <?php
                            $szamok = "";
                            for ($s = 1; $s <= 42; $s++) {
                                if ($s < 35) {
                                    for ($i = 0; $i < 4; $i++) {
                                        $szamok .= ($s < 10 ? "0" . $s : $s);
                                    }
                                } else {
                                    $szamok .= $s;
                                }
                            }
                            $hely = array();         //véletlenszerûen elrendezi a képeket a táblában
                            for ($i = 0; $i < 144; $i++) {
                                $hossz = strlen($szamok) - 1;
                                $vel = rand(0, $hossz);
                                if (($vel + 1) % 2 == 0) {
                                    $vel = $vel - 1;
                                }
                                $hely[$i] = substr($szamok, $vel, 2);
                                $szamok1 = substr($szamok, 0, $vel);
                                $szamok2 = substr($szamok, $vel + 2);
                                $szamok = $szamok1 . $szamok2;
                            }
                            $classNames = array(101, 102, 103, 104, 105, 106, 107, 108, 109,
                                201, 202, 203, 204, 205, 206, 207, 208, 209,
                                301, 302, 303, 304, 305, 306, 307, 308, 309,
                                401, 402, 403, 404, 501, 502, 503,
                                601, 601, 601, 601, 701, 701, 701, 701);

                            $elrendert = $_GET['elrend'];
                            $id = explode("_", $elrendert);
                            $elrend = $id[0];

                            $fileName = "./res/layouts/" . $elrend . ".txt";
                            $file = fopen($fileName, "r");
                            $fileContent = str_replace(array("\r", "\n"), "", fread($file, filesize($fileName)));
                            fclose($file);

                            if (strpos("S", $fileContent) != -1) {
                                $layerStrings = explode("S", $fileContent);
                            } else {
                                $layerStrings = $fileContent;
                            }

                            for ($i = 0; $i < count($layerStrings); $i++) {
                                $layers[$i] = explode(",", $layerStrings[$i]);
                            }

                            $tileWidth = 54;
                            $tileHeight = 72;
                            $rowCount = 16;
                            $columnCount = $id[1];
                            $k = 0;
                            $layer = 0;
                            for ($layer = 0; $layer < count($layers); $layer++) {
                                $i = 0;
                                $row = 0;
                                $column = 0;
//  echo '<div class="szint1">'
                                while ($row < $rowCount) {
                                    $top = $row * (($tileHeight - 7) / 2);
                                    $left = $column * (($tileWidth - 6) / 2);
                                    if ($layers[$layer][$i] != 0) {
                                        $ind = (substr($hely[$k], 0, 1) == "0" ? substr($hely[$k], 1) : $hely[$k]);
                                        $nev = $classNames[$ind - 1];
                                        echo '<span id="' . ($layer + 1) . ($row + 20) . ($column + 20) . '" class="' . $nev . '" '
                                        . 'style="display:none;'
                                        . 'position:absolute;'
                                        . 'top:' . ($top - $layer * 4) . 'px;'
                                        . 'left:' . ($left - $layer * 4 + ($columnCount == 36 ? 20 : 100)) . 'px;'
                                        . 'z-index:' . $layers[$layer][$i] . ';'
                                        . 'width:' . $tileWidth . 'px;'
                                        . 'height:' . $tileHeight . 'px;">';
                                        echo '<div class="tileCover"></div>';
                                        echo '<div class="tileCover"></div>';
                                        echo '<img src="./res/tiles/tile_' . $hely[$k] . '.png">';
                                        echo '</span>' . "\r\n";
                                        $k++;
                                    }
                                    $column++;
                                    $i++;
                                    if ($column == ($columnCount)) {
                                        $column = 0;
                                        $row++;
                                    }
                                }
                                echo "\r\n";
                            }
                            echo "</div>";
                            echo "</div>";
                            ?>
                            <div class="lab">
                                <img src="./res/images/hatt_03.png">
                                <div class="alsomenu">
                                    <table style="width:100%;height:100%;text-align:left;margin-left: 10px;">
                                        <tr>
                                            <td>Fennmaradt kövek száma:&nbsp;<input type="text" value="" id="tileCounter" size="3" readonly /></td>
                                            <td>Levehető párok száma:&nbsp;<input type="text" value="" id="moveablePairCounter" size="4" readonly /></td>
                                            <td><input type="text" value="" id="time" size="5" readonly /></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" value="<?= $elrendert ?>" name="elrend">
                    </div>                
                </div>
            </div>
        </form>

    </body>

</html>


