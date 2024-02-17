import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppSelector } from '../../hooks';
import { Student } from '../../models/Student'; // Make sure this import reflects the actual path

const SemesterStudents: React.FC = () => {
  const students = useAppSelector((state) => state.semester.data?.students as Student[]);

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>{item.firstName} {item.lastName} ({item.email}) </Text>
      <Text style={styles.studentDetail}>Padrón: {item.legajo || 'Padrón faltante'}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alumnos ({students?.length || 0})</Text>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5', // Light grey background color
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: 'white', // White background for the card
    borderRadius: 8, // Rounded corners for the card
    padding: 15, // Padding inside the card
    marginBottom: 10, // Margin at the bottom of each card
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Elevation for Android
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4, // Space between name and details
  },
  studentDetail: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 2, // Space between each detail
  },
  // Add additional styles for other elements if needed
});

export default SemesterStudents;
