import https from 'https';

const supabaseUrl = 'https://ucqanvpwqtjiyrnuxqfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFudnB3cXRqaXlybnV4cWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDIxNjcsImV4cCI6MjA5NTgxODE2N30.XN1ZYqCqlnBFYvXaqkiuXv7ot69Tcq7wXScvcfgP45M';

const candidateTables = [
  'emp_categories',
  'emp_category',
  'employee_categories_ref',
  'employee_category_ref',
  'employee_categories_list',
  'employee_category_list',
  'employee_categories_lookup',
  'employee_category_lookup',
  'employee_categories_types',
  'employee_category_types',
  'employment_categories',
  'employment_category',
  'categories_employee',
  'category_employee',
  'employee_classes',
  'employee_class',
  'classes',
  'employee_roles',
  'employee_groups',
  'employee_group',
  'groups',
  'emp_types',
  'emp_type'
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
      resolve({ table, status: res.statusCode });
    }).on('error', () => {
      resolve({ table, status: 500 });
    });
  });
}

async function run() {
  console.log('Probing wider table names for employee categories...');
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
