const meaning = (ru, en, ar) => ({ ru, en, ar });

const SAYYID_ISTIGHFAR = {
  id: 'sayyid-istighfar',
  name: { ru: 'Саййид аль-истигфар', en: 'Sayyid al-Istighfar', ar: 'سيد الاستغفار' },
  arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
  repetitions: 1,
  meaning: meaning(
    'О Аллах, Ты мой Господь. Я признаю Твои милости и свой грех, прошу Тебя простить меня и защитить от зла моих поступков.',
    'O Allah, You are my Lord. I acknowledge Your blessings and my sin, ask Your forgiveness, and seek refuge from the evil of what I have done.',
    'اللهم أنت ربي، أعترف بنعمتك وبذنبي، وأسألك المغفرة وأعوذ بك من شر ما صنعت.'
  ),
  reference: 'Аль-Бухари',
};

const TAHLIL = {
  id: 'tahlil',
  name: { ru: 'Единобожие и хвала', en: 'Tahlil and praise', ar: 'التهليل والحمد' },
  arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
  repetitions: 10,
  meaning: meaning(
    'Нет достойного поклонения, кроме одного Аллаха, у Которого нет сотоварища. Ему принадлежит власть и хвала, и Он способен на всякую вещь.',
    'None has the right to be worshipped except Allah alone, without partner. His is the dominion and praise, and He has power over all things.',
    'لا معبود بحق إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.'
  ),
  reference: 'Ахмад',
};

const SUBHAN_100 = {
  id: 'subhan-100',
  name: { ru: 'Тасбих', en: 'Tasbih', ar: 'التسبيح' },
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  repetitions: 100,
  meaning: meaning(
    'Пречист Аллах и хвала Ему.',
    'Glory and praise be to Allah.',
    'سبحان الله وبحمده.'
  ),
  reference: 'Муслим',
};

const BISMILLAH_PROTECTION = {
  id: 'bismillah-protection',
  name: { ru: 'Защита именем Аллаха', en: 'Protection by Allah’s name', ar: 'التحصين باسم الله' },
  arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
  repetitions: 3,
  meaning: meaning(
    'С именем Аллаха, с Которым ничто не причинит вред ни на земле, ни на небе. Он — Слышащий, Знающий.',
    'In the name of Allah, with whose name nothing can cause harm on earth or in heaven. He is the All-Hearing, All-Knowing.',
    'باسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.'
  ),
  reference: 'Ахмад, Ат-Тирмизи',
};

const AFIYAH = {
  id: 'afiyah',
  name: { ru: 'Дуа о благополучии', en: 'Supplication for well-being', ar: 'دعاء العافية' },
  arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
  repetitions: 1,
  meaning: meaning(
    'Просьба к Аллаху о прощении, благополучии и защите в религии, мирской жизни, семье и имуществе.',
    'A supplication asking Allah for forgiveness, well-being and protection in religion, worldly life, family and wealth.',
    'دعاء بسؤال الله العفو والعافية والحفظ في الدين والدنيا والأهل والمال.'
  ),
  reference: 'Ахмад, Абу Дауд',
};

const GHAYB = {
  id: 'ghayb',
  name: { ru: 'Защита от зла души и шайтана', en: 'Protection from the self and Satan', ar: 'الاستعاذة من شر النفس والشيطان' },
  arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
  repetitions: 1,
  meaning: meaning(
    'Обращение к Аллаху за защитой от зла собственной души, шайтана и причинения зла себе или другим.',
    'Seeking Allah’s protection from the evil of one’s own self, Satan, and causing harm to oneself or another Muslim.',
    'استعاذة بالله من شر النفس والشيطان ومن اقتراف السوء على النفس أو جرّه إلى مسلم.'
  ),
  reference: 'Ахмад, Ат-Тирмизи',
};

