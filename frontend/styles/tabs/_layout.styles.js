import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#000000',
        borderTopWidth: 0,
        height: 90,
        paddingBottom: 30,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
    },
    iconContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIcon: {
        backgroundColor: '#1c1c1e',
    },
    symbol: {
        width: 24,
        height: 24,
    },
});

export default styles;
