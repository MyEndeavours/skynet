/* =============================================================
   EDIT YOUR SITE HERE  (this is the only file you need to change)
   -------------------------------------------------------------
   CONFIG   – contact details and form behaviour.
   PROJECTS – one entry per completed project. The project list,
              the filters, the preview screen and the project
              details window are all built from this list.
   ============================================================= */
const CONFIG = {
  email: 'hello@yourdomain.com',            // where project briefs go
  availability: 'Taking on new projects',    // shown in Contact and the footer
  responseTime: 'one working day',
  budgets: ['Under $5k', '$5k – $10k', '$10k – $25k', '$25k+', 'Not sure yet'],
  // Optional: a form service endpoint (e.g. Formspree). Leave empty and the
  // form opens the visitor's email app with the brief filled in instead.
  formEndpoint: ''
};

/* Fields for each project
   name, category ('Website' or 'Service platform' – every category you use becomes a filter),
   year, summary (one line), brief, built (list), outcome, stack (list),
   url      – live link (optional; adds "Visit live site" buttons)
   image    – screenshot path, e.g. 'assets/projects/halden.webp' (optional; when empty, a styled preview is drawn from `preview`)
   code     – tracking number (optional; generated when empty)
   preview  – layout: 'site' | 'site-center' | 'dash' | 'calendar', tone: 'dark' | 'light', accent colour, text  */
