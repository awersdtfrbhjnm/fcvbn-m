import { TrendingDown, IndianRupee, Target, CheckCircle2 } from 'lucide-react';

interface TaxAnalysisViewProps {
  analysis: any;
}

export function TaxAnalysisView({ analysis }: TaxAnalysisViewProps) {
  if (!analysis) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const savingsPercentage = ((analysis.totalPotentialSavings / analysis.currentTaxLiability) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Tax Analysis Complete</h2>
        <p className="text-green-100">We've identified significant tax-saving opportunities for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Total Income</span>
            <IndianRupee className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(analysis.totalIncome)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Current Tax</span>
            <Target className="text-orange-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(analysis.currentTaxLiability)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Optimized Tax</span>
            <TrendingDown className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(analysis.optimizedTaxLiability)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">Total Savings</span>
            <CheckCircle2 className="text-white" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(analysis.totalPotentialSavings)}</p>
          <p className="text-green-100 text-xs mt-1">{savingsPercentage}% reduction</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recommended Tax-Saving Strategies</h3>
          <p className="text-sm text-slate-600 mt-1">Personalized recommendations based on your financial profile</p>
        </div>
        <div className="divide-y divide-slate-200">
          {analysis.strategies?.map((strategy: any, index: number) => (
            <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      strategy.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : strategy.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {strategy.priority?.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-green-700 font-semibold">
                      Save {formatCurrency(strategy.estimatedSaving)}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{strategy.strategyName}</h4>
                  <p className="text-slate-700 mb-3 leading-relaxed">{strategy.description}</p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-3">
                    <p className="text-sm font-medium text-blue-900">
                      <span className="font-semibold">Legal Basis:</span> {strategy.legalBasis}
                    </p>
                  </div>
                </div>
              </div>

              {strategy.implementationSteps && strategy.implementationSteps.length > 0 && (
                <div className="mt-4 bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Implementation Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                    {strategy.implementationSteps.map((step: string, i: number) => (
                      <li key={i} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {analysis.detailedAnalysis && (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Detailed Analysis</h3>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{analysis.detailedAnalysis}</p>
          </div>
        </div>
      )}
    </div>
  );
}
