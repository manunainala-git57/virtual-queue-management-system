const bcrypt = require("bcryptjs");

console.log("Manu hash:", bcrypt.hashSync("manu@123", 10));
console.log("Emp hash:", bcrypt.hashSync("Emp@123", 10));