import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/es';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSemesterAttendances, selectSemesterData } from '../../features/semesterSlice';
import { StudentAttendance } from '../../models/StudentAttendance';
import { Semester } from '../../models/Semester';
import { AttendanceDetailsHeaderRight } from './AttendanceDetailsHeaderRight';
import { ClassAttendance } from '../../models/ClassAttendance';
import { Student } from '../../models';
import { semesterRepository } from '../../repositories';
moment.locale('es');

interface RouteParams {
    classAttendance: ClassAttendance;
}

const AttendanceDetails: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation();
    const route = useRoute();
    const semesterData: Semester = useAppSelector(selectSemesterData)!;
    const { classAttendance } = route.params as RouteParams;

    const setNavOptions = useCallback(() => {
        navigation.setOptions({
            title: 'Detalles de la clase',
            headerRight: () => {
                const now = new Date();
                const lowerLimit = new Date(classAttendance.createdAt);
                const upperLimit = new Date(classAttendance.expiresAt);
                if (now >= lowerLimit && now <= upperLimit)
                    return <AttendanceDetailsHeaderRight />;
            },
        });
    }, [navigation]);

    useEffect(() => {
        const focusUnsubscribe = navigation.addListener('focus', () => {
            setNavOptions();
        });
        return focusUnsubscribe;
    }, []);

    const presentStudents = semesterData.students.filter(student =>
        classAttendance.attendances.find((attendance: StudentAttendance) => attendance.student.padron === student.padron)
    );

    const absentStudents = semesterData.students.filter(student =>
        !classAttendance.attendances.find((attendance: StudentAttendance) => attendance.student.padron === student.padron)
    );

    const renderAttendance = ({ item }: { item: any }, isPresent: boolean) => (
        <View style={styles.attendanceRow}>
            <Text style={styles.attendanceText}>
                {item.firstName} {item.lastName} ({item.padron})
            </Text>
            {isPresent ? (
                <View style={styles.attendanceButton}>
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                    <Text style={styles.attendanceButtonText}>Presente</Text>
                </View>
            ) : (
                <TouchableOpacity style={styles.attendanceButtonAbsent} onPress={() => handleConfirmAttendance(item)}>
                    <Ionicons name="add-circle" size={24} color="orange" />
                    <Text style={styles.attendanceButtonTextAbsent}>Agregar Asistencia</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const handleConfirmAttendance = (student: any) => {
        Alert.alert(
            'Confirmar asistencia',
            `¿Está seguro de que desea agregar asistencia para ${student.firstName} ${student.lastName}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => handleAddManualAttendance(student),
                },
            ]
        );
    };

    const handleAddManualAttendance = async (student: Student) => {
        const data = await semesterRepository.updatedPresentStateToStudent(student.id, classAttendance.qrid)
        dispatch(fetchSemesterAttendances(semesterData.id));
        if (data) {
            Alert.alert('Asistencia agregada', `Se ha agregado la asistencia de ${student.firstName} ${student.lastName}`);
        } else {
            Alert.alert('Error', 'No se pudo agregar la asistencia');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sessionHeader}>
                Fecha: {moment(new Date(classAttendance.createdAt)).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.subHeader}>
                Horario: {moment(new Date(classAttendance.createdAt)).format('HH:mm')} - {moment(new Date(classAttendance.expiresAt)).format('HH:mm')}
            </Text>
            {semesterData?.students?.length > 0 ? (
                <FlatList
                    data={[
                        { header: `Estudiantes Presentes`, data: presentStudents },
                        { header: `Estudiantes Ausentes`, data: absentStudents }
                    ]}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={styles.listHeader}>{item.header}</Text>
                            {item.data.length > 0 ? (
                                item.data.map((student: any) => renderAttendance({ item: student }, item.header === 'Estudiantes Presentes'))
                            ) : (
                                <Text style={styles.emptyListText}>
                                    {item.header === 'Estudiantes Presentes'
                                        ? 'No hay estudiantes presentes.'
                                        : 'No hay estudiantes ausentes.'}
                                </Text>
                            )}
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noAttendanceText}>No hay estudiantes para este semestre</Text>
            )}
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
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
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
        alignItems: 'center', // Ensure alignment vertically in the center
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
        textAlign: 'left', // Align the text to the left
    },
    noAttendanceText: {
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyListText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
        marginVertical: 5,
    },
    attendanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the contents horizontally
        backgroundColor: '#e0e0e0',
        padding: 8,
        borderRadius: 5,
    },
    attendanceButtonText: {
        marginLeft: 8,
        fontSize: 16,
    },
    attendanceButtonAbsent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the contents horizontally
        backgroundColor: '#ffcccb',
        padding: 8,
        borderRadius: 5,
    },
    attendanceButtonTextAbsent: {
        marginLeft: 8,
        fontSize: 16,
        color: 'red',
    },
});

export default AttendanceDetails;
