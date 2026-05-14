// ─── RAW MATERIALS ──────────────────────────────────────────────────────────
export const rawMaterials = [
  { _id:'rm001', name:'Full Grain Leather',    type:'Leather',    unit:'sq ft', stockQty:1500, reorderLevel:300,  unitCost:12.50, supplierName:'LuxLeather Co.',      quality:'Premium',  lastUpdated:'2026-03-20' },
  { _id:'rm002', name:'Synthetic PU Leather',  type:'Synthetic',  unit:'sq ft', stockQty:2200, reorderLevel:500,  unitCost:4.80,  supplierName:'SoleMaster Inc.',     quality:'Standard', lastUpdated:'2026-03-18' },
  { _id:'rm003', name:'Natural Rubber Sole',   type:'Rubber',     unit:'kg',    stockQty:850,  reorderLevel:200,  unitCost:6.20,  supplierName:'SoleMaster Inc.',     quality:'Standard', lastUpdated:'2026-03-15' },
  { _id:'rm004', name:'EVA Foam Insole',       type:'EVA Foam',   unit:'pair',  stockQty:3200, reorderLevel:800,  unitCost:2.30,  supplierName:'FoamTech Industries', quality:'Standard', lastUpdated:'2026-03-22' },
  { _id:'rm005', name:'Waxed Nylon Thread',    type:'Thread',     unit:'spool', stockQty:420,  reorderLevel:100,  unitCost:1.80,  supplierName:'Thread & Needle Ltd.',quality:'Premium',  lastUpdated:'2026-03-10' },
  { _id:'rm006', name:'Round Shoe Laces',      type:'Accessory',  unit:'pair',  stockQty:5000, reorderLevel:1000, unitCost:0.75,  supplierName:'AccessoriPro',        quality:'Standard', lastUpdated:'2026-03-21' },
  { _id:'rm007', name:'Contact Adhesive',      type:'Adhesive',   unit:'litre', stockQty:180,  reorderLevel:50,   unitCost:8.90,  supplierName:'ChemAdhesive Corp.',  quality:'Premium',  lastUpdated:'2026-03-19' },
  { _id:'rm008', name:'Brass Eyelets',         type:'Hardware',   unit:'pack',  stockQty:1200, reorderLevel:200,  unitCost:3.50,  supplierName:'AccessoriPro',        quality:'Standard', lastUpdated:'2026-03-17' },
];

// ─── SUPPLIERS ──────────────────────────────────────────────────────────────
export const suppliers = [
  { _id:'sup001', companyName:'LuxLeather Co.',      contactPerson:'Marco Ferretti',   email:'marco@luxleather.it',   phone:'+39-02-5551234', country:'Italy',   paymentTerms:'Net30', leadTimeDays:14, rating:5, status:'Active',   categories:'Leather' },
  { _id:'sup002', companyName:'SoleMaster Inc.',     contactPerson:'Chen Wei',         email:'chen@solemaster.cn',    phone:'+86-21-8880001', country:'China',   paymentTerms:'Net60', leadTimeDays:21, rating:4, status:'Active',   categories:'Rubber, Synthetic' },
  { _id:'sup003', companyName:'FoamTech Industries', contactPerson:'Li Huang',         email:'li@foamtech.tw',        phone:'+886-2-7770001', country:'Taiwan',  paymentTerms:'Net30', leadTimeDays:18, rating:4, status:'Active',   categories:'EVA Foam' },
  { _id:'sup004', companyName:'Thread & Needle Ltd.',contactPerson:'Ravi Sharma',      email:'ravi@threadneedle.in',  phone:'+91-11-4440001', country:'India',   paymentTerms:'Advance',leadTimeDays:10,rating:3, status:'Active',   categories:'Thread, Fabric' },
  { _id:'sup005', companyName:'AccessoriPro',        contactPerson:'Carlos Mendez',    email:'carlos@accessoripro.es',phone:'+34-91-3330001', country:'Spain',   paymentTerms:'Net30', leadTimeDays:12, rating:4, status:'Active',   categories:'Accessories, Hardware' },
  { _id:'sup006', companyName:'ChemAdhesive Corp.',  contactPerson:'Hans Mueller',     email:'hans@chemadh.de',       phone:'+49-89-2220001', country:'Germany', paymentTerms:'Net60', leadTimeDays:20, rating:3, status:'Inactive', categories:'Adhesives' },
];

// ─── MATERIAL PURCHASES ──────────────────────────────────────────────────────
export const materialPurchases = [
  { _id:'mp001', poNumber:'PO-2026-001', supplierName:'LuxLeather Co.',      materialName:'Full Grain Leather',  quantity:500,  unit:'sq ft', unitPrice:12.50, totalCost:6250,  orderDate:'2026-03-01', expectedDate:'2026-03-15', status:'Received' },
  { _id:'mp002', poNumber:'PO-2026-002', supplierName:'SoleMaster Inc.',     materialName:'Natural Rubber Sole', quantity:300,  unit:'kg',    unitPrice:6.20,  totalCost:1860,  orderDate:'2026-03-05', expectedDate:'2026-03-26', status:'Ordered'  },
  { _id:'mp003', poNumber:'PO-2026-003', supplierName:'FoamTech Industries', materialName:'EVA Foam Insole',     quantity:1000, unit:'pair',  unitPrice:2.30,  totalCost:2300,  orderDate:'2026-03-08', expectedDate:'2026-03-28', status:'Pending'  },
  { _id:'mp004', poNumber:'PO-2026-004', supplierName:'AccessoriPro',        materialName:'Round Shoe Laces',    quantity:2000, unit:'pair',  unitPrice:0.75,  totalCost:1500,  orderDate:'2026-03-10', expectedDate:'2026-03-22', status:'Received' },
  { _id:'mp005', poNumber:'PO-2026-005', supplierName:'ChemAdhesive Corp.',  materialName:'Contact Adhesive',    quantity:50,   unit:'litre', unitPrice:8.90,  totalCost:445,   orderDate:'2026-03-12', expectedDate:'2026-04-01', status:'Ordered'  },
  { _id:'mp006', poNumber:'PO-2026-006', supplierName:'Thread & Needle Ltd.',materialName:'Waxed Nylon Thread',  quantity:200,  unit:'spool', unitPrice:1.80,  totalCost:360,   orderDate:'2026-03-15', expectedDate:'2026-03-25', status:'Received' },
  { _id:'mp007', poNumber:'PO-2026-007', supplierName:'SoleMaster Inc.',     materialName:'Synthetic PU Leather',quantity:800,  unit:'sq ft', unitPrice:4.80,  totalCost:3840,  orderDate:'2026-03-18', expectedDate:'2026-04-08', status:'Pending'  },
  { _id:'mp008', poNumber:'PO-2026-008', supplierName:'AccessoriPro',        materialName:'Brass Eyelets',       quantity:500,  unit:'pack',  unitPrice:3.50,  totalCost:1750,  orderDate:'2026-03-20', expectedDate:'2026-04-02', status:'Ordered'  },
];

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
export const departments = [
  { _id:'dep001', deptId:'D-01', name:'Cutting',        managerName:'Ali Hassan',      floor:'Floor 1', capacity:30, currentHeadcount:26, shift:'Morning', status:'Active'   },
  { _id:'dep002', deptId:'D-02', name:'Stitching',      managerName:'Fatima Malik',    floor:'Floor 1', capacity:40, currentHeadcount:38, shift:'Morning', status:'Active'   },
  { _id:'dep003', deptId:'D-03', name:'Assembly',       managerName:'Usman Qureshi',   floor:'Floor 2', capacity:35, currentHeadcount:32, shift:'Morning', status:'Active'   },
  { _id:'dep004', deptId:'D-04', name:'Quality Control',managerName:'Sara Ahmed',      floor:'Floor 2', capacity:15, currentHeadcount:12, shift:'Morning', status:'Active'   },
  { _id:'dep005', deptId:'D-05', name:'Packaging',      managerName:'Bilal Chaudhry',  floor:'Floor 3', capacity:20, currentHeadcount:18, shift:'Morning', status:'Active'   },
  { _id:'dep006', deptId:'D-06', name:'Administration', managerName:'Nadia Hussain',   floor:'Office',  capacity:10, currentHeadcount:8,  shift:'Office',  status:'Active'   },
];

