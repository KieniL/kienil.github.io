
//Set the Link Selectors to allow other leading signs on href than # and /
const options = {
    linkSelector:
      'a[href^="' +
      window.location.origin +
      '"]:not([data-no-swup]), a[href^="./"]:not([data-no-swup])'
  };
  const swup = new Swup(options)