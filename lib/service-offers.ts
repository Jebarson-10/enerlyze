export const serviceOffers = [
  {
    id: 'carbon-footprint', number: '01', category: 'MEASURE',
    title: 'Corporate carbon footprint assessment',
    body: 'Build a defensible emissions baseline for your operations: direct fuel use, purchased electricity, and a screening of relevant value-chain sources.',
    deliverables: ['Organizational boundary and source register', 'Scope 1 and 2 inventory with documented factors', 'Scope 3 screening and emissions hotspot map'],
    format: 'Scoped baseline project',
  },
  {
    id: 'energy-assessment', number: '02', category: 'FIND WASTE',
    title: 'Facility and equipment energy assessment',
    body: 'Connect utility bills, operating hours and equipment readings to show where a site consumes energy and where avoidable losses may sit.',
    deliverables: ['Equipment and process load map', 'Prioritized opportunities with estimated kWh, cost and CO₂ impact', 'Action plan with assumptions and indicative payback'],
    format: 'Site assessment project',
  },
  {
    id: 'esg-reporting', number: '03', category: 'REPORT',
    title: 'ESG and BRSR data preparation',
    body: 'Turn scattered energy and emissions records into a traceable evidence pack for internal ESG reporting, customer requests and applicable BRSR disclosures.',
    deliverables: ['Data inventory and metric mapping', 'Evidence and calculation register', 'Reporting draft and review handover'],
    format: 'Annual reporting engagement',
  },
  {
    id: 'scope-3', number: '04', category: 'ENGAGE',
    title: 'Supplier and Scope 3 readiness',
    body: 'Identify material value-chain categories and create a practical route to collecting better supplier and activity data over time.',
    deliverables: ['Scope 3 category screen', 'Supplier data request template', 'Data-gap and improvement roadmap'],
    format: 'Project or annual refresh',
  },
  {
    id: 'decarbonization', number: '05', category: 'ACT',
    title: 'Efficiency and renewable feasibility',
    body: 'Compare operational changes, efficient equipment and renewable options against your baseline before committing to an upgrade.',
    deliverables: ['Options ranked by impact and practicality', 'Scenario-based cost, carbon and payback comparison', 'Implementation brief and relevant partner introductions'],
    format: 'Decision-support project',
  },
  {
    id: 'tracking', number: '06', category: 'IMPROVE',
    title: 'Ongoing energy and carbon tracking',
    body: 'Keep the baseline useful with periodic reviews of bills, consumption trends, emissions estimates and progress against agreed actions.',
    deliverables: ['Monthly or quarterly trend review', 'Variance and progress dashboard', 'Updated action priorities'],
    format: 'Recurring review plan',
  },
] as const;