const RADIYTU = {
  id: 'radiytu',
  name: { ru: 'Довольство Аллахом и исламом', en: 'Contentment with Allah and Islam', ar: 'الرضا بالله والإسلام' },
  arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
  repetitions: 3,
  meaning: meaning(
    'Я доволен Аллахом как Господом, исламом как религией и Мухаммадом ﷺ как Пророком.',
    'I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.',
    'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.'
  ),
  reference: 'Ахмад, Абу Дауд',
};

const HAYYU_QAYYUM = {
  id: 'hayyu-qayyum',
  name: { ru: 'Йа Хаййу, йа Каййум', en: 'Ya Hayyu, Ya Qayyum', ar: 'يا حي يا قيوم' },
  arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
  repetitions: 1,
  meaning: meaning(
    'Просьба к Живому и Вечносущему исправить все дела и не оставлять человека наедине с самим собой даже на мгновение.',
    'A plea to the Ever-Living, Self-Sustaining One to set all affairs right and not leave a person to himself even for a moment.',
    'دعاء للحي القيوم بإصلاح الشأن كله وألا يكل العبد إلى نفسه طرفة عين.'
  ),
  reference: 'Ан-Насаи',
};

const HASBIYALLAH = {
  id: 'hasbiyallah',
  name: { ru: 'Достаточно мне Аллаха', en: 'Allah is sufficient for me', ar: 'حسبي الله' },
  arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
  repetitions: 7,
  meaning: meaning(
    'Достаточно мне Аллаха. Нет достойного поклонения, кроме Него. На Него я уповаю, и Он — Господь Великого Трона.',
    'Allah is sufficient for me. None has the right to be worshipped but Him. I rely upon Him, and He is Lord of the Mighty Throne.',
    'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.'
  ),
  reference: 'Абу Дауд',
};

const SUBHAN_CREATION = {
  id: 'subhan-creation',
  name: { ru: 'Тасбих по числу творений', en: 'Tasbih by the number of creation', ar: 'تسبيح بعدد الخلق' },
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
  repetitions: 3,
  meaning: meaning(
    'Пречист Аллах и хвала Ему — по числу Его творений, по Его довольству, весу Его Трона и количеству чернил для Его слов.',
    'Glory and praise be to Allah by the number of His creation, His pleasure, the weight of His Throne and the ink of His words.',
    'سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته.'
  ),
  reference: 'Муслим',
};

const IKHLAS = {
  id: 'ikhlas',
  name: { ru: 'Сура «Аль-Ихляс»', en: 'Surah Al-Ikhlas', ar: 'سورة الإخلاص' },
  arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
  repetitions: 3,
  meaning: meaning(
    'Сура о единственности и самодостаточности Аллаха.',
    'A surah affirming Allah’s absolute oneness and self-sufficiency.',
    'سورة تقرر توحيد الله وكمال غناه وصمديته.'
  ),
  reference: 'Ахмад, Абу Дауд, Ат-Тирмизи, Ан-Насаи',
};

const FALAQ = {
  id: 'falaq',
  name: { ru: 'Сура «Аль-Фаляк»', en: 'Surah Al-Falaq', ar: 'سورة الفلق' },
  arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
  repetitions: 3,
  meaning: meaning(
    'Сура с обращением к Аллаху за защитой от различных видов зла.',
    'A surah seeking Allah’s protection from different forms of evil.',
    'سورة في الاستعاذة بالله من أنواع الشرور.'
  ),
  reference: 'Ахмад, Абу Дауд, Ат-Тирмизи, Ан-Насаи',
};

const NAS = {
  id: 'nas',
  name: { ru: 'Сура «Ан-Нас»', en: 'Surah An-Nas', ar: 'سورة الناس' },
  arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
  repetitions: 3,
  meaning: meaning(
    'Сура с просьбой о защите Господа людей от наущений шайтана.',
    'A surah seeking the Lord of mankind’s protection from the whispering of Satan.',
    'سورة في الاستعاذة برب الناس من وسوسة الشيطان.'
  ),
  reference: 'Ахмад, Абу Дауд, Ат-Тирмизи, Ан-Насаи',
};

