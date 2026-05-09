// ─── Schedule-N SOR Labour Items (from mindmap) ─────────────────
export const SCHEDULE_N = {
  'Cable Laying (Ch.25)': {
    chapter: 'Ch.25',
    color: '#3B82F6',
    items: [
      {
        code: 'CL-SUR', label: 'Survey',
        description: 'Preliminary route survey to identify the cable path, obstacles, soil conditions, and chainage markers before actual cable laying work begins.',
        measurements: [
          { key: 'length', label: 'Length', unit: 'KM', type: 'number' },
          { key: 'surveyType', label: 'Survey Type', unit: '', type: 'select', options: ['Foot Survey', 'Instrument Survey', 'GPS Survey'] },
          { key: 'certified', label: 'SSE Certified', unit: '', type: 'boolean' },
        ],
      },
      {
        code: 'CL-TR12', label: 'Trench 1200mm',
        description: 'Excavation of trench with 1200mm width for laying of quad/OFC cables in open area or alongside track. Includes shoring where required.',
        measurements: [
          { key: 'length', label: 'Length', unit: 'KM', type: 'number' },
          { key: 'width',  label: 'Width',  unit: 'mm', type: 'number', fixed: 1200 },
          { key: 'depth',  label: 'Depth',  unit: 'mm', type: 'number' },
          { key: 'soil',   label: 'Soil Type', unit: '', type: 'select', options: ['Ordinary', 'Hard', 'Rocky', 'Marshy'] },
        ],
      },
      {
        code: 'CL-TR6', label: 'Trench 600mm',
        description: 'Excavation of trench with 600mm width for smaller cable runs or where space is constrained. Standard depth as per S&T drawings.',
        measurements: [
          { key: 'length', label: 'Length', unit: 'KM', type: 'number' },
          { key: 'width',  label: 'Width',  unit: 'mm', type: 'number', fixed: 600 },
          { key: 'depth',  label: 'Depth',  unit: 'mm', type: 'number' },
          { key: 'soil',   label: 'Soil Type', unit: '', type: 'select', options: ['Ordinary', 'Hard', 'Rocky', 'Marshy'] },
        ],
      },
      {
        code: 'CL-TR3', label: 'Trench 300mm',
        description: 'Narrow trench of 300mm width for single cable or conduit runs, typically used inside station premises or relay rooms.',
        measurements: [
          { key: 'length', label: 'Length', unit: 'RMT', type: 'number' },
          { key: 'width',  label: 'Width',  unit: 'mm', type: 'number', fixed: 300 },
          { key: 'depth',  label: 'Depth',  unit: 'mm', type: 'number' },
          { key: 'soil',   label: 'Soil Type', unit: '', type: 'select', options: ['Ordinary', 'Hard', 'Rocky', 'Marshy'] },
        ],
      },
      {
        code: 'CL-TR30', label: 'Trench 30mm',
        description: 'Minimal trench of 30mm width for single conductor or thin pipe routing, usually for earthing strips or signal wires within concrete.',
        measurements: [
          { key: 'length', label: 'Length', unit: 'RMT', type: 'number' },
          { key: 'width',  label: 'Width',  unit: 'mm', type: 'number', fixed: 30 },
          { key: 'depth',  label: 'Depth',  unit: 'mm', type: 'number' },
        ],
      },
      {
        code: 'CL-BOR', label: 'Track/Road Boring',
        description: 'Horizontal boring under railway track or road without disturbing the surface. Used to pass cable ducts/pipes beneath tracks without possession.',
        measurements: [
          { key: 'length',    label: 'Length',      unit: 'RMT', type: 'number' },
          { key: 'diameter',  label: 'Diameter',    unit: 'mm',  type: 'number' },
          { key: 'boringType',label: 'Boring Type', unit: '',    type: 'select', options: ['Manual', 'Machine', 'Hydraulic'] },
          { key: 'trackPossession', label: 'Track Possession Taken', unit: '', type: 'boolean' },
        ],
      },
      {
        code: 'CL-TTR', label: 'Track Trenching',
        description: 'Trenching work done within the track formation area requiring block/possession. Involves additional safety measures and coordination with traffic.',
        measurements: [
          { key: 'length', label: 'Length', unit: 'RMT', type: 'number' },
          { key: 'depth',  label: 'Depth',  unit: 'mm',  type: 'number' },
          { key: 'trackPossession', label: 'Track Possession Taken', unit: '', type: 'boolean' },
        ],
      },
      {
        code: 'CL-RBR', label: 'Road Breaking',
        description: 'Breaking of existing road surface (BT/CC/WBM) for cable trench, including reinstatement to original condition after cable laying.',
        measurements: [
          { key: 'length',   label: 'Length',    unit: 'RMT', type: 'number' },
          { key: 'width',    label: 'Width',     unit: 'mm',  type: 'number' },
          { key: 'roadType', label: 'Road Type', unit: '',    type: 'select', options: ['Kutcha', 'WBM', 'BT', 'CC', 'Paved'] },
          { key: 'reinstated', label: 'Road Reinstated', unit: '', type: 'boolean' },
        ],
      },
      {
        code: 'CL-LAY', label: 'Cable Laying',
        description: 'Actual laying of signalling/telecom cable in prepared trench or duct. Includes uncoiling, pulling, and placing at correct depth with proper bends.',
        measurements: [
          { key: 'length',    label: 'Length',       unit: 'RMT', type: 'number' },
          { key: 'cableType', label: 'Cable Type',   unit: '',    type: 'multiselect', options: ['Quad', 'Optical Fibre', 'Power', 'Coaxial', 'Signalling'] },
          { key: 'coreCount', label: 'No. of Cores', unit: 'Nos', type: 'number' },
          { key: 'tagged',    label: 'Cable Tagged at Both Ends', unit: '', type: 'boolean' },
        ],
      },
      {
        code: 'CL-MEG1', label: 'Meggering (new)',
        description: 'Insulation resistance testing of newly laid cables using a megger instrument before termination. Ensures cable integrity before commissioning.',
        measurements: [
          { key: 'count',      label: 'No. of Cables', unit: 'Nos', type: 'number' },
          { key: 'length',     label: 'Length/Cable',  unit: 'RMT', type: 'number' },
          { key: 'resistance', label: 'Resistance',    unit: 'MΩ',  type: 'number' },
          { key: 'testVoltage',label: 'Test Voltage',  unit: '',    type: 'select', options: ['500V DC', '1000V DC', '2500V DC'] },
          { key: 'passed',     label: 'Test Passed',   unit: '',    type: 'boolean' },
        ],
      },
      {
        code: 'CL-MEG2', label: 'Meggering (term.)',
        description: 'Insulation resistance testing of already terminated cables to verify no damage during termination and confirm safe insulation levels.',
        measurements: [
          { key: 'count',      label: 'No. of Cables', unit: 'Nos', type: 'number' },
          { key: 'resistance', label: 'Resistance',    unit: 'MΩ',  type: 'number' },
          { key: 'testVoltage',label: 'Test Voltage',  unit: '',    type: 'select', options: ['500V DC', '1000V DC', '2500V DC'] },
          { key: 'passed',     label: 'Test Passed',   unit: '',    type: 'boolean' },
        ],
      },
      {
        code: 'CL-SAND', label: 'Sand Filling',
        description: 'Filling of clean river/pit sand around and above the cable in the trench to protect against mechanical damage before final backfilling with earth.',
        measurements: [
          { key: 'length',   label: 'Length',    unit: 'M',  type: 'number' },
          { key: 'width',    label: 'Width',     unit: 'M',  type: 'number' },
          { key: 'depth',    label: 'Depth',     unit: 'M',  type: 'number' },
          { key: 'sandType', label: 'Sand Type', unit: '',   type: 'select', options: ['River Sand', 'M-Sand', 'Pit Sand'] },
        ],
      },
      {
        code: 'CL-COIL', label: 'Coil Pit',
        description: 'Excavation and construction of pit at cable joints or crossing points to store extra cable coil (minimum 5m) for future maintenance use.',
        measurements: [
          { key: 'count',  label: 'No. of Pits', unit: 'Nos', type: 'number' },
          { key: 'length', label: 'Length',       unit: 'M',   type: 'number' },
          { key: 'width',  label: 'Width',        unit: 'M',   type: 'number' },
          { key: 'depth',  label: 'Depth',        unit: 'M',   type: 'number' },
          { key: 'covered',label: 'Cover Provided',unit: '',   type: 'boolean' },
        ],
      },
      {
        code: 'CL-DUCT', label: 'Cable Duct',
        description: 'Provision of protective duct (GI/PVC/HDPE) through which cables are threaded at road/track crossings or vulnerable locations.',
        measurements: [
          { key: 'count',    label: 'No. of Ducts', unit: 'Nos', type: 'number' },
          { key: 'size',     label: 'Size (dia)',    unit: 'mm',  type: 'number' },
          { key: 'material', label: 'Material',     unit: '',    type: 'select', options: ['GI', 'PVC', 'HDPE', 'RCC'] },
        ],
      },
      {
        code: 'CL-CVLL', label: 'Culvert (Low FL)',
        description: 'Cable support/protection structure at low formation level crossings such as drains, nullahs, or low-lying areas where direct burial is not possible.',
        measurements: [
          { key: 'length',      label: 'Length',          unit: 'RMT', type: 'number' },
          { key: 'span',        label: 'Span',            unit: 'M',   type: 'number' },
          { key: 'count',       label: 'No. of Supports', unit: 'Nos', type: 'number' },
          { key: 'culvertType', label: 'Culvert Type',    unit: '',    type: 'select', options: ['Box', 'Pipe', 'Arch', 'Slab'] },
        ],
      },
      {
        code: 'CL-CVLH', label: 'Culvert (High FL)',
        description: 'Cable support structure at high formation level crossings such as overbridges or elevated sections where cables need to be routed overhead.',
        measurements: [
          { key: 'count',  label: 'No. of Locations', unit: 'Nos', type: 'number' },
          { key: 'span',   label: 'Span',             unit: 'M',   type: 'number' },
          { key: 'height', label: 'Height',           unit: 'M',   type: 'number' },
        ],
      },
      {
        code: 'CL-RIND', label: 'Route Indicators',
        description: 'Concrete/PVC marker posts placed every 200m along cable route to indicate buried cable path for identification during future excavation work.',
        measurements: [
          { key: 'count', label: 'No. of Indicators', unit: 'Nos', type: 'number' },
          { key: 'type',  label: 'Indicator Type',    unit: '',    type: 'select', options: ['Chainage', 'Cable', 'Joint', 'Turn'] },
        ],
      },
      {
        code: 'CL-CHRL', label: 'Channel Ramps',
        description: 'MS/GI ramps provided at cable trough entry/exit points to guide cable smoothly without sharp bends that could damage insulation.',
        measurements: [
          { key: 'count',    label: 'No. of Ramps', unit: 'Nos', type: 'number' },
          { key: 'length',   label: 'Length',        unit: 'M',   type: 'number' },
          { key: 'material', label: 'Material',      unit: '',    type: 'select', options: ['MS', 'GI', 'Aluminium'] },
        ],
      },
      {
        code: 'CL-CONC', label: 'Concreting 1:3:6',
        description: 'Plain cement concrete (PCC) in 1:3:6 mix for cable trench bed, location box foundations, or protective slabs over cables in vulnerable areas.',
        measurements: [
          { key: 'length',  label: 'Length',       unit: 'M', type: 'number' },
          { key: 'breadth', label: 'Breadth',      unit: 'M', type: 'number' },
          { key: 'height',  label: 'Height/Depth', unit: 'M', type: 'number' },
          { key: 'cured',   label: 'Curing Done',  unit: '',  type: 'boolean' },
        ],
      },
      {
        code: 'CL-SHUT', label: 'Shuttering',
        description: 'Temporary timber/steel formwork erected to contain wet concrete during casting of foundations, slabs or cable trench walls.',
        measurements: [
          { key: 'length',   label: 'Length',              unit: 'M',  type: 'number' },
          { key: 'height',   label: 'Height',              unit: 'M',  type: 'number' },
          { key: 'material', label: 'Shuttering Material', unit: '',   type: 'select', options: ['Timber', 'Steel', 'Plywood'] },
        ],
      },
    ],
  },

  'Location Box (Ch.26)': {
    chapter: 'Ch.26',
    color: '#22C55E',
    items: [
      {
        code: 'LB-FDF', label: 'Foundation (Full)',
        description: 'Full-size concrete foundation for a standard location box. Provides stable base to support the box structure and prevent subsidence.',
        measurements: [
          { key: 'count',       label: 'No. of Foundations', unit: 'Nos', type: 'number' },
          { key: 'length',      label: 'Length',             unit: 'M',   type: 'number' },
          { key: 'width',       label: 'Width',              unit: 'M',   type: 'number' },
          { key: 'depth',       label: 'Depth',              unit: 'M',   type: 'number' },
          { key: 'concreteMix', label: 'Concrete Mix',       unit: '',    type: 'select', options: ['1:2:4', '1:3:6', '1:4:8', 'M20', 'M25'] },
          { key: 'cured',       label: 'Curing Done',        unit: '',    type: 'boolean' },
        ],
      },
      {
        code: 'LB-FDH', label: 'Foundation (Half)',
        description: 'Half-size concrete foundation for smaller location boxes or where space is limited. Used in congested station areas or restricted right-of-way.',
        measurements: [
          { key: 'count',       label: 'No. of Foundations', unit: 'Nos', type: 'number' },
          { key: 'length',      label: 'Length',             unit: 'M',   type: 'number' },
          { key: 'width',       label: 'Width',              unit: 'M',   type: 'number' },
          { key: 'depth',       label: 'Depth',              unit: 'M',   type: 'number' },
          { key: 'concreteMix', label: 'Concrete Mix',       unit: '',    type: 'select', options: ['1:2:4', '1:3:6', '1:4:8', 'M20', 'M25'] },
          { key: 'cured',       label: 'Curing Done',        unit: '',    type: 'boolean' },
        ],
      },
      { code: 'LB-PSI',  label: 'Power Supply Install',  description: 'Installation of power supply unit (IPS/charger/rectifier) inside location box to provide regulated DC supply for signalling equipment.', measurements: [{ key: 'count', label: 'No. of Units', unit: 'Nos', type: 'number' }, { key: 'psType', label: 'PS Type', unit: '', type: 'select', options: ['IPS', 'Charger', 'Rectifier', 'Solar'] }, { key: 'tested', label: 'Functional Test Done', unit: '', type: 'boolean' }] },
      { code: 'LB-TLMP', label: 'Test Lamp',             description: 'Provision of test lamp facility in location box to verify correct aspect lighting and circuit continuity without disturbing the main circuit.', measurements: [{ key: 'count', label: 'No. of Locations', unit: 'Nos', type: 'number' }, { key: 'tested', label: 'All Aspects Tested', unit: '', type: 'boolean' }] },
      { code: 'LB-TPF',  label: 'Teak Plank (Full)',     description: 'Full-size teak wood plank used as insulating cable support inside location box. Provides mechanical support and electrical isolation for cables.', measurements: [{ key: 'count', label: 'No. of Planks', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'thickness', label: 'Thickness', unit: 'mm', type: 'number' }, { key: 'grade', label: 'Teak Grade', unit: '', type: 'select', options: ['Grade A', 'Grade B', 'Grade C'] }] },
      { code: 'LB-TPH',  label: 'Teak Plank (Half)',     description: 'Half-size teak wood plank for smaller cable routing requirements inside location box. Used where only partial insulation support is needed.', measurements: [{ key: 'count', label: 'No. of Planks', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'thickness', label: 'Thickness', unit: 'mm', type: 'number' }, { key: 'grade', label: 'Teak Grade', unit: '', type: 'select', options: ['Grade A', 'Grade B', 'Grade C'] }] },
      { code: 'LB-TWC',  label: 'Teak Wood (custom)',    description: 'Custom-cut teak wood fabrication for special-size requirements not covered by standard full/half plank sizes. Measured and cut to specific dimensions.', measurements: [{ key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'height', label: 'Height', unit: 'M', type: 'number' }] },
      { code: 'LB-HWP',  label: 'Hardwood Plank',        description: 'Seasoned hardwood plank (Sal/Deodar/Shisham) used as structural support inside location box where teak is not specified. Provides equivalent insulation.', measurements: [{ key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'thickness', label: 'Thickness', unit: 'mm', type: 'number' }, { key: 'species', label: 'Wood Species', unit: '', type: 'select', options: ['Sal', 'Teak', 'Deodar', 'Shisham'] }] },
      { code: 'LB-CTRM', label: 'Cable Termination',     description: 'Termination of individual cable conductors onto terminal blocks/relay contacts using lugs, ferrules or compression connectors inside location box.', measurements: [{ key: 'conductors', label: 'No. of Conductors', unit: 'Nos', type: 'number' }, { key: 'cableSize', label: 'Cable Size', unit: 'sqmm', type: 'number' }, { key: 'termType', label: 'Termination Type', unit: '', type: 'select', options: ['Lug', 'Ferrule', 'Compression', 'Mechanical'] }, { key: 'insulated', label: 'Insulation Taped', unit: '', type: 'boolean' }] },
      { code: 'LB-RELY', label: 'Relay Wiring',          description: 'Internal wiring of relays inside location box as per approved wiring schedule. Includes looming, ferruling, and connecting to terminal blocks.', measurements: [{ key: 'count', label: 'No. of Relays', unit: 'Nos', type: 'number' }, { key: 'wireLength', label: 'Wire Length', unit: 'M', type: 'number' }, { key: 'relayType', label: 'Relay Type', unit: '', type: 'select', options: ['QN1', 'QNA1', 'BV', 'NVR', 'NVRI', 'BR', 'QL1'] }, { key: 'tested', label: 'Contact Test Done', unit: '', type: 'boolean' }] },
      { code: 'LB-TBFN', label: 'Tie Bar Fencing',       description: 'Protective fencing around location box using tie bars/angle iron to prevent accidental damage from track maintenance machinery or animals.', measurements: [{ key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'height', label: 'Height', unit: 'M', type: 'number' }, { key: 'painted', label: 'Painting Done', unit: '', type: 'boolean' }] },
      { code: 'LB-FPT',  label: 'Fencing Pit',           description: 'Excavation and concreting of pit/post hole for erection of fencing posts around location box.', measurements: [{ key: 'count', label: 'No. of Pits', unit: 'Nos', type: 'number' }, { key: 'depth', label: 'Depth', unit: 'M', type: 'number' }] },
      { code: 'LB-SFB',  label: 'Shifting Full Box',     description: 'Dismantling, shifting and re-erecting a full-size location box to a new position due to track realignment, electrification or other infrastructure works.', measurements: [{ key: 'count', label: 'No. of Boxes', unit: 'Nos', type: 'number' }, { key: 'distance', label: 'Shift Distance', unit: 'M', type: 'number' }, { key: 'reason', label: 'Reason for Shifting', unit: '', type: 'select', options: ['Obstruction', 'Realignment', 'Electrification', 'Other'] }] },
      { code: 'LB-SHB',  label: 'Shifting Half Box',     description: 'Dismantling, shifting and re-erecting a half-size location box. Similar to full box shifting but for smaller box configurations.', measurements: [{ key: 'count', label: 'No. of Boxes', unit: 'Nos', type: 'number' }, { key: 'distance', label: 'Shift Distance', unit: 'M', type: 'number' }, { key: 'reason', label: 'Reason for Shifting', unit: '', type: 'select', options: ['Obstruction', 'Realignment', 'Electrification', 'Other'] }] },
      { code: 'LB-PALT', label: 'Painting Altn.',        description: 'Alternating black and yellow painting of location box exterior as per Railway colour code for visibility and identification by trackmen.', measurements: [{ key: 'count', label: 'No. of Boxes', unit: 'Nos', type: 'number' }, { key: 'paintType', label: 'Paint Type', unit: '', type: 'select', options: ['Enamel', 'Bituminous', 'Zinc Chromate', 'Epoxy'] }, { key: 'coats', label: 'No. of Coats', unit: 'Nos', type: 'number' }] },
      { code: 'LB-CETH', label: 'Conv. Earthing',        description: 'Conventional plate/pipe earthing system for location box with earth electrode buried in ground. Earth resistance must be below 1 ohm as per Railway standards.', measurements: [{ key: 'count', label: 'No. of Pits', unit: 'Nos', type: 'number' }, { key: 'depth', label: 'Depth', unit: 'M', type: 'number' }, { key: 'resistance', label: 'Earth Resistance', unit: 'Ω', type: 'number' }, { key: 'passed', label: 'Resistance < 1Ω', unit: '', type: 'boolean' }] },
      { code: 'LB-RETH', label: 'Ring Earthing',         description: 'Ring-type earthing where a continuous conductor loop is buried around the location box perimeter for improved earthing performance and fault current distribution.', measurements: [{ key: 'count', label: 'No. of Rings', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Ring Length', unit: 'M', type: 'number' }, { key: 'resistance', label: 'Earth Resistance', unit: 'Ω', type: 'number' }, { key: 'passed', label: 'Resistance < 1Ω', unit: '', type: 'boolean' }] },
      { code: 'LB-RCCE', label: 'RCC Earth Cover',       description: 'Reinforced cement concrete cover slab provided over earthing pit to protect earth electrode connections from mechanical damage and unauthorised access.', measurements: [{ key: 'count', label: 'No. of Covers', unit: 'Nos', type: 'number' }] },
      { code: 'LB-CAET', label: 'Cable Armour Earth',    description: 'Earthing connection from cable armour/sheath to location box earth terminal to prevent hazardous voltages on cable armour due to induced currents.', measurements: [{ key: 'count', label: 'No. of Cables', unit: 'Nos', type: 'number' }, { key: 'resistance', label: 'Earth Resistance', unit: 'Ω', type: 'number' }] },
      { code: 'LB-MFET', label: 'Maint-Free Earth',      description: 'Maintenance-free earthing system using chemical compound-filled electrodes that maintain low earth resistance without periodic watering or maintenance.', measurements: [{ key: 'count', label: 'No. of Sets', unit: 'Nos', type: 'number' }, { key: 'resistance', label: 'Earth Resistance', unit: 'Ω', type: 'number' }, { key: 'passed', label: 'Resistance < 1Ω', unit: '', type: 'boolean' }] },
      { code: 'LB-MEBR', label: 'MEEB Routing',          description: 'Main Equipment Earth Bus (MEEB) conductor routing inside/outside location box connecting all equipment earth points to a common earth bus bar.', measurements: [{ key: 'length', label: 'Length', unit: 'RMT', type: 'number' }, { key: 'size', label: 'Conductor Size', unit: 'sqmm', type: 'number' }] },
      { code: 'LB-MSFT', label: 'MS Flat Connection',    description: 'Mild steel flat conductor used for bonding structural metalwork, cable armour, and equipment frames to the main earth bus inside the location box.', measurements: [{ key: 'length', label: 'Length', unit: 'RMT', type: 'number' }, { key: 'size', label: 'Flat Size (W×T)', unit: 'mm', type: 'text' }, { key: 'painted', label: 'Painting Done', unit: '', type: 'boolean' }] },
    ],
  },

  'Signal Items (Ch.28)': {
    chapter: 'Ch.28',
    color: '#EAB308',
    items: [
      { code: 'SI-CLSF', label: 'CLS Foundation',      description: 'Concrete foundation for colour light signal post. Drilled/cast to specified depth and diameter to withstand wind loads and signal head weight.', measurements: [{ key: 'count', label: 'No. of Foundations', unit: 'Nos', type: 'number' }, { key: 'depth', label: 'Depth', unit: 'M', type: 'number' }, { key: 'dia', label: 'Dia', unit: 'mm', type: 'number' }, { key: 'concreteMix', label: 'Concrete Mix', unit: '', type: 'select', options: ['1:2:4', '1:3:6', 'M20', 'M25'] }, { key: 'cured', label: 'Curing Done', unit: '', type: 'boolean' }] },
      { code: 'SI-SHSN', label: 'Shunt Signal',         description: 'Low-height signal used to authorise shunting movements within station limits. Indicates proceed/stop for shunting engines and movements not covered by main signals.', measurements: [{ key: 'count', label: 'No. of Signals', unit: 'Nos', type: 'number' }, { key: 'type', label: 'Signal Type', unit: '', type: 'select', options: ['Ground Shunt', 'Disc', 'Position Light'] }, { key: 'tested', label: 'Aspect Test Done', unit: '', type: 'boolean' }] },
      { code: 'SI-SCRP', label: 'Screen Provision',     description: 'Opaque screen/hood fitted behind or around signal head to improve visibility by preventing background light interference and improving contrast of signal aspects.', measurements: [{ key: 'count', label: 'No. of Screens', unit: 'Nos', type: 'number' }, { key: 'height', label: 'Height', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'material', label: 'Material', unit: '', type: 'select', options: ['GI Sheet', 'MS Sheet', 'Aluminium'] }] },
      { code: 'SI-CBOU', label: 'Cross Bar (OOU)',       description: 'Cross bar fitted on signal post to indicate that the signal is Out Of Use (OOU). Prevents drivers from taking conflicting signal aspects during maintenance.', measurements: [{ key: 'count', label: 'No. of Cross Bars', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length', unit: 'M', type: 'number' }] },
      { code: 'SI-FDNS', label: 'Fdn. Strengthening',   description: 'Strengthening of existing signal post foundation that has deteriorated, subsided, or is inadequate to bear new/heavier signal equipment.', measurements: [{ key: 'count', label: 'No. of Foundations', unit: 'Nos', type: 'number' }, { key: 'method', label: 'Strengthening Method', unit: '', type: 'select', options: ['Grouting', 'Jacketing', 'Underpinning'] }] },
    ],
  },

  'Point Machine (Ch.29)': {
    chapter: 'Ch.29',
    color: '#D946EF',
    items: [
      { code: 'PM-UPSC', label: 'Universal PM (PSC)',  description: 'Universal point machine for PSC sleeper track. Electrically operates and locks switch rails, providing detection of correct/incorrect positions. Standard stroke 140mm.', measurements: [{ key: 'count', label: 'No. of Machines', unit: 'Nos', type: 'number' }, { key: 'stroke', label: 'Stroke Length', unit: 'mm', type: 'number' }, { key: 'make', label: 'Make', unit: '', type: 'select', options: ['Siemens', 'Alstom', 'Clextral', 'BEIL', 'Escorts'] }, { key: 'detectionVerified', label: 'Detection Verified', unit: '', type: 'boolean' }] },
      { code: 'PM-HTPM', label: 'High Thrust PM',       description: 'High thrust point machine for heavy/stiff points, crossings, or diamond crossings requiring greater operating force than standard machines. Used for thick web switches.', measurements: [{ key: 'count', label: 'No. of Machines', unit: 'Nos', type: 'number' }, { key: 'stroke', label: 'Stroke Length', unit: 'mm', type: 'number' }, { key: 'thrust', label: 'Thrust Force', unit: 'kN', type: 'number' }, { key: 'make', label: 'Make', unit: '', type: 'select', options: ['Siemens', 'Alstom', 'BEIL'] }, { key: 'detectionVerified', label: 'Detection Verified', unit: '', type: 'boolean' }] },
    ],
  },

  'Track Circuit (Ch.30)': {
    chapter: 'Ch.30',
    color: '#F97316',
    items: [
      { code: 'TC-TLJB', label: 'TLJB Fixing',        description: 'Track Lead Junction Box fixing at rail foot for connecting track circuit feed/relay wires to the rail. Provides weatherproof termination point at rail level.', measurements: [{ key: 'count', label: 'No. of TLJBs', unit: 'Nos', type: 'number' }, { key: 'type', label: 'TLJB Type', unit: '', type: 'select', options: ['Single', 'Double', 'With Surge Protector'] }] },
      { code: 'TC-FREW', label: 'Feed/Relay Wiring',  description: 'Wiring from location box to TLJB for track circuit feed and relay ends. Includes setting feed voltage, checking relay pick-up and shunting sensitivity.', measurements: [{ key: 'count', label: 'No. of TCs', unit: 'Nos', type: 'number' }, { key: 'tcType', label: 'TC Type', unit: '', type: 'select', options: ['DC Track Circuit', 'AC Track Circuit', 'Audio Frequency TC', 'Jointless TC'] }, { key: 'feedVoltage', label: 'Feed Voltage', unit: 'V', type: 'number' }, { key: 'relayVoltage', label: 'Relay Voltage', unit: 'V', type: 'number' }, { key: 'shuntingVerified', label: 'Shunting Verified', unit: '', type: 'boolean' }] },
      { code: 'TC-GJPT', label: 'Glued Joint Paint',  description: 'Application of orange paint on glued insulated rail joints to make them visually identifiable for trackmen and avoid accidental drilling or cutting during P-Way work.', measurements: [{ key: 'count', label: 'No. of Joints', unit: 'Nos', type: 'number' }, { key: 'painted', label: 'Orange Paint Applied', unit: '', type: 'boolean' }] },
      { code: 'TC-BOND', label: 'Bond Wires',         description: 'Copper/steel bond wires connected across rail joints to provide electrical continuity for traction return current and track circuit operation at non-insulated joints.', measurements: [{ key: 'joints', label: 'No. of Joints', unit: 'Nos', type: 'number' }, { key: 'wireSize', label: 'Wire Size', unit: 'sqmm', type: 'number' }, { key: 'bondType', label: 'Bond Type', unit: '', type: 'select', options: ['Rail Bond', 'Cross Bond', 'Impedance Bond'] }] },
    ],
  },

  'Sighting Board (Ch.31)': {
    chapter: 'Ch.31',
    color: '#14B8A6',
    items: [
      { code: 'SB-COST', label: 'Calling On / Stop',   description: 'Sighting board erected at a fixed distance ahead of Calling On or Stop signal to give advance warning to loco pilots of an approaching signal at a location with restricted visibility.', measurements: [{ key: 'count', label: 'No. of Boards', unit: 'Nos', type: 'number' }, { key: 'distance', label: 'Sighting Distance', unit: 'M', type: 'number' }, { key: 'visibility', label: 'Visibility Adequate', unit: '', type: 'boolean' }] },
      { code: 'SB-BSLB', label: 'BSLB / SLB',          description: 'Banner Speed Limit Board (BSLB) or Speed Limit Board (SLB) provided in conjunction with signals to indicate prescribed speed restriction at that location.', measurements: [{ key: 'count', label: 'No. of Boards', unit: 'Nos', type: 'number' }, { key: 'distance', label: 'Sighting Distance', unit: 'M', type: 'number' }, { key: 'visibility', label: 'Visibility Adequate', unit: '', type: 'boolean' }] },
      { code: 'SB-ASBR', label: 'Auto Section Board',  description: 'Board erected at automatic block section boundary to indicate commencement of automatic block territory. Informs loco pilots of change in block working rules.', measurements: [{ key: 'count', label: 'No. of Boards', unit: 'Nos', type: 'number' }, { key: 'visibility', label: 'Visibility Adequate', unit: '', type: 'boolean' }] },
    ],
  },

  'Indoor Work (Ch.32)': {
    chapter: 'Ch.32',
    color: '#6366F1',
    items: [
      { code: 'IW-BLKI', label: 'Block Instrument',   description: 'Installation of block instrument (SGE/Tokenless/Double Wire) for section block working between adjacent stations to prevent collision by ensuring single train occupancy.', measurements: [{ key: 'count', label: 'No. of Instruments', unit: 'Nos', type: 'number' }, { key: 'type', label: 'Instrument Type', unit: '', type: 'select', options: ['SGE Block', 'Double Wire', 'Tokenless', 'Electronic'] }, { key: 'tested', label: 'Functional Test Done', unit: '', type: 'boolean' }] },
      { code: 'IW-KYBX', label: 'Key Box',            description: 'Electrical/mechanical key box for key transmission between stations in key token block working. Ensures physical key exchange for safe section working.', measurements: [{ key: 'count', label: 'No. of Key Boxes', unit: 'Nos', type: 'number' }, { key: 'type', label: 'Key Box Type', unit: '', type: 'select', options: ['Electrical Key Box', 'Mechanical Key Box'] }, { key: 'tested', label: 'Lock/Release Tested', unit: '', type: 'boolean' }] },
      { code: 'IW-PVCW', label: 'PVC Pipe Wiring',    description: 'Wiring of circuits through PVC/GI conduit pipes inside relay room. Provides mechanical protection to wires and enables organised cable management.', measurements: [{ key: 'length', label: 'Total Length', unit: 'M', type: 'number' }, { key: 'dia', label: 'Pipe Dia', unit: 'mm', type: 'number' }, { key: 'conduitType', label: 'Conduit Type', unit: '', type: 'select', options: ['Rigid PVC', 'Flexible PVC', 'GI Conduit'] }] },
      { code: 'IW-ALLR', label: 'Alum. Ladder',       description: 'Aluminium cable ladder/tray fixed along relay room walls/ceiling for routing and supporting multiple cable/wire bundles in an organised manner.', measurements: [{ key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'mm', type: 'number' }] },
      { code: 'IW-CTRK', label: 'CT/Relay Rack',      description: 'Control table or relay rack framework for mounting relays, modules, and equipment inside relay room. Provides structured mounting to enable systematic wiring.', measurements: [{ key: 'count', label: 'No. of Racks', unit: 'Nos', type: 'number' }, { key: 'height', label: 'Rack Height', unit: 'M', type: 'number' }, { key: 'rackType', label: 'Rack Type', unit: '', type: 'select', options: ['Open Rack', 'Closed Rack', 'Wall Mount'] }] },
      { code: 'IW-TRMB', label: 'Terminal Block',     description: 'Terminal blocks for inter-connecting wires between relay room internal wiring and external cable cores. Provides identifiable termination and isolation points.', measurements: [{ key: 'count', label: 'No. of Sets', unit: 'Nos', type: 'number' }, { key: 'terminals', label: 'No. of Terminals', unit: 'Nos', type: 'number' }, { key: 'type', label: 'Terminal Type', unit: '', type: 'select', options: ['Screw Type', 'Spring Clamp', 'DIN Rail'] }] },
      { code: 'IW-HYSH', label: 'Hylam Sheet Fix',    description: 'Hylam (phenolic laminate) sheet fixed on relay room floor/walls as insulating and fire-retardant surface below relay racks and cable entry points.', measurements: [{ key: 'area', label: 'Area', unit: 'Sqft', type: 'number' }, { key: 'thickness', label: 'Thickness', unit: 'mm', type: 'number' }] },
      { code: 'IW-FUSH', label: 'Fuse Holders',       description: 'Fuse holders fitted on distribution board for circuit protection. Each circuit is individually fused to limit fault current and enable safe isolation for maintenance.', measurements: [{ key: 'count', label: 'No. of Holders', unit: 'Nos', type: 'number' }, { key: 'rating', label: 'Rating', unit: 'A', type: 'number' }, { key: 'type', label: 'Fuse Type', unit: '', type: 'select', options: ['HRC', 'Rewirable', 'Cartridge', 'MCB'] }] },
      { code: 'IW-CTAN', label: 'Contact Analysis',   description: 'Testing and recording of relay contact conditions (pick-up, drop-away voltages, contact resistance) to verify relays meet specification before commissioning.', measurements: [{ key: 'count', label: 'No. of Relays', unit: 'Nos', type: 'number' }, { key: 'contacts', label: 'No. of Contacts', unit: 'Nos', type: 'number' }, { key: 'passed', label: 'All Contacts Within Limits', unit: '', type: 'boolean' }] },
      { code: 'IW-RLYW', label: 'Relay Room Wiring',  description: 'Complete internal wiring of relay room including inter-relay connections, external cable termination, and circuit connections as per approved wiring schedule.', measurements: [{ key: 'count', label: 'No. of Stations', unit: 'Nos', type: 'number' }, { key: 'wireLength', label: 'Total Wire Length', unit: 'M', type: 'number' }, { key: 'wireType', label: 'Wire Type', unit: '', type: 'select', options: ['0.5sqmm PVC', '1.0sqmm PVC', '1.5sqmm PVC', 'Screened'] }, { key: 'loomed', label: 'Wiring Loomed & Ferruled', unit: '', type: 'boolean' }] },
      { code: 'IW-INPT', label: 'Indoor Painting',    description: 'Painting of relay room interior walls, ceiling and floor with approved paint to improve cleanliness, light reflection, and provide visual inspection standard.', measurements: [{ key: 'count', label: 'No. of Stations', unit: 'Nos', type: 'number' }, { key: 'area', label: 'Area', unit: 'Sqm', type: 'number' }, { key: 'paintType', label: 'Paint Type', unit: '', type: 'select', options: ['Distemper', 'Emulsion', 'Oil Paint', 'Epoxy'] }, { key: 'coats', label: 'No. of Coats', unit: 'Nos', type: 'number' }] },
      { code: 'IW-DLOG', label: 'Data Logger',        description: 'Electronic data logger for recording and monitoring relay room parameters, circuit voltages, and event logs for fault analysis and maintenance planning.', measurements: [{ key: 'count', label: 'No. of Loggers', unit: 'Nos', type: 'number' }, { key: 'make', label: 'Make/Model', unit: '', type: 'text' }, { key: 'configured', label: 'Configured & Functional', unit: '', type: 'boolean' }] },
      { code: 'IW-PTRV', label: 'Point Rev. Alarm',   description: 'Alarm system that activates when point machine reverses without authorisation. Provides audible/visual alert to SM/cabin staff for immediate investigation.', measurements: [{ key: 'count', label: 'No. of Stations', unit: 'Nos', type: 'number' }, { key: 'tested', label: 'Alarm Tested', unit: '', type: 'boolean' }] },
      { code: 'IW-KYFB', label: 'Key Fabrication',    description: 'Fabrication/supply of special purpose keys for points, level crossings, trap points, or cabin locks as per Railway approved drawing and specifications.', measurements: [{ key: 'count', label: 'No. of Keys', unit: 'Nos', type: 'number' }, { key: 'keyType', label: 'Key Type', unit: '', type: 'select', options: ['Points Key', 'Level Crossing Key', 'Gate Key', 'Cabin Key'] }] },
      { code: 'IW-PASV', label: 'PA System',          description: 'Temporary public address system erected at construction site for safety announcements and communication with workmen during block/possession periods.', measurements: [{ key: 'tents', label: 'No. of Tents', unit: 'Nos', type: 'number' }, { key: 'days', label: 'No. of Days', unit: 'Days', type: 'number' }, { key: 'systemType', label: 'System Type', unit: '', type: 'select', options: ['Portable', 'Fixed', 'Wireless'] }] },
      { code: 'IW-LEDF', label: 'LED Fixing',         description: 'Fixing of LED indicators on control panel, relay rack, or signal heads. Provides energy-efficient status indication with longer service life than conventional bulbs.', measurements: [{ key: 'count', label: 'No. of LEDs', unit: 'Nos', type: 'number' }, { key: 'wattage', label: 'Wattage', unit: 'W', type: 'number' }, { key: 'colour', label: 'LED Colour', unit: '', type: 'select', options: ['Red', 'Green', 'Yellow', 'White', 'Blue'] }] },
      { code: 'IW-WMSH', label: 'Wire Mesh',          description: 'Wire mesh screen fixed on relay room windows, cable entry holes, or ventilation openings to prevent rodent/bird ingress while maintaining airflow.', measurements: [{ key: 'length', label: 'Length', unit: 'ft', type: 'number' }, { key: 'height', label: 'Height', unit: 'ft', type: 'number' }, { key: 'meshSize', label: 'Mesh Size', unit: '', type: 'select', options: ['1"×1"', '2"×2"', '3"×3"'] }] },
    ],
  },

  'Power Supply (Ch.34)': {
    chapter: 'Ch.34',
    color: '#EF4444',
    items: [
      { code: 'PS-IPSI', label: 'IPS Installation',   description: 'Installation of Integrated Power Supply (IPS) unit providing regulated 110V DC/24V DC for signalling equipment with battery backup for continued operation during power failure.', measurements: [{ key: 'count', label: 'No. of IPS Units', unit: 'Nos', type: 'number' }, { key: 'capacity', label: 'Capacity', unit: 'KVA', type: 'number' }, { key: 'batteryBackup', label: 'Battery Backup', unit: 'Hrs', type: 'number' }, { key: 'make', label: 'Make', unit: '', type: 'select', options: ['Numeric', 'APC', 'Emerson', 'Luminous', 'BEIL'] }, { key: 'tested', label: 'Load Test Done', unit: '', type: 'boolean' }] },
      { code: 'PS-ELDT', label: 'Earth Leakage Det.', description: 'Earth leakage detector unit that monitors insulation resistance of power supply circuits and triggers alarm when leakage current exceeds safe threshold, preventing electric shock hazard.', measurements: [{ key: 'count', label: 'No. of Detectors', unit: 'Nos', type: 'number' }, { key: 'sensitivity', label: 'Sensitivity', unit: 'mA', type: 'number' }, { key: 'tested', label: 'Alarm Test Done', unit: '', type: 'boolean' }] },
    ],
  },

  'Telecom Works (Ch.46)': {
    chapter: 'Ch.46',
    color: '#A855F7',
    items: [
      { code: 'TW-DTMF', label: 'DTMF Telephone',         description: 'Dual Tone Multi-Frequency telephone for railway staff communication along track section. Used by gatemen, trackmen, and station staff for operational coordination.', measurements: [{ key: 'count', label: 'No. of Phones', unit: 'Nos', type: 'number' }, { key: 'make', label: 'Make', unit: '', type: 'text' }, { key: 'tested', label: 'Call Test Done', unit: '', type: 'boolean' }] },
      { code: 'TW-CJST', label: 'Cable Joint (Straight)',  description: 'Straight cable joint connecting two cable ends in the same direction. Includes pair-by-pair jointing using heat shrink or gel-filled enclosure for moisture protection.', measurements: [{ key: 'count', label: 'No. of Joints', unit: 'Nos', type: 'number' }, { key: 'pairs', label: 'No. of Pairs', unit: 'Pairs', type: 'number' }, { key: 'jointType', label: 'Joint Type', unit: '', type: 'select', options: ['Straight', 'Y-Joint', 'T-Joint'] }, { key: 'sealed', label: 'Joint Sealed', unit: '', type: 'boolean' }] },
      { code: 'TW-CTBX', label: 'CT Box (12/10 pr)',       description: 'Cable termination box with capacity for 12 or 10 pairs, used for distributing main cable pairs to individual equipment locations within a station area.', measurements: [{ key: 'count', label: 'No. of Boxes', unit: 'Nos', type: 'number' }, { key: 'pairs', label: 'Pair Capacity', unit: 'Pairs', type: 'number' }] },
      { code: 'TW-KRTB', label: 'Krone Terminal Box',      description: 'High-density terminal block using Krone LSA-PLUS insulation displacement connectors for quick, reliable termination of multi-pair cables without stripping insulation.', measurements: [{ key: 'count', label: 'No. of Boxes', unit: 'Nos', type: 'number' }, { key: 'pairs', label: 'Pair Capacity', unit: 'Pairs', type: 'number' }] },
      { code: 'TW-CTRM', label: 'Cable Termination',       description: 'Termination of telecom cable at exchange/equipment end including pair identification, connection to terminal block, and continuity/cross-talk testing.', measurements: [{ key: 'cores', label: 'No. of Cores', unit: 'Nos', type: 'number' }, { key: 'termType', label: 'Termination Type', unit: '', type: 'select', options: ['Krone', 'Lug', 'Screw', 'IDC'] }] },
      { code: 'TW-4WYS', label: '4-Wire Way Station',      description: 'Installation of 4-wire circuit way station unit enabling voice communication on a shared party-line circuit along the track section for operational use.', measurements: [{ key: 'count', label: 'No. of Stations', unit: 'Nos', type: 'number' }, { key: 'tested', label: 'Communication Test Done', unit: '', type: 'boolean' }] },
      { code: 'TW-CTST', label: 'Cable Testing',           description: 'Electrical testing of telecom cable including loop resistance, insulation resistance, capacitance, and crosstalk measurements to verify cable quality before commissioning.', measurements: [{ key: 'count', label: 'No. of Cables', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length/Cable', unit: 'KM', type: 'number' }, { key: 'cores', label: 'No. of Cores', unit: 'Nos', type: 'number' }, { key: 'testType', label: 'Test Type', unit: '', type: 'multiselect', options: ['Loop Resistance', 'Insulation Resistance', 'Capacitance', 'Crosstalk'] }, { key: 'passed', label: 'Test Passed', unit: '', type: 'boolean' }] },
      { code: 'TW-ECSP', label: 'EC Socket Post',          description: 'Emergency Communication socket post erected along track for lineman/trackmen to plug in portable phones for direct communication with station/control room.', measurements: [{ key: 'count', label: 'No. of Posts', unit: 'Nos', type: 'number' }, { key: 'height', label: 'Height', unit: 'M', type: 'number' }, { key: 'tested', label: 'Communication Tested', unit: '', type: 'boolean' }] },
      { code: 'TW-ECPS', label: 'EC Post Strengthn.',      description: 'Structural strengthening of deteriorated/leaning EC socket posts by grouting, concreting around base, or bracing to restore stability and extend service life.', measurements: [{ key: 'count', label: 'No. of Posts', unit: 'Nos', type: 'number' }, { key: 'method', label: 'Method', unit: '', type: 'select', options: ['Grouting', 'Concreting', 'Bracing'] }] },
      { code: 'TW-ECPP', label: 'EC Post Painting',        description: 'Painting of EC socket posts with alternating colour bands for visibility and identification. Prevents corrosion and provides visibility to track maintenance staff.', measurements: [{ key: 'count', label: 'No. of Posts', unit: 'Nos', type: 'number' }, { key: 'height', label: 'Height', unit: 'M', type: 'number' }, { key: 'paintType', label: 'Paint Type', unit: '', type: 'select', options: ['Black & White', 'Red & White', 'Aluminium'] }] },
      { code: 'TW-HDPE', label: 'HDPE Duct Laying',        description: 'Laying of High Density Polyethylene duct for housing optical fibre cables. Provides mechanical protection and enables cable replacement without excavation using blowing technique.', measurements: [{ key: 'length', label: 'Length', unit: 'KM', type: 'number' }, { key: 'dia', label: 'Outer Dia', unit: 'mm', type: 'number' }, { key: 'pressureTested', label: 'Pressure Test Done', unit: '', type: 'boolean' }] },
      { code: 'TW-OFCB', label: 'OFC Blowing',             description: 'Air/water blowing of optical fibre cable through pre-laid HDPE ducts. Avoids mechanical stress on fibre compared to pulling, enabling longer blow lengths.', measurements: [{ key: 'length', label: 'Length', unit: 'KM', type: 'number' }, { key: 'fibres', label: 'No. of Fibres', unit: 'Nos', type: 'number' }, { key: 'cableType', label: 'Cable Type', unit: '', type: 'select', options: ['6F', '12F', '24F', '48F', '96F'] }] },
      { code: 'TW-RCCL', label: 'RCC Loop Chamber',        description: 'Reinforced concrete cable loop chamber at cable joints or route junctions. Provides access for splicing/jointing and stores cable loop for future maintenance.', measurements: [{ key: 'count', label: 'No. of Chambers', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'depth', label: 'Depth', unit: 'M', type: 'number' }] },
      { code: 'TW-OFCE', label: 'OFC Splice Encl.',        description: 'Fibre optic splice enclosure for housing and protecting optical fibre splices. Sealed against moisture and provides organised storage of splice trays and fibre loops.', measurements: [{ key: 'count', label: 'No. of Enclosures', unit: 'Nos', type: 'number' }, { key: 'splices', label: 'No. of Splices', unit: 'Nos', type: 'number' }, { key: 'avgLoss', label: 'Avg Splice Loss', unit: 'dB', type: 'number' }, { key: 'passed', label: 'Loss < 0.1dB', unit: '', type: 'boolean' }] },
      { code: 'TW-FDMS', label: 'FDMS (24F rack)',          description: 'Fibre Distribution Management System rack for terminating, patching, and managing 24-fibre OFC ends at equipment room. Enables flexible circuit routing and testing.', measurements: [{ key: 'count', label: 'No. of Racks', unit: 'Nos', type: 'number' }, { key: 'fibres', label: 'No. of Fibres', unit: 'Nos', type: 'number' }] },
      { code: 'TW-FBTS', label: 'Fibre Testing',           description: 'End-to-end testing of optical fibre links using OTDR/power meter. Measures splice loss, connector loss, and total optical link budget to verify specification compliance.', measurements: [{ key: 'fibres', label: 'No. of Fibres', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length/Fibre', unit: 'KM', type: 'number' }, { key: 'loss', label: 'Avg Splice Loss', unit: 'dB', type: 'number' }, { key: 'testMethod', label: 'Test Method', unit: '', type: 'select', options: ['OTDR', 'Power Meter', 'Light Source'] }, { key: 'passed', label: 'All Fibres Within Budget', unit: '', type: 'boolean' }] },
      { code: 'TW-PVCCH', label: 'PVC Channels',           description: 'PVC cable management channels/trunking fixed on relay room walls for routing and protecting inter-equipment wiring in an organised, accessible manner.', measurements: [{ key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'size', label: 'Size (W×H)', unit: 'mm', type: 'text' }] },
      { code: 'TW-STM4', label: 'STM-4 Equipment',         description: 'Synchronous Transport Module level-4 SDH multiplexer providing 622 Mbps transmission capacity for high-bandwidth telecom and data circuits on railway network.', measurements: [{ key: 'count', label: 'No. of Units', unit: 'Nos', type: 'number' }, { key: 'make', label: 'Make', unit: '', type: 'text' }, { key: 'commissioned', label: 'Commissioned', unit: '', type: 'boolean' }] },
      { code: 'TW-DMUX', label: 'Digital MUX',             description: 'Digital multiplexer for combining multiple voice/data channels onto a single transmission medium. Used for expanding communication capacity on existing cable infrastructure.', measurements: [{ key: 'count', label: 'No. of Units', unit: 'Nos', type: 'number' }, { key: 'channels', label: 'No. of Channels', unit: 'Nos', type: 'number' }, { key: 'make', label: 'Make', unit: '', type: 'text' }, { key: 'commissioned', label: 'Commissioned', unit: '', type: 'boolean' }] },
      { code: 'TW-CPDT', label: 'Cable Pit Digging',       description: 'Excavation of pits for cable jointing, route changes, or coil storage in telecom cable route. Dimensions as per drawing with RCC cover provision.', measurements: [{ key: 'count', label: 'No. of Pits', unit: 'Nos', type: 'number' }, { key: 'length', label: 'Length', unit: 'M', type: 'number' }, { key: 'width', label: 'Width', unit: 'M', type: 'number' }, { key: 'depth', label: 'Depth', unit: 'M', type: 'number' }] },
      { code: 'TW-ECSR', label: 'EC Socket Replace',       description: 'Replacement of defective/damaged EC socket with new socket of approved type. Includes removal of old socket, wiring connections and functional test.', measurements: [{ key: 'count', label: 'No. of Sockets', unit: 'Nos', type: 'number' }, { key: 'tested', label: 'Communication Tested', unit: '', type: 'boolean' }] },
      { code: 'TW-ECBR', label: 'EC Box Replace',          description: 'Replacement of complete EC socket box assembly including post-mounted box, socket, and associated wiring due to physical damage or deterioration beyond repair.', measurements: [{ key: 'count', label: 'No. of Boxes', unit: 'Nos', type: 'number' }] },
      { code: 'TW-FAUR', label: 'Fault Restoration',       description: 'Restoration of interrupted telecom circuit due to cable fault including fault localisation, excavation, cable jointing/replacement, and post-restoration testing.', measurements: [{ key: 'count', label: 'No. of Locations', unit: 'Nos', type: 'number' }, { key: 'cableLength', label: 'Cable Replaced', unit: 'M', type: 'number' }, { key: 'faultCause', label: 'Fault Cause', unit: '', type: 'multiselect', options: ['Rodent Cut', 'Mechanical Damage', 'Water Ingress', 'Ageing', 'Third Party Damage'] }, { key: 'tested', label: 'Post-Restoration Test Done', unit: '', type: 'boolean' }] },
      { code: 'TW-MCBF', label: 'Main Cable Fault',        description: 'Fault on main multi-pair cable affecting multiple circuits simultaneously. Includes TDR fault location, excavation at fault point, cable section replacement, and pair-by-pair restoration.', measurements: [{ key: 'count', label: 'No. of Locations', unit: 'Nos', type: 'number' }, { key: 'faultDist', label: 'Fault Distance from Exchange', unit: 'KM', type: 'number' }, { key: 'faultCause', label: 'Fault Cause', unit: '', type: 'multiselect', options: ['Rodent Cut', 'Dig Up', 'Water Ingress', 'Mechanical Damage'] }, { key: 'tested', label: 'Post-Restoration Test Done', unit: '', type: 'boolean' }] },
      { code: 'TW-PRTG', label: 'Periodical Testing',      description: 'Scheduled periodic testing of telecom circuits as per maintenance schedule to verify circuit parameters are within limits and detect developing faults before failure.', measurements: [{ key: 'sections', label: 'No. of Block Sections', unit: 'Nos', type: 'number' }, { key: 'testType', label: 'Test Type', unit: '', type: 'select', options: ['Monthly', 'Quarterly', 'Half Yearly', 'Annual'] }, { key: 'passed', label: 'All Tests Passed', unit: '', type: 'boolean' }] },
      { code: 'TW-LTTW', label: 'Lattice Tower',           description: 'Steel lattice communication tower for mounting microwave dishes, antennas, or repeater equipment. Designed for wind/seismic loads with earthing provision.', measurements: [{ key: 'count', label: 'No. of Towers', unit: 'Nos', type: 'number' }, { key: 'height', label: 'Height', unit: 'M', type: 'number' }, { key: 'towerType', label: 'Tower Type', unit: '', type: 'select', options: ['Self Supporting', 'Guyed', 'Monopole'] }, { key: 'earthed', label: 'Earthing Done', unit: '', type: 'boolean' }] },
      { code: 'TW-NIRK', label: 'NI Rack Wiring',          description: 'Wiring of Network Interface (NI) equipment rack including cross-connection between transmission equipment, PCM ports, and distribution frames as per circuit plan.', measurements: [{ key: 'count', label: 'No. of Stations', unit: 'Nos', type: 'number' }, { key: 'loomed', label: 'Wiring Loomed & Labelled', unit: '', type: 'boolean' }] },
    ],
  },
};
export const CHAPTERS_N=[
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
            "fixedText":"viss",
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
// ─── SEM Parameters per category ────────────────────────────────
export const SEM_PARAMS = {
  'Cable Laying (Ch.25)': [
    { id: 'cl-s1', label: 'Route survey completed & certified by SSE/S' },
    { id: 'cl-s2', label: 'Trench width & depth as per approved drawing' },
    { id: 'cl-s3', label: 'Sand bedding min 75mm below cable confirmed' },
    { id: 'cl-s4', label: 'Cable route markers placed every 200m' },
    { id: 'cl-s5', label: 'Meggering value > 50 MΩ (500V DC)' },
    { id: 'cl-s6', label: 'Trench backfilling & compaction as per spec' },
    { id: 'cl-s7', label: 'Road/track reinstated to original condition' },
    { id: 'cl-s8', label: 'Cable identification tags fixed at both ends' },
  ],
  'Location Box (Ch.26)': [
    { id: 'lb-s1', label: 'Foundation dimensions match approved drawing' },
    { id: 'lb-s2', label: 'Earthing resistance < 1 Ω verified' },
    { id: 'lb-s3', label: 'Cable termination insulation resistance checked' },
    { id: 'lb-s4', label: 'Relay wiring matches wiring schedule' },
    { id: 'lb-s5', label: 'Fencing pit depth & size as per spec' },
    { id: 'lb-s6', label: 'Painting with approved paint — two coats' },
  ],
  'Signal Items (Ch.28)': [
    { id: 'si-s1', label: 'Foundation depth & concrete mix as per spec' },
    { id: 'si-s2', label: 'Signal sighting distance meets visibility criteria' },
    { id: 'si-s3', label: 'Aspect colours verified by light meter' },
    { id: 'si-s4', label: 'Electrical connections torqued to spec' },
  ],
  'Point Machine (Ch.29)': [
    { id: 'pm-s1', label: 'Stroke length verified (140mm / 220mm)' },
    { id: 'pm-s2', label: 'Detection clearance: 3.5mm blade gap confirmed' },
    { id: 'pm-s3', label: 'Operating force within prescribed limits' },
    { id: 'pm-s4', label: 'Locking strength tested per S&T manual' },
  ],
  'Track Circuit (Ch.30)': [
    { id: 'tc-s1', label: 'Track circuit shunting sensitivity < 0.5 Ω' },
    { id: 'tc-s2', label: 'Feed end voltage within prescribed range' },
    { id: 'tc-s3', label: 'Relay end pick-up voltage verified' },
    { id: 'tc-s4', label: 'Insulated joints glued & painted orange' },
  ],
  'Indoor Work (Ch.32)': [
    { id: 'iw-s1', label: 'Relay contacts cleaned & contact resistance < 0.1 Ω' },
    { id: 'iw-s2', label: 'All wiring loomed, ferruled & numbered' },
    { id: 'iw-s3', label: 'Data logger functional & configured' },
    { id: 'iw-s4', label: 'Power supply voltage within ±10% of nominal' },
    { id: 'iw-s5', label: 'Earth leakage < 10 mA on all circuits' },
  ],
  'Power Supply (Ch.34)': [
    { id: 'ps-s1', label: 'IPS output voltage & frequency within spec' },
    { id: 'ps-s2', label: 'Battery backup tested for minimum 8 hrs' },
    { id: 'ps-s3', label: 'Earth leakage detector alarm verified' },
  ],
  'Telecom Works (Ch.46)': [
    { id: 'tw-s1', label: 'Optical power budget within engineering spec' },
    { id: 'tw-s2', label: 'OFC splice loss < 0.1 dB per splice' },
    { id: 'tw-s3', label: 'HDPE duct pressure tested at 1.5 bar / 30 min' },
    { id: 'tw-s4', label: 'Cable testing report signed by supervisor' },
    { id: 'tw-s5', label: 'All joints sealed & enclosures closed' },
  ],
};

// ─── Entry status display ────────────────────────────────────────
export const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', color: '#94A3B8', bg: 'rgba(148,163,184,.1)' },
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
    photos: [], semChecklist: [], adminRemark: '', returnReason: '',
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
    photos: [], semChecklist: [], adminRemark: 'Good work, all parameters verified.', returnReason: '',
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
    photos: [], semChecklist: [], adminRemark: 'Photographs not GPS-tagged. Wiring schedule mismatch at rack R-3. Resubmit.', returnReason: '',
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
