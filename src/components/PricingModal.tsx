import React, { useState } from 'react';
import { UserProfile, SubscriptionPlan } from '../types';
import {
  X,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Building,
  Award,
  ArrowRight
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpgradePlan: (planId: 'free' | 'pro' | 'team') => void;
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Developer',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individual students setting up a new laptop once or twice.',
    features: [
      'Generate Windows .bat & macOS .command scripts',
      '50 AI Chat Diagnoses per month',
      'Standard Winget & Homebrew catalog access',
      'Community setup log fix suggestions',
      'Basic CLI Scaffolding templates',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Developer',
    price: '$19',
    period: 'per month',
    description: 'For power devs, freelancers, and IT admins setting up machines regularly.',
    popular: true,
    features: [
      'Unlimited AI Chat & Log Diagnostic fixes',
      'Session Persistence across all devices',
      'Custom Script Headers & Branding override',
      'Priority Gemini 1.5 Pro AI response speed',
      'Private CLI Template Scaffolding sync',
      'Export setup logs directly to GitHub / Gist',
    ],
  },
  {
    id: 'team',
    name: 'Team / IT Admin',
    price: '$49',
    period: 'per month',
    description: 'For engineering teams and IT departments onboarding engineers at scale.',
    features: [
      'Everything in Pro Developer',
      'Shared Team Software Bundles & Stacks',
      'Centralized AI Setup Log Audit Dashboard',
      'Whitelabel custom installer binary header',
      'Dedicated Slack / Discord Support channel',
      'SAML / Single Sign-On (SSO)',
    ],
  },
];

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradePlan,
}) => {
  const [upgradingId, setUpgradingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = user?.plan || 'free';

  const handleSelectPlan = (planId: 'free' | 'pro' | 'team') => {
    if (planId === currentPlan) return;

    setUpgradingId(planId);
    setTimeout(() => {
      onUpgradePlan(planId);
      setUpgradingId(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>EasySetup SaaS Plans</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-slate-300">
            Set up laptops in one click and unlock session-aware AI troubleshooting for your whole stack.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-slate-950 rounded-3xl p-6 border flex flex-col justify-between space-y-6 transition-all ${
                  plan.popular
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-500">/ {plan.period}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <span className="font-semibold text-slate-300 uppercase text-[10px] tracking-wider block mb-2">
                      Included Capabilities
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent || upgradingId === plan.id}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 text-emerald-400 cursor-default border border-emerald-500/30'
                      : plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                  }`}
                >
                  {upgradingId === plan.id ? (
                    <span>Updating Plan...</span>
                  ) : isCurrent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Current Active Plan</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
          Need custom enterprise SLAs or billing via invoice? Contact our sales engineering team at sales@easysetup.dev
        </div>
      </div>
    </div>
  );
};
