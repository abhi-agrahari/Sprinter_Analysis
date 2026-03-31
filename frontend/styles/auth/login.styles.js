import { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 30,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 15,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: colors.text,
        paddingVertical: 18,
        fontSize: 16,
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotText: {
        color: colors.primary,
        fontSize: 14,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 30,
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupButton: {
        alignItems: 'center',
    },
    signupText: {
        color: colors.textSecondary,
        textAlign: 'center',
    },
    signupLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export default getStyles;