Start-Sleep -Seconds 5
$queries = @(
  @{id="bale";        title="Bale Mountains National Park"},
  @{id="cathedral";   title="Holy Trinity Cathedral, Addis Ababa"},
  @{id="entoto";      title="Mount Entoto"},
  @{id="dallol";      title="Danakil Depression"},
  @{id="unity";       title="Unity Park (Addis Ababa)"},
  @{id="awash";       title="Hadar (archaeological site)"},
  @{id="addis-univ";  title="Addis Ababa University"}
)
foreach ($item in $queries) {
  Start-Sleep -Seconds 3
  $enc = [uri]::EscapeDataString($item.title)
  $url = "https://en.m.wikipedia.org/w/api.php?action=query&titles=$enc&prop=pageimages&pithumbsize=1200&format=json"
  try {
    $r = Invoke-RestMethod -Uri $url -TimeoutSec 15
    $page = $r.query.pages.PSObject.Properties.Value | Select-Object -First 1
    $thumb = $page.thumbnail.source
    if ($thumb) {
      Write-Host "$($item.id): $thumb"
    } else {
      Write-Host "$($item.id): NO IMAGE for [$($page.title)]"
    }
  } catch { Write-Host "$($item.id): ERROR" }
}
