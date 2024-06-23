import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { usersRepository } from '../repositories';
import { User } from '../models';
import { profileOverview as style } from '../styles';
import { SessionManager } from '../managers';
import MaterialIcon from './MaterialIcon';
import { makeRequest } from '../networking/makeRequest';
import { useNavigation } from '@react-navigation/native';

Icon.loadFont()

export default function ProfileOverview() {
    const navigation = useNavigation();
    const [user, setUser] = useState<User | null>(null);
    const isLoggedIn = SessionManager.getInstance()?.isLoggedIn()

    useEffect(() => {
        async function getUser() {
            try {
                const fetchedUser = await makeRequest(usersRepository.getInfo, navigation);
                setUser(fetchedUser);
            }
            catch (e) {
                console.log(`ProfileOverview: Failed to retrieve user info with error ${e}`)
            }
        }
        getUser();
    }, [isLoggedIn])

    return (
        <View style={style().view}>
            <MaterialIcon name="account-circle" fontSize={92} color="black" />
            <Text style={style().text}>{user?.firstName}</Text>
            <Text style={style().text}>{user?.lastName}</Text>
        </View>
    )
}
