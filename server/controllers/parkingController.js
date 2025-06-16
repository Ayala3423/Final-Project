const { Json } = require('sequelize/lib/utils');
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

    async getAllParking(req, res) {
        try {
            console.log(req.user.role + " user detailes " + req.user.id + " " + JSON.stringify(req.user));

            const parkings = await parkingBL.getAllParkings(req.user);
            res.status(200).json(parkings);
        } catch (error) {
            console.error('Error fetching parkings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },

    async updateParking(req, res) {
        try {
            console.log('Updating parking with ID:', req.params.id);
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
            console.log('Searching parkings with query:', req.query);
            const result = await parkingBL.searchParkings(req.query);
            console.log('result:', result);

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
            const { limit, offset, ...filters } = req.query;

            console.log('Fetching parkings with filters:', filters, 'limit:', limit, 'offset:', offset);

            const parkings = await parkingBL.getParkingsByParams(filters, {
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            if (parkings) {
                res.status(200).json(parkings);
            } else {
                res.status(404).json({ error: 'No parkings found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },


   async createParking(req, res) {
    try {
        console.log('Creating parking with data:', req.body);

        const { address, description, ownerId } = req.body;

        // שם קובץ התמונה אם יש קובץ
        const imagePath = req.file ? `/uploads/parking/${req.file.filename}` : null;

        const parkingData = {
            address,
            description,
            ownerId,
            imageUrl: imagePath
        };

        const parking = await parkingBL.createParking(parkingData);

        if (parking) {
            res.status(200).json(parking);
        } else {
            res.status(500).json({ error: 'שגיאה ביצירת החניה' });
        }
    } catch (error) {
        console.error('Error creating parking:', error);
        res.status(400).json({ error: error.message });
    }
}

};

module.exports = parkingController;