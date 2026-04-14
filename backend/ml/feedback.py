def get_coaching_feedback(avgs, ideal_values):
    advices = {"good": [], "improve": []}

    # body lean advice
    avg_upright = avgs.get('upright_angles', 0)
    ideal_upright = ideal_values.get('vertical_upright_angle', 0)
    if abs(avg_upright - ideal_upright) > 10:
        advices["improve"].append("Body Lean: Try to lean forward more naturally from your ankles. A steady lean helps you stay fast.")
    else:
        advices["good"].append("Strong Posture: Your forward lean is perfect. This helps you cut through the air easily.")

    # knee drive advice (checking both extension and lift)
    avg_extension = avgs.get('knee_extension', 0)
    avg_lift = avgs.get('knee_lift', 180) 
    ideal_knee = (ideal_values.get('left_knee', 160) + ideal_values.get('right_knee', 160)) / 2
    
    knee_issues = []
    if abs(avg_extension - ideal_knee) > 20:
        knee_issues.append("fully straightening your legs")
    if avg_lift > 130:
        knee_issues.append("lifting your knees higher")

    if knee_issues:
        issue_str = " and ".join(knee_issues)
        advices["improve"].append(f"Knee Action: Focus on {issue_str}. This will give you more power and speed.")
    else:
        advices["good"].append("Great Knee Drive: You are lifting and straightening your legs perfectly. This gives you explosive power.")

    # arm action advice
    avg_elbow = avgs.get('elbow_flare', 0)
    ideal_elbow = (ideal_values.get('Left_elbow', 90) + ideal_values.get('right_elbow', 90)) / 2
    if abs(avg_elbow - ideal_elbow) > 20:
        advices["improve"].append("Arm Drive: Keep your elbows tucked in close to your ribs. Move your arms straight forward and back.")
    else:
        advices["good"].append("Compact Arms: Good job keeping your arms close. This keeps your body stable and fast.")

    # pelvic stability advice
    avg_pelvic = avgs.get('pelvic_tilt', 0)
    ideal_pelvic = ideal_values.get('pelvic_tilt', 0)
    if abs(avg_pelvic - ideal_pelvic) > 10:
        advices["improve"].append("Stable Hips: Try to keep your hips steady and level. A strong core stops your body from wiggling.")
    else:
        advices["good"].append("Solid Core: Your hips are very stable. All your energy is pushing you straight forward.")

    return advices