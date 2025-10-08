import { supabase } from '../lib/supabase';

const taxProvisions = [
  {
    section_number: 'Section 80C',
    provision_title: 'Deduction for investments in specified savings instruments',
    provision_text: 'An individual or HUF can claim deduction up to Rs. 1,50,000 for investments in PPF, EPF, LIC, ELSS, NSC, SSY, home loan principal repayment, tuition fees, and 5-year bank FDs.',
    category: 'Deductions',
    applicable_to: ['Individual', 'HUF'],
    deduction_limit: 'Rs. 1,50,000',
    conditions: [
      'Investment must be made during the financial year',
      'Lock-in period applicable for most instruments',
      'Premium should not exceed 10% of sum assured for LIC policies issued after 1st April 2012'
    ],
    examples: []
  },
  {
    section_number: 'Section 80D',
    provision_title: 'Deduction for medical insurance premiums',
    provision_text: 'Deduction for health insurance premium paid for self, spouse, children, and parents. Up to Rs. 25,000 for self and family, additional Rs. 25,000 for parents (Rs. 50,000 if senior citizens).',
    category: 'Deductions',
    applicable_to: ['Individual', 'HUF'],
    deduction_limit: 'Rs. 25,000 + Rs. 25,000 (parents)',
    conditions: [
      'Premium must be paid through any mode other than cash',
      'Separate limit for parents',
      'Preventive health check-up covered up to Rs. 5,000'
    ],
    examples: []
  },
  {
    section_number: 'Section 10(1)',
    provision_title: 'Agricultural Income Exemption',
    provision_text: 'Agricultural income earned in India is fully exempt from income tax.',
    category: 'Exemptions',
    applicable_to: ['Individual', 'HUF', 'Company'],
    deduction_limit: 'No limit',
    conditions: [
      'Land must be situated in India',
      'Income must be from agricultural activities',
      'Receipts from sale of agricultural produce'
    ],
    examples: []
  },
  {
    section_number: 'Section 56(2)',
    provision_title: 'Gifts from relatives exemption',
    provision_text: 'Any sum of money or property received without consideration from relatives is exempt from tax. Relatives include spouse, siblings, lineal ascendants and descendants.',
    category: 'Exemptions',
    applicable_to: ['Individual', 'HUF'],
    deduction_limit: 'No limit',
    conditions: [
      'Gift must be from specified relatives',
      'No consideration involved',
      'Gift from any person on occasion of marriage is exempt'
    ],
    examples: []
  },
  {
    section_number: 'Section 64',
    provision_title: 'Income clubbing provisions',
    provision_text: 'Income of spouse, minor child, or from assets transferred to spouse or daughter-in-law shall be included in the income of the taxpayer (with certain exceptions).',
    category: 'Anti-Avoidance',
    applicable_to: ['Individual'],
    deduction_limit: 'N/A',
    conditions: [
      'Clubbing applies to income, not capital',
      'Gift from relative not subject to clubbing',
      'Income from transferred assets without adequate consideration'
    ],
    examples: []
  }
];

