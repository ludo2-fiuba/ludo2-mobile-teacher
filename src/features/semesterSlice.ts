import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPresentSemesterFromCommissionId } from '../repositories/semesters';
import { Semester } from '../models/Semester';

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
      const response = await fetchPresentSemesterFromCommissionId(commissionId);
      return response;
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

export default semesterSlice.reducer;
