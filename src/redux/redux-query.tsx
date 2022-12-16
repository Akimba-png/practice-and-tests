import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

interface IUser {
  id: number;
  name: string;
}

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
  }),
  tagTypes: ['users'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], string>({
      query: () => ({
        url: '/users',
      }),
      providesTags: ['users'],
    }),
    addUser: builder.mutation<IUser, IUser>({
      query: (data: IUser) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['users'],
    }),
    deleteUser: builder.mutation({
      query: (id: number) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
  }),
});

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

interface IUserProps {
  user: IUser;
}

function UserItem({user}: IUserProps): JSX.Element {
  const [deleteUser, {isLoading}] = userApi.useDeleteUserMutation();
  return (
    <li key={user.id}>
      {user.name}
      <button onClick={() => {deleteUser(user.id);}} type='button'>
        delete user
        {isLoading && 'deleting'}
      </button>
    </li>
  );
}

function UserList(): JSX.Element {
  const { data, isLoading, isError } = userApi.useGetUsersQuery('');
  const [postUser] = userApi.useAddUserMutation();
  return (
    <>
      <h2>User list</h2>
      {isLoading && <h3>...loading</h3>}
      {isError && <h3>Something goes wrong</h3>}
      {data && (
        <ul>
          {data.map((user) => <UserItem key={user.id} user={user} />)}
        </ul>
      )}
      <button onClick={() => {postUser({name: 'test'} as IUser);}} type='button'>add user</button>
    </>
  );
}

function ReduxQuery(): JSX.Element {
  return (
    <Provider store={store}>
      <UserList />
    </Provider>
  );
}

export { ReduxQuery };
