import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Commission, Teacher, User } from '../models';
import { commissionRepository } from '../repositories';
import { SessionManager } from '../managers';
import { decodeJWT } from '../utils/decodeJWT';

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
  'userData/fetchTeacherCommissions',
  async () => {
    try {
      return await commissionRepository.fetchAll()
    } catch (error) {
      throw new Error('Failed to fetch semester data');
    }
  }
);

export const fetchUserDataAsync = createAsyncThunk(
  'userData/fetchData',
  async (user: User) => {
    try {
      const accessToken = SessionManager.getInstance()!.getAuthToken();
      const decoded = decodeJWT(accessToken);
      return { user: user.toObject(), userId: decoded["user_id"] };
    } catch (error) {
      throw new Error('Failed to fetch user data');
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
      })
      .addCase(fetchUserDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDataAsync.fulfilled, (state, action) => {
        const dataAsTeacher: Teacher = {
          id: action.payload.userId,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          dni: action.payload.user.dni,
          email: action.payload.user.email,
          padron: action.payload.user.teacherId,
        } as Teacher

        state.loading = false;
        state.data = dataAsTeacher;
      })
      .addCase(fetchUserDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching user data';
      });;
  },
});

export const selectUserData = (state: RootState) => state.userData.data;
export const selectTeacherCommissions = (state: RootState) => state.userData.commissions;
export const selectTeacherLoading = (state: RootState) => state.userData.loading;
export const selectTeacherError = (state: RootState) => state.userData.error;

export default userDataSlice.reducer;
