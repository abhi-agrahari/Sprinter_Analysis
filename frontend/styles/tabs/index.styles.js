import { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 25,
    },
    header: {
        marginTop: 60,
        marginBottom: 40,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.primary,
        marginBottom: 15,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 8,
        lineHeight: 22,
    },
    uploadBox: {
        height: 250,
        backgroundColor: colors.card,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    pickVideo: {
        alignItems: 'center',
    },
    pickerIcon: {
        fontSize: 50,
        marginBottom: 10,
    },
    pickerText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    videoSelected: {
        alignItems: 'center',
    },
    videoText: {
        color: colors.success,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    videoName: {
        color: colors.text,
        fontSize: 16,
        marginBottom: 15,
    },
    changeButton: {
        marginTop: 10,
    },
    changeText: {
        color: colors.textSecondary,
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    analyzeButton: {
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    analyzeButtonDisabled: {
        opacity: 0.6,
    },
    analyzeButtonText: {
        color: colors.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.buttonText,
        marginLeft: 10,
        fontSize: 16,
    },
    limitNote: {
        fontSize: 14,
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: -30,
        marginBottom: 30,
        fontWeight: 'bold',
    }
});

export default getStyles;
