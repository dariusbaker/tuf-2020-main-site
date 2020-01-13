class Home {
  constructor() {
    // initialise clients list
    new Glide('.tuf-home-clients-list', {
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
  }
}

new Home();