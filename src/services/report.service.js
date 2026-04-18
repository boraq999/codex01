const reportModel = require("../models/report.model");

const resolvePeriod = ({ from, to }) => {
  const today = new Date();
  const defaultTo = today.toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);

  return {
    from: from || firstDayOfMonth,
    to: to || defaultTo,
  };
};

const getDashboard = () => reportModel.getDashboardSummary();

const getSales = (filters) => {
  const period = resolvePeriod(filters || {});
  return reportModel.getSalesReport(period);
};

const getPurchases = (filters) => {
  const period = resolvePeriod(filters || {});
  return reportModel.getPurchasesReport(period);
};

module.exports = {
  getDashboard,
  getSales,
  getPurchases,
};

