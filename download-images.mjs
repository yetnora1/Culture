// Download from Wikimedia using FULL resolution (no thumbnail restrictions)
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OUT = './public/images';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Full-resolution URLs (no /thumb/ path = no size restrictions)
const images = {
  'lalibela.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bete_Giyorgis_Lalibela_Ethiopia.jpg',
  'aksum.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/65/Stela_aksum.jpg',
  'fasil-ghebbi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/ET_Gondar_asv2018-02_img02_Fasil_Ghebbi.jpg',
  'harar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Harar%2C_Ethiopia_01.jpg',
  'konso.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/ET_Konso_asv2018-01_img47_Konso_village.jpg',
  'tiya.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Tiya_Ethiopian_World_Heritage_Site_Sept_2012.jpg',
  'awash.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/58/ET_Afar_asv2018-01_img33_Awash_River.jpg',
  'yeha.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/ET_Yeha_asv2018-01_img08_Great_Temple.jpg',
  'lake-tana.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Lake_tana_church_1.jpg',
  'al-nejashi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/32/Al_Nejashi_Mosque_Negash_Tigrai_Ethiopia.jpg',
  'holy-trinity.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/ET_Addis_asv2018-01_img15_Holy_Trinity_Cathedral.jpg',
  'simien.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/01/Semien_Mountains_13.jpg',
  'danakil.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dallol-Ethiopie_%286%29.jpg',
  'national-museum.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/53/National_Museum_Addis_Abeba.jpg',
  'ethnographic.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/ET_Addis_asv2018-01_img17_Ethnographic_Museum.jpg',
  'unity-park.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Ethiopian_Parliament2.jpg',
  'adwa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Adwa1.jpg',
  'sof-omar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Sof_Omar_Cave_-_entrance.jpg',
  'entoto.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Entoto_Maryam_Church_Addis_Ababa_Ethiopia.jpg',
  'omo.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Omo_River_Valley_IMG_9873.jpg',
  'gedeo.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Landscape_in_the_Gedeo_Zone.jpg',
  'melka-kunture.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Melka_Kunture_01.jpg',
  'dirre-sheikh.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Dirre_Sheikh_Hussein_Shrine.jpg',
};

const headers = {
  'User-Agent': 'CultureEthiopiaProject/1.0 (educational project; https://github.com/culture-ethiopia)',
  'Accept': 'image/*,*/*',
};

let ok = 0, fail = 0;

for (const [filename, url] of Object.entries(images)) {
  process.stdout.write(`[${ok+fail+1}/${Object.keys(images).length}] ${filename}... `);
  try {
    const res = await fetch(url, { headers, redirect: 'follow' });
    if (!res.ok) {
      console.log(`FAIL (${res.status})`);
      fail++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) {
      console.log(`FAIL (too small: ${buf.length}b - probably error page)`);
      fail++;
      continue;
    }
    writeFileSync(join(OUT, filename), buf);
    console.log(`OK (${Math.round(buf.length / 1024)}KB)`);
    ok++;
  } catch (e) {
    console.log(`FAIL (${e.message})`);
    fail++;
  }
}

console.log(`\nDone: ${ok} OK, ${fail} failed out of ${ok+fail}`);
