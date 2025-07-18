const reservationBL = require('../bl/reservationBL');

const reservationController = {

    async getReservationById(req, res) {
        try {
            const reservation = await reservationBL.getReservationById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }
            res.status(200).json(reservation);
        } catch (error) {
            console.error('Error fetching reservation:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ,
    async updateReservation(req, res) {
        try {
            const updatedReservation = await reservationBL.updateReservation(req.params.id, req.body);
            if (!updatedReservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }
            res.status(200).json(updatedReservation);
        } catch (error) {
            console.error('Error updating reservation:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteReservation(req, res) {
        try {
            const result = await reservationBL.deleteReservation(Number(req.params.id));
            if (!result) {
                return res.status(404).json({ message: 'Reservation not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting reservation:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createReservation(req, res) {
        try {
            const newReservation = await reservationBL.createReservation(req.body);
            res.status(201).json(newReservation);
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getAllReservations(req, res) {
        try {
            const reservations = await reservationBL.getAllReservations();
            res.status(200).json(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getReservationsByValue(req, res) {
        try {
            const filter = req.query;
            const reservations = await reservationBL.getReservationsByValue(filter);
            res.status(200).json(reservations);
        } catch (error) {
            console.error('Error fetching reservations by value:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async renewReservation(req, res) {
        const { id } = req.params;
        try {
            const newReservation = await reservationBL.renewReservation(id);
            res.status(200).json({ message: 'Reservation renewed successfully', reservation: newReservation });
        } catch (err) {
            console.error('Failed to renew reservation:', err);
            res.status(500).json({ error: 'Renewal failed' });
        }
    }

};

module.exports = reservationController;  