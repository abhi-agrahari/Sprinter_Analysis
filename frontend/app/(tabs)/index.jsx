async function analyzeVideo() {
    if (!video) {
        Alert.alert('Error', 'Please select a video first');
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData();

        if (video.file) {
            // Web
            formData.append(
                'file',
                video.file,
                video.fileName || 'sprint_video.mp4'
            );
        } else {
            // Android / iOS
            formData.append('file', {
                uri: video.uri,
                name: video.fileName || 'sprint_video.mp4',
                type: video.mimeType || 'video/mp4',
            });
        }

        console.log('Sending video:', video);
        console.log('Video file:', video.file);

        const response = await api.analyze(formData);

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

        const errorMsg =
            error.response?.data?.message ||
            'There was an error processing your video.';

        Alert.alert('Analysis Failed', errorMsg);

    } finally {
        setLoading(false);
    }
}