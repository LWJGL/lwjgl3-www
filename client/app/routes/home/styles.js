export default {
  videoContainer: {
    position: 'relative',
    backgroundColor: '#1b2426',
    width: '100%',
    overflow: 'hidden',
  },
  fullHeight: {
    height: '100vh'
  },
  full: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  videoOverlay: {
    background: 'rgba(0,0,0,.5) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2NkYGA4w8DAYMLIAAUADV0BA91ra/8AAAAASUVORK5CYII=)',
  },
  video: {
    backgroundSize: 'cover',
    backgroundColor: '#1b2426',
    display: 'block',
    objectFit: 'cover',
    zIndex: 0,
  },
  logo: {
    position: 'absolute',
    width: '50%',
    left: '50%',
    marginLeft: '-25%',
    top: '50%',
    transform: 'translateY(-50%)',
    '@media (max-width: 600px)': {
      marginLeft: '-40%',
      width: '80%'
    },
  },
  intro: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    padding: '0 2rem',
    color: 'white',
    fontWeight: 300,
  },
  introTitle: {
    '@media (max-width: 600px)': {
      fontSize: '1.4rem'
    },
    '@media (max-width: 400px)': {
      fontSize: '1.1rem'
    }
  },
  introText: {
    lineHeight: '1.5rem',
    '@media (max-width: 600px)': {
      fontSize: '.9rem'
    }
  }
};