// ─── EMPLOYEES ───────────────────────────────────────────────────────────────
export const employees = [
  { _id:'emp001', empId:'E-001', firstName:'Ali',     lastName:'Hassan',   deptName:'Cutting',         position:'Senior Cutter',    phone:'0300-1234567', hireDate:'2020-04-15', salary:35000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp002', empId:'E-002', firstName:'Fatima',  lastName:'Malik',    deptName:'Stitching',       position:'Dept Manager',     phone:'0301-2345678', hireDate:'2019-08-01', salary:55000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp003', empId:'E-003', firstName:'Usman',   lastName:'Qureshi',  deptName:'Assembly',        position:'Dept Manager',     phone:'0302-3456789', hireDate:'2018-06-10', salary:55000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp004', empId:'E-004', firstName:'Sara',    lastName:'Ahmed',    deptName:'Quality Control', position:'QC Inspector',     phone:'0303-4567890', hireDate:'2021-02-20', salary:40000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp005', empId:'E-005', firstName:'Bilal',   lastName:'Chaudhry', deptName:'Packaging',       position:'Packing Operator', phone:'0304-5678901', hireDate:'2022-09-05', salary:28000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp006', empId:'E-006', firstName:'Zara',    lastName:'Khan',     deptName:'Stitching',       position:'Machine Operator', phone:'0305-6789012', hireDate:'2023-01-15', salary:30000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp007', empId:'E-007', firstName:'Hamza',   lastName:'Raza',     deptName:'Cutting',         position:'Machine Operator', phone:'0306-7890123', hireDate:'2021-11-01', salary:30000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp008', empId:'E-008', firstName:'Ayesha',  lastName:'Siddiqui', deptName:'Assembly',        position:'Line Supervisor',  phone:'0307-8901234', hireDate:'2020-07-22', salary:38000, employmentType:'Full-time', status:'On Leave' },
  { _id:'emp009', empId:'E-009', firstName:'Tariq',   lastName:'Mahmood',  deptName:'Quality Control', position:'QC Lead',          phone:'0308-9012345', hireDate:'2019-03-10', salary:48000, employmentType:'Full-time', status:'Active'   },
  { _id:'emp010', empId:'E-010', firstName:'Nadia',   lastName:'Hussain',  deptName:'Administration',  position:'HR Manager',       phone:'0309-0123456', hireDate:'2017-12-01', salary:60000, employmentType:'Full-time', status:'Active'   },
];

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const attendance = [
  { _id:'att001', empId:'E-001', empName:'Ali Hassan',     deptName:'Cutting',         date:'2026-03-26', checkIn:'08:02', checkOut:'17:00', hoursWorked:8.9, status:'Present'  },
  { _id:'att002', empId:'E-002', empName:'Fatima Malik',   deptName:'Stitching',       date:'2026-03-26', checkIn:'07:55', checkOut:'17:05', hoursWorked:9.1, status:'Present'  },
  { _id:'att003', empId:'E-003', empName:'Usman Qureshi',  deptName:'Assembly',        date:'2026-03-26', checkIn:'08:35', checkOut:'17:00', hoursWorked:8.4, status:'Late'     },
  { _id:'att004', empId:'E-004', empName:'Sara Ahmed',     deptName:'Quality Control', date:'2026-03-26', checkIn:'08:00', checkOut:'17:00', hoursWorked:9.0, status:'Present'  },
  { _id:'att005', empId:'E-005', empName:'Bilal Chaudhry', deptName:'Packaging',       date:'2026-03-26', checkIn:'',      checkOut:'',      hoursWorked:0,   status:'Absent'   },
  { _id:'att006', empId:'E-006', empName:'Zara Khan',      deptName:'Stitching',       date:'2026-03-26', checkIn:'08:00', checkOut:'13:00', hoursWorked:5.0, status:'Half-Day' },
  { _id:'att007', empId:'E-007', empName:'Hamza Raza',     deptName:'Cutting',         date:'2026-03-26', checkIn:'07:58', checkOut:'17:02', hoursWorked:9.0, status:'Present'  },
  { _id:'att008', empId:'E-008', empName:'Ayesha Siddiqui',deptName:'Assembly',        date:'2026-03-26', checkIn:'',      checkOut:'',      hoursWorked:0,   status:'Leave'    },
  { _id:'att009', empId:'E-009', empName:'Tariq Mahmood',  deptName:'Quality Control', date:'2026-03-26', checkIn:'08:05', checkOut:'17:00', hoursWorked:8.9, status:'Present'  },
  { _id:'att010', empId:'E-010', empName:'Nadia Hussain',  deptName:'Administration',  date:'2026-03-26', checkIn:'09:00', checkOut:'18:00', hoursWorked:9.0, status:'Present'  },
];

// ─── SHIFT MANAGEMENT ────────────────────────────────────────────────────────
export const shiftManagement = [
  { _id:'sh001', shiftName:'Morning Shift A', startTime:'08:00', endTime:'17:00', deptName:'Cutting',         supervisorName:'Ali Hassan',    date:'2026-03-26', assignedCount:13, status:'Active'    },
  { _id:'sh002', shiftName:'Morning Shift B', startTime:'08:00', endTime:'17:00', deptName:'Stitching',       supervisorName:'Fatima Malik',  date:'2026-03-26', assignedCount:19, status:'Active'    },
  { _id:'sh003', shiftName:'Morning Shift C', startTime:'08:00', endTime:'17:00', deptName:'Assembly',        supervisorName:'Usman Qureshi', date:'2026-03-26', assignedCount:16, status:'Active'    },
  { _id:'sh004', shiftName:'Evening Shift A', startTime:'17:00', endTime:'02:00', deptName:'Cutting',         supervisorName:'Hamza Raza',    date:'2026-03-26', assignedCount:10, status:'Upcoming'  },
  { _id:'sh005', shiftName:'Evening Shift B', startTime:'17:00', endTime:'02:00', deptName:'Stitching',       supervisorName:'Zara Khan',     date:'2026-03-26', assignedCount:12, status:'Upcoming'  },
  { _id:'sh006', shiftName:'QC Inspection',   startTime:'09:00', endTime:'18:00', deptName:'Quality Control', supervisorName:'Tariq Mahmood', date:'2026-03-26', assignedCount:6,  status:'Active'    },
];

// ─── SALARIES ─────────────────────────────────────────────────────────────────
export const salaries = [
  { _id:'sal001', empId:'E-001', empName:'Ali Hassan',     deptName:'Cutting',         month:'March', year:2026, baseSalary:35000, allowances:5000, overtime:2500, deductions:1500, netSalary:41000, paymentDate:'2026-03-31', status:'Pending'    },
  { _id:'sal002', empId:'E-002', empName:'Fatima Malik',   deptName:'Stitching',       month:'March', year:2026, baseSalary:55000, allowances:8000, overtime:0,    deductions:2000, netSalary:61000, paymentDate:'2026-03-31', status:'Pending'    },
  { _id:'sal003', empId:'E-003', empName:'Usman Qureshi',  deptName:'Assembly',        month:'March', year:2026, baseSalary:55000, allowances:8000, overtime:0,    deductions:2000, netSalary:61000, paymentDate:'2026-03-31', status:'Pending'    },
  { _id:'sal004', empId:'E-004', empName:'Sara Ahmed',     deptName:'Quality Control', month:'March', year:2026, baseSalary:40000, allowances:5000, overtime:1000, deductions:1500, netSalary:44500, paymentDate:'2026-03-31', status:'Pending'    },
  { _id:'sal005', empId:'E-005', empName:'Bilal Chaudhry', deptName:'Packaging',       month:'March', year:2026, baseSalary:28000, allowances:3000, overtime:0,    deductions:1000, netSalary:30000, paymentDate:'',           status:'Pending'    },
  { _id:'sal006', empId:'E-006', empName:'Zara Khan',      deptName:'Stitching',       month:'February',year:2026,baseSalary:30000,allowances:3000, overtime:1500, deductions:1200, netSalary:33300, paymentDate:'2026-02-28', status:'Paid'       },
  { _id:'sal007', empId:'E-007', empName:'Hamza Raza',     deptName:'Cutting',         month:'February',year:2026,baseSalary:30000,allowances:3000, overtime:3000, deductions:1200, netSalary:34800, paymentDate:'2026-02-28', status:'Paid'       },
  { _id:'sal008', empId:'E-009', empName:'Tariq Mahmood',  deptName:'Quality Control', month:'February',year:2026,baseSalary:48000,allowances:6000, overtime:0,    deductions:1800, netSalary:52200, paymentDate:'2026-02-28', status:'Paid'       },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const products = [
  { _id:'prd001', productId:'SC-ATH-001', name:'SoleCraft Runner Pro',   category:'Athletic',  style:'Low-Top Sneaker', materials:'Synthetic, EVA Foam, Rubber', costToMake:850,  sellingPrice:2200, status:'Active'   },
  { _id:'prd002', productId:'SC-DRS-001', name:'Heritage Oxford',        category:'Dress',     style:'Oxford Lace-Up',  materials:'Full Grain Leather, Rubber',  costToMake:1200, sellingPrice:3500, status:'Active'   },
  { _id:'prd003', productId:'SC-CAS-001', name:'Urban Slip-On',          category:'Casual',    style:'Slip-On',         materials:'Synthetic, EVA Foam',          costToMake:600,  sellingPrice:1500, status:'Active'   },
  { _id:'prd004', productId:'SC-BOT-001', name:'Artisan Chelsea Boot',   category:'Boot',      style:'Chelsea Boot',    materials:'Full Grain Leather, Rubber',  costToMake:1500, sellingPrice:4200, status:'Active'   },
  { _id:'prd005', productId:'SC-ATH-002', name:'Trail Blazer Hiker',     category:'Athletic',  style:'High-Top Hiker',  materials:'Synthetic, Rubber',            costToMake:950,  sellingPrice:2600, status:'Active'   },
  { _id:'prd006', productId:'SC-SND-001', name:'Summer Sandal Classic',  category:'Sandal',    style:'Open-Toe Sandal', materials:'Synthetic, EVA Foam',          costToMake:400,  sellingPrice:1100, status:'Active'   },
  { _id:'prd007', productId:'SC-DRS-002', name:'Brogue Wingtip Elite',   category:'Dress',     style:'Brogue',          materials:'Full Grain Leather, Rubber',  costToMake:1350, sellingPrice:3800, status:'Development'},
];

// ─── PRODUCT INVENTORY ────────────────────────────────────────────────────────
export const productInventory = [
  { _id:'inv001', productId:'SC-ATH-001', productName:'SoleCraft Runner Pro', category:'Athletic', size:'40', color:'Black/White',  stockQty:120, reservedQty:40, availableQty:80,  reorderLevel:30, warehouse:'WH-A' },
  { _id:'inv002', productId:'SC-ATH-001', productName:'SoleCraft Runner Pro', category:'Athletic', size:'42', color:'Blue/White',   stockQty:95,  reservedQty:20, availableQty:75,  reorderLevel:30, warehouse:'WH-A' },
  { _id:'inv003', productId:'SC-DRS-001', productName:'Heritage Oxford',      category:'Dress',    size:'41', color:'Tan Brown',    stockQty:60,  reservedQty:15, availableQty:45,  reorderLevel:20, warehouse:'WH-B' },
  { _id:'inv004', productId:'SC-DRS-001', productName:'Heritage Oxford',      category:'Dress',    size:'43', color:'Dark Brown',   stockQty:45,  reservedQty:10, availableQty:35,  reorderLevel:20, warehouse:'WH-B' },
  { _id:'inv005', productId:'SC-CAS-001', productName:'Urban Slip-On',        category:'Casual',   size:'40', color:'Grey',         stockQty:200, reservedQty:50, availableQty:150, reorderLevel:50, warehouse:'WH-A' },
  { _id:'inv006', productId:'SC-BOT-001', productName:'Artisan Chelsea Boot', category:'Boot',     size:'42', color:'Black',        stockQty:35,  reservedQty:20, availableQty:15,  reorderLevel:20, warehouse:'WH-B' },
  { _id:'inv007', productId:'SC-ATH-002', productName:'Trail Blazer Hiker',   category:'Athletic', size:'44', color:'Olive Green',  stockQty:80,  reservedQty:25, availableQty:55,  reorderLevel:25, warehouse:'WH-A' },
  { _id:'inv008', productId:'SC-SND-001', productName:'Summer Sandal Classic',category:'Sandal',   size:'38', color:'Beige',        stockQty:18,  reservedQty:5,  availableQty:13,  reorderLevel:20, warehouse:'WH-C' },
];

// ─── WORK ORDERS ─────────────────────────────────────────────────────────────
export const workOrders = [
  { _id:'wo001', woNumber:'WO-2026-001', productName:'Heritage Oxford',       clientName:'LuxRetail Pvt Ltd', quantity:200, dueDate:'2026-04-10', priority:'High',   assignedDept:'Assembly', status:'In Production' },
  { _id:'wo002', woNumber:'WO-2026-002', productName:'SoleCraft Runner Pro',  clientName:'SportZone Exports', quantity:500, dueDate:'2026-04-15', priority:'Normal', assignedDept:'Cutting',  status:'Pending'       },
  { _id:'wo003', woNumber:'WO-2026-003', productName:'Artisan Chelsea Boot',  clientName:'FashionForward Co.',quantity:150, dueDate:'2026-04-05', priority:'Urgent', assignedDept:'Assembly', status:'In Production' },
  { _id:'wo004', woNumber:'WO-2026-004', productName:'Urban Slip-On',         clientName:'CasualWear Ltd.',   quantity:400, dueDate:'2026-04-20', priority:'Normal', assignedDept:'Cutting',  status:'Pending'       },
  { _id:'wo005', woNumber:'WO-2026-005', productName:'Heritage Oxford',       clientName:'ClassicShoes UK',   quantity:100, dueDate:'2026-03-30', priority:'Urgent', assignedDept:'Packaging',status:'Completed'     },
  { _id:'wo006', woNumber:'WO-2026-006', productName:'Trail Blazer Hiker',    clientName:'OutdoorGear Inc.',  quantity:300, dueDate:'2026-04-25', priority:'Normal', assignedDept:'Stitching',status:'In Production' },
  { _id:'wo007', woNumber:'WO-2026-007', productName:'Summer Sandal Classic', clientName:'SummerTrend LLC',   quantity:600, dueDate:'2026-05-01', priority:'Low',    assignedDept:'Cutting',  status:'Pending'       },
  { _id:'wo008', woNumber:'WO-2026-008', productName:'Brogue Wingtip Elite',  clientName:'EliteFootwear EU',  quantity:80,  dueDate:'2026-04-28', priority:'High',   assignedDept:'Assembly', status:'Pending'       },
];

// ─── PRODUCTION BATCHES ──────────────────────────────────────────────────────
export const productionBatches = [
  { _id:'pb001', batchId:'BATCH-001', productName:'Heritage Oxford',       woNumber:'WO-2026-001', quantity:200, startDate:'2026-03-15', expectedDate:'2026-04-10', progress:65, supervisorName:'Usman Qureshi', status:'In Progress' },
  { _id:'pb002', batchId:'BATCH-002', productName:'Artisan Chelsea Boot',  woNumber:'WO-2026-003', quantity:150, startDate:'2026-03-18', expectedDate:'2026-04-05', progress:40, supervisorName:'Ali Hassan',    status:'In Progress' },
  { _id:'pb003', batchId:'BATCH-003', productName:'Heritage Oxford',       woNumber:'WO-2026-005', quantity:100, startDate:'2026-03-05', expectedDate:'2026-03-30', progress:100,supervisorName:'Usman Qureshi', status:'Completed'   },
  { _id:'pb004', batchId:'BATCH-004', productName:'SoleCraft Runner Pro',  woNumber:'WO-2026-002', quantity:500, startDate:'2026-03-22', expectedDate:'2026-04-15', progress:15, supervisorName:'Ali Hassan',    status:'In Progress' },
  { _id:'pb005', batchId:'BATCH-005', productName:'Urban Slip-On',         woNumber:'WO-2026-004', quantity:400, startDate:'2026-04-01', expectedDate:'2026-04-20', progress:0,  supervisorName:'Fatima Malik',  status:'Planned'     },
  { _id:'pb006', batchId:'BATCH-006', productName:'Trail Blazer Hiker',    woNumber:'WO-2026-006', quantity:300, startDate:'2026-03-20', expectedDate:'2026-04-25', progress:30, supervisorName:'Usman Qureshi', status:'In Progress' },
  { _id:'pb007', batchId:'BATCH-007', productName:'Summer Sandal Classic', woNumber:'WO-2026-007', quantity:600, startDate:'2026-04-05', expectedDate:'2026-05-01', progress:0,  supervisorName:'Bilal Chaudhry',status:'Planned'     },
];

// ─── BATCH TRACKING ───────────────────────────────────────────────────────────
export const batchTracking = [
  { _id:'bt001', batchId:'BATCH-001', productName:'Heritage Oxford',      currentStage:'Assembly',       previousStage:'Stitching',  operatorName:'Usman Qureshi', enteredAt:'2026-03-22 08:00', notes:'On schedule', status:'In Progress' },
  { _id:'bt002', batchId:'BATCH-002', productName:'Artisan Chelsea Boot', currentStage:'Stitching',      previousStage:'Cutting',    operatorName:'Fatima Malik',  enteredAt:'2026-03-21 09:30', notes:'',             status:'In Progress' },
  { _id:'bt003', batchId:'BATCH-003', productName:'Heritage Oxford',      currentStage:'Dispatched',     previousStage:'Packaging',  operatorName:'Bilal Chaudhry',enteredAt:'2026-03-28 14:00', notes:'Completed',    status:'Completed'   },
  { _id:'bt004', batchId:'BATCH-004', productName:'SoleCraft Runner Pro', currentStage:'Cutting',        previousStage:'Planning',   operatorName:'Ali Hassan',    enteredAt:'2026-03-22 07:45', notes:'Started today',status:'In Progress' },
  { _id:'bt005', batchId:'BATCH-005', productName:'Urban Slip-On',        currentStage:'Planning',       previousStage:'-',          operatorName:'Fatima Malik',  enteredAt:'2026-03-26 10:00', notes:'Awaiting start',status:'Pending'     },
  { _id:'bt006', batchId:'BATCH-006', productName:'Trail Blazer Hiker',   currentStage:'Stitching',      previousStage:'Cutting',    operatorName:'Fatima Malik',  enteredAt:'2026-03-23 08:15', notes:'',             status:'In Progress' },
  { _id:'bt007', batchId:'BATCH-007', productName:'Summer Sandal Classic',currentStage:'Planning',       previousStage:'-',          operatorName:'Bilal Chaudhry',enteredAt:'2026-03-26 11:00', notes:'Scheduled',    status:'Pending'     },
];

// ─── PRODUCTION STAGES ────────────────────────────────────────────────────────
export const productionStages = [
  { _id:'ps001', stageId:'STG-01', stageName:'Material Preparation', sequence:1, deptName:'Cutting',         description:'Prepare and sort raw materials',       avgDurationHours:4,  requiredMachines:'Cutting Machine', qualityCheckRequired:'No'  },
  { _id:'ps002', stageId:'STG-02', stageName:'Cutting',              sequence:2, deptName:'Cutting',         description:'Cut upper, lining, and insole pieces', avgDurationHours:8,  requiredMachines:'Cutting Machine, Press', qualityCheckRequired:'Yes' },
  { _id:'ps003', stageId:'STG-03', stageName:'Stitching',            sequence:3, deptName:'Stitching',       description:'Stitch upper components together',     avgDurationHours:16, requiredMachines:'Industrial Sewing Machine', qualityCheckRequired:'Yes' },
  { _id:'ps004', stageId:'STG-04', stageName:'Assembly & Lasting',   sequence:4, deptName:'Assembly',        description:'Last the shoe and attach sole',         avgDurationHours:10, requiredMachines:'Lasting Machine, Press', qualityCheckRequired:'Yes' },
  { _id:'ps005', stageId:'STG-05', stageName:'Quality Inspection',   sequence:5, deptName:'Quality Control', description:'Full quality inspection and testing',   avgDurationHours:4,  requiredMachines:'-', qualityCheckRequired:'Yes' },
  { _id:'ps006', stageId:'STG-06', stageName:'Packaging',            sequence:6, deptName:'Packaging',       description:'Box, label, and prepare for dispatch',  avgDurationHours:3,  requiredMachines:'Packaging Line', qualityCheckRequired:'No'  },
];

// ─── STAGE LOGS ───────────────────────────────────────────────────────────────
export const stageLogs = [
  { _id:'sl001', batchId:'BATCH-001', stageName:'Cutting',            operatorName:'Ali Hassan',    machineId:'MCH-003', startTime:'2026-03-15 08:00', endTime:'2026-03-15 16:00', durationHours:8,  outputQty:200, rejectedQty:2,  status:'Completed' },
  { _id:'sl002', batchId:'BATCH-001', stageName:'Stitching',          operatorName:'Fatima Malik',  machineId:'MCH-006', startTime:'2026-03-16 08:00', endTime:'2026-03-17 16:00', durationHours:16, outputQty:198, rejectedQty:4,  status:'Completed' },
  { _id:'sl003', batchId:'BATCH-001', stageName:'Assembly & Lasting', operatorName:'Usman Qureshi', machineId:'MCH-008', startTime:'2026-03-18 08:00', endTime:'2026-03-18 18:00', durationHours:10, outputQty:194, rejectedQty:3,  status:'Completed' },
  { _id:'sl004', batchId:'BATCH-002', stageName:'Cutting',            operatorName:'Hamza Raza',    machineId:'MCH-002', startTime:'2026-03-18 08:00', endTime:'2026-03-18 17:00', durationHours:9,  outputQty:150, rejectedQty:0,  status:'Completed' },
  { _id:'sl005', batchId:'BATCH-002', stageName:'Stitching',          operatorName:'Zara Khan',     machineId:'MCH-005', startTime:'2026-03-19 08:00', endTime:'2026-03-20 16:00', durationHours:16, outputQty:148, rejectedQty:5,  status:'Completed' },
  { _id:'sl006', batchId:'BATCH-004', stageName:'Cutting',            operatorName:'Ali Hassan',    machineId:'MCH-001', startTime:'2026-03-22 08:00', endTime:'2026-03-22 16:00', durationHours:8,  outputQty:500, rejectedQty:8,  status:'Completed' },
  { _id:'sl007', batchId:'BATCH-006', stageName:'Cutting',            operatorName:'Hamza Raza',    machineId:'MCH-003', startTime:'2026-03-20 08:00', endTime:'2026-03-20 16:00', durationHours:8,  outputQty:300, rejectedQty:3,  status:'Completed' },
  { _id:'sl008', batchId:'BATCH-006', stageName:'Stitching',          operatorName:'Zara Khan',     machineId:'MCH-007', startTime:'2026-03-21 08:00', endTime:'2026-03-22 16:00', durationHours:16, outputQty:297, rejectedQty:5,  status:'In Progress'},
];

// ─── ASSEMBLY TRACKING ────────────────────────────────────────────────────────
export const assemblyTracking = [
  { _id:'as001', assemblyId:'ASM-001', batchId:'BATCH-001', assemblyLine:'Line A', operatorName:'Usman Qureshi', startTime:'2026-03-22 08:00', endTime:'',              unitsAssembled:130, defectsFound:3,  completionRate:67, status:'Running'   },
  { _id:'as002', assemblyId:'ASM-002', batchId:'BATCH-002', assemblyLine:'Line B', operatorName:'Ayesha Siddiqui',startTime:'2026-03-21 09:00',endTime:'',              unitsAssembled:60,  defectsFound:5,  completionRate:40, status:'Paused'    },
  { _id:'as003', assemblyId:'ASM-003', batchId:'BATCH-003', assemblyLine:'Line A', operatorName:'Usman Qureshi', startTime:'2026-03-10 08:00', endTime:'2026-03-28 15:00',unitsAssembled:100,defectsFound:2,  completionRate:100,status:'Completed' },
  { _id:'as004', assemblyId:'ASM-004', batchId:'BATCH-004', assemblyLine:'Line C', operatorName:'Tariq Mahmood', startTime:'2026-03-25 08:00', endTime:'',              unitsAssembled:75,  defectsFound:8,  completionRate:15, status:'Running'   },
  { _id:'as005', assemblyId:'ASM-005', batchId:'BATCH-006', assemblyLine:'Line B', operatorName:'Usman Qureshi', startTime:'2026-03-23 08:00', endTime:'',              unitsAssembled:90,  defectsFound:2,  completionRate:30, status:'Running'   },
];

// ─── PACKAGING LOGS ───────────────────────────────────────────────────────────
export const packagingLogs = [
  { _id:'pk001', packLogId:'PKG-001', batchId:'BATCH-003', productName:'Heritage Oxford',      quantity:100, packagingType:'Box',    boxSize:'Size 10', operatorName:'Bilal Chaudhry', packingDate:'2026-03-28', status:'Dispatched' },
  { _id:'pk002', packLogId:'PKG-002', batchId:'BATCH-001', productName:'Heritage Oxford',      quantity:130, packagingType:'Box',    boxSize:'Size 10', operatorName:'Bilal Chaudhry', packingDate:'2026-03-26', status:'Packed'     },
  { _id:'pk003', packLogId:'PKG-003', batchId:'BATCH-002', productName:'Artisan Chelsea Boot', quantity:60,  packagingType:'Box',    boxSize:'Size 12', operatorName:'Zara Khan',      packingDate:'',           status:'Pending'    },
  { _id:'pk004', packLogId:'PKG-004', batchId:'BATCH-006', productName:'Trail Blazer Hiker',   quantity:90,  packagingType:'Box',    boxSize:'Size 11', operatorName:'Bilal Chaudhry', packingDate:'',           status:'Pending'    },
  { _id:'pk005', packLogId:'PKG-005', batchId:'BATCH-004', productName:'SoleCraft Runner Pro', quantity:75,  packagingType:'Bundle', boxSize:'N/A',     operatorName:'Zara Khan',      packingDate:'',           status:'Pending'    },
];

// ─── MACHINES ─────────────────────────────────────────────────────────────────
export const machines = [
  { _id:'mch001', machineId:'MCH-001', name:'Atom Cutting Press A',     type:'Cutting',   manufacturer:'Atom',        model:'S250',    deptName:'Cutting',  purchaseDate:'2021-06-10', lastMaintenance:'2026-02-15', nextMaintenance:'2026-05-15', status:'Running'     },
  { _id:'mch002', machineId:'MCH-002', name:'Atom Cutting Press B',     type:'Cutting',   manufacturer:'Atom',        model:'S250',    deptName:'Cutting',  purchaseDate:'2021-06-10', lastMaintenance:'2026-02-15', nextMaintenance:'2026-05-15', status:'Running'     },
  { _id:'mch003', machineId:'MCH-003', name:'Band Knife Skiver A',      type:'Cutting',   manufacturer:'Fortuna',     model:'BK-200',  deptName:'Cutting',  purchaseDate:'2020-03-15', lastMaintenance:'2026-01-20', nextMaintenance:'2026-04-20', status:'Running'     },
  { _id:'mch004', machineId:'MCH-004', name:'Union Special Lockstitch', type:'Stitching', manufacturer:'Union Spec.', model:'39500',   deptName:'Stitching',purchaseDate:'2019-09-01', lastMaintenance:'2026-03-01', nextMaintenance:'2026-06-01', status:'Maintenance' },
  { _id:'mch005', machineId:'MCH-005', name:'Juki Industrial Sew. A',   type:'Stitching', manufacturer:'Juki',        model:'DDL-8700',deptName:'Stitching',purchaseDate:'2022-04-20', lastMaintenance:'2026-02-20', nextMaintenance:'2026-05-20', status:'Running'     },
  { _id:'mch006', machineId:'MCH-006', name:'Juki Industrial Sew. B',   type:'Stitching', manufacturer:'Juki',        model:'DDL-8700',deptName:'Stitching',purchaseDate:'2022-04-20', lastMaintenance:'2026-02-20', nextMaintenance:'2026-05-20', status:'Running'     },
  { _id:'mch007', machineId:'MCH-007', name:'Shoe Lasting Machine A',   type:'Lasting',   manufacturer:'Comec',       model:'LS-500',  deptName:'Assembly', purchaseDate:'2020-11-15', lastMaintenance:'2026-01-10', nextMaintenance:'2026-04-10', status:'Idle'        },
  { _id:'mch008', machineId:'MCH-008', name:'Sole Press Machine',       type:'Pressing',  manufacturer:'Desma',       model:'P400',    deptName:'Assembly', purchaseDate:'2023-01-05', lastMaintenance:'2026-03-10', nextMaintenance:'2026-06-10', status:'Running'     },
];

// ─── MAINTENANCE LOGS ─────────────────────────────────────────────────────────
export const maintenanceLogs = [
  { _id:'ml001', logId:'MNT-001', machineId:'MCH-004', machineName:'Union Special Lockstitch',maintenanceType:'Emergency',  technicianName:'Khalid Nawaz', startDate:'2026-03-25', endDate:'',           cost:15000, description:'Belt replacement and lubrication', status:'In Progress' },
  { _id:'ml002', logId:'MNT-002', machineId:'MCH-001', machineName:'Atom Cutting Press A',    maintenanceType:'Routine',    technicianName:'Khalid Nawaz', startDate:'2026-02-15', endDate:'2026-02-15', cost:3500,  description:'Monthly lubrication and calibration', status:'Completed'   },
  { _id:'ml003', logId:'MNT-003', machineId:'MCH-005', machineName:'Juki Industrial Sew. A',  maintenanceType:'Routine',    technicianName:'Imran Baig',   startDate:'2026-02-20', endDate:'2026-02-20', cost:2800,  description:'Thread tension adjustment', status:'Completed'   },
  { _id:'ml004', logId:'MNT-004', machineId:'MCH-008', machineName:'Sole Press Machine',      maintenanceType:'Routine',    technicianName:'Khalid Nawaz', startDate:'2026-03-10', endDate:'2026-03-10', cost:4200,  description:'Pressure system check', status:'Completed'   },
  { _id:'ml005', logId:'MNT-005', machineId:'MCH-007', machineName:'Shoe Lasting Machine A',  maintenanceType:'Overhaul',   technicianName:'Imran Baig',   startDate:'2026-04-10', endDate:'',           cost:25000, description:'Full overhaul scheduled', status:'Scheduled'   },
  { _id:'ml006', logId:'MNT-006', machineId:'MCH-002', machineName:'Atom Cutting Press B',    maintenanceType:'Routine',    technicianName:'Khalid Nawaz', startDate:'2026-02-15', endDate:'2026-02-15', cost:3500,  description:'Blade sharpening and alignment', status:'Completed'  },
  { _id:'ml007', logId:'MNT-007', machineId:'MCH-003', machineName:'Band Knife Skiver A',     maintenanceType:'Routine',    technicianName:'Imran Baig',   startDate:'2026-01-20', endDate:'2026-01-20', cost:2000,  description:'Blade replacement', status:'Completed'   },
];

// ─── MACHINE USAGE LOGS ───────────────────────────────────────────────────────
export const machineUsageLogs = [
  { _id:'mu001', logId:'USG-001', machineId:'MCH-001', machineName:'Atom Cutting Press A',   deptName:'Cutting',  operatorName:'Ali Hassan',    startTime:'2026-03-26 08:00', endTime:'2026-03-26 16:00', hoursUsed:8,  productionOutput:500, efficiency:95, faultReported:'No'  },
  { _id:'mu002', logId:'USG-002', machineId:'MCH-002', machineName:'Atom Cutting Press B',   deptName:'Cutting',  operatorName:'Hamza Raza',    startTime:'2026-03-26 08:00', endTime:'2026-03-26 16:00', hoursUsed:8,  productionOutput:480, efficiency:90, faultReported:'No'  },
  { _id:'mu003', logId:'USG-003', machineId:'MCH-005', machineName:'Juki Industrial Sew. A', deptName:'Stitching',operatorName:'Fatima Malik',  startTime:'2026-03-26 08:00', endTime:'2026-03-26 17:00', hoursUsed:9,  productionOutput:198, efficiency:88, faultReported:'No'  },
  { _id:'mu004', logId:'USG-004', machineId:'MCH-006', machineName:'Juki Industrial Sew. B', deptName:'Stitching',operatorName:'Zara Khan',     startTime:'2026-03-26 08:00', endTime:'2026-03-26 16:30', hoursUsed:8.5,productionOutput:190, efficiency:85, faultReported:'Yes' },
  { _id:'mu005', logId:'USG-005', machineId:'MCH-008', machineName:'Sole Press Machine',     deptName:'Assembly', operatorName:'Usman Qureshi', startTime:'2026-03-26 08:00', endTime:'2026-03-26 17:00', hoursUsed:9,  productionOutput:130, efficiency:92, faultReported:'No'  },
  { _id:'mu006', logId:'USG-006', machineId:'MCH-003', machineName:'Band Knife Skiver A',    deptName:'Cutting',  operatorName:'Ali Hassan',    startTime:'2026-03-25 08:00', endTime:'2026-03-25 16:00', hoursUsed:8,  productionOutput:300, efficiency:87, faultReported:'No'  },
  { _id:'mu007', logId:'USG-007', machineId:'MCH-007', machineName:'Shoe Lasting Machine A', deptName:'Assembly', operatorName:'Tariq Mahmood', startTime:'2026-03-25 08:00', endTime:'2026-03-25 12:00', hoursUsed:4,  productionOutput:60,  efficiency:70, faultReported:'Yes' },
];

// ─── QUALITY CONTROL REPORTS ─────────────────────────────────────────────────
export const qualityControlReports = [
  { _id:'qc001', reportId:'QCR-001', batchId:'BATCH-001', inspectorName:'Sara Ahmed',    inspectionDate:'2026-03-24', totalInspected:130, passed:124, failed:6,  passRate:95.4, majorDefects:2, minorDefects:4, status:'Conditional Pass' },
  { _id:'qc002', reportId:'QCR-002', batchId:'BATCH-003', inspectorName:'Tariq Mahmood', inspectionDate:'2026-03-27', totalInspected:100, passed:98,  failed:2,  passRate:98.0, majorDefects:0, minorDefects:2, status:'Passed'           },
  { _id:'qc003', reportId:'QCR-003', batchId:'BATCH-002', inspectorName:'Sara Ahmed',    inspectionDate:'2026-03-22', totalInspected:60,  passed:52,  failed:8,  passRate:86.7, majorDefects:5, minorDefects:3, status:'Failed'           },
  { _id:'qc004', reportId:'QCR-004', batchId:'BATCH-004', inspectorName:'Tariq Mahmood', inspectionDate:'2026-03-25', totalInspected:75,  passed:73,  failed:2,  passRate:97.3, majorDefects:0, minorDefects:2, status:'Passed'           },
  { _id:'qc005', reportId:'QCR-005', batchId:'BATCH-006', inspectorName:'Sara Ahmed',    inspectionDate:'2026-03-23', totalInspected:90,  passed:86,  failed:4,  passRate:95.6, majorDefects:1, minorDefects:3, status:'Conditional Pass' },
];

// ─── DEFECT TRACKING ─────────────────────────────────────────────────────────
export const defectTracking = [
  { _id:'dt001', defectId:'DEF-001', batchId:'BATCH-001', productName:'Heritage Oxford',      stage:'Stitching',          defectType:'Stitching',  severity:'Minor',    reportedBy:'Sara Ahmed',    reportedDate:'2026-03-24', assignedTo:'Fatima Malik',  status:'Resolved'   },
  { _id:'dt002', defectId:'DEF-002', batchId:'BATCH-002', productName:'Artisan Chelsea Boot', stage:'Assembly',           defectType:'Structural', severity:'Major',    reportedBy:'Sara Ahmed',    reportedDate:'2026-03-22', assignedTo:'Usman Qureshi', status:'In Review'  },
  { _id:'dt003', defectId:'DEF-003', batchId:'BATCH-002', productName:'Artisan Chelsea Boot', stage:'Stitching',          defectType:'Stitching',  severity:'Major',    reportedBy:'Tariq Mahmood', reportedDate:'2026-03-22', assignedTo:'Fatima Malik',  status:'Open'       },
  { _id:'dt004', defectId:'DEF-004', batchId:'BATCH-004', productName:'SoleCraft Runner Pro', stage:'Cutting',            defectType:'Material',   severity:'Minor',    reportedBy:'Ali Hassan',    reportedDate:'2026-03-22', assignedTo:'Ali Hassan',    status:'Resolved'   },
  { _id:'dt005', defectId:'DEF-005', batchId:'BATCH-003', productName:'Heritage Oxford',      stage:'Quality Inspection', defectType:'Color',      severity:'Minor',    reportedBy:'Tariq Mahmood', reportedDate:'2026-03-27', assignedTo:'Bilal Chaudhry',status:'Closed'     },
  { _id:'dt006', defectId:'DEF-006', batchId:'BATCH-006', productName:'Trail Blazer Hiker',   stage:'Assembly',           defectType:'Adhesive',   severity:'Major',    reportedBy:'Sara Ahmed',    reportedDate:'2026-03-23', assignedTo:'Usman Qureshi', status:'Open'       },
  { _id:'dt007', defectId:'DEF-007', batchId:'BATCH-001', productName:'Heritage Oxford',      stage:'Assembly',           defectType:'Structural', severity:'Critical', reportedBy:'Tariq Mahmood', reportedDate:'2026-03-24', assignedTo:'Usman Qureshi', status:'In Review'  },
];

// ─── MATERIAL CONSUMPTION LOGS ────────────────────────────────────────────────
export const materialConsumptionLogs = [
  { _id:'mc001', logId:'MCL-001', batchId:'BATCH-001', materialName:'Full Grain Leather', quantityUsed:320,  unit:'sq ft', unitCost:12.50, totalCost:4000,  wasteQty:15, wastePercent:4.7, operatorName:'Ali Hassan',   date:'2026-03-15' },
  { _id:'mc002', logId:'MCL-002', batchId:'BATCH-001', materialName:'Natural Rubber Sole',quantityUsed:80,   unit:'kg',    unitCost:6.20,  totalCost:496,   wasteQty:3,  wastePercent:3.8, operatorName:'Ali Hassan',   date:'2026-03-15' },
  { _id:'mc003', logId:'MCL-003', batchId:'BATCH-001', materialName:'EVA Foam Insole',    quantityUsed:200,  unit:'pair',  unitCost:2.30,  totalCost:460,   wasteQty:0,  wastePercent:0,   operatorName:'Ali Hassan',   date:'2026-03-15' },
  { _id:'mc004', logId:'MCL-004', batchId:'BATCH-002', materialName:'Full Grain Leather', quantityUsed:270,  unit:'sq ft', unitCost:12.50, totalCost:3375,  wasteQty:12, wastePercent:4.4, operatorName:'Hamza Raza',   date:'2026-03-18' },
  { _id:'mc005', logId:'MCL-005', batchId:'BATCH-004', materialName:'Synthetic PU Leather',quantityUsed:750, unit:'sq ft', unitCost:4.80,  totalCost:3600,  wasteQty:30, wastePercent:4.0, operatorName:'Ali Hassan',   date:'2026-03-22' },
  { _id:'mc006', logId:'MCL-006', batchId:'BATCH-004', materialName:'EVA Foam Insole',    quantityUsed:500,  unit:'pair',  unitCost:2.30,  totalCost:1150,  wasteQty:8,  wastePercent:1.6, operatorName:'Ali Hassan',   date:'2026-03-22' },
  { _id:'mc007', logId:'MCL-007', batchId:'BATCH-006', materialName:'Synthetic PU Leather',quantityUsed:480, unit:'sq ft', unitCost:4.80,  totalCost:2304,  wasteQty:20, wastePercent:4.2, operatorName:'Hamza Raza',   date:'2026-03-20' },
  { _id:'mc008', logId:'MCL-008', batchId:'BATCH-006', materialName:'Natural Rubber Sole',quantityUsed:120,  unit:'kg',    unitCost:6.20,  totalCost:744,   wasteQty:5,  wastePercent:4.2, operatorName:'Hamza Raza',   date:'2026-03-20' },
];

// ─── PRODUCTION TARGETS ───────────────────────────────────────────────────────
export const productionTargets = [
  { _id:'pt001', targetId:'TGT-001', period:'Daily',   deptName:'Cutting',         startDate:'2026-03-26', endDate:'2026-03-26', product:'All',                 targetQty:800,  actualQty:780,  achievement:97.5, status:'On Track'     },
  { _id:'pt002', targetId:'TGT-002', period:'Daily',   deptName:'Stitching',       startDate:'2026-03-26', endDate:'2026-03-26', product:'All',                 targetQty:600,  actualQty:540,  achievement:90.0, status:'Below Target' },
  { _id:'pt003', targetId:'TGT-003', period:'Weekly',  deptName:'Assembly',        startDate:'2026-03-24', endDate:'2026-03-28', product:'All',                 targetQty:2500, actualQty:1820, achievement:72.8, status:'Below Target' },
  { _id:'pt004', targetId:'TGT-004', period:'Monthly', deptName:'Cutting',         startDate:'2026-03-01', endDate:'2026-03-31', product:'Heritage Oxford',     targetQty:5000, actualQty:3800, achievement:76.0, status:'Below Target' },
  { _id:'pt005', targetId:'TGT-005', period:'Monthly', deptName:'Stitching',       startDate:'2026-03-01', endDate:'2026-03-31', product:'SoleCraft Runner Pro', targetQty:8000, actualQty:8500, achievement:106.3,status:'Exceeded'     },
  { _id:'pt006', targetId:'TGT-006', period:'Daily',   deptName:'Quality Control', startDate:'2026-03-26', endDate:'2026-03-26', product:'All',                 targetQty:300,  actualQty:305,  achievement:101.7,status:'Exceeded'     },
  { _id:'pt007', targetId:'TGT-007', period:'Weekly',  deptName:'Packaging',       startDate:'2026-03-24', endDate:'2026-03-28', product:'All',                 targetQty:1800, actualQty:1600, achievement:88.9, status:'On Track'     },
];

// ─── PRODUCTION EFFICIENCY METRICS ───────────────────────────────────────────
export const productionEfficiencyMetrics = [
  { _id:'pe001', metricId:'MET-001', date:'2026-03-26', deptName:'Cutting',         oee:88.5, availability:95, performance:91, quality:97, downtimeHours:0.8, plannedOutput:800, actualOutput:708, efficiency:88.5 },
  { _id:'pe002', metricId:'MET-002', date:'2026-03-26', deptName:'Stitching',       oee:76.2, availability:90, performance:83, quality:92, downtimeHours:2.4, plannedOutput:600, actualOutput:457, efficiency:76.2 },
  { _id:'pe003', metricId:'MET-003', date:'2026-03-26', deptName:'Assembly',        oee:82.1, availability:92, performance:88, quality:95, downtimeHours:1.5, plannedOutput:500, actualOutput:411, efficiency:82.1 },
  { _id:'pe004', metricId:'MET-004', date:'2026-03-25', deptName:'Cutting',         oee:91.0, availability:97, performance:93, quality:98, downtimeHours:0.5, plannedOutput:800, actualOutput:728, efficiency:91.0 },
  { _id:'pe005', metricId:'MET-005', date:'2026-03-25', deptName:'Stitching',       oee:79.8, availability:92, performance:86, quality:94, downtimeHours:1.9, plannedOutput:600, actualOutput:479, efficiency:79.8 },
  { _id:'pe006', metricId:'MET-006', date:'2026-03-25', deptName:'Assembly',        oee:85.4, availability:94, performance:90, quality:96, downtimeHours:1.2, plannedOutput:500, actualOutput:427, efficiency:85.4 },
  { _id:'pe007', metricId:'MET-007', date:'2026-03-24', deptName:'Quality Control', oee:96.5, availability:99, performance:97, quality:99, downtimeHours:0.2, plannedOutput:300, actualOutput:290, efficiency:96.5 },
];

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
export const clients = [
  { _id:'cl001', clientId:'CLT-001', companyName:'LuxRetail Pvt Ltd',   contactPerson:'Ahmed Shah',     email:'ahmed@luxretail.pk',    phone:'0213-1112222', country:'Pakistan', type:'Retail',    creditLimit:500000,  paymentTerms:'Net30', status:'Active',   joinDate:'2022-01-15' },
  { _id:'cl002', clientId:'CLT-002', companyName:'SportZone Exports',   contactPerson:'James Wilson',   email:'james@sportzone.com',   phone:'+1-212-5554444',country:'USA',      type:'Export',    creditLimit:1000000, paymentTerms:'Net60', status:'Active',   joinDate:'2021-06-01' },
  { _id:'cl003', clientId:'CLT-003', companyName:'FashionForward Co.',  contactPerson:'Priya Kapoor',   email:'priya@fashionfwd.in',   phone:'+91-11-3334444',country:'India',    type:'Wholesale', creditLimit:750000,  paymentTerms:'Net45', status:'Active',   joinDate:'2023-03-10' },
  { _id:'cl004', clientId:'CLT-004', companyName:'CasualWear Ltd.',     contactPerson:'Li Wei',         email:'li.wei@casualwear.cn',  phone:'+86-10-7778888',country:'China',    type:'Wholesale', creditLimit:600000,  paymentTerms:'Net30', status:'Active',   joinDate:'2022-09-20' },
  { _id:'cl005', clientId:'CLT-005', companyName:'ClassicShoes UK',     contactPerson:'Emma Clarke',    email:'emma@classicshoes.uk',  phone:'+44-20-1119999',country:'UK',       type:'Retail',    creditLimit:800000,  paymentTerms:'Net60', status:'Active',   joinDate:'2020-11-05' },
  { _id:'cl006', clientId:'CLT-006', companyName:'OutdoorGear Inc.',    contactPerson:'Mike Johnson',   email:'mike@outdoorgear.com',  phone:'+1-650-4447777',country:'USA',      type:'Export',    creditLimit:900000,  paymentTerms:'Net45', status:'Active',   joinDate:'2023-07-12' },
  { _id:'cl007', clientId:'CLT-007', companyName:'EliteFootwear EU',    contactPerson:'Sophie Müller',  email:'sophie@elitefootwear.eu',phone:'+49-30-2226666',country:'Germany',  type:'Export',    creditLimit:1200000, paymentTerms:'Net60', status:'Prospect', joinDate:'2026-01-20' },
];

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const orders = [
  { _id:'ord001', orderId:'ORD-2026-001', clientName:'LuxRetail Pvt Ltd',  productName:'Heritage Oxford',       quantity:200, unitPrice:3500,  totalValue:700000,  orderDate:'2026-03-01', requestedDate:'2026-04-10', status:'In Production' },
  { _id:'ord002', orderId:'ORD-2026-002', clientName:'SportZone Exports',  productName:'SoleCraft Runner Pro',  quantity:500, unitPrice:2200,  totalValue:1100000, orderDate:'2026-03-05', requestedDate:'2026-04-15', status:'Confirmed'     },
  { _id:'ord003', orderId:'ORD-2026-003', clientName:'FashionForward Co.', productName:'Artisan Chelsea Boot',  quantity:150, unitPrice:4200,  totalValue:630000,  orderDate:'2026-03-08', requestedDate:'2026-04-05', status:'In Production' },
  { _id:'ord004', orderId:'ORD-2026-004', clientName:'CasualWear Ltd.',    productName:'Urban Slip-On',         quantity:400, unitPrice:1500,  totalValue:600000,  orderDate:'2026-03-10', requestedDate:'2026-04-20', status:'Confirmed'     },
  { _id:'ord005', orderId:'ORD-2026-005', clientName:'ClassicShoes UK',    productName:'Heritage Oxford',       quantity:100, unitPrice:3500,  totalValue:350000,  orderDate:'2026-02-20', requestedDate:'2026-03-30', status:'Delivered'     },
  { _id:'ord006', orderId:'ORD-2026-006', clientName:'OutdoorGear Inc.',   productName:'Trail Blazer Hiker',    quantity:300, unitPrice:2600,  totalValue:780000,  orderDate:'2026-03-12', requestedDate:'2026-04-25', status:'In Production' },
  { _id:'ord007', orderId:'ORD-2026-007', clientName:'ClassicShoes UK',    productName:'Summer Sandal Classic', quantity:600, unitPrice:1100,  totalValue:660000,  orderDate:'2026-03-15', requestedDate:'2026-05-01', status:'Pending'       },
  { _id:'ord008', orderId:'ORD-2026-008', clientName:'EliteFootwear EU',   productName:'Brogue Wingtip Elite',  quantity:80,  unitPrice:3800,  totalValue:304000,  orderDate:'2026-03-18', requestedDate:'2026-04-28', status:'Pending'       },
];

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const invoices = [
  { _id:'inv001', invoiceId:'INV-2026-001', clientName:'ClassicShoes UK',   orderId:'ORD-2026-005', amount:350000,  tax:63000,  totalAmount:413000,  issueDate:'2026-03-29', dueDate:'2026-04-28', paidDate:'2026-03-30', status:'Paid'     },
  { _id:'inv002', invoiceId:'INV-2026-002', clientName:'LuxRetail Pvt Ltd', orderId:'ORD-2026-001', amount:700000,  tax:126000, totalAmount:826000,  issueDate:'2026-03-15', dueDate:'2026-04-14', paidDate:'',           status:'Sent'     },
  { _id:'inv003', invoiceId:'INV-2026-003', clientName:'FashionForward Co.',orderId:'ORD-2026-003', amount:630000,  tax:113400, totalAmount:743400,  issueDate:'2026-03-18', dueDate:'2026-04-02', paidDate:'',           status:'Overdue'  },
  { _id:'inv004', invoiceId:'INV-2026-004', clientName:'SportZone Exports', orderId:'ORD-2026-002', amount:1100000, tax:198000, totalAmount:1298000, issueDate:'2026-03-20', dueDate:'2026-05-19', paidDate:'',           status:'Sent'     },
  { _id:'inv005', invoiceId:'INV-2026-005', clientName:'CasualWear Ltd.',   orderId:'ORD-2026-004', amount:600000,  tax:108000, totalAmount:708000,  issueDate:'2026-03-22', dueDate:'2026-04-21', paidDate:'',           status:'Draft'    },
  { _id:'inv006', invoiceId:'INV-2026-006', clientName:'OutdoorGear Inc.',  orderId:'ORD-2026-006', amount:780000,  tax:140400, totalAmount:920400,  issueDate:'2026-03-24', dueDate:'2026-05-08', paidDate:'',           status:'Sent'     },
];

// ─── FINANCE RECORDS ─────────────────────────────────────────────────────────
export const financeRecords = [
  { _id:'fr001', recordId:'FIN-001', type:'Income',  category:'Product Sales',    amount:413000, date:'2026-03-30', description:'Payment for INV-2026-001',   reference:'INV-2026-001', approvedBy:'Nadia Hussain', status:'Approved' },
  { _id:'fr002', recordId:'FIN-002', type:'Expense', category:'Materials',        amount:6250,   date:'2026-03-15', description:'Leather purchase PO-2026-001', reference:'PO-2026-001',  approvedBy:'Nadia Hussain', status:'Approved' },
  { _id:'fr003', recordId:'FIN-003', type:'Expense', category:'Maintenance',      amount:15000,  date:'2026-03-25', description:'Emergency machine repair',      reference:'MNT-001',       approvedBy:'Nadia Hussain', status:'Approved' },
  { _id:'fr004', recordId:'FIN-004', type:'Expense', category:'Salaries',         amount:420000, date:'2026-02-28', description:'February payroll disbursement', reference:'SAL-FEB-2026',  approvedBy:'Nadia Hussain', status:'Approved' },
  { _id:'fr005', recordId:'FIN-005', type:'Expense', category:'Utilities',        amount:85000,  date:'2026-03-05', description:'Monthly electricity bill',       reference:'UTIL-MAR-01',   approvedBy:'Nadia Hussain', status:'Approved' },
  { _id:'fr006', recordId:'FIN-006', type:'Income',  category:'Product Sales',    amount:350000, date:'2026-03-29', description:'Export order payment - UK',      reference:'ORD-2026-005',  approvedBy:'Nadia Hussain', status:'Approved' },
  { _id:'fr007', recordId:'FIN-007', type:'Expense', category:'Transport',        amount:45000,  date:'2026-03-28', description:'Courier & shipping charges',     reference:'SHIP-MAR-26',   approvedBy:'Nadia Hussain', status:'Pending'  },
  { _id:'fr008', recordId:'FIN-008', type:'Expense', category:'Admin',            amount:30000,  date:'2026-03-20', description:'Office supplies & sundry',       reference:'ADM-MAR-20',    approvedBy:'Nadia Hussain', status:'Approved' },
];

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
export const expenses = [
  { _id:'ex001', expenseId:'EXP-001', category:'Utilities',    amount:85000,  date:'2026-03-05', description:'Monthly electricity bill',   paidBy:'Accounts',    approvedBy:'Nadia Hussain', status:'Paid'     },
  { _id:'ex002', expenseId:'EXP-002', category:'Maintenance',  amount:15000,  date:'2026-03-25', description:'Machine emergency repair',   paidBy:'Maintenance', approvedBy:'Nadia Hussain', status:'Paid'     },
  { _id:'ex003', expenseId:'EXP-003', category:'Transport',    amount:45000,  date:'2026-03-28', description:'Export shipping costs',      paidBy:'Logistics',   approvedBy:'Nadia Hussain', status:'Pending'  },
  { _id:'ex004', expenseId:'EXP-004', category:'Admin',        amount:30000,  date:'2026-03-20', description:'Office supplies & sundry',   paidBy:'Admin',       approvedBy:'Nadia Hussain', status:'Paid'     },
  { _id:'ex005', expenseId:'EXP-005', category:'Materials',    amount:6250,   date:'2026-03-15', description:'Leather procurement',        paidBy:'Procurement', approvedBy:'Nadia Hussain', status:'Paid'     },
  { _id:'ex006', expenseId:'EXP-006', category:'Salaries',     amount:420000, date:'2026-02-28', description:'February staff salaries',   paidBy:'HR',          approvedBy:'Nadia Hussain', status:'Paid'     },
  { _id:'ex007', expenseId:'EXP-007', category:'Utilities',    amount:22000,  date:'2026-03-10', description:'Gas & water charges',       paidBy:'Accounts',    approvedBy:'Nadia Hussain', status:'Paid'     },
  { _id:'ex008', expenseId:'EXP-008', category:'Maintenance',  amount:25000,  date:'2026-04-10', description:'Lasting machine overhaul',  paidBy:'Maintenance', approvedBy:'Pending',        status:'Pending'  },
];

// ─── REVENUES ─────────────────────────────────────────────────────────────────
export const revenues = [
  { _id:'rev001', revenueId:'REV-001', source:'Product Sales', clientName:'ClassicShoes UK',   amount:413000, date:'2026-03-30', invoiceId:'INV-2026-001', description:'Heritage Oxford export payment', status:'Confirmed' },
  { _id:'rev002', revenueId:'REV-002', source:'Product Sales', clientName:'LuxRetail Pvt Ltd', amount:700000, date:'2026-04-14', invoiceId:'INV-2026-002', description:'Partial advance received',      status:'Partial'   },
  { _id:'rev003', revenueId:'REV-003', source:'Export',        clientName:'SportZone Exports', amount:1100000,date:'2026-05-19', invoiceId:'INV-2026-004', description:'Runner Pro bulk export',        status:'Pending'   },
  { _id:'rev004', revenueId:'REV-004', source:'Product Sales', clientName:'OutdoorGear Inc.',  amount:780000, date:'2026-05-08', invoiceId:'INV-2026-006', description:'Hiker collection order',        status:'Pending'   },
  { _id:'rev005', revenueId:'REV-005', source:'Product Sales', clientName:'CasualWear Ltd.',   amount:600000, date:'2026-04-21', invoiceId:'INV-2026-005', description:'Urban Slip-On bulk order',      status:'Pending'   },
  { _id:'rev006', revenueId:'REV-006', source:'Export',        clientName:'FashionForward Co.',amount:630000, date:'2026-04-02', invoiceId:'INV-2026-003', description:'Chelsea Boot export – overdue', status:'Pending'   },
  { _id:'rev007', revenueId:'REV-007', source:'Licensing',     clientName:'EliteFootwear EU',  amount:50000,  date:'2026-03-15', invoiceId:'-',            description:'Brand licensing fee Q1 2026',  status:'Confirmed' },
];
