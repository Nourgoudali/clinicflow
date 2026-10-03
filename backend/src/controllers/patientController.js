const patientService = require('../services/patientService');

const createPatient = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.body, req.user.id);
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const result = await patientService.getPatients(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const updated = await patientService.updatePatient(req.params.id, req.body, req.user.id);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const result = await patientService.deletePatient(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
