// src/features/teachers/teachersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teachersRepository } from '../repositories';
import { TeacherTuple } from '../models/TeacherTuple';
import { Teacher } from '../models/Teacher';
import { RootState } from '../store';

interface State {
  staffTeachers: TeacherTuple[];
  allTeachers: Teacher[];
  isLoading: boolean;
  error: any;
}

const initialState: State = {
  allTeachers: [],
  staffTeachers: [],
  isLoading: false,
  error: null,
};

// Async thunk for updating a teacher's role in a commission
export const updateTeacherRoleInCommission = createAsyncThunk(
  'teachers/updateRole',
  async ({ commissionId, teacherId, newRole }: any, { rejectWithValue }) => {
    try {
      const response = await teachersRepository.modifyRoleOfTeacherInCommission(commissionId, teacherId, newRole);
      return { teacherId, newRole };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// AsyncThunk for fetching teachers
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (commissionId: number, { rejectWithValue }) => {
    try {
      const allTeachers: Teacher[]  = await teachersRepository.fetchAllTeachers();
      const staffTeachers: TeacherTuple[] = await teachersRepository.fetchTeachersOfCommission(commissionId);
      return { allTeachers, staffTeachers };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTeacherRoleToCommission = createAsyncThunk(
  'teachers/addTeacherRoleToCommission',
  async ({ commissionId, teacherId, role }: { commissionId: number; teacherId: number; role: string; }, { rejectWithValue }) => {
    try {
      const response = await teachersRepository.createRoleForTeacherInCommission(commissionId, teacherId, role);
      console.log('Response from adding teacher role to commission', response);
      return response;
    } catch (error: any) {
      console.log('Error adding teacher role to commission', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    // Define any synchronous actions here
    modifyTeacherRoleLocally: (state, action) => {
      const { teacherDNI, newRole } = action.payload;
      state.staffTeachers = state.staffTeachers.map(teacher => 
        teacher.teacher.dni === teacherDNI ? { ...teacher, role: newRole } : teacher
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staffTeachers = action.payload.staffTeachers;
        state.allTeachers = action.payload.allTeachers;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addTeacherRoleToCommission.fulfilled, (state, action) => {
        console.log('Teacher role added to commission', action.payload);
        state.staffTeachers.push(action.payload as TeacherTuple);
      })
      .addCase(updateTeacherRoleInCommission.fulfilled, (state, action) => {
        const { teacherId, newRole } = action.payload;
        const index = state.staffTeachers.findIndex(teacher => teacher.teacher.id === teacherId);
        if (index !== -1) {
          state.staffTeachers[index].role = newRole;
        }
      });
  },
});

// Export any actions to use them in components
export const { modifyTeacherRoleLocally } = teachersSlice.actions;

export const selectStaffTeachers = (state: RootState) => state.teachers.staffTeachers;


export default teachersSlice.reducer;
