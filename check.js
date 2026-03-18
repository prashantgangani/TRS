const fs = require('fs');
const acorn = require('acorn-jsx');
try {
  acorn.parse(fs.readFileSync('client/src/components/StaffManagement.jsx', 'utf8'), {sourceType: 'module', plugins: {jsx: true}});
  console.log('Valid');
} catch (e) {
  console.error(e);
}
