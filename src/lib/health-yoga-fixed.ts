// Medical Yoga Safety and Filtering Logic
// Ensures all yoga recommendations are clinically appropriate

import {
  HealthCondition,
  YogaPose,
  YogaSequence,
  SafetyRisk,
  HealthProfile,
  PoseModification,
  YogaFilter,
  PoseSearchResult,
  YogaGoal,
  HEALTH_CONDITIONS,
  YOGA_GOALS
} from '../types/health-yoga';

export class MedicalYogaFilter {
  /**
   * Gets safe yoga poses for a given health profile
   */
  static getSafePoses(profile: any): YogaPose[] {
    // Map the component's health profile to the expected format
    const conditions: HealthCondition[] = [];

    // Map medical conditions to HealthCondition enum
    if (profile.medicalConditions) {
      profile.medicalConditions.forEach((condition: string) => {
        switch (condition.toLowerCase()) {
          case 'arthritis':
            conditions.push('arthritis');
            break;
          case 'back pain':
          case 'back-pain':
            conditions.push('back-pain');
            break;
          case 'hypertension':
            conditions.push('hypertension');
            break;
          case 'diabetes':
            conditions.push('diabetes');
            break;
          case 'pregnancy':
            conditions.push('pregnancy');
            break;
          case 'osteoporosis':
            conditions.push('osteoporosis');
            break;
          case 'fibromyalgia':
            conditions.push('fibromyalgia');
            break;
          case 'chronic fatigue':
          case 'chronic-fatigue':
            conditions.push('chronic-fatigue');
            break;
          case 'depression':
            conditions.push('depression');
            break;
          case 'anxiety':
            conditions.push('anxiety');
            break;
          case 'insomnia':
            conditions.push('insomnia');
            break;
          case 'migraine':
            conditions.push('migraine');
            break;
          default:
            // For unknown conditions, add as 'other'
            conditions.push('other');
            break;
        }
      });
    }

    // Add pregnancy status if applicable
    if (profile.pregnancyStatus) {
      conditions.push('pregnancy');
    }

    // Filter poses based on conditions
    const safePoses = this.filterSafePoses(SAFE_YOGA_POSES, conditions, 'moderate');

    return safePoses.map(result => result.pose);
  }

  /**
   * Analyzes a yoga pose for safety given a patient's health conditions
   */
  static analyzePoseSafety(pose: YogaPose, conditions: HealthCondition[]): {
    risk: SafetyRisk;
    modifications: PoseModification[];
    reasons: string[];
  } {
    let maxRisk: SafetyRisk = 'low';
    const modifications: PoseModification[] = [];
    const reasons: string[] = [];

    for (const condition of conditions) {
      const conditionMods = pose.modifications.filter(mod => mod.condition === condition);

      if (conditionMods.length > 0) {
        modifications.push(...conditionMods);

        // Determine risk level based on modifications
        const highestRisk = Math.max(...conditionMods.map(mod =>
          this.getRiskLevel(mod.riskReduction)
        ));

        if (highestRisk > this.getRiskLevel(maxRisk)) {
          maxRisk = this.getRiskString(highestRisk);
        }
      }

      // Check for contraindications
      if (pose.contraindications.includes(condition)) {
        reasons.push(`${HEALTH_CONDITIONS[condition].name} contraindication`);
        maxRisk = 'contraindicated';
      }
    }

    return { risk: maxRisk, modifications, reasons };
  }

  /**
   * Filters yoga poses based on health conditions and safety criteria
   */
  static filterSafePoses(
    poses: YogaPose[],
    conditions: HealthCondition[],
    maxRisk: SafetyRisk = 'moderate'
  ): PoseSearchResult[] {
    return poses.map(pose => {
      const analysis = this.analyzePoseSafety(pose, conditions);
      const isSafe = this.getRiskLevel(analysis.risk) <= this.getRiskLevel(maxRisk);

      return {
        pose,
        safety: analysis.risk,
        modifications: analysis.modifications,
        reasons: analysis.reasons
      };
    }).filter(result => this.getRiskLevel(result.safety) <= this.getRiskLevel(maxRisk));
  }

