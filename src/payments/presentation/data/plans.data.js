const PLAN_TRANSLATIONS = {
  starter: {
    ES: {
      name: 'Plan Inicial',
      description: 'Gestión energética básica para hogares pequeños.',
      features: ['Hasta 5 dispositivos inteligentes', 'Panel energético básico', 'Alertas por correo'],
    },
    EN: {
      name: 'Starter Plan',
      description: 'Basic energy management for small homes.',
      features: ['Up to 5 smart devices', 'Basic energy panel', 'Email alerts'],
    },
    PT: {
      name: 'Plano Inicial',
      description: 'Gestão energética básica para casas pequenas.',
      features: ['Até 5 dispositivos inteligentes', 'Painel energético básico', 'Alertas por e-mail'],
    },
  },
  professional: {
    ES: {
      name: 'Plan Profesional',
      description: 'Control avanzado para hogares y pequeños negocios.',
      features: ['Hasta 20 dispositivos inteligentes', 'Analítica energética avanzada', 'Rutinas de automatización', 'Reportes mensuales'],
    },
    EN: {
      name: 'Professional Plan',
      description: 'Advanced control for homes and small businesses.',
      features: ['Up to 20 smart devices', 'Advanced energy analytics', 'Automation routines', 'Monthly reports'],
    },
    PT: {
      name: 'Plano Profissional',
      description: 'Controle avançado para casas e pequenos negócios.',
      features: ['Até 20 dispositivos inteligentes', 'Análises energéticas avançadas', 'Rotinas de automação', 'Relatórios mensais'],
    },
  },
  enterprise: {
    ES: {
      name: 'Plan Empresarial',
      description: 'Plataforma completa para múltiples locales o negocios.',
      features: ['Múltiples locales comerciales', 'Perfiles de acceso para el equipo', 'Alertas avanzadas', 'Soporte prioritario'],
    },
    EN: {
      name: 'Enterprise Plan',
      description: 'Complete platform for multiple locations or businesses.',
      features: ['Multiple retail locations', 'Access profiles for the team', 'Advanced alerts', 'Priority support'],
    },
    PT: {
      name: 'Plano Empresarial',
      description: 'Plataforma completa para várias unidades ou negócios.',
      features: ['Várias unidades comerciais', 'Perfis de acesso para a equipe', 'Alertas avançados', 'Suporte prioritário'],
    },
  },
};

export const PLANS = [
  {
    id: 'starter',
    price: 18.90,
    originalPrice: 25.90,
  },
  {
    id: 'professional',
    price: 48.90,
    originalPrice: 52.90,
    highlighted: true,
  },
  {
    id: 'enterprise',
    price: 128.90,
    originalPrice: 135.90,
  },
];

export const DEFAULT_PLAN_ID = 'starter';

export function getPlanById(planId) {
  return PLANS.find((plan) => plan.id === planId) ?? PLANS[0];
}

export function translatePlan(plan, language = 'ES') {
  const safeLanguage = PLAN_TRANSLATIONS[plan.id]?.[language] ? language : 'ES';
  const translated = PLAN_TRANSLATIONS[plan.id]?.[safeLanguage] ?? PLAN_TRANSLATIONS.starter.ES;
  return {
    ...plan,
    ...translated,
  };
}
