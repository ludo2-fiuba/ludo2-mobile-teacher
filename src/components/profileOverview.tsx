import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { profileOverview as style } from '../styles';
import MaterialIcon from './MaterialIcon';
import { selectUserData } from '../features/userDataSlice';
import { useAppSelector } from '../hooks';

Icon.loadFont()

export default function ProfileOverview() {
    const userData = useAppSelector(selectUserData);

    return (
        <View style={style().view}>
            <MaterialIcon name="account-circle" fontSize={92} color="black" />
            <Text style={style().text}>{userData?.firstName}</Text>
            <Text style={style().text}>{userData?.lastName}</Text>
        </View>
    )
}