  /**
   * Creates a personalized yoga sequence based on health profile
   */
  static createPersonalizedSequence(
    availablePoses: YogaPose[],
    healthProfile: HealthProfile,
    targetDuration: number,
    intensity: 'low-impact' | 'moderate' | 'standard'
  ): YogaSequence {
    const safePoses = this.filterSafePoses(
      availablePoses,
      healthProfile.conditions,
      intensity === 'low-impact' ? 'low' : 'moderate'
    );

    // Group poses by category and difficulty
    const standingPoses = safePoses.filter(p =>
      p.pose.category === 'standing' && p.pose.difficulty === 'beginner'
    );

    const seatedPoses = safePoses.filter(p =>
      p.pose.category === 'seated' && p.pose.difficulty === 'beginner'
    );

    const restorativePoses = safePoses.filter(p =>
      (p.pose.category === 'supine' || p.pose.category === 'seated') &&
      p.pose.difficulty === 'beginner'
    );

    // Build sequence based on goals
    const sequencePoses: YogaPose[] = [];

    // Warm-up (gentle movements)
    if (standingPoses.length > 0) {
      sequencePoses.push(standingPoses[0].pose); // Mountain pose or similar
    }

    // Main sequence based on goals
    if (healthProfile.goals.includes('pain-management')) {
      // Focus on gentle, restorative poses
      sequencePoses.push(...restorativePoses.slice(0, 3).map(p => p.pose));
    }

    if (healthProfile.goals.includes('improved-mobility')) {
      // Include standing poses for joint mobility
      sequencePoses.push(...standingPoses.slice(1, 3).map(p => p.pose));
    }

    if (healthProfile.goals.includes('stress-reduction')) {
      // Add calming seated poses
      sequencePoses.push(...seatedPoses.slice(0, 2).map(p => p.pose));
    }

    // Cool-down
    if (restorativePoses.length > 1) {
      sequencePoses.push(restorativePoses[restorativePoses.length - 1].pose);
    }

    // Calculate total duration and adjust
    const totalPoseTime = sequencePoses.reduce((sum, pose) => sum + pose.duration, 0);
    const transitions = (sequencePoses.length - 1) * 10; // 10 seconds between poses
    const totalTime = totalPoseTime + transitions;

    // Adjust duration if needed
    let adjustedPoses = sequencePoses;
    if (totalTime > targetDuration * 60) {
      // Reduce hold times
      adjustedPoses = sequencePoses.map(pose => ({
        ...pose,
        duration: Math.max(20, pose.duration * 0.8)
      }));
    }

    return {
      id: `sequence-${Date.now()}`,
      name: this.generateSequenceName(healthProfile.goals),
      description: this.generateSequenceDescription(healthProfile),
      duration: targetDuration,
      difficulty: 'beginner',
      focus: healthProfile.goals[0] || 'pain-management',
      poses: adjustedPoses.map((pose, index) => ({
        pose,
        duration: pose.duration,
        restBetween: 10
      })),
      contraindications: healthProfile.conditions,
      benefits: this.getGoalBenefits(healthProfile.goals),
      medicalNotes: this.generateMedicalNotes(healthProfile)
    };
  }

  /**
   * Validates if a yoga session should continue based on vital signs
   */
  static validateSessionSafety(
    vitalSigns: {
      heartRate?: number;
      bloodPressure?: { systolic: number; diastolic: number };
      painLevel?: number;
    },
    conditions: HealthCondition[]
  ): {
    canContinue: boolean;
    warnings: string[];
    stopReasons: string[];
  } {
    const warnings: string[] = [];
    const stopReasons: string[] = [];

    // Heart rate checks
    if (vitalSigns.heartRate) {
      if (vitalSigns.heartRate > 100) {
        warnings.push('Elevated heart rate detected');
      }
      if (vitalSigns.heartRate > 120) {
        stopReasons.push('Heart rate too high - session paused for safety');
      }
    }

    // Blood pressure checks
    if (vitalSigns.bloodPressure) {
      const { systolic, diastolic } = vitalSigns.bloodPressure;
      if (systolic > 160 || diastolic > 100) {
        stopReasons.push('Blood pressure elevated - session stopped');
      } else if (systolic > 140 || diastolic > 90) {
        warnings.push('Blood pressure elevated - monitor closely');
      }
    }

    // Pain level checks
    if (vitalSigns.painLevel && vitalSigns.painLevel > 7) {
      warnings.push('High pain level reported');
    }
    if (vitalSigns.painLevel && vitalSigns.painLevel > 8) {
      stopReasons.push('Pain level too high - modify or stop session');
    }

    // Condition-specific checks
    if (conditions.includes('hypertension') && vitalSigns.bloodPressure) {
      const { systolic } = vitalSigns.bloodPressure;
      if (systolic > 150) {
        stopReasons.push('Hypertension protocol: blood pressure too high');
      }
    }

    return {
      canContinue: stopReasons.length === 0,
      warnings,
      stopReasons
    };
  }

