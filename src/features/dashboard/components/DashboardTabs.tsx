
const tabs = [
  { label: "Overview", value: "overview", disabled: false },
  { label: "Holdings", value: "holdings", disabled: false },
  { label: "Reports", value: "reports", disabled: false },
  { label: "Orders", value: "orders", disabled: false },
];

export function DashboardTabs({ value, onChange }: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      data-slot="tabs-list"
      className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
      tabIndex={0}
      data-orientation="horizontal"
      style={{ outline: "none" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          aria-controls={`tab-content-${tab.value}`}
          data-state={value === tab.value ? "active" : "inactive"}
          id={`tab-trigger-${tab.value}`}
          data-slot="tabs-trigger"
          className={
            `data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring ` +
            `dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/50 ` +
            `inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] ` +
            `focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm ` +
            `[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`
          }
          tabIndex={value === tab.value ? 0 : -1}
          data-orientation="horizontal"
          data-radix-collection-item=""
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
