import https from 'https';

const supabaseUrl = 'https://ucqanvpwqtjiyrnuxqfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFudnB3cXRqaXlybnV4cWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDIxNjcsImV4cCI6MjA5NTgxODE2N30.XN1ZYqCqlnBFYvXaqkiuXv7ot69Tcq7wXScvcfgP45M';

const candidateTables = [
  'categories',
  'employee_types',
  'employment_types',
  'employee_categories_lookup',
  'employee_category',
  'designations',
  'departments',
  'additional_charges',
  'reporting_officers',
  'holidays',
  'attendance_locks',
  'attendance_requests_history'
];

function checkTable(table) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    };

    https.get(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ table, status: res.statusCode });
      });
    }).on('error', () => {
      resolve({ table, status: 500 });
    });
  });
}

async function run() {
  console.log('Probing potential table names...');
  for (const table of candidateTables) {
    const res = await checkTable(table);
    if (res.status >= 200 && res.status < 300) {
      console.log(`   ✅ Table FOUND: "${res.table}" (HTTP ${res.status})`);
    } else if (res.status === 401 || res.status === 403) {
      console.log(`   🔒 Table FOUND (but permission denied): "${res.table}" (HTTP ${res.status})`);
    }
  }
  console.log('Probe complete.');
}

run();