  /**
   * Generates safety modifications for a pose based on conditions
   */
  static getPoseModifications(
    pose: YogaPose,
    conditions: HealthCondition[]
  ): PoseModification[] {
    const modifications: PoseModification[] = [];

    for (const condition of conditions) {
      const conditionMods = pose.modifications.filter(mod => mod.condition === condition);
      modifications.push(...conditionMods);
    }

    return modifications;
  }

  // Private helper methods
  private static getRiskLevel(risk: SafetyRisk): number {
    switch (risk) {
      case 'low': return 1;
      case 'moderate': return 2;
      case 'high': return 3;
      case 'contraindicated': return 4;
      default: return 1;
    }
  }

  private static getRiskString(level: number): SafetyRisk {
    switch (level) {
      case 1: return 'low';
      case 2: return 'moderate';
      case 3: return 'high';
      case 4: return 'contraindicated';
      default: return 'low';
    }
  }

  private static generateSequenceName(goals: YogaGoal[]): string {
    if (goals.includes('pain-management')) return 'Gentle Pain Relief Flow';
    if (goals.includes('stress-reduction')) return 'Calm and Restore Sequence';
    if (goals.includes('improved-mobility')) return 'Mobility Enhancement Practice';
    if (goals.includes('better-sleep')) return 'Evening Wind-Down Yoga';
    return 'Personalized Therapeutic Yoga';
  }

  private static generateSequenceDescription(profile: HealthProfile): string {
    const conditions = profile.conditions.map(c => HEALTH_CONDITIONS[c].name).join(', ');
    const goals = profile.goals.map(g => YOGA_GOALS[g].name).join(', ');

    return `A safe, personalized yoga sequence designed for your ${conditions} considerations, focusing on ${goals.toLowerCase()}.`;
  }

  private static getGoalBenefits(goals: YogaGoal[]): string[] {
    const benefits: string[] = [];

    if (goals.includes('pain-management')) {
      benefits.push('Reduced joint and muscle discomfort', 'Improved pain tolerance');
    }
    if (goals.includes('stress-reduction')) {
      benefits.push('Lowered stress hormones', 'Enhanced relaxation response');
    }
    if (goals.includes('improved-mobility')) {
      benefits.push('Increased range of motion', 'Better joint flexibility');
    }
    if (goals.includes('better-sleep')) {
      benefits.push('Improved sleep quality', 'Reduced insomnia symptoms');
    }

    return benefits;
  }

  private static generateMedicalNotes(profile: HealthProfile): string {
    const notes: string[] = [];

    if (profile.conditions.includes('arthritis')) {
      notes.push('Modified for joint protection - avoid deep stretches');
    }
    if (profile.conditions.includes('hypertension')) {
      notes.push('Monitored for blood pressure stability');
    }
    if (profile.conditions.includes('diabetes')) {
      notes.push('Gentle practice to support metabolic health');
    }
    if (profile.conditions.includes('pregnancy')) {
      notes.push('Prenatal-safe modifications applied');
    }

    return notes.join('. ');
  }
}

