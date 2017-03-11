import React from 'react'
import { API_LIST } from '../apis/base'
import Page from '../container/page'
import lzbase from 'lzbase62'
import _ from 'lodash'
import Select from 'react-select'

const Container = (props) => {
  return (
    <Page>
      <div className='main'>
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
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default class AboutPage extends React.Component {
  constructor (props) {
    super(props)
    this.generateLink = this.generateLink.bind(this)
    this.state = {
      isDisplayingLink: false,
      selectedOptions: []
    }
  }

  generateLink () {
    const apis = this.state.selectedOptions
      .map(({value}) => value.shortcode)
      .join(';')
    const hash = lzbase.compress(apis)
    return `/c/${hash}`
  }

  render () {
    const isDisplayingLink = this.state.isDisplayingLink
    const link = isDisplayingLink ? this.generateLink() : ''
    const apisChosen = this.state.selectedOptions.length > 0
    const options = API_LIST
      .filter(api => !_.find(this.state.selectedOptions, {label: api.name}))
      .map(api => ({label: api.name, value: api}))

    const BoxSearch = (
      <div className={['animation-fade', isDisplayingLink && 'hidden'].join(' ')}>
        <div className='selected-apis'>
          {this.state.selectedOptions.map(({label}) =>
            <div key={label} className='api-selected'>
              <i className='fa fa-times'
                style={{cursor: 'pointer'}}
                aria-hidden='true'
                onClick={() =>
                  this.setState({
                    selectedOptions: this.state.selectedOptions.filter(opt =>
                      opt.label !== label
                    )
                  })
                } />
              {label}
            </div>
          )}
        </div>
        <Select
          instanceId='necessary'
          multi
          placeholder={
            <span style={{color: '#444', textAlign: 'left'}}>
              <i className='fa fa-search' aria-hidden='true' />
              &nbsp;
              Search for APIs
            </span>
          }
          value={[]}
          options={options}
          onChange={(option) =>
            this.setState({
              selectedOptions: [...this.state.selectedOptions, ...option]
            })
          }
        />
        {
          apisChosen
            ? (
              <div
                className='button'
                style={{marginTop: '1em'}}
                onClick={() => this.setState({isDisplayingLink: true})}
              >
                Generate Dashboard
              </div>
            )
            : null
        }
      </div>
    )

    const BoxLink = (
      <div className={['animation-fade', (! isDisplayingLink) && 'hidden'].join(' ')}>
        <h6 style={{marginTop: '2em'}}>
          Your custom link:
          &nbsp;
          <input
            className='link-copy'
            style={{
              width: 'auto',
              color: ''
            }}
            size={link.length}
            value={link} />
        </h6>
        <a className={'button'} href={link}>
          Go to Dashboard
        </a>
      </div>
    )

    return (
      <Container>
        <h1>Monitor the APIs you rely on.</h1>
        <h4>Modern apps rely on 3rd party APIs.</h4>
        <p className='description'>
          When these come down, your app does too. With Aperture,
          build a custom dashboard to monitor every API you care about,
          and get notified when anything goes wrong. Your customers
          will thank you.
        </p>
        {BoxSearch}
        {BoxLink}
      </Container>
    )
  }
}
