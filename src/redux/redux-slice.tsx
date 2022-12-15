import { useEffect } from 'react';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook, Provider } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import axios, { AxiosError } from 'axios';


// ------------------ redux slice без асинхронной логики ------------------
// ------------------------------------------------------------------------
type CounterInitial = {
  counter: number;
};

const counterInitial: CounterInitial = {
  counter: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState: counterInitial,
  reducers: {
    icreaseCount: (state) => {
      state.counter++;
    },
    decreaseCount: (state) => {
      state.counter--;
    },
    increaseCountByAmount: (state, action: PayloadAction<number>) => {
      state.counter += action.payload;
    },
  },
});
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------


// ------------------ redux slice и thunk action --------------------------
// ------------------------------------------------------------------------
type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
};

type UsersInitial = {
  users: User[];
  isLoading: boolean;
  error: string;
};

const userInitial: UsersInitial = {
  users: [],
  isLoading: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitial,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setLoading: (state) => {
      state.isLoading = true;
    }
  },
});

type AsyncAction =
  | ReturnType<typeof userSlice.actions.setError>
  | ReturnType<typeof userSlice.actions.setUsers>
  | ReturnType<typeof userSlice.actions.setLoading>

type AppAsyncAction = ThunkAction<void, RootState, unknown, AsyncAction>

const loadUsers = (): AppAsyncAction => (dispatch, _getState) => {
  dispatch(userSlice.actions.setLoading());
  axios
    .get<User[]>('https://jsonplaceholder.typicode.com/users')
    .then((response) => dispatch(userSlice.actions.setUsers(response.data)))
    .catch((error: AxiosError) => dispatch(userSlice.actions.setError(error.message)));
};
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------


// ------------------ Конфигурирование store ------------------------------
// ------------------------------------------------------------------------
const store = configureStore({
  reducer: {
    counterSlice: counterSlice.reducer,
    userSlice: userSlice.reducer,
  },
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------


// ------------------ Создание компонентов --------------------------------
// ------------------------------------------------------------------------
function UserComponent(): JSX.Element {
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector((state) => state.userSlice.isLoading);
  const users = useAppSelector((state) => state.userSlice.users);
  const error = useAppSelector((state) => state.userSlice.error);
  useEffect(() => {
    dispatch(loadUsers());
  }, []);
  return (
    <>
      {loadingStatus && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}
      <ul style={{listStyle: 'none'}}>
        {
          users.map((user) => (<li key={user.id}>{user.name}</li>))
        }
      </ul>
    </>
  );
}

function CounterComponent(): JSX.Element {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counterSlice.counter);
  return (
    <>
      <h1>{`Current count ${count}`}</h1>
      <button onClick={() => dispatch(counterSlice.actions.icreaseCount())} type='button'>Increase Count</button>
      <button onClick={() => dispatch(counterSlice.actions.decreaseCount())} type='button'>Decrease Count</button>
      <button onClick={() => dispatch(counterSlice.actions.increaseCountByAmount(2))} type='button'>Increase by two</button>
    </>
  );
}

function ReduxSlice(): JSX.Element {
  return (
    <Provider store={store}>
      <UserComponent />
      <CounterComponent />
    </Provider>
  );
}

export { ReduxSlice };
