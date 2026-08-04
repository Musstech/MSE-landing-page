import React, { useState, useCallback } from 'react'

// ── Brand Colors ────────────────────────────────────────────────
const C = {
  navy: '#1A2E4A', blue: '#2C5282', gold: '#F5A623',
  orange: '#E8722A', green: '#276749',
  navyLight: '#EEF2F7', goldLight: '#FFFBF0', greenLight: '#F0FFF4',
  redLight: '#FFF5F5', red: '#C53030',
}

// ── Utility ─────────────────────────────────────────────────────
const fmt = n => Math.round(n).toLocaleString()
const fmtDec = (n,d=1) => Number(n).toFixed(d)
const STANDARD_BREAKERS = [6,10,16,20,25,32,40,50,63,80,100,125,175,200]
const nextBreaker = a => STANDARD_BREAKERS.find(s => s >= a) || Math.ceil(a)
const PSH=5, EFF=0.75, MARGIN=1.25, FACTOR=PSH*EFF

// ── Solar Formulas (from Calculate It Right) ────────────────────
const DUTY = { fridge:0.5, freezer:0.4, default:1 }
const SURGE = { fridge:3, freezer:2.5, ac:4, pump:4, fan:2.5, default:1.5 }
const DOD = { lithium:0.80, leadAcid:0.50, agm:0.60 }
const HP_MAP = { '0.5HP':400,'1HP':750,'1.5HP':1100,'2HP':1500,'3HP':2200 }

// ── Appliance Database ──────────────────────────────────────────
const APPLIANCES = [
  {id:'led',name:'LED Bulb',w:15,cat:'Lighting',duty:'default',surge:'default'},
  {id:'led-flood',name:'LED Floodlight',w:50,cat:'Lighting',duty:'default',surge:'default'},
  {id:'ceiling-fan',name:'Ceiling Fan',w:75,cat:'Fans',duty:'default',surge:'fan'},
  {id:'stand-fan',name:'Standing Fan',w:60,cat:'Fans',duty:'default',surge:'fan'},
  {id:'tv-32',name:'LED TV 32"',w:80,cat:'Entertainment',duty:'default',surge:'default'},
  {id:'tv-42',name:'LED TV 42"',w:120,cat:'Entertainment',duty:'default',surge:'default'},
  {id:'tv-55',name:'LED TV 55"',w:150,cat:'Entertainment',duty:'default',surge:'default'},
  {id:'dstv',name:'DSTV Decoder',w:25,cat:'Entertainment',duty:'default',surge:'default'},
  {id:'fridge',name:'Refrigerator',w:200,cat:'Kitchen',duty:'fridge',surge:'fridge'},
  {id:'freezer',name:'Deep Freezer',w:200,cat:'Kitchen',duty:'freezer',surge:'freezer'},
  {id:'microwave',name:'Microwave Oven',w:1200,cat:'Kitchen',duty:'default',surge:'default'},
  {id:'blender',name:'Blender',w:400,cat:'Kitchen',duty:'default',surge:'default'},
  {id:'kettle',name:'Electric Kettle',w:1500,cat:'Kitchen',duty:'default',surge:'default'},
  {id:'ac-1hp',name:'AC 1HP',w:750,cat:'Cooling',duty:'default',surge:'ac'},
  {id:'ac-1.5hp',name:'AC 1.5HP',w:1100,cat:'Cooling',duty:'default',surge:'ac'},
  {id:'ac-2hp',name:'AC 2HP',w:1500,cat:'Cooling',duty:'default',surge:'ac'},
  {id:'laptop',name:'Laptop',w:65,cat:'Office',duty:'default',surge:'default'},
  {id:'desktop',name:'Desktop Computer',w:150,cat:'Office',duty:'default',surge:'default'},
  {id:'printer',name:'Laser Printer',w:400,cat:'Office',duty:'default',surge:'default'},
  {id:'router',name:'Internet Router',w:20,cat:'Office',duty:'default',surge:'default'},
  {id:'phone',name:'Phone Charger',w:10,cat:'Office',duty:'default',surge:'default'},
  {id:'washing',name:'Washing Machine',w:1000,cat:'Appliances',duty:'default',surge:'default'},
  {id:'pump-1hp',name:'Water Pump 1HP',w:750,cat:'Appliances',duty:'default',surge:'pump'},
  {id:'pump-0.5hp',name:'Water Pump 0.5HP',w:400,cat:'Appliances',duty:'default',surge:'pump'},
  {id:'dispenser',name:'Water Dispenser',w:500,cat:'Appliances',duty:'default',surge:'default'},
  {id:'cctv',name:'CCTV System',w:60,cat:'Security',duty:'default',surge:'default'},
  {id:'security-light',name:'Security Light',w:100,cat:'Security',duty:'default',surge:'default'},
  {id:'iron',name:'Electric Iron',w:1000,cat:'Appliances',duty:'default',surge:'default'},
]

// ── Fault Codes Database ────────────────────────────────────────
const FAULT_DB = {
  Deye:[
    {code:'F01',name:'PV Over Voltage',sev:'critical',cause:'String Voc exceeds MPPT max',fix:'Disconnect PV. Measure string Voc. Reduce panels in series.'},
    {code:'F02',name:'PV Under Voltage',sev:'warning',cause:'String Voc below MPPT minimum',fix:'Check MC4 connections. Measure each panel Voc. Check for shading.'},
    {code:'F03',name:'Battery Over Voltage',sev:'critical',cause:'Battery above max charge voltage',fix:'Check Setting 13 vs battery datasheet. Lower bulk charge voltage.'},
    {code:'F04',name:'Battery Under Voltage',sev:'warning',cause:'Battery below minimum cutoff',fix:'Charge battery. Verify Setting 12 matches battery spec.'},
    {code:'F05',name:'Overload',sev:'critical',cause:'Load exceeds inverter rating',fix:'Shed loads. Check motor surge. Stagger appliance startups.'},
    {code:'F06',name:'Overtemperature',sev:'warning',cause:'Inverter internal temperature too high',fix:'Check 200mm clearance all sides. Clean air vents. Reduce load.'},
    {code:'F07',name:'BMS Comms Lost',sev:'warning',cause:'CAN/RS485 cable or protocol issue',fix:'Check cable both ends. Verify Setting 05. Replace cable if needed.'},
    {code:'F08',name:'Grid Fault',sev:'info',cause:'Grid voltage/frequency out of range',fix:'Inverter auto-reconnects when grid normalises.'},
    {code:'F09',name:'Fan Fault',sev:'critical',cause:'Cooling fan not operating',fix:'Do not run at high load. Contact Deye service centre.'},
    {code:'F10',name:'Parallel Fault',sev:'warning',cause:'Slave inverter not responding',fix:'Check parallel cable. Verify slave Setting 28. Power cycle master first.'},
  ],
  Growatt:[
    {code:'E01',name:'Over Voltage',sev:'critical',cause:'PV or AC voltage too high',fix:'Measure string Voc. Check AC output voltage setting.'},
    {code:'E02',name:'Under Voltage',sev:'warning',cause:'AC output voltage too low',fix:'Check battery voltage under load. Check output setting.'},
    {code:'E03',name:'Over Current',sev:'critical',cause:'Output current exceeds rating',fix:'Reduce loads. Check for short circuit.'},
    {code:'E04',name:'Overload',sev:'critical',cause:'Load exceeds inverter rating',fix:'Shed loads. Check motor surge. Stagger startups.'},
    {code:'E05',name:'Overtemperature',sev:'warning',cause:'Insufficient cooling',fix:'Check 200mm clearance. Clean vents. Reduce ambient temp.'},
    {code:'E06',name:'Battery Fault',sev:'warning',cause:'Battery voltage abnormal or BMS fault',fix:'Check battery connections. Verify Parameter 05 (battery type).'},
    {code:'E07',name:'PV Isolation Fault',sev:'critical',cause:'Ground fault in PV circuit',fix:'Insulation test all PV cables. Check cable routing for damage.'},
    {code:'E08',name:'Comms Fault',sev:'warning',cause:'RS485/CAN communication lost',fix:'Check cable. Verify Parameter 05. Check Modbus address = 1.'},
    {code:'E09',name:'Grid Fault',sev:'info',cause:'Grid out of specification',fix:'Auto-reconnects when grid normalises.'},
  ],
  SRNE:[
    {code:'F01',name:'Over Voltage',sev:'critical',cause:'PV or AC overvoltage',fix:'Measure string Voc. Reduce panels in series.'},
    {code:'F02',name:'Under Voltage',sev:'warning',cause:'Battery or AC below minimum',fix:'Check battery state. Verify Menu 29 setting.'},
    {code:'F03',name:'Over Current/Overload',sev:'critical',cause:'Load current too high',fix:'Reduce loads. Check motor surge on AC/pump.'},
    {code:'F04',name:'Overtemperature',sev:'warning',cause:'Poor ventilation',fix:'200mm clearance minimum. Clean vents.'},
    {code:'F05',name:'Battery Low',sev:'warning',cause:'Battery at minimum SOC',fix:'Charge from solar or generator immediately.'},
    {code:'F06',name:'BMS Comms Lost',sev:'warning',cause:'CAN/RS485 issue',fix:'Check cable both ends. Verify Menu 02 protocol.'},
    {code:'F07',name:'Grid Frequency Fault',sev:'info',cause:'Grid frequency out of range',fix:'Self-clears when grid normalises.'},
    {code:'F08',name:'Fan Fault',sev:'critical',cause:'Cooling fan failure',fix:'Contact SRNE service centre.'},
  ],
  Voltronic:[
    {code:'01',name:'Fan Locked',sev:'warning',cause:'Cooling fan locked or blocked',fix:'Clean fan. Check for obstruction. Replace if needed.'},
    {code:'02',name:'Over Voltage',sev:'critical',cause:'PV or battery voltage too high',fix:'Check string Voc. Verify charge voltage setting.'},
    {code:'04',name:'Short Circuit',sev:'critical',cause:'Short in load circuit',fix:'Disconnect all loads. Reconnect one by one to find fault.'},
    {code:'07',name:'Battery Open Circuit',sev:'critical',cause:'No battery connection',fix:'Check battery terminals. Check ANL fuse.'},
    {code:'08',name:'Bus Soft Start Fail',sev:'warning',cause:'DC bus startup failure',fix:'Power cycle. Disconnect all, wait 5 min, reconnect battery first.'},
    {code:'51',name:'Over Current AC',sev:'critical',cause:'AC output overloaded',fix:'Reduce loads. Check motor surge exceeds inverter surge rating.'},
    {code:'52',name:'Bus Voltage Low',sev:'warning',cause:'Internal DC bus too low',fix:'Check battery voltage above minimum system voltage.'},
  ],
  Victron:[
    {code:'LOW BATTERY',name:'Low Battery Shutdown',sev:'warning',cause:'Battery below ESS minimum SOC',fix:'Charge battery. Check solar is active. Review ESS minimum SOC setting.'},
    {code:'OVERLOAD',name:'Overload',sev:'critical',cause:'Load exceeds MultiPlus rating',fix:'Reduce loads. Check PowerAssist settings.'},
    {code:'HIGH TEMP',name:'High Temperature',sev:'warning',cause:'Overtemperature protection',fix:'Check clearances. Clean vents. Reduce load.'},
    {code:'BMS CTRL',name:'BMS Controlled',sev:'info',cause:'BMS limiting charge/discharge',fix:'Normal BMS operation. Check SOC and battery temp.'},
    {code:'NO VE.BUS',name:'VE.Bus Lost',sev:'critical',cause:'Cerbo GX lost MultiPlus comms',fix:'Check VE.Bus cable. Try different port. Restart Cerbo GX.'},
    {code:'GRID LOST',name:'Grid Lost',sev:'info',cause:'Grid out of specification',fix:'Auto-reconnects when grid returns to specification.'},
  ],
  Felicity:[
    {code:'P01',name:'PV Over Voltage',sev:'critical',cause:'String Voc too high',fix:'Reduce panels in series. Calculate cold Voc.'},
    {code:'P04',name:'Overload',sev:'critical',cause:'Load exceeds inverter capacity',fix:'Shed loads. Check motor surge.'},
    {code:'P06',name:'Battery Low',sev:'warning',cause:'Battery at cutoff voltage',fix:'Charge from solar or generator immediately.'},
    {code:'P10',name:'BMS Comms Lost',sev:'warning',cause:'Felicity CAN cable issue',fix:'Check Felicity CAN cable (not generic RJ45). Replace if needed.'},
    {code:'P12',name:'Fan Fault',sev:'critical',cause:'Cooling fan failure',fix:'Contact Felicity service centre.'},
    {code:'P15',name:'Overtemperature',sev:'warning',cause:'Poor ventilation',fix:'Check 200mm clearance. Clean vents. Reduce load.'},
  ],
}

