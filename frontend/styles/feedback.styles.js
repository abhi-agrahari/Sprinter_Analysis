it aimport { StyleSheet } from 'react-native';

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        marginTop: 60,
        marginBottom: 20,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        textAlign: 'left',
    },
    adviceGroup: {
        marginBottom: 30,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
    },
    adviceCard: {
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    adviceText: {
        color: colors.text,
        fontSize: 15,
        lineHeight: 22,
    },
    video: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        backgroundColor: colors.card,
        marginBottom: 40,
    },
    videoPlaceholder: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    placeholderText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});

export default getStyles;
