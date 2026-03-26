export const validatePasswordChange = (newPass: string, confirm: string) => {
  if (!newPass || !confirm) {
    return { isValid: false, message: "New password and confirmation are required." };
  }
  
  if (newPass.length < 6) {
    return { isValid: false, message: "New password must be at least 6 characters long." };
  }
  
  if (newPass !== confirm) {
    return { isValid: false, message: "New password and confirmation do not match!" };
  }
  
  return { isValid: true, message: "" };
};
