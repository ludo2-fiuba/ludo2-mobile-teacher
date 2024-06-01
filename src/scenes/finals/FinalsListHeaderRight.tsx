import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props { 
	subjectId: number;
	subjectName: string;
}

export function FinalsListHeaderRight({ subjectId, subjectName }: Props) {
	const navigation = useNavigation()

	const addFinal = () => {
		navigation.navigate('AddFinal', {
			subjectId: subjectId,
			subjectName: subjectName,
		});
	}

	return (
		<View style={styles.navButtonsContainer}>
			<TouchableOpacity style={styles.navButton} onPress={addFinal}>
				<Icon name="add" style={styles.navButtonIcon} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	navButtonsContainer: {
		flexDirection: 'row',
		marginRight: 10,
	},
	navButton: {
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
		marginHorizontal: 5,
		opacity: 1,
		marginTop: 5,
	},
	navButtonIcon: {
		fontSize: 20,
	},
});
