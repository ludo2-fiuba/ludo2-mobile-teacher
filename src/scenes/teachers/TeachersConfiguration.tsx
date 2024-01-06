import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { TeacherTuple } from '../../models/Teachers';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';

interface RouteProps {
  staffTeachers: TeacherTuple[]
}

enum Role {
  Teacher = "Teacher",
  Assistant = "Assistant",
}

const TeachersConfiguration: React.FC = () => {
  const route = useRoute();
  const staffTeachers = (route.params as RouteProps).staffTeachers;
  

  useEffect(() => {
    // Fetch the initial list of teachers and their roles
    // Example:
    // setTeachers([{ id: '1', name: 'John Doe', role: Role.Teacher }]);
  }, []);

  const handleRoleChange = (teacherDNI: string, newRole: Role) => {
    // setTeachers(teachersTuples.map(teacher => 
    //   teacher.teacher.dni === teacherDNI ? { ...teacher, role: newRole } : teacher
    // ));
  };

  const saveChanges = () => {
    // Save the updated roles to the backend
    // Example: teachersRepository.updateTeachersRoles(teachers);
  };

  return (
    <View>
      {staffTeachers.map(teacherTuple => (
        <View key={teacherTuple.teacher.dni}>
          <Text>{teacherTuple.teacher.firstName}</Text>
          <Picker
            selectedValue={teacherTuple.role}
            onValueChange={(itemValue) => handleRoleChange(teacherTuple.teacher.dni, itemValue as Role)}
          >
            {Object.values(Role).map(role => (
              <Picker.Item key={role} label={role} value={role} />
            ))}
          </Picker>
        </View>
      ))}
      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
};

export default TeachersConfiguration;
