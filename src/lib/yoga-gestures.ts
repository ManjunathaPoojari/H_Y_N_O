
// Comprehensive dictionary of yoga pose instructions/gestures
export const YOGA_GESTURES: Record<string, string> = {
    // Basic Standing Poses
    'Mountain': 'Stand tall with feet together, shoulders relaxed, and palms facing forward. Ground down through your feet.',
    'Mountain Pose': 'Stand tall with feet together, shoulders relaxed, and palms facing forward. Ground down through your feet.',
    'Tadasana': 'Stand tall with feet together, shoulders relaxed, and palms facing forward. Ground down through your feet.',

    'Forward Fold': 'Stand and hinge at hips to reach towards floor. Relax your neck and let your head hang heavy.',
    'Standing Forward Fold': 'Stand and hinge at hips to reach towards floor. Relax your neck and let your head hang heavy.',
    'Standing Forward Bend': 'Stand and hinge at hips to reach towards floor. Relax your neck and let your head hang heavy.',
    'Uttanasana': 'Stand and hinge at hips to reach towards floor. Relax your neck and let your head hang heavy.',
    'Forward Bend': 'Hinge at your hips and fold your torso over your legs. Keep your knees soft if needed.',

    'Warrior I': 'Lunge forward high, back heel grounded at 45 degrees. Reach arms to sky and square hips forward.',
    'Virabhadrasana I': 'Lunge forward high, back heel grounded at 45 degrees. Reach arms to sky and square hips forward.',

    'Warrior II': 'Lunge deeply into front leg, open hips to side. Arms extended parallel to floor, gaze over front hand.',
    'Virabhadrasana II': 'Lunge deeply into front leg, open hips to side. Arms extended parallel to floor, gaze over front hand.',

    'Warrior III': 'Balance on one leg, hinge forward at hips. Extend other leg back and arms forward like a T.',
    'Virabhadrasana III': 'Balance on one leg, hinge forward at hips. Extend other leg back and arms forward like a T.',

    'Tree': 'Balance on one leg. Place sole of other foot on inner thigh or calf. Hands at heart center.',
    'Tree Pose': 'Balance on one leg. Place sole of other foot on inner thigh or calf. Hands at heart center.',
    'Vrksasana': 'Balance on one leg. Place sole of other foot on inner thigh or calf. Hands at heart center.',

    'Triangle': 'Features a wide stance. Reach forward, then hinge at hip to place hand on shin. Extend other arm up.',
    'Triangle Pose': 'Features a wide stance. Reach forward, then hinge at hip to place hand on shin. Extend other arm up.',
    'Trikonasana': 'Features a wide stance. Reach forward, then hinge at hip to place hand on shin. Extend other arm up.',

    // Floor Poses
    'Downward Dog': 'Inverted V-shape. Hands shoulder-width, feet hip-width. Press hips up and back.',
    'Downward Facing Dog': 'Inverted V-shape. Hands shoulder-width, feet hip-width. Press hips up and back.',
    'Adho Mukha Svanasana': 'Inverted V-shape. Hands shoulder-width, feet hip-width. Press hips up and back.',

    'Child\'s Pose': 'Kneel wide, sit back on heels. Fold forward resting forehead on mat, arms extended.',
    'Balasana': 'Kneel wide, sit back on heels. Fold forward resting forehead on mat, arms extended.',

    'Cobra': 'Lie on belly. Place hands under shoulders. Inhale to lift chest gently, keeping elbows tucked.',
    'Cobra Pose': 'Lie on belly. Place hands under shoulders. Inhale to lift chest gently, keeping elbows tucked.',
    'Bhujangasana': 'Lie on belly. Place hands under shoulders. Inhale to lift chest gently, keeping elbows tucked.',

    'Upward Facing Dog': 'Lie on belly. Press into hands and tops of feet to lift entire body off mat except hands and feet.',
    'Urdhva Mukha Svanasana': 'Lie on belly. Press into hands and tops of feet to lift entire body off mat except hands and feet.',

    'Cat-Cow': 'Tabletop position. Inhale arch back (Cow), exhale round spine (Cat). Move with breath.',
    'Cat Cow': 'Tabletop position. Inhale arch back (Cow), exhale round spine (Cat). Move with breath.',
    'Marjaryasana': 'Tabletop position. Inhale arch back (Cow), exhale round spine (Cat). Move with breath.',

    'Butterfly': 'Seated, bring soles of feet together. Let knees drop open comfortably. Sit tall.',
    'Butterfly Pose': 'Seated, bring soles of feet together. Let knees drop open comfortably. Sit tall.',
    'Baddha Konasana': 'Seated, bring soles of feet together. Let knees drop open comfortably. Sit tall.',

    'Bridge': 'Lie on back, knees bent. Press feet down to lift hips high. Interlace hands underneath if possible.',
    'Bridge Pose': 'Lie on back, knees bent. Press feet down to lift hips high. Interlace hands underneath if possible.',
    'Setu Bandha Sarvangasana': 'Lie on back, knees bent. Press feet down to lift hips high. Interlace hands underneath if possible.',

    'Corpse': 'Lie completely flat on back. Arms at sides, palms up. Close eyes and surrender all effort.',
    'Corpse Pose': 'Lie completely flat on back. Arms at sides, palms up. Close eyes and surrender all effort.',
    'Savasana': 'Lie completely flat on back. Arms at sides, palms up. Close eyes and surrender all effort.',

    // Seated
    'Easy Pose': 'Sit comfortably with legs crossed. Rest hands on knees. Lengthen your spine.',
    'Sukhasana': 'Sit comfortably with legs crossed. Rest hands on knees. Lengthen your spine.',

    'Seated Twist': 'Seated, cross one leg over other. Twist torso toward the bent knee side. Look back gently.',
    'Half Lord of the Fishes': 'Seated, cross one leg over other. Twist torso toward the bent knee side. Look back gently.',

    // Others
    'Plank': 'Top of push-up. Core engaged, body in straight line from head to heels.',
    'Plank Pose': 'Top of push-up. Core engaged, body in straight line from head to heels.',
    'Kumbhakasana': 'Top of push-up. Core engaged, body in straight line from head to heels.',

    'Chaturanga': 'From plank, lower halfway down keeping elbows hugged into ribs. Body straight.',
    'Low Plank': 'From plank, lower halfway down keeping elbows hugged into ribs. Body straight.',

    'Chair': 'Feet together. Bend knees and sink hips back as if sitting in a chair. Reach arms high.',
    'Chair Pose': 'Feet together. Bend knees and sink hips back as if sitting in a chair. Reach arms high.',
    'Utkatasana': 'Feet together. Bend knees and sink hips back as if sitting in a chair. Reach arms high.'
};

