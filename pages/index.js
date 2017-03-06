import {Component} from 'react'
import {API_LIST} from '../apis/base'
import Page from '../container/page'
import lzbase from 'lzbase62'
import _ from 'lodash'
import Select from 'react-select'

export default class IndexPage extends Component {

  constructor (props) {
    super(props)
    this.generateLink = this.generateLink.bind(this)
    this.state = {
      generateLink: false,
      selectedOptions: []
    }
  }

  generateLink () {
    let apis = this.state.selectedOptions
     .map(({value}) => value.shortcode)
     .join(';')
    return `${window.location.href}c/${lzbase.compress(apis)}`
  }

  render () {
    const link = this.state.generateLink ? this.generateLink() : ''
    const options = API_LIST
      .filter(api => !_.find(this.state.selectedOptions, {label: api.name}))
      .map(api => ({label: api.name, value: api}))
    return <Page>
      <div className='mainpage'>
        <style jsx>{`
          .container {
            color: white;
          }
          .link-copy {
            width: auto;
            background: rgba(255, 255, 255, 0.72);
            color: #505967;
            border: 0;
            padding: 10px;
          }
        `}</style>
        <div className='container'>
          <div className='row'>
            <div className='column'>
              <h1>Aperture</h1>
              <h4>API Monitoring</h4>
              <div className={`animation-fade ${this.state.generateLink ? 'hidden' : ''}`}>
                <div className='selected-apis'>
                  {this.state.selectedOptions.map(({label}) =>
                    <div key={label} className='api-selected'>
                      <i className='fa fa-times'
                        style={{cursor: 'pointer'}}
                        aria-hidden='true'
                        onClick={() =>
                          this.setState({selectedOptions: this.state.selectedOptions.filter(opt => opt.label !== label)})
                        } />
                      {label}
                    </div>
                  )}
                </div>
                <Select
                  instanceId='necessary'
                  multi
                  placeholder={<span style={{color: '#444', textAlign: 'left'}}>
                    <i className='fa fa-search' aria-hidden='true' /> Search for APIs
                  </span>}
                  value={[]}
                  options={options}
                  onChange={(option) =>
                    this.setState({
                      selectedOptions: [...this.state.selectedOptions, ...option]
                    })
                  }
                />
                {
                  this.state.selectedOptions.length > 0
                    ? <div className='button'
                      style={{marginTop: '1em'}}
                      onClick={() => this.setState({generateLink: true})}>Get Dashboard link</div>
                      : null
                }
              </div>
              <div className={`animation-fade ${this.state.generateLink ? '' : 'hidden'}`}>
                <h6 style={{marginTop: '2em'}}>Your custom link: <input className='link-copy' style={{width: 'auto', color: ''}} size={link.length} value={link} /></h6>
                <a className={'button'} href={link}>Go to Dashboard</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  }
}
