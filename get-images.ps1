$queries = @(
  @{id="konso";    q="Konso Cultural Landscape"},
  @{id="tiya";     q="Tiya archaeological site Ethiopia"},
  @{id="awash";    q="Lower Valley of the Awash paleoanthropology"},
  @{id="omo";      q="Lower Valley of the Omo Ethiopia UNESCO"},
  @{id="melka";    q="Melka Kunture prehistoric Ethiopia"},
  @{id="yeha";     q="Yeha temple Ethiopia Tigray"},
  @{id="laketana"; q="Lake Tana monastery Ethiopia"},
  @{id="alnejashi";q="Al-Nejashi mosque Negash Ethiopia"},
  @{id="dirre";    q="Sheikh Hussein shrine Bale Oromia"},
  @{id="sofomar";  q="Sof Omar caves Ethiopia"},
  @{id="adwa";     q="Battle of Adwa Ethiopia 1896"}
)

foreach ($item in $queries) {
  $enc = [uri]::EscapeDataString($item.q)
  $url = "https://en.m.wikipedia.org/w/api.php?action=query&list=search&srsearch=$enc&srlimit=1&format=json"
  try {
    $r = Invoke-RestMethod -Uri $url -TimeoutSec 10
    $title = $r.query.search[0].title
    if ($title) {
      $enc2 = [uri]::EscapeDataString($title)
      $url2 = "https://en.m.wikipedia.org/w/api.php?action=query&titles=$enc2&prop=pageimages&pithumbsize=1200&format=json"
      $r2 = Invoke-RestMethod -Uri $url2 -TimeoutSec 10
      $page = $r2.query.pages.PSObject.Properties.Value | Select-Object -First 1
      $thumb = $page.thumbnail.source
      Write-Host "$($item.id) [$title]: $thumb"
    } else {
      Write-Host "$($item.id): no search result"
    }
  } catch {
    Write-Host "$($item.id): ERROR - $_"
  }
  Start-Sleep -Milliseconds 500
}
