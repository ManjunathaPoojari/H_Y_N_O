// Comprehensive Yoga Pose Library for HYNO Health Management System

export interface YogaPose {
  id: string;
  name: string;
  sanskritName?: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
  instructions: string[];
  benefits: string[];
  imageUrl?: string;
  videoUrl?: string;
  category: string[]; // e.g., ['standing', 'balancing', 'backbend']
  contraindications?: string[];
  modifications?: string[];
}

export const yogaPoses: YogaPose[] = [
  // Standing Poses
  {
    id: 'mountain-pose',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Foundation and alignment',
    category: ['standing', 'balancing'],
    instructions: [
      'Stand tall with feet together, big toes touching',
      'Distribute weight evenly across both feet',
      'Engage your thigh muscles and lift your kneecaps',
      'Lengthen your spine and relax your shoulders',
      'Keep your arms at your sides with palms facing forward',
      'Gaze forward with a soft focus'
    ],
    benefits: [
      'Improves posture and alignment',
      'Strengthens legs and core',
      'Increases body awareness',
      'Calms the mind and reduces stress'
    ],
    contraindications: ['Severe back pain', 'Recent ankle injury']
  },
  {
    id: 'tree-pose',
    name: 'Tree Pose',
    sanskritName: 'Vrksasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Balance and concentration',
    category: ['standing', 'balancing'],
    instructions: [
      'Start in Mountain Pose',
      'Shift weight to your left foot',
      'Place your right foot on your left inner thigh or calf',
      'Bring hands to heart center or extend arms overhead',
      'Find a focal point to help with balance',
      'Hold and then switch sides'
    ],
    benefits: [
      'Improves balance and stability',
      'Strengthens legs and core',
      'Enhances concentration and focus',
      'Opens hips and improves posture'
    ],
    contraindications: ['Balance issues', 'Recent ankle or knee injury']
  },
  {
    id: 'warrior-1',
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Strength and stability',
    category: ['standing', 'strengthening'],
    instructions: [
      'Start in Mountain Pose',
      'Step your left foot back about 4 feet',
      'Turn your left foot out 45 degrees',
      'Bend your right knee over your right ankle',
      'Square your hips to the front',
      'Extend arms overhead or keep at heart center',
      'Hold and then switch sides'
    ],
    benefits: [
      'Strengthens legs and arms',
      'Opens hips and chest',
      'Improves balance and concentration',
      'Builds stamina and endurance'
    ],
    contraindications: ['High blood pressure', 'Shoulder injury']
  },
  {
    id: 'warrior-2',
    name: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Strength and grounding',
    category: ['standing', 'strengthening'],
    instructions: [
      'Start in Warrior I position',
      'Open your hips and shoulders to the side',
      'Extend arms parallel to the floor',
      'Gaze over your front fingertips',
      'Keep your front knee bent and back leg straight',
      'Press firmly through both feet'
    ],
    benefits: [
      'Strengthens legs and ankles',
      'Opens hips and shoulders',
      'Improves concentration and stamina',
      'Builds inner strength'
    ],
    contraindications: ['Recent knee injury', 'High blood pressure']
  },
  {
    id: 'triangle-pose',
    name: 'Triangle Pose',
    sanskritName: 'Trikonasana',
    duration: 30,
    difficulty: 'intermediate',
    focus: 'Side body stretch and balance',
    category: ['standing', 'stretching'],
    instructions: [
      'Start in Warrior II position',
      'Straighten your front leg',
      'Reach forward with your front hand',
      'Lower your front hand to the floor or a block',
      'Extend your top arm toward the ceiling',
      'Keep both sides of your torso long',
      'Gaze up toward your top hand'
    ],
    benefits: [
      'Stretches and strengthens legs',
      'Opens hips and shoulders',
      'Improves balance and stability',
      'Relieves back pain'
    ],
    contraindications: ['Back injury', 'Neck injury', 'Low blood pressure']
  },

  // Seated Poses
  {
    id: 'seated-forward-bend',
    name: 'Seated Forward Bend',
    sanskritName: 'Paschimottanasana',
    duration: 45,
    difficulty: 'intermediate',
    focus: 'Hamstring and back stretch',
    category: ['seated', 'stretching'],
    instructions: [
      'Sit with legs extended forward',
      'Keep your spine straight and shoulders relaxed',
      'Inhale to lengthen your spine',
      'Exhale and fold forward from your hips',
      'Reach toward your feet or shins',
      'Keep your neck relaxed and breathe deeply'
    ],
    benefits: [
      'Stretches hamstrings and back',
      'Calms the mind and nervous system',
      'Improves digestion',
      'Relieves stress and anxiety'
    ],
    contraindications: ['Back injury', 'Pregnancy', 'Sciatica']
  },
  {
    id: 'butterfly-pose',
    name: 'Butterfly Pose',
    sanskritName: 'Baddha Konasana',
    duration: 45,
    difficulty: 'beginner',
    focus: 'Hip opener and groin stretch',
    category: ['seated', 'stretching'],
    instructions: [
      'Sit with soles of feet together',
      'Let your knees fall open to the sides',
      'Hold your feet with both hands',
      'Lengthen your spine and relax your shoulders',
      'Gently press your knees toward the floor',
      'Breathe deeply and relax'
    ],
    benefits: [
      'Opens hips and groin',
      'Stretches inner thighs',
      'Improves circulation',
      'Relieves menstrual discomfort'
    ],
    contraindications: ['Knee injury', 'Groin injury']
  },

  // Backbends
  {
    id: 'cobra-pose',
    name: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    duration: 20,
    difficulty: 'beginner',
    focus: 'Back strength and chest opener',
    category: ['backbend', 'strengthening'],
    instructions: [
      'Lie face down with hands under shoulders',
      'Keep elbows close to your body',
      'Press into your hands to lift your chest',
      'Keep your shoulders down and back',
      'Gaze forward or slightly up',
      'Keep your lower body grounded'
    ],
    benefits: [
      'Strengthens back muscles',
      'Opens chest and shoulders',
      'Improves posture',
      'Stimulates abdominal organs'
    ],
    contraindications: ['Back injury', 'Carpal tunnel syndrome']
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Pose',
    sanskritName: 'Marjaryasana-Bitilasana',
    duration: 60,
    difficulty: 'beginner',
    focus: 'Spine mobility and breath awareness',
    category: ['backbend', 'stretching'],
    instructions: [
      'Start on hands and knees',
      'Wrists under shoulders, knees under hips',
      'Inhale: arch back, lift tailbone and chest (Cow)',
      'Exhale: round spine, tuck chin (Cat)',
      'Move with your breath for several rounds',
      'Keep movements smooth and controlled'
    ],
    benefits: [
      'Improves spinal flexibility',
      'Relieves back tension',
      'Improves posture',
      'Connects breath with movement'
    ],
    contraindications: ['Knee injury', 'Wrist injury']
  },

  // Balancing Poses
  {
    id: 'crow-pose',
    name: 'Crow Pose',
    sanskritName: 'Bakasana',
    duration: 15,
    difficulty: 'advanced',
    focus: 'Arm strength and balance',
    category: ['balancing', 'arm-balance'],
    instructions: [
      'Squat with feet together',
      'Place hands on floor shoulder-width apart',
      'Bring knees to upper arms',
      'Lean forward and lift feet off ground',
      'Keep elbows bent and close to body',
      'Gaze forward between hands'
    ],
    benefits: [
      'Builds arm and core strength',
      'Improves balance and concentration',
      'Boosts confidence',
      'Strengthens wrists and forearms'
    ],
    contraindications: ['Wrist injury', 'Shoulder injury', 'Pregnancy']
  },

  // Inversions
  {
    id: 'downward-dog',
    name: 'Downward Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Full body stretch and strength',
    category: ['standing', 'stretching'],
    instructions: [
      'Start on hands and knees',
      'Lift hips up and back',
      'Straighten arms and legs',
      'Press hands and feet firmly into the ground',
      'Keep head between arms or let it hang',
      'Pedal feet to deepen the stretch'
    ],
    benefits: [
      'Stretches entire back body',
      'Strengthens arms and legs',
      'Improves circulation',
      'Calms the mind'
    ],
    contraindications: ['High blood pressure', 'Shoulder injury', 'Pregnancy (late stages)']
  },

  // Restorative Poses
  {
    id: 'childs-pose',
    name: 'Child\'s Pose',
    sanskritName: 'Balasana',
    duration: 60,
    difficulty: 'beginner',
    focus: 'Rest and relaxation',
    category: ['restorative', 'stretching'],
    instructions: [
      'Kneel with knees wide and big toes touching',
      'Fold forward and extend arms',
      'Rest forehead on the ground',
      'Breathe deeply into your back',
      'Stay as long as comfortable',
      'Walk hands back to sit up slowly'
    ],
    benefits: [
      'Relieves stress and fatigue',
      'Stretches back and hips',
      'Calms the mind',
      'Restores energy'
    ],
    contraindications: ['Knee injury', 'Pregnancy']
  },
  {
    id: 'corpse-pose',
    name: 'Corpse Pose',
    sanskritName: 'Savasana',
    duration: 300,
    difficulty: 'beginner',
    focus: 'Deep relaxation and integration',
    category: ['restorative', 'meditation'],
    instructions: [
      'Lie on your back with legs extended',
      'Arms relaxed at your sides',
      'Close your eyes and relax completely',
      'Scan your body for tension',
      'Breathe naturally and deeply',
      'Stay present and aware'
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Lowers blood pressure',
      'Improves sleep quality',
      'Integrates benefits of practice'
    ],
    contraindications: ['Back injury (use support)', 'Pregnancy (side-lying modification)']
  },

  // Core Poses
  {
    id: 'plank-pose',
    name: 'Plank Pose',
    sanskritName: 'Phalakasana',
    duration: 20,
    difficulty: 'intermediate',
    focus: 'Core strength and stability',
    category: ['core', 'strengthening'],
    instructions: [
      'Start in push-up position',
      'Keep body in straight line from head to heels',
      'Engage core and glutes',
      'Press hands firmly into the ground',
      'Keep shoulders over wrists',
      'Breathe steadily'
    ],
    benefits: [
      'Strengthens core and arms',
      'Improves posture',
      'Builds endurance',
      'Tones abdominal muscles'
    ],
    contraindications: ['Wrist injury', 'Shoulder injury', 'Pregnancy']
  },
  {
    id: 'boat-pose',
    name: 'Boat Pose',
    sanskritName: 'Navasana',
    duration: 20,
    difficulty: 'intermediate',
    focus: 'Core strength and balance',
    category: ['core', 'balancing'],
    instructions: [
      'Sit with knees bent and feet on floor',
      'Lean back slightly and lift feet',
      'Balance on sitting bones',
      'Extend arms parallel to floor',
      'Keep chest open and spine straight',
      'Hold with steady breath'
    ],
    benefits: [
      'Strengthens core and hip flexors',
      'Improves balance',
      'Stimulates digestion',
      'Builds concentration'
    ],
    contraindications: ['Back injury', 'Pregnancy', 'Menstruation']
  },

  // Twists
  {
    id: 'seated-spinal-twist',
    name: 'Seated Spinal Twist',
    sanskritName: 'Ardha Matsyendrasana',
    duration: 30,
    difficulty: 'intermediate',
    focus: 'Spine mobility and detoxification',
    category: ['seated', 'twist'],
    instructions: [
      'Sit with legs extended',
      'Bend right knee and place foot outside left thigh',
      'Place left elbow outside right knee',
      'Twist toward the right',
      'Keep spine long and shoulders level',
      'Breathe deeply and switch sides'
    ],
    benefits: [
      'Improves spinal mobility',
      'Massages abdominal organs',
      'Relieves back tension',
      'Aids digestion'
    ],
    contraindications: ['Back injury', 'Spinal disc issues', 'Pregnancy']
  },

  // Hip Openers
  {
    id: 'pigeon-pose',
    name: 'Pigeon Pose',
    sanskritName: 'Eka Pada Rajakapotasana',
    duration: 45,
    difficulty: 'intermediate',
    focus: 'Hip opener and hip flexor stretch',
    category: ['hip-opener', 'stretching'],
    instructions: [
      'Start in Downward Dog',
      'Bring right knee forward behind right wrist',
      'Extend left leg back',
      'Square hips as much as possible',
      'Fold forward over front leg',
      'Breathe deeply and switch sides'
    ],
    benefits: [
      'Opens hips and hip flexors',
      'Stretches glutes and piriformis',
      'Relieves sciatica pain',
      'Improves posture'
    ],
    contraindications: ['Knee injury', 'Hip injury', 'Recent surgery']
  },

  // Shoulder Openers
  {
    id: 'thread-the-needle',
    name: 'Thread the Needle',
    sanskritName: 'Urdhva Mukha Pasasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Shoulder and upper back release',
    category: ['stretching', 'shoulder-opener'],
    instructions: [
      'Start on hands and knees',
      'Thread right arm under left arm',
      'Lower right shoulder and ear to ground',
      'Extend left arm forward',
      'Breathe into the stretch',
      'Switch sides'
    ],
    benefits: [
      'Releases shoulder tension',
      'Stretches upper back',
      'Improves shoulder mobility',
      'Relieves neck pain'
    ],
    contraindications: ['Shoulder injury', 'Recent shoulder surgery']
  },

  // Additional Standing Poses
  {
    id: 'chair-pose',
    name: 'Chair Pose',
    sanskritName: 'Utkatasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Leg strength and balance',
    category: ['standing', 'strengthening'],
    instructions: [
      'Stand with feet together',
      'Bend knees and lower as if sitting in a chair',
      'Raise arms overhead with palms facing each other',
      'Keep chest open and spine straight',
      'Press weight into heels',
      'Hold with steady breath'
    ],
    benefits: [
      'Strengthens thighs and ankles',
      'Stretches shoulders and chest',
      'Stimulates abdominal organs',
      'Improves balance'
    ],
    contraindications: ['Knee injury', 'Low blood pressure', 'Headache']
  },
  {
    id: 'eagle-pose',
    name: 'Eagle Pose',
    sanskritName: 'Garudasana',
    duration: 20,
    difficulty: 'intermediate',
    focus: 'Balance and concentration',
    category: ['standing', 'balancing'],
    instructions: [
      'Stand in Mountain Pose',
      'Cross right thigh over left',
      'Hook right foot behind left calf if possible',
      'Cross arms and bring palms together',
      'Lift elbows and squeeze shoulder blades',
      'Hold and switch sides'
    ],
    benefits: [
      'Improves balance and focus',
      'Stretches shoulders and upper back',
      'Strengthens legs and ankles',
      'Improves concentration'
    ],
    contraindications: ['Knee injury', 'Shoulder injury', 'Ankle injury']
  },

  // Additional Seated Poses
  {
    id: 'easy-pose',
    name: 'Easy Pose',
    sanskritName: 'Sukhasana',
    duration: 60,
    difficulty: 'beginner',
    focus: 'Meditation and grounding',
    category: ['seated', 'meditation'],
    instructions: [
      'Sit cross-legged on the floor',
      'Rest hands on knees with palms up or down',
      'Lengthen spine and relax shoulders',
      'Close eyes or soften gaze',
      'Breathe deeply and naturally',
      'Stay comfortable and alert'
    ],
    benefits: [
      'Promotes meditation and mindfulness',
      'Opens hips gently',
      'Improves posture',
      'Calms the nervous system'
    ],
    contraindications: ['Knee injury', 'Hip injury', 'Back injury']
  },
  {
    id: 'staff-pose',
    name: 'Staff Pose',
    sanskritName: 'Dandasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Posture and alignment',
    category: ['seated', 'strengthening'],
    instructions: [
      'Sit with legs extended forward',
      'Place hands beside hips',
      'Press into hands to lift chest',
      'Engage leg muscles',
      'Keep spine straight and shoulders relaxed',
      'Breathe steadily'
    ],
    benefits: [
      'Strengthens back and core',
      'Improves posture',
      'Stretches hamstrings',
      'Prepares for other poses'
    ],
    contraindications: ['Back injury', 'Wrist injury']
  },

  // Additional Backbends
  {
    id: 'bridge-pose',
    name: 'Bridge Pose',
    sanskritName: 'Setu Bandhasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Chest opener and back strength',
    category: ['backbend', 'strengthening'],
    instructions: [
      'Lie on back with knees bent',
      'Place feet hip-width apart',
      'Press feet into floor and lift hips',
      'Roll shoulders under and clasp hands',
      'Keep thighs parallel',
      'Breathe deeply'
    ],
    benefits: [
      'Strengthens back and glutes',
      'Opens chest and shoulders',
      'Stimulates thyroid',
      'Relieves stress'
    ],
    contraindications: ['Neck injury', 'Back injury', 'Shoulder injury']
  },
  {
    id: 'camel-pose',
    name: 'Camel Pose',
    sanskritName: 'Ustrasana',
    duration: 20,
    difficulty: 'intermediate',
    focus: 'Deep backbend and chest opener',
    category: ['backbend', 'stretching'],
    instructions: [
      'Kneel with knees hip-width apart',
      'Place hands on lower back',
      'Arch back and reach for heels',
      'Keep hips forward and thighs vertical',
      'Open chest and relax throat',
      'Breathe into the pose'
    ],
    benefits: [
      'Opens chest and shoulders',
      'Stretches hip flexors',
      'Improves spinal flexibility',
      'Boosts energy'
    ],
    contraindications: ['Back injury', 'Neck injury', 'High blood pressure']
  },

  // Additional Core Poses
  {
    id: 'side-plank',
    name: 'Side Plank',
    sanskritName: 'Vasisthasana',
    duration: 15,
    difficulty: 'intermediate',
    focus: 'Core strength and stability',
    category: ['core', 'balancing'],
    instructions: [
      'Start in Plank Pose',
      'Shift weight to right hand and foot',
      'Stack left foot on right',
      'Extend left arm toward ceiling',
      'Keep body in straight line',
      'Hold and switch sides'
    ],
    benefits: [
      'Strengthens core and arms',
      'Improves balance',
      'Tones obliques',
      'Builds wrist strength'
    ],
    contraindications: ['Wrist injury', 'Shoulder injury', 'Pregnancy']
  },
  {
    id: 'dolphin-pose',
    name: 'Dolphin Pose',
    sanskritName: 'Ardha Pincha Mayurasana',
    duration: 30,
    difficulty: 'intermediate',
    focus: 'Shoulder strength and hamstring stretch',
    category: ['core', 'stretching'],
    instructions: [
      'Start on forearms and knees',
      'Walk feet back to straighten legs',
      'Press forearms into ground',
      'Lift hips toward ceiling',
      'Keep head between arms',
      'Breathe steadily'
    ],
    benefits: [
      'Strengthens shoulders and arms',
      'Stretches hamstrings and calves',
      'Improves balance',
      'Calms the mind'
    ],
    contraindications: ['Shoulder injury', 'High blood pressure', 'Headache']
  },

  // Additional Twists
  {
    id: 'marichi-twist',
    name: 'Marichi\'s Twist',
    sanskritName: 'Marichyasana III',
    duration: 30,
    difficulty: 'intermediate',
    focus: 'Spinal twist and detoxification',
    category: ['seated', 'twist'],
    instructions: [
      'Sit with right leg extended',
      'Bend left knee and place foot outside right thigh',
      'Wrap right arm around left knee',
      'Twist toward the left',
      'Keep spine long',
      'Switch sides'
    ],
    benefits: [
      'Improves spinal mobility',
      'Aids digestion',
      'Stretches hips and shoulders',
      'Relieves back tension'
    ],
    contraindications: ['Back injury', 'Spinal disc issues', 'Pregnancy']
  },

  // Additional Hip Openers
  {
    id: 'frog-pose',
    name: 'Frog Pose',
    sanskritName: 'Mandukasana',
    duration: 45,
    difficulty: 'intermediate',
    focus: 'Deep hip and groin opener',
    category: ['hip-opener', 'stretching'],
    instructions: [
      'Start on all fours',
      'Slowly slide knees apart',
      'Keep feet wider than knees',
      'Lower forearms to ground',
      'Relax hips toward floor',
      'Breathe deeply'
    ],
    benefits: [
      'Opens hips and groin deeply',
      'Stretches inner thighs',
      'Relieves sciatica',
      'Improves hip mobility'
    ],
    contraindications: ['Knee injury', 'Hip injury', 'Groin injury']
  },
  {
    id: 'cow-face-pose',
    name: 'Cow Face Pose',
    sanskritName: 'Gomukhasana',
    duration: 45,
    difficulty: 'intermediate',
    focus: 'Hip and shoulder opener',
    category: ['seated', 'hip-opener'],
    instructions: [
      'Sit with legs extended',
      'Stack right knee on left',
      'Cross right arm under left',
      'Clasp hands behind back',
      'Keep spine straight',
      'Switch sides'
    ],
    benefits: [
      'Opens hips and shoulders',
      'Stretches thighs and arms',
      'Improves posture',
      'Relieves tension'
    ],
    contraindications: ['Shoulder injury', 'Hip injury', 'Knee injury']
  },

  // Additional Restorative Poses
  {
    id: 'legs-up-wall',
    name: 'Legs Up the Wall',
    sanskritName: 'Viparita Karani',
    duration: 300,
    difficulty: 'beginner',
    focus: 'Relaxation and circulation',
    category: ['restorative', 'inversion'],
    instructions: [
      'Sit sideways against a wall',
      'Swing legs up the wall',
      'Lie back with support under head if needed',
      'Relax arms at sides',
      'Close eyes and breathe deeply',
      'Stay for several minutes'
    ],
    benefits: [
      'Improves circulation',
      'Reduces swelling in legs',
      'Calms nervous system',
      'Relieves tired legs'
    ],
    contraindications: ['Back injury', 'Glaucoma', 'High blood pressure']
  },
  {
    id: 'reclined-twist',
    name: 'Reclined Spinal Twist',
    sanskritName: 'Supta Matsyendrasana',
    duration: 60,
    difficulty: 'beginner',
    focus: 'Gentle spinal twist and relaxation',
    category: ['restorative', 'twist'],
    instructions: [
      'Lie on back with knees bent',
      'Extend arms to T-shape',
      'Drop knees to right side',
      'Turn head to left if comfortable',
      'Keep shoulders grounded',
      'Switch sides'
    ],
    benefits: [
      'Gently twists spine',
      'Releases back tension',
      'Improves digestion',
      'Promotes relaxation'
    ],
    contraindications: ['Back injury', 'Spinal disc issues', 'Pregnancy']
  },

  // Advanced Poses
  {
    id: 'headstand',
    name: 'Headstand',
    sanskritName: 'Sirsasana',
    duration: 60,
    difficulty: 'advanced',
    focus: 'Balance and strength',
    category: ['inversion', 'balancing'],
    instructions: [
      'Kneel and interlace fingers behind head',
      'Place crown of head on ground',
      'Lift knees off ground',
      'Walk feet toward head',
      'Slowly lift one leg at a time',
      'Balance with core engaged'
    ],
    benefits: [
      'Builds strength and balance',
      'Improves circulation',
      'Calms the mind',
      'Strengthens core and arms'
    ],
    contraindications: ['Neck injury', 'High blood pressure', 'Head injury', 'Pregnancy']
  },
  {
    id: 'wheel-pose',
    name: 'Wheel Pose',
    sanskritName: 'Urdhva Dhanurasana',
    duration: 15,
    difficulty: 'advanced',
    focus: 'Deep backbend and strength',
    category: ['backbend', 'strengthening'],
    instructions: [
      'Lie on back with knees bent',
      'Place hands beside head',
      'Press into hands and feet',
      'Lift hips and chest off ground',
      'Straighten arms and legs',
      'Breathe deeply'
    ],
    benefits: [
      'Strengthens back and arms',
      'Opens chest and hips',
      'Improves spinal flexibility',
      'Boosts energy and confidence'
    ],
    contraindications: ['Back injury', 'Shoulder injury', 'Wrist injury', 'High blood pressure']
  },

  // Prenatal Poses
  {
    id: 'prenatal-goddess',
    name: 'Prenatal Goddess Pose',
    sanskritName: 'Modified Utkata Konasana',
    duration: 30,
    difficulty: 'beginner',
    focus: 'Pelvic floor strength and hip opening',
    category: ['standing', 'prenatal'],
    instructions: [
      'Stand with feet wide apart',
      'Turn toes out slightly',
      'Bend knees and lower into squat',
      'Bring hands to heart center',
      'Keep chest open and spine straight',
      'Breathe deeply'
    ],
    benefits: [
      'Strengthens pelvic floor',
      'Opens hips for birth',
      'Improves circulation',
      'Builds leg strength'
    ],
    contraindications: ['Severe back pain', 'Pelvic instability', 'Late pregnancy complications']
  },
  {
    id: 'cat-cow-prenatal',
    name: 'Prenatal Cat-Cow',
    sanskritName: 'Modified Marjaryasana-Bitilasana',
    duration: 60,
    difficulty: 'beginner',
    focus: 'Spinal mobility and breath work',
    category: ['hands-knees', 'prenatal'],
    instructions: [
      'Start on hands and knees',
      'Keep movements gentle and slow',
      'Inhale to arch back (Cow)',
      'Exhale to round spine (Cat)',
      'Move with breath for several rounds',
      'Focus on pelvic floor engagement'
    ],
    benefits: [
      'Maintains spinal mobility',
      'Practices breath work for labor',
      'Relieves back tension',
      'Strengthens pelvic floor'
    ],
    contraindications: ['Severe back pain', 'Pelvic instability']
  },

  // Therapeutic Poses
  {
    id: 'sphinx-pose',
    name: 'Sphinx Pose',
    sanskritName: 'Salamba Bhujangasana',
    duration: 45,
    difficulty: 'beginner',
    focus: 'Gentle backbend for back pain relief',
    category: ['backbend', 'therapeutic'],
    instructions: [
      'Lie on stomach with elbows under shoulders',
      'Forearms parallel to each other',
      'Press forearms down and lift chest',
      'Keep neck long and relaxed',
      'Breathe into lower back',
      'Hold gently'
    ],
    benefits: [
      'Strengthens lower back',
      'Improves posture',
      'Relieves back pain',
      'Opens chest gently'
    ],
    contraindications: ['Severe back injury', 'Recent abdominal surgery']
  },
  {
    id: 'supine-hand-to-big-toe',
    name: 'Supine Hand to Big Toe Pose',
    sanskritName: 'Supta Padangusthasana',
    duration: 45,
    difficulty: 'beginner',
    focus: 'Hamstring stretch and hip opener',
    category: ['supine', 'therapeutic'],
    instructions: [
      'Lie on back with legs extended',
      'Bend right knee and hug to chest',
      'Loop strap around right foot',
      'Straighten leg toward ceiling',
      'Keep left leg grounded',
      'Switch sides'
    ],
    benefits: [
      'Stretches hamstrings',
      'Opens hips',
      'Relieves sciatica',
      'Improves leg flexibility'
    ],
    contraindications: ['Hamstring tear', 'Sciatica flare-up', 'Recent knee surgery']
  }
];

