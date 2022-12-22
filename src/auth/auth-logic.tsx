import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useSelector, useDispatch, Provider, TypedUseSelectorHook } from 'react-redux';
// СДЕЛТЬ CHECKAUTH НА СТАРТЕ ПРИЛОЖЕНИЯ И МИ
const BASE_URL = 'https://8.react.pages.academy/six-cities';

enum AuthStatus {
  Auth = 'auth',
  NotAuth = 'notAuth',
  Unknown = 'unknown',
}

type User = {
  id: number;
  email: string;
  name: string;
  token: string;
};

type Credentials = {
  email: string;
  password: string;
};

type AuthState = {
  user: User;
  authStatus: AuthStatus;
  token: string;
};

type Favorite = {
  id: number;
  title: string;
};

const token: string = localStorage.getItem('token') ?? '';

const authState: AuthState = {
  user: {} as User,
  authStatus: AuthStatus.Unknown,
  token,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: authState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
  },
});

const { setToken, setAuthStatus } = userSlice.actions;

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers: Headers, {getState}) => {
      const authToken = (getState() as RootState).user.token;
      headers.set('x-token', authToken);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<User, Credentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'DELETE',
      }),
    }),
    fetchFavorites: builder.query<Favorite[], string>({
      query: () => ({
        url: '/favorite',
      }),
    }),
  }),
});

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

function LoginPage(): JSX.Element {
  const [requestLogin] = userApi.useLoginMutation();
  const [requestLogout] = userApi.useLogoutMutation();
  const [fetchFavorites] = userApi.useLazyFetchFavoritesQuery();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.user.token);
  const fakeUserData: Credentials = { email: 'test@neznau.net', password: '12345qwert' };
  const handleLoginClick = async (userData: Credentials) => {
    try {
      const userResponse = await requestLogin(userData).unwrap();
      dispatch(setToken(userResponse.token));
      dispatch(setAuthStatus(AuthStatus.Auth));
      localStorage.setItem('token', userResponse.token);
    } catch (error) {
      return error;
    }
  };
  const handleLogoutClick = async () => {
    await requestLogout('');
    dispatch(setAuthStatus(AuthStatus.NotAuth));
    // токены в redux и localstorage можно не стирать, т.к. они всё равно будет не действительны на сервере
  };
  const handleFavoriteClick = async () => {
    await fetchFavorites('');
  };
  return (
    <>
      <h1>login page</h1>
      {userToken && <h2>{`user token is ${userToken}`}</h2>}
      <button type='button' onClick={() => {handleLoginClick(fakeUserData);}}>login</button>
      <button type='button' onClick={() => {handleFavoriteClick();}}>get favorite</button>
      <button type='button' onClick={() => {handleLogoutClick();}}>logout</button>
    </>
  );
}

function AuthLogic(): JSX.Element {
  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
}

export { AuthLogic };
