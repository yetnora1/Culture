Start-Sleep -Seconds 3
$queries = @(
  @{id="holy-trinity"; title="Holy Trinity Cathedral Addis Ababa"},
  @{id="entoto";       title="Entoto"},
  @{id="sof-omar";     title="Sof Omar Caves"},
  @{id="simien";       title="Simien Mountains"},
  @{id="dallol";       title="Dallol"},
  @{id="nat-museum";   title="National Museum of Ethiopia"},
  @{id="ethno-museum"; title="Ethnographic Museum Addis Ababa"},
  @{id="unity-park";   title="Unity Park Addis Ababa"},
  @{id="adwa";         title="Battle of Adwa"},
  @{id="melka";        title="Melka Kunture"}
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
      Write-Host "$($item.id): NO IMAGE (page: $($page.title))"
    }
  } catch {
    Write-Host "$($item.id): ERROR"
  }
}
