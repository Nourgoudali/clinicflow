const appointmentService = require('../services/appointmentService');

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body, req.user.id);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointments(req.query);
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const updated = await appointmentService.updateAppointmentStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const updated = await appointmentService.updateAppointment(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.deleteAppointment(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
};
