/**
 * chapters.js
 * Authored storyline data adhering strictly to the master story prompt.
 */

export const STORY_CHAPTERS = [
  {
    id: 1,
    key: 'chapter_1',
    title: 'Chapter 1: The Little Maajid',
    subtitle: 'Machhli Walo Ka Mohalla — Age 8',
    description: 'An eight-year-old boy with a dangerous stare finds himself confronted by the neighbourhood bully.',
    age: 8,
    bg: 'bg_mohalla_childhood',
    music: 'tension',
    dialogues: [
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'In the narrow coastal lanes of Machhli Walo Ka Mohalla, the salty sea breeze carries the hum of daily city life.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Among the neighbourhood folk walks an eight-year-old boy named Maajid. Short, skinny, and completely bald, with a terrifyingly fierce expression in his eyes.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8',
        text: 'Step out of my way.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'A twenty-year-old youth named Firoz blocks the alleyway. Broad-shouldered, muscular, with cold disdain plastered across his face.'
      },
      {
        speaker: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'Look at this little rat glaring at me. You think that scary face saves you from what happened earlier?'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8',
        text: 'I told you not to mess with me, Firoz. Don’t come near me.'
      },
      {
        speaker: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'You insolent street dog! I will teach you your place right now!'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'The argument escalates in an instant. Firoz lunges forward to grab the boy by the collar.',
        action: 'screen_flash'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'In a blinding flash of fury, Maajid pulls out a sharp blade and slashes Firoz across his turning back!',
        action: 'knife_slash',
        sfx: 'knife_slash',
        shake: true
      },
      {
        speaker: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'AAAAGH! You little maniac! My back...!'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Blood seeps down Firoz’s back, carving a permanent, vicious scar across his skin. Terror and silence grip the alley.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8',
        text: '...'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Maajid stands trembling, blade in hand, the brutal reality of what just occurred settling heavily into the dust of the mohalla.'
      }
    ]
  },
  {
    id: 2,
    key: 'chapter_2',
    title: 'Chapter 2: Muharram',
    subtitle: 'The Clashing Cymbals',
    description: 'The ceremonial rhythm of the Elathalam turns into a chaotic confrontation with severe consequences.',
    age: 8,
    bg: 'bg_muharram',
    music: 'muharram',
    dialogues: [
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Months pass. The holy days of Muharram arrive in Machhli Walo Ka Mohalla.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Torches illuminate the street. Maajid participates in the local observance, holding the heavy brass Chhayyam (Elathalam) cymbals, striking their rhythmic beats.',
        sfx: 'elathalam'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Across the crowded alley, eyes burn through the smoke. Firoz is there—and he remembers.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Beside Firoz stands his eighteen-year-old younger brother. Both begin marching toward Maajid.'
      },
      {
        speaker: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'There he is. Let’s finish this tonight.'
      },
      // 1. Firoz and brother approach Maajid
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Firoz and his brother corner Maajid between the stone walls.'
      },
      // 2. They try to hit him
      {
        speaker: 'Firoz’s Brother',
        portrait: 'portrait_firoz_brother_age_18',
        text: 'Catch him!'
      },
      // 3. Maajid dodges
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'The brother throws a punch, but Maajid ducks swiftly under the strike!',
        action: 'dodge'
      },
      // 4. Firoz accidentally hits his own brother's ears with the Elathalam
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Firoz lunges recklessly to grab the Elathalam, swinging wildly—and crashes the heavy brass disc straight into his own brother’s ear!',
        sfx: 'elathalam',
        shake: true
      },
      {
        speaker: 'Firoz’s Brother',
        portrait: 'portrait_firoz_brother_age_18',
        text: 'AAAH! My ear! Firoz, you struck me!'
      },
      // 5. Firoz becomes angrier
      {
        speaker: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'Damn you, you slippery worm! I will break every bone in your body!'
      },
      // 6. Firoz attempts to attack Maajid again
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Firoz charges again with unrestrained fury.'
      },
      // 7. Maajid hits Firoz with the Elathalam
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Desperate to defend himself, Maajid swings his brass cymbal, striking Firoz squarely across the jaw!',
        sfx: 'punch',
        shake: true
      },
      {
        speaker: 'Firoz',
        portrait: 'portrait_firoz_age_20',
        text: 'Oof! That’s it! You die today!'
      },
      // 8. Firoz beats Maajid very badly
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Overpowered by Firoz’s sheer adult weight and savage anger, the eight-year-old child is thrown against the stone wall.',
        sfx: 'punch',
        shake: true
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Firoz beats Maajid mercilessly. Every blow echoes with blunt, sickening force in the shadows.',
        sfx: 'punch',
        shake: true
      },
      // 9. Maajid returns home
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Bruised, bleeding, and dragging his shattered body, Maajid crawls away and limps home alone in the dark.'
      }
    ]
  },
  {
    id: 3,
    key: 'chapter_3',
    title: 'Chapter 3: A Change of Heart',
    subtitle: 'The Rooftop Reflection',
    description: 'Nursing painful wounds beneath the quiet night sky, a young boy understands the emptiness of wrath.',
    age: 8,
    bg: 'bg_change_heart',
    music: 'reflection',
    dialogues: [
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Bandages wrap Maajid’s throbbing head. The pain in his chest is nothing compared to the turmoil in his mind.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'Every punch... every strike... what did it achieve?'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'I hurt him with a blade. He hunted me down. His brother got hurt. I got beaten till I could barely stand.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'The moon glimmers on the quiet sea waves beyond the mohalla rooftops. For the first time, the anger inside Maajid melts into clarity.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'Fighting is not worth it. It brings only humiliation, terror, and suffering.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_8_injured',
        text: 'I don’t want to be a monster who lives by the knife. I want to become a better person.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'On that quiet terrace, an eight-year-old child makes a silent vow to abandon senseless rage and seek true purpose in life.'
      }
    ]
  },
  {
    id: 4,
    key: 'chapter_4',
    title: 'Chapter 4: Basharat Bhai',
    subtitle: 'Four Years Later — Age 12',
    description: 'A four-year time skip brings twelve-year-old Maajid to the opposite house for tuition with a remarkable young teacher.',
    age: 12,
    bg: 'bg_tuition_room',
    music: 'tuition',
    dialogues: [
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Four years pass. The scarred boy has grown into a twelve-year-old school student with short hair and an earnest thirst for knowledge.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Every afternoon, Maajid crosses the mohalla street to the house directly opposite his own for tuition.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'There lives Basharat, a fifteen-year-old teenager known across the locality for his brilliant mind and quiet dignity.'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_15',
        text: 'Welcome, Maajid. Sit down. Today we are tackling English grammar and solving linear equations.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_12',
        text: 'Salam, Basharat Bhai. I finished yesterday’s math homework. But question four on algebra was tricky.'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_15',
        text: 'Let’s look at it together. Remember: mathematics is just like life. If your foundation is calm and correct, no problem can defeat you.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Day after day, Basharat guides him through English, Mathematics, and lessons of moral integrity.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_12',
        text: 'Basharat Bhai, how do you stay so calm even when people around the market get angry?'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_15',
        text: 'Real strength, Maajid, isn’t in how loud you scream or how hard you hit. It’s in keeping your character clean when everything tests your patience.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Maajid’s heart swells with deep respect. He starts addressing him as "Basharat Bhai", forging a bond that will define the rest of his life.'
      }
    ]
  },
  {
    id: 5,
    key: 'chapter_5',
    title: 'Chapter 5: The Adult Maajid',
    subtitle: 'Machhli Walo Ka Mohalla — Age 21',
    description: 'Time marches forward. At twenty-one, Maajid steps into the adult world, ready to explore his beloved mohalla.',
    age: 21,
    bg: 'bg_mohalla_adult',
    music: 'exploration',
    dialogues: [
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Nine more years pass beneath the coastal sun. Maajid is now twenty-one years old.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Clean-shaven, with styled medium-length hair and square transparent prescription glasses framing his thoughtful gaze, he stands tall as an educated, principled young man.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'The morning air in Machhli Mohalla never changes. Fresh, salty, and full of life.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'Across the street stands Basharat, now twenty-four years old—sporting his trademark man-bun hairstyle, light beard and moustache, wearing a relaxed white open-collar shirt.'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'Maajid! You’re up early today, little brother.'
      },
      {
        speaker: 'Maajid',
        portrait: 'portrait_maajid_age_21',
        text: 'Salam, Basharat Bhai. You know I can never sleep in when there is work to be done in the mohalla.'
      },
      {
        speaker: 'Basharat Bhai',
        portrait: 'portrait_basharat_age_24',
        text: 'That’s the spirit. Take a walk around the street, check in on Chacha Iqbal at the Community Hall, and see the morning rush at the market.'
      },
      {
        speaker: 'Narrator',
        portrait: null,
        text: 'The childhood storms have passed. Now, the 2.5D RPG world of Machhli Walo Ka Mohalla opens before Maajid.'
      }
    ]
  }
];
