/**
 * Ethiopian iconic places.
 *
 * Every `image` is a full Wikimedia Commons thumbnail URL, written out rather
 * than assembled from parts — the hash directory (e.g. `a/aa/`) cannot be
 * derived from the filename, so each URL has to be resolved through the
 * Commons API and pasted in. All 22 were verified to return image/jpeg.
 */

const places = [
  // ====================== UNESCO WORLD HERITAGE SITES ======================
  {
    id: 'lalibela',
    category: 'unesco',
    name: { en: 'Rock-Hewn Churches of Lalibela', am: 'የላሊበላ ውቅር አብያተ ክርስቲያናት' },
    location: { en: 'Amhara Region', am: 'አማራ ክልል' },
    description: {
      en: 'Carved entirely from living rock in the 12th century by King Lalibela, these eleven medieval monolithic churches are often called the "Eighth Wonder of the World." The most famous, Bet Giyorgis (Church of St. George), is carved in the shape of a cross and sits in a deep trench. A UNESCO World Heritage Site and Ethiopia\'s most iconic landmark.',
      am: 'በ12ኛው ክፍለ ዘመን በንጉሥ ላሊበላ ከጥሬ ድንጋይ ላይ የተቀረጹት አስራ አንድ ቤተ ክርስቲያናት "ስምንተኛው የዓለም ድንቅ" ተብለው ይጠራሉ። ቤተ ጊዮርጊስ በመስቀል ቅርጽ ተቀርጾ ጥልቅ ጉድጓድ ውስጥ ይገኛል། የዩኔስኮ የዓለም ቅርስ ነው።',
    },
    // Confirmed from Wikipedia API: pageimage = Lalibela,_san_giorgio,_esterno_24.jpg
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lalibela%2C_san_giorgio%2C_esterno_24.jpg/1280px-Lalibela%2C_san_giorgio%2C_esterno_24.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '12th Century',
  },
  {
    id: 'aksum',
    category: 'unesco',
    name: { en: 'Stelae of Aksum', am: 'የአክሱም ሐውልቶች' },
    location: { en: 'Tigray Region', am: 'ትግራይ ክልል' },
    description: {
      en: 'The ruins of the ancient city of Aksum mark the heart of one of the greatest civilizations of the ancient world. The towering granite obelisks (stelae), some over 20 meters tall, stand as monuments to a kingdom that was once one of four great powers of the ancient world. Aksum is also believed to house the Ark of the Covenant.',
      am: 'የጥንቷ አክሱም ከተማ ፍርስራሾች ዓለምን ከሚነዱ ጥንታዊ ስልጣኔዎች አንዱን ያሳያሉ። ረጃጅም የግራናይት ሐውልቶች ከ20 ሜትር በላይ ቁመት ያላቸው ናቸው። አክሱም የቃል ኪዳኑ ታቦት እንደሚገኝባት ይታሰባል።',
    },
    // Confirmed from Wikipedia API: pageimage = Aksum-107529.jpg
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Aksum-107529.jpg/1280px-Aksum-107529.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '4th Century',
  },
  {
    id: 'fasil-ghebbi',
    category: 'unesco',
    name: { en: 'Fasil Ghebbi (Royal Enclosure)', am: 'ፋሲል ግቢ' },
    location: { en: 'Gondar, Amhara', am: 'ጎንደር፣ አማራ' },
    description: {
      en: 'Known as the "Camelot of Africa," Fasil Ghebbi is a fortress-city surrounded by a 900-meter wall. Built by Emperor Fasilides in the 17th century, the enclosure contains castles, palaces, churches, and monasteries blending Indian, Portuguese, Moorish, and indigenous Ethiopian architectural styles into a unique royal compound.',
      am: '"የአፍሪካ ካሜሎት" ፋሲል ግቢ በ900 ሜትር ግንብ የተከበበ ነው። በ17ኛው ክፍለ ዘመን በፋሲለደስ የተሰራ ሲሆን ቤተ-መንግስቶችን፣ አብያተ ክርስቲያናትን ይዟል።',
    },
    // Confirmed from Wikipedia API: pageimage = Fasilides_Palace_01.jpg (hash 8/8f confirmed)
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fasilides_Palace_01.jpg/1280px-Fasilides_Palace_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '17th Century',
  },
  {
    id: 'harar-jugol',
    category: 'unesco',
    name: { en: 'Harar Jugol', am: 'ሐረር ጁጎል' },
    location: { en: 'Harari Region', am: 'ሐረሪ ክልል' },
    description: {
      en: 'The ancient walled city of Harar is considered the fourth holiest city of Islam. With 82 mosques, 102 shrines, and a labyrinth of colorful narrow alleyways, it is one of the most unique urban landscapes in the world. The city is also famous for its "hyena men" who feed wild hyenas by hand each night.',
      am: 'ጥንታዊቷ የሐረር ግንብ ከተማ አራተኛዋ ቅድስት የእስልምና ከተማ ናት። 82 መስጊዶችን፣ 102 ቅዱስ ቦታዎችን ይዟል። ከተማዋ ጅቦችን በእጃቸው ባሚያበሉ "የጅብ ሰዎች" ትታወቃለች።',
    },
    // Confirmed from Wikipedia API: City_Gate,_Harar_Jugol_(14464345823).jpg (direct, no thumb)
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/City_Gate%2C_Harar_Jugol_%2814464345823%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '7th Century',
  },
  {
    id: 'konso',
    category: 'unesco',
    name: { en: 'Konso Cultural Landscape', am: 'የኮንሶ ባህላዊ መልክዓ ምድር' },
    location: { en: 'SNNPR', am: 'ደቡብ ክልል' },
    description: {
      en: 'The Konso landscape is a spectacular example of a living cultural tradition stretching back 21 generations. Stone-walled terraces and fortified hilltop settlements showcase extraordinary dry-stone engineering. Konso people erect wooden totems (wagas) to honor their warriors and maintain terraced hillside agriculture that has sustained the community for centuries.',
      am: 'የኮንሶ መልክዓ ምድር ለ21 ትውልዶች የዘለቀ ሕያው ባህላዊ ወግ ምሳሌ ነው። የድንጋይ ደረጃዎችና ሰፈሮች ድንቅ የድንጋይ ሥራ ናቸው። ዋጋ ሐውልቶችን ያቆማሉ።',
    },
    // Using Konso waga stelae image confirmed from Wikipedia
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Konso.jpg/1280px-Konso.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'Living Heritage',
  },
  {
    id: 'tiya',
    category: 'unesco',
    name: { en: 'Tiya Stelae', am: 'ትያ ሐውልቶች' },
    location: { en: 'SNNPR', am: 'ደቡብ ክልል' },
    description: {
      en: 'Tiya is the most important of approximately 160 archaeological sites in the Soddo region. The site contains 36 standing stones decorated with mysterious carved symbols including swords and a distinctive leaf-like motif. Their purpose and the civilization that erected them remain largely a mystery to scholars.',
      am: 'ትያ ከሶዶ አካባቢ 160 ቦታዎች ውስጥ ዋነኛው ነው። ሰይፎችን እና ቅጠል ቅርጽ ምልክቶች ያካተቱ 36 ቆሞ ድንጋዮችን ይዟል። ዓላማቸው ምስጢር ሆኖ ይቀራል።',
    },
    // Confirmed from Wikipedia API: Tiya_vue_d'ensemble.jpg (hash 9/94)
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tiya_vue_d%27ensemble.JPG/1280px-Tiya_vue_d%27ensemble.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '12th–14th Century',
  },
  {
    id: 'lower-awash',
    category: 'unesco',
    name: { en: 'Lower Valley of the Awash', am: 'የአዋሽ ዝቅተኛ ሸለቆ' },
    location: { en: 'Afar Region', am: 'አፋር ክልል' },
    description: {
      en: 'One of the most important paleoanthropological sites on Earth. This is where "Lucy" (Australopithecus afarensis) was discovered in 1974, pushing the known timeline of human evolution to 3.2 million years. The valley continues to yield remarkable fossil discoveries that reshape our understanding of human origins.',
      am: 'ምድር ላይ ካሉ ጠቃሚ ቅድመ-ታሪክ ቦታዎች አንዱ ነው። "ሉሲ" እዚህ ተገኝታ የሰው ልጅ ታሪክን ወደ 3.2 ሚሊዮን ዓመት ገፍቶታል።',
    },
    // Hadar/Afar fossils — use Afar Depression landscape image
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%22Lucy%22_Australopithecus.jpg/1280px-%22Lucy%22_Australopithecus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '3.2 Million Years',
  },
  {
    id: 'lower-omo',
    category: 'unesco',
    name: { en: 'Lower Valley of the Omo', am: 'የኦሞ ዝቅተኛ ሸለቆ' },
    location: { en: 'SNNPR', am: 'ደቡብ ክልል' },
    description: {
      en: 'A prehistoric site near Lake Turkana fundamental to understanding human evolution. Fossils and stone tools dating back over 2 million years have been found here. The Omo Valley is also home to the Mursi, Hammer, and Karo tribes — among the most culturally distinct indigenous peoples on the continent.',
      am: 'ከቱርካና ሐይቅ አቅራቢያ የሚገኝ ቅድመ-ታሪክ ቦታ ነው። ከ2 ሚሊዮን ዓመት ቅሪተ-አካላት ተገኝተዋል። ሙርሲ፣ ሐመርና ካሮ ጎሳዎች መኖሪያ ነው።',
    },
    // Mursi tribe Omo Valley
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Omo_River_02.jpg/1280px-Omo_River_02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '2+ Million Years',
  },
  {
    id: 'melka-kunture',
    category: 'unesco',
    name: { en: 'Melka Kunture & Balchit', am: 'መልካ ቁንጡሬ እና ባልጪት' },
    location: { en: 'Oromia Region', am: 'ኦሮሚያ ክልል' },
    description: {
      en: 'A complex of prehistoric and paleontological sites along the upper Awash River valley. Melka Kunture has yielded stone tools spanning nearly 1.7 million years of human prehistory, making it one of the longest continuously occupied archaeological landscapes in the world, inscribed as a UNESCO World Heritage Site in 2023.',
      am: 'የላይኛው አዋሽ ሸለቆ ቅድመ-ታሪክ ቦታ ስብስብ ነው። ከ1.7 ሚሊዮን ዓመት ድንጋይ መሣሪያዎች ተገኝተዋል።',
    },
    // Melka Kunture - Awash River valley prehistoric landscape
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Habitat_of_Garra_makiensis_%2810.3897-zookeys.984.55982%29_Figure_10.jpg/1280px-Habitat_of_Garra_makiensis_%2810.3897-zookeys.984.55982%29_Figure_10.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '1.7 Million Years',
  },

  // ====================== RELIGIOUS SITES ======================
  {
    id: 'yeha-temple',
    category: 'religious',
    name: { en: 'Great Temple of Yeha', am: 'የየሐ ታላቅ ቤተ መቅደስ' },
    location: { en: 'Tigray Region', am: 'ትግራይ ክልል' },
    description: {
      en: 'The oldest standing structure in Ethiopia, dating to the 8th century BC. This pre-Aksumite temple was built with remarkable precision — its massive sandstone blocks fit together without mortar. It stands as evidence of an advanced Sabaean-influenced civilization that predates the Kingdom of Aksum.',
      am: 'ከክ.ል.በ 8ኛው ክፍለ ዘመን ጀምሮ ቆሞ ያለ ጥንታዊ ግንባታ ነው። ሲሚንቶ ሳይጠቀም የተሠሩ ግዙፍ ድንጋዮች ያሏት ቤተ መቅደስ ናት።',
    },
    // Confirmed: Yeha temple exterior image
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/ET_Tigray_asv2018-01_img32_Yeha.jpg/1280px-ET_Tigray_asv2018-01_img32_Yeha.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '8th Century BC',
  },
  {
    id: 'lake-tana-monasteries',
    category: 'religious',
    name: { en: 'Lake Tana Island Monasteries', am: 'የጣና ሐይቅ ገዳማት' },
    location: { en: 'Amhara Region', am: 'አማራ ክልል' },
    description: {
      en: 'Scattered across the 37 islands of Lake Tana — Ethiopia\'s largest lake and source of the Blue Nile — are some of the country\'s oldest sacred monasteries dating from the 14th century. They shelter priceless religious art, royal tombs, and ancient Ge\'ez manuscripts, many still closed to women visitors.',
      am: 'የጣና ሐይቅ 37 ደሴቶች ላይ ከ14ኛው ክፍለ ዘመን ጀምሮ ያሉ ጥንታዊ ገዳማት ይገኛሉ። ሃይማኖታዊ ስነ-ጥበብ፣ ንጉሣዊ መቃብሮች እና ጥንታዊ ጽሑፎች ያስጠብቃሉ።',
    },
    // Confirmed: Lake Tana direct image
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Lake_tana.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
    year: '14th Century',
  },
  {
    id: 'al-nejashi',
    category: 'religious',
    name: { en: 'Al-Nejashi Mosque', am: 'አል-ነጃሺ መስጊድ' },
    location: { en: 'Tigray Region', am: 'ትግራይ ክልል' },
    description: {
      en: 'Considered the first mosque in Africa, Al-Nejashi was built by the companions of Prophet Muhammad who found refuge in the Kingdom of Aksum in 615 AD. The Aksumite King Nejashi protected them, making Ethiopia the first country outside Arabia to accept Islam. The mosque remains an important pilgrimage site.',
      am: 'በ615 ዓ.ም. የነቢዩ ሙሐመድ ተከታዮች ባሠሩት ይህ በአፍሪካ የመጀመሪያው መስጊድ ተደርጎ ይታሰባል። ኢትዮጵያ ከአረቢያ ውጭ እስልምናን የተቀበለች የመጀመሪያ ሀገር ሆናለች።',
    },
    // Confirmed: Al-Nejashi mosque, Negash Ethiopia
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Negash%2C_la_moschea_sul_sito_della_pi%C3%B9_antica_moschea_d%27etiopia%2C_del_vii_secolo_03.jpg/1280px-Negash%2C_la_moschea_sul_sito_della_pi%C3%B9_antica_moschea_d%27etiopia%2C_del_vii_secolo_03.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '615 AD',
  },
  {
    id: 'dirre-sheikh-hussein',
    category: 'religious',
    name: { en: 'Dirre Sheikh Hussein', am: 'ድሬ ሼህ ሁሴን' },
    location: { en: 'Bale Zone, Oromia', am: 'ባሌ ዞን፣ ኦሮሚያ' },
    description: {
      en: 'A revered Islamic pilgrimage site centered around the shrine of Sheikh Hussein, a 12th-century Muslim saint. Tens of thousands of pilgrims visit twice yearly for celebrations that beautifully blend Islamic devotion with ancient Oromo traditions, creating a unique spiritual and cultural experience in southeastern Ethiopia.',
      am: 'ሼህ ሁሴን መቃብር ዙሪያ ያተኮረ የተከበረ የእስልምና ሐጅ ቦታ ነው። በዓመት ሁለት ጊዜ ብዙ ሺህ ጎብኚዎች ይጎበኛሉ።',
    },
    // Sheikh Hussein shrine Bale — use Bale Mountains National Park image
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Sheikh_Hussein.jpg/1280px-Sheikh_Hussein.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '12th Century',
  },
  {
    id: 'holy-trinity-cathedral',
    category: 'religious',
    name: { en: 'Holy Trinity Cathedral', am: 'ቅድስት ሥላሴ ካቴድራል' },
    location: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    description: {
      en: 'The most important cathedral in Ethiopia and final resting place of Emperor Haile Selassie and his wife. Built in 1941 to commemorate liberation from Italian occupation, the cathedral features stunning stained-glass windows, Italian marble floors, and detailed murals depicting biblical scenes and Ethiopian history.',
      am: 'በኢትዮጵያ ዋነኛ ካቴድራል ሲሆን የንጉሠ ነገሥት ኃይለ ሥላሴ የመቃብር ቦታ ነው። ባለቀለም መስታወቶችን፣ ዕብነ በረድ ወለልና ሥዕሎችን ይዟል።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Holy_Trinity_Cathedral%2C_Addis_Ababa_%283434312871%29.jpg/1280px-Holy_Trinity_Cathedral%2C_Addis_Ababa_%283434312871%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '1941',
  },
  {
    id: 'entoto-maryam',
    category: 'religious',
    name: { en: 'Entoto Maryam Church', am: 'እንጦጦ ማርያም ቤተ ክርስቲያን' },
    location: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    description: {
      en: 'Perched atop Mount Entoto at 3,200m, this octagonal church was built by Emperor Menelik II in 1882. It was here that Menelik was crowned King of Kings. The adjacent museum houses his throne and coronation robes. The surrounding eucalyptus forest — planted by Empress Taytu — now forms one of Addis Ababa\'s beloved green lungs.',
      am: 'እንጦጦ ተራራ (3,200ሜ) ላይ ይገኛል። በምኒልክ ዳግማዊ በ1882 ተሠርቷል። ምኒልክ ንጉሠ ነገሥት ሆነው የተቀቡት እዚህ ነው።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Entoto_Maryam_Church_in_Addis_Ababa.jpg/1280px-Entoto_Maryam_Church_in_Addis_Ababa.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '1882',
  },

  // ====================== NATURAL WONDERS ======================
  {
    id: 'sof-omar',
    category: 'natural',
    name: { en: 'Sof Omar Caves', am: 'ሶፍ ኦማር ዋሻዎች' },
    location: { en: 'Bale Zone, Oromia', am: 'ባሌ ዞን፣ ኦሮሚያ' },
    description: {
      en: 'The longest cave system in Ethiopia and one of the most spectacular in Africa. The Weib River has carved 15 kilometers of passages through limestone, creating vast chambers with soaring pillars and cathedral-like spaces. The caves hold both Islamic and traditional Oromo spiritual significance and are visited by pilgrims year-round.',
      am: 'ኢትዮጵያ ረጅሙ ዋሻ ስርዓት ሲሆን ወይብ ወንዝ 15 ኪሜ ቆፍሮ ፈጥሯቸዋል። እስላማዊ እና የኦሮሞ ባህላዊ ጠቀሜታ አላቸው።',
    },
    // Sof Omar — use Bale region landscape
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Sof_Omer_Cave%2C_Ethiopia_%2823194314604%29.jpg/1280px-Sof_Omer_Cave%2C_Ethiopia_%2823194314604%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'Natural Wonder',
  },
  {
    id: 'simien-mountains',
    category: 'natural',
    name: { en: 'Simien Mountains', am: 'ስሜን ተራሮች' },
    location: { en: 'Amhara Region', am: 'አማራ ክልል' },
    description: {
      en: 'Known as the "Roof of Africa," the Simien Mountains feature dramatic escarpments, deep valleys, and towering peaks including Ras Dashen (4,550m), Ethiopia\'s highest point. Home to the Gelada baboon, Ethiopian wolf, and Walia ibex — all found nowhere else on Earth. A UNESCO World Heritage Site for its outstanding natural beauty.',
      am: '"የአፍሪካ ጣሪያ" ስሜን ተራሮች ድንቅ ተፈጥሮ ያሏቸው ናቸው። ሩስ ዳሽን (4,550ሜ) ከፍተኛ ነጥቡ ነው። ጀላዳ ዝንጀሮ፣ የኢትዮጵያ ተኩላ ና ዋልያ ይገኛሉ።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bwahit%2C_view_onto_Kidis_Yared_4453m.JPG/1280px-Bwahit%2C_view_onto_Kidis_Yared_4453m.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'UNESCO Natural Site',
  },
  {
    id: 'danakil',
    category: 'natural',
    name: { en: 'Danakil Depression', am: 'ዳናኪል በረሃ' },
    location: { en: 'Afar Region', am: 'አፋር ክልል' },
    description: {
      en: 'One of the most extreme landscapes on Earth — 125 meters below sea level, with average temperatures exceeding 50°C. The Danakil features neon-colored sulfur springs at Dallol, vast salt flats harvested by the Afar people for millennia, and the active Erta Ale volcano with one of the world\'s few permanent lava lakes.',
      am: 'ምድር ላይ ካሉ ልዩ መልክዓ ምድሮች አንዱ — ከባሕር ወለል 125ሜ በታች። ዳሎሎ ሰልፈሬ ምንጮች፣ ሰፊ የጨው ሜዳዎችና ንቁ ኤርታ ኣለ ጉሞራ ያሏት ናት።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/ET_Afar_asv2018-01_img16_Dallol.jpg/1280px-ET_Afar_asv2018-01_img16_Dallol.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'Natural Wonder',
  },

  // ====================== MUSEUMS & LANDMARKS ======================
  {
    id: 'national-museum',
    category: 'museums',
    name: { en: 'National Museum of Ethiopia', am: 'የኢትዮጵያ ብሔራዊ ሙዚየም' },
    location: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    description: {
      en: 'Home to "Lucy" — the 3.2-million-year-old fossilized skeleton of Australopithecus afarensis — the National Museum is one of Africa\'s most important institutions. It houses artifacts spanning Ethiopia\'s entire history, from prehistoric fossils to imperial regalia, traditional arts, and contemporary works across four floors.',
      am: 'የ3.2 ሚሊዮን ዓመት "ሉሲ" ቅሪተ-አካልን የሚያስጠብቀው ሙዚየም ከአፍሪካ ቁልፍ ሙዚየሞች አንዱ ነው። ቅድመ-ታሪክ ቅሪተ-አካላት፣ ንጉሣዊ ቅርሶች ይዟል።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Ethiopian_National_Museum_in_Addis_Ababa.jpg/1280px-Ethiopian_National_Museum_in_Addis_Ababa.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'Est. 1944',
  },
  {
    id: 'ethnographic-museum',
    category: 'museums',
    name: { en: 'Ethnographic Museum', am: 'ስነ-ሰብ ሙዚየም' },
    location: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    description: {
      en: 'Housed in the former palace of Emperor Haile Selassie on the Addis Ababa University campus, this museum offers a rich journey through Ethiopia\'s 80+ ethnic groups. Exhibits cover traditional costumes, musical instruments, religious objects, and daily life. The palace bedroom and bath are preserved exactly as the Emperor left them.',
      am: 'የአዲስ አበባ ዩኒቨርሲቲ ግቢ ውስጥ የቀድሞ ቤተ-መንግስት ውስጥ ይገኛል። ሙዚየሙ ባህላዊ ልብስ፣ ሙዚቃ መሣሪያዎችና ሃይማኖታዊ ቅርሶችን ያቀርባል።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/ET_Addis_asv2018-01_img13_University_gate.jpg/1280px-ET_Addis_asv2018-01_img13_University_gate.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'Est. 1963',
  },
  {
    id: 'unity-park',
    category: 'museums',
    name: { en: 'Unity Park & Menelik Palace', am: 'አንድነት ፓርክ እና ምኒልክ ቤተ-መንግስት' },
    location: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    description: {
      en: 'Opened in 2019, Unity Park transformed the Grand Palace grounds into a public celebration of Ethiopian heritage. Visitors explore Emperor Menelik II\'s throne room, Emperor Haile Selassie\'s private quarters, a zoo with endemic Ethiopian wildlife, beautiful gardens representing all of Ethiopia\'s regions, and a full history of the palace compound.',
      am: 'በ2019 የተከፈተው አንድነት ፓርክ ቀደም ሲል የተከለከለውን ቤተ-መንግስት ቦታ ሕዝባዊ ቦታ አድርጎታል። ምኒልክ ዙፋን ክፍልና ኃይለ ሥላሴ ክፍልን ማየት ይቻላል።',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ethiopia_IMG_5739_Addis_Abeba_%2825053274207%29.jpg/1280px-Ethiopia_IMG_5739_Addis_Abeba_%2825053274207%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: 'Est. 2019',
  },

  // ====================== HISTORICAL ======================
  {
    id: 'adwa',
    category: 'historical',
    name: { en: 'Adwa Victory Monument', am: 'የዓድዋ ድል ሐውልት' },
    location: { en: 'Addis Ababa & Adwa, Tigray', am: 'አዲስ አበባ እና ዓድዋ' },
    description: {
      en: 'The Battle of Adwa on March 1, 1896 was one of the most decisive moments in African history. Ethiopia\'s forces, led by Emperor Menelik II and Empress Taytu, defeated Italy\'s invading army — making Ethiopia the only African nation to successfully repel a European colonial power. The victory inspired pan-African independence movements worldwide.',
      am: 'መጋቢት 1 1896 የዓድዋ ጦርነት ታሪካዊ ጊዜ ነበር። ምኒልክ ዳግማዊና እቴጌ ጣይቱ ይ이끄는 ሀይሎች ጣሊያንን አሸነፉ። ኢትዮጵያ ቅኝ ግዛትን ያሸነፈች ብቸኛ አፍሪካ ሀገር ሆናለች።',
    },
    // Confirmed: Adwa battle commemorative painting
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Adoua_1.jpg/1280px-Adoua_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    year: '1896',
  },
];

export default places;

export const categories = [
  { id: 'all', en: 'All', am: 'ሁሉም' },
  { id: 'unesco', en: 'UNESCO Sites', am: 'የዩኔስኮ' },
  { id: 'religious', en: 'Religious', am: 'ሃይማኖታዊ' },
  { id: 'historical', en: 'Historical', am: 'ታሪካዊ' },
  { id: 'natural', en: 'Natural', am: 'ተፈጥሮ' },
  { id: 'museums', en: 'Museums', am: 'ሙዚየሞች' },
];
