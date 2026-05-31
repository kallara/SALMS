import fs from 'fs';
import https from 'https';

const supabaseUrl = 'https://ucqanvpwqtjiyrnuxqfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcWFudnB3cXRqaXlybnV4cWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDIxNjcsImV4cCI6MjA5NTgxODE2N30.XN1ZYqCqlnBFYvXaqkiuXv7ot69Tcq7wXScvcfgP45M';

const options = {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

https.get(`${supabaseUrl}/rest/v1/`, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const schema = JSON.parse(data);
      fs.writeFileSync('c:/Users/Acer/Documents/AntiGravity/SALMS/scratch_schema.json', JSON.stringify(schema, null, 2));
      console.log('Successfully fetched schema OpenAPI JSON!');
      
      const tables = schema.definitions ? Object.keys(schema.definitions) : [];
      console.log('Tables found in database:', tables);
    } catch (e) {
      console.error('Failed to parse JSON:', e.message);
      console.error('Data was:', data);
    }
  });
}).on('error', (err) => {
  console.error('HTTP Error:', err.message);
});