const taxStrategies = [
  {
    strategy_name: 'Family Income Splitting via Gift',
    description: 'Transfer income-generating assets (like FDs, bonds, rental property) as a gift to spouse or family members who have lower income or unutilized basic exemption limit. The income from these assets will then be taxed in their hands at lower rates.',
    legal_basis: 'Section 56(2) - Gifts from relatives are exempt, and Section 64 clubbing does not apply to gifts',
    applicable_sections: ['Section 56(2)', 'Section 64'],
    target_profile: {
      hasSpouse: true,
      spouseIncome: 'low',
      clientIncome: 'high'
    },
    estimated_savings_range: 'Rs. 50,000 - Rs. 2,00,000',
    risk_level: 'low',
    implementation_steps: [
      'Identify income-generating assets suitable for transfer',
      'Execute gift deed for transfer to spouse/family member',
      'Ensure no clubbing provisions are triggered',
      'File returns showing income in recipient\'s hands',
      'Maintain proper documentation of gift'
    ],
    examples: []
  },
  {
    strategy_name: 'Maximize Section 80C Investments',
    description: 'Invest Rs. 1.5 lakh annually in tax-saving instruments like PPF, ELSS, NPS, life insurance, and home loan principal repayment to claim maximum deduction under Section 80C.',
    legal_basis: 'Section 80C of Income Tax Act',
    applicable_sections: ['Section 80C'],
    target_profile: {
      hasIncome: true,
      currentInvestments: 'below limit'
    },
    estimated_savings_range: 'Rs. 15,600 - Rs. 46,800',
    risk_level: 'low',
    implementation_steps: [
      'Calculate current 80C investments',
      'Identify gap to Rs. 1.5 lakh limit',
      'Choose suitable instruments based on liquidity needs',
      'Make investments before financial year end',
      'Keep investment proofs for ITR filing'
    ],
    examples: []
  },
  {
    strategy_name: 'Health Insurance for Parents',
    description: 'Pay health insurance premium for parents (especially senior citizen parents) to claim additional deduction of Rs. 50,000 under Section 80D, over and above the Rs. 25,000 limit for self and family.',
    legal_basis: 'Section 80D of Income Tax Act',
    applicable_sections: ['Section 80D'],
    target_profile: {
      hasParents: true,
      parentAge: 'senior citizen'
    },
    estimated_savings_range: 'Rs. 15,600',
    risk_level: 'low',
    implementation_steps: [
      'Check if parents have health insurance',
      'Pay premium through non-cash mode',
      'Claim deduction in your ITR',
      'Keep premium receipts and policy documents'
    ],
    examples: []
  },
  {
    strategy_name: 'Business Depreciation Optimization',
    description: 'For business owners, purchase depreciable assets (especially those with high depreciation rates like computers, software) before year-end to claim depreciation and reduce taxable business income.',
    legal_basis: 'Section 32 - Depreciation on business assets',
    applicable_sections: ['Section 32'],
    target_profile: {
      hasBusinessIncome: true,
      profitMargin: 'high'
    },
    estimated_savings_range: 'Varies based on asset value',
    risk_level: 'low',
    implementation_steps: [
      'Identify genuine business needs for assets',
      'Purchase assets before March 31st',
      'Ensure assets are put to use before year-end',
      'Claim depreciation in business returns',
      'Maintain proper purchase invoices and asset register'
    ],
    examples: []
  },
  {
    strategy_name: 'HRA Optimization',
    description: 'If you receive HRA and live in rented accommodation, optimize your HRA exemption by ensuring rent paid is at least 10% of salary and obtaining proper rent receipts. Consider renting from parents (with PAN declaration if rent > Rs. 1 lakh/month).',
    legal_basis: 'Section 10(13A) - HRA Exemption',
    applicable_sections: ['Section 10(13A)'],
    target_profile: {
      receiveHRA: true,
      livesInRentedPlace: true
    },
    estimated_savings_range: 'Rs. 30,000 - Rs. 1,50,000',
    risk_level: 'low',
    implementation_steps: [
      'Calculate exempt HRA as per formula',
      'Obtain rent receipts from landlord',
      'If rent > Rs. 1 lakh/month, obtain landlord PAN',
      'Ensure rent agreement is in place',
      'Submit HRA proof to employer or claim in ITR'
    ],
    examples: []
  }
];

export async function seedTaxData() {
  try {
    const { data: existingProvisions } = await supabase
      .from('tax_provisions')
      .select('section_number')
      .limit(1);

    if (!existingProvisions || existingProvisions.length === 0) {
      console.log('Seeding tax provisions...');
      const { error: provisionsError } = await supabase
        .from('tax_provisions')
        .insert(taxProvisions as any);

      if (provisionsError) {
        console.error('Error seeding provisions:', provisionsError);
      } else {
        console.log('Tax provisions seeded successfully');
      }
    }

    const { data: existingStrategies } = await supabase
      .from('tax_strategies')
      .select('strategy_name')
      .limit(1);

    if (!existingStrategies || existingStrategies.length === 0) {
      console.log('Seeding tax strategies...');
      const { error: strategiesError } = await supabase
        .from('tax_strategies')
        .insert(taxStrategies as any);

      if (strategiesError) {
        console.error('Error seeding strategies:', strategiesError);
      } else {
        console.log('Tax strategies seeded successfully');
      }
    }

    console.log('Tax data seeding completed');
  } catch (error) {
    console.error('Error in seedTaxData:', error);
  }
}
