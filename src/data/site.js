// Everything a non-developer is likely to change lives in this file.
// The photographs themselves are listed in photos.js.

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

// SAMPLE DETAILS: the short facts on each session card (length, place, what is
// delivered) are placeholders to confirm with the photographer.
// `photo` is an id from photos.js; a session without one shows the logo.
export const sessions = [
  {
    id: 'portraits',
    name: 'Portraits',
    tint: 'blush',
    photo: 'portrait-roses',
    text: 'One person, one good window or an open hillside. For a milestone, a new chapter, or a picture that looks like you on a good day.',
    facts: ['About an hour', 'In Dullstroom or at your place', 'Edited gallery online']
  },
  {
    id: 'couples',
    name: 'Couples',
    tint: 'sand',
    photo: null,
    text: 'Engagements, anniversaries, or the long weekend you finally took. We walk, you talk, and I stay a few steps back.',
    facts: ['About ninety minutes', 'One or two places nearby', 'Edited gallery online']
  },
  {
    id: 'families',
    name: 'Families',
    tint: 'sky',
    photo: 'family-kisses',
    text: 'Children who will not sit still are welcome; that is the photograph. We meet in the last soft light of the day and let the afternoon do its work.',
    facts: ['About an hour', 'Somewhere with room to run', 'Edited gallery online']
  },
  {
    id: 'guesthouses',
    name: 'Guesthouses',
    tint: 'sage',
    photo: 'grace-and-sparrow',
    text: 'Rooms, tables, gardens and views, photographed the way a guest remembers them. For guesthouses, lodges and small businesses around Dullstroom.',
    facts: ['Half a day or a full day', 'Interiors, exteriors and details', 'Sized for web and booking sites']
  }
];

// How a session works, in order.
export const steps = [
  {
    title: 'First, a message',
    tint: 'blush',
    text: 'Tell me who it is for and what you have in mind. We choose a place and a date, and I look up the light for that day.'
  },
  {
    title: 'On the day',
    tint: 'sky',
    text: 'We meet about an hour before sunset, or just after sunrise if you are brave. There is no stiff posing. I guide, and you get on with being yourselves.'
  },
  {
    title: 'Afterwards',
    tint: 'sage',
    text: 'I edit every frame by hand and send you an online gallery, ready to download and print.'
  }
];

// What you see once the page has gone through the lens.
export const reveal = {
  id: 'family-field',
  caption: 'The beauty of the little moments.'
};

export const brand = {
  nav: {
    src: 'brand/logo-nav.png',
    width: 1100,
    height: 664
  },
  full: {
    src: 'brand/logo-black.png',
    width: 1100,
    height: 890,
    alt: 'Grace & Light Photography: the letters G and L inside the outline of a camera, with the line “Where grace meets light”'
  }
};
