import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Provider, useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { ThunkAction } from 'redux-thunk';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type TodosInitial = {
  todos: Todo[];
  isLoading: boolean;
  error: string;
}

const initialState: TodosInitial = {
  todos: [],
  isLoading: false,
  error: '',
};
const todoSlice = createSlice({
  name: 'todo-slice',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.isLoading = false;
      state.todos = action.payload;
    },
    setLoading(state) {
      state.isLoading = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
    },
    deleteTodo(state, action: PayloadAction<number>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

type Action =
  | ReturnType<typeof todoSlice.actions.setTodos>
  | ReturnType<typeof todoSlice.actions.setLoading>
  | ReturnType<typeof todoSlice.actions.setError>
  | ReturnType<typeof todoSlice.actions.addTodo>
  | ReturnType<typeof todoSlice.actions.deleteTodo>

const store = configureStore({
  reducer: {
    todoSlice: todoSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
type AppThunkAction = ThunkAction<void, RootState, unknown, Action>;

const loadTodos = (): AppThunkAction => (dispatch, _getState) => {
  dispatch(todoSlice.actions.setLoading());
  axios
    .get<Todo[]>('http://localhost:5000/todos')
    .then((response) => dispatch(todoSlice.actions.setTodos(response.data)))
    .catch((error: AxiosError) => dispatch(todoSlice.actions.setError(error.message)));
};

const uploadTodo = (todo: Todo, onSuccess: () => void): AppThunkAction => (dispatch, _getState) => {
  axios
    .post<Todo>('http://localhost:5000/todos', todo)
    .then((response) => {
      dispatch(todoSlice.actions.addTodo(response.data));
      onSuccess();
    })
    .catch((error: AxiosError) => dispatch(todoSlice.actions.setError(error.message)));
};

const deleteTodo = (id: number, onSuccess: () => void): AppThunkAction => (dispatch, _getState) => {
  axios
    .delete(`http://localhost:5000/todos/${id}`)
    .then((response) => {
      dispatch((todoSlice.actions.deleteTodo(id)));
      onSuccess();
    })
    .catch((error: AxiosError) => dispatch(todoSlice.actions.setError(error.message)));
};


type TodoItemProps = {
  todo: Todo;
};


function TodoForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string>('');
  const [ loadingStatus, setLoadingStatus ] = useState<boolean>(false);

  return (
    <>
      <h3>Add to</h3>
      <form>
        <label>
          todo title
          <input
            type='text'
            value={value}
            onChange={(evt: ChangeEvent<HTMLInputElement>) => setValue(evt.target.value)}
          />
        </label>
        <button
          type='button'
          onClick={(evt: MouseEvent<HTMLButtonElement>) => {
            evt.preventDefault();
            setLoadingStatus(true);
            dispatch(
              uploadTodo(
                {
                  completed: false,
                  title: value,
                } as Todo,
                () => setLoadingStatus(false)
              )
            );
          }}
        >
          submit
          {loadingStatus && <span> adding....</span>}
        </button>
      </form>
    </>

  );
}

function TodoItem({todo}: TodoItemProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  return (
    <li>
      {todo.title}
      <button
        type='button'
        onClick={() => {
          setLoadingStatus(true);
          dispatch(
            deleteTodo(
              todo.id,
              () => setLoadingStatus(false)
            )
          );
        }}
      >
        delete
        {loadingStatus && <span> ...deleting</span>}
      </button>
    </li>
  );
}

function TodoList(): JSX.Element {
  const dispatch = useAppDispatch();
  const {todos, isLoading, error} = useAppSelector((state) => state.todoSlice);
  useEffect(() => {
    dispatch(loadTodos());
  }, [dispatch]);
  return (
    <>
      <h2>Hello World</h2>
      {isLoading && <h3>...Loading</h3>}
      {error && <h3>Something goes wrong</h3>}
      {todos && (
        <ul>
          {todos.map((todo) => <TodoItem todo={todo} key={todo.id} />)}
        </ul>
      )}
    </>
  );
}

function TodoApp(): JSX.Element {
  return (
    <Provider store={store}>
      <TodoForm />
      <TodoList />
    </Provider>
  );
}

export { TodoApp };
