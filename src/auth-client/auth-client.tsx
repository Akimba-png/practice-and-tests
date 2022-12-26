import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useDispatch, useSelector, Provider, TypedUseSelectorHook } from 'react-redux';

const BASE_URL = 'http://localhost:5000';

enum ApiRoute {
  SignUp = '/auth/register',
  SignIn = '/auth/login',
  SignOut = '/auth/logout',
  Offers = '/offers',
}

enum AuthStatus {
  Auth = 'auth',
  NotAuth = 'not-auth',
  Unknown = 'unknown',
}

type User = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type Credential = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
}

type Offer = {
  id: string;
  title: string;
};

type UserState = {
  user: User;
  authStatus: AuthStatus;
};

const token = localStorage.getItem('x-token') ?? '';

const userState: UserState = {
  user: {
    id: '',
    name: '',
    email: '',
    token,
  },
  authStatus: AuthStatus.Unknown,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: userState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
  },
});

const { setUser, setAuthStatus } = userSlice.actions;

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers: Headers, {getState}) => {
      const xToken = (getState() as RootState).userSlice.user.token;
      headers.set('x-token', xToken);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation<'', RegisterData>({
      query: (registerData: RegisterData) => ({
        url: ApiRoute.SignUp,
        method: 'POST',
        body: registerData,
      }),
    }),
    signIn: builder.mutation<User, Credential>({
      query: (credential: Credential) => ({
        url: ApiRoute.SignIn,
        method: 'POST',
        body: credential,
      }),
    }),
    signOut: builder.mutation({
      query: () => ({
        url: ApiRoute.SignOut,
        method: 'DELETE',
      }),
    }),
    checkAuth: builder.query<string, ''>({
      query: () => ({
        url: ApiRoute.SignIn,
      }),
    }),
    loadOffers: builder.query<Offer[], ''>({
      query: () => ({
        url: ApiRoute.Offers,
      }),
    }),
  }),
});

const store = configureStore({
  reducer: {
    userSlice: userSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware),
});

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch;
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function LoginPage(): JSX.Element {
  const [sendSignUpRequest] = userApi.useSignUpMutation();
  const [sendSignInRequest] = userApi.useSignInMutation();
  const [sendSignOutRequest] = userApi.useSignOutMutation();
  const [sendLoadOffersRequest, {data: offers}] = userApi.useLazyLoadOffersQuery();
  const dispatch = useAppDispatch();
  const {name} = useAppSelector((state) => state.userSlice.user);
  const authStatus = useAppSelector((state) => state.userSlice.authStatus);
  const fakeUserCredential: Credential = {email: 'hz@neznau.net', password: '123'};
  const fakeUserRegData: RegisterData = {name: 'my lovely me', email: 'hz@neznau.net', password: '123'};

  const handleSignUpClick = async (registerData: RegisterData) => {
    try {
      await sendSignUpRequest(registerData);
    } catch(error) { return error; }
  };

  const handleSignInClick = async (credential: Credential) => {
    try {
      const user = await sendSignInRequest(credential).unwrap();
      dispatch(setUser(user));
      dispatch(setAuthStatus(AuthStatus.Auth));
    } catch(error) { return error; }
  };

  const handleSignOutClick = async () => {
    try {
      await sendSignOutRequest('');
    } catch(error) { return error; }
  };

  const handleLoadOffersClick = async () => {
    try {
      await sendLoadOffersRequest('');
    } catch(error) { return error; }
  };

  return (
    <>
      <h1>Login page</h1>
      {name && <h2>username is {name}</h2>}
      <h2>user status: {authStatus}</h2>
      {offers && (
        <ul>
          {offers.map((offer) => <li key={offer.id}>{offer.title}</li>)}
        </ul>
      )}
      <button type='button' onClick={() => {handleSignUpClick(fakeUserRegData);}}>sign up</button>
      <button type='button' onClick={() => {handleSignInClick(fakeUserCredential);}}>sign in</button>
      <button type='button' onClick={() => {handleSignOutClick();}}>sign out</button>
      <button type='button' onClick={() => {handleLoadOffersClick();}}>load offers</button>
    </>
  );
}

function TestApp(): JSX.Element {
  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
}

export { TestApp };