export const getYogaGesture = (poseName: string | undefined): string => {
    if (!poseName) return 'Focus on your breath and maintain a comfortable steadiness.';

    const normalizedName = poseName.trim();

    // 1. Try exact match
    if (YOGA_GESTURES[normalizedName]) {
        return YOGA_GESTURES[normalizedName];
    }

    // 2. Try case-insensitive exact match
    const exactKey = Object.keys(YOGA_GESTURES).find(k => k.toLowerCase() === normalizedName.toLowerCase());
    if (exactKey) return YOGA_GESTURES[exactKey];

    // 3. Try to find if the Pose Name contains a key (e.g. "Standing Forward Fold Variation" contains "Forward Fold")
    // Sort keys by length descending to match longest possible key first
    const sortedKeys = Object.keys(YOGA_GESTURES).sort((a, b) => b.length - a.length);
    const containingKey = sortedKeys.find(k => normalizedName.toLowerCase().includes(k.toLowerCase()));
    if (containingKey) return YOGA_GESTURES[containingKey];

    // 4. Try to find if a key contains the Pose Name (e.g. key "Mountain Pose" contains "Mountain")
    const partKey = sortedKeys.find(k => k.toLowerCase().includes(normalizedName.toLowerCase()));
    if (partKey) return YOGA_GESTURES[partKey];

    return `Gently move into ${normalizedName}. Focus on your alignment and breath.`;
};
