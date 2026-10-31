/**
 * chapters.js
 * Authored storyline data adhering strictly to the master story prompt.
 * Contains both English and natural, dramatic Hinglish translations.
 */

export const STORY_CHAPTERS = [
  {
    id: 1,
    key: 'chapter_1',
    title: 'Chapter 1: The Little Maajid',
    title_hinglish: 'Adhyay 1: Chota Maajid',
    subtitle: 'Machhli Walo Ka Mohalla — Age 8',
    subtitle_hinglish: 'Machhli Walo Ka Mohalla — Umar 8 Saal',
    description: 'An eight-year-old boy with a dangerous stare finds himself confronted by the neighbourhood bully.',
    description_hinglish: 'Ek aath saal ka bacha jiski aankhon me khaufnaak gussa hai, uska samna mohalle ke gunde se hota hai.',
    age: 8,
    bg: 'bg_mohalla_childhood',
    music: 'tension',
    dialogues: [
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'In the narrow coastal lanes of Machhli Walo Ka Mohalla, the salty sea breeze carries the hum of daily city life.',
        text_hinglish: 'Machhli Walo Ka Mohalla ki tang galiyon me samundari hawa ke sath shehar ki dhoop aur rozmarra ki halchal ghuli hui thi.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Among the neighbourhood folk walks an eight-year-old boy named Maajid. Short, skinny, and completely bald, with a terrifyingly fierce expression in his eyes.',
        text_hinglish: 'Mohalle ke logon ke beech se nikal raha tha aath saal ka Maajid. Chota, patla, poori tarah ganja, aur aankhon me ek khaufnaak aur gusse bhari chamak.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8',
        text: 'Step out of my way.',
        text_hinglish: 'Mere raaste se hat jaao.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'A twenty-year-old youth named Firoz blocks the alleyway. Broad-shouldered, muscular, with cold disdain plastered across his face.',
        text_hinglish: 'Bees saal ke Firoz ne gali ka raasta rok liya. Chaude kandhe, mazboot jism aur chehre par be-parwah ghamand.'
      },
      {
        speaker: 'Firoz',
        speaker_hinglish: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'Look at this little rat glaring at me. You think that scary face saves you from what happened earlier?',
        text_hinglish: 'Dekho is chote chuhe ko, kaisa ghoor raha hai mujhe! Tujhe lagta hai ye daraawna chehra tujhe pehle waali baat se bacha lega?'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8',
        text: 'I told you not to mess with me, Firoz. Don’t come near me.',
        text_hinglish: 'Mene pehle hi kaha tha mujhse panga mat le, Firoz. Mere paas mat aana.'
      },
      {
        speaker: 'Firoz',
        speaker_hinglish: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'You insolent street dog! I will teach you your place right now!',
        text_hinglish: 'Gali ke badtameez kuttay! Abhi tujhe teri aukaat yaad dilata hoon!'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'The argument escalates in an instant. Firoz lunges forward to grab the boy by the collar.',
        text_hinglish: 'Baat pal bhar me haatha-pai tak pahunch gayi. Firoz ne aage badhkar Maajid ka collar pakadne ke liye haath badhaya.',
        action: 'screen_flash'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'In a blinding flash of fury, Maajid pulls out a sharp blade and slashes Firoz across his turning back!',
        text_hinglish: 'Gusse ki andhi aag me, Maajid ne tez chaku nikala aur ghoomte hue Firoz ki peeth par seedha vaar kar diya!',
        action: 'knife_slash',
        sfx: 'knife_slash',
        shake: true
      },
      {
        speaker: 'Firoz',
        speaker_hinglish: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'AAAAGH! You little maniac! My back...!',
        text_hinglish: 'AAAH! Pagal ladke! Meri peeth... khoon...!'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Blood seeps down Firoz’s back, carving a permanent, vicious scar across his skin. Terror and silence grip the alley.',
        text_hinglish: 'Firoz ki peeth se khoon behne laga, jo aage chalkar ek gehra aur hamesha rehne wala nishaan ban gaya. Poori gali me khaufnaak sannata chha gaya.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8',
        text: '...',
        text_hinglish: '...'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Maajid stands trembling, blade in hand, the brutal reality of what just occurred settling heavily into the dust of the mohalla.',
        text_hinglish: 'Haath me chaku liye Maajid tharthara raha tha, aur jo abhi hua tha, uski khaufnaak haqeeqat mohalle ki mitti me bikhar gayi.'
      }
    ]
  },
  {
    id: 2,
    key: 'chapter_2',
    title: 'Chapter 2: Muharram',
    title_hinglish: 'Adhyay 2: Muharram',
    subtitle: 'The Clashing Cymbals',
    subtitle_hinglish: 'Chhayyam ki Gunj',
    description: 'The ceremonial rhythm of the Elathalam turns into a chaotic confrontation with severe consequences.',
    description_hinglish: 'Elathalam ki dhoon achanak ek khaufnaak ladai aur dardnak anjam me badal jaati hai.',
    age: 8,
    bg: 'bg_muharram',
    music: 'muharram',
    dialogues: [
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Months pass. The holy days of Muharram arrive in Machhli Walo Ka Mohalla.',
        text_hinglish: 'Kuchh waqt guzar gaya. Machhli Walo Ka Mohalla me Muharram ke din aa gaye.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Torches illuminate the street. Maajid participates in the local observance, holding the heavy brass Chhayyam (Elathalam) cymbals, striking their rhythmic beats.',
        text_hinglish: 'Mashalon ki roshni me mohalla chamak raha tha. Maajid pital ke bhaari Chhayyam (Elathalam) lekar unhe taal me baja raha tha.',
        sfx: 'elathalam'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Across the crowded alley, eyes burn through the smoke. Firoz is there—and he remembers.',
        text_hinglish: 'Bheed ke us paar se dhuen ke beech do aankhein use ghoor rahi theen. Firoz wahi tha—aur use peeth ka zakham achche se yaad tha.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Beside Firoz stands his eighteen-year-old younger brother. Both begin marching toward Maajid.',
        text_hinglish: 'Firoz ke bagal me uska 18 saal ka chota bhai khada tha. Dono Maajid ki taraf aage badhne lage.'
      },
      {
        speaker: 'Firoz',
        speaker_hinglish: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'There he is. Let’s finish this tonight.',
        text_hinglish: 'Wo raha! Aaj raat iska qissa yahin khatam karenge.'
      },
      // 1. Firoz and brother approach Maajid
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Firoz and his brother corner Maajid between the stone walls.',
        text_hinglish: 'Firoz aur uske bhai ne Maajid ko pathar ki deewaron ke beech gher liya.'
      },
      // 2. They try to hit him
      {
        speaker: 'Firoz’s Brother',
        speaker_hinglish: 'Firoz ka Bhai',
        portrait: 'portrait_firoz_brother_age_18',
        text: 'Catch him!',
        text_hinglish: 'Pakad ise! Bachne na paaye!'
      },
      // 3. Maajid dodges
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'The brother throws a punch, but Maajid ducks swiftly under the strike!',
        text_hinglish: 'Bhai ne ghusa chalaya, lekin Maajid ne tezi se jhuk kar khud ko bacha liya!',
        action: 'dodge'
      },
      // 4. Firoz accidentally hits his own brother's ears with the Elathalam
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Firoz lunges recklessly to grab the Elathalam, swinging wildly—and crashes the heavy brass disc straight into his own brother’s ear!',
        text_hinglish: 'Firoz ne bokhla kar Elathalam chheen-ne ke liye haath mara, aur bhaari pital ka chhayyam seedha uske apne bhai ke kaan par ja laga!',
        sfx: 'elathalam',
        shake: true
      },
      {
        speaker: 'Firoz’s Brother',
        speaker_hinglish: 'Firoz ka Bhai',
        portrait: 'portrait_firoz_brother_age_18',
        text: 'AAAH! My ear! Firoz, you struck me!',
        text_hinglish: 'AAAH! Mera kaan! Firoz, tune mujhe hi maar diya!'
      },
      // 5. Firoz becomes angrier
      {
        speaker: 'Firoz',
        speaker_hinglish: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'Damn you, you slippery worm! I will break every bone in your body!',
        text_hinglish: 'Kambakht keedey! Aaj teri ek ek haddi tod kar rakh doonga!'
      },
      // 6. Firoz attempts to attack Maajid again
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Firoz charges again with unrestrained fury.',
        text_hinglish: 'Firoz aur zyada pagal hokar dobara Maajid par jhapat pada.'
      },
      // 7. Maajid hits Firoz with the Elathalam
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Desperate to defend himself, Maajid swings his brass cymbal, striking Firoz squarely across the jaw!',
        text_hinglish: 'Apne bachaav me Maajid ne pital ka Elathalam ghooma kar Firoz ke jabde par de maara!',
        sfx: 'punch',
        shake: true
      },
      {
        speaker: 'Firoz',
        speaker_hinglish: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'Oof! That’s it! You die today!',
        text_hinglish: 'Ufff! Ab tu nahi bachega!'
      },
      // 8. Firoz beats Maajid very badly
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Overpowered by Firoz’s sheer adult weight and savage anger, the eight-year-old child is thrown against the stone wall.',
        text_hinglish: 'Ek 20 saal ke jawan aadmi ke samne 8 saal ka chota bacha tik na saka. Firoz ne use deewar par patak diya.',
        sfx: 'punch',
        shake: true
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Firoz beats Maajid mercilessly. Every blow echoes with blunt, sickening force in the shadows.',
        text_hinglish: 'Firoz ne Maajid ko behad berahmi se peeta. Andhere me padne wale har vaar se dard ki cheekhein goonj rahi theen.',
        sfx: 'punch',
        shake: true
      },
      // 9. Maajid returns home
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Bruised, bleeding, and dragging his shattered body, Maajid crawls away and limps home alone in the dark.',
        text_hinglish: 'Zakhmi, lahu-luhan aur toote hue jism ke sath, Maajid kisi tarah andhere me ghasittay hue akela ghar lauta.'
      }
    ]
  },
  {
    id: 3,
    key: 'chapter_3',
    title: 'Chapter 3: A Change of Heart',
    title_hinglish: 'Adhyay 3: Dil Ka Badlaav',
    subtitle: 'The Rooftop Reflection',
    subtitle_hinglish: 'Chhat Par Sannata Aur Ehsaas',
    description: 'Nursing painful wounds beneath the quiet night sky, a young boy understands the emptiness of wrath.',
    description_hinglish: 'Raat ke taaron ke neeche apne zakhmon ko sehte hue, ek chote ladke ko gusse aur ladai ka khokhlapan samajh aata hai.',
    age: 8,
    bg: 'bg_change_heart',
    music: 'reflection',
    dialogues: [
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Bandages wrap Maajid’s throbbing head. The pain in his chest is nothing compared to the turmoil in his mind.',
        text_hinglish: 'Maajid ke sar par patti bandhi thi. Seene ke zakham se zyada dard uske dimag me chal rahi kashmakash ka tha.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'Every punch... every strike... what did it achieve?',
        text_hinglish: 'Har ghusa... har vaar... is sab se aakhir mila kya?'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'I hurt him with a blade. He hunted me down. His brother got hurt. I got beaten till I could barely stand.',
        text_hinglish: 'Mene use chaku mara. Usne badla lene ke liye mujhe ghera. Uska bhai ghayal hua. Aur mujhe itna maara gaya ki chalne ki bhi taqat na bachi.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'The moon glimmers on the quiet sea waves beyond the mohalla rooftops. For the first time, the anger inside Maajid melts into clarity.',
        text_hinglish: 'Chhat ke paar samundar ki lehron par chaand ki roshni bikhar rahi thi. Pehli baar Maajid ke andar ka gussa pighal kar samajh me badal raha tha.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'Fighting is not worth it. It brings only humiliation, terror, and suffering.',
        text_hinglish: 'Ladai jhagre me kuchh nahi rakha. Isse sirf zillat, khauf aur barbaadi milti hai.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'I don’t want to be a monster who lives by the knife. I want to become a better person.',
        text_hinglish: 'Mujhe chaku chalaane wala gunda nahi banna. Mujhe ek achcha aur nek insaan banna hai.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'On that quiet terrace, an eight-year-old child makes a silent vow to abandon senseless rage and seek true purpose in life.',
        text_hinglish: 'Us shaant chhat par, ek aath saal ke bache ne be-maqsad gusse ko chhodne aur zindagi ka sahi rasta chun-ne ka khamosh faisla kiya.'
      }
    ]
  },
  {
    id: 4,
    key: 'chapter_4',
    title: 'Chapter 4: Basharat Bhai',
    title_hinglish: 'Adhyay 4: Basharat Bhai',
    subtitle: 'Four Years Later — Age 12',
    subtitle_hinglish: 'Chaar Saal Baad — Umar 12 Saal',
    description: 'A four-year time skip brings twelve-year-old Maajid to the opposite house for tuition with a remarkable young teacher.',
    description_hinglish: 'Chaar saal baad, 12 saal ka Maajid samne waale ghar me ek qabil ustaad se tuition padhne jaata hai.',
    age: 12,
    bg: 'bg_tuition_room',
    music: 'tuition',
    dialogues: [
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Four years pass. The scarred boy has grown into a twelve-year-old school student with short hair and an earnest thirst for knowledge.',
        text_hinglish: 'Chaar saal beet gaye. Chote balon wala 12 saal ka Maajid ab ek suljha hua school student ban chuka tha, jise seekhne ki lagan thi.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Every afternoon, Maajid crosses the mohalla street to the house directly opposite his own for tuition.',
        text_hinglish: 'Har dopahar, Maajid apne ghar ke theek samne waale makaan me tuition padhne jaata.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'There lives Basharat, a fifteen-year-old teenager known across the locality for his brilliant mind and quiet dignity.',
        text_hinglish: 'Wahan 15 saal ka Basharat rehta tha, jo apne tez dimag aur sharafat ke liye poore mohalle me mashhoor tha.'
      },
      {
        speaker: 'Basharat Bhai',
        speaker_hinglish: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_15',
        text: 'Welcome, Maajid. Sit down. Today we are tackling English grammar and solving linear equations.',
        text_hinglish: 'Aao Maajid, baitho. Aaj hum English grammar aur algebra ke sawalat hal karenge.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_12',
        text: 'Salam, Basharat Bhai. I finished yesterday’s math homework. But question four on algebra was tricky.',
        text_hinglish: 'Salam Basharat Bhai. Kal ka maths homework kar liya tha, par sawal number chaar thoda mushkil tha.'
      },
      {
        speaker: 'Basharat Bhai',
        speaker_hinglish: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_15',
        text: 'Let’s look at it together. Remember: mathematics is just like life. If your foundation is calm and correct, no problem can defeat you.',
        text_hinglish: 'Chalo milkar dekhte hain. Yaad rakhna: hisaab-kitab bilkul zindagi ki tarah hota hai. Agar tumhari buniyad shaant aur theek hai, toh koi mushkil tumhe hara nahi sakti.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Day after day, Basharat guides him through English, Mathematics, and lessons of moral integrity.',
        text_hinglish: 'Dopahar dar dopahar, Basharat use English, Ganit aur achche ikhlaaq ke sabaq sikhata raha.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_12',
        text: 'Basharat Bhai, how do you stay so calm even when people around the market get angry?',
        text_hinglish: 'Basharat Bhai, jab bazaar me log choti choti baat par gussa karte hain, aap itne shaant kaise reh lete hain?'
      },
      {
        speaker: 'Basharat Bhai',
        speaker_hinglish: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_15',
        text: 'Real strength, Maajid, isn’t in how loud you scream or how hard you hit. It’s in keeping your character clean when everything tests your patience.',
        text_hinglish: 'Asli taqat cheekhne ya hath chalane me nahi hoti, Maajid. Asli taqat isme hoti hai ki jab sabr ka imtehan ho, tab bhi tumhara kirdar saaf rahe.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Maajid’s heart swells with deep respect. He starts addressing him as "Basharat Bhai", forging a bond that will define the rest of his life.',
        text_hinglish: 'Maajid ke dil me be-inteha izzat bhar aayi. Usne unhe "Basharat Bhai" kehna shuru kiya, aur yahi rishta aage chalkar unki zindagi ki buniyad bana.'
      }
    ]
  },
  {
    id: 5,
    key: 'chapter_5',
    title: 'Chapter 5: The Adult Maajid',
    title_hinglish: 'Adhyay 5: Jawan Maajid',
    subtitle: 'Machhli Walo Ka Mohalla — Age 21',
    subtitle_hinglish: 'Machhli Walo Ka Mohalla — Umar 21 Saal',
    description: 'Time marches forward. At twenty-one, Maajid steps into the adult world, ready to explore his beloved mohalla.',
    description_hinglish: 'Waqt aage badhta hai. 21 saal ki umar me, Maajid apne pyare mohalle me qadam rakhta hai.',
    age: 21,
    bg: 'bg_mohalla_adult',
    music: 'exploration',
    dialogues: [
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Nine more years pass beneath the coastal sun. Maajid is now twenty-one years old.',
        text_hinglish: 'Samundari hawaon ke saaye me nau saal aur guzar gaye. Maajid ab 21 saal ka jawan mard ban chuka tha.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Clean-shaven, with styled medium-length hair and square transparent prescription glasses framing his thoughtful gaze, he stands tall as an educated, principled young man.',
        text_hinglish: 'Saaf-shaved chehra, saleeqe se bane baal aur aankhon par square transparent prescription chashma—wo ek padha-likha aur ba-izzat nojawan ban kar ubhra.'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'The morning air in Machhli Mohalla never changes. Fresh, salty, and full of life.',
        text_hinglish: 'Machhli Mohalla ki subah ki taazi hawa kabhi nahi badalti. Khushgawar, samundari aur zindagi se bhari hui.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'Across the street stands Basharat, now twenty-four years old—sporting his trademark man-bun hairstyle, light beard and moustache, wearing a relaxed white open-collar shirt.',
        text_hinglish: 'Sadak ke us paar Basharat Bhai khade the, ab lagbhag 24 saal ke—man-bun hairstyle, halki daadhi-moochh aur safed linen shirt me ba-waqar lag rahe the.'
      },
      {
        speaker: 'Basharat Bhai',
        speaker_hinglish: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'Maajid! You’re up early today, little brother.',
        text_hinglish: 'Maajid! Aaj badi subah-subah jaag gaye, chote bhai!'
      },
      {
        speaker: 'Maajid',
        speaker_hinglish: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'Salam, Basharat Bhai. You know I can never sleep in when there is work to be done in the mohalla.',
        text_hinglish: 'Salam Basharat Bhai. Mohalle me itne kaam hon toh der tak soya kaise jaa sakta hai.'
      },
      {
        speaker: 'Basharat Bhai',
        speaker_hinglish: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'That’s the spirit. Take a walk around the street, check in on Chacha Iqbal at the Community Hall, and see the morning rush at the market.',
        text_hinglish: 'Ye hui na baat! Gali ka ek chakkar lagao, Community Hall par Chacha Iqbal se milo, aur dekho bazaar me subah ki taazi machhli aayi ya nahi.'
      },
      {
        speaker: 'Narrator',
        speaker_hinglish: '',
        portrait: null,
        text: 'The childhood storms have passed. Now, the 2.5D RPG world of Machhli Walo Ka Mohalla opens before Maajid.',
        text_hinglish: 'Bachpan ke toofan guzar chuke the. Ab Machhli Walo Ka Mohalla ka 2.5D RPG aalam Maajid ke samne khul raha tha.'
      }
    ]
  }
];