const PROJECTS = [
  {
    code: 'SKY-0612',
    name: 'Halden Dental Studio',
    category: 'Website',
    year: 2026,
    summary: 'Booking-first website for a two-clinic dental practice.',
    brief: 'Most new patients phoned to book, and the old site couldn’t show availability, prices or which clinic to visit.',
    built: ['Treatment pages with clear pricing', 'Online booking for both clinics', 'New-patient forms completed before the visit', 'Content the front-desk team can edit'],
    outcome: 'Patients choose a clinic, pick a time and fill in their forms online, so the front desk spends less of the day on the phone.',
    stack: ['Astro', 'Headless CMS', 'Booking integration'],
    url: '',
    image: '',
    preview: { layout: 'site', tone: 'light', accent: '#1FA99C', brand: 'Halden', headline: ['Dentistry that', 'fits your day.'], cta: 'Book a visit', cta2: 'Treatments', links: ['Treatments', 'Clinics', 'Prices', 'About'], cards: ['Check-ups', 'Whitening', 'Emergency care'], art: 'arch' }
  },
  {
    code: 'SKY-0598',
    name: 'Kestrel Freight Portal',
    category: 'Service platform',
    year: 2026,
    summary: 'Shipment tracking and dispatch dashboard for a regional haulier.',
    brief: 'Dispatchers tracked loads across spreadsheets, phone calls and a whiteboard, and customers had no way to check on a delivery themselves.',
    built: ['Live shipment board with status and arrival times', 'Job updates drivers send from their phones', 'A tracking link for every customer load', 'Daily exception report by email'],
    outcome: 'Every load is visible in one place, and customers check their own delivery status instead of calling the office.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Mapping API'],
    url: '',
    image: '',
    preview: { layout: 'dash', tone: 'dark', accent: '#22C3E6', brand: 'Kestrel', title: 'Shipments', nav: ['Overview', 'Shipments', 'Drivers', 'Customers', 'Invoices', 'Reports', 'Settings'], kpis: [['In transit', '1,284'], ['On time', '96.2%'], ['Exceptions', '17'], ['Avg. transit', '31h']], chart: 'Loads delivered, last 30 days', side: 'Today’s loads', legend: ['On time', 'At risk', 'Late'], cols: ['Load', 'Customer', 'Status', 'Updated'], ref: 'KF', statuses: [['In transit', '#22C3E6'], ['Delivered', '#35C28A'], ['Delayed', '#F2A33A'], ['Loading', '#6E7A8F']] }
  },
  {
    code: 'SKY-0571',
    name: 'Ember & Oak',
    category: 'Website',
    year: 2025,
    summary: 'Restaurant website with table reservations and seasonal menus.',
    brief: 'A new wood-fired restaurant needed a site that felt like the room itself, with menus the chef could change every week.',
    built: ['Menus the kitchen updates in minutes', 'Table reservations, with deposits for large groups', 'Private dining enquiries', 'Gift vouchers'],
    outcome: 'Menus stay current without a developer, and group bookings arrive with the deposit already paid.',
    stack: ['Next.js', 'Headless CMS', 'Online payments'],
    url: '',
    image: '',
    preview: { layout: 'site-center', tone: 'dark', accent: '#E2683C', brand: 'Ember & Oak', font: "Georgia, 'Times New Roman', serif", kicker: 'Open Wednesday to Sunday', headline: ['Seasonal plates,', 'cooked over fire.'], cta: 'Reserve', cta2: 'View menus', links: ['Menus', 'Private dining', 'Gift cards', 'Visit'], arts: ['plates', 'fire', 'wood'] }
  },
  {
    code: 'SKY-0544',
    name: 'Northgate Lettings Hub',
    category: 'Service platform',
    year: 2025,
    summary: 'Tenant portal for rent, repairs and tenancy documents.',
    brief: 'A lettings agency handled repair requests and document requests by email, and nothing was tracked from report to fix.',
    built: ['Tenant accounts with rent history', 'Repair requests with photos and status updates', 'Document library for tenancy paperwork', 'A landlord view for every property'],
    outcome: 'Repairs are tracked from report to fix, and tenants find their own documents without emailing the office.',
    stack: ['Laravel', 'Vue', 'MySQL'],
    url: '',
    image: '',
    preview: { layout: 'dash', tone: 'light', accent: '#5B5BD6', brand: 'Northgate', title: 'Tenancies', nav: ['Overview', 'Tenancies', 'Repairs', 'Documents', 'Payments', 'Landlords', 'Settings'], kpis: [['Active tenancies', '412'], ['Rent collected', '98.4%'], ['Open repairs', '23'], ['Avg. fix time', '2.6d']], chart: 'Repairs closed, last 30 days', side: 'Open repairs', legend: ['Scheduled', 'Waiting', 'Overdue'], cols: ['Request', 'Property', 'Status', 'Updated'], ref: 'RQ', statuses: [['Scheduled', '#5B5BD6'], ['Fixed', '#2FA776'], ['Waiting on parts', '#D98A1C'], ['New', '#8D97A8']] }
  },
  {
    code: 'SKY-0519',
    name: 'Forge Fitness Collective',
    category: 'Website',
    year: 2025,
    summary: 'Membership website with a live class timetable and online sign-up.',
    brief: 'The gym’s timetable lived in a PDF, and new members could only join at the front desk.',
    built: ['Live class timetable', 'Online membership sign-up and payments', 'Coach profiles', 'Trial pass pages'],
    outcome: 'New members join online, and the timetable updates everywhere the moment a class changes.',
    stack: ['Webflow', 'Membership platform', 'Online payments'],
    url: '',
    image: '',
    preview: { layout: 'site', tone: 'dark', accent: '#C8F031', brand: 'FORGE', headline: ['Train with people', 'who show up.'], cta: 'Join now', cta2: 'Timetable', links: ['Classes', 'Timetable', 'Coaches', 'Pricing'], cards: ['Strength', 'Conditioning', 'Open gym'], art: 'stripes' }
  },
  {
    code: 'SKY-0483',
    name: 'Brightside Home Care',
    category: 'Service platform',
    year: 2024,
    summary: 'Visit scheduling and carer rota system for a home-care agency.',
    brief: 'Rotas were built by hand every week, and last-minute changes reached carers by text message.',
    built: ['Drag-and-drop weekly rota', 'Carer app with the day’s visits and notes', 'Instant alerts when a visit changes', 'Timesheets ready for payroll'],
    outcome: 'The weekly rota takes a fraction of the time to build, and carers always see the latest schedule.',
    stack: ['React', 'Firebase', 'Installable web app'],
    url: '',
    image: '',
    preview: { layout: 'calendar', tone: 'light', accent: '#F5B83D', brand: 'Brightside', cta: 'New visit', people: 'Carers on shift' }
  }
];
