import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Commission, Teacher } from '../models';
import { commissionRepository } from '../repositories';

interface UserDataState {
  data: Teacher | null;
  commissions: Commission[]
  loading: boolean
  error: string | null;
}

const initialState: UserDataState = {
  data: null,
  commissions: [],
  loading: false,
  error: null,
};

export const fetchTeacherCommissionsAsync = createAsyncThunk(
  'userData/fetchData',
  async () => {
    try {
     return await commissionRepository.fetchAll()
    } catch (error) {
      throw new Error('Failed to fetch semester data');
    }
  }
);

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    // add user data reducer
    addUserData(state, action) {
      console.log('Adding user data', action.payload);
      const dataAsTeacher: Teacher = {
        id: action.payload.userId,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        dni: action.payload.dni,
        email: action.payload.email,
        padron: action.payload.teacherId,
      } as Teacher
      state.data = dataAsTeacher;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherCommissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCommissionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.commissions = action.payload;
      })
      .addCase(fetchTeacherCommissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching teacher commissions data';
      });
  },
});

export const { addUserData } = userDataSlice.actions;

// declare selector for Semester data
export const selectUserData = (state: RootState) => state.userData.data;
export const selectTeacherCommissions = (state: RootState) => state.userData.commissions;
export const selectTeacherLoading = (state: RootState) => state.userData.loading;
export const selectTeacherError = (state: RootState) => state.userData.error;

export default userDataSlice.reducer;
