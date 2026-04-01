import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: '#000',
    },
    container: {
        flexGrow: 1,
        padding: 30,
        backgroundColor: '#000',
        paddingTop: 80,
        paddingBottom: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 40,
    },
    label: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c1e',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
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
        backgroundColor: '#1c1c1e',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    genderButtonActive: {
        backgroundColor: '#007AFF',
    },
    genderText: {
        color: '#888',
        fontSize: 16,
    },
    genderTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#888',
        textAlign: 'center',
    },
    loginLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default styles;
