import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LANGUAGES = {
  en: {
    code: 'en',
    label: 'English',
    flag: '🇺🇸',
    flagAlt: 'US Flag',
  },
  am: {
    code: 'am',
    label: 'አማርኛ',
    flag: '🇪🇹',
    flagAlt: 'Ethiopian Flag',
  },
};

const translations = {
  en: {
    nav: {
      home: 'Home',
      story: 'Story',
      pillars: 'Pillars',
      places: 'Places',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Discover Ethiopia',
      title: 'Land of Origins',
      subtitle: 'Three thousand years of civilization. Thirteen months of sunshine. One extraordinary culture waiting to be discovered.',
      cta: 'Explore Places',
    },
    about: {
      eyebrow: 'About Ethiopia',
      title: 'The Cradle of Humanity',
      p1: 'Ethiopia stands alone — the only African nation never colonized, the birthplace of coffee, home to the Ark of the Covenant, and cradle of humanity itself. Lucy, our oldest ancestor, took her first steps here 3.2 million years ago.',
      p2: 'With over 80 ethnic groups, 9 UNESCO World Heritage Sites, and landscapes ranging from the Simien Mountains to the Danakil Depression, Ethiopia is a universe of contrasts that has inspired wonder for millennia.',
      stat1Label: 'Years of History',
      stat2Label: 'UNESCO Sites',
      stat3Label: 'Ethnic Groups',
      stat4Label: 'Months of Sunshine',
    },
    places: {
      eyebrow: 'Iconic Destinations',
      title: 'Ethiopian Heritage Sites',
      subtitle: 'Explore the landmarks that define Ethiopian civilization — from ancient rock-hewn churches to medieval castles, sacred monasteries to natural wonders.',
      categories: {
        all: 'All',
        unesco: 'UNESCO Sites',
        religious: 'Religious',
        historical: 'Historical',
        natural: 'Natural',
        museums: 'Museums',
      },
    },
    story: {
      eyebrow: 'The Ethiopian Story',
      title: 'Carved in Stone, Kept in Memory',
      scrollHint: 'Scroll to continue',
      segments: [
        {
          chapter: 'Chapter I',
          heading: 'Dawn of Humanity',
          text: 'In the Afar depression, Lucy took her first upright steps 3.2 million years ago — and the human story began here.',
        },
        {
          chapter: 'Chapter II',
          heading: 'The Kingdom of Aksum',
          text: 'One of the four great powers of the ancient world. Aksum minted its own coins and traded with Rome, Persia and India.',
        },
        {
          chapter: 'Chapter III',
          heading: 'Hewn From Living Rock',
          text: 'In Lalibela, eleven churches were carved downward into the mountain itself — not built, but released from the stone.',
        },
        {
          chapter: 'Chapter IV',
          heading: 'Never Colonised',
          text: 'At Adwa in 1896, Ethiopia turned back a European empire — and became a symbol of sovereignty for a whole continent.',
        },
        {
          chapter: 'Chapter V',
          heading: 'A Living Heritage',
          text: 'Thirteen months of sunshine, eighty languages, one unbroken thread running from antiquity into tomorrow.',
        },
      ],
    },
    pillars: {
      eyebrow: 'Pillars of a Nation',
      title: 'Six Worlds in One Country',
      subtitle: 'Each pillar is a universe of its own — a way of living that has been refined for thousands of years.',
      items: [
        {
          title: 'The Birthplace of Coffee',
          native: 'ቡና — Buna',
          text: 'Found first in the forests of Kaffa. The ceremony that follows — roasting, grinding, three rounds poured — is less a drink than an act of hospitality.',
        },
        {
          title: 'Ancient Faith',
          native: 'እምነት — Faith',
          text: 'Among the oldest Christian nations on earth, and the first land outside Arabia to shelter Islam. Devotion here is carved into the landscape itself.',
        },
        {
          title: 'Living Traditions',
          native: 'ባህል — Culture',
          text: 'More than eighty peoples, each with its own music, weave, dance and calendar of celebration — held together rather than flattened.',
        },
        {
          title: 'Majestic Landscapes',
          native: 'ተፈጥሮ — Nature',
          text: 'From the Simien peaks at 4,550 metres to the Danakil at 125 metres below the sea — the roof of Africa and its furnace, in one country.',
        },
        {
          title: 'An Ancient Script',
          native: 'ግዕዝ — Ge\'ez',
          text: 'Ethiopia writes in its own alphabet, one of the few ancient scripts still in daily use — a living line back to antiquity.',
        },
        {
          title: 'Flavours of Ethiopia',
          native: 'ምግብ — Cuisine',
          text: 'Injera and wot, shared from a single platter by hand. The meal is designed so that no one eats alone.',
        },
      ],
    },
    voices: {
      eyebrow: 'Voices',
      title: 'Stories That Stay With You',
      subtitle: 'From those who have walked the rock churches, sat through the ceremony, and climbed the roof of Africa.',
    },
    footer: {
      tagline: 'Celebrating Ethiopia\'s timeless heritage.',
      copyright: '© 2025 Culture. Crafted for Ethiopia.',
      backToTop: 'Back to Top',
    },
  },
  am: {
    nav: {
      home: 'መነሻ',
      story: 'ታሪክ',
      pillars: 'ምሰሶዎች',
      places: 'ቦታዎች',
      about: 'ስለ',
      contact: 'ያግኙን',
    },
    hero: {
      eyebrow: 'ኢትዮጵያን ያግኙ',
      title: 'የስልጣኔ ምንጭ',
      subtitle: 'የሶስት ሺህ ዓመታት ስልጣኔ። አስራ ሶስት ወራት ፀሐይ። አንድ ድንቅ ባህል ለመገኘት ይጠብቃል።',
      cta: 'ቦታዎችን ያስሱ',
    },
    about: {
      eyebrow: 'ስለ ኢትዮጵያ',
      title: 'የሰው ልጅ ማቀፊያ',
      p1: 'ኢትዮጵያ ብቸኛዋ — ቅኝ ያልተገዛች የአፍሪካ ሀገር፣ የቡና ትውልድ ቦታ፣ የቃል ኪዳኑ ታቦት መኖሪያ፣ እና የሰው ልጅ ማቀፊያ ናት። ሉሲ፣ ቀደምት ቅድመ አያታችን፣ ከ3.2 ሚሊዮን ዓመታት በፊት የመጀመሪያ እርምጃዋን ያደረገችው እዚህ ነው።',
      p2: 'ከ80 በላይ ብሄረሰቦች፣ 9 የዩኔስኮ የዓለም ቅርስ ቦታዎች፣ እና ከስሜን ተራሮች እስከ ዳናኪል በረሃ የሚደርሱ መልክዓ ምድሮች ያሏት ኢትዮጵያ ለሺህ ዓመታት ድንቅን ያነሳሳች የተቃርኖ ዓለም ናት።',
      stat1Label: 'ዓመታት ታሪክ',
      stat2Label: 'የዩኔስኮ ቦታዎች',
      stat3Label: 'ብሄረሰቦች',
      stat4Label: 'ወራት ፀሐይ',
    },
    places: {
      eyebrow: 'ታዋቂ መዳረሻዎች',
      title: 'የኢትዮጵያ ቅርስ ቦታዎች',
      subtitle: 'የኢትዮጵያን ስልጣኔ የሚገልጹ ምልክቶችን ያስሱ — ከጥንታዊ የዐለት ቤተክርስቲያኖች እስከ የመካከለኛው ዘመን ቤተ-መንግስቶች፣ ከቅዱስ ገዳማት እስከ የተፈጥሮ ድንቆች።',
      categories: {
        all: 'ሁሉም',
        unesco: 'የዩኔስኮ',
        religious: 'ሃይማኖታዊ',
        historical: 'ታሪካዊ',
        natural: 'ተፈጥሮ',
        museums: 'ሙዚየሞች',
      },
    },
    story: {
      eyebrow: 'የኢትዮጵያ ታሪክ',
      title: 'በድንጋይ የተቀረጸ፣ በትውስታ የተጠበቀ',
      scrollHint: 'ለመቀጠል ይሸብልሉ',
      segments: [
        {
          chapter: 'ምዕራፍ ፩',
          heading: 'የሰው ልጅ ጎህ',
          text: 'በአፋር ሸለቆ ሉሲ ከ3.2 ሚሊዮን ዓመታት በፊት የመጀመሪያ እርምጃዋን አደረገች — የሰው ልጅ ታሪክ እዚህ ተጀመረ።',
        },
        {
          chapter: 'ምዕራፍ ፪',
          heading: 'የአክሱም መንግሥት',
          text: 'ከጥንቱ ዓለም አራት ታላላቅ ኃያላን አንዷ። አክሱም የራሷን ሳንቲም አትማ ከሮም፣ ከፋርስና ከህንድ ጋር ትገበያይ ነበር።',
        },
        {
          chapter: 'ምዕራፍ ፫',
          heading: 'ከሕያው ድንጋይ የተቀረጸ',
          text: 'በላሊበላ አስራ አንድ አብያተ ክርስቲያናት ወደ ተራራው ውስጥ ተቀርጸዋል — አልተገነቡም፤ ከድንጋዩ ተለቀቁ እንጂ።',
        },
        {
          chapter: 'ምዕራፍ ፬',
          heading: 'ቅኝ ያልተገዛች',
          text: 'በ1888 ዓ.ም. በዓድዋ ኢትዮጵያ የአውሮፓን ኃያል መልሳ አሳፈረች — ለመላው አህጉር የነጻነት ምልክት ሆነች።',
        },
        {
          chapter: 'ምዕራፍ ፭',
          heading: 'ሕያው ቅርስ',
          text: 'አስራ ሶስት ወር ፀሐይ፣ ሰማንያ ቋንቋዎች፣ ከጥንት እስከ ነገ የሚዘልቅ አንድ ያልተቋረጠ ክር።',
        },
      ],
    },
    pillars: {
      eyebrow: 'የሀገር ምሰሶዎች',
      title: 'በአንድ ሀገር ውስጥ ስድስት ዓለማት',
      subtitle: 'እያንዳንዱ ምሰሶ የራሱ ዓለም ነው — ለሺህ ዓመታት የተጠራ የአኗኗር ዘይቤ።',
      items: [
        {
          title: 'የቡና መገኛ',
          native: 'ቡና — Buna',
          text: 'መጀመሪያ በካፋ ጫካዎች ተገኘ። የሚከተለው ሥነ-ሥርዓት — መጥበስ፣ መፍጨት፣ ሶስት ዙር ማፍሰስ — ከመጠጥ በላይ የእንግዳ ተቀባይነት ተግባር ነው።',
        },
        {
          title: 'ጥንታዊ እምነት',
          native: 'እምነት — Faith',
          text: 'በምድር ላይ ካሉ ጥንታዊ ክርስቲያን ሀገራት አንዷ፣ እንዲሁም ከአረቢያ ውጭ እስልምናን ያስጠለለች የመጀመሪያዋ ምድር። እምነት እዚህ በመልክዓ ምድሩ ላይ ተቀርጿል።',
        },
        {
          title: 'ሕያው ወጎች',
          native: 'ባህል — Culture',
          text: 'ከሰማንያ በላይ ሕዝቦች፣ እያንዳንዳቸው የየራሳቸው ሙዚቃ፣ ሽመና፣ ዳንስና የበዓል ቀመር ያላቸው — ተጨፍልቀው ሳይሆን ተያይዘው የተያዙ።',
        },
        {
          title: 'ግርማ ሞገስ ያላቸው መልክዓ ምድሮች',
          native: 'ተፈጥሮ — Nature',
          text: 'ከ4,550 ሜትር የስሜን ጫፎች እስከ ከባህር ወለል በታች 125 ሜትር ዳናኪል — የአፍሪካ ጣሪያና እቶኗ በአንድ ሀገር።',
        },
        {
          title: 'ጥንታዊ ፊደል',
          native: 'ግዕዝ — Ge\'ez',
          text: 'ኢትዮጵያ በራሷ ፊደል ትጽፋለች፤ ዛሬም በየዕለቱ ከሚያገለግሉ ጥቂት ጥንታዊ ጽሑፎች አንዱ — ወደ ጥንት የሚወስድ ሕያው መስመር።',
        },
        {
          title: 'የኢትዮጵያ ጣዕሞች',
          native: 'ምግብ — Cuisine',
          text: 'እንጀራና ወጥ፣ ከአንድ ሰሃን በእጅ ተጋርቶ የሚበላ። ምግቡ ማንም ብቻውን እንዳይበላ ተደርጎ የተቀረጸ ነው።',
        },
      ],
    },
    voices: {
      eyebrow: 'ድምጾች',
      title: 'ከእርስዎ ጋር የሚቆዩ ታሪኮች',
      subtitle: 'የዐለት አብያተ ክርስቲያናትን ከረገጡ፣ ሥነ-ሥርዓቱን ከተካፈሉና የአፍሪካን ጣሪያ ከወጡ ሰዎች።',
    },
    footer: {
      tagline: 'የኢትዮጵያን ዘላለማዊ ቅርስ ማክበር።',
      copyright: '© 2025 ባህል። ለኢትዮጵያ ተሰርቷል።',
      backToTop: 'ወደ ላይ ተመለስ',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'en';
    }
    return 'en';
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'am' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  const t = translations[lang];
  const currentLang = LANGUAGES[lang];
  const otherLang = LANGUAGES[lang === 'en' ? 'am' : 'en'];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, currentLang, otherLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
