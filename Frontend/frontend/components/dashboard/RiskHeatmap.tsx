
const categories = ['Legal', 'Financial', 'Compliance', 'Security', 'Operational'];
const subcategories = ['Missing Clauses', 'Conflicts', 'Pricing', 'Liability', 'Data Privacy', 'Insurance'];

const heatmapData = [
  { category: 'Legal', subcategory: 'Missing Clauses', value: 85 },
  { category: 'Legal', subcategory: 'Conflicts', value: 60 },
  { category: 'Legal', subcategory: 'Pricing', value: 40 },
  { category: 'Legal', subcategory: 'Liability', value: 75 },
  { category: 'Legal', subcategory: 'Data Privacy', value: 50 },
  { category: 'Legal', subcategory: 'Insurance', value: 30 },
  { category: 'Financial', subcategory: 'Missing Clauses', value: 40 },
  { category: 'Financial', subcategory: 'Conflicts', value: 70 },
  { category: 'Financial', subcategory: 'Pricing', value: 90 },
  { category: 'Financial', subcategory: 'Liability', value: 60 },
  { category: 'Financial', subcategory: 'Data Privacy', value: 30 },
  { category: 'Financial', subcategory: 'Insurance', value: 45 },
  { category: 'Compliance', subcategory: 'Missing Clauses', value: 80 },
  { category: 'Compliance', subcategory: 'Conflicts', value: 50 },
  { category: 'Compliance', subcategory: 'Pricing', value: 30 },
  { category: 'Compliance', subcategory: 'Liability', value: 40 },
  { category: 'Compliance', subcategory: 'Data Privacy', value: 95 },
  { category: 'Compliance', subcategory: 'Insurance', value: 55 },
  { category: 'Security', subcategory: 'Missing Clauses', value: 70 },
  { category: 'Security', subcategory: 'Conflicts', value: 40 },
  { category: 'Security', subcategory: 'Pricing', value: 20 },
  { category: 'Security', subcategory: 'Liability', value: 50 },
  { category: 'Security', subcategory: 'Data Privacy', value: 85 },
  { category: 'Security', subcategory: 'Insurance', value: 60 },
  { category: 'Operational', subcategory: 'Missing Clauses', value: 50 },
  { category: 'Operational', subcategory: 'Conflicts', value: 30 },
  { category: 'Operational', subcategory: 'Pricing', value: 40 },
  { category: 'Operational', subcategory: 'Liability', value: 35 },
  { category: 'Operational', subcategory: 'Data Privacy', value: 25 },
  { category: 'Operational', subcategory: 'Insurance', value: 70 },
];

const getColor = (value: number) => {
  if (value >= 80) return 'bg-red-500';
  if (value >= 60) return 'bg-orange-500';
  if (value >= 40) return 'bg-yellow-500';
  if (value >= 20) return 'bg-green-500';
  return 'bg-emerald-500';
};

export default function RiskHeatmap() {
  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="w-24 shrink-0" />
        {subcategories.map((sub) => (
          <div
            key={sub}
            className="w-20 shrink-0 text-xs text-zinc-400 text-center"
          >
            {sub}
          </div>
        ))}
      </div>
      {categories.map((cat) => (
        <div key={cat} className="flex gap-1 items-center">
          <div className="w-24 shrink-0 text-sm text-zinc-300">{cat}</div>
          {heatmapData
            .filter((d) => d.category === cat)
            .map((d) => (
              <div
                key={`${d.category}-${d.subcategory}`}
                className={`w-20 h-8 ${getColor(d.value)} rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center`}
                title={`${d.category} - ${d.subcategory}: ${d.value}%`}
              >
                <span className="text-xs font-semibold text-white drop-shadow">
                  {d.value}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
