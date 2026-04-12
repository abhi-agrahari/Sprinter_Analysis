import { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 15,
    },
    form: {
        paddingHorizontal: 25,
    },
    label: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 10,
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
    saveButton: {
        backgroundColor: colors.buttonBackground,
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 30,
    },
    saveButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: colors.error,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    logoutButtonText: {
        color: colors.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Theme Switch Styles
    themeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: colors.border,
    },
    themeLabel: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeToggleText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default getStyles;
