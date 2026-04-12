import { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 60,
        marginBottom: 20,
        paddingHorizontal: 25,
    },
    list: {
        paddingHorizontal: 25,
    },
    card: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    arrow: {
        color: colors.textSecondary,
        fontSize: 18,
    },
    adviceText: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    empty: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 15,
    },
});

export default getStyles;
