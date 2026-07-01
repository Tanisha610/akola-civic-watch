const steps = ['Reported', 'Under Review', 'In Progress', 'Resolved'];

export default function Timeline({ status }) {
  const activeIndex = steps.indexOf(status);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {steps.map((step, index) => {
        const active = index <= activeIndex;
        return (
          <div key={step} className={`rounded-3xl border p-4 ${active ? 'border-civic-200 bg-civic-50' : 'border-slate-200 bg-white'}`}>
            <div className={`text-sm font-semibold ${active ? 'text-civic-800' : 'text-slate-500'}`}>{step}</div>
            <div className="mt-2 text-xs text-slate-500">
              {index === activeIndex ? 'Current stage' : index < activeIndex ? 'Completed' : 'Pending'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
