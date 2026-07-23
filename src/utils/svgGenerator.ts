import { PageConfig, PlannerState } from '../types';

function renderWrappedTextOrLines(
  text: string, 
  x: number, 
  y: number, 
  lineHeight: number, 
  maxLines: number, 
  lineWidth: number, 
  fontFamily: string, 
  fontSize: number, 
  color: string, 
  fontWeight: string = "500",
  isItalic: boolean = false
): string {
  if (!text || text.trim() === '') {
    // Render elegant lined writing space
    let linesSvg = '';
    for (let i = 0; i < maxLines; i++) {
      const lineY = y + i * lineHeight + fontSize;
      linesSvg += `<line x1="${x}" y1="${lineY}" x2="${x + lineWidth}" y2="${lineY}" stroke="#E6E3DB" stroke-width="0.75" />\n`;
    }
    return linesSvg;
  }

  // Wrap words based on estimated character width
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  const maxChars = Math.max(5, Math.floor(lineWidth / (fontSize * 0.52)));

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  let tspanSvg = `<text x="${x}" y="${y + fontSize - 2}" font-family="${fontFamily}" font-size="${fontSize}" fill="${color}" font-weight="${fontWeight}" ${isItalic ? 'font-style="italic"' : ''}>`;
  lines.slice(0, maxLines).forEach((line, i) => {
    tspanSvg += `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`;
  });
  tspanSvg += `</text>`;
  return tspanSvg;
}

/**
 * High-Fidelity SVG Vector Generator
 * Renders pristine A5 portrait print-ready vector pages that exactly match the Personal OS v2.0 design framework.
 */
