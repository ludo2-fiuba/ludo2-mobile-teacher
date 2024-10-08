import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPresentSemesterFromCommissionId } from '../repositories/semesters';
import { Semester } from '../models/Semester';
import { RootState } from '../store';
import { semesterRepository } from '../repositories';
import { ClassAttendance } from '../models/ClassAttendance';
import { Student } from '../models';

interface SemesterState {
  data: Semester | null;
  attendances: ClassAttendance[];
  loading: boolean;
  error: string | null;
}

const initialState: SemesterState = {
  data: null,
  attendances: [],
  loading: false,
  error: null,
};

export const fetchSemesterDataAsync = createAsyncThunk(
  'semester/fetchData',
  async (commissionId: number) => {
    try {
      const semester: Semester = await fetchPresentSemesterFromCommissionId(commissionId);
      console.log("Semester:", semester);
      const attendances: ClassAttendance[] = await semesterRepository.getSemesterAttendances(semester.id);
      const sortedAttendances = [...attendances].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { semester, attendances: sortedAttendances };
    } catch (error) {
      throw new Error('Failed to fetch semester data');
    }
  }
);

export const fetchSemesterAttendances = createAsyncThunk(
  'semester/fetchSemesterAttendances',
  async (semesterId: number) => {
    try {
      const attendances: ClassAttendance[] = await semesterRepository.getSemesterAttendances(semesterId);
      const sortedAttendances = [...attendances].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return { attendances: sortedAttendances };
    } catch (error) {
      throw new Error('Failed to fetch semester attendances');
    }
  }
);

const semesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {
    modifyStudentsOfASemester: (state, action) => {
      const students: Student[] = action.payload;
      if (state.data) {
        state.data.students = students;
      }
    },
    modifySemesterDetails: (state, action) => {
      const { classesAmount, minimumAttendance } = action.payload;
      if (state.data) {
        state.data.classesAmount = classesAmount;
        state.data.minimumAttendance = minimumAttendance;
      }
    },
    modifyChiefTeacherWeightInSemester: (state, action) => {
      const { newWeight } = action.payload;
      if (state.data) {
        state.data.commission.chiefTeacherGraderWeight = newWeight;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSemesterDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { attendances, semester } = action.payload;
        state.data = semester;
        state.attendances = attendances;
      })
      .addCase(fetchSemesterDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching semester data';
      })
      .addCase(fetchSemesterAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterAttendances.fulfilled, (state, action) => {
        state.loading = false;
        const { attendances } = action.payload;
        state.attendances = attendances;
      })
      .addCase(fetchSemesterAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching semester data';
      });
  },
});

export const { modifyStudentsOfASemester, modifySemesterDetails, modifyChiefTeacherWeightInSemester } = semesterSlice.actions;

export const selectSemesterData = (state: RootState) => state.semester.data;
export const selectSemesterAttendances = (state: RootState) => state.semester.attendances;
export const selectSemesterLoading = (state: RootState) => state.semester.loading;
export const selectSemesterError = (state: RootState) => state.semester.error;

export default semesterSlice.reducer;
