import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TeacherTuple } from '../../models/TeacherTuple';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { modifyChiefTeacherWeightLocally, modifyTeacherRoleLocally, modifyTeacherWeightLocally, updateTeacherInCommission } from '../../features/teachersSlice';
import { RoundedButton, TeacherConfigurationCard } from '../../components';
import { mapChiefPercentageToWeight, mapPercentageToWeight, mapWeightToPercentage } from '../../utils/graderWeightConversions';
import { commissionRepository } from '../../repositories';

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
  const chiefTeacherTuple = getVirtualChiefTeacherTuple(staffTeachers);

  const handleRoleChange = (newRole: string, teacherDNI: string) => {
    dispatch(modifyTeacherRoleLocally({ teacherDNI: teacherDNI, newRole: newRole }));
  };

  const handleWeightChange = (newPercentageInput: number, teacherDNI: string) => {
    const asPercentage = newPercentageInput / 100;
    if (asPercentage) {
      const newWeight = mapPercentageToWeight(teacherDNI, asPercentage, staffTeachers);
      dispatch(modifyTeacherWeightLocally({ teacherDNI, newWeight }));
    }
  };

  const handleChiefWeightChange = (newPercentageInput: number) => {
    const newPercentage = newPercentageInput / 100;
    if (newPercentage) {
      const newWeight = mapChiefPercentageToWeight(newPercentage, staffTeachers);
      dispatch(modifyChiefTeacherWeightLocally({ newWeight }));
    }
  };

  const saveChanges = () => {
    const originalChiefWeight = originalStaffTeachers[0].commission.chiefTeacherGraderWeight
    if (originalChiefWeight !== chiefTeacherTuple.graderWeight) {
      commissionRepository.modifyChiefTeacherWeight(commissionId, chiefTeacherTuple.graderWeight);
    }

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
      <TeacherConfigurationCard
        teacherTuple={chiefTeacherTuple}
        teacherGraderWeightAsPercentage={mapWeightToPercentage(chiefTeacherTuple.graderWeight, staffTeachers)}
        handleWeightChange={handleChiefWeightChange}
        handleRoleChange={handleRoleChange}
        isChiefTeacher
      />
      {staffTeachers.map((teacherTuple) => (
        <TeacherConfigurationCard
          key={teacherTuple.teacher.dni}
          teacherTuple={teacherTuple}
          teacherGraderWeightAsPercentage={mapWeightToPercentage(teacherTuple.graderWeight, staffTeachers)}
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

function getVirtualChiefTeacherTuple(staffTeachers: TeacherTuple[]): TeacherTuple {
  const commission = staffTeachers[0].commission;
  return {
    commission: commission,
    role: "Profesor Titular",
    teacher: commission.chiefTeacher,
    graderWeight: commission.chiefTeacherGraderWeight
  };
}