export function generateSVGString(page: PageConfig, state: PlannerState): string {
  const width = 598; // A5 equivalent width
  const height = 840; // A5 equivalent height

  // Font typography definitions
  const fontMontserrat = "system-ui, -apple-system, 'Montserrat', sans-serif";
  const fontInter = "system-ui, -apple-system, 'Inter', sans-serif";
  const fontPlayfair = "Georgia, 'Playfair Display', serif";

  const getText = (key: string, fallback: string) => {
    return state.customTexts[key] !== undefined ? state.customTexts[key] : fallback;
  };

  // Base SVG header and page layout scaffolding
  let svgContent = `
    <!-- Background Canvas -->
    <rect width="${width}" height="${height}" fill="#F6F5F0" />
    
    <!-- Fine alignment crop guides -->
    <rect x="25" y="25" width="${width - 50}" height="${height - 50}" fill="none" stroke="#E6E3DB" stroke-width="0.75" stroke-dasharray="3 3" />
  `;

  // Do not show header on Cover Page (Page 1)
  if (page.type !== 'cover_page') {
    svgContent += `
      <!-- Standard Layout Header -->
      <g id="layout-header">
        <text x="40" y="60" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1.5">EXECUTE PERSONAL PLANNER</text>
        <text x="${width - 40}" y="60" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#5C6B73" text-anchor="end" letter-spacing="1.5">PAGE ${String(page.id).padStart(2, '0')}</text>
        <line x1="40" y1="72" x2="${width - 40}" y2="72" stroke="#0E2240" stroke-width="1.5" />
      </g>
    `;
  }

  // Generate page type specific templates matching the screenshot designs
  switch (page.type) {
    case 'cover_page': {
      const owner = getText('cover_owner', 'John Doe');
      const year = getText('cover_year', '2027');
      const start = getText('cover_start', '01 / 01 / 2027');
      const end = getText('cover_end', '12 / 31 / 2027');

      svgContent += `
        <!-- Left Side Main Accent Cover -->
        <g id="cover-brand">
          <text x="40" y="60" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1.5">EXECUTE PERSONAL PLANNER</text>
          <text x="${width - 40}" y="60" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#5C6B73" text-anchor="end" letter-spacing="1.5">VERSION 2.1</text>
          <line x1="40" y1="72" x2="${width - 40}" y2="72" stroke="#0E2240" stroke-width="1.5" />

          <!-- Gigantic Typography Display -->
          <text x="40" y="320" font-family="${fontMontserrat}" font-weight="800" font-size="44" fill="#0E2240" letter-spacing="-1.5">THE</text>
          <text x="40" y="375" font-family="${fontMontserrat}" font-weight="800" font-size="44" fill="#0E2240" letter-spacing="-1.5">STRATEGIC</text>
          <text x="40" y="430" font-family="${fontMontserrat}" font-weight="800" font-size="44" fill="#0E2240" letter-spacing="-1.5">YEAR HORIZON</text>

          <!-- Core Intro Paragraph -->
          <text x="40" y="480" font-family="${fontInter}" font-size="11" fill="#5C6B73" font-weight="500">
            <tspan x="40" dy="0">A rigorous operational framework engineered for systemized intentional planning,</tspan>
            <tspan x="40" dy="18">consistent daily execution, and relentless self-reflection.</tspan>
          </text>

          <!-- Navigation Pill Buttons -->
          <g transform="translate(40, 535)">
            <!-- Pill 1 -->
            <rect x="0" y="0" width="130" height="28" rx="6" fill="#0E2240" />
            <text x="65" y="17" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#FFFFFF" text-anchor="middle">PLAN INTENTIONALLY</text>

            <!-- Pill 2 -->
            <rect x="140" y="0" width="138" height="28" rx="6" fill="#E6E9EE" />
            <text x="209" y="17" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" text-anchor="middle">EXECUTE CONSISTENTLY</text>
          </g>
        </g>

        <!-- Right Side Planner Metadata Card -->
        <g id="metadata-card" transform="translate(345, 280)">
          <rect width="207" height="280" rx="8" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.2" />
          
          <!-- Card Header with Icon representation -->
          <rect x="15" y="15" width="10" height="10" fill="none" stroke="#0E2240" stroke-width="1.5" />
          <line x1="18" y1="20" x2="22" y2="20" stroke="#0E2240" stroke-width="1.5" />
          <text x="32" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8" fill="#0E2240" letter-spacing="1">PLANNER METADATA</text>
          <line x1="15" y1="34" x2="192" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <!-- Field 1: Owner -->
          <text x="15" y="60" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC" letter-spacing="0.5">OWNER / OPERATOR</text>
          <text x="15" y="76" font-family="${fontInter}" font-weight="600" font-size="11" fill="#0E2240">${owner}</text>
          <line x1="15" y1="84" x2="192" y2="84" stroke="#0E2240" stroke-width="0.75" />

          <!-- Field 2: Operating Year -->
          <text x="15" y="110" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC" letter-spacing="0.5">OPERATING YEAR</text>
          <text x="15" y="126" font-family="${fontInter}" font-weight="700" font-size="11" fill="#0E2240">${year}</text>
          <line x1="15" y1="134" x2="192" y2="134" stroke="#0E2240" stroke-width="0.75" />

          <!-- Field 3 & 4 Split: Start / End -->
          <text x="15" y="160" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC" letter-spacing="0.5">START DATE</text>
          <text x="15" y="174" font-family="monospace" font-size="9" font-weight="600" fill="#0E2240">${start}</text>
          <line x1="15" y1="182" x2="100" y2="182" stroke="#0E2240" stroke-width="0.75" />

          <text x="110" y="160" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC" letter-spacing="0.5">END DATE</text>
          <text x="110" y="174" font-family="monospace" font-size="9" font-weight="600" fill="#0E2240">${end}</text>
          <line x1="110" y1="182" x2="192" y2="182" stroke="#0E2240" stroke-width="0.75" />

          <!-- Badge text at bottom -->
          <text x="103" y="224" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC" text-anchor="middle" letter-spacing="1">DISCIPLINE TODAY. FREEDOM TOMORROW.</text>
        </g>
      `;
      break;
    }

    case 'annual_vision': {
      // Fetch dynamic lists from state
      const goals = state.annualGoals || [];
      const projects = state.projects || [];

      const rev = getText('vision_metric_revenue', '$150,000');
      const sav = getText('vision_metric_savings', '$45,000');
      const hideFinancial = getText('hide_financial_goals', 'false') === 'true';

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Year Plan</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Listing goals, projects, and financial objectives for the year.</text>

        <!-- Left Column Card: WHAT I WANT TO ACHIEVE THIS YEAR -->
        <g transform="translate(40, 145)">
          <rect width="335" height="650" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Table Header/Title -->
          <g transform="translate(15, 20)">
            <line x1="0" y1="2" x2="8" y2="2" stroke="#0E2240" stroke-width="1.5" />
            <line x1="0" y1="5" x2="8" y2="5" stroke="#0E2240" stroke-width="1.5" />
            <line x1="0" y1="8" x2="8" y2="8" stroke="#0E2240" stroke-width="1.5" />
            <text x="14" y="8" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">ANNUAL TARGETS &amp; GOALS</text>
          </g>

          <!-- Table Headers -->
          <g transform="translate(15, 45)">
            <text x="0" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC" letter-spacing="0.5">ID</text>
            <text x="35" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC" letter-spacing="0.5">WHAT TO ACHIEVE THIS YEAR</text>
            <text x="215" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC" letter-spacing="0.5">TARGET</text>
            <text x="270" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC" letter-spacing="0.5">PROGRESS</text>
            <line x1="0" y1="18" x2="305" y2="18" stroke="#0E2240" stroke-width="1" />
          </g>
      `;

      // Loop over up to 11 goals to perfectly fill 650px height
      const maxGoalsToShow = 11;
      for (let i = 0; i < maxGoalsToShow; i++) {
        const goal = goals[i];
        const y = 80 + i * 50;

        if (goal) {
          const goalId = String(i + 1).padStart(2, '0');
          // Handle long milestone text safely (truncate if > 28 chars for beauty)
          const desc = goal.milestone.length > 28 ? goal.milestone.substring(0, 26) + '...' : goal.milestone;
          const target = goal.targetDate || 'Q4';
          const statusVal = goal.status || 'Planned';
          const progressPct = goal.progress || 0;

          // Decide tag color based on status
          let statusColor = '#6B7280'; // gray
          if (statusVal === 'Completed') statusColor = '#10B981'; // emerald
          else if (statusVal === 'In Progress') statusColor = '#D97706'; // amber
          else if (statusVal === 'Blocked') statusColor = '#EF4444'; // rose

          svgContent += `
            <g transform="translate(15, ${y})">
              <rect x="-10" y="-12" width="325" height="42" rx="4" fill="${i % 2 === 0 ? '#FAF9F6' : 'transparent'}" />
              
              <text x="0" y="16" font-family="${fontMontserrat}" font-weight="700" font-size="9" fill="#0E2240">${goalId}</text>
              <text x="35" y="16" font-family="${fontInter}" font-size="9.5" fill="#22252A" font-weight="600">${desc}</text>
              <text x="215" y="16" font-family="${fontInter}" font-size="9.5" fill="#5C6B73" font-weight="500">${target}</text>
              
              <!-- Progress indicator & Status -->
              <text x="270" y="12" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="${statusColor}">${progressPct}%</text>
              <text x="270" y="24" font-family="${fontInter}" font-size="7" fill="#8C92AC" font-weight="600" letter-spacing="0.2">${statusVal.toUpperCase()}</text>
              
              <line x1="0" y1="34" x2="305" y2="34" stroke="#E6E3DB" stroke-width="0.5" />
            </g>
          `;
        } else {
          // Empty placeholder row
          svgContent += `
            <g transform="translate(15, ${y})">
              <text x="0" y="16" font-family="${fontMontserrat}" font-weight="700" font-size="9" fill="#8C92AC" opacity="0.3">${String(i + 1).padStart(2, '0')}</text>
              <text x="35" y="16" font-family="${fontInter}" font-style="italic" font-size="9" fill="#8C92AC" opacity="0.3">Empty target slot</text>
              <line x1="0" y1="34" x2="305" y2="34" stroke="#E6E3DB" stroke-width="0.25" opacity="0.5" />
            </g>
          `;
        }
      }

      svgContent += `
        </g> <!-- End Left Column -->
      `;

      if (!hideFinancial) {
        svgContent += `
          <!-- Right Column Top: FINANCIAL GOALS -->
          <g transform="translate(395, 145)">
            <rect width="163" height="200" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
            
            <!-- Title -->
            <g transform="translate(15, 18)">
              <path d="M0 5 L4 2 L8 5 L12 1" fill="none" stroke="#0E2240" stroke-width="1.5" />
              <text x="18" y="8" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">FINANCIAL GOALS</text>
            </g>

            <!-- Metric 1: Revenue -->
            <rect x="12" y="38" width="139" height="65" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
            <text x="22" y="54" font-family="${fontMontserrat}" font-size="6.5" font-weight="700" fill="#8C92AC" letter-spacing="0.5">REVENUE TARGET</text>
            <text x="22" y="74" font-family="monospace" font-size="14" font-weight="800" fill="#0E2240">${rev}</text>
            <text x="22" y="88" font-family="${fontInter}" font-size="7" font-weight="500" fill="#8C92AC">Gross targeted operations</text>

            <!-- Metric 2: Savings -->
            <rect x="12" y="115" width="139" height="65" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
            <text x="22" y="131" font-family="${fontMontserrat}" font-size="6.5" font-weight="700" fill="#8C92AC" letter-spacing="0.5">SAVINGS GOAL</text>
            <text x="22" y="151" font-family="monospace" font-size="14" font-weight="800" fill="#0E2240">${sav}</text>
            <text x="22" y="165" font-family="${fontInter}" font-size="7" font-weight="500" fill="#8C92AC">Retained reserve benchmark</text>
          </g>
        `;
      }

      const projectsY = hideFinancial ? 145 : 365;
      const projectsH = hideFinancial ? 650 : 430;
      const maxProjectsToShow = hideFinancial ? 9 : 6;

      svgContent += `
        <!-- Right Column Bottom: ANNUAL PROJECTS -->
        <g transform="translate(395, ${projectsY})">
          <rect width="163" height="${projectsH}" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Title -->
          <g transform="translate(15, 20)">
            <rect x="0" y="0" width="8" height="8" rx="1.5" fill="#0E2240" />
            <text x="14" y="8" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">ANNUAL PROJECTS</text>
          </g>
      `;

      // Loop over projects (up to maxProjectsToShow items to fit nicely)
      for (let j = 0; j < maxProjectsToShow; j++) {
        const proj = projects[j];
        const y = 42 + j * 62;

        if (proj) {
          // Determine status color & indicator
          let statusColor = '#6B7280';
          if (proj.status === 'Completed') statusColor = '#10B981';
          else if (proj.status === 'In Progress') statusColor = '#3F51B5';
          else if (proj.status === 'Blocked') statusColor = '#EF4444';

          const projName = proj.name.length > 22 ? proj.name.substring(0, 20) + '...' : proj.name;

          svgContent += `
            <g transform="translate(15, ${y})">
              <!-- Project text details -->
              <text x="0" y="14" font-family="${fontInter}" font-weight="700" font-size="9" fill="#22252A">${projName}</text>
              <text x="0" y="27" font-family="monospace" font-size="7.5" fill="#8C92AC" font-weight="600">${proj.due}</text>
              <text x="133" y="27" font-family="${fontMontserrat}" font-weight="700" font-size="8" fill="${statusColor}" text-anchor="end">${proj.pct}%</text>

              <!-- Custom Mini Progress Bar -->
              <rect x="0" y="34" width="133" height="3" rx="1.5" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
              <rect x="0" y="34" width="${Math.min(133, Math.max(0, (proj.pct / 100) * 133))}" height="3" rx="1.5" fill="${statusColor}" />
              
              <line x1="0" y1="48" x2="133" y2="48" stroke="#E6E3DB" stroke-width="0.5" opacity="0.6" />
            </g>
          `;
        } else {
          // Empty project placeholder row
          svgContent += `
            <g transform="translate(15, ${y})">
              <text x="0" y="20" font-family="${fontInter}" font-style="italic" font-size="9" fill="#8C92AC" opacity="0.3">Empty project slot</text>
              <line x1="0" y1="48" x2="133" y2="48" stroke="#E6E3DB" stroke-width="0.25" opacity="0.5" />
            </g>
          `;
        }
      }

      svgContent += `
        </g> <!-- End Right Column Bottom -->
      `;
      break;
    }

    case 'year_horizon': {
      const northStar = getText('horizon_north_star', '');
      const mission = getText('horizon_mission', '');

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">2027 Year Horizon</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Your entire high-level roadmap and structural alignment mapped out at a single glance.</text>

        <!-- 12-Month Grid Block Left (Cols 3 x Rows 4) -->
        <g transform="translate(40, 145)">
          <rect width="335" height="495" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Loop months -->
          ${['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'].map((m, idx) => {
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const mX = 12 + col * 108;
            const mY = 12 + row * 120;
            return `
              <g transform="translate(${mX}, ${mY})">
                <text x="50" y="12" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#0E2240" text-anchor="middle" letter-spacing="0.5">${m}</text>
                <line x1="10" y1="18" x2="90" y2="18" stroke="#E6E3DB" stroke-width="0.5" />
                
                <!-- Tiny calendar days grid grid -->
                <g font-family="${fontInter}" font-size="4.5" font-weight="600" fill="#8C92AC" text-anchor="middle">
                  <!-- MTWTFSS header -->
                  <text x="14" y="28">S</text><text x="26" y="28">M</text><text x="38" y="28">T</text><text x="50" y="28">W</text><text x="62" y="28">T</text><text x="74" y="28">F</text><text x="86" y="28">S</text>
                  
                  <!-- Render a few tiny mock dates -->
                  <text x="14" y="38">27</text><text x="26" y="38">28</text><text x="38" y="38">29</text><text x="50" y="38">30</text><text x="62" y="38">31</text><text x="74" y="38" fill="#0E2240" font-weight="800">1</text><text x="86" y="38">2</text>
                  <text x="14" y="46">3</text><text x="26" y="46">4</text><text x="38" y="46">5</text><text x="50" y="46">6</text><text x="62" y="46">7</text><text x="74" y="46">8</text><text x="86" y="46">9</text>
                  <text x="14" y="54">10</text><text x="26" y="54" fill="#0E2240" font-weight="800">11</text><text x="38" y="54">12</text><text x="50" y="54">13</text><text x="62" y="54">14</text><text x="74" y="54">15</text><text x="86" y="54">16</text>
                  <text x="14" y="62">17</text><text x="26" y="62">18</text><text x="38" y="62">19</text><text x="50" y="62" fill="#D97706" font-weight="800">20</text><text x="62" y="62">21</text><text x="74" y="62">22</text><text x="86" y="62">23</text>
                  <text x="14" y="70">24</text><text x="26" y="70">25</text><text x="38" y="70">26</text><text x="50" y="70">27</text><text x="62" y="70">28</text><text x="74" y="70">29</text><text x="86" y="70">30</text>
                </g>
              </g>
            `;
          }).join('')}
        </g>

        <!-- Right Side panels: LEGEND & NORTH STAR -->
        <g transform="translate(390, 145)">
          <!-- HORIZON LEGEND -->
          <rect width="162" height="110" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📍 HORIZON LEGEND</text>
          <line x1="15" y1="34" x2="147" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <!-- Legend list -->
          <!-- Row 1 -->
          <circle cx="20" cy="52" r="4.5" fill="#3B82F6" />
          <text x="32" y="55" font-family="${fontInter}" font-size="9" fill="#22252A" font-weight="600">Appointment</text>
          
          <circle cx="102" cy="52" r="4.5" fill="#10B981" />
          <text x="114" y="55" font-family="${fontInter}" font-size="9" fill="#22252A" font-weight="600">Milestone</text>

          <!-- Row 2 -->
          <circle cx="20" cy="78" r="4.5" fill="#F59E0B" />
          <text x="32" y="81" font-family="${fontInter}" font-size="9" fill="#22252A" font-weight="600">Launch</text>
          
          <circle cx="102" cy="78" r="4.5" fill="#EF4444" />
          <text x="114" y="81" font-family="${fontInter}" font-size="9" fill="#22252A" font-weight="600">Travel</text>
        </g>

        <!-- North Star Card -->
        <g transform="translate(390, 270)">
          <rect width="162" height="370" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">🧭 NORTH STAR / THEME</text>
          <line x1="15" y1="34" x2="147" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Quote block -->
          <g transform="translate(0, 52)">
            ${renderWrappedTextOrLines(northStar, 15, 0, 16, 5, 132, fontPlayfair, 10, "#0E2240", "500", true)}
          </g>

          <!-- YEAR MISSION title -->
          <g transform="translate(15, 162)">
            <path d="M 0 0 L 8 -5 L 16 0 L 16 12 L 0 12 Z" fill="#0E2240" />
            <text x="24" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="8" fill="#0E2240" letter-spacing="1">YEAR MISSION</text>
          </g>

          <!-- Year mission text wrapped -->
          <g transform="translate(0, 185)">
            ${renderWrappedTextOrLines(mission, 15, 0, 15, 10, 132, fontInter, 9, "#5C6B73")}
          </g>
        </g>
      `;
      break;
    }

    case 'projects_portfolio': {
      const activeP = getText('projects_stat_active', '—');
      const compP = getText('projects_stat_completed', '—');
      const delP = getText('projects_stat_delayed', '—');
      const rate = getText('projects_stat_rate', '—');
      const qFocus = getText('projects_quarter_focus', '');

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Annual Projects Portfolio</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Manage, track, and execute your high-level strategic projects and outcomes.</text>

        <!-- 2x2 Projects Matrix left side -->
        <g transform="translate(40, 145)">
          <g id="projects-grid-cover">
      `;

      state.projects.forEach((proj, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cardX = col * 168;
        const cardY = row * 252;
        const barW = 120 * (proj.pct / 100);

        svgContent += `
          <g transform="translate(${cardX}, ${cardY})">
            <rect width="158" height="238" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
            
            <!-- Category Tag -->
            <rect x="12" y="15" width="76" height="15" rx="3" fill="#0E2240" />
            <text x="50" y="25" font-family="${fontMontserrat}" font-weight="700" font-size="6" fill="#FFFFFF" text-anchor="middle">PROJECT ${String.fromCharCode(65 + idx)}</text>
            <text x="146" y="26" font-family="${fontInter}" font-weight="700" font-size="7.5" fill="#10B981" text-anchor="end">High Priority</text>

            <!-- Project Title -->
            <text x="12" y="52" font-family="${fontMontserrat}" font-weight="700" font-size="10" fill="#0E2240">${proj.name || 'Empty project slot'}</text>
            <line x1="12" y1="62" x2="146" y2="62" stroke="#E6E3DB" stroke-width="0.5" />

            <!-- Description body lines -->
            <g transform="translate(0, 72)">
              ${renderWrappedTextOrLines("", 12, 0, 18, 3, 134, fontInter, 8.5, "#5C6B73")}
            </g>

            <!-- Progress Block -->
            <text x="12" y="145" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC" letter-spacing="0.5">PROGRESS</text>
            <text x="146" y="145" font-family="monospace" font-size="9" font-weight="700" fill="#0E2240" text-anchor="end">${proj.pct}%</text>
            
            <rect x="12" y="152" width="134" height="5" rx="2.5" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
            <rect x="12" y="152" width="${barW}" height="5" rx="2.5" fill="#0E2240" />
          </g>
        `;
      });

      svgContent += `
          </g>
        </g>

        <!-- Right Side: Portfolio Stats Card -->
        <g transform="translate(390, 145)">
          <rect width="162" height="345" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">💼 PORTFOLIO STATS</text>
          <line x1="15" y1="34" x2="147" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Stats lines -->
          <text x="15" y="58" font-family="${fontInter}" font-size="9" fill="#5C6B73" font-weight="500">Active Projects</text>
          <text x="147" y="58" font-family="${fontMontserrat}" font-size="10" font-weight="700" fill="#0E2240" text-anchor="end">${activeP}</text>
          <line x1="15" y1="68" x2="147" y2="68" stroke="#E6E3DB" stroke-width="0.5" />

          <text x="15" y="92" font-family="${fontInter}" font-size="9" fill="#5C6B73" font-weight="500">Completed (YTD)</text>
          <text x="147" y="92" font-family="${fontMontserrat}" font-size="10" font-weight="700" fill="#0E2240" text-anchor="end">${compP}</text>
          <line x1="15" y1="102" x2="147" y2="102" stroke="#E6E3DB" stroke-width="0.5" />

          <text x="15" y="126" font-family="${fontInter}" font-size="9" fill="#5C6B73" font-weight="500">Delayed Projects</text>
          <text x="147" y="126" font-family="${fontMontserrat}" font-size="10" font-weight="700" fill="#D97706" text-anchor="end">${delP}</text>
          <line x1="15" y1="136" x2="147" y2="136" stroke="#E6E3DB" stroke-width="0.5" />

          <text x="15" y="160" font-family="${fontInter}" font-size="9" fill="#5C6B73" font-weight="500">Completion Rate</text>
          <text x="147" y="160" font-family="monospace" font-size="10.5" font-weight="700" fill="#0E2240" text-anchor="end">${rate}</text>
          <line x1="15" y1="170" x2="147" y2="170" stroke="#E6E3DB" stroke-width="0.5" />
        </g>

        <!-- Current Quarter Focus Banner -->
        <g transform="translate(390, 505)">
          <rect width="162" height="135" rx="6" fill="#0E2240" />
          
          <text x="81" y="44" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC" text-anchor="middle" letter-spacing="1">CURRENT QUARTER FOCUS</text>
          <g transform="translate(0, 64)">
            ${renderWrappedTextOrLines(qFocus, 10, 0, 16, 3, 142, fontMontserrat, 9.5, "#FFFFFF", "800")}
          </g>
        </g>
      `;
      break;
    }

    case 'quarterly_roadmap': {
      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Quarterly Strategy Roadmap</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Breakdown your strategic vision into quarterly, manageable sprints.</text>

        <!-- 4 Equal Column Cards -->
        <g transform="translate(40, 145)">
          ${[1, 2, 3, 4].map((q, idx) => {
            const colX = idx * 131;
            const focus = getText(`q${q}_focus`, '');
            const m1 = getText(`q${q}_m1`, '');
            const m2 = getText(`q${q}_m2`, '');
            const m1_done = getText(`q${q}_m1_done`, 'false') === 'true';
            const m2_done = getText(`q${q}_m2_done`, 'false') === 'true';
            const status = getText(`q${q}_status`, '0');
            const barW = 100 * (parseFloat(status) / 100 || 0);

            return `
              <g transform="translate(${colX}, 0)">
                <rect width="123" height="495" rx="6" fill="#FFFFFF" stroke="#0E2240" stroke-width="${q === 1 ? '1.5' : '1'}" />
                
                <!-- Quarter Header -->
                <rect x="0" y="0" width="123" height="25" rx="4" fill="#0E2240" />
                <rect x="0" y="15" width="123" height="10" fill="#0E2240" />
                <text x="12" y="16" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#FFFFFF" letter-spacing="0.5">QUARTER 0${q}</text>

                <!-- FOCUS OBJECTIVE -->
                <text x="12" y="44" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC" letter-spacing="0.5">FOCUS OBJECTIVE</text>
                
                <!-- Focus body text wrapped -->
                <g transform="translate(0, 56)">
                  ${renderWrappedTextOrLines(focus, 12, 0, 14, 4, 100, fontInter, 8, "#22252A", "600")}
                </g>

                <line x1="12" y1="120" x2="111" y2="120" stroke="#E6E3DB" stroke-width="0.5" />

                <!-- KEY MILESTONES -->
                <text x="12" y="140" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC" letter-spacing="0.5">KEY MILESTONES</text>

                <!-- Milestone 1 -->
                <g transform="translate(12, 155)">
                  <!-- Checkbox -->
                  <rect width="8" height="8" rx="2" fill="${m1_done ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.75" />
                  ${m1_done ? '<path d="M 2 4 L 4 6 L 7 2" stroke="#FFFFFF" stroke-width="1" fill="none" />' : ''}
                  <g transform="translate(0, -2)">
                    ${renderWrappedTextOrLines(m1, 14, 0, 11, 4, 85, fontInter, 8, "#5C6B73")}
                  </g>
                </g>

                <!-- Milestone 2 -->
                <g transform="translate(12, 215)">
                  <rect width="8" height="8" rx="2" fill="${m2_done ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.75" />
                  ${m2_done ? '<path d="M 2 4 L 4 6 L 7 2" stroke="#FFFFFF" stroke-width="1" fill="none" />' : ''}
                  <g transform="translate(0, -2)">
                    ${renderWrappedTextOrLines(m2, 14, 0, 11, 4, 85, fontInter, 8, "#5C6B73")}
                  </g>
                </g>

                <!-- Status Progress bar at bottom -->
                <text x="12" y="450" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#0E2240" letter-spacing="0.5">Status</text>
                <text x="111" y="450" font-family="monospace" font-size="8" font-weight="700" fill="#0E2240" text-anchor="end">${status}%</text>
                <rect x="12" y="458" width="100" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
                <rect x="12" y="458" width="${barW}" height="4" rx="2" fill="#0E2240" />
              </g>
            `;
          }).join('')}
        </g>
      `;
      break;
    }

    case 'system_performance': {
      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">System Performance Trend</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">A mathematical projection of efficiency vectors and strategy execution metrics.</text>

        <!-- Left Column Card: Line chart -->
        <g transform="translate(40, 145)">
          <rect width="335" height="495" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📊 PRODUCTIVITY INDEX (YTD)</text>
          <line x1="15" y1="34" x2="320" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <!-- Chart Gridlines and Path -->
          <!-- Coordinates mapping: Q1(55, 380), Q2(120, 260), Q3(185, 310), Q4(250, 180), YTD(305, 200) -->
          <g opacity="0.6">
            <line x1="55" y1="120" x2="55" y2="400" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />
            <line x1="120" y1="120" x2="120" y2="400" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />
            <line x1="185" y1="120" x2="185" y2="400" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />
            <line x1="250" y1="120" x2="250" y2="400" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />
            <line x1="305" y1="120" x2="305" y2="400" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />

            <!-- Horizontal values guides -->
            <line x1="40" y1="180" x2="310" y2="180" stroke="#E6E3DB" stroke-width="0.5" />
            <line x1="40" y1="260" x2="310" y2="260" stroke="#E6E3DB" stroke-width="0.5" />
            <line x1="40" y1="340" x2="310" y2="340" stroke="#E6E3DB" stroke-width="0.5" />
          </g>

          <!-- Gradient Area under curve -->
          <path d="M 55 380 L 120 260 L 185 310 L 250 180 L 305 200 L 305 400 L 55 400 Z" fill="#0E2240" opacity="0.08" />

          <!-- Main Bold Chart Curve Line -->
          <path d="M 55 380 L 120 260 L 185 310 L 250 180 L 305 200" fill="none" stroke="#0E2240" stroke-width="2.5" />

          <!-- Trend line dots -->
          <circle cx="55" cy="380" r="4.5" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.5" />
          <circle cx="120" cy="260" r="4.5" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.5" />
          <circle cx="185" cy="310" r="4.5" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.5" />
          <circle cx="250" cy="180" r="4.5" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.5" />
          <circle cx="305" cy="200" r="4.5" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.5" />

          <!-- X-Axis Labels -->
          <g font-family="${fontMontserrat}" font-size="7.5" font-weight="700" fill="#8C92AC" text-anchor="middle">
            <text x="55" y="425">Q1</text>
            <text x="120" y="425">Q2</text>
            <text x="185" y="425">Q3</text>
            <text x="250" y="425">Q4</text>
            <text x="305" y="425">YTD</text>
          </g>

          <text x="167" y="465" font-family="${fontPlayfair}" font-style="italic" font-size="8.5" fill="#5C6B73" text-anchor="middle">Consistently optimized execution velocities across each strategic sprint iteration.</text>
        </g>

        <!-- Right Side: SCORECARD SYNC & ICON GRID -->
        <!-- Scorecard Card -->
        <g transform="translate(390, 145)">
          <rect width="162" height="155" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📊 SCORECARD SYNC</text>
          <line x1="15" y1="34" x2="147" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Metrics bar 1 -->
          <text x="15" y="56" font-family="${fontInter}" font-size="8" fill="#5C6B73" font-weight="600">Task Success Velocity</text>
          <text x="147" y="56" font-family="monospace" font-size="8.5" font-weight="700" fill="#0E2240" text-anchor="end">92%</text>
          <rect x="15" y="62" width="132" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="62" width="121.4" height="4" rx="2" fill="#10B981" />

          <!-- Metrics bar 2 -->
          <text x="15" y="86" font-family="${fontInter}" font-size="8" fill="#5C6B73" font-weight="600">Time Blocking Accuracy</text>
          <text x="147" y="86" font-family="monospace" font-size="8.5" font-weight="700" fill="#0E2240" text-anchor="end">85%</text>
          <rect x="15" y="92" width="132" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="92" width="112.2" height="4" rx="2" fill="#0E2240" />

          <!-- Metrics bar 3 -->
          <text x="15" y="116" font-family="${fontInter}" font-size="8" fill="#5C6B73" font-weight="600">Health Optimization Ratio</text>
          <text x="147" y="116" font-family="monospace" font-size="8.5" font-weight="700" fill="#0E2240" text-anchor="end">78%</text>
          <rect x="15" y="122" width="132" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="122" width="102.9" height="4" rx="2" fill="#0E2240" />
        </g>

        <!-- Dynamic Icon Grid (Visual Representation of screenshot) -->
        <g transform="translate(390, 315)">
          <rect width="162" height="325" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Outer border matching screenshot's grid mockup -->
          <rect x="8" y="8" width="146" height="309" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Grid of tiny vectors representing Time Management toolkit icons -->
          <g transform="translate(18, 18)" stroke="#0E2240" stroke-width="1" fill="none">
            ${Array.from({length: 6}, (_, row) => 
              Array.from({length: 4}, (_, col) => {
                const x = col * 32;
                const y = row * 46;
                // Draw elegant mechanical icon glyphs
                return `
                  <g transform="translate(${x}, ${y})">
                    <rect x="0" y="0" width="22" height="22" rx="4" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="0.5" />
                    <!-- Visual Icon details inside -->
                    <circle cx="11" cy="11" r="5" stroke="#0E2240" stroke-width="1" />
                    <line x1="11" y1="11" x2="14" y2="8" stroke="#0E2240" stroke-width="1" />
                  </g>
                `;
              }).join('')
            ).join('')}
          </g>

          <!-- Label banner on icon grid matching PDF -->
          <g transform="translate(30, 195)">
            <rect width="102" height="24" rx="4" fill="#0E2240" stroke="none" />
            <text x="51" y="15" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">TIME MANAGEMENT</text>
          </g>
        </g>
      `;
      break;
    }

    case 'daily_command_center': {
      const dailyMiss = getText('daily_mission', '');
      const sleep = getText('daily_sleep', '');
      const water = getText('daily_water', '');
      const energy = getText('daily_energy', '');
      const dfocus = getText('daily_focus', '');
      const completion = getText('daily_completion_score', '');

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Daily Command Center</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Sequence and target your execution tasks block-by-block with surgical focus.</text>

        <!-- Left Card: TODAY'S SCHEDULE BLOCKING -->
        <g transform="translate(40, 145)">
          <rect width="335" height="495" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">🕒 TODAY'S SCHEDULE BLOCKING</text>
          <line x1="15" y1="34" x2="320" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Hourly rows -->
          <g id="daily-schedule-rows" transform="translate(15, 50)">
      `;

      state.dailyTasks.slice(0, 6).forEach((task, idx) => {
        const yRow = idx * 56;
        svgContent += `
          <g transform="translate(0, ${yRow})">
            <text x="0" y="12" font-family="monospace" font-size="9" font-weight="800" fill="#0E2240">${task.time}</text>
            <text x="100" y="12" font-family="${fontInter}" font-size="9" fill="#0E2240" font-weight="600">
              <tspan x="100" dy="0">${task.text.substring(0, 42)}</tspan>
            </text>
            <line x1="0" y1="26" x2="305" y2="26" stroke="#FAF9F6" stroke-width="1" />
            <line x1="0" y1="27" x2="305" y2="27" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />
          </g>
        `;
      });

      svgContent += `
          </g>

          <!-- Yellow Mission Banner at bottom -->
          <g transform="translate(15, 415)">
            <rect width="305" height="44" rx="4" fill="#FAF7EC" stroke="#0E2240" stroke-width="0.75" />
            <rect x="0" y="0" width="4" height="44" fill="#0E2240" />
            
            <text x="12" y="16" font-family="${fontMontserrat}" font-weight="800" font-size="7.5" fill="#0E2240" letter-spacing="0.5">( TODAY'S MISSION:</text>
            <text x="12" y="30" font-family="${fontInter}" font-size="8.5" fill="#0E2240" font-weight="600">${dailyMiss}</text>
          </g>
        </g>

        <!-- Right Side: HEALTH & WELLNESS & ACTIONS -->
        <!-- Wellness Indicators Card -->
        <g transform="translate(390, 145)">
          <rect width="162" height="155" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8" fill="#0E2240" letter-spacing="0.5">HEALTH &amp; WELLNESS INDICATORS</text>
          <line x1="15" y1="34" x2="147" y2="34" stroke="#E6E3DB" stroke-width="0.75" />

          <!-- Sleep -->
          <text x="15" y="52" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Sleep: <tspan font-weight="700" fill="#0E2240">${sleep}</tspan></text>
          <line x1="15" y1="58" x2="147" y2="58" stroke="#E6E3DB" stroke-width="0.5" />

          <!-- Water -->
          <text x="15" y="78" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Water Target: <tspan font-weight="700" fill="#0E2240">${water}</tspan></text>
          <line x1="15" y1="84" x2="147" y2="84" stroke="#0E2240" stroke-width="1.2" />

          <!-- Energy -->
          <text x="15" y="104" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Daily Energy: <tspan font-weight="700" fill="#0E2240">${energy}</tspan></text>
          <line x1="15" y1="110" x2="147" y2="110" stroke="#E6E3DB" stroke-width="0.5" />

          <!-- Focus -->
          <text x="15" y="130" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Mental Focus: <tspan font-weight="700" fill="#0E2240">${dfocus}</tspan></text>
        </g>

        <!-- Critical Actions Checklist -->
        <g transform="translate(390, 315)">
          <rect width="162" height="195" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">☑ CRITICAL DAILY ACTIONS</text>
          <line x1="15" y1="34" x2="147" y2="34" stroke="#0E2240" stroke-width="1" />

          <!-- 3 Actions -->
          ${[1, 2, 3].map((num, i) => {
            const act = getText(`daily_act_${num}`, '');
            const done = getText(`daily_act_${num}_done`, 'false') === 'true';
            return `
              <g transform="translate(15, ${52 + i * 44})">
                <rect width="10" height="10" rx="3.5" fill="${done ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.75" />
                ${done ? '<path d="M 2 5 L 4 7 L 8 2" stroke="#FFFFFF" stroke-width="1" fill="none" />' : ''}
                <text x="18" y="9" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="600">${act}</text>
                <line x1="18" y1="18" x2="132" y2="18" stroke="#FAF9F6" stroke-width="1" />
                <line x1="18" y1="19" x2="132" y2="19" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="1 2" />
              </g>
            `;
          }).join('')}
        </g>

        <!-- Completion Rating capsule at bottom right -->
        <g transform="translate(390, 580)">
          <rect width="162" height="60" rx="6" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="1" />
          
          <text x="15" y="22" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="#8C92AC">DAILY COMPLETION SCORE</text>
          
          <rect x="15" y="32" width="70" height="18" rx="4" fill="#2E6F40" />
          <text x="50" y="44" font-family="${fontMontserrat}" font-weight="700" font-size="9" fill="#FFFFFF" text-anchor="middle">${completion} OPTIMAL</text>
        </g>
      `;
      break;
    }

    case 'weekly_planning_roadmaps': {
      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Weekly Planning Roadmaps</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Plan and sequence operational actions for each week in the target month.</text>

        <!-- 5 Columns Grid -->
        <g transform="translate(40, 145)">
          ${[1, 2, 3, 4, 5].map((w, idx) => {
            const colX = idx * 104;
            const focus = getText(`w${w}_focus`, '');
            const p1 = getText(`w${w}_p1`, '');
            const p2 = getText(`w${w}_p2`, '');
            const status = getText(`w${w}_status`, 'Planned');
            const statusColor = status === 'Completed' ? '#10B981' : status === 'In Progress' ? '#D97706' : '#6B7280';

            return `
              <g transform="translate(${colX}, 0)">
                <rect width="100" height="495" rx="6" fill="#FFFFFF" stroke="#0E2240" stroke-width="${w === 3 ? '1.5' : '1'}" />
                
                <!-- Header -->
                <text x="12" y="24" font-family="${fontMontserrat}" font-weight="800" font-size="9" fill="#0E2240">WEEK 0${w}</text>
                <line x1="12" y1="32" x2="88" y2="32" stroke="#0E2240" stroke-width="1" />

                <!-- WEEKLY FOCUS -->
                <text x="12" y="48" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC">WEEKLY FOCUS</text>
                
                <!-- Focus text wrapped -->
                <g transform="translate(0, 56)">
                  ${renderWrappedTextOrLines(focus, 12, 0, 12, 5, 76, fontInter, 7.5, "#22252A", "600")}
                </g>

                <line x1="12" y1="130" x2="88" y2="130" stroke="#E6E3DB" stroke-width="0.5" />

                <!-- MAIN PRIORITIES -->
                <text x="12" y="150" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC">MAIN PRIORITIES</text>
                <g transform="translate(0, 160)">
                  ${renderWrappedTextOrLines(p1 ? `• ${p1}` : '', 12, 0, 12, 3, 76, fontInter, 8, "#5C6B73", "700")}
                </g>
                <g transform="translate(0, 210)">
                  ${renderWrappedTextOrLines(p2 ? `• ${p2}` : '', 12, 0, 12, 3, 76, fontInter, 8, "#5C6B73", "700")}
                </g>

                <!-- Status pill at bottom -->
                <g transform="translate(12, 450)">
                  <!-- Small status icon dot -->
                  <circle cx="4" cy="5" r="2.5" fill="${statusColor}" />
                  <text x="12" y="8" font-family="${fontMontserrat}" font-weight="700" font-size="7.5" fill="${statusColor}">${status}</text>
                </g>
              </g>
            `;
          }).join('')}
        </g>
      `;
      break;
    }

    case 'monthly_dashboard': {
      const monthNum = page.num || '01';
      const monthName = page.month || 'January';

      // 1. Project Planning (3 Projects)
      const proj1_name = getText(`month_${monthNum}_proj1_name`, 'Web Architecture Launch');
      const proj1_start = getText(`month_${monthNum}_proj1_start`, '04/01');
      const proj1_end = getText(`month_${monthNum}_proj1_end`, '04/12');
      const proj1_progress = Math.min(100, Math.max(0, parseFloat(getText(`month_${monthNum}_proj1_progress`, '65')) || 0));

      const proj2_name = getText(`month_${monthNum}_proj2_name`, 'Financial Portfolio Sync');
      const proj2_start = getText(`month_${monthNum}_proj2_start`, '04/10');
      const proj2_end = getText(`month_${monthNum}_proj2_end`, '04/22');
      const proj2_progress = Math.min(100, Math.max(0, parseFloat(getText(`month_${monthNum}_proj2_progress`, '30')) || 0));

      const proj3_name = getText(`month_${monthNum}_proj3_name`, 'Content Brand Campaign');
      const proj3_start = getText(`month_${monthNum}_proj3_start`, '04/15');
      const proj3_end = getText(`month_${monthNum}_proj3_end`, '04/28');
      const proj3_progress = Math.min(100, Math.max(0, parseFloat(getText(`month_${monthNum}_proj3_progress`, '10')) || 0));

      // 2. Savings Tracker
      const savings_goal_desc = getText(`month_${monthNum}_savings_goal_desc`, 'Q2 Reserve Base');
      const savings_target = getText(`month_${monthNum}_savings_target`, '$3,000');
      const savings_saved = getText(`month_${monthNum}_savings_saved`, '$1,950');
      const savings_progress = Math.min(100, Math.max(0, parseFloat(getText(`month_${monthNum}_savings_progress`, '65')) || 0));

      // 3. Habits (Monday to Sunday states)
      const h1_name = getText(`month_${monthNum}_habit1_name`, 'Early Morning Wake-up');
      const h1_mon = getText(`month_${monthNum}_habit1_mon`, 'true') === 'true';
      const h1_tue = getText(`month_${monthNum}_habit1_tue`, 'true') === 'true';
      const h1_wed = getText(`month_${monthNum}_habit1_wed`, 'true') === 'true';
      const h1_thu = getText(`month_${monthNum}_habit1_thu`, 'false') === 'true';
      const h1_fri = getText(`month_${monthNum}_habit1_fri`, 'true') === 'true';
      const h1_sat = getText(`month_${monthNum}_habit1_sat`, 'false') === 'true';
      const h1_sun = getText(`month_${monthNum}_habit1_sun`, 'false') === 'true';

      const h2_name = getText(`month_${monthNum}_habit2_name`, 'Deep Work Loop (2hr)');
      const h2_mon = getText(`month_${monthNum}_habit2_mon`, 'true') === 'true';
      const h2_tue = getText(`month_${monthNum}_habit2_tue`, 'true') === 'true';
      const h2_wed = getText(`month_${monthNum}_habit2_wed`, 'false') === 'true';
      const h2_thu = getText(`month_${monthNum}_habit2_thu`, 'true') === 'true';
      const h2_fri = getText(`month_${monthNum}_habit2_fri`, 'true') === 'true';
      const h2_sat = getText(`month_${monthNum}_habit2_sat`, 'false') === 'true';
      const h2_sun = getText(`month_${monthNum}_habit2_sun`, 'false') === 'true';

      const h3_name = getText(`month_${monthNum}_habit3_name`, 'Daily Cardio Routine');
      const h3_mon = getText(`month_${monthNum}_habit3_mon`, 'false') === 'true';
      const h3_tue = getText(`month_${monthNum}_habit3_tue`, 'true') === 'true';
      const h3_wed = getText(`month_${monthNum}_habit3_wed`, 'true') === 'true';
      const h3_thu = getText(`month_${monthNum}_habit3_thu`, 'false') === 'true';
      const h3_fri = getText(`month_${monthNum}_habit3_fri`, 'true') === 'true';
      const h3_sat = getText(`month_${monthNum}_habit3_sat`, 'true') === 'true';
      const h3_sun = getText(`month_${monthNum}_habit3_sun`, 'false') === 'true';

      // 4. Daily To-Dos Checklist
      const daily1_text = getText(`month_${monthNum}_daily1_text`, 'Refine product architecture slides');
      const daily1_done = getText(`month_${monthNum}_daily1_done`, 'true') === 'true';
      const daily2_text = getText(`month_${monthNum}_daily2_text`, 'Coordinate with backend developers');
      const daily2_done = getText(`month_${monthNum}_daily2_done`, 'true') === 'true';
      const daily3_text = getText(`month_${monthNum}_daily3_text`, 'Review weekly cashflow metrics');
      const daily3_done = getText(`month_${monthNum}_daily3_done`, 'false') === 'true';
      const daily4_text = getText(`month_${monthNum}_daily4_text`, 'Plan next sprint milestones');
      const daily4_done = getText(`month_${monthNum}_daily4_done`, 'false') === 'true';
      const daily5_text = getText(`month_${monthNum}_daily5_text`, 'Recharge personal reading goals');
      const daily5_done = getText(`month_${monthNum}_daily5_done`, 'false') === 'true';

      // 5. Daily Assessment Reflection
      const daily_rating = parseInt(getText(`month_${monthNum}_daily_rating`, '4')) || 4;
      const daily_reflection = getText(`month_${monthNum}_daily_reflection`, 'Productive sprint review; completed key mockups. Need to clear backlog tomorrow.');

      // 6. Weekly Analysis
      const weekly_analysis = getText(`month_${monthNum}_weekly_analysis`, 'Weekly performance score was high. Web architecture timeline completed ahead of schedule. Savings pipeline is well on target at 65%. Daily habit consistency remains stable across early wake-up routines.');

      const wrapTextLocal = (str: string, maxLimit: number): string[] => {
        const words = str.split(' ');
        const linesArr: string[] = [];
        let curr = '';
        words.forEach(w => {
          if ((curr + ' ' + w).length <= maxLimit) {
            curr = curr ? curr + ' ' + w : w;
          } else {
            linesArr.push(curr);
            curr = w;
          }
        });
        if (curr) linesArr.push(curr);
        return linesArr;
      };

      svgContent += `
        <!-- Title Banner -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Execute Personal Planner</text>
        <text x="40" y="125" font-family="${fontMontserrat}" font-weight="700" font-size="11" fill="#4B5563" letter-spacing="1">${monthName.toUpperCase()} MONTHLY DASHBOARD</text>
        <text x="40" y="142" font-family="${fontPlayfair}" font-style="italic" font-size="9" fill="#5C6B73">"The key to growth is focusing on execution over outcome. Plan carefully, execute relentlessly."</text>

        <!-- Left Column Module 1: Project Timelines -->
        <g transform="translate(40, 160)">
          <rect width="245" height="245" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">🚀 PROJECT TIMELINES</text>
          <line x1="15" y1="34" x2="230" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Project 1 -->
          <g transform="translate(15, 48)">
            <text x="0" y="10" font-family="${fontInter}" font-weight="700" font-size="8.5" fill="#0E2240">${proj1_name.substring(0, 30)}</text>
            <text x="215" y="10" font-family="${fontInter}" font-weight="700" font-size="8" fill="#5C6B73" text-anchor="end">${proj1_start} → ${proj1_end}</text>
            <rect x="0" y="18" width="215" height="6" rx="3" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="0.5" />
            <rect x="0" y="18" width="${(proj1_progress / 100) * 215}" height="6" rx="3" fill="#4F46E5" />
            <text x="0" y="34" font-family="${fontInter}" font-size="7.5" fill="#8C92AC">Progress Milestone Frame: ${proj1_progress}% Completed</text>
          </g>

          <!-- Project 2 -->
          <g transform="translate(15, 110)">
            <text x="0" y="10" font-family="${fontInter}" font-weight="700" font-size="8.5" fill="#0E2240">${proj2_name.substring(0, 30)}</text>
            <text x="215" y="10" font-family="${fontInter}" font-weight="700" font-size="8" fill="#5C6B73" text-anchor="end">${proj2_start} → ${proj2_end}</text>
            <rect x="0" y="18" width="215" height="6" rx="3" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="0.5" />
            <rect x="0" y="18" width="${(proj2_progress / 100) * 215}" height="6" rx="3" fill="#4F46E5" />
            <text x="0" y="34" font-family="${fontInter}" font-size="7.5" fill="#8C92AC">Progress Milestone Frame: ${proj2_progress}% Completed</text>
          </g>

          <!-- Project 3 -->
          <g transform="translate(15, 172)">
            <text x="0" y="10" font-family="${fontInter}" font-weight="700" font-size="8.5" fill="#0E2240">${proj3_name.substring(0, 30)}</text>
            <text x="215" y="10" font-family="${fontInter}" font-weight="700" font-size="8" fill="#5C6B73" text-anchor="end">${proj3_start} → ${proj3_end}</text>
            <rect x="0" y="18" width="215" height="6" rx="3" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="0.5" />
            <rect x="0" y="18" width="${(proj3_progress / 100) * 215}" height="6" rx="3" fill="#4F46E5" />
            <text x="0" y="34" font-family="${fontInter}" font-size="7.5" fill="#8C92AC">Progress Milestone Frame: ${proj3_progress}% Completed</text>
          </g>
        </g>

        <!-- Left Column Module 2: Daily Workflow Checklist & Assessment -->
        <g transform="translate(40, 420)">
          <rect width="245" height="375" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📝 DAILY WORKFLOW CHECKS</text>
          <line x1="15" y1="34" x2="230" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Checklist items -->
          ${[
            { t: daily1_text, d: daily1_done },
            { t: daily2_text, d: daily2_done },
            { t: daily3_text, d: daily3_done },
            { t: daily4_text, d: daily4_done },
            { t: daily5_text, d: daily5_done }
          ].map((task, i) => {
            return `
              <g transform="translate(15, ${46 + i * 28})">
                <rect width="10" height="10" rx="2" fill="${task.d ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.75" />
                ${task.d ? '<path d="M 2 5 L 4 7 L 8 2" stroke="#FFFFFF" stroke-width="1.2" fill="none" />' : ''}
                <text x="18" y="9" font-family="${fontInter}" font-size="8.5" fill="${task.d ? '#8C92AC' : '#1C1E22'}" font-weight="600" ${task.d ? 'text-decoration="line-through"' : ''}>
                  ${task.t.substring(0, 36)}
                </text>
              </g>
            `;
          }).join('')}

          <!-- Daily Assessment separator -->
          <line x1="15" y1="195" x2="230" y2="195" stroke="#E6E3DB" stroke-width="1" stroke-dasharray="3 3" />
          
          <!-- Daily Assessment -->
          <g transform="translate(15, 208)">
            <text x="0" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">⭐ DAILY ASSESSMENT</text>
            
            <!-- Rating stars -->
            <g transform="translate(135, 1)">
              ${[1, 2, 3, 4, 5].map(sNum => {
                const lit = sNum <= daily_rating;
                return `
                  <g transform="translate(${(sNum - 1) * 12}, 0)">
                    <path d="M 5 0 L 6.5 3 L 10 3.5 L 7.5 6 L 8 9.5 L 5 8 L 2 9.5 L 2.5 6 L 0 3.5 L 3.5 3 Z" fill="${lit ? '#F59E0B' : '#E5E7EB'}" />
                  </g>
                `;
              }).join('')}
            </g>

            <text x="0" y="28" font-family="${fontInter}" font-weight="700" font-size="8" fill="#5C6B73">End-of-Day Performance Reflection:</text>
            
            <!-- Wrapped reflection text lines -->
            <g transform="translate(0, 42)">
              ${wrapTextLocal(daily_reflection, 36).slice(0, 6).map((line, lineIdx) => `
                <text x="0" y="${lineIdx * 14}" font-family="${fontInter}" font-style="italic" font-size="8.5" fill="#1F2937">${line}</text>
              `).join('')}
            </g>
          </g>
        </g>

        <!-- Right Column Module 3: Savings Tracker -->
        <g transform="translate(305, 160)">
          <rect width="245" height="115" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">💰 SAVINGS TRACKER</text>
          <line x1="15" y1="34" x2="230" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <text x="15" y="52" font-family="${fontInter}" font-weight="700" font-size="8.5" fill="#0E2240">${savings_goal_desc}</text>
          <text x="15" y="67" font-family="${fontInter}" font-size="8" fill="#5C6B73">Target Goal: <tspan font-weight="700" fill="#0E2240">${savings_target}</tspan></text>
          <text x="230" y="67" font-family="${fontInter}" font-size="8" fill="#5C6B73" text-anchor="end">Saved: <tspan font-weight="700" fill="#10B981">${savings_saved}</tspan></text>

          <rect x="15" y="78" width="215" height="8" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="78" width="${(savings_progress / 100) * 215}" height="8" rx="4" fill="#10B981" />
          <text x="15" y="100" font-family="${fontInter}" font-size="7.5" font-weight="700" fill="#8C92AC">Savings Progress: ${savings_progress}% of complete target</text>
        </g>

        <!-- Right Column Module 4: Habit Checking Grid -->
        <g transform="translate(305, 290)">
          <rect width="245" height="115" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📅 HABIT TRACKING GRID</text>
          <line x1="15" y1="34" x2="230" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- MTWTFSS header -->
          <g transform="translate(135, 48)" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC" text-anchor="middle">
            <text x="5">M</text><text x="19">T</text><text x="33">W</text><text x="47">T</text><text x="61">F</text><text x="75">S</text><text x="89">S</text>
          </g>

          <!-- Habit Row 1 -->
          <g transform="translate(15, 56)">
            <text x="0" y="10" font-family="${fontInter}" font-weight="700" font-size="8" fill="#1C1E22">${h1_name.substring(0, 18)}</text>
            <g transform="translate(120, 1)">
              ${[h1_mon, h1_tue, h1_wed, h1_thu, h1_fri, h1_sat, h1_sun].map((hCheck, hIdx) => `
                <rect x="${hIdx * 14}" y="0" width="10" height="10" rx="1.5" fill="${hCheck ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.5" />
                ${hCheck ? `<path d="M ${hIdx * 14 + 2} 5 L ${hIdx * 14 + 4} 7 L ${hIdx * 14 + 8} 2" stroke="#FFFFFF" stroke-width="1" fill="none" />` : ''}
              `).join('')}
            </g>
          </g>

          <!-- Habit Row 2 -->
          <g transform="translate(15, 74)">
            <text x="0" y="10" font-family="${fontInter}" font-weight="700" font-size="8" fill="#1C1E22">${h2_name.substring(0, 18)}</text>
            <g transform="translate(120, 1)">
              ${[h2_mon, h2_tue, h2_wed, h2_thu, h2_fri, h2_sat, h2_sun].map((hCheck, hIdx) => `
                <rect x="${hIdx * 14}" y="0" width="10" height="10" rx="1.5" fill="${hCheck ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.5" />
                ${hCheck ? `<path d="M ${hIdx * 14 + 2} 5 L ${hIdx * 14 + 4} 7 L ${hIdx * 14 + 8} 2" stroke="#FFFFFF" stroke-width="1" fill="none" />` : ''}
              `).join('')}
            </g>
          </g>

          <!-- Habit Row 3 -->
          <g transform="translate(15, 92)">
            <text x="0" y="10" font-family="${fontInter}" font-weight="700" font-size="8" fill="#1C1E22">${h3_name.substring(0, 18)}</text>
            <g transform="translate(120, 1)">
              ${[h3_mon, h3_tue, h3_wed, h3_thu, h3_fri, h3_sat, h3_sun].map((hCheck, hIdx) => `
                <rect x="${hIdx * 14}" y="0" width="10" height="10" rx="1.5" fill="${hCheck ? '#0E2240' : 'none'}" stroke="#0E2240" stroke-width="0.5" />
                ${hCheck ? `<path d="M ${hIdx * 14 + 2} 5 L ${hIdx * 14 + 4} 7 L ${hIdx * 14 + 8} 2" stroke="#FFFFFF" stroke-width="1" fill="none" />` : ''}
              `).join('')}
            </g>
          </g>
        </g>

        <!-- Right Column Module 5: Weekly Analysis Report -->
        <g transform="translate(305, 420)">
          <rect width="245" height="375" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Stationery lined paper pattern inside -->
          <rect x="8" y="44" width="229" height="315" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          ${Array.from({ length: 15 }).map((_, lineIdx) => `
            <line x1="12" y1="${68 + lineIdx * 19}" x2="233" y2="${68 + lineIdx * 19}" stroke="#E6E3DB" stroke-width="0.5" />
          `).join('')}

          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📈 WEEKLY ANALYSIS</text>
          <line x1="15" y1="34" x2="230" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Wrapped Weekly Analysis Text lines -->
          <g transform="translate(16, 62)">
            ${wrapTextLocal(weekly_analysis, 35).slice(0, 15).map((line, lineIdx) => `
              <text x="0" y="${lineIdx * 19}" font-family="${fontInter}" font-size="8.5" fill="#1C1E22" font-weight="500">${line}</text>
            `).join('')}
          </g>
        </g>
      `;
      break;
    }

    case 'life_balance_wheel': {
      const breakdownHealth = getText('life_breakdown_health', '—');
      const breakdownCareer = getText('life_breakdown_career', '—');
      const breakdownFinance = getText('life_breakdown_finance', '—');
      const priority = getText('life_blueprint_priority', '');
      const ratio = getText('life_year_progress_ratio', '0%');

      // Wheel calculations
      const cx = 175;
      const cy = 380;
      const maxR = 90;

      const polyPoints = Object.entries(state.yearScores).map(([k, val], i) => {
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const dist = (val / 100) * maxR;
        const x = cx + dist * Math.cos(angle);
        const y = cy + dist * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Life Balance Wheel &amp; Snapshot</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">Evaluate, audit, and realign your core life segments for maximum focus synergy.</text>

        <!-- Left Card: INTEGRATION BALANCE MATRIX (Radar Chart) -->
        <g transform="translate(40, 145)">
          <rect width="275" height="495" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">🧭 INTEGRATION BALANCE MATRIX</text>
          <line x1="15" y1="34" x2="260" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <!-- Radar Guidelines -->
          <circle cx="${cx - 40}" cy="${cy - 145}" r="${maxR}" fill="none" stroke="#E6E3DB" stroke-width="1" />
          <circle cx="${cx - 40}" cy="${cy - 145}" r="${maxR * 0.75}" fill="none" stroke="#E6E3DB" stroke-width="0.75" stroke-dasharray="2 2" />
          <circle cx="${cx - 40}" cy="${cy - 145}" r="${maxR * 0.5}" fill="none" stroke="#E6E3DB" stroke-width="0.75" stroke-dasharray="2 2" />
          <circle cx="${cx - 40}" cy="${cy - 145}" r="${maxR * 0.25}" fill="none" stroke="#E6E3DB" stroke-width="0.75" stroke-dasharray="2 2" />

          <!-- Axes & Labels -->
          ${Object.keys(state.yearScores).map((cat, i) => {
            const angle = (i * Math.PI) / 4 - Math.PI / 2;
            const xLine = (cx - 40) + maxR * Math.cos(angle);
            const yLine = (cy - 145) + maxR * Math.sin(angle);
            
            const xLabel = (cx - 40) + (maxR + 15) * Math.cos(angle);
            const yLabel = (cy - 145) + (maxR + 12) * Math.sin(angle);
            let anchor = 'middle';
            if (Math.cos(angle) > 0.2) anchor = 'start';
            if (Math.cos(angle) < -0.2) anchor = 'end';

            const simpleCat = cat === 'productivity' ? 'HEALTH' : cat === 'happiness' ? 'CAREER' : cat === 'health' ? 'FINANCE' : cat === 'financial' ? 'GROWTH' : cat === 'relationships' ? 'RELATIONS' : cat === 'growth' ? 'FUN' : cat === 'fun' ? 'ENV' : 'SPIRIT';

            return `
              <line x1="${cx - 40}" y1="${cy - 145}" x2="${xLine}" y2="${yLine}" stroke="#E6E3DB" stroke-width="0.75" />
              <text x="${xLabel}" y="${yLabel + 3}" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC" text-anchor="${anchor}">${simpleCat}</text>
            `;
          }).join('')}

          <!-- Draw Polygon overlay -->
          <polygon points="${polyPoints.split(' ').map(p => {
            const [xVal, yVal] = p.split(',');
            return `${parseFloat(xVal) - 40},${parseFloat(yVal) - 145}`;
          }).join(' ')}" fill="rgba(14, 34, 64, 0.15)" stroke="#0E2240" stroke-width="1.75" />

          <text x="137" y="475" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC" text-anchor="middle" letter-spacing="0.5">VISUAL AUDIT: SYSTEM PERFORMANCE BY LIFE SECTOR</text>
        </g>

        <!-- Right Columns -->
        <!-- SEGMENT RATING BREAKDOWN -->
        <g transform="translate(330, 145)">
          <rect width="222" height="155" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📊 SEGMENT RATING BREAKDOWN</text>
          <line x1="15" y1="34" x2="207" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Rating rows -->
          <text x="15" y="55" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Health &amp; Athletic Performance:</text>
          <text x="207" y="55" font-family="monospace" font-size="9" font-weight="700" fill="#0E2240" text-anchor="end">${breakdownHealth}</text>
          <rect x="15" y="62" width="192" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="62" width="163" height="4" rx="2" fill="#2E6F40" />

          <text x="15" y="87" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Career &amp; Output Velocity:</text>
          <text x="207" y="87" font-family="monospace" font-size="9" font-weight="700" fill="#0E2240" text-anchor="end">${breakdownCareer}</text>
          <rect x="15" y="94" width="192" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="94" width="134" height="4" rx="2" fill="#0E2240" />

          <text x="15" y="119" font-family="${fontInter}" font-size="8.5" fill="#5C6B73" font-weight="500">Finance &amp; Savings Pipelines:</text>
          <text x="207" y="119" font-family="monospace" font-size="9" font-weight="700" fill="#0E2240" text-anchor="end">${breakdownFinance}</text>
          <rect x="15" y="126" width="192" height="4" rx="2" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <rect x="15" y="126" width="124" height="4" rx="2" fill="#0E2240" />
        </g>

        <!-- ACTION BLUEPRINT PRIORITY -->
        <g transform="translate(330, 315)">
          <rect width="222" height="250" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">📋 ACTION BLUEPRINT PRIORITY</text>
          <line x1="15" y1="34" x2="207" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <g transform="translate(0, 52)">
            ${renderWrappedTextOrLines(priority, 15, 0, 18, 9, 192, fontInter, 9, "#5C6B73", "600")}
          </g>
        </g>

        <!-- Bottom Year Completed Ratio badge -->
        <g transform="translate(330, 580)">
          <rect width="222" height="60" rx="6" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="1" />
          <text x="111" y="36" font-family="${fontMontserrat}" font-weight="700" font-size="8" fill="#0E2240" text-anchor="middle" letter-spacing="0.5">YEAR COMPLETED PROGRESS RATIO: ${ratio}</text>
        </g>
      `;
      break;
    }

    case 'next_year_blueprint': {
      const personal = getText('next_personal_health', '');
      const relations = getText('next_relations_community', '');
      const career = getText('next_career_finance', '');

      const p_i1 = getText('next_personal_intent_1', '');
      const p_i2 = getText('next_personal_intent_2', '');
      const r_i1 = getText('next_relations_intent_1', '');
      const r_i2 = getText('next_relations_intent_2', '');
      const c_i1 = getText('next_career_intent_1', '');
      const c_i2 = getText('next_career_intent_2', '');

      const p_status = getText('next_personal_status', 'PLANNED');
      const r_status = getText('next_relations_status', 'PLANNED');
      const c_status = getText('next_career_status', 'PLANNED');

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Next Year's Blueprint</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">A forward-looking strategic reflection layout designed for future success planning.</text>

        <!-- 3 Columns Layout -->
        <g transform="translate(40, 145)">
          ${[
            { title: 'PERSONAL & HEALTH', text: personal, intents: [p_i1, p_i2], status: p_status, code: 'personal' },
            { title: 'RELATIONS & COMMUNITY', text: relations, intents: [r_i1, r_i2], status: r_status, code: 'relations' },
            { title: 'CAREER & FINANCE', text: career, intents: [c_i1, c_i2], status: c_status, code: 'career' }
          ].map((col, idx) => {
            const colX = idx * 176;
            return `
              <g transform="translate(${colX}, 0)">
                <rect width="160" height="495" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
                
                <!-- Category Icon indicator -->
                <g transform="translate(15, 18)" stroke="#0E2240" stroke-width="1.2" fill="none">
                  <path d="M 0 4 L 8 0 L 16 4 L 16 12 L 0 12 Z" />
                  <text x="22" y="10" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" stroke="none" letter-spacing="0.5">${col.title}</text>
                </g>
                <line x1="15" y1="34" x2="145" y2="34" stroke="#E6E3DB" stroke-width="0.75" />

                <!-- Description Block -->
                <g transform="translate(0, 48)">
                  ${renderWrappedTextOrLines(col.text, 15, 0, 15, 4, 130, fontInter, 8.5, "#5C6B73")}
                </g>

                <line x1="15" y1="120" x2="145" y2="120" stroke="#E6E3DB" stroke-width="0.5" stroke-dasharray="2 2" />

                <!-- INTENTIONS checklist -->
                <text x="15" y="140" font-family="${fontMontserrat}" font-weight="700" font-size="6.5" fill="#8C92AC">NEXT YEAR INTENTIONS</text>
                
                ${col.intents.map((intent, i) => `
                  <g transform="translate(15, ${155 + i * 35})">
                    <rect width="8" height="8" rx="2" fill="none" stroke="#0E2240" stroke-width="0.75" />
                    <g transform="translate(0, -2)">
                      ${renderWrappedTextOrLines(intent, 14, 0, 11, 2, 115, fontInter, 8, "#22252A", "600")}
                    </g>
                  </g>
                `).join('')}

                <!-- Status marker at bottom -->
                <text x="15" y="465" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#0E2240" letter-spacing="0.5">ALIGNMENT STATUS: ${col.status}</text>
              </g>
            `;
          }).join('')}
        </g>
      `;
      break;
    }

    case 'year_review_summary': {
      const win1_t = getText('review_win_1_title', '');
      const win1_d = getText('review_win_1_desc', '');
      const win2_t = getText('review_win_2_title', '');
      const win2_d = getText('review_win_2_desc', '');
      const win3_t = getText('review_win_3_title', '');
      const win3_d = getText('review_win_3_desc', '');

      const perspective = getText('review_perspective', '');
      const signature_text = getText('review_commitment_text', '');
      const signature_date = getText('review_signature_date', '');

      const productivityScore = state.yearScores.productivity > 0 ? `${state.yearScores.productivity}%` : '—%';
      const healthScore = state.yearScores.health > 0 ? `${state.yearScores.health}%` : '—%';
      const happinessScore = state.yearScores.happiness > 0 ? `${state.yearScores.happiness}%` : '—%';
      const financialScore = state.yearScores.financial > 0 ? `${state.yearScores.financial}%` : '—%';

      svgContent += `
        <!-- Title -->
        <text x="40" y="105" font-family="${fontMontserrat}" font-weight="800" font-size="18" fill="#0E2240" letter-spacing="-0.5">Year in Review Summary</text>
        <text x="40" y="120" font-family="${fontPlayfair}" font-style="italic" font-size="9.5" fill="#5C6B73">A rigorous assessment of annual growth, metrics tracking, and lessons learned.</text>

        <!-- Left Column: KEY ACHIEVEMENTS & WINS -->
        <g transform="translate(40, 145)">
          <rect width="285" height="495" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          
          <!-- Header -->
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">🏆 KEY ACHIEVEMENTS &amp; WINS</text>
          <line x1="15" y1="34" x2="270" y2="34" stroke="#0E2240" stroke-width="1.2" />

          <!-- Win 1 -->
          <g transform="translate(15, 52)">
            <rect width="10" height="10" rx="3.5" fill="#2E6F40" />
            <path d="M 2 5 L 4 7 L 8 2" stroke="#FFFFFF" stroke-width="1.2" fill="none" />
            
            <g transform="translate(18, 0)">
              ${renderWrappedTextOrLines(win1_t, 0, 9, 14, 1, 230, fontMontserrat, 8.5, "#0E2240", "700")}
            </g>
            <g transform="translate(18, 22)">
              ${renderWrappedTextOrLines(win1_d, 0, 0, 14, 2, 230, fontInter, 8, "#5C6B73")}
            </g>
          </g>

          <!-- Win 2 -->
          <g transform="translate(15, 130)">
            <rect width="10" height="10" rx="3.5" fill="#2E6F40" />
            <path d="M 2 5 L 4 7 L 8 2" stroke="#FFFFFF" stroke-width="1.2" fill="none" />
            
            <g transform="translate(18, 0)">
              ${renderWrappedTextOrLines(win2_t, 0, 9, 14, 1, 230, fontMontserrat, 8.5, "#0E2240", "700")}
            </g>
            <g transform="translate(18, 22)">
              ${renderWrappedTextOrLines(win2_d, 0, 0, 14, 2, 230, fontInter, 8, "#5C6B73")}
            </g>
          </g>

          <!-- Win 3 -->
          <g transform="translate(15, 210)">
            <rect width="10" height="10" rx="3.5" fill="#2E6F40" />
            <path d="M 2 5 L 4 7 L 8 2" stroke="#FFFFFF" stroke-width="1.2" fill="none" />
            
            <g transform="translate(18, 0)">
              ${renderWrappedTextOrLines(win3_t, 0, 9, 14, 1, 230, fontMontserrat, 8.5, "#0E2240", "700")}
            </g>
            <g transform="translate(18, 22)">
              ${renderWrappedTextOrLines(win3_d, 0, 0, 14, 2, 230, fontInter, 8, "#5C6B73")}
            </g>
          </g>

          <!-- Divider line before retrospective note -->
          <line x1="15" y1="360" x2="270" y2="360" stroke="#E6E3DB" stroke-width="0.5" />

          <!-- Wrapped Retrospective Note at bottom -->
          <g transform="translate(0, 375)">
            ${renderWrappedTextOrLines(perspective, 15, 0, 16, 6, 255, fontPlayfair, 8.5, "#22252A", "normal", true)}
          </g>
        </g>

        <!-- Right Column Cards -->
        <!-- PERFORMANCE SCORECARDS -->
        <g transform="translate(340, 145)">
          <rect width="212" height="155" rx="6" fill="#FFFFFF" stroke="#E6E3DB" stroke-width="1" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">🧭 PERFORMANCE SCORECARDS</text>
          <line x1="15" y1="34" x2="197" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <!-- Score Card 1: Productivity -->
          <rect x="15" y="44" width="86" height="42" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <text x="58" y="58" font-family="${fontMontserrat}" font-size="7" font-weight="700" fill="#8C92AC" text-anchor="middle">${productivityScore}</text>
          <text x="58" y="74" font-family="${fontMontserrat}" font-size="6.5" font-weight="700" fill="#0E2240" text-anchor="middle">PRODUCTIVITY</text>

          <!-- Score Card 2: Health & Stamina -->
          <rect x="111" y="44" width="86" height="42" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <text x="154" y="58" font-family="${fontMontserrat}" font-size="7" font-weight="700" fill="#10B981" text-anchor="middle">${healthScore}</text>
          <text x="154" y="74" font-family="${fontMontserrat}" font-size="6.5" font-weight="700" fill="#0E2240" text-anchor="middle">HEALTH &amp; STAMINA</text>

          <!-- Score Card 3: Happiness Rating -->
          <rect x="15" y="96" width="86" height="42" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <text x="58" y="110" font-family="${fontMontserrat}" font-size="7" font-weight="700" fill="#8C92AC" text-anchor="middle">${happinessScore}</text>
          <text x="58" y="126" font-family="${fontMontserrat}" font-size="6.5" font-weight="700" fill="#0E2240" text-anchor="middle">HAPPINESS RATING</text>

          <!-- Score Card 4: Financial Targets -->
          <rect x="111" y="96" width="86" height="42" rx="4" fill="#FAF9F6" stroke="#E6E3DB" stroke-width="0.5" />
          <text x="154" y="110" font-family="${fontMontserrat}" font-size="7" font-weight="700" fill="#D97706" text-anchor="middle">${financialScore}</text>
          <text x="154" y="126" font-family="${fontMontserrat}" font-size="6.5" font-weight="700" fill="#0E2240" text-anchor="middle">FINANCIAL TARGETS</text>
        </g>

        <!-- COMMITMENT SIGNATURE -->
        <g transform="translate(340, 315)">
          <rect width="212" height="325" rx="6" fill="#FFFFFF" stroke="#0E2240" stroke-width="1.5" />
          <text x="15" y="24" font-family="${fontMontserrat}" font-weight="700" font-size="8.5" fill="#0E2240" letter-spacing="1">✒️ COMMITMENT SIGNATURE</text>
          <line x1="15" y1="34" x2="197" y2="34" stroke="#FAF9F6" stroke-width="1" />

          <!-- Commitment body wrapped -->
          <g transform="translate(0, 48)">
            ${renderWrappedTextOrLines(signature_text, 15, 0, 16, 11, 182, fontInter, 8.5, "#5C6B73", "600")}
          </g>

          <!-- Signature Line and Seal -->
          <line x1="15" y1="280" x2="110" y2="280" stroke="#0E2240" stroke-width="1.2" />
          <text x="15" y="294" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC">[Signature]</text>

          <text x="135" y="280" font-family="${fontMontserrat}" font-weight="700" font-size="7" fill="#8C92AC">DATE: ${signature_date || '  /  /    '}</text>
        </g>
      `;
      break;
    }
  }

  // Unified Footer Matrix containing Page and Branding markers
  svgContent += `
    <line x1="40" y1="${height - 65}" x2="${width - 40}" y2="${height - 65}" stroke="#0E2240" stroke-width="1.2" />
    <text x="40" y="${height - 45}" font-family="${fontMontserrat}" font-size="8" fill="#8C92AC" letter-spacing="1">WWW.PERSONALOS.CO</text>
    <text x="${width - 40}" y="${height - 45}" font-family="${fontMontserrat}" font-size="8" fill="#8C92AC" letter-spacing="1" text-anchor="end">PAGE ${String(page.id).padStart(2, '0')} / 27</text>
  `;

  return `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${svgContent}
</svg>`;
}
