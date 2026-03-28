def calculate_accuracy(actual, predicted):

    if predicted == 0:
        return 0.0

    if actual > predicted:
        actual, predicted = predicted, actual

    accuracy = 100 * (actual / predicted)

    return accuracy


def generate_feedback(actual_values, predicted_values):

    feedback = {}
    total_accuracy = 0
    metric_count = 0

    for metric_name in actual_values:
        actual = actual_values[metric_name]
        predicted = predicted_values.get(metric_name, 0)

        # calculation accuracy
        accuracy = calculate_accuracy(actual, predicted)
        total_accuracy += accuracy
        metric_count += 1

        # generating advice
        advice = _get_advice(metric_name, accuracy)

        # storing feedback
        feedback[metric_name] = {
            'actual_value': round(actual, 4),
            'ideal_value': round(predicted, 4),
            'accuracy_percent': round(accuracy, 2),
            'advice': advice
        }

    # calculating overall score
    overall_accuracy = total_accuracy / metric_count if metric_count > 0 else 0

    return {
        'metrics': feedback,
        'overall_accuracy': round(overall_accuracy, 2)
    }


def _get_advice(metric_name, accuracy):

    # advice map
    advice_map = {
        'vertical_upright_angle': {
            'good': 'Your posture is good, continue to keep it upright.',
            'improve': 'Work on maintaining a more upright posture. '
                       'Focus on keeping your head up and shoulders back.'
        },
        'mean_deviation_stride': {
            'good': 'Your stride length is consistent, maintain it.',
            'improve': 'Work on improving your stride consistency. '
                       'Practice with markers on the track.'
        },
        'left_elbow': {
            'good': 'Left arm form is good; keep your elbows close.',
            'improve': 'Your left elbow is flaring out. Keep your arms '
                       'closer to your body while pumping.'
        },
        'right_elbow': {
            'good': 'Right arm form is good, keep your elbows close.',
            'improve': 'Your right elbow is flaring out. Keep your arms '
                       'closer to your body while pumping.'
        },
        'left_knee': {
            'good': 'Left knee drive is good; maintain proper lift and extension.',
            'improve': 'Your left knee drive needs improvement. Focus on lifting '
                       'your knee higher and extending your leg forward during the stride.'
        },
        'right_knee': {
            'good': 'Right knee drive is good; maintain proper lift and extension.',
            'improve': 'Your right knee drive needs improvement. Focus on lifting '
                       'your knee higher and extending your leg forward during the stride.'
        }
    }

    # getting advice
    metric_advice = advice_map.get(metric_name, {
        'good': 'This metric looks good!',
        'improve': 'This metric needs improvement.'
    })

    if accuracy >= 90:
        return metric_advice['good']
    else:
        return metric_advice['improve']