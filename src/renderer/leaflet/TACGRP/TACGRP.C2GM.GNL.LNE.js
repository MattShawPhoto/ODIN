import L from 'leaflet'
import '../features/Polyline'
import { line } from '../features/geo-helper'
import { styles, strokeDashArray } from '../features/styles'

const fontSize = 14

/**
 * First and last segment.
 */
const segments = points => {
  const n = points.length
  return [
    line([points[0], points[1]]),
    line([points[n - 2], points[n - 1]])
  ]
}

const lineLabels = lines => feature => ({ points }) => {
  const s = segments(points)
  return [
    {
      lines: lines(feature),
      anchor: 'end',
      placement: 'start',
      'font-size': fontSize,
      angle: s[0].angle
    },
    {
      lines: lines(feature),
      anchor: 'start',
      placement: 'end',
      'font-size': fontSize,
      angle: s[1].angle
    }
  ]
}

const labeledLine = lines => (feature, options) => {
  options.labels = lineLabels(lines)
  options.styles = styles
  return new L.TACGRP.Polyline(feature, options)
}

L.Feature['G*G*DLF---'] = labeledLine(() => (['FEBA']))
L.Feature['G*G*GLF---'] = labeledLine(feature => {
  const labels = ['FLOT']
  if (feature.properties.n) labels.unshift(feature.properties.n)
  return labels
})

L.Feature['G*G*GLC---'] = labeledLine(feature => feature.properties.n ? ['ENY'] : [])
L.Feature['G*G*GLP---'] = labeledLine(feature => ([`PL ${feature.properties.t || ''}`]))
L.Feature['G*G*GLL---'] = labeledLine(feature => (['LL', feature.properties.t ? `(PL ${feature.properties.t})` : '']))
L.Feature['G*G*OLF---'] = labeledLine(feature => (['FINAL CL', feature.properties.t ? `(PL ${feature.properties.t})` : '']))
L.Feature['G*G*OLL---'] = labeledLine(feature => (['LOA', feature.properties.t ? `(PL ${feature.properties.t})` : '']))
L.Feature['G*G*OLT---'] = labeledLine(feature => (['LD', feature.properties.t ? `(PL ${feature.properties.t})` : '']))
L.Feature['G*G*OLC---'] = labeledLine(feature => (['LD/LC', feature.properties.t ? `(PL ${feature.properties.t})` : '']))

L.Feature['G*G*OLP---'] = (feature, options) => {
  options.labels = lineLabels(feature => ['PLD', feature.properties.t ? `(PLD ${feature.properties.t})` : ''])
  options.styles = feature => {
    const _styles = styles(feature)
    _styles.contrast.strokeDasharray = strokeDashArray()
    _styles.path.strokeDasharray = strokeDashArray()
    return _styles
  }

  return new L.TACGRP.Polyline(feature, options)
}

L.Feature['G*G*SLR---'] = labeledLine(feature => (['RL', feature.properties.t ? `(PL ${feature.properties.t})` : '']))
L.Feature['G*F*LCN---'] = labeledLine(feature => (['NFL', feature.properties.t ? `(PL ${feature.properties.t})` : '']))