const MORNING_KINGDOM = {
  id: 'morning-kingdom',
  name: { ru: 'Мы встретили утро', en: 'We have entered the morning', ar: 'أصبحنا وأصبح الملك لله' },
  arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
  repetitions: 1,
  meaning: meaning(
    'Утреннее поминание Аллаха с просьбой о благе дня и защитой от его зла, лени и наказания.',
    'A morning remembrance asking Allah for the good of the day and protection from its evil, laziness and punishment.',
    'ذكر صباحي بسؤال الله خير اليوم والاستعاذة من شره والكسل والعذاب.'
  ),
  reference: 'Муслим',
};

const MORNING_LIFE = {
  id: 'morning-life',
  name: { ru: 'Благодаря Тебе мы встретили утро', en: 'By You we enter the morning', ar: 'اللهم بك أصبحنا' },
  arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
  repetitions: 1,
  meaning: meaning(
    'Признание того, что жизнь, смерть, утро, вечер и воскресение — по воле Аллаха.',
    'An acknowledgment that life, death, morning, evening and resurrection are by Allah’s will.',
    'إقرار بأن الحياة والموت والصباح والمساء والنشور كلها بالله.'
  ),
  reference: 'Ахмад, Абу Дауд, Ат-Тирмизи',
};

const FITRAH = {
  id: 'fitrah',
  name: { ru: 'Утро на естестве ислама', en: 'Morning upon the fitrah of Islam', ar: 'أصبحنا على فطرة الإسلام' },
  arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
  repetitions: 1,
  meaning: meaning(
    'Утреннее подтверждение ислама, искреннего единобожия и следования пути Ибрахима и Мухаммада ﷺ.',
    'A morning affirmation of Islam, sincere monotheism, and following the way of Ibrahim and Muhammad ﷺ.',
    'إقرار صباحي بفطرة الإسلام وكلمة الإخلاص واتباع ملة إبراهيم ودين محمد ﷺ.'
  ),
  reference: 'Ахмад, Ад-Дарими',
};

const EVENING_PROTECTION = {
  id: 'evening-protection',
  name: { ru: 'Совершенные слова Аллаха', en: 'Allah’s perfect words', ar: 'كلمات الله التامات' },
  arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
  repetitions: 1,
  meaning: meaning(
    'Прибегаю к совершенным словам Аллаха от зла того, что Он сотворил.',
    'I seek refuge in Allah’s perfect words from the evil of what He created.',
    'أعوذ بكلمات الله التامات من شر ما خلق.'
  ),
  reference: 'Муслим',
};

const EVENING_KINGDOM = {
  id: 'evening-kingdom',
  name: { ru: 'Мы встретили вечер', en: 'We have entered the evening', ar: 'أمسينا وأمسى الملك لله' },
  arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
  repetitions: 1,
  meaning: meaning(
    'Вечернее поминание Аллаха с просьбой о благе ночи и защитой от её зла, лени и наказания.',
    'An evening remembrance asking Allah for the good of the night and protection from its evil, laziness and punishment.',
    'ذكر مسائي بسؤال الله خير الليلة والاستعاذة من شرها والكسل والعذاب.'
  ),
  reference: 'Муслим',
};

const EVENING_LIFE = {
  id: 'evening-life',
  name: { ru: 'Благодаря Тебе мы встретили вечер', en: 'By You we enter the evening', ar: 'اللهم بك أمسينا' },
  arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
  repetitions: 1,
  meaning: meaning(
    'Признание того, что вечер, жизнь, смерть и возвращение — по воле Аллаха.',
    'An acknowledgment that evening, life, death and the final return are by Allah’s will.',
    'إقرار بأن المساء والحياة والموت والمصير كلها بالله.'
  ),
  reference: 'Абу Дауд, Ат-Тирмизи',
};

