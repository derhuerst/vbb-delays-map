'use strict'

const stations = require('vbb-stations')

let data = {
	type: 'FeatureCollection',
	features: stations('all').map((station) => ({
		type: 'Feature',
		properties: {name: station.name, id: station.id, weight: station.weight},
		geometry: {type: 'Point', coordinates: [station.longitude,station.latitude]}
	}))
}

process.stdout.write(JSON.stringify(data) + '\n')
