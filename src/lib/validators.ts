export const validatePasswordChange = (current: string, newPass: string, confirm: string) => {
  if (!current || !newPass || !confirm) {
    return { isValid: false, message: "All password fields are required to update your security settings." };
  }
  
  if (newPass.length < 6) {
    return { isValid: false, message: "New password must be at least 6 characters long." };
  }
  
  if (newPass !== confirm) {
    return { isValid: false, message: "New password and confirmation do not match!" };
  }
  
  if (current === newPass) {
    return { isValid: false, message: "New password cannot be the same as your current password." };
  }
  
  return { isValid: true, message: "" };
};
