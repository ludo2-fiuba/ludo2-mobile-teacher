import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TeacherTuple } from '../../models/TeacherTuple';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { modifyTeacherRoleLocally, modifyTeacherWeightLocally, updateTeacherInCommission } from '../../features/teachersSlice';
import { RoundedButton, TeacherConfigurationCard } from '../../components';
import { mapPercentageToWeight, mapWeightToPercentage } from '../../utils/graderWeightConversions';

interface RouteProps {
  staffTeachers: TeacherTuple[]
  commissionId: number
}

const TeachersConfiguration: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const commissionId = (route.params as RouteProps).commissionId;
  const originalStaffTeachers = (route.params as RouteProps).staffTeachers;
  const staffTeachers = useAppSelector((state) => state.teachers.staffTeachers);

  const handleRoleChange = (teacherDNI: string, newRole: string) => {
    dispatch(modifyTeacherRoleLocally({ teacherDNI: teacherDNI, newRole: newRole }));
  };

  const handleWeightChange = (teacherDNI: string, newPercentageInput: number) => {
    const asPercentage = newPercentageInput / 100;
    if (asPercentage) {
      const newWeight = mapPercentageToWeight(teacherDNI, asPercentage, staffTeachers);
      dispatch(modifyTeacherWeightLocally({ teacherDNI, newWeight }));
    }
  };

  const saveChanges = () => {
    for (const teacherTuple of staffTeachers) {
      const originalTuple = originalStaffTeachers.find(originalTuple => originalTuple.teacher.dni === teacherTuple.teacher.dni);
      if (originalTuple?.role !== teacherTuple.role || originalTuple?.graderWeight !== teacherTuple.graderWeight) {
        dispatch(updateTeacherInCommission(
          {
            commissionId: commissionId,
            teacherId: teacherTuple.teacher.id,
            newRole: teacherTuple.role,
            newWeight: teacherTuple.graderWeight
          }));
      }
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {staffTeachers.map((teacherTuple) => (
        <TeacherConfigurationCard
          teacherTuple={teacherTuple}
          teacherGraderWeightAsPercentage={mapWeightToPercentage(teacherTuple.teacher.dni, staffTeachers)}
          handleWeightChange={handleWeightChange}
          handleRoleChange={handleRoleChange}
        />
      ))}
      <RoundedButton text="Guardar cambios" onPress={saveChanges} style={{ MainContainer: { marginBottom: 100 } }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TeachersConfiguration;
