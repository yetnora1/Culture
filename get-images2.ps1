Start-Sleep -Seconds 5
$queries = @(
  @{id="awash";    q="Afar Triangle Ethiopia geological"},
  @{id="melka";    q="Melka Kunture archaeological site Ethiopia Awash"},
  @{id="yeha";     q="Temple of Yeha"},
  @{id="laketana"; q="Lake Tana Ethiopia island monastery"},
  @{id="alnejashi";q="Negash mosque Ethiopia"},
  @{id="dirre";    q="Sheikh Hussein Bale Ethiopia Islamic shrine"},
  @{id="sofomar";  q="Sof Omar Ethiopia cave"},
  @{id="adwa";     q="Adwa Ethiopia Tigray town"}
)
foreach ($item in $queries) {
  Start-Sleep -Seconds 2
  $enc = [uri]::EscapeDataString($item.q)
  $url = "https://en.m.wikipedia.org/w/api.php?action=query&list=search&srsearch=$enc&srlimit=1&format=json"
  try {
    $r = Invoke-RestMethod -Uri $url -TimeoutSec 15
    $title = $r.query.search[0].title
    if ($title) {
      $enc2 = [uri]::EscapeDataString($title)
      $url2 = "https://en.m.wikipedia.org/w/api.php?action=query&titles=$enc2&prop=pageimages&pithumbsize=1200&format=json"
      $r2 = Invoke-RestMethod -Uri $url2 -TimeoutSec 15
      $page = $r2.query.pages.PSObject.Properties.Value | Select-Object -First 1
      $thumb = $page.thumbnail.source
      Write-Host "$($item.id) [$title]: $thumb"
    } else {
      Write-Host "$($item.id): no result"
    }
  } catch {
    Write-Host "$($item.id): ERROR"
  }
}
