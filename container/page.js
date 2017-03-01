import React from 'react'
import Head from 'next/head'

export default class extends React.Component {
  render () {
    return <div>
      <Head>
        <title>Aperture</title>
        <meta charSet="utf-8"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300|Raleway:100" rel="stylesheet" />
      </Head>
      <main className={"wrapper "+this.props.className} style={{background:'#0F1C23', color: 'white', fontFamily: 'Open Sans'}}>
        {this.props.children}
      </main>
    </div>
  }
}