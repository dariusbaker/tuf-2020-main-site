import Glide from '@glidejs/glide';

class Home {
  constructor() {
    // initialise clients list
    new Glide('.tuf-home-clients__list', {
      type: 'carousel',
      autoplay: 3000,
      perView: 8,
      focusAt: 'center',
      breakpoints: {
        800: {
          perView: 4
        },
        480: {
          perView: 3
        }
      }
    }).mount();

    // initialise testimonials
    new Glide('.tuf-home-testimonials__list', {
      type: 'carousel',
      perView: 1,
    }).mount();
  }
}

new Home();