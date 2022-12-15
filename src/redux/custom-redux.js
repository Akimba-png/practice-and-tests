const axios = require('axios');

const DELAY = 2000;
const BASE_URL = 'https://jsonplaceholder.typicode.com';
const ApiRoute = {
  POSTS: '/posts',
  USERS: '/users',
};
const QueryParam = {
  limit: '?_limit=2',
}

const ActionType = {
  SET_POSTS: 'response/set-posts',
  SET_USERS: 'response/set-users',
};

const setPosts = (posts) => ({
  type: ActionType.SET_POSTS,
  payload: posts,
});

const setUsers = (users) => ({
  type: ActionType.SET_USERS,
  payload: users,
});

const reducer = (state = {}, action) => {
  switch (action.type) {
    case ActionType.SET_POSTS:
      return { ...state, posts: action.payload };
    case ActionType.SET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

const createStore = (reducer, initialValue = {}) => {
  let state = initialValue;
  return {
    dispatch(action) {
      state = reducer(state, action);
    },
    getState() {
      return state;
    }
  };
};

const thunkMiddleware = ({dispatch, getState}) => (next) => (action) => {
  if (typeof action === 'function') {
    action(dispatch, getState);
    return;
  }
  next(action);
};

const loadPosts = () => (dispatch, _getState) => {
  axios(`${BASE_URL}${ApiRoute.POSTS}${QueryParam.limit}`)
    .then((response) => dispatch(setPosts(response.data)));
};

const loadUsers = () => (dispatch, _getState) => {
  axios(`${BASE_URL}${ApiRoute.USERS}${QueryParam.limit}`)
    .then((response) => dispatch(setUsers(response.data)));
};

const createStoreWithMiddleware = (middleware) => (createStore) => {
  const store = createStore(reducer);
  return {
    dispatch(action) {
      middleware(store)(store.dispatch)(action);
    },
    getState() {
      return store.getState();
    },
  };
};

const store = createStoreWithMiddleware(thunkMiddleware)(createStore);
store.dispatch(loadPosts());
store.dispatch(loadUsers());
setTimeout(() => {
  console.log(store.getState());
}, DELAY);
