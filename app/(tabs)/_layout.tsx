import { Tabs } from 'expo-router';
import { Plus, ChartBar as BarChart3 } from 'lucide-react-native';
import { scale, verticalScale} from "@/utils/scaling";
import {HapticTab} from "@/components/HapticTab";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3B82F6',
                tabBarShowLabel:false,
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E5E7EB',
                    height: verticalScale(80),
                    paddingBottom: verticalScale(20),
                    paddingTop: verticalScale(10),
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <BarChart3 size={scale(size)} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add-habit"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Plus size={scale(size)} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}