const SYMPTOMS = [
  {id:'no-output',label:'No AC output from inverter',steps:['Check AC output breaker at distribution board — reset if tripped','Check inverter display for fault codes and record them','Measure battery voltage at inverter terminals — must be above 44V (48V system)','Verify working mode allows battery discharge','Check main DC breaker and ANL fuse between battery and inverter']},
  {id:'not-charging',label:'Battery not charging from solar',steps:['Check PV breaker/isolator is switched on','Measure panel string Voc at inverter input — must be within MPPT range','Check inverter display for MPPT tracking (positive charging current)','Verify working mode is solar priority (SEL/SBU/Self-Use)','Check max charge current setting has not been limited to low value']},
  {id:'drains-fast',label:'Battery drains faster than expected',steps:['Measure actual nighttime load with clamp meter vs design load','Check if new appliances added since installation','Verify battery capacity setting in inverter = total bank Ah (not single unit)','Perform battery capacity test if battery is more than 2 years old','Verify battery type and DoD setting is correct']},
  {id:'overload',label:'Inverter keeps tripping on overload',steps:['Calculate total load vs inverter continuous rating','Identify which appliance causes the trip — usually motor starting','Measure motor starting surge with clamp meter when appliance starts','Stagger appliance startups — never start AC and fridge simultaneously','Check inverter surge rating in datasheet vs motor starting demand']},
  {id:'low-solar',label:'Solar output lower than expected',steps:['Check panel surface — clean if dusty (reduces output 5 to 15%)','Verify no new shading from trees or buildings since installation','Measure Voc of each string separately and compare','Check MPPT display shows tracking voltage (not open circuit Voc)','Confirm panel orientation and tilt angle unchanged']},
  {id:'bms-fault',label:'BMS communication fault',steps:['Check CAN/RS485 cable fully seated at both inverter and battery','Pull-test cable — should not pull out without pressing tab','Verify battery type setting in inverter matches battery protocol','Try replacing communication cable with known-good cable','Check if battery BMS itself has a fault']},
  {id:'gen-issue',label:'Generator not charging battery',steps:['Check generator charge current setting — may be set too low (test value left)','Verify generator connected to GEN port not AC-IN (on models with separate port)','Measure generator output — must be 210 to 230V AC, 49 to 51Hz','Allow 30 to 60 seconds for generator to stabilise before inverter accepts','Check working mode allows charging from AC input']},
  {id:'parallel',label:'Parallel inverters not synchronising',steps:['Check firmware versions on both inverters — must be identical','Verify parallel cable is manufacturer-supplied proprietary cable (not Ethernet)','Check cable is fully connected at both inverter COM ports','Power off both — restart master first, wait 30s, then restart slave','Verify master = MASTER mode and slave = SLAVE mode in settings']},
]

const BOOKS = [
  {id:1,title:'Calculate It Right',subtitle:'The Complete Solar Sizing Guide',price:7500,pages:63,chapters:19,color:C.blue,badge:'BESTSELLER',topics:['Load Calculation','Panel Sizing','Battery Sizing','Inverter Sizing','Cable Sizing','Case Studies']},
  {id:2,title:'Wire It Right',subtitle:'Solar Installation Rules, Sizing and Safety',price:7500,pages:40,chapters:8,color:C.orange,badge:'PROFESSIONAL',topics:['Site Inspection','Breaker Sizing','Earthing','Panel Mounting','Commissioning','10 Rules']},
  {id:3,title:'Configure It Right',subtitle:'The Complete Solar Configuration Guide',price:8500,pages:85,chapters:22,color:C.green,badge:'ADVANCED',topics:['Panel Config','Battery Banks','Parallel Inverters','CAN Bus','RS485','Deye/Growatt/SRNE/Victron Guides']},
  {id:4,title:'Troubleshoot Like a Pro',subtitle:'Fix It Right: The Complete Fault Diagnosis Guide',price:8500,pages:95,chapters:27,color:C.navy,badge:'NEW',topics:['Fault Codes','Battery Faults','Inverter Faults','10 Case Studies','Warranty Claims','Quick Reference']},
]

// ── Shared UI Components ────────────────────────────────────────
function ResultBanner({label, value, unit, sub, color=C.gold}){
  return(
    <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:16,padding:'20px 24px',marginBottom:12}}>
      <div style={{color:'rgba(255,255,255,0.7)',fontSize:12,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:4}}>{label}</div>
      <div style={{color:color,fontSize:32,fontWeight:800,fontFamily:'Poppins',lineHeight:1}}>{value}<span style={{fontSize:16,marginLeft:6,color:'rgba(255,255,255,0.8)'}}>{unit}</span></div>
      {sub&&<div style={{color:'rgba(255,255,255,0.6)',fontSize:12,marginTop:4}}>{sub}</div>}
    </div>
  )
}

function InfoCard({label, value, unit='', color=C.navy, small=false}){
  return(
    <div style={{background:C.navyLight,borderRadius:12,padding:small?'10px 14px':'14px 18px',flex:1}}>
      <div style={{color:C.navy,fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:2}}>{label}</div>
      <div style={{color:color,fontSize:small?18:22,fontWeight:800,fontFamily:'Poppins'}}>{value}<span style={{fontSize:11,color:'#718096',marginLeft:4}}>{unit}</span></div>
    </div>
  )
}

function Chip({color=C.gold, children}){
  return <span style={{background:color,color:'#fff',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:20,letterSpacing:'0.05em'}}>{children}</span>
}

function Warning({children}){
  return(
    <div style={{background:'#FFF5F5',border:`1px solid ${C.red}`,borderLeft:`4px solid ${C.red}`,borderRadius:10,padding:'10px 14px',fontSize:13,color:'#742A2A',marginTop:8}}>
      ⚠️ {children}
    </div>
  )
}

function Tip({children}){
  return(
    <div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderLeft:`4px solid ${C.green}`,borderRadius:10,padding:'10px 14px',fontSize:13,color:'#1C4532',marginTop:8}}>
      💡 {children}
    </div>
  )
}

function SectionHeader({title,subtitle}){
  return(
    <div style={{marginBottom:24}}>
      <h2 style={{fontSize:22,fontWeight:800,color:C.navy,fontFamily:'Poppins',margin:0}}>{title}</h2>
      {subtitle&&<p style={{color:'#718096',fontSize:13,marginTop:4,marginBottom:0}}>{subtitle}</p>}
    </div>
  )
}

function TabBar({tabs, active, onChange}){
  return(
    <div style={{display:'flex',gap:6,marginBottom:24,flexWrap:'wrap'}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)}
          style={{padding:'8px 16px',borderRadius:10,fontSize:13,fontWeight:600,border:'none',cursor:'pointer',
            background:active===t.id?C.navy:C.navyLight,
            color:active===t.id?'#fff':C.navy,
            transition:'all 0.2s'}}>
          {t.icon&&<span style={{marginRight:6}}>{t.icon}</span>}{t.label}
        </button>
      ))}
    </div>
  )
}