const BAQARAH_LAST = {
  id: 'baqarah-last',
  name: { ru: 'Последние два аята «Аль-Бакара»', en: 'Last two verses of Al-Baqarah', ar: 'آخر آيتين من سورة البقرة' },
  arabic: 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
  repetitions: 1,
  meaning: meaning(
    'Последние два аята с утверждением веры, покорности Аллаху и мольбой о прощении, милости и помощи.',
    'The final two verses affirm faith and obedience to Allah and contain supplications for forgiveness, mercy and help.',
    'آخر آيتين تتضمنان الإيمان والطاعة والدعاء بالمغفرة والرحمة والنصر.'
  ),
  reference: 'Коран 2:285–286; Аль-Бухари, Муслим',
};

const AFTER_FULL_DHIKR = {
  id: 'after-full-dhikr',
  name: { ru: 'Поминание после намаза', en: 'Remembrance after prayer', ar: 'ذكر بعد الصلاة' },
  arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ',
  repetitions: 1,
  meaning: meaning(
    'Поминание единственности Аллаха, Его власти, милостей и того, что сила и мощь принадлежат только Ему.',
    'A remembrance affirming Allah’s oneness, dominion and favors, and that there is no might or power except through Him.',
    'ذكر لتوحيد الله وملكه ونعمه وأنه لا حول ولا قوة إلا بالله.'
  ),
  reference: 'Муслим',
};

const ASTAGHFIR = {
  id: 'after-astaghfir',
  name: { ru: 'Истигфар', en: 'Istighfar', ar: 'الاستغفار' },
  arabic: 'أَسْتَغْفِرُ اللَّهَ',
  repetitions: 3,
  meaning: meaning(
    'Прошу Аллаха о прощении.',
    'I ask Allah for forgiveness.',
    'أستغفر الله.'
  ),
  reference: 'Муслим',
};

const SALAM = {
  id: 'after-salam',
  name: { ru: 'Аллахумма анта-с-Салям', en: 'Allahumma anta-s-Salam', ar: 'اللهم أنت السلام' },
  arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
  repetitions: 1,
  meaning: meaning(
    'О Аллах, Ты — Источник мира и безопасности; благословен Ты, Обладатель величия и щедрости.',
    'O Allah, You are Peace and from You comes peace. Blessed are You, Possessor of majesty and honor.',
    'اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام.'
  ),
  reference: 'Муслим',
};

const AFTER_TAHLIL = {
  id: 'after-tahlil',
  name: { ru: 'Тахлиль после намаза', en: 'Tahlil after prayer', ar: 'التهليل بعد الصلاة' },
  arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
  repetitions: 1,
  meaning: meaning(
    'Поминание единственности Аллаха и признание, что никто не удержит то, что Он даровал, и не даст то, что Он удержал.',
    'A remembrance of Allah’s oneness and that none can withhold what He gives or give what He withholds.',
    'ذكر لتوحيد الله والإقرار بأنه لا مانع لما أعطى ولا معطي لما منع.'
  ),
  reference: 'Аль-Бухари, Муслим',
};

const SUBHAN_33 = {
  id: 'after-subhan',
  name: { ru: 'СубханАллах', en: 'SubhanAllah', ar: 'سبحان الله' },
  arabic: 'سُبْحَانَ اللَّهِ',
  repetitions: 33,
  meaning: meaning('Пречист Аллах.', 'Glory be to Allah.', 'سبحان الله.'),
  reference: 'Муслим',
};

const HAMD_33 = {
  id: 'after-hamd',
  name: { ru: 'Альхамдулиллях', en: 'Alhamdulillah', ar: 'الحمد لله' },
  arabic: 'الْحَمْدُ لِلَّهِ',
  repetitions: 33,
  meaning: meaning('Хвала Аллаху.', 'All praise is for Allah.', 'الحمد لله.'),
  reference: 'Муслим',
};

