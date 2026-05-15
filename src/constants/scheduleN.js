// ─── Schedule-N SOR Labour Items (from mindmap) ─────────────────
export const CHAPTERS_N = [
  {
    "name": "chapter 1",
    "code": "C1",
    "color": "#3B82F6",
    "items": [
      {
        "label": "item 1",
        "code": "CI1",
        "description": "item 1 description",
        "measurements": [
          {
            "key": "k1",
            "label": "need variable number here",
            "unit": "some unit",
            "type": "number",
            "options": [],
            "requiresPhoto": true,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d168"
            },
            "columns": []
          },
          {
            "key": "k2",
            "label": "constant number here",
            "unit": "",
            "type": "number",
            "options": [],
            "fixedNumber": 40,
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d169"
            },
            "columns": []
          },
          {
            "key": "k3",
            "label": "text varaible",
            "unit": "",
            "type": "text",
            "options": [],
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d16a"
            },
            "columns": []
          },
          {
            "key": "k4",
            "label": "text constant ",
            "unit": "",
            "type": "text",
            "fixedText": "viss",
            "options": [],
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d16b"
            },
            "columns": []
          },
          {
            "key": "k5",
            "label": "single select dropdown",
            "unit": "",
            "type": "select",
            "options": [
              "option 1",
              "option 2",
              "option 3"
            ],
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d16c"
            },
            "columns": []
          },
          {
            "key": "k6",
            "label": "multiselect",
            "unit": "",
            "type": "multiselect",
            "options": [
              "option 1",
              "option 2",
              "option 3",
              "option 4"
            ],
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d16d"
            },
            "columns": []
          },
          {
            "key": "k7",
            "label": "boolean",
            "unit": "",
            "type": "boolean",
            "options": [],
            "requiresPhoto": true,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d16e"
            },
            "columns": []
          }
        ],
        "_id": {
          "$oid": "69ff220114a4b44a1f83d167"
        }
      }
    ],
    "_id": {
      "$oid": "69ff220114a4b44a1f83d166"
    }
  },
  {
    "name": "chapter 2 ",
    "code": "C2",
    "color": "#22C55E",
    "items": [
      {
        "label": "item 1",
        "code": "CI21",
        "description": "",
        "measurements": [
          {
            "key": "k1",
            "label": "tabular data",
            "unit": "",
            "type": "table",
            "options": [],
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d171"
            },
            "columns": [
              {
                "key": "column_1_text",
                "label": "column 1 text",
                "unit": "",
                "type": "text",
                "options": [],
                "_id": {
                  "$oid": "69ff220114a4b44a1f83d172"
                },
                "columns": []
              },
              {
                "key": "column_2_number",
                "label": "column 2 number",
                "unit": "",
                "type": "number",
                "options": [],
                "_id": {
                  "$oid": "69ff220114a4b44a1f83d173"
                },
                "columns": []
              },
              {
                "key": "column_3_options",
                "label": "column 3 options",
                "unit": "",
                "type": "multiselect",
                "options": [
                  "optn 1",
                  "optn 2",
                  "optn 3"
                ],
                "_id": {
                  "$oid": "69ff220114a4b44a1f83d174"
                },
                "columns": []
              }
            ]
          }
        ],
        "_id": {
          "$oid": "69ff220114a4b44a1f83d170"
        }
      },
      {
        "label": "item 2 ",
        "code": "CI22",
        "description": "second item",
        "measurements": [
          {
            "key": "k1",
            "label": "time goes here",
            "unit": "",
            "type": "time",
            "options": [],
            "requiresPhoto": true,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d176"
            },
            "columns": []
          },
          {
            "key": "k2",
            "label": "unnecessaryphone",
            "unit": "",
            "type": "phone",
            "options": [],
            "requiresPhoto": false,
            "_id": {
              "$oid": "69ff220114a4b44a1f83d177"
            },
            "columns": []
          }
        ],
        "_id": {
          "$oid": "69ff220114a4b44a1f83d175"
        }
      }
    ],
    "_id": {
      "$oid": "69ff220114a4b44a1f83d16f"
    }
  }
]


// ─── Entry status display ────────────────────────────────────────
export const STATUS_CONFIG = {
  SUBMITTED: { label: 'Submitted', color: '#94A3B8', bg: 'rgba(148,163,184,.1)' },
  PENDING: { label: 'Pending', color: '#FBBF24', bg: 'rgba(251,191,36,.1)' },
  APPROVED: { label: 'Approved', color: '#22C55E', bg: 'rgba(34,197,94,.1)' },
  REJECTED: { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,.1)' },
  RETURNED: { label: 'Returned', color: '#A855F7', bg: 'rgba(168,85,247,.1)' },
};

