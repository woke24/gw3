// 限制只能输入纯数字（身高、体重、腰围用）
export function limitNumber(val, maxLength = 3) {
  // 只保留数字
  val = val.replace(/\D/g, '')

  // 去掉开头的 0：012 → 12
  if (val.length > 1) {
    val = val.replace(/^0+/, '')
  }

  // 限制最大长度
  if (val.length > maxLength) {
    val = val.slice(0, maxLength)
  }

  return val
}

// 失焦时处理：空、0 都清空
export function updateNumber(val) {
  if (!val || val <= 0) {
    return ''
  }
  return val
}