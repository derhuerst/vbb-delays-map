'use strict'

const ms = require('pretty-ms')
const short = require('vbb-short-station-name')
const linesAt = require('vbb-lines-at')
const parseLine = require('vbb-parse-line')
const products = require('vbb-util/products')
const colors = require('vbb-util/lines/colors')



const colorsOfLine = (l) => {
	const parsed = parseLine(l.name)
	if (parsed.metro) return colors.metro
	if (!colors[l.type] || !colors[l.type][l.name])
		return {fg: 'white', bg: products[l.type].color}
	return colors[l.type][l.name]
}



mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlZndkYSIsImEiOiJjaXBxeDhxYm8wMDc0aTZucG94d29zdnRyIn0.oKynfvvLSuyxT3PglBMF4w'
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/dark-v9',
	zoom: 13,
	hash: true,
	center: [13.386, 52.518]
})
map.addControl(new mapboxgl.Navigation())



const el = document.getElementById('map')

const resize = () => {
	const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	el.style.width = w + 'px'
	el.style.height = h + 'px'
	map.resize()
}
resize()
window.addEventListener('resize', resize)



map.on('load', () => {
	map.addSource('stations', {type: 'geojson', data: '/stations.geojson'})
	map.addLayer({
		id: 'points',
		interactive: true,
		type: 'circle',
		source: 'stations',
		paint: {
			'circle-radius': {base: 1.5, stops: [[1, 1], [20, 35]]},
			'circle-color': {
				property: 'mean',
				stops: [[0, '#2ecc71'], [90, '#eebb00'], [210, '#ee2200']]
			}
			// 'circle-color': {
			// 	property: 'weight',
			// 	stops: [[0, '#6e0d00'], [15000, '#fa1d00']]
			// }
		}
	})
})



map.on('click', (e) => {
	const station = map.queryRenderedFeatures(e.point, {layers: ['points']})[0]
	if (!station) return
	const name = short(station.properties.name)
	const mean = 'number' === typeof station.properties.mean
		? ms(station.properties.mean * 1000, {secDecimalDigits: 0}) : '?'

	const lines = (linesAt[station.properties.id + ''] || []).map((l) => {
		const {fg, bg} = colorsOfLine(l)
		return `<span
			class="line ${l.type}"
			style="color: ${fg}; background-color: ${bg}"
		>${l.name}</span>`
	})

	const popup = new mapboxgl.Popup()
		.setLngLat(station.geometry.coordinates)
		.setHTML(`
			<h1>${name}</h1>
			<p>durchschnittlich ${mean} Verspätung</p>
			<p>${lines.join(' ')}</p>
		`)
	popup.addTo(map)
})

map.on('mousemove', (e) => {
	const station = map.queryRenderedFeatures(e.point, {layers: ['points']})[0]
	map.getCanvas().style.cursor = station ? 'pointer' : ''
})
