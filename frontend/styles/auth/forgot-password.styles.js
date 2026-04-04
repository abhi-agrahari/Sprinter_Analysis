import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#1c1c1e',
        color: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        fontSize: 16,
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
    backText: {
        color: '#888',
        textAlign: 'center',
    },
});

export default styles;
