// 生成验证码图片src
const getCodeSrc = () => {
  const src = faceConfig.basePath + '/captcha/simple/getImg?r=' + Math.random()
  return src
}

export default getCodeSrc
