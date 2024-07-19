import { DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { HomeScreen, StatsScreen } from "..";
import { ProfileOverview } from "../../components";
import { SessionManager } from "../../managers";
import { darkModeColors, lightModeColors } from "../../styles/colorPalette";
import { Appearance } from "react-native";
import React from "react";
import MaterialIcon from "../../components/MaterialIcon";
import CreateSemester from "../semesters/CreateSemester";

const Drawer = createDrawerNavigator()

const DRAWER_MENU_SHOWN_SCREENS = [
  "Home",
  "CreateSemester",
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
      }}
      icon={makeDrawerIcon('logout-variant', 'logout-variant')} 
    />
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
        options={{ headerShown: true, title: 'Comisiones', drawerIcon: makeDrawerIcon('home', 'home-outline')}}
      />

      <Drawer.Screen
        name="CreateSemester"
        component={CreateSemester}
        options={{ headerShown: true, title: 'Crear Cuatrimestre', drawerIcon: makeDrawerIcon('chart-box', 'chart-box-outline') }}
      />
    </Drawer.Navigator>
  )
}

function isDarkTheme() {
  return Appearance.getColorScheme() === 'dark';
}

function makeDrawerIcon(focusedIcon: string, unfocusedIcon: string): ((props: { color: string; size: number; focused: boolean; }) => React.ReactNode) {
  return ({ focused, color, size }) => <MaterialIcon color={color} fontSize={size} name={focused ? focusedIcon : unfocusedIcon} style={{ marginRight: -8 }} />;
}

export default RootDrawer;
