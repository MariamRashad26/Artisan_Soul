export const sendResponse = (res, { success = true, data = null, message = null, statusCode = 200 }) => {
  const payload = { success };
  if (data !== null) payload.data = data;
  if (message) payload.message = message;
  return res.status(statusCode).json(payload);
};
