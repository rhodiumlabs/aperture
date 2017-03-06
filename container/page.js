import React from 'react'
import Head from 'next/head'

export default class extends React.Component {
  render () {
    return <div>
      <Head>
        <title>Aperture</title>
        <meta charSet='utf-8' />
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css' />
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/milligram/1.3.0/milligram.min.css' />
        <link rel='stylesheet' href='/static/font-awesome.min.css' />
        <link rel='stylesheet' href='/static/react-select.css' />
        <link rel='stylesheet' href='/static/base.css' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:300|Raleway:100' rel='stylesheet' />
      </Head>
      <main
        className={'wrapper ' + this.props.className}
        style={{background: 'whitesmoke', minHeight: '100vh', color: '#333', fontFamily: 'Open Sans'}}>
        {this.props.children}
      </main>
    </div>
  }
}
