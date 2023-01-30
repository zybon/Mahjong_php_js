<!DOCTYPE html>
<html>
<head>
<META HTTP-EQUIV="Content-Type" Content="text/html; Charset=UTF-8" />
<META HTTP-EQUIV="Content-Language" Content="hu" />
<link rel="stylesheet" type="text/css" href="../jatek_style.css" />
<script type="text/javascript" src="../../jquery/jquery-1.11.2.min.js"></script>
<title>Játék</title>
<script type="text/javascript">
function mehet(kep) {
document.getElementById('elrend').value=kep.id;
document.urlap.submit();
}

</script>
<link rel="stylesheet" type="text/css" href="../../forall/all_style.css" />
<link rel="stylesheet" type="text/css" href="mahj_style.css" />
</head>
<?php
if (isset($_GET['honnan'])) {$honnan=$_GET['honnan'];}
else {$honnan=0;}
?>
<body>
<div id="mind" style="width:1000px;">
     <div class="cim">
          <img src="./res/images/hatt_01.png">
          <input type="button" value="Vissza" onclick="javascript: window.open('../jatek.php','_self')" style="position:absolute;left:20px;top:20px;"/>
     </div>
     <div class="tartalom" id="tart">
          <form name='urlap' method='GET' action='jatek_gen_mahj.php'>
          <table border="0" cellspacing="0" cellpadding="0" width="90%" align="center">
          <tr <?=($honnan==0?'':'style="display:none"')?>>
          <td align="center" width="33%">
              <img src="./res/images/teknos.png" id="teknos_30" title="Teknõs" onclick="mehet(this)" class="alak">
          </td>
          <td align="center" width="34%">
              <img src="./res/images/cica.png" id="cica_36" title="Cica" onclick="mehet(this)" class="alak">
          </td>
          <td align="center" width="33%">
              <img src="./res/images/piramisok.png" id="piramisok_36" title="Piramisok" onclick="mehet(this)" class="alak">
          </td>
          </tr>
          </table>
          <input type="hidden" value="" id="elrend" name="elrend">
          </form>
     </div>
     <div>
         <img src="./res/images/hatt_03.png">
     </div>
</div>
</body>
</html>