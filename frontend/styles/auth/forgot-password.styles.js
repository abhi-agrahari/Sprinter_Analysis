import { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 40,
    },
    input: {
        backgroundColor: colors.card,
        color: colors.text,
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 25,
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
    backText: {
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default getStyles;
