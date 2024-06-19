import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import teacherRoles from '../models/TeacherRoles';
import { TeacherTuple } from '../models/TeacherTuple';
import { lightModeColors } from '../styles/colorPalette';
import MaterialIcon from './MaterialIcon';
import PercentageInput from './PercentageInput';

interface TeacherConfigurationCardProps {
    teacherTuple: TeacherTuple;
    teacherGraderWeightAsPercentage: string;
    handleRoleChange: (newRole: string, teacherDNI: string) => void;
    handleWeightChange: (newPercentageInput: number, teacherDNI: string) => void;
    isChiefTeacher?: boolean
}

const TeacherConfigurationCard: React.FC<TeacherConfigurationCardProps> = ({
    teacherTuple,
    teacherGraderWeightAsPercentage,
    handleRoleChange,
    handleWeightChange,
    isChiefTeacher = false
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const confirmDeleteTeacher = (teacherTuple: TeacherTuple) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Está seguro de que desea eliminar a ${teacherTuple.teacher.firstName} ${teacherTuple.teacher.lastName} del cuerpo docente?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => console.log("TODO: API endpoint para eliminar profesor"),
                },
            ]
        )
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.cardItem}>
                <MaterialIcon name="account" fontSize={24} color={lightModeColors.institutional} style={{ marginRight: 10 }} />
                <Text style={styles.passingGradeText}>{teacherTuple.teacher.firstName} {teacherTuple.teacher.lastName}</Text>
                <MaterialIcon name={isExpanded ? "chevron-up" : "chevron-down"} fontSize={24} color='black' />
            </TouchableOpacity>
            {isExpanded && (
                <View>
                    <View style={styles.cardBlock}>
                        <Text style={styles.passingGradeLabel}>Rol</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                enabled={!isChiefTeacher}
                                selectedValue={teacherTuple.role}
                                onValueChange={(itemValue) => handleRoleChange(itemValue, teacherTuple.teacher.dni)}>
                                {teacherRoles.map(role => (
                                    <Picker.Item key={role.id} label={role.longVersion} value={role.shortVersion} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.cardBlock}>
                        <Text style={styles.passingGradeLabel}>Porcentaje (%) auto-asignado para correcciones</Text>
                        <PercentageInput
                            initialValue={teacherGraderWeightAsPercentage}
                            onBlur={(value) => handleWeightChange(value, teacherTuple.teacher.dni)}
                        />
                    </View>
                    {!isChiefTeacher && <TouchableOpacity
                        onPress={() => confirmDeleteTeacher(teacherTuple)}
                        style={styles.deleteButton}
                    >
                        <MaterialIcon name="delete" fontSize={24} color='white' />
                        <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        justifyContent: 'space-between'
    },
    cardBlock: { paddingHorizontal: 15, paddingBottom: 15 },
    passingGradeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: lightModeColors.institutional,
    },
    passingGradeLabel: {
        fontSize: 14,
        color: 'black',
        marginBottom: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 8,
        overflow: 'hidden', // Ensures the picker doesn't overlap the rounded corners
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-end',
        marginRight: 15,
        marginBottom: 10,
    },
    deleteButtonText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
});

export default TeacherConfigurationCard;