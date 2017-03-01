import {Component} from 'react'
import {API_LIST} from '../apis/base'
import Page from '../container/page'
import css from 'next/css'
import {StatusCard} from '../components/StatusCard';
import {orange} from '../components/colors';


export default class IndexPage extends Component {
  constructor(props) {
    super(props);
    let status = {};
    let upcoming_maintenances = {};
    API_LIST.map(api => {
      status[api.name] = {status: {description: '', indicator: 'none'}};
      upcoming_maintenances[api.name] = [];
    });
    this.state = {status, upcoming_maintenances, incidents: []};
  }
  componentWillMount() {
  }
  componentDidMount() {
    console.log("mount")
    API_LIST.map(api => {
      fetch(`https://${api.code}.statuspage.io/api/v2/status.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({status: {...this.state.status, [api.name]: data}})
      });
    });

    API_LIST.map(api => {
      fetch(`https://${api.code}.statuspage.io/api/v2/scheduled-maintenances/upcoming.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({upcoming_maintenances: {...this.state.upcoming_maintenances, [api.name]: data.scheduled_maintenances}})
      });
    });

    API_LIST.map(api => {
      fetch(`https://${api.code}.statuspage.io/api/v2/incidents.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({incidents: {...this.state.incidents, [api.name]: data.incidents}})
        
      });
    });
  }
  render() {
    let cardStyle = {
      border: '1px solid #efefef',
      color: '#333',
      borderRadius: '4px'
    }
    const countIssues = () => API_LIST.filter(api => this.state.status[api.name].status.indicator !== 'none').length
    const countUpcoming = () => API_LIST.reduce((acc, api) => this.state.upcoming_maintenances[api.name].length + acc, 0)
    const dashboardStyle = css({
      background: 'white', 
      color: 'white',
      fontWeight: 100,
      textAlign: 'center',
      marginBottom: '2em'
    });

    const monitorStyle = css({
      color: '#333',
      fontWeight: '100',
      display: 'inline-block',
      fontFamily: 'Open Sans',
      padding: '0em 2em',
      fontSize: '1.0em'
    });

    const numberStyle = {
      fontSize: '50px',
      fontFamily: 'Raleway',
      fontWeight: 100
    }           
    const issue = css({
      height: '25px',
      width: '2px',
      background: orange,
      cursor: 'pointer',
      marginTop: '25px',
      display: 'inline-block !important',
      marginLeft: '1px',
      '&:hover': {
        marginTop:0,
        height: '50px'
      }
    });
    return <Page className="" >
          <div className="ui container">
            <div className="eight wide column">
              <div className="ui dividing header yellow" style={{padding: '1.5em 1.5em', fontFamily: 'Raleway', fontWeight: '100'}}>APERTURE</div>
            </div>
          </div>
          <div className={`ui container fluid ${dashboardStyle}`}>
            <div className="ui grid">
            <div className="eight wide column">
              <div className={monitorStyle}>
                <h4 style={numberStyle}>{API_LIST.length}</h4>
                <p>API Monitoring</p>
              </div>
            </div>
            <div className="eight wide column">
              <div className={monitorStyle}>
                <h4 style={numberStyle}>{countIssues()} </h4>
                <p>Issues</p>
              </div>
              <div className={monitorStyle}>
                <h4 style={numberStyle}>{countUpcoming()} </h4>
                <p>Upcoming Maintenances</p>
              </div>  

            </div>
          </div>
          </div>
          <div className="ui container">
          
          <div className="ui grid">
          <div className="four wide column">
            <h1 style={{fontFamily: 'Open Sans'}}>Current Status</h1>
            <div className="ui list">
            { 
              API_LIST.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).map(api => 
                <StatusCard
                  name={api.name}
                  description={this.state.status[api.name].status.description}
                  indicator={this.state.status[api.name].status.indicator}
                  maintenances={this.state.upcoming_maintenances[api.name] || []}
                  selected={this.state.selected == api.name}
                  select={(e) => {console.log(api.name);this.setState({selected: api.name})}}
                />
              )
            }
            </div>
          </div>
          <div className="twelve wide column">
            {this.state.selected ? 
            <div>
              <h3 style={{fontFamily: 'Open Sans'}}>{this.state.selected ? <span>{this.state.selected} : {this.state.status[this.state.selected].status.description}</span> : ''}</h3>
              <h4>Upcoming Maintenances</h4>
              <div className="ui list">
                {(this.state.upcoming_maintenances[this.state.selected] || []).length > 0 ? 
                  this.state.upcoming_maintenances[this.state.selected].map(incident => <div className="item"> <div className="ui label teal mini">{incident.updated_at}</div> {incident.name} <a href={incident.shortlink}>View Details</a>  </div>) : <div className="ui grey label mini">None</div>
                }
              </div>
              <h4>Past Incidents</h4>
              <div className="ui list">
                {this.state.incidents[this.state.selected] ? 
                  this.state.incidents[this.state.selected].map(incident => <div className="item"> <div className="ui label teal mini" style={{minWidth: '200px'}}>{(new Date(incident.updated_at)).toString()}</div> <small>{incident.name} <a href={incident.shortlink}>View Details</a> </small> </div>) : null
                }
              </div>
            </div> : null }
          </div>
          </div>
          </div>
    </Page>
  }

}