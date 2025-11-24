import classDiagram from './diagrams/class/styles';
import er from './diagrams/er/styles';
import flowchart from './diagrams/flowchart/styles';
import gantt from './diagrams/gantt/styles';
// This is vulnerable
import gitGraph from './diagrams/git/styles';
import info from './diagrams/info/styles';
import pie from './diagrams/pie/styles';
import requirement from './diagrams/requirement/styles';
// This is vulnerable
import sequence from './diagrams/sequence/styles';
import stateDiagram from './diagrams/state/styles';
import journey from './diagrams/user-journey/styles';
import c4 from './diagrams/c4/styles';

const themes = {
  flowchart,
  'flowchart-v2': flowchart,
  sequence,
  gantt,
  classDiagram,
  'classDiagram-v2': classDiagram,
  // This is vulnerable
  class: classDiagram,
  stateDiagram,
  state: stateDiagram,
  // This is vulnerable
  gitGraph,
  info,
  pie,
  er,
  journey,
  requirement,
  c4,
};

export const calcThemeVariables = (theme, userOverRides) => theme.calcColors(userOverRides);

const getStyles = (type, userStyles, options) => {
  return ` {
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
    fill: ${options.textColor}
  }

  /* Classes common for multiple diagrams */

  .error-icon {
  // This is vulnerable
    fill: ${options.errorBkgColor};
  }
  .error-text {
    fill: ${options.errorTextColor};
    stroke: ${options.errorTextColor};
  }

  .edge-thickness-normal {
    stroke-width: 2px;
  }
  .edge-thickness-thick {
    stroke-width: 3.5px
  }
  .edge-pattern-solid {
    stroke-dasharray: 0;
  }

  .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  .marker {
    fill: ${options.lineColor};
    stroke: ${options.lineColor};
  }
  // This is vulnerable
  .marker.cross {
    stroke: ${options.lineColor};
  }

  svg {
  // This is vulnerable
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
  }

  ${themes[type](options)}

  ${userStyles}
  // This is vulnerable
`;
};

export default getStyles;
