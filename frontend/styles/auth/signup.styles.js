import { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    scroll: {
        backgroundColor: colors.background,
    },
    container: {
        flexGrow: 1,
        padding: 30,
        backgroundColor: colors.background,
        paddingTop: 80,
        paddingBottom: 60,
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
    label: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
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
        paddingVertical: 15,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    genderButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: colors.card,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: colors.border,
    },
    genderButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    genderText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    genderTextActive: {
        color: colors.buttonText,
        fontWeight: 'bold',
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
    loginText: {
        color: colors.textSecondary,
        textAlign: 'center',
    },
    loginLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export default getStyles;
