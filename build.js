'use strict'

const stations = require('vbb-stations')
const fs = require('fs')
const path = require('path')

let data = {
	type: 'FeatureCollection',
	features: stations('all').map((station) => ({
		type: 'Feature',
		properties: {name: station.name, id: station.id, weight: station.weight},
		geometry: {type: 'Point', coordinates: [station.longitude,station.latitude]}
	}))
}

fs.writeFileSync(path.join(__dirname, 'stations.geojson'), JSON.stringify(data))