// Helper functions for pose library
export const getPosesByDifficulty = (difficulty: string): YogaPose[] => {
  return yogaPoses.filter(pose => pose.difficulty === difficulty);
};

export const getPosesByCategory = (category: string): YogaPose[] => {
  return yogaPoses.filter(pose => pose.category.includes(category));
};

export const getPoseById = (id: string): YogaPose | undefined => {
  return yogaPoses.find(pose => pose.id === id);
};

export const searchPoses = (query: string): YogaPose[] => {
  const lowerQuery = query.toLowerCase();
  return yogaPoses.filter(pose =>
    pose.name.toLowerCase().includes(lowerQuery) ||
    pose.sanskritName?.toLowerCase().includes(lowerQuery) ||
    pose.focus.toLowerCase().includes(lowerQuery) ||
    pose.category.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
};

export const getRandomPoses = (count: number, difficulty?: string): YogaPose[] => {
  let filteredPoses = difficulty ? getPosesByDifficulty(difficulty) : yogaPoses;
  const shuffled = [...filteredPoses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Categories for filtering
export const poseCategories = [
  'standing',
  'seated',
  'backbend',
  'balancing',
  'arm-balance',
  'stretching',
  'strengthening',
  'restorative',
  'core',
  'twist',
  'hip-opener',
  'shoulder-opener'
];

export const poseDifficulties = ['beginner', 'intermediate', 'advanced'];
