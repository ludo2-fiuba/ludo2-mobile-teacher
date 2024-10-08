import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './features/counter/counterSlice'
import { teachersSlice } from './features/teachersSlice'
import semesterSlice from './features/semesterSlice'
import userDataSlice from './features/userDataSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    teachers: teachersSlice.reducer,
    semester: semesterSlice,
    userData: userDataSlice
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch