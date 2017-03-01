import {teal, yellow, orange, red} from './colors';
import css from 'next/css';

const indicatorColor = (indicator) => {
  switch(indicator) {
    case 'none':
      return teal;
    case 'minor':
      return yellow;
    case 'major':
      return orange;
    case 'critical':
      return red;
    default:
      return grey;
  }
}
export class StatusCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  render() {
    let {indicator, name, description, maintenances} = this.props;
    let state = this.state;
    let dropdownStyle = css({
      background: '#21242d',
      borderTop: '1px solid #CCC',
      fontSize: '12px',
      paddingLeft: '10px'
    });
    let itemStyle = css({
      padding: '10px 16px !important',
      background: this.props.selected ? '#484e61' : '#21242d',
      cursor: 'pointer',
      color: 'rgba(255, 255, 255, 0.67)',
      '&:hover': {
        background: '#484e61'
      }
    })
    return (<div className={`item ${itemStyle}`} style={{borderLeft: `5px solid ${indicatorColor(indicator)}`}} onClick={this.props.select}>
      
      <div className="content">

        <span>{name} {maintenances.length > 0 ? <div className=" ui red mini label circular">{maintenances.length}</div> : null} </span>
        <h6 style={{margin: 0}}> {description}</h6>
        
      </div>
      
    </div>)
  }
}