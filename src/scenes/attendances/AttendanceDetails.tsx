import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Button } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/es';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import { StudentAttendance } from '../../models/StudentAttendance';
import { Semester } from '../../models/Semester';
moment.locale('es');

interface RouteParams {
    classAttendance: any;
}

const AttendanceDetails: React.FC = () => {
    const route = useRoute();
    const semesterData: Semester = useAppSelector(selectSemesterData)!;
    const { classAttendance } = route.params as RouteParams;
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [newAttendance, setNewAttendance] = useState({ firstName: '', lastName: '', padron: '', submittedAt: '' });

    const renderAttendance = ({ item }: { item: any }) => {
        const attended = classAttendance.attendances.find((attendance: StudentAttendance) => attendance.student.padron === item.padron);
        return (
            <View style={styles.attendanceRow}>
                <Text style={styles.attendanceText}>
                    {item.firstName} {item.lastName} ({item.padron})
                </Text>
                {attended ? (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                ) : (
                    <TouchableOpacity onPress={() => handleConfirmAttendance(item)}>
                        <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const handleConfirmAttendance = (student: any) => {
        setSelectedStudent(student);
        setConfirmModalVisible(true);
    };

    const handleAddAttendance = () => {
        setModalVisible(true);
    };

    const handleSaveAttendance = () => {
        if (!newAttendance.firstName || !newAttendance.lastName || !newAttendance.padron || !newAttendance.submittedAt) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        // const attendance: StudentAttendance = {
        //     student: {
        //         firstName: newAttendance.firstName,
        //         lastName: newAttendance.lastName,
        //         padron: newAttendance.padron,
        //     },
        //     submittedAt: new Date(newAttendance.submittedAt).toISOString(),
        // };

        // classAttendance.attendances.push(attendance);
        setModalVisible(false);
        setNewAttendance({ firstName: '', lastName: '', padron: '', submittedAt: '' });
    };

    const handleAddManualAttendance = () => {
        // const attendance: StudentAttendance = {
        //     student: {
        //         firstName: selectedStudent.firstName,
        //         lastName: selectedStudent.lastName,
        //         padron: selectedStudent.padron,
        //     },
        //     submittedAt: new Date().toISOString(),
        // };

        // classAttendance.attendances.push(attendance);
        setConfirmModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sessionHeader}>
                Detalles de la clase del {moment(new Date(classAttendance.createdAt)).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.subHeader}>
                Horario: {moment(new Date(classAttendance.createdAt)).format('HH:mm')} - {moment(new Date(classAttendance.expiresAt)).format('HH:mm')}
            </Text>
            {semesterData?.students?.length > 0 ? (
                <>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>Nombre del Estudiante</Text>
                        <Text style={[styles.headerText, styles.attendanceHeaderText]}>Asistencia</Text>
                    </View>
                    <FlatList
                        data={semesterData.students}
                        renderItem={renderAttendance}
                        keyExtractor={(student) => student.padron}
                    />
                </>
            ) : (
                <Text style={styles.noAttendanceText}>No hay estudiantes para este semestre</Text>
            )}
            <TouchableOpacity style={styles.addButton} onPress={handleAddAttendance}>
                <Ionicons name="add-circle" size={32} color="#fff" />
                <Text style={styles.addButtonText}>Agregar asistencia</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add New Attendance</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={newAttendance.firstName}
                            onChangeText={text => setNewAttendance({ ...newAttendance, firstName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={newAttendance.lastName}
                            onChangeText={text => setNewAttendance({ ...newAttendance, lastName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Padron"
                            value={newAttendance.padron}
                            onChangeText={text => setNewAttendance({ ...newAttendance, padron: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Submitted At"
                            value={newAttendance.submittedAt}
                            onChangeText={text => setNewAttendance({ ...newAttendance, submittedAt: text })}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleSaveAttendance} />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmModalVisible}
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>
                            ¿Está seguro de que desea agregar asistencia para {selectedStudent?.firstName} {selectedStudent?.lastName}?
                        </Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Yes" onPress={handleAddManualAttendance} />
                            <Button title="No" onPress={() => setConfirmModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    sessionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginBottom: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    attendanceHeaderText: {
        textAlign: 'right',
    },
    attendanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
    },
    attendanceText: {
        fontSize: 16,
        flex: 1,
    },
    submittedText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        textAlign: 'right',
    },
    noAttendanceText: {
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default AttendanceDetails;
