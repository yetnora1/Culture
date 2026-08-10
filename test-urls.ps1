$urls = @(
  "Bale_Mountains=https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bale_Mountains_National_Park.jpg/1280px-Bale_Mountains_National_Park.jpg",
  "Bole_Cathedral=https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Bole_Medhane_Alem_Cathedral%2C_Addis_Ababa.jpg/1280px-Bole_Medhane_Alem_Cathedral%2C_Addis_Ababa.jpg",
  "Entoto_Hill=https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Entoto_Hill_Addis_Ababa.jpg/1280px-Entoto_Hill_Addis_Ababa.jpg",
  "Dallol=https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Dallol_Ethiopia.jpg/1280px-Dallol_Ethiopia.jpg",
  "Unity_Park=https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Unity_Park%2C_Addis_Ababa_%282019%29.jpg/1280px-Unity_Park%2C_Addis_Ababa_%282019%29.jpg",
  "Awash_River=https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/ET_Afar_asv2018-01_img30_Awash_River.jpg/1280px-ET_Afar_asv2018-01_img30_Awash_River.jpg",
  "Afar_Triangle=https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Afar_triangle.jpg/1280px-Afar_triangle.jpg",
  "ET_Addis_Univ=https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/ET_Addis_asv2018-01_img13_University_gate.jpg/1280px-ET_Addis_asv2018-01_img13_University_gate.jpg",
  "Sof_Omar=https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Sof_Omer_Cave%2C_Ethiopia_%2823194314604%29.jpg/1280px-Sof_Omer_Cave%2C_Ethiopia_%2823194314604%29.jpg",
  "Konso=https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Konso.jpg/1280px-Konso.jpg",
  "Yeha=https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/ET_Tigray_asv2018-01_img32_Yeha.jpg/1280px-ET_Tigray_asv2018-01_img32_Yeha.jpg",
  "Al_Nejashi=https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Negash%2C_la_moschea_sul_sito_della_pi%C3%B9_antica_moschea_d%27etiopia%2C_del_vii_secolo_03.jpg/1280px-Negash%2C_la_moschea_sul_sito_della_pi%C3%B9_antica_moschea_d%27etiopia%2C_del_vii_secolo_03.jpg"
)

foreach ($entry in $urls) {
  $parts = $entry -split '='
  $name = $parts[0]
  $url = $parts[1..($parts.Length-1)] -join '='
  try {
    $r = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "OK $name ($($r.StatusCode))"
  } catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Host "FAIL $name (HTTP $status)"
  }
  Start-Sleep -Milliseconds 500
}