const AKBAR_33 = {
  id: 'after-akbar',
  name: { ru: 'Аллаху Акбар', en: 'Allahu Akbar', ar: 'الله أكبر' },
  arabic: 'اللَّهُ أَكْبَرُ',
  repetitions: 33,
  meaning: meaning('Аллах Велик.', 'Allah is the Greatest.', 'الله أكبر.'),
  reference: 'Муслим',
};

const CLOSING_TAHLIL = {
  id: 'after-closing-tahlil',
  name: { ru: 'Завершение тасбиха', en: 'Completion of the tasbih', ar: 'تمام الذكر' },
  arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
  repetitions: 1,
  meaning: meaning(
    'Нет достойного поклонения, кроме Аллаха одного; Ему принадлежит власть и хвала.',
    'None has the right to be worshipped except Allah alone; His is the dominion and praise.',
    'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد.'
  ),
  reference: 'Муслим',
};

const RABBI_QINI = {
  id: 'after-rabbi-qini',
  name: { ru: 'Защита от наказания', en: 'Protection from punishment', ar: 'الاستعاذة من العذاب' },
  arabic: 'رَبِّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
  repetitions: 1,
  meaning: meaning(
    'Господь мой, защити меня от Твоего наказания в день, когда Ты воскресишь Своих рабов.',
    'My Lord, protect me from Your punishment on the Day You resurrect Your servants.',
    'رب قني عذابك يوم تبعث عبادك.'
  ),
  reference: 'Муслим',
};

const AYAT_KURSI = {
  id: 'ayat-kursi',
  name: { ru: 'Аят аль-Курси', en: 'Ayat al-Kursi', ar: 'آية الكرسي' },
  arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
  repetitions: 1,
  meaning: meaning(
    'Аят 2:255 о величии, знании, власти и вечной жизни Аллаха.',
    'Qur’an 2:255, affirming Allah’s greatness, knowledge, dominion and eternal life.',
    'آية البقرة 255 في عظمة الله وعلمه وملكه وحياته وقيوميته.'
  ),
  reference: 'Коран 2:255',
};

export const AZKAR_SOURCE = {
  morning: 'https://azkar.ru/category/morning',
  evening: 'https://azkar.ru/category/evening',
  afterPrayer: 'https://azkar.ru/category/after_prayer',
};

export const AZKAR = {
  morning: [
    SAYYID_ISTIGHFAR,
    TAHLIL,
    SUBHAN_100,
    MORNING_KINGDOM,
    MORNING_LIFE,
    BISMILLAH_PROTECTION,
    AFIYAH,
    GHAYB,
    FITRAH,
    RADIYTU,
    HAYYU_QAYYUM,
    SUBHAN_CREATION,
    HASBIYALLAH,
    IKHLAS,
    FALAQ,
    NAS,
  ],
  evening: [
    EVENING_PROTECTION,
    SAYYID_ISTIGHFAR,
    TAHLIL,
    SUBHAN_100,
    EVENING_KINGDOM,
    EVENING_LIFE,
    AFIYAH,
    GHAYB,
    RADIYTU,
    HAYYU_QAYYUM,
    HASBIYALLAH,
    BISMILLAH_PROTECTION,
    IKHLAS,
    FALAQ,
    NAS,
    BAQARAH_LAST,
  ],
  afterPrayer: [
    ASTAGHFIR,
    SALAM,
    AFTER_TAHLIL,
    AFTER_FULL_DHIKR,
    SUBHAN_33,
    HAMD_33,
    AKBAR_33,
    CLOSING_TAHLIL,
    RABBI_QINI,
    { ...AYAT_KURSI, repetitions: 1 },
    { ...IKHLAS, id: 'after-ikhlas', repetitions: 1 },
    { ...FALAQ, id: 'after-falaq', repetitions: 1 },
    { ...NAS, id: 'after-nas', repetitions: 1 },
  ],
};

export function getAzkarMeaning(item, language) {
  return item.meaning?.[language] || item.meaning?.en || item.meaning?.ru || '';
}

export function getAzkarName(item, language) {
  return item.name?.[language] || item.name?.en || item.name?.ru || '';
}
