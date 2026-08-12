/**
 * Sarmayadar Package Tier Access Matrix & Feature Gating Utility
 */

export const PLAN_TIERS = {
  FREE: {
    name: 'Free Basic Account',
    code: 'FREE',
    maxListings: 5,
    maxMegaProjects: 0,
    maxFeaturedBoosts: 0,
    hasDealerBadge: false,
    canExportLeads: false,
    canUseBannerSpotlight: false,
    canUseAdvancedAnalytics: false
  },
  STARTER_DEALER: {
    name: 'Starter Dealer Package',
    code: 'STARTER_DEALER',
    maxListings: 25,
    maxMegaProjects: 0,
    maxFeaturedBoosts: 5,
    hasDealerBadge: true,
    canExportLeads: false,
    canUseBannerSpotlight: false,
    canUseAdvancedAnalytics: true
  },
  PRO_GOLD: {
    name: 'Pro Gold Agency Package',
    code: 'PRO_GOLD',
    maxListings: 50,
    maxMegaProjects: 2,
    maxFeaturedBoosts: 10,
    hasDealerBadge: true,
    canExportLeads: true,
    canUseBannerSpotlight: false,
    canUseAdvancedAnalytics: true
  },
  AGENCY_ELITE: {
    name: 'Agency Elite Package',
    code: 'AGENCY_ELITE',
    maxListings: 9999,
    maxMegaProjects: 10,
    maxFeaturedBoosts: 25,
    hasDealerBadge: true,
    canExportLeads: true,
    canUseBannerSpotlight: true,
    canUseAdvancedAnalytics: true
  }
};

/**
 * Get active plan configuration for a given user
 */
export function getUserPlanConfig(user) {
  if (!user) return PLAN_TIERS.FREE;

  const planName = (user.subscriptionPlan || '').toUpperCase();
  const role = (user.role || '').toUpperCase();

  if (planName.includes('ELITE') || planName.includes('TITANIUM') || role === 'ADMIN') {
    return PLAN_TIERS.AGENCY_ELITE;
  }
  if (planName.includes('GOLD') || planName.includes('STANDARD') || planName.includes('ADVANCED')) {
    return PLAN_TIERS.PRO_GOLD;
  }
  if (planName.includes('STARTER') || role === 'DEALER') {
    return PLAN_TIERS.STARTER_DEALER;
  }

  return PLAN_TIERS.FREE;
}

/**
 * Check if a user has access to a specific feature key
 * @param {Object} user 
 * @param {String} featureKey - 'mega-projects' | 'featured-boost' | 'unlimited-listings' | 'export-leads' | 'banner-spotlight'
 */
export function hasFeatureAccess(user, featureKey) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  const plan = getUserPlanConfig(user);

  switch (featureKey) {
    case 'mega-projects':
      return plan.maxMegaProjects > 0;
    case 'featured-boost':
      return plan.maxFeaturedBoosts > 0;
    case 'unlimited-listings':
      return plan.maxListings >= 50;
    case 'export-leads':
      return plan.canExportLeads;
    case 'banner-spotlight':
      return plan.canUseBannerSpotlight;
    case 'dealer-badge':
      return plan.hasDealerBadge;
    default:
      return true;
  }
}

/**
 * Render a sleek glassmorphic feature lock banner for features missing from active plan
 */
export function renderFeatureLockOverlay(featureTitle, requiredPlanName = 'Pro Gold Agency') {
  return `
    <div class="pro-feature-lock-card" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; border-radius: 16px; padding: 2rem; text-align: center; margin: 1.5rem 0; box-shadow: 0 10px 25px rgba(245,158,11,0.15);">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔒</div>
      <span class="badge" style="background:#D97706; color:#FFFFFF; font-weight:800; font-size:0.75rem; padding:4px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:0.05em;">
        PRO ADVERTISING FEATURE
      </span>
      <h3 style="font-size: 1.35rem; font-weight: 800; color: #78350F; margin: 0.75rem 0 0.5rem 0;">
        ${featureTitle} is Locked on Your Current Plan
      </h3>
      <p style="font-size: 0.9rem; color: #92400E; max-width: 580px; margin: 0 auto 1.5rem auto; font-weight: 600;">
        Upgrade your account to the <strong>${requiredPlanName}</strong> package to unlock this feature, expand your property listing limits, and receive verified buyer leads!
      </p>
      <a href="/advertise" data-nav="advertise" class="btn" style="background: #064E3B; color: #FFFFFF; font-weight: 900; font-size: 0.95rem; padding: 10px 24px; border-radius: 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(6,78,59,0.3);">
        ⚡ View Packages & Upgrade Plan
      </a>
    </div>
  `;
}
