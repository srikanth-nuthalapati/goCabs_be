exports.validName = /^[A-Za-z][A-Za-z0-9_ ]{4,}$/;
exports.validEmail = /^[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com)$/;
exports.validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;