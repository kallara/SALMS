import https from 'https';
import fs from 'fs';

const supabaseUrl = 'https://ucqanvpwqtjiyrnuxqfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFudnB3cXRqaXlybnV4cWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDIxNjcsImV4cCI6MjA5NTgxODE2N30.XN1ZYqCqlnBFYvXaqkiuXv7ot69Tcq7wXScvcfgP45M';

const tables = [
  'employees',
  'attendance_entries',
  'attendance_requests',
  'attendance_month_locks',
  'employee_leave_balances',
  'attendance_statuses',
  'functional_roles',
  'employment_categories',
  'holidays'
];

function fetchTableOptions(table) {
  return new Promise((resolve) => {
    const url = `${supabaseUrl}/rest/v1/${table}`;
    const options = {
      method: 'OPTIONS',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const schema = JSON.parse(data);
            resolve({ table, status: 'success', schema });
          } else {
            resolve({ table, status: 'error', code: res.statusCode, message: data });
          }
        } catch (e) {
          resolve({ table, status: 'error', code: res.statusCode, message: `JSON parse error: ${e.message}. Data was: ${data}` });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ table, status: 'error', message: err.message });
    });

    req.end();
  });
}

async function run() {
  console.log('Querying table OPTIONS schemas from Supabase...');
  const allSchemas = {};
  
  for (const table of tables) {
    const result = await fetchTableOptions(table);
    if (result.status === 'success') {
      console.log(`\n========================================`);
      console.log(`✅ Table: "${result.table}"`);
      allSchemas[result.table] = result.schema;
      
      const properties = result.schema.definitions?.[result.table]?.properties || {};
      const required = result.schema.definitions?.[result.table]?.required || [];
      
      console.log('Columns:');
      for (const [colName, colMeta] of Object.entries(properties)) {
        const typeStr = colMeta.type + (colMeta.format ? ` (${colMeta.format})` : '');
        const reqStr = required.includes(colName) ? 'REQUIRED' : 'optional';
        const descStr = colMeta.description ? ` - ${colMeta.description}` : '';
        console.log(`   - ${colName}: ${typeStr} [${reqStr}]${descStr}`);
      }
    } else {
      console.log(`❌ Table: "${result.table}" - Failed: ${result.message}`);
    }
  }
  
  fs.writeFileSync('c:/Users/Acer/Documents/AntiGravity/SALMS/full_schemas.json', JSON.stringify(allSchemas, null, 2));
  console.log('\nSaved all schemas to full_schemas.json!');
}

run();