// Pre-defined safe yoga poses database
export const SAFE_YOGA_POSES: YogaPose[] = [
  {
    id: 'mountain-pose',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    benefits: ['Improves posture', 'Strengthens legs', 'Enhances balance'],
    precautions: ['Keep feet hip-width apart', 'Engage core muscles'],
    modifications: [
      {
        id: 'arthritis-mod',
        condition: 'arthritis',
        modification: 'Reduce stance width if knee pain occurs',
        riskReduction: 'low'
      },
      {
        id: 'balance-mod',
        condition: 'osteoporosis',
        modification: 'Use wall for support if balance is compromised',
        riskReduction: 'moderate'
      }
    ],
    contraindications: [],
    instructions: [
      'Stand with feet together or hip-width apart',
      'Distribute weight evenly across both feet',
      'Lengthen spine and reach crown of head up',
      'Relax shoulders down and back',
      'Hold for 30 seconds while breathing deeply'
    ]
  },
  {
    id: 'seated-forward-bend',
    name: 'Seated Forward Bend',
    sanskritName: 'Paschimottanasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 45,
    benefits: ['Stretches hamstrings', 'Calms nervous system', 'Improves digestion'],
    precautions: ['Keep back straight', 'Bend from hips not waist'],
    modifications: [
      {
        id: 'back-pain-mod',
        condition: 'back-pain',
        modification: 'Bend knees slightly and use support under knees',
        riskReduction: 'moderate'
      },
      {
        id: 'hypertension-mod',
        condition: 'hypertension',
        modification: 'Keep head above heart level',
        riskReduction: 'low'
      }
    ],
    contraindications: ['acute-back-pain'],
    instructions: [
      'Sit with legs extended forward',
      'Inhale to lengthen spine',
      'Exhale to fold forward from hips',
      'Reach toward feet or shins',
      'Hold for 45 seconds with relaxed breathing'
    ]
  },
  {
    id: 'childs-pose',
    name: 'Child\'s Pose',
    sanskritName: 'Balasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    benefits: ['Relieves back tension', 'Promotes relaxation', 'Stretches hips'],
    precautions: ['Knees wide if hip tension', 'Forehead to ground or support'],
    modifications: [
      {
        id: 'knee-mod',
        condition: 'arthritis',
        modification: 'Place blanket under knees for cushioning',
        riskReduction: 'low'
      },
      {
        id: 'pregnancy-mod',
        condition: 'pregnancy',
        modification: 'Widen knees to accommodate belly',
        riskReduction: 'low'
      }
    ],
    contraindications: [],
    instructions: [
      'Kneel on floor with knees wide',
      'Fold forward with arms extended',
      'Rest forehead on ground or support',
      'Breathe deeply into back body',
      'Hold for 60 seconds'
    ]
  },
  {
    id: 'cat-cow-pose',
    name: 'Cat-Cow Pose',
    sanskritName: 'Marjaryasana-Bitilasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    benefits: ['Mobilizes spine', 'Relieves back stiffness', 'Improves coordination'],
    precautions: ['Move slowly and deliberately', 'Keep movements within comfortable range'],
    modifications: [
      {
        id: 'neck-mod',
        condition: 'migraine',
        modification: 'Keep neck neutral, avoid extreme movements',
        riskReduction: 'moderate'
      }
    ],
    contraindications: ['severe-back-pain'],
    instructions: [
      'Start on hands and knees',
      'Inhale to arch back and lift head (Cow)',
      'Exhale to round back and tuck chin (Cat)',
      'Flow between poses with breath',
      'Repeat for 60 seconds'
    ]
  },
  {
    id: 'corpse-pose',
    name: 'Corpse Pose',
    sanskritName: 'Savasana',
    category: 'supine',
    difficulty: 'beginner',
    duration: 120,
    benefits: ['Deep relaxation', 'Stress reduction', 'Improved sleep quality'],
    precautions: ['Lie flat on back', 'Support head and knees if needed'],
    modifications: [
      {
        id: 'back-support',
        condition: 'back-pain',
        modification: 'Place blanket under knees for lower back support',
        riskReduction: 'low'
      },
      {
        id: 'pregnancy-support',
        condition: 'pregnancy',
        modification: 'Lie on left side with support for comfort',
        riskReduction: 'low'
      }
    ],
    contraindications: [],
    instructions: [
      'Lie flat on back with legs extended',
      'Arms relaxed at sides, palms up',
      'Close eyes and breathe deeply',
      'Release tension from all muscles',
      'Rest for 2 minutes in complete relaxation'
    ]
  }
];

// Utility functions for pose management
export const getPosesByCategory = (category: string): YogaPose[] => {
  return SAFE_YOGA_POSES.filter(pose => pose.category === category);
};

export const getPosesByDifficulty = (difficulty: string): YogaPose[] => {
  return SAFE_YOGA_POSES.filter(pose => pose.difficulty === difficulty);
};

export const searchPoses = (query: string): YogaPose[] => {
  const lowercaseQuery = query.toLowerCase();
  return SAFE_YOGA_POSES.filter(pose =>
    pose.name.toLowerCase().includes(lowercaseQuery) ||
    pose.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery)) ||
    pose.instructions.some(instruction => instruction.toLowerCase().includes(lowercaseQuery))
  );
};
