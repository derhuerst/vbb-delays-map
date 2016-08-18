'use strict'

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
		type: 'circle',
		source: 'stations',
		paint: {
			'circle-radius': {base: 1.5, stops: [[1, 1.5], [20, 30]]},
			'circle-color': {
				property: 'mean',
				stops: [[0, '#eebb00'], [180, '#ee2200']]
			}
			// 'circle-color': {
			// 	property: 'weight',
			// 	stops: [[0, '#6e0d00'], [15000, '#fa1d00']]
			// }
		}
	})
})
