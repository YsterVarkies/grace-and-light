// Everything a non-developer is likely to change lives in this file.

export const site = {
  name: 'Grace & Light',
  place: 'Dullstroom, Mpumalanga',
  // The number from the Facebook page, confirmed as the one to use. (The
  // Instagram introduction post of 16 October 2026 shows 076 812 6549.)
  phoneDisplay: '063 779 5389',
  phoneHref: 'tel:+27637795389',
  whatsapp: '27637795389', // international format, no plus sign
  instagram: 'https://www.instagram.com/graceandlight_photography_/',
  facebook: 'https://www.facebook.com/Grace.andlight.photography15'
};

// SAMPLE DETAILS: the three short facts under each session (length, place,
// what is delivered) are placeholders to confirm with the photographer.
export const sessions = [
  {
    id: 'portraits',
    name: 'Portraits',
    text: 'One person, one good window or an open hillside. For a milestone, a new chapter, or a picture that looks like you on a good day. I shoot these with the lens wide open, so the background falls away and you stay.',
    facts: ['About an hour', 'In Dullstroom or at your place', 'Edited gallery online']
  },
  {
    id: 'couples',
    name: 'Couples',
    text: 'Engagements, anniversaries, or the long weekend you finally took. We walk, you talk, and I stay a few steps back. The best frames usually happen between the ones you posed for.',
    facts: ['About ninety minutes', 'One or two places nearby', 'Edited gallery online']
  },
  {
    id: 'families',
    name: 'Families',
    text: 'Children who will not sit still are welcome; that is the photograph. We meet in the last soft light of the day, somewhere with room to run, and let the afternoon do its work.',
    facts: ['About an hour', 'Somewhere with room to run', 'Edited gallery online']
  },
  {
    id: 'guesthouses',
    name: 'Guesthouses',
    text: 'Rooms, tables, fires and views, photographed the way a guest remembers them. For guesthouses, lodges and small businesses around Dullstroom that need pictures for a website or a booking page. Here the lens is stopped right down, so a room stays sharp from the doorway to the window.',
    facts: ['Half a day or a full day', 'Interiors, exteriors and details', 'Sized for web and booking sites']
  }
];

// All photographs below are Grace & Light's own, taken from the studio's
// Instagram posts. To change one, drop a new file into public/photos and
// update its entry here (width and height are the file's pixel size).
export const pictures = {
  // What you see once the page has gone through the lens.
  reveal: {
    src: 'photos/family-field.jpg',
    alt: 'Two young girls in summer dresses holding each other in a field of wild grass, seen from behind',
    width: 1800,
    height: 2400,
    caption: 'The beauty of the little moments.'
  },
  logo: {
    src: 'brand/logo-white.png',
    alt: 'The Grace & Light Photography mark: the letters G and L inside the outline of a camera, with the line “Where grace meets light”',
    width: 1100,
    height: 890
  }
};

// Recent work. The words are the photographer's own, from her posts.
export const work = [
  {
    id: 'highland-rose',
    name: 'The Highland Rose',
    kind: 'Guesthouse interiors',
    text: 'A little look inside The Highland Rose. From the cosy bedrooms to the beautiful bathrooms, every detail makes this place feel warm, welcoming and easy to relax in.',
    photo: {
      src: 'photos/highland-rose.jpg',
      alt: 'A guesthouse bathroom with a rain shower, a stone basin and a corner bath beneath dark timber beams',
      width: 1400,
      height: 1866
    }
  },
  {
    id: 'grace-and-sparrow',
    name: 'Grace & Sparrow',
    kind: 'Guesthouse, Dullstroom',
    text: 'French-style comfort, thoughtful details and a cosy atmosphere that makes you feel right at home. I had the pleasure of capturing this charming guesthouse in Dullstroom, from the inviting bedroom to the little touches that make a stay special.',
    photo: {
      src: 'photos/grace-and-sparrow.jpg',
      alt: 'A guesthouse bedroom with a white bed, a print of a hare above it and a chandelier wound with greenery',
      width: 960,
      height: 1440
    }
  }
];
