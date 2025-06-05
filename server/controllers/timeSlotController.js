const timeSlotBl = require('../bl/timeSlotBL');

const timeSlotController = {

    async getTimeSlotById(req, res) {
        try {
            const timeSlot = await timeSlotBl.getTimeSlotById(req.params.id);
            if (!timeSlot) {
                return res.status(404).json({ message: 'Time slot not found' });
            }
            res.status(200).json(timeSlot);
        } catch (error) {
            console.error('Error fetching time slot:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createTimeSlot(req, res) {
        try {
            const newTimeSlot = await timeSlotBl.createTimeSlot(req.body);
            res.status(201).json(newTimeSlot);
        } catch (error) {
            console.error('Error creating time slot:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getAllTimeSlots(req, res) {
        try {
            console.log(req.params+" user detailes ");
            
            const timeSlots = await timeSlotBl.getAllTimeSlots(req.params);
            res.status(200).json(timeSlots);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateTimeSlot(req, res) {

        try {
            const updatedTimeSlot = await timeSlotBl.updateTimeSlot(req.params.id, req.body);
            if (!updatedTimeSlot) {
                return res.status(404).json({ message: 'Time slot not found' });
            }
            res.status(200).json(updatedTimeSlot);
        }
        catch (error) {
            console.error('Error updating time slot:', error);
            res.status(500).json({ message: 'Internal server error' });

        };
    },

    async deleteTimeSlot(req, res) {
        try {
            const result = await timeSlotBl.deleteTimeSlot(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Time slot not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting time slot:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getTimeSlotsByParkingId(req, res) {
        try {
            const parkingId = req.query.parkingId;
            console.log(`Fetching time slots for parking ID: ${parkingId}`);
            
            const timeSlots = await timeSlotBl.getTimeSlotsByParkingId(parkingId);
            if (!timeSlots || timeSlots.length === 0) {
                return res.status(404).json({ message: 'No time slots found for this parking' });
            }
            res.status(200).json(timeSlots);
        } catch (error) {
            console.error('Error fetching time slots by parking ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

module.exports = timeSlotController;    