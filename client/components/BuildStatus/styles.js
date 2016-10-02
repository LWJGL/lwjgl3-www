import {StyleSheet} from 'aphrodite/no-important'

export default StyleSheet.create({
  container: {
    minHeight: '2rem'
  },
  common: {
    display: 'inline-block',
    color: 'white',
    fontSize: 11,
    lineHeight: '20px',
    padding: '0 6px',
    fontFamily: 'DejaVu Sans,Verdana,Geneva,sans-serif',
    textShadow: '0 1px 0 rgba(1,1,1,.3)',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,.13), transparent)',
  },
  build: {
    backgroundColor: '#555',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  status: {
    backgroundColor: 'gray',
    transition: 'background-color 1s ease-out',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  loading: {
    backgroundColor: 'gray',
  },
  unknown: {
    backgroundColor: '#fff',
    color: '#555',
  },
  passing: {
    backgroundColor: '#4c1',
  },
  failing: {
    backgroundColor: '#db423c',
  },
});