// ── Number Input ────────────────────────────────────────────────
function NumInput({label,value,onChange,min=0,max,unit,step=1,hint}){
  return(
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:11,fontWeight:700,color:C.navy,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.04em'}}>{label}</label>
      <div style={{position:'relative',display:'flex',alignItems:'center'}}>
        <input type="number" value={value} min={min} max={max} step={step}
          onChange={e=>onChange(Number(e.target.value))}
          style={{width:'100%',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'10px 14px',fontSize:14,outline:'none',
            fontFamily:'Inter',transition:'border 0.2s',paddingRight:unit?40:14}}
          onFocus={e=>e.target.style.borderColor=C.gold}
          onBlur={e=>e.target.style.borderColor='#E2E8F0'}
        />
        {unit&&<span style={{position:'absolute',right:12,color:'#718096',fontSize:12,fontWeight:600}}>{unit}</span>}
      </div>
      {hint&&<div style={{fontSize:11,color:'#A0AEC0',marginTop:3}}>{hint}</div>}
    </div>
  )
}

function SelectInput({label,value,onChange,options}){
  return(
    <div style={{marginBottom:14}}>
      <label style={{display:'block',fontSize:11,fontWeight:700,color:C.navy,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.04em'}}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:'100%',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'10px 14px',fontSize:14,outline:'none',
          background:'white',cursor:'pointer',fontFamily:'Inter'}}>
        {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  )
}

// ── LOAD CALCULATOR ─────────────────────────────────────────────
function LoadCalculator(){
  const [rows, setRows] = useState([
    {id:1,name:'LED Bulb',watts:15,qty:6,dayH:0,nightH:5,duty:'default',surge:'default'},
    {id:2,name:'Ceiling Fan',watts:75,qty:2,dayH:4,nightH:4,duty:'default',surge:'fan'},
    {id:3,name:'LED TV 42"',watts:120,qty:1,dayH:0,nightH:4,duty:'default',surge:'default'},
    {id:4,name:'Refrigerator',watts:200,qty:1,dayH:6,nightH:6,duty:'fridge',surge:'fridge'},
  ])
  const [search, setSearch] = useState('')
  const [showDB, setShowDB] = useState(false)

  const addAppliance = a => {
    setRows(r=>[...r,{id:Date.now(),name:a.name,watts:a.w,qty:1,dayH:4,nightH:4,duty:a.duty,surge:a.surge}])
    setShowDB(false); setSearch('')
  }
  const addCustom = () => setRows(r=>[...r,{id:Date.now(),name:'Custom Appliance',watts:100,qty:1,dayH:2,nightH:2,duty:'default',surge:'default'}])
  const removeRow = id => setRows(r=>r.filter(x=>x.id!==id))
  const updateRow = (id,field,val) => setRows(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))

  const calc = ()=>{
    let dayRaw=0,nightRaw=0
    rows.forEach(r=>{
      const d=DUTY[r.duty]||1
      dayRaw   += r.watts*r.qty*(r.dayH||0)*d
      nightRaw += r.watts*r.qty*(r.nightH||0)*d
    })
    const total=dayRaw+nightRaw
    return{dayRaw,nightRaw,total,dayDesign:dayRaw*MARGIN,nightDesign:nightRaw*MARGIN,design:total*MARGIN}
  }
  const res = calc()
  const filtered = APPLIANCES.filter(a=>a.name.toLowerCase().includes(search.toLowerCase()))

  return(
    <div>
      <SectionHeader title="Load Calculator" subtitle="List all appliances with their daily usage hours — day and night separately"/>

      {/* Appliance Table */}
      <div style={{background:'white',borderRadius:16,border:'1px solid #E2E8F0',overflow:'hidden',marginBottom:16}}>
        {/* Header */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 80px 50px 60px 60px 32px',gap:8,padding:'10px 14px',background:C.navy,color:'white',fontSize:11,fontWeight:700,letterSpacing:'0.04em'}}>
          <div>APPLIANCE</div><div>WATTS</div><div>QTY</div><div>DAY hrs</div><div>NIGHT hrs</div><div></div>
        </div>
        {rows.map(r=>(
          <div key={r.id} style={{display:'grid',gridTemplateColumns:'1fr 80px 50px 60px 60px 32px',gap:8,padding:'8px 14px',borderBottom:'1px solid #F7FAFC',alignItems:'center'}}>
            <input value={r.name} onChange={e=>updateRow(r.id,'name',e.target.value)}
              style={{border:'none',outline:'none',fontSize:13,fontWeight:500,color:C.navy,background:'transparent',width:'100%'}}/>
            <input type="number" value={r.watts} min={1} onChange={e=>updateRow(r.id,'watts',Number(e.target.value))}
              style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 8px',fontSize:13,width:'100%',textAlign:'center'}}/>
            <input type="number" value={r.qty} min={1} max={50} onChange={e=>updateRow(r.id,'qty',Number(e.target.value))}
              style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 6px',fontSize:13,width:'100%',textAlign:'center'}}/>
            <input type="number" value={r.dayH} min={0} max={24} step={0.5} onChange={e=>updateRow(r.id,'dayH',Number(e.target.value))}
              style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 6px',fontSize:13,width:'100%',textAlign:'center'}}/>
            <input type="number" value={r.nightH} min={0} max={24} step={0.5} onChange={e=>updateRow(r.id,'nightH',Number(e.target.value))}
              style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 6px',fontSize:13,width:'100%',textAlign:'center'}}/>
            <button onClick={()=>removeRow(r.id)} style={{border:'none',background:'none',cursor:'pointer',color:'#FC8181',fontSize:16,padding:'2px'}}>×</button>
          </div>
        ))}
        {/* Add buttons */}
        <div style={{padding:'12px 14px',display:'flex',gap:8,flexWrap:'wrap'}}>
          <button onClick={()=>setShowDB(s=>!s)}
            style={{padding:'7px 14px',borderRadius:9,background:C.gold,color:C.navy,border:'none',cursor:'pointer',fontSize:12,fontWeight:700}}>
            + From Database
          </button>
          <button onClick={addCustom}
            style={{padding:'7px 14px',borderRadius:9,background:C.navyLight,color:C.navy,border:'none',cursor:'pointer',fontSize:12,fontWeight:700}}>
            + Custom
          </button>
        </div>
        {/* Appliance DB Picker */}
        {showDB&&(
          <div style={{padding:'12px 14px',borderTop:'1px solid #F7FAFC'}}>
            <input placeholder="Search appliances..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:'100%',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'8px 12px',fontSize:13,outline:'none',marginBottom:10}}/>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,maxHeight:200,overflowY:'auto'}}>
              {filtered.map(a=>(
                <button key={a.id} onClick={()=>addAppliance(a)}
                  style={{padding:'5px 12px',borderRadius:20,border:'1px solid #E2E8F0',background:'white',
                    cursor:'pointer',fontSize:12,color:C.navy,transition:'all 0.15s'}}
                  onMouseOver={e=>{e.target.style.background=C.navyLight}}
                  onMouseOut={e=>{e.target.style.background='white'}}>
                  {a.name} <span style={{color:'#A0AEC0'}}>({a.w}W)</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <ResultBanner label="Total Design Load" value={fmt(res.design)} unit="Wh/day" sub={`Raw: ${fmt(res.total)} Wh × 1.25 safety margin = ${fmt(res.design)} Wh`}/>
      <div style={{display:'flex',gap:10,marginBottom:8}}>
        <InfoCard label="Daytime Load" value={fmt(res.dayDesign)} unit="Wh" color={C.gold}/>
        <InfoCard label="Nighttime Load" value={fmt(res.nightDesign)} unit="Wh" color={C.blue}/>
        <InfoCard label="Total Appliances" value={rows.length} unit="items"/>
      </div>
      {res.design>50000&&<Warning>Design load is very high. Verify all appliance wattages and hours are correct before sizing components.</Warning>}
      <Tip>Nighttime load is used for battery sizing. Total design load is used for panel sizing. Both already include the 25% safety margin.</Tip>
    </div>
  )
}

// ── PANEL SIZING CALCULATOR ─────────────────────────────────────
function PanelCalculator(){
  const [designLoad, setDesignLoad] = useState(8000)
  const [panelW, setPanelW] = useState(500)
  const [psh, setPsh] = useState(5)
  const [eff, setEff] = useState(75)

  const factor = psh * (eff/100)
  const panelCapacity = designLoad / factor
  const count = Math.ceil(panelCapacity / panelW)
  const arrayW = count * panelW
  const dailyOutput = arrayW * psh * (eff/100)

  return(
    <div>
      <SectionHeader title="Panel Sizing Calculator" subtitle="From design load to exact number of panels required"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
        <NumInput label="Total Design Load" value={designLoad} onChange={setDesignLoad} unit="Wh/day" hint="From Load Calculator with 25% margin"/>
        <NumInput label="Panel Wattage" value={panelW} onChange={setPanelW} unit="W" hint="Typically 500W for modern systems"/>
        <NumInput label="Peak Sun Hours" value={psh} onChange={setPsh} unit="hrs" step={0.5} min={1} max={8} hint="Africa average: 5.0 hrs/day"/>
        <NumInput label="System Efficiency" value={eff} onChange={setEff} unit="%" min={50} max={100} hint="Use 75% for all calculations"/>
      </div>

      <ResultBanner label="Panels Required" value={count} unit={`× ${panelW}W panels`} sub={`Array total: ${fmt(arrayW)}W | Efficiency factor: ${fmtDec(factor,2)}`}/>
      <div style={{display:'flex',gap:10,marginBottom:8}}>
        <InfoCard label="Panel Capacity Needed" value={fmt(panelCapacity)} unit="W" color={C.gold}/>
        <InfoCard label="Array Total" value={fmt(arrayW)} unit="W" color={C.blue}/>
        <InfoCard label="Est. Daily Output" value={fmt(dailyOutput)} unit="Wh" color={C.green}/>
      </div>

      <div style={{background:C.navyLight,borderRadius:12,padding:'14px 18px',marginTop:12,fontSize:13}}>
        <div style={{fontWeight:700,color:C.navy,marginBottom:8}}>Formula Used (from Calculate It Right):</div>
        <div style={{color:'#4A5568',lineHeight:1.8}}>
          Panel Capacity = Design Load ÷ (PSH × Efficiency)<br/>
          = {fmt(designLoad)} ÷ ({psh} × {eff/100})<br/>
          = {fmt(designLoad)} ÷ {fmtDec(factor,2)}<br/>
          = <strong style={{color:C.gold}}>{fmt(panelCapacity)} W</strong><br/>
          Panels = ⌈{fmtDec(panelCapacity/panelW,1)}⌉ = <strong style={{color:C.navy}}>{count} panels</strong>
        </div>
      </div>
      <Tip>Always round panel count UP, never down. Never use theoretical panel output — always apply the {eff}% efficiency factor.</Tip>
    </div>
  )
}

// ── BATTERY SIZING CALCULATOR ───────────────────────────────────
function BatteryCalculator(){
  const [nightLoad, setNightLoad] = useState(4000)
  const [voltage, setVoltage] = useState(48)
  const [battType, setBattType] = useState('lithium')
  const [autonomy, setAutonomy] = useState(1)
  const [battAh, setBattAh] = useState(200)

  const dod = DOD[battType]||0.80
  const requiredAh = (nightLoad * autonomy) / (voltage * dod)
  const count = Math.ceil(requiredAh / battAh)
  const totalAh = count * battAh
  const usableWh = totalAh * voltage * dod
  const overLimit = count > 4

  return(
    <div>
      <SectionHeader title="Battery Bank Calculator" subtitle="Battery sized on nighttime load only — not total daily load"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
        <NumInput label="Nighttime Design Load" value={nightLoad} onChange={setNightLoad} unit="Wh" hint="Nighttime load × 1.25 margin"/>
        <SelectInput label="System Voltage" value={voltage} onChange={v=>setVoltage(Number(v))} options={[{value:12,label:'12V'},{value:24,label:'24V'},{value:48,label:'48V (Recommended)'}]}/>
        <SelectInput label="Battery Type" value={battType} onChange={setBattType} options={[{value:'lithium',label:'Lithium LiFePO4 (80% DoD)'},{value:'leadAcid',label:'Lead-Acid Tubular (50% DoD)'},{value:'agm',label:'AGM/Gel (60% DoD)'}]}/>
        <NumInput label="Autonomy Days" value={autonomy} onChange={setAutonomy} min={0.5} max={7} step={0.5} unit="days" hint="Days without solar charging"/>
        <NumInput label="Single Battery Capacity" value={battAh} onChange={setBattAh} unit="Ah" hint="Per individual battery unit"/>
      </div>

      <ResultBanner label="Batteries Required" value={count} unit={`× ${battAh}Ah ${voltage}V`} sub={`Total: ${fmt(totalAh)}Ah | Usable: ${fmt(usableWh)}Wh | DoD: ${Math.round(dod*100)}%`}/>
      <div style={{display:'flex',gap:10,marginBottom:8}}>
        <InfoCard label="Required Ah" value={fmt(requiredAh)} unit="Ah" color={C.gold}/>
        <InfoCard label="Total Bank" value={fmt(totalAh)} unit="Ah" color={C.blue}/>
        <InfoCard label="Usable Energy" value={fmt(usableWh)} unit="Wh" color={C.green}/>
      </div>

      {overLimit&&<Warning>Maximum 4 Lithium batteries in parallel without a busbar system. With {count} batteries, install a busbar distribution system. Exceeding 4 in parallel without busbar causes uneven current distribution and premature battery degradation.</Warning>}
      {battType==='leadAcid'&&<Warning>Lead-Acid batteries only use 50% DoD and last 500 to 800 cycles. Lithium at 80% DoD lasts 3,000 to 6,000 cycles. Lithium is almost always more cost-effective over the system lifetime.</Warning>}

      <div style={{background:C.navyLight,borderRadius:12,padding:'14px 18px',marginTop:12,fontSize:13}}>
        <div style={{fontWeight:700,color:C.navy,marginBottom:8}}>Formula Used (from Calculate It Right):</div>
        <div style={{color:'#4A5568',lineHeight:1.8}}>
          Battery Ah = (Nighttime Load × Days) ÷ (Voltage × DoD)<br/>
          = ({fmt(nightLoad)} × {autonomy}) ÷ ({voltage} × {dod})<br/>
          = <strong style={{color:C.gold}}>{fmt(requiredAh)} Ah required</strong><br/>
          Batteries = ⌈{fmtDec(requiredAh/battAh,1)}⌉ = <strong style={{color:C.navy}}>{count} batteries</strong>
        </div>
      </div>
    </div>
  )
}

// ── INVERTER SIZING CALCULATOR ──────────────────────────────────
function InverterCalculator(){
  const [loads, setLoads] = useState([
    {id:1,name:'LED Lights & Fans',watts:300,qty:1,surge:'default'},
    {id:2,name:'Refrigerator',watts:200,qty:1,surge:'fridge'},
    {id:3,name:'LED TV',watts:120,qty:1,surge:'default'},
    {id:4,name:'AC 1.5HP',watts:1100,qty:1,surge:'ac'},
  ])

  const addLoad=()=>setLoads(l=>[...l,{id:Date.now(),name:'New Load',watts:100,qty:1,surge:'default'}])
  const removeLoad=id=>setLoads(l=>l.filter(x=>x.id!==id))
  const updateLoad=(id,f,v)=>setLoads(l=>l.map(x=>x.id===id?{...x,[f]:v}:x))

  let continuous=0, maxSurge=0
  loads.forEach(l=>{
    const cont=l.watts*l.qty
    continuous+=cont
    const sf=SURGE[l.surge]||1.5
    const surge=cont*(sf-1)
    if(surge>maxSurge) maxSurge=surge
  })
  const required=(continuous+maxSurge)*MARGIN
  const sizes=[1000,1500,2000,3000,3500,5000,6000,8000,10000,15000,20000]
  const recommended=sizes.find(s=>s>=required)||required

  return(
    <div>
      <SectionHeader title="Inverter Sizing Calculator" subtitle="Includes motor surge factors for refrigerators, ACs and pumps"/>
      <div style={{background:'white',borderRadius:16,border:'1px solid #E2E8F0',overflow:'hidden',marginBottom:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 80px 50px 110px 32px',gap:8,padding:'10px 14px',background:C.navy,color:'white',fontSize:11,fontWeight:700,letterSpacing:'0.04em'}}>
          <div>LOAD / APPLIANCE</div><div>WATTS</div><div>QTY</div><div>SURGE TYPE</div><div></div>
        </div>
        {loads.map(l=>(
          <div key={l.id} style={{display:'grid',gridTemplateColumns:'1fr 80px 50px 110px 32px',gap:8,padding:'8px 14px',borderBottom:'1px solid #F7FAFC',alignItems:'center'}}>
            <input value={l.name} onChange={e=>updateLoad(l.id,'name',e.target.value)} style={{border:'none',outline:'none',fontSize:13,fontWeight:500,color:C.navy,background:'transparent'}}/>
            <input type="number" value={l.watts} min={1} onChange={e=>updateLoad(l.id,'watts',Number(e.target.value))} style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 8px',fontSize:13,textAlign:'center',width:'100%'}}/>
            <input type="number" value={l.qty} min={1} max={20} onChange={e=>updateLoad(l.id,'qty',Number(e.target.value))} style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 6px',fontSize:13,textAlign:'center',width:'100%'}}/>
            <select value={l.surge} onChange={e=>updateLoad(l.id,'surge',e.target.value)} style={{border:'1px solid #E2E8F0',borderRadius:8,padding:'4px 6px',fontSize:11,width:'100%',background:'white'}}>
              <option value="default">General (1.5×)</option>
              <option value="fan">Fan (2.5×)</option>
              <option value="fridge">Fridge (3×)</option>
              <option value="freezer">Freezer (2.5×)</option>
              <option value="ac">AC Unit (4×)</option>
              <option value="pump">Pump (4×)</option>
            </select>
            <button onClick={()=>removeLoad(l.id)} style={{border:'none',background:'none',cursor:'pointer',color:'#FC8181',fontSize:16}}>×</button>
          </div>
        ))}
        <div style={{padding:'10px 14px'}}>
          <button onClick={addLoad} style={{padding:'7px 14px',borderRadius:9,background:C.navyLight,color:C.navy,border:'none',cursor:'pointer',fontSize:12,fontWeight:700}}>+ Add Load</button>
        </div>
      </div>

      <ResultBanner label="Inverter Required" value={`${fmtDec(recommended/1000,1)} kVA`} unit="" sub={`Minimum: ${fmtDec(required/1000,1)} kVA | Continuous: ${fmt(continuous)}W | Surge: ${fmt(maxSurge)}W`}/>
      <div style={{display:'flex',gap:10,marginBottom:8}}>
        <InfoCard label="Peak Continuous" value={fmt(continuous)} unit="W" color={C.gold}/>
        <InfoCard label="Motor Surge" value={fmt(maxSurge)} unit="W" color={C.orange}/>
        <InfoCard label="With 1.25 Margin" value={fmt(required)} unit="W" color={C.navy}/>
      </div>
      <Tip>Formula: (Peak Continuous + Motor Surge) × 1.25. Always verify the inverter SURGE rating in the datasheet — not just continuous kVA. AC units surge 3 to 6× their rated power for 1 to 2 seconds.</Tip>
    </div>
  )
}

// ── CABLE & BREAKER CALCULATOR ──────────────────────────────────
function CableCalculator(){
  const [power, setPower] = useState(5000)
  const [voltage, setVoltage] = useState(48)
  const [circuitType, setCircuitType] = useState('dc')
  const [length, setLength] = useState(3)
  const [cableSize, setCableSize] = useState('35')

  const current = circuitType==='dc' ? power/voltage : power/(voltage*0.8)
  const bkr = nextBreaker((current/0.8)*1.25)
  const RESIST={'1.5':12.1,'2.5':7.41,'4':4.61,'6':3.08,'10':1.83,'16':1.15,'25':0.727,'35':0.524,'50':0.387,'70':0.268}
  const res = RESIST[cableSize]||1.83
  const dropV = (2*length*current*res)/1000
  const dropPct = (dropV/voltage)*100
  const maxDrop = circuitType==='dc'?3:2
  const safeVoltages=[220,230,240]

  return(
    <div>
      <SectionHeader title="Cable & Breaker Sizing Calculator" subtitle="DC and AC cable sizing with voltage drop check"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
        <SelectInput label="Circuit Type" value={circuitType} onChange={setCircuitType} options={[{value:'dc',label:'DC (Battery/PV circuit)'},{value:'ac',label:'AC (Inverter output)'}]}/>
        <NumInput label="Power" value={power} onChange={setPower} unit="W"/>
        <NumInput label="Voltage" value={voltage} onChange={setVoltage} unit="V" hint={circuitType==='dc'?'Battery bank voltage':'230V for AC output'}/>
        <SelectInput label="Cable Size (to check drop)" value={cableSize} onChange={setCableSize} options={['1.5','2.5','4','6','10','16','25','35','50','70'].map(s=>({value:s,label:s+'mm²'}))}/>
        <NumInput label="Cable Run Length" value={length} onChange={setLength} unit="m" hint="One-way length (formula uses 2× for return path)"/>
      </div>

      <ResultBanner label="Circuit Current" value={fmtDec(current,1)} unit="A" sub={circuitType==='dc'?`I = ${power}W ÷ ${voltage}V`:`I = ${power}W ÷ (${voltage}V × 0.8 PF)`}/>
      <div style={{display:'flex',gap:10,marginBottom:8}}>
        <InfoCard label="Breaker Size" value={`${bkr}A`} unit="" color={C.gold}/>
        <InfoCard label="Voltage Drop" value={fmtDec(dropV,2)} unit="V" color={dropPct>maxDrop?C.red:C.green}/>
        <InfoCard label="Drop %" value={fmtDec(dropPct,1)} unit="%" color={dropPct>maxDrop?C.red:C.green}/>
      </div>

      {dropPct>maxDrop&&<Warning>Voltage drop {fmtDec(dropPct,1)}% exceeds the {maxDrop}% maximum for {circuitType.toUpperCase()} circuits. Use a larger cable size or reduce cable run length.</Warning>}
      {dropPct<=maxDrop&&<Tip>Voltage drop {fmtDec(dropPct,1)}% is within the {maxDrop}% maximum. Cable size {cableSize}mm² is acceptable for this run.</Tip>}

      <div style={{background:C.navyLight,borderRadius:12,padding:'14px 18px',marginTop:12,fontSize:13}}>
        <div style={{fontWeight:700,color:C.navy,marginBottom:8}}>Formulas Used (from Wire It Right):</div>
        <div style={{color:'#4A5568',lineHeight:1.8}}>
          {circuitType==='dc'?`DC Current = Power ÷ Voltage = ${power} ÷ ${voltage} = ${fmtDec(current,1)}A`
            :`AC Current = Power ÷ (Voltage × PF) = ${power} ÷ (${voltage} × 0.8) = ${fmtDec(current,1)}A`}<br/>
          Breaker = ⌈(I ÷ 0.8) × 1.25⌉ rounded up = <strong style={{color:C.gold}}>{bkr}A</strong><br/>
          Voltage Drop = (2 × {length}m × {fmtDec(current,1)}A × {res}mΩ/m) ÷ 1000 = <strong style={{color:dropPct>maxDrop?C.red:C.green}}>{fmtDec(dropV,2)}V ({fmtDec(dropPct,1)}%)</strong>
        </div>
      </div>
    </div>
  )
}

// ── COST PER KWH CALCULATOR ─────────────────────────────────────
function CostCalculator(){
  const [systemCost, setSystemCost] = useState(1500000)
  const [dailyKwh, setDailyKwh] = useState(8)
  const [years, setYears] = useState(20)
  const [maintenance, setMaintenance] = useState(30000)
  const [genFuelPerL, setGenFuelPerL] = useState(1200)

  const totalCost = systemCost + maintenance*years
  const totalKwh = dailyKwh*365*years
  const solarKwh = totalCost/totalKwh
  const genKwh = (genFuelPerL*0.8)/2  // 0.8L/hr at given price, 2kWh/hr output
  const annualSaving = (genKwh-solarKwh)*dailyKwh*365
  const payback = systemCost/annualSaving

  return(
    <div>
      <SectionHeader title="Cost Per kWh Calculator" subtitle="Compare solar vs generator electricity cost over system lifetime"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
        <NumInput label="Total System Cost" value={systemCost} onChange={setSystemCost} unit="₦" hint="Complete installed cost"/>
        <NumInput label="Daily Energy Produced" value={dailyKwh} onChange={setDailyKwh} unit="kWh" hint="From panel sizing calculator"/>
        <NumInput label="System Lifetime" value={years} onChange={setYears} unit="yrs" min={5} max={30}/>
        <NumInput label="Annual Maintenance" value={maintenance} onChange={setMaintenance} unit="₦/yr"/>
        <NumInput label="Generator Fuel Price" value={genFuelPerL} onChange={setGenFuelPerL} unit="₦/L" hint="Current PMS price"/>
      </div>

      <ResultBanner label="Solar Cost Per kWh" value={`₦${fmt(solarKwh)}`} unit="per kWh" sub={`vs Generator: ₦${fmt(genKwh)} per kWh — you save ₦${fmt(genKwh-solarKwh)} per kWh`}/>
      <div style={{display:'flex',gap:10,marginBottom:8}}>
        <InfoCard label="Annual Saving vs Gen" value={`₦${fmt(annualSaving)}`} unit="" color={C.green}/>
        <InfoCard label="Payback Period" value={fmtDec(payback,1)} unit="years" color={C.gold}/>
        <InfoCard label="20yr Saving" value={`₦${fmt(annualSaving*years)}`} unit="" color={C.blue}/>
      </div>
      <Tip>Show this to hesitant clients: solar at ₦{fmt(solarKwh)}/kWh vs generator at ₦{fmt(genKwh)}/kWh. Over {years} years, solar saves ₦{fmt(annualSaving*years)}. That is a {Math.round(annualSaving*years/systemCost)}× return on investment.</Tip>
    </div>
  )
}

// ── CALCULATORS HUB ─────────────────────────────────────────────
function CalculatorsPage(){
  const [tab, setTab] = useState('load')
  const tabs=[
    {id:'load',label:'Load'},
    {id:'panel',label:'Panel'},
    {id:'battery',label:'Battery'},
    {id:'inverter',label:'Inverter'},
    {id:'cable',label:'Cable & Breaker'},
    {id:'cost',label:'Cost/kWh'},
  ]
  return(
    <div>
      <TabBar tabs={tabs} active={tab} onChange={setTab}/>
      {tab==='load'&&<LoadCalculator/>}
      {tab==='panel'&&<PanelCalculator/>}
      {tab==='battery'&&<BatteryCalculator/>}
      {tab==='inverter'&&<InverterCalculator/>}
      {tab==='cable'&&<CableCalculator/>}
      {tab==='cost'&&<CostCalculator/>}
    </div>
  )
}

// ── TROUBLESHOOTING PAGE ────────────────────────────────────────
function TroubleshootingPage(){
  const [tab, setTab] = useState('wizard')
  const [symptom, setSymptom] = useState(null)
  const [step, setStep] = useState(0)
  const [brand, setBrand] = useState('Deye')
  const [search, setSearch] = useState('')

  const faults = FAULT_DB[brand]||[]
  const filtered = faults.filter(f=>
    f.code.toLowerCase().includes(search.toLowerCase())||
    f.name.toLowerCase().includes(search.toLowerCase())||
    f.cause.toLowerCase().includes(search.toLowerCase())
  )

  const sevColor = s => s==='critical'?C.red:s==='warning'?C.orange:'#3182CE'

  return(
    <div>
      <TabBar tabs={[{id:'wizard',label:'🧭 Fault Wizard'},{id:'codes',label:'📋 Fault Codes'},{id:'maintenance',label:'🔧 Maintenance'}]} active={tab} onChange={t=>{setTab(t);setSymptom(null);setStep(0)}}/>

      {tab==='wizard'&&(
        !symptom?(
          <div>
            <SectionHeader title="What symptom are you seeing?" subtitle="Select the closest match to begin the systematic diagnosis"/>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {SYMPTOMS.map(s=>(
                <button key={s.id} onClick={()=>{setSymptom(s);setStep(0)}}
                  style={{background:'white',border:`1.5px solid #E2E8F0`,borderRadius:14,padding:'16px 20px',cursor:'pointer',textAlign:'left',transition:'all 0.2s'}}
                  onMouseOver={e=>e.currentTarget.style.borderColor=C.gold}
                  onMouseOut={e=>e.currentTarget.style.borderColor='#E2E8F0'}>
                  <div style={{fontWeight:600,color:C.navy,fontSize:14}}>{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        ):(
          <div>
            <button onClick={()=>{setSymptom(null);setStep(0)}}
              style={{background:'none',border:'none',cursor:'pointer',color:C.blue,fontWeight:600,fontSize:13,marginBottom:16,padding:0}}>
              ← Back to symptoms
            </button>
            <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:16,padding:'20px 24px',marginBottom:20}}>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:11,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:4}}>Diagnosing</div>
              <div style={{color:'white',fontSize:18,fontWeight:700,fontFamily:'Poppins'}}>{symptom.label}</div>
            </div>
            {symptom.steps.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:14,marginBottom:14,padding:'14px 16px',borderRadius:12,
                background:i<step?C.greenLight:i===step?'white':'#F7FAFC',
                border:`1.5px solid ${i<step?C.green:i===step?C.gold:'#E2E8F0'}`,
                transition:'all 0.3s'}}>
                <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                  background:i<step?C.green:i===step?C.gold:C.navyLight,
                  color:i<=step?'white':C.navy,fontWeight:700,fontSize:13}}>
                  {i<step?'✓':i+1}
                </div>
                <div>
                  <div style={{fontSize:13,color:i<step?C.green:C.navy,fontWeight:i===step?600:400,lineHeight:1.5}}>{s}</div>
                  {i===step&&(
                    <button onClick={()=>setStep(st=>st+1)}
                      style={{marginTop:10,padding:'7px 16px',borderRadius:9,background:C.gold,color:C.navy,border:'none',cursor:'pointer',fontSize:12,fontWeight:700}}>
                      {step===symptom.steps.length-1?'Mark Resolved ✓':'Check done, next step →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {step>=symptom.steps.length&&(
              <div style={{background:C.greenLight,border:`2px solid ${C.green}`,borderRadius:14,padding:'20px',textAlign:'center'}}>
                <div style={{fontSize:24,marginBottom:8}}>✅</div>
                <div style={{fontWeight:700,color:C.green,fontSize:16,marginBottom:4}}>All diagnostic steps completed</div>
                <div style={{color:'#2D6A4F',fontSize:13}}>If the fault persists, check the Fault Code reference or contact the inverter manufacturer service centre.</div>
                <button onClick={()=>{setSymptom(null);setStep(0)}}
                  style={{marginTop:14,padding:'8px 20px',borderRadius:10,background:C.green,color:'white',border:'none',cursor:'pointer',fontSize:13,fontWeight:600}}>
                  Start New Diagnosis
                </button>
              </div>
            )}
          </div>
        )
      )}

      {tab==='codes'&&(
        <div>
          <SectionHeader title="Fault Code Reference" subtitle="Complete fault codes for all 6 major inverter brands"/>
          <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
            {Object.keys(FAULT_DB).map(b=>(
              <button key={b} onClick={()=>{setBrand(b);setSearch('')}}
                style={{padding:'7px 16px',borderRadius:10,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,
                  background:brand===b?C.navy:C.navyLight,color:brand===b?'white':C.navy}}>
                {b}
              </button>
            ))}
          </div>
          <input placeholder={`Search ${brand} fault codes...`} value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:'100%',border:'1.5px solid #E2E8F0',borderRadius:12,padding:'10px 16px',fontSize:13,outline:'none',marginBottom:14}}/>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {filtered.map(f=>(
              <div key={f.code} style={{background:'white',borderRadius:14,border:`1.5px solid ${sevColor(f.sev)}22`,overflow:'hidden'}}>
                <div style={{background:sevColor(f.sev),padding:'10px 16px',display:'flex',alignItems:'center',gap:12}}>
                  <span style={{background:'rgba(255,255,255,0.2)',borderRadius:8,padding:'3px 10px',fontSize:13,fontWeight:800,color:'white',fontFamily:'monospace'}}>{f.code}</span>
                  <span style={{color:'white',fontWeight:700,fontSize:14}}>{f.name}</span>
                  <span style={{marginLeft:'auto',background:'rgba(255,255,255,0.2)',borderRadius:20,padding:'2px 10px',fontSize:10,fontWeight:700,color:'white',textTransform:'uppercase'}}>{f.sev}</span>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:'#718096',textTransform:'uppercase',letterSpacing:'0.04em'}}>Cause: </span>
                    <span style={{fontSize:13,color:C.navy}}>{f.cause}</span>
                  </div>
                  <div style={{background:C.navyLight,borderRadius:10,padding:'10px 14px'}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>Resolution Steps:</div>
                    {f.fix.split('\n').map((line,i)=>(
                      <div key={i} style={{fontSize:12,color:'#4A5568',lineHeight:1.8}}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length===0&&<div style={{textAlign:'center',color:'#A0AEC0',padding:40,fontSize:14}}>No fault codes found matching "{search}"</div>}
          </div>
        </div>
      )}

      {tab==='maintenance'&&(
        <div>
          <SectionHeader title="Maintenance Checklist" subtitle="From Troubleshoot Like a Pro — preventive inspection schedules"/>
          {[
            {period:'Monthly',color:C.blue,icon:'📅',tasks:['Visual inspection of all solar panels (binoculars or safe roof access)','Check inverter display — record all readings and compare to commissioning report','Check all inverter LED indicators — all should be green','Touch battery enclosure — should be cool to warm, never hot','Check AC output voltage on inverter display — should be 220 to 230V','Verify BMS communication is active (SOC % visible on inverter display)','Clean panel surface if visible dust layer is present']},
            {period:'Quarterly',color:C.orange,icon:'🔧',tasks:['Pull-test every MC4 connector — should not pull out without the MC4 tool','Torque check all terminal connections with torque wrench','Earth resistance test — all points must be below 1 ohm','Insulation resistance test on all DC cables — above 100 Mohm','String current comparison at solar noon — all strings within 5% of each other','Clean dust from inverter air vents with soft brush','Check and clean internal cooling fan if accessible']},
            {period:'Annual',color:C.green,icon:'📋',tasks:['Full thermal imaging of panel array at peak solar hours (10am to 2pm)','Battery capacity test — measure actual Ah delivered from full charge to cutoff','Compare all earth resistance readings to previous year baseline','Compare all insulation resistance readings to previous year baseline','Complete inverter settings review against original commissioning report','Provide written system health report to client with findings and recommendations','Check all cable routing for UV damage, rodent damage, or mechanical wear']},
          ].map(m=>(
            <div key={m.period} style={{marginBottom:20,background:'white',borderRadius:16,border:`1.5px solid ${m.color}22`,overflow:'hidden'}}>
              <div style={{background:m.color,padding:'12px 18px',display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:20}}>{m.icon}</span>
                <span style={{color:'white',fontWeight:700,fontSize:16,fontFamily:'Poppins'}}>{m.period} Maintenance</span>
              </div>
              {m.tasks.map((t,i)=>(
                <div key={i} style={{display:'flex',gap:12,padding:'12px 18px',borderBottom:i<m.tasks.length-1?'1px solid #F7FAFC':'none',alignItems:'flex-start'}}>
                  <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${m.color}`,flexShrink:0,marginTop:1}}/>
                  <div style={{fontSize:13,color:'#4A5568',lineHeight:1.5}}>{t}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── EBOOK STORE ─────────────────────────────────────────────────
function EbookStore(){
  return(
    <div>
      <SectionHeader title="MSE Ebook Store" subtitle="Professional solar training books by Imam Musa, Musstech Solar Energy"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
        {BOOKS.map(b=>(
          <div key={b.id} style={{background:'white',borderRadius:20,border:'1px solid #E2E8F0',overflow:'hidden',boxShadow:'0 2px 16px rgba(26,46,74,0.08)',transition:'transform 0.2s,box-shadow 0.2s'}}
            onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(26,46,74,0.15)'}}
            onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 16px rgba(26,46,74,0.08)'}}>
            {/* Cover */}
            <div style={{background:`linear-gradient(135deg,${b.color},${b.color}CC)`,padding:'32px 24px',position:'relative',minHeight:180,display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
              <span style={{position:'absolute',top:16,right:16,background:C.gold,color:C.navy,fontSize:10,fontWeight:800,padding:'3px 10px',borderRadius:20}}>{b.badge}</span>
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:11,marginBottom:4}}>{b.chapters} Chapters · {b.pages} Pages</div>
              <div style={{color:'white',fontSize:20,fontWeight:800,fontFamily:'Poppins',lineHeight:1.2}}>{b.title}</div>
              <div style={{color:'rgba(255,255,255,0.8)',fontSize:12,marginTop:4}}>{b.subtitle}</div>
            </div>
            <div style={{padding:'18px 20px'}}>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
                {b.topics.slice(0,4).map(t=>(
                  <span key={t} style={{background:C.navyLight,color:C.navy,fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:20}}>{t}</span>
                ))}
                {b.topics.length>4&&<span style={{color:'#A0AEC0',fontSize:10,padding:'3px 4px'}}>+{b.topics.length-4} more</span>}
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{color:C.gold,fontSize:22,fontWeight:800,fontFamily:'Poppins'}}>₦{fmt(b.price)}</div>
                <a href="https://selar.com/89d88rao55" target="_blank" rel="noreferrer"
                  style={{background:C.navy,color:'white',padding:'9px 18px',borderRadius:10,fontSize:12,fontWeight:700,textDecoration:'none',transition:'opacity 0.2s'}}
                  onMouseOver={e=>e.target.style.opacity='0.85'}
                  onMouseOut={e=>e.target.style.opacity='1'}>
                  Buy Now →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:28,background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:20,padding:'28px 32px',textAlign:'center'}}>
        <div style={{color:C.gold,fontSize:13,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>Get All 4 Books</div>
        <div style={{color:'white',fontSize:20,fontWeight:700,fontFamily:'Poppins',marginBottom:8}}>The Complete MSE Solar Library</div>
        <div style={{color:'rgba(255,255,255,0.7)',fontSize:13,marginBottom:20}}>Calculate It Right · Wire It Right · Configure It Right · Troubleshoot Like a Pro</div>
        <a href="https://selar.com/89d88rao55" target="_blank" rel="noreferrer"
          style={{background:C.gold,color:C.navy,padding:'12px 32px',borderRadius:12,fontSize:14,fontWeight:800,textDecoration:'none',display:'inline-block'}}>
          Visit MSE Selar Store →
        </a>
      </div>
    </div>
  )
}

// ── QUOTATION GENERATOR ─────────────────────────────────────────
function QuotationPage(){
  const [client, setClient] = useState({name:'',address:'',phone:'',email:'',date:new Date().toISOString().slice(0,10)})
  const [system, setSystem] = useState({designLoad:8000,nightLoad:4000,voltage:48,battType:'lithium',autonomy:1,panelW:500,battAh:200,panelPrice:145000,battPrice:480000,invPrice:520000})
  const [margin, setMargin] = useState(20)
  const [extras, setExtras] = useState(150000)
  const [shown, setShown] = useState(false)

  const panels = Math.ceil((system.designLoad/FACTOR)/system.panelW)
  const batts  = Math.ceil((system.nightLoad*system.autonomy)/(system.voltage*(DOD[system.battType]||0.8)*system.battAh))
  const invKva = Math.ceil(((system.designLoad/24)*1.5*MARGIN)/1000)*1000

  const equipCost = panels*system.panelPrice + batts*system.battPrice + system.invPrice + extras
  const totalCost = equipCost * (1+margin/100)

  const updateC = (f,v) => setClient(c=>({...c,[f]:v}))
  const updateS = (f,v) => setSystem(s=>({...s,[f]:Number(v)||v}))

  return(
    <div>
      <SectionHeader title="Quotation Generator" subtitle="Auto-size system and generate professional quotation"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Client Details */}
        <div style={{background:'white',borderRadius:16,border:'1px solid #E2E8F0',padding:'20px'}}>
          <div style={{fontWeight:700,color:C.navy,fontFamily:'Poppins',fontSize:15,marginBottom:16}}>Client Details</div>
          {[['name','Client Name'],['address','Site Address'],['phone','Phone Number'],['email','Email'],['date','Date']].map(([f,l])=>(
            <div key={f} style={{marginBottom:12}}>
              <label style={{display:'block',fontSize:11,fontWeight:700,color:C.navy,marginBottom:4,textTransform:'uppercase'}}>{l}</label>
              <input type={f==='date'?'date':'text'} value={client[f]} onChange={e=>updateC(f,e.target.value)}
                style={{width:'100%',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'9px 12px',fontSize:13,outline:'none'}}
                onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
            </div>
          ))}
        </div>
        {/* System Parameters */}
        <div style={{background:'white',borderRadius:16,border:'1px solid #E2E8F0',padding:'20px'}}>
          <div style={{fontWeight:700,color:C.navy,fontFamily:'Poppins',fontSize:15,marginBottom:16}}>System Parameters</div>
          <NumInput label="Total Design Load" value={system.designLoad} onChange={v=>updateS('designLoad',v)} unit="Wh/day"/>
          <NumInput label="Nighttime Load" value={system.nightLoad} onChange={v=>updateS('nightLoad',v)} unit="Wh"/>
          <SelectInput label="System Voltage" value={system.voltage} onChange={v=>updateS('voltage',v)} options={[{value:12,label:'12V'},{value:24,label:'24V'},{value:48,label:'48V'}]}/>
          <SelectInput label="Battery Type" value={system.battType} onChange={v=>updateS('battType',v)} options={[{value:'lithium',label:'Lithium LiFePO4'},{value:'leadAcid',label:'Lead-Acid'}]}/>
          <NumInput label="Autonomy Days" value={system.autonomy} onChange={v=>updateS('autonomy',v)} unit="days" step={0.5}/>
        </div>
      </div>

      {/* Pricing */}
      <div style={{background:'white',borderRadius:16,border:'1px solid #E2E8F0',padding:'20px',marginBottom:20}}>
        <div style={{fontWeight:700,color:C.navy,fontFamily:'Poppins',fontSize:15,marginBottom:16}}>Equipment Pricing (₦)</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <NumInput label={`Panel Price (${system.panelW}W each)`} value={system.panelPrice} onChange={v=>updateS('panelPrice',v)} unit="₦"/>
          <NumInput label={`Battery Price (${system.battAh}Ah each)`} value={system.battPrice} onChange={v=>updateS('battPrice',v)} unit="₦"/>
          <NumInput label="Inverter Price" value={system.invPrice} onChange={v=>updateS('invPrice',v)} unit="₦"/>
          <NumInput label="Cables, Breakers & Extras" value={extras} onChange={setExtras} unit="₦"/>
          <NumInput label="Profit Margin" value={margin} onChange={setMargin} unit="%" min={0} max={100}/>
        </div>
      </div>

      {/* Preview */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:20,padding:'24px 28px',marginBottom:16}}>
        <div style={{color:C.gold,fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:16}}>System Summary</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
          {[['Solar Panels',`${panels} × ${system.panelW}W`],['Battery Bank',`${batts} × ${system.battAh}Ah ${system.voltage}V`],['Inverter',`${fmtDec(invKva/1000,1)} kVA`]].map(([l,v])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'12px 16px'}}>
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:10,fontWeight:700,textTransform:'uppercase',marginBottom:4}}>{l}</div>
              <div style={{color:'white',fontSize:16,fontWeight:800,fontFamily:'Poppins'}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'14px 18px'}}>
            <div style={{color:'rgba(255,255,255,0.6)',fontSize:10,fontWeight:700,textTransform:'uppercase',marginBottom:4}}>Equipment Cost</div>
            <div style={{color:'white',fontSize:22,fontWeight:800,fontFamily:'Poppins'}}>₦{fmt(equipCost)}</div>
          </div>
          <div style={{background:C.gold,borderRadius:12,padding:'14px 18px'}}>
            <div style={{color:'rgba(26,46,74,0.7)',fontSize:10,fontWeight:700,textTransform:'uppercase',marginBottom:4}}>CLIENT TOTAL PRICE</div>
            <div style={{color:C.navy,fontSize:22,fontWeight:800,fontFamily:'Poppins'}}>₦{fmt(totalCost)}</div>
          </div>
        </div>
      </div>

      <button onClick={()=>setShown(true)}
        style={{width:'100%',padding:'14px',borderRadius:14,background:C.navy,color:'white',border:'none',cursor:'pointer',fontSize:15,fontWeight:700,fontFamily:'Poppins'}}>
        Generate Quotation Preview
      </button>

      {shown&&(
        <div style={{marginTop:20,background:'white',borderRadius:20,border:`2px solid ${C.navy}`,overflow:'hidden'}}>
          {/* Letterhead */}
          <div style={{background:C.navy,padding:'24px 32px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{color:C.gold,fontSize:22,fontWeight:800,fontFamily:'Poppins'}}>MUSSTECH SOLAR ENERGY</div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:12,marginTop:2}}>Imam Musa · Solar Energy Consultant & Technical Trainer</div>
            </div>
            <div style={{textAlign:'right',color:'rgba(255,255,255,0.7)',fontSize:12}}>
              <div style={{color:C.gold,fontWeight:700,fontSize:14}}>SOLAR QUOTATION</div>
              <div>Date: {client.date}</div>
              <div>Ref: MSE-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>
          <div style={{height:4,background:`linear-gradient(90deg,${C.gold},${C.orange})`}}/>
          <div style={{padding:'28px 32px'}}>
            <div style={{marginBottom:24}}>
              <div style={{fontWeight:700,color:C.navy,fontSize:14,marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>Prepared For</div>
              <div style={{fontSize:15,fontWeight:700,color:C.navy}}>{client.name||'—'}</div>
              <div style={{color:'#718096',fontSize:13}}>{client.address||'—'}</div>
              <div style={{color:'#718096',fontSize:13}}>{client.phone} {client.email}</div>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse',marginBottom:20}}>
              <thead>
                <tr style={{background:C.navy}}>
                  {['Description','Qty','Unit Price (₦)','Total (₦)'].map(h=>(
                    <th key={h} style={{padding:'10px 14px',textAlign:h==='Description'?'left':'right',color:'white',fontSize:12,fontWeight:700}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [`Solar Panel ${system.panelW}W Monocrystalline`,panels,system.panelPrice,panels*system.panelPrice],
                  [`Lithium LiFePO4 Battery ${system.battAh}Ah ${system.voltage}V`,batts,system.battPrice,batts*system.battPrice],
                  [`Hybrid Inverter ${fmtDec(invKva/1000,1)}kVA`,1,system.invPrice,system.invPrice],
                  [`Cables, Breakers, Accessories & Installation`,1,extras,extras],
                ].map(([desc,qty,unit,total],i)=>(
                  <tr key={i} style={{background:i%2===0?C.navyLight:'white'}}>
                    <td style={{padding:'10px 14px',fontSize:13,color:C.navy}}>{desc}</td>
                    <td style={{padding:'10px 14px',fontSize:13,textAlign:'right'}}>{qty}</td>
                    <td style={{padding:'10px 14px',fontSize:13,textAlign:'right'}}>{fmt(unit)}</td>
                    <td style={{padding:'10px 14px',fontSize:13,fontWeight:600,textAlign:'right'}}>{fmt(total)}</td>
                  </tr>
                ))}
                <tr style={{background:C.navyLight}}>
                  <td colSpan={3} style={{padding:'12px 14px',fontWeight:700,color:C.navy,fontSize:13}}>Subtotal</td>
                  <td style={{padding:'12px 14px',fontWeight:700,color:C.navy,textAlign:'right',fontSize:13}}>₦{fmt(equipCost)}</td>
                </tr>
                <tr style={{background:C.navy}}>
                  <td colSpan={3} style={{padding:'14px',fontWeight:800,color:C.gold,fontSize:15,fontFamily:'Poppins'}}>TOTAL INVESTMENT</td>
                  <td style={{padding:'14px',fontWeight:800,color:C.gold,textAlign:'right',fontSize:18,fontFamily:'Poppins'}}>₦{fmt(totalCost)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{background:C.navyLight,borderRadius:12,padding:'14px 18px',fontSize:12,color:'#718096'}}>
              <div style={{fontWeight:700,color:C.navy,marginBottom:6}}>Terms & Validity</div>
              <div>• This quotation is valid for 14 days from the date above</div>
              <div>• Prices are in Nigerian Naira (NGN) and subject to change with component price fluctuations</div>
              <div>• 50% deposit required to confirm order. Balance on delivery and installation completion</div>
              <div>• Installation warranty: 12 months. Equipment warranty: as per manufacturer terms</div>
            </div>
            <div style={{marginTop:20,paddingTop:20,borderTop:'1px solid #E2E8F0',textAlign:'center',color:'#A0AEC0',fontSize:12}}>
              <div style={{fontWeight:700,color:C.navy,marginBottom:4}}>Plan Smart. Power Better.</div>
              Musstech Solar Energy · selar.com/89d88rao55
            </div>
          </div>
          <button onClick={()=>window.print()}
            style={{width:'100%',padding:'14px',background:C.gold,color:C.navy,border:'none',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:'Poppins'}}>
            🖨️ Print / Save as PDF
          </button>
        </div>
      )}
    </div>
  )
}

// ── HOME PAGE ───────────────────────────────────────────────────
function HomePage({setPage}){
  const features=[
    {icon:'⚡',title:'Solar Calculators',desc:'Load, panel, battery, inverter, cable & breaker sizing with all MSE formulas',page:'calculators',color:C.gold},
    {icon:'🔍',title:'Troubleshoot Like a Pro',desc:'Fault wizard, error codes for all 6 brands, maintenance checklists',page:'troubleshoot',color:C.orange},
    {icon:'📚',title:'MSE Ebook Store',desc:'Calculate It Right · Wire It Right · Configure It Right · Troubleshoot Like a Pro',page:'store',color:C.blue},
    {icon:'📋',title:'Quotation Generator',desc:'Auto-size system, generate professional client and consultant quotations',page:'quotation',color:C.green},
  ]
  return(
    <div>
      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${C.navy} 0%,${C.blue} 100%)`,borderRadius:24,padding:'36px 28px',marginBottom:28,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(245,166,35,0.08)'}}/>
        <div style={{position:'absolute',bottom:-60,left:-30,width:160,height:160,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>
        <div style={{position:'relative'}}>
          <div style={{color:C.gold,fontSize:12,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Musstech Solar Energy</div>
          <h1 style={{color:'white',fontSize:28,fontWeight:800,fontFamily:'Poppins',margin:'0 0 8px 0',lineHeight:1.2}}>Solar Hub</h1>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:14,margin:'0 0 24px 0',lineHeight:1.6}}>Professional solar calculators, troubleshooting, training and quotation tools — all in one place.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button onClick={()=>setPage('calculators')} style={{background:C.gold,color:C.navy,padding:'10px 22px',borderRadius:12,border:'none',cursor:'pointer',fontWeight:700,fontSize:13}}>Start Calculating →</button>
            <button onClick={()=>setPage('store')} style={{background:'rgba(255,255,255,0.15)',color:'white',padding:'10px 22px',borderRadius:12,border:'none',cursor:'pointer',fontWeight:600,fontSize:13}}>View Books</button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16,marginBottom:28}}>
        {features.map(f=>(
          <button key={f.page} onClick={()=>setPage(f.page)}
            style={{background:'white',border:`1.5px solid #E2E8F0`,borderRadius:18,padding:'22px',cursor:'pointer',textAlign:'left',transition:'all 0.2s',width:'100%'}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=f.color;e.currentTarget.style.boxShadow=`0 4px 20px ${f.color}22`}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.boxShadow='none'}}>
            <div style={{fontSize:32,marginBottom:12}}>{f.icon}</div>
            <div style={{fontWeight:700,color:C.navy,fontSize:15,fontFamily:'Poppins',marginBottom:6}}>{f.title}</div>
            <div style={{color:'#718096',fontSize:12,lineHeight:1.6}}>{f.desc}</div>
            <div style={{color:f.color,fontSize:12,fontWeight:700,marginTop:12}}>Open →</div>
          </button>
        ))}
      </div>

      {/* Tagline */}
      <div style={{textAlign:'center',padding:'20px',borderTop:'1px solid #E2E8F0'}}>
        <div style={{color:C.navy,fontWeight:800,fontFamily:'Poppins',fontSize:18}}>Plan Smart.</div>
        <div style={{color:C.gold,fontWeight:800,fontFamily:'Poppins',fontSize:18}}>Power Better.</div>
        <div style={{color:'#A0AEC0',fontSize:12,marginTop:8}}>Imam Musa · Solar Energy Consultant & Technical Trainer · Musstech Solar Energy</div>
      </div>
    </div>
  )
}

// ── NAVIGATION ──────────────────────────────────────────────────
const NAV=[
  {id:'home',label:'Home',icon:'🏠'},
  {id:'calculators',label:'Calculate',icon:'⚡'},
  {id:'troubleshoot',label:'Diagnose',icon:'🔍'},
  {id:'store',label:'Books',icon:'📚'},
  {id:'quotation',label:'Quote',icon:'📋'},
]

// ── APP ROOT ────────────────────────────────────────────────────
export default function App(){
  const [page, setPage] = useState('home')

  const pageTitle={
    home:'Musstech Solar Hub',
    calculators:'Solar Calculators',
    troubleshoot:'Troubleshoot Like a Pro',
    store:'MSE Ebook Store',
    quotation:'Quotation Generator',
  }

  return(
    <div style={{minHeight:'100vh',background:'#F7F8FA',fontFamily:'Inter,sans-serif'}}>
      {/* Desktop Sidebar */}
      <div style={{display:'none'}} className="md-sidebar">
        {/* handled below in inline style */}
      </div>

      {/* Layout */}
      <div style={{display:'flex',minHeight:'100vh'}}>
        {/* Sidebar (desktop) */}
        <div style={{width:220,background:C.navy,position:'fixed',top:0,left:0,bottom:0,display:'flex',flexDirection:'column',zIndex:100,
          '@media(max-width:768px)':{display:'none'}}}>
          {/* Logo */}
          <div style={{padding:'28px 20px 20px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            <div style={{color:C.gold,fontWeight:800,fontFamily:'Poppins',fontSize:16,lineHeight:1.2}}>Musstech</div>
            <div style={{color:'white',fontWeight:800,fontFamily:'Poppins',fontSize:16,lineHeight:1.2}}>Solar Hub</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:10,marginTop:4}}>Plan Smart. Power Better.</div>
          </div>
          {/* Nav items */}
          <nav style={{flex:1,padding:'16px 12px'}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setPage(n.id)}
                style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,border:'none',cursor:'pointer',
                  background:page===n.id?'rgba(245,166,35,0.15)':'transparent',
                  marginBottom:4,transition:'all 0.15s',textAlign:'left'}}>
                <span style={{fontSize:18}}>{n.icon}</span>
                <span style={{color:page===n.id?C.gold:'rgba(255,255,255,0.7)',fontWeight:page===n.id?700:500,fontSize:13}}>{n.label}</span>
              </button>
            ))}
          </nav>
          <div style={{padding:'16px 20px',borderTop:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',fontSize:10}}>
            © 2025 Musstech Solar Energy
          </div>
        </div>

        {/* Main Content */}
        <div style={{flex:1,marginLeft:220,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
          {/* Top Bar */}
          <div style={{background:'white',borderBottom:'1px solid #E2E8F0',padding:'16px 28px',position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <h1 style={{margin:0,fontSize:18,fontWeight:800,color:C.navy,fontFamily:'Poppins'}}>{pageTitle[page]}</h1>
            <a href="https://selar.com/89d88rao55" target="_blank" rel="noreferrer"
              style={{background:C.gold,color:C.navy,padding:'7px 16px',borderRadius:10,fontSize:12,fontWeight:700,textDecoration:'none'}}>
              📚 Buy Books
            </a>
          </div>
          {/* Page Content */}
          <div style={{flex:1,padding:'28px',maxWidth:900}}>
            {page==='home'&&<HomePage setPage={setPage}/>}
            {page==='calculators'&&<CalculatorsPage/>}
            {page==='troubleshoot'&&<TroubleshootingPage/>}
            {page==='store'&&<EbookStore/>}
            {page==='quotation'&&<QuotationPage/>}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <style>{`
        @media(max-width:768px){
          div[style*="marginLeft:220"]{margin-left:0!important;}
          div[style*="width:220"]{display:none!important;}
          .mobile-bottom-nav{display:flex!important;}
          div[style*="flex:1,padding:'28px'"]{padding:16px!important;padding-bottom:80px!important;}
        }
        @media(min-width:769px){
          .mobile-bottom-nav{display:none!important;}
        }
        @media print{
          div[style*="width:220"],div[style*="position:sticky"],div[style*="position:fixed"]{display:none!important;}
          div[style*="marginLeft:220"]{margin-left:0!important;}
        }
      `}</style>
      <div className="mobile-bottom-nav" style={{position:'fixed',bottom:0,left:0,right:0,background:'white',borderTop:'1px solid #E2E8F0',display:'none',zIndex:200,paddingBottom:'env(safe-area-inset-bottom)'}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)}
            style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'8px 4px',border:'none',cursor:'pointer',
              background:page===n.id?C.navyLight:'white',gap:2,transition:'all 0.15s'}}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:700,color:page===n.id?C.navy:'#A0AEC0',letterSpacing:'0.03em'}}>{n.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
