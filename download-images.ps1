# Download Ethiopian landmark images from Wikimedia Commons
# Using Invoke-WebRequest with a proper User-Agent

$images = @{
    "lalibela.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bete_Giyorgis-Lalibela_%283%29.jpg/1280px-Bete_Giyorgis-Lalibela_%283%29.jpg"
    "aksum.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Stela_aksum.jpg/800px-Stela_aksum.jpg"
    "fasil-ghebbi.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ET_Gondar_asv2018-02_img02_Fasil_Ghebbi.jpg/800px-ET_Gondar_asv2018-02_img02_Fasil_Ghebbi.jpg"
    "harar.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Harar%2C_Ethiopia_01.jpg/800px-Harar%2C_Ethiopia_01.jpg"
    "konso.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ET_Konso_asv2018-01_img47_Konso_village.jpg/800px-ET_Konso_asv2018-01_img47_Konso_village.jpg"
    "gedeo.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Landscape_in_the_Gedeo_Zone.jpg/800px-Landscape_in_the_Gedeo_Zone.jpg"
    "tiya.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Tiya_Ethiopian_World_Heritage_Site_Sept_2012.jpg/800px-Tiya_Ethiopian_World_Heritage_Site_Sept_2012.jpg"
    "awash.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/ET_Afar_asv2018-01_img33_Awash_River.jpg/800px-ET_Afar_asv2018-01_img33_Awash_River.jpg"
    "omo.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Omo_River_Valley_IMG_9873.jpg/800px-Omo_River_Valley_IMG_9873.jpg"
    "melka-kunture.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Melka_Kunture_01.jpg/800px-Melka_Kunture_01.jpg"
    "yeha.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/ET_Yeha_asv2018-01_img08_Great_Temple.jpg/800px-ET_Yeha_asv2018-01_img08_Great_Temple.jpg"
    "lake-tana.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lake_tana_church_1.jpg/800px-Lake_tana_church_1.jpg"
    "al-nejashi.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Al_Nejashi_Mosque_Negash_Tigrai_Ethiopia.jpg/800px-Al_Nejashi_Mosque_Negash_Tigrai_Ethiopia.jpg"
    "dirre-sheikh.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Dirre_Sheikh_Hussein_Shrine.jpg/800px-Dirre_Sheikh_Hussein_Shrine.jpg"
    "holy-trinity.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/ET_Addis_asv2018-01_img15_Holy_Trinity_Cathedral.jpg/800px-ET_Addis_asv2018-01_img15_Holy_Trinity_Cathedral.jpg"
    "entoto.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Entoto_Maryam_Church_Addis_Ababa_Ethiopia.jpg/800px-Entoto_Maryam_Church_Addis_Ababa_Ethiopia.jpg"
    "sof-omar.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Sof_Omar_Cave_-_entrance.jpg/800px-Sof_Omar_Cave_-_entrance.jpg"
    "simien.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Semien_Mountains_13.jpg/800px-Semien_Mountains_13.jpg"
    "danakil.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dallol-Ethiopie_%286%29.jpg/800px-Dallol-Ethiopie_%286%29.jpg"
    "national-museum.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/National_Museum_Addis_Abeba.jpg/800px-National_Museum_Addis_Abeba.jpg"
    "ethnographic.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/ET_Addis_asv2018-01_img17_Ethnographic_Museum.jpg/800px-ET_Addis_asv2018-01_img17_Ethnographic_Museum.jpg"
    "unity-park.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ethiopian_Parliament2.jpg/800px-Ethiopian_Parliament2.jpg"
    "adwa.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Adwa1.jpg/800px-Adwa1.jpg"
}

$outputDir = "c:\Users\pc\Desktop\Culture\public\images"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
$count = 0

foreach ($entry in $images.GetEnumerator()) {
    $count++
    $outFile = Join-Path $outputDir $entry.Key
    Write-Host "[$count/$($images.Count)] Downloading $($entry.Key)..."
    try {
        Invoke-WebRequest -Uri $entry.Value -OutFile $outFile -Headers $headers -TimeoutSec 15
        $size = (Get-Item $outFile).Length
        Write-Host "  OK ($([math]::Round($size/1024))KB)"
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)"
    }
}

Write-Host "`nDone! Downloaded $count images."
