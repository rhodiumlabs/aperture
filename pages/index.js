import React from 'react'
import { API_LIST } from '../apis/base'
import Page from '../container/page'
import lzbase from 'lzbase62'
import _ from 'lodash'
import Select from 'react-select'
import fuzzysearch from 'fuzzysearch'
import stylesheet from '../styles/index.scss'
import TransitionGroup from 'react-addons-css-transition-group'

const Container = (props) => {
  return (
    <Page>
      <div className='main'>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
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
      selectedOptions: [],
      isSearchingTerm: false,
      searchIsFocused: false
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
    const apisChosen = this.state.selectedOptions.length > 0
    const options = API_LIST
      .map(api => ({
        label: api.name,
        value: api
      }))
    const searchFilter = (options, filterString) => {
      return options.filter(({label}) => filterString && fuzzysearch(filterString.toLowerCase(), label.toLowerCase()))
    }

    const BoxSearch = (
      <div>
        <Select
          multi
          instanceId='isomorphic-select-id'
          openOnFocus={false}
          noResultsText={this.state.isSearchingTerm ? 'Sorry, we cannot find any supported APIs.' : null}
          placeholder={
            <span style={{textAlign: 'left'}}>
              <i className='fa fa-search' aria-hidden='true' />
              &nbsp;
              Search for APIs to monitor
            </span>
          }
          optionRenderer={({label}) => (
            <span>
              {_.find(this.state.selectedOptions, {label: label})
              ? <i className='fa fa-check-square' aria-hidden='true' />
              : <i className='fa fa-square' aria-hidden='true' /> }
              &nbsp;
              {label}
            </span>
          )}
          onFocus={() => this.setState({searchIsFocused: true})}
          onBlur={() => this.setState({isSearchingTerm: false, searchIsFocused: false})}
          filterOptions={searchFilter}
          options={options}
          onInputChange={(value) => this.setState({isSearchingTerm: value !== ''})}
          onChange={(option) =>
            this.setState({
              selectedOptions: [...this.state.selectedOptions, ...option],
              isSearchingTerm: false
            })
          }
        />
        <div className='selected-apis' style={{opacity: this.state.searchIsFocused ? '0.3' : '1.0'}}>
          <TransitionGroup
            transitionName={'api-selected'}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
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
          </TransitionGroup>
        </div>
        {
          apisChosen
            ? (
              <a className={'button'} href={this.generateLink()}>
                Go to Dashboard
              </a>
            )
            : null
        }
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
      </Container>
    )
  }
}
