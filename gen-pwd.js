const bcrypt = require('bcryptjs');

// 生成123456的加密密码
async function generatePassword() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('654321', salt);
  console.log('654321的加密密码：', hash);
}

generatePassword();