// ─── Roles ──────────────────────────────────────────────────────
export const ROLES = {
  system_admin: { label: 'System Admin', color: '#F4A01C' },
  project_admin: { label: 'Project Admin', color: '#3B82F6' },
  field_engineer: { label: 'Field Engineer', color: '#22C55E' },
};

// ─── Mock entries for dev ──────────────────────────  ──────────────
export const MOCK_ENTRIES = [
  {
    id: 'e1', title: 'Cable Laying — Secunderabad Outer Yard',
    workCategory: 'Cable Laying (Ch.25)', scheduleChapter: 'Ch.25',
    status: 'PENDING', createdAt: '2026-04-20', submittedAt: '2026-04-21',
    engineer: { id: 'u3', name: 'Anil Verma', email: 'engineer@railways.gov.in' },
    span: { id: 's1', name: 'South Central Span' },
    gpsLat: 17.4326, gpsLng: 78.5013,
    locationDescription: 'Secunderabad Outer Yard, Km 12.4 to 14.9 Up Line',
    photos: [], adminRemark: '', returnReason: '',
    lineItems: [
      { id: 'li1', itemCode: 'CL-TR12', description: 'Trench 1200mm', quantity: 2.5, unit: 'RKM', ratePerUnit: 45000, amount: 112500 },
      { id: 'li2', itemCode: 'CL-LAY', description: 'Cable Laying', quantity: 2.5, unit: 'RKM', ratePerUnit: 30000, amount: 75000 },
      { id: 'li3', itemCode: 'CL-SAND', description: 'Sand Filling', quantity: 18, unit: 'cum', ratePerUnit: 800, amount: 14400 },
    ],
    totalAmount: 201900,
    auditLog: [{ action: 'SUBMITTED', user: 'Anil Verma', timestamp: '2026-04-21T09:30:00Z', note: '' }],
  },
  {
    id: 'e2', title: 'Location Box Foundation — HYB Platform 3',
    workCategory: 'Location Box (Ch.26)', scheduleChapter: 'Ch.26',
    status: 'APPROVED', createdAt: '2026-04-15', submittedAt: '2026-04-16',
    engineer: { id: 'u3', name: 'Anil Verma', email: 'engineer@railways.gov.in' },
    span: { id: 's1', name: 'South Central Span' },
    gpsLat: 17.3850, gpsLng: 78.4867,
    locationDescription: 'HYB Platform 3, near Km 0.2',
    photos: [], adminRemark: 'Good work, all parameters verified.', returnReason: '',
    lineItems: [
      { id: 'li4', itemCode: 'LB-FDF', description: 'Foundation (Full)', quantity: 4, unit: 'No.', ratePerUnit: 8500, amount: 34000 },
      { id: 'li5', itemCode: 'LB-CETH', description: 'Conv. Earthing', quantity: 2, unit: 'No.', ratePerUnit: 3200, amount: 6400 },
    ],
    totalAmount: 40400,
    auditLog: [
      { action: 'SUBMITTED', user: 'Anil Verma', timestamp: '2026-04-16T10:00:00Z', note: '' },
      { action: 'APPROVED', user: 'Priya Sharma', timestamp: '2026-04-17T14:20:00Z', note: 'Good work, all parameters verified.' },
    ],
  },
  {
    id: 'e3', title: 'Indoor Relay Room Wiring — Kachiguda',
    workCategory: 'Indoor Work (Ch.32)', scheduleChapter: 'Ch.32',
    status: 'REJECTED', createdAt: '2026-04-10', submittedAt: '2026-04-11',
    engineer: { id: 'u3', name: 'Anil Verma', email: 'engineer@railways.gov.in' },
    span: { id: 's1', name: 'South Central Span' },
    gpsLat: 17.3913, gpsLng: 78.4970,
    locationDescription: 'Kachiguda Relay Room, Cabin A',
    photos: [], adminRemark: 'Photographs not GPS-tagged. Wiring schedule mismatch at rack R-3. Resubmit.', returnReason: '',
    lineItems: [
      { id: 'li6', itemCode: 'IW-RLYW', description: 'Relay Room Wiring', quantity: 1, unit: 'No.', ratePerUnit: 25000, amount: 25000 },
    ],
    totalAmount: 25000,
    auditLog: [
      { action: 'SUBMITTED', user: 'Anil Verma', timestamp: '2026-04-11T08:00:00Z', note: '' },
      { action: 'REJECTED', user: 'Priya Sharma', timestamp: '2026-04-12T11:30:00Z', note: 'Photographs not GPS-tagged. Resubmit.' },
    ],
  },
];
