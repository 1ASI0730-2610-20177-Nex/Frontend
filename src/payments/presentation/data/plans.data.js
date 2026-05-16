export const PLANS = [
    {
        id: 'starter',
        name: 'Starter Plan',
        price: 18.90,
        originalPrice: 25.90,
        description: 'Basic energy management for small homes.',
        features: [
            'Up to 5 smart devices',
            'Basic energy panel',
            'Email alerts',
        ],
    },
    {
        id: 'professional',
        name: 'Professional Plan',
        price: 48.90,
        originalPrice: 52.90,
        description: 'Advanced control for homes and small businesses.',
        features: [
            'Up to 20 smart devices',
            'Advanced energy analytics',
            'Automation routines',
            'Monthly reports',
        ],
        highlighted: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 128.90,
        originalPrice: 135.90,
        description: 'Complete platform for multiple locations or businesses.',
        features: [
            'Multiple retail locations',
            'Access profiles for the team',
            'Advanced alerts',
            'Priority support',
        ],
    },
];

export const DEFAULT_PLAN_ID = 'starter';

export function getPlanById(planId) {
    return PLANS.find((plan) => plan.id === planId) ?? PLANS[0];
}
