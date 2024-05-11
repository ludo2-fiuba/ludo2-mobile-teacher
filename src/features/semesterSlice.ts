import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPresentSemesterFromCommissionId } from '../repositories/semesters';
import { Semester } from '../models/Semester';
import { RootState } from '../store';

interface SemesterState {
  data: Semester | null;
  loading: boolean;
  error: string | null;
}

const initialState: SemesterState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchSemesterDataAsync = createAsyncThunk(
  'semester/fetchData',
  async (commissionId: number) => {
    try {
     return await fetchPresentSemesterFromCommissionId(commissionId);
    } catch (error) {
      throw new Error('Failed to fetch semester data');
    }
  }
);


const semesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSemesterDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSemesterDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching semester data';
      });
  },
});

// declare selector for Semester data
export const selectSemesterData = (state: RootState) => state.semester.data;
export const selectSemesterLoading = (state: RootState) => state.semester.loading;
export const selectSemesterError = (state: RootState) => state.semester.error;

export default semesterSlice.reducer;
