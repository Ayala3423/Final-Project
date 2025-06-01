const parkingBL = require('../bl/parkingBL');

const parkingController = {

    async getParkingById(req, res) {
        try {
            const parking = await parkingBL.getParkingById(req.params.id);
            if (parking) {
                res.status(200).json(parking);
            } else {
                res.status(404).json({ error: 'Parking not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async updateParking(req, res) {
        try {
            const parking = await parkingBL.updateParking(req.params.id, req.body);
            if (parking) {
                res.status(200).json(parking);
            } else {
                res.status(404).json({ error: 'Parking not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },


    async searchParkings(req, res) {
        try {
            const result = await parkingBL.searchParkings(req.query);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error searching parkings' });
        }
    },
    async deleteParking(req, res) {
        try {
            const result = await parkingBL.deleteParking(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Parking not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getParkingsByParams(req, res) {
        try {
            console.log('Fetching parkings with params:', req.params);
            const parkings = await parkingBL.getParkingsByParams(req.params);
            if (parkings) {
                res.status(200).json(parkings);
            } else {
                res.status(404).json({ error: 'Parkings not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async createParking(req, res) {
        try {
            console.log('Creating parking with data:', req.body);

            const parking = await parkingBL.createParking(req.body);
            console.log('Creating parking with data:', req.body);

            if (parking) {
                res.status(200).json(parking);
            } else {
                res.status(404).json({ error: 'parking creating error' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

};

module.exports = parkingController;