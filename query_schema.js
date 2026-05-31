import https from 'https';

const supabaseUrl = 'https://ucqanvpwqtjiyrnuxqfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFudnB3cXRqaXlybnV4cWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDIxNjcsImV4cCI6MjA5NTgxODE2N30.XN1ZYqCqlnBFYvXaqkiuXv7ot69Tcq7wXScvcfgP45M';

const tables = [
  'employees',
  'attendance_entries',
  'attendance_requests',
  'attendance_month_locks',
  'employee_leave_balances',
  'attendance_statuses',
  'employee_categories',
  'functional_roles'
];

function fetchTableColumns(table) {
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
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const rows = JSON.parse(data);
            if (rows.length > 0) {
              resolve({ table, status: 'success', columns: Object.keys(rows[0]), hasData: true, sample: rows[0] });
            } else {
              // If empty, let's check the Content-Range or perform a request that might fail or succeed to verify existence
              resolve({ table, status: 'success', columns: [], hasData: false, message: 'Table exists but is empty.' });
            }
          } else {
            const err = JSON.parse(data);
            resolve({ table, status: 'error', code: res.statusCode, message: err.message || data });
          }
        } catch (e) {
          resolve({ table, status: 'error', code: res.statusCode, message: `Failed to parse response: ${data}` });
        }
      });
    }).on('error', (err) => {
      resolve({ table, status: 'error', message: err.message });
    });
  });
}

async function run() {
  console.log('Querying Supabase tables to discover columns...');
  for (const table of tables) {
    const result = await fetchTableColumns(table);
    if (result.status === 'success') {
      console.log(`\n✅ Table: "${result.table}"`);
      if (result.hasData) {
        console.log(`   Columns (${result.columns.length}):`, result.columns);
        console.log(`   Sample Data:`, result.sample);
      } else {
        console.log(`   Columns: Empty table, but table exists.`);
      }
    } else {
      console.log(`\n❌ Table: "${result.table}" - Failed (HTTP ${result.code})`);
      console.log(`   Reason: ${result.message}`);
    }
  }
}

run();
