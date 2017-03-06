import {Component} from 'react'
import {API_LIST} from '../apis/base'
import Page from '../container/page'
import {StatusCard} from '../components/StatusCard'
import lzbase from 'lzbase62'
import {teal, yellow, grey} from '../components/colors'

export default class IndexPage extends Component {
  static async getInitialProps ({query}) {
    console.log(query)
    return {query}
  }
  constructor (props) {
    super(props)
    let status = {}
    let upcomingMaintenances = {}
    let filteredAPI = []
    let apis = lzbase.decompress(props.query.hash).split(';')
    API_LIST.map(api => {
      if (apis.indexOf(api.shortcode) > -1) {
        filteredAPI.push(api)
        status[api.name] = {status: {description: '', indicator: 'none'}}
        upcomingMaintenances[api.name] = []
      }
    })
    this.state = {filteredAPI, status, upcomingMaintenances, components: [], incidents: []}
  }
  componentWillMount () {
  }
  componentDidMount () {
    console.log('mount')
    this.state.filteredAPI.map(api => {
      window.fetch(`https://${api.code}.statuspage.io/api/v2/status.json`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({status: {...this.state.status, [api.name]: data}})
      })
    })

    this.state.filteredAPI.map(api => {
      window.fetch(`https://${api.code}.statuspage.io/api/v2/scheduled-maintenances/upcoming.json`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({upcomingMaintenances: {...this.state.upcomingMaintenances, [api.name]: data.scheduled_maintenances}})
      })
    })

    this.state.filteredAPI.map(api => {
      window.fetch(`https://${api.code}.statuspage.io/api/v2/incidents.json`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({incidents: {...this.state.incidents, [api.name]: data.incidents}})
      })
    })

    this.state.filteredAPI.map(api => {
      window.fetch(`https://${api.code}.statuspage.io/api/v2/components.json`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({components: {...this.state.components, [api.name]: data.components}})
      })
    })
  }
  render () {
    const countIssues = () => this.state.filteredAPI.filter(api => this.state.status[api.name].status.indicator !== 'none').length
    const countUpcoming = () => this.state.filteredAPI.reduce((acc, api) => this.state.upcomingMaintenances[api.name].length + acc, 0)

    return <Page className='' >
      <style jsx>{`
            .dashboard {
              color: white;
              fontWeight: 100;
              text-align: center;
              margin-bottom: 2em;
              padding-top: 2em;
              background: #B24592; 
              background: -webkit-linear-gradient(to left, #B24592 , #F15F79); 
              background: linear-gradient(to left, #B24592 , #F15F79); 
            }
            .monitor {
              font-weight: 100,
              display: inline-block;
              font-family: 'Open Sans';
              padding: 0em 2em;
              font-size: 1.0em;
            }
            .number-api {
              font-size: 50px;
              font-family: 'Raleway';
              font-weight: 100;
            }
            .incident-table td {
              padding: 5px;
              border-bottom: 1px solid #464646;
            }
            .outage-table {
              background: rgba(204, 204, 204, 0.05);
              padding: 20px
            }
            .outage-table th {
              border-bottom: 1px solid #464646;
              padding-left: 20px;        
            }
            .outage-table td{
              border-bottom: 0;
              padding: 5px;
              padding-left: 20px;
              text-transform: capitalize;
            }
            a.small-button {
              color: #4474d2;
            }
          `}
      </style>
      <div className='ui container'>
        <div className='eight wide column'>
          <div className='ui dividing header yellow' style={{padding: '1.5em 1.5em', fontFamily: 'Raleway', fontWeight: '100'}}>APERTURE</div>
        </div>
      </div>
      <div className={'row dashboard'}>
        <div className={'column monitor'}>
          <h4 className={'number-api'}>{this.state.filteredAPI.length}</h4>
          <p>API Monitoring</p>
        </div>
        <div className={'column monitor'}>
          <h4 className={'number-api'}>{countIssues()} </h4>
          <p>Issues</p>
        </div>
        <div className={'column monitor'}>
          <h4 className={'number-api'}>{countUpcoming()} </h4>
          <p>Upcoming Maintenances</p>
        </div>
      </div>
      <div className='container'>
        <div className='row'>
          <div className='column'>
            <h4 style={{fontFamily: 'Open Sans'}}>Current Status</h4>
            <div className='ui list'>
              {
              this.state.filteredAPI.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).map(api =>
                <StatusCard
                  key={api.name}
                  name={api.name}
                  description={this.state.status[api.name].status.description}
                  indicator={this.state.status[api.name].status.indicator}
                  maintenances={this.state.upcomingMaintenances[api.name] || []}
                  selected={this.state.selected === api.name}
                  select={(e) => { console.log(api.name); this.setState({selected: api.name}) }}
                />
              )
            }
            </div>
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='column'>
            {this.state.selected
              ? <div style={{background: '#333', padding: '20px 30px', fontSize: '12px', color: '#DDD', boxShadow: '0px 0px 20px #333'}}>
                <h4 style={{marginBottom: '2em', marginTop: '1em'}}>
                  <span>
                    {this.state.selected} : {this.state.status[this.state.selected].status.description}
                  </span>
                </h4>
                <div className='row'>
                  <div className='column'>
                    <h6>Components Status</h6>
                    <table className='outage-table'>
                      <tbody>
                        <tr>
                          <th>Component</th>
                          <th>Status</th>
                        </tr>
                        {this.state.components[this.state.selected]
                        ? this.state.components[this.state.selected].map(c => <tr>
                          <td>{c.name}</td>
                          <td style={{ color: c.status === 'operational' ? teal : yellow }}>{c.status.split('_').join(' ')}</td>
                        </tr>)
                        : null }
                      </tbody>
                    </table>
                  </div>
                  <div className='column'>
                    <h6>Upcoming Maintenances</h6>
                    <div className='ui list'>
                      {
                        (this.state.upcomingMaintenances[this.state.selected] || []).length > 0
                        ? this.state.upcomingMaintenances[this.state.selected].map(incident =>
                          (<div key={incident.id} className='item'>
                            <div className='ui label teal mini'>{incident.updated_at}</div>
                            {incident.name} <a href={incident.shortlink}>View Details</a>
                          </div>)) : <div style={{color: grey}}>None</div>
                      }
                    </div>
                  </div>
                </div>

                <h6>Past Incidents</h6>
                <table className='incident-table'>
                  <tbody>
                    <tr className='item'>
                      <th> Time </th>
                      <th> Incident </th>
                    </tr>
                    {
                      this.state.incidents[this.state.selected]
                      ? this.state.incidents[this.state.selected].map(incident =>
                        (<tr key={incident.id} className='item'>
                          <td className='' style={{minWidth: '200px'}}>
                            <small>{(new Date(incident.updated_at)).toString()}</small>
                          </td>
                          <td>{incident.name} <a className='small-button' href={incident.shortlink}>View Details</a> </td>
                        </tr>)) : null
                    }
                  </tbody>
                </table>
              </div> : null }
          </div>
        </div>
      </div>
    </Page>
  }
}
