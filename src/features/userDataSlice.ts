import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Commission } from '../models';
import { commissionRepository } from '../repositories';

interface UserDataState {
  commissions: Commission[]
  loading: boolean
  error: string | null;
}

const initialState: UserDataState = {
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
  reducers: {},
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

// declare selector for Semester data
export const selectTeacherCommissions = (state: RootState) => state.userData.commissions;
export const selectTeacherLoading = (state: RootState) => state.userData.loading;
export const selectTeacherError = (state: RootState) => state.userData.error;

export default userDataSlice.reducer;
