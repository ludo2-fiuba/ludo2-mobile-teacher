import { DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { HomeScreen } from "..";
import { ProfileOverview } from "../../components";
import { SessionManager } from "../../managers";
import { darkModeColors, lightModeColors } from "../../styles/colorPalette";
import { Appearance } from "react-native";

const Drawer = createDrawerNavigator()

const DRAWER_MENU_SHOWN_SCREENS = [
    "Home",
]

const FilteredDrawerContent = (props: DrawerContentComponentProps<DrawerContentOptions>) => {
    const { state, ...rest } = props;
    const newState = {
        ...state, routes: state.routes.filter((route: any) => {
            return DRAWER_MENU_SHOWN_SCREENS.includes(route.name);
        })
    };

    return (
        <DrawerContentScrollView {...props}>
            <ProfileOverview />
            <DrawerItemList {...rest} state={newState} />
            <DrawerItem label="Cerrar Sesión" onPress={async () => {
                await SessionManager.getInstance()?.clearCredentials();
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Landing' }],
                })
            }} />
        </DrawerContentScrollView>
    );
}

const RootDrawer = () => {
    const colors = isDarkTheme() ? darkModeColors : lightModeColors;
    return (
        <Drawer.Navigator
            screenOptions={{ headerTintColor: colors.mainContrastColor }}
            drawerContent={props => <FilteredDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: true, title: 'Comisiones' }}
            />
        </Drawer.Navigator>
    )
}

function isDarkTheme() {
    return Appearance.getColorScheme() === 'dark';
}

export default RootDrawer;
