import {teal, yellow, orange, red, grey} from './colors'

const indicatorColor = (indicator) => {
  switch (indicator) {
    case 'none':
      return teal
    case 'minor':
      return yellow
    case 'major':
      return orange
    case 'critical':
      return red
    default:
      return grey
  }
}

export class StatusCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  render() {
    let {indicator, name, description, maintenances} = this.props;
    let state = this.state

    return (<div className={`item item-card ${this.props.selected ? 'selected': ''}`} style={{borderLeft: `10px solid ${indicatorColor(indicator)}`}} onClick={this.props.select}>
              <style jsx>
          {`
            .item-card {
              width: 20%;
              margin-left: 2%;
              display: inline-block;
              padding: 10px 16px !important;
              background: #21242d;
              cursor: pointer;
              color: rgba(255, 255, 255, 0.67);
            }
            .item-card.selected {
              background: #484e61;
            }
            .item-card:hover {
              background: #484e61
            }
          `}
        </style>
      <div className="content">

        <span>{name} {maintenances.length > 0 ? <div className=" ui red mini label circular">{maintenances.length}</div> : null} </span>
        <h6 style={{fontWeight: 'bold', fontSize: '12px', margin: 0}}> {description}</h6>
        
      </div>
      
    </div>)
  }
}