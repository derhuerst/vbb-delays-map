'use strict'

const stations = require('vbb-stations')

const delays = require(process.argv[2])

for (let station in delays) {
	let departures = 0, total = 0
	for (let line in delays[station]) {
		for (let delay of delays[station][line]) {
			departures++
			if (delay !== null) total += delay
		}
	}
	delays[station] = total / departures
}

let data = {
	type: 'FeatureCollection',
	features: stations('all').map((station) => ({
		type: 'Feature',
		properties: {
			name: station.name, id: station.id, weight: station.weight,
			mean: delays[station.id]
		},
		geometry: {type: 'Point', coordinates: [station.longitude,station.latitude]}
	}))
}

process.stdout.write(JSON.stringify(data) + '\n')
