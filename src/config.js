let config = {}

if (process.env.NODE_ENV === 'development') {
  // 开发环境
  config.process = 'development'
} else if (process.env.NODE_ENV === 'production') {
  // 线上环境
  config.process = 'production'
}

export default config
