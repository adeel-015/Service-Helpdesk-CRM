#!/bin/bash

echo "=========================================="
echo "Testing Activity Logs Fix"
echo "=========================================="
echo ""

# Backend URL
API_URL="http://localhost:5001/api"

# First, create an admin user if it doesn't exist
echo "1. Creating admin user..."
curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","email":"testadmin@example.com","password":"admin123","role":"admin"}' > /dev/null

# Login as admin
echo "2. Logging in as admin..."
TOKEN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"admin123"}' | jq -r .token)

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "   ❌ Login failed. Using alternative admin account..."
  # Try alternative credentials
  TOKEN=$(curl -s -X POST $API_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"password"}' | jq -r .token)
fi

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "   ❌ Failed to authenticate. Please ensure an admin user exists."
  exit 1
fi

echo "   ✓ Logged in successfully"
echo ""

# Create a test ticket
echo "3. Creating a test ticket..."
TICKET_ID=$(curl -s -X POST $API_URL/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Activity Log Ticket","description":"Testing activity logs after fix","priority":"High","status":"Open"}' | jq -r '._id')

if [ "$TICKET_ID" = "null" ] || [ -z "$TICKET_ID" ]; then
  echo "   ❌ Failed to create ticket"
  exit 1
fi

echo "   ✓ Created ticket: $TICKET_ID"
echo ""

# Wait for activity log to be created
sleep 2

# Check activity logs
echo "4. Checking recent activity logs..."
cd /Users/adeeljaved/Documents/proxima_crm/backend
node -e "
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI).then(async () => {
  const ActivityLog = require('./models/ActivityLog');
  const logs = await ActivityLog.find().sort({timestamp: -1}).limit(3);
  console.log('   Most Recent Activity Logs:');
  logs.forEach((log, i) => {
    console.log(\`   \${i+1}. Action: \${log.action}, EntityType: \${log.entityType}\`);
  });
  
  // Check if there are any NOTIFY logs
  const notifyCount = await ActivityLog.countDocuments({ action: 'NOTIFY' });
  console.log('');
  if (notifyCount > 0) {
    console.log(\`   ❌ Found \${notifyCount} NOTIFY logs (should be 0)\`);
  } else {
    console.log('   ✓ No NOTIFY logs found (correct!)');
  }
  
  // Check if CREATE log exists
  const createLog = logs.find(l => l.action === 'CREATE');
  if (createLog) {
    console.log('   ✓ CREATE activity log found (correct!)');
  } else {
    console.log('   ⚠️  No CREATE activity log found');
  }
  
  await mongoose.connection.close();
}).catch(e => { console.error(e); process.exit(1); });
"

echo ""
echo "5. Updating the ticket..."
curl -s -X PUT $API_URL/tickets/$TICKET_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}' > /dev/null

sleep 2

# Check for UPDATE log
echo "6. Checking for UPDATE activity log..."
node -e "
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI).then(async () => {
  const ActivityLog = require('./models/ActivityLog');
  const updateLog = await ActivityLog.findOne({ action: 'UPDATE', entityId: '$TICKET_ID' }).sort({timestamp: -1});
  if (updateLog) {
    console.log('   ✓ UPDATE activity log found (correct!)');
  } else {
    console.log('   ❌ No UPDATE activity log found');
  }
  await mongoose.connection.close();
}).catch(e => { console.error(e); process.exit(1); });
"

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="
