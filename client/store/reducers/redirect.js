export const PAGE_ENTER = 'APP/PAGE_ENTER';
export const PAGE_LEAVE = 'APP/PAGE_LEAVE';

export const pageEnter = payload => ({type: PAGE_ENTER, payload});
export const pageLeave = payload => ({type: PAGE_LEAVE, payload});

// export default function(state = null, action) {
//   return state;
// }
