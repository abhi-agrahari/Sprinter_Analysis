import { Platform } from 'react-native';
async function analyzeVideo() {
    if (!video) {
        Alert.alert('Error', 'Please select a video first');
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData();

        if (Platform.OS === 'web') {
            console.log('WEB VIDEO URI:', video.uri);
            console.log('WEB VIDEO FILE:', video.file);

            const response = await fetch(video.uri);
            const blob = await response.blob();

            console.log('BLOB SIZE:', blob.size);
            console.log('BLOB TYPE:', blob.type);

            if (!blob || blob.size === 0) {
                throw new Error('Video blob is empty');
            }

            const file = new File(
                [blob],
                video.fileName || 'sprint_video.mp4',
                {
                    type: video.mimeType || blob.type || 'video/mp4',
                }
            );

            console.log('FINAL FILE:', file);
            console.log('FILE NAME:', file.name);
            console.log('FILE SIZE:', file.size);
            console.log('FILE TYPE:', file.type);
            console.log('IS FILE:', file instanceof File);

            formData.append('file', file);
        } else {
            formData.append('file', {
                uri: video.uri,
                name: video.fileName || 'sprint_video.mp4',
                type: video.mimeType || 'video/mp4',
            });
        }

        console.log('========== FORMDATA ==========');

        for (const pair of formData.entries()) {
            console.log(
                'FORM FIELD:',
                pair[0],
                pair[1]
            );
        }

        console.log('==============================');

        const response = await api.analyze(formData);

        console.log('ANALYSIS RESPONSE:', response.data);

        router.push({
            pathname: '/feedback',
            params: {
                stream_url: response.data.stream_url,
                advice: JSON.stringify(response.data.advice),
            },
        });

    } catch (error) {
        console.log('ANALYSIS ERROR:', error);
        console.log('SERVER RESPONSE:', error.response?.data);
        console.log('STATUS:', error.response?.status);

        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            'There was an error processing your video.';

        Alert.alert('Analysis Failed', errorMsg);

    } finally {
        setLoading(false);
    }
}